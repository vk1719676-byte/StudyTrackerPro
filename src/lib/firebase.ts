import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBhWNTbDLXZS7lAb6-cLwdJYDCr5a1z6vU",
  authDomain: "study-pulse-ecr.firebaseapp.com",
  projectId: "study-pulse-ecr",
  storageBucket: "study-pulse-ecr.firebasestorage.app",
  messagingSenderId: "242141356120",
  appId: "1:242141356120:web:cc0163d6597289c2596a2d",
  measurementId: "G-WLZPMS4J13"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;