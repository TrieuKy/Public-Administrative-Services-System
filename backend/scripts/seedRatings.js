require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
const { Application, User, Service } = require('../src/models');

const COMMENTS = [
  "Rất hài lòng với thái độ phục vụ của cán bộ.",
  "Dịch vụ công trực tuyến rất nhanh chóng và tiện lợi.",
  "Giao diện dễ sử dụng, tôi không gặp khó khăn gì.",
  "Cán bộ nhiệt tình hướng dẫn, xử lý hồ sơ đúng hạn.",
  "Tuyệt vời, tiết kiệm được rất nhiều thời gian đi lại.",
  "Thủ tục rõ ràng, minh bạch.",
  "Hệ thống ổn định, thông báo SMS kịp thời.",
  "Mong có thêm nhiều dịch vụ công trực tuyến như thế này."
];

async function seed() {
  try {
    console.log('🔄 Đang kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    // Lấy các hồ sơ đã hoàn thành (COMPLETED)
    const completedApps = await Application.findAll({ where: { status: 'COMPLETED' } });

    if (completedApps.length > 0) {
      console.log(`Tìm thấy ${completedApps.length} hồ sơ đã hoàn thành. Đang tiến hành đánh giá...`);
      for (const app of completedApps) {
        // Random từ 4 đến 5 sao
        const randomRating = Math.random() > 0.3 ? 5 : 4; 
        const randomComment = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
        
        await app.update({
          rating: randomRating,
          ratingContent: randomComment
        });
      }
      console.log('✅ Đã cập nhật đánh giá cho các hồ sơ hiện có!');
    } else {
      console.log('⚠️ Không có hồ sơ nào ở trạng thái COMPLETED.');
      console.log('🔄 Đang tự động tạo dữ liệu mẫu hồ sơ đã hoàn thành kèm đánh giá...');

      const citizen = await User.findOne({ where: { role: 'citizen' } });
      const service = await Service.findOne();

      if (!citizen || !service) {
        console.log('❌ Lỗi: Cần có ít nhất 1 citizen và 1 service trong database.');
        process.exit(1);
      }

      const mockApps = [];
      for (let i = 0; i < 5; i++) {
        const rating = Math.random() > 0.3 ? 5 : 4;
        const ratingContent = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
        
        mockApps.push({
          citizenId: citizen.id,
          serviceId: service.id,
          status: 'COMPLETED',
          formData: { note: 'Hồ sơ mẫu đánh giá hài lòng' },
          rating,
          ratingContent
        });
      }

      await Application.bulkCreate(mockApps);
      console.log('✅ Đã tạo thành công 5 hồ sơ mẫu có đánh giá!');
    }

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
