import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";
import ProductItem from "./ProductItem";

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [cargando, setCargando] = useState(true);

  // =========================================================
  // CARGAR PRODUCTOS
  // =========================================================
  async function cargarProductos() {
    try {
      setCargando(true);

      const consulta = await getDocs(
        collection(db, "productos")
      );

      const lista = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(lista);
    } catch (error) {
      console.error(
        "Error al cargar los productos:",
        error
      );
    } finally {
      setCargando(false);
    }
  }

  // =========================================================
  // CARGA INICIAL
  // =========================================================
  useEffect(() => {
    cargarProductos();
  }, []);

  // =========================================================
  // CATEGORÍAS
  // =========================================================
  const categorias = [
    "Todas",
    "Smart TV",
    "Aires",
    "Heladeras",
    "Lavarropas",
    "Cocina",
    "Accesorios de Cocina",
    "Calefacción",
    "Termotanques",
    "Pequeños Electros",
    "Belleza y Cuidado",
    "Audio",
    "Herramientas",
    "Celulares",
    "Hogar",
  ];

  // =========================================================
  // FILTRAR PRODUCTOS
  // =========================================================
  const textoBusqueda = busqueda.toLowerCase();

  const productosFiltrados = productos.filter(
    (producto) => {
      const coincideNombre = producto.nombre
        ?.toLowerCase()
        .includes(textoBusqueda);

      const coincideCategoria =
        categoria === "Todas" ||
        producto.categoria === categoria;

      return (
        coincideNombre &&
        coincideCategoria
      );
    }
  );

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div
      style={{
        marginTop: "50px",
      }}
    >
      {/* =====================================================
          TÍTULO
      ===================================================== */}
      <h2>📦 Productos</h2>

      {/* =====================================================
          FILTROS
      ===================================================== */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          style={{
            flex: 1,
            minWidth: "250px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        {/* CATEGORÍA */}
        <select
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* =====================================================
          CONTADOR
      ===================================================== */}
      <p>
        <strong>
          {productosFiltrados.length}
        </strong>{" "}
        productos encontrados
      </p>

      {/* =====================================================
          ESTADO DE CARGA
      ===================================================== */}
      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        productosFiltrados.map((producto) => (
          <ProductItem
            key={producto.id}
            producto={producto}
            actualizar={cargarProductos}
          />
        ))
      )}
    </div>
  );
}

export default ProductList;