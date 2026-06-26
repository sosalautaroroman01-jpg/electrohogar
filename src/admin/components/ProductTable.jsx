import ProductRow from "./ProductRow";

export default function ProductTable({ productos, onDelete }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
      }}
    >
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {productos.length === 0 ? (
          <tr>
            <td
              colSpan="5"
              style={{
                textAlign: "center",
                padding: "30px",
              }}
            >
              No hay productos.
            </td>
          </tr>
        ) : (
          productos.map((producto) => (
            <ProductRow
              key={producto.id}
              producto={producto}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
}