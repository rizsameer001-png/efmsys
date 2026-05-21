// client/src/api/auth.api.js
import api from './axios.config';
import { API_ENDPOINTS } from './endpoints';

export const authApi = {
  // Login
  login: (email, password) => {
    return api.post(API_ENDPOINTS.LOGIN, { email, password });
  },

  // Logout
  logout: (refreshToken) => {
    return api.post(API_ENDPOINTS.LOGOUT, { refreshToken });
  },

  // Refresh token
  refreshToken: (refreshToken) => {
    return api.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  },

  // Change password
  changePassword: (currentPassword, newPassword) => {
    return api.post(API_ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword });
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  // Reset password
  resetPassword: (token, newPassword) => {
    return api.post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },

  // Get current user
  getMe: () => {
    return api.get(API_ENDPOINTS.GET_ME);
  },

  // Send OTP
  sendOTP: (email, phone) => {
    return api.post(API_ENDPOINTS.SEND_OTP, { email, phone });
  },

  // Verify OTP
  verifyOTP: (email, phone, otp) => {
    return api.post(API_ENDPOINTS.VERIFY_OTP, { email, phone, otp });
  },
};