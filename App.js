import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CameraScreen from './CameraScreen';
import AuthScreen from './AuthScreen';
import { initializeApp } from '@react-native-firebase/app';

// const firebaseConfig = {
//   apiKey: 'YOUR_API_KEY',
//   authDomain: 'YOUR_AUTH_DOMAIN',
//   projectId: 'YOUR_PROJECT_ID',
//   storageBucket: 'YOUR_STORAGE_BUCKET',
//   messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
//   appId: 'YOUR_APP_ID',
// };

// initializeApp(firebaseConfig);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Add Firebase authentication listener here to set the user state
    // e.g., onAuthStateChanged or another authentication check

    // For example (use appropriate Firebase authentication method):
    // const unsubscribe = auth().onAuthStateChanged((user) => {
    //   setUser(user);
    // });

    // return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Conditionally render either CameraScreen or AuthScreen */}
      <CameraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
