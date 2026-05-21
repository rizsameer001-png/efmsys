// // client/src/pages/users/EmployeeOnboarding.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { userApi } from '../../api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import Card from '../../components/common/Card';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const EmployeeOnboarding = () => {
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     // Personal Information
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//     nationality: '',
    
//     // Employment Information
//     role: 'technician',
//     designation: '',
//     department: 'operations',
//     employeeType: 'full_time',
//     joiningDate: new Date().toISOString().split('T')[0],
//     reportingManager: '',
    
//     // Bank Details
//     bankDetails: {
//       accountName: '',
//       accountNumber: '',
//       bankName: '',
//       ifscCode: ''
//     },
    
//     // Documents
//     documents: []
//   });
//   const [errors, setErrors] = useState({});

//   const roleOptions = [
//     { value: 'admin', label: 'Admin' },
//     { value: 'hr', label: 'HR' },
//     { value: 'manager', label: 'Manager' },
//     { value: 'supervisor', label: 'Supervisor' },
//     { value: 'technician', label: 'Technician' },
//     { value: 'accountant', label: 'Accountant' },
//   ];

//   const departmentOptions = [
//     { value: 'operations', label: 'Operations' },
//     { value: 'technical', label: 'Technical' },
//     { value: 'housekeeping', label: 'Housekeeping' },
//     { value: 'security', label: 'Security' },
//     { value: 'hr', label: 'HR' },
//     { value: 'finance', label: 'Finance' },
//   ];

//   const employeeTypeOptions = [
//     { value: 'full_time', label: 'Full Time' },
//     { value: 'part_time', label: 'Part Time' },
//     { value: 'contract', label: 'Contract' },
//     { value: 'intern', label: 'Intern' },
//   ];

//   const genderOptions = [
//     { value: 'male', label: 'Male' },
//     { value: 'female', label: 'Female' },
//     { value: 'other', label: 'Other' },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const validateStep1 = () => {
//     const newErrors = {};
//     if (!formData.firstName) newErrors.firstName = 'First name is required';
//     if (!formData.lastName) newErrors.lastName = 'Last name is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     if (!formData.phone) newErrors.phone = 'Phone number is required';
//     return newErrors;
//   };

//   const validateStep2 = () => {
//     const newErrors = {};
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.designation) newErrors.designation = 'Designation is required';
//     if (!formData.department) newErrors.department = 'Department is required';
//     return newErrors;
//   };

//   const handleNext = () => {
//     let isValid = false;
//     if (currentStep === 1) {
//       const stepErrors = validateStep1();
//       setErrors(stepErrors);
//       isValid = Object.keys(stepErrors).length === 0;
//     } else if (currentStep === 2) {
//       const stepErrors = validateStep2();
//       setErrors(stepErrors);
//       isValid = Object.keys(stepErrors).length === 0;
//     } else {
//       isValid = true;
//     }
    
