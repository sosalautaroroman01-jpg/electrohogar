import { Navigate, useLocation } from "react-router-dom";

import {
  useRevendedorAuth,
} from "../context/RevendedorAuthContext";

export default function ProtectedRevendedorRoute({
  children,
}) {
  const location =
    useLocation();

  const {
    loading,
    autenticado,
    revendedor,
  } = useRevendedorAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f7faf8 0%, #eef7f1 100%)",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "36px 28px",
            borderRadius: "20px",
            background:
              "rgba(255,255,255,0.92)",
            border:
              "1px solid rgba(22,163,74,0.12)",
            boxShadow:
              "0 18px 50px rgba(15,23,42,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              margin: "0 auto 18px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            E
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              color: "#162019",
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            Cargando cuenta
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  if (
    !autenticado ||
    !revendedor
  ) {
    const slug =
      location.pathname
        .split("/")
        .filter(Boolean)[1] || "";

    return (
      <Navigate
        to={`/revendedor/login?slug=${encodeURIComponent(
          slug
        )}`}
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  return children;
}