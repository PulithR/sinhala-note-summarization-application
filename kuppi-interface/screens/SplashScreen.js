import { StyleSheet, Image, View } from "react-native";

const SplashScreen = () => {

  return (
    <View style={styles.container}>
      <View>
        {/*sample logo*/}
        <Image source={require("../assets/kuppi-icon.png")} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 150,
    width: 150
  }
});

export default SplashScreen;