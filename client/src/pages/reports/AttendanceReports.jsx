// // client/src/pages/reports/AttendanceReports.jsx
// import React, { useState, useEffect } from 'react';
// import { attendanceApi } from '../../api/attendance.api';
// import { userApi } from '../../api/user.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Select from '../../components/common/Select';

// const AttendanceReports = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [filters, setFilters] = useState({
//     startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
//     endDate: new Date().toISOString().split('T')[0],
//     department: 'all',
//     employeeId: 'all',
//     reportType: 'summary'
//   });
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);

//   const reportTypes = [
//     { value: 'summary', label: 'Summary Report' },
//     { value: 'detailed', label: 'Detailed Report' },
//     { value: 'department', label: 'Department-wise Report' },
//     { value: 'late_analysis', label: 'Late Arrival Analysis' },
//     { value: 'absent_analysis', label: 'Absenteeism Analysis' }
//   ];

//   useEffect(() => {
//     fetchReportData();
//     fetchEmployees();
//   }, [filters.startDate, filters.endDate, filters.department, filters.reportType]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await userApi.getUsers({ limit: 500 });
//       if (response.data.success) {
//         const users = response.data.data?.users || [];
//         setEmployees(users);
//         const uniqueDepts = [...new Set(users.map(u => u.department).filter(Boolean))];
//         setDepartments(uniqueDepts.map(d => ({ value: d, label: d })));
//       }
//     } catch (error) {
//       console.error('Fetch employees error:', error);
//     }
//   };

//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         startDate: filters.startDate,
//         endDate: filters.endDate,
//         department: filters.department !== 'all' ? filters.department : undefined,
//         employeeId: filters.employeeId !== 'all' ? filters.employeeId : undefined,
//         reportType: filters.reportType
//       };
      
//       const response = await attendanceApi.getAttendanceReport(params);
//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch report error:', error);
//       showToast('Failed to load report data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async (format) => {
//     setExporting(true);
//     try {
//       const params = {
//         startDate: filters.startDate,
//         endDate: filters.endDate,
//         department: filters.department !== 'all' ? filters.department : undefined,
//         employeeId: filters.employeeId !== 'all' ? filters.employeeId : undefined,
//         reportType: filters.reportType,
//         format
//       };
      
//       const response = await attendanceApi.exportAttendance(params);
      
//       const blob = new Blob([response.data], { 
//         type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `attendance_report_${filters.startDate}_to_${filters.endDate}.${format === 'csv' ? 'csv' : 'xlsx'}`;
//       a.click();
//       URL.revokeObjectURL(url);
      
//       showToast('Report exported successfully', 'success');
//     } catch (error) {
//       showToast('Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const getAttendanceRateColor = (rate) => {
//     if (rate >= 90) return 'text-green-600';
//     if (rate >= 75) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
//         <p className="text-gray-500 mt-1">Track and analyze employee attendance</p>
//       </div>

//       {/* Filters */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <input
//               type="date"
//               value={filters.startDate}
//               onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <input
//               type="date"
//               value={filters.endDate}
//               onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <Select
//             label="Report Type"
//             value={filters.reportType}
//             onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
//             options={reportTypes}
//           />
//           <Select
//             label="Department"
//             value={filters.department}
//             onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//             options={[
//               { value: 'all', label: 'All Departments' },
//               ...departments
//             ]}
//           />
//           <Select
//             label="Employee"
//             value={filters.employeeId}
//             onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
//             options={[
//               { value: 'all', label: 'All Employees' },
//               ...employees.map(e => ({ value: e._id, label: `${e.firstName} ${e.lastName}` }))
//             ]}
//           />
//           <div className="flex items-end gap-2">
//             <Button onClick={fetchReportData}>Generate Report</Button>
//             <Button variant="secondary" onClick={() => setFilters({
//               startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
//               endDate: new Date().toISOString().split('T')[0],
//               department: 'all',
//               employeeId: 'all',
//               reportType: 'summary'
//             })}>Reset</Button>
//           </div>
//         </div>
//       </Card>

//       {/* Summary Stats */}
//       {reportData?.summary && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalEmployees}</p>
//             <p className="text-sm text-gray-500">Total Employees</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-green-600">{reportData.summary.avgAttendanceRate}%</p>
//             <p className="text-sm text-gray-500">Avg Attendance Rate</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-red-600">{reportData.summary.totalAbsentDays}</p>
//             <p className="text-sm text-gray-500">Total Absent Days</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-yellow-600">{reportData.summary.totalLateDays}</p>
//             <p className="text-sm text-gray-500">Total Late Days</p>
//           </Card>
//         </div>
//       )}

