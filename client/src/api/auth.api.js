// client/src/api/auth.api.js
// import api from './axios.config';

// export const authApi = {
//   login: async (email, password) => {
//     const response = await api.post('/auth/login', { email, password });
//     return response;
//   },

//   logout: (refreshToken) => {
//     return api.post('/auth/logout', { refreshToken });
//   },

//   refreshToken: (refreshToken) => {
//     return api.post('/auth/refresh-token', { refreshToken });
//   },

//   changePassword: (currentPassword, newPassword) => {
//     return api.post('/auth/change-password', { currentPassword, newPassword });
//   },

//   forgotPassword: (email) => {
//     return api.post('/auth/forgot-password', { email });
//   },

//   resetPassword: (token, newPassword) => {
//     return api.post('/auth/reset-password', { token, newPassword });
//   },

//   getMe: () => {
//     return api.get('/auth/me');
//   },

//   // Customer Registration Methods
//   verifyUnit: (params) => {
//     return api.get('/customer/verify-unit', { params });
//   },

//   registerCustomer: (data) => {
//     return api.post('/customer/auth/register', data);
//   },

//   verifyEmail: (token) => {
//     return api.post('/customer/auth/verify-email', { token });
//   },

//   verifyPhone: (phone, otp) => {
//     return api.post('/customer/auth/verify-phone', { phone, otp });
//   },
// };

// // client/src/api/auth.api.js
// import api from './axios.config';

// export const authApi = {
//   login: async (email, password) => {
//     const response = await api.post('/auth/login', { email, password });
//     return response;
//   },

//   logout: (refreshToken) => {
//     return api.post('/auth/logout', { refreshToken });
//   },

//   refreshToken: (refreshToken) => {
//     return api.post('/auth/refresh-token', { refreshToken });
//   },

//   changePassword: (currentPassword, newPassword) => {
//     return api.post('/auth/change-password', { currentPassword, newPassword });
//   },

//   forgotPassword: (email) => {
//     return api.post('/auth/forgot-password', { email });
//   },

//   resetPassword: (token, newPassword) => {
//     return api.post('/auth/reset-password', { token, newPassword });
//   },

//   getMe: () => {
//     return api.get('/auth/me');
//   },

//   // Customer Registration Methods
//   verifyUnit: (params) => {
//     return api.get('/customer/verify-unit', { params });
//   },

//   registerCustomer: (data) => {
//     return api.post('/customer/auth/register', data);
//   },

//   verifyEmail: (token) => {
//     return api.post('/customer/auth/verify-email', { token });
//   },

//   verifyPhone: (phone, otp) => {
//     return api.post('/customer/auth/verify-phone', { phone, otp });
//   },
// };


// client/src/api/auth.api.js
import api from './axios.config';

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  logout: (refreshToken) => {
    return api.post('/auth/logout', { refreshToken });
  },

  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh-token', { refreshToken });
  },

  changePassword: (currentPassword, newPassword) => {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  getMe: () => {
    return api.get('/auth/me');
  },

  // ==================== OTP METHODS ====================
  sendOTP: async (email) => {
    const response = await api.post('/auth/send-otp', { email });
    return response;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response;
  },

  // ==================== CUSTOMER REGISTRATION METHODS ====================
  verifyUnit: (params) => {
    return api.get('/customer/verify-unit', { params });
  },

  registerCustomer: (data) => {
    return api.post('/customer/auth/register', data);
  },

  verifyEmail: (token) => {
    return api.post('/customer/auth/verify-email', { token });
  },

  verifyPhone: (phone, otp) => {
    return api.post('/customer/auth/verify-phone', { phone, otp });
  },
};