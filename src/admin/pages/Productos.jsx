import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Layout from "../components/Layout";
import ProductTable from "../components/ProductTable";

import {
  escucharProductos,
  eliminarProducto,
  cambiarVisibilidad,
} from "../../services/productosService";

export default function Productos() {
  const navigate = useNavigate();
  const location = useLocation();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState("todos");

  useEffect(() => {
    const unsubscribe = escucharProductos((data) => {
      setProductos(data);
    });

    return () => unsubscribe();
  }, []);

  // ... resto del código

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar producto?")) return;
    await eliminarProducto(id);
  }

  async function handleToggleVisible(producto) {
    try {
      await cambiarVisibilidad(producto.id, !producto.visible);
    } catch (error) {
      console.error(error);
      alert("Error al cambiar la visibilidad");
    }
  }

  const categorias = useMemo(() => {
    const lista = [
      ...new Set(
        productos
          .map((p) => p.categoria)
          .filter((c) => c && c.trim() !== "")
      ),
    ];

    return ["Todas", ...lista.sort()];
  }, [productos]);

  const publicados = useMemo(() => {
    return productos.filter((p) => p.visible !== false);
  }, [productos]);

  const ocultos = useMemo(() => {
    return productos.filter((p) => p.visible === false);
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    let lista = productos;

    if (estado === "stock") {
      lista = publicados;
    } else if (estado === "reponer") {
      lista = ocultos;
    }

    const texto = busqueda.trim().toLowerCase();

    return lista.filter((producto) => {
      const coincideNombre = String(producto.nombre ?? "")
        .toLowerCase()
        .includes(texto);

      const coincideCategoria =
        categoria === "Todas" ||
        producto.categoria === categoria;

      return coincideNombre && coincideCategoria;
    });
  }, [
    productos,
    publicados,
    ocultos,
    estado,
    busqueda,
    categoria,
  ]);
  
return (
  <Layout key={location.pathname}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
      }}
    >
      <button onClick={() => navigate("/admin/productos/nuevo")}>
        ➕ Nuevo Producto
      </button>
    </div>

    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <input
        type="text"
        placeholder="🔍 Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          flex: 1,
          width: "100%",
          minWidth: "350px",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "15px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          minWidth: "220px",
        }}
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      {/* TODOS */}
      <div
        onClick={() => setEstado("todos")}
        style={{
          flex: 1,
          minWidth: "180px",
          padding: "20px",
          borderRadius: "14px",
          cursor: "pointer",
          backgroundColor: estado === "todos" ? "#2563eb" : "#fff",
          color: estado === "todos" ? "#fff" : "#111",
          border:
            estado === "todos"
              ? "2px solid #2563eb"
              : "1px solid #ddd",
          boxShadow:
            estado === "todos"
              ? "0 8px 20px rgba(37,99,235,.25)"
              : "0 2px 8px rgba(0,0,0,.08)",
          transition: "all .2s",
        }}
      >
        <div style={{ fontSize: "14px", opacity: 0.85 }}>
          📦 Todos
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: "bold",
            marginTop: "8px",
          }}
        >
          {productos.length}
        </div>
      </div>

      {/* EN STOCK */}
      <div
        onClick={() => setEstado("stock")}
        style={{
          flex: 1,
          minWidth: "180px",
          padding: "20px",
          borderRadius: "14px",
          cursor: "pointer",
          backgroundColor: estado === "stock" ? "#16a34a" : "#fff",
          color: estado === "stock" ? "#fff" : "#111",
          border:
            estado === "stock"
              ? "2px solid #16a34a"
              : "1px solid #ddd",
          boxShadow:
            estado === "stock"
              ? "0 8px 20px rgba(22,163,74,.25)"
              : "0 2px 8px rgba(0,0,0,.08)",
          transition: "all .2s",
        }}
      >
        <div style={{ fontSize: "14px", opacity: 0.85 }}>
          ✅ En stock
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: "bold",
            marginTop: "8px",
          }}
        >
          {publicados.length}
        </div>
      </div>

      {/* HAY QUE REPONER */}
      <div
        onClick={() => setEstado("reponer")}
        style={{
          flex: 1,
          minWidth: "180px",
          padding: "20px",
          borderRadius: "14px",
          cursor: "pointer",
          backgroundColor: estado === "reponer" ? "#dc2626" : "#fff",
          color: estado === "reponer" ? "#fff" : "#111",
          border:
            estado === "reponer"
              ? "2px solid #dc2626"
              : "1px solid #ddd",
          boxShadow:
            estado === "reponer"
              ? "0 8px 20px rgba(220,38,38,.25)"
              : "0 2px 8px rgba(0,0,0,.08)",
          transition: "all .2s",
        }}
      >
        <div style={{ fontSize: "14px", opacity: 0.85 }}>
          🚫 Hay que reponer
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: "bold",
            marginTop: "8px",
          }}
        >
          {ocultos.length}
        </div>
      </div>
    </div>

    <ProductTable
      productos={productosFiltrados}
      onDelete={handleDelete}
      onToggleVisible={handleToggleVisible}
    />
  </Layout>
);
}