import "./Header.css";

import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import logo from "../assets/logo.png";

import { useAuth } from "../context/AuthContext";
import { useRevendedorAuth } from "../context/RevendedorAuthContext";
import { useFilter } from "../context/FilterContext";


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="m16 16 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="7.5"
        r="3.2"
        fill="currentColor"
      />

      <path
        d="M4.5 20.5c.7-4.15 3.25-6.55 7.5-6.55s6.8 2.4 7.5 6.55H4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}


function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3.5 4h2l1.7 10.1a2 2 0 0 0 2 1.7h8.9a2 2 0 0 0 1.9-1.5L21 7H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="10"
        cy="19"
        r="1.4"
        fill="currentColor"
      />

      <circle
        cx="18"
        cy="19"
        r="1.4"
        fill="currentColor"
      />
    </svg>
  );
}


function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function AdminIcon() {
  return (
    <svg
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

  const {
    usuario,
    logout,
  } = useAuth();

  const {
    autenticado: revendedorAutenticado,
    revendedor,
    logout: logoutRevendedor,
  } = useRevendedorAuth();

  const {
    busqueda,
    setBusqueda,
  } = useFilter();

  const inputRef = useRef(null);


  const esRutaRevendedor =
    location.pathname.startsWith("/v/");


  const partesRuta =
    location.pathname
      .split("/")
      .filter(Boolean);


  const slugRevendedor =
    partesRuta[0] === "v"
      ? partesRuta[1]
      : "";


  const usuarioAutenticado =
    esRutaRevendedor
      ? revendedorAutenticado
      : Boolean(usuario);

  function limpiarBusqueda() {
    setBusqueda("");
    inputRef.current?.focus();
  }

  function manejarCambioBusqueda(e) {
    setBusqueda(e.target.value);
  }

  function manejarKeyDownBusqueda(e) {
    if (e.key === "Escape") {
      limpiarBusqueda();
    }
  }

  useEffect(() => {
    function manejarAtajoBusqueda(e) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }

    window.addEventListener("keydown", manejarAtajoBusqueda);

    return () => {
      window.removeEventListener(
        "keydown",
        manejarAtajoBusqueda
      );
    };
  }, []);


  return (
    <header className="site-header">

      <div className="header-main">

        {/* =====================================================
            IZQUIERDA — LOGO
        ====================================================== */}

        <div className="header-left">

          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </button>


          {!ocultarLogo && (
            <Link
              to={
                esRutaRevendedor
                  ? `/v/${slugRevendedor}`
                  : "/"
              }
              className="header-logo-link"
              aria-label="Electro Hogar"
            >

              <img
                src={logo}
                alt="Electro Hogar"
                className="header-logo"
              />

            </Link>
          )}

        </div>


        {/* =====================================================
            CENTRO — BUSCADOR
        ====================================================== */}

        <div className="header-search">

          <SearchIcon />

          <input
            ref={inputRef}
            type="search"
            value={busqueda || ""}
            onChange={manejarCambioBusqueda}
            onKeyDown={manejarKeyDownBusqueda}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            autoComplete="off"
            spellCheck="false"
          />

          {String(busqueda || "").length > 0 && (
            <button
              type="button"
              className="header-search-clear"
              onClick={limpiarBusqueda}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              ×
            </button>
          )}


        </div>


        {/* =====================================================
            DERECHA — CUENTA + CARRITO
        ====================================================== */}

        <div className="header-actions">

          {/* ================= CUENTA ================= */}

          <div className="header-account">

            {!usuarioAutenticado ? (

              <Link
                to={
                  esRutaRevendedor
                    ? `/revendedor/login?slug=${encodeURIComponent(
                        slugRevendedor
                      )}`
                    : "/admin/login"
                }
                className="header-action"
              >

                <UserIcon />

                <span className="header-action-text">

                  <small>
                    Mi cuenta
                  </small>

                  <strong>
                    Ingresar
                  </strong>

                </span>

              </Link>

            ) : (

              <div className="admin-menu">

                <button
                  type="button"
                  className="header-action"
                  aria-label="Abrir cuenta"
                >

                  <UserIcon />

                  <span className="header-action-text">

                    <small>
                      Mi cuenta
                    </small>

                    <strong>
                      {esRutaRevendedor
                        ? "Revendedor"
                        : "Administrador"}
                    </strong>

                  </span>

                </button>


                {/* ================= DROPDOWN ================= */}

                <div className="admin-dropdown">

                  <p>
                    {esRutaRevendedor
                      ? (
                          revendedor?.email ||
                          revendedor?.nombreCompleto ||
                          "Revendedor"
                        )
                      : usuario?.email}
                  </p>


                  {esRutaRevendedor ? (

                    <>

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
                        onClick={
                          logoutRevendedor
                        }
                      >

                        <LogoutIcon />

                        <span>
                          Cerrar sesión
                        </span>

                      </button>

                    </>

                  ) : (

                    <>

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
                          (
                            window.location.href =
                              "/admin/productos"
                          )
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

                    </>

                  )}

                </div>

              </div>

            )}

          </div>


          {/* ================= CARRITO ================= */}

          <button
            type="button"
            className="header-cart"
            aria-label="Abrir carrito"
            onClick={() => {

              window.dispatchEvent(
                new CustomEvent(
                  "abrir-carrito"
                )
              );

            }}
          >

            <CartIcon />

            <span>
              Carrito
            </span>

          </button>

        </div>

      </div>

    </header>
  );
}


export default Header;