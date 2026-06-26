import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  async function salir() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <header
      style={{
        height: "70px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <strong>Panel de Administración</strong>

      <div>
        <span style={{ marginRight: "15px" }}>
          {usuario?.email}
        </span>

        <button onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}