import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

const pedidosRef = collection(db, "pedidosPendientes");

// ===============================
// Crear pedido
// ===============================
export function crearPedido(data) {
  return addDoc(pedidosRef, {
    ...data,
    estado: "Creada",
    fecha: serverTimestamp(),
  });
}

// ===============================
// Escuchar pedidos pendientes
// ===============================
export function escucharPedidos(callback) {

  return onSnapshot(pedidosRef, (snapshot) => {

    const pedidos = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (pedido) => pedido.estado === "Pendiente"
      )
      .sort((a, b) => {

        const fechaA =
          a.fecha?.seconds || 0;

        const fechaB =
          b.fecha?.seconds || 0;

        return fechaA - fechaB;

      });

    callback(pedidos);

  });

}

// ===============================
// Marcar como impreso
// ===============================
export function marcarComoImpreso(id) {

  return updateDoc(
    doc(db, "pedidosPendientes", id),
    {
      estado: "Impreso",
    }
  );

}