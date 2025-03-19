import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_API_URL } from '@env';
import { AuthContext } from "../authentication/AuthContext";
import { ThemeContext } from '../user_preference/ThemeContext'; // Added ThemeContext
import { LanguageContext } from '../user_preference/LanguageContext'; // Added LanguageContext
import { Ionicons } from "@expo/vector-icons";
import themeColors from '../assets/ThemeColors.json';

const NoteBookScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const { currentTheme, toggleTheme } = useContext(ThemeContext); // Theme context
  const { t, toggleLanguage } = useContext(LanguageContext); // Language context
  const [searchText, setSearchText] = useState("");
  const [notes, setNotes] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotes();
      StatusBar.setBarStyle(currentTheme === 'light' ? 'dark-content' : 'light-content');
    }, [currentTheme])
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
        Alert.alert("Error", errorData.error || t.failed_to_fetch_notes || "Failed to fetch notes");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleNotePress = async (noteId) => {
    try {
      const response = await fetch(`${BASE_API_URL}/notes/${noteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert(t.note_options || "Note Options", `${data.note.title}`, [
          {
            text: t.open || "Open",
            onPress: () => {
              navigation.navigate("DisplayScreen", { note: data.note });
            },
          },
          {
            text: t.delete || "Delete",
            onPress: () => {
              handleDeleteNote(noteId);
            },
          },
          {
            text: t.cancel || "Cancel",
            style: "cancel",
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || t.failed_to_fetch_note || "Failed to fetch note");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`${BASE_API_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert(t.success || "Success", t.note_deleted || "Note deleted successfully!");
        fetchNotes();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || t.failed_to_delete_note || "Failed to delete note");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteAll = async () => {
    if (!notes || notes.length === 0) {
      Alert.alert(t.no_notes_to_delete || "No Notes to Delete");
      return;
    }
    try {
      const response = await fetch(`${BASE_API_URL}/notes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert(t.success || "Success", t.all_notes_deleted || "All notes deleted successfully!");
        fetchNotes();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || t.failed_to_delete_all || "Failed to delete all notes");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const RenderNoteItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.noteContainer}
        onPress={() => handleNotePress(item._id)}
      >
        <View style={styles.blurContainer}>
          <Text style={[styles.noteTitle, { color: themeColors[currentTheme].text }]}>
            {item.title}
          </Text>
          <Text style={[styles.noteDescription, { color: themeColors[currentTheme].subText }]}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.sectionTitle, { color: themeColors[currentTheme].text }]}>
              {t.your_notes || "Your Notes"}
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: themeColors[currentTheme].cardBg }]}>
              <Ionicons
                name="search"
                size={20}
                color={themeColors[currentTheme].subText}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: themeColors[currentTheme].text }]}
                placeholder={t.search_notes || "Search notes..."}
                placeholderTextColor={themeColors[currentTheme].subText}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          {!searchText && (
            <View style={styles.createButtonContainer}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("AddNotesScreen")}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.createButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.createButtonContent}>
                    <Text style={styles.createButtonIcon}>+</Text>
                    <Text style={styles.createButtonText}>
                      {t.create_new_note || "Create New Note"}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Text style={[styles.notesHeaderText, { color: themeColors[currentTheme].text }]}>
                {searchText ? (t.filtered_notes || "Filtered Notes") : (t.recent_notes || "Recent Notes")}
              </Text>
              {notes.length > 0 && (
                <TouchableOpacity onPress={handleDeleteAll}>
                  <Text style={styles.deleteText}>{t.delete_all || "Delete All"}</Text>
                </TouchableOpacity>
              )}
            </View>

            {notes.length === 0 ? (
              <View style={styles.emptyNotesContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={50}
                  color={themeColors[currentTheme].subText}
                />
                <Text style={[styles.emptyNotesText, { color: themeColors[currentTheme].subText }]}>
                  {t.no_notes_yet || "No notes yet. Create your first note!"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={
                  !searchText
                    ? notes
                    : notes.filter((note) =>
                        note.title.toLowerCase().includes(searchText.toLowerCase())
                      )
                }
                keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                renderItem={RenderNoteItem}
                contentContainerStyle={styles.notesList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  createButtonContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderRadius: 18,
    overflow: 'hidden',
  },
  createButton: {
    height: 100,
    borderRadius: 18,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  createButtonContent: {
    alignItems: 'center',
  },
  createButtonIcon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  notesSection: {
    flex: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteText: {
    fontSize: 16,
    color: '#EC4899',
    fontWeight: 'bold',
  },
  notesList: {
    paddingBottom: 20,
  },
  noteContainer: {
    marginBottom: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurContainer: {
    padding: 20,
    minHeight: 100,
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  emptyNotesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  emptyNotesText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default NoteBookScreen;