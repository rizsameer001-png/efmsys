

// // client/src/pages/salary/SalaryStructure.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SalaryStructure = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [loading, setLoading] = useState(true);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [salaryStructure, setSalaryStructure] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState({
//     employeeId: '',
//     country: 'UAE',
//     earnings: {
//       basic: 0,
//       housingAllowance: { type: 'fixed', value: 0 },
//       transportAllowance: { type: 'fixed', value: 0 },
//       medicalAllowance: 0,
//       educationAllowance: 0
//     },
//     deductions: {
//       incomeTax: 0,
//       socialSecurity: 0,
//       pension: 0,
//       loanRecovery: 0,
//       insurance: 0
//     },
//     overtime: {
//       hourlyRate: 0,
//       multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 }
//     }
//   });

//   const isAdmin = hasPermission('salary.manage') || user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'hr';

//   /**
//    * Fetch employees list for admin/HR view
//    */
//   const fetchEmployees = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Use getEmployeesForSalary method from salaryApi
//       const response = await salaryApi.getEmployeesForSalary();
      
//       if (response.success) {
//         setEmployees(response.data || []);
//       } else {
//         // Fallback to mock data if API fails
//         console.warn('Using mock employee data');
//         setEmployees([
//           { _id: '1', firstName: 'John', lastName: 'Doe', department: 'Maintenance', designation: 'Senior Technician' },
//           { _id: '2', firstName: 'Jane', lastName: 'Smith', department: 'Electrical', designation: 'Technician' },
//           { _id: '3', firstName: 'Mike', lastName: 'Johnson', department: 'Plumbing', designation: 'Supervisor' },
//           { _id: '4', firstName: 'Sarah', lastName: 'Williams', department: 'HVAC', designation: 'Technician' },
//         ]);
//         showToast('Using demo employee data', 'info');
//       }
//     } catch (error) {
//       console.error('Fetch employees error:', error);
//       setError(error.message || 'Failed to load employees');
//       // Set mock data on error
//       setEmployees([
//         { _id: '1', firstName: 'John', lastName: 'Doe', department: 'Maintenance', designation: 'Senior Technician' },
//         { _id: '2', firstName: 'Jane', lastName: 'Smith', department: 'Electrical', designation: 'Technician' },
//       ]);
//       showToast('Failed to load employees. Using demo data.', 'warning');
//     } finally {
//       setLoading(false);
//     }
//   }, [showToast]);

//   /**
//    * Fetch salary structure for selected employee
//    */
//   const fetchSalaryStructure = useCallback(async (employeeId) => {
//     try {
//       // Try to get existing salary structure
//       const response = await salaryApi.getEmployeeSalary(employeeId, new Date().getMonth() + 1, new Date().getFullYear());
      
//       if (response.success && response.data) {
//         setSalaryStructure(response.data);
//         // Populate form with existing data
//         setFormData({
//           employeeId,
//           country: response.data.country || 'UAE',
//           earnings: response.data.earnings || {
//             basic: 0,
//             housingAllowance: { type: 'fixed', value: 0 },
//             transportAllowance: { type: 'fixed', value: 0 },
//             medicalAllowance: 0,
//             educationAllowance: 0
//           },
//           deductions: response.data.deductions || {
//             incomeTax: 0,
//             socialSecurity: 0,
//             pension: 0,
//             loanRecovery: 0,
//             insurance: 0
//           },
//           overtime: response.data.overtime || {
//             hourlyRate: 0,
//             multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 }
//           }
//         });
//       } else {
//         // New employee - set defaults
//         setFormData({
//           employeeId,
//           country: 'UAE',
//           earnings: {
//             basic: 5000,
//             housingAllowance: { type: 'percentage', value: 25 },
//             transportAllowance: { type: 'fixed', value: 800 },
//             medicalAllowance: 750,
//             educationAllowance: 0
//           },
//           deductions: {
//             incomeTax: 0,
//             socialSecurity: 0,
//             pension: 0,
//             loanRecovery: 0,
//             insurance: 0
//           },
//           overtime: {
//             hourlyRate: 25,
//             multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 }
//           }
//         });
//         setSalaryStructure(null);
//       }
//     } catch (error) {
//       console.error('Fetch salary structure error:', error);
//       // Set default values on error
//       setFormData({
//         employeeId,
//         country: 'UAE',
//         earnings: {
//           basic: 5000,
//           housingAllowance: { type: 'percentage', value: 25 },
//           transportAllowance: { type: 'fixed', value: 800 },
//           medicalAllowance: 750,
//           educationAllowance: 0
//         },
//         deductions: {
//           incomeTax: 0,
//           socialSecurity: 0,
//           pension: 0,
//           loanRecovery: 0,
//           insurance: 0
//         },
//         overtime: {
//           hourlyRate: 25,
//           multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 }
//         }
//       });
//     }
//   }, []);

