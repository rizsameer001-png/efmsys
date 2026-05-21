/**
 * BUILDING ROUTES
 * Handles all building-related API endpoints
 * Features: CRUD operations, Unit management, Owner/Tenant assignment
 */

// const express = require('express');
// const router = express.Router();

// // Import middleware safely (handles both export types)
// const authMiddlewareFile = require('../../middleware/auth.middleware');
// const roleMiddlewareFile = require('../../middleware/role.middleware');

// // Get protect function (handles default + named exports)
// const protect = authMiddlewareFile.protect || authMiddlewareFile;
// const roleMiddleware = roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;
// const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile;

// // Fallback middleware if imports fail
// const safeProtect = (req, res, next) => {
//   if (typeof protect === 'function') {
//     return protect(req, res, next);
//   }
//   console.warn('⚠️ Using fallback auth for building routes');
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'super_admin', name: 'Dev User' };
//     req.userId = 'dev-user';
//     req.userRole = 'super_admin';
//     return next();
//   }
//   return res.status(401).json({ success: false, error: 'Authentication not configured' });
// };

// // Safe role checker
// const checkRole = (allowedRoles) => {
//   return (req, res, next) => {
//     if (typeof authorize === 'function') {
//       return authorize(allowedRoles)(req, res, next);
//     }
//     if (typeof roleMiddleware === 'function') {
//       return roleMiddleware(allowedRoles)(req, res, next);
//     }
//     console.warn('⚠️ roleMiddleware not available, allowing access');
//     next();
//   };
// };

// // All routes require authentication
// router.use(safeProtect);

// // ==================== BUILDING ROUTES ====================

// // Create Building
// router.post('/', checkRole(['super_admin', 'admin']), createBuilding);

// // Get All Buildings
// router.get('/', getBuildings);

// // Get Building by ID
// router.get('/:id', getBuildingById);

// // Update Building
// router.put('/:id', checkRole(['super_admin', 'admin']), updateBuilding);

// // Delete Building
// router.delete('/:id', checkRole(['super_admin']), deleteBuilding);

// // Building Hierarchy
// router.get('/:id/hierarchy', getBuildingHierarchy);

// // Get Floors
// router.get('/:buildingId/floors', getFloors);

// // Get Unit Type Summary
// router.get('/:buildingId/unit-summary', getUnitTypeSummary);

// // ==================== UNIT ROUTES ====================

// // Create Unit
// router.post('/units', checkRole(['super_admin', 'admin']), createUnit);

// // Get Units by Building
// router.get('/units/building/:buildingId', getUnitsByBuilding);

// // Get Unit by ID
// router.get('/units/:id', getUnitById);

// // Update Unit
// router.put('/units/:id', checkRole(['super_admin', 'admin']), updateUnit);

// // Delete Unit
// router.delete('/units/:id', checkRole(['super_admin']), deleteUnit);

// // Bulk Import Units
// router.post('/units/bulk-import/:buildingId', checkRole(['super_admin', 'admin']), bulkImportUnits);

// // Export Units
// router.get('/units/export/:buildingId', getUnitsByBuilding, exportUnits);

// // Owner & Tenant Assignment
// router.post('/units/:unitId/assign-owner', checkRole(['super_admin', 'admin']), assignOwnerToUnit);
// router.post('/units/:unitId/assign-tenant', checkRole(['super_admin', 'admin']), assignTenantToUnit);
// router.delete('/units/:unitId/remove-tenant', checkRole(['super_admin', 'admin']), removeTenant);

// module.exports = router;


/**
 * BUILDING ROUTES
 * Handles all building-related API endpoints
 * Features: CRUD operations, Unit management, Owner/Tenant assignment
 */

// const express = require('express');
// const router = express.Router();

// // Import middleware safely (handles both export types)
// const authMiddlewareFile = require('../../middleware/auth.middleware');
// const roleMiddlewareFile = require('../../middleware/role.middleware');

// // ✅ IMPORT THE CONTROLLER
// const buildingController = require('../../controllers/building.controller');

// // Destructure controller functions
// const {
//   // Building CRUD
//   createBuilding,
//   getBuildings,
//   getBuildingById,
//   updateBuilding,
//   deleteBuilding,
//   getBuildingHierarchy,
//   getFloors,
//   getUnitTypeSummary,
  
//   // Unit Management
//   createUnit,
//   getUnitsByBuilding,
//   getUnitById,
//   updateUnit,
//   deleteUnit,
  
