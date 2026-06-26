import "./Header.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { carrito } = useCart();
  const { usuario, logout } = useAuth();

  const cantidad = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  return (
    <header className="header">
      <div className="header-user">
        {!usuario ? (
          <Link to="/admin/login" className="user-btn">
            👤
          </Link>
        ) : (
          <div className="admin-menu">
            <button className="user-btn">
              👤
            </button>

            <div className="admin-dropdown">
              <p>{usuario.email}</p>

              <Link className="dropdown-link" to="/admin">
                📊 Panel Admin
              </Link>

              <Link className="dropdown-link" to="/admin/productos">
                📦 Productos
              </Link>

              <button onClick={logout}>
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>

      <img
        src={logo}
        alt="Electro Hogar"
        className="logo"
      />

      <div className="cart-icon">
        🛒 <span>{cantidad}</span>
      </div>
    </header>
  );
}

export default Header;