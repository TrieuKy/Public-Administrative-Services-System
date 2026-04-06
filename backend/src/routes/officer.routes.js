const router = require('express').Router();
const ctrl   = require('../controllers/officer.controller');
const auth   = require('../middlewares/auth.middleware');
const role   = require('../middlewares/role.middleware');

router.use(auth, role('officer', 'admin'));

router.get('/applications',                       ctrl.listApplications);
router.get('/applications/:id',                   ctrl.getApplicationDetail);
router.patch('/applications/:id/approve',         ctrl.approveApplication);
router.patch('/applications/:id/reject',          ctrl.rejectApplication);
router.patch('/applications/:id/request-supplement', ctrl.requestSupplement);
router.post('/applications/:id/notes',            ctrl.addNote);

module.exports = router;