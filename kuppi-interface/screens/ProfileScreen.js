import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from "react-native";
import { ThemeContext } from "../user_preference/ThemeContext";
import { LanguageContext } from "../user_preference/LanguageContext";
import themeColors from "../assets/ThemeColors.json";
import LogoutButton from "../components/LogOutButton";

const ProfileScreen = ({ navigation }) => {
  const { currentTheme, toggleTheme } = React.useContext(ThemeContext);
  const { language, toggleLanguage, t } = React.useContext(LanguageContext);

  const renderFeatureCard = (icon, titleKey, descKey, action, colorScheme) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={action}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconGradient, { backgroundColor: colorScheme[0] }]}>
              <Text style={styles.buttonIcon}>{icon}</Text>
            </View>
          </View>
          <View style={styles.buttonTextContainer}>
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
      <View style={[styles.background, { backgroundColor: themeColors[currentTheme].background[0] }]}>
        <StatusBar barStyle={currentTheme === "light" ? "dark-content" : "light-content"} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: themeColors[currentTheme].text }]}>
                {t.profile_settings}
              </Text>
            </View>

            <View style={styles.featuresSection}>
              <Text style={[styles.sectionTitle, { color: themeColors[currentTheme].text }]}>
                {t.preferences}
              </Text>

              <View style={styles.featuresColumn}>
                {renderFeatureCard(
                  currentTheme === "light" ? "🌙" : "☀️",
                  "toggle_theme",
                  currentTheme === "light" ? "switch_to_dark" : "switch_to_light",
                  toggleTheme,
                  ["#4F46E5", "#7C3AED"]
                )}
                {renderFeatureCard(
                  language === "en" ? "🇬🇧" : "🇱🇰",
                  "toggle_language",
                  language === "en" ? "switch_to_sinhala" : "switch_to_english",
                  toggleLanguage,
                  ["#EC4899", "#F43F5E"]
                )}
              </View>

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
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  featuresColumn: {
    flexDirection: "column",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    borderRadius: 18,
    height: 100,
    padding: 16,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  buttonDescription: {
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
  },
});

export default ProfileScreen;