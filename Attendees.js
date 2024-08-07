import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, } from '@env';

const API_ENDPOINT = `${BASE_URL}/api/v1/attendance`;

const Attendees = ({ navigation }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendees = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem("userCredentials");
      if (storedCredentials) {
        const { email, password } = JSON.parse(storedCredentials);
        const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

        const response = await axios.get(API_ENDPOINT, {
          headers: {
            'Authorization': authHeader
          }
        });

        setAttendees(response.data);
      } else {
        setError("Stored credentials not found");
      }
    } catch (err) {
      setError("Error fetching attendees from server");
      console.error("Error fetching attendees from server:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAttendees();
  }, []);

  useEffect(() => {
    fetchAttendees();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.userId ? item.userId.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.firstName || 'No First Name'} {item.lastName || 'No Last Name'}</Text>
            <Text style={styles.itemEmail}>{item.email || 'No Email'}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => onRefresh()}
      >
        <Text style={styles.yenile}>Yenile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Kamera")}
      >
        <Text style={styles.buttonText}>Kamerayı Açın</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#00796b',
    textAlign: 'center',
    marginTop: '50%',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: '50%',
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#b0bec5',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 5,
  },
  itemEmail: {
    fontSize: 16,
    color: '#424242',
  },
  button: {
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  yenile: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Attendees;