//   // Owner & Tenant Assignment
//   assignOwnerToUnit,
//   assignTenantToUnit,
//   removeTenant,
  
//   // Bulk Operations
//   bulkImportUnits,
//   exportUnits
// } = buildingController;

// // Get protect function (handles default + named exports)
// const protect = authMiddlewareFile.protect || authMiddlewareFile;
// const roleMiddleware = roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;
// const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile;

// // Fallback middleware if imports fail
// const safeProtect = (req, res, next) => {
//   if (typeof protect === 'function') {
//     return protect(req, res, next);
//   }
//   console.warn('⚠️ Using fallback auth for building routes');
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'super_admin', name: 'Dev User' };
//     req.userId = 'dev-user';
//     req.userRole = 'super_admin';
//     return next();
//   }
//   return res.status(401).json({ success: false, error: 'Authentication not configured' });
// };

// // Safe role checker
// const checkRole = (allowedRoles) => {
//   return (req, res, next) => {
//     if (typeof authorize === 'function') {
//       return authorize(allowedRoles)(req, res, next);
//     }
//     if (typeof roleMiddleware === 'function') {
//       return roleMiddleware(allowedRoles)(req, res, next);
//     }
//     console.warn('⚠️ roleMiddleware not available, allowing access');
//     next();
//   };
// };

// // Debug - verify controller functions are loaded
// console.log('✅ Building Controller loaded, methods:', Object.keys(buildingController).length);
// console.log('   - createBuilding:', typeof createBuilding === 'function');
// console.log('   - getBuildings:', typeof getBuildings === 'function');

// // All routes require authentication
// router.use(safeProtect);

// // ==================== BUILDING ROUTES ====================

// // Create Building
// router.post('/', checkRole(['super_admin', 'admin']), createBuilding);

// // Get All Buildings
// router.get('/', getBuildings);

// // Get Building by ID
// router.get('/:id', getBuildingById);

// // Update Building
// router.put('/:id', checkRole(['super_admin', 'admin']), updateBuilding);

// // Delete Building
// router.delete('/:id', checkRole(['super_admin']), deleteBuilding);

// // Building Hierarchy
// router.get('/:id/hierarchy', getBuildingHierarchy);

// // Get Floors
// router.get('/:buildingId/floors', getFloors);

// // Get Unit Type Summary
// router.get('/:buildingId/unit-summary', getUnitTypeSummary);

// // ==================== UNIT ROUTES ====================

// // Create Unit
// router.post('/units', checkRole(['super_admin', 'admin']), createUnit);

// // Get Units by Building
// router.get('/units/building/:buildingId', getUnitsByBuilding);

// // Get Unit by ID
// router.get('/units/:id', getUnitById);

// // Update Unit
// router.put('/units/:id', checkRole(['super_admin', 'admin']), updateUnit);

// // Delete Unit
// router.delete('/units/:id', checkRole(['super_admin']), deleteUnit);

// // Bulk Import Units
// router.post('/units/bulk-import/:buildingId', checkRole(['super_admin', 'admin']), bulkImportUnits);

// // Export Units
// router.get('/units/export/:buildingId', getUnitsByBuilding, exportUnits);

// // Owner & Tenant Assignment
// router.post('/units/:unitId/assign-owner', checkRole(['super_admin', 'admin']), assignOwnerToUnit);
// router.post('/units/:unitId/assign-tenant', checkRole(['super_admin', 'admin']), assignTenantToUnit);
// router.delete('/units/:unitId/remove-tenant', checkRole(['super_admin', 'admin']), removeTenant);

// module.exports = router;


// /**
//  * BUILDING ROUTES
//  * Handles all building-related API endpoints
//  * Features: CRUD operations, Unit management, Owner/Tenant assignment
//  */

// const express = require('express');
// const router = express.Router();

// // Import middleware safely (handles both export types)
// const authMiddlewareFile = require('../../middleware/auth.middleware');
// const roleMiddlewareFile = require('../../middleware/role.middleware');

// // ✅ IMPORT THE CONTROLLER
// const buildingController = require('../../controllers/building.controller');

// // Destructure controller functions
// const {
//   // Building CRUD
//   createBuilding,
//   getBuildings,
//   getBuildingById,
//   updateBuilding,
//   deleteBuilding,
//   getBuildingHierarchy,
//   getFloors,
//   getUnitTypeSummary,
  
