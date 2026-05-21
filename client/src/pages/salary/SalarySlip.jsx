// // client/src/pages/salary/SalarySlip.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SalarySlip = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [salarySlip, setSalarySlip] = useState(null);
//   const [printing, setPrinting] = useState(false);

//   useEffect(() => {
//     fetchSalarySlip();
//   }, [id]);

//   const fetchSalarySlip = async () => {
//     setLoading(true);
//     try {
//       const response = await salaryApi.getSalarySlip(id);
//       if (response.data.success) {
//         setSalarySlip(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch salary slip error:', error);
//       showToast('Failed to load salary slip', 'error');
//       navigate('/salary/my');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     setPrinting(true);
//     window.print();
//     setTimeout(() => setPrinting(false), 1000);
//   };

//   const handleDownload = async () => {
//     try {
//       const response = await salaryApi.downloadSalarySlip(id);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `salary_slip_${salarySlip.month}_${salarySlip.year}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       showToast('Salary slip downloaded', 'success');
//     } catch (error) {
//       showToast('Failed to download salary slip', 'error');
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

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   if (loading) return <Spinner />;
//   if (!salarySlip) return <div className="text-center py-12">Salary slip not found</div>;

//   return (
//     <div className="space-y-6">
//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3 no-print">
//         <Button variant="secondary" onClick={() => navigate('/salary/my')}>
//           ← Back
//         </Button>
//         <Button variant="secondary" onClick={handlePrint} isLoading={printing}>
//           🖨️ Print
//         </Button>
//         <Button onClick={handleDownload}>
//           📥 Download PDF
//         </Button>
//       </div>

//       {/* Salary Slip Content */}
//       <div id="salary-slip" className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6 text-center">
//           <h1 className="text-2xl font-bold">FACILITY MANAGEMENT SYSTEM</h1>
//           <p className="text-blue-200 mt-1">Employee Salary Slip</p>
//           <div className="mt-4 pt-4 border-t border-blue-600 flex justify-between">
//             <div>
//               <p className="text-sm text-blue-200">Pay Period</p>
//               <p className="font-semibold">{months[salarySlip.month - 1]} {salarySlip.year}</p>
//             </div>
//             <div>
//               <p className="text-sm text-blue-200">Payment Date</p>
//               <p className="font-semibold">{new Date(salarySlip.paymentDate).toLocaleDateString()}</p>
//             </div>
//             <div>
//               <p className="text-sm text-blue-200">Salary Slip #</p>
//               <p className="font-semibold">{salarySlip.slipNumber}</p>
//             </div>
//           </div>
//         </div>

//         {/* Employee Details */}
//         <div className="p-6 border-b">
//           <h3 className="font-semibold text-gray-900 mb-4">Employee Details</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-xs text-gray-500">Employee Name</p>
//               <p className="font-medium">{salarySlip.employeeName}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Employee ID</p>
//               <p className="font-medium">{salarySlip.employeeId}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Designation</p>
//               <p className="font-medium">{salarySlip.designation}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Department</p>
//               <p className="font-medium">{salarySlip.department}</p>
//             </div>
//           </div>
//         </div>

