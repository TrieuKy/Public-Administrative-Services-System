/**
 * seed-ratings.js
 * Chạy: node scripts/seed-ratings.js
 * Thêm rating cho các hồ sơ COMPLETED chưa có rating, để test OfficerReviews
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Application } = require('../src/models');

const RATINGS_SEED = [
  { rating: 5, ratingContent: 'Dịch vụ rất tốt, cán bộ nhiệt tình hỗ trợ!' },
  { rating: 4, ratingContent: 'Xử lý nhanh, thủ tục đơn giản, hài lòng.' },
  { rating: 5, ratingContent: 'Tuyệt vời! Không cần đến trực tiếp, tiết kiệm thời gian.' },
  { rating: 3, ratingContent: 'Bình thường, cần cải thiện thời gian phản hồi.' },
  { rating: 4, ratingContent: 'Tốt, nhưng giao diện cần thân thiện hơn.' },
  { rating: 5, ratingContent: 'Rất hài lòng, sẽ tiếp tục sử dụng dịch vụ.' },
  { rating: 2, ratingContent: 'Thời gian xử lý quá lâu, cần cải thiện.' },
  { rating: 5, ratingContent: 'Nhanh chóng, tiện lợi, xứng đáng 5 sao!' },
];

async function seedRatings() {
  try {
    const completedApps = await Application.findAll({
      where: { status: 'COMPLETED', rating: null },
      limit: RATINGS_SEED.length,
    });

    if (completedApps.length === 0) {
      console.log('⚠️  Không có hồ sơ COMPLETED nào chưa có rating.');
      console.log('   Hãy chạy seedData.js trước để có dữ liệu mẫu.');
      process.exit(0);
    }

    for (let i = 0; i < completedApps.length; i++) {
      const seed = RATINGS_SEED[i % RATINGS_SEED.length];
      await completedApps[i].update({
        rating: seed.rating,
        ratingContent: seed.ratingContent,
      });
      console.log(`✅ Rating ${seed.rating}⭐ → ${completedApps[i].applicationCode}`);
    }

    console.log(`\n🎉 Đã seed ${completedApps.length} đánh giá thành công!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi seed ratings:', err.message);
    process.exit(1);
  }
}

seedRatings();
