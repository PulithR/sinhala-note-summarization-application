import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f0f8ff", "#e6f3ff"]} style={styles.background}>
        <Animated.View
          style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.title}>What would you like to do?</Text>

          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="person-circle" size={45} color="#2c3e50" />
          </TouchableOpacity>

          {/* Buttons will be implemented in the next commit */}
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
},
  background: {
     flex: 1 
},
  content: {
     flex: 1, 
     paddingHorizontal: 20, 
     paddingTop: 60 
},
  welcomeText: {
     fontSize: 32, 
     fontWeight: "bold", 
     color: "#2c3e50", 
     marginBottom: 8,
},
  title: { 
    fontSize: 24, 
    color: "#7f8c8d", 
    marginBottom: 40 
},
  settingsButton: { 
    position: "absolute", 
    top: 20, 
    right: 20, 
    zIndex: 1 
  }
});

export default HomeScreen;
