// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await authApi.getMe();
      setUser(response.data.data);
    } catch (error) {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    const { accessToken, refreshToken, user } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    showToast('Login successful!', 'success');
    
    return user;
  };
  
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await authApi.logout(refreshToken);
    }
    localStorage.clear();
    setUser(null);
    showToast('Logged out successfully', 'success');
  };
  
  const changePassword = async (currentPassword, newPassword) => {
    await authApi.changePassword(currentPassword, newPassword);
    showToast('Password changed successfully', 'success');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        changePassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};