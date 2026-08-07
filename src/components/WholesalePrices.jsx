export default function WholesalePrices({ producto }) {
  const precios = [
    { cantidad: 2, valor: producto.precio2 },
    { cantidad: 3, valor: producto.precio3 },
    { cantidad: 6, valor: producto.precio6 },
    { cantidad: 9, valor: producto.precio9 },
    { cantidad: 12, valor: producto.precio12 },
  ];

  const preciosValidos = precios.filter(
    (item) => Number(item.valor) > 0
  );

  if (preciosValidos.length === 0) {
    return null;
  }

  const moneda =
    (producto.moneda || "ARS") === "USD"
      ? "USD "
      : "$";

  return (
    <div
      style={{
        marginBottom: "15px",
        background: "#f3fff5",
        border: "1px solid #16a34a",
        borderRadius: "10px",
        padding: "10px",
        fontSize: "14px",
      }}
    >
      {preciosValidos.map(({ cantidad, valor }) => (
        <div key={cantidad}>
          🔥 <strong>x{cantidad}:</strong>{" "}
          {moneda}
          {Number(valor).toLocaleString("es-AR")}
        </div>
      ))}
    </div>
  );
}