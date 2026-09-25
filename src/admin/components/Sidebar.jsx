import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

function Icon({ type }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    products: (
      <>
        <path d="M4 7.5h16v12H4z" />
        <path d="M8 7.5V5h8v2.5M8 11.5h8M8 15.5h5" />
      </>
    ),
  };

  return <svg {...common}>{icons[type]}</svg>;
}

export default function Sidebar() {
  const location = useLocation();
  const esMobile = window.innerWidth <= 900;

  const menuItem = (to, icono, texto) => {
    const activo =
      location.pathname === to ||
      (to !== "/admin" && location.pathname.startsWith(to));

    return (
      <Link
        key={to}
        to={to}
        className={`sidebar-menu-item ${activo ? "active" : ""}`}
        aria-current={activo ? "page" : undefined}
      >
        <span className="sidebar-icon">
          <Icon type={icono} />
        </span>

        {!esMobile && <span className="sidebar-label">{texto}</span>}
      </Link>
    );
  };

  return (
    <>
      <style>{`
        .admin-sidebar {
          width: 270px;
          min-height: 100vh;
          padding: 22px 16px 18px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          background:
            linear-gradient(
              180deg,
              #101820 0%,
              #0d151c 55%,
              #0a1117 100%
            );
          color: #fff;
          border-right: 1px solid rgba(255,255,255,.07);
          box-shadow: 8px 0 35px rgba(0,0,0,.16);
          position: relative;
          overflow: hidden;
        }

        .admin-sidebar::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          top: -110px;
          left: -100px;
          border-radius: 50%;
          background: rgba(34,197,94,.11);
          filter: blur(55px);
          pointer-events: none;
        }

        .sidebar-brand {
          position: relative;
          z-index: 1;
          padding: 6px 8px 24px;
          margin-bottom: 8px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .sidebar-logo {
          display: block;
          width: 178px;
          max-width: 100%;
          margin: 0 auto 15px;
          filter:
            drop-shadow(0 8px 18px rgba(0,0,0,.34))
            drop-shadow(0 0 16px rgba(34,197,94,.07));
        }

        .sidebar-title {
          margin: 0;
          color: #f8fafc;
          font-size: 18px;
          font-weight: 750;
          letter-spacing: -.2px;
        }

        .sidebar-subtitle {
          margin: 5px 0 0;
          color: #8f9ba5;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .2px;
        }

        .sidebar-section-title {
          margin: 24px 10px 10px;
          color: #66727c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .sidebar-nav {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-menu-item {
          min-height: 48px;
          padding: 0 13px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid transparent;
          border-radius: 13px;
          text-decoration: none;
          color: #aeb8c0;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          transition:
            background .2s ease,
            border-color .2s ease,
            color .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
        }

        .sidebar-menu-item:hover {
          color: #fff;
          background: rgba(255,255,255,.055);
          border-color: rgba(255,255,255,.07);
          transform: translateX(2px);
        }

        .sidebar-menu-item.active {
          color: #fff;
          background:
            linear-gradient(
              135deg,
              rgba(22,163,74,.22),
              rgba(34,197,94,.09)
            );
          border-color: rgba(34,197,94,.22);
          box-shadow:
            inset 3px 0 0 #22c55e,
            0 8px 22px rgba(0,0,0,.12);
        }

        .sidebar-icon {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #8d99a3;
          background: rgba(255,255,255,.045);
          transition: color .2s ease, background .2s ease;
        }

        .sidebar-menu-item.active .sidebar-icon {
          color: #35d979;
          background: rgba(34,197,94,.12);
        }

        .sidebar-menu-item:hover .sidebar-icon {
          color: #35d979;
        }

        .sidebar-icon svg {
          width: 20px;
          height: 20px;
          display: block;
        }

        .sidebar-label {
          min-width: 0;
          white-space: nowrap;
        }

        .sidebar-footer {
          position: relative;
          z-index: 1;
          margin-top: auto;
          padding: 16px 10px 2px;
          color: #59656f;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .sidebar-footer strong {
          color: #7d8992;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .admin-sidebar {
            width: 100%;
            min-height: auto;
            padding: 12px 10px;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,.07);
            box-shadow: 0 8px 28px rgba(0,0,0,.16);
            overflow: visible;
          }

          .admin-sidebar::before {
            width: 180px;
            height: 120px;
            top: -70px;
            left: 10%;
          }

          .sidebar-brand {
            padding: 2px 6px 10px;
            margin-bottom: 8px;
            border-bottom: none;
          }

          .sidebar-logo {
            width: 150px;
            margin-bottom: 0;
          }

          .sidebar-title,
          .sidebar-subtitle,
          .sidebar-section-title,
          .sidebar-footer {
            display: none;
          }

          .sidebar-nav {
            flex-direction: row;
            justify-content: center;
            gap: 8px;
            overflow-x: auto;
            padding: 2px 2px 3px;
            scrollbar-width: none;
          }

          .sidebar-nav::-webkit-scrollbar {
            display: none;
          }

          .sidebar-menu-item {
            min-width: 52px;
            min-height: 48px;
            padding: 5px;
            flex: 0 0 auto;
            justify-content: center;
            border-radius: 12px;
          }

          .sidebar-menu-item.active {
            box-shadow: inset 0 -3px 0 #22c55e;
          }

          .sidebar-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img
            src={logo}
            alt="Electro Hogar"
            className="sidebar-logo"
          />

          {!esMobile && (
            <>
              <h2 className="sidebar-title">Electro Hogar</h2>
              <p className="sidebar-subtitle">Panel Administrativo</p>
            </>
          )}
        </div>

        {!esMobile && (
          <div className="sidebar-section-title">Administración</div>
        )}

        <nav className="sidebar-nav" aria-label="Navegación administrativa">
          {menuItem("/admin", "dashboard", "Dashboard")}
          {menuItem("/admin/productos", "products", "Productos")}
        </nav>

        {!esMobile && (
          <div className="sidebar-footer">
            <strong>Electro Hogar</strong>
            <br />
            Panel administrativo · v1.0
          </div>
        )}
      </aside>
    </>
  );
}
