import React, { useEffect, useRef }  from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DisplayScreen = ({ title, content, onBackPress }) => {
  // Animation state variables
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Run animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <SafeAreaView style={styles.safeContainer}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.mainTopic}>{title}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {/* Added ScrollView to Handle Long Content */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.contentText}>{content}</Text>
            </ScrollView>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
          >
            <LinearGradient
              colors={['#4a90e2', '#357abd']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
                <Text style={styles.buttonText}>Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1 ,
    backgroundColor: '#F8F9FA'
},
  content: { 
    flex: 1 ,
    backgroundColor: '#FFFFFF'
},
  header: { 
    alignItems: 'center', 
    paddingTop: 60, 
    marginBottom: 20 
},
  mainTopic: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center' 
},
  container: { 
    flex: 1, 
    padding: 20 
},
  contentContainer: { 
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
},
  contentText: { 
    fontSize: 16 
},
  backButton: { 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
},
buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
},
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 18 ,
    fontWeight: 'bold'
},
});

export default DisplayScreen;
