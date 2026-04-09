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
    const { Op } = require('sequelize');
    const { email, password } = req.body;
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { cccd: email }] 
      } 
    });

    if (!user || !(await user.comparePassword(password)))
      return error(res, 'Email hoặc mật khẩu không đúng', 401);

    if (!user.isVerified)
      return error(res, 'Tài khoản chưa xác thực. Vui lòng kiểm tra Console Backend để lấy Link kích hoạt!', 403);

    const payload = { id: user.id, role: user.role };
    const accessToken  = jwt.sign(payload, process.env.JWT_SECRET,         { expiresIn: process.env.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET,  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    return success(res, { 
       accessToken, 
       refreshToken, 
       role: user.role, 
       fullName: user.fullName,
       cccd: user.cccd,
       expiresIn: 3600 
    });
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

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verifyToken'] }
    });
    if (!user) return error(res, 'Người dùng không tồn tại', 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return error(res, 'Người dùng không tồn tại', 404);
    
    const { 
      fullName, dob, phone, gender, pob, hometown, address, 
      taxCode, insuranceCode, passport, driverLicense,
      nationality, issueDate, expiryDate, issuePlace 
    } = req.body;

    await user.update({
      fullName: fullName || user.fullName,
      dob: dob !== undefined ? dob : user.dob,
      phone: phone !== undefined ? phone : user.phone,
      gender: gender !== undefined ? gender : user.gender,
      pob: pob !== undefined ? pob : user.pob,
      hometown: hometown !== undefined ? hometown : user.hometown,
      address: address !== undefined ? address : user.address,
      taxCode: taxCode !== undefined ? taxCode : user.taxCode,
      insuranceCode: insuranceCode !== undefined ? insuranceCode : user.insuranceCode,
      passport: passport !== undefined ? passport : user.passport,
      driverLicense: driverLicense !== undefined ? driverLicense : user.driverLicense,
      nationality: nationality !== undefined ? nationality : user.nationality,
      issueDate: issueDate !== undefined ? issueDate : user.issueDate,
      expiryDate: expiryDate !== undefined ? expiryDate : user.expiryDate,
      issuePlace: issuePlace !== undefined ? issuePlace : user.issuePlace
    });

    return success(res, user, 'Cập nhật thông tin thành công');
  } catch (err) {
    return error(res, err.message, 500);
  }
};