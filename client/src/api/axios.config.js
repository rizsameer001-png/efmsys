// // client/src/api/axios.config.js
// import axios from 'axios';

// //const API_BASE_URL = 'http://localhost:5000/api/v1';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log('Request:', config.method.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error('Response Error:', error.response?.status, error.response?.data);
    
//     if (error.response?.status === 401) {
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;










// import axios from 'axios';

// // Debug flag from environment or localStorage
// const DEBUG = import.meta.env.VITE_DEBUG_API === 'true' || localStorage.getItem('debug_api') === 'true';

// // API Base URL with fallback
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// // Create axios instance with default config
// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // Helper for debug logging
// const debugLog = (type, message, data = null) => {
//   if (DEBUG) {
//     const timestamp = new Date().toISOString();
//     console.log(`[${timestamp}] [${type}] ${message}`);
//     if (data) {
//       // Don't log sensitive data
//       const safeData = { ...data };
//       if (safeData.password) safeData.password = '***REDACTED***';
//       if (safeData.token) safeData.token = safeData.token.substring(0, 20) + '...';
//       if (safeData.authorization) safeData.authorization = 'Bearer ***REDACTED***';
//       console.log(safeData);
//     }
//   }
// };

// // ==================== REQUEST INTERCEPTOR ====================
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage (check multiple possible keys)
//     const token = localStorage.getItem('accessToken') || 
//                   localStorage.getItem('token') || 
//                   sessionStorage.getItem('accessToken');
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // Log request
//     debugLog('REQUEST', `${config.method?.toUpperCase()} ${config.url}`, {
//       method: config.method,
//       url: config.url,
//       hasToken: !!token,
//       headers: config.headers,
//       params: config.params,
//       // Don't log full body for sensitive endpoints
//       body: config.url?.includes('password') ? '***REDACTED***' : config.data
//     });
    
//     return config;
//   },
//   (error) => {
//     debugLog('ERROR', 'Request interceptor error', error.message);
//     return Promise.reject(error);
//   }
// );

// // ==================== RESPONSE INTERCEPTOR ====================
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Log successful response
//     debugLog('RESPONSE', `${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
//       status: response.status,
//       statusText: response.statusText,
//       dataSize: JSON.stringify(response.data)?.length,
//       hasData: !!response.data
//     });
    
//     return response;
//   },
//   async (error) => {
//     // Handle different error scenarios
//     const errorResponse = {
//       originalError: error,
//       message: 'An unexpected error occurred',
//       status: error.response?.status,
//       endpoint: error.config?.url,
//       method: error.config?.method?.toUpperCase(),
//       timestamp: new Date().toISOString()
//     };
    
//     // Network error (no response)
//     if (error.code === 'ECONNABORTED') {
//       errorResponse.message = 'Request timeout. Please try again.';
//       errorResponse.type = 'TIMEOUT';
//       debugLog('ERROR', 'Request timeout', { url: error.config?.url });
//     } else if (error.code === 'ERR_NETWORK') {
//       errorResponse.message = 'Network error. Please check your connection.';
//       errorResponse.type = 'NETWORK';
//       debugLog('ERROR', 'Network error', { url: error.config?.url });
//     } else if (error.response) {
//       // Server responded with error status
//       const { status, data } = error.response;
      
//       errorResponse.status = status;
      
//       switch (status) {
//         case 400:
//           errorResponse.message = data?.error || data?.message || 'Bad request. Please check your input.';
//           errorResponse.type = 'BAD_REQUEST';
//           break;
          
//         case 401:
//           errorResponse.message = 'Session expired. Please login again.';
//           errorResponse.type = 'UNAUTHORIZED';
          
//           // Clear all auth data
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           sessionStorage.removeItem('accessToken');
          
//           // Show message before redirect
//           if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
//             console.log('[Auth] Redirecting to login due to 401');
            
//             // Store current path for redirect after login
//             const currentPath = window.location.pathname + window.location.search;
//             if (currentPath !== '/login' && currentPath !== '/') {
//               sessionStorage.setItem('redirectAfterLogin', currentPath);
//             }
            
//             // Redirect to login
//             window.location.href = '/login';
//           }
//           break;
          
//         case 403:
//           errorResponse.message = data?.error || 'You do not have permission to perform this action.';
//           errorResponse.type = 'FORBIDDEN';
//           debugLog('ERROR', 'Forbidden access', { url: error.config?.url, user: error.config?.user });
//           break;
          
