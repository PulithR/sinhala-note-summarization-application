import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LanguageContext } from '../user_preference/LanguageContext';
import { ThemeContext } from '../user_preference/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import themeColors from '../assets/ThemeColors.json';
import { Ionicons } from "@expo/vector-icons";

const ScanDocumentScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useContext(LanguageContext);
  const { currentTheme } = useContext(ThemeContext);

  const buttonColors = {
    camera: themeColors[currentTheme].buttonColors,
    gallery: ['#F59E0B', '#EA580C'],
    retake: ['#EC4899', '#F43F5E'],
    submit: themeColors[currentTheme].buttonColors,
  };

  useEffect(() => {
    StatusBar.setBarStyle(currentTheme === 'light' ? 'dark-content' : 'light-content');
    (async () => {
      await ImagePicker.getMediaLibraryPermissionsAsync();
    })();
  }, []);

  const openCamera = async () => {
    try {
      setLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert(t.camera_permission_required || "Camera permission is required.");
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert(t.camera_error || "Failed to open camera.");
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      setLoading(true);
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== "granted") {
          alert(t.gallery_permission_required || "Gallery permission is required.");
          setLoading(false);
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      alert(t.gallery_error || "Failed to open gallery.");
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureAgain = () => {
    setPhoto(null);
    openCamera();
  };

  const handleSubmit = async () => {
    if (!photo) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", {
        uri: photo,
        name: "document.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(`${BASE_API_URL}/ocr`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      alert((t.extracted_text || "Extracted Text") + ": " + data.text);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t.failed_to_process || "Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPhoto(null);
      setLoading(false);
    }, [])
  );

  const renderButton = (icon, title, action, colorScheme) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={action}
        activeOpacity={0.9}
        disabled={loading}
      >
        <BlurView 
          intensity={currentTheme === 'light' ? 50 : 30} 
          tint={currentTheme === 'light' ? 'light' : 'dark'} 
          style={styles.blurContainer}
        >
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={colorScheme}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name={icon} size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={[styles.buttonTitle, {color: themeColors[currentTheme].text}]}>{title}</Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
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
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.screenTitle, {color: themeColors[currentTheme].text}]}>
              {t.scan_document || "Scan Document"}
            </Text>
          </View>

          {photo ? (
            <View style={styles.previewContainer}>
              <View style={styles.imageWrapper}>
                <BlurView 
                  intensity={currentTheme === 'light' ? 50 : 30} 
                  tint={currentTheme === 'light' ? 'light' : 'dark'} 
                  style={styles.blurImageContainer}
                >
                  <Image source={{ uri: photo }} style={styles.preview} />
                </BlurView>
              </View>
              
              <View style={styles.buttonsRow}>
                {renderButton(
                  "upload",
                  t.submit || "Submit",
                  handleSubmit,
                  buttonColors.submit
                )}
                {renderButton(
                  "replay",
                  t.retake || "Retake",
                  handleCaptureAgain,
                  buttonColors.retake
                )}
              </View>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              <View style={styles.iconWrapper}>
                <Ionicons 
                  name="document-text-outline" 
                  size={80} 
                  color={themeColors[currentTheme].text} 
                />
              </View>
              <Text style={[styles.instructionText, {color: themeColors[currentTheme].subText}]}>
                {t.scan_instruction || "Capture or select a document to scan"}
              </Text>
              
              <View style={styles.buttonsRow}>
                {renderButton(
                  "photo-camera",
                  t.open_camera || "Open Camera",
                  openCamera,
                  buttonColors.camera
                )}
                
                {renderButton(
                  "photo-library",
                  t.pick_from_gallery || "Pick from Gallery",
                  pickImageFromGallery,
                  buttonColors.gallery
                )}
              </View>
            </View>
          )}
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <BlurView 
              intensity={60} 
              tint={currentTheme === 'light' ? 'light' : 'dark'} 
              style={styles.loadingBlur}
            >
              <ActivityIndicator size="large" color={themeColors[currentTheme === 'light' ? 'dark' : 'light'].text} />
              <Text style={[styles.loadingText, {color: themeColors[currentTheme].text}]}>
                {t.loading || "Loading..."}
              </Text>
            </BlurView>
          </View>
        )}
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
    marginBottom: 30,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    padding: 20,
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    width: '45%',
    marginBottom: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    height: 160,
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextContainer: {
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageWrapper: {
    width: '100%',
    height: '70%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  blurImageContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBlur: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ScanDocumentScreen;