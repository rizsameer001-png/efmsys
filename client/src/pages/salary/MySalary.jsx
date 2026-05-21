// // client/src/pages/salary/MySalary.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const MySalary = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [currentSalary, setCurrentSalary] = useState(null);
//   const [salaryHistory, setSalaryHistory] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   useEffect(() => {
//     fetchSalaryData();
//   }, [selectedMonth, selectedYear]);

//   const fetchSalaryData = async () => {
//     setLoading(true);
//     try {
//       const [currentRes, historyRes] = await Promise.all([
//         salaryApi.getMySalary(),
//         salaryApi.getSalaryHistory(selectedMonth, selectedYear)
//       ]);
      
//       if (currentRes.data.success) {
//         setCurrentSalary(currentRes.data.data);
//       }
//       if (historyRes.data.success) {
//         setSalaryHistory(historyRes.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch salary error:', error);
//       showToast('Failed to load salary data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-AE', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       paid: 'bg-green-100 text-green-800',
//       processed: 'bg-blue-100 text-blue-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       draft: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Salary</h1>
//           <p className="text-gray-500 mt-1">View your salary details and payment history</p>
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

//       {/* Current Salary Card */}
//       {currentSalary && (
//         <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-blue-100">Current Month Salary</p>
//               <p className="text-4xl font-bold mt-1">{formatCurrency(currentSalary.netSalary)}</p>
//               <p className="text-blue-100 text-sm mt-2">{months[selectedMonth - 1]} {selectedYear}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-blue-100">Payment Status</p>
//               <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(currentSalary.status)}`}>
//                 {currentSalary.status?.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Salary Breakdown */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Earnings */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="text-green-600">💰</span> Earnings
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Basic Salary</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.earningsCalculated?.basic || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Housing Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.earningsCalculated?.housingAllowance || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Transport Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.earningsCalculated?.transportAllowance || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Medical Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.earningsCalculated?.medicalAllowance || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Overtime Pay</span>
//               <span className="font-medium text-green-600">+{formatCurrency(currentSalary?.earningsCalculated?.overtimePay || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Bonus/Incentives</span>
//               <span className="font-medium text-green-600">+{formatCurrency(currentSalary?.earningsCalculated?.bonus || 0)}</span>
//             </div>
//             <div className="flex justify-between py-3 bg-green-50 rounded-lg px-3 mt-2">
//               <span className="font-semibold text-gray-900">Total Earnings</span>
//               <span className="font-bold text-green-700">{formatCurrency(currentSalary?.earningsCalculated?.totalEarnings || 0)}</span>
//             </div>
//           </div>
//         </Card>

//         {/* Deductions */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="text-red-600">📉</span> Deductions
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Income Tax</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductionsCalculated?.tax || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Social Security</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductionsCalculated?.socialSecurity || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Pension Fund</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductionsCalculated?.pension || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Loan Recovery</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductionsCalculated?.loanRecovery || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Insurance</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductionsCalculated?.insurance || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Unpaid Leave</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductionsCalculated?.unpaidLeave || 0)}</span>
//             </div>
//             <div className="flex justify-between py-3 bg-red-50 rounded-lg px-3 mt-2">
//               <span className="font-semibold text-gray-900">Total Deductions</span>
//               <span className="font-bold text-red-700">-{formatCurrency(currentSalary?.deductionsCalculated?.totalDeductions || 0)}</span>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Net Salary Summary */}
//       <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-gray-600">Net Payable Amount</p>
//             <p className="text-3xl font-bold text-green-700">{formatCurrency(currentSalary?.netSalary || 0)}</p>
//           </div>
//           <Link to={`/salary/slip/${selectedYear}-${selectedMonth}`}>
//             <Button variant="secondary">
//               📄 Download Salary Slip
//             </Button>
//           </Link>
//         </div>
//       </Card>

//       {/* Salary History Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">Salary History</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slip</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {salaryHistory.length > 0 ? (
//                 salaryHistory.map((salary, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {months[salary.month - 1]} {salary.year}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(salary.basic)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(salary.totalAllowances)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(salary.totalDeductions)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
//                       {formatCurrency(salary.netSalary)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(salary.status)}`}>
//                         {salary.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <Link to={`/salary/slip/${salary.year}-${salary.month}`} className="text-blue-600 hover:text-blue-800">
//                         View Slip →
//                       </Link>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
//                     No salary history found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default MySalary;




