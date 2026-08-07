import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Sidebar() {
  const location = useLocation();

  const esMobile = window.innerWidth <= 900;

  const menuItem = (to, icono, texto) => {
    const activo =
      location.pathname === to ||
      (to !== "/admin" && location.pathname.startsWith(to));

    return (
      <Link
        to={to}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: esMobile ? "center" : "flex-start",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "12px",
          textDecoration: "none",
          color: activo ? "#22c55e" : "#e5e7eb",
          background: activo ? "rgba(34,197,94,.12)" : "transparent",
          borderLeft:
            !esMobile && activo
              ? "4px solid #22c55e"
              : "4px solid transparent",
          fontWeight: activo ? "700" : "500",
          transition: ".25s",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "20px" }}>{icono}</span>

        {!esMobile && <span>{texto}</span>}
      </Link>
    );
  };

  return (
    <aside
      style={{
        width: esMobile ? "100%" : "260px",
        background: "#1f2937",
        color: "#fff",
        minHeight: esMobile ? "auto" : "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: esMobile ? "20px" : "35px",
        }}
      >
        <img
          src={logo}
          alt="Electro Hogar"
          style={{
            width: esMobile ? "150px" : "180px",
            display: "block",
            margin: "0 auto 15px",
          }}
        />

        {!esMobile && (
          <>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              Electro Hogar
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              Panel Administrativo
            </p>
          </>
        )}
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: esMobile ? "row" : "column",
          justifyContent: esMobile ? "center" : "flex-start",
          gap: "12px",
          overflowX: esMobile ? "auto" : "visible",
        }}
      >
        {menuItem("/admin", "📊", "Dashboard")}
        {menuItem("/admin/productos", "📦", "Productos")}
      </nav>

      {!esMobile && (
        <div
          style={{
            marginTop: "auto",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "13px",
            borderTop: "1px solid rgba(255,255,255,.08)",
            paddingTop: "18px",
          }}
        >
          Electro Hogar
          <br />
          v1.0
        </div>
      )}
    </aside>
  );
}