import { useEffect, useRef, useState } from "react";
import "./Mostrador.css";

import { imprimirRemito } from "../utils/imprimirRemito";

import {
  escucharPedidos,
  marcarComoImpreso,
} from "../services/pedidosService";

function Mostrador() {
  const [pedidos, setPedidos] = useState([]);

  // =========================================================
  // REFERENCIAS
  // =========================================================

  const pedidosAnteriores = useRef(new Set());

  const primeraCarga = useRef(true);

  const audioContextRef = useRef(null);

  // =========================================================
  // ACTIVAR AUDIO
  // =========================================================

  function activarAudio() {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        console.warn(
          "El navegador no soporta Web Audio API."
        );

        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext();
      }

      if (
        audioContextRef.current.state ===
        "suspended"
      ) {
        audioContextRef.current.resume();
      }
    } catch (error) {
      console.error(
        "Error activando audio:",
        error
      );
    }
  }

  // =========================================================
  // SONIDO DE NUEVO PEDIDO
  // =========================================================

  function reproducirSonidoPedido() {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext();
      }

      const ctx =
        audioContextRef.current;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const ahora = ctx.currentTime;

      // =====================================================
      // NOTA 1 - DIN
      // =====================================================

      const osc1 =
        ctx.createOscillator();

      const gain1 =
        ctx.createGain();

      osc1.type = "sine";

      osc1.frequency.setValueAtTime(
        784,
        ahora
      );

      gain1.gain.setValueAtTime(
        0.0001,
        ahora
      );

      gain1.gain.exponentialRampToValueAtTime(
        0.45,
        ahora + 0.03
      );

      gain1.gain.exponentialRampToValueAtTime(
        0.0001,
        ahora + 0.35
      );

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(ahora);
      osc1.stop(ahora + 0.35);

      // =====================================================
      // NOTA 2 - DIN
      // =====================================================

      const osc2 =
        ctx.createOscillator();

      const gain2 =
        ctx.createGain();

      osc2.type = "sine";

      osc2.frequency.setValueAtTime(
        988,
        ahora + 0.22
      );

      gain2.gain.setValueAtTime(
        0.0001,
        ahora + 0.22
      );

      gain2.gain.exponentialRampToValueAtTime(
        0.5,
        ahora + 0.25
      );

      gain2.gain.exponentialRampToValueAtTime(
        0.0001,
        ahora + 0.55
      );

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(ahora + 0.22);
      osc2.stop(ahora + 0.55);

      // =====================================================
      // NOTA 3 - DIIIN
      // =====================================================

      const osc3 =
        ctx.createOscillator();

      const gain3 =
        ctx.createGain();

      osc3.type = "sine";

      osc3.frequency.setValueAtTime(
        1318.51,
        ahora + 0.42
      );

      gain3.gain.setValueAtTime(
        0.0001,
        ahora + 0.42
      );

      gain3.gain.exponentialRampToValueAtTime(
        0.55,
        ahora + 0.46
      );

      gain3.gain.exponentialRampToValueAtTime(
        0.0001,
        ahora + 0.95
      );

      osc3.connect(gain3);
      gain3.connect(ctx.destination);

      osc3.start(ahora + 0.42);
      osc3.stop(ahora + 0.95);
    } catch (error) {
      console.error(
        "Error reproduciendo sonido:",
        error
      );
    }
  }

  // =========================================================
  // ESCUCHAR PEDIDOS EN TIEMPO REAL
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      escucharPedidos((lista) => {
        // ---------------------------------------------------
        // PRIMERA CARGA
        // ---------------------------------------------------

        if (primeraCarga.current) {
          lista.forEach((pedido) => {
            pedidosAnteriores.current.add(
              pedido.id
            );
          });

          primeraCarga.current = false;

          setPedidos(lista);

          return;
        }

        // ---------------------------------------------------
        // DETECTAR PEDIDOS NUEVOS
        // ---------------------------------------------------

        const pedidosNuevos =
          lista.filter(
            (pedido) =>
              !pedidosAnteriores.current.has(
                pedido.id
              )
          );

        // ---------------------------------------------------
        // GUARDAR PEDIDOS ACTUALES
        // ---------------------------------------------------

        lista.forEach((pedido) => {
          pedidosAnteriores.current.add(
            pedido.id
          );
        });

        // ---------------------------------------------------
        // SONIDO
        // ---------------------------------------------------

        if (pedidosNuevos.length > 0) {
          reproducirSonidoPedido();
        }

        setPedidos(lista);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // IMPRIMIR PEDIDO
  // =========================================================

  async function imprimirPedido(pedido) {
    try {
      imprimirRemito({
        vendedor: {
          nombre:
            pedido.vendedor || "Sin vendedor",

          fecha:
            pedido.fecha || "",

          hora:
            pedido.hora || "",
        },

        carrito:
          Array.isArray(pedido.productos)
            ? pedido.productos
            : [],

        total:
          Number(pedido.total) || 0,

        obtenerPrecio: (producto) =>
          Number(producto.precio) || 0,

        // Mantener el mismo número de boleta
        // que viene desde Modo Local.
        numeroBoleta:
          pedido.numeroBoleta ||
          pedido.numero ||
          "",
      });

      await marcarComoImpreso(
        pedido.id
      );
    } catch (error) {
      console.error(
        "Error al imprimir pedido:",
        error
      );

      alert(
        "❌ Error al imprimir el pedido."
      );
    }
  }

  // =========================================================
  // PANTALLA
  // =========================================================

  return (
    <div
      className="mostrador"
      onClick={activarAudio}
    >
      {/* =====================================================
          TITULO
      ====================================================== */}

      <div className="mostrador-header">
        <div className="mostrador-titulo">
          <div className="mostrador-icono">
            🖨️
          </div>

          <div>
            <h1>Mostrador</h1>

            <span>
              Pedidos listos para imprimir
            </span>
          </div>
        </div>

        <div className="mostrador-indicador">
          <span className="indicador-punto"></span>

          En línea
        </div>
      </div>

      {/* =====================================================
          SIN PEDIDOS
      ====================================================== */}

      {pedidos.length === 0 ? (
        <div className="sin-pedidos">
          <div className="sin-pedidos-icono">
            🛒
          </div>

          <h2>
            Esperando pedidos...
          </h2>

          <p>
            Cuando llegue un nuevo pedido
            aparecerá automáticamente acá.
          </p>
        </div>
      ) : (
        /* ===================================================
           PEDIDOS
        ==================================================== */

        <div className="pedidos-container">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="pedido-card"
            >
              {/* =============================================
                  CABECERA DEL PEDIDO
              ============================================== */}

              <div className="pedido-top">
                <div className="pedido-vendedor">
                  <div className="vendedor-icono">
                    👤
                  </div>

                  <div>
                    <span className="dato-label">
                      VENDEDOR
                    </span>

                    <h2>
                      {pedido.vendedor ||
                        "Sin vendedor"}
                    </h2>
                  </div>
                </div>

                <div className="pedido-estado">
                  <span className="estado-punto"></span>
                  PENDIENTE
                </div>
              </div>

              {/* =============================================
                  INFORMACION
              ============================================== */}

              <div className="pedido-info">
                <div className="pedido-meta">
                  <span>
                    <strong>
                      PRODUCTOS
                    </strong>

                    {Array.isArray(
                      pedido.productos
                    )
                      ? pedido.productos.length
                      : 0}
                  </span>

                  {pedido.hora && (
                    <span>
                      <strong>
                        HORA
                      </strong>

                      {pedido.hora}
                    </span>
                  )}
                </div>
              </div>

              {/* =============================================
                  TOTAL
              ============================================== */}

              <div className="total-box">
                <div>
                  <span className="total-label">
                    TOTAL DEL PEDIDO
                  </span>

                  <span className="total-subtitulo">
                    Importe final
                  </span>
                </div>

                <strong>
                  $
                  {(
                    Number(pedido.total) || 0
                  ).toLocaleString("es-AR")}
                </strong>
              </div>

              {/* =============================================
                  PRODUCTOS
              ============================================== */}

              <div className="productos-titulo">
                <span>
                  DETALLE DEL PEDIDO
                </span>
              </div>

              <div className="productos-lista">
                {Array.isArray(
                  pedido.productos
                ) &&
                  pedido.productos.map(
                    (producto, index) => {
                      const imeis =
                        Array.isArray(
                          producto.imeis
                        )
                          ? producto.imeis.filter(
                              (imei) =>
                                typeof imei ===
                                  "string" &&
                                imei.trim() !== ""
                            )
                          : [];

                      return (
                        <div
                          key={
                            producto.id ||
                            index
                          }
                          className="producto"
                        >
                          {/* ---------------------------------
                              PRODUCTO PRINCIPAL
                          ---------------------------------- */}

                          <div className="producto-principal">
                            <div className="producto-cantidad">
                              {producto.cantidad}x
                            </div>

                            <div className="producto-datos">
                              <div className="producto-nombre">
                                {producto.nombre}
                              </div>

                              <div className="producto-precio">
                                $
                                {(
                                  Number(
                                    producto.subtotal
                                  ) || 0
                                ).toLocaleString(
                                  "es-AR"
                                )}
                              </div>
                            </div>
                          </div>

                          {/* ---------------------------------
                              IMEI
                          ---------------------------------- */}

                          {imeis.length > 0 && (
                            <div className="imei-box">
                              <div className="imei-titulo">
                                📱 IMEI
                              </div>

                              {imeis.map(
                                (
                                  imei,
                                  imeiIndex
                                ) => (
                                  <div
                                    key={`${producto.id || index}-imei-${imeiIndex}`}
                                    className="imei-linea"
                                  >
                                    <span>
                                      IMEI{" "}
                                      {imeiIndex +
                                        1}
                                    </span>

                                    <strong>
                                      {imei}
                                    </strong>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
              </div>

              {/* =============================================
                  BOTON IMPRIMIR
              ============================================== */}

              <button
                className="btn-imprimir"
                onClick={() =>
                  imprimirPedido(
                    pedido
                  )
                }
              >
                <span className="btn-imprimir-icono">
                  🖨️
                </span>

                <span>
                  Imprimir remito
                </span>

                <span className="btn-flecha">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Mostrador;