import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCC0ZgWyTEa--tME02sCKL_ngUXTqf0yrg",
  authDomain: "task-manager-77991.firebaseapp.com",
  projectId: "task-manager-77991",
  storageBucket: "task-manager-77991.firebasestorage.app",
  messagingSenderId: "700513661049",
  appId: "1:700513661049:web:e31143ee1d0261ffad64a8",
  measurementId: "G-C8YDGP3M2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)

