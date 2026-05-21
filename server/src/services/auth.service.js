// server/src/services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

class AuthService {
  // Generate JWT Tokens
  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'fms_super_secret_key_2024',
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      process.env.JWT_REFRESH_SECRET || 'fms_refresh_secret_key_2024',
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }

  // Login
  async login(email, password, ipAddress) {
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found:', email);
      throw new Error('Invalid credentials');
    }

    console.log('User found:', user.email, 'Role:', user.role);
    console.log('User status:', user.status);

    if (user.status !== 'active') {
      console.log('User not active:', user.status);
      throw new Error(`Account is ${user.status}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for:', email);
      throw new Error('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    user.lastLoginIP = ipAddress;
    await user.save();

    const { accessToken, refreshToken } = this.generateTokens(user._id, user.role);

    const userData = user.toObject();
    delete userData.password;

    console.log('Login successful for:', email);
    
    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  // Refresh Access Token
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fms_refresh_secret_key_2024');
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