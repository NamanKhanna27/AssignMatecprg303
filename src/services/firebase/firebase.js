// src/services/firebase/firebase.js
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZnWljxPdUAwBsrVpmeOgTLBtej9JOxZA",
  authDomain: "assignmate-c9cbf.firebaseapp.com",
  projectId: "assignmate-c9cbf",
  storageBucket: "assignmate-c9cbf.firebasestorage.app",
  messagingSenderId: "478480486892",
  appId: "1:478480486892:web:02c32691877ffb56b270c9",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);