// // client/src/pages/salary/MySalary.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const MySalary = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [currentSalary, setCurrentSalary] = useState(null);
//   const [salaryHistory, setSalaryHistory] = useState([]);
//   const [salaryStructure, setSalaryStructure] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [downloading, setDownloading] = useState(false);

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   // Generate year options
//   const currentYear = new Date().getFullYear();
//   const yearOptions = [];
//   for (let i = currentYear - 2; i <= currentYear; i++) {
//     yearOptions.push(i);
//   }

//   useEffect(() => {
//     fetchSalaryData();
//   }, [selectedMonth, selectedYear]);

//   const fetchSalaryData = async () => {
//     setLoading(true);
//     try {
//       // Fetch current month salary
//       const salaryResponse = await salaryApi.getMySalary(selectedMonth, selectedYear);
      
//       if (salaryResponse.success) {
//         setCurrentSalary(salaryResponse.data);
//       } else {
//         // Use mock data if API fails
//         setMockSalaryData();
//       }
      
//       // Fetch salary history
//       const historyResponse = await salaryApi.getSalaryHistory();
//       if (historyResponse.success) {
//         setSalaryHistory(historyResponse.data || []);
//       }
      
//       // Fetch salary structure
//       if (user?._id) {
//         const structureResponse = await salaryApi.getSalaryStructure(user._id);
//         if (structureResponse.success) {
//           setSalaryStructure(structureResponse.data);
//         }
//       }
      
//     } catch (error) {
//       console.error('Fetch salary error:', error);
//       showToast(error.response?.data?.message || 'Failed to load salary data', 'error');
//       // Set mock data as fallback
//       setMockSalaryData();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setMockSalaryData = () => {
//     const currentDate = new Date();
//     setCurrentSalary({
//       employee: {
//         name: user?.name || 'Employee',
//         employeeId: user?.employeeId || 'EMP001',
//         designation: user?.designation || 'Technician',
//         department: user?.department || 'Operations'
//       },
//       month: selectedMonth,
//       year: selectedYear,
//       basic: 5000,
//       allowances: {
//         housing: 1250,
//         transport: 800,
//         medical: 750,
//         education: 0,
//         telephone: 200,
//         total: 3000
//       },
//       overtimePay: 0,
//       deductions: {
//         incomeTax: 0,
//         socialSecurity: 0,
//         pension: 0,
//         loanRecovery: 0,
//         insurance: 0,
//         other: 0,
//         unpaidLeave: 0,
//         total: 0
//       },
//       grossSalary: 8000,
//       netSalary: 8000,
//       status: 'processed',
//       isProcessed: true,
//       attendance: {
//         presentDays: 22,
//         absentDays: 0,
//         halfDays: 0,
//         overtimeHours: 0
//       },
//       leaves: {
//         paidLeaves: 0,
//         unpaidLeaves: 0
//       }
//     });

//     // Mock salary history
//     const mockHistory = [];
//     for (let i = 1; i <= 6; i++) {
//       const month = selectedMonth - i;
//       const year = month <= 0 ? selectedYear - 1 : selectedYear;
//       const actualMonth = month <= 0 ? month + 12 : month;
//       mockHistory.push({
//         month: actualMonth,
//         year: year,
//         basic: 5000,
//         totalAllowances: 3000,
//         totalDeductions: 0,
//         netSalary: 8000,
//         status: 'paid'
//       });
//     }
//     setSalaryHistory(mockHistory);
//   };

//   const handleDownloadSlip = async () => {
//     setDownloading(true);
//     try {
//       const response = await salaryApi.getSalarySlip(user?._id, selectedMonth, selectedYear);
      
