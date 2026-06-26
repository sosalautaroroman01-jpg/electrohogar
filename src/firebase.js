import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3psULE4DgO9I-wKcMYyYVSQLnCyhpafU",
  authDomain: "catalogo-ca9be.firebaseapp.com",
  projectId: "catalogo-ca9be",
  storageBucket: "catalogo-ca9be.firebasestorage.app",
  messagingSenderId: "1062138832491",
  appId: "1:1062138832491:web:e4e2b0997e3353e6e9f32e",
  measurementId: "G-7GGM3B8ZCD",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);