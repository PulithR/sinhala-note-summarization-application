import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, AuthContext } from "./authentication/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import SummarizerScreen from "./screens/SummarizerScreen";
import AnswerGeneratorScreen from "./screens/AnswerGeneratorScreen";
import NoteBookScreen from "./screens/NoteBookScreen";
import ScanDocumentScreen from "./screens/ScanDocumentScreen";
import AddNotesScreen from "./screens/AddNotesScreen";

import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SplashScreen from "./screens/SplashScreen";
import ProfileScreen from "./screens/ProfileScreen";