import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TextArea from "../components/TextArea";

const SummarizerScreen = () => {
  const [text, setText] = useState("");

  const renderCharacterCount = () => {
    const maxLength = 200;
    const remaining = maxLength - text.length;
    const color =
      remaining < 20 ? "#e74c3c" : remaining < 50 ? "#f39c12" : "#7f8c8d";

    return (
      <View style={styles.charCountContainer}>
        <Text style={[styles.charCount, { color }]}>
          {remaining} characters remaining
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <LinearGradient colors={["#f0f8ff", "#e6f3ff"]} style={styles.gradient}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.mainTopic}>Summarizer</Text>
          </View>

          {/* Main Content */}
          <View style={styles.container}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>What can I help you summarize?</Text>
              <Text style={styles.sublabel}>
                Paste your text below and I'll create a concise summary
              </Text>
            </View>

            <View style={styles.textAreaContainer}>
              <TextArea
                value={text}
                onChangeText={setText}
                style={styles.customTextArea}
                placeholder="Enter or paste your text here..."
                maxLength={200}
              />
              {renderCharacterCount()}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { opacity: text.length > 0 ? 1 : 0.6 },
              ]}
              disabled={text.length === 0}
            >
              <LinearGradient
                colors={["#4a90e2", "#357abd"]}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitButtonText}>Generate Summary</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    header: {
      alignItems: "center",
      paddingTop: 60,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    mainTopic: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      color: "#2c3e50",
    },
    container: {
      flex: 1,
      padding: 20,
    },
    labelContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: 8,
    },
    sublabel: {
      fontSize: 16,
      color: "#7f8c8d",
      lineHeight: 22,
    },
    textAreaContainer: {
      flex: 1,
      marginBottom: 20,
    },
    customTextArea: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 15,
      minHeight: 200,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    charCountContainer: {
      marginTop: 8,
      alignItems: "flex-end",
    },
    charCount: {
      fontSize: 14,
    },
    submitButton: {
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    submitGradient: {
      paddingVertical: 16,
      alignItems: "center",
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default SummarizerScreen;
