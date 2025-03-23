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
  Platform,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import TextArea from "../components/TextArea";
import { BASE_API_URL } from "@env";
import { AuthContext } from "../authentication/AuthContext";
import { LanguageContext } from "../user_preference/LanguageContext";
import { ThemeContext } from "../user_preference/ThemeContext";
import themeColors from "../assets/ThemeColors.json";

const AnswerGeneratorScreen = () => {
  const { token } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const { currentTheme } = useContext(ThemeContext);
  
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle(currentTheme === 'light' ? 'dark-content' : 'light-content');
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

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = async () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    if (text.trim().length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/generate-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error(t.errorFetchAnswer || "Failed to fetch answer");
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCharacterCount = () => {
    const maxLength = 3000;
    const remaining = maxLength - text.length;
    const color = remaining < 500 ? '#ef4444' : remaining < 1000 ? '#f59e0b' : themeColors[currentTheme].subText;

    return (
      <Text style={[styles.charCount, { color }]}>
        {remaining} {t.charactersRemaining || 'characters remaining'}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeColors[currentTheme].background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar
          barStyle={currentTheme === "light" ? "dark-content" : "light-content"}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.header}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: themeColors[currentTheme].text },
                ]}
              >
                {t.generate_answer || "Answer Generator"}
              </Text>
              <View style={styles.placeholder}></View>
            </View>

            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.label,
                  { color: themeColors[currentTheme].text },
                ]}
              >
                {t.whatIsYourQuestion || "What is your question?"}
              </Text>
              <Text
                style={[
                  styles.sublabel,
                  { color: themeColors[currentTheme].subText },
                ]}
              >
                {t.enterQuestionBelow ||
                  "Enter your question below and I'll generate a detailed answer"}
              </Text>
            </View>

            <View style={styles.textAreaContainer}>
              <BlurView
                intensity={
                  Platform.OS === "android"
                    ? 20
                    : currentTheme === "light"
                    ? 50
                    : 30
                }
                tint={currentTheme === "light" ? "light" : "dark"}
                style={styles.blurContainer}
              >
                <TextArea
                  value={text}
                  onChangeText={setText}
                  style={[
                    styles.customTextArea,
                    { color: themeColors[currentTheme].text },
                  ]}
                  placeholder={
                    t.typeYourQuestionHere || "Type your question here..."
                  }
                  placeholderTextColor={
                    themeColors[currentTheme].subText + "80"
                  }
                  maxLength={3000}
                  multiline
                />
                {renderCharacterCount()}
              </BlurView>
            </View>

            <Animated.View
              style={[
                styles.buttonContainer,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <TouchableOpacity
                style={[styles.button, { opacity: text.length > 0 ? 1 : 0.6 }]}
                disabled={text.length === 0 || isLoading}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={themeColors[currentTheme].buttonColors}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {t.generateAnswer || "Generate Answer"}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {answer !== "" && (
              <View style={styles.answerContainer}>
                <Text
                  style={[
                    styles.answerLabel,
                    { color: themeColors[currentTheme].text },
                  ]}
                >
                  {t.generatedAnswer || "Generated Answer"}
                </Text>
                <Markdown
                  style={[
                    styles.answerText,
                    { color: themeColors[currentTheme].subText },
                  ]}
                >
                  {answer}
                </Markdown>
              </View>
            )}
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
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  labelContainer: {
    marginBottom: 20,
    alignItems: 'center'
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
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
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    minHeight: 250,
  },
  customTextArea: {
    flex: 1,
    fontSize: 16,
    minHeight: 200,
  },
  charCount: {
    marginTop: 10,
    textAlign: 'right',
    fontSize: 14,
  },
  buttonContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  answerLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AnswerGeneratorScreen;