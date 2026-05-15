const { Payment, Application, User, Service } = require('../models');
const { Op } = require('sequelize');
const { success, error } = require('../utils/response');

// ── Sinh mã biên lai duy nhất ─────────────────────────────────
function generateReceiptCode() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `BL${y}${m}${d}-${rand}`;
}

/**
 * POST /api/v1/payments
 * Tạo giao dịch thanh toán mới
 * Body: { feeType, amount, paymentMethod, applicationCode? }
 */
exports.createPayment = async (req, res) => {
  try {
    const { feeType, amount, paymentMethod = 'card', applicationCode } = req.body;

    if (!feeType) return error(res, 'Loại phí là bắt buộc', 400);
    if (amount === undefined || amount === null) return error(res, 'Số tiền là bắt buộc', 400);

    // Tìm applicationId nếu có applicationCode
    let applicationId = null;
    if (applicationCode) {
      const codeUpper = applicationCode.toUpperCase();
      // Code có thể là applicationCode hoặc receiptCode (paymentCode)
      const app = await Application.findOne({
        where: {
          [Op.or]: [
            { applicationCode: codeUpper },
            { paymentCode: codeUpper }
          ]
        }
      });
      if (!app) return error(res, `Không tìm thấy hồ sơ với mã: ${applicationCode}`, 404);
      applicationId = app.id;
      
      // Nếu đã có giao dịch pending cho hồ sơ này thì trả về luôn
      const existingPayment = await Payment.findOne({
        where: { applicationId, status: 'pending' }
      });
      if (existingPayment) {
        return success(res, { paymentId: existingPayment.id, receiptCode: existingPayment.receiptCode, amount: existingPayment.amount }, 'Tìm thấy giao dịch chờ thanh toán', 200);
      }
    }

    // Sinh mã biên lai không trùng
    let receiptCode;
    let isDuplicate = true;
    let attempts = 0;
    while (isDuplicate && attempts < 10) {
      receiptCode = generateReceiptCode();
      const existing = await Payment.findOne({ where: { receiptCode } });
      isDuplicate = !!existing;
      attempts++;
    }

    const payment = await Payment.create({
      receiptCode,
      applicationId,
      userId: req.user.id,
      feeType,
      amount: parseInt(amount, 10),
      paymentMethod,
      status: 'pending',
    });

    return success(res, { paymentId: payment.id, receiptCode: payment.receiptCode, amount: payment.amount }, 'Khởi tạo giao dịch thành công', 201);
  } catch (err) {
    console.error('[createPayment]', err.message);
    return error(res, err.message, 500);
  }
};

/**
 * POST /api/v1/payments/:id/confirm
 * Xác nhận thanh toán thành công (giả lập cổng thanh toán callback)
 * Trong thực tế: đây là webhook từ VNPay/MoMo gọi vào
 */
exports.confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!payment) return error(res, 'Giao dịch không tồn tại', 404);
    if (payment.status === 'success') return error(res, 'Giao dịch đã được xác nhận trước đó', 409);

    await payment.update({
      status: 'success',
      paidAt: new Date(),
    });

    // Cập nhật paymentStatus của hồ sơ liên kết
    if (payment.applicationId) {
      await Application.update(
        { paymentStatus: 'PAID' },
        { where: { id: payment.applicationId } }
      );
    }

    // Lấy thông tin đầy đủ để trả về biên lai
    const fullPayment = await Payment.findByPk(payment.id, {
      include: [
        { model: User, as: 'payer', attributes: ['fullName', 'cccd'] },
        {
          model: Application,
          as: 'application',
          attributes: ['applicationCode'],
          include: [{ model: Service, as: 'service', attributes: ['name'] }],
        },
      ],
    });

    return success(res, {
      receiptCode: fullPayment.receiptCode,
      feeType: fullPayment.feeType,
      amount: fullPayment.amount,
      paymentMethod: fullPayment.paymentMethod,
      paidAt: fullPayment.paidAt,
      status: fullPayment.status,
      payer: fullPayment.payer?.fullName,
      payerCccd: fullPayment.payer?.cccd,
      applicationCode: fullPayment.application?.applicationCode,
      unit: 'UBND Xã/Phường',
    }, 'Thanh toán thành công');
  } catch (err) {
    console.error('[confirmPayment]', err.message);
    return error(res, err.message, 500);
  }
};

/**
 * GET /api/v1/payments/my
 * Lấy lịch sử thanh toán của người dùng hiện tại
 */
exports.getMyPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { rows, count } = await Payment.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: +limit,
      offset: (+page - 1) * +limit,
      include: [
        {
          model: Application,
          as: 'application',
          attributes: ['applicationCode'],
          required: false,
        },
      ],
    });

    return success(res, {
      payments: rows,
      total: count,
      page: +page,
      totalPages: Math.ceil(count / +limit),
    });
  } catch (err) {
    console.error('[getMyPayments]', err.message);
    return error(res, err.message, 500);
  }
};

/**
 * GET /api/v1/payments/:id
 * Lấy chi tiết một giao dịch (chủ sở hữu hoặc officer/admin)
 */
