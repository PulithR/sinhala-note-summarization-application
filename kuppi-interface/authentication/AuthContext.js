import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API_URL } from "@env";
import {
  signUp as signUpService,
  verifySignupOTP as verifySignupOTPService,
  requestPasswordReset as requestPassResetService,
  verifyPassResetOTP as verifyPassResetOTPService,
  passwordReset as passwordResetService
} from "../authentication/AuthService";

export const AuthContext = createContext();

const STORAGE_KEY = "userToken";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedToken) return setLoading(false);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${BASE_API_URL}/validate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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

  const login = async (credentials) => {
    try {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) alert(data.error || "Invalid credentials");

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

  const signUp = async (credentials) => {
    const result = await signUpService(credentials);
    return result;
  };

  const verifySignupOTP = async (otpData) => {
    const result = await verifySignupOTPService(otpData);
    if (result.success) {
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  };

  const requestPassReset = async (credentials) => {
    return await requestPassResetService(credentials);
  }

  const verifyPassResetOTP = async (credentials) => {
    return await verifyPassResetOTPService(credentials);
  }

  const passwordReset = async (credentials) => { 
    return await passwordResetService(credentials);
  }

  const authValue = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      signUp,
      verifySignupOTP,
      requestPassReset,
      verifyPassResetOTP,
      passwordReset,
    }),
    [
      user,
      token,
      loading,
      login,
      logout,
      signUp,
      verifySignupOTP,
      requestPassReset,
      verifyPassResetOTP,
      passwordReset,
    ]
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};