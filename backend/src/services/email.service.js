const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
});

const send = (to, subject, html) =>
  transporter.sendMail({ from: `"Hành chính công" <${process.env.EMAIL_USER}>`, to, subject, html });

exports.sendVerificationEmail = (to, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  return send(to, 'Xác nhận tài khoản', `
    <h2>Xác nhận tài khoản của bạn</h2>
    <p>Nhấn vào liên kết bên dưới để kích hoạt tài khoản:</p>
    <a href="${url}" style="background:#185FA5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Xác nhận email</a>
    <p style="color:#888;margin-top:16px">Liên kết có hiệu lực trong 24 giờ.</p>
  `);
};

exports.sendApplicationConfirm = (to, code) =>
  send(to, `Xác nhận nộp hồ sơ ${code}`, `
    <h2>Hồ sơ đã được tiếp nhận</h2>
    <p>Mã hồ sơ của bạn: <strong>${code}</strong></p>
    <p>Chúng tôi sẽ xử lý trong vòng 5 ngày làm việc và thông báo kết quả qua email.</p>
  `);

exports.sendStatusUpdate = (to, code, status, note = '') => {
  const labels = {
    COMPLETED: { title: 'Hồ sơ đã được duyệt', color: '#27500A' },
    REJECTED:  { title: 'Hồ sơ bị từ chối',    color: '#791F1F' },
    NEED_MORE: { title: 'Cần bổ sung giấy tờ',  color: '#633806' },
  };
  const { title, color } = labels[status] || { title: 'Cập nhật hồ sơ', color: '#185FA5' };
  return send(to, `${title} — ${code}`, `
    <h2 style="color:${color}">${title}</h2>
    <p>Mã hồ sơ: <strong>${code}</strong></p>
    ${note ? `<p>Ghi chú từ cán bộ: <em>${note}</em></p>` : ''}
    <p>Đăng nhập hệ thống để xem chi tiết.</p>
  `);
};