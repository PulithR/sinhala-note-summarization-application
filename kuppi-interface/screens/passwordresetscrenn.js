import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PasswordResetScreen = ({ setShowPasswordReset }) => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    if (newPassword.length >= 6 && newPassword === confirmNewPassword) {
      setShowPasswordReset(false);
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
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <LinearGradient
                  colors={["#ffffff", "#f8f9ff"]}
                  style={styles.formContainer}
                >
                  <Text style={styles.header}>Reset Password</Text>
                  <Text style={styles.helper}>Enter your new password</Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputWithButton}
                      placeholder="New Password"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#7f8c8d"
                      value={newPassword}
                      onChangeText={(text) => {
                        setNewPassword(text);
                        if (text.length < 6) {
                          setPasswordError(
                            "Password must be at least 6 characters long"
                          );
                        } else {
                          setPasswordError("");
                        }
                      }}
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
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputWithButton}
                      placeholder="Confirm New Password"
                      secureTextEntry={!showConfirmPassword}
                      placeholderTextColor="#7f8c8d"
                      value={confirmNewPassword}
                      onChangeText={(text) => {
                        setConfirmNewPassword(text);
                        if (text !== newPassword) {
                          setConfirmPasswordError("Passwords do not match");
                        } else {
                          setConfirmPasswordError("");
                        }
                      }}
                    />
                    <TouchableOpacity
                      style={styles.visibilityButton}
                      activeOpacity={1}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Text style={styles.visibilityButtonText}>
                        {showConfirmPassword ? "HIDE" : "SHOW"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {confirmPasswordError ? (
                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                  ) : null}

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
                        style={styles.resetButton}
                      >
                        <Text style={styles.resetButtonText}>
                          Reset Password
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <TouchableOpacity
                    onPress={() => setShowPasswordReset(false)}
                    style={styles.backButton}
                  >
                    <Text style={styles.backButtonText}>Back to Login</Text>
                  </TouchableOpacity>
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
      color: "#2c3e50",
    },
    helper: {
      fontSize: 24,
      color: "#7f8c8d",
      textAlign: "center",
      marginBottom: 40,
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
      color: "blue",
    },
    errorText: {
      color: "#e74c3c",
      alignSelf: "flex-start",
      marginLeft: "5%",
      fontSize: 14,
    },
    resetButton: {
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
    resetButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    backButton: {
      marginTop: 20,
    },
    backButtonText: {
      fontSize: 14,
      color: "#4a90e2",
    },
  });
  
  export default PasswordResetScreen;