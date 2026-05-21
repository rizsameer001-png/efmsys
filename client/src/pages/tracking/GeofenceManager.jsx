// // client/src/pages/tracking/GeofenceManager.jsx
// import React, { useState, useEffect } from 'react';
// import { trackingApi } from '../../api/tracking.api';
// import { buildingApi } from '../../api/building.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Modal from '../../components/common/Modal';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const GeofenceManager = () => {
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [geofences, setGeofences] = useState([]);
//   const [buildings, setBuildings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedGeofence, setSelectedGeofence] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     buildingId: '',
//     type: 'building',
//     circle: {
//       center: { lat: '', lng: '' },
//       radius: 100
//     },
//     alerts: {
//       onEntry: true,
//       onExit: true,
//       entryMessage: 'Welcome to the area',
//       exitMessage: 'You have left the area'
//     },
//     isActive: true
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [geofenceRes, buildingRes] = await Promise.all([
//         trackingApi.getGeofences(),
//         buildingApi.getBuildings()
//       ]);
//       setGeofences(geofenceRes.data.data);
//       setBuildings(buildingRes.data.data.buildings);
//     } catch (error) {
//       showToast('Failed to load data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.name || !formData.buildingId) {
//       showToast('Name and Building are required', 'error');
//       return;
//     }

//     try {
//       if (selectedGeofence) {
//         await trackingApi.updateGeofence(selectedGeofence._id, formData);
//         showToast('Geofence updated', 'success');
//       } else {
//         await trackingApi.createGeofence(formData);
//         showToast('Geofence created', 'success');
//       }
//       setShowModal(false);
//       setSelectedGeofence(null);
//       resetForm();
//       fetchData();
//     } catch (error) {
//       showToast('Operation failed', 'error');
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (window.confirm(`Delete geofence "${name}"?`)) {
//       try {
//         await trackingApi.deleteGeofence(id);
//         showToast('Geofence deleted', 'success');
//         fetchData();
//       } catch (error) {
//         showToast('Failed to delete', 'error');
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       buildingId: '',
//       type: 'building',
//       circle: { center: { lat: '', lng: '' }, radius: 100 },
//       alerts: { onEntry: true, onExit: true, entryMessage: 'Welcome', exitMessage: 'Left area' },
//       isActive: true
//     });
//   };

//   const editGeofence = (geofence) => {
//     setSelectedGeofence(geofence);
//     setFormData({
//       name: geofence.name,
//       buildingId: geofence.buildingId?._id || geofence.buildingId,
//       type: geofence.type,
//       circle: geofence.circle || { center: { lat: '', lng: '' }, radius: 100 },
//       alerts: geofence.alerts,
//       isActive: geofence.isActive
//     });
//     setShowModal(true);
//   };

//   const getTypeBadge = (type) => {
//     const badges = {
//       building: 'bg-blue-100 text-blue-800',
//       restricted: 'bg-red-100 text-red-800',
//       safe_zone: 'bg-green-100 text-green-800',
//       parking: 'bg-purple-100 text-purple-800'
//     };
//     return badges[type] || badges.building;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Geofence Manager</h1>
//           <p className="text-gray-500 mt-1">Define geographic boundaries for buildings</p>
//         </div>
//         {hasPermission('building.create') && (
//           <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Create Geofence</Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {geofences.map(geofence => (
//           <Card key={geofence._id} className="overflow-hidden">
//             <div className="p-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-semibold text-lg">{geofence.name}</h3>
//                   <p className="text-sm text-gray-500">{geofence.buildingId?.name || 'N/A'}</p>
//                 </div>
//                 <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadge(geofence.type)}`}>
//                   {geofence.type}
//                 </span>
//               </div>
              
//               <div className="mt-3 space-y-1 text-sm">
//                 {geofence.circle?.radius && (
//                   <p>📏 Radius: {geofence.circle.radius} meters</p>
//                 )}
//                 {geofence.alerts?.onEntry && <p>🔔 Entry Alert: Enabled</p>}
//                 {geofence.alerts?.onExit && <p>🔔 Exit Alert: Enabled</p>}
//                 <p className={`text-xs ${geofence.isActive ? 'text-green-600' : 'text-red-600'}`}>
//                   {geofence.isActive ? 'Active' : 'Inactive'}
//                 </p>
//               </div>
              
//               <div className="mt-4 flex space-x-2">
//                 <Button size="sm" variant="secondary" onClick={() => editGeofence(geofence)}>
//                   Edit
//                 </Button>
//                 {hasPermission('building.delete') && (
//                   <Button size="sm" variant="danger" onClick={() => handleDelete(geofence._id, geofence.name)}>
//                     Delete
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {geofences.length === 0 && (
//         <Card className="p-8 text-center">
//           <p className="text-gray-500">No geofences created yet</p>
//         </Card>
//       )}

//       {/* Create/Edit Modal */}
//       <Modal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         title={selectedGeofence ? 'Edit Geofence' : 'Create Geofence'}
//         size="lg"
//       >
//         <div className="space-y-4">
//           <Input
//             label="Geofence Name"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             required
//           />
          
//           <Select
//             label="Building"
//             value={formData.buildingId}
//             onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
//             options={[
//               { value: '', label: 'Select Building' },
//               ...buildings.map(b => ({ value: b._id, label: `${b.name} (${b.code})` }))
//             ]}
//             required
//           />
          
//           <Select
//             label="Geofence Type"
//             value={formData.type}
//             onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//             options={[
//               { value: 'building', label: 'Building' },
//               { value: 'restricted', label: 'Restricted Area' },
//               { value: 'safe_zone', label: 'Safe Zone' },
//               { value: 'parking', label: 'Parking' }
//             ]}
//           />
          
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="Center Latitude"
//               type="number"
//               step="any"
//               value={formData.circle.center.lat}
//               onChange={(e) => setFormData({
//                 ...formData,
//                 circle: { ...formData.circle, center: { ...formData.circle.center, lat: parseFloat(e.target.value) } }
//               })}
//             />
//             <Input
//               label="Center Longitude"
//               type="number"
//               step="any"
//               value={formData.circle.center.lng}
//               onChange={(e) => setFormData({
//                 ...formData,
//                 circle: { ...formData.circle, center: { ...formData.circle.center, lng: parseFloat(e.target.value) } }
//               })}
//             />
//           </div>
          
//           <Input
//             label="Radius (meters)"
//             type="number"
//             value={formData.circle.radius}
//             onChange={(e) => setFormData({
//               ...formData,
//               circle: { ...formData.circle, radius: parseInt(e.target.value) }
//             })}
//           />
          
//           <div className="space-y-2">
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={formData.alerts.onEntry}
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   alerts: { ...formData.alerts, onEntry: e.target.checked }
//                 })}
//                 className="rounded"
//               />
//               <span>Enable Entry Alert</span>
//             </label>
            
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={formData.alerts.onExit}
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   alerts: { ...formData.alerts, onExit: e.target.checked }
//                 })}
//                 className="rounded"
//               />
//               <span>Enable Exit Alert</span>
//             </label>
//           </div>
          
//           <Input
//             label="Entry Message"
//             value={formData.alerts.entryMessage}
//             onChange={(e) => setFormData({
//               ...formData,
//               alerts: { ...formData.alerts, entryMessage: e.target.value }
//             })}
//           />
          
//           <Input
//             label="Exit Message"
//             value={formData.alerts.exitMessage}
//             onChange={(e) => setFormData({
//               ...formData,
//               alerts: { ...formData.alerts, exitMessage: e.target.value }
//             })}
//           />
          
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//               className="rounded"
//             />
//             <span>Active</span>
//           </label>
          
//           <div className="flex justify-end space-x-3 pt-4">
//             <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
//             <Button onClick={handleSubmit}>{selectedGeofence ? 'Update' : 'Create'}</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default GeofenceManager;








// client/src/pages/tracking/GeofenceManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { trackingApi } from '../../api/tracking.api';
import { buildingApi } from '../../api/building.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const GeofenceManager = () => {
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  
  // ==================== STATE MANAGEMENT ====================
  const [geofences, setGeofences] = useState([]);        // Stores all geofences (array)
  const [buildings, setBuildings] = useState([]);        // Stores all buildings for selection (array)
  const [loading, setLoading] = useState(true);           // Loading state indicator
  const [showModal, setShowModal] = useState(false);      // Modal visibility toggle
  const [selectedGeofence, setSelectedGeofence] = useState(null); // Currently editing geofence
  const [formData, setFormData] = useState({              // Form state for create/edit
    name: '',
    buildingId: '',
    type: 'building',
    circle: {
      center: { lat: '', lng: '' },
      radius: 100
    },
    alerts: {
      onEntry: true,
      onExit: true,
      entryMessage: 'Welcome to the area',
      exitMessage: 'You have left the area'
    },
    isActive: true
  });

  // ==================== DATA FETCHING ====================
  
  /**
   * PURPOSE: Fetches both geofences and buildings data from APIs
   * Handles API responses safely by ensuring data is always an array
   * Displays error toast if fetch fails
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [geofenceRes, buildingRes] = await Promise.all([
        trackingApi.getGeofences(),
        buildingApi.getBuildings()
      ]);
      
      // SAFELY EXTRACT GEOFENCES DATA (ensure it's an array)
      let geofencesData = [];
      if (geofenceRes?.data?.data && Array.isArray(geofenceRes.data.data)) {
        geofencesData = geofenceRes.data.data;
      } else if (geofenceRes?.data && Array.isArray(geofenceRes.data)) {
        geofencesData = geofenceRes.data;
      } else if (geofenceRes?.data?.geofences && Array.isArray(geofenceRes.data.geofences)) {
        geofencesData = geofenceRes.data.geofences;
      } else if (Array.isArray(geofenceRes)) {
        geofencesData = geofenceRes;
      }
      setGeofences(geofencesData);
      
      // SAFELY EXTRACT BUILDINGS DATA (ensure it's an array)
      let buildingsData = [];
      if (buildingRes?.data?.data?.buildings && Array.isArray(buildingRes.data.data.buildings)) {
        buildingsData = buildingRes.data.data.buildings;
      } else if (buildingRes?.data?.buildings && Array.isArray(buildingRes.data.buildings)) {
        buildingsData = buildingRes.data.buildings;
      } else if (buildingRes?.data?.data && Array.isArray(buildingRes.data.data)) {
        buildingsData = buildingRes.data.data;
      } else if (Array.isArray(buildingRes)) {
        buildingsData = buildingRes;
      }
      setBuildings(buildingsData);
      
    } catch (error) {
      console.error('Fetch data error:', error);
      showToast('Failed to load data', 'error');
      // Set empty arrays on error to prevent map() crashes
      setGeofences([]);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial data load on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================== FORM HANDLERS ====================
  
  /**
   * PURPOSE: Resets form to initial empty state
   * Used when creating a new geofence or after successful submission
   */
  const resetForm = () => {
    setFormData({
      name: '',
      buildingId: '',
      type: 'building',
      circle: { center: { lat: '', lng: '' }, radius: 100 },
      alerts: { 
        onEntry: true, 
        onExit: true, 
        entryMessage: 'Welcome to the area', 
        exitMessage: 'You have left the area' 
      },
      isActive: true
    });
    setSelectedGeofence(null);
  };

  /**
   * PURPOSE: Populates form with existing geofence data for editing
   * Sets selectedGeofence state and opens modal
   * @param {Object} geofence - The geofence object to edit
   */
  const editGeofence = (geofence) => {
    setSelectedGeofence(geofence);
    setFormData({
      name: geofence.name || '',
      buildingId: geofence.buildingId?._id || geofence.buildingId || '',
      type: geofence.type || 'building',
      circle: geofence.circle || { center: { lat: '', lng: '' }, radius: 100 },
      alerts: geofence.alerts || { 
        onEntry: true, 
        onExit: true, 
        entryMessage: 'Welcome to the area', 
        exitMessage: 'You have left the area' 
      },
      isActive: geofence.isActive !== undefined ? geofence.isActive : true
    });
    setShowModal(true);
  };

  // ==================== CRUD OPERATIONS ====================
  
  /**
   * PURPOSE: Creates a new geofence or updates existing one
   * Validates required fields before submission
   * Refreshes data and closes modal on success
   */
  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.buildingId) {
      showToast('Name and Building are required', 'error');
      return;
    }

    try {
      if (selectedGeofence) {
        // UPDATE EXISTING GEOFENCE
        await trackingApi.updateGeofence(selectedGeofence._id, formData);
        showToast('Geofence updated successfully', 'success');
      } else {
        // CREATE NEW GEOFENCE
        await trackingApi.createGeofence(formData);
        showToast('Geofence created successfully', 'success');
      }
      
      // Close modal, reset form, refresh data
      setShowModal(false);
      resetForm();
      fetchData();
      
    } catch (error) {
      console.error('Submit error:', error);
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  /**
   * PURPOSE: Deletes a geofence after user confirmation
   * Shows confirmation dialog to prevent accidental deletion
   * @param {string} id - Geofence ID to delete
   * @param {string} name - Geofence name for confirmation message
   */
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete geofence "${name}"? This action cannot be undone.`)) {
      try {
        await trackingApi.deleteGeofence(id);
        showToast('Geofence deleted successfully', 'success');
        fetchData(); // Refresh the list
      } catch (error) {
        console.error('Delete error:', error);
        showToast(error.response?.data?.message || 'Failed to delete geofence', 'error');
      }
    }
  };

  /**
   * PURPOSE: Toggles geofence active/inactive status
   * @param {Object} geofence - The geofence to toggle
   */
  const handleToggleStatus = async (geofence) => {
    try {
      await trackingApi.updateGeofence(geofence._id, {
        isActive: !geofence.isActive
      });
      showToast(`Geofence ${!geofence.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Status toggle error:', error);
      showToast('Failed to update geofence status', 'error');
    }
  };

  // ==================== UI HELPERS ====================
  
  /**
   * PURPOSE: Returns CSS class for type badge based on geofence type
   * Used for visual differentiation in the UI
   * @param {string} type - Geofence type (building, restricted, safe_zone, parking)
   * @returns {string} - CSS class string
   */
  const getTypeBadge = (type) => {
    const badges = {
      building: 'bg-blue-100 text-blue-800',
      restricted: 'bg-red-100 text-red-800',
      safe_zone: 'bg-green-100 text-green-800',
      parking: 'bg-purple-100 text-purple-800'
    };
    return badges[type] || badges.building;
  };

  /**
   * PURPOSE: Safely gets building name from building ID
   * Handles cases where buildings array might be empty or building not found
   * @param {string} buildingId - Building ID to lookup
   * @returns {string} - Building name or 'Unknown Building'
   */
  const getBuildingName = (buildingId) => {
    if (!Array.isArray(buildings) || buildings.length === 0) return 'Unknown Building';
    const building = buildings.find(b => (b._id === buildingId) || (b.id === buildingId));
    return building ? building.name : 'Unknown Building';
  };

  // ==================== RENDER ====================
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  // Safe check for empty geofences
  const hasGeofences = Array.isArray(geofences) && geofences.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Geofence Manager</h1>
          <p className="text-gray-500 mt-1">
            Define geographic boundaries for buildings and areas
          </p>
        </div>
        {hasPermission('building.create') && (
          <Button 
            onClick={() => { 
              resetForm(); 
              setShowModal(true); 
            }}
          >
            + Create Geofence
          </Button>
        )}
      </div>

      {/* Geofences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasGeofences ? (
          geofences.map(geofence => (
            <Card key={geofence._id || geofence.id} className="overflow-hidden">
              <div className="p-4">
                {/* Header with name and type */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{geofence.name}</h3>
                    <p className="text-sm text-gray-500">
                      {getBuildingName(geofence.buildingId?._id || geofence.buildingId)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadge(geofence.type)}`}>
                    {geofence.type?.replace('_', ' ') || 'Building'}
                  </span>
                </div>
                
                {/* Details */}
                <div className="mt-3 space-y-1 text-sm">
                  {geofence.circle?.radius && (
                    <p>📏 Radius: {geofence.circle.radius} meters</p>
                  )}
                  {geofence.alerts?.onEntry && (
                    <p>🔔 Entry Alert: Enabled</p>
                  )}
                  {geofence.alerts?.onExit && (
                    <p>🔔 Exit Alert: Enabled</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      geofence.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {geofence.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(geofence)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {geofence.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => editGeofence(geofence)}
                  >
                    Edit
                  </Button>
                  {hasPermission('building.delete') && (
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={() => handleDelete(geofence._id, geofence.name)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="col-span-full p-8 text-center">
            <div className="text-5xl mb-3">🗺️</div>
            <p className="text-gray-500">No geofences created yet</p>
            {hasPermission('building.create') && (
              <Button 
                variant="secondary" 
                className="mt-3"
                onClick={() => { 
                  resetForm(); 
                  setShowModal(true); 
                }}
              >
                Create your first geofence
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={selectedGeofence ? 'Edit Geofence' : 'Create Geofence'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Basic Information */}
          <Input
            label="Geofence Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter geofence name"
            required
          />
          
          <Select
            label="Building *"
            value={formData.buildingId}
            onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
            options={[
              { value: '', label: 'Select Building' },
              ...(Array.isArray(buildings) ? buildings.map(b => ({ 
                value: b._id || b.id, 
                label: `${b.name}${b.code ? ` (${b.code})` : ''}` 
              })) : [])
            ]}
            required
          />
          
          <Select
            label="Geofence Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'building', label: 'Building' },
              { value: 'restricted', label: 'Restricted Area' },
              { value: 'safe_zone', label: 'Safe Zone' },
              { value: 'parking', label: 'Parking' }
            ]}
          />
          
          {/* Location Coordinates */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Location Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Center Latitude"
                type="number"
                step="any"
                value={formData.circle.center.lat}
                onChange={(e) => setFormData({
                  ...formData,
                  circle: { 
                    ...formData.circle, 
                    center: { 
                      ...formData.circle.center, 
                      lat: parseFloat(e.target.value) || '' 
                    } 
                  }
                })}
                placeholder="e.g., 25.2048"
              />
              <Input
                label="Center Longitude"
                type="number"
                step="any"
                value={formData.circle.center.lng}
                onChange={(e) => setFormData({
                  ...formData,
                  circle: { 
                    ...formData.circle, 
                    center: { 
                      ...formData.circle.center, 
                      lng: parseFloat(e.target.value) || '' 
                    } 
                  }
                })}
                placeholder="e.g., 55.2708"
              />
            </div>
            
            <Input
              label="Radius (meters)"
              type="number"
              value={formData.circle.radius}
              onChange={(e) => setFormData({
                ...formData,
                circle: { ...formData.circle, radius: parseInt(e.target.value) || 0 }
              })}
              min="1"
              max="10000"
            />
          </div>
          
          {/* Alert Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Alert Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.alerts.onEntry}
                  onChange={(e) => setFormData({
                    ...formData,
                    alerts: { ...formData.alerts, onEntry: e.target.checked }
                  })}
                  className="rounded"
                />
                <span>Enable Entry Alert</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.alerts.onExit}
                  onChange={(e) => setFormData({
                    ...formData,
                    alerts: { ...formData.alerts, onExit: e.target.checked }
                  })}
                  className="rounded"
                />
                <span>Enable Exit Alert</span>
              </label>
              
              <Input
                label="Entry Message"
                value={formData.alerts.entryMessage}
                onChange={(e) => setFormData({
                  ...formData,
                  alerts: { ...formData.alerts, entryMessage: e.target.value }
                })}
                placeholder="Message shown when entering"
              />
              
              <Input
                label="Exit Message"
                value={formData.alerts.exitMessage}
                onChange={(e) => setFormData({
                  ...formData,
                  alerts: { ...formData.alerts, exitMessage: e.target.value }
                })}
                placeholder="Message shown when exiting"
              />
            </div>
          </div>
          
          {/* Status */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <span>Active (geofence will be monitored)</span>
          </label>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedGeofence ? 'Update Geofence' : 'Create Geofence'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GeofenceManager;