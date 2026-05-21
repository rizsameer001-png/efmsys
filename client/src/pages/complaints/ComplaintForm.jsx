// client/src/pages/complaints/ComplaintForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintApi } from '../../api/complaint.api';
import { buildingApi } from '../../api/building.api';
import { COMPLAINT_CATEGORIES, PRIORITY_OPTIONS } from '../../constants/complaintCategories';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electrical',
    priority: 'medium',
    location: {
      buildingId: '',
      floorNumber: '',
      unitNumber: '',
      exactLocation: ''
    }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await buildingApi.getBuildings();
      setBuildings(response.data.data.buildings || []);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    }
  };

  const fetchUnits = async (buildingId) => {
    try {
      const response = await buildingApi.getUnitsByBuilding(buildingId);
      setUnits(response.data.data.units || []);
    } catch (error) {
      console.error('Failed to fetch units:', error);
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
  };

  const handleBuildingChange = (buildingId) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, buildingId, unitNumber: '', floorNumber: '' }
    }));
    if (buildingId) {
      fetchUnits(buildingId);
    } else {
      setUnits([]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.buildingId) newErrors['location.buildingId'] = 'Building is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await complaintApi.createComplaint(formData);
      showToast(`Complaint raised! Ticket #${response.data.data.ticketNumber}`, 'success');
      navigate('/complaints');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to raise complaint', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Raise a Complaint</h1>
        <p className="text-gray-500 mt-1">Submit your issue and we'll get back to you promptly</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Complaint Details */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Complaint Details</h3>
          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Brief summary of the issue"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {COMPLAINT_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      formData.category === cat.value
                        ? cat.color + ' ring-2 ring-blue-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-xl">{cat.icon}</div>
                    <span className="text-xs">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={PRIORITY_OPTIONS}
                helperText="Higher priority gets faster response"
              />
            </div>

            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              textarea
              rows={5}
              placeholder="Please provide detailed description of the issue"
              required
            />
          </div>
        </Card>

        {/* Location Details */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Building *"
              name="location.buildingId"
              value={formData.location.buildingId}
              onChange={(e) => handleBuildingChange(e.target.value)}
              options={[
                { value: '', label: 'Select Building' },
                ...buildings.map(b => ({ value: b._id, label: `${b.name} (${b.code})` }))
              ]}
              error={errors['location.buildingId']}
              required
            />
            
            <Input
              label="Floor Number"
              name="location.floorNumber"
              type="number"
              value={formData.location.floorNumber}
              onChange={handleChange}
            />
            
            <Select
              label="Unit Number"
              name="location.unitNumber"
              value={formData.location.unitNumber}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Unit' },
                ...units.map(u => ({ value: u.unitNumber, label: u.unitNumber }))
              ]}
            />
            
            <Input
              label="Exact Location"
              name="location.exactLocation"
              value={formData.location.exactLocation}
              onChange={handleChange}
              placeholder="e.g., Kitchen, Main bedroom"
            />
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" isLoading={loading}>Submit Complaint</Button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;