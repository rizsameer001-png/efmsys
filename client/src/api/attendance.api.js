// // Add to client/src/api/attendance.api.js

// // Mark attendance for employee (Manager/HR)
// markAttendance: (employeeId, data) => {
//   return api.put(`/attendance/${employeeId}/mark`, data);
// },

// // Get team attendance (Manager/Supervisor)
// getTeamAttendance: (date, department = '', building = '') => {
//   const params = { date };
//   if (department) params.department = department;
//   if (building) params.building = building;
//   return api.get('/attendance/team', { params });
// },

// // client/src/api/attendance.api.js
// import api from './axios.config';

// export const attendanceApi = {
//   // ==================== EMPLOYEE SELF ACTIONS ====================
  
//   /**
//    * Check In - Employee checks in for the day
//    * @param {Object} data - Check in data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check in method (gps, qr, face, manual)
//    * @param {string} data.image - Selfie image URL (optional)
//    */
//   checkIn: (data) => {
//     return api.post('/attendance/check-in', data);
//   },
  
//   /**
//    * Check Out - Employee checks out for the day
//    * @param {Object} data - Check out data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check out method (gps, qr, face, manual)
//    * @param {string} data.image - Image URL (optional)
//    */
//   checkOut: (data) => {
//     return api.post('/attendance/check-out', data);
//   },
  
//   /**
//    * Get My Attendance - Get current user's attendance records
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    */
//   getMyAttendance: (month, year) => {
//     const params = {};
//     if (month) params.month = month;
//     if (year) params.year = year;
//     return api.get('/attendance/my', { params });
//   },
  
//   // ==================== MANAGER/SUPERVISOR ACTIONS ====================
  
//   /**
//    * Get Team Attendance - Get attendance of team members (Manager/Supervisor)
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter (optional)
//    * @param {string} building - Building filter (optional)
//    */
//   getTeamAttendance: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/team', { params });
//   },
  
//   /**
//    * Mark Attendance - Mark attendance for an employee (Manager/HR)
//    * @param {string} employeeId - Employee ID
//    * @param {Object} data - Attendance data
//    * @param {string} data.date - Date (YYYY-MM-DD)
//    * @param {string} data.status - Status (present, absent, late, half_day, leave)
//    * @param {string} data.checkInTime - Check in time (HH:MM)
//    * @param {string} data.checkOutTime - Check out time (HH:MM)
//    * @param {string} data.notes - Additional notes
//    */
//   markAttendance: (employeeId, data) => {
//     return api.put(`/attendance/${employeeId}/mark`, data);
//   },
  
//   // ==================== ADMIN/HR ACTIONS ====================
  
//   /**
//    * Get All Attendance - Get attendance of all employees (Admin/HR)
//    * @param {Object} params - Query parameters
//    * @param {string} params.date - Date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.building - Building filter
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    */
//   getAllAttendance: (params = {}) => {
//     return api.get('/attendance/all', { params });
//   },
  
//   /**
//    * Get Absent Employees - Get list of absent employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getAbsentEmployees: (date, department = '', building = '', page = 1, limit = 50) => {
//     const params = { date, page, limit };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/absent', { params });
//   },
  
//   /**
//    * Get Late Employees - Get list of late employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    */
//   getLateEmployees: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/late', { params });
//   },
  
//   /**
//    * Get Attendance Report - Generate attendance report
//    * @param {Object} params - Report parameters
//    * @param {string} params.startDate - Start date (YYYY-MM-DD)
//    * @param {string} params.endDate - End date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.employeeId - Employee ID filter
//    * @param {string} params.format - Report format (csv, excel, pdf)
//    */
//   getAttendanceReport: (params) => {
//     return api.get('/attendance/report', { params });
//   },
  
//   /**
//    * Export Attendance - Export attendance data to CSV/Excel
//    * @param {Object} params - Export parameters
//    * @param {string} params.startDate - Start date
//    * @param {string} params.endDate - End date
//    * @param {string} params.format - Export format (csv, excel)
//    */
//   exportAttendance: (params) => {
//     return api.get('/attendance/export', {
//       params,
//       responseType: 'blob'
//     });
//   },
  
//   // ==================== ATTENDANCE SUMMARY ====================
  
//   /**
//    * Get Monthly Summary - Get attendance summary for a month
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    * @param {string} employeeId - Employee ID (optional)
//    */
//   getMonthlySummary: (month, year, employeeId = null) => {
//     const params = { month, year };
//     if (employeeId) params.employeeId = employeeId;
//     return api.get('/attendance/summary', { params });
//   },
  
//   /**
//    * Get Department Attendance Stats - Get attendance statistics by department
//    * @param {string} startDate - Start date (YYYY-MM-DD)
//    * @param {string} endDate - End date (YYYY-MM-DD)
//    */
//   getDepartmentStats: (startDate, endDate) => {
//     return api.get('/attendance/department-stats', { params: { startDate, endDate } });
//   },
  
//   // ==================== ATTENDANCE REQUEST ====================
  
//   /**
//    * Request Attendance Correction - Request to correct attendance
//    * @param {Object} data - Correction request data
//    * @param {string} data.date - Date of correction
//    * @param {string} data.expectedCheckIn - Expected check in time
//    * @param {string} data.actualCheckIn - Actual check in time
//    * @param {string} data.reason - Reason for correction
//    */
//   requestCorrection: (data) => {
//     return api.post('/attendance/correction-request', data);
//   },
  
