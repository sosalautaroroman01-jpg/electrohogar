import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16.7 16.7 0 0 1-3.1 3.8" />
      <path d="M6.2 6.7C3.9 8.1 2.5 12 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.6-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (cargando) {
      return;
    }

    setError("");
    setCargando(true);

    try {
      await login(email.trim(), password);

      navigate("/admin", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-glow admin-login-glow-one" />
      <div className="admin-login-glow admin-login-glow-two" />

      <section className="admin-login-card">
        <div className="admin-login-icon-wrap">
          <LockIcon />
        </div>

        <div className="admin-login-heading">
          <p className="admin-login-eyebrow">
            ADMINISTRACIÓN
          </p>

          <h1>
            Iniciar sesión
          </h1>

          <p>
            Accedé al panel de administración de Electro Hogar.
          </p>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label className="admin-login-field">
            <span>
              Correo electrónico
            </span>

            <div className="admin-login-input-wrap">
              <MailIcon />

              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="admin-login-field">
            <span>
              Contraseña
            </span>

            <div className="admin-login-input-wrap">
              <LockIcon />

              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-login-password-toggle"
                onClick={() =>
                  setMostrarPassword((actual) => !actual)
                }
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                <EyeIcon visible={mostrarPassword} />
              </button>
            </div>
          </label>

          {error && (
            <div className="admin-login-error">
              <span className="admin-login-error-dot" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="admin-login-spinner" />
                Ingresando...
              </>
            ) : (
              <>
                Ingresar al panel
                <span className="admin-login-arrow">
                  →
                </span>
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <span className="admin-login-footer-line" />
          <span>Acceso privado</span>
          <span className="admin-login-footer-line" />
        </div>
      </section>

      <style>{`
        .admin-login-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 18% 18%,
              rgba(34,197,94,.09),
              transparent 28%
            ),
            radial-gradient(
              circle at 82% 82%,
              rgba(22,163,74,.07),
              transparent 30%
            ),
            #f5f7f5;
        }

        .admin-login-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .admin-login-glow-one {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -80px;
          background: rgba(34,197,94,.07);
        }

        .admin-login-glow-two {
          width: 250px;
          height: 250px;
          bottom: -130px;
          left: -80px;
          background: rgba(22,163,74,.06);
        }

        .admin-login-card {
          position: relative;
          z-index: 1;
          width: min(100%, 440px);
          box-sizing: border-box;
          padding: 34px;
          border: 1px solid rgba(15,23,32,.08);
          border-radius: 22px;
          background: rgba(255,255,255,.82);
          box-shadow:
            0 25px 65px rgba(15,23,32,.10),
            inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .admin-login-icon-wrap {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          border-radius: 16px;
          background: linear-gradient(
            145deg,
            #16a34a,
            #22c55e
          );
          color: #fff;
          box-shadow:
            0 10px 24px rgba(22,163,74,.20);
        }

        .admin-login-icon-wrap svg {
          width: 27px;
          height: 27px;
        }

        .admin-login-heading {
          margin-bottom: 27px;
        }

        .admin-login-eyebrow {
          margin: 0 0 6px;
          color: #16a34a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.25px;
        }

        .admin-login-heading h1 {
          margin: 0;
          color: #162019;
          font-size: 32px;
          line-height: 1.08;
          letter-spacing: -.8px;
          font-weight: 800;
        }

        .admin-login-heading p:last-child {
          margin: 9px 0 0;
          color: #68746d;
          font-size: 14px;
          line-height: 1.5;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .admin-login-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .admin-login-field > span {
          color: #354139;
          font-size: 12px;
          font-weight: 750;
        }

        .admin-login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 47px;
          box-sizing: border-box;
          border: 1px solid rgba(15,23,32,.11);
          border-radius: 11px;
          background: #fff;
          transition:
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .admin-login-input-wrap:focus-within {
          border-color: rgba(22,163,74,.65);
          box-shadow:
            0 0 0 3px rgba(22,163,74,.09);
        }

        .admin-login-input-wrap > svg {
          width: 18px;
          height: 18px;
          flex: 0 0 18px;
          margin-left: 13px;
          color: #7b867f;
        }

        .admin-login-input-wrap input {
          width: 100%;
          min-width: 0;
          height: 45px;
          padding: 0 12px;
          box-sizing: border-box;
          border: 0;
          outline: 0;
          background: transparent;
          color: #17201b;
          font: inherit;
          font-size: 13px;
        }

        .admin-login-input-wrap input::placeholder {
          color: #a1aaa5;
        }

        .admin-login-password-toggle {
          width: 40px;
          height: 42px;
          flex: 0 0 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 2px;
          border: 0;
          background: transparent;
          color: #7b867f;
          cursor: pointer;
        }

        .admin-login-password-toggle:hover {
          color: #15803d;
        }

        .admin-login-password-toggle svg {
          width: 18px;
          height: 18px;
        }

        .admin-login-error {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 12px;
          box-sizing: border-box;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 12px;
          line-height: 1.4;
        }

        .admin-login-error-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: #ef4444;
        }

        .admin-login-submit {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 2px;
          padding: 0 18px;
          border: 0;
          border-radius: 12px;
          background: #16a34a;
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          box-shadow:
            0 9px 20px rgba(22,163,74,.17);
          transition:
            transform .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .admin-login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          background: #15803d;
          box-shadow:
            0 12px 24px rgba(22,163,74,.21);
        }

        .admin-login-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-login-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .admin-login-arrow {
          font-size: 17px;
          line-height: 1;
        }

        .admin-login-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,.38);
          border-top-color: #fff;
          border-radius: 50%;
          animation: adminLoginSpin .7s linear infinite;
        }

        .admin-login-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 25px;
          color: #8a938d;
          font-size: 10px;
          font-weight: 650;
          text-transform: uppercase;
          letter-spacing: .75px;
        }

        .admin-login-footer-line {
          height: 1px;
          flex: 1;
          background: rgba(15,23,32,.08);
        }

        @keyframes adminLoginSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .admin-login-page {
            min-height: 100svh;
            padding: 18px 14px;
          }

          .admin-login-card {
            padding: 25px 19px;
            border-radius: 18px;
          }

          .admin-login-icon-wrap {
            width: 50px;
            height: 50px;
            margin-bottom: 18px;
            border-radius: 14px;
          }

          .admin-login-icon-wrap svg {
            width: 24px;
            height: 24px;
          }

          .admin-login-heading {
            margin-bottom: 23px;
          }

          .admin-login-heading h1 {
            font-size: 29px;
          }

          .admin-login-heading p:last-child {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}