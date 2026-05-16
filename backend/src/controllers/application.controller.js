const { Application, Document, Service, User, ApplicationHistory, Payment } = require('../models');
const { success, error } = require('../utils/response');
const emailService = require('../services/email.service');
const path = require('path');

// UC03 — Danh sách dịch vụ
exports.getServices = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    // Auto-seed if db is empty for previewing
    const existCount = await Service.count();
    if (existCount === 0) {
      await Service.bulkCreate([
        { name: 'Đăng ký khai sinh', category: 'Hộ tịch', currentFee: 15000, processingDays: 3, requiredDocs: ['Giấy chứng sinh', 'CMND/CCCD cha mẹ', 'Giấy đăng ký kết hôn'], isActive: true },
        { name: 'Đăng ký kết hôn', category: 'Hộ tịch', currentFee: 30000, processingDays: 5, requiredDocs: ['Giấy xác nhận tình trạng hôn nhân', 'CMND/CCCD hai bên', 'Sổ hộ khẩu'], isActive: true },
        { name: 'Đăng ký thường trú', category: 'Cư trú', currentFee: 20000, processingDays: 7, requiredDocs: ['Mẫu CT01 - Tờ khai thay đổi thông tin cư trú', 'Giấy tờ chứng minh chỗ ở hợp pháp'], isActive: true },
        { name: 'Cấp chứng minh thư / CCCD', category: 'Cư trú', currentFee: 50000, processingDays: 15, requiredDocs: ['Sổ hộ khẩu', 'Tờ khai cấp CCCD', 'Ảnh thẻ 4x6'], isActive: true }
      ]);
    }

    const where = { isActive: true };
    if (category) where.category = category;

    const { rows, count } = await Service.findAndCountAll({
      where, limit: +limit, offset: (+page - 1) * +limit
    });
    return success(res, { services: rows, total: count, page: +page });
  } catch (err) { return error(res, err.message, 500); }
};

// UC03 — Chi tiết 1 dịch vụ
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.serviceId);
    if (!service) return error(res, 'Dịch vụ không tồn tại', 404);
    return success(res, service);
  } catch (err) { return error(res, err.message, 500); }
};

// UC04 — Tạo hồ sơ mới (lưu tạm DRAFT)
exports.createApplication = async (req, res) => {
  try {
    const { serviceId, formData } = req.body;
    const service = await Service.findByPk(serviceId);
    if (!service) return error(res, 'Dịch vụ không tồn tại', 404);

    const app = await Application.create({
      userId: req.user.id, serviceId, formData, status: 'DRAFT'
    });
    return success(res, { applicationId: app.id, status: app.status }, 'Hồ sơ đã được tạo', 201);
  } catch (err) { return error(res, err.message, 500); }
};

// UC05 — Upload giấy tờ
exports.uploadDocument = async (req, res) => {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);
    if (!['DRAFT', 'NEED_MORE'].includes(app.status))
      return error(res, 'Không thể upload tài liệu ở trạng thái này', 409);
    if (!req.file) return error(res, 'Không có file được gửi lên', 400);

    const { docType } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const doc = await Document.create({
      applicationId: app.id,
      docType,
      fileName:  req.file.originalname,
      fileUrl,
      filePath:  req.file.path,
      mimeType:  req.file.mimetype,
      fileSize:  req.file.size,
      isSupplement: app.status === 'NEED_MORE'
    });

    return success(res, {
      documentId: doc.id, docType: doc.docType,
      fileUrl: doc.fileUrl, aiStatus: doc.aiStatus
    }, 'Upload thành công', 201);
  } catch (err) { return error(res, err.message, 500); }
};

// UC07 — Xác nhận nộp hồ sơ
exports.submitApplication = async (req, res) => {
  try {
    const { copies = 1 } = req.body; // số lượng bộ hồ sơ muốn nhận
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: Document, as: 'documents' },
        { model: Service,  as: 'service' },
        { model: User,     as: 'citizen' }
      ]
    });
    if (!app)           return error(res, 'Hồ sơ không tồn tại', 404);
    if (app.status !== 'DRAFT') return error(res, 'Hồ sơ đã được nộp trước đó', 409);
    if (!app.documents.length)  return error(res, 'Chưa upload giấy tờ nào', 422);

    const processingDays = app.service?.processingDays || 5;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + processingDays);

    // Tính phí và trạng thái thanh toán
    let unitFee = app.service?.currentFee || 0;
    if (unitFee === 0 && app.service?.fee) {
      const match = app.service.fee.replace(/\./g, '').match(/\d+/);
      if (match) {
        unitFee = parseInt(match[0], 10);
      }
    }
    const validCopies = Math.min(Math.max(parseInt(copies) || 1, 1), 5);
    const feeTotal = unitFee * validCopies;
    const hasPayment = unitFee > 0;

    // Sinh mã thanh toán nếu cần đóng phí
    let paymentCode = null;
    let paymentDeadline = null;
    if (hasPayment) {
      const now = new Date();
      const rand = Math.floor(10000 + Math.random() * 90000);
      paymentCode = `PAY${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${rand}`;
      
      // Hạn thanh toán: 3 ngày kể từ lúc nộp
      paymentDeadline = new Date(now);
      paymentDeadline.setDate(paymentDeadline.getDate() + 3);
    }

    await app.update({
      status: 'PENDING',
      submittedAt: new Date(),
      deadline,
      copies: validCopies,
      feeTotal,
      paymentStatus: hasPayment ? 'UNPAID' : 'FREE',
      paymentCode,
      paymentDeadline,
    });
    
    await ApplicationHistory.create({
      applicationId: app.id,
      actorId: req.user.id,
      action: 'Nộp hồ sơ',
      note: 'Công dân nộp hồ sơ trực tuyến'
    });

    if (hasPayment) {
      await Payment.create({
        receiptCode: paymentCode,
        applicationId: app.id,
        userId: req.user.id,
        feeType: app.service?.name || 'Lệ phí hồ sơ',
        amount: feeTotal,
        paymentMethod: 'card',
        status: 'pending',
      });
    }

    try {
      await emailService.sendApplicationConfirm(app.citizen.email, app.applicationCode);
    } catch (emailErr) {
      console.warn('[Email] Không gửi được email xác nhận hồ sơ:', emailErr.message);
    }

    return success(res, {
      applicationId:   app.id,
      applicationCode: app.applicationCode,
      status:          'PENDING',
      // Payment info
      hasPayment,
      paymentCode,
      paymentDeadline,
      unitFee,
      copies: validCopies,
      feeTotal,
      serviceName: app.service?.name,
    });
  } catch (err) { return error(res, err.message, 500); }
};

