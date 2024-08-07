import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '@env';

const API_ENDPOINT = `${BASE_URL}/api/v1/attendance`; 

const Yoklama = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();


    const getCredentialsFromStorage = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem("userCredentials");
        if (storedCredentials) {
          const { email, password } = JSON.parse(storedCredentials);
          setEmail(email);
          setPassword(password);
        } else {
         
        }
      } catch (error) {
        console.error("Error retrieving credentials from AsyncStorage:", error);
      }
    };
    getCredentialsFromStorage();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    
    try {
      const prefixedEmail = `http://${email}`;
      if (data === prefixedEmail) {

        const authHeader = `Basic ${btoa(`${email}:${password}`)}`;
        const response = await axios.post(API_ENDPOINT, {
          qrData: email,
        }, {
          headers: {
            'Authorization': authHeader
          }
        });
      } else {
        alert("Scanned QR data does not match your email. Request not sent.");
      }
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button
          title={"Tap to Scan Again"}
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default Yoklama;
