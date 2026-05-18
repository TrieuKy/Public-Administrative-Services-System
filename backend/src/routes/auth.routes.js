const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { required, minLength, maxLength, isEmail } = validate;

// Schema validate
const registerSchema = {
  fullName: [required('Họ tên là bắt buộc'), minLength(2), maxLength(100)],
  email:    [required('Email là bắt buộc'), isEmail()],
  password: [required('Mật khẩu là bắt buộc'), minLength(6, 'Mật khẩu tối thiểu 6 ký tự')],
};

const loginSchema = {
  email:    [required('Email/CCCD là bắt buộc')],
  password: [required('Mật khẩu là bắt buộc')],
};

router.post('/register',     validate(registerSchema), ctrl.register);
router.get('/verify-email',  ctrl.verifyEmail);
router.post('/login',        validate(loginSchema), ctrl.login);
router.post('/refresh',      ctrl.refresh);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

router.get('/me', authMiddleware, ctrl.getMe);
router.put('/me', authMiddleware, ctrl.updateMe);

module.exports = router;