// // client/src/pages/buildings/FloorManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Modal from '../../components/common/Modal';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';

// const FloorManagement = () => {
//   const { buildingId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [floors, setFloors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newFloor, setNewFloor] = useState({ floorNumber: '', unitCount: 0 });

//   useEffect(() => {
//     fetchFloors();
//   }, [buildingId]);

//   const fetchFloors = async () => {
//     try {
//       const response = await buildingApi.getFloors(buildingId);
//       setFloors(response.data.data);
//     } catch (error) {
//       showToast('Failed to load floors', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddFloor = async () => {
//     if (!newFloor.floorNumber) {
//       showToast('Floor number is required', 'error');
//       return;
//     }

//     try {
//       await buildingApi.addFloor(buildingId, newFloor);
//       showToast('Floor added successfully', 'success');
//       setShowAddModal(false);
//       setNewFloor({ floorNumber: '', unitCount: 0 });
//       fetchFloors();
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to add floor', 'error');
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Floor Management</h1>
//           <p className="text-gray-500">Manage building floors and units</p>
//         </div>
//         <Button onClick={() => setShowAddModal(true)}>+ Add Floor</Button>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor Number</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Units</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {floors.map((floor) => (
//               <tr key={floor.floorNumber}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   Floor {floor.floorNumber}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {floor.unitCount} units
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <button
//                     onClick={() => navigate(`/buildings/${buildingId}/units?floor=${floor.floorNumber}`)}
//                     className="text-blue-600 hover:text-blue-800 mr-3"
//                   >
//                     View Units
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Floor Modal */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Floor">
//         <div className="space-y-4">
//           <Input
//             label="Floor Number"
//             type="number"
//             value={newFloor.floorNumber}
//             onChange={(e) => setNewFloor({ ...newFloor, floorNumber: e.target.value })}
//             placeholder="e.g., 1, 2, 3..."
//             required
//           />
//           <div className="flex justify-end space-x-3">
//             <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
//             <Button onClick={handleAddFloor}>Add Floor</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default FloorManagement;



// // client/src/pages/buildings/FloorManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Modal from '../../components/common/Modal';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';

// const FloorManagement = () => {
//   const { buildingId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [floors, setFloors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newFloor, setNewFloor] = useState({ floorNumber: '', unitCount: 0 });
//   const [building, setBuilding] = useState(null);

//   useEffect(() => {
//     fetchBuildingDetails();
//     fetchFloors();
//   }, [buildingId]);

//   // 🔴 FIX 1: Fetch building details
//   const fetchBuildingDetails = async () => {
//     try {
//       const response = await buildingApi.getBuildingById(buildingId);
//       setBuilding(response.data.data.building || response.data.data);
//     } catch (error) {
//       console.error('Failed to load building:', error);
//     }
//   };

//   // 🔴 FIX 2: Fetch floors with proper error handling
//   const fetchFloors = async () => {
//     setLoading(true);
//     try {
//       const response = await buildingApi.getFloors(buildingId);
//       // Handle different response structures
//       let floorsData = [];
//       if (response.data.success) {
//         floorsData = response.data.data || [];
//       } else if (Array.isArray(response.data)) {
//         floorsData = response.data;
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         floorsData = response.data.data;
//       }
//       setFloors(floorsData);
//     } catch (error) {
//       console.error('Fetch floors error:', error);
//       showToast('Failed to load floors', 'error');
//       setFloors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔴 FIX 3: Add floor with validation
//   const handleAddFloor = async () => {
//     if (!newFloor.floorNumber) {
//       showToast('Floor number is required', 'error');
//       return;
//     }

//     try {
//       await buildingApi.addFloor(buildingId, newFloor);
//       showToast('Floor added successfully', 'success');
//       setShowAddModal(false);
//       setNewFloor({ floorNumber: '', unitCount: 0 });
//       fetchFloors();
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to add floor';
//       showToast(message, 'error');
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Floor Management - {building?.name || 'Building'}
//           </h1>
//           <p className="text-gray-500">Manage building floors and units</p>
//         </div>
//         <Button onClick={() => setShowAddModal(true)}>+ Add Floor</Button>
//       </div>

