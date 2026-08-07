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

// ===============================
// Escuchar productos en tiempo real
// ===============================
export function escucharProductos(callback) {
  return onSnapshot(
    productosRef,
    (snapshot) => {
      const productos = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) =>
          (a.nombre || "").localeCompare(b.nombre || "")
        );

      callback(productos);
    },
    (error) => {
      console.error("Error escuchando productos:", error);
      callback([]);
    }
  );
}

// ===============================
// Obtener todos
// ===============================
export async function obtenerProductos() {
  const snapshot = await getDocs(productosRef);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) =>
      (a.nombre || "").localeCompare(b.nombre || "")
    );
}

// ===============================
// Obtener uno
// ===============================
export async function obtenerProductoPorId(id) {
  const snapshot = await getDoc(doc(db, "productos", id));

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// ===============================
// Crear
// ===============================
export function crearProducto(data) {
  return addDoc(productosRef, data);
}

// ===============================
// Editar
// ===============================
export function editarProducto(id, data) {
  return updateDoc(doc(db, "productos", id), data);
}

// ===============================
// Cambiar visibilidad
// ===============================
export function cambiarVisibilidad(id, visible) {
  return updateDoc(doc(db, "productos", id), {
    visible,
  });
}

// ===============================
// Eliminar
// ===============================
export function eliminarProducto(id) {
  return deleteDoc(doc(db, "productos", id));
}