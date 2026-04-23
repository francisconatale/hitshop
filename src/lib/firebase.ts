import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// He revertido a hardcoded para asegurar que la conexión funcione sin dependencias de .env
const firebaseConfig = {
  apiKey: "AIzaSyBhIetNe8keBk5MTlw7nlbrz_XCuiQHVtg",
  authDomain: "hitshop-64be0.firebaseapp.com",
  projectId: "hitshop-64be0",
  storageBucket: "hitshop-64be0.firebasestorage.app",
  messagingSenderId: "289331371998",
  appId: "1:289331371998:web:b1004341320240f249474f",
  measurementId: "G-W76112L2RP"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase: Initialized (with Firestore)");

export { app, auth, db };
