import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TextArea from "../components/TextArea";
import { BASE_API_URL } from "@env";
import { AuthContext } from "../authentication/AuthContext";

const SummarizerScreen = () => {
  const { token } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const renderCharacterCount = () => {
    const maxLength = 3000;
    const remaining = maxLength - text.length;
    const color =
      remaining < 200 ? "#e74c3c" : remaining < 500 ? "#f39c12" : "#7f8c8d";

    return (
      <View style={styles.charCountContainer}>
        <Text style={[styles.charCount, { color }]}>
          {remaining} characters remaining
        </Text>
      </View>
    );
  };

  const handleSummarizeText = async () => {
    if (text.trim().length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/generate-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <LinearGradient colors={["#f0f8ff", "#e6f3ff"]} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.mainTopic}>Summarizer</Text>
              <View style={styles.headerDivider} />
            </View>

            {/* Main Content */}
            <View style={styles.container}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>What can I help you summarize?</Text>
                <Text style={styles.sublabel}>
                  Paste your text below and I'll create a concise summary.
                </Text>
              </View>

              <View style={styles.textAreaContainer}>
                <TextArea
                  value={text}
                  onChangeText={setText}
                  style={styles.customTextArea}
                  placeholder="Enter or paste your text here..."
                  maxLength={3000} 
                />
                {renderCharacterCount()}
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { opacity: text.trim().length > 0 ? 1 : 0.6 },
                ]}
                disabled={text.trim().length === 0 || isLoading}
                onPress={handleSummarizeText}
              >
                <LinearGradient
                  colors={["#4a90e2", "#357abd"]}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      Generate Summary
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Display Generated Summary */}
              {summary !== "" && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryHeaderContainer}>
                    <Text style={styles.summaryLabel}>Generated Summary</Text>
                    <View style={styles.summaryDivider} />
                  </View>
                  <Text style={styles.summaryText}>{summary}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerDivider: {
    height: 2,
    width: 60,
    backgroundColor: "#4a90e2",
    marginTop: 10,
    borderRadius: 2,
  },
  mainTopic: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  labelContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  sublabel: {
    fontSize: 16,
    color: "#7f8c8d",
    lineHeight: 22,
  },
  textAreaContainer: {
    marginBottom: 25,
  },
  customTextArea: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.2)",
  },
  charCountContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  charCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 15,
    shadowColor: "#357abd",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 56,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  summaryContainer: {
    marginTop: 25,
    padding: 22,
    backgroundColor: "#fff",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.15)",
  },
  summaryHeaderContainer: {
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
  },
  summaryDivider: {
    height: 2,
    width: "52%",
    backgroundColor: "#4a90e2",
    borderRadius: 2,
    alignSelf: "center",
  },
  summaryText: {
    fontSize: 16,
    color: "#34495e",
    lineHeight: 24,
  },
});

export default SummarizerScreen;
