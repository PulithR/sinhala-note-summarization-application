import { BASE_API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "userToken";

export const signUp = async (credentials) => {
  try {
    const response = await fetch(`${BASE_API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Signup failed");

    return { success: true, message: data.message, email: data.email };
  } catch (error) {
    return { success: false, error: error.message || "Network error" };
  }
};

export const verifySignupOTP = async (otpData) => {
  try {
    const response = await fetch(`${BASE_API_URL}/verify-signup-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(otpData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Invalid OTP");

    await AsyncStorage.setItem(STORAGE_KEY, data.token);
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return {
      success: false,
      error: error.message || "OTP verification failed",
    };
  }
};

export const requestPasswordReset = async (email) => {
  // OTP request for pass reset
};

export const verifyPassResetOTP = async (otpData) => {
  // logic to verify OTP
};

export const passwordReset = async (credentials) => {
  // logic to reset password
}