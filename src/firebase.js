// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNRvDt--KebiQiOYiWBjXWHTcf2nBwwNM",
  authDomain: "gpsile.firebaseapp.com",
  projectId: "gpsile",
  storageBucket: "gpsile.firebasestorage.app",
  messagingSenderId: "1022392187619",
  appId: "1:1022392187619:web:f84a1771aa7358fcdb23d6",
  measurementId: "G-PVQLYY7HHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
