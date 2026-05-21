// client/src/pages/buildings/BuildingForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

const BuildingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'residential',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'UAE',
      zipCode: '',
      coordinates: { lat: '', lng: '' }
    },
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    emergencyContacts: [
      { name: '', role: '', phone: '', email: '', isPrimary: true }
    ],
    statistics: {
      totalFloors: 0,
      totalUnits: 0,
      occupiedUnits: 0,
      vacantUnits: 0
    },
    amenities: [],
    parking: {
      totalSlots: 0,
      occupiedSlots: 0,
      visitorSlots: 0,
      evChargingSlots: 0
    },
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  // Building type options
  const buildingTypes = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office' },
    { value: 'mall', label: 'Mall' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'mixed_use', label: 'Mixed Use' }
  ];

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'under_construction', label: 'Under Construction' }
  ];

  // Country options
  const countryOptions = [
    { value: 'UAE', label: 'United Arab Emirates' },
    { value: 'USA', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'India', label: 'India' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' }
  ];

  useEffect(() => {
    if (id) {
      fetchBuilding();
    }
  }, [id]);

  const fetchBuilding = async () => {
    try {
      const response = await buildingApi.getBuildingById(id);
      const buildingData = response.data.data.building;
      setFormData({
        name: buildingData.name || '',
        code: buildingData.code || '',
        type: buildingData.type || 'residential',
        address: buildingData.address || {
          street: '',
          city: '',
          state: '',
          country: 'UAE',
          zipCode: '',
          coordinates: { lat: '', lng: '' }
        },
        contactInfo: buildingData.contactInfo || {
          phone: '',
          email: '',
          website: ''
        },
        emergencyContacts: buildingData.emergencyContacts || [
          { name: '', role: '', phone: '', email: '', isPrimary: true }
        ],
        statistics: buildingData.statistics || {
          totalFloors: 0,
          totalUnits: 0,
          occupiedUnits: 0,
          vacantUnits: 0
        },
        amenities: buildingData.amenities || [],
        parking: buildingData.parking || {
          totalSlots: 0,
          occupiedSlots: 0,
          visitorSlots: 0,
          evChargingSlots: 0
        },
        status: buildingData.status || 'active'
      });
    } catch (error) {
      showToast('Failed to load building data', 'error');
      navigate('/buildings');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (e.g., address.street)
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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormData(prev => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: '', role: '', phone: '', email: '', isPrimary: false }
      ]
    }));
  };

  const removeEmergencyContact = (index) => {
    if (formData.emergencyContacts.length > 1) {
      const updatedContacts = formData.emergencyContacts.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, emergencyContacts: updatedContacts }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Building name is required';
    if (!formData.code) newErrors.code = 'Building code is required';
    if (!formData.type) newErrors.type = 'Building type is required';
    if (!formData.address?.street) newErrors['address.street'] = 'Street address is required';
    if (!formData.address?.city) newErrors['address.city'] = 'City is required';
    if (!formData.address?.country) newErrors['address.country'] = 'Country is required';
    
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
        await buildingApi.updateBuilding(id, formData);
        showToast('Building updated successfully', 'success');
      } else {
        await buildingApi.createBuilding(formData);
        showToast('Building created successfully', 'success');
      }
      navigate('/buildings');
    } catch (error) {
      const message = error.response?.data?.error || 'Operation failed';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Building Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="e.g., Downtown Tower"
          />
          <Input
            label="Building Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
            required
            placeholder="e.g., DTT001"
            helperText="Unique identifier for the building"
          />
          <Select
            label="Building Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={buildingTypes}
            error={errors.type}
            required
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

      {/* Address Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Street Address"
            name="address.street"
            value={formData.address?.street || ''}
            onChange={handleChange}
            error={errors['address.street']}
            required
          />
          <Input
            label="City"
            name="address.city"
            value={formData.address?.city || ''}
            onChange={handleChange}
            error={errors['address.city']}
            required
          />
          <Input
            label="State/Province"
            name="address.state"
            value={formData.address?.state || ''}
            onChange={handleChange}
          />
          <Select
            label="Country"
            name="address.country"
            value={formData.address?.country || 'UAE'}
            onChange={handleChange}
            options={countryOptions}
            error={errors['address.country']}
            required
          />
          <Input
            label="ZIP/Postal Code"
            name="address.zipCode"
            value={formData.address?.zipCode || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            name="contactInfo.phone"
            value={formData.contactInfo?.phone || ''}
            onChange={handleChange}
            placeholder="+971XXXXXXXXX"
          />
          <Input
            label="Email"
            name="contactInfo.email"
            type="email"
            value={formData.contactInfo?.email || ''}
            onChange={handleChange}
          />
          <Input
            label="Website"
            name="contactInfo.website"
            value={formData.contactInfo?.website || ''}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>
          <Button type="button" variant="secondary" size="sm" onClick={addEmergencyContact}>
            + Add Contact
          </Button>
        </div>
        
        {formData.emergencyContacts.map((contact, index) => (
          <div key={index} className="border-t pt-4 mt-4 first:border-t-0 first:pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={contact.name}
                onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                placeholder="Contact name"
              />
              <Input
                label="Role"
                value={contact.role}
                onChange={(e) => handleEmergencyContactChange(index, 'role', e.target.value)}
                placeholder="e.g., Security Manager"
              />
              <Input
                label="Phone"
                value={contact.phone}
                onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                placeholder="Phone number"
              />
              <Input
                label="Email"
                type="email"
                value={contact.email}
                onChange={(e) => handleEmergencyContactChange(index, 'email', e.target.value)}
                placeholder="Email address"
              />
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={contact.isPrimary}
                    onChange={(e) => handleEmergencyContactChange(index, 'isPrimary', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Primary Contact</span>
                </label>
                {formData.emergencyContacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmergencyContact(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Building Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Building Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Total Floors"
            name="statistics.totalFloors"
            type="number"
            value={formData.statistics?.totalFloors || 0}
            onChange={handleChange}
          />
          <Input
            label="Total Units"
            name="statistics.totalUnits"
            type="number"
            value={formData.statistics?.totalUnits || 0}
            onChange={handleChange}
          />
          <Input
            label="Occupied Units"
            name="statistics.occupiedUnits"
            type="number"
            value={formData.statistics?.occupiedUnits || 0}
            onChange={handleChange}
          />
          <Input
            label="Vacant Units"
            name="statistics.vacantUnits"
            type="number"
            value={formData.statistics?.vacantUnits || 0}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Parking Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Parking Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Total Slots"
            name="parking.totalSlots"
            type="number"
            value={formData.parking?.totalSlots || 0}
            onChange={handleChange}
          />
          <Input
            label="Occupied Slots"
            name="parking.occupiedSlots"
            type="number"
            value={formData.parking?.occupiedSlots || 0}
            onChange={handleChange}
          />
          <Input
            label="Visitor Slots"
            name="parking.visitorSlots"
            type="number"
            value={formData.parking?.visitorSlots || 0}
            onChange={handleChange}
          />
          <Input
            label="EV Charging Slots"
            name="parking.evChargingSlots"
            type="number"
            value={formData.parking?.evChargingSlots || 0}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/buildings')}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {id ? 'Update Building' : 'Create Building'}
        </Button>
      </div>
    </form>
  );
};

export default BuildingForm;