//       {/* Report Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Attendance Details</h3>
//           <div className="flex gap-2">
//             <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//               📥 Export CSV
//             </Button>
//             <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//               📊 Export Excel
//             </Button>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           {reportData?.records?.length > 0 ? (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent Days</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late Days</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Days</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reportData.records.map((record, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {record.employeeName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {record.department}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.presentDays}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{record.absentDays}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{record.lateDays}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{record.leaveDays}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`font-medium ${getAttendanceRateColor(record.attendanceRate)}`}>
//                         {record.attendanceRate}%
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-12 text-gray-500">No data available</div>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AttendanceReports;








import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Select from '../../components/common/Select';

// 🔧 FIXED: Default report data to prevent undefined errors
const DEFAULT_REPORT_DATA = {
  summary: {
    totalEmployees: 0,
    avgAttendanceRate: 0,
    totalAbsentDays: 0,
    totalLateDays: 0
  },
  records: []
};

// 🔧 FIXED: Mock data for development/fallback
const MOCK_REPORT_DATA = {
  summary: {
    totalEmployees: 45,
    avgAttendanceRate: 87.5,
    totalAbsentDays: 85,
    totalLateDays: 42
  },
  records: [
    {
      employeeName: 'John Doe',
      department: 'Operations',
      presentDays: 22,
      absentDays: 2,
      lateDays: 1,
      leaveDays: 2,
      attendanceRate: 88.0
    },
    {
      employeeName: 'Jane Smith',
      department: 'Technical',
      presentDays: 20,
      absentDays: 3,
      lateDays: 2,
      leaveDays: 2,
      attendanceRate: 80.0
    },
    {
      employeeName: 'Mike Johnson',
      department: 'Housekeeping',
      presentDays: 18,
      absentDays: 5,
      lateDays: 3,
      leaveDays: 2,
      attendanceRate: 72.0
    }
  ]
};

