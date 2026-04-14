require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
const { Service, Post } = require('../src/models');

const SERVICES = [
  // --- Công dân ---
  { name: 'Đăng ký khai sinh', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Giấy chứng sinh', 'CMND/CCCD cha mẹ', 'Giấy đăng ký kết hôn'], isActive: true },
  { name: 'Đăng ký kết hôn', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Giấy xác nhận tình trạng hôn nhân', 'CMND/CCCD hai bên', 'Sổ hộ khẩu'], isActive: true },
  { name: 'Đăng ký khai tử', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Giấy báo tử', 'CMND/CCCD người thân'], isActive: true },
  { name: 'Đăng ký tạm trú', category: 'individual', agency: 'Công an cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Mẫu CT01 - Tờ khai thay đổi thông tin cư trú', 'Giấy tờ chứng minh chỗ ở hợp pháp'], isActive: true },
  { name: 'Đăng ký tạm vắng', category: 'individual', agency: 'Công an cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['CMND/CCCD', 'Sổ hộ khẩu'], isActive: true },
  { name: 'Chứng thực bản sao', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: 'Trong ngày', processingDays: 1, level: 'Mức độ 4', fee: '5.000 VNĐ/trang', requiredDocs: ['Bản gốc cần chứng thực', 'CMND/CCCD người yêu cầu'], isActive: true },
  { name: 'Chứng thực chữ ký', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: 'Trong ngày', processingDays: 1, level: 'Mức độ 4', fee: '10.000 VNĐ', requiredDocs: ['Giấy tờ cần chứng thực', 'CMND/CCCD'], isActive: true },
  { name: 'Giấy phép xây dựng nhà ở', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '7 ngày làm việc', processingDays: 7, level: 'Mức độ 3', fee: '50.000 VNĐ', requiredDocs: ['Đơn xin cấp phép xây dựng', 'Bản vẽ thiết kế', 'Sổ đỏ/Giấy chứng nhận quyền sử dụng đất'], isActive: true },
  // --- Hộ kinh doanh ---
  { name: 'Đăng ký hộ kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 3', fee: '50.000 VNĐ', requiredDocs: ['Mẫu đăng ký hộ kinh doanh', 'CMND/CCCD chủ hộ', 'Giấy tờ về địa điểm kinh doanh'], isActive: true },
  { name: 'Thay đổi nội dung hộ kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 3', fee: '30.000 VNĐ', requiredDocs: ['Thông báo thay đổi nội dung đăng ký hộ kinh doanh', 'CMND/CCCD chủ hộ'], isActive: true },
  { name: 'Tạm ngừng kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Thông báo tạm ngừng kinh doanh', 'Giấy chứng nhận đăng ký hộ kinh doanh'], isActive: true },
  { name: 'Chấm dứt hoạt động hộ kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Thông báo chấm dứt hoạt động', 'Giấy chứng nhận đăng ký hộ kinh doanh'], isActive: true },
  // --- Tổ chức ---
  { name: 'Giấy phép tổ chức lễ hội', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '5 ngày làm việc', processingDays: 5, level: 'Mức độ 3', fee: '100.000 VNĐ', requiredDocs: ['Đơn xin cấp phép tổ chức lễ hội', 'Kịch bản chương trình', 'Danh sách ban tổ chức'], isActive: true },
  { name: 'Giấy phép hoạt động văn hóa cộng đồng', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 3', fee: '50.000 VNĐ', requiredDocs: ['Đơn xin cấp phép', 'Nội dung chương trình hoạt động'], isActive: true },
  { name: 'Đăng ký hoạt động tôn giáo', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '7 ngày làm việc', processingDays: 7, level: 'Mức độ 3', fee: 'Miễn phí', requiredDocs: ['Đơn đăng ký hoạt động tôn giáo', 'Danh sách người đại diện'], isActive: true },
  { name: 'Xác nhận hộ nghèo/hộ cận nghèo', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '5 ngày làm việc', processingDays: 5, level: 'Mức độ 3', fee: 'Miễn phí', requiredDocs: ['Đơn đề nghị xác nhận', 'Sổ hộ khẩu', 'CMND/CCCD'], isActive: true },
];

const POSTS = [
  {
    title: 'Triển khai hệ thống định danh điện tử quốc gia VNeID 2.0',
    excerpt: 'Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử với nhiều tính năng mới...',
    content: 'Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử quốc gia VNeID 2.0 với nhiều tính năng mới như xác thực sinh trắc học, tích hợp bảo hiểm y tế điện tử, và ký số trực tuyến. Người dân có thể cập nhật ứng dụng ngay trên App Store và Google Play.',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
    category: 'Tin tức', isPublished: true, publishedAt: new Date('2026-03-28')
  },
  {
    title: 'Hướng dẫn đăng ký doanh nghiệp trực tuyến đơn giản, nhanh chóng',
    excerpt: 'Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc...',
    content: 'Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc. Người dân và doanh nghiệp chỉ cần truy cập Cổng Dịch vụ Công, điền thông tin, tải lên hồ sơ và ký số. Không cần đến trực tiếp trụ sở UBND.',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
    category: 'Hướng dẫn', isPublished: true, publishedAt: new Date('2026-03-25')
  },
  {
    title: 'Nâng cấp hệ thống vào ngày 05/04/2026 từ 22h00 đến 02h00',
    excerpt: 'Hệ thống sẽ tạm thời gián đoạn để nâng cấp và bảo trì, quý khách vui lòng thực hiện giao dịch trước thời gian này...',
    content: 'Hệ thống Cổng Dịch vụ Công sẽ tạm thời gián đoạn từ 22h00 ngày 05/04/2026 đến 02h00 ngày 06/04/2026 để nâng cấp hạ tầng và cải thiện hiệu năng. Trong thời gian này, tất cả các giao dịch trực tuyến sẽ tạm ngưng. Quý khách vui lòng hoàn thành giao dịch trước hoặc sau khoảng thời gian bảo trì.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
    category: 'Thông báo', isPublished: true, publishedAt: new Date('2026-03-22')
  },
  {
    title: 'Mở rộng danh mục 500 dịch vụ công trực tuyến mức độ 4',
    excerpt: 'Bộ Thông tin và Truyền thông công bố danh sách mở rộng các dịch vụ công trực tuyến toàn trình...',
    content: 'Bộ Thông tin và Truyền thông vừa công bố danh sách mở rộng 500 dịch vụ công trực tuyến cấp độ 4 - toàn trình và không cần xuất trình bản giấy. Đây là bước tiến quan trọng trong lộ trình chuyển đổi số quốc gia giai đoạn 2025-2030.',
    imageUrl: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600',
    category: 'Tin tức', isPublished: true, publishedAt: new Date('2026-03-20')
  },
  {
    title: 'Cách tra cứu và thanh toán thuế trực tuyến qua Cổng Dịch vụ công',
    excerpt: 'Người dân và doanh nghiệp có thể tra cứu, kê khai và thanh toán thuế hoàn toàn trực tuyến...',
    content: 'Người dân và doanh nghiệp có thể tra cứu số tiền thuế phải nộp, kê khai và thanh toán hoàn toàn trực tuyến thông qua Cổng Dịch vụ Công mà không cần đến cơ quan thuế. Hệ thống hỗ trợ nhiều phương thức thanh toán: thẻ ngân hàng, VNPay, MoMo, và chuyển khoản.',
    imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600',
    category: 'Hướng dẫn', isPublished: true, publishedAt: new Date('2026-03-18')
  },
  {
    title: 'Tích hợp thanh toán điện tử và chữ ký số vào dịch vụ công',
    excerpt: 'Nền tảng cho phép người dùng thanh toán trực tuyến và ký số ngay trên giao diện dịch vụ công...',
    content: 'Nền tảng Cổng Dịch vụ Công nay hỗ trợ tích hợp chữ ký số và thanh toán điện tử trực tiếp trong quy trình nộp hồ sơ. Người dân có thể ký số bằng USB Token hoặc SmartSign, đồng thời thanh toán phí trực tiếp qua VNPay, PayOS, và QR Code ngân hàng.',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
    category: 'Tin tức', isPublished: true, publishedAt: new Date('2026-03-15')
  },
];

async function seed() {
  try {
    console.log('🔄 Đang kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    // Đồng bộ bảng mới (Post) nếu chưa tồn tại
    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ schema thành công!');

    // --- Seed Services ---
    const existingServices = await Service.count();
    if (existingServices === 0) {
      await Service.bulkCreate(SERVICES);
      console.log(`✅ Đã tạo ${SERVICES.length} dịch vụ công!`);
    } else {
      console.log(`ℹ️  Đã có ${existingServices} dịch vụ trong DB, bỏ qua seed services.`);
      console.log('   👉 Nếu muốn reset: xóa bảng services rồi chạy lại script này.');
    }

    // --- Seed Posts ---
    const existingPosts = await Post.count();
    if (existingPosts === 0) {
      await Post.bulkCreate(POSTS);
      console.log(`✅ Đã tạo ${POSTS.length} bài đăng tin tức!`);
    } else {
      console.log(`ℹ️  Đã có ${existingPosts} bài đăng trong DB, bỏ qua seed posts.`);
    }

    console.log('\n🎉 Seed dữ liệu hoàn tất!');
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
