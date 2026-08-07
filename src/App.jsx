import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CalculadoraEnvios from "./pages/CalculadoraEnvios";
import Local from "./pages/Local";

import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Productos from "./admin/pages/Productos";
import NuevoProducto from "./admin/pages/NuevoProducto";
import EditarProducto from "./admin/pages/EditarProducto";

import ProtectedRoute from "./admin/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= CATÁLOGO PÚBLICO ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/calculadora-envios"
          element={<CalculadoraEnvios />}
        />

        {/* ================= MODO LOCAL ================= */}

        <Route
          path="/local"
          element={<Local />}
        />

        {/* ================= LOGIN ADMIN ================= */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= PRODUCTOS ================= */}

        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/productos/nuevo"
          element={
            <ProtectedRoute>
              <NuevoProducto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/productos/editar/:id"
          element={
            <ProtectedRoute>
              <EditarProducto />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;