//       {/* 🔴 FIX 4: Empty state handling */}
//       {floors.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-12 text-center">
//           <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//           <p className="text-gray-500 mb-4">No floors added yet</p>
//           <Button variant="secondary" onClick={() => setShowAddModal(true)}>
//             Add First Floor
//           </Button>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor Number</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Units</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {floors.map((floor) => (
//                 <tr key={floor.floorNumber || floor._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     Floor {floor.floorNumber}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {floor.unitCount || 0} units
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => navigate(`/buildings/${buildingId}/units?floor=${floor.floorNumber}`)}
//                       className="text-blue-600 hover:text-blue-800 mr-3"
//                     >
//                       View Units
//                     </button>
//                     <button
//                       onClick={() => navigate(`/units/new/${buildingId}?floor=${floor.floorNumber}`)}
//                       className="text-green-600 hover:text-green-800"
//                     >
//                       Add Unit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//            </table>
//         </div>
//       )}

//       {/* Add Floor Modal */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Floor">
//         <div className="space-y-4">
//           <Input
//             label="Floor Number"
//             type="number"
//             value={newFloor.floorNumber}
//             onChange={(e) => setNewFloor({ ...newFloor, floorNumber: e.target.value })}
//             placeholder="e.g., 1, 2, 3..."
//             required
//           />
//           <Input
//             label="Total Units on this Floor"
//             type="number"
//             value={newFloor.unitCount}
//             onChange={(e) => setNewFloor({ ...newFloor, unitCount: parseInt(e.target.value) || 0 })}
//             placeholder="Number of units"
//           />
//           <div className="flex justify-end space-x-3">
//             <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
//             <Button onClick={handleAddFloor}>Add Floor</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default FloorManagement;


// client/src/pages/buildings/FloorManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Modal from '../../components/common/Modal';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';

// const FloorManagement = () => {
//   const { buildingId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [floors, setFloors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newFloor, setNewFloor] = useState({ floorNumber: '', unitCount: 0 });
//   const [building, setBuilding] = useState(null);

//   useEffect(() => {
//     // 🔴 FIX: Only fetch if buildingId exists
//     if (buildingId && buildingId !== 'undefined') {
//       fetchBuildingDetails();
//       fetchFloors();
//     }
//   }, [buildingId]);

//   // Fetch building details
//   const fetchBuildingDetails = async () => {
//     try {
//       const response = await buildingApi.getBuildingById(buildingId);
//       if (response.data.success) {
//         setBuilding(response.data.data.building || response.data.data);
//       }
//     } catch (error) {
//       console.error('Failed to load building:', error);
//     }
//   };

//   // Fetch floors with proper error handling
//   const fetchFloors = async () => {
//     setLoading(true);
//     try {
//       // 🔴 FIX: Use the correct endpoint
//       const response = await buildingApi.getFloors(buildingId);
//       let floorsData = [];
      
//       if (response.data && response.data.success) {
//         floorsData = response.data.data || [];
//       }
      
//       setFloors(floorsData);
//     } catch (error) {
//       console.error('Fetch floors error:', error);
//       showToast('Failed to load floors', 'error');
//       setFloors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add floor with validation
//   const handleAddFloor = async () => {
//     if (!newFloor.floorNumber) {
//       showToast('Floor number is required', 'error');
//       return;
//     }

//     try {
//       // 🔴 FIX: Use the correct API endpoint for adding floor
//       await buildingApi.addFloor(buildingId, newFloor);
//       showToast('Floor added successfully', 'success');
//       setShowAddModal(false);
//       setNewFloor({ floorNumber: '', unitCount: 0 });
//       fetchFloors();
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to add floor';
//       showToast(message, 'error');
//     }
//   };

//   // 🔴 FIX: Show error state if buildingId is invalid
//   if (!buildingId || buildingId === 'undefined') {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500">Invalid building ID. Please go back and select a valid building.</p>
//         <Button variant="secondary" className="mt-4" onClick={() => navigate('/buildings')}>
//           Back to Buildings
//         </Button>
//       </div>
//     );
//   }

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Floor Management - {building?.name || 'Building'}
//           </h1>
//           <p className="text-gray-500">Manage building floors and units</p>
//         </div>
//         <Button onClick={() => setShowAddModal(true)}>+ Add Floor</Button>
//       </div>

