const { Notification } = require('../models');
const emailService = require('./email.service');

/**
 * Tạo thông báo trong DB và tùy chọn gửi email
 * @param {object} params
 * @param {string} params.userId        - ID người nhận
 * @param {string} [params.applicationId]
 * @param {string} params.type          - loại thông báo, vd: 'STATUS_UPDATE', 'SUPPLEMENT_REQUEST'
 * @param {string} params.title         - tiêu đề thông báo
 * @param {string} params.message       - nội dung thông báo
 * @param {boolean} [params.sendEmail]  - có gửi email không (mặc định false)
 * @param {string} [params.email]       - địa chỉ email nếu sendEmail = true
 */
exports.createNotification = async ({
  userId,
  applicationId = null,
  type,
  title,
  message,
  sendEmail = false,
  email = null,
}) => {
  const notification = await Notification.create({
    userId,
    applicationId,
    type,
    title,
    message,
    isRead: false,
  });

  if (sendEmail && email) {
    try {
      // Dùng email service generic
      const html = `
        <h2>${title}</h2>
        <p>${message}</p>
        <p style="color:#888;margin-top:16px">Đăng nhập hệ thống để xem chi tiết.</p>
      `;
      await emailService._send(email, title, html);
      await notification.update({ emailSentAt: new Date() });
    } catch (err) {
      console.warn('[Notification] Gửi email thất bại:', err.message);
    }
  }

  return notification;
};

/**
 * Lấy danh sách thông báo của người dùng (chưa đọc trước)
 */
exports.getUserNotifications = async (userId, { page = 1, limit = 20 } = {}) => {
  return Notification.findAndCountAll({
    where: { userId },
    order: [['isRead', 'ASC'], ['createdAt', 'DESC']],
    limit: +limit,
    offset: (+page - 1) * +limit,
  });
};

/**
 * Đánh dấu thông báo đã đọc
 */
exports.markAsRead = async (notificationId, userId) => {
  const notif = await Notification.findOne({
    where: { id: notificationId, userId },
  });
  if (!notif) return null;
  return notif.update({ isRead: true });
};

/**
 * Đánh dấu tất cả thông báo của user là đã đọc
 */
exports.markAllAsRead = async (userId) => {
  return Notification.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );
};
