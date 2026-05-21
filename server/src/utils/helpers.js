// server/src/utils/helpers.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} Formatted date
 */
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @param {number} length - Random part length
 * @returns {string} Unique ID
 */
const generateUniqueId = (prefix = '', length = 8) => {
  const random = crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
  return prefix ? `${prefix}_${random}` : random;
};

/**
 * Sleep/Delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Paginate results
 * @param {Array} data - Data to paginate
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result
 */
const paginate = (data, page = 1, limit = 20) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {};
  
  if (endIndex < data.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  
  results.data = data.slice(startIndex, endIndex);
  results.total = data.length;
  results.totalPages = Math.ceil(data.length / limit);
  results.currentPage = page;
  
  return results;
};

/**
 * Extract query filters from request
 * @param {Object} query - Request query object
 * @param {Array} allowedFields - Allowed filter fields
 * @returns {Object} Filter object
 */
const extractFilters = (query, allowedFields = []) => {
  const filters = {};
  
  for (const field of allowedFields) {
    if (query[field]) {
      filters[field] = query[field];
    }
  }
  
  // Handle date range filters
  if (query.startDate || query.endDate) {
    filters.createdAt = {};
    if (query.startDate) filters.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filters.createdAt.$lte = new Date(query.endDate);
  }
  
  // Handle search
  if (query.search && allowedFields.includes('search')) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }
  
  return filters;
};

/**
 * Sort data
 * @param {Array} data - Data to sort
 * @param {string} field - Sort field
 * @param {string} order - Sort order (asc/desc)
 * @returns {Array} Sorted data
 */
const sortData = (data, field = 'createdAt', order = 'desc') => {
  return [...data].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places
 * @returns {number} Percentage
 */
const calculatePercentage = (part, total, decimals = 2) => {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(decimals));
};

/**
 * Calculate average from array
 * @param {Array} arr - Array of numbers
 * @returns {number} Average
 */
const calculateAverage = (arr) => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
};

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Group key
 * @returns {Object} Grouped object
 */
const groupBy = (arr, key) => {
  return arr.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Remove null/undefined values from object
 * @param {Object} obj - Object to clean
 * @returns {Object} Cleaned object
 */
const removeNullValues = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Mask sensitive data
 * @param {string} str - String to mask
 * @param {number} visibleStart - Visible characters at start
 * @param {number} visibleEnd - Visible characters at end
 * @param {string} maskChar - Mask character
 * @returns {string} Masked string
 */
const maskString = (str, visibleStart = 2, visibleEnd = 2, maskChar = '*') => {
  if (!str || str.length <= visibleStart + visibleEnd) {
    return str;
  }
  
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const middleLength = str.length - visibleStart - visibleEnd;
  const middle = maskChar.repeat(middleLength);
  
  return start + middle + end;
};

/**
 * Mask email
 * @param {string} email - Email to mask
 * @returns {string} Masked email
 */
const maskEmail = (email) => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedLocal = local.length > 2
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : local[0] + '*';
  
  return `${maskedLocal}@${domain}`;
};

/**
 * Mask phone number
 * @param {string} phone - Phone number to mask
 * @returns {string} Masked phone
 */
const maskPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 6) return phone;
  
  const start = cleanPhone.slice(0, 3);
  const end = cleanPhone.slice(-3);
  const masked = '*'.repeat(cleanPhone.length - 6);
  
  return `${start}${masked}${end}`;
};

/**
 * Parse CSV string to array
 * @param {string} csvString - CSV string
 * @param {string} delimiter - Delimiter
 * @returns {Array} Parsed CSV
 */
const parseCSV = (csvString, delimiter = ',') => {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(delimiter).map(h => h.trim());
  
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index]?.trim() || '';
    });
    result.push(obj);
  }
  
  return result;
};

/**
 * Convert array to CSV string
 * @param {Array} data - Array of objects
 * @param {Array} headers - Headers (optional)
 * @returns {string} CSV string
 */
const arrayToCSV = (data, headers = null) => {
  if (!data.length) return '';
  
  const actualHeaders = headers || Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(actualHeaders.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = actualHeaders.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

/**
 * Download file helper
 * @param {string} filePath - File path
 * @param {string} fileName - Download file name
 * @param {Object} res - Express response object
 */
const downloadFile = (filePath, fileName, res) => {
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ success: false, error: 'File download failed' });
    }
  });
};

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 */
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} File extension
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Generate random color (hex)
 * @returns {string} Random hex color
 */
const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Get time ago string
 * @param {Date} date - Date to compare
 * @returns {string} Time ago string
 */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
};

module.exports = {
  formatDate,
  formatCurrency,
  formatNumber,
  generateUniqueId,
  sleep,
  deepClone,
  paginate,
  extractFilters,
  sortData,
  calculatePercentage,
  calculateAverage,
  groupBy,
  removeNullValues,
  maskString,
  maskEmail,
  maskPhone,
  parseCSV,
  arrayToCSV,
  downloadFile,
  ensureDirectoryExists,
  getFileExtension,
  randomColor,
  timeAgo,
};