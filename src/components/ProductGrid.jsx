import "./ProductGrid.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "./ProductCard";
import { useFilter } from "../context/FilterContext";

function ProductGrid() {
  const [productos, setProductos] = useState([]);

  const { busqueda, categoria } = useFilter();

  useEffect(() => {
    async function cargarProductos() {
      const querySnapshot = await getDocs(collection(db, "productos"));

      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(lista);
    }

    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
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