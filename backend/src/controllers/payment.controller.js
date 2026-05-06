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
      const app = await Application.findOne({ where: { applicationCode: applicationCode.toUpperCase() } });
      if (!app) return error(res, `Không tìm thấy hồ sơ với mã: ${applicationCode}`, 404);
      applicationId = app.id;
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

    return success(res, { paymentId: payment.id, receiptCode: payment.receiptCode }, 'Khởi tạo giao dịch thành công', 201);
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
