// server/src/services/token.service.js
const crypto = require('crypto');
const redisClient = require('../config/redis');

class TokenService {
  // Generate OTP
  generateOTP(length = 6) {
    return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
  }

  // Store OTP in Redis
  async storeOTP(key, otp, expirySeconds = 300) {
    await redisClient.setex(`otp:${key}`, expirySeconds, otp);
    return true;
  }

  // Verify OTP
  async verifyOTP(key, otp) {
    const storedOTP = await redisClient.get(`otp:${key}`);
    if (!storedOTP || storedOTP !== otp) {
      return false;
    }
    await redisClient.del(`otp:${key}`);
    return true;
  }

  // Generate Invite Token
  generateInviteToken(email, role, expiresIn = 7 * 24 * 60 * 60) {
    const payload = {
      email,
      role,
      expires: Date.now() + expiresIn * 1000,
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  // Verify Invite Token
  verifyInviteToken(token) {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      if (payload.expires < Date.now()) {
        return { valid: false, error: 'Token expired' };
      }
      return { valid: true, data: payload };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }
}

module.exports = new TokenService();