// server/src/utils/password.js
const bcrypt = require('bcryptjs');

/**
 * Hash password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if match
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate random password
 * @param {number} length - Password length
 * @param {Object} options - Password options
 * @returns {string} Random password
 */
const generateRandomPassword = (length = 10, options = {}) => {
  const defaults = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  };
  
  const config = { ...defaults, ...options };
  
  let charset = '';
  if (config.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (config.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (config.numbers) charset += '0123456789';
  if (config.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
const validatePasswordStrength = (password) => {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }
  
  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one number');
  }
  
  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one special character');
  }
  
  // Determine strength
  let strength = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return {
    score,
    strength,
    isValid: score >= 3,
    feedback,
  };
};

/**
 * Check if password is commonly used (breached)
 * @param {string} password - Password to check
 * @returns {Promise<boolean>} True if breached
 */
const isPasswordBreached = async (password) => {
  // This would typically call an API like HaveIBeenPwned
  // For now, return false
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', 'admin123', 'welcome', 'letmein',
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

/**
 * Calculate password entropy (bits)
 * @param {string} password - Password to analyze
 * @returns {number} Entropy in bits
 */
const calculateEntropy = (password) => {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33;
  
  return Math.log2(Math.pow(charsetSize, password.length));
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomPassword,
  validatePasswordStrength,
  isPasswordBreached,
  calculateEntropy,
};