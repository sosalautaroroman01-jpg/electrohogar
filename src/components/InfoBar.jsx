import "./InfoBar.css";
import { Link } from "react-router-dom";

function ProductsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="info-svg">
      <path d="M4 7.5 12 4l8 3.5L12 11 4 7.5Z" />
      <path d="M4 7.5V16l8 4 8-4V7.5" />
      <path d="M12 11v9" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="info-svg">
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="info-svg">
      <path d="M4 10v10h16V10" />
      <path d="M3 10 5 4h14l2 6" />
      <path d="M3 10c.8 1.3 2 2 3.5 2S9.2 11.3 10 10c.8 1.3 2 2 3.5 2s2.7-.7 3.5-2c.8 1.3 2 2 3.5 2" />
      <path d="M8 20v-5h8v5" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="info-svg">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M7 9h.01M17 15h.01" />
    </svg>
  );
}

function InfoBar() {
  return (
    <section
      className="info-bar"
      aria-label="Información de Electro Hogar Quilmes"
    >
      <div className="info-item">
        <span className="info-icon" aria-hidden="true">
          <ProductsIcon />
        </span>
        <span className="info-text">+600 Productos</span>
      </div>

      <span className="divider" aria-hidden="true" />

      <Link
        to="/calculadora-envios"
        className="info-item info-link"
      >
        <span className="info-icon" aria-hidden="true">
          <DeliveryIcon />
        </span>
        <span className="info-text">Calcular envío</span>
      </Link>

      <span className="divider" aria-hidden="true" />

      <div className="info-item">
        <span className="info-icon" aria-hidden="true">
          <StoreIcon />
        </span>
        <span className="info-text">Mayorista y Minorista</span>
      </div>

      <span className="divider" aria-hidden="true" />

      <div className="info-item">
        <span className="info-icon" aria-hidden="true">
          <MoneyIcon />
        </span>
        <span className="info-text">Efectivo · Transferencia · USD</span>
      </div>
    </section>
  );
}

export default InfoBar;
