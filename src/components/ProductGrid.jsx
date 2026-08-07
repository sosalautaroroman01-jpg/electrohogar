import "./ProductGrid.css";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";
import { useFilter } from "../context/FilterContext";
import ProductCard from "./ProductCard";

function ProductGrid() {
  const [productos, setProductos] = useState([]);

  const {
    busqueda,
    categoria,
    marca,
    subcategoria,
    medida,
  } = useFilter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "productos"),
      (snapshot) => {
        setProductos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    return unsubscribe;
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return productos.filter((producto) => {
      if (producto.visible === false) return false;

      if (
        !producto.nombre
          ?.toLowerCase()
          .includes(texto)
      ) {
        return false;
      }

      if (
        categoria !== "Todas" &&
        producto.categoria !== categoria
      ) {
        return false;
      }

      if (
        categoria === "Celulares" &&
        marca &&
        marca !== "Todas" &&
        producto.marca !== marca
      ) {
        return false;
      }

      if (
        categoria === "Blanquería" &&
        subcategoria &&
        subcategoria !== "Todas" &&
        producto.subcategoria !== subcategoria
      ) {
        return false;
      }

      const usaMedida =
        categoria === "Blanquería" &&
        ["Sábanas", "Frazadas", "Acolchados"].includes(
          subcategoria
        );

      if (
        usaMedida &&
        medida &&
        medida !== "Todas" &&
        producto.medida !== medida
      ) {
        return false;
      }

      return true;
    });
  }, [
    productos,
    busqueda,
    categoria,
    marca,
    subcategoria,
    medida,
  ]);

  return (
    <div className="productos">
      {productosFiltrados.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
        />
      ))}
    </div>
  );
}

export default ProductGrid;