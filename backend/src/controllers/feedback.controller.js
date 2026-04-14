const { Comment } = require('../models');
const { success, error } = require('../utils/response');

exports.submitFeedback = async (req, res) => {
  try {
    const { title, content, isAnonymous, topic } = req.body;
    
    // Construct the actual content based on what frontend sends
    const fullContent = `[${topic}] ${title}\n\n${content}`;
    
    const feedback = await Comment.create({
      applicationId: null,
      authorId: isAnonymous || !req.user ? null : req.user.id,
      content: fullContent,
      type: 'feedback'
    });

    return success(res, feedback, 'Gửi phản ánh thành công', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
