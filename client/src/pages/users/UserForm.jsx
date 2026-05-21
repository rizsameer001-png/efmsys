// // client/src/pages/users/UserForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { userApi, roleApi } from '../../api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';

// const UserForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { user: currentUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(!!id);
//   const [roles, setRoles] = useState([]);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     role: 'technician',
//     designation: '',
//     department: 'operations',
//     employeeType: 'full_time',
//     reportingManager: '',
//     supervisor: '',
//     assignedBuildings: [],
//     shiftTiming: {
//       start: '09:00',
//       end: '18:00',
//       timezone: 'Asia/Dubai'
//     },
//     joiningDate: new Date().toISOString().split('T')[0],
//     status: 'active',
//     bankDetails: {
//       accountName: '',
//       accountNumber: '',
//       bankName: '',
//       ifscCode: '',
//       iban: ''
//     }
//   });
//   const [errors, setErrors] = useState({});

//   const roleOptions = [
//     { value: 'super_admin', label: 'Super Admin' },
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

//   const statusOptions = [
//     { value: 'active', label: 'Active' },
//     { value: 'inactive', label: 'Inactive' },
//     { value: 'suspended', label: 'Suspended' },
//   ];

//   useEffect(() => {
//     fetchRoles();
//     if (id) {
//       fetchUser();
//     }
//   }, [id]);

