import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL, } from '@env';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const role = 'USER';

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/client`, {
        email,
        password,
        firstName,
        lastName,
        role
      });
  
     
  
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Registration Successful', 'You can now login with your credentials.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', 'Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error registering';
  
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        } else if (error.response.status === 401) {
          errorMessage = 'Unauthorized. Please check your credentials and try again.';
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      Alert.alert('Error', errorMessage);
    }
  };

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Hesabınız zaten var mı? Giriş Yap</Text>
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

export default Register;
