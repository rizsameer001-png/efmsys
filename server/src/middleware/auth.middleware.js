// const jwt = require('jsonwebtoken');
// const User = require('../models/User.model');

// /**
//  * Authentication Middleware
//  * Verifies JWT token and attaches user to request
//  */
// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         error: 'No token provided',
//       });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

//     const user = await User.findById(decoded.userId || decoded.id).select('-password');
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: 'User not found',
//       });
//     }

//     req.user = user;
//     req.userId = user._id;
//     req.userRole = user.role;

//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error.message);
//     return res.status(401).json({
//       success: false,
//       error: 'Invalid or expired token',
//     });
//   }
// };

// // ✅ Make sure protect is defined and exported
// const protect = authMiddleware;

// module.exports = {
//   authMiddleware,
//   protect,  // ✅ This must be defined
// };






const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );

    const user = await User.findById(decoded.userId || decoded.id)
      .select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // 🔴 FIX: Convert mongoose document → plain object
    req.user = user.toObject();

    // 🔴 FIX: Force role to ALWAYS be string
    req.user.role =
      typeof user.role === "string"
        ? user.role
        : user.role?.name || user.role?.role || null;

    // 🔴 FIX: Always use normalized role reference
    req.userId = user._id;
    req.userRole = req.user.role;

    // 🔴 OPTIONAL DEBUG (remove later)
    // console.log("USER ROLE (auth):", req.user.role);

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

// Alias
const protect = authMiddleware;

module.exports = {
  authMiddleware,
  protect,
};