//     if (isValid) {
//       setCurrentStep(prev => prev + 1);
//       setErrors({});
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(prev => prev - 1);
//     setErrors({});
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await userApi.createUser(formData);
//       showToast('Employee onboarded successfully!', 'success');
//       navigate('/users');
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Onboarding failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const steps = [
//     { number: 1, title: 'Personal Info' },
//     { number: 2, title: 'Employment Info' },
//     { number: 3, title: 'Bank Details' },
//   ];

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
//         <p className="text-gray-500 mt-1">Add a new employee to the system</p>
//       </div>

//       {/* Step Progress */}
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => (
//           <div key={step.number} className="flex-1">
//             <div className="flex items-center">
//               <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                 currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
//               }`}>
//                 {step.number}
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`flex-1 h-0.5 mx-2 ${
//                   currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
//                 }`} />
//               )}
//             </div>
//             <div className="mt-2 text-sm text-gray-600">{step.title}</div>
//           </div>
//         ))}
//       </div>

//       {/* Form Steps */}
//       <Card className="p-6">
//         {currentStep === 1 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium mb-4">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="First Name"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 error={errors.firstName}
//                 required
//               />
//               <Input
//                 label="Last Name"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 error={errors.lastName}
//                 required
//               />
//               <Input
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={errors.email}
//                 required
//               />
//               <Input
//                 label="Phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 error={errors.phone}
//                 required
//               />
//               <Input
//                 label="Date of Birth"
//                 name="dateOfBirth"
//                 type="date"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//               />
//               <Select
//                 label="Gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 options={genderOptions}
//               />
//               <Input
//                 label="Nationality"
//                 name="nationality"
//                 value={formData.nationality}
//                 onChange={handleChange}
//                 className="md:col-span-2"
//               />
//             </div>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium mb-4">Employment Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Select
//                 label="Role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 options={roleOptions}
//                 error={errors.role}
//                 required
//               />
//               <Input
//                 label="Designation"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 error={errors.designation}
//                 required
//               />
//               <Select
//                 label="Department"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 options={departmentOptions}
//                 error={errors.department}
//                 required
//               />
//               <Select
//                 label="Employment Type"
//                 name="employeeType"
//                 value={formData.employeeType}
//                 onChange={handleChange}
//                 options={employeeTypeOptions}
//               />
//               <Input
//                 label="Joining Date"
//                 name="joiningDate"
//                 type="date"
//                 value={formData.joiningDate}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Reporting Manager ID"
//                 name="reportingManager"
//                 value={formData.reportingManager}
//                 onChange={handleChange}
//                 placeholder="Manager's User ID"
//               />
//             </div>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium mb-4">Bank Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="Account Name"
//                 name="bankDetails.accountName"
//                 value={formData.bankDetails.accountName}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Account Number"
//                 name="bankDetails.accountNumber"
//                 value={formData.bankDetails.accountNumber}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Bank Name"
//                 name="bankDetails.bankName"
//                 value={formData.bankDetails.bankName}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="IFSC Code"
//                 name="bankDetails.ifscCode"
//                 value={formData.bankDetails.ifscCode}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-6 pt-4 border-t">
//           <Button
//             type="button"
//             variant="secondary"
//             onClick={handleBack}
//             disabled={currentStep === 1}
//           >
//             Back
//           </Button>
//           {currentStep < 3 ? (
//             <Button type="button" onClick={handleNext}>
//               Continue
//             </Button>
//           ) : (
//             <Button onClick={handleSubmit} isLoading={loading}>
//               Complete Onboarding
//             </Button>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default EmployeeOnboarding;




// // client/src/pages/users/EmployeeOnboarding.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { userApi } from '../../api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import Card from '../../components/common/Card';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const EmployeeOnboarding = () => {
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     // Personal Information
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//     nationality: '',
    
//     // Employment Information
//     role: 'technician',
//     designation: '',
//     department: 'operations',
//     employeeType: 'full_time',
//     joiningDate: new Date().toISOString().split('T')[0],
//     reportingManager: '',
    
//     // Bank Details
//     bankDetails: {
//       accountName: '',
//       accountNumber: '',
//       bankName: '',
//       ifscCode: '',
//       iban: ''  // 🔴 FIX 1: Added missing IBAN field
//     },
    
//     // Documents
//     documents: []
//   });
//   const [errors, setErrors] = useState({});

//   const roleOptions = [
//     { value: 'super_admin', label: 'Super Admin' },  // 🔴 FIX 2: Added super_admin option
//     { value: 'admin', label: 'Admin' },
//     { value: 'hr', label: 'HR' },
//     { value: 'manager', label: 'Manager' },
//     { value: 'supervisor', label: 'Supervisor' },
//     { value: 'technician', label: 'Technician' },
//     { value: 'accountant', label: 'Accountant' },
//   ];

//   const departmentOptions = [
//     { value: 'operations', label: 'Operations' },
//     { value: 'technical', label: 'Technical' },
//     { value: 'housekeeping', label: 'Housekeeping' },
//     { value: 'security', label: 'Security' },
//     { value: 'management', label: 'Management' },
//     { value: 'hr', label: 'HR' },
//     { value: 'finance', label: 'Finance' },
//   ];

//   const employeeTypeOptions = [
//     { value: 'full_time', label: 'Full Time' },
//     { value: 'part_time', label: 'Part Time' },
//     { value: 'contract', label: 'Contract' },
//     { value: 'intern', label: 'Intern' },
//   ];

//   const genderOptions = [
//     { value: 'male', label: 'Male' },
//     { value: 'female', label: 'Female' },
//     { value: 'other', label: 'Other' },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//     // Clear error when field is edited
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   // 🔴 FIX 3: Enhanced validation for Step 1
//   const validateStep1 = () => {
//     const newErrors = {};
//     if (!formData.firstName) newErrors.firstName = 'First name is required';
//     if (!formData.lastName) newErrors.lastName = 'Last name is required';
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.phone) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
//       newErrors.phone = 'Phone number must be 10-15 digits';
//     }
//     return newErrors;
//   };

//   // 🔴 FIX 4: Enhanced validation for Step 2
//   const validateStep2 = () => {
//     const newErrors = {};
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.designation) newErrors.designation = 'Designation is required';
//     if (!formData.department) newErrors.department = 'Department is required';
//     return newErrors;
//   };

