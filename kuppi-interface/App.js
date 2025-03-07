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


function AuthStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen name="Summarizer" component={SummarizerScreen} />
      <Stack.Screen
        name="GenerateAnswer"
        component={AnswerGeneratorScreen}
      />
      <Stack.Screen
        name="NoteBookScreen"
        component={NoteBookScreen}
      />
      <Stack.Screen
        name="ScanDocument"
        component={ScanDocumentScreen}
      />
      <Stack.Screen
        name="AddNotesScreen"
        component={AddNotesScreen}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
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