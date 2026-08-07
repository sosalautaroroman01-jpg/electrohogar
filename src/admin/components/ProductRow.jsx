import { Link } from "react-router-dom";

export default function ProductRow({
  producto,
  onDelete,
  onToggleVisible,
}) {
  const visible = producto.visible !== false;

  return (
    <tr
      style={{
        borderBottom: "1px solid #ececec",
        transition: "0.2s",
      }}
    >
      <td style={{ padding: "10px 15px" }}>
  {(producto.imagenes?.[0] || producto.imagen) ? (
    <img
      src={producto.imagenes?.[0] || producto.imagen}
      alt={producto.nombre}
      style={{
        width: 65,
        height: 65,
        objectFit: "cover",
        borderRadius: 8,
        background: "#fff",
        padding: 4,
      }}
    />
  ) : (
    "📷"
  )}
</td>

      <td
        style={{
          fontWeight: 600,
          fontSize: 15,
          maxWidth: 500,
        }}
      >
        {producto.nombre}
      </td>

      <td
        style={{
          color: "#555",
          fontSize: 14,
        }}
      >
        {producto.categoria}
      </td>

      <td
        style={{
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        $
        {Number(producto.precio).toLocaleString("es-AR")}
      </td>

      <td>
        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            background: visible ? "#e8f8ec" : "#fdeaea",
            color: visible ? "#169c43" : "#d62828",
          }}
        >
          {visible ? "🟢 Visible" : "🔴 Oculto"}
        </span>
      </td>

      <td style={{ whiteSpace: "nowrap" }}>
        <button
          onClick={() => onToggleVisible(producto)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            marginRight: 8,
          }}
        >
          {visible ? "🙈 Ocultar" : "👁 Publicar"}
        </button>

        <Link
          to={`/admin/productos/editar/${producto.id}`}
          style={{
            textDecoration: "none",
            fontSize: 22,
            marginRight: 12,
          }}
        >
          ✏️
        </Link>

        <button
          onClick={() => onDelete(producto.id)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}