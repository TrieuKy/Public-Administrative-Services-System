const { Post } = require('../models');
const { success, error } = require('../utils/response');

// GET /posts — public
exports.getPosts = async (req, res) => {
  try {
    const { isPublished } = req.query;
    const where = {};
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';

    // Auto-seed nếu bảng rỗng
    const count = await Post.count();
    if (count === 0) {
      await Post.bulkCreate([
        {
          title: 'Triển khai hệ thống định danh điện tử quốc gia VNeID 2.0',
          excerpt: 'Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử với nhiều tính năng mới...',
          content: 'Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử với nhiều tính năng mới...',
          imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400',
          category: 'Tin tức',
          isPublished: true,
          publishedAt: new Date('2026-03-28')
        },
        {
          title: 'Hướng dẫn đăng ký doanh nghiệp trực tuyến đơn giản, nhanh chóng',
          excerpt: 'Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc...',
          content: 'Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc...',
          imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
          category: 'Hướng dẫn',
          isPublished: true,
          publishedAt: new Date('2026-03-25')
        },
        {
          title: 'Nâng cấp hệ thống vào ngày 05/04/2026 từ 22h00 đến 02h00',
          excerpt: 'Hệ thống sẽ tạm thời gián đoạn để nâng cấp và bảo trì, quý khách vui lòng thực hiện giao dịch trước thời gian này...',
          content: 'Hệ thống sẽ tạm thời gián đoạn để nâng cấp và bảo trì.',
          imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
          category: 'Thông báo',
          isPublished: true,
          publishedAt: new Date('2026-03-22')
        },
        {
          title: 'Mở rộng danh mục 500 dịch vụ công trực tuyến mức độ 4',
          excerpt: 'Bộ Thông tin và Truyền thông công bố danh sách mở rộng các dịch vụ công trực tuyến toàn trình...',
          content: 'Bộ Thông tin và Truyền thông công bố danh sách mở rộng.',
          imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
          category: 'Tin tức',
          isPublished: true,
          publishedAt: new Date('2026-03-20')
        },
        {
          title: 'Cách tra cứu và thanh toán thuế trực tuyến qua Cổng Dịch vụ công',
          excerpt: 'Người dân và doanh nghiệp có thể tra cứu, kê khai và thanh toán thuế hoàn toàn trực tuyến...',
          content: 'Người dân và doanh nghiệp có thể tra cứu, kê khai và thanh toán thuế hoàn toàn trực tuyến.',
          imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400',
          category: 'Hướng dẫn',
          isPublished: true,
          publishedAt: new Date('2026-03-18')
        },
        {
          title: 'Tích hợp thanh toán điện tử và chữ ký số vào dịch vụ công',
          excerpt: 'Nền tảng cho phép người dùng thanh toán trực tuyến và ký số ngay trên giao diện dịch vụ công...',
          content: 'Nền tảng cho phép người dùng thanh toán trực tuyến và ký số.',
          imageUrl: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400',
          category: 'Tin tức',
          isPublished: true,
          publishedAt: new Date('2026-03-15')
        }
      ]);
    }

    const posts = await Post.findAll({
      where,
      order: [['publishedAt', 'DESC']],
    });

    return success(res, { posts, total: posts.length });
  } catch (err) { return error(res, err.message, 500); }
};

// POST /posts — officer/admin only
exports.createPost = async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl, category, isPublished } = req.body;
    if (!title) return error(res, 'Tiêu đề không được để trống', 400);

    const post = await Post.create({
      title, excerpt, content, imageUrl,
      category: category || 'Tin tức',
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
      authorId: req.user.id
    });
    return success(res, post, 'Tạo bài đăng thành công', 201);
  } catch (err) { return error(res, err.message, 500); }
};

// PUT /posts/:id — officer/admin only
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return error(res, 'Bài đăng không tồn tại', 404);

    const { title, excerpt, content, imageUrl, category, isPublished } = req.body;

    await post.update({
      title:       title       !== undefined ? title       : post.title,
      excerpt:     excerpt     !== undefined ? excerpt     : post.excerpt,
      content:     content     !== undefined ? content     : post.content,
      imageUrl:    imageUrl    !== undefined ? imageUrl    : post.imageUrl,
      category:    category    !== undefined ? category    : post.category,
      isPublished: isPublished !== undefined ? isPublished : post.isPublished,
      publishedAt: isPublished && !post.publishedAt ? new Date() : post.publishedAt,
    });

    return success(res, post, 'Cập nhật thành công');
  } catch (err) { return error(res, err.message, 500); }
};

// DELETE /posts/:id — officer/admin only
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return error(res, 'Bài đăng không tồn tại', 404);
    await post.destroy();
    return success(res, null, 'Xóa bài đăng thành công');
  } catch (err) { return error(res, err.message, 500); }
};
