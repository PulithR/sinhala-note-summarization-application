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
};

export default SummarizerScreen;
