import React, { useContext } from "react";
import { AuthContext } from "../authentication/AuthContext";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <TouchableOpacity onPress={logout} style={styles.button}>
      <Text style={styles.buttonText}>Log Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#c44747",
    padding: 10,
    margin: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LogoutButton;