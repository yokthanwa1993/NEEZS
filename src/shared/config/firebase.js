// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, setLogLevel } from 'firebase/firestore';
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
let db;
const FORCE_LONG_POLLING = (process.env.EXPO_PUBLIC_FIRESTORE_FORCE_LONG_POLLING ?? 'true') === 'true';
try {
  // Reduce WebChannel transport errors on React Native by auto‑detecting long polling
  db = initializeFirestore(app, {
    // Toggle via env; default true for RN
    experimentalForceLongPolling: FORCE_LONG_POLLING,
    useFetchStreams: false,
  });
} catch (e) {
  // If already initialized elsewhere, fall back to the default instance
  db = getFirestore(app);
}

// Firestore log level — configurable via env; default: debug in dev, error in prod
try {
  const LV = process.env.EXPO_PUBLIC_FIRESTORE_LOG_LEVEL || (__DEV__ ? 'debug' : 'error');
  setLogLevel(LV);
} catch {}

export { auth, db };
export default app;
