import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/*
|--------------------------------------------------------------------------
| CONTEXTO AUTENTICACIÓN REVENDEDOR
|--------------------------------------------------------------------------
*/

import {
  RevendedorAuthProvider,
  useRevendedorAuth,
} from "./context/RevendedorAuthContext";

/*
|--------------------------------------------------------------------------
| PÁGINAS PÚBLICAS
|--------------------------------------------------------------------------
*/

import Home from "./pages/Home";
import CalculadoraEnvios from "./pages/CalculadoraEnvios";
import Local from "./pages/Local";
import Pedido from "./pages/Pedido";
import Mostrador from "./pages/Mostrador";
import Revendedor from "./pages/Revendedor";
import RevendedorLogin from "./pages/RevendedorLogin";

/*
|--------------------------------------------------------------------------
| MIS VENTAS REVENDEDOR
|--------------------------------------------------------------------------
*/

import MisVentas from "./pages/MisVentas";
import ProtectedRevendedorRoute from "./components/ProtectedRevendedorRoute";

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Productos from "./admin/pages/Productos";
import NuevoProducto from "./admin/pages/NuevoProducto";
import EditarProducto from "./admin/pages/EditarProducto";

import ProtectedRoute from "./admin/components/ProtectedRoute";

/*
|--------------------------------------------------------------------------
| RUTA PROTEGIDA - MIS VENTAS
|--------------------------------------------------------------------------
|
| El revendedor autenticado es quien determina:
|
| - revendedorId
| - slug
|
| No usamos el ID enviado por el cliente.
|
*/

function MisVentasProtegidas() {
  const {
    revendedor,
    loading,
  } = useRevendedorAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f7f4",
          color: "#162019",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Cargando panel...
      </div>
    );
  }

  return (
    <ProtectedRevendedorRoute>
      <MisVentas
        revendedorId={revendedor?.id || ""}
        slug={revendedor?.slug || ""}
      />
    </ProtectedRevendedorRoute>
  );
}

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

function App() {
  return (
    <BrowserRouter>
      <RevendedorAuthProvider>
        <Routes>

          {/* =========================================================
              CATÁLOGO PÚBLICO
          ========================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* =========================================================
              CATÁLOGO PÚBLICO DE REVENDEDOR
          ========================================================= */}

          <Route
            path="/v/:slug"
            element={<Revendedor />}
          />

          {/* =========================================================
              LOGIN REVENDEDOR
          ========================================================= */}

          <Route
            path="/revendedor/login"
            element={<RevendedorLogin />}
          />

          {/* =========================================================
              MIS VENTAS DEL REVENDEDOR
          ========================================================= */}

          <Route
            path="/v/:slug/mis-ventas"
            element={<MisVentasProtegidas />}
          />

          {/* =========================================================
              CALCULADORA DE ENVÍOS
          ========================================================= */}

          <Route
            path="/calculadora-envios"
            element={<CalculadoraEnvios />}
          />

          {/* =========================================================
              MODO LOCAL
          ========================================================= */}

          <Route
            path="/local"
            element={<Local />}
          />

          {/* =========================================================
              MOSTRADOR
          ========================================================= */}

          <Route
            path="/mostrador"
            element={<Mostrador />}
          />

          {/* =========================================================
              PEDIDO
          ========================================================= */}

          <Route
            path="/pedido/:id"
            element={<Pedido />}
          />

          {/* =========================================================
              LOGIN ADMIN
          ========================================================= */}

          <Route
            path="/admin/login"
            element={<Login />}
          />

          {/* =========================================================
              DASHBOARD
          ========================================================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* =========================================================
              PRODUCTOS
          ========================================================= */}

          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            }
          />

          {/* =========================================================
              NUEVO PRODUCTO
          ========================================================= */}

          <Route
            path="/admin/productos/nuevo"
            element={
              <ProtectedRoute>
                <NuevoProducto />
              </ProtectedRoute>
            }
          />

          {/* =========================================================
              EDITAR PRODUCTO
          ========================================================= */}

          <Route
            path="/admin/productos/editar/:id"
            element={
              <ProtectedRoute>
                <EditarProducto />
              </ProtectedRoute>
            }
          />

        </Routes>
      </RevendedorAuthProvider>
    </BrowserRouter>
  );
}

export default App;