//       {/* Empty state handling */}
//       {floors.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-12 text-center">
//           <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//           <p className="text-gray-500 mb-4">No floors added yet</p>
//           <Button variant="secondary" onClick={() => setShowAddModal(true)}>
//             Add First Floor
//           </Button>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor Number</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Units</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {floors.map((floor) => (
//                 <tr key={floor.floorNumber || floor._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     Floor {floor.floorNumber}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {floor.unitCount || 0} units
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => navigate(`/buildings/${buildingId}/units?floor=${floor.floorNumber}`)}
//                       className="text-blue-600 hover:text-blue-800 mr-3"
//                     >
//                       View Units
//                     </button>
//                     <button
//                       onClick={() => navigate(`/units/new/${buildingId}?floor=${floor.floorNumber}`)}
//                       className="text-green-600 hover:text-green-800"
//                     >
//                       Add Unit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Add Floor Modal */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Floor">
//         <div className="space-y-4">
//           <Input
//             label="Floor Number"
//             type="number"
//             value={newFloor.floorNumber}
//             onChange={(e) => setNewFloor({ ...newFloor, floorNumber: e.target.value })}
//             placeholder="e.g., 1, 2, 3..."
//             required
//           />
//           <Input
//             label="Total Units on this Floor"
//             type="number"
//             value={newFloor.unitCount}
//             onChange={(e) => setNewFloor({ ...newFloor, unitCount: parseInt(e.target.value) || 0 })}
//             placeholder="Number of units"
//           />
//           <div className="flex justify-end space-x-3">
//             <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
//             <Button onClick={handleAddFloor}>Add Floor</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default FloorManagement;



// client/src/pages/buildings/FloorManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Modal from '../../components/common/Modal';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';

// const FloorManagement = () => {
//   const { buildingId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [floors, setFloors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newFloor, setNewFloor] = useState({ floorNumber: '', unitCount: 0 });
//   const [building, setBuilding] = useState(null);

//   // 🔴 FIX: Check if buildingId exists on mount
//   useEffect(() => {
//     if (!buildingId || buildingId === 'undefined') {
//       showToast('Invalid building ID. Please select a building first.', 'error');
//       navigate('/buildings');
//       return;
//     }
    
//     fetchBuildingDetails();
//     fetchFloors();
//   }, [buildingId, navigate, showToast]);

//   const fetchBuildingDetails = async () => {
//     try {
//       const response = await buildingApi.getBuildingById(buildingId);
//       if (response.data.success) {
//         setBuilding(response.data.data.building || response.data.data);
//       }
//     } catch (error) {
//       console.error('Failed to load building:', error);
//     }
//   };

//   const fetchFloors = async () => {
//     setLoading(true);
//     try {
//       // 🔴 FIX: Only call if buildingId exists
//       if (!buildingId || buildingId === 'undefined') {
//         setFloors([]);
//         setLoading(false);
//         return;
//       }
      
//       const response = await buildingApi.getFloors(buildingId);
//       let floorsData = [];
      
//       if (response.data && response.data.success) {
//         floorsData = response.data.data || [];
//       }
      
//       setFloors(floorsData);
//     } catch (error) {
//       console.error('Fetch floors error:', error);
//       if (error.response?.status === 400) {
//         // This means no building ID was provided
//         showToast('Invalid building selected. Please go back.', 'error');
//         navigate('/buildings');
//       } else {
//         showToast('Failed to load floors', 'error');
//       }
//       setFloors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddFloor = async () => {
//     if (!newFloor.floorNumber) {
//       showToast('Floor number is required', 'error');
//       return;
//     }

//     try {
//       await buildingApi.addFloor(buildingId, newFloor);
//       showToast('Floor added successfully', 'success');
//       setShowAddModal(false);
//       setNewFloor({ floorNumber: '', unitCount: 0 });
//       fetchFloors();
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to add floor';
//       showToast(message, 'error');
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Floor Management - {building?.name || 'Loading...'}
//           </h1>
//           <p className="text-gray-500">Manage building floors and units</p>
//         </div>
//         <Button onClick={() => setShowAddModal(true)}>+ Add Floor</Button>
//       </div>

//       {floors.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-12 text-center">
//           <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//           <p className="text-gray-500 mb-4">No floors added yet</p>
//           <Button variant="secondary" onClick={() => setShowAddModal(true)}>
//             Add First Floor
//           </Button>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor Number</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Units</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {floors.map((floor) => (
//                 <tr key={floor.floorNumber || floor._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     Floor {floor.floorNumber}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {floor.unitCount || 0} units
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => navigate(`/buildings/${buildingId}/units?floor=${floor.floorNumber}`)}
//                       className="text-blue-600 hover:text-blue-800 mr-3"
//                     >
//                       View Units
//                     </button>
//                     <button
//                       onClick={() => navigate(`/units/new/${buildingId}?floor=${floor.floorNumber}`)}
//                       className="text-green-600 hover:text-green-800"
//                     >
//                       Add Unit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Floor">
//         <div className="space-y-4">
//           <Input
//             label="Floor Number"
//             type="number"
//             value={newFloor.floorNumber}
//             onChange={(e) => setNewFloor({ ...newFloor, floorNumber: e.target.value })}
//             placeholder="e.g., 1, 2, 3..."
//             required
//           />
//           <Input
//             label="Total Units on this Floor"
//             type="number"
//             value={newFloor.unitCount}
//             onChange={(e) => setNewFloor({ ...newFloor, unitCount: parseInt(e.target.value) || 0 })}
//             placeholder="Number of units"
//           />
//           <div className="flex justify-end space-x-3">
//             <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
//             <Button onClick={handleAddFloor}>Add Floor</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default FloorManagement;

