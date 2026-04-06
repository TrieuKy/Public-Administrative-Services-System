const { Application, Document, Service, User, Comment } = require('../models');
const { success, error } = require('../utils/response');
const emailService = require('../services/email.service');
const { Op } = require('sequelize');

// UC11 — Danh sách hồ sơ
exports.listApplications = async (req, res) => {
  try {
    const { status, serviceId, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    const where = {};
    if (status)    where.status = status;
    if (serviceId) where.serviceId = serviceId;
    if (dateFrom || dateTo) {
      where.submittedAt = {};
      if (dateFrom) where.submittedAt[Op.gte] = new Date(dateFrom);
      if (dateTo)   where.submittedAt[Op.lte] = new Date(dateTo);
    }

    const { rows, count } = await Application.findAndCountAll({
      where,
      include: [
        { model: User,    as: 'citizen',  attributes: ['fullName', 'email', 'cccd'] },
        { model: Service, as: 'service',  attributes: ['name', 'category'] }
      ],
      order: [['submittedAt', 'ASC']],
      limit: +limit, offset: (+page - 1) * +limit
    });
    return success(res, { applications: rows, total: count, page: +page });
  } catch (err) { return error(res, err.message, 500); }
};

// UC12 + UC13 — Chi tiết hồ sơ kèm AI result
exports.getApplicationDetail = async (req, res) => {
  try {
    const app = await Application.findByPk(req.params.id, {
      include: [
        { model: User,     as: 'citizen',   attributes: ['fullName', 'email', 'cccd', 'createdAt'] },
        { model: Service,  as: 'service' },
        { model: Document, as: 'documents' },
        { model: Comment,  as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['fullName', 'role'] }] }
      ]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);
    return success(res, app);
  } catch (err) { return error(res, err.message, 500); }
};

// UC14 — Duyệt hồ sơ
exports.approveApplication = async (req, res) => {
  try {
    const app = await Application.findByPk(req.params.id, {
      include: [{ model: User, as: 'citizen' }]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);
    if (!['PENDING', 'PROCESSING'].includes(app.status))
      return error(res, 'Hồ sơ không thể duyệt ở trạng thái này', 409);

    await app.update({
      status: 'COMPLETED', officerId: req.user.id,
      officerNote: req.body.note, completedAt: new Date()
    });
    await emailService.sendStatusUpdate(app.citizen.email, app.applicationCode, 'COMPLETED', req.body.note);

    return success(res, { status: 'COMPLETED', message: 'Email đã gửi đến người dân' });
  } catch (err) { return error(res, err.message, 500); }
};

// UC15 — Từ chối hồ sơ
exports.rejectApplication = async (req, res) => {
  try {
    const { reason, legalBasis } = req.body;
    if (!reason) return error(res, 'Lý do từ chối là bắt buộc', 400);

    const app = await Application.findByPk(req.params.id, {
      include: [{ model: User, as: 'citizen' }]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const fullReason = legalBasis ? `${reason} (Căn cứ: ${legalBasis})` : reason;
    await app.update({ status: 'REJECTED', officerId: req.user.id, rejectReason: fullReason });
    await emailService.sendStatusUpdate(app.citizen.email, app.applicationCode, 'REJECTED', fullReason);

    return success(res, { status: 'REJECTED' });
  } catch (err) { return error(res, err.message, 500); }
};

// UC16 — Yêu cầu bổ sung giấy tờ
exports.requestSupplement = async (req, res) => {
  try {
    const { requiredDocs, note } = req.body;
    const app = await Application.findByPk(req.params.id, {
      include: [{ model: User, as: 'citizen' }]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    await app.update({ status: 'NEED_MORE', officerId: req.user.id });
    await emailService.sendStatusUpdate(
      app.citizen.email, app.applicationCode, 'NEED_MORE',
      `Cần bổ sung: ${requiredDocs?.join(', ')}. ${note || ''}`
    );

    return success(res, { status: 'NEED_MORE' });
  } catch (err) { return error(res, err.message, 500); }
};

// UC17 — Ghi chú xử lý
exports.addNote = async (req, res) => {
  try {
    const { content, type = 'internal' } = req.body;
    if (!content) return error(res, 'Nội dung ghi chú là bắt buộc', 400);

    const app = await Application.findByPk(req.params.id);
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const comment = await Comment.create({
      applicationId: app.id, authorId: req.user.id, content, type
    });
    return success(res, { noteId: comment.id, createdAt: comment.createdAt }, '', 201);
  } catch (err) { return error(res, err.message, 500); }
};