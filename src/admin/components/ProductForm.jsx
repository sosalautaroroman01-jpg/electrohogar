import { useEffect, useState } from "react";
import "../../styles/forms.css";

const EMPTY_FORM = {
  nombre: "",
  categoria: "",
  precio: "",
  precio3: "",
  precio6: "",
  precio9: "",
  precio12: "",
  stock: "",
  descripcion: "",
  imagen: "",
  visible: true,
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
      setForm({
        ...EMPTY_FORM,
        ...initialData,
      });

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
      precio3: Number(form.precio3),
      precio6: Number(form.precio6),
      precio9: Number(form.precio9),
      precio12: Number(form.precio12),
      stock: Number(form.stock),
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

      <label>💰 Precio Unitario</label>

      <input
        type="number"
        name="precio"
        placeholder="$0"
        value={form.precio}
        onChange={handleChange}
        required
      />

      <label>🔥 Precio x3</label>

      <input
        type="number"
        name="precio3"
        placeholder="$0"
        value={form.precio3}
        onChange={handleChange}
      />

      <label>🔥 Precio x6</label>

      <input
        type="number"
        name="precio6"
        placeholder="$0"
        value={form.precio6}
        onChange={handleChange}
      />

      <label>🔥 Precio x9</label>

      <input
        type="number"
        name="precio9"
        placeholder="$0"
        value={form.precio9}
        onChange={handleChange}
      />

      <label>🔥 Precio x12</label>

      <input
        type="number"
        name="precio12"
        placeholder="$0"
        value={form.precio12}
        onChange={handleChange}
      />

      <label>📦 Stock</label>

<input
  type="number"
  name="stock"
  placeholder="Cantidad disponible"
  value={form.stock}
  onChange={handleChange}
/>

<label>👁 Estado</label>

<select
  name="visible"
  value={String(form.visible)}
  onChange={(e) =>
    setForm({
      ...form,
      visible: e.target.value === "true",
    })
  }
>
  <option value="true">🟢 Visible</option>
  <option value="false">🔴 Oculto</option>
</select>

<label>Descripción</label>

<textarea
  name="descripcion"
  rows="5"
  placeholder="Descripción..."
  value={form.descripcion}
  onChange={handleChange}
></textarea>

<button type="submit">
  💾 {textoBoton}
</button>

    </form>
  );
}