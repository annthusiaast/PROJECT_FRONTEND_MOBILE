import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, getEndpoint } from '@/constants/api-config';

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

      // Session verify: refresh user from server to reflect server-side updates
      try {
        const res = await fetch(getEndpoint('/verify'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
          }
        } else if (res.status === 401) {
          // Not authenticated on server; clear stale local user
          await AsyncStorage.removeItem('user');
          setUser(null);
        }
      } catch (e) {
        // Silently ignore network errors here; app will rely on cached user
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(getEndpoint('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // If server didn't return JSON, create a helpful error
        throw new Error('Login failed: invalid server response');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Login failed');
      }

      // Extract user id from common shapes
      const userId = data?.user_id || data?.user?.user_id || data?.pending_user_id || data?.pendingUserId;
      if (!userId) {
        // Provide diagnostic info for backend mismatch
        const keys = data && typeof data === 'object' ? Object.keys(data).join(', ') : String(data);
        throw new Error(`Login succeeded but user_id is missing. Response keys: ${keys}`);
      }

      const userIdStr = String(userId);
      await AsyncStorage.setItem('pendingUserId', userIdStr);
      await AsyncStorage.setItem('pendingUserEmail', email);
      setPendingUserId(userIdStr);

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

      const response = await fetch(getEndpoint('/verify-2fa'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ensure Set-Cookie is persisted and sent later
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
      // Inform server to invalidate session/cookie
      try {
        await fetch(getEndpoint('/logout'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      } catch (e) {
        // proceed to local clear even if network fails
      }
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