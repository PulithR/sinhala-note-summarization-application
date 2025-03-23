import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from "react-native";
import { ThemeContext } from "../user_preference/ThemeContext";
import { LanguageContext } from "../user_preference/LanguageContext";
import themeColors from "../assets/ThemeColors.json";
import LogoutButton from "../components/LogOutButton";

const ProfileScreen = ({ navigation }) => {
  // Access theme and language context values
  const { currentTheme, toggleTheme } = React.useContext(ThemeContext);
  const { language, toggleLanguage, t } = React.useContext(LanguageContext);

  // Function to render a feature card with icon, title, description, and action
  const renderFeatureCard = (icon, titleKey, descKey, action, colorScheme) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={action}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            {/* Icon with gradient background */}
            <View style={[styles.iconGradient, { backgroundColor: colorScheme[0] }]}>
              <Text style={styles.buttonIcon}>{icon}</Text>
            </View>
          </View>
          <View style={styles.buttonTextContainer}>
            {/* Title and description for the feature */}
            <Text style={[styles.buttonTitle, { color: themeColors[currentTheme].text }]}>
              {t[titleKey]}
            </Text>
            <Text style={[styles.buttonDescription, { color: themeColors[currentTheme].subText }]}>
              {t[descKey]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background with dynamic theme color */}
      <View style={[styles.background, { backgroundColor: themeColors[currentTheme].background[0] }]}>
        {/* Status bar style based on theme */}
        <StatusBar barStyle={currentTheme === "light" ? "dark-content" : "light-content"} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header section with title */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: themeColors[currentTheme].text }]}>
                {t.profile_settings}
              </Text>
            </View>

            {/* Features section */}
            <View style={styles.featuresSection}>
              <Text style={[styles.sectionTitle, { color: themeColors[currentTheme].text }]}>
                {t.preferences}
              </Text>

              {/* Feature cards for theme and language toggles */}
              <View style={styles.featuresColumn}>
                {renderFeatureCard(
                  currentTheme === "light" ? "🌙" : "☀️", // Icon changes based on theme
                  "toggle_theme",
                  currentTheme === "light" ? "switch_to_dark" : "switch_to_light",
                  toggleTheme,
                  ["#4F46E5", "#7C3AED"] // Gradient colors for the icon
                )}
                {renderFeatureCard(
                  language === "en" ? "🇬🇧" : "🇱🇰", // Icon changes based on language
                  "toggle_language",
                  language === "en" ? "switch_to_sinhala" : "switch_to_english",
                  toggleLanguage,
                  ["#EC4899", "#F43F5E"] // Gradient colors for the icon
                )}
              </View>

              {/* Logout button */}
              <LogoutButton />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen container
  },
  background: {
    flex: 1, // Background fills the screen
  },
  scrollView: {
    flex: 1, // Scrollable content
  },
  scrollContent: {
    paddingBottom: 30, // Extra padding at the bottom
  },
  content: {
    flex: 1,
    paddingHorizontal: 20, // Horizontal padding for content
    paddingTop: 100, // Top padding for content
  },
  header: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between header items
    alignItems: "center", // Center items vertically
    marginBottom: 20, // Space below the header
  },
  title: {
    fontSize: 28, // Large title font size
    fontWeight: "bold", // Bold title
  },
  featuresSection: {
    marginBottom: 30, // Space below the features section
  },
  sectionTitle: {
    fontSize: 22, // Section title font size
    fontWeight: "bold", // Bold section title
    marginBottom: 15, // Space below the section title
  },
  featuresColumn: {
    flexDirection: "column", // Stack feature cards vertically
  },
  buttonContainer: {
    width: "100%", // Full width button container
    marginBottom: 16, // Space below each button
    borderRadius: 18, // Rounded corners
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
  },
  button: {
    borderRadius: 18, // Rounded corners for the button
    height: 100, // Fixed height for buttons
    padding: 16, // Padding inside the button
  },
  cardContent: {
    flex: 1,
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center items vertically
  },
  iconContainer: {
    marginRight: 16, // Space to the right of the icon
  },
  iconGradient: {
    width: 50, // Icon container width
    height: 50, // Icon container height
    borderRadius: 15, // Rounded corners for the icon container
    justifyContent: "center", // Center icon horizontally
    alignItems: "center", // Center icon vertically
  },
  buttonIcon: {
    fontSize: 24, // Icon font size
  },
  buttonTextContainer: {
    flex: 1, // Take up remaining space
    justifyContent: "center", // Center text vertically
  },
  buttonTitle: {
    fontSize: 16, // Title font size
    fontWeight: "bold", // Bold title
    marginBottom: 6, // Space below the title
  },
  buttonDescription: {
    fontSize: 14, // Description font size
    opacity: 0.9, // Slightly transparent text
    lineHeight: 20, // Line height for better readability
  },
});

export default ProfileScreen;