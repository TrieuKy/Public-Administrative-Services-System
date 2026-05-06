const router = require('express').Router();
const ctrl   = require('../controllers/payment.controller');
const auth   = require('../middlewares/auth.middleware');

/**
 * POST   /api/v1/payments          — Tạo giao dịch thanh toán mới
 * POST   /api/v1/payments/:id/confirm — Xác nhận thanh toán thành công
 * GET    /api/v1/payments/my        — Lịch sử thanh toán của tôi
 * GET    /api/v1/payments/:id       — Chi tiết một giao dịch
 */

router.get ('/my',           auth, ctrl.getMyPayments);
router.post('/',             auth, ctrl.createPayment);
router.post('/:id/confirm',  auth, ctrl.confirmPayment);
router.get ('/:id',          auth, ctrl.getPaymentById);

module.exports = router;
