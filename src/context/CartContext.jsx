import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import {
  guardarBoleta,
  buscarBoletaPorNumero,
  actualizarBoleta,
  cerrarBoleta,
} from "../services/pedidosService";

const CartContext = createContext();

const BORRADOR_LOCAL_KEY =
  "electro_hogar_borrador_local";

// =========================================================
// LIMPIAR VALORES UNDEFINED
// =========================================================
//
// Firebase Firestore NO acepta valores undefined.
//
// Si algún producto tiene accidentalmente un campo:
//     campo: undefined
//
// Firebase rechaza TODO el documento.
//
// Esta función elimina solamente los campos undefined.
// No modifica:
// - null
// - false
// - 0
// - ""
// - arrays
// - strings
// - números
//
// =========================================================

function limpiarUndefined(valor) {
  if (Array.isArray(valor)) {
    return valor
      .map((item) => limpiarUndefined(item))
      .filter(
        (item) => item !== undefined
      );
  }

  if (
    valor !== null &&
    typeof valor === "object"
  ) {
    const limpio = {};

    Object.entries(valor).forEach(
      ([clave, contenido]) => {
        if (
          contenido !== undefined
        ) {
          limpio[clave] =
            limpiarUndefined(
              contenido
            );
        }
      }
    );

    return limpio;
  }

  return valor;
}

// =========================================================
// PROVIDER
// =========================================================

export function CartProvider({
  children,
}) {
  const [carrito, setCarrito] =
    useState([]);

  const [abierto, setAbierto] =
    useState(false);

  const [modoLocalActivo, setModoLocalActivo] =
    useState(false);

  const [
    numeroBoletaLocal,
    setNumeroBoletaLocal,
  ] = useState(null);

  const [
    boletaRecuperada,
    setBoletaRecuperada,
  ] = useState(false);

  const [
    guardandoBoleta,
    setGuardandoBoleta,
  ] = useState(false);

  // =======================================================
  // ACTIVAR MODO LOCAL
  // =======================================================
  //
  // IMPORTANTE:
  //
  // Al entrar o volver a cargar la página, Modo Local
  // comienza con el carrito vacío.
  //
  // NO recuperamos automáticamente la venta anterior
  // desde localStorage.
  //
  // Si necesitás continuar una boleta anterior:
  //
  //     🔎 Recuperar boleta
  //
  // y buscás manualmente el número en Firebase.
  //
  // =======================================================

  const activarModoLocal =
    useCallback(() => {
      setModoLocalActivo(true);

      // Siempre arrancamos una sesión local nueva.
      setCarrito([]);
      setNumeroBoletaLocal(null);
      setBoletaRecuperada(false);
      setAbierto(false);
    }, []);

  // =======================================================
  // DESACTIVAR MODO LOCAL
  // =======================================================

  const desactivarModoLocal =
    useCallback(() => {
      setModoLocalActivo(false);
    }, []);

  // =======================================================
  // GUARDADO AUTOMÁTICO DEL BORRADOR
  // =======================================================
  //
  // Solo funciona en Modo Local.
  //
  // Cada cambio de:
  // - productos
  // - cantidades
  // - IMEI
  // - número de boleta
  //
  // vuelve a guardar el borrador.
  //
  // =======================================================

  useEffect(() => {
    if (!modoLocalActivo) return;

    if (carrito.length === 0) {
      return;
    }

    try {
      const borrador = {
        carrito: limpiarUndefined(
          carrito
        ),

        numeroBoleta:
          numeroBoletaLocal,

        actualizadoEn:
          new Date().toISOString(),
      };

      localStorage.setItem(
        BORRADOR_LOCAL_KEY,
        JSON.stringify(borrador)
      );
    } catch (error) {
      console.error(
        "❌ Error guardando borrador local:",
        error
      );
    }
  }, [
    modoLocalActivo,
    carrito,
    numeroBoletaLocal,
  ]);

  // =======================================================
  // RECUPERAR BOLETA DESDE FIREBASE
  // =======================================================
  //
  // Busca una boleta por su número.
  //
  // NO genera un número nuevo.
  //
  // =======================================================

  const recuperarBoleta =
    useCallback(
      async (numero) => {
        try {
          const numeroBuscado =
            Number(numero);

          if (
            !Number.isFinite(
              numeroBuscado
            ) ||
            numeroBuscado <= 0
          ) {
            throw new Error(
              "Número de boleta inválido."
            );
          }

          const boleta =
            await buscarBoletaPorNumero(
              numeroBuscado
            );

          if (!boleta) {
            return {
              ok: false,

              mensaje:
                `No se encontró la boleta N° ${numeroBuscado}.`,
            };
          }

          const productos =
            Array.isArray(
              boleta.productos
            )
              ? boleta.productos
              : Array.isArray(
                  boleta.carrito
                )
              ? boleta.carrito
              : [];

          setCarrito(productos);

          setNumeroBoletaLocal(
            Number(
              boleta.numeroBoleta ||
                numeroBuscado
            )
          );

          setBoletaRecuperada(true);

          setModoLocalActivo(true);

          setAbierto(true);

          return {
            ok: true,
            boleta,
          };
        } catch (error) {
          console.error(
            "❌ Error recuperando boleta:",
            error
          );

          return {
            ok: false,

            mensaje:
              "Ocurrió un error al recuperar la boleta.",

            error,
          };
        }
      },
      []
    );

  // =======================================================
  // CERRAR BOLETA EN FIREBASE
  // =======================================================
  //
  // Se usa solamente cuando la venta terminó.
  //
  // La boleta NO se elimina.
  // Queda guardada como Cerrada.
  //
  // =======================================================

  const finalizarBoleta =
    useCallback(
      async (
        numeroForzado = numeroBoletaLocal
      ) => {
        const numeroParaCerrar =
          numeroForzado ??
          numeroBoletaLocal;

        if (
          numeroParaCerrar === null ||
          numeroParaCerrar === undefined
        ) {
          throw new Error(
            "No hay una boleta activa."
          );
        }

        await cerrarBoleta(
          numeroParaCerrar
        );

        setCarrito([]);

        setNumeroBoletaLocal(null);

        setBoletaRecuperada(false);

        localStorage.removeItem(
          BORRADOR_LOCAL_KEY
        );

        setAbierto(false);

        return true;
      },
      [numeroBoletaLocal]
    );

  // =======================================================
  // GUARDAR NÚMERO DE BOLETA
  // =======================================================

  const guardarNumeroBoleta =
    useCallback(
      (numero) => {
        setNumeroBoletaLocal(numero);

        setBoletaRecuperada(false);
      },
      []
    );

  // =======================================================
  // LIMPIAR VENTA LOCAL
  // =======================================================
  //
  // Usar solamente cuando la venta terminó
  // definitivamente.
  //
  // IMPRIMIR no limpia el borrador.
  // Reimprimir no limpia el borrador.
  //
  // =======================================================

  const limpiarVentaLocal =
    useCallback(() => {
      setCarrito([]);

      setNumeroBoletaLocal(null);

      setBoletaRecuperada(false);

      localStorage.removeItem(
        BORRADOR_LOCAL_KEY
      );

      setAbierto(false);
    }, []);

  // =======================================================
  // AGREGAR PRODUCTO
  // =======================================================

  const agregarAlCarrito =
    useCallback(
      (producto, cantidad = 1) => {
        setCarrito((prev) => {
          const existe = prev.find(
            (item) =>
              item.id === producto.id
          );

          if (existe) {
            return prev.map((item) => {
              if (
                item.id !== producto.id
              ) {
                return item;
              }

              const nuevaCantidad =
                Number(item.cantidad) +
                Number(cantidad);

              const esCelular =
                item.categoria ===
                "Celulares";

              let imeis = [
                ...(item.imeis || []),
              ];

              if (esCelular) {
                while (
                  imeis.length <
                  nuevaCantidad
                ) {
                  imeis.push("");
                }

                if (
                  imeis.length >
                  nuevaCantidad
                ) {
                  imeis =
                    imeis.slice(
                      0,
                      nuevaCantidad
                    );
                }
              }

              return {
                ...item,

                cantidad:
                  nuevaCantidad,

                imeis,
              };
            });
          }

          const esCelular =
            producto.categoria ===
            "Celulares";

          return [
            ...prev,

            {
              ...producto,

              cantidad:
                Number(cantidad),

              imeis: esCelular
                ? Array(
                    Number(cantidad)
                  ).fill("")
                : [],
            },
          ];
        });

        setAbierto(true);
      },
      []
    );

  // =======================================================
  // AUMENTAR CANTIDAD
  // =======================================================

  const aumentarCantidad =
    useCallback(
      (id) => {
        setCarrito((prev) =>
          prev.map((item) => {
            if (item.id !== id) {
              return item;
            }

            const nuevaCantidad =
              Number(item.cantidad) +
              1;

            const esCelular =
              item.categoria ===
              "Celulares";

            let imeis = [
              ...(item.imeis || []),
            ];

            if (esCelular) {
              imeis.push("");
            }

            return {
              ...item,

              cantidad:
                nuevaCantidad,

              imeis,
            };
          })
        );
      },
      []
    );

  // =======================================================
  // DISMINUIR CANTIDAD
  // =======================================================

  const disminuirCantidad =
    useCallback(
      (id) => {
        setCarrito((prev) =>
          prev
            .map((item) => {
              if (
                item.id !== id
              ) {
                return item;
              }

              const nuevaCantidad =
                Number(item.cantidad) -
                1;

              const esCelular =
                item.categoria ===
                "Celulares";

              let imeis = [
                ...(item.imeis || []),
              ];

              if (esCelular) {
                imeis =
                  imeis.slice(
                    0,
                    nuevaCantidad
                  );
              }

              return {
                ...item,

                cantidad:
                  nuevaCantidad,

                imeis,
              };
            })
            .filter(
              (item) =>
                Number(
                  item.cantidad
                ) > 0
            )
        );
      },
      []
    );

  // =======================================================
  // ELIMINAR PRODUCTO
  // =======================================================

  const eliminarProducto =
    useCallback(
      (id) => {
        setCarrito((prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
        );
      },
      []
    );

  // =======================================================
  // ACTUALIZAR IMEI
  // =======================================================

  const actualizarIMEI =
    useCallback(
      (id, indice, valor) => {
        setCarrito((prev) =>
          prev.map((item) => {
            if (
              item.id !== id
            ) {
              return item;
            }

            const imeis = [
              ...(item.imeis || []),
            ];

            imeis[indice] =
              valor;

            return {
              ...item,
              imeis,
            };
          })
        );
      },
      []
    );

  // =======================================================
  // OBTENER PRECIO
  // =======================================================

  const obtenerPrecio = useCallback((item) => {
    if (!item) {
      return 0;
    }

    let precioBase = Number(item.precio) || 0;

    if (
      Number(item.cantidad) >= 12 &&
      Number(item.precio12) > 0
    ) {
      precioBase = Number(item.precio12);
    } else if (
      Number(item.cantidad) >= 9 &&
      Number(item.precio9) > 0
    ) {
      precioBase = Number(item.precio9);
    } else if (
      Number(item.cantidad) >= 6 &&
      Number(item.precio6) > 0
    ) {
      precioBase = Number(item.precio6);
    } else if (
      Number(item.cantidad) >= 3 &&
      Number(item.precio3) > 0
    ) {
      precioBase = Number(item.precio3);
    } else if (
      Number(item.cantidad) >= 2 &&
      Number(item.precio2) > 0
    ) {
      precioBase = Number(item.precio2);
    }

    if (!item.esRevendedor) {
      return precioBase;
    }

    const porcentaje =
      Number(item.revendedorPorcentaje) || 0;

    return precioBase * (1 + porcentaje / 100);
  }, []);

  // =======================================================
  // GUARDAR BOLETA AHORA - CONFIRMACIÓN REAL
  // =======================================================
  //
  // Se usa antes de enviar la venta al Mostrador.
  //
  // IMPORTANTE:
  //
  // Esta función espera a que Firebase confirme
  // el guardado.
  //
  // Si falla, lanza el error y NO se continúa
  // con el envío ni con el cierre de la boleta.
  //
  // =======================================================

  const guardarBoletaAhora =
    useCallback(
      async (
        numeroForzado =
          numeroBoletaLocal
      ) => {
        const numeroParaGuardar =
          numeroForzado ??
          numeroBoletaLocal;

        if (
          numeroParaGuardar === null ||
          numeroParaGuardar ===
            undefined
        ) {
          throw new Error(
            "No hay una boleta activa para guardar."
          );
        }

        if (carrito.length === 0) {
          throw new Error(
            "No hay productos en la boleta."
          );
        }

        setGuardandoBoleta(true);

        try {
          const totalActual =
            carrito.reduce(
              (acum, item) =>
                acum +
                obtenerPrecio(item) *
                  Number(
                    item.cantidad
                  ),
              0
            );

          // ===================================================
          // LIMPIAMOS UNDEFINED ANTES DE MANDAR A FIREBASE
          // ===================================================

          const carritoLimpio =
            limpiarUndefined(
              carrito
            );

          const data =
            limpiarUndefined({
              numeroBoleta:
                Number(
                  numeroParaGuardar
                ),

              carrito:
                carritoLimpio,

              productos:
                carritoLimpio,

              total:
                totalActual,

              estado:
                "Abierta",

              origen:
                "Modo Local",
            });

          if (boletaRecuperada) {
            await actualizarBoleta(
              numeroParaGuardar,
              data
            );
          } else {
            await guardarBoleta(
              data
            );
          }

          return true;
        } finally {
          setGuardandoBoleta(false);
        }
      },
      [
        numeroBoletaLocal,
        carrito,
        obtenerPrecio,
        boletaRecuperada,
      ]
    );

  // =======================================================
  // GUARDADO DE LA BOLETA EN FIREBASE
  // =======================================================
  //
  // Cuando existe un número de boleta y hay productos,
  // la venta se guarda también en Firebase.
  //
  // Esto permite recuperar la misma boleta desde:
  // - Notebook
  // - Tablet
  // - Otra Notebook
  //
  // IMPORTANTE:
  //
  // Guardar/actualizar NO genera un número nuevo.
  //
  // =======================================================

  useEffect(() => {
    if (!modoLocalActivo) {
      return;
    }

    if (
      numeroBoletaLocal === null ||
      numeroBoletaLocal ===
        undefined
    ) {
      return;
    }

    if (carrito.length === 0) {
      return;
    }

    let cancelado = false;

    async function guardarVentaEnFirebase() {
      try {
        setGuardandoBoleta(true);

        const totalActual =
          carrito.reduce(
            (acum, item) =>
              acum +
              obtenerPrecio(item) *
                Number(
                  item.cantidad
                ),
            0
          );

        // ===================================================
        // LIMPIAMOS UNDEFINED ANTES DE FIREBASE
        // ===================================================

        const carritoLimpio =
          limpiarUndefined(
            carrito
          );

        const data =
          limpiarUndefined({
            numeroBoleta:
              Number(
                numeroBoletaLocal
              ),

            carrito:
              carritoLimpio,

            productos:
              carritoLimpio,

            total:
              totalActual,

            estado:
              "Abierta",

            origen:
              "Modo Local",
          });

        if (boletaRecuperada) {
          await actualizarBoleta(
            numeroBoletaLocal,
            data
          );
        } else {
          await guardarBoleta(
            data
          );
        }
      } catch (error) {
        console.error(
          "❌ Error guardando boleta en Firebase:",
          error
        );
      } finally {
        if (!cancelado) {
          setGuardandoBoleta(
            false
          );
        }
      }
    }

    const temporizador =
      setTimeout(
        guardarVentaEnFirebase,
        350
      );

    return () => {
      cancelado = true;

      clearTimeout(
        temporizador
      );
    };
  }, [
    modoLocalActivo,
    carrito,
    numeroBoletaLocal,
    boletaRecuperada,
    obtenerPrecio,
  ]);

  // =======================================================
  // TOTAL
  // =======================================================

  const total = useMemo(() => {
    return carrito.reduce(
      (acum, item) =>
        acum +
        obtenerPrecio(item) *
          Number(
            item.cantidad
          ),
      0
    );
  }, [
    carrito,
    obtenerPrecio,
  ]);

  // =======================================================
  // CONTEXT
  // =======================================================

  return (
    <CartContext.Provider
      value={{
        carrito,

        agregarAlCarrito,

        aumentarCantidad,

        disminuirCantidad,

        eliminarProducto,

        actualizarIMEI,

        obtenerPrecio,

        total,

        abierto,

        setAbierto,

        modoLocalActivo,

        activarModoLocal,

        desactivarModoLocal,

        numeroBoletaLocal,

        boletaRecuperada,

        guardandoBoleta,

        guardarNumeroBoleta,

        guardarBoletaAhora,

        recuperarBoleta,

        finalizarBoleta,

        limpiarVentaLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useCart() {
  return useContext(
    CartContext
  );
}