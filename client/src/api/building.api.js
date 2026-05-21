// // client/src/api/building.api.js
// import api from './axios.config';

// export const buildingApi = {
//   // Building CRUD
//   getBuildings: (params = {}) => {
//     return api.get('/buildings', { params });
//   },
  
//   getBuildingById: (id) => {
//     return api.get(`/buildings/${id}`);
//   },
  
//   createBuilding: (data) => {
//     return api.post('/buildings', data);
//   },
  
//   updateBuilding: (id, data) => {
//     return api.put(`/buildings/${id}`, data);
//   },
  
//   deleteBuilding: (id) => {
//     return api.delete(`/buildings/${id}`);
//   },
  
//   // Building Hierarchy
//   getBuildingHierarchy: (id) => {
//     return api.get(`/buildings/${id}/hierarchy`);
//   },
  
//   getFloors: (buildingId) => {
//     return api.get(`/buildings/${buildingId}/floors`);
//   },
  
//   getUnitTypeSummary: (buildingId) => {
//     return api.get(`/buildings/${buildingId}/unit-summary`);
//   },
  
//   // Unit CRUD
//   getUnitsByBuilding: (buildingId, params = {}) => {
//     return api.get(`/buildings/units/building/${buildingId}`, { params });
//   },
  
//   getUnitById: (id) => {
//     return api.get(`/buildings/units/${id}`);
//   },
  
//   createUnit: (data) => {
//     return api.post('/buildings/units', data);
//   },
  
//   updateUnit: (id, data) => {
//     return api.put(`/buildings/units/${id}`, data);
//   },
  
//   deleteUnit: (id) => {
//     return api.delete(`/buildings/units/${id}`);
//   },
  
//   // Bulk Operations
//   bulkImportUnits: (buildingId, units) => {
//     return api.post(`/buildings/units/bulk-import/${buildingId}`, { units });
//   },
  
//   exportUnits: (buildingId) => {
//     return api.get(`/buildings/units/export/${buildingId}`);
//   },
  
//   // Owner & Tenant Assignment
//   assignOwnerToUnit: (unitId, data) => {
//     return api.post(`/buildings/units/${unitId}/assign-owner`, data);
//   },
  
//   assignTenantToUnit: (unitId, data) => {
//     return api.post(`/buildings/units/${unitId}/assign-tenant`, data);
//   },
  
//   removeTenant: (unitId) => {
//     return api.delete(`/buildings/units/${unitId}/remove-tenant`);
//   }
// };



// // client/src/api/building.api.js
// import api from './axios.config';

// export const buildingApi = {
//   // Building CRUD
//   getBuildings: (params = {}) => {
//     return api.get('/buildings', { params });
//   },
  
//   getBuildingById: (id) => {
//     return api.get(`/buildings/${id}`);
//   },
  
//   createBuilding: (data) => {
//     return api.post('/buildings', data);
//   },
  
//   updateBuilding: (id, data) => {
//     return api.put(`/buildings/${id}`, data);
//   },
  
//   deleteBuilding: (id) => {
//     return api.delete(`/buildings/${id}`);
//   },
  
//   // 🔴 FIX 1: Building Hierarchy
//   getBuildingHierarchy: (id) => {
//     return api.get(`/buildings/${id}/hierarchy`);
//   },
  
//   // 🔴 FIX 2: Floor Management - Fixed endpoint
//   getFloors: (buildingId) => {
//     return api.get(`/buildings/${buildingId}/floors`);
//   },
  
//   // 🔴 FIX 3: Add Floor - New method
//   addFloor: (buildingId, floorData) => {
//     return api.post(`/buildings/${buildingId}/floors`, floorData);
//   },
  
//   // 🔴 FIX 4: Update Floor
//   updateFloor: (buildingId, floorNumber, floorData) => {
//     return api.put(`/buildings/${buildingId}/floors/${floorNumber}`, floorData);
//   },
  
