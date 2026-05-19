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

// In Giấy phép hoạt động (Mẫu số 08)
exports.printPermit = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const pdf = require('html-pdf');

    const app = await Application.findByPk(req.params.id, {
      include: [
        { model: User, as: 'citizen' },
        { model: User, as: 'officer', attributes: ['fullName', 'position'] },
        { model: require('../models').Service, as: 'service' }
      ]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const fd = app.formData || {};
    const d = new Date();
    const day   = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year  = d.getFullYear();

    // Lấy thông tin từ formData (OCR) hoặc dữ liệu citizen
    const orgName     = fd.orgName     || fd.fullName   || fd.HO_TEN   || app.citizen?.fullName || '........................................';
    const orgAddress  = fd.orgAddress  || fd.address    || app.citizen?.address || '........................................';
    const orgPhone    = fd.orgPhone    || fd.phone      || app.citizen?.phone   || '........................................';
    const orgType     = fd.orgType     || fd.loaiHinh   || 'Tổ chức văn hóa cộng đồng';
    const orgFunction = fd.orgFunction || fd.chucNang   || 'Tổ chức các hoạt động văn hóa, vui chơi, giải trí phục vụ cộng đồng';
    const target      = fd.target      || fd.doiTuong   || 'Cộng đồng dân cư trên địa bàn phường';
    const scale       = fd.scale       || fd.quiMo      || fd.eventName || fd.TENHOATDONG || '........................................';
    const area        = fd.area        || fd.diaBan     || fd.eventPlace|| fd.DIADIEMDIENRA || orgAddress;
    const tasks       = fd.tasks       || fd.nhiemVu    || fd.purpose   || 'Tổ chức hoạt động văn hóa cộng đồng theo nội dung đã đăng ký';
    const officerSig  = app.officer?.fullName || req.user?.fullName || '(Thủ trưởng cơ quan)';
    const officerPos  = app.officer?.position || 'Chủ tịch UBND Phường';

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.6; margin: 0; padding: 20px 60px; color: #000; }
    table { width: 100%; border-collapse: collapse; }
    .header-left { width: 45%; text-align: center; vertical-align: top; }
    .header-right { width: 55%; text-align: center; vertical-align: top; }
    .bold { font-weight: bold; }
    .underline { text-decoration: underline; }
    .center { text-align: center; }
    .title { text-align: center; font-weight: bold; font-size: 15pt; margin: 24px 0 4px 0; text-transform: uppercase; letter-spacing: 1px; }
    .subtitle { text-align: center; font-size: 12pt; margin-bottom: 8px; }
    .doc-no { text-align: center; margin: 12px 0 8px 0; font-size: 12pt; }
    .date-line { text-align: center; font-style: italic; margin-bottom: 20px; }
    .section-title { font-weight: bold; font-size: 12pt; margin: 16px 0 6px 0; text-transform: uppercase; }
    .field-row { margin: 6px 0; }
    .label { font-weight: bold; }
    .dots { border-bottom: 1px dotted #000; display: inline-block; min-width: 300px; }
    .footer-table { margin-top: 50px; }
    .sign-area { text-align: center; }
    .sign-title { font-weight: bold; text-align: center; margin-bottom: 4px; }
    .sign-note { font-style: italic; text-align: center; font-size: 11pt; color: #333; }
    .sign-name { font-weight: bold; text-align: center; margin-top: 70px; font-size: 13pt; }
    .mau-so { font-size: 11pt; margin-bottom: 10px; }
    hr.divider { border: none; border-top: 1px solid #000; margin: 4px 0 16px 0; }
  </style>
</head>
<body>

  <p class="mau-so"><em>Mẫu số 08</em></p>

  <table>
    <tr>
      <td class="header-left">
        <span class="bold">ỦY BAN NHÂN DÂN<br>PHƯỜNG MỸ XUYÊN</span><br>
        <hr class="divider" style="width:60%; margin:4px auto;">
        <span>Số: ${app.applicationCode}/GP-UBND</span>
      </td>
      <td class="header-right">
        <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
        <span class="bold underline">Độc lập - Tự do - Hạnh phúc</span><br>
        <hr class="divider" style="width:60%; margin:4px auto;">
        <em>Mỹ Xuyên, ngày ${day} tháng ${month} năm ${year}</em>
      </td>
    </tr>
  </table>

  <div class="title">GIẤY PHÉP HOẠT ĐỘNG</div>
  <div class="subtitle"><em>Cấp cho (Tên cơ sở):</em> <strong>${orgName}</strong></div>

  <div class="field-row">
    <span class="label">Căn cứ pháp lý:</span>
    Nghị định số 110/2018/NĐ-CP ngày 29/8/2018 của Chính phủ; Các văn bản pháp lý liên quan về quản lý hoạt động văn hóa tại địa phương.
  </div>

  <div class="section-title">I. Thông tin về cơ sở</div>

  <div class="field-row"><span class="label">1. Tên cơ sở, địa chỉ trụ sở, số điện thoại:</span></div>
  <div class="field-row" style="padding-left:20px">
    - Tên cơ sở: <strong>${orgName}</strong><br>
    - Địa chỉ: ${orgAddress}<br>
    - Số điện thoại: ${orgPhone}
  </div>

  <div class="field-row"><span class="label">2. Loại hình cơ sở:</span> ${orgType}</div>

  <div class="field-row"><span class="label">3. Chức năng:</span><br>
  <span style="padding-left:20px">${orgFunction}</span></div>

  <div class="section-title">II. Nội dung hoạt động được cấp phép</div>

  <div class="field-row"><span class="label">1. Đối tượng phục vụ:</span> ${target}</div>

  <div class="field-row"><span class="label">2. Quy mô hoạt động:</span> ${scale}</div>

  <div class="field-row"><span class="label">3. Địa bàn hoạt động:</span> ${area}</div>

  <div class="field-row"><span class="label">4. Các nhiệm vụ được cấp phép hoạt động:</span><br>
  <span style="padding-left:20px">${tasks}</span></div>

  <table class="footer-table">
    <tr>
      <td style="width:50%"></td>
      <td style="width:50%; text-align:center">
        <p class="sign-title">THỦ TRƯỞNG<br>(Cơ quan cấp giấy phép hoạt động)</p>
        <p class="sign-note">(Ký tên, đóng dấu)</p>
        <p class="sign-name">${officerSig}</p>
        <p class="center" style="font-size:11pt; font-style:italic; color:#555">${officerPos}</p>
      </td>
    </tr>
  </table>

</body>
</html>`;

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    const pdfPath = path.resolve(uploadsDir, `permit_${app.id}.pdf`);

    pdf.create(htmlContent, { format: 'A4', orientation: 'portrait', border: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' } }).toFile(pdfPath, (err2) => {
      if (err2) {
        console.error('[html-pdf permit]', err2);
        return error(res, 'Lỗi khi tạo Giấy phép PDF', 500);
      }
      res.download(pdfPath, `GiayPhep_HoatDong_${app.applicationCode}.pdf`, () => {
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      });
    });
  } catch (err) {
    console.error('[printPermit]', err);
    return error(res, 'Lỗi in giấy phép: ' + err.message, 500);
  }
};

// ─── In Giấy Chứng Nhận Kết Hôn ────────────────────────────────────────────
exports.printMarriageCertificate = async (req, res) => {
  try {
    const fs   = require('fs');
    const path = require('path');
    const pdf  = require('html-pdf');
    const app = await Application.findByPk(req.params.id, {
      include: [
        { model: User, as: 'citizen' },
        { model: User, as: 'officer', attributes: ['fullName', 'position'] }
      ]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const fd = app.formData || {};
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const mon = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    const husName      = fd.husName      || fd.fullName    || app.citizen?.fullName || '............................................';
    const husDob       = fd.husDob       || fd.dob         || '......../......../........';
    const husEthnicity = fd.husEthnicity || fd.ethnicity   || '......................';
    const husNation    = fd.husNation    || fd.nationality || 'Việt Nam';
    const husAddress   = fd.husAddress   || fd.address     || '............................................';
    const husId        = fd.husId        || fd.idNumber    || app.citizen?.cccd || '............................................';
    const wifeName     = fd.wifeName     || '............................................';
    const wifeDob      = fd.wifeDob      || '......../......../........';
    const wifeEthnicity= fd.wifeEthnicity|| '......................';
    const wifeNation   = fd.wifeNation   || 'Việt Nam';
    const wifeAddress  = fd.wifeAddress  || '............................................';
    const wifeId       = fd.wifeId       || '............................................';
    const officerSig   = app.officer?.fullName || req.user?.fullName || '............................................';
    const officerPos   = app.officer?.position || 'Chủ tịch UBND Phường';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:'Times New Roman',serif;font-size:13pt;line-height:1.7;margin:0;padding:25px 55px;color:#000}
table{width:100%;border-collapse:collapse}.bold{font-weight:bold}.underline{text-decoration:underline}
.title{text-align:center;font-weight:bold;font-size:16pt;margin:24px 0 20px;text-transform:uppercase;letter-spacing:1px}
.col-title{font-weight:bold;text-align:center;margin-bottom:10px;border-bottom:1px solid #000;padding-bottom:6px}
.field{margin:8px 0;font-size:12.5pt}
hr.div{border:none;border-top:1px solid #000;margin:4px auto;width:50%}
</style></head><body>
<table><tr>
<td style="width:45%;text-align:center;vertical-align:top">
  <span class="bold">ỦY BAN NHÂN DÂN<br>PHƯỜNG 11, QUẬN BÌNH THẠNH</span><br>
  <hr class="div"><span>Số: ${app.applicationCode}/GCNKH</span>
</td>
<td style="width:55%;text-align:center;vertical-align:top">
  <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
  <span class="bold underline">Độc lập - Tự do - Hạnh phúc</span><br>
  <hr class="div"><em>Phường 11, ngày ${day} tháng ${mon} năm ${year}</em>
</td></tr></table>
<div class="title">GIẤY CHỨNG NHẬN KẾT HÔN</div>
<table style="border:1px solid #000;margin-bottom:18px"><tr>
<td style="width:50%;padding:12px;border-right:1px solid #000;vertical-align:top">
  <div class="col-title">Thông tin người chồng</div>
  <div class="field">Họ, chữ đệm, tên: <strong>${husName}</strong></div>
  <div class="field">Ngày, tháng, năm sinh: ${husDob}</div>
  <div class="field">Dân tộc: ${husEthnicity} &nbsp; Quốc tịch: ${husNation}</div>
  <div class="field">Nơi cư trú: ${husAddress}</div>
  <div class="field">Giấy tờ tùy thân: ${husId}</div>
</td>
<td style="width:50%;padding:12px;vertical-align:top">
  <div class="col-title">Thông tin người vợ</div>
  <div class="field">Họ, chữ đệm, tên: <strong>${wifeName}</strong></div>
  <div class="field">Ngày, tháng, năm sinh: ${wifeDob}</div>
  <div class="field">Dân tộc: ${wifeEthnicity} &nbsp; Quốc tịch: ${wifeNation}</div>
  <div class="field">Nơi cư trú: ${wifeAddress}</div>
  <div class="field">Giấy tờ tùy thân: ${wifeId}</div>
</td></tr></table>
<div class="field"><strong>Nơi đăng ký kết hôn:</strong> Ủy ban nhân dân Phường 11, Quận Bình Thạnh, TP. Hồ Chí Minh.</div>
<div class="field"><strong>Ngày đăng ký:</strong> ngày ${day} tháng ${mon} năm ${year}</div>
<table style="margin-top:50px;text-align:center"><tr>
  <td style="width:33%"><div class="bold">NGƯỜI VỢ</div><div style="font-style:italic;font-size:11pt">(Ký, ghi rõ họ tên)</div><div style="margin-top:65px">&nbsp;</div></td>
  <td style="width:33%"><div class="bold">NGƯỜI CHỒNG</div><div style="font-style:italic;font-size:11pt">(Ký, ghi rõ họ tên)</div><div style="margin-top:65px">&nbsp;</div></td>
  <td style="width:34%">
    <div class="bold">NGƯỜI KÝ GIẤY CHỨNG NHẬN</div>
    <div style="font-style:italic;font-size:11pt">(Ký, ghi rõ họ tên, chức vụ và đóng dấu)</div>
    <div style="margin-top:65px;font-weight:bold">${officerSig}</div>
    <div style="font-style:italic;font-size:11pt;color:#555">${officerPos}</div>
  </td>
</tr></table>
</body></html>`;

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    const pdfPath = path.resolve(uploadsDir, `ket_hon_${app.id}.pdf`);
    pdf.create(html, { format: 'A4', orientation: 'portrait', border: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' } })
      .toFile(pdfPath, (e2) => {
        if (e2) return error(res, 'Lỗi tạo PDF', 500);
        res.download(pdfPath, `GiayChungNhanKetHon_${app.applicationCode}.pdf`, () => { if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath); });
      });
  } catch (err) {
    console.error('[printMarriageCertificate]', err);
    return error(res, 'Lỗi in giấy chứng nhận kết hôn: ' + err.message, 500);
  }
};

// ─── In Lời Chứng Thực Bản Sao ──────────────────────────────────────────────
exports.printCopyAuthentication = async (req, res) => {
  try {
    const fs   = require('fs');
    const path = require('path');
    const pdf  = require('html-pdf');
    const app = await Application.findByPk(req.params.id, {
      include: [
        { model: User, as: 'citizen' },
        { model: User, as: 'officer', attributes: ['fullName', 'position'] }
      ]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const fd = app.formData || {};
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const mon = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    const NUMS = ['Không','Một','Hai','Ba','Bốn','Năm','Sáu','Bảy','Tám','Chín','Mười',
      'Mười một','Mười hai','Mười ba','Mười bốn','Mười lăm','Mười sáu','Mười bảy',
      'Mười tám','Mười chín','Hai mươi','Hai mươi mốt','Hai mươi hai','Hai mươi ba',
      'Hai mươi bốn','Hai mươi lăm','Hai mươi sáu','Hai mươi bảy','Hai mươi tám',
      'Hai mươi chín','Ba mươi','Ba mươi mốt'];
    const MONTHS = ['','Một','Hai','Ba','Bốn','Năm','Sáu','Bảy','Tám','Chín','Mười','Mười một','Mười hai'];
    const dateText = `Ngày ${NUMS[parseInt(day)]} tháng ${MONTHS[parseInt(mon)]} năm ${year}`;

    const pages      = fd.pages   || '01';
    const certNo     = fd.certNo  || app.applicationCode;
    const bookNo     = fd.bookNo  || '01';
    const officerName= app.officer?.fullName || req.user?.fullName || '............................................';
    const officerPos = app.officer?.position || 'Chủ tịch UBND Phường';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:'Times New Roman',serif;font-size:13pt;line-height:2;margin:0;padding:60px 80px;color:#000}
.title{font-weight:bold;font-size:14pt;text-align:center;margin-bottom:20px;text-transform:uppercase}
.field{margin:8px 0}.bold{font-weight:bold}.underline{text-decoration:underline}
.border-box{border:2px solid #000;padding:30px 40px}
</style></head><body>
<div class="border-box">
  <div class="title">LỜI CHỨNG CHỨNG THỰC BẢN SAO TỪ BẢN CHÍNH</div>
  <div class="field"><strong>${dateText}</strong></div>
  <div class="field" style="font-style:italic">(Bằng chữ: ${dateText})</div>
  <div class="field">Tại: <strong>Ủy ban nhân dân Phường 11, Quận Bình Thạnh, Thành phố Hồ Chí Minh.</strong></div>
  <div class="field">Tôi, <strong>${officerName}</strong>, là <em>${officerPos}</em></div>
  <div class="field" style="margin-top:20px"><strong class="underline">CHỨNG THỰC:</strong></div>
  <div class="field">Bản sao này đúng với bản chính (gồm <strong>${pages}</strong> trang).</div>
  <div class="field" style="text-align:center;margin:16px 0">
    Số chứng thực: <strong>${certNo}</strong> / Quyển số: <strong>${bookNo}</strong> - SCT/BS
  </div>
  <div style="margin-top:60px;text-align:center">
    <div class="bold">NGƯỜI THỰC HIỆN CHỨNG THỰC</div>
    <div style="font-style:italic;font-size:11pt">(Ký, ghi rõ họ tên, chức vụ và đóng dấu)</div>
    <div style="margin-top:65px;font-weight:bold">${officerName}</div>
    <div style="font-style:italic;font-size:11pt;color:#555">${officerPos}</div>
  </div>
</div>
</body></html>`;

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    const pdfPath = path.resolve(uploadsDir, `chung_thuc_${app.id}.pdf`);
    pdf.create(html, { format: 'A4', orientation: 'portrait', border: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' } })
      .toFile(pdfPath, (e2) => {
        if (e2) return error(res, 'Lỗi tạo PDF', 500);
        res.download(pdfPath, `LoiChungThucBanSao_${app.applicationCode}.pdf`, () => { if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath); });
      });
  } catch (err) {
    console.error('[printCopyAuthentication]', err);
    return error(res, 'Lỗi in lời chứng thực: ' + err.message, 500);
  }
};

// ─── In Trích Lục Khai Tử ───────────────────────────────────────────────────
exports.printDeathExtract = async (req, res) => {
  try {
    const fs   = require('fs');
    const path = require('path');
    const pdf  = require('html-pdf');
    const app = await Application.findByPk(req.params.id, {
      include: [
        { model: User, as: 'citizen' },
        { model: User, as: 'officer', attributes: ['fullName', 'position'] }
      ]
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const fd = app.formData || {};
    const d  = new Date();
    const day  = String(d.getDate()).padStart(2, '0');
    const mon  = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    // ── Thông tin người chết (từ formData / OCR)
    const deceasedName = fd.deceasedName || fd.fullName  || app.citizen?.fullName || '............................................';
    const deceasedDob  = fd.deceasedDob  || fd.dob       || '......../......../........';
    const gender       = fd.gender       || app.citizen?.gender || '............................................';
    const ethnicity    = fd.ethnicity    || app.citizen?.ethnicity || 'Kinh';
    const nationality  = fd.nationality  || 'Việt Nam';
    const lastAddress  = fd.lastAddress  || fd.address   || app.citizen?.address || '............................................';
    const idNumber     = fd.idNumber     || fd.cccd      || app.citizen?.cccd || '............................................';
    const deathTime    = fd.deathTime    || '........ giờ ........ phút';
    const deathDate    = fd.deathDate    || '......../......../........';
    const deathPlace   = fd.deathPlace   || '............................................';
    const deathCause   = fd.deathCause   || '............................................';
    const deathCertNo  = fd.deathCertNo  || '............................................';
    const deathCertBy  = fd.deathCertBy  || 'Bệnh viện / Cơ sở y tế có thẩm quyền';
    const deathCertDate= fd.deathCertDate|| '......../......../........';

    // ── Thông tin người khai (người đăng ký khai tử — thường là thân nhân)
    const declarantName   = fd.declarantName   || fd.requesterName || app.citizen?.fullName || '............................................';
    const declarantId     = fd.declarantId     || fd.requesterCccd || app.citizen?.cccd     || '............................................';
    const declarantRelation = fd.declarantRelation || fd.relationship || 'Con/vợ/chồng/cha/mẹ của người chết';
    const declarantAddress  = fd.declarantAddress  || app.citizen?.address || lastAddress;

    // ── Thông tin do nhà nước tự điền (quản lý sổ hộ tịch)
    const regYear    = year;
    const regSeq     = String(app.id).padStart(3, '0');          // Số thứ tự trong năm (dùng app.id làm proxy)
    const regNo      = `${regSeq}/${regYear}/ĐKKT`;              // Số đăng ký khai tử
    const bookNo     = `01/${regYear}`;                          // Số sổ đăng ký khai tử năm hiện hành
    const regUnit    = 'UBND Phường 11, Quận Bình Thạnh';        // Đơn vị đăng ký
    const regCity    = 'Thành phố Hồ Chí Minh';

    const officerSig = app.officer?.fullName || req.user?.fullName || '............................................';
    const officerPos = app.officer?.position || 'Chủ tịch UBND Phường';

    // ── Format ngày đầy đủ bằng chữ cho phần cuối
    const MONTHS_VI = ['','tháng một','tháng hai','tháng ba','tháng tư','tháng năm','tháng sáu',
                       'tháng bảy','tháng tám','tháng chín','tháng mười','tháng mười một','tháng mười hai'];
    const regDateText = `ngày ${day} ${MONTHS_VI[parseInt(mon)]} năm ${year}`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:'Times New Roman',serif;font-size:13pt;line-height:1.85;margin:0;padding:25px 55px;color:#000}
table{width:100%;border-collapse:collapse}.bold{font-weight:bold}.underline{text-decoration:underline}
.title{text-align:center;font-weight:bold;font-size:16pt;margin:20px 0 6px;text-transform:uppercase;letter-spacing:1px}
.subtitle{text-align:center;font-style:italic;margin-bottom:18px;font-size:12pt}
.field{margin:6px 0;font-size:12.5pt}
.section{margin-top:14px;border-top:1px dashed #aaa;padding-top:8px}
.section-title{font-weight:bold;font-size:12pt;margin-bottom:6px;text-transform:uppercase;color:#222}
hr.div{border:none;border-top:1px solid #000;margin:4px auto;width:50%}
.stamp-area{border:1px dashed #999;padding:8px 16px;font-size:11pt;color:#555;text-align:center;margin-top:8px;border-radius:4px}
</style></head><body>

<table><tr>
<td style="width:45%;text-align:center;vertical-align:top">
  <span class="bold">ỦY BAN NHÂN DÂN<br>PHƯỜNG 11, QUẬN BÌNH THẠNH</span><br>
  <hr class="div">
  <span>Số đăng ký: <strong>${regNo}</strong></span><br>
  <span style="font-size:11pt">Quyển số: ${bookNo}</span>
</td>
<td style="width:55%;text-align:center;vertical-align:top">
  <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
  <span class="bold underline">Độc lập - Tự do - Hạnh phúc</span><br>
  <hr class="div">
  <em>Phường 11, ngày ${day} tháng ${mon} năm ${year}</em>
</td></tr></table>

<div class="title">TRÍCH LỤC KHAI TỬ</div>
<div class="subtitle">(BẢN CHÍNH — Lưu trữ tại bộ phận hộ tịch)</div>

<!-- PHẦN I: THÔNG TIN NGƯỜI CHẾT -->
<div class="section">
  <div class="section-title">I. Thông tin về người chết</div>
  <div class="field">Họ, chữ đệm, tên người chết: <strong>${deceasedName}</strong></div>
  <div class="field">Ngày, tháng, năm sinh: <strong>${deceasedDob}</strong> &nbsp;&nbsp; Giới tính: <strong>${gender}</strong></div>
  <div class="field">Dân tộc: ${ethnicity} &nbsp;&nbsp; Quốc tịch: ${nationality}</div>
  <div class="field">Nơi cư trú cuối cùng: ${lastAddress}</div>
  <div class="field">Giấy tờ tùy thân (CCCD/CMND/Hộ chiếu): ${idNumber}</div>
</div>

<!-- PHẦN II: THÔNG TIN VỀ VIỆC CHẾT -->
<div class="section">
  <div class="section-title">II. Thông tin về việc chết</div>
  <div class="field">Đã chết vào lúc: <strong>${deathTime}</strong>, ngày <strong>${deathDate}</strong></div>
  <div class="field">Nơi chết: ${deathPlace}</div>
  <div class="field">Nguyên nhân chết: ${deathCause}</div>
  <div class="field">
    Giấy báo tử số: <strong>${deathCertNo}</strong> &nbsp;
    do: <em>${deathCertBy}</em><br>
    cấp ngày ${deathCertDate}
  </div>
</div>

<!-- PHẦN III: THÔNG TIN NGƯỜI KHAI -->
<div class="section">
  <div class="section-title">III. Thông tin người đi khai tử</div>
  <div class="field">Họ, chữ đệm, tên: <strong>${declarantName}</strong></div>
  <div class="field">Giấy tờ tùy thân: ${declarantId}</div>
  <div class="field">Quan hệ với người chết: ${declarantRelation}</div>
  <div class="field">Nơi cư trú: ${declarantAddress}</div>
</div>

<!-- PHẦN IV: PHẦN NHÀ NƯỚC TỰ ĐIỀN -->
<div class="section">
  <div class="section-title">IV. Thông tin đăng ký (Cơ quan hộ tịch điền)</div>
  <table style="width:100%"><tr>
    <td style="width:50%;vertical-align:top">
      <div class="field">Nơi đăng ký khai tử: <strong>${regUnit}</strong></div>
      <div class="field">Địa phương: ${regCity}</div>
      <div class="field">Ngày, tháng, năm đăng ký: <strong>${regDateText}</strong></div>
    </td>
    <td style="width:50%;vertical-align:top;padding-left:20px">
      <div class="field">Số đăng ký khai tử: <strong>${regNo}</strong></div>
      <div class="field">Quyển số sổ đăng ký khai tử: <strong>${bookNo}</strong></div>
      <div class="field">Mã hồ sơ nộp trực tuyến: <strong>${app.applicationCode}</strong></div>
    </td>
  </tr></table>
  <div class="stamp-area">
    [Đóng dấu xác nhận của UBND Phường 11 — Quận Bình Thạnh — TP. Hồ Chí Minh]
  </div>
</div>

<table style="margin-top:40px"><tr>
  <td style="width:50%;text-align:center;vertical-align:top">
    <div class="bold">NGƯỜI ĐI KHAI TỬ</div>
    <div style="font-style:italic;font-size:11pt">(Ký, ghi rõ họ tên)</div>
    <div style="margin-top:65px;font-weight:bold">${declarantName}</div>
  </td>
  <td style="width:50%;text-align:center;vertical-align:top">
    <div class="bold">NGƯỜI KÝ TRÍCH LỤC</div>
    <div style="font-style:italic;font-size:11pt">(Ký, ghi rõ họ tên, chức vụ và đóng dấu)</div>
    <div style="margin-top:65px;font-weight:bold">${officerSig}</div>
    <div style="font-style:italic;font-size:11pt;color:#555">${officerPos}</div>
    <div style="font-style:italic;font-size:10pt;color:#777">${regUnit}</div>
  </td>
</tr></table>

<div style="margin-top:20px;font-size:10pt;color:#777;border-top:1px solid #ddd;padding-top:8px">
  <em>Trích lục này có giá trị pháp lý theo quy định tại Điều 67 Luật Hộ tịch năm 2014.
  Mọi hành vi sửa chữa, tẩy xóa trái phép đều bị xử lý theo pháp luật.</em>
</div>

</body></html>`;

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    const pdfPath = path.resolve(uploadsDir, `khai_tu_${app.id}.pdf`);
    pdf.create(html, { format: 'A4', orientation: 'portrait', border: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' } })
      .toFile(pdfPath, (e2) => {
        if (e2) return error(res, 'Lỗi tạo PDF', 500);
        res.download(pdfPath, `TrichLucKhaiTu_${app.applicationCode}.pdf`, () => { if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath); });
      });
  } catch (err) {
    console.error('[printDeathExtract]', err);
    return error(res, 'Lỗi in trích lục khai tử: ' + err.message, 500);
  }
};

