import "./ProductGrid.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "./ProductCard";

function ProductGrid() {
  const [productos, setProductos] = useState([]);

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

  return (
    <div className="productos">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductGrid;