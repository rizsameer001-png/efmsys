// server/src/routes/v1/building.routes.js
const express = require('express');
const router = express.Router();
const buildingController = require('../../controllers/building.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { roleMiddleware } = require('../../middleware/role.middleware');
const { permissionMiddleware } = require('../../middleware/permission.middleware');

// All routes require authentication
router.use(authMiddleware);

// ==================== BUILDING ROUTES ====================
router.post('/',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.create'),
  buildingController.createBuilding
);

router.get('/',
  permissionMiddleware('building.read'),
  buildingController.getBuildings
);

router.get('/:id',
  permissionMiddleware('building.read'),
  buildingController.getBuildingById
);

router.put('/:id',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.update'),
  buildingController.updateBuilding
);

router.delete('/:id',
  roleMiddleware(['super_admin']),
  permissionMiddleware('building.delete'),
  buildingController.deleteBuilding
);

// Building Hierarchy
router.get('/:id/hierarchy',
  permissionMiddleware('building.read'),
  buildingController.getBuildingHierarchy
);

// Floors
router.get('/:buildingId/floors',
  permissionMiddleware('building.read'),
  buildingController.getFloors
);

// Unit Type Summary
router.get('/:buildingId/unit-summary',
  permissionMiddleware('building.read'),
  buildingController.getUnitTypeSummary
);

// ==================== UNIT ROUTES ====================
router.post('/units',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.create'),
  buildingController.createUnit
);

router.get('/units/building/:buildingId',
  permissionMiddleware('building.read'),
  buildingController.getUnitsByBuilding
);

router.get('/units/:id',
  permissionMiddleware('building.read'),
  buildingController.getUnitById
);

router.put('/units/:id',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.update'),
  buildingController.updateUnit
);

router.delete('/units/:id',
  roleMiddleware(['super_admin']),
  permissionMiddleware('building.delete'),
  buildingController.deleteUnit
);

// Bulk Operations
router.post('/units/bulk-import/:buildingId',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.create'),
  buildingController.bulkImportUnits
);

router.get('/units/export/:buildingId',
  permissionMiddleware('building.read'),
  buildingController.exportUnits
);

// Owner & Tenant Assignment
router.post('/units/:unitId/assign-owner',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.update'),
  buildingController.assignOwnerToUnit
);

router.post('/units/:unitId/assign-tenant',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.update'),
  buildingController.assignTenantToUnit
);

router.delete('/units/:unitId/remove-tenant',
  roleMiddleware(['super_admin', 'admin']),
  permissionMiddleware('building.update'),
  buildingController.removeTenant
);

module.exports = router;