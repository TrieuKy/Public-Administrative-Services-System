// xác thực JWT token
const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return error(res, 'Chưa xác thực', 401);

  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return error(res, 'Token không hợp lệ hoặc hết hạn', 401);
  }
};