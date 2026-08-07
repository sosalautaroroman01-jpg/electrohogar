import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import ProductForm from "../components/ProductForm";

import {
  obtenerProductoPorId,
  editarProducto,
} from "../../services/productosService";

import {
  subirImagenes,
  subirVideo,
} from "../../services/storageService";

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
      let imagenes = [...(data.imagenes || [])];

      if (!imagenes.length && data.imagen) {
        imagenes.push(data.imagen);
      }

      if (data.imagenesFile?.length) {
        const nuevasImagenes = await subirImagenes(
          data.imagenesFile
        );

        imagenes = [...imagenes, ...nuevasImagenes];
      }

      let video = data.video || "";

      if (data.videoFile) {
        video = await subirVideo(data.videoFile);
      }

      const {
        imagenesFile,
        videoFile,
        ...datos
      } = data;

      const numeroONull = (valor) =>
        valor === "" || valor === null
          ? null
          : Number(valor);

      await editarProducto(id, {
        ...datos,

        categoria: data.categoria,
        marca: data.marca || "",
        subcategoria: data.subcategoria || "",
        moneda: data.moneda,

        precio: Number(data.precio),
        precio2: numeroONull(data.precio2),
        precio3: numeroONull(data.precio3),
        precio6: numeroONull(data.precio6),
        precio9: numeroONull(data.precio9),
        precio12: numeroONull(data.precio12),

        imagenes,
        imagen: imagenes[0] || "",

        video,
      });

      alert("✅ Producto actualizado correctamente");

      navigate("/admin/productos");
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar el producto");
    }
  }

  if (!producto) {
    return <Layout>Cargando...</Layout>;
  }

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