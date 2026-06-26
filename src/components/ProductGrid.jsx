import "./ProductGrid.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "./ProductCard";
import { useFilter } from "../context/FilterContext";

function ProductGrid() {
  const [productos, setProductos] = useState([]);

  const { busqueda, categoria } = useFilter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "productos"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    // 👁 Solo mostrar productos visibles
    if (producto.visible === false) return false;

    const coincideBusqueda = producto.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === "Todas" ||
      producto.categoria === categoria;

    return coincideBusqueda && coincideCategoria;
  });

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