//         {/* Earnings and Deductions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
//           {/* Earnings */}
//           <div className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4 text-green-700">Earnings</h3>
//             <table className="w-full">
//               <tbody className="space-y-2">
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Basic Salary</td>
//                   <td className="py-2 text-right font-medium">{formatCurrency(salarySlip.earnings.basic)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Housing Allowance</td>
//                   <td className="py-2 text-right">{formatCurrency(salarySlip.earnings.housingAllowance)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Transport Allowance</td>
//                   <td className="py-2 text-right">{formatCurrency(salarySlip.earnings.transportAllowance)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Medical Allowance</td>
//                   <td className="py-2 text-right">{formatCurrency(salarySlip.earnings.medicalAllowance)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Overtime Pay</td>
//                   <td className="py-2 text-right text-green-600">+{formatCurrency(salarySlip.earnings.overtimePay)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Bonus / Incentives</td>
//                   <td className="py-2 text-right text-green-600">+{formatCurrency(salarySlip.earnings.bonus)}</td>
//                 </tr>
//                 <tr className="font-bold">
//                   <td className="py-3 text-gray-900">Total Earnings</td>
//                   <td className="py-3 text-right text-green-700">{formatCurrency(salarySlip.earnings.total)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Deductions */}
//           <div className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4 text-red-700">Deductions</h3>
//             <table className="w-full">
//               <tbody>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Income Tax</td>
//                   <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.tax)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Social Security</td>
//                   <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.socialSecurity)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Pension Fund</td>
//                   <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.pension)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Loan Recovery</td>
//                   <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.loanRecovery)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Insurance</td>
//                   <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.insurance)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Unpaid Leave</td>
//                   <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.unpaidLeave)}</td>
//                 </tr>
//                 <tr className="font-bold">
//                   <td className="py-3 text-gray-900">Total Deductions</td>
//                   <td className="py-3 text-right text-red-700">-{formatCurrency(salarySlip.deductions.total)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Net Salary */}
//         <div className="bg-gray-100 p-6 border-t">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500">Net Payable Amount</p>
//               <p className="text-3xl font-bold text-green-700">{formatCurrency(salarySlip.netSalary)}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Amount in Words</p>
//               <p className="font-medium">{salarySlip.amountInWords}</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 text-center text-sm text-gray-400 border-t">
//           <p>This is a computer-generated document. No signature is required.</p>
//           <p className="mt-1">For any queries, please contact HR department at hr@fms.com</p>
//         </div>
//       </div>

//       <style jsx>{`
//         @media print {
//           .no-print {
//             display: none !important;
//           }
//           #salary-slip {
//             margin: 0;
//             padding: 0;
//             box-shadow: none;
//           }
//           body {
//             padding: 0;
//             margin: 0;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SalarySlip;






// // client/src/pages/salary/SalarySlip.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SalarySlip = () => {
//   const { id, year, month } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [salarySlip, setSalarySlip] = useState(null);
//   const [printing, setPrinting] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const slipRef = useRef(null);

//   useEffect(() => {
//     fetchSalarySlip();
//   }, [id, year, month]);

//   const fetchSalarySlip = async () => {
//     setLoading(true);
//     try {
//       let response;
      
//       // Handle different parameter formats
//       if (id && id !== 'undefined' && id !== 'null') {
//         // Fetch by slip ID
//         response = await salaryApi.getSalarySlipById(id);
//       } else if (year && month) {
//         // Fetch by year/month for current user
//         response = await salaryApi.getSalarySlip(year, month);
//       } else {
//         // Try to get current month's salary
//         const currentDate = new Date();
//         response = await salaryApi.getSalarySlip(currentDate.getFullYear(), currentDate.getMonth() + 1);
//       }
      
//       if (response.success && response.data) {
//         setSalarySlip(response.data);
//       } else {
//         // If no data, create mock data for demo
//         setMockSalarySlip();
//         showToast('Using demo data - No salary slip found', 'info');
//       }
//     } catch (error) {
//       console.error('Fetch salary slip error:', error);
//       showToast(error.response?.data?.message || 'Failed to load salary slip', 'error');
//       // Set mock data as fallback
//       setMockSalarySlip();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setMockSalarySlip = () => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1;
//     const currentYear = currentDate.getFullYear();
    
//     setSalarySlip({
//       slipNumber: `SLIP-${currentYear}${String(currentMonth).padStart(2, '0')}-001`,
//       employeeId: user?.employeeId || user?._id?.slice(-6) || 'EMP001',
//       employeeName: user?.name || `${user?.firstName} ${user?.lastName}` || 'Employee Name',
//       designation: user?.designation || user?.role || 'Technician',
//       department: user?.department || 'Operations',
//       month: currentMonth,
//       year: currentYear,
//       paymentDate: new Date(currentYear, currentMonth - 1, 28).toISOString(),
//       earnings: {
//         basic: 5000,
//         housingAllowance: 1250,
//         transportAllowance: 800,
//         medicalAllowance: 750,
//         overtimePay: 0,
//         bonus: 0,
//         total: 7800
//       },
//       deductions: {
//         tax: 0,
//         socialSecurity: 0,
//         pension: 0,
//         loanRecovery: 0,
//         insurance: 0,
//         unpaidLeave: 0,
//         total: 0
//       },
//       netSalary: 7800,
//       amountInWords: 'Seven Thousand Eight Hundred Dirhams Only',
//       status: 'processed'
//     });
//   };

