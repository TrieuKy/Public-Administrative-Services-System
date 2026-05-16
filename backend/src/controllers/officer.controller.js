const { Application, Document, Service, User, Comment, ApplicationHistory } = require('../models');
const { success, error } = require('../utils/response');
const emailService = require('../services/email.service');
const { Op } = require('sequelize');

// UC11 — Danh sách hồ sơ
exports.listApplications = async (req, res) => {
  try {
    const { status, serviceId, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    const where = { status: { [Op.ne]: 'DRAFT' } };
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
        { model: Service, as: 'service',  attributes: ['name', 'category', 'currentFee'] }
      ],
      order: [['createdAt', 'DESC']],
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

    // Lấy thêm lịch sử luân chuyển
    const histories = await ApplicationHistory.findAll({
      where: { applicationId: app.id },
      include: [{ model: User, as: 'actor', attributes: ['fullName', 'position', 'role'] }],
      order: [['createdAt', 'DESC']]
    });

    const result = app.toJSON();
    result.histories = histories;

    return success(res, result);
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

    await ApplicationHistory.create({
      applicationId: app.id,
      actorId: req.user.id,
      action: 'Duyệt hồ sơ',
      note: req.body.note || 'Hồ sơ đủ điều kiện và được duyệt'
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
    
    await ApplicationHistory.create({
      applicationId: app.id,
      actorId: req.user.id,
      action: 'Từ chối hồ sơ',
      note: fullReason
    });

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
    
    const supplementNote = `Cần bổ sung: ${requiredDocs?.join(', ')}. ${note || ''}`;

    await ApplicationHistory.create({
      applicationId: app.id,
      actorId: req.user.id,
      action: 'Yêu cầu bổ sung',
      note: supplementNote
    });

    await emailService.sendStatusUpdate(
      app.citizen.email, app.applicationCode, 'NEED_MORE',
      supplementNote
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

// UC18 — Lấy danh sách đánh giá
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { rows, count } = await Application.findAndCountAll({
      where: { rating: { [Op.not]: null } },
      include: [
        { model: User, as: 'citizen', attributes: ['fullName', 'email'] },
        { model: Service, as: 'service', attributes: ['name'] }
      ],
      order: [['completedAt', 'DESC']],
      limit: +limit, offset: (+page - 1) * +limit
    });
    
    // Tính toán thông kê tổng quát
    const allRated = await Application.findAll({
      where: { rating: { [Op.not]: null } },
      attributes: ['rating']
    });
    const totalReviews = allRated.length;
    const averageRating = totalReviews > 0 ? (allRated.reduce((s, a) => s + a.rating, 0) / totalReviews).toFixed(1) : 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allRated.forEach(a => ratingCounts[a.rating]++);

    return success(res, { 
      reviews: rows, 
      total: count, 
      page: +page,
      stats: { totalReviews, averageRating, ratingCounts }
    });
  } catch (err) { return error(res, err.message, 500); }
};

// UC: In hồ sơ sang PDF
exports.printApplication = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const pdf = require('html-pdf');
    
    const app = await Application.findByPk(req.params.id, {
      include: [{ model: User, as: 'citizen' }]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const formData = app.formData || {};
    const d = new Date();
    
    const applicationCode = app.applicationCode || '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const officerName = app.officer?.fullName || '............................';
    const fullName = formData.fullName || formData.HOTEN || app.citizen?.fullName || '';
    const dob = formData.dob || formData.NGAYSINH || '';
    const idNumber = formData.idNumber || formData.CCCD || app.citizen?.cccd || '';
    const address = formData.address || formData.NOITHUONGTRU || '';
    const issueDate = formData.issueDate || formData.NGAYCAP || '';
    const issuePlace = formData.issuePlace || formData.NOICAP || 'Cục CSQLHC về TTXH';
    const gender = formData.gender || formData.GIOITINH || '';
    const nationality = formData.nationality || formData.QUOCTICH || 'Việt Nam';
    const ethnicity = formData.ethnicity || formData.DANTOC || 'Kinh';

    const htmlContent = `
    <html>
    <head>
    <meta charset='utf-8'>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; margin: 40px; }
      .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .header-table td { text-align: center; vertical-align: top; border: none; padding: 0; }
      .bold { font-weight: bold; }
      .title { text-align: center; font-weight: bold; font-size: 16pt; margin-top: 10px; }
      .subtitle { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 20px; text-transform: uppercase; }
      .section-title { text-align: center; font-weight: bold; font-size: 14pt; margin: 15px 0; }
      .content { text-align: justify; margin-bottom: 10px; }
      .footer-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
      .footer-table td { text-align: center; vertical-align: top; border: none; }
    </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width: 40%;">
            THÀNH PHỐ ĐÀ NẴNG<br>
            <span class="bold">QUẬN HẢI CHÂU</span><br>
            <span class="bold" style="text-decoration: underline;">UBND PHƯỜNG BÌNH HIÊN</span><br><br>
            Số: ${applicationCode}/UBND-XNTTHN
          </td>
          <td style="width: 60%;">
            <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
            <span class="bold" style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span><br><br>
            <i style="font-size: 13pt;">Bình Hiên, ngày ${day} tháng ${month} năm ${year}</i>
          </td>
        </tr>
      </table>

      <div class="title">GIẤY XÁC NHẬN TÌNH TRẠNG HÔN NHÂN</div>
      <div class="subtitle">UBND PHƯỜNG BÌNH HIÊN, QUẬN HẢI CHÂU, THÀNH PHỐ ĐÀ NẴNG</div>

      <div class="content">
        Xét đề nghị của ông/bà: <b>${officerName}</b>, Công chức tư pháp hộ tịch<br>
        về việc cấp Giấy xác nhận tình trạng hôn nhân cho <b>${fullName}</b>
      </div>

      <div class="section-title">XÁC NHẬN:</div>

      <div class="content">
        Họ, chữ đệm, tên: <span class="bold">${fullName}</span><br>
        Ngày, tháng, năm sinh: ${dob}<br>
        <table style="width:100%; border:none; margin: 0; padding: 0;">
          <tr>
            <td style="width:33%; padding: 0;">Giới tính: ${gender}</td>
            <td style="width:33%; padding: 0;">Dân tộc: ${ethnicity}</td>
            <td style="padding: 0; text-align:right;">Quốc tịch: ${nationality}</td>
          </tr>
        </table>
        Giấy tờ tùy thân: CMND: ${idNumber} do ${issuePlace} cấp ngày ${issueDate}<br>
        Nơi cư trú: ${address}<br>
        Trong thời gian cư trú tại: Phường Bình Hiên<br>
        Từ ngày ..................................................... đến ngày .....................................................<br>
        Tình trạng hôn nhân: Chưa đăng ký kết hôn với ai.<br>
        Giấy này có giá trị sử dụng trong thời hạn 6 tháng, kể từ ngày cấp, được sử dụng để: Bổ sung hồ sơ đi nước ngoài.
      </div>

      <table class="footer-table">
        <tr>
          <td style="width: 50%;"></td>
          <td style="width: 50%;">
            <span class="bold">NGƯỜI KÝ GIẤY XÁC NHẬN</span><br>
            <i>(Ký, ghi rõ họ tên, chức vụ và đóng dấu)</i><br><br><br><br><br>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const pdfPath = path.resolve(uploadsDir, `temp_${app.id}.pdf`);

    pdf.create(htmlContent, { format: 'A4', orientation: 'portrait' }).toFile(pdfPath, function(err, result) {
      if (err) {
        console.error('[html-pdf]', err);
        return error(res, 'Lỗi khi tạo PDF', 500);
      }
      res.download(pdfPath, `Giay_Xac_Nhan_${app.applicationCode}.pdf`, () => {
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      });
    });
  } catch (err) {
    console.error('[printApplication]', err);
    return error(res, 'Lỗi in hồ sơ: ' + err.message, 500);
  }
};