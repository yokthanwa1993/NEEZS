// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8E9vOFKroDXONHjUH4p6oZtFYnLG6anM",
  authDomain: "neezs-v1.firebaseapp.com",
  projectId: "neezs-v1",
  storageBucket: "neezs-v1.firebasestorage.app",
  messagingSenderId: "901801924600",
  appId: "1:901801924600:web:0bc9dfe87d9b75d166680d",
  measurementId: "G-G6Q3RTL2CE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // หากมีการเริ่มต้นแล้ว ให้ใช้ getAuth แทน
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
