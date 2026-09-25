import "./Header.css";

import { Link, useLocation } from "react-router-dom";

import logo from "../assets/logo.png";

import { useAuth } from "../context/AuthContext";
import { useRevendedorAuth } from "../context/RevendedorAuthContext";


function UserIcon() {
  return (
    <svg
      className="user-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="7.5"
        r="3.35"
        fill="currentColor"
      />

      <path
        d="M4.5 20.5c.7-4.15 3.25-6.55 7.5-6.55s6.8 2.4 7.5 6.55H4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}


function AdminIcon() {
  return (
    <svg
      className="dropdown-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M7.5 16v-3.5M12 16V8M16.5 16v-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function ProductsIcon() {
  return (
    <svg
      className="dropdown-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7.5h16v12H4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M8 7.5V5h8v2.5M8 11.5h8M8 15.5h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SalesIcon() {
  return (
    <svg
      className="dropdown-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6.5h16v13H4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M8 10h8M8 14h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function LogoutIcon() {
  return (
    <svg
      className="dropdown-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 4h6v16h-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function Header({
  ocultarLogo = false,
}) {
  const location = useLocation();

  const { usuario, logout } = useAuth();

  const {
    autenticado: revendedorAutenticado,
    revendedor,
    logout: logoutRevendedor,
  } = useRevendedorAuth();


  /*
   * Detectamos si estamos dentro del catálogo
   * público de un revendedor.
   *
   * Ejemplo:
   * /v/pedro-alfonzo
   * /v/pedro-alfonzo/mis-ventas
   */

  const esRutaRevendedor =
    location.pathname.startsWith("/v/");


  /*
   * Sacamos el slug desde la URL.
   */

  const partesRuta =
    location.pathname
      .split("/")
      .filter(Boolean);

  const slugRevendedor =
    partesRuta[0] === "v"
      ? partesRuta[1]
      : "";


  /*
   * ============================================================
   * REVENDEDOR
   * ============================================================
   *
   * En esta zona JAMÁS mostramos el menú Admin.
   */

  if (esRutaRevendedor) {
    return (
      <header className="header">

        <div className="header-user">

          {!revendedorAutenticado ? (

            <Link
              to={`/revendedor/login?slug=${encodeURIComponent(
                slugRevendedor
              )}`}
              className="user-btn"
              aria-label="Acceso revendedor"
            >
              <UserIcon />
            </Link>

          ) : (

            <div className="admin-menu">

              <button
                type="button"
                className="user-btn"
                aria-label="Abrir menú revendedor"
              >
                <UserIcon />
              </button>


              <div className="admin-dropdown">

                <p>
                  {revendedor?.email ||
                    revendedor?.nombreCompleto ||
                    "Revendedor"}
                </p>


                <Link
                  to={`/v/${
                    revendedor?.slug ||
                    slugRevendedor
                  }/mis-ventas`}
                  className="dropdown-link"
                >
                  <SalesIcon />

                  <span>
                    Mis ventas
                  </span>
                </Link>


                <button
                  type="button"
                  className="dropdown-link"
                  onClick={logoutRevendedor}
                >
                  <LogoutIcon />

                  <span>
                    Cerrar sesión
                  </span>
                </button>

              </div>

            </div>

          )}

        </div>


        {!ocultarLogo && (
          <div className="hero-logo">

            <img
              src={logo}
              alt="Electro Hogar"
              className="logo"
            />

          </div>
        )}


        <div
          className="header-space"
          aria-hidden="true"
        />

      </header>
    );
  }


  /*
   * ============================================================
   * ADMIN / CATÁLOGO NORMAL
   * ============================================================
   *
   * Acá sigue funcionando exactamente como antes.
   */

  return (
    <header className="header">

      <div className="header-user">

        {!usuario ? (

          <Link
            to="/admin/login"
            className="user-btn"
            aria-label="Acceso administrador"
          >
            <UserIcon />
          </Link>

        ) : (

          <div className="admin-menu">

            <button
              type="button"
              className="user-btn"
              aria-label="Abrir menú administrador"
            >
              <UserIcon />
            </button>


            <div className="admin-dropdown">

              <p>
                {usuario.email}
              </p>


              <Link
                to="/admin"
                className="dropdown-link"
              >
                <AdminIcon />

                <span>
                  Panel Admin
                </span>
              </Link>


              <button
                type="button"
                className="dropdown-link"
                onClick={() =>
                  (window.location.href =
                    "/admin/productos")
                }
              >
                <ProductsIcon />

                <span>
                  Productos
                </span>
              </button>


              <button
                type="button"
                className="dropdown-link"
                onClick={logout}
              >
                <LogoutIcon />

                <span>
                  Cerrar sesión
                </span>
              </button>

            </div>

          </div>

        )}

      </div>


      {!ocultarLogo && (
        <div className="hero-logo">

          <img
            src={logo}
            alt="Electro Hogar"
            className="logo"
          />

        </div>
      )}


      <div
        className="header-space"
        aria-hidden="true"
      />

    </header>
  );
}


export default Header;