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

const SummarizerScreen = () => {
  const { token } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const { currentTheme } = useContext(ThemeContext);
  
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(50); // Default: 50%
  const [style, setStyle] = useState("casual"); // Default: casual
  
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
      const response = await fetch(`${BASE_API_URL}/generate-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          content: text,
          percentage: percentage,
          style: style
        }),
      });

      if (!response.ok) {
        throw new Error(t.errorFetchSummary || "Failed to fetch summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCharacterCount = () => {
    const maxLength = 5000;
    const remaining = maxLength - text.length;
    const color = remaining < 500 ? '#ef4444' : remaining < 1000 ? '#f59e0b' : themeColors[currentTheme].subText;

    return (
      <Text style={[styles.charCount, { color }]}>
        {remaining} {t.charactersRemaining || 'characters remaining'}
      </Text>
    );
  };

  const PercentageOption = ({ value }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        percentage === value && styles.optionButtonSelected,
        { borderColor: themeColors[currentTheme].accentColor }
      ]}
      onPress={() => setPercentage(value)}
    >
      <Text style={[
        styles.optionText,
        percentage === value && styles.optionTextSelected,
        { color: percentage === value ? '#FFFFFF' : themeColors[currentTheme].text }
      ]}>
        {value}%
      </Text>
    </TouchableOpacity>
  );

  const StyleOption = ({ value, label }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        style === value && styles.optionButtonSelected,
        { borderColor: themeColors[currentTheme].accentColor }
      ]}
      onPress={() => setStyle(value)}
    >
      <Text style={[
        styles.optionText,
        style === value && styles.optionTextSelected,
        { color: style === value ? '#FFFFFF' : themeColors[currentTheme].text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeColors[currentTheme].background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} />
        
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
              <Text style={[styles.headerTitle, {color: themeColors[currentTheme].text}]}>
                {t.summarizer || 'Summarizer'}
              </Text>
              <View style={styles.placeholder}></View>
            </View>

            <View style={styles.labelContainer}>
              <Text style={[styles.label, {color: themeColors[currentTheme].text}]}>
                {t.whatCanIHelpYouSummarize || 'What can I help you summarize?'}
              </Text>
              <Text style={[styles.sublabel, {color: themeColors[currentTheme].subText}]}>
                {t.pasteTextAndCreateSummary || "Paste your text below and I'll create a concise summary"}
              </Text>
            </View>

            <View style={styles.textAreaContainer}>
              <BlurView 
                intensity={currentTheme === 'light' ? 50 : 30}
                tint={currentTheme === 'light' ? 'light' : 'dark'}
                style={styles.blurContainer}
              >
                <TextArea
                  value={text}
                  onChangeText={setText}
                  style={[styles.customTextArea, {color: themeColors[currentTheme].text}]}
                  placeholder={t.enterTextHere || 'Enter or paste your text here...'}
                  placeholderTextColor={themeColors[currentTheme].subText + '80'}
                  maxLength={5000}
                  multiline
                />
                {renderCharacterCount()}
              </BlurView>
            </View>

            <View style={styles.optionsContainer}>
              <View style={styles.optionSection}>
                <Text style={[styles.optionLabel, {color: themeColors[currentTheme].text}]}>
                  {t.summaryLength || 'Summary Length'}
                </Text>
                <View style={styles.optionsRow}>
                  <PercentageOption value={25} />
                  <PercentageOption value={50} />
                  <PercentageOption value={75} />
                </View>
              </View>

              <View style={styles.optionSection}>
                <Text style={[styles.optionLabel, {color: themeColors[currentTheme].text}]}>
                  {t.summaryStyle || 'Summary Style'}
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
                { transform: [{ scale: buttonScale }] }
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
                      {t.generateSummary || 'Generate Summary'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {summary !== "" && (
              <View style={styles.summaryContainer}>
                <Text style={[styles.summaryLabel, {color: themeColors[currentTheme].text}]}>
                  {t.generatedSummary || 'Generated Summary'}
                </Text>
                <Text style={[styles.summaryInfo, {color: themeColors[currentTheme].subText}]}>
                  {percentage}% • {style === 'casual' ? (t.casual || 'Casual') : 
                    style === 'formal' ? (t.formal || 'Formal') : 
                    (t.academic || 'Academic')}
                </Text>
                <Text style={[styles.summaryText, {color: themeColors[currentTheme].subText}]}>
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
  optionsContainer: {
    marginBottom: 20,
  },
  optionSection: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
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
  summaryContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryInfo: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SummarizerScreen;