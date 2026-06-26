import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import ProductForm from "../components/ProductForm";

import { crearProducto } from "../../services/productosService";
import { subirImagen } from "../../services/storageService";

export default function NuevoProducto() {
  const navigate = useNavigate();

  async function guardarProducto(data) {
    try {
      let imagen = "";

      if (data.imagenFile) {
        imagen = await subirImagen(data.imagenFile);
      }

      await crearProducto({
        nombre: data.nombre,
        categoria: data.categoria,

        // 💰 Precios
        precio: Number(data.precio),
        precio3: Number(data.precio3) || Number(data.precio),
        precio6: Number(data.precio6) || Number(data.precio),
        precio9: Number(data.precio9) || Number(data.precio),
        precio12: Number(data.precio12) || Number(data.precio),

        // 📦 Stock
        stock: Number(data.stock) || 0,

        descripcion: data.descripcion,
        imagen,
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