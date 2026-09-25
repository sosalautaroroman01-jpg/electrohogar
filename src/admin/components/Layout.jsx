import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-layout {
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(34,197,94,.055),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #eef2f1 0%,
              #e7ecea 48%,
              #e1e7e5 100%
            );
          color: #172019;
        }

        .admin-content {
          flex: 1;
          min-width: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: transparent;
        }

        .admin-main {
          flex: 1;
          min-width: 0;
          padding: 28px 30px 36px;
          overflow-x: auto;
          overflow-y: visible;
        }

        .admin-main > * {
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 1200px) {
          .admin-main {
            padding: 24px 22px 32px;
          }
        }

        @media (max-width: 900px) {
          .admin-layout {
            flex-direction: column;
            min-height: 100vh;
          }

          .admin-content {
            min-height: auto;
          }

          .admin-main {
            padding: 18px 14px 28px;
            overflow-x: hidden;
          }
        }

        @media (max-width: 520px) {
          .admin-main {
            padding: 14px 10px 24px;
          }
        }
      `}</style>

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-content">
          <Navbar />

          <main className="admin-main">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
