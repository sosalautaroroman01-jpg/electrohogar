import { createContext, useContext, useEffect, useState } from "react";

const DollarContext = createContext();

const AJUSTE = 5; // Electro Hogar: Compra -$5 | Venta +$5

export function DollarProvider({ children }) {
  const [blue, setBlue] = useState(null);

  async function obtenerDolar() {
    try {
      const res = await fetch("https://dolarapi.com/v1/dolares/blue", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("No se pudo obtener la cotización.");
      }

      const data = await res.json();

      setBlue({
        ...data,
        compra: Number(data.compra) - AJUSTE,
        venta: Number(data.venta) + AJUSTE,
      });

    } catch (error) {
      console.error("Error obteniendo dólar:", error);
    }
  }

  useEffect(() => {
    obtenerDolar();

    const intervalo = setInterval(obtenerDolar, 30000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <DollarContext.Provider value={blue}>
      {children}
    </DollarContext.Provider>
  );
}

export function useDollar() {
  return useContext(DollarContext);
}