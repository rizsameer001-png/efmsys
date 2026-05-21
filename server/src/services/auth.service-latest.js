// server/src/services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

class AuthService {
  // Generate JWT Tokens
  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }

  // Refresh Access Token
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
      const user = await User.findById(decoded.userId);
      
      if (!user || user.status !== 'active') {
        throw new Error('User not found or inactive');
      }

      const { accessToken } = this.generateTokens(user._id, user.role);
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Login
  async login(email, password, ipAddress) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new Error(`Account is ${user.status}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    user.lastLoginIP = ipAddress;
    await user.save();

    const { accessToken, refreshToken } = this.generateTokens(user._id, user.role);

    const userData = user.toObject();
    delete userData.password;

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  // Logout
  async logout(userId, refreshToken) {
    return { success: true };
  }

  // Change Password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { success: true };
  }

  // Forgot Password
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: true };
    }
    return { success: true };
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    return { success: true };
  }
}

module.exports = new AuthService();