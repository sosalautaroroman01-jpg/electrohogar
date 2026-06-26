import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import ProductTable from "../components/ProductTable";

import {
  escucharProductos,
  eliminarProducto,
  cambiarVisibilidad,
} from "../../services/productosService";

export default function Productos() {
  const [productos, setProductos] =useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = escucharProductos(setProductos);
    return () => unsubscribe();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar producto?")) return;

    await eliminarProducto(id);
  }

  async function handleToggleVisible(producto) {
    try {
      await cambiarVisibilidad(
        producto.id,
        !producto.visible
      );
    } catch (error) {
      console.error(error);
      alert("Error al cambiar la visibilidad");
    }
  }

  return (
    <Layout>
      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:"25px"
        }}
      >
        <h1>📦 Productos</h1>

        <button
          onClick={() =>
            navigate("/admin/productos/nuevo")
          }
        >
          ➕ Nuevo Producto
        </button>
      </div>

      <ProductTable
        productos={productos}
        onDelete={handleDelete}
        onToggleVisible={handleToggleVisible}
      />
    </Layout>
  );
}