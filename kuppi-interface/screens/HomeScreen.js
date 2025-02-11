import React, { useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../authentication/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  // Animation values for fade-in and slide-up effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Button scale animations
  const buttonScales = {
    summarizer: useRef(new Animated.Value(1)).current,
    generateAnswer: useRef(new Animated.Value(1)).current,
    addNotes: useRef(new Animated.Value(1)).current,
    scanDocument: useRef(new Animated.Value(1)).current,
    logIn: useRef(new Animated.Value(1)).current,
  };

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

  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 5,
    }).start();
  };

  const handlePressOut = (scale, screen) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => navigation.navigate(screen));
  };

  const renderButton = (icon, title, description, scale, screenName) => (
    <Animated.View style={[styles.buttonContainer, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={() => handlePressIn(scale)}
        onPressOut={() => handlePressOut(scale, screenName)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={["#4a90e2", "#357abd"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonIcon}>{`${icon}`}</Text>
          {/* Ensure this is wrapped in Text */}
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>{title}</Text>
            <Text style={styles.buttonDescription}>{description}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {" "}
      {/* Wrap with ScrollView */}
      <LinearGradient colors={["#f0f8ff", "#e6f3ff"]} style={styles.background}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text
            style={[styles.title, { color: "red" }, { fontWeight: "bold" }]}
          >
            {`${user.name}`
              .substring(0, 1)
              .toLocaleUpperCase()
              .concat(
                `${user.name}`
                  .substring(1, `${user.name}`.length)
                  .toLocaleLowerCase()
              )}
          </Text>
          <Text style={styles.title}>What would you like to do?</Text>

          {/* Gear Icon Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person-circle" size={45} color="#2c3e50" />
          </TouchableOpacity>

          {renderButton(
            "📝",
            "Summarizer",
            "Get quick summaries of your documents",
            buttonScales.summarizer,
            "Summarizer"
          )}

          {renderButton(
            "💡",
            "Generate Answer",
            "Get instant answers to your questions",
            buttonScales.generateAnswer,
            "GenerateAnswer"
          )}

          {renderButton(
            "📖",
            "Add Notes",
            "Create and organize your notes",
            buttonScales.addNotes,
            "AddNotesScreen"
          )}

          {renderButton(
            "📄",
            "Scan Document",
            "Scan and digitize your documents",
            buttonScales.scanDocument,
            "ScanDocument"
          )}
        </Animated.View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    color: "#7f8c8d",
    marginBottom: 40,
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  buttonContainer: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  buttonIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 14,
    color: "#e8f4ff",
    opacity: 0.9,
  },
});

export default HomeScreen;
