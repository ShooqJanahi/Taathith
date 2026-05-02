//firebaseConfig.js

// Import the required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc, increment} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7KwT8604Gc2fnlxuQXvz9gyuEurNsipg",
  authDomain: "taathith-26c23.firebaseapp.com",
  projectId: "taathith-26c23",
  storageBucket: "taathith-26c23.firebasestorage.app",
  messagingSenderId: "401262259682",
  appId: "1:401262259682:web:0349938f8885ad30569dbb",
  measurementId: "G-EJ0DQ877E5"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);
 
 // Initialize Firebase services 
 const auth = getAuth(app); 
 const db = getFirestore(app); 
const storage = getStorage(app);



// Export Firebase services for use in other JavaScript files
export { auth, db, storage };