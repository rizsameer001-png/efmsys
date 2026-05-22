// // client/src/pages/reports/FinancialReports.jsx
// import React, { useState, useEffect } from 'react';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Select from '../../components/common/Select';

// const FinancialReports = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [filters, setFilters] = useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//     reportType: 'payroll_summary',
//     department: 'all'
//   });

//   const years = [2023, 2024, 2025, 2026];
//   const months = [
//     { value: 1, label: 'January' },
//     { value: 2, label: 'February' },
//     { value: 3, label: 'March' },
//     { value: 4, label: 'April' },
//     { value: 5, label: 'May' },
//     { value: 6, label: 'June' },
//     { value: 7, label: 'July' },
//     { value: 8, label: 'August' },
//     { value: 9, label: 'September' },
//     { value: 10, label: 'October' },
//     { value: 11, label: 'November' },
//     { value: 12, label: 'December' }
//   ];

//   const reportTypes = [
//     { value: 'payroll_summary', label: 'Payroll Summary' },
//     { value: 'department_payroll', label: 'Department-wise Payroll' },
//     { value: 'salary_comparison', label: 'Salary Comparison' },
//     { value: 'tax_report', label: 'Tax Report' },
//     { value: 'bank_transfer', label: 'Bank Transfer Report' }
//   ];

//   const departments = [
//     { value: 'all', label: 'All Departments' },
//     { value: 'operations', label: 'Operations' },
//     { value: 'technical', label: 'Technical' },
//     { value: 'housekeeping', label: 'Housekeeping' },
//     { value: 'security', label: 'Security' },
//     { value: 'management', label: 'Management' },
//     { value: 'hr', label: 'HR' },
//     { value: 'finance', label: 'Finance' }
//   ];

//   useEffect(() => {
//     fetchReportData();
//   }, [filters.year, filters.month, filters.reportType, filters.department]);

//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         year: filters.year,
//         month: filters.month,
//         reportType: filters.reportType,
//         department: filters.department !== 'all' ? filters.department : undefined
//       };
      
//       const response = await salaryApi.getPayrollReport(params.year, params.month, params.reportType, params.department);
//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch report error:', error);
//       showToast('Failed to load financial report', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async (format) => {
//     setExporting(true);
//     try {
//       const response = await salaryApi.exportPayrollReport(
//         filters.year,
//         filters.month,
//         filters.reportType,
//         filters.department !== 'all' ? filters.department : undefined,
//         format
//       );
      
//       const blob = new Blob([response.data], { 
//         type: format === 'csv' ? 'text/csv' : 
//               format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
//               'application/pdf'
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `financial_report_${filters.month}_${filters.year}.${format === 'excel' ? 'xlsx' : format}`;
//       a.click();
//       URL.revokeObjectURL(url);
      
//       showToast('Report exported successfully', 'success');
//     } catch (error) {
//       showToast('Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(amount || 0);
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
//         <p className="text-gray-500 mt-1">View payroll and financial analytics</p>
//       </div>

//       {/* Filters */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <Select
//             label="Year"
//             value={filters.year}
//             onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//             options={years.map(y => ({ value: y, label: y.toString() }))}
//           />
//           <Select
//             label="Month"
//             value={filters.month}
//             onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
//             options={months}
//           />
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
//             options={departments}
//           />
//           <div className="flex items-end gap-2">
//             <Button onClick={fetchReportData}>Generate Report</Button>
//             <Button variant="secondary" onClick={() => setFilters({
//               year: new Date().getFullYear(),
//               month: new Date().getMonth() + 1,
//               reportType: 'payroll_summary',
//               department: 'all'
//             })}>Reset</Button>
//           </div>
//         </div>
//       </Card>

//       {/* Summary Stats */}
//       {reportData?.summary && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.summary.totalPayroll)}</p>
//             <p className="text-sm text-gray-500">Total Payroll</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary.averageSalary)}</p>
//             <p className="text-sm text-gray-500">Average Salary</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-purple-600">{reportData.summary.totalEmployees}</p>
//             <p className="text-sm text-gray-500">Total Employees</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-orange-600">{formatCurrency(reportData.summary.totalDeductions)}</p>
//             <p className="text-sm text-gray-500">Total Deductions</p>
//           </Card>
//         </div>
//       )}

//       {/* Report Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Financial Details</h3>
//           <div className="flex gap-2">
//             <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//               📥 Export CSV
//             </Button>
//             <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//               📊 Export Excel
//             </Button>
//             <Button size="sm" variant="secondary" onClick={() => handleExport('pdf')} isLoading={exporting}>
//               📄 Export PDF
//             </Button>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           {reportData?.records?.length > 0 ? (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reportData.records.map((record, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {record.employeeName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(record.basicSalary)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(record.allowances)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(record.overtime)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                       {formatCurrency(record.deductions)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
//                       {formatCurrency(record.netSalary)}
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

// export default FinancialReports;






import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Select from '../../components/common/Select';

// 🔧 FIXED: Default report data to prevent undefined errors
const DEFAULT_REPORT_DATA = {
  summary: {
    totalPayroll: 0,
    averageSalary: 0,
    totalEmployees: 0,
    totalDeductions: 0
  },
  records: []
};