//   // 🔴 FIX 5: Delete Floor
//   deleteFloor: (buildingId, floorNumber) => {
//     return api.delete(`/buildings/${buildingId}/floors/${floorNumber}`);
//   },
  
//   getUnitTypeSummary: (buildingId) => {
//     return api.get(`/buildings/${buildingId}/unit-summary`);
//   },
  
//   // 🔴 FIX 6: Unit CRUD - Fixed endpoints
//   getUnitsByBuilding: (buildingId, params = {}) => {
//     return api.get(`/buildings/${buildingId}/units`, { params });
//   },
  
//   getUnitById: (id) => {
//     return api.get(`/buildings/units/${id}`);
//   },
  
//   createUnit: (data) => {
//     return api.post('/buildings/units', data);
//   },
  
//   updateUnit: (id, data) => {
//     return api.put(`/buildings/units/${id}`, data);
//   },
  
//   deleteUnit: (id) => {
//     return api.delete(`/buildings/units/${id}`);
//   },
  
//   // Bulk Operations
//   bulkImportUnits: (buildingId, units) => {
//     return api.post(`/buildings/${buildingId}/units/bulk-import`, { units });
//   },
  
//   exportUnits: (buildingId) => {
//     return api.get(`/buildings/${buildingId}/units/export`);
//   },
  
//   // Owner & Tenant Assignment
//   assignOwnerToUnit: (unitId, data) => {
//     return api.post(`/buildings/units/${unitId}/assign-owner`, data);
//   },
  
//   assignTenantToUnit: (unitId, data) => {
//     return api.post(`/buildings/units/${unitId}/assign-tenant`, data);
//   },
  
//   removeTenant: (unitId) => {
//     return api.delete(`/buildings/units/${unitId}/remove-tenant`);
//   }
// };


// client/src/api/building.api.js
import api from './axios.config';