//   const handlePrint = () => {
//     setPrinting(true);
//     const printContent = slipRef.current;
//     const originalTitle = document.title;
    
//     document.title = `Salary_Slip_${salarySlip?.employeeName}_${salarySlip?.month}_${salarySlip?.year}`;
    
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Salary Slip - ${salarySlip?.employeeName}</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 20px;
//             }
//             .salary-slip {
//               max-width: 1000px;
//               margin: 0 auto;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//             }
//             td, th {
//               padding: 8px;
//               border-bottom: 1px solid #ddd;
//             }
//             .text-right {
//               text-align: right;
//             }
//             .text-center {
//               text-align: center;
//             }
//             .font-bold {
//               font-weight: bold;
//             }
//             .mt-4 {
//               margin-top: 16px;
//             }
//             .pt-4 {
//               padding-top: 16px;
//             }
//             .border-t {
//               border-top: 1px solid #ddd;
//             }
//             .bg-gray-100 {
//               background-color: #f3f4f6;
//             }
//             .text-green-700 {
//               color: #15803d;
//             }
//             .text-red-700 {
//               color: #b91c1c;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="salary-slip">
//             ${printContent?.innerHTML || ''}
//           </div>
//           <script>
//             window.onload = () => {
//               window.print();
//               window.close();
//             };
//           </script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
    
//     setTimeout(() => setPrinting(false), 1000);
//     document.title = originalTitle;
//   };

//   const handleDownload = async () => {
//     setDownloading(true);
//     try {
//       // Try API download first
//       const response = await salaryApi.downloadSalarySlip(salarySlip.slipNumber || id);
      
//       if (response.success && response.blob) {
//         const url = window.URL.createObjectURL(response.blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', response.filename || `salary_slip_${salarySlip.employeeName}_${salarySlip.month}_${salarySlip.year}.pdf`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//         showToast('Salary slip downloaded successfully', 'success');
//       } else {
//         // Fallback: Print to PDF
//         handlePrint();
//         showToast('Opening print dialog to save as PDF', 'info');
//       }
//     } catch (error) {
//       console.error('Download error:', error);
//       // Fallback: Print to PDF
//       handlePrint();
//       showToast('Opening print dialog - you can save as PDF', 'info');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const handleEmail = async () => {
//     try {
//       const response = await salaryApi.emailSalarySlip(salarySlip.slipNumber);
//       if (response.success) {
//         showToast('Salary slip sent to your email', 'success');
//       } else {
//         showToast('Failed to send email. Please contact HR.', 'error');
//       }
//     } catch (error) {
//       console.error('Email error:', error);
//       showToast('Failed to send email', 'error');
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return 'AED 0';
//     return new Intl.NumberFormat('en-AE', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-AE', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   if (!salarySlip) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <div className="text-4xl mb-4">📄</div>
//           <p className="text-yellow-800 font-medium">Salary slip not found</p>
//           <p className="text-sm text-yellow-600 mt-1">No salary record found for the selected period.</p>
//           <Button onClick={() => navigate('/salary/my')} className="mt-4">
//             Back to Salary
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3 no-print flex-wrap">
//         <Button variant="secondary" onClick={() => navigate('/salary/my')} size="sm">
//           ← Back
//         </Button>
//         <Button variant="secondary" onClick={handlePrint} isLoading={printing} size="sm">
//           🖨️ Print
//         </Button>
//         <Button variant="secondary" onClick={handleEmail} size="sm">
//           📧 Email
//         </Button>
//         <Button onClick={handleDownload} isLoading={downloading} size="sm">
//           📥 Download PDF
//         </Button>
//       </div>

//       {/* Salary Slip Content */}
//       <div ref={slipRef} id="salary-slip" className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold">FACILITY MANAGEMENT SYSTEM</h1>
//             <p className="text-blue-200 mt-1">Employee Salary Slip</p>
//           </div>
//           <div className="mt-4 pt-4 border-t border-blue-600 grid grid-cols-3 gap-4 text-center">
//             <div>
//               <p className="text-sm text-blue-200">Pay Period</p>
//               <p className="font-semibold">{months[salarySlip.month - 1]} {salarySlip.year}</p>
//             </div>
//             <div>
//               <p className="text-sm text-blue-200">Payment Date</p>
//               <p className="font-semibold">{formatDate(salarySlip.paymentDate)}</p>
//             </div>
//             <div>
//               <p className="text-sm text-blue-200">Salary Slip #</p>
//               <p className="font-semibold">{salarySlip.slipNumber || `SLIP-${salarySlip.year}${String(salarySlip.month).padStart(2, '0')}`}</p>
//             </div>
//           </div>
//         </div>

