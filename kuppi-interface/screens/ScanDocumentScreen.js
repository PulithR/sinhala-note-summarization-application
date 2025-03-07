import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { BASE_API_URL } from "@env";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const ScanDocumentScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    try {
      setLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required.");
        setLoading(false);
        return;
      }

      // Use simpler options without MediaType or MediaTypeOptions
      const result = await ImagePicker.launchCameraAsync({
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Failed to open camera.");
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
          alert("Gallery permission is required.");
          setLoading(false);
          return;
        }
      }

      // Use simpler options without MediaType or MediaTypeOptions
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      alert("Failed to open gallery.");
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
      alert("Extracted Text: " + data.text);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-check permissions when component mounts
  React.useEffect(() => {
    (async () => {
      await ImagePicker.getMediaLibraryPermissionsAsync();
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.overlay}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.uploadButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <MaterialIcons
                  name="upload"
                  size={24}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.retakeButton]}
                onPress={handleCaptureAgain}
                disabled={loading}
              >
                <MaterialIcons
                  name="replay"
                  size={24}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cameraButton,
              loading && styles.disabledButton,
            ]}
            onPress={openCamera}
            disabled={loading}
          >
            <MaterialIcons name="photo-camera" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.galleryButton,
              loading && styles.disabledButton,
            ]}
            onPress={pickImageFromGallery}
            disabled={loading}
          >
            <MaterialIcons name="photo-library" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Pick from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginHorizontal: 10,
  },
  uploadButton: {
    backgroundColor: "#2178dc",
    flex: 1,
  },
  retakeButton: {
    backgroundColor: "#FF6B6B",
    flex: 1,
  },
  cameraButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ScanDocumentScreen;
