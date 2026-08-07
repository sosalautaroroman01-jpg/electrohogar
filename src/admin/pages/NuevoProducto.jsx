import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import ProductForm from "../components/ProductForm";

import { crearProducto } from "../../services/productosService";
import {
  subirImagen,
  subirImagenes,
  subirVideo,
} from "../../services/storageService";

export default function NuevoProducto() {
  const navigate = useNavigate();

  async function guardarProducto(data) {
    try {
      let imagen = "";
      let imagenes = [];
      let video = "";

      if (data.imagenesFile?.length) {
        imagenes = await subirImagenes(data.imagenesFile);
        imagen = imagenes[0];
      } else if (data.imagenFile) {
        imagen = await subirImagen(data.imagenFile);
        imagenes = [imagen];
      }

      if (data.videoFile) {
        video = await subirVideo(data.videoFile);
      }

      const numeroONull = (valor) =>
        valor === "" ? null : Number(valor);

      await crearProducto({
        nombre: data.nombre,
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

        stock: numeroONull(data.stock),

        descripcion: data.descripcion,

        imagen,
        imagenes,
        video,

        visible: data.visible,

        creado: new Date(),
      });

      alert("✅ Producto guardado correctamente");

      navigate("/admin/productos");
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar el producto");
    }
  }

  return (
    <Layout>
      <h1>➕ Nuevo Producto</h1>

      <ProductForm
        onSubmit={guardarProducto}
        textoBoton="Guardar Producto"
      />
    </Layout>
  );
}