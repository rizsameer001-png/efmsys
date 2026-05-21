// // client/src/pages/buildings/BuildingList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import SearchBar from '../../components/common/SearchBar';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';

// const BuildingList = () => {
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [buildings, setBuildings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [typeFilter, setTypeFilter] = useState('');

//   const fetchBuildings = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await buildingApi.getBuildings({ search, type: typeFilter });
//       setBuildings(response.data.data.buildings);
//     } catch (error) {
//       showToast('Failed to load buildings', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [search, typeFilter, showToast]);

//   useEffect(() => {
//     fetchBuildings();
//   }, [fetchBuildings]);

//   const handleDelete = async (id, name) => {
//     if (window.confirm(`Are you sure you want to delete ${name}?`)) {
//       try {
//         await buildingApi.deleteBuilding(id);
//         showToast('Building deleted successfully', 'success');
//         fetchBuildings();
//       } catch (error) {
//         showToast(error.response?.data?.error || 'Failed to delete building', 'error');
//       }
//     }
//   };

//   const buildingTypes = [
//     { value: '', label: 'All Types' },
//     { value: 'residential', label: 'Residential' },
//     { value: 'commercial', label: 'Commercial' },
//     { value: 'office', label: 'Office' },
//     { value: 'mall', label: 'Mall' },
//     { value: 'hospital', label: 'Hospital' },
//     { value: 'hotel', label: 'Hotel' },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
//           <p className="text-gray-500 mt-1">Manage all your properties and buildings</p>
//         </div>
//         {hasPermission('building.create') && (
//           <Button onClick={() => navigate('/buildings/new')}>
//             + Add Building
//           </Button>
//         )}
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <SearchBar
//             value={search}
//             onChange={setSearch}
//             placeholder="Search by name, code, or city..."
//           />
//         </div>
//         <select
//           value={typeFilter}
//           onChange={(e) => setTypeFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           {buildingTypes.map(type => (
//             <option key={type.value} value={type.value}>{type.label}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <Spinner />
//       ) : buildings.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg">
//           <p className="text-gray-500">No buildings found</p>
//           {hasPermission('building.create') && (
//             <Button variant="secondary" onClick={() => navigate('/buildings/new')} className="mt-4">
//               Add your first building
//             </Button>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {buildings.map((building) => (
//             <Card key={building._id} className="hover:shadow-lg transition-shadow">
//               <div className="p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-900">{building.name}</h3>
//                     <p className="text-sm text-gray-500">{building.code}</p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     building.status === 'active' ? 'bg-green-100 text-green-800' :
//                     building.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {building.status}
//                   </span>
//                 </div>
                
//                 <div className="mt-4 space-y-2">
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Type:</span> {building.type}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Location:</span> {building.address?.city}, {building.address?.country}
//                   </p>
//                   <div className="flex gap-4 mt-2">
//                     <div className="text-center">
//                       <p className="text-lg font-bold text-blue-600">{building.statistics?.totalFloors || 0}</p>
//                       <p className="text-xs text-gray-500">Floors</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-lg font-bold text-green-600">{building.statistics?.totalUnits || 0}</p>
//                       <p className="text-xs text-gray-500">Units</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-lg font-bold text-orange-600">{building.statistics?.occupiedUnits || 0}</p>
//                       <p className="text-xs text-gray-500">Occupied</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="mt-4 flex gap-2">
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => navigate(`/buildings/${building._id}`)}
//                   >
//                     View Details
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => navigate(`/buildings/${building._id}/units`)}
//                   >
//                     Manage Units
//                   </Button>
//                   {hasPermission('building.update') && (
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => navigate(`/buildings/${building._id}/edit`)}
//                     >
//                       Edit
//                     </Button>
//                   )}
//                   {hasPermission('building.delete') && (
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => handleDelete(building._id, building.name)}
//                     >
//                       Delete
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuildingList;


