'use strict';
const nodemailer = require('nodemailer');

// ─── Guard: kiểm tra biến môi trường ────────────────────────────────────────
const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

if (!emailConfigured) {
  console.warn('\n⚠️  [Email] Chưa cấu hình SMTP — email sẽ chỉ được log ra console.');
  console.warn('   Hãy điền EMAIL_USER và EMAIL_PASSWORD vào file backend/.env\n');
}

// ─── Tạo transporter với Gmail SMTP ─────────────────────────────────────────
const transporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,                    // TLS (STARTTLS) — không phải SSL port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Gmail App Password (16 ký tự)
      },
      tls: {
        rejectUnauthorized: false       // bỏ qua lỗi cert tự ký khi dev local
      }
    })
  : null;

// ─── Hàm gửi mail chung ─────────────────────────────────────────────────────
const send = async (to, subject, html) => {
  if (!transporter) {
    console.warn(`\n📧 [Email - SKIP] Gửi đến: ${to}`);
    console.warn(`   Tiêu đề : ${subject}\n`);
    return { skipped: true };
  }

  const fromName  = process.env.EMAIL_FROM_NAME  || 'Hành Chính Công';
  const fromEmail = process.env.EMAIL_USER;

  try {
    const info = await transporter.sendMail({
      from:    `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html
    });
    console.log(`✅ [Email] Đã gửi → ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ [Email] Lỗi gửi đến ${to}:`, err.message);
    throw err; // ném lại để controller bắt
  }
};

// ─── Template base ───────────────────────────────────────────────────────────
const wrapTemplate = (title, accentColor, bodyHtml) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${accentColor} 0%,${accentColor}cc 100%);padding:36px 40px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🏛️</div>
            <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;">
              Cổng Dịch Vụ Hành Chính Công
            </h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">
              Phục vụ người dân – Minh bạch – Hiệu quả
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 6px;">
              Email này được gửi tự động từ hệ thống — vui lòng không trả lời.
            </p>
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              © 2025 Cổng Dịch Vụ Hành Chính Công. Bảo lưu mọi quyền.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;

// ─── Exports ─────────────────────────────────────────────────────────────────

/**
 * Gửi email xác thực tài khoản
 */
exports.sendVerificationEmail = (to, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  console.log('\n=====================================================');
  console.log(`📨 [Email] Gửi xác thực tới: ${to}`);
  console.log(`🔗 Link kích hoạt: \x1b[36m${url}\x1b[0m`);
  console.log('=====================================================\n');

  const body = `
    <h2 style="color:#1e293b;margin:0 0 16px;font-size:24px;">Xác nhận tài khoản của bạn</h2>
    <p style="color:#475569;line-height:1.7;margin:0 0 24px;">
      Chào mừng bạn đến với <strong>Cổng Dịch Vụ Hành Chính Công</strong>! 🎉<br/>
      Vui lòng nhấn nút bên dưới để kích hoạt tài khoản và bắt đầu sử dụng dịch vụ.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${url}"
         style="display:inline-block;background:linear-gradient(135deg,#185FA5,#1d74c7);
                color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;
                font-size:16px;font-weight:600;letter-spacing:0.3px;
                box-shadow:0 4px 12px rgba(24,95,165,0.35);">
        ✅ Xác nhận Email
      </a>
    </div>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin-top:24px;">
      <p style="color:#1d4ed8;margin:0;font-size:13px;">
        ⏰ <strong>Lưu ý:</strong> Liên kết này có hiệu lực trong <strong>24 giờ</strong>.
        Nếu bạn không thực hiện đăng ký, hãy bỏ qua email này.
      </p>
    </div>

    <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;word-break:break-all;">
      Hoặc dán link vào trình duyệt: ${url}
    </p>
  `;

  return send(to, '✅ Xác nhận tài khoản – Cổng Hành Chính Công', wrapTemplate('Xác nhận tài khoản', '#185FA5', body));
};

/**
 * Gửi email đặt lại mật khẩu
 */
exports.sendResetPasswordEmail = (to, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  console.log('\n=====================================================');
  console.log(`📨 [Email] Gửi link reset mật khẩu tới: ${to}`);
  console.log(`🔗 Link reset: \x1b[36m${url}\x1b[0m`);
  console.log('=====================================================\n');

  const body = `
    <h2 style="color:#1e293b;margin:0 0 16px;font-size:24px;">Đặt lại mật khẩu</h2>
    <p style="color:#475569;line-height:1.7;margin:0 0 24px;">
      Chúng tôi nhận được yêu cầu <strong>đặt lại mật khẩu</strong> cho tài khoản gắn với email này.<br/>
      Nhấn nút bên dưới để tạo mật khẩu mới.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${url}"
         style="display:inline-block;background:linear-gradient(135deg,#dc2626,#ef4444);
                color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;
                font-size:16px;font-weight:600;letter-spacing:0.3px;
                box-shadow:0 4px 12px rgba(220,38,38,0.35);">
        🔑 Đặt lại mật khẩu
      </a>
    </div>

    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin-top:24px;">
      <p style="color:#dc2626;margin:0;font-size:13px;">
        ⚠️ <strong>Bảo mật:</strong> Liên kết chỉ có hiệu lực <strong>24 giờ</strong>.
        Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này — tài khoản vẫn an toàn.
      </p>
    </div>

    <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;word-break:break-all;">
      Hoặc dán link vào trình duyệt: ${url}
    </p>
  `;

  return send(to, '🔑 Đặt lại mật khẩu – Cổng Hành Chính Công', wrapTemplate('Đặt lại mật khẩu', '#dc2626', body));
};

/**
 * Gửi email xác nhận hồ sơ đã được tiếp nhận
 */
exports.sendApplicationConfirm = (to, code) => {
  const body = `
    <h2 style="color:#1e293b;margin:0 0 16px;font-size:24px;">Hồ sơ đã được tiếp nhận 📋</h2>
    <p style="color:#475569;line-height:1.7;margin:0 0 20px;">
      Hồ sơ của bạn đã được hệ thống ghi nhận thành công. Dưới đây là thông tin tóm tắt:
    </p>

    <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:10px;padding:20px 24px;margin:20px 0;">
      <p style="margin:0;color:#166534;font-size:15px;">
        📌 Mã hồ sơ: <strong style="font-size:20px;letter-spacing:1px;">${code}</strong>
      </p>
    </div>

    <p style="color:#475569;line-height:1.7;margin:20px 0 0;">
      Chúng tôi sẽ xử lý hồ sơ trong vòng <strong>5 ngày làm việc</strong>
      và thông báo kết quả qua email này.
    </p>
  `;

  return send(to, `📋 Tiếp nhận hồ sơ ${code} – Cổng Hành Chính Công`, wrapTemplate('Tiếp nhận hồ sơ', '#16a34a', body));
};

/**
 * Gửi email cập nhật trạng thái hồ sơ
 */
exports.sendStatusUpdate = (to, code, status, note = '') => {
  const configs = {
    COMPLETED: {
      title:  'Hồ sơ đã được duyệt ✅',
      color:  '#16a34a',
      accent: '#16a34a',
      bgNote: '#f0fdf4',
      bdNote: '#22c55e',
      extra: `
        <div style="margin-top:20px;padding:18px 22px;background:#f0fdf4;border:2px solid #22c55e;border-radius:10px;">
          <h3 style="color:#166534;margin:0 0 10px;font-size:15px;">📄 Nhận giấy tờ</h3>
          <p style="color:#166534;margin:0 0 10px;line-height:1.6;">
            Giấy tờ đã xử lý xong. Vui lòng <strong>đến trực tiếp UBND Phường</strong> để nhận bản gốc có dấu và chữ ký.
          </p>
          <ul style="color:#166534;margin:0;padding-left:20px;line-height:2;">
            <li>Mang theo <strong>CMND/CCCD gốc</strong></li>
            <li>Giờ làm việc: <strong>7:30 – 16:30</strong> (Thứ Hai – Thứ Sáu)</li>
            <li>Hotline: <strong>1900 xxxx</strong></li>
          </ul>
        </div>
      `
    },
    REJECTED: {
      title:  'Hồ sơ bị từ chối ❌',
      color:  '#dc2626',
      accent: '#dc2626',
      bgNote: '#fef2f2',
      bdNote: '#fca5a5',
      extra:  ''
    },
    NEED_MORE: {
      title:  'Cần bổ sung giấy tờ 📎',
      color:  '#d97706',
      accent: '#d97706',
      bgNote: '#fffbeb',
      bdNote: '#fcd34d',
      extra:  ''
    }
  };

  const cfg = configs[status] || {
    title: 'Cập nhật hồ sơ 🔔', color: '#185FA5', accent: '#185FA5',
    bgNote: '#eff6ff', bdNote: '#bfdbfe', extra: ''
  };

  const body = `
    <h2 style="color:${cfg.color};margin:0 0 16px;font-size:24px;">${cfg.title}</h2>
    <p style="color:#475569;margin:0 0 20px;">
      Mã hồ sơ: <strong style="font-size:16px;">${code}</strong>
    </p>
    ${note ? `
    <div style="background:${cfg.bgNote};border:1px solid ${cfg.bdNote};border-radius:8px;padding:16px 20px;margin:16px 0;">
      <p style="margin:0;color:#374151;font-size:14px;">
        📝 <strong>Ghi chú từ cán bộ:</strong><br/>
        <em>${note}</em>
      </p>
    </div>` : ''}
    ${cfg.extra}
    <p style="color:#64748b;margin:24px 0 0;font-size:14px;">
      Cảm ơn bạn đã tin tưởng sử dụng Cổng Dịch Vụ Hành Chính Công.
    </p>
  `;

  return send(
    to,
    `${cfg.title} — ${code}`,
    wrapTemplate(cfg.title, cfg.accent, body)
  );
};