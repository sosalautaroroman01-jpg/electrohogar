import ProductInfo from "./ProductInfo";
import ProductCategory from "./ProductCategory";
import ProductPrices from "./ProductPrices";
import ProductMedia from "./ProductMedia";
import { useEffect, useState } from "react";
import { obtenerProductos } from "../../services/productosService";
import "../../styles/forms.css";

const EMPTY_FORM = {
  nombre: "",
  categoria: "",
  marca: "",
  subcategoria: "",
  medida: "",
  moneda: "ARS",
  precio: "",
  precio2: "",
  precio3: "",
  precio6: "",
  precio9: "",
  precio12: "",
  stock: "",
  descripcion: "",
  imagen: "",
  imagenes: [],
  video: "",
  videoFile: null,
  visible: true,
};

export default function ProductForm({
  initialData,
  onSubmit,
  textoBoton = "Guardar Producto",
}) {
  const [form, setForm] = useState(initialData || EMPTY_FORM);
  const [preview, setPreview] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      ...EMPTY_FORM,
      ...initialData,
    });

    if (initialData.imagenes?.length > 0) {
      setPreview(initialData.imagenes);
    } else if (initialData.imagen) {
      setPreview([initialData.imagen]);
    }
  }, [initialData]);

  useEffect(() => {
    async function cargarCategorias() {
      const productos = await obtenerProductos();

      const lista = [
        ...new Set(
          productos
            .map((p) => (p.categoria || "").trim())
            .filter(Boolean)
        ),
      ].sort();

      setCategorias(lista);
    }

    cargarCategorias();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      ...form,
      precio: Number(form.precio),
      precio2: form.precio2 === "" ? "" : Number(form.precio2),
      precio3: form.precio3 === "" ? "" : Number(form.precio3),
      precio6: form.precio6 === "" ? "" : Number(form.precio6),
      precio9: form.precio9 === "" ? "" : Number(form.precio9),
      precio12: form.precio12 === "" ? "" : Number(form.precio12),
      stock: form.stock === "" ? "" : Number(form.stock),
    });
  }

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <ProductMedia
        form={form}
        setForm={setForm}
        preview={preview}
        setPreview={setPreview}
      />

      <ProductInfo
        form={form}
        setForm={setForm}
        handleChange={handleChange}
      />

      <ProductCategory
        form={form}
        setForm={setForm}
        categorias={categorias}
        handleChange={handleChange}
      />

      <ProductPrices
        form={form}
        handleChange={handleChange}
      />

      <button type="submit">
        💾 {textoBoton}
      </button>
    </form>
  );
}