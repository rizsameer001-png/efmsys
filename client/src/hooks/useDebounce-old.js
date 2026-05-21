// client/src/hooks/useDebounce.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Debounce hook - delays updating value until after specified delay
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Debounce hook with callback - calls callback after delay
 * @param {Function} callback - Function to call after debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} Debounced callback
 */
export const useDebouncedCallback = (callback, delay = 300, deps = []) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Debounce hook that immediately executes first call then debounces subsequent calls
 * @param {Function} callback - Function to call
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced callback with leading edge
 */
export const useDebouncedCallbackLeading = (callback, delay = 300) => {
  const timeoutRef = useRef(null);
  const leadingRef = useRef(true);

  const debouncedCallback = useCallback((...args) => {
    if (leadingRef.current) {
      callback(...args);
      leadingRef.current = false;
      timeoutRef.current = setTimeout(() => {
        leadingRef.current = true;
      }, delay);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        leadingRef.current = true;
      }, delay);
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Throttle hook - limits how often a value can update
 * @param {any} value - The value to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {any} Throttled value
 */
export const useThrottle = (value, limit = 300) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      if (now - lastRun.current >= limit) {
        setThrottledValue(value);
        lastRun.current = now;
      }
    }, limit - (Date.now() - lastRun.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

/**
 * Debounce hook for async operations with cancel support
 * @returns {Object} { debouncedFunction, cancel, isPending }
 */
export const useDebouncedAsync = () => {
  const timeoutRef = useRef(null);
  const [isPending, setIsPending] = useState(false);

  const debouncedAsync = useCallback((callback, delay = 300) => {
    setIsPending(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      try {
        await callback();
      } finally {
        setIsPending(false);
      }
    }, delay);
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debouncedAsync, cancel, isPending };
};

export default useDebounce;