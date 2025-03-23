import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { AuthContext } from "../authentication/AuthContext";
import { BASE_API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from '../user_preference/ThemeContext';
import { LanguageContext } from '../user_preference/LanguageContext';
import themeColors from '../assets/ThemeColors.json';

const AddNotesScreen = () => {
  const { token } = useContext(AuthContext);
  const { currentTheme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  
  const navigation = useNavigation();
  
  const [noteText, setNoteText] = useState("");
  const [noteTopic, setNoteTopic] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const saveButtonScale = useRef(new Animated.Value(1)).current;
  const clearButtonScale = useRef(new Animated.Value(1)).current;

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

  const wordCount = noteText.trim() ? noteText.trim().split(/\s+/).length : 0;
  const charCount = noteText.length;

  const handleButtonPressIn = (scaleRef) => {
    Animated.spring(scaleRef, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handleButtonPressOut = (scaleRef) => {
    Animated.spring(scaleRef, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const clearNote = () => {
    Alert.alert(
      t.clear_note_title || "Clear Note",
      t.clear_note_message || "Are you sure you want to clear this note?",
      [
        { text: t.cancel || "Cancel", style: "cancel" },
        {
          text: t.clear || "Clear",
          onPress: () => {
            setNoteText("");
            setNoteTopic("");
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleAddNote = async () => {
    const title = noteTopic;
    const content = noteText;
    try {
      const response = await fetch(`${BASE_API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setIsSaved(true);
        Alert.alert(
          t.noteSavedTitle || "Success",
          t.noteSavedMessage || "Note added successfully!",
          [{
            text: t.ok || "OK",
            onPress: () => navigation.reset({
              index: 1,
              routes: [{ name: "Home" }, { name: "NoteBookScreen" }],
            }),
          }]
        );
      } else {
        const errorData = await response.json();
        Alert.alert(t.error || "Error", errorData.error || t.failed_to_add_note || "Failed to add note");
      }
    } catch (error) {
      Alert.alert(t.error || "Error", error.message);
    }
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
              <Text style={[styles.title, { color: themeColors[currentTheme].text }]}>
                {t.digital_notebook || "Digital Notebook"}
              </Text>
              <Text style={[styles.saveStatus, { color: themeColors[currentTheme].subText }]}>
                {isSaved ? (t.saved || "✓ Saved") : (t.editing || "• Editing")}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <BlurView 
                intensity={currentTheme === 'light' ? 50 : 30}
                tint={currentTheme === 'light' ? 'light' : 'dark'}
                style={styles.blurContainer}
              >
                <Text style={[styles.label, { color: themeColors[currentTheme].text }]}>
                  {t.topic || "Topic"}
                </Text>
                <TextInput
                  style={[styles.topicInput, { color: themeColors[currentTheme].text }]}
                  placeholder={t.enter_topic || "Enter the topic..."}
                  placeholderTextColor={themeColors[currentTheme].subText + '80'}
                  value={noteTopic}
                  onChangeText={(text) => {
                    setNoteTopic(text);
                    setIsSaved(false);
                  }}
                  maxLength={50}
                />
              </BlurView>
            </View>

            <View style={styles.buttonContainer}>
              <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: saveButtonScale }] }]}>
                <TouchableOpacity
                  style={styles.button}
                  onPressIn={() => handleButtonPressIn(saveButtonScale)}
                  onPressOut={() => {
                    handleButtonPressOut(saveButtonScale);
                    handleAddNote();
                  }}
                >
                  <LinearGradient
                    colors={themeColors[currentTheme].buttonColors}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.buttonText}>{t.save || "Save"}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: clearButtonScale }] }]}>
                <TouchableOpacity
                  style={styles.button}
                  onPressIn={() => handleButtonPressIn(clearButtonScale)}
                  onPressOut={() => {
                    handleButtonPressOut(clearButtonScale);
                    clearNote();
                  }}
                >
                  <LinearGradient
                    colors={['#F59E0B', '#EA580C']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.buttonText}>{t.clear || "Clear"}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <View style={styles.textareaContainer}>
              <BlurView 
                intensity={currentTheme === 'light' ? 50 : 30}
                tint={currentTheme === 'light' ? 'light' : 'dark'}
                style={styles.textareaBlurContainer}
              >
                <TextInput
                  style={[styles.textarea, { color: themeColors[currentTheme].text }]}
                  placeholder={t.start_writing || "Start writing your notes..."}
                  placeholderTextColor={themeColors[currentTheme].subText + '80'}
                  multiline
                  value={noteText}
                  onChangeText={(text) => {
                    setNoteText(text);
                    setIsSaved(false);
                  }}
                  textAlignVertical="top"
                />
              </BlurView>
            </View>

            <View style={styles.statsContainer}>
              <Text style={[styles.statsText, { color: themeColors[currentTheme].subText }]}>
                {t.words || "Words"}: {wordCount}
              </Text>
              <Text style={[styles.statsText, { color: themeColors[currentTheme].subText }]}>
                {t.characters || "Characters"}: {charCount}
              </Text>
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
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    padding: 20,
    paddingTop: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveStatus: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  blurContainer: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  topicInput: {
    height: 50,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
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
    padding: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  textareaContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  textareaBlurContainer: {
    padding: 16,
    minHeight: 400,
  },
  textarea: {
    height: 400,
    fontSize: 16,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  statsText: {
    fontSize: 14,
  },
});

export default AddNotesScreen;