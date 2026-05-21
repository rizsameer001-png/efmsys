// client/src/pages/tasks/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { buildingApi } from '../../api/building.api';
import { userApi } from '../../api/user.api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [buildings, setBuildings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [suggestedTechnicians, setSuggestedTechnicians] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium',
    location: {
      buildingId: '',
      floorNumber: '',
      unitNumber: '',
      exactLocation: ''
    },
    requiredSkills: [],
    autoAssign: true,
    assignedTo: '',
    checklist: []
  });

  const [errors, setErrors] = useState({});

  // Required fields for validation
  const requiredFields = ['title', 'description', 'category', 'priority'];

  const taskCategories = [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repair', label: 'Repair' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'installation', label: 'Installation' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'preventive_maintenance', label: 'Preventive Maintenance' },
    { value: 'corrective_maintenance', label: 'Corrective Maintenance' }
  ];

  const priorityOptions = [
    { value: 'critical', label: 'Critical - 1 hour SLA' },
    { value: 'high', label: 'High - 4 hours SLA' },
    { value: 'medium', label: 'Medium - 8 hours SLA' },
    { value: 'low', label: 'Low - 24 hours SLA' }
  ];

  useEffect(() => {
    fetchBuildings();
    fetchTechnicians();
    if (id) {
      fetchTask();
    }
  }, [id]);

  // Fetch suggested technicians when task details change (for auto-assign)
  useEffect(() => {
    if (formData.autoAssign && formData.category && formData.priority && technicians.length > 0) {
      fetchSuggestedTechnicians();
    }
  }, [formData.category, formData.priority, formData.location.buildingId, technicians]);

  const fetchBuildings = async () => {
    try {
      const response = await buildingApi.getBuildings();
      if (response.data?.success && response.data?.data?.buildings) {
        setBuildings(response.data.data.buildings);
      } else if (Array.isArray(response.data?.data)) {
        setBuildings(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBuildings(response.data);
      } else {
        setBuildings([]);
      }
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
      setBuildings([]);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await userApi.getUsers({ role: 'technician', status: 'active', limit: 100 });
      console.log('Technicians response:', response.data);
      
      let techniciansList = [];
      if (response.data?.success && response.data?.data?.users) {
        techniciansList = response.data.data.users;
      } else if (response.data?.success && Array.isArray(response.data?.data)) {
        techniciansList = response.data.data;
      } else if (Array.isArray(response.data)) {
        techniciansList = response.data;
      } else if (response.data?.data && Array.isArray(response.data?.data)) {
        techniciansList = response.data.data;
      }
      
      setTechnicians(techniciansList);
      console.log('Technicians loaded:', techniciansList.length);
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
      if (error.response?.status === 403) {
        console.warn('Permission denied: Cannot fetch technicians');
      }
      setTechnicians([]);
    }
  };

  const fetchSuggestedTechnicians = async () => {
    try {
      setIsAutoAssigning(true);
      // Filter available technicians based on skills if needed
      const available = technicians.filter(t => t.status === 'active');
      
      // Sort by workload (if available) or just take first few
      const suggestions = available.slice(0, 3);
      setSuggestedTechnicians(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestedTechnicians([]);
    } finally {
      setIsAutoAssigning(false);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await taskApi.getTaskById(id);
      const taskData = response.data.data?.task || response.data.data || response.data;
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        category: taskData.category || taskData.taskType || 'maintenance',
        priority: taskData.priority || 'medium',
        location: taskData.location || {
          buildingId: '',
          floorNumber: '',
          unitNumber: '',
          exactLocation: ''
        },
        requiredSkills: taskData.requiredSkills || [],
        autoAssign: taskData.autoAssign !== false,
        assignedTo: taskData.assignedTo || taskData.assignment?.assignedTo || '',
        checklist: taskData.checklist || []
      });
    } catch (error) {
      console.error('Failed to load task:', error);
      showToast('Failed to load task', 'error');
      navigate('/tasks');
    } finally {
      setFetching(false);
    }
  };

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
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const assignToTechnician = (technicianId) => {
    setFormData(prev => ({ ...prev, assignedTo: technicianId }));
    setShowSuggestions(false);
    showToast('Technician selected manually', 'success');
  };

  const validate = () => {
    const newErrors = {};
    
    // Check all required fields
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field] === '') {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.location?.buildingId) {
      newErrors['location.buildingId'] = 'Building is required';
    }
    
    // If not auto-assign, technician is required
    if (!formData.autoAssign && (!formData.assignedTo || formData.assignedTo === '')) {
      newErrors.assignedTo = 'Please select a technician to assign';
    }
    
    return newErrors;
  };

  const handleAutoAssign = async () => {
    if (!formData.title || !formData.description) {
      showToast('Please fill in title and description first', 'warning');
      return;
    }
    
    setIsAutoAssigning(true);
    try {
      // First create the task
      const submitData = { ...formData };
      delete submitData.assignedTo;
      
      const response = await taskApi.createTask(submitData);
      if (response.data?.success) {
        const taskId = response.data.data._id;
        // Then auto-assign it
        const assignResponse = await taskApi.autoAssignTask(taskId);
        if (assignResponse.data?.success) {
          const assignedName = assignResponse.data.data.assignment?.assignedToName || 'a technician';
          showToast(`Task created and auto-assigned to ${assignedName}!`, 'success');
          navigate('/tasks');
        } else {
          showToast('Task created but auto-assignment failed', 'warning');
          navigate(`/tasks/${taskId}`);
        }
      } else {
        showToast('Failed to create task', 'error');
      }
    } catch (error) {
      console.error('Auto-assign operation failed:', error);
      showToast(error.response?.data?.error || 'Operation failed', 'error');
    } finally {
      setIsAutoAssigning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix form errors', 'error');
      return;
    }

    setLoading(true);
    try {
      const submitData = { 
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location
      };
      
      // Add assignment only if manual and technician selected
      if (!formData.autoAssign && formData.assignedTo && formData.assignedTo !== '') {
        submitData.assignedTo = formData.assignedTo;
      }
      
      if (id) {
        await taskApi.updateTask(id, submitData);
        showToast('Task updated successfully', 'success');
      } else {
        const response = await taskApi.createTask(submitData);
        // If auto-assign was enabled, show info
        if (formData.autoAssign) {
          showToast('Task created! System will assign it automatically.', 'success');
        } else if (formData.assignedTo) {
          const technician = technicians.find(t => t._id === formData.assignedTo);
          const techName = technician ? `${technician.firstName} ${technician.lastName}` : 'Technician';
          showToast(`Task created and assigned to ${techName}!`, 'success');
        } else {
          showToast('Task created successfully', 'success');
        }
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Task operation failed:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Operation failed';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Task' : 'Create New Task'}
        </h1>
        <p className="text-gray-500 mt-1">Fill in the task details below</p>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Task Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="Enter task title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the task in detail..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={taskCategories}
              error={errors.category}
              required
            />
            <Select
              label="Priority *"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
              error={errors.priority}
              helperText="Determines SLA deadline"
              required
            />
          </div>
        </div>
      </Card>

      {/* Location Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Location</h3>
        <div className="space-y-4">
          <Select
            label="Building *"
            name="location.buildingId"
            value={formData.location.buildingId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Building' },
              ...buildings.map(b => ({ value: b._id, label: `${b.name} (${b.code || b._id?.slice(-6)})` }))
            ]}
            error={errors['location.buildingId']}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Floor Number"
              name="location.floorNumber"
              type="number"
              value={formData.location.floorNumber}
              onChange={handleChange}
              placeholder="e.g., 5"
            />
            <Input
              label="Unit Number"
              name="location.unitNumber"
              value={formData.location.unitNumber}
              onChange={handleChange}
              placeholder="e.g., 502"
            />
          </div>
          <Input
            label="Exact Location"
            name="location.exactLocation"
            value={formData.location.exactLocation}
            onChange={handleChange}
            placeholder="e.g., Room 205, Near elevator, Main entrance"
          />
        </div>
      </Card>

      {/* Assignment Options - Both Auto and Manual */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Assignment Options</h3>
        
        {/* Auto Assign Toggle */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="autoAssign"
              checked={formData.autoAssign}
              onChange={(e) => setFormData(prev => ({ ...prev, autoAssign: e.target.checked, assignedTo: '' }))}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
            />
            <div>
              <span className="font-medium text-gray-900">Auto-assign to best matching technician</span>
              <p className="text-sm text-gray-600">
                System will automatically assign the task based on skills, availability, and location
              </p>
              {formData.autoAssign && (
                <button
                  type="button"
                  onClick={handleAutoAssign}
                  disabled={isAutoAssigning}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {isAutoAssigning ? 'Processing...' : 'Preview auto-assignment'}
                </button>
              )}
            </div>
          </label>
        </div>

        {/* Manual Selection - Always visible but conditionally required */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Manual Technician Selection {!formData.autoAssign && <span className="text-red-500">*</span>}
            </label>
            {formData.autoAssign && (
              <span className="text-xs text-gray-500">Optional - Override auto-assignment</span>
            )}
          </div>
          
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.assignedTo ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">
              {formData.autoAssign ? '-- Auto-assign will be used --' : '-- Select a technician --'}
            </option>
            {technicians.map(t => (
              <option key={t._id} value={t._id}>
                {t.firstName} {t.lastName} - {t.email} {t.specialization ? `(${t.specialization})` : ''}
              </option>
            ))}
          </select>
          
          {errors.assignedTo && (
            <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            {formData.autoAssign 
              ? "Leave empty for auto-assignment, or select a specific technician to override"
              : "Required: Select a technician to assign this task"}
          </p>

          {/* Suggested Technicians (for auto-assign preview) */}
          {formData.autoAssign && suggestedTechnicians.length > 0 && showSuggestions && !isAutoAssigning && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">🤖 System Suggestion (Top matches):</p>
              <div className="space-y-2">
                {suggestedTechnicians.map(tech => (
                  <div key={tech._id} className="flex justify-between items-center p-2 bg-white rounded">
                    <div>
                      <p className="text-sm font-medium">{tech.firstName} {tech.lastName}</p>
                      <p className="text-xs text-gray-600">{tech.specialization || 'Technician'} • {tech.email}</p>
                    </div>
                    <Button 
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => assignToTechnician(tech._id)}
                    >
                      Select Manually
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">
                  💡 System will auto-assign to the best matching technician. Click "Select Manually" to override.
                </p>
              </div>
            </div>
          )}
          
          {isAutoAssigning && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
              <Spinner size="sm" />
              <p className="text-sm text-gray-600 mt-1">Finding best matching technician...</p>
            </div>
          )}
        </div>
      </Card>

      {/* Checklist Section (Optional) */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Checklist (Optional)</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Add items that need to be completed for this task
          </p>
          <button
            type="button"
            onClick={() => setFormData(prev => ({
              ...prev,
              checklist: [...prev.checklist, { itemName: '', completed: false }]
            }))}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Checklist Item
          </button>
          {formData.checklist.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={item.itemName}
                onChange={(e) => {
                  const newChecklist = [...formData.checklist];
                  newChecklist[index].itemName = e.target.value;
                  setFormData(prev => ({ ...prev, checklist: newChecklist }));
                }}
                placeholder="e.g., Check power supply"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const newChecklist = formData.checklist.filter((_, i) => i !== index);
                  setFormData(prev => ({ ...prev, checklist: newChecklist }));
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={() => navigate('/tasks')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading} disabled={loading}>
          {id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;