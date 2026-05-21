// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import { authApi } from '../api';
// import { useToast } from '../hooks/useToast';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { showToast } = useToast();
  
//   const loadUser = useCallback(async () => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       // Try to get user from localStorage first
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       } else {
//         // Fetch from API if needed
//         const response = await authApi.getMe();
//         if (response.data.success) {
//           setUser(response.data.user);
//           localStorage.setItem('user', JSON.stringify(response.data.user));
//         }
//       }
//     } catch (error) {
//       console.error('Load user error:', error);
//       localStorage.clear();
//     } finally {
//       setLoading(false);
//     }
//   }, []);
  
//   useEffect(() => {
//     loadUser();
//   }, [loadUser]);
  
//   const login = async (email, password) => {
//     try {
//       const response = await authApi.login(email, password);
//       console.log('Login API response:', response.data);
      
//       // Check the response structure from your backend
//       if (response.data.success) {
//         const { token, user: userData } = response.data;
        
//         // Store in localStorage
//         localStorage.setItem('accessToken', token);
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         // Update state
//         setUser(userData);
//         showToast('Login successful!', 'success');
        
//         return userData;
//       } else {
//         throw new Error(response.data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       const message = error.response?.data?.error || error.message || 'Login failed. Please check your credentials.';
//       showToast(message, 'error');
//       throw error;
//     }
//   };
  
//   const logout = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (refreshToken) {
//         await authApi.logout(refreshToken);
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.clear();
//       setUser(null);
//       showToast('Logged out successfully', 'success');
//     }
//   };
  
//   const changePassword = async (currentPassword, newPassword) => {
//     await authApi.changePassword(currentPassword, newPassword);
//     showToast('Password changed successfully', 'success');
//   };
  
//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         logout,
//         changePassword,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // client/src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import { authApi } from '../api/auth.api';
// import { useToast } from '../hooks/useToast';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { showToast } = useToast();
  
//   const loadUser = useCallback(async () => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       // First try to get user from localStorage
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//         setLoading(false);
//         return;
//       }
      
//       // If not in localStorage, fetch from API
//       const response = await authApi.getMe();
//       if (response.data.success && response.data.user) {
//         setUser(response.data.user);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       } else if (response.data.user) {
//         // Handle case where success flag might not be present
//         setUser(response.data.user);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       }
//     } catch (error) {
//       console.error('Load user error:', error);
//       // If token is invalid, clear storage
//       if (error.response?.status === 401) {
//         localStorage.clear();
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);
  
//   useEffect(() => {
//     loadUser();
//   }, [loadUser]);
  
//   const login = async (email, password) => {
//     try {
//       const response = await authApi.login(email, password);
//       console.log('Login API response:', response.data);
      
//       // Check the response structure from your backend
//       // Backend returns: { success: true, token: "...", user: {...} }
//       if (response.data.success) {
//         const { token, user: userData } = response.data;
        
//         // Store in localStorage
//         localStorage.setItem('accessToken', token);
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         // Update state
//         setUser(userData);
//         showToast('Login successful!', 'success');
        
//         return userData;
//       } else {
//         throw new Error(response.data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       const message = error.response?.data?.error || 
//                      error.response?.data?.message ||
//                      error.message || 
//                      'Login failed. Please check your credentials.';
//       showToast(message, 'error');
//       throw error;
//     }
//   };
  
//   const logout = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (refreshToken) {
//         await authApi.logout(refreshToken);
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.clear();
//       setUser(null);
//       showToast('Logged out successfully', 'success');
//     }
//   };
  
//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       const response = await authApi.changePassword(currentPassword, newPassword);
//       if (response.data.success) {
//         showToast('Password changed successfully', 'success');
//       } else {
//         throw new Error(response.data.error || 'Failed to change password');
//       }
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to change password';
//       showToast(message, 'error');
//       throw error;
//     }
//   };
  
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         throw new Error('No refresh token');
//       }
      
//       const response = await authApi.refreshToken(refreshToken);
//       if (response.data.success && response.data.token) {
//         localStorage.setItem('accessToken', response.data.token);
//         return response.data.token;
//       } else {
//         throw new Error('Failed to refresh token');
//       }
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       // If refresh fails, logout user
//       await logout();
//       throw error;
//     }
//   };
  
//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     changePassword,
//     refreshToken,
//     isAuthenticated: !!user,
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };







// client/src/context/AuthContext.jsx
// updated AuthContext.jsx with the _id normalization
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  // 🔴 Helper function to normalize user object (add both id and _id)
  const normalizeUser = useCallback((userData) => {
    if (!userData) return null;
    return {
      ...userData,
      id: userData.id || userData._id,      // Ensure id exists
      _id: userData._id || userData.id,     // Ensure _id exists
    };
  }, []);
  
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      // First try to get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(normalizeUser(parsedUser));
        setLoading(false);
        return;
      }
      
      // If not in localStorage, fetch from API
      const response = await authApi.getMe();
      if (response.data.success && response.data.user) {
        const normalizedUser = normalizeUser(response.data.user);
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } else if (response.data.user) {
        // Handle case where success flag might not be present
        const normalizedUser = normalizeUser(response.data.user);
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }
    } catch (error) {
      console.error('Load user error:', error);
      // If token is invalid, clear storage
      if (error.response?.status === 401) {
        localStorage.clear();
      }
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      console.log('Login API response:', response.data);
      
      // Check the response structure from your backend
      // Backend returns: { success: true, token: "...", user: {...} }
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // 🔴 Normalize user to have both id and _id
        const normalizedUser = normalizeUser(userData);
        
        // Store in localStorage
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        // Update state
        setUser(normalizedUser);
        showToast('Login successful!', 'success');
        
        console.log('✅ User logged in:', normalizedUser);
        console.log('✅ User ID:', normalizedUser.id || normalizedUser._id);
        
        return normalizedUser;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || 
                     error.response?.data?.message ||
                     error.message || 
                     'Login failed. Please check your credentials.';
      showToast(message, 'error');
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      showToast('Logged out successfully', 'success');
    }
  };
  
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authApi.changePassword(currentPassword, newPassword);
      if (response.data.success) {
        showToast('Password changed successfully', 'success');
      } else {
        throw new Error(response.data.error || 'Failed to change password');
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to change password';
      showToast(message, 'error');
      throw error;
    }
  };
  
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      
      const response = await authApi.refreshToken(refreshToken);
      if (response.data.success && response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        return response.data.token;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };
  
  const updateUser = useCallback((updatedData) => {
    const updatedUser = normalizeUser({ ...user, ...updatedData });
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user, normalizeUser]);
  
  const value = {
    user,
    loading,
    login,
    logout,
    changePassword,
    refreshToken,
    updateUser,
    isAuthenticated: !!user,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};