//   useEffect(() => {
//     fetchEmployees();
//   }, [fetchEmployees]);

//   const handleEmployeeSelect = async (employeeId) => {
//     if (!employeeId) return;
//     const employee = employees.find(e => e._id === employeeId);
//     setSelectedEmployee(employee);
//     await fetchSalaryStructure(employeeId);
//     setEditing(false);
//   };

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
//     if (name.includes('.')) {
//       const parts = name.split('.');
//       if (parts.length === 2) {
//         setFormData(prev => ({
//           ...prev,
//           [parts[0]]: { ...prev[parts[0]], [parts[1]]: parsedValue }
//         }));
//       } else if (parts.length === 3) {
//         setFormData(prev => ({
//           ...prev,
//           [parts[0]]: {
//             ...prev[parts[0]],
//             [parts[1]]: { ...prev[parts[0]][parts[1]], [parts[2]]: parsedValue }
//           }
//         }));
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [name]: parsedValue }));
//     }
//   };

//   const handleNestedChange = (section, field, subField, value) => {
//     if (subField) {
//       setFormData(prev => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: { ...prev[section][field], [subField]: value }
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [section]: { ...prev[section], [field]: value }
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedEmployee) {
//       showToast('Please select an employee first', 'warning');
//       return;
//     }
    
//     setSaving(true);
//     try {
//       // Use updateSalaryStructure method
//       const response = await salaryApi.updateSalaryStructure(selectedEmployee._id, formData);
      
//       if (response.success) {
//         showToast('Salary structure saved successfully', 'success');
//         setEditing(false);
//         await fetchSalaryStructure(selectedEmployee._id);
//       } else {
//         showToast(response.error || 'Failed to save salary structure', 'error');
//       }
//     } catch (error) {
//       console.error('Save salary structure error:', error);
//       showToast(error.response?.data?.message || 'Failed to save salary structure', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const calculateTotalEarnings = () => {
//     const basic = parseFloat(formData.earnings.basic) || 0;
//     const housing = formData.earnings.housingAllowance.type === 'fixed' 
//       ? parseFloat(formData.earnings.housingAllowance.value) || 0
//       : (basic * (parseFloat(formData.earnings.housingAllowance.value) || 0)) / 100;
//     const transport = formData.earnings.transportAllowance.type === 'fixed'
//       ? parseFloat(formData.earnings.transportAllowance.value) || 0
//       : (basic * (parseFloat(formData.earnings.transportAllowance.value) || 0)) / 100;
//     const medical = parseFloat(formData.earnings.medicalAllowance) || 0;
//     const education = parseFloat(formData.earnings.educationAllowance) || 0;
    
//     return basic + housing + transport + medical + education;
//   };

//   const calculateTotalDeductions = () => {
//     return (parseFloat(formData.deductions.incomeTax) || 0) +
//            (parseFloat(formData.deductions.socialSecurity) || 0) +
//            (parseFloat(formData.deductions.pension) || 0) +
//            (parseFloat(formData.deductions.loanRecovery) || 0) +
//            (parseFloat(formData.deductions.insurance) || 0);
//   };

//   const calculateNetSalary = () => {
//     return calculateTotalEarnings() - calculateTotalDeductions();
//   };

//   const formatCurrency = (amount) => {
//     if (isNaN(amount)) return 'AED 0';
//     return new Intl.NumberFormat('en-AE', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   // Employee View - Show only my salary structure (if not admin)
//   if (!isAdmin) {
//     return (
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Salary Structure</h1>
//           <p className="text-gray-500 mt-1">Your current salary breakdown</p>
//         </div>

//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Salary Components</h3>
          
//           {/* Earnings */}
//           <div className="mb-6">
//             <h4 className="font-medium text-gray-700 mb-3">Earnings</h4>
//             <div className="space-y-2">
//               <div className="flex justify-between py-2 border-b">
//                 <span>Basic Salary</span>
//                 <span className="font-medium">{formatCurrency(salaryStructure?.earnings?.basic || 0)}</span>
//               </div>
//               <div className="flex justify-between py-2 border-b">
//                 <span>Housing Allowance</span>
//                 <span className="font-medium">{formatCurrency(salaryStructure?.earnings?.housingAllowance?.value || 0)}</span>
//               </div>
//               <div className="flex justify-between py-2 border-b">
//                 <span>Transport Allowance</span>
//                 <span className="font-medium">{formatCurrency(salaryStructure?.earnings?.transportAllowance?.value || 0)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Deductions */}
//           <div className="mb-6">
//             <h4 className="font-medium text-gray-700 mb-3">Deductions</h4>
//             <div className="space-y-2">
//               <div className="flex justify-between py-2 border-b">
//                 <span>Total Deductions</span>
//                 <span className="font-medium text-red-600">{formatCurrency(salaryStructure?.totalDeductions || 0)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Net Salary */}
//           <div className="pt-4 border-t">
//             <div className="flex justify-between">
//               <span className="font-semibold text-lg">Net Monthly Salary</span>
//               <span className="font-bold text-green-600 text-xl">{formatCurrency(salaryStructure?.netSalary || 0)}</span>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   // Admin/HR View
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Salary Structure</h1>
//         <p className="text-gray-500 mt-1">Configure employee salary components and benefits</p>
//       </div>

//       {/* Error Banner */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <p className="text-red-800">{error}</p>
//           <button onClick={fetchEmployees} className="text-red-600 underline mt-2">Retry</button>
//         </div>
//       )}

//       {/* Employee Selection */}
//       <Card className="p-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
//         <select
//           value={selectedEmployee?._id || ''}
//           onChange={(e) => handleEmployeeSelect(e.target.value)}
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">-- Select Employee --</option>
//           {employees.map(emp => (
//             <option key={emp._id} value={emp._id}>
//               {emp.firstName} {emp.lastName} - {emp.department} ({emp.designation})
//             </option>
//           ))}
//         </select>
//         {employees.length === 0 && !loading && (
//           <p className="text-sm text-yellow-600 mt-2">No employees found. Add employees first.</p>
//         )}
//       </Card>

//       {selectedEmployee && (
//         <form onSubmit={handleSubmit}>
//           {/* Basic Info */}
//           <Card className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-gray-900">
//                 {selectedEmployee.firstName} {selectedEmployee.lastName}
//               </h3>
//               {!editing ? (
//                 <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
//                   ✏️ Edit Structure
//                 </Button>
//               ) : (
//                 <div className="flex gap-2">
//                   <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" isLoading={saving}>
//                     Save Changes
//                   </Button>
//                 </div>
//               )}
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Designation</p>
//                 <p className="font-medium">{selectedEmployee.designation || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Department</p>
//                 <p className="font-medium">{selectedEmployee.department || 'N/A'}</p>
//               </div>
//             </div>
//           </Card>

//           {/* Earnings Section */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Earnings Components</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Basic Salary (AED)</label>
//                 <input
//                   type="number"
//                   name="earnings.basic"
//                   value={formData.earnings.basic}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Housing Allowance</label>
//                   <div className="flex gap-2 mt-1">
//                     <select
//                       name="earnings.housingAllowance.type"
//                       value={formData.earnings.housingAllowance.type}
//                       onChange={handleChange}
//                       disabled={!editing}
//                       className="w-1/3 px-2 py-2 border rounded-lg"
//                     >
//                       <option value="fixed">Fixed</option>
//                       <option value="percentage">% of Basic</option>
//                     </select>
//                     <input
//                       type="number"
//                       name="earnings.housingAllowance.value"
//                       value={formData.earnings.housingAllowance.value}
//                       onChange={handleChange}
//                       disabled={!editing}
//                       className="flex-1 px-3 py-2 border rounded-lg"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Transport Allowance</label>
//                   <div className="flex gap-2 mt-1">
//                     <select
//                       name="earnings.transportAllowance.type"
//                       value={formData.earnings.transportAllowance.type}
//                       onChange={handleChange}
//                       disabled={!editing}
//                       className="w-1/3 px-2 py-2 border rounded-lg"
//                     >
//                       <option value="fixed">Fixed</option>
//                       <option value="percentage">% of Basic</option>
//                     </select>
//                     <input
//                       type="number"
//                       name="earnings.transportAllowance.value"
//                       value={formData.earnings.transportAllowance.value}
//                       onChange={handleChange}
//                       disabled={!editing}
//                       className="flex-1 px-3 py-2 border rounded-lg"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Medical Allowance (AED)</label>
//                   <input
//                     type="number"
//                     name="earnings.medicalAllowance"
//                     value={formData.earnings.medicalAllowance}
//                     onChange={handleChange}
//                     disabled={!editing}
//                     className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Education Allowance (AED)</label>
//                   <input
//                     type="number"
//                     name="earnings.educationAllowance"
//                     value={formData.earnings.educationAllowance}
//                     onChange={handleChange}
//                     disabled={!editing}
//                     className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                   />
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Deductions Section */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Deductions</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Income Tax (AED)</label>
//                 <input
//                   type="number"
//                   name="deductions.incomeTax"
//                   value={formData.deductions.incomeTax}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Social Security (AED)</label>
//                 <input
//                   type="number"
//                   name="deductions.socialSecurity"
//                   value={formData.deductions.socialSecurity}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Pension Fund (AED)</label>
//                 <input
//                   type="number"
//                   name="deductions.pension"
//                   value={formData.deductions.pension}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Loan Recovery (AED)</label>
//                 <input
//                   type="number"
//                   name="deductions.loanRecovery"
//                   value={formData.deductions.loanRecovery}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Overtime Settings */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Overtime Settings</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Hourly Rate (AED)</label>
//                 <input
//                   type="number"
//                   name="overtime.hourlyRate"
//                   value={formData.overtime.hourlyRate}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Weekday Multiplier</label>
//                 <input
//                   type="number"
//                   step="0.5"
//                   name="overtime.multiplier.weekday"
//                   value={formData.overtime.multiplier.weekday}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Weekend Multiplier</label>
//                 <input
//                   type="number"
//                   step="0.5"
//                   name="overtime.multiplier.weekend"
//                   value={formData.overtime.multiplier.weekend}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Holiday Multiplier</label>
//                 <input
//                   type="number"
//                   step="0.5"
//                   name="overtime.multiplier.holiday"
//                   value={formData.overtime.multiplier.holiday}
//                   onChange={handleChange}
//                   disabled={!editing}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Salary Summary */}
//           {!editing && (
//             <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
//               <h3 className="font-semibold text-gray-900 mb-4">Salary Summary</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Total Earnings</span>
//                   <span className="font-medium text-green-700">{formatCurrency(calculateTotalEarnings())}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total Deductions</span>
//                   <span className="font-medium text-red-700">{formatCurrency(calculateTotalDeductions())}</span>
//                 </div>
//                 <div className="flex justify-between pt-2 border-t mt-2">
//                   <span className="font-semibold text-lg">Net Monthly Salary</span>
//                   <span className="font-bold text-green-700 text-xl">{formatCurrency(calculateNetSalary())}</span>
//                 </div>
//               </div>
//             </Card>
//           )}
//         </form>
//       )}
//     </div>
//   );
// };

// export default SalaryStructure;














// client/src/pages/salary/SalaryStructure.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const SalaryStructure = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    country: ''
  });
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    country: 'UAE',
    effectiveFrom: new Date().toISOString().split('T')[0],
    earnings: {
      basic: { amount: 0, taxable: true },
      housingAllowance: { type: 'fixed', value: 0, taxable: true },
      transportAllowance: { type: 'fixed', value: 0, taxable: true },
      medicalAllowance: { amount: 0, taxable: false },
      educationAllowance: { amount: 0, taxable: false },
      telephoneAllowance: { amount: 0, taxable: true }
    },
    deductions: {
      incomeTax: { amount: 0, type: 'percentage' },
      socialSecurity: { amount: 0 },
      pension: { amount: 0 },
      loanRecovery: { amount: 0 },
      insurance: { amount: 0 },
      otherDeductions: []
    },
    overtime: {
      hourlyRate: 0,
      multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 },
      maxHoursPerWeek: 20
    }
  });

  const isAdmin = hasPermission('salary.manage') || user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'hr';

  const departments = ['All', 'Operations', 'Technical', 'Housekeeping', 'Management', 'IT', 'HR'];
  const countries = ['All', 'UAE', 'INDIA', 'USA', 'UK'];

  /**
   * Get default salary structure based on country
   */
  const getDefaultStructureByCountry = (country) => {
    const defaults = {
      UAE: {
        earnings: {
          basic: { amount: 5000, taxable: true },
          housingAllowance: { type: 'percentage', value: 25, taxable: true },
          transportAllowance: { type: 'fixed', value: 800, taxable: true },
          medicalAllowance: { amount: 750, taxable: false },
          educationAllowance: { amount: 0, taxable: false },
          telephoneAllowance: { amount: 200, taxable: true }
        },
        deductions: {
          incomeTax: { amount: 0, type: 'percentage' },
          socialSecurity: { amount: 0 },
          pension: { amount: 0 },
          loanRecovery: { amount: 0 },
          insurance: { amount: 0 },
          otherDeductions: []
        },
        overtime: {
          hourlyRate: 25,
          multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 },
          maxHoursPerWeek: 20
        }
      },
      INDIA: {
        earnings: {
          basic: { amount: 30000, taxable: true },
          housingAllowance: { type: 'percentage', value: 30, taxable: true },
          transportAllowance: { type: 'fixed', value: 1600, taxable: true },
          medicalAllowance: { amount: 1250, taxable: false },
          educationAllowance: { amount: 0, taxable: false },
          telephoneAllowance: { amount: 0, taxable: true }
        },
        deductions: {
          incomeTax: { amount: 0, type: 'percentage' },
          socialSecurity: { amount: 1800 },
          pension: { amount: 0 },
          loanRecovery: { amount: 0 },
          insurance: { amount: 0 },
          otherDeductions: []
        },
        overtime: {
          hourlyRate: 150,
          multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 },
          maxHoursPerWeek: 20
        }
      },
      USA: {
        earnings: {
          basic: { amount: 4000, taxable: true },
          housingAllowance: { type: 'fixed', value: 1200, taxable: true },
          transportAllowance: { type: 'fixed', value: 400, taxable: true },
          medicalAllowance: { amount: 300, taxable: false },
          educationAllowance: { amount: 0, taxable: false },
          telephoneAllowance: { amount: 0, taxable: true }
        },
        deductions: {
          incomeTax: { amount: 0, type: 'percentage' },
          socialSecurity: { amount: 250 },
          pension: { amount: 200 },
          loanRecovery: { amount: 0 },
          insurance: { amount: 150 },
          otherDeductions: []
        },
        overtime: {
          hourlyRate: 20,
          multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 },
          maxHoursPerWeek: 20
        }
      },
      UK: {
        earnings: {
          basic: { amount: 3000, taxable: true },
          housingAllowance: { type: 'fixed', value: 800, taxable: true },
          transportAllowance: { type: 'fixed', value: 300, taxable: true },
          medicalAllowance: { amount: 0, taxable: false },
          educationAllowance: { amount: 0, taxable: false },
          telephoneAllowance: { amount: 0, taxable: true }
        },
        deductions: {
          incomeTax: { amount: 0, type: 'percentage' },
          socialSecurity: { amount: 200 },
          pension: { amount: 150 },
          loanRecovery: { amount: 0 },
          insurance: { amount: 0 },
          otherDeductions: []
        },
        overtime: {
          hourlyRate: 15,
          multiplier: { weekday: 1.5, weekend: 2, holiday: 2.5 },
          maxHoursPerWeek: 20
        }
      }
    };
    
    return defaults[country] || defaults.UAE;
  };

  /**
   * Fetch employees list for admin/HR view with filters
   */
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salaryApi.getEmployeesForSalary(
        new Date().getMonth() + 1,
        new Date().getFullYear(),
        filters.department,
        filters.country
      );
      
      if (response.success) {
        setEmployees(response.data || []);
        setSummary(response.summary || null);
      } else {
        throw new Error(response.error || 'Failed to load employees');
      }
    } catch (error) {
      console.error('Fetch employees error:', error);
      setError(error.message || 'Failed to load employees');
      // Set mock data as fallback
      setMockEmployees();
      showToast('Failed to load employees. Using demo data.', 'warning');
    } finally {
      setLoading(false);
    }
  }, [filters.department, filters.country, showToast]);

  const setMockEmployees = () => {
    setEmployees([
      { _id: '1', name: 'John Doe', firstName: 'John', lastName: 'Doe', employeeId: 'EMP001', department: 'Operations', designation: 'Senior Technician', country: 'UAE' },
      { _id: '2', name: 'Jane Smith', firstName: 'Jane', lastName: 'Smith', employeeId: 'EMP002', department: 'Technical', designation: 'Technician', country: 'INDIA' },
      { _id: '3', name: 'Mike Johnson', firstName: 'Mike', lastName: 'Johnson', employeeId: 'EMP003', department: 'Operations', designation: 'Supervisor', country: 'UAE' },
      { _id: '4', name: 'Sarah Williams', firstName: 'Sarah', lastName: 'Williams', employeeId: 'EMP004', department: 'Technical', designation: 'Technician', country: 'USA' },
    ]);
    setSummary({
      total: 4,
      withSalaryStructure: 2,
      processed: 1,
      byCountry: { UAE: { total: 2, withStructure: 1, processed: 0 }, INDIA: { total: 1, withStructure: 1, processed: 1 }, USA: { total: 1, withStructure: 0, processed: 0 } }
    });
  };

  /**
   * Fetch salary structure for selected employee
   */
  const fetchSalaryStructure = useCallback(async (employeeId) => {
    try {
      const response = await salaryApi.getSalaryStructure(employeeId);
      
      if (response.success && response.data) {
        const structure = response.data;
        setSalaryStructure(structure);
        
        // Populate form with existing data
        setFormData({
          employeeId,
          country: structure.country || 'UAE',
          effectiveFrom: structure.effectiveFrom?.split('T')[0] || new Date().toISOString().split('T')[0],
          earnings: structure.earnings || getDefaultStructureByCountry(structure.country || 'UAE').earnings,
          deductions: structure.deductions || getDefaultStructureByCountry(structure.country || 'UAE').deductions,
          overtime: structure.overtime || getDefaultStructureByCountry(structure.country || 'UAE').overtime
        });
      } else {
        // New employee - set defaults based on employee's country
        const employee = employees.find(e => e._id === employeeId);
        const defaultStructure = getDefaultStructureByCountry(employee?.country || 'UAE');
        setFormData({
          employeeId,
          country: employee?.country || 'UAE',
          effectiveFrom: new Date().toISOString().split('T')[0],
          ...defaultStructure
        });
        setSalaryStructure(null);
      }
    } catch (error) {
      console.error('Fetch salary structure error:', error);
      // Set default values on error
      const employee = employees.find(e => e._id === employeeId);
      const defaultStructure = getDefaultStructureByCountry(employee?.country || 'UAE');
      setFormData({
        employeeId,
        country: employee?.country || 'UAE',
        effectiveFrom: new Date().toISOString().split('T')[0],
        ...defaultStructure
      });
    }
  }, [employees]);

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
    } else {
      // For non-admin, fetch current user's salary structure
      const currentUserId = user?._id;
      if (currentUserId) {
        setSelectedEmployee({ _id: currentUserId, name: user?.name, firstName: user?.firstName, lastName: user?.lastName });
        fetchSalaryStructure(currentUserId);
        setLoading(false);
      }
    }
  }, [fetchEmployees, isAdmin, user]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value === 'All' ? '' : value }));
  };

  const handleEmployeeSelect = async (employeeId) => {
    if (!employeeId) return;
    const employee = employees.find(e => e._id === employeeId);
    setSelectedEmployee(employee);
    await fetchSalaryStructure(employeeId);
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => {
        let newData = { ...prev };
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = parsedValue;
        return newData;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleNestedChange = (section, field, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: { ...prev[section]?.[field], [subField]: value }
      }
    }));
  };

  const handleAddOtherDeduction = () => {
    setFormData(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        otherDeductions: [...(prev.deductions.otherDeductions || []), { name: '', amount: 0 }]
      }
    }));
  };

  const handleOtherDeductionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        otherDeductions: prev.deductions.otherDeductions.map((d, i) => 
          i === index ? { ...d, [field]: value } : d
        )
      }
    }));
  };

  const handleRemoveOtherDeduction = (index) => {
    setFormData(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        otherDeductions: prev.deductions.otherDeductions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      showToast('Please select an employee first', 'warning');
      return;
    }
    
    setSaving(true);
    try {
      const response = await salaryApi.updateSalaryStructure(selectedEmployee._id, formData);
      
      if (response.success) {
        showToast('Salary structure saved successfully', 'success');
        setEditing(false);
        await fetchSalaryStructure(selectedEmployee._id);
      } else {
        showToast(response.error || 'Failed to save salary structure', 'error');
      }
    } catch (error) {
      console.error('Save salary structure error:', error);
      showToast(error.response?.data?.message || 'Failed to save salary structure', 'error');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotalEarnings = () => {
    const basic = formData.earnings?.basic?.amount || 0;
    const housing = formData.earnings?.housingAllowance?.type === 'fixed' 
      ? (formData.earnings.housingAllowance?.value || 0)
      : (basic * (formData.earnings.housingAllowance?.value || 0)) / 100;
    const transport = formData.earnings?.transportAllowance?.type === 'fixed'
      ? (formData.earnings.transportAllowance?.value || 0)
      : (basic * (formData.earnings.transportAllowance?.value || 0)) / 100;
    const medical = formData.earnings?.medicalAllowance?.amount || 0;
    const education = formData.earnings?.educationAllowance?.amount || 0;
    const telephone = formData.earnings?.telephoneAllowance?.amount || 0;
    
    return basic + housing + transport + medical + education + telephone;
  };

  const calculateTotalDeductions = () => {
    const incomeTax = formData.deductions?.incomeTax?.amount || 0;
    const socialSecurity = formData.deductions?.socialSecurity?.amount || 0;
    const pension = formData.deductions?.pension?.amount || 0;
    const loanRecovery = formData.deductions?.loanRecovery?.amount || 0;
    const insurance = formData.deductions?.insurance?.amount || 0;
    const otherDeductions = formData.deductions?.otherDeductions?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
    
    return incomeTax + socialSecurity + pension + loanRecovery + insurance + otherDeductions;
  };

  const calculateNetSalary = () => {
    return calculateTotalEarnings() - calculateTotalDeductions();
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return 'AED 0';
    const currency = formData.country === 'INDIA' ? '₹' : 
                     formData.country === 'USA' ? '$' : 
                     formData.country === 'UK' ? '£' : 'AED';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: formData.country === 'INDIA' ? 'INR' : 
                formData.country === 'USA' ? 'USD' : 
                formData.country === 'UK' ? 'GBP' : 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  // Employee View - Show only my salary structure (if not admin)
  if (!isAdmin) {
    const mySalary = {
      earnings: formData.earnings,
      deductions: formData.deductions,
      netSalary: calculateNetSalary()
    };
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Salary Structure</h1>
          <p className="text-gray-500 mt-1">Your current salary breakdown</p>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Salary Components</h3>
          
          {/* Earnings */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Earnings</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Basic Salary</span>
                <span className="font-medium">{formatCurrency(formData.earnings?.basic?.amount || 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Housing Allowance</span>
                <span className="font-medium">{formatCurrency(formData.earnings?.housingAllowance?.value || 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Transport Allowance</span>
                <span className="font-medium">{formatCurrency(formData.earnings?.transportAllowance?.value || 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Medical Allowance</span>
                <span className="font-medium">{formatCurrency(formData.earnings?.medicalAllowance?.amount || 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b font-semibold">
                <span>Total Earnings</span>
                <span className="text-green-600">{formatCurrency(calculateTotalEarnings())}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Deductions</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Total Deductions</span>
                <span className="font-medium text-red-600">{formatCurrency(calculateTotalDeductions())}</span>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="font-semibold text-lg">Net Monthly Salary</span>
              <span className="font-bold text-green-600 text-xl">{formatCurrency(calculateNetSalary())}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Admin/HR View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Structure</h1>
        <p className="text-gray-500 mt-1">Configure employee salary components and benefits</p>
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
                <option key={dept} value={dept}>{dept}</option>
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
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" onClick={fetchEmployees} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-blue-600">{summary.total}</p>
            <p className="text-xs text-gray-500">Total Employees</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-green-600">{summary.withSalaryStructure}</p>
            <p className="text-xs text-gray-500">Have Structure</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-yellow-600">{summary.processed}</p>
            <p className="text-xs text-gray-500">Payroll Processed</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-purple-600">{summary.withSalaryStructure - summary.processed}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </Card>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button onClick={fetchEmployees} className="text-red-600 underline mt-2">Retry</button>
        </div>
      )}

      {/* Employee Selection */}
      <Card className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
        <select
          value={selectedEmployee?._id || ''}
          onChange={(e) => handleEmployeeSelect(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Employee --</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.name || `${emp.firstName} ${emp.lastName}`} - {emp.department || 'N/A'} ({emp.designation || 'Employee'})
            </option>
          ))}
        </select>
        {employees.length === 0 && !loading && (
          <p className="text-sm text-yellow-600 mt-2">No employees found. Add employees first.</p>
        )}
      </Card>

      {selectedEmployee && (
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedEmployee.name || `${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                </h3>
                <p className="text-sm text-gray-500">ID: {selectedEmployee.employeeId || selectedEmployee._id?.slice(-6)}</p>
              </div>
              {!editing ? (
                <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
                  ✏️ Edit Structure
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={saving}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{selectedEmployee.designation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{selectedEmployee.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 px-2 py-1 border rounded"
                >
                  <option value="UAE">UAE</option>
                  <option value="INDIA">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Effective From</p>
                <input
                  type="date"
                  name="effectiveFrom"
                  value={formData.effectiveFrom}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 px-2 py-1 border rounded"
                />
              </div>
            </div>
          </Card>

          {/* Earnings Section */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Earnings Components</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                <input
                  type="number"
                  name="earnings.basic.amount"
                  value={formData.earnings?.basic?.amount || 0}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <label className="inline-flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={formData.earnings?.basic?.taxable !== false}
                    onChange={(e) => handleNestedChange('earnings', 'basic', 'taxable', e.target.checked)}
                    disabled={!editing}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-500">Taxable</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Housing Allowance</label>
                  <div className="flex gap-2 mt-1">
                    <select
                      name="earnings.housingAllowance.type"
                      value={formData.earnings?.housingAllowance?.type || 'fixed'}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-1/3 px-2 py-2 border rounded-lg"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percentage">% of Basic</option>
                    </select>
                    <input
                      type="number"
                      name="earnings.housingAllowance.value"
                      value={formData.earnings?.housingAllowance?.value || 0}
                      onChange={handleChange}
                      disabled={!editing}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transport Allowance</label>
                  <div className="flex gap-2 mt-1">
                    <select
                      name="earnings.transportAllowance.type"
                      value={formData.earnings?.transportAllowance?.type || 'fixed'}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-1/3 px-2 py-2 border rounded-lg"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percentage">% of Basic</option>
                    </select>
                    <input
                      type="number"
                      name="earnings.transportAllowance.value"
                      value={formData.earnings?.transportAllowance?.value || 0}
                      onChange={handleChange}
                      disabled={!editing}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical Allowance</label>
                  <input
                    type="number"
                    name="earnings.medicalAllowance.amount"
                    value={formData.earnings?.medicalAllowance?.amount || 0}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Education Allowance</label>
                  <input
                    type="number"
                    name="earnings.educationAllowance.amount"
                    value={formData.earnings?.educationAllowance?.amount || 0}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Deductions Section */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Deductions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Income Tax</label>
                <input
                  type="number"
                  name="deductions.incomeTax.amount"
                  value={formData.deductions?.incomeTax?.amount || 0}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Social Security</label>
                <input
                  type="number"
                  name="deductions.socialSecurity.amount"
                  value={formData.deductions?.socialSecurity?.amount || 0}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pension Fund</label>
                <input
                  type="number"
                  name="deductions.pension.amount"
                  value={formData.deductions?.pension?.amount || 0}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Recovery</label>
                <input
                  type="number"
                  name="deductions.loanRecovery.amount"
                  value={formData.deductions?.loanRecovery?.amount || 0}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Insurance</label>
                <input
                  type="number"
                  name="deductions.insurance.amount"
                  value={formData.deductions?.insurance?.amount || 0}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Other Deductions */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Deductions</label>
              {(formData.deductions?.otherDeductions || []).map((deduction, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={deduction.name}
                    onChange={(e) => handleOtherDeductionChange(index, 'name', e.target.value)}
                    disabled={!editing}
                    className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={deduction.amount}
                    onChange={(e) => handleOtherDeductionChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    disabled={!editing}
                    className="w-32 px-3 py-2 border rounded-lg disabled:bg-gray-100"
                  />
                  {editing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOtherDeduction(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {editing && (
                <Button type="button" variant="secondary" size="sm" onClick={handleAddOtherDeduction}>
                  + Add Other Deduction
                </Button>
              )}
            </div>
          </Card>

          {/* Overtime Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Overtime Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <input
                  type="number"
                  name="overtime.hourlyRate"
                  value={formData.overtime?.hourlyRate || 0}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Hours/Week</label>
                <input
                  type="number"
                  name="overtime.maxHoursPerWeek"
                  value={formData.overtime?.maxHoursPerWeek || 20}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weekday Multiplier</label>
                <input
                  type="number"
                  step="0.5"
                  name="overtime.multiplier.weekday"
                  value={formData.overtime?.multiplier?.weekday || 1.5}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weekend Multiplier</label>
                <input
                  type="number"
                  step="0.5"
                  name="overtime.multiplier.weekend"
                  value={formData.overtime?.multiplier?.weekend || 2}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Holiday Multiplier</label>
                <input
                  type="number"
                  step="0.5"
                  name="overtime.multiplier.holiday"
                  value={formData.overtime?.multiplier?.holiday || 2.5}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>
          </Card>

          {/* Salary Summary */}
          {!editing && (
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="font-semibold text-gray-900 mb-4">Salary Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Earnings</span>
                  <span className="font-medium text-green-700">{formatCurrency(calculateTotalEarnings())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Deductions</span>
                  <span className="font-medium text-red-700">{formatCurrency(calculateTotalDeductions())}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-semibold text-lg">Net Monthly Salary</span>
                  <span className="font-bold text-green-700 text-xl">{formatCurrency(calculateNetSalary())}</span>
                </div>
              </div>
            </Card>
          )}
        </form>
      )}
    </div>
  );
};

export default SalaryStructure;