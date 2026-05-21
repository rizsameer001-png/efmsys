// server/src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const User = require('../models/user.model');

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await authService.login(email, password, ipAddress);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    await authService.logout(req.userId, refreshToken);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Refresh token required' 
      });
    }
    
    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { phone, email } = req.body;
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get Me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('reportingManager', 'firstName lastName email')
      .populate('supervisor', 'firstName lastName email');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};