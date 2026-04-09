const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');

const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register',     ctrl.register);
router.get('/verify-email',  ctrl.verifyEmail);
router.post('/login',        ctrl.login);
router.post('/refresh',      ctrl.refresh);

router.get('/me', authMiddleware, ctrl.getMe);
router.put('/me', authMiddleware, ctrl.updateMe);

module.exports = router;