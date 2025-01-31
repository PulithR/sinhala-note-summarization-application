import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError('Enter a valid email');
    } else {
      setEmailError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Image source={require('../assets/Login-Page.png')} style={styles.image} />
      </View>

      <View style={styles.bottomHalf}>
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.helper}>Sign in to continue</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#666" 
          value={email} 
          onChangeText={validateEmail} 
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          placeholderTextColor="#666" 
        />
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <AppButton text="Login" onPress={() => alert('Login Pressed!')} color="#2940c0" textColor="#fff" fontSize={18} />
        
        <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign Up</Text></Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    marginTop: 30,
  },
  bottomHalf: {
    flex: 1.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f0f0',
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  helper: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginVertical: 10,
    padding: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    width: '90%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#666',
    marginTop: 10,
    marginRight: '5%',
  },
  signupText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  signupLink: {
    color: '#2940c0',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
