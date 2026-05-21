// client/src/hooks/useApi.js
import { useState, useCallback } from 'react';
//import { useToast } from './useToast';
import { useToast } from '../../hooks/useToast';

export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  
  const { showSuccessMessage, successMessage, showErrorMessage, errorMessage } = options;
  
  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...params);
      setData(response.data);
      
      if (showSuccessMessage) {
        showToast(successMessage || 'Operation completed successfully', 'success');
      }
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'An error occurred';
      setError(message);
      
      if (showErrorMessage !== false) {
        showToast(errorMessage || message, 'error');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, showSuccessMessage, successMessage, showErrorMessage, errorMessage, showToast]);
  
  return {
    data,
    loading,
    error,
    execute,
  };
};