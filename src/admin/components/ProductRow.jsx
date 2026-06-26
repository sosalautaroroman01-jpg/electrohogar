import { Link } from "react-router-dom";

export default function ProductRow({ producto, onDelete }) {
  return (
    <tr>
      <td style={{ padding: "12px" }}>
        {producto.imagen ? (
  <img
    src={producto.imagen}
    alt={producto.nombre}
    style={{
      width: "60px",
      height: "60px",
      objectFit: "cover",
      borderRadius: "8px",
      border: "1px solid #ddd",
    }}
  />
) : (
  "📷"
)}
      </td>

      <td>{producto.nombre}</td>

      <td>{producto.categoria}</td>

      <td>${producto.precio}</td>

      <td>
        <Link to={`/admin/productos/editar/${producto.id}`}>
          ✏️
        </Link>

        <button
          onClick={() => onDelete(producto.id)}
          style={{
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}