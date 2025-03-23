import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LanguageContext } from "../user_preference/LanguageContext";
import { ThemeContext } from "../user_preference/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import themeColors from "../assets/ThemeColors.json";
import { Ionicons } from "@expo/vector-icons";
import { BASE_API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScanDocumentScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("extract");
  const [processedResult, setProcessedResult] = useState("");
  const [processingOption, setProcessingOption] = useState(false);

  const { t } = useContext(LanguageContext);
  const { currentTheme } = useContext(ThemeContext);

  const buttonColors = {
    camera: themeColors[currentTheme].buttonColors,
    gallery: ["#F59E0B", "#EA580C"],
    retake: ["#EC4899", "#F43F5E"],
    submit: themeColors[currentTheme].buttonColors,
    summarize: ["#3B82F6", "#2563EB"],
    generate: ["#10B981", "#059669"],
  };

  useEffect(() => {
    StatusBar.setBarStyle(
      currentTheme === "light" ? "dark-content" : "light-content"
    );
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
        const { status: newStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== "granted") {
          alert(
            t.gallery_permission_required || "Gallery permission is required."
          );
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
      setExtractedText(data.text);
      setShowResultModal(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t.failed_to_process || "Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessText = async () => {
    if (!extractedText) return;

    try {
      setProcessingOption(true);
      const token = await AsyncStorage.getItem("userToken");

      if (selectedOption === "summarize") {
        try {
          const response = await fetch(`${BASE_API_URL}/generate-summary`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: extractedText }),
          });

          if (!response.ok) {
            throw new Error(t.errorFetchSummary || "Failed to fetch summary");
          }

          const data = await response.json();
          setProcessedResult(data.summary);
        } catch (error) {
          alert(error.message);
        }
      } else if (selectedOption === "generate") {
        try {
          const response = await fetch(`${BASE_API_URL}/generate-answer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ question: extractedText }),
          });

          if (!response.ok) {
            throw new Error(t.errorFetchAnswer || "Failed to fetch answer");
          }

          const data = await response.json();
          setProcessedResult(data.answer);
        } catch (error) {
          alert(error.message);
        }
      }
    } catch (error) {
      console.error("Error processing text:", error);
      alert(t.failed_to_process || "Failed to process text.");
    } finally {
      setProcessingOption(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPhoto(null);
      setLoading(false);
      setExtractedText("");
      setShowResultModal(false);
      setSelectedOption("extract");
      setProcessedResult("");
    }, [])
  );

  const renderButton = (icon, title, action, colorScheme, disabled = false) => (
    <View style={[styles.buttonContainer, disabled && { opacity: 0.7 }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={action}
        activeOpacity={0.9}
        disabled={loading || disabled}
      >
        <BlurView
          intensity={currentTheme === "light" ? 50 : 30}
          tint={currentTheme === "light" ? "light" : "dark"}
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
            <Text
              style={[
                styles.buttonTitle,
                { color: themeColors[currentTheme].text },
              ]}
            >
              {title}
            </Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );

  const renderOptionButton = (option, icon, title, colorScheme) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedOption === option && {
          borderColor: colorScheme[0],
          borderWidth: 2,
        },
      ]}
      onPress={() => setSelectedOption(option)}
      disabled={processingOption}
    >
      <LinearGradient
        colors={
          selectedOption === option ? colorScheme : ["#64748B", "#475569"]
        }
        style={styles.optionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name={icon} size={20} color="#FFFFFF" />
      </LinearGradient>
      <Text
        style={[
          styles.optionText,
          { color: themeColors[currentTheme].text },
          selectedOption === option && { fontWeight: "bold" },
        ]}
      >
        {title}
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
        <StatusBar
          barStyle={currentTheme === "light" ? "dark-content" : "light-content"}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.screenTitle,
                { color: themeColors[currentTheme].text },
              ]}
            >
              {t.scan_document || "Scan Document"}
            </Text>
          </View>

          {photo ? (
            <View style={styles.previewContainer}>
              <View style={styles.imageWrapper}>
                <BlurView
                  intensity={currentTheme === "light" ? 50 : 30}
                  tint={currentTheme === "light" ? "light" : "dark"}
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
              <Text
                style={[
                  styles.instructionText,
                  { color: themeColors[currentTheme].subText },
                ]}
              >
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

        {/* Result Modal */}
        <Modal
          visible={showResultModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowResultModal(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView
              intensity={currentTheme === "light" ? 50 : 30}
              tint={currentTheme === "light" ? "light" : "dark"}
              style={styles.modalContainer}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: themeColors[currentTheme].text },
                  ]}
                >
                  {processedResult
                    ? selectedOption === "summarize"
                      ? t.summary || "Summary"
                      : t.generated_answer || "Generated Answer"
                    : t.extracted_text || "Extracted Text"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowResultModal(false);
                    setProcessedResult("");
                  }}
                  style={styles.closeButton}
                >
                  <LinearGradient
                    colors={themeColors[currentTheme].buttonColors}
                    style={styles.closeButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="close" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={false}
              >
                <BlurView
                  intensity={currentTheme === "light" ? 40 : 25}
                  tint={currentTheme === "light" ? "light" : "dark"}
                  style={styles.resultTextContainer}
                >
                  <Text
                    style={[
                      styles.resultText,
                      { color: themeColors[currentTheme].text },
                    ]}
                  >
                    {processedResult || extractedText}
                  </Text>
                </BlurView>
              </ScrollView>

              {!processedResult && (
                <View style={styles.processingOptions}>
                  <Text
                    style={[
                      styles.optionsTitle,
                      { color: themeColors[currentTheme].text },
                    ]}
                  >
                    {t.what_to_do || "What would you like to do with this text?"}
                  </Text>

                  <View style={styles.optionsCards}>
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedOption === "summarize" && styles.selectedCard,
                        { borderColor: buttonColors.summarize[0] }
                      ]}
                      onPress={() => setSelectedOption("summarize")}
                      disabled={processingOption}
                    >
                      <BlurView
                        intensity={currentTheme === "light" ? 40 : 30}
                        tint={currentTheme === "light" ? "light" : "dark"}
                        style={styles.cardContent}
                      >
                        <LinearGradient
                          colors={buttonColors.summarize}
                          style={styles.cardIconContainer}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <MaterialIcons name="summarize" size={24} color="#FFFFFF" />
                        </LinearGradient>
                        <Text style={[styles.cardTitle, { color: themeColors[currentTheme].text }]}>
                          {t.summarize || "Summarize"}
                        </Text>
                        <Text style={[styles.cardDescription, { color: themeColors[currentTheme].subText }]}>
                          {t.summarize_desc || "Create a concise summary of the text"}
                        </Text>
                      </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedOption === "generate" && styles.selectedCard,
                        { borderColor: buttonColors.generate[0] }
                      ]}
                      onPress={() => setSelectedOption("generate")}
                      disabled={processingOption}
                    >
                      <BlurView
                        intensity={currentTheme === "light" ? 40 : 30}
                        tint={currentTheme === "light" ? "light" : "dark"}
                        style={styles.cardContent}
                      >
                        <LinearGradient
                          colors={buttonColors.generate}
                          style={styles.cardIconContainer}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <MaterialIcons name="question-answer" size={24} color="#FFFFFF" />
                        </LinearGradient>
                        <Text style={[styles.cardTitle, { color: themeColors[currentTheme].text }]}>
                          {t.generate_answer || "Generate Answer"}
                        </Text>
                        <Text style={[styles.cardDescription, { color: themeColors[currentTheme].subText }]}>
                          {t.generate_desc || "Treat the text as a question and get an answer"}
                        </Text>
                      </BlurView>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.processButton,
                      {
                        opacity: processingOption ? 0.7 : 1,
                      },
                    ]}
                    onPress={handleProcessText}
                    disabled={processingOption}
                  >
                    <LinearGradient
                      colors={
                        selectedOption === "summarize"
                          ? buttonColors.summarize
                          : buttonColors.generate
                      }
                      style={styles.processButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {processingOption ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <View style={styles.processButtonContent}>
                          <MaterialIcons
                            name={selectedOption === "summarize" ? "summarize" : "question-answer"}
                            size={20}
                            color="#FFFFFF"
                            style={styles.processButtonIcon}
                          />
                          <Text style={styles.processButtonText}>
                            {selectedOption === "summarize"
                              ? t.summarize || "Summarize"
                              : t.generate_answer || "Generate Answer"}
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </BlurView>
          </View>
        </Modal>

        {loading && (
          <View style={styles.loadingOverlay}>
            <View
              style={[
                styles.loadingContainer,
                {
                  backgroundColor:
                    currentTheme === "light"
                      ? "rgba(255, 255, 255, 0.95)"
                      : "rgba(30, 30, 30, 0.95)",
                },
              ]}
            >
              <View style={styles.loadingContent}>
                <View style={styles.loadingIconContainer}>
                  <LinearGradient
                    colors={buttonColors.submit}
                    style={styles.loadingGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text
                  style={[
                    styles.loadingTitle,
                    { color: themeColors[currentTheme].text },
                  ]}
                >
                  {t.processing_document || "Processing Document"}
                </Text>
                <Text
                  style={[
                    styles.loadingSubtitle,
                    { color: themeColors[currentTheme].subText },
                  ]}
                >
                  {t.please_wait || "Please wait while we extract the text"}
                </Text>
              </View>
            </View>
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  iconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 40,
    padding: 20,
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    flexWrap: "wrap",
  },
  buttonContainer: {
    width: "45%",
    marginBottom: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  button: {
    borderRadius: 18,
    overflow: "hidden",
    height: 160,
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextContainer: {
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  imageWrapper: {
    width: "100%",
    height: "70%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  blurImageContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "contain",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  loadingContainer: {
    width: "80%",
    maxWidth: 320,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingContent: {
    padding: 30,
    alignItems: "center",
  },
  loadingIconContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  closeButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    maxHeight: 350,
  },
  modalContentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  resultTextContainer: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.1)",
  },
  resultText: {
    fontSize: 17,
    lineHeight: 26,
    flexWrap: "wrap",
    width: "100%",
    fontWeight: "500",
  },
  processingOptions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  optionsCards: {
    width: "100%",
    marginBottom: 24,
  },
  optionCard: {
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  selectedCard: {
    borderWidth: 2,
  },
  cardContent: {
    padding: 16,
    borderRadius: 18,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  processButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  processButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  processButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  processButtonIcon: {
    marginRight: 8,
  },
  processButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScanDocumentScreen;