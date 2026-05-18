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

    // Gửi email xác thực — bắt lỗi riêng để không block đăng ký
    let emailSent = false;
    try {
      await emailService.sendVerificationEmail(email, verifyToken);
      emailSent = true;
    } catch (emailErr) {
      console.error('[Email] Không thể gửi email xác thực:', emailErr.message);
      // In link kích hoạt ra console để developer có thể test thủ công
      const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verifyToken}`;
      console.log('\n=================================================');
      console.log('⚠️  SMTP chưa cấu hình — Link xác thực thủ công:');
      console.log(verifyUrl);
      console.log('=================================================\n');
    }

    const message = emailSent
      ? 'Đăng ký thành công, vui lòng kiểm tra email để xác nhận tài khoản'
      : 'Đăng ký thành công! Email xác thực gặp sự cố — vui lòng liên hệ admin để kích hoạt tài khoản';

    return success(res, { userId: user.id }, message, 201);
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
       id: user.id,
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
    
    // If updating password, verify current password first
    if (req.body.password) {
      const { currentPassword } = req.body;
      if (!currentPassword) return error(res, 'Vui lòng cung cấp mật khẩu hiện tại để đổi mật khẩu', 400);
      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) return error(res, 'Mật khẩu hiện tại không đúng', 401);
    }
    
    const { 
      fullName, dob, phone, gender, pob, hometown, address, cccd,
      taxCode, insuranceCode, passport, driverLicense,
      nationality, issueDate, expiryDate, issuePlace, password 
    } = req.body;

    const updateData = {
      fullName:       fullName        !== undefined ? fullName        : user.fullName,
      dob:            dob             !== undefined ? dob             : user.dob,
      phone:          phone           !== undefined ? phone           : user.phone,
      gender:         gender          !== undefined ? gender          : user.gender,
      pob:            pob             !== undefined ? pob             : user.pob,
      hometown:       hometown        !== undefined ? hometown        : user.hometown,
      address:        address         !== undefined ? address         : user.address,
      cccd:           cccd            !== undefined ? cccd            : user.cccd,
      taxCode:        taxCode         !== undefined ? taxCode         : user.taxCode,
      insuranceCode:  insuranceCode   !== undefined ? insuranceCode   : user.insuranceCode,
      passport:       passport        !== undefined ? passport        : user.passport,
      driverLicense:  driverLicense   !== undefined ? driverLicense   : user.driverLicense,
      nationality:    nationality     !== undefined ? nationality     : user.nationality,
      issueDate:      issueDate       !== undefined ? issueDate       : user.issueDate,
      expiryDate:     expiryDate      !== undefined ? expiryDate      : user.expiryDate,
      issuePlace:     issuePlace      !== undefined ? issuePlace      : user.issuePlace,
    };
    
    if (password) {
      updateData.password = password;
    }

    await user.update(updateData);

    // Reload để trả về dữ liệu mới nhất
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verifyToken'] }
    });

    return success(res, updatedUser, 'Cập nhật thông tin thành công');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email là bắt buộc', 400);

    const user = await User.findOne({ where: { email } });
    
    // Luôn trả về success để không lộ thông tin user tồn tại hay không (bảo mật)
    if (!user) {
      return success(res, null, 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu');
    }

    // Tạo reset token (dùng lại verifyToken field)
    const resetToken = crypto.randomBytes(32).toString('hex');
    await user.update({ verifyToken: resetToken });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    let emailSent = false;
    try {
      await emailService.sendResetPasswordEmail(email, resetToken);
      emailSent = true;
    } catch (emailErr) {
      console.log('\n=================================================');
      console.log('⚠️  Link đặt lại mật khẩu (thủ công):');
      console.log(resetUrl);
      console.log('=================================================\n');
    }

    return success(res, null, 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return error(res, 'Token và mật khẩu mới là bắt buộc', 400);

    const user = await User.findOne({ where: { verifyToken: token } });
    if (!user) return error(res, 'Token không hợp lệ hoặc đã hết hạn', 400);

    await user.update({
      password: newPassword,
      verifyToken: null
    });

    return success(res, null, 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
  } catch (err) {
    return error(res, err.message, 500);
  }
};