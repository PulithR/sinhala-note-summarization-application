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

const LoginScreen = ({ navigation }) => {
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
              colors={["#f0f8ff", "#e6f3ff"]} // Matching HomeScreen light theme
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
                    placeholderTextColor="#7f8c8d" // Matching HomeScreen subText
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
                      placeholderTextColor="#7f8c8d" // Matching HomeScreen subText
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

                  <TouchableOpacity
                    onPress={() =>
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "PasswordReset" }],
                      })
                    }
                  >
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
                        colors={["#4F46E5", "#7C3AED"]} // Matching HomeScreen summarizer button
                        style={styles.loginButton}
                      >
                        <Text style={styles.loginButtonText}>Login</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <Text style={styles.signupText}>
                    Don't have an account?{" "}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "SignUp" }],
                        })
                      }
                    >
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
    color: "#2c3e50", // Matching HomeScreen text
  },
  helper: {
    fontSize: 24,
    color: "#7f8c8d", // Matching HomeScreen subText
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
    color: "#2c3e50", // Matching HomeScreen text
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorText: {
    color: "#e74c3c",
    alignSelf: "flex-start",
    marginLeft: "5%",
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
    color: "#2c3e50", // Matching HomeScreen text
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: "#4F46E5", // Matching HomeScreen button gradient start
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#4F46E5", // Matching HomeScreen button gradient start
    marginTop: 10,
    marginRight: "1%",
    fontSize: 14,
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
    color: "#7f8c8d", // Matching HomeScreen subText
    marginTop: 20,
  },
  signupLink: {
    fontSize: 14,
    color: "#4F46E5", // Matching HomeScreen button gradient start
    fontWeight: "bold",
    top: 3,
    left: 4,
  },
});

export default LoginScreen;