import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f4f4f4",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <main style={{ padding: "30px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}