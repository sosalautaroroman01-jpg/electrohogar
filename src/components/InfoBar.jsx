import "./InfoBar.css";
import { Link } from "react-router-dom";

function InfoBar() {
  return (
    <div className="info-bar">

      <div className="info-item">
        <span className="info-icon">📦</span>
        <span>+600 Productos</span>
      </div>

      <span className="divider">•</span>

      <Link
        to="/calculadora-envios"
        className="info-item info-link"
      >
        <span className="info-icon">🚚</span>
        <span>Calcular envío</span>
      </Link>

      <span className="divider">•</span>

      <div className="info-item">
        <span className="info-icon">🏪</span>
        <span>Mayorista y Minorista</span>
      </div>

      <span className="divider">•</span>

      <div className="info-item">
        <span className="info-icon">💵</span>
        <span>Efectivo · Transferencia · USD</span>
      </div>

    </div>
  );
}

export default InfoBar;