//   // Unit Management
//   createUnit,
//   getUnitsByBuilding,
//   getUnitById,
//   updateUnit,
//   deleteUnit,
  
//   // Owner & Tenant Assignment
//   assignOwnerToUnit,
//   assignTenantToUnit,
//   removeTenant,
  
//   // Bulk Operations
//   bulkImportUnits,
//   exportUnits
// } = buildingController;

// // Get protect function (handles default + named exports)
// const protect = authMiddlewareFile.protect || authMiddlewareFile;
// const roleMiddleware = roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;
// const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile;

// // Fallback middleware if imports fail
// const safeProtect = (req, res, next) => {
//   if (typeof protect === 'function') {
//     return protect(req, res, next);
//   }
//   console.warn('⚠️ Using fallback auth for building routes');
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'super_admin', name: 'Dev User' };
//     req.userId = 'dev-user';
//     req.userRole = 'super_admin';
//     return next();
//   }
//   return res.status(401).json({ success: false, error: 'Authentication not configured' });
// };

// // Safe role checker
// const checkRole = (allowedRoles) => {
//   return (req, res, next) => {
//     if (typeof authorize === 'function') {
//       return authorize(allowedRoles)(req, res, next);
//     }
//     if (typeof roleMiddleware === 'function') {
//       return roleMiddleware(allowedRoles)(req, res, next);
//     }
//     console.warn('⚠️ roleMiddleware not available, allowing access');
//     next();
//   };
// };

// // Debug - verify controller functions are loaded
// console.log('✅ Building Controller loaded, methods:', Object.keys(buildingController).length);
// console.log('   - createBuilding:', typeof createBuilding === 'function');
// console.log('   - getBuildings:', typeof getBuildings === 'function');

// // All routes require authentication
// router.use(safeProtect);

// // ==================== BUILDING ROUTES ====================

// // Create Building
// router.post('/', checkRole(['super_admin', 'admin']), createBuilding);

// // Get All Buildings
// router.get('/', getBuildings);

// // Get Building by ID
// router.get('/:id', getBuildingById);

// // Update Building
// router.put('/:id', checkRole(['super_admin', 'admin']), updateBuilding);

// // Delete Building
// router.delete('/:id', checkRole(['super_admin']), deleteBuilding);

// // Building Hierarchy
// router.get('/:id/hierarchy', getBuildingHierarchy);

// // ✅ FIXED: Get Floors - requires buildingId parameter
// router.get('/:buildingId/floors', getFloors);

// // ✅ FIXED: Get Unit Type Summary - requires buildingId parameter
// router.get('/:buildingId/unit-summary', getUnitTypeSummary);

// // ==================== UNIT ROUTES ====================

// // Create Unit
// router.post('/units', checkRole(['super_admin', 'admin']), createUnit);

// // Get Units by Building
// router.get('/units/building/:buildingId', getUnitsByBuilding);

// // Get Unit by ID
// router.get('/units/:id', getUnitById);

// // Update Unit
// router.put('/units/:id', checkRole(['super_admin', 'admin']), updateUnit);

// // Delete Unit
// router.delete('/units/:id', checkRole(['super_admin']), deleteUnit);

// // Bulk Import Units
// router.post('/units/bulk-import/:buildingId', checkRole(['super_admin', 'admin']), bulkImportUnits);

// // Export Units
// router.get('/units/export/:buildingId', exportUnits);

// // Owner & Tenant Assignment
// router.post('/units/:unitId/assign-owner', checkRole(['super_admin', 'admin']), assignOwnerToUnit);
// router.post('/units/:unitId/assign-tenant', checkRole(['super_admin', 'admin']), assignTenantToUnit);
// router.delete('/units/:unitId/remove-tenant', checkRole(['super_admin', 'admin']), removeTenant);

// // ✅ ADD THIS: Temporary routes to handle frontend calls without buildingId
// // These will be removed once frontend is updated to include buildingId
// router.get('/floors', async (req, res) => {
//   try {
//     // Get first building or return empty array
//     const firstBuilding = await Building.findOne();
//     if (!firstBuilding) {
//       return res.json({ success: true, data: [] });
//     }
//     // Call the actual getFloors function with the first building
//     req.params.buildingId = firstBuilding._id;
//     await getFloors(req, res);
//   } catch (error) {
//     res.json({ success: true, data: [] });
//   }
// });

