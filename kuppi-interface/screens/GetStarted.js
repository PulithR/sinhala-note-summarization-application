import { StyleSheet, Text, View, Image } from "react-native";

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

        <Text>Button to be added...</Text>
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
    marginTop: 80,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
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
    fontSize: 20,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 10,
  },
  helper: {
    fontSize: 15,
    color: "#b9b3b3",
    textAlign: "center",
  },
});

export default GetStarted;