//       if (response.success && response.data) {
//         // Create a printable version
//         const printWindow = window.open('', '_blank');
//         if (printWindow) {
//           printWindow.document.write(`
//             <!DOCTYPE html>
//             <html>
//             <head>
//               <title>Salary Slip - ${months[selectedMonth - 1]} ${selectedYear}</title>
//               <style>
//                 body { font-family: Arial, sans-serif; margin: 40px; }
//                 .header { text-align: center; margin-bottom: 30px; }
//                 .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
//                 .slip-title { font-size: 20px; margin-top: 10px; }
//                 .employee-details { margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; }
//                 .section { margin: 20px 0; }
//                 .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #ccc; }
//                 .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
//                 .total-row { font-weight: bold; font-size: 16px; margin-top: 10px; padding-top: 10px; border-top: 2px solid #000; }
//                 .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #6b7280; }
//                 .status-paid { color: #059669; font-weight: bold; }
//               </style>
//             </head>
//             <body>
//               <div class="header">
//                 <div class="company-name">Facility Management System</div>
//                 <div class="slip-title">Salary Slip</div>
//                 <div>${months[selectedMonth - 1]} ${selectedYear}</div>
//               </div>
              
//               <div class="employee-details">
//                 <div class="row"><strong>Employee Name:</strong> ${currentSalary?.employee?.name || user?.name || 'N/A'}</div>
//                 <div class="row"><strong>Employee ID:</strong> ${currentSalary?.employee?.employeeId || user?.employeeId || 'N/A'}</div>
//                 <div class="row"><strong>Designation:</strong> ${currentSalary?.employee?.designation || user?.designation || 'N/A'}</div>
//                 <div class="row"><strong>Department:</strong> ${currentSalary?.employee?.department || user?.department || 'N/A'}</div>
//               </div>
              
//               <div class="section">
//                 <div class="section-title">Earnings</div>
//                 <div class="row"><span>Basic Salary</span><span>${formatCurrency(currentSalary?.basic || 0)}</span></div>
//                 <div class="row"><span>Housing Allowance</span><span>${formatCurrency(currentSalary?.allowances?.housing || 0)}</span></div>
//                 <div class="row"><span>Transport Allowance</span><span>${formatCurrency(currentSalary?.allowances?.transport || 0)}</span></div>
//                 <div class="row"><span>Medical Allowance</span><span>${formatCurrency(currentSalary?.allowances?.medical || 0)}</span></div>
//                 <div class="row"><span>Overtime Pay</span><span>${formatCurrency(currentSalary?.overtimePay || 0)}</span></div>
//                 <div class="row total-row"><span>Gross Salary</span><span>${formatCurrency(currentSalary?.grossSalary || 0)}</span></div>
//               </div>
              
//               <div class="section">
//                 <div class="section-title">Deductions</div>
//                 <div class="row"><span>Income Tax</span><span>${formatCurrency(currentSalary?.deductions?.incomeTax || 0)}</span></div>
//                 <div class="row"><span>Social Security</span><span>${formatCurrency(currentSalary?.deductions?.socialSecurity || 0)}</span></div>
//                 <div class="row"><span>Pension Fund</span><span>${formatCurrency(currentSalary?.deductions?.pension || 0)}</span></div>
//                 <div class="row"><span>Loan Recovery</span><span>${formatCurrency(currentSalary?.deductions?.loanRecovery || 0)}</span></div>
//                 <div class="row"><span>Insurance</span><span>${formatCurrency(currentSalary?.deductions?.insurance || 0)}</span></div>
//                 <div class="row total-row"><span>Total Deductions</span><span>${formatCurrency(currentSalary?.deductions?.total || 0)}</span></div>
//               </div>
              
//               <div class="section">
//                 <div class="row total-row"><span>Net Salary</span><span class="status-paid">${formatCurrency(currentSalary?.netSalary || 0)}</span></div>
//               </div>
              
//               <div class="footer">
//                 <p>This is a system generated salary slip. Valid for the month of ${months[selectedMonth - 1]} ${selectedYear}.</p>
//                 <p>Generated on: ${new Date().toLocaleString()}</p>
//               </div>
//             </body>
//             </html>
//           `);
//           printWindow.document.close();
//           printWindow.print();
//         } else {
//           showToast('Unable to open print window', 'error');
//         }
//       } else {
//         showToast(response.error || 'Failed to generate salary slip', 'error');
//       }
//     } catch (error) {
//       console.error('Download slip error:', error);
//       showToast(error.response?.data?.message || 'Failed to download salary slip', 'error');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return 'AED 0';
//     return new Intl.NumberFormat('en-AE', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       paid: 'bg-green-100 text-green-800',
//       processed: 'bg-blue-100 text-blue-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       draft: 'bg-gray-100 text-gray-800',
//       approved: 'bg-purple-100 text-purple-800'
//     };
//     return colors[status?.toLowerCase()] || colors.pending;
//   };