// client/src/pages/buildings/BuildingList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const BuildingList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 0 });

  // 🔴 FIX: Improved fetchBuildings with pagination and better error handling
  const fetchBuildings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        type: typeFilter || undefined
      };
      
      const response = await buildingApi.getBuildings(params);
      
      // 🔴 FIX: Handle different response structures
      let buildingsData = [];
      let paginationData = { page: 1, limit: 9, total: 0, pages: 0 };
      
      if (response.data && response.data.success) {
        buildingsData = response.data.data?.buildings || response.data.data || [];
        paginationData = response.data.data?.pagination || paginationData;
      } else if (Array.isArray(response.data)) {
        buildingsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        buildingsData = response.data.data;
      }
      
      setBuildings(buildingsData);
      setPagination(prev => ({ ...prev, ...paginationData }));
    } catch (error) {
      console.error('Fetch buildings error:', error);
      showToast(error.response?.data?.error || 'Failed to load buildings', 'error');
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, pagination.page, pagination.limit, showToast]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  // 🔴 FIX: Debounced search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchBuildings();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);

  // 🔴 FIX: Handle filter change
  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBuildings();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await buildingApi.deleteBuilding(id);
        showToast('Building deleted successfully', 'success');
        fetchBuildings();
      } catch (error) {
        const message = error.response?.data?.error || 'Failed to delete building';
        showToast(message, 'error');
      }
    }
  };

  // 🔴 FIX: Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const buildingTypes = [
    { value: '', label: 'All Types' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office' },
    { value: 'mall', label: 'Mall' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'mixed_use', label: 'Mixed Use' }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      under_construction: 'bg-orange-100 text-orange-800'
    };
    return badges[status] || badges.active;
  };

  const getTypeIcon = (type) => {
    const icons = {
      residential: '🏠',
      commercial: '🏢',
      office: '💼',
      mall: '🛍️',
      hospital: '🏥',
      hotel: '🏨',
      industrial: '🏭',
      mixed_use: '🏬'
    };
    return icons[type] || '🏢';
  };

  if (loading && buildings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
          <p className="text-gray-500 mt-1">Manage all your properties and buildings</p>
        </div>
        {hasPermission('building.create') && (
          <Button onClick={() => navigate('/buildings/new')} className="whitespace-nowrap">
            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Building
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by building name, code, or city..."
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {buildingTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Building Cards */}
      {buildings.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">No buildings found</p>
          <p className="text-gray-400 mb-4">Get started by adding your first building</p>
          {hasPermission('building.create') && (
            <Button variant="primary" onClick={() => navigate('/buildings/new')}>
              + Add Your First Building
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <Card key={building._id} className="hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(building.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
                        <p className="text-xs text-gray-500">{building.code}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(building.status)}`}>
                      {building.status?.replace('_', ' ') || 'Active'}
                    </span>
                  </div>
                  
                  {/* Location */}
                  <div className="mt-3 flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {building.address?.city}, {building.address?.country}
                    </p>
                  </div>
                  
                  {/* Statistics */}
                  <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">{building.statistics?.totalFloors || 0}</p>
                      <p className="text-xs text-gray-500">Floors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{building.statistics?.totalUnits || 0}</p>
                      <p className="text-xs text-gray-500">Units</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-600">{building.statistics?.occupiedUnits || 0}</p>
                      <p className="text-xs text-gray-500">Occupied</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/buildings/${building._id}`)}
                      className="flex-1"
                    >
                      <svg className="w-3 h-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/buildings/${building._id}/floors`)}
                      className="flex-1"
                    >
                      🏢 Floors
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/buildings/${building._id}/units`)}
                      className="flex-1"
                    >
                      📦 Units
                    </Button>
                    {hasPermission('building.update') && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/buildings/${building._id}/edit`)}
                        className="flex-1"
                      >
                        ✏️ Edit
                      </Button>
                    )}
                    {hasPermission('building.delete') && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(building._id, building.name)}
                        className="flex-1"
                      >
                        🗑️ Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Results count */}
          {pagination.total > 0 && (
            <div className="text-center text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} buildings
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BuildingList;