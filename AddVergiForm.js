import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL, } from '@env';

const AddVergiForm = ({ onAddVergi, onCancel }) => {
  const [taxName, setTaxName] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [typeofTax, setTypeofTax] = useState(''); 
  const [directorships, setDirectorships] = useState([]);
  const [selectedDirectorship, setSelectedDirectorship] = useState('');

  useEffect(() => {
    const fetchDirectorships = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem('userCredentials');
        if (!storedCredentials) {
          console.error('No stored credentials found');
          return;
        }

        const { email, password } = JSON.parse(storedCredentials);
        const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

        const response = await axios.get(`${BASE_URL}/api/v1/directorships`, {
          headers: { Authorization: authHeader },
        });

        if (Array.isArray(response.data)) {
          setDirectorships(response.data);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching directorships:', error);
      }
    };

    fetchDirectorships();
  }, []);

  const handleAddVergi = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) {
        console.error('No stored credentials found');
        return;
      }

      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

      const response = await axios.post(`${BASE_URL}/api/v1/taxes`, {
        taxName,
        taxAmount: parseFloat(taxAmount),
        typeofTax, 
        directorshipId: selectedDirectorship,
      }, {
        headers: { Authorization: authHeader },
      });

      onAddVergi({
        id: response.data.id,
        taxName,
        taxAmount: parseFloat(taxAmount),
        typeofTax, 
        directorshipId: selectedDirectorship,
      });

      setTaxName('');
      setTaxAmount('');
      setTypeofTax(''); 
      setSelectedDirectorship('');
      onCancel();
    } catch (error) {
      console.error('Error adding vergi:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Vergi Adı:</Text>
      <TextInput
        style={styles.input}
        value={taxName}
        onChangeText={setTaxName}
        placeholder="Enter vergi adı"
        keyboardType="default"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Vergi Miktarı:</Text>
      <TextInput
        style={styles.input}
        value={taxAmount}
        onChangeText={setTaxAmount}
        placeholder="Enter vergi miktarı"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Vergi Türü:</Text>
      <Picker
        selectedValue={typeofTax}
        onValueChange={(itemValue) => setTypeofTax(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select vergi türü" value="" />
        <Picker.Item label="Gelir" value="Gelir" />
        <Picker.Item label="Gider" value="Gider" />
      </Picker>
      <Text style={styles.label}>Direktörlük:</Text>
      <Picker
        selectedValue={selectedDirectorship}
        onValueChange={(itemValue) => setSelectedDirectorship(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a directorship" value="" />
        {directorships.map((directorship) => (
          <Picker.Item
            key={directorship.id}
            label={directorship.name}
            value={directorship.id}
          />
        ))}
      </Picker>
      <TouchableOpacity style={styles.addButton} onPress={handleAddVergi}>
        <Text style={styles.addButtonText}>Vergi Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>İptal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:'#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 20,
    margin:10
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 8,
    margin:10
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AddVergiForm;
