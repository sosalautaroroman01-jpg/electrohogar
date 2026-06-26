import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import ProductTable from "../components/ProductTable";

import { escucharProductos } from "../../services/productosService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = escucharProductos(setProductos);

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1>📦 Productos</h1>

        <button onClick={() => navigate("/admin/productos/nuevo")}>
          ➕ Nuevo Producto
        </button>
      </div>

      <ProductTable productos={productos} />
    </Layout>
  );
}