//         case 404:
//           errorResponse.message = data?.error || 'The requested resource was not found.';
//           errorResponse.type = 'NOT_FOUND';
//           debugLog('ERROR', 'Resource not found', { url: error.config?.url });
//           break;
          
//         case 409:
//           errorResponse.message = data?.error || 'Conflict with current state.';
//           errorResponse.type = 'CONFLICT';
//           break;
          
//         case 422:
//           errorResponse.message = data?.error || 'Validation failed.';
//           errorResponse.type = 'VALIDATION_ERROR';
//           if (data?.details) {
//             errorResponse.details = data.details;
//             debugLog('ERROR', 'Validation error', data.details);
//           }
//           break;
          
//         case 429:
//           errorResponse.message = 'Too many requests. Please try again later.';
//           errorResponse.type = 'RATE_LIMIT';
//           break;
          
//         case 500:
//         case 502:
//         case 503:
//           errorResponse.message = 'Server error. Please try again later.';
//           errorResponse.type = 'SERVER_ERROR';
//           debugLog('ERROR', 'Server error', { status, url: error.config?.url });
//           break;
          
//         default:
//           errorResponse.message = data?.error || data?.message || `Error ${status}: ${error.response.statusText}`;
//           errorResponse.type = 'UNKNOWN';
//       }
      
//       debugLog('ERROR', `API Error ${status}`, {
//         url: error.config?.url,
//         method: error.config?.method,
//         message: errorResponse.message,
//         data: error.response?.data
//       });
      
//       // Add user-friendly message to error object
//       error.userMessage = errorResponse.message;
//       error.errorType = errorResponse.type;
//       error.statusCode = status;
//     } else if (error.request) {
//       // Request was made but no response received
//       errorResponse.message = 'No response from server. Please check if the server is running.';
//       errorResponse.type = 'NO_RESPONSE';
//       debugLog('ERROR', 'No response received', { url: error.config?.url });
//       error.userMessage = errorResponse.message;
//     } else {
//       // Something else happened
//       errorResponse.message = error.message || 'Request configuration error';
//       errorResponse.type = 'CONFIG_ERROR';
//       debugLog('ERROR', 'Request configuration error', error.message);
//       error.userMessage = errorResponse.message;
//     }
    
//     // Show toast notification if available
//     if (typeof window !== 'undefined' && window.showToast && errorResponse.status !== 401) {
//       // Don't show toast for 401 as we're redirecting
//       window.showToast(errorResponse.message, 'error');
//     }
    
//     // Enhanced error object for components
//     const enhancedError = {
//       ...error,
//       userMessage: errorResponse.message,
//       errorType: errorResponse.type,
//       statusCode: errorResponse.status,
//       endpoint: errorResponse.endpoint,
//       method: errorResponse.method,
//       timestamp: errorResponse.timestamp
//     };
    
//     return Promise.reject(enhancedError);
//   }
// );

// // ==================== HELPER FUNCTIONS ====================

// // Function to set auth token manually
// export const setAuthToken = (token) => {
//   if (token) {
//     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     debugLog('AUTH', 'Auth token set', { hasToken: true });
//   } else {
//     delete axiosInstance.defaults.headers.common['Authorization'];
//     debugLog('AUTH', 'Auth token removed');
//   }
// };

// // Function to clear auth token
// export const clearAuthToken = () => {
//   delete axiosInstance.defaults.headers.common['Authorization'];
//   debugLog('AUTH', 'Auth token cleared');
// };

// // Function to check API health
// export const checkApiHealth = async () => {
//   try {
//     const response = await axiosInstance.get('/health');
//     debugLog('HEALTH', 'API health check passed', response.data);
//     return { success: true, data: response.data };
//   } catch (error) {
//     debugLog('HEALTH', 'API health check failed', error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Function to get current API status
// export const getApiStatus = () => {
//   return {
//     baseURL: API_BASE_URL,
//     debugEnabled: DEBUG,
//     hasToken: !!localStorage.getItem('accessToken'),
//     timeout: 30000,
//     headers: axiosInstance.defaults.headers
//   };
// };

// // Toggle debug mode at runtime
// export const toggleDebugMode = (enabled) => {
//   if (enabled) {
//     localStorage.setItem('debug_api', 'true');
//     console.log('[API] Debug mode enabled');
//   } else {
//     localStorage.removeItem('debug_api');
//     console.log('[API] Debug mode disabled');
//   }
//   // Reload to apply changes
//   window.location.reload();
// };

