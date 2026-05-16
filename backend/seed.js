require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { Comment } = require('./src/models');
const topics = ['Thái độ phục vụ', 'Hồ sơ trễ hẹn', 'Lỗi hệ thống', 'Khác'];
const statuses = ['pending', 'resolved', 'dismissed'];
const titles = ['Cán bộ có thái độ không tốt', 'Hồ sơ đăng ký khai sinh quá hạn', 'Cổng thông tin bị lỗi khi nộp hồ sơ', 'Không nhận được email thông báo', 'Thủ tục rườm rà, yêu cầu quá nhiều giấy tờ', 'Hệ thống thanh toán bị lỗi', 'Chưa nhận được kết quả sau 10 ngày', 'Cán bộ hướng dẫn không rõ ràng', 'Giao diện khó dùng', 'Yêu cầu bổ sung hồ sơ không hợp lý'];
const contents = ['Tôi lên phường nhưng cán bộ tỏ ra rất khó chịu và hướng dẫn không cụ thể.', 'Hồ sơ của tôi đã nộp từ tuần trước nhưng đến nay vẫn ở trạng thái chờ duyệt.', 'Hệ thống thông báo lỗi 500 khi tôi cố tải lên ảnh CCCD.', 'Tôi đã nộp thành công nhưng không thấy email xác nhận nào gửi về.', 'Cần phải làm lại quy trình cho đơn giản hơn, đòi hỏi quá nhiều giấy tờ.', 'Trang thanh toán quay vòng vòng mãi rồi báo lỗi.', 'Đã quá ngày hẹn trả kết quả 3 ngày nhưng vẫn chưa thấy phản hồi gì từ phường.', 'Tôi hỏi cán bộ cách điền mẫu mà họ chỉ bảo lên mạng tự tìm, thái độ rất quan liêu.', 'Hệ thống không tối ưu trên điện thoại di động, chữ rất nhỏ.', 'Cán bộ bắt bổ sung giấy tờ mà trong quy định không hề yêu cầu.'];

async function seed() {
  await sequelize.authenticate();
  const data = [];
  for (let i = 0; i < 120; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const content = contents[Math.floor(Math.random() * contents.length)] + ' (Mã ID: ' + Math.random().toString(36).substring(7).toUpperCase() + ')';
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    data.push({ title, content, topic, type: 'feedback', status });
  }
  await Comment.bulkCreate(data);
  console.log('Inserted 120 feedbacks');
  process.exit(0);
}

seed().catch(err => {
  console.error('SEED ERROR:', err);
  process.exit(1);
});