//   const fetchRoles = async () => {
//     try {
//       const response = await roleApi.getRoles();
//       setRoles(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch roles:', error);
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const response = await userApi.getUserById(id);
//       const userData = response.data.data;
//       setFormData({
//         firstName: userData.firstName || '',
//         lastName: userData.lastName || '',
//         email: userData.email || '',
//         phone: userData.phone || '',
//         role: userData.role || 'technician',
//         designation: userData.designation || '',
//         department: userData.department || 'operations',
//         employeeType: userData.employeeType || 'full_time',
//         reportingManager: userData.reportingManager?._id || '',
//         supervisor: userData.supervisor?._id || '',
//         assignedBuildings: userData.assignedBuildings?.map(b => b._id) || [],
//         shiftTiming: userData.shiftTiming || { start: '09:00', end: '18:00', timezone: 'Asia/Dubai' },
//         joiningDate: userData.joiningDate ? new Date(userData.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         status: userData.status || 'active',
//         bankDetails: userData.bankDetails || {
//           accountName: '',
//           accountNumber: '',
//           bankName: '',
//           ifscCode: '',
//           iban: ''
//         },
//       });
//     } catch (error) {
//       showToast('Failed to load user data', 'error');
//       navigate('/users');
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleShiftChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       shiftTiming: {
//         ...prev.shiftTiming,
//         [field]: value
//       }
//     }));
//   };

//   const validate = () => {
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
//     }
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.designation) newErrors.designation = 'Designation is required';
//     if (!formData.department) newErrors.department = 'Department is required';
    
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       showToast('Please fix the form errors', 'error');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       if (id) {
//         await userApi.updateUser(id, formData);
//         showToast('User updated successfully', 'success');
//       } else {
//         await userApi.createUser(formData);
//         showToast('User created successfully', 'success');
//       }
//       navigate('/users');
//     } catch (error) {
//       const message = error.response?.data?.error || 'Operation failed';
//       showToast(message, 'error');
      
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <div className="flex justify-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Basic Information */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="First Name"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             error={errors.firstName}
//             required
//           />
//           <Input
//             label="Last Name"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             error={errors.lastName}
//             required
//           />
//           <Input
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             error={errors.email}
//             required
//           />
//           <Input
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             error={errors.phone}
//             required
//           />
//           <Select
//             label="Role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             options={roleOptions}
//             error={errors.role}
//             required
//           />
//           <Input
//             label="Designation"
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             error={errors.designation}
//             required
//           />
//           <Select
//             label="Department"
//             name="department"
//             value={formData.department}
//             onChange={handleChange}
//             options={departmentOptions}
//             error={errors.department}
//             required
//           />
//           <Select
//             label="Employment Type"
//             name="employeeType"
//             value={formData.employeeType}
//             onChange={handleChange}
//             options={employeeTypeOptions}
//           />
//           <Input
//             label="Joining Date"
//             name="joiningDate"
//             type="date"
//             value={formData.joiningDate}
//             onChange={handleChange}
//           />
//           <Select
//             label="Status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             options={statusOptions}
//           />
//         </div>
//       </div>

//       {/* Shift Timing */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Shift Timing</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Input
//             label="Shift Start"
//             type="time"
//             value={formData.shiftTiming.start}
//             onChange={(e) => handleShiftChange('start', e.target.value)}
//           />
//           <Input
//             label="Shift End"
//             type="time"
//             value={formData.shiftTiming.end}
//             onChange={(e) => handleShiftChange('end', e.target.value)}
//           />
//           <Input
//             label="Time Zone"
//             value={formData.shiftTiming.timezone}
//             onChange={(e) => handleShiftChange('timezone', e.target.value)}
//             placeholder="Asia/Dubai"
//           />
//         </div>
//       </div>

//       {/* Bank Details */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Account Name"
//             name="bankDetails.accountName"
//             value={formData.bankDetails.accountName}
//             onChange={handleChange}
//           />
//           <Input
//             label="Account Number"
//             name="bankDetails.accountNumber"
//             value={formData.bankDetails.accountNumber}
//             onChange={handleChange}
//           />
//           <Input
//             label="Bank Name"
//             name="bankDetails.bankName"
//             value={formData.bankDetails.bankName}
//             onChange={handleChange}
//           />
//           <Input
//             label="IFSC Code"
//             name="bankDetails.ifscCode"
//             value={formData.bankDetails.ifscCode}
//             onChange={handleChange}
//           />
//           <Input
//             label="IBAN"
//             name="bankDetails.iban"
//             value={formData.bankDetails.iban}
//             onChange={handleChange}
//             placeholder="International Bank Account Number"
//           />
//         </div>
//       </div>

//       {/* Form Actions */}
//       <div className="flex justify-end space-x-3">
//         <Button
//           type="button"
//           variant="secondary"
//           onClick={() => navigate('/users')}
//         >
//           Cancel
//         </Button>
//         <Button type="submit" isLoading={loading}>
//           {id ? 'Update User' : 'Create User'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default UserForm;



// // client/src/pages/users/UserForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { userApi, roleApi } from '../../api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';

// const UserForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { user: currentUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(!!id);
//   const [roles, setRoles] = useState([]);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     role: 'technician',
//     designation: '',
//     department: 'operations',
//     employeeType: 'full_time',
//     reportingManager: '',
//     supervisor: '',
//     assignedBuildings: [],
//     shiftTiming: {
//       start: '09:00',
//       end: '18:00',
//       timezone: 'Asia/Dubai'
//     },
//     joiningDate: new Date().toISOString().split('T')[0],
//     status: 'active',
//     bankDetails: {
//       accountName: '',
//       accountNumber: '',
//       bankName: '',
//       ifscCode: '',
//       iban: ''
//     }
//   });
//   const [errors, setErrors] = useState({});

//   const roleOptions = [
//     { value: 'super_admin', label: 'Super Admin' },
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

//   const statusOptions = [
//     { value: 'active', label: 'Active' },
//     { value: 'inactive', label: 'Inactive' },
//     { value: 'suspended', label: 'Suspended' },
//   ];

//   useEffect(() => {
//     fetchRoles();
//     if (id) {
//       fetchUser();
//     }
//   }, [id]);

//   const fetchRoles = async () => {
//     try {
//       const response = await roleApi.getRoles();
//       setRoles(response.data.data || []);
//     } catch (error) {
//       console.error('Failed to fetch roles:', error);
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const response = await userApi.getUserById(id);
//       const userData = response.data.data;
      
//       // 🔴 FIX 3: Properly map user data to form
//       setFormData({
//         firstName: userData.firstName || '',
//         lastName: userData.lastName || '',
//         email: userData.email || '',
//         phone: userData.phone || '',
//         role: userData.role || 'technician',
//         designation: userData.designation || '',
//         department: userData.department || 'operations',
//         employeeType: userData.employeeType || 'full_time',
//         reportingManager: userData.reportingManager?._id || userData.reportingManager || '',
//         supervisor: userData.supervisor?._id || userData.supervisor || '',
//         assignedBuildings: userData.assignedBuildings?.map(b => b._id || b) || [],
//         shiftTiming: userData.shiftTiming || { start: '09:00', end: '18:00', timezone: 'Asia/Dubai' },
//         joiningDate: userData.joiningDate ? new Date(userData.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         status: userData.status || 'active',
//         bankDetails: userData.bankDetails || {
//           accountName: '',
//           accountNumber: '',
//           bankName: '',
//           ifscCode: '',
//           iban: ''
//         },
//       });
//     } catch (error) {
//       console.error('Fetch user error:', error);
//       showToast('Failed to load user data', 'error');
//       navigate('/users');
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleShiftChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       shiftTiming: {
//         ...prev.shiftTiming,
//         [field]: value
//       }
//     }));
//   };

//   // 🔴 FIX 4: Enhanced validation
//   const validate = () => {
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
//       newErrors.phone = 'Phone number is invalid';
//     }
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.designation) newErrors.designation = 'Designation is required';
//     if (!formData.department) newErrors.department = 'Department is required';
    
//     return newErrors;
//   };

//   // 🔴 FIX 5: Prepare data for API submission
//   const prepareSubmitData = () => {
//     const submitData = {
//       firstName: formData.firstName.trim(),
//       lastName: formData.lastName.trim(),
//       email: formData.email.trim().toLowerCase(),
//       phone: formData.phone.trim(),
//       role: formData.role,
//       designation: formData.designation,
//       department: formData.department,
//       employeeType: formData.employeeType,
//       status: formData.status,
//       joiningDate: formData.joiningDate,
//       shiftTiming: formData.shiftTiming,
//       bankDetails: formData.bankDetails,
//     };
    
//     // Add optional fields only if they have values
//     if (formData.reportingManager) submitData.reportingManager = formData.reportingManager;
//     if (formData.supervisor) submitData.supervisor = formData.supervisor;
//     if (formData.assignedBuildings && formData.assignedBuildings.length > 0) {
//       submitData.assignedBuildings = formData.assignedBuildings;
//     }
    
//     // Generate employee ID if new user (you can customize this logic)
//     if (!id) {
//       const prefix = formData.role.substring(0, 3).toUpperCase();
//       const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//       submitData.employeeId = `${prefix}${randomNum}`;
//     }
    
//     return submitData;
//   };

//   // 🔴 FIX 6: Handle form submission with proper data preparation
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       showToast('Please fix the form errors', 'error');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const submitData = prepareSubmitData();
      
//       if (id) {
//         const response = await userApi.updateUser(id, submitData);
//         if (response.data.success) {
//           showToast('User updated successfully', 'success');
//           navigate('/users');
//         } else {
//           throw new Error(response.data.error || 'Update failed');
//         }
//       } else {
//         const response = await userApi.createUser(submitData);
//         if (response.data.success) {
//           showToast('User created successfully', 'success');
//           navigate('/users');
//         } else {
//           throw new Error(response.data.error || 'Creation failed');
//         }
//       }
//     } catch (error) {
//       console.error('Form submission error:', error);
//       const message = error.response?.data?.error || error.message || 'Operation failed';
//       showToast(message, 'error');
      
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <div className="flex justify-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Basic Information */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="First Name"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             error={errors.firstName}
//             required
//           />
//           <Input
//             label="Last Name"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             error={errors.lastName}
//             required
//           />
//           <Input
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             error={errors.email}
//             required
//           />
//           <Input
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             error={errors.phone}
//             required
//             placeholder="+971XXXXXXXXX"
//           />
//           <Select
//             label="Role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             options={roleOptions}
//             error={errors.role}
//             required
//           />
//           <Input
//             label="Designation"
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             error={errors.designation}
//             required
//           />
//           <Select
//             label="Department"
//             name="department"
//             value={formData.department}
//             onChange={handleChange}
//             options={departmentOptions}
//             error={errors.department}
//             required
//           />
//           <Select
//             label="Employment Type"
//             name="employeeType"
//             value={formData.employeeType}
//             onChange={handleChange}
//             options={employeeTypeOptions}
//           />
//           <Input
//             label="Joining Date"
//             name="joiningDate"
//             type="date"
//             value={formData.joiningDate}
//             onChange={handleChange}
//           />
//           <Select
//             label="Status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             options={statusOptions}
//           />
//         </div>
//       </div>

//       {/* Shift Timing */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Shift Timing</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Input
//             label="Shift Start"
//             type="time"
//             value={formData.shiftTiming.start}
//             onChange={(e) => handleShiftChange('start', e.target.value)}
//           />
//           <Input
//             label="Shift End"
//             type="time"
//             value={formData.shiftTiming.end}
//             onChange={(e) => handleShiftChange('end', e.target.value)}
//           />
//           <Input
//             label="Time Zone"
//             value={formData.shiftTiming.timezone}
//             onChange={(e) => handleShiftChange('timezone', e.target.value)}
//             placeholder="Asia/Dubai"
//           />
//         </div>
//       </div>

//       {/* Bank Details */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Account Name"
//             name="bankDetails.accountName"
//             value={formData.bankDetails.accountName}
//             onChange={handleChange}
//           />
//           <Input
//             label="Account Number"
//             name="bankDetails.accountNumber"
//             value={formData.bankDetails.accountNumber}
//             onChange={handleChange}
//           />
//           <Input
//             label="Bank Name"
//             name="bankDetails.bankName"
//             value={formData.bankDetails.bankName}
//             onChange={handleChange}
//           />
//           <Input
//             label="IFSC Code"
//             name="bankDetails.ifscCode"
//             value={formData.bankDetails.ifscCode}
//             onChange={handleChange}
//           />
//           <Input
//             label="IBAN"
//             name="bankDetails.iban"
//             value={formData.bankDetails.iban}
//             onChange={handleChange}
//             placeholder="International Bank Account Number"
//           />
//         </div>
//       </div>

//       {/* Form Actions */}
//       <div className="flex justify-end space-x-3">
//         <Button
//           type="button"
//           variant="secondary"
//           onClick={() => navigate('/users')}
//         >
//           Cancel
//         </Button>
//         <Button type="submit" isLoading={loading}>
//           {id ? 'Update User' : 'Create User'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default UserForm;


//Update User Creation (Add chat permission toggle)
// client/src/pages/users/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi, roleApi } from '../../api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'technician',
    designation: '',
    department: 'operations',
    employeeType: 'full_time',
    reportingManager: '',
    supervisor: '',
    assignedBuildings: [],
    shiftTiming: {
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Dubai'
    },
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'active',
    // 🔴 NEW: Chat Permission field
    chatEnabled: false,
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      iban: ''
    }
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

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  useEffect(() => {
    fetchRoles();
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchRoles = async () => {
    try {
      const response = await roleApi.getRoles();
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await userApi.getUserById(id);
      const userData = response.data.data;
      
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'technician',
        designation: userData.designation || '',
        department: userData.department || 'operations',
        employeeType: userData.employeeType || 'full_time',
        reportingManager: userData.reportingManager?._id || userData.reportingManager || '',
        supervisor: userData.supervisor?._id || userData.supervisor || '',
        assignedBuildings: userData.assignedBuildings?.map(b => b._id || b) || [],
        shiftTiming: userData.shiftTiming || { start: '09:00', end: '18:00', timezone: 'Asia/Dubai' },
        joiningDate: userData.joiningDate ? new Date(userData.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: userData.status || 'active',
        // 🔴 NEW: Fetch chat permission
        chatEnabled: userData.chatEnabled || false,
        bankDetails: userData.bankDetails || {
          accountName: '',
          accountNumber: '',
          bankName: '',
          ifscCode: '',
          iban: ''
        },
      });
    } catch (error) {
      console.error('Fetch user error:', error);
      showToast('Failed to load user data', 'error');
      navigate('/users');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      return;
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleShiftChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      shiftTiming: {
        ...prev.shiftTiming,
        [field]: value
      }
    }));
  };

  const validate = () => {
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
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.department) newErrors.department = 'Department is required';
    
    return newErrors;
  };

  const prepareSubmitData = () => {
    const submitData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      role: formData.role,
      designation: formData.designation,
      department: formData.department,
      employeeType: formData.employeeType,
      status: formData.status,
      joiningDate: formData.joiningDate,
      shiftTiming: formData.shiftTiming,
      // 🔴 NEW: Include chat permission
      chatEnabled: formData.chatEnabled,
      bankDetails: formData.bankDetails,
    };
    
    // Add optional fields only if they have values
    if (formData.reportingManager) submitData.reportingManager = formData.reportingManager;
    if (formData.supervisor) submitData.supervisor = formData.supervisor;
    if (formData.assignedBuildings && formData.assignedBuildings.length > 0) {
      submitData.assignedBuildings = formData.assignedBuildings;
    }
    
    // Generate employee ID if new user
    if (!id) {
      const prefix = formData.role.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      submitData.employeeId = `${prefix}${randomNum}`;
    }
    
    return submitData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix the form errors', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = prepareSubmitData();
      
      if (id) {
        const response = await userApi.updateUser(id, submitData);
        if (response.data.success) {
          showToast('User updated successfully', 'success');
          navigate('/users');
        } else {
          throw new Error(response.data.error || 'Update failed');
        }
      } else {
        const response = await userApi.createUser(submitData);
        if (response.data.success) {
          showToast('User created successfully', 'success');
          navigate('/users');
        } else {
          throw new Error(response.data.error || 'Creation failed');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const message = error.response?.data?.error || error.message || 'Operation failed';
      showToast(message, 'error');
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if current user can modify chat settings (only Super Admin)
  const canModifyChatSettings = currentUser?.role === 'super_admin';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
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
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
        </div>
      </div>

      {/* 🔴 NEW: Chat Access Permission Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Access Permissions</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="chatEnabled"
              checked={formData.chatEnabled}
              onChange={handleChange}
              disabled={!canModifyChatSettings}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div>
              <label className={`font-medium ${canModifyChatSettings ? 'text-gray-900' : 'text-gray-400'}`}>
                Enable Chat Access
              </label>
              <p className="text-sm text-gray-500">
                Allow this user to access the chat feature and communicate with other users.
              </p>
              {!canModifyChatSettings && (
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠️ Only Super Admin can modify chat permissions
                </p>
              )}
            </div>
          </div>
          
          {formData.chatEnabled && (
            <div className="ml-7 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💬 Chat enabled users can:
              </p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
                <li>Send and receive real-time messages</li>
                <li>Create group chats</li>
                <li>Share files and locations</li>
                <li>Receive chat notifications</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Shift Timing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shift Timing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Shift Start"
            type="time"
            value={formData.shiftTiming.start}
            onChange={(e) => handleShiftChange('start', e.target.value)}
          />
          <Input
            label="Shift End"
            type="time"
            value={formData.shiftTiming.end}
            onChange={(e) => handleShiftChange('end', e.target.value)}
          />
          <Input
            label="Time Zone"
            value={formData.shiftTiming.timezone}
            onChange={(e) => handleShiftChange('timezone', e.target.value)}
            placeholder="Asia/Dubai"
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Account Name"
            name="bankDetails.accountName"
            value={formData.bankDetails.accountName}
            onChange={handleChange}
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
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/users')}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {id ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;