export const buildingApi = {
  // ==================== BUILDING CRUD ====================
  getBuildings: (params = {}) => {
    return api.get('/buildings', { params });
  },
  
  getBuildingById: (id) => {
    return api.get(`/buildings/${id}`);
  },
  
  createBuilding: (data) => {
    return api.post('/buildings', data);
  },
  
  updateBuilding: (id, data) => {
    return api.put(`/buildings/${id}`, data);
  },
  
  deleteBuilding: (id) => {
    return api.delete(`/buildings/${id}`);
  },
  
  // ==================== BUILDING HIERARCHY ====================
  getBuildingHierarchy: (id) => {
    return api.get(`/buildings/${id}/hierarchy`);
  },
  
  // ==================== 🔴 FLOOR MANAGEMENT (FIXED) ====================
  // 🔴 FIX: Now requires buildingId parameter - NEVER call without buildingId
  getFloors: (buildingId) => {
    if (!buildingId || buildingId === 'undefined') {
      console.error('getFloors: buildingId is required');
      return Promise.reject(new Error('Building ID is required'));
    }
    return api.get(`/buildings/${buildingId}/floors`);
  },
  
  // 🔴 FIX: Add Floor with validation
  addFloor: (buildingId, floorData) => {
    if (!buildingId || buildingId === 'undefined') {
      console.error('addFloor: buildingId is required');
      return Promise.reject(new Error('Building ID is required'));
    }
    if (!floorData.floorNumber) {
      console.error('addFloor: floorNumber is required');
      return Promise.reject(new Error('Floor number is required'));
    }
    return api.post(`/buildings/${buildingId}/floors`, floorData);
  },
  
  // 🔴 FIX: Update Floor
  updateFloor: (buildingId, floorNumber, floorData) => {
    if (!buildingId || buildingId === 'undefined') {
      return Promise.reject(new Error('Building ID is required'));
    }
    if (!floorNumber) {
      return Promise.reject(new Error('Floor number is required'));
    }
    return api.put(`/buildings/${buildingId}/floors/${floorNumber}`, floorData);
  },
  
  // 🔴 FIX: Delete Floor
  deleteFloor: (buildingId, floorNumber) => {
    if (!buildingId || buildingId === 'undefined') {
      return Promise.reject(new Error('Building ID is required'));
    }
    if (!floorNumber) {
      return Promise.reject(new Error('Floor number is required'));
    }
    return api.delete(`/buildings/${buildingId}/floors/${floorNumber}`);
  },
  
  // ==================== UNIT TYPE SUMMARY ====================
  getUnitTypeSummary: (buildingId) => {
    if (!buildingId || buildingId === 'undefined') {
      return Promise.reject(new Error('Building ID is required'));
    }
    return api.get(`/buildings/${buildingId}/unit-summary`);
  },
  
  // ==================== 🔴 UNIT MANAGEMENT (FIXED) ====================
  // 🔴 FIX: Now requires buildingId parameter in URL
  getUnitsByBuilding: (buildingId, params = {}) => {
    if (!buildingId || buildingId === 'undefined') {
      console.error('getUnitsByBuilding: buildingId is required');
      return Promise.reject(new Error('Building ID is required'));
    }
    return api.get(`/buildings/${buildingId}/units`, { params });
  },
  
  getUnitById: (id) => {
    if (!id) {
      return Promise.reject(new Error('Unit ID is required'));
    }
    return api.get(`/buildings/units/${id}`);
  },
  
  createUnit: (data) => {
    if (!data.buildingId) {
      return Promise.reject(new Error('Building ID is required for unit creation'));
    }
    if (!data.floorNumber) {
      return Promise.reject(new Error('Floor number is required'));
    }
    if (!data.unitNumber) {
      return Promise.reject(new Error('Unit number is required'));
    }
    return api.post('/buildings/units', data);
  },
  
  updateUnit: (id, data) => {
    if (!id) {
      return Promise.reject(new Error('Unit ID is required'));
    }
    return api.put(`/buildings/units/${id}`, data);
  },
  
  deleteUnit: (id) => {
    if (!id) {
      return Promise.reject(new Error('Unit ID is required'));
    }
    return api.delete(`/buildings/units/${id}`);
  },
  
  // ==================== BULK OPERATIONS ====================
  bulkImportUnits: (buildingId, units) => {
    if (!buildingId || buildingId === 'undefined') {
      return Promise.reject(new Error('Building ID is required'));
    }
    if (!units || !Array.isArray(units) || units.length === 0) {
      return Promise.reject(new Error('Units array is required and cannot be empty'));
    }
    return api.post(`/buildings/${buildingId}/units/bulk-import`, { units });
  },
  
  exportUnits: (buildingId) => {
    if (!buildingId || buildingId === 'undefined') {
      return Promise.reject(new Error('Building ID is required'));
    }
    return api.get(`/buildings/${buildingId}/units/export`);
  },
  
  // ==================== OWNER & TENANT ASSIGNMENT ====================
  assignOwnerToUnit: (unitId, data) => {
    if (!unitId) {
      return Promise.reject(new Error('Unit ID is required'));
    }
    if (!data.ownerName && !data.ownerId) {
      return Promise.reject(new Error('Owner name or ID is required'));
    }
    return api.post(`/buildings/units/${unitId}/assign-owner`, data);
  },
  
  assignTenantToUnit: (unitId, data) => {
    if (!unitId) {
      return Promise.reject(new Error('Unit ID is required'));
    }
    if (!data.tenantName && !data.tenantId) {
      return Promise.reject(new Error('Tenant name or ID is required'));
    }
    return api.post(`/buildings/units/${unitId}/assign-tenant`, data);
  },
  
  removeTenant: (unitId) => {
    if (!unitId) {
      return Promise.reject(new Error('Unit ID is required'));
    }
    return api.delete(`/buildings/units/${unitId}/remove-tenant`);
  }
};