// UC08 — Danh sách hồ sơ của người dân
exports.getMyApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const { rows, count } = await Application.findAndCountAll({
      where,
      include: [{ model: Service, as: 'service', attributes: ['name', 'category', 'currentFee'] }],
      order: [['createdAt', 'DESC']],
      limit: +limit, offset: (+page - 1) * +limit
    });
    return success(res, { applications: rows, total: count, page: +page });
  } catch (err) { return error(res, err.message, 500); }
};

// UC08 — Chi tiết hồ sơ + timeline
exports.getApplicationDetail = async (req, res) => {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: Service,  as: 'service' },
        { model: Document, as: 'documents' },
        { model: User,     as: 'officer', attributes: ['fullName'] },
        { model: ApplicationHistory, as: 'histories', include: [{ model: User, as: 'actor', attributes: ['fullName', 'role'] }] }
      ],
      order: [
        [{ model: ApplicationHistory, as: 'histories' }, 'createdAt', 'DESC']
      ]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);
    return success(res, app);
  } catch (err) { return error(res, err.message, 500); }
};

// UC09 — Bổ sung giấy tờ
exports.supplementDocument = async (req, res) => {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);
    if (app.status !== 'NEED_MORE')
      return error(res, 'Hồ sơ không ở trạng thái cần bổ sung', 409);
    if (!req.file) return error(res, 'Không có file được gửi lên', 400);

    await Document.create({
      applicationId: app.id,
      docType:     req.body.docType,
      fileName:    req.file.originalname,
      fileUrl:     `/uploads/${req.file.filename}`,
      filePath:    req.file.path,
      mimeType:    req.file.mimetype,
      fileSize:    req.file.size,
      isSupplement: true
    });

    await app.update({ status: 'PROCESSING' });
    
    await ApplicationHistory.create({
      applicationId: app.id,
      actorId: req.user.id,
      action: 'Bổ sung hồ sơ',
      note: `Bổ sung tài liệu: ${req.body.docType}`
    });

    return success(res, { status: 'PROCESSING', message: 'Đã bổ sung, cán bộ được thông báo' });
  } catch (err) { return error(res, err.message, 500); }
};

// UC10 — Rút hồ sơ
exports.cancelApplication = async (req, res) => {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);
    if (!['PENDING', 'NEED_MORE'].includes(app.status))
      return error(res, 'Không thể rút hồ sơ ở trạng thái này', 409);

    await app.update({ status: 'CANCELLED', cancelReason: req.body.reason });
    
    await ApplicationHistory.create({
      applicationId: app.id,
      actorId: req.user.id,
      action: 'Rút hồ sơ',
      note: req.body.reason
    });

    return success(res, { status: 'CANCELLED' });
  } catch (err) { return error(res, err.message, 500); }
};

// UC: Đánh giá hồ sơ hoàn thành
exports.rateApplication = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    if (!rating || rating < 1 || rating > 5) return error(res, 'Vui lòng đánh giá từ 1 đến 5 sao', 400);

    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);
    if (app.status !== 'COMPLETED') return error(res, 'Chỉ có thể đánh giá hồ sơ đã hoàn thành', 409);

    await app.update({ rating, ratingContent: feedback });
    return success(res, { message: 'Cảm ơn bạn đã đánh giá dịch vụ!' });
  } catch (err) { return error(res, err.message, 500); }
};

// UC: Tra cứu công khai hồ sơ
exports.searchByCode = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return error(res, 'Vui lòng cung cấp mã hồ sơ', 400);

    const { Op } = require('sequelize');
    const app = await Application.findOne({
      where: {
        [Op.or]: [
          { applicationCode: code },
          { paymentCode: code }
        ]
      },
      include: [
        { model: Service, as: 'service', attributes: ['name'] },
        { model: User, as: 'officer', attributes: ['fullName'] }
      ]
    });

    if (!app) return error(res, 'Không tìm thấy hồ sơ', 404);

    return success(res, app);
  } catch (err) { return error(res, err.message, 500); }
};