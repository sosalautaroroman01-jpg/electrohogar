import ProductRow from "./ProductRow";

export default function ProductTable({
  productos = [],
  onDelete,
  onToggleVisible,
  onToggleNuevoIngreso,
  perfil = null,
}) {

  const esAdmin =
    perfil?.rol === "admin" ||
    perfil?.negocioId === "electrohogar";

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >

      <table
        style={{
          width: "100%",
          minWidth: "850px",
          borderCollapse: "collapse",
        }}
      >

        <thead>

          <tr
            style={{
              borderBottom:
                "1px solid #e5e7eb",
              background: "#fff",
            }}
          >

            <th
              style={{
                textAlign: "left",
                padding: "14px 12px",
                fontWeight: 700,
              }}
            >
              Imagen
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px 12px",
                fontWeight: 700,
              }}
            >
              Nombre
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px 12px",
                fontWeight: 700,
              }}
            >
              Categoría
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px 12px",
                fontWeight: 700,
              }}
            >
              Precio
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px 12px",
                fontWeight: 700,
              }}
            >
              Estado
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px 12px",
                fontWeight: 700,
              }}
            >
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {productos.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#666",
                  fontSize: "15px",
                }}
              >
                No se encontraron productos.
              </td>

            </tr>

          ) : (

            productos.map((producto) => {

              const esProductoPropio =
                producto?.tipoProducto ===
                  "propio" &&
                producto?.negocioId ===
                  "veronica";

              const puedeAdministrar =
                esAdmin ||
                esProductoPropio;

              return (
                <ProductRow
                  key={producto.id}
                  producto={producto}

                  onDelete={
                    onDelete
                  }

                  onToggleVisible={
                    onToggleVisible
                  }

                  onToggleNuevoIngreso={
                    onToggleNuevoIngreso
                  }

                  puedeAdministrarNuevoIngreso={
                    true
                  }

                  puedeAdministrar={
                    puedeAdministrar
                  }
                />
              );

            })

          )}

        </tbody>

      </table>

    </div>
  );
}