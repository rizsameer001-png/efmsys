// // client/src/pages/buildings/UnitForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import { useToast } from '../../hooks/useToast';

// const UnitForm = () => {
//   const { id, buildingId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(!!id);
//   const [formData, setFormData] = useState({
//     buildingId: buildingId || '',
//     floorNumber: '',
//     unitNumber: '',
//     unitType: 'apartment',
//     details: {
//       area: { value: '', unit: 'sqft' },
//       bedrooms: '',
//       bathrooms: ''
//     },
//     ownership: {
//       ownerName: '',
//       ownerEmail: '',
//       ownerPhone: ''
//     },
//     occupancy: {
//       status: 'vacant'
//     },
//     status: 'active'
//   });

//   const unitTypes = [
//     { value: 'apartment', label: 'Apartment' },
//     { value: 'office', label: 'Office' },
//     { value: 'shop', label: 'Shop' },
//     { value: 'warehouse', label: 'Warehouse' },
//     { value: 'storage', label: 'Storage' }
//   ];

//   const occupancyStatus = [
//     { value: 'vacant', label: 'Vacant' },
//     { value: 'owner_occupied', label: 'Owner Occupied' },
//     { value: 'tenant_occupied', label: 'Tenant Occupied' },
//     { value: 'maintenance', label: 'Under Maintenance' }
//   ];

//   useEffect(() => {
//     if (id) {
//       fetchUnit();
//     }
//   }, [id]);

