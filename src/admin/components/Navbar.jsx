import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LogoutIcon() {
  return (
    <svg
      className="navbar-logout-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M14 4h6v16h-6" />
    </svg>
  );
}

export default function Navbar() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  async function salir() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <>
      <style>{`
        .admin-navbar {
          min-height: 70px;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 0 28px;
          background:
            linear-gradient(
              180deg,
              rgba(18,27,36,.98),
              rgba(13,21,28,.98)
            );
          color: #fff;
          border-bottom: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 8px 28px rgba(0,0,0,.12);
          position: relative;
          z-index: 10;
        }

        .admin-navbar-title {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .admin-navbar-mark {
          width: 9px;
          height: 9px;
          flex: 0 0 9px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 14px rgba(34,197,94,.45);
        }

        .admin-navbar-title strong {
          color: #f7faf8;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -.1px;
        }

        .admin-navbar-user {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .admin-navbar-email {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #aeb8c0;
          font-size: 13px;
          font-weight: 500;
        }

        .admin-navbar-logout {
          height: 40px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 11px;
          background: rgba(255,255,255,.055);
          color: #e8edef;
          font: 600 13px/1 inherit;
          cursor: pointer;
          transition:
            background .2s ease,
            border-color .2s ease,
            color .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
        }

        .admin-navbar-logout:hover {
          background: linear-gradient(135deg,#16a34a,#22c55e);
          border-color: rgba(255,255,255,.12);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(34,197,94,.18);
        }

        .admin-navbar-logout:focus-visible {
          outline: 2px solid rgba(34,197,94,.8);
          outline-offset: 2px;
        }

        .navbar-logout-icon {
          width: 17px;
          height: 17px;
          display: block;
        }

        @media (max-width: 700px) {
          .admin-navbar {
            min-height: 62px;
            padding: 0 14px;
            gap: 12px;
          }

          .admin-navbar-title strong {
            font-size: 14px;
          }

          .admin-navbar-user {
            gap: 8px;
          }

          .admin-navbar-email {
            display: none;
          }

          .admin-navbar-logout {
            width: 40px;
            height: 40px;
            padding: 0;
          }

          .admin-navbar-logout span {
            display: none;
          }
        }
      `}</style>

      <header className="admin-navbar">
        <div className="admin-navbar-title">
          <span className="admin-navbar-mark" aria-hidden="true" />
          <strong>Panel de Administración</strong>
        </div>

        <div className="admin-navbar-user">
          <span className="admin-navbar-email">
            {usuario?.email}
          </span>

          <button
            type="button"
            className="admin-navbar-logout"
            onClick={salir}
            aria-label="Cerrar sesión"
          >
            <LogoutIcon />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>
    </>
  );
}
