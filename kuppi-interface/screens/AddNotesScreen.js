import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../authentication/AuthContext";
import { BASE_API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";

const AddNotesScreen = () => {
  const { token } = useContext(AuthContext);

  const navigation = useNavigation();

  const [noteText, setNoteText] = useState("");
  const [noteTopic, setNoteTopic] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Count the number of words and characters in the note
  const wordCount = noteText.trim() ? noteText.trim().split(/\s+/).length : 0;
  const charCount = noteText.length;

  // Clear note function
  const clearNote = () => {
    Alert.alert("Clear Note", "Are you sure you want to clear this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        onPress: () => {
          setNoteText("");
          setNoteTopic("");
        },
        style: "destructive",
      },
    ]);
  };

  // Add a new note
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
        Alert.alert("Success", "Note added successfully!", [
          {
            text: "OK",
            onPress: () =>
              navigation.reset({
                index: 1,
                routes: [{ name: "Home" }, { name: "NoteBookScreen" }],
              }),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to add note");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert("Success", "Note deleted successfully!");
        fetchNotes();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to delete note");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteAll = async () => {
    if (!notes || notes.length === 0) {
      alert("No Notes to Delete");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert("Success", "All notes deleted successfully!");
        fetchNotes(); 
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to delete all notes");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Notebook</Text>
        <Text style={styles.saveStatus}>
          {isSaved ? "✓ Saved" : "• Editing"}
        </Text>
      </View>

      <View style={styles.topicContainer}>
        <Text style={styles.label}>Topic</Text>
        <TextInput
          style={styles.topicInput}
          placeholder="Enter the topic..."
          value={noteTopic}
          onChangeText={(text) => {
            setNoteTopic(text);
            setIsSaved(false);
          }}
          maxLength={50}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={() => {
            handleAddNote();
            setIsSaved(true);
          }}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearNote}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.textarea}
        placeholder="Start writing your notes..."
        multiline
        value={noteText}
        onChangeText={(text) => {
          setNoteText(text);
          setIsSaved(false);
        }}
        textAlignVertical="top"
      />

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Words: {wordCount}</Text>
        <Text style={styles.statsText}>Characters: {charCount}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  saveStatus: {
    fontSize: 16,
    color: "#34495e",
  },
  topicContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  topicInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  clearButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  textarea: {
    height: 400,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    lineHeight: 24,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    padding: 8,
  },
  statsText: {
    fontSize: 14,
    color: "#666",
  },
});

export default AddNotesScreen;
