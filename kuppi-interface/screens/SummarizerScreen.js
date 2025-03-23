import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import TextArea from "../components/TextArea";
import { BASE_API_URL } from "@env";
import { AuthContext } from "../authentication/AuthContext";
import { LanguageContext } from "../user_preference/LanguageContext";
import { ThemeContext } from "../user_preference/ThemeContext";
import themeColors from "../assets/ThemeColors.json";

// The main component for summarizing text
const SummarizerScreen = () => {
  // Pull in user token, translation function, and current theme from contexts
  const { token } = useContext(AuthContext); // User authentication token
  const { t } = useContext(LanguageContext); // Translation function for multi-language support
  const { currentTheme } = useContext(ThemeContext); // Current theme (light or dark)

  // State to manage text input, summary output, and UI interactions
  const [text, setText] = useState(""); // Text entered by the user
  const [summary, setSummary] = useState(""); // Generated summary text
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [percentage, setPercentage] = useState(50); // Default summary length (50%)
  const [style, setStyle] = useState("casual"); // Default summary style (casual)

  // Animation refs for smooth transitions
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade-in animation
  const slideAnim = useRef(new Animated.Value(50)).current; // Slide-up animation
  const buttonScale = useRef(new Animated.Value(1)).current; // Button press scale animation

  // Setup initial effects when the screen loads
  useEffect(() => {
    // Set status bar style based on the theme
    StatusBar.setBarStyle(currentTheme === "light" ? "dark-content" : "light-content");
    // Start fade and slide animations for a nice entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Shrink the button slightly when pressed
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97, // Slightly smaller
      useNativeDriver: true,
      speed: 50, // Quick response
    }).start();
  };

  // Handle button release and trigger summary generation
  const handlePressOut = async () => {
    // Bounce the button back to normal size
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Don’t proceed if there’s no text
    if (text.trim().length === 0) return;

    setIsLoading(true); // Show loading spinner
    try {
      // Send the text to the server for summarization
      const response = await fetch(`${BASE_API_URL}/generate-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Authenticate the request
        },
        body: JSON.stringify({
          content: text,
          percentage: percentage, // Desired summary length
          style: style, // Desired summary style
        }),
      });

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(t.errorFetchSummary || "Failed to fetch summary");
      }

      const data = await response.json();
      setSummary(data.summary); // Display the summary
    } catch (error) {
      alert(error.message); // Show error if something goes wrong
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // Show how many characters are left for the text input
  const renderCharacterCount = () => {
    const maxLength = 5000; // Maximum allowed characters
    const remaining = maxLength - text.length;
    // Change color based on how many characters are left
    const color =
      remaining < 500
        ? "#ef4444" // Red when almost full
        : remaining < 1000
        ? "#f59e0b" // Orange when getting close
        : themeColors[currentTheme].subText; // Normal color otherwise

    return (
      <Text style={[styles.charCount, { color }]}>
        {remaining} {t.charactersRemaining || "characters remaining"}
      </Text>
    );
  };

  // Component for selecting summary length percentage
  const PercentageOption = ({ value }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        percentage === value && styles.optionButtonSelected, // Highlight if selected
        {
          borderColor:
            percentage === value
              ? "transparent"
              : currentTheme === "dark"
              ? "rgba(255, 255, 255, 0.1)" // Subtle border for dark theme
              : "rgba(0, 0, 0, 0.1)", // Subtle border for light theme
        },
      ]}
      onPress={() => setPercentage(value)}
      activeOpacity={0.85} // Slight fade on press
    >
      <Text
        style={[
          styles.optionText,
          percentage === value && styles.optionTextSelected,
          {
            color: percentage === value ? "#FFFFFF" : themeColors[currentTheme].text, // White if selected
          },
        ]}
      >
        {value}%
      </Text>
    </TouchableOpacity>
  );

  // Component for selecting summary style
  const StyleOption = ({ value, label }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        style === value && styles.optionButtonSelected, // Highlight if selected
        {
          borderColor:
            style === value
              ? "transparent"
              : currentTheme === "dark"
              ? "rgba(255, 255, 255, 0.1)" // Subtle border for dark theme
              : "rgba(0, 0, 0, 0.1)", // Subtle border for light theme
        },
      ]}
      onPress={() => setStyle(value)}
      activeOpacity={0.85} // Slight fade on press
    >
      <Text
        style={[
          styles.optionText,
          style === value && styles.optionTextSelected,
          {
            color: style === value ? "#FFFFFF" : themeColors[currentTheme].text, // White if selected
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // The main UI render
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeColors[currentTheme].background} // Gradient background based on theme
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar
          barStyle={currentTheme === "light" ? "dark-content" : "light-content"} // Status bar style
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false} // Hide scroll bar
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim, // Fade in
                transform: [{ translateY: slideAnim }], // Slide up
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: themeColors[currentTheme].text }]}>
                {t.summarizer || "Summarizer"} // Translated title
              </Text>
              <View style={styles.placeholder}></View> {/* Placeholder for spacing */}
            </View>

            <View style={styles.labelContainer}>
              <Text style={[styles.label, { color: themeColors[currentTheme].text }]}>
                {t.whatCanIHelpYouSummarize || "What can I help you summarize?"}
              </Text>
              <Text style={[styles.sublabel, { color: themeColors[currentTheme].subText }]}>
                {t.pasteTextAndCreateSummary || "Paste your text below and I'll create a concise summary"}
              </Text>
            </View>

            <View style={styles.textAreaContainer}>
              <BlurView
                intensity={currentTheme === "light" ? 50 : 30} // Blur effect based on theme
                tint={currentTheme === "light" ? "light" : "dark"}
                style={styles.blurContainer}
              >
                <TextArea
                  value={text}
                  onChangeText={setText}
                  style={[styles.customTextArea, { color: themeColors[currentTheme].text }]}
                  placeholder={t.enterTextHere || "Enter or paste your text here..."}
                  placeholderTextColor={themeColors[currentTheme].subText + "80"} // Slightly transparent
                  maxLength={5000} // Limit text input
                  multiline // Allow multiple lines
                />
                {renderCharacterCount()} {/* Show remaining characters */}
              </BlurView>
            </View>

            <View style={styles.optionsContainer}>
              <View style={styles.optionSection}>
                <Text style={[styles.optionLabel, { color: themeColors[currentTheme].text }]}>
                  {t.summaryLength || "Summary Length"}
                </Text>
                <View style={styles.optionsRow}>
                  <PercentageOption value={25} />
                  <PercentageOption value={50} />
                  <PercentageOption value={75} />
                </View>
              </View>

              <View style={styles.optionSection}>
                <Text style={[styles.optionLabel, { color: themeColors[currentTheme].text }]}>
                  {t.summaryStyle || "Summary Style"}
                </Text>
                <View style={styles.optionsRow}>
                  <StyleOption value="casual" label={t.casual || "Casual"} />
                  <StyleOption value="formal" label={t.formal || "Formal"} />
                  <StyleOption value="academic" label={t.academic || "Academic"} />
                </View>
              </View>
            </View>

            <Animated.View
              style={[
                styles.buttonContainer,
                { transform: [{ scale: buttonScale }] }, // Scale animation for button
              ]}
            >
              <TouchableOpacity
                style={[styles.button, { opacity: text.length > 0 ? 1 : 0.6 }]} // Dim if no text
                disabled={text.length === 0 || isLoading} // Disable if no text or loading
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={themeColors[currentTheme].buttonColors} // Gradient for button
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" /> // Show spinner when loading
                  ) : (
                    <Text style={styles.buttonText}>
                      {t.generateSummary || "Generate Summary"}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {summary !== "" && (
              // Show the summary if it exists
              <View style={styles.summaryContainer}>
                <Text style={[styles.summaryLabel, { color: themeColors[currentTheme].text }]}>
                  {t.generatedSummary || "Generated Summary"}
                </Text>
                <Text style={[styles.summaryInfo, { color: themeColors[currentTheme].subText }]}>
                  {percentage}% •{" "}
                  {style === "casual"
                    ? t.casual || "Casual"
                    : style === "formal"
                    ? t.formal || "Formal"
                    : t.academic || "Academic"}
                </Text>
                <Text style={[styles.summaryText, { color: themeColors[currentTheme].subText }]}>
                  {summary}
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

// Styles for the UI layout and components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the entire screen
  },
  background: {
    flex: 1, // Gradient background takes full space
  },
  scrollView: {
    flex: 1, // Scrollable content area
  },
  scrollContent: {
    flexGrow: 1, // Allow content to grow with scroll
    paddingBottom: 30, // Extra space at the bottom
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100, // Space for header
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40, // Placeholder for balancing header layout
  },
  labelContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 16,
    lineHeight: 22,
  },
  textAreaContainer: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle background
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    minHeight: 250, // Minimum height for text area
  },
  customTextArea: {
    flex: 1,
    fontSize: 16,
    minHeight: 200,
  },
  charCount: {
    marginTop: 10,
    textAlign: "right",
    fontSize: 14,
  },
  optionsContainer: {
    marginBottom: 28,
    marginHorizontal: 4,
  },
  optionSection: {
    marginBottom: 22,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButtonSelected: {
    backgroundColor: themeColors?.["dark"]?.accentColor || "#6366f1", // Highlight color
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  optionTextSelected: {
    color: "#FFFFFF", // White text for selected option
  },
  buttonContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    borderRadius: 18,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle background for summary
  },
  summaryLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  summaryInfo: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
    opacity: 0.8, // Slightly faded
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SummarizerScreen;