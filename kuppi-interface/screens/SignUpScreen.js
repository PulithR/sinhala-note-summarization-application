import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../authentication/AuthContext";

const SignUpScreen = ({ setShowSignUp }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { signUp } = useContext(AuthContext);

  const slideAnim = useRef(new Animated.Value(700)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = async () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    await signUp({ email, name, password });
  };

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError("Enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // const validateForm = () => {
  //   let isValid = true;
  //   if (!email) {
  //     setEmailError("Email is required");
  //     isValid = false;
  //   }
  //   if (!password) {
  //     setPasswordError("Password is required");
  //     isValid = false;
  //   }
  //   if (password !== confirmPassword) {
  //     setConfirmPasswordError("Passwords do not match");
  //     isValid = false;
  //   }
  //   return isValid;
  // };

  return (
    <View
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={["#f0f8ff", "#e6f3ff"]}
          style={styles.background}
        >
          <View style={styles.topHalf}>
            <Image
              source={require("../assets/login.png")}
              style={styles.image}
            />
          </View>

          <Animated.View
            style={[
              styles.bottomHalf,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["#ffffff", "#f8f9ff"]}
              style={styles.formContainer}
            >
              <Text style={styles.header}>Create an Account</Text>
              <Text style={styles.helper}>Sign up to get started</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#7f8c8d"
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#7f8c8d"
                value={name}
                onChangeText={setName}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#7f8c8d"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <Text style={styles.showPassword}>
                    {showPassword ? "HIDE " : "SHOW"}
                  </Text>
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#7f8c8d"
                  value={confirmPassword}
                  onChangeText={validateConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  <Text style={styles.showPassword}>
                    {showConfirmPassword ? "HIDE " : "SHOW"}
                  </Text>
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#4a90e2", "#357abd"]}
                    style={styles.loginButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.loginButtonText}>Sign Up</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <Text style={styles.signupText}>
                Already have an account?{" "}
                <TouchableOpacity onPress={() => setShowSignUp(false)}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </Text>
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

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
    width: "90%",
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
    marginLeft: "5%",
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  showPassword: {
    fontSize: 13,
    fontWeight: "700",
    color: "blue",
    position: "absolute",
    right: 10,
    top: 24,
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
    color: "#4a90e2",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
