import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
  runTransaction,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

// =====================================================
// COLECCIÓN DE PEDIDOS
// =====================================================

const pedidosRef = collection(
  db,
  "pedidosPendientes"
);

// =====================================================
// COLECCIÓN DE BOLETAS
// =====================================================
//
// Acá vamos a guardar TODAS las boletas locales.
//
// Ejemplo:
//
// boletas
//   └── 71910
//        ├── numeroBoleta: 71910
//        ├── estado: "Abierta"
//        ├── vendedor: "Lautaro"
//        ├── productos: [...]
//        └── total: 150000
//
// El número de boleta será también el ID del documento.
//
// Esto permite buscar directamente:
//
// boletas / 71910
//
// =====================================================

const boletasRef = collection(
  db,
  "boletas"
);

// =====================================================
// NUMERACIÓN CORRELATIVA DE BOLETAS
// =====================================================
//
// ÚLTIMA BOLETA REAL:
//
//     N° 71909
//
// PRÓXIMA:
//
//     N° 71910
//
// Firebase guarda el contador para que nunca se repita.
//
// =====================================================

const NUMERO_INICIAL_BOLETA = 71909;

const contadorBoletasRef = doc(
  db,
  "configuracion",
  "contadorBoletas"
);

// =====================================================
// OBTENER SIGUIENTE NÚMERO DE BOLETA
// =====================================================
//
// Se utiliza una transacción para evitar que dos
// computadoras obtengan el mismo número al mismo tiempo.
//
// Ejemplo:
//
// Tablet    → 71910
// Notebook  → 71911
// Otra PC   → 71912
//
// =====================================================

export async function obtenerSiguienteNumeroBoleta() {
  return runTransaction(
    db,
    async (transaction) => {
      const snapshot =
        await transaction.get(
          contadorBoletasRef
        );

      const numeroGuardado =
        snapshot.exists()
          ? Number(
              snapshot.data().ultimoNumero || 0
            )
          : 0;

      // Nunca permitimos retroceder de 71909.

      const ultimoNumero = Math.max(
        numeroGuardado,
        NUMERO_INICIAL_BOLETA
      );

      const siguienteNumero =
        ultimoNumero + 1;

      transaction.set(
        contadorBoletasRef,
        {
          ultimoNumero:
            siguienteNumero,

          actualizadoEn:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      return siguienteNumero;
    }
  );
}

// =====================================================
// GUARDAR BOLETA
// =====================================================
//
// Guarda una venta completa en Firebase.
//
// IMPORTANTE:
//
// Si la boleta ya existe, NO crea otra.
//
// Actualiza el mismo documento.
//
// =====================================================

export async function guardarBoleta(
  data
) {
  if (
    data?.numeroBoleta === null ||
    data?.numeroBoleta === undefined
  ) {
    throw new Error(
      "No se puede guardar una boleta sin número."
    );
  }

  const numero =
    String(data.numeroBoleta);

  const boletaRef = doc(
    db,
    "boletas",
    numero
  );

  await setDoc(
    boletaRef,
    {
      ...data,

      numeroBoleta:
        Number(data.numeroBoleta),

      estado:
        data.estado || "Abierta",

      actualizadoEn:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return numero;
}

// =====================================================
// BUSCAR BOLETA POR NÚMERO
// =====================================================

export async function buscarBoletaPorNumero(
  numeroBoleta
) {
  if (
    numeroBoleta === null ||
    numeroBoleta === undefined ||
    String(numeroBoleta).trim() === ""
  ) {
    return null;
  }

  const numero =
    String(numeroBoleta).trim();

  const boletaRef = doc(
    db,
    "boletas",
    numero
  );

  const snapshot =
    await getDoc(boletaRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// =====================================================
// ACTUALIZAR BOLETA
// =====================================================
//
// NO genera un número nuevo.
//
// Si estamos trabajando con:
//
//     N° 71910
//
// seguirá siendo:
//
//     N° 71910
//
// =====================================================

export async function actualizarBoleta(
  numeroBoleta,
  data
) {
  if (
    numeroBoleta === null ||
    numeroBoleta === undefined
  ) {
    throw new Error(
      "No se puede actualizar una boleta sin número."
    );
  }

  const numero =
    String(numeroBoleta);

  const boletaRef = doc(
    db,
    "boletas",
    numero
  );

  await setDoc(
    boletaRef,
    {
      ...data,

      numeroBoleta:
        Number(numeroBoleta),

      actualizadoEn:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return numero;
}

// =====================================================
// CERRAR BOLETA
// =====================================================
//
// Cuando la venta terminó definitivamente:
//
//     71910 → Cerrada
//
// Esto NO elimina la boleta.
//
// Queda guardada en Firebase como historial.
//
// Tampoco cambia el número.
//
// La próxima venta nueva será:
//
//     71911
//
// =====================================================

export async function cerrarBoleta(
  numeroBoleta
) {
  if (
    numeroBoleta === null ||
    numeroBoleta === undefined
  ) {
    throw new Error(
      "No se puede cerrar una boleta sin número."
    );
  }

  const numero =
    String(numeroBoleta);

  const boletaRef = doc(
    db,
    "boletas",
    numero
  );

  await updateDoc(
    boletaRef,
    {
      estado: "Cerrada",

      cerradoEn:
        serverTimestamp(),
    }
  );

  return numero;
}

// =====================================================
// CREAR PEDIDO
// =====================================================
//
// Si no se indica estado:
//
// → La orden queda "Creada"
// → NO aparece en Mostrador
//
// Si se indica estado "Pendiente":
//
// → Aparece en Mostrador
//
// =====================================================

export function crearPedido(data) {
  return addDoc(
    pedidosRef,
    {
      ...data,

      estado:
        data.estado || "Creada",

      fecha:
        serverTimestamp(),
    }
  );
}

// =====================================================
// ESCUCHAR PEDIDOS PENDIENTES
// =====================================================

export function escucharPedidos(
  callback
) {
  return onSnapshot(
    pedidosRef,
    (snapshot) => {
      const pedidos =
        snapshot.docs
          .map((documento) => ({
            id: documento.id,
            ...documento.data(),
          }))
          .filter(
            (pedido) =>
              pedido.estado ===
              "Pendiente"
          )
          .sort((a, b) => {
            const fechaA =
              a.fecha?.seconds || 0;

            const fechaB =
              b.fecha?.seconds || 0;

            return (
              fechaA - fechaB
            );
          });

      callback(pedidos);
    },
    (error) => {
      console.error(
        "❌ Error escuchando pedidos:",
        error
      );
    }
  );
}

// =====================================================
// MARCAR COMO IMPRESO
// =====================================================

export function marcarComoImpreso(
  id
) {
  return updateDoc(
    doc(
      db,
      "pedidosPendientes",
      id
    ),
    {
      estado: "Impreso",
    }
  );
}