import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const vendedores = {
  lautaro: {
    codigo: "lautaro",
    nombre: "Lautaro",
    numero: "5491131631518",
  },
  milagros: {
    codigo: "milagros",
    nombre: "Milagros",
    numero: "5491144207460",
  },
  gonzalo: {
    codigo: "gonzalo",
    nombre: "Gonzalo",
    numero: "5491136469206",
  },
  camila: {
    codigo: "camila",
    nombre: "Camila",
    numero: "5491139324748",
  },
  victoria: {
    codigo: "victoria",
    nombre: "Victoria",
    numero: "5491136552538",
  },
};

const VendedorContext = createContext();

export function VendedorProvider({ children }) {

  const params = new URLSearchParams(window.location.search);

  const codigoInicial = (
    params.get("v") || "lautaro"
  ).toLowerCase();

  const [vendedor, setVendedor] = useState(
    vendedores[codigoInicial] || vendedores.lautaro
  );

  const value = useMemo(
    () => ({
      vendedor,
      setVendedor,
      vendedores,
    }),
    [vendedor]
  );

  return (
    <VendedorContext.Provider value={value}>
      {children}
    </VendedorContext.Provider>
  );
}

export function useVendedor() {
  return useContext(VendedorContext);
}