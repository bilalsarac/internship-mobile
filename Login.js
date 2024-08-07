import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, } from '@env';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
  
    const authHeader = `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`;
  
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/authentication`, {
        headers: { 'Authorization': authHeader }
      });

      
      if (response.data.includes('@')) {
        Alert.alert('Giriş Başarılı', `Hoşgeldin, ${response.data}`);

        await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));

        navigation.navigate('Home');
      } else {
        Alert.alert('Giriş Başarısız', 'Incorrect credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
  
      if (error.response && error.response.status === 401) {
        Alert.alert('Login Failed', 'Incorrect credentials');
      } else if (error.response && error.response.data) {
        Alert.alert('Login Failed', 'Incorrect credentials');
      
      } else if (error.request) {
        Alert.alert('Error logging in', 'No response received');
      } else {
        Alert.alert('Error logging in', error.message);
      }
    }
  };
  
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Hesabınız yok mu? Kayıt Olun</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: 'orange',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    color: 'blue',
  },
});

export default Login;
