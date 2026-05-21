// client/src/pages/tasks/TaskForm.jsx -auto support both auto-assign (system selects best technician)
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import Card from '../../components/common/Card';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';

// const TaskForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(!!id);
//   const [buildings, setBuildings] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     taskType: 'complaint',
//     priority: 'medium',
//     location: {
//       buildingId: '',
//       floorNumber: '',
//       unitNumber: '',
//       exactLocation: ''
//     },
//     requiredSkills: [],
//     autoAssign: true,
//     checklist: []
//   });

//   const [errors, setErrors] = useState({});

//   const taskTypes = [
//     { value: 'complaint', label: 'Complaint' },
//     { value: 'preventive_maintenance', label: 'Preventive Maintenance' },
//     { value: 'corrective_maintenance', label: 'Corrective Maintenance' },
//     { value: 'inspection', label: 'Inspection' },
//     { value: 'installation', label: 'Installation' },
//     { value: 'emergency', label: 'Emergency' }
//   ];

//   const priorityOptions = [
//     { value: 'critical', label: 'Critical - 1 hour' },
//     { value: 'high', label: 'High - 4 hours' },
//     { value: 'medium', label: 'Medium - 8 hours' },
//     { value: 'low', label: 'Low - 24 hours' }
//   ];

//   useEffect(() => {
//     fetchBuildings();
//     if (id) {
//       fetchTask();
//     }
//   }, [id]);

//   const fetchBuildings = async () => {
//     try {
//       const response = await buildingApi.getBuildings();
//       setBuildings(response.data.data.buildings);
//     } catch (error) {
//       console.error('Failed to fetch buildings:', error);
//     }
//   };

