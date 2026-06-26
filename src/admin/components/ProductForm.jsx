import { useEffect, useState } from "react";
import "../../styles/forms.css";

const EMPTY_FORM = {
  nombre: "",
  categoria: "",
  precio: "",
  descripcion: "",
  imagen: "",
};

export default function ProductForm({
  initialData,
  onSubmit,
  textoBoton = "Guardar Producto",
}) {
  const [form, setForm] = useState(initialData || EMPTY_FORM);
  const [preview, setPreview] = useState(initialData?.imagen || "");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPreview(initialData.imagen || "");
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImagen(e) {
    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      imagenFile: file,
    });

    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      ...form,
      precio: Number(form.precio),
    });
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>📦 Datos del Producto</h2>

      <label>Imagen</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImagen}
      />

      {preview && (
        <img
          src={preview}
          alt="Vista previa"
          className="preview-image"
        />
      )}

      <label>Nombre</label>

      <input
        name="nombre"
        placeholder="Ej: Smart TV TCL 50"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label>Categoría</label>

      <input
        name="categoria"
        placeholder="TV, Celulares, Cocina..."
        value={form.categoria}
        onChange={handleChange}
        required
      />

      <label>Precio</label>

      <input
        type="number"
        name="precio"
        placeholder="$0"
        value={form.precio}
        onChange={handleChange}
        required
      />

      <label>Descripción</label>

      <textarea
        name="descripcion"
        rows="5"
        placeholder="Descripción..."
        value={form.descripcion}
        onChange={handleChange}
      />

      <button type="submit">
        💾 {textoBoton}
      </button>
    </form>
  );
}