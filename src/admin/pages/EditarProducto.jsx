import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import ProductForm from "../components/ProductForm";

import {
  obtenerProductoPorId,
  editarProducto,
} from "../../services/productosService";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);

  useEffect(() => {
    async function cargarProducto() {
      try {
        const data = await obtenerProductoPorId(id);
        setProducto(data);
      } catch (error) {
        console.error(error);
      }
    }

    cargarProducto();
  }, [id]);

  async function guardarCambios(data) {
    try {
      await editarProducto(id, data);

      navigate("/admin/productos");

    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  }

  if (!producto) return <Layout>Cargando...</Layout>;

  return (
    <Layout>
      <h1>Editar Producto</h1>

      <ProductForm
        initialData={producto}
        textoBoton="Guardar Cambios"
        onSubmit={guardarCambios}
      />
    </Layout>
  );
}