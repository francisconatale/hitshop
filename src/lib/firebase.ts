import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhIetNe8keBk5MTlw7nlbrz_XCuiQHVtg",
  authDomain: "hitshop-64be0.firebaseapp.com",
  projectId: "hitshop-64be0",
  storageBucket: "hitshop-64be0.firebasestorage.app",
  messagingSenderId: "289331371998",
  appId: "1:289331371998:web:b1004341320240f249474f",
  measurementId: "G-W76112L2RP"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
