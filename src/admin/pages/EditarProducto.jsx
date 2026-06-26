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
      await editarProducto(id, {
        ...data,

        precio: Number(data.precio),

        precio3:
          data.precio3 === "" || data.precio3 === null
            ? null
            : Number(data.precio3),

        precio6:
          data.precio6 === "" || data.precio6 === null
            ? null
            : Number(data.precio6),

        precio9:
          data.precio9 === "" || data.precio9 === null
            ? null
            : Number(data.precio9),

        precio12:
          data.precio12 === "" || data.precio12 === null
            ? null
            : Number(data.precio12),

        stock:
          data.stock === "" || data.stock === null
            ? null
            : Number(data.stock),
      });

      alert("✅ Producto actualizado correctamente");

      navigate("/admin/productos");
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar el producto");
    }
  }

  if (!producto) return <Layout>Cargando...</Layout>;

  return (
    <Layout>
      <h1>✏️ Editar Producto</h1>

      <ProductForm
        initialData={producto}
        textoBoton="Guardar Cambios"
        onSubmit={guardarCambios}
      />
    </Layout>
  );
}