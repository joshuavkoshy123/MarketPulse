import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDoUrc-8IQBIr4gUKmEvxBzAPG68DHCfWI",
  authDomain: "marketpulse-7bf1a.firebaseapp.com",
  projectId: "marketpulse-7bf1a",
  storageBucket: "marketpulse-7bf1a.firebasestorage.app",
  messagingSenderId: "289694627604",
  appId: "1:289694627604:web:31143e72f3e08467ae3401",
  measurementId: "G-1JKH3TFQC0"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
