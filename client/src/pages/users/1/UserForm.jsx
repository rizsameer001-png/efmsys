// client/src/pages/users/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi, roleApi } from '../../api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';  // ✅ Changed from '../../context/ToastContext'
import { useAuth } from '../../hooks/useAuth';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();  // ✅ Now this works
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
    },
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'active',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
    },
  });

  const [errors, setErrors] = useState({});

  // Role options
  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR' },
    { value: 'manager', label: 'Manager' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'technician', label: 'Technician' },
    { value: 'accountant', label: 'Accountant' },
  ];

  // Department options
  const departmentOptions = [
    { value: 'operations', label: 'Operations' },
    { value: 'technical', label: 'Technical' },
    { value: 'housekeeping', label: 'Housekeeping' },
    { value: 'security', label: 'Security' },
    { value: 'management', label: 'Management' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
  ];

  // Employee type options
  const employeeTypeOptions = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
  ];

  // Status options
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
      setRoles(response.data.data);
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
        reportingManager: userData.reportingManager?._id || '',
        supervisor: userData.supervisor?._id || '',
        assignedBuildings: userData.assignedBuildings?.map(b => b._id) || [],
        shiftTiming: userData.shiftTiming || { start: '09:00', end: '18:00' },
        joiningDate: userData.joiningDate ? new Date(userData.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: userData.status || 'active',
        bankDetails: userData.bankDetails || {
          accountName: '',
          accountNumber: '',
          bankName: '',
          ifscCode: '',
        },
      });
    } catch (error) {
      showToast('Failed to load user data', 'error');
      navigate('/users');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleShiftChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      shiftTiming: {
        ...prev.shiftTiming,
        [field]: value,
      },
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
    } else if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.department) newErrors.department = 'Department is required';
    
    return newErrors;
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
      if (id) {
        await userApi.updateUser(id, formData);
        showToast('User updated successfully', 'success');
      } else {
        await userApi.createUser(formData);
        showToast('User created successfully', 'success');
      }
      navigate('/users');
    } catch (error) {
      const message = error.response?.data?.error || 'Operation failed';
      showToast(message, 'error');
      
      // Handle field-specific errors
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

      {/* Shift Timing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shift Timing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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