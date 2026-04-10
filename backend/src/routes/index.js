const router = require('express').Router();

router.use('/auth',         require('./auth.routes'));
router.use('/applications', require('./application.routes'));
router.use('/services',     require('./service.routes'));
router.use('/officer/dashboard', require('./dashboard.routes'));
router.use('/officer',      require('./officer.routes'));
router.use('/ai',           require('./ai.routes'));

module.exports = router;