import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const OTPModal = ({ visible, onClose, email }) => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleVerifyOtp = () => {
    try {
      // await API
      onclose();
    } catch (error) {
      setOtpError("Error verifying OTP: " + error.message);
    }
  };


  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Enter OTP</Text>
            <Text style={styles.modalSubText}>
              We have sent a verification code to your email.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#7f8c8d"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
            {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

            <TouchableOpacity
              onPress={handleVerifyOtp}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={["#4a90e2", "#357abd"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Verify OTP</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    width: "85%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalSubText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    padding: 15,
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
  },
  closeText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "bold",
  },
});

export default OTPModal;
