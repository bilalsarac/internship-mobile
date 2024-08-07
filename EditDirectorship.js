import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, } from '@env';

const EditDirectorship = ({ visible, onClose, directorship, onUpdate }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && directorship) {
      setName(directorship.name);
    }
  }, [visible, directorship]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) {
        return;
      }

      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

      await axios.put(`${BASE_URL}/api/v1/directorships/${directorship.id}`, 
        { name },
        { headers: { 'Authorization': authHeader } }
      );

      Alert.alert('Success', 'Müdürlük başarıyla değiştirildi.');
      onUpdate();
    } catch (error) {
      console.error('Error updating directorship: ', error);
      Alert.alert('Error', 'Failed to update directorship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Müdürlük Düzenle</Text>
          <TextInput
            style={styles.input}
            placeholder="Directorship Name"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Değiştiriliyor...' : 'Değiştir'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default EditDirectorship;