// 🔧 FIXED: Mock data for development/fallback
const MOCK_REPORT_DATA = {
  summary: {
    totalPayroll: 425000,
    averageSalary: 8500,
    totalEmployees: 50,
    totalDeductions: 42500
  },
  records: [
    {
      employeeName: 'John Doe',
      basicSalary: 12000,
      allowances: 2500,
      overtime: 500,
      deductions: 1000,
      netSalary: 14000
    },
    {
      employeeName: 'Jane Smith',
      basicSalary: 15000,
      allowances: 3000,
      overtime: 750,
      deductions: 1500,
      netSalary: 17250
    },
    {
      employeeName: 'Mike Johnson',
      basicSalary: 8000,
      allowances: 1500,
      overtime: 300,
      deductions: 800,
      netSalary: 9000
    },
    {
      employeeName: 'Sarah Williams',
      basicSalary: 10000,
      allowances: 2000,
      overtime: 400,
      deductions: 900,
      netSalary: 11500
    }
  ]
};

const FinancialReports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(DEFAULT_REPORT_DATA);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    reportType: 'payroll_summary',
    department: 'all'
  });

  // Generate years dynamically (current year - 5 to current year + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);
  
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const reportTypes = [
    { value: 'payroll_summary', label: 'Payroll Summary' },
    { value: 'department_payroll', label: 'Department-wise Payroll' },
    { value: 'salary_comparison', label: 'Salary Comparison' },
    { value: 'tax_report', label: 'Tax Report' },
    { value: 'bank_transfer', label: 'Bank Transfer Report' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'operations', label: 'Operations' },
    { value: 'technical', label: 'Technical' },
    { value: 'housekeeping', label: 'Housekeeping' },
    { value: 'security', label: 'Security' },
    { value: 'management', label: 'Management' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [filters.year, filters.month, filters.reportType, filters.department]);

  // 🔧 FIXED: Enhanced fetchReportData with error handling and mock fallback
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        year: filters.year,
        month: filters.month,
        reportType: filters.reportType,
        department: filters.department !== 'all' ? filters.department : undefined
      };
      
      const response = await salaryApi.getPayrollReport(
        filters.year, 
        filters.month, 
        filters.reportType, 
        filters.department !== 'all' ? filters.department : undefined
      );
      
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
        showToast('Using demo data. Connect to backend for live financial reports.', 'info');
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      setError(error.message);
      
      // Use mock data as fallback
      setReportData(MOCK_REPORT_DATA);
      
      // Show appropriate error message
      if (error.response?.status === 404) {
        showToast('Financial report API not available. Using demo data.', 'warning');
      } else if (error.response?.status === 403) {
        showToast('Access denied. Using demo data.', 'warning');
      } else if (error.code === 'ERR_NETWORK') {
        showToast('Network error. Using demo data.', 'warning');
      } else {
        showToast('Failed to load financial report. Using demo data.', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔧 FIXED: Enhanced handleExport with better error handling and fallback
  const handleExport = async (format) => {
    setExporting(true);
    try {
      const response = await salaryApi.exportPayrollReport(
        filters.year,
        filters.month,
        filters.reportType,
        filters.department !== 'all' ? filters.department : undefined,
        format
      );
      
      let mimeType = 'text/csv';
      let fileExtension = 'csv';
      
      if (format === 'excel') {
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
      } else if (format === 'pdf') {
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
      }
      
      const blob = new Blob([response.data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial_report_${getMonthName(filters.month)}_${filters.year}.${fileExtension}`;
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
          a.download = `financial_report_${getMonthName(filters.month)}_${filters.year}.csv`;
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

  // 🔧 FIXED: Helper function to get month name
  const getMonthName = (monthNumber) => {
    const month = months.find(m => m.value === monthNumber);
    return month ? month.label : `Month_${monthNumber}`;
  };

  // 🔧 FIXED: Helper function to generate CSV from data
  const generateCSVFromData = (records) => {
    const headers = ['Employee Name', 'Basic Salary', 'Allowances', 'Overtime', 'Deductions', 'Net Salary'];
    const rows = records.map(record => [
      record.employeeName,
      record.basicSalary,
      record.allowances,
      record.overtime,
      record.deductions,
      record.netSalary
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  };

  // 🔧 FIXED: Reset filters function
  const resetFilters = () => {
    setFilters({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      reportType: 'payroll_summary',
      department: 'all'
    });
  };

  // 🔧 FIXED: Retry function
  const handleRetry = () => {
    fetchReportData();
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'AED 0';
    return new Intl.NumberFormat('en-AE', { 
      style: 'currency', 
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-500 mt-1">View payroll and financial analytics</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Select
            label="Year"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
            options={years.map(y => ({ value: y, label: y.toString() }))}
          />
          <Select
            label="Month"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
            options={months}
          />
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
            options={departments}
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
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.summary.totalPayroll)}</p>
            <p className="text-sm text-gray-500">Total Payroll</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary.averageSalary)}</p>
            <p className="text-sm text-gray-500">Average Salary</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-purple-600">{reportData.summary.totalEmployees}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(reportData.summary.totalDeductions)}</p>
            <p className="text-sm text-gray-500">Total Deductions</p>
          </Card>
        </div>
      )}

      {/* Report Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Financial Details</h3>
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
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => handleExport('pdf')} 
              isLoading={exporting}
              disabled={!reportData?.records?.length}
            >
              📄 Export PDF
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {reportData?.records && reportData.records.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(record.basicSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(record.allowances)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(record.overtime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(record.deductions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(record.netSalary)}
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
                Showing demo data. Connect to backend API for real financial reports.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FinancialReports;