//         {/* Employee Details */}
//         <div className="p-6 border-b">
//           <h3 className="font-semibold text-gray-900 mb-4">Employee Details</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-xs text-gray-500">Employee Name</p>
//               <p className="font-medium">{salarySlip.employeeName}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Employee ID</p>
//               <p className="font-medium">{salarySlip.employeeId}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Designation</p>
//               <p className="font-medium">{salarySlip.designation}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Department</p>
//               <p className="font-medium">{salarySlip.department}</p>
//             </div>
//           </div>
//         </div>

//         {/* Earnings and Deductions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
//           {/* Earnings */}
//           <div className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4 text-green-700">💰 Earnings</h3>
//             <table className="w-full">
//               <tbody>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Basic Salary</td>
//                   <td className="py-2 text-right font-medium">{formatCurrency(salarySlip.earnings?.basic || 0)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Housing Allowance</td>
//                   <td className="py-2 text-right">{formatCurrency(salarySlip.earnings?.housingAllowance || 0)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Transport Allowance</td>
//                   <td className="py-2 text-right">{formatCurrency(salarySlip.earnings?.transportAllowance || 0)}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <td className="py-2 text-gray-600">Medical Allowance</td>
//                   <td className="py-2 text-right">{formatCurrency(salarySlip.earnings?.medicalAllowance || 0)}</td>
//                 </tr>
//                 {salarySlip.earnings?.overtimePay > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Overtime Pay</td>
//                     <td className="py-2 text-right text-green-600">+{formatCurrency(salarySlip.earnings.overtimePay)}</td>
//                   </tr>
//                 )}
//                 {salarySlip.earnings?.bonus > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Bonus / Incentives</td>
//                     <td className="py-2 text-right text-green-600">+{formatCurrency(salarySlip.earnings.bonus)}</td>
//                   </tr>
//                 )}
//                 <tr className="font-bold bg-gray-50">
//                   <td className="py-3 text-gray-900">Total Earnings</td>
//                   <td className="py-3 text-right text-green-700">{formatCurrency(salarySlip.earnings?.total || 0)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Deductions */}
//           <div className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4 text-red-700">📉 Deductions</h3>
//             <table className="w-full">
//               <tbody>
//                 {salarySlip.deductions?.tax > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Income Tax</td>
//                     <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.tax)}</td>
//                   </tr>
//                 )}
//                 {salarySlip.deductions?.socialSecurity > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Social Security</td>
//                     <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.socialSecurity)}</td>
//                   </tr>
//                 )}
//                 {salarySlip.deductions?.pension > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Pension Fund</td>
//                     <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.pension)}</td>
//                   </tr>
//                 )}
//                 {salarySlip.deductions?.loanRecovery > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Loan Recovery</td>
//                     <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.loanRecovery)}</td>
//                   </tr>
//                 )}
//                 {salarySlip.deductions?.insurance > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Insurance</td>
//                     <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.insurance)}</td>
//                   </tr>
//                 )}
//                 {salarySlip.deductions?.unpaidLeave > 0 && (
//                   <tr className="border-b">
//                     <td className="py-2 text-gray-600">Unpaid Leave</td>
//                     <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.unpaidLeave)}</td>
//                   </tr>
//                 )}
//                 <tr className="font-bold bg-gray-50">
//                   <td className="py-3 text-gray-900">Total Deductions</td>
//                   <td className="py-3 text-right text-red-700">-{formatCurrency(salarySlip.deductions?.total || 0)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Net Salary */}
//         <div className="bg-gray-100 p-6 border-t">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Net Payable Amount</p>
//               <p className="text-3xl font-bold text-green-700">{formatCurrency(salarySlip.netSalary)}</p>
//             </div>
//             <div className="text-center md:text-right">
//               <p className="text-sm text-gray-500">Amount in Words</p>
//               <p className="font-medium">{salarySlip.amountInWords || formatCurrency(salarySlip.netSalary)}</p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Payment Status</p>
//               <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                 salarySlip.status === 'paid' ? 'bg-green-100 text-green-800' :
//                 salarySlip.status === 'processed' ? 'bg-blue-100 text-blue-800' :
//                 'bg-yellow-100 text-yellow-800'
//               }`}>
//                 {salarySlip.status || 'Processed'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Bank Details */}
//         {salarySlip.bankDetails && (
//           <div className="p-6 border-t">
//             <h3 className="font-semibold text-gray-900 mb-3">🏦 Bank Details</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <p className="text-gray-500">Bank Name</p>
//                 <p className="font-medium">{salarySlip.bankDetails.bankName || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Account Number</p>
//                 <p className="font-medium">{salarySlip.bankDetails.accountNumber || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">IBAN</p>
//                 <p className="font-medium">{salarySlip.bankDetails.iban || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Payment Reference</p>
//                 <p className="font-medium">{salarySlip.paymentReference || 'N/A'}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="p-6 text-center text-sm text-gray-400 border-t bg-gray-50">
//           <p>This is a computer-generated document. No signature is required.</p>
//           <p className="mt-1">For any queries, please contact HR department at hr@fms.com</p>
//           <p className="mt-2 text-xs">Generated on: {new Date().toLocaleDateString()}</p>
//         </div>
//       </div>

