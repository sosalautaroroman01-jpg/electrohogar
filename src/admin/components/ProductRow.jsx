import { Link } from "react-router-dom";


export default function ProductRow({
  producto,
  onDelete,
  onToggleVisible,
  onToggleNuevoIngreso,
  puedeAdministrar = false,
  puedeAdministrarNuevoIngreso = false,
}) {
  if (!producto) {
    return null;
  }

  const visible = producto.visible !== false;

  const imagen =
    producto.imagenes?.[0] || producto.imagen || "";

  return (
    <tr
      style={{
        borderBottom: "1px solid #ececec",
        transition: "background 0.2s ease",
      }}
      
    >
      {/* =====================================================
          IMAGEN
      ===================================================== */}
      <td
        style={{
          padding: "10px 15px",
        }}
      >
        {imagen ? (
          <img
            src={imagen}
            alt={producto.nombre || "Producto"}
            loading="lazy"
            decoding="async"
            width="65"
            height="65"
            style={{
              width: "65px",
              height: "65px",
              objectFit: "cover",
              borderRadius: "8px",
              background: "#fff",
              padding: "4px",
              display: "block",
            }}
          />
        ) : (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "65px",
              height: "65px",
              fontSize: "24px",
            }}
          >
            📷
          </span>
        )}
      </td>

      {/* =====================================================
          NOMBRE
      ===================================================== */}
      <td
        style={{
          fontWeight: 600,
          fontSize: "15px",
          maxWidth: "500px",
        }}
      >
        {producto.nombre}
      </td>

      {/* =====================================================
          CATEGORÍA
      ===================================================== */}
      <td
        style={{
          color: "#555",
          fontSize: "14px",
        }}
      >
        {producto.categoria}
      </td>

      {/* =====================================================
          PRECIO
      ===================================================== */}
      <td
        style={{
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        $
        {Number(producto.precio || 0).toLocaleString(
          "es-AR"
        )}
      </td>

      {/* =====================================================
          ESTADO
      ===================================================== */}
      <td>
        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 600,
            background: visible
              ? "#e8f8ec"
              : "#fdeaea",
            color: visible
              ? "#169c43"
              : "#d62828",
          }}
        >
          {visible
            ? "🟢 Visible"
            : "🔴 Oculto"}
        </span>
      </td>
{puedeAdministrarNuevoIngreso && (
  <button
    type="button"
    onClick={() =>
      onToggleNuevoIngreso?.(producto)
    }
    title={
      producto?.nuevoIngreso === true
        ? "Quitar de Descubrí lo nuevo"
        : "Mostrar en Descubrí lo nuevo"
    }
    style={{
      padding: "7px 12px",
      borderRadius: "6px",
      border:
        producto?.nuevoIngreso === true
          ? "1px solid #D4A72C"
          : "1px solid #d9dee7",
      background:
        producto?.nuevoIngreso === true
          ? "#fff8df"
          : "#fff",
      color:
        producto?.nuevoIngreso === true
          ? "#8a6500"
          : "#475467",
      cursor: "pointer",
      marginRight: "8px",
      fontWeight: 700,
    }}
  >
    {producto?.nuevoIngreso === true
      ? "★ Nuevo"
      : "☆ Nuevo"}
  </button>
)}
      {/* =====================================================
          ACCIONES
      ===================================================== */}
      <td
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {/* OCULTAR / PUBLICAR */}
        <button
          type="button"
          onClick={() =>
            onToggleVisible(producto)
          }
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            marginRight: "8px",
          }}
        >
          {visible
            ? "🙈 Ocultar"
            : "👁 Publicar"}
        </button>

        {/* EDITAR */}
        <Link
          to={`/admin/productos/editar/${producto.id}`}
          style={{
            textDecoration: "none",
            fontSize: "22px",
            marginRight: "12px",
          }}
        >
          ✏️
        </Link>

        {/* ELIMINAR */}
        <button
          type="button"
          onClick={() =>
            onDelete(producto.id)
          }
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}