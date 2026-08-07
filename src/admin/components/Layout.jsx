import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
        }

        .admin-layout{
          display:flex;
          min-height:100vh;
          background:#f4f4f4;
        }

        .admin-content{
          flex:1;
          min-width:0;
          display:flex;
          flex-direction:column;
          background:#f4f4f4;
        }

        .admin-main{
          flex:1;
          padding:30px;
          overflow-x:auto;
        }

        @media (max-width:900px){

          .admin-layout{
            flex-direction:column;
          }

          .admin-main{
            padding:16px;
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