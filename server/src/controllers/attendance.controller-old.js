// server/src/controllers/attendance.controller.js
const Attendance = require('../models/Attendance.model');
const User = require('../models/User.model');

// Check In
exports.checkIn = async (req, res) => {
  try {
    const { gpsLocation, method, image } = req.body;
    const employeeId = req.user._id || req.userId;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    if (existingAttendance && existingAttendance.checkIn.time) {
      return res.status(400).json({ success: false, error: 'Already checked in today' });
    }
    
    const checkInTime = new Date();
    const expectedCheckIn = new Date();
    expectedCheckIn.setHours(9, 0, 0); // 9:00 AM expected
    
    let lateMinutes = 0;
    if (checkInTime > expectedCheckIn) {
      lateMinutes = Math.floor((checkInTime - expectedCheckIn) / (1000 * 60));
    }
    
    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } },
      {
        employeeId,
        date: today,
        checkIn: { time: checkInTime, gpsLocation, method, image, ipAddress: req.ip },
        status: lateMinutes > 0 ? 'late' : 'present',
        lateMinutes
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, data: attendance, message: 'Check-in successful' });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check Out
exports.checkOut = async (req, res) => {
  try {
    const { gpsLocation, method, image } = req.body;
    const employeeId = req.user._id || req.userId;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    if (!attendance) {
      return res.status(404).json({ success: false, error: 'No check-in found for today' });
    }
    
    if (attendance.checkOut.time) {
      return res.status(400).json({ success: false, error: 'Already checked out' });
    }
    
    const checkOutTime = new Date();
    attendance.checkOut = { time: checkOutTime, gpsLocation, method, image };
    
    // Calculate total hours and overtime
    const hours = (checkOutTime - attendance.checkIn.time) / (1000 * 60 * 60);
    attendance.totalHours = Math.round(hours * 10) / 10;
    
    if (attendance.totalHours > 8) {
      attendance.overtimeHours = Math.round((attendance.totalHours - 8) * 10) / 10;
    }
    
    await attendance.save();
    
    res.json({ success: true, data: attendance, message: 'Check-out successful' });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get My Attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id || req.userId;
    const { month, year, page = 1, limit = 30 } = req.query;
    
    const queryDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
    const startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
    const endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0);
    
    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
    
    // Calculate monthly summary
    const totalDays = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0).getDate();
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;
    const absentDays = totalDays - attendance.length;
    const leaveDays = attendance.filter(a => a.status === 'leave').length;
    
    // Today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.findOne({
      employeeId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    res.json({
      success: true,
      data: {
        currentMonth: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          leaveDays,
          attendancePercentage: Math.round((presentDays / totalDays) * 100)
        },
        today: todayAttendance ? {
          status: todayAttendance.status,
          checkInTime: todayAttendance.checkIn.time,
          checkOutTime: todayAttendance.checkOut.time,
          totalHours: todayAttendance.totalHours,
          lateMinutes: todayAttendance.lateMinutes
        } : { status: 'absent', checkInTime: null, checkOutTime: null, totalHours: 0 },
        attendanceList: attendance,
        pagination: { page: parseInt(page), limit: parseInt(limit), total: attendance.length }
      }
    });
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Team Attendance (Manager/Supervisor)
exports.getTeamAttendance = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id || req.userId;
    const { date, department, building } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    let teamQuery = {};
    if (userRole === 'manager') {
      teamQuery.reportingManager = userId;
    } else if (userRole === 'supervisor') {
      teamQuery.supervisor = userId;
    }
    
    if (department) teamQuery.department = department;
    if (building) teamQuery.assignedBuilding = building;
    
    const teamMembers = await User.find(teamQuery).select('_id firstName lastName email role department');
    
    const attendance = await Attendance.find({
      employeeId: { $in: teamMembers.map(m => m._id) },
      date: { $gte: targetDate, $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    const teamAttendance = teamMembers.map(member => {
      const record = attendance.find(a => a.employeeId.toString() === member._id.toString());
      return {
        id: member._id,
        name: `${member.firstName} ${member.lastName}`,
        role: member.role,
        department: member.department,
        status: record ? record.status : 'absent',
        checkInTime: record?.checkIn?.time,
        checkOutTime: record?.checkOut?.time,
        totalHours: record?.totalHours || 0,
        lateMinutes: record?.lateMinutes || 0
      };
    });
    
    res.json({
      success: true,
      data: {
        date: targetDate,
        summary: {
          total: teamAttendance.length,
          present: teamAttendance.filter(t => t.status === 'present').length,
          absent: teamAttendance.filter(t => t.status === 'absent').length,
          late: teamAttendance.filter(t => t.status === 'late').length,
          onLeave: teamAttendance.filter(t => t.status === 'leave').length
        },
        employees: teamAttendance
      }
    });
  } catch (error) {
    console.error('Get team attendance error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Absent Employees (Admin/HR)
exports.getAbsentEmployees = async (req, res) => {
  try {
    const { date, department, building, page = 1, limit = 50 } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    // Get all active employees
    let employeeQuery = { status: 'active' };
    if (department) employeeQuery.department = department;
    if (building) employeeQuery.assignedBuilding = building;
    
    const allEmployees = await User.find(employeeQuery).select('_id firstName lastName email role department');
    
    // Get attendance records for the date
    const attendance = await Attendance.find({
      employeeId: { $in: allEmployees.map(e => e._id) },
      date: { $gte: targetDate, $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    const presentEmployeeIds = attendance.map(a => a.employeeId.toString());
    const absentEmployees = allEmployees.filter(e => !presentEmployeeIds.includes(e._id.toString()));
    
    const skip = (page - 1) * limit;
    const paginatedAbsent = absentEmployees.slice(skip, skip + limit);
    
    res.json({
      success: true,
      data: {
        date: targetDate,
        summary: {
          totalEmployees: allEmployees.length,
          present: attendance.filter(a => a.status === 'present' || a.status === 'late').length,
          absent: absentEmployees.length,
          onLeave: attendance.filter(a => a.status === 'leave').length
        },
        absentEmployees: paginatedAbsent.map(e => ({
          id: e._id,
          name: `${e.firstName} ${e.lastName}`,
          email: e.email,
          role: e.role,
          department: e.department
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: absentEmployees.length,
          pages: Math.ceil(absentEmployees.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get absent employees error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};