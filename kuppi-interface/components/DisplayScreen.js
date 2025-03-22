import React, { useRef, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ThemeContext } from '../user_preference/ThemeContext';
import { LanguageContext } from '../user_preference/LanguageContext';
import themeColors from '../assets/ThemeColors.json';

const DisplayScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const { currentTheme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  };

  return (
    <LinearGradient
      colors={themeColors[currentTheme].background}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.mainTopic, { color: themeColors[currentTheme].text }]}>
            {note.title}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          <BlurView 
            intensity={currentTheme === 'light' ? 80 : 100} 
            tint={currentTheme} 
            style={styles.contentContainer}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.contentText, { color: themeColors[currentTheme].text }]}>
                {note.content}
              </Text>
            </ScrollView>
          </BlurView>

          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#4a90e2", "#357abd"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>{t.back || 'Back'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTopic: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 20,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DisplayScreen;