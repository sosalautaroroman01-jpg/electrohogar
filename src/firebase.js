import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdzZIkl-Uo7bbw1vld9fyQIxDGk6OHqZQ",
  authDomain: "catalogo-ca9be.firebaseapp.com",
  projectId: "catalogo-ca9be",
  storageBucket: "catalogo-ca9be.firebasestorage.app",
  messagingSenderId: "1062138832491",
  appId: "1:1062138832491:web:e4e2b0997e3353e6e9f32e",
  measurementId: "G-7GGM3B8ZCD",
};

/*
|--------------------------------------------------------------------------
| FIREBASE PRINCIPAL
|--------------------------------------------------------------------------
|
| Este Firebase sigue siendo el principal del sistema:
|
| - Admin
| - Dashboard
| - Productos
| - Modo Local
| - Mostrador
| - Pedidos normales
| - Catálogo principal
|
*/

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/*
|--------------------------------------------------------------------------
| PRUEBA TEMPORAL - API KEY LOCAL
|--------------------------------------------------------------------------
*/

console.log(
  "🔥 FIREBASE LOCAL API KEY:",
  auth.app.options.apiKey
);

/*
|--------------------------------------------------------------------------
| FIREBASE PARA REVENDEDORES
|--------------------------------------------------------------------------
|
| Usamos una segunda Firebase App para mantener separada
| la sesión del revendedor de la sesión del administrador.
|
| Así:
|
| revendedorAuth
|       ↓
| revendedorDb
|
| Las consultas de Mis Ventas quedan autenticadas
| con la sesión del revendedor.
|
*/

const revendedorApp = initializeApp(
  firebaseConfig,
  "revendedores-auth"
);

export const revendedorAuth =
  getAuth(revendedorApp);

export const revendedorDb =
  getFirestore(revendedorApp);