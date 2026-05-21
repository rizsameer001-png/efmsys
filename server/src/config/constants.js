// server/src/config/constants.js
module.exports = {
  // User Roles
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    HR: 'hr',
    MANAGER: 'manager',
    SUPERVISOR: 'supervisor',
    TECHNICIAN: 'technician',
    ACCOUNTANT: 'accountant',
    CUSTOMER: 'customer',
  },

  // User Status
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    TERMINATED: 'terminated',
  },

  // Departments
  DEPARTMENTS: {
    OPERATIONS: 'operations',
    TECHNICAL: 'technical',
    HOUSEKEEPING: 'housekeeping',
    SECURITY: 'security',
    MANAGEMENT: 'management',
    HR: 'hr',
    FINANCE: 'finance',
  },

  // Employment Types
  EMPLOYMENT_TYPES: {
    FULL_TIME: 'full_time',
    PART_TIME: 'part_time',
    CONTRACT: 'contract',
    INTERN: 'intern',
  },

  // Token Types
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'reset_password',
    VERIFY_EMAIL: 'verify_email',
  },
};