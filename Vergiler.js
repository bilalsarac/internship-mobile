import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Image,Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddVergiForm from './AddVergiForm';
import VergiDetails from './VergiDetails';
import EditVergiForm from './EditVergiForm';
import ImagePickerComponent from './ImagePickerComponent'; 
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '@env';

const Vergiler = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedVergi, setSelectedVergi] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [showImageModal, setShowImageModal] = useState(false);
  const { directorshipId } = route.params;
  const {directorshipName} = route.params;
  const [filteredTaxes, setFilteredTaxes] = useState([]);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    fetchData();
    
  }, [directorshipId,showAddForm]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 10 }}>
          <TouchableOpacity onPress={() => clearFilter()}>
            <MaterialIcons name="clear" size={26} color="black" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => filterTaxes('Gelir')}>
            <MaterialIcons name="filter-list" size={26} color="green" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => filterTaxes('Gider')}>
            <MaterialIcons name="filter-list" size={26} color="red" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, taxes]);

  const filterTaxes = (type) => {
    setFilterType(type);
    if (type === 'Gelir') {
      setFilteredTaxes(taxes.filter(tax => tax.typeofTax === 'Gelir'));
    } else if (type === 'Gider') {
      setFilteredTaxes(taxes.filter(tax => tax.typeofTax === 'Gider'));
    } else {
      setFilteredTaxes(taxes);
    }
  };

  const clearFilter = () => {
    setFilterType(null);
    setFilteredTaxes([]);
  };

  useEffect(() => {
    filterTaxes(filterType);
  }, [taxes, filterType]);

  const fetchData = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) return;

      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

      const response = await axios.get(`${BASE_URL}/api/v1/directorships/${directorshipId}`, {
        headers: { 'Authorization': authHeader }
      });

      setTaxes(response.data.taxes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNetProfit = () => {
   
    const gelirTotal = taxes.filter(tax => tax.typeofTax === 'Gelir').reduce((acc, tax) => acc + tax.taxAmount, 0);
    const giderTotal = taxes.filter(tax => tax.typeofTax === 'Gider').reduce((acc, tax) => acc + tax.taxAmount, 0);
    return gelirTotal - giderTotal;
  };

  const toggleAddFormVisibility = () => {
    setShowAddForm(!showAddForm);
  };

  const toggleEditFormVisibility = () => {
    setShowEditForm(!showEditForm);
  };

  const showVergiDetails = (vergi) => {
    
    setSelectedVergi(vergi);
  
  };

  const closeVergiDetails = () => {
    setSelectedVergi(null);
  };

  const deleteVergi = async (id) => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) return;

      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

      await axios.delete(`${BASE_URL}/api/v1/taxes/${id}`, {
        headers: { 'Authorization': authHeader }
      });

      setTaxes(prevTaxes => prevTaxes.filter(item => item.id !== id));
      if (selectedVergi && selectedVergi.id === id) {
        setSelectedVergi(null);
      }
    } catch (error) {
      console.error('Error deleting tax:', error);
    }
  };

  const editVergi = (vergi) => {
    setEditFormData(vergi);
    setShowEditForm(true);
  };

  const handleEditVergi = async (formData) => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) return;

      const { email, password } = JSON.parse(storedCredentials);
      const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

      const updatedData = { ...editFormData, ...formData };
      await axios.put(`${BASE_URL}/api/v1/taxes/${editFormData.id}`, updatedData, {
        headers: { 'Authorization': authHeader }
      });

      setTaxes(prevTaxes => prevTaxes.map(item => item.id === editFormData.id ? updatedData : item));
      setEditFormData(null);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating tax:', error);
    }
  };

  

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  
const showImage = async (taxId) => {
 
  try {
    const storedCredentials = await AsyncStorage.getItem('userCredentials');
    if (!storedCredentials) return;

    const { email, password } = JSON.parse(storedCredentials);
    const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

    const response = await axios.get(`${BASE_URL}/api/v1/taxes/${taxId}/image`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'image/jpeg',
      },
      responseType: 'arraybuffer',
    });

    if (response.data.byteLength === 0) {
      Alert.alert('No Image Found', 'No image available for this tax ID.');
      return;
    }

    const base64Image = `data:image/jpeg;base64,${arrayBufferToBase64(response.data)}`;
  
    setImageUri(base64Image);
    setShowImageModal(true);

  } catch (error) {
   
    if (error.response && error.response.status === 404) {
      Alert.alert('No Such Image', 'No image available for this tax ID.');
    } else {
      Alert.alert('Error', 'Unable to fetch image. Please try again later.');
    }
    
  }
};

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return global.btoa(binary);
}


  return (
    <View style={styles.container}>

      <FlatList
        data={filteredTaxes.length > 0 ? filteredTaxes : taxes}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => showVergiDetails(item)}
            >
            <View style={styles.iconAndText}>
            {item.typeofTax === 'Gelir' ? (
                <MaterialIcons name="arrow-upward" size={26} color="green" style={styles.icon} />
              ) : (
                <MaterialIcons name="arrow-downward" size={26} color="red" style={styles.icon} />
              )}
              <Text style={styles.text}>{item.taxName}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.actions}>
            <TouchableOpacity onPress={() => showImage(item.id)}>
                <MaterialIcons name="camera" size={26} color="orange" padding={10} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editVergi(item)}>
                <MaterialIcons name="edit" size={26} color="orange" padding={10} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteVergi(item.id)}>
                <MaterialIcons name="delete" size={26} color="red" padding={10} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.netProfit}>Toplam Kâr: {calculateNetProfit()}₺</Text>
      <TouchableOpacity style={styles.addButton} onPress={toggleAddFormVisibility}>
        <Text style={styles.addButtonText}>Vergi Ekle</Text>
      </TouchableOpacity>
      <Modal
      
  visible={showImageModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowImageModal(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Image
        source={{ uri: imageUri }}
        style={styles.modalImage}
        resizeMode="contain"
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowImageModal(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      <Modal
        visible={showAddForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <AddVergiForm onAddVergi={(newTax) => {
              setTaxes(prevTaxes => [...prevTaxes, newTax]);
              setShowAddForm(false);
            }} onCancel={() => setShowAddForm(false)} />
          </View>
        </View>
      </Modal>
      <Modal
        visible={selectedVergi !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closeVergiDetails}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <VergiDetails
              vergi={selectedVergi}
              onClose={closeVergiDetails}
              onDelete={() => deleteVergi(selectedVergi.id)}
              onEdit={() => editVergi(selectedVergi)}
              directorshipId= {directorshipId}
              directorshipName={directorshipName}
              
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={showEditForm}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleEditFormVisibility}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <EditVergiForm
              initialData={editFormData}
              onEditVergi={handleEditVergi}
              onCancel={() => setShowEditForm(false)}
              directorship={directorshipId}
              formData={editFormData}
            />
            <ImagePickerComponent
            
        taxId={editFormData?.id}
        imageUri={imageUri} 
        setImageUri={setImageUri}  
      />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  netProfit: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  item: {
    flex: 1,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 600, 
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
});

export default Vergiler;
