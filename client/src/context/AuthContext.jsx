import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService, userAuthService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' or 'user'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const type = localStorage.getItem('userType');
      if (token) {
        try {
          if (type === 'user') {
            const response = await userAuthService.getUserMe();
            setUser(response.data.user);
            setUserType('user');
          } else {
            const response = await authService.getMe();
            setUser(response.data.admin);
            setUserType('admin');
          }
        } catch (err) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('userType');
          setUser(null);
          setUserType(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const { token, admin } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userType', 'admin');
      setUser(admin);
      setUserType('admin');
      return admin;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (googleId, email, name, profileImage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAuthService.googleLogin(googleId, email, name, profileImage);
      const { token, user: googleUser } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userType', 'user');
      setUser(googleUser);
      setUserType('user');
      return googleUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Google login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(name, email, password);
      const { token, admin } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userType', 'admin');
      setUser(admin);
      setUserType('admin');
      return admin;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (userType === 'user') {
        await userAuthService.logoutUser();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      setUser(null);
      setUserType(null);
    }
  }, [userType]);

  const value = {
    user,
    userType,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
