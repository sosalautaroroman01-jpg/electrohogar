import { useEffect, useState } from "react";
import { calcularRuta } from "../services/mapsService";

const TARIFAS = {
  moto: 900,
  camioneta: 1500,
};

const MINIMOS = {
  moto: 9000,
  camioneta: 15000,
};

export default function ResultadoEnvio({
  direccion,
}) {
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function calcular() {
      if (!direccion?.geometry) {
        setResultado(null);
        return;
      }

      try {
        setCargando(true);
        setError("");

        const datos = await calcularRuta(
          direccion.geometry.location
        );

        setResultado(datos);
      } catch (err) {
        console.error(err);
        setError("No se pudo calcular el recorrido.");
      } finally {
        setCargando(false);
      }
    }

    calcular();
  }, [direccion]);

  if (!direccion)
    return (
      <p
        style={{
          marginTop: 25,
          color: "#666",
        }}
      >
        Elegí una dirección para calcular el envío.
      </p>
    );

  if (cargando)
    return (
      <h3
        style={{
          marginTop: 25,
        }}
      >
        Calculando recorrido...
      </h3>
    );

  if (error)
    return (
      <p
        style={{
          color: "red",
          marginTop: 25,
        }}
      >
        {error}
      </p>
    );

  if (!resultado) return null;

  const costoMoto = Math.max(
    Math.round(resultado.distanciaKm * TARIFAS.moto),
    MINIMOS.moto
  );

  const costoCamioneta = Math.max(
    Math.round(resultado.distanciaKm * TARIFAS.camioneta),
    MINIMOS.camioneta
  );

  return (
    <div
      style={{
        marginTop: 30,
        padding: 25,
        borderRadius: 18,
        background: "#f8fafc",
        border: "1px solid #ddd",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
        }}
      >
        🚚 Resultado
      </h2>

      <p>
        <strong>📍 Dirección:</strong>
      </p>

      <p
        style={{
          marginTop: -5,
          color: "#444",
          marginBottom: 18,
        }}
      >
        {direccion.formatted_address}
      </p>

      <p>
        <strong>📏 Distancia:</strong>{" "}
        {resultado.distanciaTexto}
      </p>

      <p
        style={{
          marginBottom: 25,
        }}
      >
        <strong>⏱ Tiempo:</strong>{" "}
        {resultado.duracion}
      </p>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 15,
          padding: 18,
          marginBottom: 15,
        }}
      >
        <h3
          style={{
            margin: 0,
          }}
        >
          🛵 Moto
        </h3>

        <h1
          style={{
            color: "#16a34a",
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          ${costoMoto.toLocaleString("es-AR")}
        </h1>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 15,
          padding: 18,
        }}
      >
        <h3
          style={{
            margin: 0,
          }}
        >
          🚐 Camioneta
        </h3>

        <h1
          style={{
            color: "#2563eb",
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          ${costoCamioneta.toLocaleString("es-AR")}
        </h1>
      </div>

      <p
        style={{
          color: "#666",
          fontSize: 14,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        ⭐ El envío mínimo es de <strong>$9.000</strong> en moto y{" "}
        <strong>$15.000</strong> en camioneta.
      </p>
    </div>
  );
}