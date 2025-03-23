import React, { useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../authentication/AuthContext";
import { BlurView } from 'expo-blur';
import { ThemeContext } from '../user_preference/ThemeContext';
import { LanguageContext } from '../user_preference/LanguageContext';
import themeColors from '../assets/ThemeColors.json';

const HomeScreen = ({ navigation }) => {
  // Accessing user authentication context
  const { user } = useContext(AuthContext);
  // Accessing current theme from theme context
  const { currentTheme } = useContext(ThemeContext);
  // Accessing translation function from language context
  const { t } = useContext(LanguageContext);
  // Getting screen width for responsive design
  const { width } = Dimensions.get('window');

  // Animation references for fade and slide effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animation references for button scaling
  const buttonScales = {
    summarizer: useRef(new Animated.Value(1)).current,
    generateAnswer: useRef(new Animated.Value(1)).current,
    addNotes: useRef(new Animated.Value(1)).current,
    scanDocument: useRef(new Animated.Value(1)).current,
  };

  // Triggering animations on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Button press-in animation handler
  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 5,
    }).start();
  };

  // Button press-out animation handler and navigation
  const handlePressOut = (scale, screen) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => navigation.navigate(screen));
  };

  // Button gradient colors for different features
  const buttonColors = {
    summarizer: ['#4F46E5', '#7C3AED'],
    generateAnswer: ['#EC4899', '#F43F5E'],
    addNotes: ['#10B981', '#059669'],
    scanDocument: ['#F59E0B', '#EA580C'],
  };

  // Function to render a feature button
  const renderButton = (icon, titleKey, descKey, scale, screenName, colorScheme) => (
    <Animated.View style={[styles.buttonContainer, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={() => handlePressIn(scale)}
        onPressOut={() => handlePressOut(scale, screenName)}
        activeOpacity={0.9}
      >
        {/* Adding blur effect to the button */}
        <BlurView intensity={currentTheme === 'light' ? 80 : 100} tint={currentTheme} style={styles.blurContainer}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              {/* Gradient background for the button icon */}
              <LinearGradient
                colors={colorScheme}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonIcon}>{icon}</Text>
              </LinearGradient>
            </View>
            <View style={styles.buttonTextContainer}>
              {/* Button title and description */}
              <Text style={[styles.buttonTitle, { color: themeColors[currentTheme].text }]}>{t[titleKey]}</Text>
              <Text style={[styles.buttonDescription, { color: themeColors[currentTheme].subText }]}>{t[descKey]}</Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Background gradient for the screen */}
      <LinearGradient
        colors={themeColors[currentTheme].background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <View style={styles.header}>
              {/* Settings button to navigate to the Profile screen */}
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <Ionicons name="settings" size={45} color={themeColors[currentTheme].text} />
              </TouchableOpacity>
            </View>

            {/* Welcome text and user name */}
            <Text style={[styles.welcomeText, { color: themeColors[currentTheme].text }]}>{t.welcome}</Text>
            <Text style={[styles.title, { color: themeColors[currentTheme].text }]}>
              {user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()}
            </Text>
            <Text style={[styles.subtitle, { color: themeColors[currentTheme].subText }]}>
              {t.subtitle}
            </Text>

            {/* Grid of feature buttons */}
            <View style={styles.featuresGrid}>
              {renderButton(
                "📝",
                "summarizer",
                "summarizer_desc",
                buttonScales.summarizer,
                "Summarizer",
                buttonColors.summarizer
              )}
              {renderButton(
                "💡",
                "generate_answer",
                "generate_answer_desc",
                buttonScales.generateAnswer,
                "GenerateAnswer",
                buttonColors.generateAnswer
              )}
              {renderButton(
                "📖",
                "add_notes",
                "add_notes_desc",
                buttonScales.addNotes,
                "NoteBookScreen",
                buttonColors.addNotes
              )}
              {renderButton(
                "📄",
                "scan_document",
                "scan_document_desc",
                buttonScales.scanDocument,
                "ScanDocument",
                buttonColors.scanDocument
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
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
    paddingBottom: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingsButton: {
    marginRight: 0,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 20,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 120,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 20,
  },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 30,
  },
  buttonTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonDescription: {
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
  },
});

export default HomeScreen;