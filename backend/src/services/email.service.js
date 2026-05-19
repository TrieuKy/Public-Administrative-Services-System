const nodemailer = require('nodemailer');

// Guard: nếu chưa cấu hình email thì log thay vì crash
const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

const transporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
    })
  : null;

const send = (to, subject, html) => {
  if (!transporter) {
    console.warn(`[Email] Chưa cấu hình SMTP — bỏ qua email gửi đến ${to}: ${subject}`);
    return Promise.resolve();
  }
  return transporter.sendMail({
    from: `"Hành chính công" <${process.env.EMAIL_USER}>`, to, subject, html
  });
};

exports.sendVerificationEmail = (to, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  console.log('\n=====================================================');
  console.log(`🚀 [DEV MODE] Đã giả lập gửi Email xác thực tới: ${to}`);
  console.log(`👉 Link kích hoạt: \x1b[31m${url}\x1b[0m`);
  console.log('=====================================================\n');

  return send(to, 'Xác nhận tài khoản', `
    <h2>Xác nhận tài khoản của bạn</h2>
    <p>Nhấn vào liên kết bên dưới để kích hoạt tài khoản:</p>
    <a href="${url}" style="background:#185FA5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Xác nhận email</a>
    <p style="color:#888;margin-top:16px">Liên kết có hiệu lực trong 24 giờ.</p>
  `);
};

exports.sendResetPasswordEmail = (to, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  console.log('\n=====================================================');
  console.log(`🚀 [DEV MODE] Đã giả lập gửi Email khôi phục mật khẩu tới: ${to}`);
  console.log(`👉 Link đặt lại mật khẩu: \x1b[31m${url}\x1b[0m`);
  console.log('=====================================================\n');

  return send(to, 'Khôi phục mật khẩu', `
    <h2>Khôi phục mật khẩu của bạn</h2>
    <p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu:</p>
    <a href="${url}" style="background:#185FA5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Đặt lại mật khẩu</a>
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
  const pickupSection = status === 'COMPLETED' ? `
    <div style="margin-top:18px;padding:16px 20px;background:#f0fdf4;border:2px solid #22c55e;border-radius:10px">
      <h3 style="color:#166534;margin:0 0 8px 0">&#128196; Thông báo nhận giấy tờ</h3>
      <p style="color:#166534;margin:0">Giấy tờ của bạn đã được xử lý hoàn tất và đóng dấu. Vui lòng <strong>đến trực tiếp UBND Phường</strong> để nhận giấy tờ gốc có dấu đỏ và chữ ký của cán bộ có thẩm quyền.</p>
      <ul style="color:#166534;margin:10px 0 0 0;padding-left:20px">
        <li>Mang theo <strong>CMND/CCCD gốc</strong></li>
        <li>Giờ làm việc: <strong>7:30 – 16:30</strong> (Thứ Hai – Thứ Sáu)</li>
        <li>Nếu có thắc mắc, gọi: <strong>1900 xxxx</strong></li>
      </ul>
    </div>` : '';
  return send(to, `${title} — ${code}`, `
    <h2 style="color:${color}">${title}</h2>
    <p>Mã hồ sơ: <strong>${code}</strong></p>
    ${note ? `<p>Ghi chú từ cán bộ: <em>${note}</em></p>` : ''}
    ${pickupSection}
    <p>Cảm ơn bạn đã sử dụng Dịch vụ Hành chính công.</p>
  `);
};