//   const handleNext = () => {
//     let isValid = false;
//     if (currentStep === 1) {
//       const stepErrors = validateStep1();
//       setErrors(stepErrors);
//       isValid = Object.keys(stepErrors).length === 0;
//     } else if (currentStep === 2) {
//       const stepErrors = validateStep2();
//       setErrors(stepErrors);
//       isValid = Object.keys(stepErrors).length === 0;
//     } else {
//       isValid = true;
//     }
    
//     if (isValid) {
//       setCurrentStep(prev => prev + 1);
//       setErrors({});
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(prev => prev - 1);
//     setErrors({});
//   };

//   // 🔴 FIX 5: Prepare data for API submission (similar to UserForm)
//   const prepareSubmitData = () => {
//     // Generate employee ID
//     const prefix = formData.role.substring(0, 3).toUpperCase();
//     const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     const employeeId = `${prefix}${randomNum}`;
    
//     const submitData = {
//       // Personal Information
//       firstName: formData.firstName.trim(),
//       lastName: formData.lastName.trim(),
//       email: formData.email.trim().toLowerCase(),
//       phone: formData.phone.trim(),
//       dateOfBirth: formData.dateOfBirth || null,
//       gender: formData.gender || null,
//       nationality: formData.nationality || null,
      
//       // Employment Information
//       role: formData.role,
//       designation: formData.designation,
//       department: formData.department,
//       employeeType: formData.employeeType,
//       joiningDate: formData.joiningDate,
//       employeeId: employeeId,  // Auto-generate employee ID
      
//       // Default values
//       status: 'active',
//       isActive: true,
//       isEmailVerified: false,
//       isPhoneVerified: false,
      
//       // Bank Details
//       bankDetails: {
//         accountName: formData.bankDetails.accountName || '',
//         accountNumber: formData.bankDetails.accountNumber || '',
//         bankName: formData.bankDetails.bankName || '',
//         ifscCode: formData.bankDetails.ifscCode || '',
//         iban: formData.bankDetails.iban || ''
//       },
      
//       // Shift Timing (default)
//       shiftTiming: {
//         start: '09:00',
//         end: '18:00',
//         timezone: 'Asia/Dubai'
//       },
      
//       // Timestamps
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };
    
//     // Add optional fields only if they have values
//     if (formData.reportingManager) {
//       submitData.reportingManager = formData.reportingManager;
//     }
    
//     return submitData;
//   };

//   // 🔴 FIX 6: Handle form submission with proper data preparation
//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const submitData = prepareSubmitData();
      
//       // Log the data being sent for debugging
//       console.log('Submitting employee data:', submitData);
      
//       const response = await userApi.createUser(submitData);
      
//       if (response.data.success) {
//         showToast(`Employee onboarded successfully! Employee ID: ${submitData.employeeId}`, 'success');
//         navigate('/users');
//       } else {
//         throw new Error(response.data.error || 'Onboarding failed');
//       }
//     } catch (error) {
//       console.error('Onboarding error:', error);
//       const message = error.response?.data?.error || error.message || 'Onboarding failed';
//       showToast(message, 'error');
      