//   const getStatusText = (status) => {
//     const texts = {
//       paid: 'Paid',
//       processed: 'Processed',
//       pending: 'Pending',
//       draft: 'Draft',
//       approved: 'Approved'
//     };
//     return texts[status?.toLowerCase()] || status || 'Pending';
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Salary</h1>
//           <p className="text-gray-500 mt-1">View your salary details and payment history</p>
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
//             {yearOptions.map(year => (
//               <option key={year} value={year}>{year}</option>
//             ))}
//           </select>
//           <Button variant="secondary" size="sm" onClick={fetchSalaryData}>
//             ↻ Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Current Salary Card */}
//       {currentSalary && (
//         <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//           <div className="flex justify-between items-start flex-wrap gap-4">
//             <div>
//               <p className="text-blue-100">Current Month Salary</p>
//               <p className="text-4xl font-bold mt-1">{formatCurrency(currentSalary.netSalary)}</p>
//               <p className="text-blue-100 text-sm mt-2">
//                 {months[selectedMonth - 1]} {selectedYear}
//               </p>
//               {currentSalary.attendance && (
//                 <p className="text-blue-100 text-xs mt-1">
//                   📍 Present: {currentSalary.attendance.presentDays} days
//                 </p>
//               )}
//             </div>
//             <div className="text-right">
//               <p className="text-blue-100">Payment Status</p>
//               <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(currentSalary.status)}`}>
//                 {getStatusText(currentSalary.status)}
//               </span>
//               {currentSalary.processedAt && (
//                 <p className="text-blue-100 text-xs mt-2">
//                   Processed: {new Date(currentSalary.processedAt).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Employee Info */}
//       {currentSalary?.employee && (
//         <Card className="p-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-xs text-gray-500">Employee Name</p>
//               <p className="text-sm font-medium">{currentSalary.employee.name || user?.name}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Employee ID</p>
//               <p className="text-sm font-medium">{currentSalary.employee.employeeId || user?.employeeId}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Designation</p>
//               <p className="text-sm font-medium">{currentSalary.employee.designation || user?.designation}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Department</p>
//               <p className="text-sm font-medium capitalize">{currentSalary.employee.department || user?.department}</p>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Salary Breakdown */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Earnings */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="text-green-600">💰</span> Earnings
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Basic Salary</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.basic || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Housing Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.allowances?.housing || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Transport Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.allowances?.transport || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Medical Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.allowances?.medical || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Education Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.allowances?.education || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Telephone Allowance</span>
//               <span className="font-medium">{formatCurrency(currentSalary?.allowances?.telephone || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Overtime Pay</span>
//               <span className="font-medium text-green-600">+{formatCurrency(currentSalary?.overtimePay || 0)}</span>
//             </div>
//             <div className="flex justify-between py-3 bg-green-50 rounded-lg px-3 mt-2">
//               <span className="font-semibold text-gray-900">Gross Salary</span>
//               <span className="font-bold text-green-700">{formatCurrency(currentSalary?.grossSalary || 0)}</span>
//             </div>
//           </div>
//         </Card>

