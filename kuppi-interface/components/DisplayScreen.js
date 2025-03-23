import React, { useRef, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../user_preference/ThemeContext';
import { LanguageContext } from '../user_preference/LanguageContext';
import themeColors from '../assets/ThemeColors.json';
import { Ionicons } from "@expo/vector-icons";

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
    
    StatusBar.setBarStyle(currentTheme === 'light' ? 'dark-content' : 'light-content');
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
    <View style={styles.container}>
      <LinearGradient
        colors={themeColors[currentTheme].background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} />
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={[styles.sectionTitle, { color: themeColors[currentTheme].text }]}>
              {note.title}
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentWrapper}>
            <View 
              style={[
                styles.contentContainer,
                { 
                  backgroundColor: currentTheme === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: currentTheme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 1,
                  shadowColor: currentTheme === 'light' ? '#000' : 'transparent',
                  shadowOpacity: currentTheme === 'light' ? 0.1 : 0,
                }
              ]}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.contentText, { color: themeColors[currentTheme].text }]}>
                  {note.content}
                </Text>
              </ScrollView>
            </View>

            <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity
                style={styles.backButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderRadius: 18,
    overflow: 'hidden',
  },
  backButton: {
    height: 56,
    borderRadius: 18,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DisplayScreen;