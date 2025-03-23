import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../authentication/AuthContext";
import OTPModal from "../components/OTPModal";

const SignUpScreen = ({ navigation }) => {
  // State variables for user input and UI behavior
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Accessing the signUp function from AuthContext
  const { signUp } = useContext(AuthContext);

  // Animation references for slide-in effect and button scaling
  const slideAnim = useRef(new Animated.Value(700)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Slide-in animation for the form container
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Button press-in animation for scaling down
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  // Button press-out animation for scaling back up and handling sign-up logic
  const handlePressOut = async () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    try {
      // Ensure all required fields are filled
      if (email && password && confirmPassword) {
        setOtpLoading(true);
        const response = await signUp({ email, name, password });
        setOtpLoading(false);
        if (response.success) {
          setModalVisible(true); // Show OTP modal on successful sign-up
        } else {
          alert(response.error); // Show error message if sign-up fails
        }
      } else {
        alert("Please enter credentials!"); // Prompt user to fill all fields
      }
    } catch (error) {
      alert("Error initiating sign-up: " + error.message); // Handle unexpected errors
    } finally {
      setOtpLoading(false); // Ensure loading state is reset
    }
  };

  // Email validation logic
  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError("Enter a valid email"); // Show error if email is invalid
    } else {
      setEmailError(""); // Clear error if email is valid
    }
  };

  // Password validation logic
  const validatePassword = (text) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters long"); // Enforce minimum password length
    } else {
      setPasswordError(""); // Clear error if password is valid
    }
  };

  // Confirm password validation logic
  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordError("Passwords do not match"); // Ensure passwords match
    } else {
      setConfirmPasswordError(""); // Clear error if passwords match
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust for keyboard on iOS
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside
      >
        <LinearGradient
          colors={["#f0f8ff", "#e6f3ff"]} // Background gradient
          style={styles.background}
        >
          <View style={styles.topHalf}>
            <Image
              source={require("../assets/login.png")} // Display logo or image
              style={styles.image}
            />
          </View>

          <Animated.View
            style={[
              styles.bottomHalf,
              {
                transform: [{ translateX: slideAnim }], // Slide-in animation
              },
            ]}
          >
            <LinearGradient
              colors={["#ffffff", "#f8f9ff"]} // Form container gradient
              style={styles.formContainer}
            >
              <Text style={styles.header}>Create an Account</Text>
              <Text style={styles.helper}>Sign up to get started</Text>

              {/* Email input field */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#7f8c8d"
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text> // Show email error
              ) : null}

              {/* Name input field */}
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#7f8c8d"
                value={name}
                onChangeText={setName}
              />

              {/* Password input field with visibility toggle */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithButton}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#7f8c8d"
                  value={password}
                  onChangeText={validatePassword}
                />
                <TouchableOpacity
                  style={styles.visibilityButton}
                  activeOpacity={1}
                  onPress={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  <Text style={styles.visibilityButtonText}>
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text> // Show password error
              ) : null}

              {/* Confirm password input field with visibility toggle */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithButton}
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#7f8c8d"
                  value={confirmPassword}
                  onChangeText={validateConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.visibilityButton}
                  activeOpacity={1}
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  } // Toggle confirm password visibility
                >
                  <Text style={styles.visibilityButtonText}>
                    {showConfirmPassword ? "HIDE" : "SHOW"}
                  </Text>
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text> // Show confirm password error
              ) : null}

              {/* Sign-up button with loading indicator */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={0.9}
                  disabled={otpLoading} // Disable button while loading
                >
                  <LinearGradient
                    colors={["#4F46E5", "#7C3AED"]} // Button gradient
                    style={[
                      styles.loginButton,
                      otpLoading && { opacity: 0.7 }, // Dim button while loading
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {otpLoading ? (
                      <ActivityIndicator color="#fff" /> // Show loading spinner
                    ) : (
                      <Text style={styles.loginButtonText}>Sign Up</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Link to navigate to Login screen */}
              <Text style={styles.signupText}>
                Already have an account?{" "}
                <TouchableOpacity
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }], // Reset navigation stack to Login screen
                    });
                  }}
                >
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </Text>
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
      </ScrollView>

      {/* OTP modal for verification */}
      <OTPModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        email={email}
        isInSignup={true}
      />
    </KeyboardAvoidingView>
  );
};

// Styles for the SignUpScreen components
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  topHalf: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    paddingTop: 40,
  },
  bottomHalf: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  formContainer: {
    width: "100%",
    height: "100%",
    paddingTop: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#2c3e50",
  },
  helper: {
    fontSize: 24,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    marginVertical: 10,
    padding: 15,
    fontSize: 16,
    color: "#2c3e50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: "#e74c3c",
    alignSelf: "flex-start",
    marginLeft: "8%",
    fontSize: 14,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  inputWithButton: {
    width: "70%",
    height: 49,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#ffffff",
    padding: 15,
    paddingRight: 70,
    fontSize: 16,
    color: "#2c3e50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  visibilityButton: {
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 5,
    marginRight: 10,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  visibilityButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#4F46E5",
  },
  loginButton: {
    width: 300,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 20,
  },
  loginLink: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "bold",
    top: 3,
    left: 4,
  },
});

export default SignUpScreen;