// client/src/utils/formatters.js
import { format, formatDistance, formatRelative, parseISO } from 'date-fns';

// ============ DATE FORMATTERS ============

/**
 * Format date to standard format
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return '-';
  }
};

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return '-';
  }
};

/**
 * Format time only
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatTime = (date) => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'hh:mm a');
  } catch (error) {
    return '-';
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to compare
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    return '-';
  }
};

/**
 * Format relative date (e.g., "today", "yesterday")
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatRelative(dateObj, new Date());
  } catch (error) {
    return '-';
  }
};

/**
 * Format for input date (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatInputDate = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

// ============ CURRENCY FORMATTERS ============

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '-';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `$${amount?.toFixed(2) || 0}`;
  }
};

/**
 * Format currency for UAE (AED)
 * @param {number} amount - Amount to format
 * @returns {string}
 */
export const formatAED = (amount) => {
  return formatCurrency(amount, 'AED', 'en-AE');
};

/**
 * Format currency for USA (USD)
 * @param {number} amount - Amount to format
 * @returns {string}
 */
export const formatUSD = (amount) => {
  return formatCurrency(amount, 'USD', 'en-US');
};

/**
 * Format currency for UK (GBP)
 * @param {number} amount - Amount to format
 * @returns {string}
 */
export const formatGBP = (amount) => {
  return formatCurrency(amount, 'GBP', 'en-GB');
};

/**
 * Format currency for India (INR)
 * @param {number} amount - Amount to format
 * @returns {string}
 */
export const formatINR = (amount) => {
  return formatCurrency(amount, 'INR', 'en-IN');
};

// ============ NUMBER FORMATTERS ============

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return '-';
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch (error) {
    return num?.toString() || '0';
  }
};

/**
 * Format percentage
 * @param {number} value - Value to format (e.g., 0.85 for 85%)
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch (error) {
    return `${value}%`;
  }
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '-';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// ============ PHONE FORMATTERS ============

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for different lengths
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('971')) {
    return `+971 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`;
  }
  
  return phone;
};

// ============ TEXT FORMATTERS ============

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string}
 */
export const truncateText = (text, length = 50, suffix = '...') => {
  if (!text) return '-';
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string}
 */
export const capitalizeWords = (text) => {
  if (!text) return '-';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Convert to title case
 * @param {string} text - Text to convert
 * @returns {string}
 */
export const toTitleCase = (text) => {
  if (!text) return '-';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert to snake_case
 * @param {string} text - Text to convert
 * @returns {string}
 */
export const toSnakeCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Convert to kebab-case
 * @param {string} text - Text to convert
 * @returns {string}
 */
export const toKebabCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// ============ STATUS FORMATTERS ============

/**
 * Get status badge color
 * @param {string} status - Status value
 * @returns {string} CSS class name
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: 'green',
    inactive: 'gray',
    pending: 'yellow',
    completed: 'green',
    in_progress: 'blue',
    cancelled: 'red',
    approved: 'green',
    rejected: 'red',
    open: 'blue',
    closed: 'gray',
    paid: 'green',
    unpaid: 'red',
  };
  return statusColors[status?.toLowerCase()] || 'gray';
};

/**
 * Get status label
 * @param {string} status - Status value
 * @returns {string} Human readable status
 */
export const getStatusLabel = (status) => {
  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    in_progress: 'In Progress',
    cancelled: 'Cancelled',
    approved: 'Approved',
    rejected: 'Rejected',
    open: 'Open',
    closed: 'Closed',
    paid: 'Paid',
    unpaid: 'Unpaid',
  };
  return statusLabels[status?.toLowerCase()] || status || '-';
};

// ============ JSON FORMATTERS ============

/**
 * Safe JSON parse
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parse fails
 * @returns {any}
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Format object as JSON string
 * @param {object} obj - Object to stringify
 * @param {number} spaces - Number of spaces for indentation
 * @returns {string}
 */
export const prettyJSON = (obj, spaces = 2) => {
  try {
    return JSON.stringify(obj, null, spaces);
  } catch (error) {
    return String(obj);
  }
};

// ============ ADDRESS FORMATTERS ============

/**
 * Format address object to string
 * @param {object} address - Address object with street, city, state, country, zipCode
 * @returns {string}
 */
export const formatAddress = (address) => {
  if (!address) return '-';
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
};

// ============ NAME FORMATTERS ============

/**
 * Get initials from name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string}
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '?';
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Get full name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string}
 */
export const getFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return '-';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// ============ DURATION FORMATTERS ============

/**
 * Format duration in minutes to human readable
 * @param {number} minutes - Duration in minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '-';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} min`;
  }
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMinutes} min`;
};

// ============ EXPORT ALL ============
export default {
  // Date
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatRelativeDate,
  formatInputDate,
  
  // Currency
  formatCurrency,
  formatAED,
  formatUSD,
  formatGBP,
  formatINR,
  
  // Number
  formatNumber,
  formatPercentage,
  formatFileSize,
  
  // Phone
  formatPhone,
  
  // Text
  truncateText,
  capitalizeWords,
  toTitleCase,
  toSnakeCase,
  toKebabCase,
  
  // Status
  getStatusColor,
  getStatusLabel,
  
  // JSON
  safeJsonParse,
  prettyJSON,
  
  // Address
  formatAddress,
  
  // Name
  getInitials,
  getFullName,
  
  // Duration
  formatDuration,
};