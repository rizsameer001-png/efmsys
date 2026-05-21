// // client/src/pages/buildings/UnitManagement.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import SearchBar from '../../components/common/SearchBar';
// import Table from '../../components/common/Table';
// import Pagination from '../../components/common/Pagination';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const UnitManagement = () => {
//   const { buildingId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

//   const fetchUnits = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await buildingApi.getUnitsByBuilding(buildingId, {
//         page: pagination.page,
//         limit: pagination.limit,
//         search,
//         status: statusFilter
//       });
//       setUnits(response.data.data.units);
//       setPagination(response.data.data.pagination);
//     } catch (error) {
//       showToast('Failed to load units', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [buildingId, pagination.page, pagination.limit, search, statusFilter, showToast]);

//   useEffect(() => {
//     fetchUnits();
//   }, [fetchUnits]);

//   const handleDelete = async (unitId) => {
//     if (window.confirm('Are you sure you want to delete this unit?')) {
//       try {
//         await buildingApi.deleteUnit(unitId);
//         showToast('Unit deleted successfully', 'success');
//         fetchUnits();
//       } catch (error) {
//         showToast('Failed to delete unit', 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'unitNumber', header: 'Unit Number' },
//     { key: 'floorNumber', header: 'Floor' },
//     { key: 'unitType', header: 'Type' },
//     { key: 'ownerName', header: 'Owner', render: (_, row) => row.ownership?.ownerName || '-' },
//     { key: 'tenantName', header: 'Tenant', render: (_, row) => row.tenant?.tenantName || '-' },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       render: (_, row) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${
//           row.occupancy?.status === 'owner_occupied' ? 'bg-green-100 text-green-800' :
//           row.occupancy?.status === 'tenant_occupied' ? 'bg-blue-100 text-blue-800' :
//           row.occupancy?.status === 'vacant' ? 'bg-gray-100 text-gray-800' :
//           'bg-yellow-100 text-yellow-800'
//         }`}>
//           {row.occupancy?.status?.replace('_', ' ') || 'Vacant'}
//         </span>
//       )
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_, row) => (
//         <div className="flex space-x-2">
//           <button onClick={() => navigate(`/units/${row._id}`)} className="text-blue-600">View</button>
//           {hasPermission('building.update') && (
//             <button onClick={() => navigate(`/units/${row._id}/edit`)} className="text-green-600">Edit</button>
//           )}
//           {hasPermission('building.delete') && (
//             <button onClick={() => handleDelete(row._id)} className="text-red-600">Delete</button>
//           )}
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Unit Management</h1>
//           <p className="text-gray-500">Manage all units in this building</p>
//         </div>
//         {hasPermission('building.create') && (
//           <Button onClick={() => navigate(`/units/new/${buildingId}`)}>+ Add Unit</Button>
//         )}
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <SearchBar value={search} onChange={setSearch} placeholder="Search units..." />
//         </div>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Status</option>
//           <option value="owner_occupied">Owner Occupied</option>
//           <option value="tenant_occupied">Tenant Occupied</option>
//           <option value="vacant">Vacant</option>
//           <option value="maintenance">Maintenance</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-lg shadow">
//         <Table columns={columns} data={units} isLoading={loading} />
//         <Pagination
//           currentPage={pagination.page}
//           totalPages={pagination.pages}
//           totalItems={pagination.total}
//           itemsPerPage={pagination.limit}
//           onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
//         />
//       </div>
//     </div>
//   );
// };

// export default UnitManagement;



// // client/src/pages/buildings/UnitManagement.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import SearchBar from '../../components/common/SearchBar';
// import Table from '../../components/common/Table';
// import Pagination from '../../components/common/Pagination';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const UnitManagement = () => {
//   const { buildingId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [building, setBuilding] = useState(null);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [floorFilter, setFloorFilter] = useState('');
//   const [floors, setFloors] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

//   // Get floor from URL query params
//   const queryParams = new URLSearchParams(location.search);
//   const floorFromUrl = queryParams.get('floor');

//   useEffect(() => {
//     if (floorFromUrl) {
//       setFloorFilter(floorFromUrl);
//     }
//   }, [floorFromUrl]);

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

//   // 🔴 FIX 2: Fetch floors for filter dropdown
//   const fetchFloors = async () => {
//     try {
//       const response = await buildingApi.getFloors(buildingId);
//       let floorsData = [];
//       if (response.data.success) {
//         floorsData = response.data.data || [];
//       } else if (Array.isArray(response.data)) {
//         floorsData = response.data;
//       }
//       setFloors(floorsData);
//     } catch (error) {
//       console.error('Failed to load floors:', error);
//     }
//   };

//   // 🔴 FIX 3: Fetch units with proper params
//   const fetchUnits = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//       };
//       if (search) params.search = search;
//       if (statusFilter) params.status = statusFilter;
//       if (floorFilter) params.floor = floorFilter;
      
//       const response = await buildingApi.getUnitsByBuilding(buildingId, params);
      
//       let unitsData = [];
//       let paginationData = { page: 1, limit: 20, total: 0, pages: 0 };
      
//       if (response.data.success) {
//         unitsData = response.data.data?.units || response.data.data || [];
//         paginationData = response.data.data?.pagination || paginationData;
//       } else if (Array.isArray(response.data)) {
//         unitsData = response.data;
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         unitsData = response.data.data;
//       }
      
//       setUnits(unitsData);
//       setPagination(prev => ({ ...prev, ...paginationData }));
//     } catch (error) {
//       console.error('Fetch units error:', error);
//       showToast('Failed to load units', 'error');
//       setUnits([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [buildingId, pagination.page, pagination.limit, search, statusFilter, floorFilter, showToast]);

//   useEffect(() => {
//     fetchUnits();
//   }, [fetchUnits]);

//   const handleDelete = async (unitId) => {
//     if (window.confirm('Are you sure you want to delete this unit?')) {
//       try {
//         await buildingApi.deleteUnit(unitId);
//         showToast('Unit deleted successfully', 'success');
//         fetchUnits();
//       } catch (error) {
//         showToast('Failed to delete unit', 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'unitNumber', header: 'Unit Number' },
//     { key: 'floorNumber', header: 'Floor' },
//     { key: 'unitType', header: 'Type' },
//     { key: 'ownerName', header: 'Owner', render: (_, row) => row.ownership?.ownerName || '-' },
//     { key: 'tenantName', header: 'Tenant', render: (_, row) => row.tenant?.tenantName || '-' },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       render: (_, row) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${
//           row.occupancy?.status === 'owner_occupied' ? 'bg-green-100 text-green-800' :
//           row.occupancy?.status === 'tenant_occupied' ? 'bg-blue-100 text-blue-800' :
//           row.occupancy?.status === 'vacant' ? 'bg-gray-100 text-gray-800' :
//           'bg-yellow-100 text-yellow-800'
//         }`}>
//           {row.occupancy?.status?.replace('_', ' ') || 'Vacant'}
//         </span>
//       )
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_, row) => (
//         <div className="flex space-x-2">
//           <button onClick={() => navigate(`/units/${row._id}`)} className="text-blue-600 hover:text-blue-800">View</button>
//           {hasPermission('building.update') && (
//             <button onClick={() => navigate(`/units/${row._id}/edit`)} className="text-green-600 hover:text-green-800">Edit</button>
//           )}
//           {hasPermission('building.delete') && (
//             <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800">Delete</button>
//           )}
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Unit Management - {building?.name || 'Building'}
//           </h1>
//           <p className="text-gray-500">Manage all units in this building</p>
//         </div>
//         {hasPermission('building.create') && (
//           <Button onClick={() => navigate(`/units/new/${buildingId}${floorFilter ? `?floor=${floorFilter}` : ''}`)}>
//             + Add Unit
//           </Button>
//         )}
//       </div>

//       {/* 🔴 FIX 4: Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <SearchBar value={search} onChange={setSearch} placeholder="Search units by number..." />
//         </div>
//         <select
//           value={floorFilter}
//           onChange={(e) => setFloorFilter(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Floors</option>
//           {floors.map(floor => (
//             <option key={floor.floorNumber} value={floor.floorNumber}>
//               Floor {floor.floorNumber}
//             </option>
//           ))}
//         </select>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Status</option>
//           <option value="owner_occupied">Owner Occupied</option>
//           <option value="tenant_occupied">Tenant Occupied</option>
//           <option value="vacant">Vacant</option>
//           <option value="maintenance">Maintenance</option>
//         </select>
//       </div>

//       {/* 🔴 FIX 5: Units Table */}
//       <div className="bg-white rounded-lg shadow">
//         <Table columns={columns} data={units} isLoading={loading} />
//         {units.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No units found</p>
//             <Button variant="secondary" className="mt-2" onClick={() => navigate(`/units/new/${buildingId}`)}>
//               Add First Unit
//             </Button>
//           </div>
//         )}
//         <Pagination
//           currentPage={pagination.page}
//           totalPages={pagination.pages}
//           totalItems={pagination.total}
//           itemsPerPage={pagination.limit}
//           onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
//         />
//       </div>
//     </div>
//   );
// };

// export default UnitManagement;


// // client/src/pages/buildings/UnitManagement.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import SearchBar from '../../components/common/SearchBar';
// import Table from '../../components/common/Table';
// import Pagination from '../../components/common/Pagination';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const UnitManagement = () => {
//   const { buildingId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [building, setBuilding] = useState(null);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [floorFilter, setFloorFilter] = useState('');
//   const [floors, setFloors] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

//   // Get floor from URL query params
//   const queryParams = new URLSearchParams(location.search);
//   const floorFromUrl = queryParams.get('floor');

//   useEffect(() => {
//     if (floorFromUrl) {
//       setFloorFilter(floorFromUrl);
//     }
//   }, [floorFromUrl]);

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

//   // Fetch floors for filter dropdown
//   const fetchFloors = async () => {
//     try {
//       // 🔴 FIX: Use the correct endpoint with buildingId
//       const response = await buildingApi.getFloors(buildingId);
//       let floorsData = [];
//       if (response.data && response.data.success) {
//         floorsData = response.data.data || [];
//       }
//       setFloors(floorsData);
//     } catch (error) {
//       console.error('Failed to load floors:', error);
//       setFloors([]);
//     }
//   };

//   // Fetch units with proper params
//   const fetchUnits = useCallback(async () => {
//     // 🔴 FIX: Don't fetch if buildingId is missing
//     if (!buildingId || buildingId === 'undefined') {
//       setLoading(false);
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//       };
//       if (search) params.search = search;
//       if (statusFilter) params.status = statusFilter;
//       if (floorFilter) params.floor = floorFilter;
      
//       // 🔴 FIX: Use correct API endpoint
//       const response = await buildingApi.getUnitsByBuilding(buildingId, params);
      
//       let unitsData = [];
//       let paginationData = { page: 1, limit: 20, total: 0, pages: 0 };
      
//       if (response.data && response.data.success) {
//         unitsData = response.data.data?.units || response.data.data || [];
//         paginationData = response.data.data?.pagination || paginationData;
//       }
      
//       setUnits(unitsData);
//       setPagination(prev => ({ ...prev, ...paginationData }));
//     } catch (error) {
//       console.error('Fetch units error:', error);
//       showToast('Failed to load units', 'error');
//       setUnits([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [buildingId, pagination.page, pagination.limit, search, statusFilter, floorFilter, showToast]);

//   useEffect(() => {
//     fetchUnits();
//   }, [fetchUnits]);

//   const handleDelete = async (unitId) => {
//     if (window.confirm('Are you sure you want to delete this unit?')) {
//       try {
//         await buildingApi.deleteUnit(unitId);
//         showToast('Unit deleted successfully', 'success');
//         fetchUnits();
//       } catch (error) {
//         showToast('Failed to delete unit', 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'unitNumber', header: 'Unit Number' },
//     { key: 'floorNumber', header: 'Floor' },
//     { key: 'unitType', header: 'Type' },
//     { key: 'ownerName', header: 'Owner', render: (_, row) => row.ownership?.ownerName || '-' },
//     { key: 'tenantName', header: 'Tenant', render: (_, row) => row.tenant?.tenantName || '-' },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       render: (_, row) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${
//           row.occupancy?.status === 'owner_occupied' ? 'bg-green-100 text-green-800' :
//           row.occupancy?.status === 'tenant_occupied' ? 'bg-blue-100 text-blue-800' :
//           row.occupancy?.status === 'vacant' ? 'bg-gray-100 text-gray-800' :
//           'bg-yellow-100 text-yellow-800'
//         }`}>
//           {row.occupancy?.status?.replace('_', ' ') || 'Vacant'}
//         </span>
//       )
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_, row) => (
//         <div className="flex space-x-2">
//           <button onClick={() => navigate(`/units/${row._id}`)} className="text-blue-600 hover:text-blue-800">View</button>
//           {hasPermission('building.update') && (
//             <button onClick={() => navigate(`/units/${row._id}/edit`)} className="text-green-600 hover:text-green-800">Edit</button>
//           )}
//           {hasPermission('building.delete') && (
//             <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800">Delete</button>
//           )}
//         </div>
//       )
//     }
//   ];

//   // 🔴 FIX: Show loading or error state
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

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Unit Management - {building?.name || 'Loading...'}
//           </h1>
//           <p className="text-gray-500">Manage all units in this building</p>
//         </div>
//         {hasPermission('building.create') && (
//           <Button onClick={() => navigate(`/units/new/${buildingId}${floorFilter ? `?floor=${floorFilter}` : ''}`)}>
//             + Add Unit
//           </Button>
//         )}
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <SearchBar value={search} onChange={setSearch} placeholder="Search units by number..." />
//         </div>
//         <select
//           value={floorFilter}
//           onChange={(e) => setFloorFilter(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Floors</option>
//           {floors.map(floor => (
//             <option key={floor.floorNumber} value={floor.floorNumber}>
//               Floor {floor.floorNumber}
//             </option>
//           ))}
//         </select>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Status</option>
//           <option value="owner_occupied">Owner Occupied</option>
//           <option value="tenant_occupied">Tenant Occupied</option>
//           <option value="vacant">Vacant</option>
//           <option value="maintenance">Maintenance</option>
//         </select>
//       </div>

//       {/* Units Table */}
//       <div className="bg-white rounded-lg shadow">
//         <Table columns={columns} data={units} isLoading={loading} />
//         {units.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No units found</p>
//             <Button variant="secondary" className="mt-2" onClick={() => navigate(`/units/new/${buildingId}`)}>
//               Add First Unit
//             </Button>
//           </div>
//         )}
//         {pagination.pages > 1 && (
//           <Pagination
//             currentPage={pagination.page}
//             totalPages={pagination.pages}
//             totalItems={pagination.total}
//             itemsPerPage={pagination.limit}
//             onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default UnitManagement;


// // client/src/pages/buildings/UnitManagement.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import SearchBar from '../../components/common/SearchBar';
// import Table from '../../components/common/Table';
// import Pagination from '../../components/common/Pagination';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const UnitManagement = () => {
//   const { buildingId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [building, setBuilding] = useState(null);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [floorFilter, setFloorFilter] = useState('');
//   const [floors, setFloors] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

//   // Get floor from URL query params
//   const queryParams = new URLSearchParams(location.search);
//   const floorFromUrl = queryParams.get('floor');

//   useEffect(() => {
//     if (floorFromUrl) {
//       setFloorFilter(floorFromUrl);
//     }
//   }, [floorFromUrl]);

//   // 🔴 FIX: Validate buildingId on mount
//   useEffect(() => {
//     if (!buildingId || buildingId === 'undefined' || buildingId === 'null') {
//       showToast('Invalid building ID. Please select a building first.', 'error');
//       navigate('/buildings');
//       return;
//     }
    
//     fetchBuildingDetails();
//     fetchFloors();
//   }, [buildingId]);

//   // Fetch building details
//   const fetchBuildingDetails = async () => {
//     try {
//       const response = await buildingApi.getBuildingById(buildingId);
//       if (response.data && response.data.success) {
//         setBuilding(response.data.data.building || response.data.data);
//       }
//     } catch (error) {
//       console.error('Failed to load building:', error);
//       if (error.response?.status === 404) {
//         showToast('Building not found', 'error');
//         navigate('/buildings');
//       }
//     }
//   };

//   // Fetch floors for filter dropdown
//   const fetchFloors = async () => {
//     try {
//       // 🔴 FIX: Only call if buildingId exists
//       if (!buildingId || buildingId === 'undefined') {
//         setFloors([]);
//         return;
//       }
      
//       const response = await buildingApi.getFloors(buildingId);
//       let floorsData = [];
//       if (response.data && response.data.success) {
//         floorsData = response.data.data || [];
//       }
//       setFloors(floorsData);
//     } catch (error) {
//       console.error('Failed to load floors:', error);
//       setFloors([]);
//     }
//   };

//   // Fetch units with proper params
//   const fetchUnits = useCallback(async () => {
//     // 🔴 FIX: Don't fetch if buildingId is missing
//     if (!buildingId || buildingId === 'undefined' || buildingId === 'null') {
//       setLoading(false);
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//       };
//       if (search) params.search = search;
//       if (statusFilter) params.status = statusFilter;
//       if (floorFilter) params.floor = floorFilter;
      
//       // 🔴 FIX: Use correct API endpoint
//       const response = await buildingApi.getUnitsByBuilding(buildingId, params);
      
//       let unitsData = [];
//       let paginationData = { page: 1, limit: 20, total: 0, pages: 0 };
      
//       if (response.data && response.data.success) {
//         unitsData = response.data.data?.units || response.data.data || [];
//         paginationData = response.data.data?.pagination || paginationData;
//       }
      
//       setUnits(unitsData);
//       setPagination(prev => ({ ...prev, ...paginationData }));
//     } catch (error) {
//       console.error('Fetch units error:', error);
//       if (error.response?.status === 400) {
//         showToast('Invalid building selected. Please go back.', 'error');
//         navigate('/buildings');
//       } else {
//         showToast('Failed to load units', 'error');
//       }
//       setUnits([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [buildingId, pagination.page, pagination.limit, search, statusFilter, floorFilter, showToast, navigate]);

//   useEffect(() => {
//     fetchUnits();
//   }, [fetchUnits]);

//   const handleDelete = async (unitId) => {
//     if (window.confirm('Are you sure you want to delete this unit?')) {
//       try {
//         await buildingApi.deleteUnit(unitId);
//         showToast('Unit deleted successfully', 'success');
//         fetchUnits();
//       } catch (error) {
//         const message = error.response?.data?.error || 'Failed to delete unit';
//         showToast(message, 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'unitNumber', header: 'Unit Number' },
//     { key: 'floorNumber', header: 'Floor' },
//     { key: 'unitType', header: 'Type' },
//     { key: 'ownerName', header: 'Owner', render: (_, row) => row.ownership?.ownerName || '-' },
//     { key: 'tenantName', header: 'Tenant', render: (_, row) => row.tenant?.tenantName || '-' },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       render: (_, row) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${
//           row.occupancy?.status === 'owner_occupied' ? 'bg-green-100 text-green-800' :
//           row.occupancy?.status === 'tenant_occupied' ? 'bg-blue-100 text-blue-800' :
//           row.occupancy?.status === 'vacant' ? 'bg-gray-100 text-gray-800' :
//           row.occupancy?.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
//           'bg-gray-100 text-gray-800'
//         }`}>
//           {row.occupancy?.status?.replace(/_/g, ' ') || 'Vacant'}
//         </span>
//       )
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_, row) => (
//         <div className="flex space-x-2">
//           <button 
//             onClick={() => navigate(`/units/${row._id}`)} 
//             className="text-blue-600 hover:text-blue-800"
//           >
//             View
//           </button>
//           {hasPermission('building.update') && (
//             <button 
//               onClick={() => navigate(`/units/${row._id}/edit`)} 
//               className="text-green-600 hover:text-green-800"
//             >
//               Edit
//             </button>
//           )}
//           {hasPermission('building.delete') && (
//             <button 
//               onClick={() => handleDelete(row._id)} 
//               className="text-red-600 hover:text-red-800"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       )
//     }
//   ];

//   // 🔴 FIX: Show error state if buildingId is invalid
//   if (!buildingId || buildingId === 'undefined' || buildingId === 'null') {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-600 font-medium mb-2">Invalid Building ID</p>
//           <p className="text-gray-600 mb-4">Please select a valid building to manage units.</p>
//           <Button variant="secondary" onClick={() => navigate('/buildings')}>
//             Back to Buildings
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Unit Management - {building?.name || 'Loading...'}
//           </h1>
//           <p className="text-gray-500">Manage all units in this building</p>
//         </div>
//         {hasPermission('building.create') && (
//           <Button onClick={() => navigate(`/units/new/${buildingId}${floorFilter ? `?floor=${floorFilter}` : ''}`)}>
//             + Add Unit
//           </Button>
//         )}
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar 
//               value={search} 
//               onChange={setSearch} 
//               placeholder="Search units by number, owner name, or tenant name..." 
//             />
//           </div>
//           <select
//             value={floorFilter}
//             onChange={(e) => setFloorFilter(e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">All Floors</option>
//             {floors.map(floor => (
//               <option key={floor.floorNumber} value={floor.floorNumber}>
//                 Floor {floor.floorNumber} ({floor.unitCount || 0} units)
//               </option>
//             ))}
//           </select>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="owner_occupied">Owner Occupied</option>
//             <option value="tenant_occupied">Tenant Occupied</option>
//             <option value="vacant">Vacant</option>
//             <option value="maintenance">Under Maintenance</option>
//           </select>
//         </div>
//       </div>

//       {/* Units Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <Spinner size="lg" />
//           </div>
//         ) : (
//           <>
//             <Table columns={columns} data={units} isLoading={loading} />
//             {units.length === 0 && !loading && (
//               <div className="text-center py-12">
//                 <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//                 <p className="text-gray-500 mb-4">No units found in this building</p>
//                 <Button variant="secondary" onClick={() => navigate(`/units/new/${buildingId}`)}>
//                   Add First Unit
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//         {pagination.pages > 1 && (
//           <div className="border-t px-4 py-3">
//             <Pagination
//               currentPage={pagination.page}
//               totalPages={pagination.pages}
//               totalItems={pagination.total}
//               itemsPerPage={pagination.limit}
//               onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UnitManagement;


// client/src/pages/buildings/UnitManagement.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import SearchBar from '../../components/common/SearchBar';
// import Table from '../../components/common/Table';
// import Pagination from '../../components/common/Pagination';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const UnitManagement = () => {
//   // 🔴 FIX: Use 'id' to match route parameter /buildings/:id/units
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [building, setBuilding] = useState(null);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [floorFilter, setFloorFilter] = useState('');
//   const [floors, setFloors] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

//   const queryParams = new URLSearchParams(location.search);
//   const floorFromUrl = queryParams.get('floor');

//   useEffect(() => {
//     if (floorFromUrl) {
//       setFloorFilter(floorFromUrl);
//     }
//   }, [floorFromUrl]);

//   useEffect(() => {
//     if (!id || id === 'undefined' || id === 'null') {
//       showToast('Invalid building ID. Please select a building first.', 'error');
//       navigate('/buildings');
//       return;
//     }
    
//     fetchBuildingDetails();
//     fetchFloors();
//   }, [id]);

//   const fetchBuildingDetails = async () => {
//     try {
//       const response = await buildingApi.getBuildingById(id);
//       if (response.data && response.data.success) {
//         setBuilding(response.data.data.building || response.data.data);
//       }
//     } catch (error) {
//       console.error('Failed to load building:', error);
//     }
//   };

//   const fetchFloors = async () => {
//     try {
//       const response = await buildingApi.getFloors(id);
//       let floorsData = [];
//       if (response.data && response.data.success) {
//         floorsData = response.data.data || [];
//       }
//       setFloors(floorsData);
//     } catch (error) {
//       console.error('Failed to load floors:', error);
//       setFloors([]);
//     }
//   };

//   const fetchUnits = useCallback(async () => {
//     if (!id || id === 'undefined' || id === 'null') {
//       setLoading(false);
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//       };
//       if (search) params.search = search;
//       if (statusFilter) params.status = statusFilter;
//       if (floorFilter) params.floor = floorFilter;
      
//       const response = await buildingApi.getUnitsByBuilding(id, params);
      
//       let unitsData = [];
//       let paginationData = { page: 1, limit: 20, total: 0, pages: 0 };
      
//       if (response.data && response.data.success) {
//         unitsData = response.data.data?.units || response.data.data || [];
//         paginationData = response.data.data?.pagination || paginationData;
//       }
      
//       setUnits(unitsData);
//       setPagination(prev => ({ ...prev, ...paginationData }));
//     } catch (error) {
//       console.error('Fetch units error:', error);
//       showToast('Failed to load units', 'error');
//       setUnits([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [id, pagination.page, pagination.limit, search, statusFilter, floorFilter, showToast]);

//   useEffect(() => {
//     fetchUnits();
//   }, [fetchUnits]);

//   const handleDelete = async (unitId) => {
//     if (window.confirm('Are you sure you want to delete this unit?')) {
//       try {
//         await buildingApi.deleteUnit(unitId);
//         showToast('Unit deleted successfully', 'success');
//         fetchUnits();
//       } catch (error) {
//         showToast('Failed to delete unit', 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'unitNumber', header: 'Unit Number' },
//     { key: 'floorNumber', header: 'Floor' },
//     { key: 'unitType', header: 'Type' },
//     { key: 'ownerName', header: 'Owner', render: (_, row) => row.ownership?.ownerName || '-' },
//     { key: 'tenantName', header: 'Tenant', render: (_, row) => row.tenant?.tenantName || '-' },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       render: (_, row) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${
//           row.occupancy?.status === 'owner_occupied' ? 'bg-green-100 text-green-800' :
//           row.occupancy?.status === 'tenant_occupied' ? 'bg-blue-100 text-blue-800' :
//           row.occupancy?.status === 'vacant' ? 'bg-gray-100 text-gray-800' :
//           'bg-yellow-100 text-yellow-800'
//         }`}>
//           {row.occupancy?.status?.replace('_', ' ') || 'Vacant'}
//         </span>
//       )
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_, row) => (
//         <div className="flex space-x-2">
//           <button onClick={() => navigate(`/units/${row._id}`)} className="text-blue-600 hover:text-blue-800">View</button>
//           {hasPermission('building.update') && (
//             <button onClick={() => navigate(`/units/${row._id}/edit`)} className="text-green-600 hover:text-green-800">Edit</button>
//           )}
//           {hasPermission('building.delete') && (
//             <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800">Delete</button>
//           )}
//         </div>
//       )
//     }
//   ];

//   if (!id || id === 'undefined' || id === 'null') {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-600 font-medium mb-2">Invalid Building ID</p>
//           <p className="text-gray-600 mb-4">Please select a valid building to manage units.</p>
//           <Button variant="secondary" onClick={() => navigate('/buildings')}>
//             Back to Buildings
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Unit Management - {building?.name || 'Loading...'}
//           </h1>
//           <p className="text-gray-500">Manage all units in this building</p>
//         </div>
//         {hasPermission('building.create') && (
//           <Button onClick={() => navigate(`/units/new/${id}${floorFilter ? `?floor=${floorFilter}` : ''}`)}>
//             + Add Unit
//           </Button>
//         )}
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <SearchBar value={search} onChange={setSearch} placeholder="Search units by number..." />
//         </div>
//         <select
//           value={floorFilter}
//           onChange={(e) => setFloorFilter(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Floors</option>
//           {floors.map(floor => (
//             <option key={floor.floorNumber} value={floor.floorNumber}>
//               Floor {floor.floorNumber}
//             </option>
//           ))}
//         </select>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Status</option>
//           <option value="owner_occupied">Owner Occupied</option>
//           <option value="tenant_occupied">Tenant Occupied</option>
//           <option value="vacant">Vacant</option>
//           <option value="maintenance">Maintenance</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-lg shadow">
//         <Table columns={columns} data={units} isLoading={loading} />
//         {units.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No units found</p>
//             <Button variant="secondary" className="mt-2" onClick={() => navigate(`/units/new/${id}`)}>
//               Add First Unit
//             </Button>
//           </div>
//         )}
//         {pagination.pages > 1 && (
//           <Pagination
//             currentPage={pagination.page}
//             totalPages={pagination.pages}
//             totalItems={pagination.total}
//             itemsPerPage={pagination.limit}
//             onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default UnitManagement;

// client/src/pages/buildings/UnitManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const UnitManagement = () => {
  // 🔴 FIX: Use 'id' to match route parameter /buildings/:id/units
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');
  const [floors, setFloors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const queryParams = new URLSearchParams(location.search);
  const floorFromUrl = queryParams.get('floor');

  useEffect(() => {
    if (floorFromUrl) {
      setFloorFilter(floorFromUrl);
    }
  }, [floorFromUrl]);

  // 🔴 FIX: Validate buildingId - ONLY fetch if ID exists
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
    }
  };

  const fetchFloors = async () => {
    // 🔴 FIX: Don't fetch if no building ID
    if (!id || id === 'undefined') {
      setFloors([]);
      return;
    }
    
    try {
      const response = await buildingApi.getFloors(id);
      let floorsData = [];
      if (response.data && response.data.success) {
        floorsData = response.data.data || [];
      }
      setFloors(floorsData);
    } catch (error) {
      console.error('Failed to load floors:', error);
      setFloors([]);
    }
  };

  const fetchUnits = useCallback(async () => {
    // 🔴 FIX: Don't fetch if no building ID
    if (!id || id === 'undefined' || id === 'null') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (floorFilter) params.floor = floorFilter;
      
      const response = await buildingApi.getUnitsByBuilding(id, params);
      
      let unitsData = [];
      let paginationData = { page: 1, limit: 20, total: 0, pages: 0 };
      
      if (response.data && response.data.success) {
        unitsData = response.data.data?.units || response.data.data || [];
        paginationData = response.data.data?.pagination || paginationData;
      }
      
      setUnits(unitsData);
      setPagination(prev => ({ ...prev, ...paginationData }));
    } catch (error) {
      console.error('Fetch units error:', error);
      showToast('Failed to load units', 'error');
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, [id, pagination.page, pagination.limit, search, statusFilter, floorFilter, showToast]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleDelete = async (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await buildingApi.deleteUnit(unitId);
        showToast('Unit deleted successfully', 'success');
        fetchUnits();
      } catch (error) {
        showToast('Failed to delete unit', 'error');
      }
    }
  };

  const columns = [
    { key: 'unitNumber', header: 'Unit Number' },
    { key: 'floorNumber', header: 'Floor' },
    { key: 'unitType', header: 'Type' },
    { key: 'ownerName', header: 'Owner', render: (_, row) => row.ownership?.ownerName || '-' },
    { key: 'tenantName', header: 'Tenant', render: (_, row) => row.tenant?.tenantName || '-' },
    { 
      key: 'status', 
      header: 'Status', 
      render: (_, row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.occupancy?.status === 'owner_occupied' ? 'bg-green-100 text-green-800' :
          row.occupancy?.status === 'tenant_occupied' ? 'bg-blue-100 text-blue-800' :
          row.occupancy?.status === 'vacant' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.occupancy?.status?.replace('_', ' ') || 'Vacant'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/units/${row._id}`)} className="text-blue-600 hover:text-blue-800">View</button>
          {hasPermission('building.update') && (
            <button onClick={() => navigate(`/units/${row._id}/edit`)} className="text-green-600 hover:text-green-800">Edit</button>
          )}
          {hasPermission('building.delete') && (
            <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800">Delete</button>
          )}
        </div>
      )
    }
  ];

  // 🔴 FIX: Show error state if no building ID
  if (!id || id === 'undefined' || id === 'null') {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 font-medium mb-2">Invalid Building ID</p>
          <p className="text-gray-600 mb-4">Please select a valid building to manage units.</p>
          <Button variant="secondary" onClick={() => navigate('/buildings')}>
            Back to Buildings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Unit Management - {building?.name || 'Loading...'}
          </h1>
          <p className="text-gray-500">Manage all units in this building</p>
        </div>
        {hasPermission('building.create') && (
          <Button onClick={() => navigate(`/units/new/${id}${floorFilter ? `?floor=${floorFilter}` : ''}`)}>
            + Add Unit
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search units by number..." />
        </div>
        <select
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Floors</option>
          {floors.map(floor => (
            <option key={floor.floorNumber} value={floor.floorNumber}>
              Floor {floor.floorNumber}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="owner_occupied">Owner Occupied</option>
          <option value="tenant_occupied">Tenant Occupied</option>
          <option value="vacant">Vacant</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={units} isLoading={loading} />
        {units.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No units found</p>
            <Button variant="secondary" className="mt-2" onClick={() => navigate(`/units/new/${id}`)}>
              Add First Unit
            </Button>
          </div>
        )}
        {pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        )}
      </div>
    </div>
  );
};

export default UnitManagement;