// // Export the axios instance as default
// export default axiosInstance;

// // Also export named exports for convenience
// export { DEBUG, API_BASE_URL };






import axios from 'axios';

// Debug flag from environment or localStorage
const DEBUG = import.meta.env.VITE_DEBUG_API === 'true' || localStorage.getItem('debug_api') === 'true';

// API Base URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper for debug logging
const debugLog = (type, message, data = null) => {
  if (DEBUG) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
    if (data) {
      // Don't log sensitive data
      const safeData = { ...data };
      if (safeData.password) safeData.password = '***REDACTED***';
      if (safeData.token) safeData.token = safeData.token.substring(0, 20) + '...';
      if (safeData.authorization) safeData.authorization = 'Bearer ***REDACTED***';
      console.log(safeData);
    }
  }
};

// Helper to check if response is an error blob
const isErrorBlob = async (response) => {
  if (response.config?.responseType === 'blob' && response.data instanceof Blob) {
    // Check if blob is JSON (error response)
    if (response.data.type === 'application/json') {
      try {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        if (!errorData.success) {
          return errorData;
        }
      } catch (e) {
        // Not JSON, not an error
        return null;
      }
    }
  }
  return null;
};

// ==================== REQUEST INTERCEPTOR ====================
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (check multiple possible keys)
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('token') || 
                  sessionStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request
    debugLog('REQUEST', `${config.method?.toUpperCase()} ${config.url}`, {
      method: config.method,
      url: config.url,
      hasToken: !!token,
      headers: config.headers,
      params: config.params,
      // Don't log full body for sensitive endpoints
      body: config.url?.includes('password') ? '***REDACTED***' : config.data
    });
    
    return config;
  },
  (error) => {
    debugLog('ERROR', 'Request interceptor error', error.message);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
axiosInstance.interceptors.response.use(
  async (response) => {
    // Handle blob responses that might be errors
    const errorData = await isErrorBlob(response);
    if (errorData) {
      // This is actually an error response disguised as blob
      debugLog('ERROR', `Blob Error ${response.status}:`, errorData);
      
      const error = new Error(errorData.error || errorData.message || 'Request failed');
      error.response = {
        status: response.status,
        data: errorData,
        statusText: response.statusText
      };
      error.config = response.config;
      error.isAxiosError = true;
      
      return Promise.reject(error);
    }
    
    // Log successful response
    debugLog('RESPONSE', `${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      dataSize: response.config?.responseType === 'blob' 
        ? response.data?.size 
        : JSON.stringify(response.data)?.length,
      hasData: !!response.data
    });
    
    return response;
  },
  async (error) => {
    // Handle different error scenarios
    const errorResponse = {
      originalError: error,
      message: 'An unexpected error occurred',
      status: error.response?.status,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      timestamp: new Date().toISOString()
    };
    
    // Network error (no response)
    if (error.code === 'ECONNABORTED') {
      errorResponse.message = 'Request timeout. Please try again.';
      errorResponse.type = 'TIMEOUT';
      debugLog('ERROR', 'Request timeout', { url: error.config?.url });
    } else if (error.code === 'ERR_NETWORK') {
      errorResponse.message = 'Network error. Please check your connection.';
      errorResponse.type = 'NETWORK';
      debugLog('ERROR', 'Network error', { url: error.config?.url });
    } else if (error.response) {
      // Server responded with error status
      let { status, data } = error.response;
      
      // Handle blob error responses that weren't caught in the success interceptor
      if (data instanceof Blob && data.type === 'application/json') {
        try {
          const text = await data.text();
          data = JSON.parse(text);
        } catch (e) {
          // Use default error message
        }
      }
      
      errorResponse.status = status;
      
      switch (status) {
        case 400:
          errorResponse.message = data?.error || data?.message || 'Bad request. Please check your input.';
          errorResponse.type = 'BAD_REQUEST';
          break;
          
        case 401:
          errorResponse.message = 'Session expired. Please login again.';
          errorResponse.type = 'UNAUTHORIZED';
          
          // Clear all auth data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('accessToken');
          
          // Show message before redirect
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            console.log('[Auth] Redirecting to login due to 401');
            
            // Store current path for redirect after login
            const currentPath = window.location.pathname + window.location.search;
            if (currentPath !== '/login' && currentPath !== '/') {
              sessionStorage.setItem('redirectAfterLogin', currentPath);
            }
            
            // Redirect to login
            window.location.href = '/login';
          }
          break;
          
        case 403:
          errorResponse.message = data?.error || 'You do not have permission to perform this action.';
          errorResponse.type = 'FORBIDDEN';
          debugLog('ERROR', 'Forbidden access', { url: error.config?.url, user: error.config?.user });
          break;
          
        case 404:
          errorResponse.message = data?.error || 'The requested resource was not found.';
          errorResponse.type = 'NOT_FOUND';
          debugLog('ERROR', 'Resource not found', { url: error.config?.url });
          break;
          
        case 409:
          errorResponse.message = data?.error || 'Conflict with current state.';
          errorResponse.type = 'CONFLICT';
          break;
          
        case 422:
          errorResponse.message = data?.error || 'Validation failed.';
          errorResponse.type = 'VALIDATION_ERROR';
          if (data?.details) {
            errorResponse.details = data.details;
            debugLog('ERROR', 'Validation error', data.details);
          }
          break;
          
        case 429:
          errorResponse.message = 'Too many requests. Please try again later.';
          errorResponse.type = 'RATE_LIMIT';
          break;
          
        case 500:
        case 502:
        case 503:
          errorResponse.message = data?.error || 'Server error. Please try again later.';
          errorResponse.type = 'SERVER_ERROR';
          debugLog('ERROR', 'Server error', { status, url: error.config?.url });
          break;
          
        default:
          errorResponse.message = data?.error || data?.message || `Error ${status}: ${error.response.statusText}`;
          errorResponse.type = 'UNKNOWN';
      }
      
      debugLog('ERROR', `API Error ${status}`, {
        url: error.config?.url,
        method: error.config?.method,
        message: errorResponse.message,
        data: data
      });
      
      // Add user-friendly message to error object
      error.userMessage = errorResponse.message;
      error.errorType = errorResponse.type;
      error.statusCode = status;
    } else if (error.request) {
      // Request was made but no response received
      errorResponse.message = 'No response from server. Please check if the server is running.';
      errorResponse.type = 'NO_RESPONSE';
      debugLog('ERROR', 'No response received', { url: error.config?.url });
      error.userMessage = errorResponse.message;
    } else {
      // Something else happened
      errorResponse.message = error.message || 'Request configuration error';
      errorResponse.type = 'CONFIG_ERROR';
      debugLog('ERROR', 'Request configuration error', error.message);
      error.userMessage = errorResponse.message;
    }
    
    // Show toast notification if available
    if (typeof window !== 'undefined' && window.showToast && errorResponse.status !== 401) {
      // Don't show toast for 401 as we're redirecting
      window.showToast(errorResponse.message, 'error');
    }
    
    // Enhanced error object for components
    const enhancedError = {
      ...error,
      userMessage: errorResponse.message,
      errorType: errorResponse.type,
      statusCode: errorResponse.status,
      endpoint: errorResponse.endpoint,
      method: errorResponse.method,
      timestamp: errorResponse.timestamp
    };
    
    return Promise.reject(enhancedError);
  }
);

// ==================== HELPER FUNCTIONS ====================

// Function to set auth token manually
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    debugLog('AUTH', 'Auth token set', { hasToken: true });
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    debugLog('AUTH', 'Auth token removed');
  }
};

// Function to clear auth token
export const clearAuthToken = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
  debugLog('AUTH', 'Auth token cleared');
};

// Function to check API health
export const checkApiHealth = async () => {
  try {
    const response = await axiosInstance.get('/health');
    debugLog('HEALTH', 'API health check passed', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    debugLog('HEALTH', 'API health check failed', error.message);
    return { success: false, error: error.message };
  }
};

// Function to get current API status
export const getApiStatus = () => {
  return {
    baseURL: API_BASE_URL,
    debugEnabled: DEBUG,
    hasToken: !!localStorage.getItem('accessToken'),
    timeout: 30000,
    headers: axiosInstance.defaults.headers
  };
};

// Toggle debug mode at runtime
export const toggleDebugMode = (enabled) => {
  if (enabled) {
    localStorage.setItem('debug_api', 'true');
    console.log('[API] Debug mode enabled');
  } else {
    localStorage.removeItem('debug_api');
    console.log('[API] Debug mode disabled');
  }
  // Reload to apply changes
  window.location.reload();
};

// Export the axios instance as default
export default axiosInstance;

// Also export named exports for convenience
export { DEBUG, API_BASE_URL };