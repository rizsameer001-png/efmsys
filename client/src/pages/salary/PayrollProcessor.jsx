// // client/src/pages/salary/PayrollProcessor.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const PayrollProcessor = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [payrollStatus, setPayrollStatus] = useState('draft');

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   useEffect(() => {
//     fetchEmployeesForPayroll();
//   }, [selectedMonth, selectedYear]);

//   const fetchEmployeesForPayroll = async () => {
//     setLoading(true);
//     try {
//       const response = await salaryApi.getEmployeesForPayroll(selectedMonth, selectedYear);
//       if (response.data.success) {
//         setEmployees(response.data.data);
//         setPayrollStatus(response.data.status);
//       }
//     } catch (error) {
//       console.error('Fetch employees error:', error);
//       showToast('Failed to load employees', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedEmployees([]);
//     } else {
//       setSelectedEmployees(employees.map(emp => emp._id));
//     }
//     setSelectAll(!selectAll);
//   };

//   const handleSelectEmployee = (employeeId) => {
//     if (selectedEmployees.includes(employeeId)) {
//       setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
//       setSelectAll(false);
//     } else {
//       setSelectedEmployees([...selectedEmployees, employeeId]);
//       if (selectedEmployees.length + 1 === employees.length) {
//         setSelectAll(true);
//       }
//     }
//   };

//   const handleProcessSelected = async () => {
//     if (selectedEmployees.length === 0) {
//       showToast('Please select at least one employee', 'warning');
//       return;
//     }
    
//     setProcessing(true);
//     try {
//       const response = await salaryApi.processSelectedPayroll(selectedMonth, selectedYear, selectedEmployees);
//       if (response.data.success) {
//         showToast(`Payroll processed for ${selectedEmployees.length} employees`, 'success');
//         fetchEmployeesForPayroll();
//         setSelectedEmployees([]);
//         setSelectAll(false);
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to process payroll', 'error');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleProcessAll = async () => {
//     if (!window.confirm(`Process payroll for all ${employees.length} employees for ${months[selectedMonth - 1]} ${selectedYear}?`)) {
//       return;
//     }
    
//     setProcessing(true);
//     try {
//       const response = await salaryApi.processPayroll(selectedMonth, selectedYear);
//       if (response.data.success) {
//         showToast(`Payroll processed for all employees`, 'success');
//         fetchEmployeesForPayroll();
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to process payroll', 'error');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleApprovePayroll = async () => {
//     if (!window.confirm(`Approve payroll for ${months[selectedMonth - 1]} ${selectedYear}?`)) {
//       return;
//     }
    
//     setProcessing(true);
//     try {
//       const response = await salaryApi.approvePayroll(selectedMonth, selectedYear);
//       if (response.data.success) {
//         showToast('Payroll approved successfully', 'success');
//         fetchEmployeesForPayroll();
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to approve payroll', 'error');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-AE', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       draft: 'bg-gray-100 text-gray-800',
//       calculated: 'bg-blue-100 text-blue-800',
//       approved: 'bg-purple-100 text-purple-800',
//       paid: 'bg-green-100 text-green-800'
//     };
//     return badges[status] || badges.draft;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Payroll Processor</h1>
//           <p className="text-gray-500 mt-1">Calculate and process monthly payroll</p>
//         </div>
//         <div className="flex gap-3">
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             {months.map((month, idx) => (
//               <option key={idx} value={idx + 1}>{month}</option>
//             ))}
//           </select>
//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value={2023}>2023</option>
//             <option value={2024}>2024</option>
//             <option value={2025}>2025</option>
//           </select>
//         </div>
//       </div>

//       {/* Status Banner */}
//       <div className={`p-4 rounded-lg ${payrollStatus === 'approved' ? 'bg-green-100' : 'bg-blue-100'}`}>
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="font-medium">Payroll Status: <span className="capitalize">{payrollStatus}</span></p>
//             <p className="text-sm mt-1">
//               {payrollStatus === 'draft' && 'Ready to process payroll for selected employees'}
//               {payrollStatus === 'calculated' && 'Payroll calculated, pending approval'}
//               {payrollStatus === 'approved' && 'Payroll approved, ready for payment processing'}
//             </p>
//           </div>
//           <div className="flex gap-2">
//             {payrollStatus === 'draft' && (
//               <Button onClick={handleProcessAll} isLoading={processing} variant="primary">
//                 Process All
//               </Button>
//             )}
//             {payrollStatus === 'calculated' && (
//               <Button onClick={handleApprovePayroll} isLoading={processing} variant="success">
//                 Approve Payroll
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       {selectedEmployees.length > 0 && payrollStatus === 'draft' && (
//         <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
//           </p>
//           <Button onClick={handleProcessSelected} isLoading={processing} variant="primary" size="sm">
//             Process Selected
//           </Button>
//         </div>
//       )}

//       {/* Employees Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Employee Payroll List</h3>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={selectAll}
//               onChange={handleSelectAll}
//               disabled={payrollStatus !== 'draft'}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//             <span className="text-sm text-gray-600">Select All</span>
//           </label>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {employees.length > 0 ? (
//                 employees.map((emp) => (
//                   <tr key={emp._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedEmployees.includes(emp._id)}
//                         onChange={() => handleSelectEmployee(emp._id)}
//                         disabled={payrollStatus !== 'draft' || emp.status === 'processed'}
//                         className="w-4 h-4 rounded border-gray-300"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                           <span className="text-sm font-medium">{emp.name?.charAt(0)}</span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">{emp.name}</p>
//                           <p className="text-xs text-gray-500">{emp.employeeId}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                       {emp.department}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatCurrency(emp.basicSalary)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {formatCurrency(emp.totalAllowances)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                       {formatCurrency(emp.totalDeductions)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
//                       {formatCurrency(emp.netSalary)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(emp.status)}`}>
//                         {emp.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
//                     No employees found for this period
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Summary Footer */}
//       {employees.length > 0 && (
//         <Card className="p-4 bg-gray-50">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//             <div>
//               <p className="text-sm text-gray-500">Total Employees</p>
//               <p className="text-xl font-bold">{employees.length}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Payroll</p>
//               <p className="text-xl font-bold text-green-600">
//                 {formatCurrency(employees.reduce((sum, e) => sum + e.netSalary, 0))}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Processed Count</p>
//               <p className="text-xl font-bold text-blue-600">
//                 {employees.filter(e => e.status === 'processed').length}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Pending Count</p>
//               <p className="text-xl font-bold text-yellow-600">
//                 {employees.filter(e => e.status === 'draft').length}
//               </p>
//             </div>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default PayrollProcessor;




// client/src/pages/salary/PayrollProcessor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const PayrollProcessor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [payrollStatus, setPayrollStatus] = useState('draft');
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    country: ''
  });

  // Check if user has permission
  const canManagePayroll = hasPermission('payroll.manage') || 
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
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    yearOptions.push(i);
  }

  const departments = ['All', 'Operations', 'Technical', 'Housekeeping', 'Management', 'IT', 'HR'];
  const countries = ['All', 'UAE', 'INDIA', 'USA', 'UK'];

  useEffect(() => {
    if (canManagePayroll) {
      fetchEmployeesForPayroll();
    }
  }, [selectedMonth, selectedYear, filters.department, filters.country, canManagePayroll]);

  const fetchEmployeesForPayroll = async () => {
    setLoading(true);
    try {
      const response = await salaryApi.getEmployeesForPayroll(selectedMonth, selectedYear, filters.department, filters.country);
      
      if (response.success && response.data) {
        setEmployees(response.data);
        setPayrollStatus(response.status || 'draft');
      } else {
        // Use mock data as fallback
        setMockEmployees();
      }
    } catch (error) {
      console.error('Fetch employees error:', error);
      showToast(error.response?.data?.message || 'Failed to load employees', 'error');
      setMockEmployees();
    } finally {
      setLoading(false);
    }
  };

  const setMockEmployees = () => {
    setEmployees([
      {
        _id: '1',
        name: 'John Doe',
        employeeId: 'EMP001',
        department: 'Operations',
        country: 'UAE',
        basicSalary: 5000,
        totalAllowances: 2000,
        totalDeductions: 500,
        netSalary: 6500,
        status: 'draft',
        hasSalaryStructure: true,
        hasPayrollProcessed: false
      },
      {
        _id: '2',
        name: 'Jane Smith',
        employeeId: 'EMP002',
        department: 'Technical',
        country: 'INDIA',
        basicSalary: 6000,
        totalAllowances: 2500,
        totalDeductions: 600,
        netSalary: 7900,
        status: 'draft',
        hasSalaryStructure: true,
        hasPayrollProcessed: false
      },
      {
        _id: '3',
        name: 'Mike Johnson',
        employeeId: 'EMP003',
        department: 'Housekeeping',
        country: 'UAE',
        basicSalary: 3500,
        totalAllowances: 1000,
        totalDeductions: 300,
        netSalary: 4200,
        status: 'processed',
        hasSalaryStructure: true,
        hasPayrollProcessed: true
      }
    ]);
  };

  const handlePreviewPayroll = async () => {
    if (selectedEmployees.length === 0) {
      showToast('Please select at least one employee to preview', 'warning');
      return;
    }
    
    setPreviewing(true);
    try {
      const response = await salaryApi.previewPayroll(selectedEmployees, selectedMonth, selectedYear);
      
      if (response.success && response.data) {
        setPreviewData(response.data);
        setShowPreview(true);
      } else {
        showToast(response.error || 'Failed to preview payroll', 'error');
      }
    } catch (error) {
      console.error('Preview payroll error:', error);
      showToast(error.response?.data?.message || 'Failed to preview payroll', 'error');
    } finally {
      setPreviewing(false);
    }
  };

  const handleProcessSelected = async () => {
    if (selectedEmployees.length === 0) {
      showToast('Please select at least one employee', 'warning');
      return;
    }
    
    if (!window.confirm(`Process payroll for ${selectedEmployees.length} selected employee(s) for ${months[selectedMonth - 1]} ${selectedYear}?`)) {
      return;
    }
    
    setProcessing(true);
    try {
      const response = await salaryApi.processSelectedPayroll(selectedMonth, selectedYear, selectedEmployees);
      
      if (response.success) {
        showToast(response.message || `Payroll processed for ${selectedEmployees.length} employees`, 'success');
        fetchEmployeesForPayroll();
        setSelectedEmployees([]);
        setSelectAll(false);
      } else {
        showToast(response.error || 'Failed to process payroll', 'error');
      }
    } catch (error) {
      console.error('Process selected error:', error);
      showToast(error.response?.data?.message || 'Failed to process payroll', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessAll = async () => {
    const pendingEmployees = employees.filter(e => e.status !== 'processed');
    if (pendingEmployees.length === 0) {
      showToast('All employees have already been processed', 'info');
      return;
    }
    
    if (!window.confirm(`Process payroll for all ${pendingEmployees.length} pending employees for ${months[selectedMonth - 1]} ${selectedYear}?`)) {
      return;
    }
    
    setProcessing(true);
    try {
      const response = await salaryApi.processPayroll(selectedMonth, selectedYear);
      
      if (response.success) {
        showToast(response.message || `Payroll processed for all employees`, 'success');
        fetchEmployeesForPayroll();
      } else {
        showToast(response.error || 'Failed to process payroll', 'error');
      }
    } catch (error) {
      console.error('Process all error:', error);
      showToast(error.response?.data?.message || 'Failed to process payroll', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleApprovePayroll = async () => {
    if (!window.confirm(`Approve payroll for ${months[selectedMonth - 1]} ${selectedYear}? This will mark all processed payrolls as approved.`)) {
      return;
    }
    
    setProcessing(true);
    try {
      const response = await salaryApi.approvePayroll(selectedMonth, selectedYear);
      
      if (response.success) {
        showToast(response.message || 'Payroll approved successfully', 'success');
        fetchEmployeesForPayroll();
      } else {
        showToast(response.error || 'Failed to approve payroll', 'error');
      }
    } catch (error) {
      console.error('Approve payroll error:', error);
      showToast(error.response?.data?.message || 'Failed to approve payroll', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleExportPayroll = async () => {
    setProcessing(true);
    try {
      const response = await salaryApi.exportPayrollReport(selectedMonth, selectedYear, 'csv');
      
      if (response.success && response.data) {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Payroll report exported successfully', 'success');
      } else {
        // Fallback: generate CSV from current data
        exportToCSV();
      }
    } catch (error) {
      console.error('Export error:', error);
      exportToCSV();
    } finally {
      setProcessing(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Employee Name', 'Employee ID', 'Department', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status'];
    const rows = employees.map(emp => [
      emp.name,
      emp.employeeId,
      emp.department,
      emp.basicSalary,
      emp.totalAllowances,
      emp.totalDeductions,
      emp.netSalary,
      emp.status
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Payroll report exported', 'success');
  };

  const handleSelectAll = () => {
    const selectableEmployees = employees.filter(e => e.status !== 'processed');
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(selectableEmployees.map(emp => emp._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectEmployee = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
      setSelectAll(false);
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
      const selectableCount = employees.filter(e => e.status !== 'processed').length;
      if (selectedEmployees.length + 1 === selectableCount) {
        setSelectAll(true);
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setSelectedEmployees([]);
    setSelectAll(false);
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

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      calculated: 'bg-blue-100 text-blue-800',
      processed: 'bg-green-100 text-green-800',
      approved: 'bg-purple-100 text-purple-800',
      paid: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status?.toLowerCase()] || badges.draft;
  };

  const getDepartmentBadge = (department) => {
    const colors = {
      'Operations': 'bg-blue-100 text-blue-800',
      'Technical': 'bg-purple-100 text-purple-800',
      'Housekeeping': 'bg-green-100 text-green-800',
      'Management': 'bg-yellow-100 text-yellow-800',
      'IT': 'bg-cyan-100 text-cyan-800',
      'HR': 'bg-pink-100 text-pink-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  const selectableEmployees = employees.filter(e => e.status !== 'processed');
  const processedCount = employees.filter(e => e.status === 'processed').length;
  const pendingCount = employees.filter(e => e.status === 'draft' || e.status === 'calculated').length;
  const totalPayroll = employees.reduce((sum, e) => sum + (e.netSalary || 0), 0);
  const selectedTotalPayroll = employees
    .filter(e => selectedEmployees.includes(e._id))
    .reduce((sum, e) => sum + (e.netSalary || 0), 0);

  if (!canManagePayroll) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-yellow-800 font-medium">Access Denied</p>
          <p className="text-sm text-yellow-600 mt-1">
            You don't have permission to process payroll.
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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Processor</h1>
          <p className="text-gray-500 mt-1">Calculate and process monthly payroll</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month, idx) => (
              <option key={idx} value={idx + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'All' ? '' : dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {countries.map(country => (
                <option key={country} value={country === 'All' ? '' : country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" onClick={fetchEmployeesForPayroll} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg ${
        payrollStatus === 'approved' ? 'bg-green-100 border border-green-200' : 
        payrollStatus === 'processed' ? 'bg-blue-100 border border-blue-200' : 
        'bg-yellow-100 border border-yellow-200'
      }`}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <p className="font-medium">
              Payroll Status: <span className="capitalize font-bold">{payrollStatus}</span>
            </p>
            <p className="text-sm mt-1">
              {payrollStatus === 'draft' && '📝 Ready to process payroll for selected employees'}
              {payrollStatus === 'processed' && '✅ Payroll calculated, pending approval'}
              {payrollStatus === 'approved' && '💰 Payroll approved, ready for payment processing'}
            </p>
          </div>
          <div className="flex gap-2">
            {payrollStatus === 'draft' && pendingCount > 0 && (
              <Button onClick={handleProcessAll} isLoading={processing} variant="primary" size="sm">
                Process All ({pendingCount})
              </Button>
            )}
            {payrollStatus === 'processed' && (
              <Button onClick={handleApprovePayroll} isLoading={processing} variant="success" size="sm">
                Approve Payroll
              </Button>
            )}
            <Button onClick={handleExportPayroll} isLoading={processing} variant="secondary" size="sm">
              📥 Export
            </Button>
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedEmployees.length > 0 && payrollStatus === 'draft' && (
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <p className="text-sm font-medium text-blue-800">
              {selectedEmployees.length} employee(s) selected
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Total: {formatCurrency(selectedTotalPayroll)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handlePreviewPayroll} 
              isLoading={previewing} 
              variant="secondary" 
              size="sm"
            >
              👁️ Preview
            </Button>
            <Button 
              onClick={handleProcessSelected} 
              isLoading={processing} 
              variant="primary" 
              size="sm"
            >
              Process Selected
            </Button>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold text-gray-900">
            Employee Payroll List 
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({employees.length} employees)
            </span>
          </h3>
          {payrollStatus === 'draft' && selectableEmployees.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Select All Unprocessed</span>
            </label>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {payrollStatus === 'draft' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10">Select</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    {payrollStatus === 'draft' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(emp._id)}
                          onChange={() => handleSelectEmployee(emp._id)}
                          disabled={emp.status === 'processed'}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        />
                       </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-white">
                            {emp.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDepartmentBadge(emp.department)}`}>
                        {emp.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.country || 'UAE'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(emp.basicSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(emp.totalAllowances)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(emp.totalDeductions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      {formatCurrency(emp.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(emp.status)}`}>
                        {emp.status || 'draft'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={payrollStatus === 'draft' ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
                    No employees found for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Footer */}
      {employees.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Processed</p>
              <p className="text-xl font-bold text-green-600">{processedCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Payroll</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(totalPayroll)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Salary</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(employees.length > 0 ? totalPayroll / employees.length : 0)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Payroll Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📊 Preview for {previewData.previews?.length || 0} employees
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  Total Net Payroll: {formatCurrency(previewData.totals?.totalNetSalary || 0)}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Employee</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Basic</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Allowances</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Deductions</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.previews?.map((preview, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">
                          {preview.employeeName}
                          <br />
                          <span className="text-xs text-gray-500">{preview.employeeCode}</span>
                        </td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(preview.basic)}</td>
                        <td className="px-4 py-2 text-sm text-green-600">{formatCurrency(preview.allowances?.total)}</td>
                        <td className="px-4 py-2 text-sm text-red-600">{formatCurrency(preview.deductions?.total)}</td>
                        <td className="px-4 py-2 text-sm font-bold text-blue-600">{formatCurrency(preview.netSalary)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-6 border-t sticky bottom-0 bg-white flex justify-end">
              <Button onClick={() => setShowPreview(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollProcessor;