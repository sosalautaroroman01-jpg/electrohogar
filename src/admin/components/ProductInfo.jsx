export default function ProductInfo({
  form,
  setForm,
  handleChange,
}) {
  return (
    <>
      <label>Nombre</label>

      <input
        name="nombre"
        placeholder="Ej: Smart TV TCL 50"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label>👁 Estado</label>

      <select
        name="visible"
        value={String(form.visible)}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            visible: e.target.value === "true",
          }))
        }
      >
        <option value="true">🟢 Visible</option>
        <option value="false">🔴 Oculto</option>
      </select>

      <label>Descripción</label>

      <textarea
        rows="5"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
      />
    </>
  );
}