//   /**
//    * Get Pending Corrections - Get pending attendance correction requests (Manager/HR)
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getPendingCorrections: (page = 1, limit = 20) => {
//     return api.get('/attendance/pending-corrections', { params: { page, limit } });
//   },
  
//   /**
//    * Approve Correction - Approve attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} notes - Approval notes
//    */
//   approveCorrection: (requestId, notes = '') => {
//     return api.put(`/attendance/correction-request/${requestId}/approve`, { notes });
//   },
  
//   /**
//    * Reject Correction - Reject attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} reason - Rejection reason
//    */
//   rejectCorrection: (requestId, reason) => {
//     return api.put(`/attendance/correction-request/${requestId}/reject`, { reason });
//   },
  
//   // ==================== HOLIDAY MANAGEMENT ====================
  
//   /**
//    * Get Holidays - Get list of holidays
//    * @param {number} year - Year
//    */
//   getHolidays: (year = null) => {
//     const params = year ? { year } : {};
//     return api.get('/attendance/holidays', { params });
//   },
  
//   /**
//    * Create Holiday - Add a new holiday (Admin/HR)
//    * @param {Object} data - Holiday data
//    * @param {string} data.name - Holiday name
//    * @param {string} data.date - Holiday date (YYYY-MM-DD)
//    * @param {boolean} data.isRecurring - Whether holiday repeats yearly
//    */
//   createHoliday: (data) => {
//     return api.post('/attendance/holidays', data);
//   },
  
//   /**
//    * Update Holiday - Update existing holiday
//    * @param {string} holidayId - Holiday ID
//    * @param {Object} data - Updated data
//    */
//   updateHoliday: (holidayId, data) => {
//     return api.put(`/attendance/holidays/${holidayId}`, data);
//   },
  
//   /**
//    * Delete Holiday - Delete a holiday
//    * @param {string} holidayId - Holiday ID
//    */
//   deleteHoliday: (holidayId) => {
//     return api.delete(`/attendance/holidays/${holidayId}`);
//   },
  
//   // ==================== DASHBOARD STATS ====================
  
//   /**
//    * Get Attendance Dashboard Stats - Get statistics for dashboard
//    * @param {string} date - Date (YYYY-MM-DD)
//    */
//   getDashboardStats: (date = null) => {
//     const params = date ? { date } : {};
//     return api.get('/attendance/dashboard-stats', { params });
//   },
  
//   /**
//    * Get Today's Summary - Get today's attendance summary
//    */
//   getTodaySummary: () => {
//     return api.get('/attendance/today-summary');
//   }
// };






// // client/src/api/attendance.api.js
// import api from './axios.config';

// export const attendanceApi = {
//   // ==================== EMPLOYEE SELF ACTIONS ====================
  
//   /**
//    * Check In - Employee checks in for the day
//    * @param {Object} data - Check in data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check in method (gps, qr, face, manual)
//    * @param {string} data.image - Selfie image URL (optional)
//    */
//   checkIn: (data) => {
//     return api.post('/attendance/check-in', data);
//   },
  
//   /**
//    * Check Out - Employee checks out for the day
//    * @param {Object} data - Check out data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check out method (gps, qr, face, manual)
//    * @param {string} data.image - Image URL (optional)
//    */
//   checkOut: (data) => {
//     return api.post('/attendance/check-out', data);
//   },
  
//   /**
//    * Get My Attendance - Get current user's attendance records
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    * @returns {Promise} - Attendance records for the current user
//    */
//   getMyAttendance: (month, year) => {
//     const params = {};
//     if (month) params.month = month;
//     if (year) params.year = year;
//     return api.get('/attendance/my', { params });
//   },
  
//   /**
//    * Get User Attendance - Get attendance for a specific user (for backward compatibility)
//    * @param {string} userId - User ID (optional, defaults to current user)
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    */
//   getUserAttendance: (userId = null, month, year) => {
//     const params = {};
//     if (month) params.month = month;
//     if (year) params.year = year;
//     const url = userId ? `/attendance/user/${userId}` : '/attendance/my';
//     return api.get(url, { params });
//   },
  
//   /**
//    * Get Current User's Attendance (alias for getMyAttendance)
//    */
//   getCurrentUserAttendance: (month, year) => {
//     return attendanceApi.getMyAttendance(month, year);
//   },
  
//   // ==================== MANAGER/SUPERVISOR ACTIONS ====================
  
//   /**
//    * Get Team Attendance - Get attendance of team members (Manager/Supervisor)
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter (optional)
//    * @param {string} building - Building filter (optional)
//    */
//   getTeamAttendance: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/team', { params });
//   },
  
//   /**
//    * Mark Attendance - Mark attendance for an employee (Manager/HR)
//    * @param {string} employeeId - Employee ID
//    * @param {Object} data - Attendance data
//    * @param {string} data.date - Date (YYYY-MM-DD)
//    * @param {string} data.status - Status (present, absent, late, half_day, leave)
//    * @param {string} data.checkInTime - Check in time (HH:MM)
//    * @param {string} data.checkOutTime - Check out time (HH:MM)
//    * @param {string} data.notes - Additional notes
//    */
//   markAttendance: (employeeId, data) => {
//     return api.put(`/attendance/${employeeId}/mark`, data);
//   },
  
//   // ==================== ADMIN/HR ACTIONS ====================
  
//   /**
//    * Get All Attendance - Get attendance of all employees (Admin/HR)
//    * @param {Object} params - Query parameters
//    * @param {string} params.date - Date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.building - Building filter
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    */
//   getAllAttendance: (params = {}) => {
//     return api.get('/attendance/all', { params });
//   },
  
//   /**
//    * Get Absent Employees - Get list of absent employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getAbsentEmployees: (date, department = '', building = '', page = 1, limit = 50) => {
//     const params = { date, page, limit };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/absent', { params });
//   },
  
//   /**
//    * Get Late Employees - Get list of late employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    */
//   getLateEmployees: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/late', { params });
//   },
  
//   /**
//    * Get Attendance Report - Generate attendance report
//    * @param {Object} params - Report parameters
//    * @param {string} params.startDate - Start date (YYYY-MM-DD)
//    * @param {string} params.endDate - End date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.employeeId - Employee ID filter
//    * @param {string} params.format - Report format (csv, excel, pdf)
//    */
//   getAttendanceReport: (params) => {
//     return api.get('/attendance/report', { params });
//   },
  
//   /**
//    * Export Attendance - Export attendance data to CSV/Excel
//    * @param {Object} params - Export parameters
//    * @param {string} params.startDate - Start date
//    * @param {string} params.endDate - End date
//    * @param {string} params.format - Export format (csv, excel)
//    */
//   exportAttendance: (params) => {
//     return api.get('/attendance/export', {
//       params,
//       responseType: 'blob'
//     });
//   },
  
//   // ==================== ATTENDANCE SUMMARY ====================
  
//   /**
//    * Get Monthly Summary - Get attendance summary for a month
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    * @param {string} employeeId - Employee ID (optional)
//    */
//   getMonthlySummary: (month, year, employeeId = null) => {
//     const params = { month, year };
//     if (employeeId) params.employeeId = employeeId;
//     return api.get('/attendance/summary', { params });
//   },
  
//   /**
//    * Get Department Attendance Stats - Get attendance statistics by department
//    * @param {string} startDate - Start date (YYYY-MM-DD)
//    * @param {string} endDate - End date (YYYY-MM-DD)
//    */
//   getDepartmentStats: (startDate, endDate) => {
//     return api.get('/attendance/department-stats', { params: { startDate, endDate } });
//   },
  
//   // ==================== ATTENDANCE REQUEST ====================
  
//   /**
//    * Request Attendance Correction - Request to correct attendance
//    * @param {Object} data - Correction request data
//    * @param {string} data.date - Date of correction
//    * @param {string} data.expectedCheckIn - Expected check in time
//    * @param {string} data.actualCheckIn - Actual check in time
//    * @param {string} data.reason - Reason for correction
//    */
//   requestCorrection: (data) => {
//     return api.post('/attendance/correction-request', data);
//   },
  
//   /**
//    * Get Pending Corrections - Get pending attendance correction requests (Manager/HR)
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getPendingCorrections: (page = 1, limit = 20) => {
//     return api.get('/attendance/pending-corrections', { params: { page, limit } });
//   },
  
//   /**
//    * Approve Correction - Approve attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} notes - Approval notes
//    */
//   approveCorrection: (requestId, notes = '') => {
//     return api.put(`/attendance/correction-request/${requestId}/approve`, { notes });
//   },
  
//   /**
//    * Reject Correction - Reject attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} reason - Rejection reason
//    */
//   rejectCorrection: (requestId, reason) => {
//     return api.put(`/attendance/correction-request/${requestId}/reject`, { reason });
//   },
  
//   // ==================== HOLIDAY MANAGEMENT ====================
  
//   /**
//    * Get Holidays - Get list of holidays
//    * @param {number} year - Year
//    */
//   getHolidays: (year = null) => {
//     const params = year ? { year } : {};
//     return api.get('/attendance/holidays', { params });
//   },
  
//   /**
//    * Create Holiday - Add a new holiday (Admin/HR)
//    * @param {Object} data - Holiday data
//    * @param {string} data.name - Holiday name
//    * @param {string} data.date - Holiday date (YYYY-MM-DD)
//    * @param {boolean} data.isRecurring - Whether holiday repeats yearly
//    */
//   createHoliday: (data) => {
//     return api.post('/attendance/holidays', data);
//   },
  
//   /**
//    * Update Holiday - Update existing holiday
//    * @param {string} holidayId - Holiday ID
//    * @param {Object} data - Updated data
//    */
//   updateHoliday: (holidayId, data) => {
//     return api.put(`/attendance/holidays/${holidayId}`, data);
//   },
  
//   /**
//    * Delete Holiday - Delete a holiday
//    * @param {string} holidayId - Holiday ID
//    */
//   deleteHoliday: (holidayId) => {
//     return api.delete(`/attendance/holidays/${holidayId}`);
//   },
  
//   // ==================== DASHBOARD STATS ====================
  
//   /**
//    * Get Attendance Dashboard Stats - Get statistics for dashboard
//    * @param {string} date - Date (YYYY-MM-DD)
//    */
//   getDashboardStats: (date = null) => {
//     const params = date ? { date } : {};
//     return api.get('/attendance/dashboard-stats', { params });
//   },
  
//   /**
//    * Get Today's Summary - Get today's attendance summary
//    */
//   getTodaySummary: () => {
//     return api.get('/attendance/today-summary');
//   },
  
//   /**
//    * Get Attendance for specific user (Admin only)
//    * @param {string} userId - User ID
//    * @param {string} startDate - Start date
//    * @param {string} endDate - End date
//    */
//   getUserAttendanceById: (userId, startDate, endDate) => {
//     const params = {};
//     if (startDate) params.startDate = startDate;
//     if (endDate) params.endDate = endDate;
//     return api.get(`/attendance/user/${userId}`, { params });
//   },
  
//   /**
//    * Get Current Month Attendance Summary
//    */
//   getCurrentMonthSummary: () => {
//     const now = new Date();
//     const month = now.getMonth() + 1;
//     const year = now.getFullYear();
//     return attendanceApi.getMonthlySummary(month, year);
//   }
// };

// export default attendanceApi;










// // client/src/api/attendance.api.js
// import api from './axios.config';

// export const attendanceApi = {
//   // ==================== EMPLOYEE SELF ACTIONS ====================
  
//   /**
//    * Check In - Employee checks in for the day
//    * @param {Object} data - Check in data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check in method (gps, qr, face, manual)
//    * @param {string} data.image - Selfie image URL (optional)
//    */
//   checkIn: (data) => {
//     return api.post('/attendance/check-in', data);
//   },
  
//   /**
//    * Check Out - Employee checks out for the day
//    * @param {Object} data - Check out data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check out method (gps, qr, face, manual)
//    * @param {string} data.image - Image URL (optional)
//    */
//   checkOut: (data) => {
//     return api.post('/attendance/check-out', data);
//   },
  
//   /**
//    * Get My Attendance - Get current user's attendance records
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    * @returns {Promise} - Attendance records for the current user
//    */
//   getMyAttendance: (month, year) => {
//     const params = {};
//     if (month) params.month = month;
//     if (year) params.year = year;
//     return api.get('/attendance/my', { params });
//   },
  
//   /**
//    * Get User Attendance - Get attendance for a specific user (for backward compatibility)
//    * @param {string} userId - User ID (optional, defaults to current user)
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    */
//   getUserAttendance: (userId = null, month, year) => {
//     const params = {};
//     if (month) params.month = month;
//     if (year) params.year = year;
//     const url = userId ? `/attendance/user/${userId}` : '/attendance/my';
//     return api.get(url, { params });
//   },
  
//   /**
//    * Get Current User's Attendance (alias for getMyAttendance)
//    */
//   getCurrentUserAttendance: (month, year) => {
//     return attendanceApi.getMyAttendance(month, year);
//   },
  
//   // ==================== MANAGER/SUPERVISOR ACTIONS ====================
  
//   /**
//    * Get Team Attendance - Get attendance of team members (Manager/Supervisor)
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter (optional)
//    * @param {string} building - Building filter (optional)
//    */
//   getTeamAttendance: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/team', { params });
//   },
  
//   /**
//    * Mark Attendance - Mark attendance for an employee (Manager/HR)
//    * @param {string} employeeId - Employee ID
//    * @param {Object} data - Attendance data
//    * @param {string} data.date - Date (YYYY-MM-DD)
//    * @param {string} data.status - Status (present, absent, late, half_day, leave)
//    * @param {string} data.checkInTime - Check in time (HH:MM)
//    * @param {string} data.checkOutTime - Check out time (HH:MM)
//    * @param {string} data.notes - Additional notes
//    */
//   markAttendance: (employeeId, data) => {
//     return api.put(`/attendance/${employeeId}/mark`, data);
//   },
  
//   // ==================== ADMIN/HR ACTIONS ====================
  
//   /**
//    * Get All Attendance - Get attendance of all employees (Admin/HR)
//    * @param {Object} params - Query parameters
//    * @param {string} params.date - Date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.building - Building filter
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    */
//   getAllAttendance: (params = {}) => {
//     return api.get('/attendance/all', { params });
//   },
  
//   /**
//    * Get Absent Employees - Get list of absent employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getAbsentEmployees: (date, department = '', building = '', page = 1, limit = 50) => {
//     const params = { date, page, limit };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/absent', { params });
//   },
  
//   /**
//    * Get Late Employees - Get list of late employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    */
//   getLateEmployees: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/late', { params });
//   },
  
//   /**
//    * 🔴 FIXED: Get Attendance Report - Generate attendance report
//    * @param {Object} params - Report parameters
//    * @param {string} params.startDate - Start date (YYYY-MM-DD)
//    * @param {string} params.endDate - End date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.employeeId - Employee ID filter
//    * @param {string} params.format - Report format (csv, excel, pdf)
//    */
//   getAttendanceReport: (params) => {
//     // Using GET request with query parameters (not FormData)
//     return api.get('/attendance/report', { params });
//   },
  
//   /**
//    * Export Attendance - Export attendance data to CSV/Excel
//    * @param {Object} params - Export parameters
//    * @param {string} params.startDate - Start date
//    * @param {string} params.endDate - End date
//    * @param {string} params.format - Export format (csv, excel)
//    */
//   exportAttendance: (params) => {
//     return api.get('/attendance/export', {
//       params,
//       responseType: 'blob'
//     });
//   },
  
//   // ==================== ATTENDANCE SUMMARY ====================
  
//   /**
//    * Get Monthly Summary - Get attendance summary for a month
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    * @param {string} employeeId - Employee ID (optional)
//    */
//   getMonthlySummary: (month, year, employeeId = null) => {
//     const params = { month, year };
//     if (employeeId) params.employeeId = employeeId;
//     return api.get('/attendance/summary', { params });
//   },
  
//   /**
//    * Get Department Attendance Stats - Get attendance statistics by department
//    * @param {string} startDate - Start date (YYYY-MM-DD)
//    * @param {string} endDate - End date (YYYY-MM-DD)
//    */
//   getDepartmentStats: (startDate, endDate) => {
//     return api.get('/attendance/department-stats', { params: { startDate, endDate } });
//   },
  
//   // ==================== ATTENDANCE REQUEST ====================
  
//   /**
//    * Request Attendance Correction - Request to correct attendance
//    * @param {Object} data - Correction request data
//    * @param {string} data.date - Date of correction
//    * @param {string} data.expectedCheckIn - Expected check in time
//    * @param {string} data.actualCheckIn - Actual check in time
//    * @param {string} data.reason - Reason for correction
//    */
//   requestCorrection: (data) => {
//     return api.post('/attendance/correction-request', data);
//   },
  
//   /**
//    * Get Pending Corrections - Get pending attendance correction requests (Manager/HR)
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getPendingCorrections: (page = 1, limit = 20) => {
//     return api.get('/attendance/pending-corrections', { params: { page, limit } });
//   },
  
//   /**
//    * Approve Correction - Approve attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} notes - Approval notes
//    */
//   approveCorrection: (requestId, notes = '') => {
//     return api.put(`/attendance/correction-request/${requestId}/approve`, { notes });
//   },
  
//   /**
//    * Reject Correction - Reject attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} reason - Rejection reason
//    */
//   rejectCorrection: (requestId, reason) => {
//     return api.put(`/attendance/correction-request/${requestId}/reject`, { reason });
//   },
  
//   // ==================== HOLIDAY MANAGEMENT ====================
  
//   /**
//    * Get Holidays - Get list of holidays
//    * @param {number} year - Year
//    */
//   getHolidays: (year = null) => {
//     const params = year ? { year } : {};
//     return api.get('/attendance/holidays', { params });
//   },
  
//   /**
//    * Create Holiday - Add a new holiday (Admin/HR)
//    * @param {Object} data - Holiday data
//    * @param {string} data.name - Holiday name
//    * @param {string} data.date - Holiday date (YYYY-MM-DD)
//    * @param {boolean} data.isRecurring - Whether holiday repeats yearly
//    */
//   createHoliday: (data) => {
//     return api.post('/attendance/holidays', data);
//   },
  
//   /**
//    * Update Holiday - Update existing holiday
//    * @param {string} holidayId - Holiday ID
//    * @param {Object} data - Updated data
//    */
//   updateHoliday: (holidayId, data) => {
//     return api.put(`/attendance/holidays/${holidayId}`, data);
//   },
  
//   /**
//    * Delete Holiday - Delete a holiday
//    * @param {string} holidayId - Holiday ID
//    */
//   deleteHoliday: (holidayId) => {
//     return api.delete(`/attendance/holidays/${holidayId}`);
//   },
  
//   // ==================== DASHBOARD STATS ====================
  
//   /**
//    * Get Attendance Dashboard Stats - Get statistics for dashboard
//    * @param {string} date - Date (YYYY-MM-DD)
//    */
//   getDashboardStats: (date = null) => {
//     const params = date ? { date } : {};
//     return api.get('/attendance/dashboard-stats', { params });
//   },
  
//   /**
//    * Get Today's Summary - Get today's attendance summary
//    */
//   getTodaySummary: () => {
//     return api.get('/attendance/today-summary');
//   },
  
//   /**
//    * Get Attendance for specific user (Admin only)
//    * @param {string} userId - User ID
//    * @param {string} startDate - Start date
//    * @param {string} endDate - End date
//    */
//   getUserAttendanceById: (userId, startDate, endDate) => {
//     const params = {};
//     if (startDate) params.startDate = startDate;
//     if (endDate) params.endDate = endDate;
//     return api.get(`/attendance/user/${userId}`, { params });
//   },
  
//   /**
//    * Get Current Month Attendance Summary
//    */
//   getCurrentMonthSummary: () => {
//     const now = new Date();
//     const month = now.getMonth() + 1;
//     const year = now.getFullYear();
//     return attendanceApi.getMonthlySummary(month, year);
//   }
// };

// export default attendanceApi;




// // client/src/api/attendance.api.js
// import api from './axios.config';

// export const attendanceApi = {
//   // ==================== EMPLOYEE SELF ACTIONS ====================
  
//   /**
//    * Check In - Employee checks in for the day
//    * @param {Object} data - Check in data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check in method (gps, qr, face, manual)
//    * @param {string} data.image - Selfie image URL (optional)
//    */
//   checkIn: (data) => {
//     return api.post('/attendance/check-in', data);
//   },
  
//   /**
//    * Check Out - Employee checks out for the day
//    * @param {Object} data - Check out data
//    * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
//    * @param {string} data.method - Check out method (gps, qr, face, manual)
//    * @param {string} data.image - Image URL (optional)
//    */
//   checkOut: (data) => {
//     return api.post('/attendance/check-out', data);
//   },
  
//   /**
//    * Get My Attendance - Get current user's attendance records
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    * @returns {Promise} - Attendance records for the current user
//    */
//   getMyAttendance: (month, year) => {
//     const params = {};
//     if (month) params.month = month;
//     if (year) params.year = year;
//     return api.get('/attendance/my', { params });
//   },
  
//   /**
//    * Get User Attendance - Get attendance for a specific user (for backward compatibility)
//    * @param {string} userId - User ID (optional, defaults to current user)
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    */
//   getUserAttendance: (userId = null, month, year) => {
//     const params = {};
//     if (month) params.month = month;
//     if (year) params.year = year;
//     const url = userId ? `/attendance/user/${userId}` : '/attendance/my';
//     return api.get(url, { params });
//   },
  
//   /**
//    * Get Current User's Attendance (alias for getMyAttendance)
//    */
//   getCurrentUserAttendance: (month, year) => {
//     return attendanceApi.getMyAttendance(month, year);
//   },
  
//   // ==================== MANAGER/SUPERVISOR ACTIONS ====================
  
//   /**
//    * Get Team Attendance - Get attendance of team members (Manager/Supervisor)
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter (optional)
//    * @param {string} building - Building filter (optional)
//    */
//   getTeamAttendance: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/team', { params });
//   },
  
//   /**
//    * Mark Attendance - Mark attendance for an employee (Manager/HR)
//    * @param {string} employeeId - Employee ID
//    * @param {Object} data - Attendance data
//    * @param {string} data.date - Date (YYYY-MM-DD)
//    * @param {string} data.status - Status (present, absent, late, half_day, leave)
//    * @param {string} data.checkInTime - Check in time (HH:MM)
//    * @param {string} data.checkOutTime - Check out time (HH:MM)
//    * @param {string} data.notes - Additional notes
//    */
//   markAttendance: (employeeId, data) => {
//     return api.put(`/attendance/${employeeId}/mark`, data);
//   },
  
//   // ==================== ADMIN/HR ACTIONS ====================
  
//   /**
//    * Get All Attendance - Get attendance of all employees (Admin/HR)
//    * @param {Object} params - Query parameters
//    * @param {string} params.date - Date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.building - Building filter
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    */
//   getAllAttendance: (params = {}) => {
//     return api.get('/attendance/all', { params });
//   },
  
//   /**
//    * Get Absent Employees - Get list of absent employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getAbsentEmployees: (date, department = '', building = '', page = 1, limit = 50) => {
//     const params = { date, page, limit };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/absent', { params });
//   },
  
//   /**
//    * Get Late Employees - Get list of late employees for a date
//    * @param {string} date - Date (YYYY-MM-DD)
//    * @param {string} department - Department filter
//    * @param {string} building - Building filter
//    */
//   getLateEmployees: (date, department = '', building = '') => {
//     const params = { date };
//     if (department) params.department = department;
//     if (building) params.building = building;
//     return api.get('/attendance/late', { params });
//   },
  
//   /**
//    * Get Attendance Report - Generate attendance report
//    * @param {Object} params - Report parameters
//    * @param {string} params.startDate - Start date (YYYY-MM-DD)
//    * @param {string} params.endDate - End date (YYYY-MM-DD)
//    * @param {string} params.department - Department filter
//    * @param {string} params.employeeId - Employee ID filter
//    * @param {string} params.format - Report format (csv, excel, pdf)
//    */
//   getAttendanceReport: (params) => {
//     return api.get('/attendance/report', { params });
//   },
  
//   /**
//    * Export Attendance - Export attendance data to CSV/Excel
//    * @param {Object} params - Export parameters
//    * @param {string} params.startDate - Start date
//    * @param {string} params.endDate - End date
//    * @param {string} params.format - Export format (csv, excel)
//    */
//   exportAttendance: (params) => {
//     return api.get('/attendance/export', {
//       params,
//       responseType: 'blob'
//     });
//   },
  
//   // ==================== ATTENDANCE SUMMARY ====================
  
//   /**
//    * Get Monthly Summary - Get attendance summary for a month
//    * @param {number} month - Month (1-12)
//    * @param {number} year - Year
//    * @param {string} employeeId - Employee ID (optional)
//    */
//   getMonthlySummary: (month, year, employeeId = null) => {
//     const params = { month, year };
//     if (employeeId) params.employeeId = employeeId;
//     return api.get('/attendance/summary', { params });
//   },
  
//   /**
//    * Get Department Attendance Stats - Get attendance statistics by department
//    * @param {string} startDate - Start date (YYYY-MM-DD)
//    * @param {string} endDate - End date (YYYY-MM-DD)
//    */
//   getDepartmentStats: (startDate, endDate) => {
//     return api.get('/attendance/department-stats', { params: { startDate, endDate } });
//   },
  
//   // ==================== CORRECTION REQUESTS ====================
  
//   /**
//    * Request Attendance Correction - Request to correct attendance
//    * @param {Object} data - Correction request data
//    * @param {string} data.date - Date of correction
//    * @param {string} data.expectedCheckIn - Expected check in time
//    * @param {string} data.actualCheckIn - Actual check in time
//    * @param {string} data.reason - Reason for correction
//    */
//   requestCorrection: (data) => {
//     return api.post('/attendance/correction-request', data);
//   },
  
//   /**
//    * 🔴 NEW: Get my correction requests
//    * @returns {Promise} - List of user's correction requests
//    */
//   getMyCorrectionRequests: async () => {
//     const response = await api.get('/attendance/my-correction-requests');
//     return response;
//   },
  
//   /**
//    * Get Pending Corrections - Get pending attendance correction requests (Manager/HR)
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getPendingCorrections: (page = 1, limit = 20) => {
//     return api.get('/attendance/pending-corrections', { params: { page, limit } });
//   },
  
//   /**
//    * 🔴 NEW: Get all correction requests (Admin)
//    * @param {Object} params - Query parameters
//    */
//   getAllCorrectionRequests: (params = {}) => {
//     return api.get('/attendance/correction-requests', { params });
//   },
  
//   /**
//    * 🔴 NEW: Get correction request by ID
//    * @param {string} requestId - Request ID
//    */
//   getCorrectionRequestById: (requestId) => {
//     return api.get(`/attendance/correction-request/${requestId}`);
//   },
  
//   /**
//    * Approve Correction - Approve attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} notes - Approval notes
//    */
//   approveCorrection: (requestId, notes = '') => {
//     return api.put(`/attendance/correction-request/${requestId}/approve`, { notes });
//   },
  
//   /**
//    * Reject Correction - Reject attendance correction request
//    * @param {string} requestId - Request ID
//    * @param {string} reason - Rejection reason
//    */
//   rejectCorrection: (requestId, reason) => {
//     return api.put(`/attendance/correction-request/${requestId}/reject`, { reason });
//   },
  
//   // ==================== HOLIDAY MANAGEMENT ====================
  
//   /**
//    * Get Holidays - Get list of holidays
//    * @param {number} year - Year
//    */
//   getHolidays: (year = null) => {
//     const params = year ? { year } : {};
//     return api.get('/attendance/holidays', { params });
//   },
  
//   /**
//    * Create Holiday - Add a new holiday (Admin/HR)
//    * @param {Object} data - Holiday data
//    * @param {string} data.name - Holiday name
//    * @param {string} data.date - Holiday date (YYYY-MM-DD)
//    * @param {boolean} data.isRecurring - Whether holiday repeats yearly
//    */
//   createHoliday: (data) => {
//     return api.post('/attendance/holidays', data);
//   },
  
//   /**
//    * Update Holiday - Update existing holiday
//    * @param {string} holidayId - Holiday ID
//    * @param {Object} data - Updated data
//    */
//   updateHoliday: (holidayId, data) => {
//     return api.put(`/attendance/holidays/${holidayId}`, data);
//   },
  
//   /**
//    * Delete Holiday - Delete a holiday
//    * @param {string} holidayId - Holiday ID
//    */
//   deleteHoliday: (holidayId) => {
//     return api.delete(`/attendance/holidays/${holidayId}`);
//   },
  
//   // ==================== DASHBOARD STATS ====================
  
//   /**
//    * Get Attendance Dashboard Stats - Get statistics for dashboard
//    * @param {string} date - Date (YYYY-MM-DD)
//    */
//   getDashboardStats: (date = null) => {
//     const params = date ? { date } : {};
//     return api.get('/attendance/dashboard-stats', { params });
//   },
  
//   /**
//    * Get Today's Summary - Get today's attendance summary
//    */
//   getTodaySummary: () => {
//     return api.get('/attendance/today-summary');
//   },
  
//   /**
//    * Get Attendance for specific user (Admin only)
//    * @param {string} userId - User ID
//    * @param {string} startDate - Start date
//    * @param {string} endDate - End date
//    */
//   getUserAttendanceById: (userId, startDate, endDate) => {
//     const params = {};
//     if (startDate) params.startDate = startDate;
//     if (endDate) params.endDate = endDate;
//     return api.get(`/attendance/user/${userId}`, { params });
//   },
  
//   /**
//    * Get Current Month Attendance Summary
//    */
//   getCurrentMonthSummary: () => {
//     const now = new Date();
//     const month = now.getMonth() + 1;
//     const year = now.getFullYear();
//     return attendanceApi.getMonthlySummary(month, year);
//   }
// };

// export default attendanceApi;






// client/src/api/attendance.api.js
import api from './axios.config';

export const attendanceApi = {
  // ==================== EMPLOYEE SELF ACTIONS ====================
  
  /**
   * Check In - Employee checks in for the day
   * @param {Object} data - Check in data
   * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
   * @param {string} data.method - Check in method (gps, qr, face, manual)
   * @param {string} data.image - Selfie image URL (optional)
   */
  checkIn: (data) => {
    return api.post('/attendance/check-in', data);
  },
  
  /**
   * Check Out - Employee checks out for the day
   * @param {Object} data - Check out data
   * @param {Object} data.gpsLocation - GPS coordinates { lat, lng, address }
   * @param {string} data.method - Check out method (gps, qr, face, manual)
   * @param {string} data.image - Image URL (optional)
   */
  checkOut: (data) => {
    return api.post('/attendance/check-out', data);
  },
  
  /**
   * Get My Attendance - Get current user's attendance records
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise} - Attendance records for the current user
   */
  getMyAttendance: (month, year) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return api.get('/attendance/my', { params });
  },
  
  /**
   * Get User Attendance - Get attendance for a specific user (for backward compatibility)
   * @param {string} userId - User ID (optional, defaults to current user)
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   */
  getUserAttendance: (userId = null, month, year) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const url = userId ? `/attendance/user/${userId}` : '/attendance/my';
    return api.get(url, { params });
  },
  
  /**
   * Get Current User's Attendance (alias for getMyAttendance)
   */
  getCurrentUserAttendance: (month, year) => {
    return attendanceApi.getMyAttendance(month, year);
  },
  
  // ==================== MANAGER/SUPERVISOR ACTIONS ====================
  
  /**
   * Get Team Attendance - Get attendance of team members (Manager/Supervisor)
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} department - Department filter (optional)
   * @param {string} building - Building filter (optional)
   */
  getTeamAttendance: (date, department = '', building = '') => {
    const params = { date };
    if (department) params.department = department;
    if (building) params.building = building;
    return api.get('/attendance/team', { params });
  },
  
  /**
   * Mark Attendance - Mark attendance for an employee (Manager/HR)
   * @param {string} employeeId - Employee ID
   * @param {Object} data - Attendance data
   * @param {string} data.date - Date (YYYY-MM-DD)
   * @param {string} data.status - Status (present, absent, late, half_day, leave)
   * @param {string} data.checkInTime - Check in time (HH:MM)
   * @param {string} data.checkOutTime - Check out time (HH:MM)
   * @param {string} data.notes - Additional notes
   */
  markAttendance: (employeeId, data) => {
    return api.put(`/attendance/${employeeId}/mark`, data);
  },
  
  // ==================== ADMIN/HR ACTIONS ====================
  
  /**
   * Get All Attendance - Get attendance of all employees (Admin/HR)
   * @param {Object} params - Query parameters
   * @param {string} params.date - Date (YYYY-MM-DD)
   * @param {string} params.department - Department filter
   * @param {string} params.building - Building filter
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   */
  getAllAttendance: (params = {}) => {
    return api.get('/attendance/all', { params });
  },
  
  /**
   * Get Absent Employees - Get list of absent employees for a date
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} department - Department filter
   * @param {string} building - Building filter
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getAbsentEmployees: (date, department = '', building = '', page = 1, limit = 50) => {
    const params = { date, page, limit };
    if (department) params.department = department;
    if (building) params.building = building;
    return api.get('/attendance/absent', { params });
  },
  
  /**
   * Get Late Employees - Get list of late employees for a date
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} department - Department filter
   * @param {string} building - Building filter
   */
  getLateEmployees: (date, department = '', building = '') => {
    const params = { date };
    if (department) params.department = department;
    if (building) params.building = building;
    return api.get('/attendance/late', { params });
  },
  
  // ==================== 🔴 FIXED: ATTENDANCE REPORT METHODS ====================
  
  /**
   * 🔴 FIX: Get Attendance Report - This method was missing
   * @param {Object} params - Report parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.department - Department filter
   * @param {string} params.employeeId - Employee ID filter
   * @param {string} params.reportType - Report type (summary, detailed, department, late_analysis, absent_analysis)
   * @param {string} params.format - Report format (json, csv, excel)
   * @returns {Promise} - Attendance report data
   */
  getAttendanceReport: (params = {}) => {
    console.log('🔴 [FIXED] Getting attendance report with params:', params);
    return api.get('/reports/attendance', { params });
  },
  
  /**
   * 🔴 FIX: Export Attendance - This method was missing/incorrect
   * @param {Object} params - Export parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.department - Department filter
   * @param {string} params.employeeId - Employee ID filter
   * @param {string} params.format - Export format (csv, excel)
   * @returns {Promise} - Blob response for download
   */
  exportAttendance: (params = {}) => {
    console.log('🔴 [FIXED] Exporting attendance with params:', params);
    return api.get('/reports/attendance/export', {
      params,
      responseType: 'blob'
    });
  },
  
  // ==================== ATTENDANCE SUMMARY ====================
  
  /**
   * Get Monthly Summary - Get attendance summary for a month
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @param {string} employeeId - Employee ID (optional)
   */
  getMonthlySummary: (month, year, employeeId = null) => {
    const params = { month, year };
    if (employeeId) params.employeeId = employeeId;
    return api.get('/attendance/summary', { params });
  },
  
  /**
   * Get Department Attendance Stats - Get attendance statistics by department
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  getDepartmentStats: (startDate, endDate) => {
    return api.get('/attendance/department-stats', { params: { startDate, endDate } });
  },
  
  // ==================== CORRECTION REQUESTS ====================
  
  /**
   * Request Attendance Correction - Request to correct attendance
   * @param {Object} data - Correction request data
   * @param {string} data.date - Date of correction
   * @param {string} data.expectedCheckIn - Expected check in time
   * @param {string} data.actualCheckIn - Actual check in time
   * @param {string} data.reason - Reason for correction
   */
  requestCorrection: (data) => {
    return api.post('/attendance/correction-request', data);
  },
  
  /**
   * Get my correction requests
   * @returns {Promise} - List of user's correction requests
   */
  getMyCorrectionRequests: async () => {
    const response = await api.get('/attendance/my-correction-requests');
    return response;
  },
  
  /**
   * Get Pending Corrections - Get pending attendance correction requests (Manager/HR)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getPendingCorrections: (page = 1, limit = 20) => {
    return api.get('/attendance/pending-corrections', { params: { page, limit } });
  },
  
  /**
   * Get all correction requests (Admin)
   * @param {Object} params - Query parameters
   */
  getAllCorrectionRequests: (params = {}) => {
    return api.get('/attendance/correction-requests', { params });
  },
  
  /**
   * Get correction request by ID
   * @param {string} requestId - Request ID
   */
  getCorrectionRequestById: (requestId) => {
    return api.get(`/attendance/correction-request/${requestId}`);
  },
  
  /**
   * Approve Correction - Approve attendance correction request
   * @param {string} requestId - Request ID
   * @param {string} notes - Approval notes
   */
  approveCorrection: (requestId, notes = '') => {
    return api.put(`/attendance/correction-request/${requestId}/approve`, { notes });
  },
  
  /**
   * Reject Correction - Reject attendance correction request
   * @param {string} requestId - Request ID
   * @param {string} reason - Rejection reason
   */
  rejectCorrection: (requestId, reason) => {
    return api.put(`/attendance/correction-request/${requestId}/reject`, { reason });
  },
  
  // ==================== HOLIDAY MANAGEMENT ====================
  
  /**
   * Get Holidays - Get list of holidays
   * @param {number} year - Year
   */
  getHolidays: (year = null) => {
    const params = year ? { year } : {};
    return api.get('/attendance/holidays', { params });
  },
  
  /**
   * Create Holiday - Add a new holiday (Admin/HR)
   * @param {Object} data - Holiday data
   * @param {string} data.name - Holiday name
   * @param {string} data.date - Holiday date (YYYY-MM-DD)
   * @param {boolean} data.isRecurring - Whether holiday repeats yearly
   */
  createHoliday: (data) => {
    return api.post('/attendance/holidays', data);
  },
  
  /**
   * Update Holiday - Update existing holiday
   * @param {string} holidayId - Holiday ID
   * @param {Object} data - Updated data
   */
  updateHoliday: (holidayId, data) => {
    return api.put(`/attendance/holidays/${holidayId}`, data);
  },
  
  /**
   * Delete Holiday - Delete a holiday
   * @param {string} holidayId - Holiday ID
   */
  deleteHoliday: (holidayId) => {
    return api.delete(`/attendance/holidays/${holidayId}`);
  },
  
  // ==================== DASHBOARD STATS ====================
  
  /**
   * Get Attendance Dashboard Stats - Get statistics for dashboard
   * @param {string} date - Date (YYYY-MM-DD)
   */
  getDashboardStats: (date = null) => {
    const params = date ? { date } : {};
    return api.get('/attendance/dashboard-stats', { params });
  },
  
  /**
   * Get Today's Summary - Get today's attendance summary
   */
  getTodaySummary: () => {
    return api.get('/attendance/today-summary');
  },
  
  /**
   * Get Attendance for specific user (Admin only)
   * @param {string} userId - User ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   */
  getUserAttendanceById: (userId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return api.get(`/attendance/user/${userId}`, { params });
  },
  
  /**
   * Get Current Month Attendance Summary
   */
  getCurrentMonthSummary: () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return attendanceApi.getMonthlySummary(month, year);
  },
  
  // ==================== ADDITIONAL EXPORT METHODS ====================
  
  /**
   * 🔴 FIX: Export attendance report to Excel
   * @param {Object} params - Export parameters
   * @returns {Promise} - Blob response for download
   */
  exportAttendanceToExcel: (params = {}) => {
    console.log('🔴 [FIXED] Exporting attendance to Excel with params:', params);
    return api.get('/attendance/export/excel', {
      params,
      responseType: 'blob'
    });
  },
  
  /**
   * 🔴 FIX: Export attendance report to CSV
   * @param {Object} params - Export parameters
   * @returns {Promise} - Blob response for download
   */
  exportAttendanceToCSV: (params = {}) => {
    console.log('🔴 [FIXED] Exporting attendance to CSV with params:', params);
    return api.get('/attendance/export/csv', {
      params,
      responseType: 'blob'
    });
  }
};

export default attendanceApi;