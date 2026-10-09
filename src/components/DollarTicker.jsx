import "./DollarTicker.css";
import { useDollar } from "../context/DollarContext";

function DollarTicker() {
  const blue = useDollar();

  if (!blue) return null;

  const compra = Number(blue.compra).toLocaleString("es-AR");
  const venta = Number(blue.venta).toLocaleString("es-AR");

  return (
    <div className="ticker">

      <div className="live-box">
        <span className="live-dot"></span>
        <span>EN VIVO</span>
      </div>

      <div className="ticker-wrapper">

        <div className="ticker-track">

          <span>
            🇦🇷 Cotización USD
          </span>

          <span className="ticker-separador">
            •
          </span>

          <span>
            Compra <strong>${compra}</strong>
          </span>

          <span className="ticker-separador">
            •
          </span>

          <span>
            Venta <strong>${venta}</strong>
          </span>

          <span className="ticker-separador">
            •
          </span>

          <span className="ticker-info">
            Productos publicados en USD se calculan automáticamente
          </span>

          <span className="ticker-separador">
            •
          </span>

          {/* Repetimos una segunda vez para mantener el movimiento */}
          
          <span>
            🇦🇷 Cotización USD
          </span>

          <span className="ticker-separador">
            •
          </span>

          <span>
            Compra <strong>${compra}</strong>
          </span>

          <span className="ticker-separador">
            •
          </span>

          <span>
            Venta <strong>${venta}</strong>
          </span>

        </div>

      </div>

    </div>
  );
}

export default DollarTicker;