// router.get('/units', async (req, res) => {
//   try {
//     // Get first building or return empty array
//     const firstBuilding = await Building.findOne();
//     if (!firstBuilding) {
//       return res.json({ success: true, data: { units: [], pagination: { total: 0 } } });
//     }
//     // Call the actual getUnitsByBuilding function
//     req.params.buildingId = firstBuilding._id;
//     await getUnitsByBuilding(req, res);
//   } catch (error) {
//     res.json({ success: true, data: { units: [], pagination: { total: 0 } } });
//   }
// });

// module.exports = router;


// /**
//  * BUILDING ROUTES
//  * Handles all building-related API endpoints
//  */

// const express = require('express');
// const router = express.Router();

// // Import middleware safely
// const authMiddlewareFile = require('../../middleware/auth.middleware');
// const roleMiddlewareFile = require('../../middleware/role.middleware');

// // ✅ IMPORT THE CONTROLLER
// const buildingController = require('../../controllers/building.controller');

// // Destructure controller functions
// const {
//   createBuilding,
//   getBuildings,
//   getBuildingById,
//   updateBuilding,
//   deleteBuilding,
//   getBuildingHierarchy,
//   getFloors,
//   getUnitTypeSummary,
//   createUnit,
//   getUnitsByBuilding,
//   getUnitById,
//   updateUnit,
//   deleteUnit,
//   assignOwnerToUnit,
//   assignTenantToUnit,
//   removeTenant,
//   bulkImportUnits,
//   exportUnits,
//   // 🔴 FIX: Added floor management functions
//   addFloor,
//   updateFloor,
//   deleteFloor
// } = buildingController;

// // Get protect function
// const protect = authMiddlewareFile.protect || authMiddlewareFile;
// const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile;

// // Fallback auth
// const safeProtect = (req, res, next) => {
//   if (typeof protect === 'function') {
//     return protect(req, res, next);
//   }
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'super_admin' };
//     req.userId = 'dev-user';
//     return next();
//   }
//   return res.status(401).json({ success: false, error: 'Authentication required' });
// };

// const checkRole = (allowedRoles) => (req, res, next) => {
//   if (typeof authorize === 'function') {
//     return authorize(allowedRoles)(req, res, next);
//   }
//   next();
// };

// router.use(safeProtect);

// // ==================== 🔴 CRITICAL: STATIC ROUTES FIRST (No :id parameter) ====================

// // 🔴 FIX: These catch-all routes return proper error messages
// router.get('/floors', async (req, res) => {
//   res.status(400).json({ 
//     success: false, 
//     error: 'Building ID required. Use /buildings/:buildingId/floors' 
//   });
// });

// router.get('/units', async (req, res) => {
//   res.status(400).json({ 
//     success: false, 
//     error: 'Building ID required. Use /buildings/:buildingId/units' 
//   });
// });

// // ==================== BUILDING CRUD ROUTES ====================
// router.post('/', checkRole(['super_admin', 'admin']), createBuilding);
// router.get('/', getBuildings);
// router.put('/:id', checkRole(['super_admin', 'admin']), updateBuilding);
// router.delete('/:id', checkRole(['super_admin']), deleteBuilding);

// // ==================== 🔴 FLOOR ROUTES (with buildingId) ====================
// // These must come BEFORE the generic /:id route
// router.get('/:buildingId/floors', getFloors);
// router.post('/:buildingId/floors', checkRole(['super_admin', 'admin']), addFloor);
// router.put('/:buildingId/floors/:floorNumber', checkRole(['super_admin', 'admin']), updateFloor);
// router.delete('/:buildingId/floors/:floorNumber', checkRole(['super_admin', 'admin']), deleteFloor);

// // ==================== UNIT ROUTES (with buildingId) ====================
// router.get('/:buildingId/units', getUnitsByBuilding);
// router.get('/:buildingId/unit-summary', getUnitTypeSummary);
// router.post('/:buildingId/units/bulk-import', checkRole(['super_admin', 'admin']), bulkImportUnits);

// // ==================== BUILDING BY ID ROUTES (must come AFTER param routes) ====================
// router.get('/:id', getBuildingById);
// router.get('/:id/hierarchy', getBuildingHierarchy);

// // ==================== UNIT CRUD ROUTES ====================
// router.post('/units', checkRole(['super_admin', 'admin']), createUnit);
// router.get('/units/:id', getUnitById);
// router.put('/units/:id', checkRole(['super_admin', 'admin']), updateUnit);
// router.delete('/units/:id', checkRole(['super_admin', 'admin']), deleteUnit);
// router.get('/units/export/:buildingId', exportUnits);

