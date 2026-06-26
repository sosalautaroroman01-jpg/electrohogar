import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function ProductItem({ producto, actualizar }) {

  async function eliminarProducto() {

    const confirmar = window.confirm(
      `¿Eliminar ${producto.nombre}?`
    );

    if (!confirmar) return;

    await deleteDoc(doc(db, "productos", producto.id));

    actualizar();
  }

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
        boxShadow: "0 4px 12px rgba(0,0,0,.08)"
      }}
    >

      {producto.imagen && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />
      )}

      <div style={{ flex: 1 }}>

        <h3>{producto.nombre}</h3>

        <p>
          <strong>$ {producto.precio.toLocaleString()}</strong>
        </p>

        <p>{producto.descripcion}</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

          <button>
            ✏️ Editar
          </button>

          <button onClick={eliminarProducto}>
            🗑 Eliminar
          </button>

        </div>

      </div>

    </div>

  );
}

export default ProductItem;