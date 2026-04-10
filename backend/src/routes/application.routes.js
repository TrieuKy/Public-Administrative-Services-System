const router   = require('express').Router();
const ctrl     = require('../controllers/application.controller');
const auth     = require('../middlewares/auth.middleware');
const role     = require('../middlewares/role.middleware');
const upload   = require('../middlewares/upload.middleware');


router.get('/',              auth, role('citizen'), ctrl.getMyApplications);
router.post('/',             auth, role('citizen'), ctrl.createApplication);
router.get('/:id',           auth, role('citizen'), ctrl.getApplicationDetail);
router.post('/:id/documents',auth, role('citizen'), upload.single('file'), ctrl.uploadDocument);
router.post('/:id/submit',   auth, role('citizen'), ctrl.submitApplication);
router.post('/:id/supplement',auth,role('citizen'), upload.single('file'), ctrl.supplementDocument);
router.delete('/:id',        auth, role('citizen'), ctrl.cancelApplication);
router.post('/:id/rate',     auth, role('citizen'), ctrl.rateApplication);

module.exports = router;