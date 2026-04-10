const router   = require('express').Router();
const ctrl     = require('../controllers/application.controller');

router.get('/',            ctrl.getServices);
router.get('/:serviceId', ctrl.getServiceById);

module.exports = router;
