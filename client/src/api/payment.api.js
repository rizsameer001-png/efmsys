// client/src/api/payment.api.js
import api from './axios.config';

export const paymentApi = {
  getMyPayments: (params) => {
    return api.get('/payments/my', { params });
  },
  downloadReceipt: (paymentId) => {
    return api.get(`/payments/${paymentId}/receipt`, { responseType: 'blob' });
  }
};