// client/src/api/endpoints.js
// export const API_ENDPOINTS = {
//   // Auth
//   LOGIN: '/auth/login',
//   LOGOUT: '/auth/logout',
//   REFRESH_TOKEN: '/auth/refresh-token',
//   CHANGE_PASSWORD: '/auth/change-password',
//   FORGOT_PASSWORD: '/auth/forgot-password',
//   RESET_PASSWORD: '/auth/reset-password',
//   GET_ME: '/auth/me',
//   SEND_OTP: '/auth/send-otp',
//   VERIFY_OTP: '/auth/verify-otp',

//   // Users
//   USERS: '/users',
//   USERS_EXPORT: '/users/export',
//   USERS_BULK_IMPORT: '/users/bulk-import',

//   // Roles
//   ROLES: '/roles',
//   ROLES_PERMISSIONS: '/roles/permissions',
//   ROLES_ASSIGN: '/roles/assign',
// };

// client/src/api/endpoints.js
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  GET_ME: '/auth/me',
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',

  // Users
  USERS: '/users',
  USERS_EXPORT: '/users/export',
  USERS_BULK_IMPORT: '/users/bulk-import',

  // Roles
  ROLES: '/roles',
  ROLES_PERMISSIONS: '/roles/permissions',
  ROLES_ASSIGN: '/roles/assign',
  
  // 🔴 FIX: Added missing endpoints
  TASKS: '/tasks',
  COMPLAINTS: '/complaints',
  BUILDINGS: '/buildings',
  TRACKING: '/tracking',
  SLA: '/sla',
  GEOFENCES: '/geofences'
};