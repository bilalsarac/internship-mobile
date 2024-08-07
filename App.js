import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, StatusBar } from 'react-native';

import Vergiler from './Vergiler';
import Yoklama from './Yoklama';
import Login from './Login';
import Register from './Register';
import Directorship from './Directorship';
import Attendees from './Attendees';
import Profile from './Profile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#ff6347',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen
        name="Müdürlükler"
        component={Directorship}
        
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#ff6347',
           
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color:'#fff'
          },
        }}
      />
      <Tab.Screen
        name="Yoklama"
        component={Attendees}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="check-box" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#ff6347',
           
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color:'#fff'
          },
        }}
      />
      <Tab.Screen
        name="Kamera"
        component={Yoklama}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="camera-alt" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#ff6347',
           
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color:'#fff'
          },
        }}
      />
      <Tab.Screen
        name="Profil"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="face" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#ff6347',
           
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color:'#fff'
          },
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#ff6347"
      />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={styles.screenOptions} />
        <Stack.Screen name="Register" component={Register} options={styles.screenOptions} />
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Vergiler"
          component={Vergiler}
          options={{ title: 'Vergiler', ...styles.screenOptions }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  screenOptions: {
    headerStyle: {
      backgroundColor: '#ff6347',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

export default App;
