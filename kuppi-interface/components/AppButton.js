import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AppButton = ({
  text,
  onPress,
  color = "#000",
  textColor = "#fff",
  fontSize = 16,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor, fontSize: fontSize }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25, 
    borderRadius: 25, 
    alignItems: "center",
    justifyContent: "center", 
    marginTop: 20, 
  },
  text: {
    fontWeight: "bold",
  },
});

export default AppButton;
