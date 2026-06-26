import ProductRow from "./ProductRow";

export default function ProductTable({
  productos,
  onDelete,
  onToggleVisible,
}) {
  return (
    <table
      style={{
        width:"100%",
        borderCollapse:"collapse",
        background:"#fff",
      }}
    >
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {productos.map((producto)=>(
          <ProductRow
            key={producto.id}
            producto={producto}
            onDelete={onDelete}
            onToggleVisible={onToggleVisible}
          />
        ))}
      </tbody>
    </table>
  );
}