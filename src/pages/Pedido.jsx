import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

function Pedido() {

  const { id } = useParams();

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function cargarPedido() {

      try {

        if (!id) {
          setError("Orden no encontrada.");
          setCargando(false);
          return;
        }

        const pedidoRef = doc(
          db,
          "pedidosPendientes",
          id
        );

        const snapshot = await getDoc(pedidoRef);

        if (!snapshot.exists()) {

          setError("Esta orden no existe.");

          setCargando(false);

          return;
        }

        const datos = {
          id: snapshot.id,
          ...snapshot.data(),
        };

        setPedido(datos);

        // =========================================
        // ENVIAR AUTOMÁTICAMENTE AL MOSTRADOR
        // =========================================

        if (datos.estado === "Creada") {

          await updateDoc(pedidoRef, {
            estado: "Pendiente",
          });

          setPedido((actual) => ({
            ...actual,
            estado: "Pendiente",
          }));

        }

      } catch (error) {

        console.error(
          "Error cargando la orden:",
          error
        );

        setError(
          "No se pudo cargar la orden."
        );

      } finally {

        setCargando(false);

      }

    }

    cargarPedido();

  }, [id]);

  // =========================================
  // CARGANDO
  // =========================================

  if (cargando) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          background: "#f4f4f4",
        }}
      >

        <h2>
          📋 Cargando orden...
        </h2>

      </div>

    );

  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          background: "#f4f4f4",
          padding: "20px",
          textAlign: "center",
        }}
      >

        <div>

          <h1>
            ❌
          </h1>

          <h2>
            {error}
          </h2>

        </div>

      </div>

    );

  }

  // =========================================
  // ORDEN
  // =========================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        padding: "30px 15px",
        boxSizing: "border-box",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "25px",
          boxSizing: "border-box",
          boxShadow:
            "0 5px 20px rgba(0,0,0,.12)",
        }}
      >

        {/* =================================
            ENCABEZADO
        ================================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >

          <h1
            style={{
              margin: 0,
              fontSize: "26px",
            }}
          >
            📋 ORDEN DE PEDIDO
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666",
            }}
          >
            Orden #{pedido.id}
          </p>

        </div>

        {/* =================================
            VENDEDOR
        ================================= */}

        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >

          <strong>
            VENDEDOR
          </strong>

          <div
            style={{
              marginTop: "5px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {pedido.vendedor}
          </div>

        </div>

        {/* =================================
            PRODUCTOS
        ================================= */}

        <h3>
          Productos
        </h3>

        <div>

          {pedido.productos?.map(
            (producto, index) => (

              <div
                key={index}
                style={{
                  borderBottom:
                    "1px solid #ddd",
                  padding:
                    "12px 0",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "15px",
                  }}
                >

                  <div>

                    <strong>
                      {producto.cantidad}x
                    </strong>{" "}

                    {producto.nombre}

                  </div>

                  <strong>
                    $
                    {producto.subtotal?.toLocaleString(
                      "es-AR"
                    )}
                  </strong>

                </div>

                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "13px",
                    color: "#777",
                  }}
                >
                  Precio unitario: $
                  {producto.precio?.toLocaleString(
                    "es-AR"
                  )}
                </div>

              </div>

            )
          )}

        </div>

        {/* =================================
            TOTAL
        ================================= */}

        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            border:
              "2px solid #111",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            TOTAL
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            $
            {pedido.total?.toLocaleString(
              "es-AR"
            )}
          </div>

        </div>

        {/* =================================
            ESTADO
        ================================= */}

        <div
          style={{
            marginTop: "20px",
            background: "#e8f7df",
            color: "#3d7d1d",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >

          ✅ Pedido enviado al mostrador

        </div>

      </div>

    </div>

  );

}

export default Pedido;