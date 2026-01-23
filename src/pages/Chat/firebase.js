// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCluRBjNH9maiUFgoFxJc_sH64nchL2VeE",
  authDomain: "chat-feature-b2372.firebaseapp.com",
  projectId: "chat-feature-b2372",
  storageBucket: "chat-feature-b2372.firebasestorage.app",
  messagingSenderId: "1001072510681",
  appId: "1:1001072510681:web:9542af6172619cc7c460c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)