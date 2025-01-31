import { StyleSheet, Text, View, Image } from "react-native";
import AppButton from "../components/AppButton";

const GetStarted = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Image
          source={require("../assets/get-started-banner.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.bottomHalf}>
        <View style={styles.lineBox}>
          <View style={styles.blueLine1} />
          <View style={styles.blueLine2} />
          <View style={styles.blueLine3} />
        </View>
        <Text style={styles.header}>Empower your mind, ignite your</Text>
        <Text style={styles.header}>potential</Text>

        <Text style={styles.helper}>
          Discover the things you want to learn and
        </Text>
        <Text style={styles.helper}>grow with them</Text>

        <View style={styles.buttonContainer}>
          <AppButton
            text="Get Started"
            onPress={() => alert("Button Pressed!")}
            color="#2940c0"
            textColor="#fff"
            fontSize={18}
            style={styles.buttonContainer}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginTop: 180,
  },
  bottomHalf: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f0f0",
    marginTop: 100,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  lineBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  blueLine1: {
    width: "30%",
    height: 2,
    backgroundColor: "#007BFF",
    marginHorizontal: 5,
  },
  blueLine2: {
    width: "10%",
    height: 2,
    backgroundColor: "#007BFF",
    marginHorizontal: 5,
  },
  blueLine3: {
    width: "2%",
    height: 2,
    backgroundColor: "#007BFF",
    marginHorizontal: 5,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 12,
    color: "#333",
  },
  helper: {
    fontSize: 16,
    marginBottom: 10,
    color: "#a4a0a0",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default GetStarted;
