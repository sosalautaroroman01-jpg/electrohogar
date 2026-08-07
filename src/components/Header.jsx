import "./Header.css";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { usuario, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-user">
        {!usuario ? (
          <Link
            to="/admin/login"
            className="user-btn"
          >
            👤
          </Link>
        ) : (
          <div className="admin-menu">
            <button
              type="button"
              className="user-btn"
            >
              👤
            </button>

            <div className="admin-dropdown">
              <p>{usuario.email}</p>

              <Link
                to="/admin"
                className="dropdown-link"
              >
                📊 Panel Admin
              </Link>

              <button
                type="button"
                className="dropdown-link"
                onClick={() =>
                  (window.location.href =
                    "/admin/productos")
                }
              >
                📦 Productos
              </button>

              <button
                type="button"
                onClick={logout}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="hero-logo">
        <img
          src={logo}
          alt="Electro Hogar"
          className="logo"
        />
      </div>

      <div className="header-space"></div>
    </header>
  );
}

export default Header;