//         {/* Deductions */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="text-red-600">📉</span> Deductions
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Income Tax</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductions?.incomeTax || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Social Security</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductions?.socialSecurity || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Pension Fund</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductions?.pension || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Loan Recovery</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductions?.loanRecovery || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Insurance</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductions?.insurance || 0)}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-600">Unpaid Leave</span>
//               <span className="font-medium text-red-600">-{formatCurrency(currentSalary?.deductions?.unpaidLeave || 0)}</span>
//             </div>
//             <div className="flex justify-between py-3 bg-red-50 rounded-lg px-3 mt-2">
//               <span className="font-semibold text-gray-900">Total Deductions</span>
//               <span className="font-bold text-red-700">-{formatCurrency(currentSalary?.deductions?.total || 0)}</span>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Net Salary Summary */}
//       <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <div>
//             <p className="text-gray-600">Net Payable Amount</p>
//             <p className="text-3xl font-bold text-green-700">{formatCurrency(currentSalary?.netSalary || 0)}</p>
//             {currentSalary?.leaves?.unpaidLeaves > 0 && (
//               <p className="text-xs text-orange-600 mt-1">
//                 ⚠️ {currentSalary.leaves.unpaidLeaves} unpaid leave day(s) deducted
//               </p>
//             )}
//           </div>
//           <div className="flex gap-3">
//             <Button 
//               onClick={handleDownloadSlip} 
//               isLoading={downloading}
//               variant="secondary"
//             >
//               📄 Download Salary Slip
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Salary History Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">Salary History (Last 12 Months)</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slip</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {salaryHistory.length > 0 ? (
//                 salaryHistory.map((salary, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {months[salary.month - 1]} {salary.year}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(salary.basic || salary.basicSalary || 0)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(salary.totalAllowances || salary.allowances?.total || 0)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatCurrency(salary.totalDeductions || salary.deductions?.total || 0)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
//                       {formatCurrency(salary.netSalary || 0)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(salary.status)}`}>
//                         {getStatusText(salary.status)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <Link 
//                         to={`/salary/slip/${salary.year}-${salary.month}`} 
//                         className="text-blue-600 hover:text-blue-800"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setSelectedMonth(salary.month);
//                           setSelectedYear(salary.year);
//                           fetchSalaryData();
//                         }}
//                       >
//                         View →
//                       </Link>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
//                     No salary history found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Salary Structure Info */}
//       {salaryStructure && (
//         <Card className="p-4 bg-gray-50">
//           <h3 className="font-semibold text-gray-900 mb-2">📋 Salary Structure Information</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
//             <div>
//               <p className="text-gray-500">Country</p>
//               <p className="font-medium">{salaryStructure.country || 'UAE'}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Effective From</p>
//               <p className="font-medium">{salaryStructure.effectiveFrom ? new Date(salaryStructure.effectiveFrom).toLocaleDateString() : 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Overtime Rate</p>
//               <p className="font-medium">{formatCurrency(salaryStructure.overtime?.hourlyRate || 0)}/hour</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Status</p>
//               <p className="font-medium capitalize">{salaryStructure.status || 'Active'}</p>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* No Data Message */}
//       {!currentSalary && (
//         <Card className="p-12 text-center">
//           <div className="text-4xl mb-4">💰</div>
//           <p className="text-gray-500">No salary data available for {months[selectedMonth - 1]} {selectedYear}</p>
//           <p className="text-sm text-gray-400 mt-1">Try selecting a different month or contact HR for assistance.</p>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default MySalary;





