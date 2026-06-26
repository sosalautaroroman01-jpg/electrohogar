import { Link } from "react-router-dom";

export default function ProductRow({
  producto,
  onDelete,
  onToggleVisible,
}) {
  return (
    <tr>

      <td style={{padding:"10px"}}>
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{
              width:60,
              height:60,
              objectFit:"cover",
              borderRadius:8
            }}
          />
        ) : (
          "📷"
        )}
      </td>

      <td>{producto.nombre}</td>

      <td>{producto.categoria}</td>

      <td>
        $
        {Number(producto.precio).toLocaleString("es-AR")}
      </td>

      <td>
        {producto.visible === false ? (
          <span style={{color:"red"}}>
            🔴 Oculto
          </span>
        ) : (
          <span style={{color:"green"}}>
            🟢 Visible
          </span>
        )}
      </td>

      <td>

        <button
          onClick={() =>
            onToggleVisible(producto)
          }
        >
          {producto.visible === false
            ? "👁 Mostrar"
            : "🙈 Ocultar"}
        </button>

        <Link
          to={`/admin/productos/editar/${producto.id}`}
          style={{marginLeft:10}}
        >
          ✏️
        </Link>

        <button
          onClick={() =>
            onDelete(producto.id)
          }
          style={{marginLeft:10}}
        >
          🗑️
        </button>

      </td>

    </tr>
  );
}