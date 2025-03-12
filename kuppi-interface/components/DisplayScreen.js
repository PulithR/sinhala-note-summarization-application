import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DisplayScreen = ({ route, navigation }) => {
  const { note } = route.params;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.mainTopic}>{note.title}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {/* ScrollView to Handle Long Content */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.contentText}>{note.content}</Text>
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={["#4a90e2", "#357abd"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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