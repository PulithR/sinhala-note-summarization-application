import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const userData = await validateToken(token);
        setUser(userData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error while checking auth status:", error);
      setLoading(false);
    }

    const login = async (credentials) => {
      const login = async (credentials) => {
        try {
          const response = await loginAPIWithCredentials; //place holder to add login API
          await AsyncStorage.setItem("userToken", response.token);
          setUser(response.user);
        } catch (error) {
          console.error("Login error:", error.message);
        }
      };
    }

    const logout = async () => {
      await AsyncStorage.removeItem("userToken");
      setUser(null);
    };

    return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }
}