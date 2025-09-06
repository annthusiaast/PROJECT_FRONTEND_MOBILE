import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/constants/api-config';

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
  const [pendingUserId, setPendingUserId] = useState(null);

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const userId = await AsyncStorage.getItem('pendingUserId');

      if (userData) {
        setUser(JSON.parse(userData));
      }

      if (userId) {
        setPendingUserId(userId);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store pending user data for 2FA
      await AsyncStorage.setItem('pendingUserId', data.user_id.toString());
      await AsyncStorage.setItem('pendingUserEmail', email);
      setPendingUserId(data.user_id.toString());

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const verifyOTP = async (code) => {
    try {
      if (!pendingUserId) {
        throw new Error('No pending verification. Please login again.');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: pendingUserId,
          code: code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Store user data and clear pending data
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.removeItem('pendingUserId');
      await AsyncStorage.removeItem('pendingUserEmail');

      setUser(data.user);
      setPendingUserId(null);

      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const resendOTP = async () => {
    try {
      if (!pendingUserId) {
        throw new Error('No pending verification. Please login again.');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: pendingUserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      return data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear local storage
      await AsyncStorage.multiRemove(['user', 'pendingUserId', 'pendingUserEmail']);
      setUser(null);
      setPendingUserId(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    pendingUserId,
    login,
    verifyOTP,
    resendOTP,
    logout,
    isAuthenticated: !!user,
    isPendingVerification: !!pendingUserId,
    // Expose setUser so other screens (e.g., Profile) can update cached user after edits
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};