// // ==================== OWNER & TENANT ASSIGNMENT ====================
// router.post('/units/:unitId/assign-owner', checkRole(['super_admin', 'admin']), assignOwnerToUnit);
// router.post('/units/:unitId/assign-tenant', checkRole(['super_admin', 'admin']), assignTenantToUnit);
// router.delete('/units/:unitId/remove-tenant', checkRole(['super_admin', 'admin']), removeTenant);

// module.exports = router;


/**
 * BUILDING ROUTES
 * Handles all building-related API endpoints
 */

// const express = require('express');
// const router = express.Router();

// // Import middleware
// const authMiddlewareFile = require('../../middleware/auth.middleware');
// const roleMiddlewareFile = require('../../middleware/role.middleware');

// // Import controller
// const buildingController = require('../../controllers/building.controller');

// // Destructure controller functions
// const {
//   createBuilding,
//   getBuildings,
//   getBuildingById,
//   updateBuilding,
//   deleteBuilding,
//   getBuildingHierarchy,
//   getFloors,
//   getUnitTypeSummary,
//   createUnit,
//   getUnitsByBuilding,
//   getUnitById,
//   updateUnit,
//   deleteUnit,
//   assignOwnerToUnit,
//   assignTenantToUnit,
//   removeTenant,
//   bulkImportUnits,
//   exportUnits,
//   addFloor,
//   updateFloor,
//   deleteFloor
// } = buildingController;

// // Get protect function
// const protect = authMiddlewareFile.protect || authMiddlewareFile;
// const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile;

// // Fallback auth
// const safeProtect = (req, res, next) => {
//   if (typeof protect === 'function') {
//     return protect(req, res, next);
//   }
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'super_admin' };
//     req.userId = 'dev-user';
//     return next();
//   }
//   return res.status(401).json({ success: false, error: 'Authentication required' });
// };

// const checkRole = (allowedRoles) => (req, res, next) => {
//   if (typeof authorize === 'function') {
//     return authorize(allowedRoles)(req, res, next);
//   }
//   next();
// };

// router.use(safeProtect);

// // ==================== 🔴 CRITICAL: STATIC ROUTES FIRST ====================

// // 🔴 FIX: Return proper error for missing buildingId
// router.get('/floors', (req, res) => {
//   res.status(400).json({ 
//     success: false, 
//     error: 'Building ID is required. Use /buildings/:buildingId/floors' 
//   });
// });

// router.get('/units', (req, res) => {
//   res.status(400).json({ 
//     success: false, 
//     error: 'Building ID is required. Use /buildings/:buildingId/units' 
//   });
// });

// // ==================== BUILDING CRUD ====================
// router.post('/', checkRole(['super_admin', 'admin']), createBuilding);
// router.get('/', getBuildings);
// router.put('/:id', checkRole(['super_admin', 'admin']), updateBuilding);
// router.delete('/:id', checkRole(['super_admin']), deleteBuilding);

// // ==================== 🔴 FLOOR ROUTES (with buildingId) ====================
// // These MUST come before the generic /:id route
// router.get('/:buildingId/floors', getFloors);
// router.post('/:buildingId/floors', checkRole(['super_admin', 'admin']), addFloor);
// router.put('/:buildingId/floors/:floorNumber', checkRole(['super_admin', 'admin']), updateFloor);
// router.delete('/:buildingId/floors/:floorNumber', checkRole(['super_admin', 'admin']), deleteFloor);

// // ==================== UNIT ROUTES (with buildingId) ====================
// router.get('/:buildingId/units', getUnitsByBuilding);
// router.get('/:buildingId/unit-summary', getUnitTypeSummary);
// router.post('/:buildingId/units/bulk-import', checkRole(['super_admin', 'admin']), bulkImportUnits);

// // ==================== BUILDING BY ID ROUTES ====================
// router.get('/:id', getBuildingById);
// router.get('/:id/hierarchy', getBuildingHierarchy);

// // ==================== UNIT CRUD ====================
// router.post('/units', checkRole(['super_admin', 'admin']), createUnit);
// router.get('/units/:id', getUnitById);
// router.put('/units/:id', checkRole(['super_admin', 'admin']), updateUnit);
// router.delete('/units/:id', checkRole(['super_admin', 'admin']), deleteUnit);
// router.get('/units/export/:buildingId', exportUnits);

