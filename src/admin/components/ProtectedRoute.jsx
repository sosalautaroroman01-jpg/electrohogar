import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ADMIN_UIDS = [
  "IikuPLqrxAPdX2HEzKZOmNkI4QP2",
  "P2MNgJIg14O1pfh5tupsIL9Lg823",
  "I85kPwtwELbnVonup6RijCM522q1",
];

export default function ProtectedRoute({
  children,
}) {
  const {
    usuario,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Cargando...
      </div>
    );
  }

  /*
   * No hay sesión administrativa.
   */
  if (!usuario) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  /*
   * La cuenta está autenticada pero
   * NO pertenece a un administrador oficial.
   */
  const esAdministrador =
    ADMIN_UIDS.includes(
      usuario.uid
    );

  if (!esAdministrador) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}