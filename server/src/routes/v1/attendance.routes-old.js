// server/src/routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

// Employee self endpoints
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/my', attendanceController.getMyAttendance);

// Manager/Supervisor endpoints
router.get('/team', authorize(['manager', 'supervisor']), attendanceController.getTeamAttendance);

// Admin/HR endpoints
router.get('/absent', authorize(['admin', 'super_admin', 'hr']), attendanceController.getAbsentEmployees);

module.exports = router;