// // ==================== OWNER & TENANT ASSIGNMENT ====================
// router.post('/units/:unitId/assign-owner', checkRole(['super_admin', 'admin']), assignOwnerToUnit);
// router.post('/units/:unitId/assign-tenant', checkRole(['super_admin', 'admin']), assignTenantToUnit);
// router.delete('/units/:unitId/remove-tenant', checkRole(['super_admin', 'admin']), removeTenant);

// module.exports = router;



/**
 * BUILDING ROUTES
 * Handles all building-related API endpoints
 */

const express = require('express');
const router = express.Router();

// Import middleware
const authMiddlewareFile = require('../../middleware/auth.middleware');
const roleMiddlewareFile = require('../../middleware/role.middleware');

// Import controller
const buildingController = require('../../controllers/building.controller');

// Destructure controller functions
const {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  getBuildingHierarchy,
  getFloors,
  getUnitTypeSummary,
  createUnit,
  getUnitsByBuilding,
  getUnitById,
  updateUnit,
  deleteUnit,
  assignOwnerToUnit,
  assignTenantToUnit,
  removeTenant,
  bulkImportUnits,
  exportUnits,
  addFloor,
  updateFloor,
  deleteFloor
} = buildingController;

// Get protect function
const protect = authMiddlewareFile.protect || authMiddlewareFile;
const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile;

// Fallback auth
const safeProtect = (req, res, next) => {
  if (typeof protect === 'function') {
    return protect(req, res, next);
  }
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dev-user', role: 'super_admin' };
    req.userId = 'dev-user';
    return next();
  }
  return res.status(401).json({ success: false, error: 'Authentication required' });
};

const checkRole = (allowedRoles) => (req, res, next) => {
  if (typeof authorize === 'function') {
    return authorize(allowedRoles)(req, res, next);
  }
  next();
};

router.use(safeProtect);

// ==================== 🔴 CRITICAL: STATIC ROUTES FIRST ====================

// 🔴 FIX: Return proper error for missing buildingId
router.get('/floors', (req, res) => {
  res.status(400).json({ 
    success: false, 
    error: 'Building ID is required. Use /buildings/:buildingId/floors' 
  });
});

router.get('/units', (req, res) => {
  res.status(400).json({ 
    success: false, 
    error: 'Building ID is required. Use /buildings/:buildingId/units' 
  });
});

// ==================== BUILDING CRUD ====================
router.post('/', checkRole(['super_admin', 'admin']), createBuilding);
router.get('/', getBuildings);
router.put('/:id', checkRole(['super_admin', 'admin']), updateBuilding);
router.delete('/:id', checkRole(['super_admin']), deleteBuilding);

// ==================== 🔴 FLOOR ROUTES (with buildingId) ====================
// These MUST come before the generic /:id route
router.get('/:buildingId/floors', getFloors);
router.post('/:buildingId/floors', checkRole(['super_admin', 'admin']), addFloor);
router.put('/:buildingId/floors/:floorNumber', checkRole(['super_admin', 'admin']), updateFloor);
router.delete('/:buildingId/floors/:floorNumber', checkRole(['super_admin', 'admin']), deleteFloor);

// ==================== UNIT ROUTES (with buildingId) ====================
router.get('/:buildingId/units', getUnitsByBuilding);
router.get('/:buildingId/unit-summary', getUnitTypeSummary);
router.post('/:buildingId/units/bulk-import', checkRole(['super_admin', 'admin']), bulkImportUnits);

// ==================== BUILDING BY ID ROUTES ====================
router.get('/:id', getBuildingById);
router.get('/:id/hierarchy', getBuildingHierarchy);

// ==================== UNIT CRUD ====================
router.post('/units', checkRole(['super_admin', 'admin']), createUnit);
router.get('/units/:id', getUnitById);
router.put('/units/:id', checkRole(['super_admin', 'admin']), updateUnit);
router.delete('/units/:id', checkRole(['super_admin', 'admin']), deleteUnit);
router.get('/units/export/:buildingId', exportUnits);

// ==================== OWNER & TENANT ASSIGNMENT ====================
router.post('/units/:unitId/assign-owner', checkRole(['super_admin', 'admin']), assignOwnerToUnit);
router.post('/units/:unitId/assign-tenant', checkRole(['super_admin', 'admin']), assignTenantToUnit);
router.delete('/units/:unitId/remove-tenant', checkRole(['super_admin', 'admin']), removeTenant);

module.exports = router;