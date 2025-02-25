import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API_URL } from "@env";

export const AuthContext = createContext();

const STORAGE_KEY = "userToken";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_API_URL}/validate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        timeout: 5000,
      });

      if (response.ok) {
        const data = await response.json();
        setToken(storedToken);
        setUser({ name: data.user.name, email: data.user.email });
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Auth check failed:", error.message);
      await AsyncStorage.removeItem(STORAGE_KEY); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signUp = async (credentials) => {
    try {
      const response = await fetch(`${BASE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }
      return { success: true, message: data.message, email: data.email }; 
    } catch (error) {
      return {
        success: false,
        error: error.message || "Network error. Please check your connection.",
      };
    }
  };

  const verifyOTP = async (otpData) => {
    try {
      const response = await fetch(`${BASE_API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      await AsyncStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      setUser({ name: data.user.name, email: data.user.email }); 
    } catch (error) {
      throw new Error(
        error.message || "OTP verification failed. Please try again."
      );
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      await AsyncStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      setUser({ name: data.user.name, email: data.user.email });
    } catch (error) {
      throw new Error(error.message || "Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY]); 
      setUser(null);
      setToken(null);
      return { success: true };
    } catch (error) {
      console.warn("Logout failed:", error.message);
      return { success: false, error: "Logout failed" };
    }
  };

  const authValue = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      signUp,
      verifyOTP,
      logout,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};