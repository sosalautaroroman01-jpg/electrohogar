import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>

      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          padding: "12px 18px",
          background: "#16a34a",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "10px",
          fontWeight: "600"
        }}
      >
        🏠 Volver al catálogo
      </Link>

      <h1>📊 Dashboard</h1>

      <p>Bienvenido al panel de administración.</p>

    </Layout>
  );
}