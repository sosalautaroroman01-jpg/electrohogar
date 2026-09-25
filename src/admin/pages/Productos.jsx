import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Layout from "../components/Layout";
import ProductTable from "../components/ProductTable";

import {
  escucharProductos,
  eliminarProducto,
  cambiarVisibilidad,
  cambiarNuevoIngreso,
} from "../../services/productosService";

import { useAuth } from "../../context/AuthContext";

export default function Productos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState("todos");

  useEffect(() => {
    const unsubscribe = escucharProductos((data) => {
      setProductos(data);
    });

    return () => unsubscribe();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar producto?")) return;
    await eliminarProducto(id);
  }

  async function handleToggleVisible(producto) {
    try {
      await cambiarVisibilidad(producto.id, !producto.visible);
    } catch (error) {
      console.error(error);
      alert("Error al cambiar la visibilidad");
    }
  }

  async function handleToggleNuevoIngreso(producto) {
    try {
      await cambiarNuevoIngreso(
        producto.id,
        producto.nuevoIngreso !== true
      );
    } catch (error) {
      console.error(error);
      alert("Error al cambiar Nuevo ingreso");
    }
  }

  const categorias = useMemo(() => {
    const lista = [
      ...new Set(
        productos
          .map((p) => p.categoria)
          .filter((c) => c && c.trim() !== "")
      ),
    ];

    return ["Todas", ...lista.sort()];
  }, [productos]);

  const publicados = useMemo(() => {
    return productos.filter((p) => p.visible !== false);
  }, [productos]);

  const ocultos = useMemo(() => {
    return productos.filter((p) => p.visible === false);
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    let lista = productos;

    if (estado === "stock") {
      lista = publicados;
    } else if (estado === "reponer") {
      lista = ocultos;
    }

    const texto = busqueda.trim().toLowerCase();

    return lista.filter((producto) => {
      const coincideNombre = String(producto.nombre ?? "")
        .toLowerCase()
        .includes(texto);

      const coincideCategoria =
        categoria === "Todas" ||
        producto.categoria === categoria;

      return coincideNombre && coincideCategoria;
    });
  }, [
    productos,
    publicados,
    ocultos,
    estado,
    busqueda,
    categoria,
  ]);

  return (
    <Layout key={location.pathname}>
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          paddingBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: "5px",
              }}
            >
              Administración
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                lineHeight: 1.15,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Productos
            </h1>
            <p
              style={{
                margin: "7px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Gestioná tu catálogo, disponibilidad y publicaciones.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/productos/nuevo")}
            style={{
              border: "none",
              borderRadius: "12px",
              background: "#0f172a",
              color: "#fff",
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(15,23,42,.16)",
              transition: "transform .18s, box-shadow .18s",
            }}
          >
            + Nuevo producto
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            boxShadow: "0 4px 14px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: "1 1 320px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: "15px",
                  pointerEvents: "none",
                }}
              >
                🔎
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 14px 0 40px",
                  borderRadius: "11px",
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={{
                flex: "0 1 230px",
                height: "46px",
                padding: "0 14px",
                borderRadius: "11px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#0f172a",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Todas" ? "Todas las categorías" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {[
            {
              key: "todos",
              label: "Total de productos",
              count: productos.length,
              icon: "▦",
              active: "#0f172a",
            },
            {
              key: "stock",
              label: "Publicados",
              count: publicados.length,
              icon: "✓",
              active: "#65a30d",
            },
            {
              key: "reponer",
              label: "Hay que reponer",
              count: ocultos.length,
              icon: "!",
              active: "#dc2626",
            },
          ].map((item) => {
            const active = estado === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setEstado(item.key)}
                style={{
                  textAlign: "left",
                  border: active
                    ? `1px solid ${item.active}`
                    : "1px solid #e2e8f0",
                  borderRadius: "15px",
                  padding: "17px 18px",
                  background: active ? item.active : "#fff",
                  color: active ? "#fff" : "#0f172a",
                  cursor: "pointer",
                  boxShadow: active
                    ? `0 9px 22px ${item.active}33`
                    : "0 4px 14px rgba(15,23,42,.05)",
                  transition: "all .18s",
                  minHeight: "105px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      opacity: active ? 0.9 : 0.65,
                    }}
                  >
                    {item.label}
                  </span>

                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      display: "grid",
                      placeItems: "center",
                      background: active
                        ? "rgba(255,255,255,.16)"
                        : "#f1f5f9",
                      color: active ? "#fff" : item.active,
                      fontWeight: 900,
                    }}
                  >
                    {item.icon}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "30px",
                    lineHeight: 1,
                    fontWeight: 800,
                    marginTop: "15px",
                    letterSpacing: "-.03em",
                  }}
                >
                  {item.count}
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 14px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              padding: "16px 18px",
              borderBottom: "1px solid #e2e8f0",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Catálogo
              </div>
              <div
                style={{
                  marginTop: "3px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                {productosFiltrados.length} producto
                {productosFiltrados.length === 1 ? "" : "s"} mostrado
                {productosFiltrados.length === 1 ? "" : "s"}
              </div>
            </div>

            {(busqueda || categoria !== "Todas" || estado !== "todos") && (
              <button
                type="button"
                onClick={() => {
                  setBusqueda("");
                  setCategoria("Todas");
                  setEstado("todos");
                }}
                style={{
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  borderRadius: "9px",
                  padding: "8px 11px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <ProductTable
            productos={productosFiltrados}
            onDelete={handleDelete}
            onToggleVisible={handleToggleVisible}
            onToggleNuevoIngreso={handleToggleNuevoIngreso}
            perfil={perfil}
          />
        </div>
      </div>
    </Layout>
  );
}
