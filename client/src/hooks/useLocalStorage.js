// client/src/hooks/useLocalStorage.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing localStorage with reactive updates
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function, Function]} [storedValue, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue = null) => {
  // Get stored value from localStorage
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event for cross-tab communication
        window.dispatchEvent(new CustomEvent('local-storage-change', {
          detail: { key, newValue: valueToStore }
        }));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('local-storage-change', {
          detail: { key, newValue: null }
        }));
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };

    const handleCustomEvent = (event) => {
      if (event.detail.key === key) {
        setStoredValue(event.detail.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleCustomEvent);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing multiple localStorage items
 * @param {Object} defaults - Object with default values for multiple keys
 * @returns {[Object, Function, Function]}
 */
export const useLocalStorageMulti = (defaults = {}) => {
  const [values, setValues] = useState({});
  const setters = {};

  // Initialize each key with its own hook
  Object.entries(defaults).forEach(([key, defaultValue]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue, removeValue] = useLocalStorage(key, defaultValue);
    values[key] = value;
    setters[key] = setValue;
    setters[`remove${key.charAt(0).toUpperCase() + key.slice(1)}`] = removeValue;
  });

  const setMultiple = useCallback((updates) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (setters[key]) {
        setters[key](value);
      }
    });
  }, [setters]);

  const removeMultiple = useCallback((keys) => {
    keys.forEach((key) => {
      const removeFn = setters[`remove${key.charAt(0).toUpperCase() + key.slice(1)}`];
      if (removeFn) {
        removeFn();
      }
    });
  }, [setters]);

  return [values, setMultiple, removeMultiple];
};

/**
 * Hook for persisting form data to localStorage
 * @param {string} formKey - Unique key for the form
 * @param {Object} initialFormData - Initial form data
 * @returns {[Object, Function, Function]}
 */
export const usePersistentForm = (formKey, initialFormData = {}) => {
  const storageKey = `form_${formKey}`;
  const [formData, setFormData, clearFormData] = useLocalStorage(storageKey, initialFormData);

  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    clearFormData();
    setFormData(initialFormData);
  }, [clearFormData, setFormData, initialFormData]);

  const updateMultipleFields = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
  }, [setFormData]);

  return {
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
    clearForm: clearFormData,
  };
};

/**
 * Hook for managing user preferences in localStorage
 * @param {Object} defaultPreferences - Default preferences
 * @returns {[Object, Function, Function]}
 */
export const useUserPreferences = (defaultPreferences = {}) => {
  const [preferences, setPreferences, resetPreferences] = useLocalStorage('user_preferences', defaultPreferences);

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  const toggleTheme = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, [setPreferences]);

  const updateLanguage = useCallback((language) => {
    setPreferences(prev => ({
      ...prev,
      language,
    }));
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    updateLanguage,
    toggleTheme,
    resetPreferences,
  };
};

export default useLocalStorage;