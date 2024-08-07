import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL, } from '@env';

const EditVergiForm = ({ formData, onEditVergi, onCancel, directorship }) => {
  const [taxName, setTaxName] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [typeofTax, setTypeofTax] = useState('');
  const [directorshipId, setDirectorshipId] = useState('');
  const [directorships, setDirectorships] = useState([]);
  const [directorshipName, setDirectorshipName] = useState('');
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    const fetchUserCredentials = async () => {
      try {
        const userCredentials = await AsyncStorage.getItem('userCredentials');
        if (userCredentials !== null) {
          setCredentials(JSON.parse(userCredentials));
        }
      } catch (error) {
        console.error('Error fetching user credentials:', error);
      }
    };

    fetchUserCredentials();
  }, []);

  useEffect(() => {
    const fetchDirectorships = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem('userCredentials');
        if (!storedCredentials) {
          console.error('No stored credentials found');
          return;
        }

        const { email, password } = JSON.parse(storedCredentials);
        const authHeader = `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`;

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

  useEffect(() => {
    const fetchDirectorshipName = async () => {
      if (directorship) {
        try {
          const storedCredentials = await AsyncStorage.getItem('userCredentials');
          if (!storedCredentials) {
            console.error('No stored credentials found');
            return;
          }

          const { email, password } = JSON.parse(storedCredentials);
          const authHeader = `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`;

          const response = await axios.get(`${BASE_URL}/api/v1/directorships/${directorship}`, {
            headers: { Authorization: authHeader },
          });

          setDirectorshipName(response.data.name || '');
        } catch (error) {
          console.error('Error fetching directorship name:', error);
        }
      }
    };

    fetchDirectorshipName();
  }, [directorship]);

  useEffect(() => {
    if (formData) {
      setTaxName(formData.taxName || '');
      setTaxAmount(formData.taxAmount ? formData.taxAmount.toString() : '');
      
      setTypeofTax(formData.typeofTax || '');
      setDirectorshipId(formData.directorship?.id || '');
    }
  }, [formData]);

  // Handle save
  const handleSave = async () => {
    if (!credentials) {
      console.error('User credentials not found in AsyncStorage');
      return;
    }

    const { email, password } = credentials;
    const authHeader = `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`;

    const updatedData = {
      ...formData,
      taxName,
      taxAmount: parseFloat(taxAmount),
      typeofTax,
      directorship: { id: directorshipId }
    };

    try {
      if (formData.id) {
        await axios.put(`${BASE_URL}/api/v1/taxes/${formData.id}`, updatedData, {
          headers: { 'Authorization': authHeader }
        });
      } else {
        console.error('formData does not have an id for PUT request');
      }

      onEditVergi(updatedData);
      onCancel();
    } catch (error) {
      console.error('Error updating vergi:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Vergi Adı</Text>
      <TextInput
        style={styles.input}
        value={taxName}
        onChangeText={setTaxName}
        placeholder="Vergi Adı"
      />
      <Text style={styles.label}>Vergi Miktarı</Text>
      <TextInput
        style={styles.input}
        value={taxAmount}
        onChangeText={setTaxAmount}
        placeholder="Vergi Miktarı"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Vergi Türü</Text>
      <Picker
        selectedValue={typeofTax}
        style={styles.picker}
        onValueChange={(itemValue) => setTypeofTax(itemValue)}
      >
        <Picker.Item label={"Önceki Tür: "+formData.typeofTax || ''} value="" />
        <Picker.Item label="Gelir" value="Gelir" />
        <Picker.Item label="Gider" value="Gider" />
      </Picker>
      <Text style={styles.label}>Müdürlük</Text>
      <Picker
        selectedValue={directorshipId}
        style={styles.picker}
        onValueChange={(itemValue) => setDirectorshipId(itemValue)}
      >
        <Picker.Item label={directorshipName} value={directorship} />
        {directorships.map((directorship) => (
          <Picker.Item key={directorship.id} label={directorship.name} value={directorship.id} />
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>İptal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin:10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default EditVergiForm;
