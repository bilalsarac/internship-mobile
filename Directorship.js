import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddDirectorship from './AddDirectorship';
import EditDirectorship from './EditDirectorship';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL, } from '@env';

const Directorships = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentDirectorship, setCurrentDirectorship] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) {
        return;
      }

      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

      const response = await axios.get(`${BASE_URL}/api/v1/directorships`, {
        headers: { 'Authorization': authHeader }
      });

      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };

  const handleAddDirectorship = () => {
    setModalVisible(true);
  };

  const handleDirectorshipPress = (id, name) => {
   
    navigation.navigate('Vergiler', { directorshipId: id, directorshipName: name });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    fetchData();
  };

  const handleEditPress = (directorship) => {
    setCurrentDirectorship(directorship);
    setEditModalVisible(true);
  };

  const handleDeletePress = async (id) => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) {
        return;
      }

      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

      await axios.delete(`${BASE_URL}/api/v1/directorships/${id}`, {
        headers: { 'Authorization': authHeader }
      });

      Alert.alert('Başarılı', 'Müdürlük başarıyla silindi.');
      fetchData();
    } catch (error) {
      console.error('Error deleting data: ', error);
      Alert.alert('Error', 'Failed to delete directorship');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleDirectorshipPress(item.id, item.name)}
            >
              <Text style={styles.text}>{item.name}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => handleEditPress(item)}
                >
                  <MaterialIcons name="edit" size={24} color="#007BFF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeletePress(item.id)}
                >
                  <MaterialIcons name="delete" size={24} color="#FF3B30" style={styles.icon} />
                </TouchableOpacity>
                <MaterialIcons name="arrow-forward" size={24} color="blue" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddDirectorship}
      >
        <Text style={styles.addButtonText}>Müdürlük Ekle</Text>
      </TouchableOpacity>
      <AddDirectorship
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
      <EditDirectorship
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        directorship={currentDirectorship}
        onUpdate={() => {
          setEditModalVisible(false);
          fetchData();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 8,
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Directorships;
