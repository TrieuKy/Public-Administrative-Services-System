const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.use(auth, role('officer', 'admin'));

router.get('/overview', dashboardController.getOverviewStats);
router.get('/reports', dashboardController.getReports);
router.get('/schedules', dashboardController.getSchedules);
router.post('/schedules', dashboardController.addSchedule);
router.delete('/schedules/:id', dashboardController.deleteSchedule);

router.get('/profile', dashboardController.getProfile);
router.put('/profile', dashboardController.updateProfile);

module.exports = router;
