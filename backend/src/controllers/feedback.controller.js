const { Comment, User } = require('../models');
const { success, error } = require('../utils/response');

exports.submitFeedback = async (req, res) => {
  try {
    const { title, content, isAnonymous, topic } = req.body;
    if (!title || !content) return error(res, 'Vui lòng điền tiêu đề và nội dung', 400);

    const feedback = await Comment.create({
      applicationId: null,
      authorId: (isAnonymous || !req.user) ? null : req.user.id,
      title,
      content,
      topic: topic || 'Khác',
      type: 'feedback',
      status: 'pending',
    });

    return success(res, { id: feedback.id }, 'Gửi phản ánh thành công', 201);
  } catch (err) {
    console.error('[feedback]', err.message);
    return error(res, err.message, 500);
  }
};

// Officer: lấy danh sách phản ánh kiến nghị
exports.getFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = { type: 'feedback' };
    if (status) where.status = status;

    const { rows, count } = await Comment.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['fullName', 'email', 'cccd'], required: false }],
      order: [['createdAt', 'DESC']],
      limit: +limit,
      offset: (+page - 1) * +limit,
    });

    return success(res, { feedbacks: rows, total: count, page: +page });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Officer: cập nhật trạng thái phản ánh
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const fb = await Comment.findByPk(req.params.id);
    if (!fb || fb.type !== 'feedback') return error(res, 'Không tìm thấy phản ánh', 404);
    await fb.update({ status });
    return success(res, { status }, 'Cập nhật thành công');
  } catch (err) {
    return error(res, err.message, 500);
  }
};
