import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfT5KcawPPReb8m8XrME6pTIuH65XTX2c",
  authDomain: "kanak-aabhushan.firebaseapp.com",
  projectId: "kanak-aabhushan",
  storageBucket: "kanak-aabhushan.firebasestorage.app",
  messagingSenderId: "61649597183",
  appId: "1:61649597183:web:4f3931788e8cac034f12ca",
  measurementId: "G-XP5RVDRDDT"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);