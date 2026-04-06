const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { success, error } = require('../utils/response');
const emailService = require('../services/email.service');

exports.register = async (req, res) => {
  try {
    const { fullName, cccd, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return error(res, 'Email đã tồn tại', 409);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ fullName, cccd, email, password, verifyToken });

    await emailService.sendVerificationEmail(email, verifyToken);

    return success(res, { userId: user.id }, 'Đăng ký thành công, vui lòng xác nhận email', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ where: { verifyToken: token } });
    if (!user) return error(res, 'Token không hợp lệ hoặc đã hết hạn', 400);

    await user.update({ isVerified: true, verifyToken: null });
    return success(res, null, 'Email xác thực thành công');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password)))
      return error(res, 'Email hoặc mật khẩu không đúng', 401);

    if (!user.isVerified)
      return error(res, 'Tài khoản chưa xác thực email', 403);

    const payload = { id: user.id, role: user.role };
    const accessToken  = jwt.sign(payload, process.env.JWT_SECRET,         { expiresIn: process.env.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET,  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    return success(res, { accessToken, refreshToken, role: user.role, expiresIn: 3600 });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return success(res, { accessToken, expiresIn: 3600 });
  } catch {
    return error(res, 'Refresh token hết hạn hoặc không hợp lệ', 401);
  }
};