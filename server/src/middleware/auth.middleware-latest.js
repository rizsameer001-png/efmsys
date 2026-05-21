const jwt = require('jsonwebtoken');
const User = require('../models/User.model'); // ✅ Fixed: Changed from 'user.model' to 'User.model'

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Attach user info to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

/**
 * ✅ NEW: Protect middleware (alias for authMiddleware - used in routes)
 * This is the same as authMiddleware, just a different name
 */
const protect = authMiddleware;

/**
 * ✅ NEW: Optional auth middleware - doesn't throw error if no token
 * Use this for routes that can work with or without authentication
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId || decoded.id).select('-password');
      
      if (user) {
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;
      }
    }
    
    next();
  } catch (error) {
    // Just continue without user
    next();
  }
};

/**
 * ✅ NEW: Restrict to specific roles (can be used after protect)
 * @param {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  protect,           // ✅ Used in routes (alias for authMiddleware)
  optionalAuth,      // ✅ For optional authentication
  restrictTo,        // ✅ For role restriction after auth
};