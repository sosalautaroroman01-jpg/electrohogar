import { useState } from "react";

import GoogleAddressInput from "../components/GoogleAddressInput";
import ResultadoEnvio from "../components/ResultadoEnvio";

export default function CalculadoraEnvios() {
  const [direccion, setDireccion] = useState(null);

  function handlePlaceSelect(place) {
    setDireccion(place);
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0,0,0,.08)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        🧮 Calculadora de Envíos
      </h1>

      <GoogleAddressInput
        value=""
        onPlaceSelect={handlePlaceSelect}
      />

      <div style={{ height: 30 }} />

      <ResultadoEnvio
        direccion={direccion}
      />
    </div>
  );
}