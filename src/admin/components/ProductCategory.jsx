const CATEGORIAS_BASE = [
  "Smart TV",
  "Celulares",
  "Perfumes",
  "Audio",
  "Entretenimiento",
  "Aires",
  "Heladeras",
  "Freezers",
  "Lavarropas",
  "Cocina",
  "Accesorios de Cocina",
  "Pequeños Electros",
  "Botellas y Térmicos",
  "Belleza y Cuidado",
  "Limpieza",
  "Jardín",
  "Calefacción",
  "Termotanques",
  "Herramientas",
  "Iluminación",
  "Cámaras de Seguridad",
  "Hogar",
  "Blanquería",
];

export default function ProductCategory({
  form,
  setForm,
  categorias,
  handleChange,
}) {

  const listaCategorias = [
    ...new Set([
      ...CATEGORIAS_BASE,
      ...categorias,
    ]),
  ].sort();

  return (
    <>
      <label>Categoría</label>

      <input
        list="lista-categorias"
        name="categoria"
        placeholder="Escribí o elegí una categoría..."
        value={form.categoria}
        onChange={(e) => {
          const categoria = e.target.value.trim();

          setForm((prev) => ({
            ...prev,
            categoria,

            marca:
              categoria === "Celulares"
                ? prev.marca
                : "",

            subcategoria:
              categoria === "Blanquería"
                ? prev.subcategoria
                : "",

            medida:
              categoria === "Blanquería"
                ? prev.medida
                : "",
          }));
        }}
        autoComplete="off"
        required
      />

      <datalist id="lista-categorias">
        {listaCategorias.map((categoria) => (
          <option
            key={categoria}
            value={categoria}
          />
        ))}
      </datalist>

      {form.categoria === "Celulares" && (
        <>
          <label>📱 Marca</label>

          <select
            name="marca"
            value={form.marca}
            onChange={handleChange}
            required
          >
            <option value="">
              Seleccionar marca...
            </option>

            <option value="Samsung">
              Samsung
            </option>

            <option value="Motorola">
              Motorola
            </option>

            <option value="iPhone">
              iPhone
            </option>

            <option value="Xiaomi">
              Xiaomi
            </option>
          </select>
        </>
      )}

      {form.categoria === "Blanquería" && (
        <>
          <label>🛏️ Subcategoría</label>

          <select
            name="subcategoria"
            value={form.subcategoria}
            onChange={handleChange}
            required
          >
            <option value="">
              Seleccionar...
            </option>

            <option value="Sábanas">
              🛏️ Sábanas
            </option>

            <option value="Almohadas">
              🛌 Almohadas
            </option>

            <option value="Frazadas">
              🛏️ Frazadas
            </option>

            <option value="Acolchados">
              🛏️ Acolchados
            </option>

            <option value="Alfombras y Cortinas">
              🪟 Alfombras y Cortinas
            </option>

            <option value="Toallas">
              🛁 Toallas
            </option>
          </select>
        </>
      )}

      {["Sábanas", "Frazadas", "Acolchados"].includes(
        form.subcategoria
      ) && (
        <>
          <label>📏 Medida</label>

          <select
            name="medida"
            value={form.medida}
            onChange={handleChange}
            required
          >
            <option value="">
              Seleccionar medida...
            </option>

            <option value="1½ Plaza">
              1½ Plaza
            </option>

            <option value="2½ Plazas">
              2½ Plazas
            </option>

            <option value="King">
              King
            </option>
          </select>
        </>
      )}
    </>
  );
}