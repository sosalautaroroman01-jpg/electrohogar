export default function ProductPrices({
  form,
  handleChange,
}) {
  return (
    <>
      <label>💵 Moneda</label>

      <select
        name="moneda"
        value={form.moneda}
        onChange={handleChange}
      >
        <option value="ARS">🇦🇷 Pesos (ARS)</option>
        <option value="USD">🇺🇸 Dólares (USD)</option>
      </select>

      <label>💰 Precio Unitario</label>

      <input
        type="number"
        name="precio"
        value={form.precio}
        onChange={handleChange}
        required
      />

      <label>🔥 Precio x2</label>

      <input
        type="number"
        name="precio2"
        value={form.precio2}
        onChange={handleChange}
      />

      <label>🔥 Precio x3</label>

      <input
        type="number"
        name="precio3"
        value={form.precio3}
        onChange={handleChange}
      />

      <label>🔥 Precio x6</label>

      <input
        type="number"
        name="precio6"
        value={form.precio6}
        onChange={handleChange}
      />

      <label>🔥 Precio x9</label>

      <input
        type="number"
        name="precio9"
        value={form.precio9}
        onChange={handleChange}
      />

      <label>🔥 Precio x12</label>

      <input
        type="number"
        name="precio12"
        value={form.precio12}
        onChange={handleChange}
      />
    </>
  );
}