//       <style jsx>{`
//         @media print {
//           .no-print {
//             display: none !important;
//           }
//           #salary-slip {
//             margin: 0;
//             padding: 0;
//             box-shadow: none;
//             border-radius: 0;
//           }
//           body {
//             padding: 0;
//             margin: 0;
//           }
//           .bg-gradient-to-r {
//             background: #1e3a8a !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }
//           .bg-gray-100, .bg-gray-50 {
//             background-color: #f3f4f6 !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SalarySlip;






// client/src/pages/salary/SalarySlip.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

// Print styles as a constant to avoid JSX warning
const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    #salary-slip {
      margin: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }
    body {
      padding: 0;
      margin: 0;
    }
    .bg-gradient-to-r {
      background: #1e3a8a !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .bg-gray-100, .bg-gray-50 {
      background-color: #f3f4f6 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

const SalarySlip = () => {
  const { id, year, month } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [salarySlip, setSalarySlip] = useState(null);
  const [printing, setPrinting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const slipRef = useRef(null);

  useEffect(() => {
    fetchSalarySlip();
  }, [id, year, month]);

  const fetchSalarySlip = async () => {
    setLoading(true);
    try {
      let response;
      
      // Handle different parameter formats
      if (id && id !== 'undefined' && id !== 'null') {
        // Fetch by slip ID
        response = await salaryApi.getSalarySlipById(id);
      } else if (year && month && year !== 'undefined' && month !== 'undefined') {
        // Fetch by year/month for current user
        response = await salaryApi.getSalarySlip(parseInt(year), parseInt(month));
      } else {
        // Try to get current month's salary
        const currentDate = new Date();
        response = await salaryApi.getSalarySlip(currentDate.getFullYear(), currentDate.getMonth() + 1);
      }
      
      if (response.success && response.data) {
        setSalarySlip(response.data);
      } else {
        // If no data, create mock data for demo
        setMockSalarySlip();
        if (response.error) {
          showToast('Using demo data - ' + response.error, 'info');
        }
      }
    } catch (error) {
      console.error('Fetch salary slip error:', error);
      // Set mock data as fallback
      setMockSalarySlip();
      showToast('Failed to load salary slip. Using demo data.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const setMockSalarySlip = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    setSalarySlip({
      slipNumber: `SLIP-${currentYear}${String(currentMonth).padStart(2, '0')}-001`,
      employeeId: user?.employeeId || user?._id?.slice(-6) || 'EMP001',
      employeeName: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Employee Name',
      designation: user?.designation || user?.role || 'Technician',
      department: user?.department || 'Operations',
      month: currentMonth,
      year: currentYear,
      paymentDate: new Date(currentYear, currentMonth - 1, 28).toISOString(),
      earnings: {
        basic: 5000,
        housingAllowance: 1250,
        transportAllowance: 800,
        medicalAllowance: 750,
        overtimePay: 0,
        bonus: 0,
        total: 7800
      },
      deductions: {
        tax: 0,
        socialSecurity: 0,
        pension: 0,
        loanRecovery: 0,
        insurance: 0,
        unpaidLeave: 0,
        total: 0
      },
      netSalary: 7800,
      amountInWords: 'Seven Thousand Eight Hundred Dirhams Only',
      status: 'processed'
    });
  };

  const handlePrint = () => {
    setPrinting(true);
    const printContent = slipRef.current;
    
    if (!printContent) {
      showToast('Unable to print. Please try again.', 'error');
      setPrinting(false);
      return;
    }
    
    const originalTitle = document.title;
    document.title = `Salary_Slip_${salarySlip?.employeeName || 'Employee'}_${salarySlip?.month}_${salarySlip?.year}`;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to print', 'warning');
      setPrinting(false);
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Salary Slip - ${salarySlip?.employeeName || 'Employee'}</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 20px;
              background: white;
            }
            .salary-slip {
              max-width: 1000px;
              margin: 0 auto;
              background: white;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .font-medium { font-weight: 500; }
            .mt-4 { margin-top: 16px; }
            .mb-4 { margin-bottom: 16px; }
            .pt-4 { padding-top: 16px; }
            .pb-4 { padding-bottom: 16px; }
            .p-6 { padding: 24px; }
            .border-t { border-top: 1px solid #ddd; }
            .border-b { border-bottom: 1px solid #ddd; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-gradient-to-r { background: #1e3a8a; }
            .text-white { color: white; }
            .text-blue-200 { color: #bfdbfe; }
            .text-green-700 { color: #15803d; }
            .text-red-700 { color: #b91c1c; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-900 { color: #111827; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
            .gap-4 { gap: 16px; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 8px; border-bottom: 1px solid #e5e7eb; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
          ${printStyles}
        </head>
        <body>
          <div class="salary-slip">
            ${printContent.outerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => {
      setPrinting(false);
      document.title = originalTitle;
    }, 1000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Try API download first
      const response = await salaryApi.downloadSalarySlip(salarySlip.slipNumber || id);
      
      if (response.success && response.blob) {
        const url = window.URL.createObjectURL(response.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename || `salary_slip_${salarySlip.employeeName?.replace(/\s/g, '_') || 'employee'}_${salarySlip.month}_${salarySlip.year}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showToast('Salary slip downloaded successfully', 'success');
      } else {
        // Fallback: Open print dialog to save as PDF
        showToast('Opening print dialog - you can save as PDF', 'info');
        setTimeout(() => handlePrint(), 500);
      }
    } catch (error) {
      console.error('Download error:', error);
      showToast('Opening print dialog - you can save as PDF', 'info');
      setTimeout(() => handlePrint(), 500);
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    try {
      // Check if email method exists
      if (typeof salaryApi.emailSalarySlip === 'function') {
        const response = await salaryApi.emailSalarySlip(salarySlip.slipNumber);
        if (response.success) {
          showToast('Salary slip sent to your email', 'success');
        } else {
          showToast('Failed to send email. Please contact HR.', 'error');
        }
      } else {
        // Fallback: Copy link to clipboard
        const url = `${window.location.origin}/salary/slip/${salarySlip.slipNumber}`;
        await navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard. You can share it manually.', 'info');
      }
    } catch (error) {
      console.error('Email error:', error);
      showToast('Failed to send email', 'error');
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
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

  if (!salarySlip) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-yellow-800 font-medium">Salary slip not found</p>
          <p className="text-sm text-yellow-600 mt-1">No salary record found for the selected period.</p>
          <Button onClick={() => navigate('/salary/my')} className="mt-4">
            Back to Salary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 no-print flex-wrap">
        <Button variant="secondary" onClick={() => navigate('/salary/my')} size="sm">
          ← Back
        </Button>
        <Button variant="secondary" onClick={handlePrint} isLoading={printing} size="sm">
          🖨️ Print
        </Button>
        <Button variant="secondary" onClick={handleEmail} size="sm">
          📧 Email
        </Button>
        <Button onClick={handleDownload} isLoading={downloading} size="sm">
          📥 Download PDF
        </Button>
      </div>

      {/* Salary Slip Content */}
      <div ref={slipRef} id="salary-slip" className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">FACILITY MANAGEMENT SYSTEM</h1>
            <p className="text-blue-200 mt-1">Employee Salary Slip</p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-600 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-blue-200">Pay Period</p>
              <p className="font-semibold">{months[salarySlip.month - 1]} {salarySlip.year}</p>
            </div>
            <div>
              <p className="text-sm text-blue-200">Payment Date</p>
              <p className="font-semibold">{formatDate(salarySlip.paymentDate)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-200">Salary Slip #</p>
              <p className="font-semibold">{salarySlip.slipNumber || `SLIP-${salarySlip.year}${String(salarySlip.month).padStart(2, '0')}`}</p>
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">Employee Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Employee Name</p>
              <p className="font-medium">{salarySlip.employeeName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Employee ID</p>
              <p className="font-medium">{salarySlip.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Designation</p>
              <p className="font-medium">{salarySlip.designation}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="font-medium">{salarySlip.department}</p>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          {/* Earnings */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-green-700">💰 Earnings</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Basic Salary</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(salarySlip.earnings?.basic || 0)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Housing Allowance</td>
                  <td className="py-2 text-right">{formatCurrency(salarySlip.earnings?.housingAllowance || 0)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Transport Allowance</td>
                  <td className="py-2 text-right">{formatCurrency(salarySlip.earnings?.transportAllowance || 0)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Medical Allowance</td>
                  <td className="py-2 text-right">{formatCurrency(salarySlip.earnings?.medicalAllowance || 0)}</td>
                </tr>
                {(salarySlip.earnings?.overtimePay > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Overtime Pay</td>
                    <td className="py-2 text-right text-green-600">+{formatCurrency(salarySlip.earnings.overtimePay)}</td>
                  </tr>
                )}
                {(salarySlip.earnings?.bonus > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Bonus / Incentives</td>
                    <td className="py-2 text-right text-green-600">+{formatCurrency(salarySlip.earnings.bonus)}</td>
                  </tr>
                )}
                <tr className="font-bold bg-gray-50">
                  <td className="py-3 text-gray-900">Total Earnings</td>
                  <td className="py-3 text-right text-green-700">{formatCurrency(salarySlip.earnings?.total || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-red-700">📉 Deductions</h3>
            <table className="w-full">
              <tbody>
                {(salarySlip.deductions?.tax > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Income Tax</td>
                    <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.tax)}</td>
                  </tr>
                )}
                {(salarySlip.deductions?.socialSecurity > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Social Security</td>
                    <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.socialSecurity)}</td>
                  </tr>
                )}
                {(salarySlip.deductions?.pension > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Pension Fund</td>
                    <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.pension)}</td>
                  </tr>
                )}
                {(salarySlip.deductions?.loanRecovery > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Loan Recovery</td>
                    <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.loanRecovery)}</td>
                  </tr>
                )}
                {(salarySlip.deductions?.insurance > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Insurance</td>
                    <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.insurance)}</td>
                  </tr>
                )}
                {(salarySlip.deductions?.unpaidLeave > 0) && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Unpaid Leave</td>
                    <td className="py-2 text-right text-red-600">-{formatCurrency(salarySlip.deductions.unpaidLeave)}</td>
                  </tr>
                )}
                <tr className="font-bold bg-gray-50">
                  <td className="py-3 text-gray-900">Total Deductions</td>
                  <td className="py-3 text-right text-red-700">-{formatCurrency(salarySlip.deductions?.total || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-gray-100 p-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Net Payable Amount</p>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(salarySlip.netSalary)}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">Amount in Words</p>
              <p className="font-medium">{salarySlip.amountInWords || formatCurrency(salarySlip.netSalary)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Payment Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                salarySlip.status === 'paid' ? 'bg-green-100 text-green-800' :
                salarySlip.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {salarySlip.status || 'Processed'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-gray-400 border-t bg-gray-50">
          <p>This is a computer-generated document. No signature is required.</p>
          <p className="mt-1">For any queries, please contact HR department at hr@fms.com</p>
          <p className="mt-2 text-xs">Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Print Styles - Using style tag without jsx attribute */}
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
    </div>
  );
};

export default SalarySlip;