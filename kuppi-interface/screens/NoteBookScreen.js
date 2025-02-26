import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_API_URL } from '@env';
import { AuthContext } from "../authentication/AuthContext";

const NoteBookScreen = ({ navigation }) => {

  const { token } = useContext(AuthContext);

  const [searchText, setSearchText] = useState("");
  const [notes, setNotes] = useState([]);

  // Fetch notes every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchNotes();
    }, [])
  );

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/notes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to fetch notes");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleNotePress = async (noteId) => {
    try {
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        Alert.alert("Note Options", `${data.note.title}`, [
          {
            text: "Open",
            onPress: () => {
              alert(`${data.note.title} : ${data.note.content}`);
            },
          },
          {
            text: "Delete",
            onPress: () => {
              handleDeleteNote(noteId);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to fetch note");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

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

  const RenderTopicItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.topicButton}
        onPress={() => {
          handleNotePress(item.id);
        }}
      >
        <LinearGradient
          colors={["#ffffff", "#f8f9fa"]}
          style={styles.topicGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.topicText}>{item.title}</Text>
          <Text style={styles.topicDescription}>{item.description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeContainer}>
      <LinearGradient colors={["#f0f8ff", "#e6f3ff"]} style={styles.gradient}>
        <View style={styles.content}>
          {!searchText && <Text style={styles.mainTopic}>Your Notes</Text>}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.search}
              placeholder="Search topics..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#7f8c8d"
            />
          </View>
          {/*create new note button */}
          {!searchText && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddNotesScreen");
              }}
            >
              <LinearGradient
                colors={["#4a90e2", "#357abd"]}
                style={styles.addGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.addButtonText]}>+</Text>
                <Text style={[styles.addButtonDescription]}>
                  Create New Note
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {/* Recent Notes */}
          <View style={styles.row}>
            {searchText ? (
              <Text style={styles.subtitle}>Filtered Notes</Text>
            ) : (
              <Text style={styles.subtitle}>Recent Notes</Text>
            )}
            {notes.length > 0 && (
              <TouchableOpacity onPress={handleDeleteAll}>
                <Text style={styles.deleteAll}>Delete All</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Topics Grid */}
          <FlatList
            data={
              !searchText
                ? notes
                : notes.filter((note) =>
                    note.title.toLowerCase().includes(searchText.toLowerCase())
                  )
            }
            numColumns={1}
            keyExtractor={(item) => item.id}
            renderItem={RenderTopicItem}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mainTopic: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    marginTop: 40,
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  search: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  deleteAll: {
    marginTop: 20,
    fontSize: 16,
    color: "#e33b44",
    fontWeight: "800",
  },
  gridContainer: {
    paddingBottom: 20,
  },
  topicButton: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicGradient: {
    padding: 20,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  addGradient: {
    padding: 20,
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  topicText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  addButtonDescription: {
    color: "#fff",
    opacity: 0.9,
    fontSize: 16,
    paddingBottom: 16,
  },
});

export default NoteBookScreen;
