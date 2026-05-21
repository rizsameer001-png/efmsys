// // client/src/pages/attendance/AttendanceReport.jsx
// import React, { useState, useEffect } from 'react';
// import { attendanceApi } from '../../api/attendance.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const AttendanceReport = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [summary, setSummary] = useState({
//     totalEmployees: 0,
//     present: 0,
//     absent: 0,
//     late: 0,
//     onLeave: 0,
//     attendanceRate: 0
//   });
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [departments, setDepartments] = useState([]);
//   const [exporting, setExporting] = useState(false);

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   useEffect(() => {
//     fetchAttendanceReport();
//   }, [selectedMonth, selectedYear, departmentFilter]);

//   const fetchAttendanceReport = async () => {
//     setLoading(true);
//     try {
//       const response = await attendanceApi.getAttendanceReport(selectedMonth, selectedYear, departmentFilter);
//       if (response.data.success) {
//         setAttendanceData(response.data.data.attendance);
//         setSummary(response.data.data.summary);
//         setDepartments(response.data.data.departments || []);
//       }
//     } catch (error) {
//       console.error('Fetch attendance report error:', error);
//       showToast('Failed to load attendance report', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToCSV = () => {
//     setExporting(true);
//     try {
//       const headers = ['Employee Name', 'Role', 'Department', 'Total Days', 'Present', 'Absent', 'Late', 'Leave', 'Attendance %'];
//       const rows = attendanceData.map(emp => [
//         emp.name,
//         emp.role,
//         emp.department,
//         emp.totalDays,
//         emp.present,
//         emp.absent,
//         emp.late,
//         emp.onLeave,
//         `${emp.attendancePercentage}%`
//       ]);
      
//       const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
//       const blob = new Blob([csvContent], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `attendance_report_${months[selectedMonth - 1]}_${selectedYear}.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//       showToast('Report exported successfully', 'success');
//     } catch (error) {
//       showToast('Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const getAttendanceStatusColor = (percentage) => {
//     if (percentage >= 90) return 'text-green-600';
//     if (percentage >= 75) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
//           <p className="text-gray-500 mt-1">View and export attendance reports</p>
//         </div>
//         <Button onClick={exportToCSV} isLoading={exporting} variant="secondary">
//           📥 Export CSV
//         </Button>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               {months.map((month, idx) => (
//                 <option key={idx} value={idx + 1}>{month}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               {[2023, 2024, 2025].map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={departmentFilter}
//               onChange={(e) => setDepartmentFilter(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Departments</option>
//               {departments.map(dept => (
//                 <option key={dept} value={dept}>{dept}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{summary.totalEmployees}</p>
//           <p className="text-sm text-gray-500">Total Employees</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{summary.present}</p>
//           <p className="text-sm text-gray-500">Present (Avg)</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
//           <p className="text-sm text-gray-500">Absent (Avg)</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
//           <p className="text-sm text-gray-500">Late (Avg)</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-purple-600">{summary.attendanceRate}%</p>
//           <p className="text-sm text-gray-500">Attendance Rate</p>
//         </Card>
//       </div>

//       {/* Attendance Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">
//             Employee Attendance - {months[selectedMonth - 1]} {selectedYear}
//           </h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Days</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Late</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Leave</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance %</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {attendanceData.map((emp, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
//                         <span className="text-sm font-medium">{emp.name?.charAt(0)}</span>
//                       </div>
//                       <span className="text-sm font-medium text-gray-900">{emp.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{emp.role}</td>
//                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{emp.department}</td>
//                   <td className="px-4 py-3 text-center text-sm text-gray-500">{emp.totalDays}</td>
//                   <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{emp.present}</td>
//                   <td className="px-4 py-3 text-center text-sm text-red-600">{emp.absent}</td>
//                   <td className="px-4 py-3 text-center text-sm text-yellow-600">{emp.late}</td>
//                   <td className="px-4 py-3 text-center text-sm text-blue-600">{emp.onLeave}</td>
//                   <td className="px-4 py-3 text-center">
//                     <span className={`text-sm font-semibold ${getAttendanceStatusColor(emp.attendancePercentage)}`}>
//                       {emp.attendancePercentage}%
//                     </span>
//                    </td>
//                  </tr>
//               ))}
//               {attendanceData.length === 0 && (
//                 <tr>
//                   <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
//                     No attendance data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Summary Chart Placeholder */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Department Wise Attendance</h3>
//         <div className="space-y-4">
//           {departments.map(dept => {
//             const deptEmployees = attendanceData.filter(emp => emp.department === dept);
//             const avgAttendance = deptEmployees.length > 0 
//               ? Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendancePercentage, 0) / deptEmployees.length)
//               : 0;
//             return (
//               <div key={dept}>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="capitalize">{dept}</span>
//                   <span className={getAttendanceStatusColor(avgAttendance)}>{avgAttendance}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                     style={{ width: `${avgAttendance}%` }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AttendanceReport;






// // client/src/pages/attendance/AttendanceReport.jsx
// import React, { useState, useEffect } from 'react';
// import { attendanceApi } from '../../api/attendance.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const AttendanceReport = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [summary, setSummary] = useState({
//     totalEmployees: 0,
//     present: 0,
//     absent: 0,
//     late: 0,
//     onLeave: 0,
//     attendanceRate: 0
//   });
//   const [selectedStartDate, setSelectedStartDate] = useState(
//     new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
//   );
//   const [selectedEndDate, setSelectedEndDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [departments, setDepartments] = useState([]);
//   const [exporting, setExporting] = useState(false);
//   const [format, setFormat] = useState('csv');

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   useEffect(() => {
//     fetchAttendanceReport();
//   }, [selectedStartDate, selectedEndDate, departmentFilter]);

//   // 🔴 FIXED: Updated fetchAttendanceReport to use date range instead of month/year
//   const fetchAttendanceReport = async () => {
//     if (!selectedStartDate || !selectedEndDate) {
//       showToast('Please select both start and end dates', 'warning');
//       return;
//     }

//     setLoading(true);
//     try {
//       const params = {
//         startDate: selectedStartDate,
//         endDate: selectedEndDate
//       };
//       if (departmentFilter) params.department = departmentFilter;
      
//       console.log('Fetching attendance report with params:', params);
      
//       const response = await attendanceApi.getAttendanceReport(params);
      
//       if (response.data.success) {
//         setAttendanceData(response.data.data || []);
        
//         // Calculate summary from data
//         if (response.data.data && response.data.data.length > 0) {
//           const totalEmployees = response.data.data.length;
//           const totalPresent = response.data.data.reduce((sum, emp) => sum + (emp.present || 0), 0);
//           const totalAbsent = response.data.data.reduce((sum, emp) => sum + (emp.absent || 0), 0);
//           const totalLate = response.data.data.reduce((sum, emp) => sum + (emp.late || 0), 0);
//           const totalLeave = response.data.data.reduce((sum, emp) => sum + (emp.onLeave || 0), 0);
//           const avgAttendance = totalEmployees > 0 
//             ? Math.round(response.data.data.reduce((sum, emp) => sum + (emp.attendancePercentage || 0), 0) / totalEmployees)
//             : 0;
          
//           setSummary({
//             totalEmployees,
//             present: Math.round(totalPresent / totalEmployees) || 0,
//             absent: Math.round(totalAbsent / totalEmployees) || 0,
//             late: Math.round(totalLate / totalEmployees) || 0,
//             onLeave: Math.round(totalLeave / totalEmployees) || 0,
//             attendanceRate: avgAttendance
//           });
//         }
        
//         // Extract unique departments
//         const uniqueDepartments = [...new Set(response.data.data.map(emp => emp.department).filter(Boolean))];
//         setDepartments(uniqueDepartments);
//       } else {
//         showToast(response.data.error || 'Failed to load attendance report', 'error');
//       }
//     } catch (error) {
//       console.error('Fetch attendance report error:', error);
//       showToast(error.response?.data?.error || 'Failed to load attendance report', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToCSV = async () => {
//     if (!selectedStartDate || !selectedEndDate) {
//       showToast('Please select both start and end dates', 'warning');
//       return;
//     }

//     setExporting(true);
//     try {
//       const response = await attendanceApi.exportAttendance({
//         startDate: selectedStartDate,
//         endDate: selectedEndDate,
//         format: format
//       });
      
//       // Create blob and download
//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `attendance_report_${selectedStartDate}_to_${selectedEndDate}.${format}`;
//       a.click();
//       URL.revokeObjectURL(url);
//       showToast('Report exported successfully', 'success');
//     } catch (error) {
//       console.error('Export error:', error);
//       showToast(error.response?.data?.error || 'Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const getAttendanceStatusColor = (percentage) => {
//     if (percentage >= 90) return 'text-green-600';
//     if (percentage >= 75) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
//           <p className="text-gray-500 mt-1">View and export attendance reports</p>
//         </div>
//         <div className="flex gap-2">
//           <select
//             value={format}
//             onChange={(e) => setFormat(e.target.value)}
//             className="px-3 py-2 border rounded-lg text-sm"
//           >
//             <option value="csv">CSV</option>
//             <option value="excel">Excel</option>
//             <option value="pdf">PDF</option>
//           </select>
//           <Button onClick={exportToCSV} isLoading={exporting} variant="secondary">
//             📥 Export Report
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <input
//               type="date"
//               value={selectedStartDate}
//               onChange={(e) => setSelectedStartDate(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <input
//               type="date"
//               value={selectedEndDate}
//               onChange={(e) => setSelectedEndDate(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={departmentFilter}
//               onChange={(e) => setDepartmentFilter(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Departments</option>
//               {departments.map(dept => (
//                 <option key={dept} value={dept}>{dept}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-end">
//             <Button onClick={fetchAttendanceReport} variant="primary">
//               Generate Report
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{summary.totalEmployees}</p>
//           <p className="text-sm text-gray-500">Total Employees</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{summary.present}</p>
//           <p className="text-sm text-gray-500">Present (Daily Avg)</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
//           <p className="text-sm text-gray-500">Absent (Daily Avg)</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
//           <p className="text-sm text-gray-500">Late (Daily Avg)</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-purple-600">{summary.attendanceRate}%</p>
//           <p className="text-sm text-gray-500">Overall Attendance</p>
//         </Card>
//       </div>

//       {/* Attendance Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">
//             Employee Attendance Report
//           </h3>
//           <p className="text-xs text-gray-500 mt-1">
//             Period: {selectedStartDate} to {selectedEndDate}
//           </p>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Days</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Late</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Leave</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance %</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {attendanceData.length > 0 ? (
//                 attendanceData.map((emp, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
//                           <span className="text-sm font-medium">{emp.name?.charAt(0) || '?'}</span>
//                         </div>
//                         <span className="text-sm font-medium text-gray-900">{emp.name || 'Unknown'}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
//                       {emp.role || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
//                       {emp.department || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3 text-center text-sm text-gray-500">
//                       {emp.totalDays || 0}
//                     </td>
//                     <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">
//                       {emp.present || 0}
//                     </td>
//                     <td className="px-4 py-3 text-center text-sm text-red-600">
//                       {emp.absent || 0}
//                     </td>
//                     <td className="px-4 py-3 text-center text-sm text-yellow-600">
//                       {emp.late || 0}
//                     </td>
//                     <td className="px-4 py-3 text-center text-sm text-blue-600">
//                       {emp.onLeave || 0}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className={`text-sm font-semibold ${getAttendanceStatusColor(emp.attendancePercentage || 0)}`}>
//                         {emp.attendancePercentage || 0}%
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
//                     No attendance data found for the selected period
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Department Summary */}
//       {departments.length > 0 && (
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Department Wise Attendance</h3>
//           <div className="space-y-4">
//             {departments.map(dept => {
//               const deptEmployees = attendanceData.filter(emp => emp.department === dept);
//               const avgAttendance = deptEmployees.length > 0 
//                 ? Math.round(deptEmployees.reduce((sum, emp) => sum + (emp.attendancePercentage || 0), 0) / deptEmployees.length)
//                 : 0;
//               return (
//                 <div key={dept}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="capitalize">{dept}</span>
//                     <span className={getAttendanceStatusColor(avgAttendance)}>{avgAttendance}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${avgAttendance}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default AttendanceReport;





// client/src/pages/attendance/AttendanceReport.jsx
import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const AttendanceReport = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0,
    attendanceRate: 0
  });
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState('csv');

  useEffect(() => {
    fetchAttendanceReport();
  }, [selectedStartDate, selectedEndDate, departmentFilter]);

  // 🔴 FIXED: Updated fetchAttendanceReport to handle response structure properly
  const fetchAttendanceReport = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      showToast('Please select both start and end dates', 'warning');
      return;
    }

    setLoading(true);
    try {
      const params = {
        startDate: selectedStartDate,
        endDate: selectedEndDate
      };
      if (departmentFilter) params.department = departmentFilter;
      
      console.log('Fetching attendance report with params:', params);
      
      const response = await attendanceApi.getAttendanceReport(params);
      
      // 🔴 FIX: Handle different response structures
      let data = [];
      if (response.data.success) {
        // Check if data is array or has data property
        if (Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (response.data.data && Array.isArray(response.data.data.attendance)) {
          data = response.data.data.attendance;
        } else if (response.data.data && Array.isArray(response.data.data.report)) {
          data = response.data.data.report;
        } else if (response.data.report && Array.isArray(response.data.report)) {
          data = response.data.report;
        } else {
          // If no data, create sample data for testing
          data = [];
        }
        
        setAttendanceData(data);
        
        // Calculate summary from data if data exists
        if (data.length > 0) {
          const totalEmployees = data.length;
          const totalPresent = data.reduce((sum, emp) => sum + (emp.present || 0), 0);
          const totalAbsent = data.reduce((sum, emp) => sum + (emp.absent || 0), 0);
          const totalLate = data.reduce((sum, emp) => sum + (emp.late || 0), 0);
          const totalLeave = data.reduce((sum, emp) => sum + (emp.onLeave || 0), 0);
          const avgAttendance = totalEmployees > 0 
            ? Math.round(data.reduce((sum, emp) => sum + (emp.attendancePercentage || 0), 0) / totalEmployees)
            : 0;
          
          setSummary({
            totalEmployees,
            present: Math.round(totalPresent / (totalEmployees || 1)) || 0,
            absent: Math.round(totalAbsent / (totalEmployees || 1)) || 0,
            late: Math.round(totalLate / (totalEmployees || 1)) || 0,
            onLeave: Math.round(totalLeave / (totalEmployees || 1)) || 0,
            attendanceRate: avgAttendance
          });
        } else {
          // If no data, set default summary
          setSummary({
            totalEmployees: 0,
            present: 0,
            absent: 0,
            late: 0,
            onLeave: 0,
            attendanceRate: 0
          });
        }
        
        // Extract unique departments
        const uniqueDepartments = [...new Set(data.map(emp => emp.department).filter(Boolean))];
        setDepartments(uniqueDepartments);
        
        if (data.length === 0) {
          showToast('No attendance data found for the selected period', 'info');
        } else {
          showToast(`Found ${data.length} employee records`, 'success');
        }
      } else {
        showToast(response.data.error || 'Failed to load attendance report', 'error');
        setAttendanceData([]);
      }
    } catch (error) {
      console.error('Fetch attendance report error:', error);
      showToast(error.response?.data?.error || 'Failed to load attendance report', 'error');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      showToast('Please select both start and end dates', 'warning');
      return;
    }

    setExporting(true);
    try {
      const response = await attendanceApi.exportAttendance({
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        format: format
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${selectedStartDate}_to_${selectedEndDate}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Report exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast(error.response?.data?.error || 'Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  const getAttendanceStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
          <p className="text-gray-500 mt-1">View and export attendance reports</p>
        </div>
        <div className="flex gap-2">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <Button onClick={exportToCSV} isLoading={exporting} variant="secondary">
            📥 Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={selectedStartDate}
              onChange={(e) => setSelectedStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={selectedEndDate}
              onChange={(e) => setSelectedEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={fetchAttendanceReport} variant="primary">
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      {summary.totalEmployees > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.totalEmployees}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.present}</p>
            <p className="text-sm text-gray-500">Present (Daily Avg)</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
            <p className="text-sm text-gray-500">Absent (Daily Avg)</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
            <p className="text-sm text-gray-500">Late (Daily Avg)</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{summary.attendanceRate}%</p>
            <p className="text-sm text-gray-500">Overall Attendance</p>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Employee Attendance Report
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Period: {selectedStartDate} to {selectedEndDate}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Days</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Late</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Leave</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.length > 0 ? (
                attendanceData.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                          <span className="text-sm font-medium">{emp.name?.charAt(0) || emp.employeeName?.charAt(0) || '?'}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {emp.name || emp.employeeName || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {emp.role || emp.designation || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {emp.department || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">
                      {emp.totalDays || 0}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">
                      {emp.present || 0}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-red-600">
                      {emp.absent || 0}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-yellow-600">
                      {emp.late || 0}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-blue-600">
                      {emp.onLeave || 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-semibold ${getAttendanceStatusColor(emp.attendancePercentage || 0)}`}>
                        {emp.attendancePercentage || 0}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No attendance data found for the selected period</p>
                      <p className="text-xs text-gray-400 mt-1">Try changing the date range or department filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Department Summary */}
      {departments.length > 0 && attendanceData.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Department Wise Attendance</h3>
          <div className="space-y-4">
            {departments.map(dept => {
              const deptEmployees = attendanceData.filter(emp => emp.department === dept);
              const avgAttendance = deptEmployees.length > 0 
                ? Math.round(deptEmployees.reduce((sum, emp) => sum + (emp.attendancePercentage || 0), 0) / deptEmployees.length)
                : 0;
              return (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium">{dept}</span>
                    <span className={getAttendanceStatusColor(avgAttendance)}>{avgAttendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${avgAttendance}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {deptEmployees.length} employees
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendanceReport;