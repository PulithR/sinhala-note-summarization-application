import { StyleSheet, Text, View } from "react-native";

const GetStarted = () => {
  return (
    <View style={styles.container}>
      {/*to do*/}
      <Text style={styles.text}>Get Started screen-to be implemented...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: 900
  },
});

export default GetStarted;
