import { Link } from "react-router-dom";

export default function ProductRow({
  producto,
  onDelete,
  onToggleVisible,
  onToggleNuevoIngreso,
  puedeAdministrarNuevoIngreso = false,
  puedeAdministrar = false,
}) {
  const visible =
    producto?.visible !== false;

  const imagen =
    producto?.imagenes?.[0] ||
    producto?.imagen ||
    "";

  const precio =
    Number(producto?.precio) || 0;

  const esProductoPropio =
    producto?.tipoProducto ===
      "propio" &&
    producto?.negocioId ===
      "veronica";

  return (
    <tr
      style={{
        borderBottom:
          "1px solid #ececec",
        transition:
          "background 0.2s",
      }}
    >
      {/* =================================================
          IMAGEN
      ================================================= */}

      <td
        style={{
          padding: "10px 15px",
        }}
      >
        {imagen ? (
          <img
            src={imagen}
            alt={
              producto?.nombre ||
              "Producto"
            }
            loading="lazy"
            decoding="async"
            width="65"
            height="65"
            style={{
              width: 65,
              height: 65,
              objectFit: "cover",
              borderRadius: 8,
              background: "#fff",
              padding: 4,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: 65,
              height: 65,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              borderRadius: 8,
              background:
                "#f3f4f6",
              fontSize: 24,
            }}
          >
            📷
          </div>
        )}
      </td>

      {/* =================================================
          NOMBRE
      ================================================= */}

      <td
        style={{
          padding: "10px 15px",
          fontWeight: 600,
          fontSize: 15,
          maxWidth: 500,
        }}
      >
        <div>
          {producto?.nombre ||
            "Sin nombre"}
        </div>

        {/* ---------------------------------------------
            TIPO DE PRODUCTO
        --------------------------------------------- */}

        {esProductoPropio && (
          <span
            style={{
              display:
                "inline-block",
              marginTop: 6,
              padding:
                "4px 8px",
              borderRadius: 12,
              background:
                "#eff6ff",
              color:
                "#2563eb",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            🔵 Propio
          </span>
        )}

        {!esProductoPropio &&
          producto?.tipoProducto ===
            "maestro" && (
            <span
              style={{
                display:
                  "inline-block",
                marginTop: 6,
                padding:
                  "4px 8px",
                borderRadius: 12,
                background:
                  "#f3f4f6",
                color:
                  "#4b5563",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              🟢 Maestro
            </span>
          )}
      </td>

      {/* =================================================
          CATEGORÍA
      ================================================= */}

      <td
        style={{
          padding: "10px 15px",
          color: "#555",
          fontSize: 14,
        }}
      >
        {producto?.categoria ||
          "Sin categoría"}
      </td>

      {/* =================================================
          PRECIO
      ================================================= */}

      <td
        style={{
          padding: "10px 15px",
          fontWeight: "bold",
          whiteSpace:
            "nowrap",
        }}
      >
        $
        {precio.toLocaleString(
          "es-AR"
        )}
      </td>

      {/* =================================================
          ESTADO
      ================================================= */}

      <td
        style={{
          padding: "10px 15px",
        }}
      >
        <span
          style={{
            display:
              "inline-block",
            padding:
              "6px 12px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            background: visible
              ? "#e8f8ec"
              : "#fdeaea",
            color: visible
              ? "#169c43"
              : "#d62828",
            whiteSpace:
              "nowrap",
          }}
        >
          {visible
            ? "🟢 Visible"
            : "🔴 Oculto"}
        </span>
      </td>

      {/* =================================================
          ACCIONES
      ================================================= */}

      <td
        style={{
          padding:
            "10px 15px",
          whiteSpace:
            "nowrap",
        }}
      >
        {puedeAdministrar ? (
          <>
            {/* -----------------------------------------
                OCULTAR / PUBLICAR
            ----------------------------------------- */}

            <button
              type="button"
              onClick={() =>
                onToggleVisible(
                  producto
                )
              }
              style={{
                padding:
                  "7px 12px",
                borderRadius: 6,
                border:
                  "1px solid #ddd",
                background:
                  "#fff",
                cursor:
                  "pointer",
                marginRight: 8,
              }}
            >
              {visible
                ? "🙈 Ocultar"
                : "👁️ Publicar"}
            </button>

            {/* -----------------------------------------
                DESCUBRÍ LO NUEVO
            ----------------------------------------- */}

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
                  borderRadius: 6,
                  border: producto?.nuevoIngreso === true
                    ? "1px solid #D4A72C"
                    : "1px solid #d9dee7",
                  background: producto?.nuevoIngreso === true
                    ? "#fff8df"
                    : "#fff",
                  color: producto?.nuevoIngreso === true
                    ? "#8a6500"
                    : "#475467",
                  cursor: "pointer",
                  marginRight: 8,
                  fontWeight: 700,
                }}
              >
                {producto?.nuevoIngreso === true
                  ? "★ Nuevo"
                  : "☆ Nuevo"}
              </button>
            )}

            {/* -----------------------------------------
                EDITAR
            ----------------------------------------- */}

            <Link
              to={`/admin/productos/editar/${producto.id}`}
              title="Editar producto"
              style={{
                textDecoration:
                  "none",
                fontSize: 22,
                marginRight: 12,
              }}
            >
              ✏️
            </Link>

            {/* -----------------------------------------
                ELIMINAR
            ----------------------------------------- */}

            <button
              type="button"
              onClick={() =>
                onDelete(
                  producto.id
                )
              }
              title="Eliminar producto"
              style={{
                border: "none",
                background:
                  "transparent",
                cursor:
                  "pointer",
                fontSize: 20,
              }}
            >
              🗑️
            </button>
          </>
        ) : (
          <span
            style={{
              color: "#9ca3af",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            🔒 Solo lectura
          </span>
        )}
      </td>
    </tr>
  );
}