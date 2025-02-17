import React, { useState } from "react";
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

const AddNotesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [notes, setNotes] = useState([]);

  const RenderTopicItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.topicButton}>
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
          <Text style={styles.mainTopic}>Your Notes</Text>

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

          {/* Create new note button */}
          <TouchableOpacity onPress={() => navigation.navigate("AddNotes")}>
            <LinearGradient
              colors={["#4a90e2", "#357abd"]}
              style={styles.addGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.addButtonText]}>+</Text>
              <Text style={[styles.addButtonDescription]}>Create New Note</Text>
            </LinearGradient>
          </TouchableOpacity>


