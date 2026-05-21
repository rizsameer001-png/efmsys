/**
 * GEOFENCE MANAGEMENT ROUTES
 * Handles geofence CRUD and location validation
 */

const express = require('express');
const router = express.Router();
const geofenceController = require('../../controllers/geofence.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { roleMiddleware } = require('../../middleware/role.middleware');

router.use(authMiddleware);

// Geofence CRUD
router.post('/',
  roleMiddleware(['admin', 'super_admin']),
  geofenceController.createGeofence
);

router.get('/',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  geofenceController.getGeofences
);

router.get('/:id',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  geofenceController.getGeofenceById
);

router.put('/:id',
  roleMiddleware(['admin', 'super_admin']),
  geofenceController.updateGeofence
);

router.delete('/:id',
  roleMiddleware(['admin', 'super_admin']),
  geofenceController.deleteGeofence
);

// Geofence validation
router.post('/check',
  roleMiddleware(['technician', 'supervisor', 'manager']),
  geofenceController.checkLocation
);

router.get('/building/:buildingId',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  geofenceController.getGeofencesByBuilding
);

module.exports = router;