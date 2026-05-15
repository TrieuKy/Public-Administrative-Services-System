const router = require('express').Router();
const ctrl   = require('../controllers/service.controller');
const auth   = require('../middlewares/auth.middleware');
const role   = require('../middlewares/role.middleware');

const upload = require('../middlewares/upload.middleware');

router.get('/',      ctrl.getServices);                                    // public
router.get('/:id',   ctrl.getServiceById);                                 // public
router.post('/',     auth, role('officer', 'admin'), ctrl.createService);  // officer/admin
router.put('/:id',   auth, role('officer', 'admin'), ctrl.updateService);  // officer/admin
router.delete('/:id', auth, role('officer', 'admin'), ctrl.deleteService); // officer/admin
router.post('/template/upload', auth, role('officer', 'admin'), upload.single('file'), ctrl.uploadTemplate); // upload form template

module.exports = router;
