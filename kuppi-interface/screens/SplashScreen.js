import { StyleSheet, Image, View } from "react-native";

// SplashScreen component to display a splash screen with a logo
const SplashScreen = () => {

  return (
    <View style={styles.container}>
      <View>
        {/* Displaying the app logo */}
        <Image source={require("../assets/kuppi-icon.png")} style={styles.image} />
      </View>
    </View>
  );
}

// Styles for the SplashScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full screen
    backgroundColor: '#fff', // Sets the background color to white
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center' // Centers content vertically
  },
  image: {
    height: 150, // Sets the height of the logo
    width: 150 // Sets the width of the logo
  }
});

export default SplashScreen; // Exporting the SplashScreen component