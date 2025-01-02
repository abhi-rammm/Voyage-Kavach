import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlFUT2jMfhapDD7NrCOeUC-UMOh6sigWI",
  authDomain: "voyage-kavach.firebaseapp.com",
  databaseURL: "https://voyage-kavach-default-rtdb.firebaseio.com",
  projectId: "voyage-kavach",
  storageBucket: "voyage-kavach.appspot.com",
  messagingSenderId: "947840261682",
  appId: "1:947840261682:web:05d9e26840fa507db8a62b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);


