// client/src/hooks/useToast.js
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext'; // ✅ Named import

/**
 * Hook for using toast notifications
 * @returns {Object} Toast methods
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

/**
 * Alternative: Individual toast hook exports
 */
export const useSuccessToast = () => {
  const { showSuccess } = useToast();
  return showSuccess;
};

export const useErrorToast = () => {
  const { showError } = useToast();
  return showError;
};

export const useWarningToast = () => {
  const { showWarning } = useToast();
  return showWarning;
};

export const useInfoToast = () => {
  const { showInfo } = useToast();
  return showInfo;
};

export default useToast;