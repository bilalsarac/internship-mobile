import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'base-64';
import { BASE_URL } from '@env';

const ImagePickerComponent = ({ taxId, setImageUri, onUploadSuccess, onUploadError }) => {
  const [loading, setLoading] = useState(false);

  const handleImagePicker = async () => {
    
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        
      });

      
      
      if (!result.canceled && result.assets[0].uri) {
        
        setImageUri(result.assets[0].uri);
        
        await uploadImage(result.assets[0].uri);
      } else {
       
      }
    } catch (error) {
      console.error('Error in image picker:', error);
    }
  };
  const uploadImage = async (uri) => {
    setLoading(true);
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) return;
  
      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${base64.encode(`${email}:${password}`)}`;
  
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
  
      
      const response = await axios.post(`${BASE_URL}/api/v1/taxes/${taxId}/image`, formData, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Alert.alert('Başarılı', 'Resim Yüklendi!');

  
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Resim Yükleyin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImagePickerComponent;