//   const fetchUnit = async () => {
//     try {
//       const response = await buildingApi.getUnitById(id);
//       const unitData = response.data.data;
//       setFormData(unitData);
//     } catch (error) {
//       showToast('Failed to load unit', 'error');
//       navigate('/buildings');
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (id) {
//         await buildingApi.updateUnit(id, formData);
//         showToast('Unit updated successfully', 'success');
//       } else {
//         await buildingApi.createUnit(formData);
//         showToast('Unit created successfully', 'success');
//       }
//       navigate(`/buildings/${buildingId || formData.buildingId}/units`);
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Operation failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium mb-4">Unit Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Floor Number"
//             name="floorNumber"
//             type="number"
//             value={formData.floorNumber}
//             onChange={handleChange}
//             required
//           />
//           <Input
//             label="Unit Number"
//             name="unitNumber"
//             value={formData.unitNumber}
//             onChange={handleChange}
//             required
//           />
//           <Select
//             label="Unit Type"
//             name="unitType"
//             value={formData.unitType}
//             onChange={handleChange}
//             options={unitTypes}
//           />
//           <Select
//             label="Occupancy Status"
//             name="occupancy.status"
//             value={formData.occupancy?.status}
//             onChange={handleChange}
//             options={occupancyStatus}
//           />
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium mb-4">Unit Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Input
//             label="Area (sqft)"
//             name="details.area.value"
//             type="number"
//             value={formData.details?.area?.value || ''}
//             onChange={handleChange}
//           />
//           <Input
//             label="Bedrooms"
//             name="details.bedrooms"
//             type="number"
//             value={formData.details?.bedrooms || ''}
//             onChange={handleChange}
//           />
//           <Input
//             label="Bathrooms"
//             name="details.bathrooms"
//             type="number"
//             value={formData.details?.bathrooms || ''}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium mb-4">Owner Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Input
//             label="Owner Name"
//             name="ownership.ownerName"
//             value={formData.ownership?.ownerName || ''}
//             onChange={handleChange}
//           />
//           <Input
//             label="Owner Email"
//             name="ownership.ownerEmail"
//             type="email"
//             value={formData.ownership?.ownerEmail || ''}
//             onChange={handleChange}
//           />
//           <Input
//             label="Owner Phone"
//             name="ownership.ownerPhone"
//             value={formData.ownership?.ownerPhone || ''}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <div className="flex justify-end space-x-3">
//         <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
//         <Button type="submit" isLoading={loading}>{id ? 'Update' : 'Create'} Unit</Button>
//       </div>
//     </form>
//   );
// };

// export default UnitForm;

// client/src/pages/buildings/UnitForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';

const UnitForm = () => {
  const { id, buildingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  // 🔴 FIX: Get floor from URL query params
  const queryParams = new URLSearchParams(location.search);
  const floorFromUrl = queryParams.get('floor');
  
  const [formData, setFormData] = useState({
    buildingId: buildingId || '',
    floorNumber: floorFromUrl || '',
    unitNumber: '',
    unitType: 'apartment',
    details: {
      area: { value: '', unit: 'sqft' },
      bedrooms: '',
      bathrooms: ''
    },
    ownership: {
      ownerName: '',
      ownerEmail: '',
      ownerPhone: ''
    },
    occupancy: {
      status: 'vacant'
    },
    status: 'active'
  });

  const unitTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'office', label: 'Office' },
    { value: 'shop', label: 'Shop' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'storage', label: 'Storage' }
  ];

  const occupancyStatus = [
    { value: 'vacant', label: 'Vacant' },
    { value: 'owner_occupied', label: 'Owner Occupied' },
    { value: 'tenant_occupied', label: 'Tenant Occupied' },
    { value: 'maintenance', label: 'Under Maintenance' }
  ];

  useEffect(() => {
    if (id) {
      fetchUnit();
    }
  }, [id]);

  const fetchUnit = async () => {
    try {
      const response = await buildingApi.getUnitById(id);
      const unitData = response.data.data;
      // 🔴 FIX: Ensure area is properly formatted
      const formattedData = {
        ...unitData,
        details: {
          ...unitData.details,
          area: unitData.details?.area || { value: '', unit: 'sqft' }
        }
      };
      setFormData(formattedData);
    } catch (error) {
      console.error('Fetch unit error:', error);
      showToast('Failed to load unit', 'error');
      navigate('/buildings');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 🔴 FIX: Handle nested area.value field separately
    if (name === 'details.area.value') {
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          area: {
            ...prev.details.area,
            value: value
          }
        }
      }));
    } 
    // Handle other nested fields
    else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      // 🔴 FIX: Handle occupancy.status nesting
      if (parent === 'occupancy') {
        setFormData(prev => ({
          ...prev,
          occupancy: {
            ...prev.occupancy,
            [child]: value
          }
        }));
      }
      // Handle ownership fields
      else if (parent === 'ownership') {
        setFormData(prev => ({
          ...prev,
          ownership: {
            ...prev.ownership,
            [child]: value
          }
        }));
      }
      // Handle details fields (except area.value which is handled above)
      else if (parent === 'details' && child !== 'area') {
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            [child]: value
          }
        }));
      }
      else {
        setFormData(prev => ({
          ...prev,
          [parent]: { ...prev[parent], [child]: value }
        }));
      }
    } 
    // Handle top-level fields
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 🔴 FIX: Prepare data for submission
  const prepareSubmitData = () => {
    const submitData = {
      buildingId: formData.buildingId,
      floorNumber: parseInt(formData.floorNumber),
      unitNumber: formData.unitNumber,
      unitType: formData.unitType,
      details: {
        area: {
          value: formData.details?.area?.value ? parseFloat(formData.details.area.value) : null,
          unit: formData.details?.area?.unit || 'sqft'
        },
        bedrooms: formData.details?.bedrooms ? parseInt(formData.details.bedrooms) : null,
        bathrooms: formData.details?.bathrooms ? parseInt(formData.details.bathrooms) : null
      },
      ownership: {
        ownerName: formData.ownership?.ownerName || '',
        ownerEmail: formData.ownership?.ownerEmail || '',
        ownerPhone: formData.ownership?.ownerPhone || ''
      },
      occupancy: {
        status: formData.occupancy?.status || 'vacant'
      },
      status: formData.status || 'active'
    };

    // Remove empty values
    Object.keys(submitData.details).forEach(key => {
      if (submitData.details[key] === null || submitData.details[key] === '') {
        delete submitData.details[key];
      }
    });

    // Remove empty ownership fields
    Object.keys(submitData.ownership).forEach(key => {
      if (submitData.ownership[key] === '') {
        delete submitData.ownership[key];
      }
    });

    // If details is empty, remove it
    if (Object.keys(submitData.details).length === 0) {
      delete submitData.details;
    }

    // If ownership is empty, remove it
    if (Object.keys(submitData.ownership).length === 0) {
      delete submitData.ownership;
    }

    return submitData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = prepareSubmitData();
      console.log('Submitting unit data:', submitData);
      
      if (id) {
        await buildingApi.updateUnit(id, submitData);
        showToast('Unit updated successfully', 'success');
      } else {
        await buildingApi.createUnit(submitData);
        showToast('Unit created successfully', 'success');
      }
      navigate(`/buildings/${buildingId || formData.buildingId}/units`);
    } catch (error) {
      console.error('Submit error:', error);
      const message = error.response?.data?.error || 'Operation failed';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Unit Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Floor Number"
            name="floorNumber"
            type="number"
            value={formData.floorNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Unit Number"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            required
            placeholder="e.g., 101, A-101"
          />
          <Select
            label="Unit Type"
            name="unitType"
            value={formData.unitType}
            onChange={handleChange}
            options={unitTypes}
          />
          <Select
            label="Occupancy Status"
            name="occupancy.status"
            value={formData.occupancy?.status}
            onChange={handleChange}
            options={occupancyStatus}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Unit Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (sqft)
            </label>
            <div className="flex gap-2">
              <Input
                name="details.area.value"
                type="number"
                value={formData.details?.area?.value || ''}
                onChange={handleChange}
                placeholder="e.g., 1200"
                className="flex-1"
              />
              <select
                name="details.area.unit"
                value={formData.details?.area?.unit || 'sqft'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      area: {
                        ...prev.details.area,
                        unit: e.target.value
                      }
                    }
                  }));
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sqft">sqft</option>
                <option value="sqm">sqm</option>
              </select>
            </div>
          </div>
          <Input
            label="Bedrooms"
            name="details.bedrooms"
            type="number"
            value={formData.details?.bedrooms || ''}
            onChange={handleChange}
            placeholder="Number of bedrooms"
          />
          <Input
            label="Bathrooms"
            name="details.bathrooms"
            type="number"
            value={formData.details?.bathrooms || ''}
            onChange={handleChange}
            placeholder="Number of bathrooms"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Owner Information (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Owner Name"
            name="ownership.ownerName"
            value={formData.ownership?.ownerName || ''}
            onChange={handleChange}
            placeholder="Full name"
          />
          <Input
            label="Owner Email"
            name="ownership.ownerEmail"
            type="email"
            value={formData.ownership?.ownerEmail || ''}
            onChange={handleChange}
            placeholder="owner@example.com"
          />
          <Input
            label="Owner Phone"
            name="ownership.ownerPhone"
            value={formData.ownership?.ownerPhone || ''}
            onChange={handleChange}
            placeholder="+971XXXXXXXXX"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="submit" isLoading={loading}>
          {id ? 'Update Unit' : 'Create Unit'}
        </Button>
      </div>
    </form>
  );
};

export default UnitForm;