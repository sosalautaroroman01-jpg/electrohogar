import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

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
        {/* Catálogo */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Productos */}
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          }
        />

        {/* Nuevo */}
        <Route
          path="/admin/productos/nuevo"
          element={
            <ProtectedRoute>
              <NuevoProducto />
            </ProtectedRoute>
          }
        />

        {/* Editar */}
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