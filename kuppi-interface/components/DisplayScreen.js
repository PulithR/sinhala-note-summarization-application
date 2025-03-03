import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const DisplayScreen = ({ title, content, onBackPress }) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.mainTopic}>{title}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <ScrollView>
              <Text style={styles.contentText}>{content}</Text>
            </ScrollView>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  content: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 60, marginBottom: 20 },
  mainTopic: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  container: { flex: 1, padding: 20 },
  contentContainer: { flex: 1, padding: 15, marginBottom: 20 },
  contentText: { fontSize: 16 },
  backButton: { padding: 10, backgroundColor: '#4a90e2', borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
});

export default DisplayScreen;
