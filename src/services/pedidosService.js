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
  query,
  where,
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

const boletasRef = collection(
  db,
  "boletas"
);

// =====================================================
// NUMERACIÓN CORRELATIVA DE BOLETAS
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
// ENVIAR PEDIDO AL MOSTRADOR + ASIGNAR BOLETA
// =====================================================

export async function enviarPedidoAlMostrador(
  pedidoId
) {
  if (!pedidoId) {
    throw new Error(
      "No se indicó el ID del pedido."
    );
  }

  const pedidoRef = doc(
    db,
    "pedidosPendientes",
    pedidoId
  );

  const resultado = await runTransaction(
    db,
    async (transaction) => {

      // =================================================
      // LEER PEDIDO
      // =================================================

      const pedidoSnapshot =
        await transaction.get(
          pedidoRef
        );

      if (!pedidoSnapshot.exists()) {
        throw new Error(
          "El pedido no existe."
        );
      }

      const pedidoData =
        pedidoSnapshot.data();

      // =================================================
      // SI YA TIENE NÚMERO DE BOLETA
      // =================================================

      if (
        pedidoData.numeroBoleta !==
          undefined &&
        pedidoData.numeroBoleta !== null
      ) {
        const numeroExistente =
          Number(
            pedidoData.numeroBoleta
          );

        const boletaRef = doc(
          db,
          "boletas",
          String(numeroExistente)
        );

        const boletaSnapshot =
          await transaction.get(
            boletaRef
          );

        if (!boletaSnapshot.exists()) {

          const productos =
            Array.isArray(
              pedidoData.productos
            )
              ? pedidoData.productos
              : [];

          transaction.set(
            boletaRef,
            {
              ...pedidoData,

              pedidoId,

              numeroBoleta:
                numeroExistente,

              carrito:
                productos,

              productos,

              total:
                Number(
                  pedidoData.total || 0
                ),

              estado:
                "Abierta",

              origen:
                pedidoData.origen ||
                "WhatsApp",

              actualizadoEn:
                serverTimestamp(),
            },
            {
              merge: true,
            }
          );
        }

        if (
          pedidoData.estado !==
          "Pendiente"
        ) {
          transaction.update(
            pedidoRef,
            {
              estado:
                "Pendiente",

              actualizadoEn:
                serverTimestamp(),
            }
          );
        }

        return numeroExistente;
      }

      // =================================================
      // LEER CONTADOR
      // =================================================

      const contadorSnapshot =
        await transaction.get(
          contadorBoletasRef
        );

      const numeroGuardado =
        contadorSnapshot.exists()
          ? Number(
              contadorSnapshot.data()
                .ultimoNumero || 0
            )
          : 0;

      const ultimoNumero =
        Math.max(
          numeroGuardado,
          NUMERO_INICIAL_BOLETA
        );

      const siguienteNumero =
        ultimoNumero + 1;

      // =================================================
      // REFERENCIA BOLETA
      // =================================================

      const boletaRef = doc(
        db,
        "boletas",
        String(siguienteNumero)
      );

      // =================================================
      // ACTUALIZAR CONTADOR
      // =================================================

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

      // =================================================
      // ACTUALIZAR PEDIDO
      // =================================================

      transaction.update(
        pedidoRef,
        {
          numeroBoleta:
            siguienteNumero,

          estado:
            "Pendiente",

          actualizadoEn:
            serverTimestamp(),
        }
      );

      // =================================================
      // GUARDAR BOLETA
      // =================================================

      const productos =
        Array.isArray(
          pedidoData.productos
        )
          ? pedidoData.productos
          : [];

      transaction.set(
        boletaRef,
        {
          ...pedidoData,

          pedidoId,

          numeroBoleta:
            siguienteNumero,

          carrito:
            productos,

          productos,

          total:
            Number(
              pedidoData.total || 0
            ),

          estado:
            "Abierta",

          origen:
            "WhatsApp",

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

  return resultado;
}

// =====================================================
// GUARDAR BOLETA
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
        Number(
          data.numeroBoleta
        ),

      estado:
        data.estado ||
        "Abierta",

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
    await getDoc(
      boletaRef
    );

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
// ACÁ ESTÁ LA PARTE NUEVA:
//
// Cuando la venta termina:
//
//     Boleta → Cerrada
//
// también registramos las cantidades vendidas.
//
// El contador queda dentro de cada producto:
//
//     ventas: 1
//     ventas: 2
//     ventas: 15
//
// No se crea ninguna colección nueva.
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

  await runTransaction(
    db,
    async (transaction) => {

      // =================================================
      // 1. LEER BOLETA
      // =================================================

      const boletaSnapshot =
        await transaction.get(
          boletaRef
        );

      if (!boletaSnapshot.exists()) {
        throw new Error(
          `La boleta ${numero} no existe.`
        );
      }

      const boletaData =
        boletaSnapshot.data();

      // =================================================
      // 2. EVITAR DUPLICAR VENTAS
      // =================================================

      if (
        boletaData.ventasRegistradas === true
      ) {
        transaction.update(
          boletaRef,
          {
            estado:
              "Cerrada",

            cerradoEn:
              serverTimestamp(),
          }
        );

        return;
      }

      // =================================================
      // 3. OBTENER PRODUCTOS DE LA BOLETA
      // =================================================

      const productos =
        Array.isArray(
          boletaData.productos
        )
          ? boletaData.productos
          : Array.isArray(
              boletaData.carrito
            )
              ? boletaData.carrito
              : [];

      // =================================================
      // 4. AGRUPAR CANTIDADES
      // =================================================

      const ventasPorProducto =
        new Map();

      productos.forEach(
        (producto) => {

          if (!producto) {
            return;
          }

          const productoId =
            producto.id ??
            producto.productoId ??
            producto.productId;

          const cantidad =
            Number(
              producto.cantidad
            ) || 0;

          if (
            !productoId ||
            cantidad <= 0
          ) {
            return;
          }

          const id =
            String(
              productoId
            );

          ventasPorProducto.set(
            id,
            (
              ventasPorProducto.get(
                id
              ) || 0
            ) + cantidad
          );
        }
      );

      // =================================================
      // 5. LEER PRODUCTOS
      // =================================================

      const productosParaActualizar =
        [];

      for (
        const [
          productoId,
          cantidad
        ]
        of ventasPorProducto.entries()
      ) {

        const productoRef =
          doc(
            db,
            "productos",
            productoId
          );

        const productoSnapshot =
          await transaction.get(
            productoRef
          );

        if (
          !productoSnapshot.exists()
        ) {
          console.warn(
            `⚠️ No se encontró el producto ${productoId} para registrar ventas.`
          );

          continue;
        }

        const productoData =
          productoSnapshot.data();

        const ventasActuales =
          Number(
            productoData.ventas
          ) || 0;

        productosParaActualizar.push(
          {
            ref:
              productoRef,

            ventas:
              ventasActuales +
              cantidad,
          }
        );
      }

      // =================================================
      // 6. ACTUALIZAR CONTADORES
      // =================================================

      productosParaActualizar.forEach(
        ({
          ref,
          ventas
        }) => {

          transaction.update(
            ref,
            {
              ventas,

              ventasActualizadasEn:
                serverTimestamp(),
            }
          );
        }
      );

      // =================================================
      // 7. CERRAR BOLETA
      // =================================================

      transaction.update(
        boletaRef,
        {
          estado:
            "Cerrada",

          ventasRegistradas:
            true,

          cerradoEn:
            serverTimestamp(),
        }
      );
    }
  );

  return numero;
}

// =====================================================
// CREAR PEDIDO
// =====================================================

export function crearPedido(
  data
) {
  return addDoc(
    pedidosRef,
    {
      ...data,

      estado:
        data.estado ||
        "Creada",

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
  const pedidosPendientesQuery =
    query(
      pedidosRef,
      where(
        "estado",
        "==",
        "Pendiente"
      )
    );

  return onSnapshot(
    pedidosPendientesQuery,
    (snapshot) => {

      const pedidos =
        snapshot.docs
          .map(
            (documento) => ({
              id:
                documento.id,

              ...documento.data(),
            })
          )
          .sort(
            (a, b) => {

              const fechaA =
                a.fecha?.seconds ||
                0;

              const fechaB =
                b.fecha?.seconds ||
                0;

              return (
                fechaA -
                fechaB
              );
            }
          );

      callback(
        pedidos
      );
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
      estado:
        "Impreso",
    }
  );
}