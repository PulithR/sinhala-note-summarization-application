import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const ScanDocumentScreen = () => {
  const [photo, setPhoto] = useState(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      mediaTypes: ImagePicker.MediaType,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPhoto(null);
      openCamera();
    }, [])
  );

  const handleCaptureAgain = () => {
    setPhoto(null);
    openCamera();
  };

  return (
    <SafeAreaView style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.overlay}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.uploadButton]}
                onPress={() => alert("Image submitted")}
              >
                <MaterialIcons name="upload" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.retakeButton]}
                onPress={handleCaptureAgain}
              >
                <MaterialIcons name="replay" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
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
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginHorizontal: 10,
  },
  uploadButton: {
    backgroundColor: "#2178dc",
  },
  retakeButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 8,
  },
});

export default ScanDocumentScreen;