const AttendanceReports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(DEFAULT_REPORT_DATA);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    department: 'all',
    employeeId: 'all',
    reportType: 'summary'
  });
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const reportTypes = [
    { value: 'summary', label: 'Summary Report' },
    { value: 'detailed', label: 'Detailed Report' },
    { value: 'department', label: 'Department-wise Report' },
    { value: 'late_analysis', label: 'Late Arrival Analysis' },
    { value: 'absent_analysis', label: 'Absenteeism Analysis' }
  ];

  useEffect(() => {
    fetchReportData();
    fetchEmployees();
  }, [filters.startDate, filters.endDate, filters.department, filters.reportType]);

  // 🔧 FIXED: Enhanced fetchEmployees with error handling
  const fetchEmployees = async () => {
    setLoadingFilters(true);
    try {
      const response = await userApi.getUsers({ limit: 500 });
      if (response.data.success) {
        const users = response.data.data?.users || response.data.data || [];
        setEmployees(users);
        
        // Extract unique departments
        const uniqueDepts = [...new Set(users.map(u => u.department || u.dept).filter(Boolean))];
        setDepartments(uniqueDepts.map(d => ({ value: d, label: d })));
      } else {
        // Fallback mock departments
        setDepartments([
          { value: 'Operations', label: 'Operations' },
          { value: 'Technical', label: 'Technical' },
          { value: 'Housekeeping', label: 'Housekeeping' },
          { value: 'Security', label: 'Security' },
          { value: 'Management', label: 'Management' }
        ]);
      }
    } catch (error) {
      console.error('Fetch employees error:', error);
      // Set mock departments on error
      setDepartments([
        { value: 'Operations', label: 'Operations' },
        { value: 'Technical', label: 'Technical' },
        { value: 'Housekeeping', label: 'Housekeeping' }
      ]);
      showToast('Failed to load employee list', 'warning');
    } finally {
      setLoadingFilters(false);
    }
  };

  // 🔧 FIXED: Enhanced fetchReportData with error handling and mock fallback
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        department: filters.department !== 'all' ? filters.department : undefined,
        employeeId: filters.employeeId !== 'all' ? filters.employeeId : undefined,
        reportType: filters.reportType
      };
      
      const response = await attendanceApi.getAttendanceReport(params);
      
      if (response.data.success && response.data.data) {
        const apiData = response.data.data;
        // Merge with defaults to ensure all fields exist
        setReportData({
          summary: { ...DEFAULT_REPORT_DATA.summary, ...apiData.summary },
          records: apiData.records || DEFAULT_REPORT_DATA.records
        });
      } else {
        // Use mock data as fallback
        console.warn('Invalid response, using mock data');
        setReportData(MOCK_REPORT_DATA);
        showToast('Using demo data. Connect to backend for live reports.', 'info');
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      setError(error.message);
      
      // Use mock data as fallback
      setReportData(MOCK_REPORT_DATA);
      
      // Show appropriate error message
      if (error.response?.status === 404) {
        showToast('Attendance report API not available. Using demo data.', 'warning');
      } else if (error.response?.status === 403) {
        showToast('Access denied. Using demo data.', 'warning');
      } else if (error.code === 'ERR_NETWORK') {
        showToast('Network error. Using demo data.', 'warning');
      } else {
        showToast('Failed to load report data. Using demo data.', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔧 FIXED: Enhanced handleExport with better error handling
  const handleExport = async (format) => {
    setExporting(true);
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        department: filters.department !== 'all' ? filters.department : undefined,
        employeeId: filters.employeeId !== 'all' ? filters.employeeId : undefined,
        reportType: filters.reportType,
        format
      };
      
      const response = await attendanceApi.exportAttendance(params);
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${filters.startDate}_to_${filters.endDate}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Report exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      
      // 🔧 FIXED: Fallback export using current data
      if (reportData.records && reportData.records.length > 0) {
        try {
          const csvData = generateCSVFromData(reportData.records);
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `attendance_report_${filters.startDate}_to_${filters.endDate}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Report exported using local data', 'success');
        } catch (fallbackError) {
          showToast('Failed to export report', 'error');
        }
      } else {
        showToast('No data to export', 'error');
      }
    } finally {
      setExporting(false);
    }
  };

  // 🔧 FIXED: Helper function to generate CSV from data
  const generateCSVFromData = (records) => {
    const headers = ['Employee Name', 'Department', 'Present Days', 'Absent Days', 'Late Days', 'Leave Days', 'Attendance %'];
    const rows = records.map(record => [
      record.employeeName,
      record.department,
      record.presentDays,
      record.absentDays,
      record.lateDays,
      record.leaveDays,
      record.attendanceRate
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  };

  // 🔧 FIXED: Reset filters function
  const resetFilters = () => {
    setFilters({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      department: 'all',
      employeeId: 'all',
      reportType: 'summary'
    });
  };

  // 🔧 FIXED: Retry function
  const handleRetry = () => {
    fetchReportData();
  };

  const getAttendanceRateColor = (rate) => {
    if (rate >= 90) return 'text-green-600 font-semibold';
    if (rate >= 75) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  // 🔧 FIXED: Enhanced loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // 🔧 FIXED: Error state with retry button
  if (error && !reportData?.records?.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Report</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
        <p className="text-gray-500 mt-1">Track and analyze employee attendance</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Select
            label="Report Type"
            value={filters.reportType}
            onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
            options={reportTypes}
          />
          <Select
            label="Department"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            options={[
              { value: 'all', label: 'All Departments' },
              ...departments
            ]}
            disabled={loadingFilters}
          />
          <Select
            label="Employee"
            value={filters.employeeId}
            onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
            options={[
              { value: 'all', label: 'All Employees' },
              ...employees.map(e => ({ 
                value: e._id || e.id, 
                label: `${e.firstName || e.name} ${e.lastName || ''}` 
              }))
            ]}
            disabled={loadingFilters}
          />
          <div className="flex items-end gap-2">
            <Button onClick={fetchReportData} isLoading={loading}>
              Generate Report
            </Button>
            <Button variant="secondary" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalEmployees}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-green-600">{reportData.summary.avgAttendanceRate}%</p>
            <p className="text-sm text-gray-500">Avg Attendance Rate</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-red-600">{reportData.summary.totalAbsentDays}</p>
            <p className="text-sm text-gray-500">Total Absent Days</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-yellow-600">{reportData.summary.totalLateDays}</p>
            <p className="text-sm text-gray-500">Total Late Days</p>
          </Card>
        </div>
      )}

      {/* Report Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Attendance Details</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => handleExport('csv')} 
              isLoading={exporting}
              disabled={!reportData?.records?.length}
            >
              📥 Export CSV
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => handleExport('excel')} 
              isLoading={exporting}
              disabled={!reportData?.records?.length}
            >
              📊 Export Excel
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {reportData?.records && reportData.records.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.presentDays || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {record.absentDays || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {record.lateDays || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {record.leaveDays || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${getAttendanceRateColor(record.attendanceRate)}`}>
                        {record.attendanceRate || 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No data available for the selected filters. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </Card>

      {/* 🔧 FIXED: Info Card when using mock data */}
      {reportData === MOCK_REPORT_DATA && (
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="text-sm font-medium text-blue-800">Demo Data Mode</p>
              <p className="text-xs text-blue-600">
                Showing demo data. Connect to backend API for real attendance reports.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendanceReports;