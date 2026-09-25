import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function ProductItem({ producto, actualizar }) {
  // =========================================================
  // ELIMINAR PRODUCTO
  // =========================================================
  async function eliminarProducto() {
    const confirmar = window.confirm(
      `¿Eliminar ${producto.nombre}?`
    );

    if (!confirmar) return;

    try {
      await deleteDoc(
        doc(db, "productos", producto.id)
      );

      actualizar();
    } catch (error) {
      console.error(
        "Error al eliminar el producto:",
        error
      );

      alert(
        "No se pudo eliminar el producto. Intentá nuevamente."
      );
    }
  }

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "15px",
        marginBottom: "20px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* =====================================================
          IMAGEN
      ===================================================== */}
      {producto.imagen && (
        <img
          src={producto.imagen}
          alt={producto.nombre || "Producto"}
          loading="lazy"
          decoding="async"
          width="120"
          height="120"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "10px",
            display: "block",
          }}
        />
      )}

      {/* =====================================================
          INFORMACIÓN
      ===================================================== */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <h3>{producto.nombre}</h3>

        <p>
          <strong>
            ${" "}
            {Number(producto.precio || 0).toLocaleString()}
          </strong>
        </p>

        <p>{producto.descripcion}</p>

        {/* ===================================================
            ACCIONES
        =================================================== */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <button type="button">
            ✏️ Editar
          </button>

          <button
            type="button"
            onClick={eliminarProducto}
          >
            🗑 Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;