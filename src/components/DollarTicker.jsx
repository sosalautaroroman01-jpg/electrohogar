import "./DollarTicker.css";
import { useDollar } from "../context/DollarContext";

function DollarTicker() {
  const blue = useDollar();

  if (!blue) return null;

  const texto = `💵 Cotización USD • Compra $${Number(
    blue.compra
  ).toLocaleString("es-AR")} • Venta $${Number(
    blue.venta
  ).toLocaleString(
    "es-AR"
  )} • Todos los productos publicados en USD se calculan automáticamente con la cotización de venta •`;

  return (
    <div className="ticker">
      <div className="live-box">
        <span className="live-dot"></span>
        <span>EN VIVO</span>
      </div>

      <div className="ticker-wrapper">
        <div className="ticker-track">
          {[...Array(5)].map((_, index) => (
            <span key={index}>{texto}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DollarTicker;