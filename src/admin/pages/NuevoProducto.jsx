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
        precio: Number(data.precio),
        descripcion: data.descripcion,
        imagen,
        creado: new Date(),
      });

      navigate("/admin/productos");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto");
    }
  }

  return (
    <Layout>
      <h1>Nuevo Producto</h1>

      <ProductForm
        onSubmit={guardarProducto}
        textoBoton="Guardar Producto"
      />
    </Layout>
  );
}