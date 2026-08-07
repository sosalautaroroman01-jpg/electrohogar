import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);

      navigate("/admin", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos.");
    }
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "35px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0,0,0,.12)",
        textAlign: "center",
      }}
    >
      <h2>🔐 Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          Ingresar
        </button>
      </form>

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "15px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}