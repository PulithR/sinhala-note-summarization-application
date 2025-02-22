import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, AuthContext } from "./authentication/AuthContext";

import HomeScreen from "./screens/HomeScreen";
import SummarizerScreen from "./screens/SummarizerScreen";
import AnswerGeneratorScreen from "./screens/AnswerGeneratorScreen";
import NoteBookScreen from "./screens/NoteBookScreen";
import AddNotesScreen from "./screens/AddNotesScreen";
import ScanDocumentScreen from "./screens/ScanDocumentScreen";

import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SplashScreen from "./screens/SplashScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PasswordResetScreen from "./screens/PasswordResetScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Summarizer" component={SummarizerScreen} />
          <Stack.Screen
            name="GenerateAnswer"
            component={AnswerGeneratorScreen}
          />
          <Stack.Screen name="NoteBookScreen" component={NoteBookScreen} />
          <Stack.Screen name="ScanDocument" component={ScanDocumentScreen} />
          <Stack.Screen name="AddNotesScreen" component={AddNotesScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      ) : (
        <>
          {showSignUp ? (
            <SignUpScreen setShowSignUp={setShowSignUp} />
          ) : showPasswordReset ? (
            <PasswordResetScreen setShowPasswordReset={setShowPasswordReset} />
          ) : (
            <LoginScreen
              setShowSignUp={setShowSignUp}
              setShowPasswordReset={setShowPasswordReset}
            />
          )}
        </>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}