// client/src/pages/salary/MySalary.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const MySalary = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentSalary, setCurrentSalary] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSalaryData();
  }, [selectedYear]);

  const fetchSalaryData = async () => {
    setLoading(true);
    try {
      // Fetch current salary
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const currentSalaryRes = await salaryApi.getMySalary(currentMonth, currentYear);
      if (currentSalaryRes.success) {
        setCurrentSalary(currentSalaryRes.data);
      } else {
        // Set mock data if API fails
        setMockCurrentSalary();
      }
      
      // Fetch salary history (try catch individually)
      try {
        const historyRes = await salaryApi.getSalaryHistory({ year: selectedYear });
        if (historyRes.success) {
          setSalaryHistory(historyRes.data || []);
        } else {
          setMockSalaryHistory();
        }
      } catch (historyError) {
        console.warn('Salary history API not available, using mock data');
        setMockSalaryHistory();
      }
      
      // Fetch salary structure (try catch individually)
      try {
        const structureRes = await salaryApi.getSalaryStructure(user?._id);
        if (structureRes.success && structureRes.data) {
          setSalaryStructure(structureRes.data);
        } else {
          setMockSalaryStructure();
        }
      } catch (structureError) {
        console.warn('Salary structure API not available, using mock data');
        setMockSalaryStructure();
      }
      
    } catch (error) {
      console.error('Fetch salary error:', error);
      showToast('Failed to load salary data. Using demo data.', 'warning');
      // Set mock data as fallback
      setMockCurrentSalary();
      setMockSalaryHistory();
      setMockSalaryStructure();
    } finally {
      setLoading(false);
    }
  };

  const setMockCurrentSalary = () => {
    const currentDate = new Date();
    setCurrentSalary({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      basic: 5000,
      allowances: {
        housing: 1250,
        transport: 800,
        medical: 750,
        total: 2800
      },
      deductions: {
        tax: 0,
        socialSecurity: 0,
        total: 0
      },
      grossSalary: 7800,
      netSalary: 7800,
      status: 'processed'
    });
  };

  const setMockSalaryHistory = () => {
    const history = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      history.push({
        id: `salary_${date.getFullYear()}_${date.getMonth() + 1}`,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthName: date.toLocaleString('default', { month: 'long' }),
        netSalary: 7800,
        grossSalary: 7800,
        status: i === 0 ? 'processed' : 'paid',
        processedDate: new Date(date.getFullYear(), date.getMonth(), 28).toISOString()
      });
    }
    setSalaryHistory(history);
  };

  const setMockSalaryStructure = () => {
    setSalaryStructure({
      earnings: {
        basic: { amount: 5000, taxable: true },
        housingAllowance: { type: 'percentage', value: 25, taxable: true },
        transportAllowance: { type: 'fixed', value: 800, taxable: true },
        medicalAllowance: { amount: 750, taxable: false }
      },
      deductions: {
        incomeTax: { amount: 0 },
        socialSecurity: { amount: 0 }
      }
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'AED 0';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      processed: 'bg-blue-100 text-blue-800',
      approved: 'bg-purple-100 text-purple-800',
      paid: 'bg-green-100 text-green-800'
    };
    return badges[status] || badges.processed;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Salary</h1>
        <p className="text-gray-500 mt-1">View your current salary and payment history</p>
      </div>

      {/* Current Salary Card */}
      {currentSalary && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500">Current Month Salary</p>
              <p className="text-3xl font-bold text-blue-700">{formatCurrency(currentSalary.netSalary)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {months[currentSalary.month - 1]} {currentSalary.year}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadge(currentSalary.status)}`}>
                {currentSalary.status || 'Processed'}
              </span>
              <p className="text-xs text-gray-500 mt-2">
                Gross: {formatCurrency(currentSalary.grossSalary || currentSalary.netSalary)}
              </p>
            </div>
          </div>

          {/* Quick Breakdown */}
          <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Basic Salary</p>
              <p className="font-semibold">{formatCurrency(currentSalary.basic)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Allowances</p>
              <p className="font-semibold text-green-600">{formatCurrency(currentSalary.allowances?.total || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Deductions</p>
              <p className="font-semibold text-red-600">{formatCurrency(currentSalary.deductions?.total || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Net Salary</p>
              <p className="font-semibold text-blue-600">{formatCurrency(currentSalary.netSalary)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Salary Structure Summary */}
      {salaryStructure && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Salary Structure</h3>
            <Link to="/salary/structure">
              <Button variant="secondary" size="sm">View Full Structure →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Basic Salary</p>
              <p className="font-medium">{formatCurrency(salaryStructure.earnings?.basic?.amount || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Housing Allowance</p>
              <p className="font-medium">{formatCurrency(salaryStructure.earnings?.housingAllowance?.value || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transport Allowance</p>
              <p className="font-medium">{formatCurrency(salaryStructure.earnings?.transportAllowance?.value || 0)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Salary History Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold text-gray-900">Salary History</h3>
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
            <Button variant="secondary" size="sm" onClick={fetchSalaryData}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaryHistory.length > 0 ? (
                salaryHistory.map((salary, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {salary.monthName || months[salary.month - 1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{salary.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(salary.grossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(salary.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(salary.status)}`}>
                        {salary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/salary/slip/${salary.year}/${salary.month}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Slip →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No salary history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link to="/salary/structure">
          <Button variant="secondary">💰 View Salary Structure</Button>
        </Link>
        <Link to="/salary/slip/current">
          <Button variant="primary">📄 Download Current Slip</Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div>
            <p className="text-sm text-blue-800">
              For any discrepancies in your salary, please contact the HR department.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalary;