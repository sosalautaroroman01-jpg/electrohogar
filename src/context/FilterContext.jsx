import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [marca, setMarca] = useState("Todas");
  const [subcategoria, setSubcategoria] = useState("Todas");
  const [medida, setMedida] = useState("Todas");

  const value = {
    busqueda,
    setBusqueda,

    categoria,
    setCategoria,

    marca,
    setMarca,

    subcategoria,
    setSubcategoria,

    medida,
    setMedida,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}