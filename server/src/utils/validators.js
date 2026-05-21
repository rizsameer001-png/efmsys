// server/src/utils/validators.js

/**
 * Validate Email Format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate Phone Number (International)
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code (optional)
 * @returns {boolean} True if valid
 */
const isValidPhone = (phone, countryCode = null) => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Basic international phone validation
  const phoneRegex = /^[1-9][0-9]{7,14}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Validate Emirates ID (UAE)
 * @param {string} emiratesId - Emirates ID number
 * @returns {boolean} True if valid
 */
const isValidEmiratesID = (emiratesId) => {
  const cleanId = emiratesId.replace(/\D/g, '');
  const idRegex = /^784[0-9]{12,15}$/;
  return idRegex.test(cleanId);
};

/**
 * Validate Passport Number
 * @param {string} passport - Passport number
 * @param {string} country - Country code
 * @returns {boolean} True if valid
 */
const isValidPassport = (passport, country = 'ANY') => {
  // Basic passport validation (alphanumeric, 6-9 characters)
  const passportRegex = /^[A-Z0-9]{6,9}$/;
  return passportRegex.test(passport.toUpperCase());
};

/**
 * Validate Vehicle Plate Number (UAE)
 * @param {string} plate - Plate number
 * @param {string} emirate - Emirate code (DUBAI, ABUDHABI, etc.)
 * @returns {boolean} True if valid
 */
const isValidUAEPlate = (plate, emirate = 'DUBAI') => {
  const plateRegex = /^[0-9]{1,5}\s?[A-Z]{1,3}\s?[0-9]{1,5}$/i;
  return plateRegex.test(plate);
};

/**
 * Validate UUID
 * @param {string} uuid - UUID to validate
 * @returns {boolean} True if valid
 */
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ObjectId to validate
 * @returns {boolean} True if valid
 */
const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate Date
 * @param {string} date - Date string
 * @param {string} format - Expected format (optional)
 * @returns {boolean} True if valid
 */
const isValidDate = (date, format = null) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return false;
  
  if (format) {
    // Simple format check for YYYY-MM-DD
    if (format === 'YYYY-MM-DD') {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(date)) return false;
    }
  }
  
  return true;
};

/**
 * Validate Age (minimum age)
 * @param {Date} birthDate - Birth date
 * @param {number} minAge - Minimum age (default 18)
 * @returns {boolean} True if age meets minimum
 */
const isValidAge = (birthDate, minAge = 18) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge;
};

/**
 * Validate IP Address
 * @param {string} ip - IP address
 * @returns {boolean} True if valid
 */
const isValidIP = (ip) => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

/**
 * Validate Postal/Zip Code
 * @param {string} postalCode - Postal code
 * @param {string} country - Country code
 * @returns {boolean} True if valid
 */
const isValidPostalCode = (postalCode, country = 'US') => {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
    UAE: /^\d{5}$/,
    IN: /^\d{6}$/,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/i,
    AU: /^\d{4}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    JP: /^\d{3}-\d{4}$/,
  };
  
  const pattern = patterns[country] || patterns.US;
  return pattern.test(postalCode);
};

/**
 * Validate Credit Card Number (Luhn algorithm)
 * @param {string} cardNumber - Credit card number
 * @returns {boolean} True if valid
 */
const isValidCreditCard = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Luhn Algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate IBAN (International Bank Account Number)
 * @param {string} iban - IBAN to validate
 * @returns {boolean} True if valid
 */
const isValidIBAN = (iban) => {
  const cleanIBAN = iban.toUpperCase().replace(/\s/g, '');
  
  // Basic format check
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
  if (!ibanRegex.test(cleanIBAN)) return false;
  
  // Move first 4 chars to end
  const rearranged = cleanIBAN.slice(4) + cleanIBAN.slice(0, 4);
  
  // Convert letters to numbers (A=10, B=11, etc.)
  const numericIBAN = rearranged.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return (code - 55).toString();
    }
    return char;
  }).join('');
  
  // Modulo 97 check
  let remainder = numericIBAN;
  while (remainder.length > 2) {
    const chunk = remainder.slice(0, 9);
    remainder = (parseInt(chunk, 10) % 97) + remainder.slice(9);
  }
  
  return parseInt(remainder, 10) % 97 === 1;
};

/**
 * Validate array of emails
 * @param {string[]} emails - Array of emails
 * @returns {Object} Validation result
 */
const validateEmails = (emails) => {
  const valid = [];
  const invalid = [];
  
  emails.forEach(email => {
    if (isValidEmail(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  });
  
  return { valid, invalid, allValid: invalid.length === 0 };
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidEmiratesID,
  isValidPassport,
  isValidUAEPlate,
  isValidUUID,
  isValidObjectId,
  isValidURL,
  isValidDate,
  isValidAge,
  isValidIP,
  isValidPostalCode,
  isValidCreditCard,
  isValidIBAN,
  validateEmails,
  sanitizeInput,
};