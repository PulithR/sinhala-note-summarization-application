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