exports.getPaymentById = async (req, res) => {
  try {
    const where = { id: req.params.id };
    // Công dân chỉ xem giao dịch của mình
    if (req.user.role === 'citizen') where.userId = req.user.id;

    const payment = await Payment.findOne({
      where,
      include: [
        { model: User, as: 'payer', attributes: ['fullName', 'cccd', 'email'] },
        {
          model: Application,
          as: 'application',
          attributes: ['applicationCode'],
          required: false,
        },
      ],
    });
    if (!payment) return error(res, 'Giao dịch không tồn tại hoặc bạn không có quyền xem', 404);

    return success(res, payment);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

/**
 * GET /api/v1/payments/officer/all
 * [Officer/Admin] Lấy toàn bộ lịch sử thanh toán
 */
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 15, status, userId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const { rows, count } = await Payment.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: +limit,
      offset: (+page - 1) * +limit,
      include: [
        { model: User, as: 'payer', attributes: ['fullName', 'cccd', 'email', 'phone'] },
        {
          model: Application,
          as: 'application',
          attributes: ['applicationCode', 'paymentStatus'],
          include: [{ model: Service, as: 'service', attributes: ['name'] }],
          required: false,
        },
      ],
    });

    return success(res, {
      payments: rows,
      total: count,
      page: +page,
      totalPages: Math.ceil(count / +limit),
    });
  } catch (err) {
    console.error('[getAllPayments]', err.message);
    return error(res, err.message, 500);
  }
};

/**
 * GET /api/v1/payments/officer/unpaid-applications
 * [Officer/Admin] Lấy danh sách hồ sơ có phí nhưng chưa thanh toán
 */
exports.getUnpaidApplications = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const { rows, count } = await Application.findAndCountAll({
      where: {
        paymentStatus: 'UNPAID',
        status: { [Op.notIn]: ['DRAFT', 'CANCELLED'] },
      },
      order: [['submittedAt', 'ASC']],
      limit: +limit,
      offset: (+page - 1) * +limit,
      include: [
        { model: User,    as: 'citizen', attributes: ['fullName', 'cccd', 'email', 'phone'] },
        { model: Service, as: 'service', attributes: ['name', 'currentFee'] },
      ],
    });

    return success(res, {
      applications: rows,
      total: count,
      page: +page,
      totalPages: Math.ceil(count / +limit),
    });
  } catch (err) {
    console.error('[getUnpaidApplications]', err.message);
    return error(res, err.message, 500);
  }
};

/**
 * GET /api/v1/payments/officer/notifications
 * [Officer/Admin] Thông báo: hồ sơ mới nộp + hồ sơ gần hạn duyệt + hồ sơ chưa thanh toán
 */
exports.getOfficerNotifications = async (req, res) => {
  try {
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Hồ sơ mới nộp trong 24h qua
    const newApps = await Application.findAll({
      where: {
        status: 'PENDING',
        submittedAt: { [Op.gte]: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
      include: [
        { model: User,    as: 'citizen', attributes: ['fullName'] },
        { model: Service, as: 'service', attributes: ['name'] },
      ],
      order: [['submittedAt', 'DESC']],
      limit: 10,
    });

    // Hồ sơ gần đến hạn duyệt (trong 3 ngày tới, chưa hoàn thành)
    const nearDeadline = await Application.findAll({
      where: {
        deadline: { [Op.between]: [now, in3Days] },
        status: { [Op.in]: ['PENDING', 'PROCESSING'] },
      },
      include: [
        { model: User,    as: 'citizen', attributes: ['fullName'] },
        { model: Service, as: 'service', attributes: ['name'] },
      ],
      order: [['deadline', 'ASC']],
      limit: 10,
    });

    // Hồ sơ chưa thanh toán
    const unpaid = await Application.findAll({
      where: { paymentStatus: 'UNPAID', status: { [Op.notIn]: ['DRAFT', 'CANCELLED', 'REJECTED'] } },
      include: [
        { model: User,    as: 'citizen', attributes: ['fullName'] },
        { model: Service, as: 'service', attributes: ['name'] },
      ],
      order: [['submittedAt', 'DESC']],
      limit: 10,
    });

    const notifications = [
      ...newApps.map(app => ({
        id: `new-${app.id}`,
        type: 'new_submission',
        title: 'Hồ sơ mới được nộp',
        message: `${app.citizen?.fullName} vừa nộp hồ sơ ${app.applicationCode} — ${app.service?.name}`,
        applicationCode: app.applicationCode,
        applicationId: app.id,
        time: app.submittedAt,
        isRead: false,
      })),
      ...nearDeadline.map(app => ({
        id: `deadline-${app.id}`,
        type: 'near_deadline',
        title: 'Hồ sơ sắp đến hạn duyệt',
        message: `Hồ sơ ${app.applicationCode} (${app.service?.name}) của ${app.citizen?.fullName} sắp hết hạn xử lý.`,
        applicationCode: app.applicationCode,
        applicationId: app.id,
        time: app.deadline,
        isRead: false,
      })),
      ...unpaid.map(app => ({
        id: `unpaid-${app.id}`,
        type: 'unpaid',
        title: 'Hồ sơ chưa đóng lệ phí',
        message: `Hồ sơ ${app.applicationCode} (${app.service?.name}) của ${app.citizen?.fullName} chưa thanh toán lệ phí.`,
        applicationCode: app.applicationCode,
        applicationId: app.id,
        time: app.submittedAt,
        isRead: false,
      })),
    ];

    return success(res, { notifications, total: notifications.length });
  } catch (err) {
    console.error('[getOfficerNotifications]', err.message);
    return error(res, err.message, 500);
  }
};
