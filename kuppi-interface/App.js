import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, AuthContext } from "./authentication/AuthContext";
import { ThemeContext, ThemeProvider } from "./user_preference/ThemeContext";
import { LanguageContext, LanguageProvider } from "./user_preference/LanguageContext";

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
import DisplayScreen from "./components/DisplayScreen";


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
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Summarizer"  
        component={SummarizerScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="GenerateAnswer" 
        component={AnswerGeneratorScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="NoteBookScreen" 
        component={NoteBookScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ScanDocument" 
        component={ScanDocumentScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddNotesScreen" 
        component={AddNotesScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DisplayScreen" 
        component={DisplayScreen}
        options={{ headerShown: false }} 
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
      <ThemeProvider>
        <LanguageProvider>
          <AppNavigator />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}