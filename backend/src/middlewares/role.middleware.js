// phân quyền người dùng
const { error } = require('../utils/response');

module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return error(res, 'Bạn không có quyền thực hiện hành động này', 403);
  next();
};