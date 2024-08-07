import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const VergiDetails = ({ vergi, onClose, directorshipName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vergi Numarası: {vergi.id}</Text>
      <Text style={styles.text}>Vergi Adı: {vergi.taxName}</Text>
      <Text style={styles.text}>Vergi Türü: {vergi.typeofTax}</Text>
      <Text style={styles.text}>Vergi Miktarı: {vergi.taxAmount}₺</Text>
      <Text style={styles.text}>Müdürlük: {directorshipName || '-'}</Text>
      <Text style={styles.text}>Kayıt Tarihi: {vergi.date ? formatDate(vergi.date) : '-'}</Text>
      
      {}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Kapat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default VergiDetails;
