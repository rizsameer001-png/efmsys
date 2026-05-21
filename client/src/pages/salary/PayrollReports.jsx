// // client/src/pages/salary/PayrollReports.jsx
// import React, { useState, useEffect } from 'react';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const PayrollReports = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [reportType, setReportType] = useState('summary');
//   const [department, setDepartment] = useState('');
//   const [departments, setDepartments] = useState([]);
//   const [reportData, setReportData] = useState(null);

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   useEffect(() => {
//     fetchReportData();
//   }, [selectedMonth, selectedYear, reportType, department]);

//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       const response = await salaryApi.getPayrollReport(selectedMonth, selectedYear, reportType, department);
//       if (response.data.success) {
//         setReportData(response.data.data);
//         setDepartments(response.data.departments || []);
//       }
//     } catch (error) {
//       console.error('Fetch report error:', error);
//       showToast('Failed to load report', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async (format) => {
//     setExporting(true);
//     try {
//       const response = await salaryApi.exportPayrollReport(selectedMonth, selectedYear, reportType, department, format);
      
//       if (format === 'csv') {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `payroll_report_${months[selectedMonth - 1]}_${selectedYear}.csv`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//       } else {
//         // For PDF, open in new tab
//         const blob = new Blob([response.data], { type: 'application/pdf' });
//         const url = URL.createObjectURL(blob);
//         window.open(url, '_blank');
//       }
//       showToast(`Report exported successfully`, 'success');
//     } catch (error) {
//       showToast('Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-AE', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Payroll Reports</h1>
//         <p className="text-gray-500 mt-1">Generate and export payroll reports</p>
//       </div>

//       {/* Filters */}
//       <Card className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               {months.map((month, idx) => (
//                 <option key={idx} value={idx + 1}>{month}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value={2023}>2023</option>
//               <option value={2024}>2024</option>
//               <option value={2025}>2025</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value="summary">Summary Report</option>
//               <option value="detailed">Detailed Report</option>
//               <option value="department">Department Wise</option>
//               <option value="bank">Bank Transfer Report</option>
//               <option value="tax">Tax Report</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={department}
//               onChange={(e) => setDepartment(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value="">All Departments</option>
//               {departments.map(dept => (
//                 <option key={dept} value={dept}>{dept}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Export Buttons */}
//       <div className="flex gap-3">
//         <Button onClick={() => handleExport('csv')} isLoading={exporting} variant="secondary">
//           📥 Export CSV
//         </Button>
//         <Button onClick={() => handleExport('pdf')} isLoading={exporting} variant="secondary">
//           📄 Export PDF
//         </Button>
//       </div>

//       {/* Report Content */}
//       {reportData && (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card className="p-4 text-center">
//               <p className="text-2xl font-bold text-blue-600">{reportData.summary?.totalEmployees || 0}</p>
//               <p className="text-sm text-gray-500">Total Employees</p>
//             </Card>
//             <Card className="p-4 text-center">
//               <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary?.totalPayroll || 0)}</p>
//               <p className="text-sm text-gray-500">Total Payroll</p>
//             </Card>
//             <Card className="p-4 text-center">
//               <p className="text-2xl font-bold text-purple-600">{formatCurrency(reportData.summary?.averageSalary || 0)}</p>
//               <p className="text-sm text-gray-500">Average Salary</p>
//             </Card>
//             <Card className="p-4 text-center">
//               <p className="text-2xl font-bold text-orange-600">{formatCurrency(reportData.summary?.totalDeductions || 0)}</p>
//               <p className="text-sm text-gray-500">Total Deductions</p>
//             </Card>
//           </div>

//           {/* Department Summary */}
//           {reportData.departmentWise && reportData.departmentWise.length > 0 && (
//             <Card className="p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">Department Wise Summary</h3>
//               <div className="space-y-4">
//                 {reportData.departmentWise.map((dept, idx) => (
//                   <div key={idx}>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span className="capitalize font-medium">{dept.department}</span>
//                       <span>{dept.employeeCount} employees • {formatCurrency(dept.totalPayroll)}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-600 h-2 rounded-full"
//                         style={{ width: `${(dept.totalPayroll / reportData.summary.totalPayroll) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           )}

//           {/* Detailed Table */}
//           {reportData.employees && reportData.employees.length > 0 && (
//             <Card className="overflow-hidden">
//               <div className="px-6 py-4 border-b bg-gray-50">
//                 <h3 className="font-semibold text-gray-900">Employee Payroll Details</h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Account</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {reportData.employees.map((emp, idx) => (
//                       <tr key={idx} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>
//                             <p className="text-sm font-medium text-gray-900">{emp.name}</p>
//                             <p className="text-xs text-gray-500">{emp.employeeId}</p>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{emp.department}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(emp.basic)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{formatCurrency(emp.allowances)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-{formatCurrency(emp.deductions)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
//                           {formatCurrency(emp.netSalary)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.bankAccount || 'N/A'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot className="bg-gray-50">
//                     <tr>
//                       <td colSpan="2" className="px-6 py-3 text-right font-semibold">Total:</td>
//                       <td className="px-6 py-3 font-semibold">{formatCurrency(reportData.totals?.basic)}</td>
//                       <td className="px-6 py-3 font-semibold text-green-600">{formatCurrency(reportData.totals?.allowances)}</td>
//                       <td className="px-6 py-3 font-semibold text-red-600">{formatCurrency(reportData.totals?.deductions)}</td>
//                       <td className="px-6 py-3 font-bold text-green-600">{formatCurrency(reportData.totals?.netSalary)}</td>
//                       <td></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PayrollReports;



// client/src/pages/salary/PayrollReports.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const PayrollReports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportType, setReportType] = useState('summary');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [departments, setDepartments] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [totals, setTotals] = useState(null);

  // Check if user has permission
  const canViewReports = hasPermission('payroll.view') || 
                         hasPermission('reports.view') ||
                         user?.role === 'admin' || 
                         user?.role === 'super_admin' || 
                         user?.role === 'hr';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
    yearOptions.push(i);
  }

  const reportTypes = [
    { value: 'summary', label: '📊 Summary Report', icon: '📊' },
    { value: 'detailed', label: '📋 Detailed Employee Report', icon: '📋' },
    { value: 'department', label: '🏢 Department Wise Report', icon: '🏢' },
    { value: 'bank', label: '🏦 Bank Transfer Report', icon: '🏦' },
    { value: 'tax', label: '💰 Tax Report', icon: '💰' },
    { value: 'country', label: '🌍 Country Wise Report', icon: '🌍' }
  ];

  const countries = [
    { value: '', label: 'All Countries' },
    { value: 'UAE', label: 'United Arab Emirates' },
    { value: 'INDIA', label: 'India' },
    { value: 'USA', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' }
  ];

  useEffect(() => {
    if (canViewReports) {
      fetchReportData();
    }
  }, [selectedMonth, selectedYear, reportType, department, country, canViewReports]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let response;
      
      switch(reportType) {
        case 'summary':
          response = await salaryApi.getPayrollDashboard(selectedMonth, selectedYear);
          break;
        case 'detailed':
          response = await salaryApi.getPayrollReport(selectedMonth, selectedYear, 'detailed', department);
          break;
        case 'department':
          response = await salaryApi.getDepartmentSummary(selectedMonth, selectedYear);
          break;
        case 'country':
          response = await salaryApi.getCountrySummary(selectedMonth, selectedYear);
          break;
        case 'bank':
          response = await salaryApi.getBankTransferReport(selectedMonth, selectedYear);
          break;
        case 'tax':
          response = await salaryApi.getTaxReport(selectedMonth, selectedYear);
          break;
        default:
          response = await salaryApi.getPayrollDashboard(selectedMonth, selectedYear);
      }
      
      if (response.success) {
        setReportData(response.data);
        setSummary(response.data?.summary || response.data);
        setTotals(response.data?.totals || null);
        
        // Extract unique departments for filter
        if (response.data?.employees) {
          const depts = [...new Set(response.data.employees.map(emp => emp.department))];
          setDepartments(depts);
        } else if (response.data?.departmentWise) {
          const depts = response.data.departmentWise.map(d => d.department);
          setDepartments(depts);
        }
      } else {
        // Use mock data as fallback
        setMockReportData();
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      showToast(error.response?.data?.message || 'Failed to load report', 'error');
      setMockReportData();
    } finally {
      setLoading(false);
    }
  };

  const setMockReportData = () => {
    const mockEmployees = [
      { id: '1', name: 'John Doe', employeeId: 'EMP001', department: 'Operations', basic: 5000, allowances: 2000, deductions: 500, netSalary: 6500, bankAccount: '1234567890' },
      { id: '2', name: 'Jane Smith', employeeId: 'EMP002', department: 'Technical', basic: 6000, allowances: 2500, deductions: 600, netSalary: 7900, bankAccount: '0987654321' },
      { id: '3', name: 'Mike Johnson', employeeId: 'EMP003', department: 'Housekeeping', basic: 3500, allowances: 1000, deductions: 300, netSalary: 4200, bankAccount: '1122334455' },
      { id: '4', name: 'Sarah Williams', employeeId: 'EMP004', department: 'Management', basic: 8000, allowances: 4000, deductions: 1000, netSalary: 11000, bankAccount: '5544332211' }
    ];

    const totalBasic = mockEmployees.reduce((sum, e) => sum + e.basic, 0);
    const totalAllowances = mockEmployees.reduce((sum, e) => sum + e.allowances, 0);
    const totalDeductions = mockEmployees.reduce((sum, e) => sum + e.deductions, 0);
    const totalNetSalary = mockEmployees.reduce((sum, e) => sum + e.netSalary, 0);

    setReportData({
      summary: {
        totalEmployees: mockEmployees.length,
        totalPayroll: totalNetSalary,
        averageSalary: totalNetSalary / mockEmployees.length,
        totalDeductions: totalDeductions,
        totalAllowances: totalAllowances
      },
      departmentWise: [
        { department: 'Operations', employeeCount: 1, totalPayroll: 6500 },
        { department: 'Technical', employeeCount: 1, totalPayroll: 7900 },
        { department: 'Housekeeping', employeeCount: 1, totalPayroll: 4200 },
        { department: 'Management', employeeCount: 1, totalPayroll: 11000 }
      ],
      employees: mockEmployees,
      totals: {
        basic: totalBasic,
        allowances: totalAllowances,
        deductions: totalDeductions,
        netSalary: totalNetSalary
      }
    });
    setSummary({
      totalEmployees: mockEmployees.length,
      totalPayroll: totalNetSalary,
      averageSalary: totalNetSalary / mockEmployees.length,
      totalDeductions: totalDeductions
    });
    setTotals({
      basic: totalBasic,
      allowances: totalAllowances,
      deductions: totalDeductions,
      netSalary: totalNetSalary
    });
    setDepartments(['Operations', 'Technical', 'Housekeeping', 'Management']);
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      let response;
      
      switch(reportType) {
        case 'summary':
          response = await salaryApi.exportPayrollReport(selectedMonth, selectedYear, format);
          break;
        case 'detailed':
          response = await salaryApi.exportDetailedReport(selectedMonth, selectedYear, department, format);
          break;
        case 'bank':
          response = await salaryApi.exportBankFile(selectedMonth, selectedYear, format);
          break;
        default:
          response = await salaryApi.exportPayrollReport(selectedMonth, selectedYear, format);
      }
      
      if (response.success && response.data) {
        if (format === 'csv' || format === 'excel') {
          const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `payroll_report_${reportType}_${months[selectedMonth - 1]}_${selectedYear}.${format === 'csv' ? 'csv' : 'xlsx'}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast(`Report exported as ${format.toUpperCase()} successfully`, 'success');
        } else if (format === 'pdf') {
          // For PDF, create a printable version
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(generatePDFContent());
            printWindow.document.close();
            printWindow.print();
          }
          showToast('Report ready for printing', 'success');
        } else {
          // Fallback: generate CSV from current data
          exportToCSV();
        }
      } else {
        // Fallback: generate CSV from current data
        exportToCSV();
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast(error.response?.data?.message || 'Failed to export report', 'error');
      // Fallback: generate CSV from current data
      exportToCSV();
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData?.employees && !reportData?.departmentWise) {
      showToast('No data to export', 'warning');
      return;
    }
    
    let csvContent = '';
    let filename = `payroll_report_${reportType}_${months[selectedMonth - 1]}_${selectedYear}.csv`;
    
    if (reportData.employees && reportData.employees.length > 0) {
      // Employee details CSV
      const headers = ['Employee Name', 'Employee ID', 'Department', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Bank Account'];
      csvContent = headers.join(',') + '\n';
      
      reportData.employees.forEach(emp => {
        const row = [
          `"${emp.name}"`,
          emp.employeeId,
          emp.department,
          emp.basic,
          emp.allowances,
          emp.deductions,
          emp.netSalary,
          emp.bankAccount || ''
        ];
        csvContent += row.join(',') + '\n';
      });
    } else if (reportData.departmentWise) {
      // Department summary CSV
      const headers = ['Department', 'Employee Count', 'Total Payroll', 'Average Salary'];
      csvContent = headers.join(',') + '\n';
      
      reportData.departmentWise.forEach(dept => {
        const row = [
          `"${dept.department}"`,
          dept.employeeCount,
          dept.totalPayroll,
          dept.averageSalary || (dept.totalPayroll / dept.employeeCount)
        ];
        csvContent += row.join(',') + '\n';
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report exported as CSV', 'success');
  };

  const generatePDFContent = () => {
    const reportTitle = reportTypes.find(r => r.value === reportType)?.label || 'Payroll Report';
    const currentDate = new Date().toLocaleString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle} - ${months[selectedMonth - 1]} ${selectedYear}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #1e40af; }
          .subtitle { font-size: 16px; color: #6b7280; margin-top: 5px; }
          .date { font-size: 12px; color: #9ca3af; margin-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
          .summary-cards { display: flex; gap: 20px; margin: 20px 0; }
          .card { flex: 1; padding: 15px; background: #f9fafb; border-radius: 8px; text-align: center; }
          .card-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .card-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${reportTitle}</div>
          <div class="subtitle">${months[selectedMonth - 1]} ${selectedYear}</div>
          <div class="date">Generated: ${currentDate}</div>
        </div>
        
        <div class="summary-cards">
          <div class="card">
            <div class="card-value">${summary?.totalEmployees || 0}</div>
            <div class="card-label">Total Employees</div>
          </div>
          <div class="card">
            <div class="card-value">AED ${(summary?.totalPayroll || 0).toLocaleString()}</div>
            <div class="card-label">Total Payroll</div>
          </div>
          <div class="card">
            <div class="card-value">AED ${(summary?.averageSalary || 0).toLocaleString()}</div>
            <div class="card-label">Average Salary</div>
          </div>
          <div class="card">
            <div class="card-value">AED ${(summary?.totalDeductions || 0).toLocaleString()}</div>
            <div class="card-label">Total Deductions</div>
          </div>
        </div>
        
        ${reportData?.employees ? `
          <table>
            <thead>
              <tr><th>Employee Name</th><th>Employee ID</th><th>Department</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Salary</th></tr>
            </thead>
            <tbody>
              ${reportData.employees.map(emp => `
                <tr>
                  <td>${emp.name}</td>
                  <td>${emp.employeeId}</td>
                  <td>${emp.department}</td>
                  <td>AED ${emp.basic.toLocaleString()}</td>
                  <td>AED ${emp.allowances.toLocaleString()}</td>
                  <td>AED ${emp.deductions.toLocaleString()}</td>
                  <td><strong>AED ${emp.netSalary.toLocaleString()}</strong></td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f3f4f6;">
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>AED ${totals?.basic?.toLocaleString() || 0}</strong></td>
                <td><strong>AED ${totals?.allowances?.toLocaleString() || 0}</strong></td>
                <td><strong>AED ${totals?.deductions?.toLocaleString() || 0}</strong></td>
                <td><strong>AED ${totals?.netSalary?.toLocaleString() || 0}</strong></td>
              </tr>
            </tfoot>
          </table>
        ` : ''}
        
        <div class="footer">
          <p>This is a system generated report. Valid for the month of ${months[selectedMonth - 1]} ${selectedYear}.</p>
          <p>Facility Management System - Payroll Department</p>
        </div>
      </body>
      </html>
    `;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'AED 0';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!canViewReports) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-yellow-800 font-medium">Access Denied</p>
          <p className="text-sm text-yellow-600 mt-1">
            You don't have permission to view payroll reports.
          </p>
          <p className="text-xs text-yellow-500 mt-2">
            Required role: Admin, HR, or Super Admin
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Reports</h1>
        <p className="text-gray-500 mt-1">Generate and export comprehensive payroll reports</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {reportType === 'detailed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}
          {reportType === 'country' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {countries.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={fetchReportData}>
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Export Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => handleExport('csv')} isLoading={exporting} variant="secondary">
          📥 Export CSV
        </Button>
        <Button onClick={() => handleExport('excel')} isLoading={exporting} variant="secondary">
          📊 Export Excel
        </Button>
        <Button onClick={() => handleExport('pdf')} isLoading={exporting} variant="secondary">
          📄 Export PDF / Print
        </Button>
      </div>

      {/* Report Content */}
      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{summary?.totalEmployees || 0}</p>
              <p className="text-sm text-gray-500">Total Employees</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary?.totalPayroll || 0)}</p>
              <p className="text-sm text-gray-500">Total Payroll</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(summary?.averageSalary || 0)}</p>
              <p className="text-sm text-gray-500">Average Salary</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(summary?.totalDeductions || 0)}</p>
              <p className="text-sm text-gray-500">Total Deductions</p>
            </Card>
          </div>

          {/* Department Summary */}
          {reportData.departmentWise && reportData.departmentWise.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">🏢 Department Wise Summary</h3>
              <div className="space-y-4">
                {reportData.departmentWise.map((dept, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium">{dept.department}</span>
                      <span>
                        {dept.employeeCount} employees • {formatCurrency(dept.totalPayroll)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(dept.totalPayroll / summary?.totalPayroll) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Country Summary */}
          {reportData.countryWise && reportData.countryWise.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">🌍 Country Wise Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.countryWise.map((countryItem, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{countryItem.country}</span>
                      <span className="text-sm text-gray-500">{countryItem.employeeCount} employees</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600 mt-2">{formatCurrency(countryItem.totalPayroll)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Detailed Table */}
          {reportData.employees && reportData.employees.length > 0 && (
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">📋 Employee Payroll Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Account</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.employees.map((emp, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.employeeId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{emp.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(emp.basic)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{formatCurrency(emp.allowances)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-{formatCurrency(emp.deductions)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          {formatCurrency(emp.netSalary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.bankAccount || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                  {totals && (
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="2" className="px-6 py-3 text-right font-semibold">Total:</td>
                        <td className="px-6 py-3 font-semibold">{formatCurrency(totals.basic)}</td>
                        <td className="px-6 py-3 font-semibold text-green-600">+{formatCurrency(totals.allowances)}</td>
                        <td className="px-6 py-3 font-semibold text-red-600">-{formatCurrency(totals.deductions)}</td>
                        <td className="px-6 py-3 font-bold text-blue-600">{formatCurrency(totals.netSalary)}</td>
                        <td className="px-6 py-3"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* No Data Message */}
      {!reportData?.employees?.length && !reportData?.departmentWise?.length && (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-500">No data available for the selected filters</p>
          <p className="text-sm text-gray-400 mt-1">Try changing the report type or date range</p>
        </Card>
      )}
    </div>
  );
};

export default PayrollReports;