/**
 * reset.js — Script tái cấu trúc CSDL hoàn toàn
 * Xóa toàn bộ bảng cũ (kể cả có FK) rồi tạo lại + seed dữ liệu mẫu
 * Chạy: node scripts/reset.js
 */

require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
require('../src/models'); // load tất cả models và quan hệ
const { User, Service, Application, Document, Comment, AiLog, Notification, Schedule, ApplicationHistory, Post } = require('../src/models');

// ===================== DỮ LIỆU MẪU =====================

const SERVICES = [
  // Công dân
  { name: 'Đăng ký khai sinh',             category: 'individual',   agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 4', fee: 'Miễn phí',          requiredDocs: ['Giấy chứng sinh', 'CMND/CCCD cha mẹ', 'Giấy đăng ký kết hôn'], isActive: true },
  { name: 'Đăng ký kết hôn',               category: 'individual',   agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí',          requiredDocs: ['Giấy xác nhận tình trạng hôn nhân', 'CMND/CCCD hai bên', 'Sổ hộ khẩu'], isActive: true },
  { name: 'Đăng ký khai tử',               category: 'individual',   agency: 'Ủy ban nhân dân cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 4', fee: 'Miễn phí',          requiredDocs: ['Giấy báo tử', 'CMND/CCCD người thân'], isActive: true },
  { name: 'Đăng ký tạm trú',               category: 'individual',   agency: 'Công an cấp xã',          processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 4', fee: 'Miễn phí',          requiredDocs: ['Mẫu CT01 - Tờ khai thay đổi thông tin cư trú', 'Giấy tờ chứng minh chỗ ở hợp pháp'], isActive: true },
  { name: 'Đăng ký tạm vắng',              category: 'individual',   agency: 'Công an cấp xã',          processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí',          requiredDocs: ['CMND/CCCD', 'Sổ hộ khẩu'], isActive: true },
  { name: 'Chứng thực bản sao',             category: 'individual',   agency: 'Ủy ban nhân dân cấp xã', processingTime: 'Trong ngày',       processingDays: 1, level: 'Mức độ 4', fee: '5.000 VNĐ/trang',   requiredDocs: ['Bản gốc cần chứng thực', 'CMND/CCCD người yêu cầu'], isActive: true },
  { name: 'Chứng thực chữ ký',              category: 'individual',   agency: 'Ủy ban nhân dân cấp xã', processingTime: 'Trong ngày',       processingDays: 1, level: 'Mức độ 4', fee: '10.000 VNĐ',        requiredDocs: ['Giấy tờ cần chứng thực', 'CMND/CCCD'], isActive: true },
  { name: 'Giấy phép xây dựng nhà ở',      category: 'individual',   agency: 'Ủy ban nhân dân cấp xã', processingTime: '7 ngày làm việc', processingDays: 7, level: 'Mức độ 3', fee: '50.000 VNĐ',        requiredDocs: ['Đơn xin cấp phép xây dựng', 'Bản vẽ thiết kế', 'Sổ đỏ/Giấy chứng nhận quyền sử dụng đất'], isActive: true },
  // Hộ kinh doanh
  { name: 'Đăng ký hộ kinh doanh',         category: 'business',     agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 3', fee: '50.000 VNĐ',        requiredDocs: ['Mẫu đăng ký hộ kinh doanh', 'CMND/CCCD chủ hộ', 'Giấy tờ về địa điểm kinh doanh'], isActive: true },
  { name: 'Thay đổi nội dung hộ kinh doanh', category: 'business',   agency: 'Ủy ban nhân dân cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 3', fee: '30.000 VNĐ',        requiredDocs: ['Thông báo thay đổi nội dung đăng ký hộ kinh doanh', 'CMND/CCCD chủ hộ'], isActive: true },
  { name: 'Tạm ngừng kinh doanh',           category: 'business',     agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí',          requiredDocs: ['Thông báo tạm ngừng kinh doanh', 'Giấy chứng nhận đăng ký hộ kinh doanh'], isActive: true },
  { name: 'Chấm dứt hoạt động hộ kinh doanh', category: 'business',  agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí',          requiredDocs: ['Thông báo chấm dứt hoạt động', 'Giấy chứng nhận đăng ký hộ kinh doanh'], isActive: true },
  // Tổ chức
  { name: 'Giấy phép tổ chức lễ hội',      category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '5 ngày làm việc', processingDays: 5, level: 'Mức độ 3', fee: '100.000 VNĐ',       requiredDocs: ['Đơn xin cấp phép tổ chức lễ hội', 'Kịch bản chương trình', 'Danh sách ban tổ chức'], isActive: true },
  { name: 'Giấy phép hoạt động văn hóa cộng đồng', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 3', fee: '50.000 VNĐ', requiredDocs: ['Đơn xin cấp phép', 'Nội dung chương trình hoạt động'], isActive: true },
  { name: 'Đăng ký hoạt động tôn giáo',    category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '7 ngày làm việc', processingDays: 7, level: 'Mức độ 3', fee: 'Miễn phí',          requiredDocs: ['Đơn đăng ký hoạt động tôn giáo', 'Danh sách người đại diện'], isActive: true },
  { name: 'Xác nhận hộ nghèo/hộ cận nghèo', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '5 ngày làm việc', processingDays: 5, level: 'Mức độ 3', fee: 'Miễn phí',         requiredDocs: ['Đơn đề nghị xác nhận', 'Sổ hộ khẩu', 'CMND/CCCD'], isActive: true },
];

const POSTS = [
  { title: 'Triển khai hệ thống định danh điện tử quốc gia VNeID 2.0', excerpt: 'Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử với nhiều tính năng mới...', content: 'Ứng dụng VNeID 2.0 tích hợp xác thực sinh trắc học, bảo hiểm y tế điện tử và ký số trực tuyến. Cập nhật ngay trên App Store và Google Play.', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600', category: 'Tin tức', isPublished: true, publishedAt: new Date('2026-03-28') },
  { title: 'Hướng dẫn đăng ký doanh nghiệp trực tuyến đơn giản, nhanh chóng', excerpt: 'Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc...', content: 'Truy cập Cổng Dịch vụ Công, điền thông tin, tải hồ sơ và ký số. Không cần đến trực tiếp UBND.', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600', category: 'Hướng dẫn', isPublished: true, publishedAt: new Date('2026-03-25') },
  { title: 'Nâng cấp hệ thống vào ngày 05/04/2026 từ 22h00 đến 02h00', excerpt: 'Hệ thống sẽ tạm thời gián đoạn để nâng cấp và bảo trì, quý khách vui lòng thực hiện giao dịch trước thời gian này...', content: 'Cổng DỊCH VỤ CÔNG tạm ngưng từ 22h00 ngày 05/04 đến 02h00 ngày 06/04 để bảo trì.', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', category: 'Thông báo', isPublished: true, publishedAt: new Date('2026-03-22') },
  { title: 'Mở rộng danh mục 500 dịch vụ công trực tuyến mức độ 4', excerpt: 'Bộ Thông tin và Truyền thông công bố danh sách mở rộng các dịch vụ công trực tuyến toàn trình...', content: '500 dịch vụ công cấp độ 4 toàn trình, không cần bản giấy — bước tiến chuyển đổi số 2025-2030.', imageUrl: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600', category: 'Tin tức', isPublished: true, publishedAt: new Date('2026-03-20') },
  { title: 'Cách tra cứu và thanh toán thuế trực tuyến qua Cổng Dịch vụ công', excerpt: 'Người dân và doanh nghiệp có thể tra cứu, kê khai và thanh toán thuế hoàn toàn trực tuyến...', content: 'Hỗ trợ thanh toán qua thẻ ngân hàng, VNPay, MoMo và chuyển khoản — không cần đến cơ quan thuế.', imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600', category: 'Hướng dẫn', isPublished: true, publishedAt: new Date('2026-03-18') },
  { title: 'Tích hợp thanh toán điện tử và chữ ký số vào dịch vụ công', excerpt: 'Nền tảng cho phép người dùng thanh toán trực tuyến và ký số ngay trên giao diện dịch vụ công...', content: 'Hỗ trợ chữ ký số USB Token, SmartSign, và thanh toán qua VNPay, PayOS, QR Code ngân hàng.', imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', category: 'Tin tức', isPublished: true, publishedAt: new Date('2026-03-15') },
];

// ===================== MAIN =====================

async function reset() {
  try {
    console.log('🔄 Đang kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Kết nối thành công!\n');

    // ---- Bước 1: Xóa toàn bộ bảng cũ (tắt FK check trước) ----
    console.log('🗑️  Đang xóa toàn bộ bảng cũ...');
    await sequelize.query('SET session_replication_role = replica;'); // tắt FK constraints
    
    const tables = [
      'application_histories',
      'ai_logs',
      'comments',
      'notifications',
      'documents',
      'applications',
      'schedules',
      'posts',
      'services',
      'users',
    ];

    for (const table of tables) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
        console.log(`   ✓ Đã xóa bảng: ${table}`);
      } catch (e) {
        console.log(`   ⚠ Bỏ qua: ${table} (${e.message.split('\n')[0]})`);
      }
    }

    // Xóa các ENUM types cũ nếu có
    const enumTypes = [
      'enum_applications_status',
      'enum_comments_type',
      'enum_Posts_category',
      'enum_posts_category',
    ];
    for (const en of enumTypes) {
      try {
        await sequelize.query(`DROP TYPE IF EXISTS "${en}" CASCADE;`);
      } catch (_) {}
    }

    await sequelize.query('SET session_replication_role = DEFAULT;'); // bật lại FK
    console.log('\n✅ Xóa xong toàn bộ!\n');

    // ---- Bước 2: Tạo lại bảng theo models ----
    console.log('🔨 Đang tạo lại bảng từ models...');
    await sequelize.sync({ force: false }); // tạo mới (bảng đã xóa nên an toàn)
    console.log('✅ Tạo bảng hoàn tất!\n');

    // ---- Bước 3: Seed Users ----
    console.log('👤 Đang tạo tài khoản...');

    const citizen = await User.create({
      fullName: 'Trần Thị Công Dân',
      email: 'citizen@example.com',
      password: '123456',           // hook beforeCreate tự hash
      cccd: '079200012345',
      phone: '0901234567',
      role: 'citizen',
      isVerified: true,
    });
    console.log(`   ✓ Công dân: citizen@example.com / 123456`);

    const officer = await User.create({
      fullName: 'Nguyễn Văn B',
      email: 'nguyenvanb@bennghe.gov.vn',
      password: '123456',           // hook beforeCreate tự hash
      cccd: 'C82024001',
      phone: '0912345678',
      role: 'officer',
      isVerified: true,
      officerCode: 'C82024001',
      department: 'UBND Phường Bến Nghé',
      position: 'Cán bộ tiếp nhận hồ sơ',
      address: 'UBND Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    });
    console.log(`   ✓ Cán bộ  : nguyenvanb@bennghe.gov.vn / 123456`);

    // ---- Bước 4: Seed Services ----
    console.log('\n📋 Đang tạo dịch vụ công...');
    const createdServices = await Service.bulkCreate(SERVICES);
    console.log(`   ✓ Đã tạo ${createdServices.length} dịch vụ công`);

    // ---- Bước 5: Seed Posts ----
    console.log('\n📰 Đang tạo bài đăng tin tức...');
    const postsWithAuthor = POSTS.map(p => ({ ...p, authorId: officer.id }));
    const createdPosts = await Post.bulkCreate(postsWithAuthor);
    console.log(`   ✓ Đã tạo ${createdPosts.length} bài đăng`);

    // ---- Bước 6: Seed Schedules ----
    console.log('\n📅 Đang tạo lịch công tác mẫu...');
    const today = new Date().toISOString().split('T')[0];
    await Schedule.bulkCreate([
      { userId: officer.id, title: 'Tiếp nhận hồ sơ buổi sáng',                  timeInfo: '08:00', date: today, priority: 'normal', status: 'completed' },
      { userId: officer.id, title: 'Duyệt 5 hồ sơ khai sinh đang chờ',            timeInfo: '09:30', date: today, priority: 'urgent', status: 'pending'   },
      { userId: officer.id, title: 'Họp bộ phận một cửa',                          timeInfo: '10:00', date: today, priority: 'normal', status: 'pending'   },
      { userId: officer.id, title: 'Tiếp nhận hồ sơ buổi chiều',                  timeInfo: '13:30', date: today, priority: 'normal', status: 'pending'   },
      { userId: officer.id, title: 'Báo cáo kết quả tuần cho trưởng bộ phận',     timeInfo: '15:00', date: today, priority: 'urgent', status: 'pending'   },
    ]);
    console.log(`   ✓ Đã tạo 5 lịch công tác mẫu`);

    // ---- Tóm tắt ----
    console.log('\n' + '='.repeat(50));
    console.log('🎉 RESET VÀ SEED HOÀN TẤT!');
    console.log('='.repeat(50));
    console.log('\n📌 Tài khoản mặc định:');
    console.log('   Cán bộ  : nguyenvanb@bennghe.gov.vn / 123456');
    console.log('   Công dân: citizen@example.com / 123456');
    console.log('\n📊 Dữ liệu đã tạo:');
    console.log(`   - ${createdServices.length} dịch vụ công (8 Công dân, 4 HKD, 4 Tổ chức)`);
    console.log(`   - ${createdPosts.length} bài đăng tin tức`);
    console.log(`   - 5 lịch công tác mẫu`);
    console.log('\n🚀 Khởi động lại server backend để áp dụng!');

  } catch (err) {
    console.error('\n❌ LỖI:', err.message);
    console.error(err.stack);
  } finally {
    process.exit(0);
  }
}

reset();
