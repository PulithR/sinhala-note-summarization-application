import React, { useState, useRef, useEffect, useContext } from "react";
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
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../authentication/AuthContext";

const LoginScreen = ({ setShowSignUp, setShowPasswordReset }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { login } = useContext(AuthContext);

  const slideAnim = useRef(new Animated.Value(-350)).current;
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

    await login({ email, password });
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


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                <LinearGradient
                  colors={["#ffffff", "#f8f9ff"]}
                  style={styles.formContainer}
                >
                  <Text style={styles.header}>Welcome Back!</Text>
                  <Text style={styles.helper}>Sign in to continue</Text>

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

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputWithButton}
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#7f8c8d"
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      style={styles.visibilityButton}
                      activeOpacity={1}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.visibilityButtonText}>
                        {showPassword ? "HIDE" : "SHOW"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => {setShowPasswordReset(true)}}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <Animated.View
                    style={{ transform: [{ scale: buttonScale }] }}
                  >
                    <TouchableOpacity
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={["#4a90e2", "#357abd"]}
                        style={styles.loginButton}
                      >
                        <Text style={styles.loginButtonText}>Login</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <Text style={styles.signupText}>
                    Don't have an account?{" "}
                    <TouchableOpacity onPress={() => setShowSignUp(true)}>
                      <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                  </Text>
                </LinearGradient>
              </Animated.View>
            </LinearGradient>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};