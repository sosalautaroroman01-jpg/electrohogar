import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductItem from "./ProductItem";

function ProductList() {

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  async function cargarProductos() {

    const consulta = await getDocs(collection(db, "productos"));

    const lista = consulta.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProductos(lista);

  }

  useEffect(() => {

    cargarProductos();

  }, []);

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

  const productosFiltrados = productos.filter((producto) => {

    const coincideNombre = producto.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === "Todas" ||
      producto.categoria === categoria;

    return coincideNombre && coincideCategoria;

  });

  return (

    <div style={{ marginTop: "50px" }}>

      <h2>📦 Productos</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          margin: "20px 0",
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
            minWidth: "250px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          {categorias.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

      </div>

      <p>
        <strong>{productosFiltrados.length}</strong> productos encontrados
      </p>

      {productosFiltrados.map((producto) => (

        <ProductItem
          key={producto.id}
          producto={producto}
          actualizar={cargarProductos}
        />

      ))}

    </div>

  );

}

export default ProductList;