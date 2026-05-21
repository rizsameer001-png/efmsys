// client/src/pages/leave/LeaveRequestForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveApi } from '../../api/leave.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    fromDate: '',
    toDate: '',
    reason: '',
    attachment: null,
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });
  const [errors, setErrors] = useState({});

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', description: 'Paid annual vacation leave' },
    { value: 'sick', label: 'Sick Leave', description: 'Medical leave with doctor note requirement' },
    { value: 'emergency', label: 'Emergency Leave', description: 'Urgent personal/family emergency' },
    { value: 'unpaid', label: 'Unpaid Leave', description: 'Leave without pay' },
    { value: 'maternity', label: 'Maternity Leave', description: 'Maternity leave for new mothers' },
    { value: 'paternity', label: 'Paternity Leave', description: 'Paternity leave for new fathers' }
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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.fromDate) newErrors.fromDate = 'Start date is required';
    if (!formData.toDate) newErrors.toDate = 'End date is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      if (from > to) {
        newErrors.toDate = 'End date must be after start date';
      }
      if (from < new Date()) {
        newErrors.fromDate = 'Start date cannot be in the past';
      }
    }
    
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
    
    setSubmitting(true);
    try {
      const response = await leaveApi.applyLeave(formData);
      if (response.data.success) {
        showToast('Leave request submitted successfully!', 'success');
        navigate('/leave/my');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to submit leave request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const getLeaveTypeIcon = (type) => {
    const icons = {
      annual: '🏖️',
      sick: '🤒',
      emergency: '🚨',
      unpaid: '💰',
      maternity: '👶',
      paternity: '👶'
    };
    return icons[type] || '📋';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
        <p className="text-gray-500 mt-1">Submit a new leave request</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Select Leave Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {leaveTypes.map(type => (
              <label
                key={type.value}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.leaveType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="leaveType"
                  value={type.value}
                  checked={formData.leaveType === type.value}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getLeaveTypeIcon(type.value)}</span>
                    <p className="font-medium text-gray-900">{type.label}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.leaveType && <p className="text-red-500 text-sm mt-2">{errors.leaveType}</p>}
        </Card>

        {/* Date Range */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Leave Duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="From Date"
                name="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={handleChange}
                error={errors.fromDate}
                required
              />
            </div>
            <div>
              <Input
                label="To Date"
                name="toDate"
                type="date"
                value={formData.toDate}
                onChange={handleChange}
                error={errors.toDate}
                required
              />
            </div>
          </div>
          {formData.fromDate && formData.toDate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                📅 Total days: <span className="font-bold">{calculateDays()}</span> day{calculateDays() !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </Card>

        {/* Reason */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Reason for Leave</h3>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please provide detailed reason for your leave request..."
            required
          />
          {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
        </Card>

        {/* Emergency Contact */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Emergency Contact (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Contact Name"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              placeholder="Full name"
            />
            <Input
              label="Phone Number"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
            <Input
              label="Relation"
              name="emergencyContact.relation"
              value={formData.emergencyContact.relation}
              onChange={handleChange}
              placeholder="e.g., Spouse, Parent"
            />
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/leave/my')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={submitting}>
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;