//   const fetchTask = async () => {
//     try {
//       const response = await taskApi.getTaskById(id);
//       const taskData = response.data.data.task;
//       setFormData({
//         title: taskData.title || '',
//         description: taskData.description || '',
//         taskType: taskData.taskType || 'complaint',
//         priority: taskData.priority || 'medium',
//         location: taskData.location || {
//           buildingId: '',
//           floorNumber: '',
//           unitNumber: '',
//           exactLocation: ''
//         },
//         requiredSkills: taskData.requiredSkills || [],
//         autoAssign: taskData.autoAssign !== false,
//         checklist: taskData.checklist || []
//       });
//     } catch (error) {
//       showToast('Failed to load task', 'error');
//       navigate('/tasks');
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
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.title) newErrors.title = 'Title is required';
//     if (!formData.description) newErrors.description = 'Description is required';
//     if (!formData.location.buildingId) newErrors['location.buildingId'] = 'Building is required';
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       showToast('Please fix form errors', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       if (id) {
//         await taskApi.updateTask(id, formData);
//         showToast('Task updated successfully', 'success');
//       } else {
//         await taskApi.createTask(formData);
//         showToast('Task created successfully', 'success');
//       }
//       navigate('/tasks');
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Operation failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) return <Spinner />;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">
//           {id ? 'Edit Task' : 'Create New Task'}
//         </h1>
//         <p className="text-gray-500 mt-1">Fill in the task details below</p>
//       </div>

//       {/* Basic Information */}
//       <Card className="p-6">
//         <h3 className="text-lg font-medium mb-4">Basic Information</h3>
//         <div className="space-y-4">
//           <Input
//             label="Task Title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             error={errors.title}
//             required
//           />
//           <Input
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             error={errors.description}
//             textarea
//             rows={4}
//             required
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Select
//               label="Task Type"
//               name="taskType"
//               value={formData.taskType}
//               onChange={handleChange}
//               options={taskTypes}
//             />
//             <Select
//               label="Priority"
//               name="priority"
//               value={formData.priority}
//               onChange={handleChange}
//               options={priorityOptions}
//               helperText="Determines SLA deadline"
//             />
//           </div>
//         </div>
//       </Card>

//       {/* Location Information */}
//       <Card className="p-6">
//         <h3 className="text-lg font-medium mb-4">Location</h3>
//         <div className="space-y-4">
//           <Select
//             label="Building"
//             name="location.buildingId"
//             value={formData.location.buildingId}
//             onChange={handleChange}
//             options={[
//               { value: '', label: 'Select Building' },
//               ...buildings.map(b => ({ value: b._id, label: `${b.name} (${b.code})` }))
//             ]}
//             error={errors['location.buildingId']}
//             required
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Floor Number"
//               name="location.floorNumber"
//               type="number"
//               value={formData.location.floorNumber}
//               onChange={handleChange}
//             />
//             <Input
//               label="Unit Number"
//               name="location.unitNumber"
//               value={formData.location.unitNumber}
//               onChange={handleChange}
//             />
//           </div>
//           <Input
//             label="Exact Location"
//             name="location.exactLocation"
//             value={formData.location.exactLocation}
//             onChange={handleChange}
//             placeholder="e.g., Room 205, Near elevator"
//           />
//         </div>
//       </Card>

//       {/* Assignment Options */}
//       <Card className="p-6">
//         <h3 className="text-lg font-medium mb-4">Assignment</h3>
//         <label className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             name="autoAssign"
//             checked={formData.autoAssign}
//             onChange={(e) => setFormData(prev => ({ ...prev, autoAssign: e.target.checked }))}
//             className="h-4 w-4 rounded border-gray-300 text-blue-600"
//           />
//           <span>Auto-assign to best matching technician</span>
//         </label>
//         <p className="text-sm text-gray-500 mt-2">
//           If disabled, you will need to manually assign this task
//         </p>
//       </Card>

//       {/* Form Actions */}
//       <div className="flex justify-end space-x-3">
//         <Button variant="secondary" onClick={() => navigate('/tasks')}>
//           Cancel
//         </Button>
//         <Button type="submit" isLoading={loading}>
//           {id ? 'Update Task' : 'Create Task'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default TaskForm;



// client/src/pages/tasks/TaskForm.jsx
//Updated TaskForm.jsx with both Auto and Manual assignment:
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: 'complaint',
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

  const taskTypes = [
    { value: 'complaint', label: 'Complaint' },
    { value: 'preventive_maintenance', label: 'Preventive Maintenance' },
    { value: 'corrective_maintenance', label: 'Corrective Maintenance' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'installation', label: 'Installation' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const priorityOptions = [
    { value: 'critical', label: 'Critical - 1 hour' },
    { value: 'high', label: 'High - 4 hours' },
    { value: 'medium', label: 'Medium - 8 hours' },
    { value: 'low', label: 'Low - 24 hours' }
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
    if (formData.autoAssign && formData.taskType && formData.priority) {
      fetchSuggestedTechnicians();
    }
  }, [formData.taskType, formData.priority, formData.location.buildingId]);

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
      // This would call an API to get suggested technicians based on task requirements
      // For now, filter available technicians
      const available = technicians.filter(t => t.status === 'active');
      const suggestions = available.slice(0, 3);
      setSuggestedTechnicians(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestedTechnicians([]);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await taskApi.getTaskById(id);
      const taskData = response.data.data?.task || response.data.data || response.data;
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        taskType: taskData.taskType || 'complaint',
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
    showToast('Technician selected', 'success');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location.buildingId) newErrors['location.buildingId'] = 'Building is required';
    
    // If not auto-assign, technician is required
    if (!formData.autoAssign && !formData.assignedTo) {
      newErrors.assignedTo = 'Please select a technician to assign';
    }
    
    return newErrors;
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
      const submitData = { ...formData };
      
      // If auto-assign is true, system will assign automatically
      // If manual, send the selected technician
      if (!submitData.autoAssign && !submitData.assignedTo) {
        delete submitData.assignedTo;
      }
      
      if (id) {
        await taskApi.updateTask(id, submitData);
        showToast('Task updated successfully', 'success');
      } else {
        const response = await taskApi.createTask(submitData);
        // If auto-assign was enabled, show who was assigned
        if (formData.autoAssign && response.data?.data?.assignedTo) {
          const assignedName = response.data.data.assignedToName || 'a technician';
          showToast(`Task created and auto-assigned to ${assignedName}!`, 'success');
        } else {
          showToast('Task created successfully', 'success');
        }
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Task operation failed:', error);
      showToast(error.response?.data?.error || 'Operation failed', 'error');
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
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Task Type"
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              options={taskTypes}
            />
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
              helperText="Determines SLA deadline"
            />
          </div>
        </div>
      </Card>

      {/* Location Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Location</h3>
        <div className="space-y-4">
          <Select
            label="Building"
            name="location.buildingId"
            value={formData.location.buildingId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Building' },
              ...buildings.map(b => ({ value: b._id, label: `${b.name} (${b.code})` }))
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
            />
            <Input
              label="Unit Number"
              name="location.unitNumber"
              value={formData.location.unitNumber}
              onChange={handleChange}
            />
          </div>
          <Input
            label="Exact Location"
            name="location.exactLocation"
            value={formData.location.exactLocation}
            onChange={handleChange}
            placeholder="e.g., Room 205, Near elevator"
          />
        </div>
      </Card>

      {/* Assignment Options - Both Auto and Manual */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Assignment Options</h3>
        
        {/* Auto Assign Toggle */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="autoAssign"
              checked={formData.autoAssign}
              onChange={(e) => setFormData(prev => ({ ...prev, autoAssign: e.target.checked, assignedTo: '' }))}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Auto-assign to best matching technician</span>
              <p className="text-sm text-gray-600">System will automatically assign the task based on skills, availability, and location</p>
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
          
          <Select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            options={[
              { value: '', label: formData.autoAssign ? '-- Auto-assign will be used --' : '-- Select a technician --' },
              ...technicians.map(t => ({ 
                value: t._id, 
                label: `${t.firstName} ${t.lastName} (${t.specialization || 'Technician'})` 
              }))
            ]}
            error={errors.assignedTo}
          />
          
          <p className="text-xs text-gray-500 mt-1">
            {formData.autoAssign 
              ? "Leave empty for auto-assignment, or select a specific technician to override"
              : "Required: Select a technician to assign this task"}
          </p>

          {/* Suggested Technicians (for auto-assign preview) */}
          {formData.autoAssign && suggestedTechnicians.length > 0 && showSuggestions && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">🤖 System Suggestion (Auto-assign preview):</p>
              <div className="space-y-2">
                {suggestedTechnicians.map(tech => (
                  <div key={tech._id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{tech.firstName} {tech.lastName}</p>
                      <p className="text-xs text-gray-600">{tech.specialization || 'Technician'}</p>
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
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={() => navigate('/tasks')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;