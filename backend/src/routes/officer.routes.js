const router = require('express').Router();
const ctrl   = require('../controllers/officer.controller');
const feedbackCtrl = require('../controllers/feedback.controller');
const auth   = require('../middlewares/auth.middleware');
const role   = require('../middlewares/role.middleware');

router.use(auth, role('officer', 'admin'));

router.get('/applications',                       ctrl.listApplications);
router.get('/applications/:id',                   ctrl.getApplicationDetail);
router.patch('/applications/:id/approve',         ctrl.approveApplication);
router.patch('/applications/:id/reject',          ctrl.rejectApplication);
router.patch('/applications/:id/request-supplement', ctrl.requestSupplement);
router.post('/applications/:id/notes',            ctrl.addNote);
router.get('/applications/:id/print',                   ctrl.printApplication);
router.get('/applications/:id/print-permit',            ctrl.printPermit);
router.get('/applications/:id/print-marriage',          ctrl.printMarriageCertificate);
router.get('/applications/:id/print-copy-auth',         ctrl.printCopyAuthentication);
router.get('/applications/:id/print-death',             ctrl.printDeathExtract);

router.get('/reviews',                            ctrl.getReviews);

// Phản ánh kiến nghị
router.get('/feedbacks',                          feedbackCtrl.getFeedbacks);
router.patch('/feedbacks/:id/status',             feedbackCtrl.updateFeedbackStatus);

module.exports = router;