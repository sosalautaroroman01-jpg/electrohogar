import "./Header.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();

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
          <button
            className="user-btn"
            onClick={() => navigate("/admin/login")}
          >
            👤
          </button>
        ) : (
          <div className="admin-menu">
            <button className="user-btn">
              👤
            </button>

            <div className="admin-dropdown">
              <p>{usuario.email}</p>

              <button onClick={() => navigate("/admin")}>
                📊 Panel Admin
              </button>

              <button onClick={() => navigate("/admin/productos")}>
                📦 Productos
              </button>

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