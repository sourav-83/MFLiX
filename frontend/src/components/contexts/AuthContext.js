// contexts/AuthContext.js - Fixed version
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import url from '../../constants/url';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set up axios interceptor to include token in ALL requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Optionally verify token is still valid
        await verifyTokenWithBackend();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const verifyTokenWithBackend = async () => {
    try {
      const response = await axios.get(`${url}/api/auth/verify`);
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const endpoint = credentials.email ? '/api/auth/signup' : '/api/auth/signin';
      
      // Clean credentials - only send what backend expects
      const cleanCredentials = credentials.email 
        ? { username: credentials.username, email: credentials.email, password: credentials.password }
        : { username: credentials.username, password: credentials.password, user_type_enum: credentials.user_type_enum };
      
      // Debug: Log what we're sending
      console.log('Sending request to:', `${url}${endpoint}`);
      console.log('Request payload:', cleanCredentials);
      
      const response = await axios.post(`${url}${endpoint}`, cleanCredentials);

      console.log('Login/Signup response:', response.data); // Debug log

      // Handle different response structures
      const userData = response.data.user || response.data.data?.user;
      const token = response.data.token || response.data.data?.token;
      
      if (!userData) {
        console.error('Missing user data in response:', response.data);
        return { 
          success: false, 
          error: 'Invalid response from server. Missing user data.' 
        };
      }

      if (!token) {
        console.error('Missing token in response:', response.data);
        return { 
          success: false, 
          error: 'Invalid response from server. Missing authentication token.' 
        };
      }
      
      // Store user and token
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      console.log('Successfully stored user and token:', { userData, token }); // Debug log
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || 'Authentication failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Optional: call backend logout (though not needed for token-based auth)
    logoutFromBackend();
  };

  const logoutFromBackend = async () => {
    try {
      await axios.post(`${url}/api/auth/logout`);
    } catch (error) {
      console.error('Backend logout error:', error);
    }
  };

  const deactivateAccount = async () => {
    try {
      await axios.post(`${url}/api/user/deactivate`);
      
      // After successful deactivation, logout the user
      logout();
      
      return { success: true };
    } catch (error) {
      console.error('Account deactivation error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to deactivate account' 
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    deactivateAccount,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};