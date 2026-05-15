const router = require('express').Router();
const ctrl   = require('../controllers/payment.controller');
const auth   = require('../middlewares/auth.middleware');
const role   = require('../middlewares/role.middleware');

/**
 * POST   /api/v1/payments               — Tạo giao dịch thanh toán mới
 * POST   /api/v1/payments/:id/confirm   — Xác nhận thanh toán thành công
 * GET    /api/v1/payments/my            — Lịch sử thanh toán của tôi
 * GET    /api/v1/payments/officer/all             — [Officer] Tất cả giao dịch
 * GET    /api/v1/payments/officer/unpaid-applications — [Officer] Hồ sơ chưa thanh toán
 * GET    /api/v1/payments/officer/notifications        — [Officer] Thông báo
 * GET    /api/v1/payments/:id           — Chi tiết một giao dịch
 */

router.get ('/my',                            auth, ctrl.getMyPayments);
router.get ('/officer/all',                   auth, role('officer','admin'), ctrl.getAllPayments);
router.get ('/officer/unpaid-applications',   auth, role('officer','admin'), ctrl.getUnpaidApplications);
router.get ('/officer/notifications',         auth, role('officer','admin'), ctrl.getOfficerNotifications);
router.post('/',                              auth, ctrl.createPayment);
router.post('/:id/confirm',                   auth, ctrl.confirmPayment);
router.get ('/:id',                           auth, ctrl.getPaymentById);

module.exports = router;
