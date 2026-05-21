// server/src/utils/jwt.js
const jwt = require('jsonwebtoken');

/**
 * Generate Access Token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '7d' }
  );
};

/**
 * Generate Refresh Token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '30d' }
  );
};

/**
 * Verify Access Token
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload or error
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Verify Refresh Token
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload or error
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Decode Token (without verification)
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate Email Verification Token
 * @param {string} email - User email
 * @returns {string} Verification token
 */
const generateEmailVerificationToken = (email) => {
  return jwt.sign(
    { email, type: 'email_verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Generate Password Reset Token
 * @param {string} email - User email
 * @returns {string} Reset token
 */
const generatePasswordResetToken = (email) => {
  return jwt.sign(
    { email, type: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Generate Invite Token
 * @param {Object} data - Invite data { email, role, buildingId }
 * @returns {string} Invite token
 */
const generateInviteToken = (data) => {
  return jwt.sign(
    { ...data, type: 'invite' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify Invite Token
 * @param {string} token - Invite token
 * @returns {Object} Decoded data or error
 */
const verifyInviteToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'invite') {
      return { valid: false, error: 'Invalid token type' };
    }
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Generate OTP Token (for 2FA)
 * @param {string} userId - User ID
 * @param {string} otp - One-time password
 * @returns {string} OTP token
 */
const generateOTPToken = (userId, otp) => {
  return jwt.sign(
    { userId, otp, type: 'otp' },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateInviteToken,
  verifyInviteToken,
  generateOTPToken,
};