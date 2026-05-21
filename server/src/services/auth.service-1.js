// server/src/services/auth.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const { sendEmail } = require('../config/mailer');
const { redisClient, isRedisWorking } = require('../config/redis');

class AuthService {
  // Generate JWT Tokens
  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId, role, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '30d' }
    );

    return { accessToken, refreshToken };
  }

  // Verify Access Token
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Verify Refresh Token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Store refresh token
  async storeRefreshToken(userId, refreshToken) {
    const key = `refresh_token:${userId}`;
    const expiry = 30 * 24 * 60 * 60; // 30 days
    
    if (isRedisWorking && redisClient) {
      await redisClient.setex(key, expiry, refreshToken);
    } else {
      // In-memory fallback
      if (!global.refreshTokens) global.refreshTokens = new Map();
      global.refreshTokens.set(key, { value: refreshToken, expiry: Date.now() + (expiry * 1000) });
    }
  }

  // Get refresh token
  async getRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    
    if (isRedisWorking && redisClient) {
      return await redisClient.get(key);
    } else {
      const token = global.refreshTokens?.get(key);
      if (token && token.expiry > Date.now()) {
        return token.value;
      }
      return null;
    }
  }

  // Remove refresh token
  async removeRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    
    if (isRedisWorking && redisClient) {
      await redisClient.del(key);
    } else {
      global.refreshTokens?.delete(key);
    }
  }

  // Refresh Access Token
  async refreshAccessToken(refreshToken) {
    const { valid, decoded } = this.verifyRefreshToken(refreshToken);
    if (!valid) {
      throw new Error('Invalid refresh token');
    }

    // Check if refresh token exists in store
    const storedToken = await this.getRefreshToken(decoded.userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new Error('Refresh token not found or already used');
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      throw new Error('User not found or inactive');
    }

    const { accessToken } = this.generateTokens(user._id, user.role);
    return { accessToken };
  }

  // Login
  async login(email, password, ipAddress) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked && user.isLocked()) {
      throw new Error('Account is locked. Please try again after 30 minutes');
    }

    // Check status
    if (user.status !== 'active') {
      throw new Error(`Account is ${user.status}. Please contact admin`);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      if (user.incrementLoginAttempts) await user.incrementLoginAttempts();
      throw new Error('Invalid credentials');
    }

    // Reset login attempts on successful login
    if (user.resetLoginAttempts) await user.resetLoginAttempts();

    // Update last login
    user.lastLoginAt = new Date();
    user.lastLoginIP = ipAddress;
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user._id, user.role);

    // Store refresh token
    await this.storeRefreshToken(user._id, refreshToken);

    // Return user without password
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
    // Remove refresh token from store
    await this.removeRefreshToken(userId);
    return { success: true };
  }

  // Change Password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    // Clear all refresh tokens for this user
    await this.removeRefreshToken(userId);

    return { success: true };
  }

  // Forgot Password - Send Reset Email
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist
      return { success: true };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html,
    });

    return { success: true };
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Clear all refresh tokens for this user
    await this.removeRefreshToken(user._id);

    return { success: true };
  }
}

module.exports = new AuthService();