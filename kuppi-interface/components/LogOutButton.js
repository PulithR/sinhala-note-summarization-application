import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AuthContext } from "../authentication/AuthContext";
import { LanguageContext } from "../user_preference/LanguageContext";
import { ThemeContext } from "../user_preference/ThemeContext";
import themeColors from "../assets/ThemeColors.json";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { language, t } = useContext(LanguageContext);
  const { currentTheme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: themeColors[currentTheme].toggleBg[0] },
      ]}
      onPress={logout}
    >
      <Text
        style={[
          styles.buttonText,
          { color: themeColors[currentTheme].toggleText },
        ]}
      >
        {t.logout}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%", // Full width from previous version
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10, // Using marginVertical instead of margin
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold", // Added from previous version
  },
});

export default LogoutButton;