// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgcy1BQwBzlJZyiwOizVZR_of0nA1spxg",
  authDomain: "chat-feature-1aa16.firebaseapp.com",
  projectId: "chat-feature-1aa16",
  storageBucket: "chat-feature-1aa16.firebasestorage.app",
  messagingSenderId: "841689476428",
  appId: "1:841689476428:web:d98898ac5eb7177a42b3e9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)