const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');

// Debug: Check what is imported
const authMiddleware = require('../../middleware/auth.middleware');
console.log('Auth middleware exports:', Object.keys(authMiddleware));
console.log('protect exists?', !!authMiddleware.protect);
console.log('authMiddleware type:', typeof authMiddleware);
// Debug: Check if controller methods exist
console.log('✅ Auth Controller loaded, available methods:', Object.keys(authController));

// Try different import methods
let protect;
if (typeof authMiddleware === 'function') {
  // If it's a function (default export)
  protect = authMiddleware;
} else if (authMiddleware.protect) {
  // If it's an object with protect property
  protect = authMiddleware.protect;
} else {
  // Fallback - create a simple middleware
  protect = (req, res, next) => {
    console.log('⚠️ Using fallback auth middleware');
    next();
  };
}

// ==================== PUBLIC ROUTES ====================
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// ==================== PROTECTED ROUTES ====================
router.use(protect);

router.post('/logout', authController.logout);
router.post('/change-password', authController.changePassword);
router.get('/me', authController.getMe);

module.exports = router;


