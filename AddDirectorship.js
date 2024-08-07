import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, } from '@env';

const AddDirectorship = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      alert('Please enter a directorship name.');
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

      await axios.post(`${BASE_URL}/api/v1/directorships`, { name }, {
        headers: { 'Authorization': authHeader }
      });

      alert('Directorship added successfully!');
      setName('');
      onClose(); 
    } catch (error) {
      console.error('Error adding directorship:', error);
      alert('Failed to add directorship.');
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
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Müdürlük Ekle</Text>
          <TextInput
            style={styles.input}
            placeholder="Müdürlük İsmi"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAdd}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Ekleniyor...' : 'Ekle'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddDirectorship;
