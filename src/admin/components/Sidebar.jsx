import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        background: "#1f2937",
        color: "white",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h2>Electro Hogar</h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
          📊 Dashboard
        </Link>

        <Link
          to="/admin/productos"
          style={{ color: "white", textDecoration: "none" }}
        >
          📦 Productos
        </Link>
      </nav>
    </aside>
  );
}