//       // If there are field-specific errors, display them
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const steps = [
//     { number: 1, title: 'Personal Info' },
//     { number: 2, title: 'Employment Info' },
//     { number: 3, title: 'Bank Details' },
//   ];

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
//         <p className="text-gray-500 mt-1">Add a new employee to the system</p>
//       </div>

//       {/* Step Progress */}
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => (
//           <div key={step.number} className="flex-1">
//             <div className="flex items-center">
//               <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                 currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
//               }`}>
//                 {step.number}
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`flex-1 h-0.5 mx-2 ${
//                   currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
//                 }`} />
//               )}
//             </div>
//             <div className="mt-2 text-sm text-gray-600">{step.title}</div>
//           </div>
//         ))}
//       </div>

//       {/* Form Steps */}
//       <Card className="p-6">
//         {currentStep === 1 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium mb-4">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="First Name"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 error={errors.firstName}
//                 required
//               />
//               <Input
//                 label="Last Name"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 error={errors.lastName}
//                 required
//               />
//               <Input
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={errors.email}
//                 required
//                 placeholder="employee@company.com"
//               />
//               <Input
//                 label="Phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 error={errors.phone}
//                 required
//                 placeholder="+971XXXXXXXXX"
//               />
//               <Input
//                 label="Date of Birth"
//                 name="dateOfBirth"
//                 type="date"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//               />
//               <Select
//                 label="Gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 options={genderOptions}
//               />
//               <Input
//                 label="Nationality"
//                 name="nationality"
//                 value={formData.nationality}
//                 onChange={handleChange}
//                 className="md:col-span-2"
//                 placeholder="e.g., UAE, India, USA"
//               />
//             </div>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium mb-4">Employment Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Select
//                 label="Role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 options={roleOptions}
//                 error={errors.role}
//                 required
//               />
//               <Input
//                 label="Designation"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 error={errors.designation}
//                 required
//                 placeholder="e.g., Senior Technician, Team Lead"
//               />
//               <Select
//                 label="Department"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 options={departmentOptions}
//                 error={errors.department}
//                 required
//               />
//               <Select
//                 label="Employment Type"
//                 name="employeeType"
//                 value={formData.employeeType}
//                 onChange={handleChange}
//                 options={employeeTypeOptions}
//               />
//               <Input
//                 label="Joining Date"
//                 name="joiningDate"
//                 type="date"
//                 value={formData.joiningDate}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Reporting Manager ID"
//                 name="reportingManager"
//                 value={formData.reportingManager}
//                 onChange={handleChange}
//                 placeholder="Manager's User ID (optional)"
//               />
//             </div>
            
//             {/* 🔴 FIX 7: Added helpful info message */}
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 📝 Employee ID will be auto-generated based on role (e.g., TECH1234 for Technician)
//               </p>
//             </div>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium mb-4">Bank Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="Account Name"
//                 name="bankDetails.accountName"
//                 value={formData.bankDetails.accountName}
//                 onChange={handleChange}
//                 placeholder="As per bank records"
//               />
//               <Input
//                 label="Account Number"
//                 name="bankDetails.accountNumber"
//                 value={formData.bankDetails.accountNumber}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Bank Name"
//                 name="bankDetails.bankName"
//                 value={formData.bankDetails.bankName}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="IFSC Code"
//                 name="bankDetails.ifscCode"
//                 value={formData.bankDetails.ifscCode}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="IBAN"
//                 name="bankDetails.iban"
//                 value={formData.bankDetails.iban}
//                 onChange={handleChange}
//                 placeholder="International Bank Account Number"
//                 className="md:col-span-2"
//               />
//             </div>
            
//             {/* 🔴 FIX 8: Added summary section before submission */}
//             <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600 font-medium mb-2">📋 Summary</p>
//               <div className="grid grid-cols-2 gap-2 text-sm">
//                 <div>
//                   <span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Role:</span> {formData.role}
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Department:</span> {formData.department}
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Joining Date:</span> {formData.joiningDate}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-6 pt-4 border-t">
//           <Button
//             type="button"
//             variant="secondary"
//             onClick={handleBack}
//             disabled={currentStep === 1}
//           >
//             Back
//           </Button>
//           {currentStep < 3 ? (
//             <Button type="button" onClick={handleNext}>
//               Continue
//             </Button>
//           ) : (
//             <Button onClick={handleSubmit} isLoading={loading}>
//               Complete Onboarding
//             </Button>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default EmployeeOnboarding;


// client/src/pages/users/EmployeeOnboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const EmployeeOnboarding = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    
    // Employment Information
    role: 'technician',
    designation: '',
    department: 'operations',
    employeeType: 'full_time',
    joiningDate: new Date().toISOString().split('T')[0],
    reportingManager: '',
    
    // Bank Details
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      iban: ''
    },
    
    // Documents
    documents: []
  });
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR' },
    { value: 'manager', label: 'Manager' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'technician', label: 'Technician' },
    { value: 'accountant', label: 'Accountant' },
  ];

  const departmentOptions = [
    { value: 'operations', label: 'Operations' },
    { value: 'technical', label: 'Technical' },
    { value: 'housekeeping', label: 'Housekeeping' },
    { value: 'security', label: 'Security' },
    { value: 'management', label: 'Management' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
  ];

  const employeeTypeOptions = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Phone number must be 10-15 digits';
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.department) newErrors.department = 'Department is required';
    return newErrors;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) {
      const stepErrors = validateStep1();
      setErrors(stepErrors);
      isValid = Object.keys(stepErrors).length === 0;
    } else if (currentStep === 2) {
      const stepErrors = validateStep2();
      setErrors(stepErrors);
      isValid = Object.keys(stepErrors).length === 0;
    } else {
      isValid = true;
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  // 🔴 FIX 1: Prepare data - Convert null/empty to undefined to avoid enum validation errors
  const prepareSubmitData = () => {
    const prefix = formData.role.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const employeeId = `${prefix}${randomNum}`;
    
    const submitData = {
      // Personal Information - Use undefined instead of null for optional fields
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dateOfBirth || undefined,  // ✅ undefined instead of null
      gender: formData.gender || undefined,            // ✅ undefined instead of null - FIXES gender error
      nationality: formData.nationality || undefined,   // ✅ undefined instead of null
      
      // Employment Information
      role: formData.role,
      designation: formData.designation,
      department: formData.department,
      employeeType: formData.employeeType,
      joiningDate: formData.joiningDate,
      employeeId: employeeId,
      
      // Default values
      status: 'active',
      isActive: true,
      isEmailVerified: false,
      isPhoneVerified: false,
      
      // Bank Details
      bankDetails: {
        accountName: formData.bankDetails.accountName || '',
        accountNumber: formData.bankDetails.accountNumber || '',
        bankName: formData.bankDetails.bankName || '',
        ifscCode: formData.bankDetails.ifscCode || '',
        iban: formData.bankDetails.iban || ''
      },
      
      // Shift Timing (default)
      shiftTiming: {
        start: '09:00',
        end: '18:00',
        timezone: 'Asia/Dubai'
      },
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add optional fields only if they have values
    if (formData.reportingManager) {
      submitData.reportingManager = formData.reportingManager;
    }
    
    // 🔴 FIX 2: Remove undefined values to avoid validation errors
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === undefined) {
        delete submitData[key];
      }
    });
    
    // 🔴 FIX 3: Clean bankDetails - remove empty fields
    if (submitData.bankDetails) {
      Object.keys(submitData.bankDetails).forEach(key => {
        if (submitData.bankDetails[key] === '' || submitData.bankDetails[key] === undefined) {
          delete submitData.bankDetails[key];
        }
      });
      // Remove bankDetails if completely empty
      if (Object.keys(submitData.bankDetails).length === 0) {
        delete submitData.bankDetails;
      }
    }
    
    return submitData;
  };

  // 🔴 FIX 4: Handle form submission with proper error handling
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const submitData = prepareSubmitData();
      
      console.log('Submitting employee data:', submitData);
      
      const response = await userApi.createUser(submitData);
      
      if (response.data.success) {
        showToast(`Employee onboarded successfully! Employee ID: ${submitData.employeeId}`, 'success');
        navigate('/users');
      } else {
        throw new Error(response.data.error || 'Onboarding failed');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      
      // 🔴 FIX 5: Better error message for gender validation
      let errorMessage = error.response?.data?.error || error.message || 'Onboarding failed';
      
      // Check for gender validation error specifically
      if (errorMessage.includes('gender') || error.response?.data?.error?.includes('gender')) {
        errorMessage = 'Please select a valid gender option (Male, Female, or Other)';
        setErrors({ gender: errorMessage });
      }
      
      showToast(errorMessage, 'error');
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Employment Info' },
    { number: 3, title: 'Bank Details' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
        <p className="text-gray-500 mt-1">Add a new employee to the system</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex-1">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
            <div className="mt-2 text-sm text-gray-600">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <Card className="p-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="employee@company.com"
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                placeholder="+971XXXXXXXXX"
              />
              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
              />
              <Input
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="md:col-span-2"
                placeholder="e.g., UAE, India, USA"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                error={errors.role}
                required
              />
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
                required
                placeholder="e.g., Senior Technician, Team Lead"
              />
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={departmentOptions}
                error={errors.department}
                required
              />
              <Select
                label="Employment Type"
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                options={employeeTypeOptions}
              />
              <Input
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
              />
              <Input
                label="Reporting Manager ID"
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
                placeholder="Manager's User ID (optional)"
              />
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                📝 Employee ID will be auto-generated based on role (e.g., TECH1234 for Technician)
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Account Name"
                name="bankDetails.accountName"
                value={formData.bankDetails.accountName}
                onChange={handleChange}
                placeholder="As per bank records"
              />
              <Input
                label="Account Number"
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
              />
              <Input
                label="Bank Name"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
              />
              <Input
                label="IFSC Code"
                name="bankDetails.ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={handleChange}
              />
              <Input
                label="IBAN"
                name="bankDetails.iban"
                value={formData.bankDetails.iban}
                onChange={handleChange}
                placeholder="International Bank Account Number"
                className="md:col-span-2"
              />
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">📋 Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <span className="text-gray-500">Role:</span> {formData.role}
                </div>
                <div>
                  <span className="text-gray-500">Department:</span> {formData.department}
                </div>
                <div>
                  <span className="text-gray-500">Joining Date:</span> {formData.joiningDate}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < 3 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={loading}>
              Complete Onboarding
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EmployeeOnboarding;