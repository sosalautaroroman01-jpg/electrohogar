import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

const productosRef = collection(db, "productos");

// Escuchar productos en tiempo real
export function escucharProductos(callback) {
  return onSnapshot(productosRef, (snapshot) => {
    const productos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(productos);
  });
}

// Obtener todos
export async function obtenerProductos() {
  const snapshot = await getDocs(productosRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Obtener uno
export async function obtenerProductoPorId(id) {
  const snapshot = await getDoc(doc(db, "productos", id));

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// Crear
export function crearProducto(data) {
  return addDoc(productosRef, data);
}

// Editar
export function editarProducto(id, data) {
  return updateDoc(doc(db, "productos", id), data);
}

// Eliminar
export function eliminarProducto(id) {
  return deleteDoc(doc(db, "productos", id));
}