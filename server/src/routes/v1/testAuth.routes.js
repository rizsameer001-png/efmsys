// server/src/routes/v1/testAuth.routes.js
// const express = require('express');
// const router = express.Router();
// const testAuthController = require('../../controllers/testAuth.controller');
// const authMiddleware = require('../../middleware/auth.middleware');

// // Public routes
// router.post('/register', testAuthController.register);
// router.post('/login', testAuthController.login);

// // Protected route
// router.get('/me', authMiddleware, testAuthController.getMe);

// module.exports = router;

/**
 * TEST AUTH ROUTES
 * Handles test authentication for development and testing
 */

const express = require('express');
const router = express.Router();

// ✅ FIXED: Import middleware correctly
const authMiddlewareFile = require('../../middleware/auth.middleware');

// ✅ Get the actual middleware functions
const protect = authMiddlewareFile.protect || authMiddlewareFile;

// ✅ Fallback middleware if imports fail
const safeProtect = (req, res, next) => {
  if (typeof protect === 'function') {
    return protect(req, res, next);
  }
  console.warn('⚠️ Using fallback auth for test auth routes');
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dev-user', role: 'customer', name: 'Test User' };
    req.userId = 'dev-user';
    req.userRole = 'customer';
    return next();
  }
  return res.status(401).json({ success: false, error: 'Authentication not configured' });
};

const testAuthController = require('../../controllers/testAuth.controller');

// ==================== PUBLIC ROUTES ====================

// Register new user
router.post('/register', testAuthController.register);

// Login user
router.post('/login', testAuthController.login);

// ==================== PROTECTED ROUTES ====================

// Get current user info (requires authentication)
router.get('/me', safeProtect, testAuthController.getMe);

module.exports = router;