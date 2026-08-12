import { useEffect, useRef, useState } from "react";
import "./Mostrador.css";

import { imprimirRemito } from "../utils/imprimirRemito";

import {
  escucharPedidos,
  marcarComoImpreso,
} from "../services/pedidosService";

function Mostrador() {
  const [pedidos, setPedidos] = useState([]);

  // Guarda los pedidos que ya conocemos
  const pedidosAnteriores = useRef(new Set());

  // Evita que suene al cargar la página
  const primeraCarga = useRef(true);

  // Referencia al sistema de audio
  const audioContextRef = useRef(null);

  // =========================================================
  // ACTIVAR AUDIO
  // =========================================================

  function activarAudio() {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        console.warn("El navegador no soporta Web Audio API.");
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    } catch (error) {
      console.error("Error activando audio:", error);
    }
  }

  // =========================================================
  // SONIDO DE NUEVO PEDIDO
  // =========================================================

function reproducirSonidoPedido() {
  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const ahora = ctx.currentTime;

    // =====================================================
    // NOTA 1 - DIN
    // =====================================================

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(784, ahora);

    gain1.gain.setValueAtTime(0.0001, ahora);
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

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(988, ahora + 0.22);

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

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();

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
    console.error("Error reproduciendo sonido:", error);
  }
}

  // =========================================================
  // ESCUCHAR PEDIDOS
  // =========================================================

  useEffect(() => {
    const unsubscribe = escucharPedidos((lista) => {

      // Primera carga:
      // guardamos los pedidos existentes
      // pero NO hacemos sonar nada.
      if (primeraCarga.current) {
        lista.forEach((pedido) => {
          pedidosAnteriores.current.add(pedido.id);
        });

        primeraCarga.current = false;

        setPedidos(lista);

        return;
      }

      // Buscar pedidos nuevos
      const pedidosNuevos = lista.filter(
        (pedido) =>
          !pedidosAnteriores.current.has(pedido.id)
      );

      // Guardar pedidos actuales
      lista.forEach((pedido) => {
        pedidosAnteriores.current.add(pedido.id);
      });

      // Si llegó un pedido nuevo, reproducir sonido
      if (pedidosNuevos.length > 0) {
        reproducirSonidoPedido();
      }

      setPedidos(lista);
    });

    return () => unsubscribe();
  }, []);

  // =========================================================
  // IMPRIMIR PEDIDO
  // =========================================================

  async function imprimirPedido(pedido) {
    try {
      imprimirRemito({
        vendedor: {
          nombre: pedido.vendedor,
          fecha: pedido.fecha,
          hora: pedido.hora,
        },

        carrito: pedido.productos,

        total: pedido.total,

        obtenerPrecio: (producto) => producto.precio,
      });

      await marcarComoImpreso(pedido.id);

    } catch (error) {
      console.error(error);

      alert("❌ Error al imprimir el pedido.");
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
      <h1>🖨️ Mostrador</h1>

      {pedidos.length === 0 ? (

        <p>Esperando pedidos...</p>

      ) : (

        <div className="pedidos-container">

          {pedidos.map((pedido) => (

            <div
              key={pedido.id}
              className="pedido-card"
            >

              <h2>
                👤 {pedido.vendedor}
              </h2>

              <p>
                <strong>Total:</strong>{" "}
                ${pedido.total.toLocaleString("es-AR")}
              </p>

              <p>
                <strong>Productos:</strong>{" "}
                {pedido.productos.length}
              </p>

              <hr />

              {pedido.productos.map(
                (producto, index) => (

                  <div
                    key={index}
                    className="producto"
                  >

                    <strong>
                      {producto.cantidad}x
                    </strong>{" "}

                    {producto.nombre}

                    <br />

                    $
                    {producto.subtotal.toLocaleString(
                      "es-AR"
                    )}

                  </div>

                )
              )}

              <button
                onClick={() =>
                  imprimirPedido(pedido)
                }
              >
                🖨️ Imprimir
              </button>

            </div>

          ))}

        </div>

      )}
    </div>
  );
}

export default Mostrador;