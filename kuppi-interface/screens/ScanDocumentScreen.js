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

// Main component for scanning documents
const ScanDocumentScreen = () => {
  // State variables for managing photo, loading, and text processing
  const [photo, setPhoto] = useState(null); // Holds the selected or captured image URI
  const [loading, setLoading] = useState(false); // Indicates if something is being processed
  const [extractedText, setExtractedText] = useState(""); // Stores text extracted from the image
  const [showResultModal, setShowResultModal] = useState(false); // Controls visibility of result modal
  const [selectedOption, setSelectedOption] = useState("extract"); // Tracks the selected processing option
  const [processedResult, setProcessedResult] = useState(""); // Stores the result after processing (summary or answer)
  const [processingOption, setProcessingOption] = useState(false); // Indicates if text processing is in progress

  // Access language and theme contexts for localization and styling
  const { t } = useContext(LanguageContext); // Translation function for multilingual support
  const { currentTheme } = useContext(ThemeContext); // Current theme (light/dark) for styling

  // Define button color schemes based on the current theme
  const buttonColors = {
    camera: themeColors[currentTheme].buttonColors, // Colors for camera button
    gallery: ["#F59E0B", "#EA580C"], // Colors for gallery button
    retake: ["#EC4899", "#F43F5E"], // Colors for retake button
    submit: themeColors[currentTheme].buttonColors, // Colors for submit button
    summarize: ["#3B82F6", "#2563EB"], // Colors for summarize option
    generate: ["#10B981", "#059669"], // Colors for generate answer option
  };

  // Setup initial effects when component mounts
  useEffect(() => {
    // Adjust status bar style based on theme
    StatusBar.setBarStyle(
      currentTheme === "light" ? "dark-content" : "light-content"
    );
    // Request media library permissions on mount
    (async () => {
      await ImagePicker.getMediaLibraryPermissionsAsync();
    })();
  }, []);

  // Function to open the camera and capture an image
  const openCamera = async () => {
    try {
      setLoading(true); // Show loading indicator
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert(t.camera_permission_required || "Camera permission is required.");
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        aspect: [4, 3], // Aspect ratio for the camera
        quality: 0.8, // Image quality setting
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri); // Set the captured image URI
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert(t.camera_error || "Failed to open camera.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to pick an image from the gallery
  const pickImageFromGallery = async () => {
    try {
      setLoading(true); // Show loading indicator
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
        quality: 0.8, // Image quality setting
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri); // Set the selected image URI
      }
    } catch (error) {
      console.error("Gallery error:", error);
      alert(t.gallery_error || "Failed to open gallery.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to retake a photo by reopening the camera
  const handleCaptureAgain = () => {
    setPhoto(null); // Clear current photo
    openCamera(); // Reopen camera
  };

  // Function to submit the image for OCR processing
  const handleSubmit = async () => {
    if (!photo) return; // Do nothing if no photo is selected

    try {
      setLoading(true); // Show loading indicator
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
      setExtractedText(data.text); // Store the extracted text
      setShowResultModal(true); // Show the result modal
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t.failed_to_process || "Failed to process image.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to process the extracted text (summarize or generate answer)
  const handleProcessText = async () => {
    if (!extractedText) return; // Do nothing if no text is extracted

    try {
      setProcessingOption(true); // Show processing indicator
      const token = await AsyncStorage.getItem("userToken"); // Get user auth token

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
          setProcessedResult(data.summary); // Store the summary
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
          setProcessedResult(data.answer); // Store the generated answer
        } catch (error) {
          alert(error.message);
        }
      }
    } catch (error) {
      console.error("Error processing text:", error);
      alert(t.failed_to_process || "Failed to process text.");
    } finally {
      setProcessingOption(false); // Hide processing indicator
    }
  };

  // Reset state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setPhoto(null); // Clear photo
      setLoading(false); // Reset loading state
      setExtractedText(""); // Clear extracted text
      setShowResultModal(false); // Hide result modal
      setSelectedOption("extract"); // Reset to default option
      setProcessedResult(""); // Clear processed result
    }, [])
  );

  // Helper function to render a styled button
  const renderButton = (icon, title, action, colorScheme, disabled = false) => (
    <View style={[styles.buttonContainer, disabled && { opacity: 0.7 }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={action}
        activeOpacity={0.9}
        disabled={loading || disabled}
      >
        <BlurView
          intensity={currentTheme === "light" ? 50 : 30} // Blur intensity based on theme
          tint={currentTheme === "light" ? "light" : "dark"} // Tint based on theme
          style={styles.blurContainer}
        >
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={colorScheme} // Gradient colors for the icon
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
                { color: themeColors[currentTheme].text }, // Text color based on theme
              ]}
            >
              {title}
            </Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );

  // Helper function to render option buttons in the modal
  const renderOptionButton = (option, icon, title, colorScheme) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedOption === option && {
          borderColor: colorScheme[0], // Highlight selected option
          borderWidth: 2,
        },
      ]}
      onPress={() => setSelectedOption(option)}
      disabled={processingOption}
    >
      <LinearGradient
        colors={
          selectedOption === option ? colorScheme : ["#64748B", "#475569"] // Gradient based on selection
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
          { color: themeColors[currentTheme].text }, // Text color based on theme
          selectedOption === option && { fontWeight: "bold" }, // Bold if selected
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Main render function
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeColors[currentTheme].background} // Background gradient based on theme
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar
          barStyle={currentTheme === "light" ? "dark-content" : "light-content"} // Status bar style
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.screenTitle,
                { color: themeColors[currentTheme].text }, // Title color based on theme
              ]}
            >
              {t.scan_document || "Scan Document"} // Translated title
            </Text>
          </View>

          {photo ? (
            // Show preview if a photo is selected
            <View style={styles.previewContainer}>
              <View style={styles.imageWrapper}>
                <BlurView
                  intensity={currentTheme === "light" ? 50 : 30} // Blur effect for image container
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
            // Show options if no photo is selected
            <View style={styles.optionsContainer}>
              <View style={styles.iconWrapper}>
                <Ionicons
                  name="document-text-outline"
                  size={80}
                  color={themeColors[currentTheme].text} // Icon color based on theme
                />
              </View>
              <Text
                style={[
                  styles.instructionText,
                  { color: themeColors[currentTheme].subText }, // Instruction text color
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

        {/* Modal to display extracted text and processing options */}
        <Modal
          visible={showResultModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowResultModal(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView
              intensity={currentTheme === "light" ? 50 : 30} // Blur effect for modal
              tint={currentTheme === "light" ? "light" : "dark"}
              style={styles.modalContainer}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: themeColors[currentTheme].text }, // Modal title color
                  ]}
                >
                  {processedResult
                    ? selectedOption === "summarize"
                      ? t.summary || "Summary"
                      : t.generated_answer || "Generated Answer"
                    : t.extracted_text || "Extracted Text"} // Dynamic title based on state
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowResultModal(false);
                    setProcessedResult(""); // Reset processed result on close
                  }}
                  style={styles.closeButton}
                >
                  <LinearGradient
                    colors={themeColors[currentTheme].buttonColors} // Gradient for close button
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
                  intensity={currentTheme === "light" ? 40 : 25} // Blur effect for text container
                  tint={currentTheme === "light" ? "light" : "dark"}
                  style={styles.resultTextContainer}
                >
                  <Text
                    style={[
                      styles.resultText,
                      { color: themeColors[currentTheme].text }, // Result text color
                    ]}
                  >
                    {processedResult || extractedText} // Display processed result or extracted text
                  </Text>
                </BlurView>
              </ScrollView>

              {!processedResult && (
                // Show processing options if no result yet
                <View style={styles.processingOptions}>
                  <Text
                    style={[
                      styles.optionsTitle,
                      { color: themeColors[currentTheme].text }, // Options title color
                    ]}
                  >
                    {t.what_to_do || "What would you like to do with this text?"}
                  </Text>

                  <View style={styles.optionsCards}>
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedOption === "summarize" && styles.selectedCard,
                        { borderColor: buttonColors.summarize[0] } // Border color for summarize
                      ]}
                      onPress={() => setSelectedOption("summarize")}
                      disabled={processingOption}
                    >
                      <BlurView
                        intensity={currentTheme === "light" ? 40 : 30} // Blur effect for card
                        tint={currentTheme === "light" ? "light" : "dark"}
                        style={styles.cardContent}
                      >
                        <LinearGradient
                          colors={buttonColors.summarize} // Gradient for summarize icon
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
                        { borderColor: buttonColors.generate[0] } // Border color for generate
                      ]}
                      onPress={() => setSelectedOption("generate")}
                      disabled={processingOption}
                    >
                      <BlurView
                        intensity={currentTheme === "light" ? 40 : 30} // Blur effect for card
                        tint={currentTheme === "light" ? "light" : "dark"}
                        style={styles.cardContent}
                      >
                        <LinearGradient
                          colors={buttonColors.generate} // Gradient for generate icon
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
                        opacity: processingOption ? 0.7 : 1, // Dim button when processing
                      },
                    ]}
                    onPress={handleProcessText}
                    disabled={processingOption}
                  >
                    <LinearGradient
                      colors={
                        selectedOption === "summarize"
                          ? buttonColors.summarize
                          : buttonColors.generate // Gradient based on selected option
                      }
                      style={styles.processButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {processingOption ? (
                        <ActivityIndicator color="#FFFFFF" size="small" /> // Show spinner when processing
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
          // Loading overlay shown during processing
          <View style={styles.loadingOverlay}>
            <View
              style={[
                styles.loadingContainer,
                {
                  backgroundColor:
                    currentTheme === "light"
                      ? "rgba(255, 255, 255, 0.95)"
                      : "rgba(30, 30, 30, 0.95)", // Background color based on theme
                },
              ]}
            >
              <View style={styles.loadingContent}>
                <View style={styles.loadingIconContainer}>
                  <LinearGradient
                    colors={buttonColors.submit} // Gradient for loading icon
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
                    { color: themeColors[currentTheme].text }, // Loading title color
                  ]}
                >
                  {t.processing_document || "Processing Document"}
                </Text>
                <Text
                  style={[
                    styles.loadingSubtitle,
                    { color: themeColors[currentTheme].subText }, // Subtitle color
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up full screen
  },
  background: {
    flex: 1, // Background gradient container
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100, // Space for header
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30, // Space below header
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
    marginTop: 20, // Spacing for instruction text
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50, // Space at the bottom
  },
  iconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle background for icon
    borderRadius: 40,
    padding: 20,
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    flexWrap: "wrap", // Allow buttons to wrap if needed
  },
  buttonContainer: {
    width: "45%", // Two buttons per row
    marginBottom: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5, // Shadow for depth
  },
  button: {
    borderRadius: 18,
    overflow: "hidden",
    height: 160, // Fixed height for buttons
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16, // Space between icon and text
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
    paddingVertical: 20, // Vertical padding for preview
  },
  imageWrapper: {
    width: "100%",
    height: "70%", // Most of the space for image
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
    resizeMode: "contain", // Keep image proportions
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // On top of everything
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
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
    opacity: 0.8, // Slightly faded
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%", // Limit modal height
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
    borderBottomColor: "rgba(0, 0, 0, 0.1)", // Subtle divider
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
    maxHeight: 350, // Scrollable content area
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
    borderColor: "rgba(100, 100, 100, 0.1)", // Light border
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
    borderTopColor: "rgba(0, 0, 0, 0.1)", // Divider above options
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
    borderWidth: 2, // Highlight selected card
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
    marginRight: 8, // Space between icon and text
  },
  processButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScanDocumentScreen;