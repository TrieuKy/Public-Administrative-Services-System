const router = require('express').Router();
const ctrl   = require('../controllers/service.controller');
const auth   = require('../middlewares/auth.middleware');
const role   = require('../middlewares/role.middleware');

router.get('/',      ctrl.getServices);                                    // public
router.get('/:id',   ctrl.getServiceById);                                 // public
router.post('/',     auth, role('officer', 'admin'), ctrl.createService);  // officer/admin
router.put('/:id',   auth, role('officer', 'admin'), ctrl.updateService);  // officer/admin
router.delete('/:id', auth, role('officer', 'admin'), ctrl.deleteService); // officer/admin

module.exports = router;