// client/src/pages/buildings/FloorManagement.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const FloorManagement = () => {
  // 🔴 FIX: Use 'id' to match route parameter /buildings/:id/floors
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFloor, setNewFloor] = useState({ floorNumber: '', unitCount: 0 });
  const [building, setBuilding] = useState(null);

  // 🔴 FIX: Validate buildingId on mount - ONLY fetch if ID exists
  useEffect(() => {
    if (!id || id === 'undefined' || id === 'null') {
      showToast('Invalid building ID. Please select a building first.', 'error');
      navigate('/buildings');
      return;
    }
    
    fetchBuildingDetails();
    fetchFloors();
  }, [id, navigate, showToast]);

  const fetchBuildingDetails = async () => {
    try {
      const response = await buildingApi.getBuildingById(id);
      if (response.data && response.data.success) {
        setBuilding(response.data.data.building || response.data.data);
      }
    } catch (error) {
      console.error('Failed to load building:', error);
      if (error.response?.status === 404) {
        showToast('Building not found', 'error');
        navigate('/buildings');
      }
    }
  };

  const fetchFloors = async () => {
    // 🔴 FIX: Don't fetch if no building ID
    if (!id || id === 'undefined') {
      setFloors([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await buildingApi.getFloors(id);
      let floorsData = [];
      if (response.data && response.data.success) {
        floorsData = response.data.data || [];
      }
      setFloors(floorsData);
    } catch (error) {
      console.error('Fetch floors error:', error);
      if (error.response?.status === 400) {
        showToast('Invalid building selected', 'error');
        navigate('/buildings');
      } else {
        showToast('Failed to load floors', 'error');
      }
      setFloors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFloor = async () => {
    if (!newFloor.floorNumber) {
      showToast('Floor number is required', 'error');
      return;
    }

    try {
      await buildingApi.addFloor(id, { floorNumber: newFloor.floorNumber });
      showToast('Floor added successfully', 'success');
      setShowAddModal(false);
      setNewFloor({ floorNumber: '', unitCount: 0 });
      fetchFloors();
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add floor';
      showToast(message, 'error');
    }
  };

  // 🔴 FIX: Show error state if no building ID
  if (!id || id === 'undefined' || id === 'null') {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 font-medium mb-2">Invalid Building ID</p>
          <p className="text-gray-600 mb-4">Please select a valid building to manage floors.</p>
          <Button variant="secondary" onClick={() => navigate('/buildings')}>
            Back to Buildings
          </Button>
        </div>
      </div>
    );
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Floor Management - {building?.name || 'Building'}
          </h1>
          <p className="text-gray-500">Manage building floors and units</p>
        </div>
        {hasPermission('building.update') && (
          <Button onClick={() => setShowAddModal(true)}>+ Add Floor</Button>
        )}
      </div>

      {floors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500 mb-4">No floors added yet</p>
          {hasPermission('building.update') && (
            <Button variant="secondary" onClick={() => setShowAddModal(true)}>
              Add First Floor
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {floors.map((floor) => (
                <tr key={floor.floorNumber || floor._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Floor {floor.floorNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {floor.unitCount || 0} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => navigate(`/buildings/${id}/units?floor=${floor.floorNumber}`)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View Units
                    </button>
                    {hasPermission('building.create') && (
                      <button
                        onClick={() => navigate(`/units/new/${id}?floor=${floor.floorNumber}`)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Add Unit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Floor">
        <div className="space-y-4">
          <Input
            label="Floor Number"
            type="number"
            value={newFloor.floorNumber}
            onChange={(e) => setNewFloor({ ...newFloor, floorNumber: e.target.value })}
            placeholder="e.g., 1, 2, 3..."
            required
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddFloor}>Add Floor</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FloorManagement;