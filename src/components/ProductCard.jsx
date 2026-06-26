import "./ProductCard.css";
import { useCart } from "../context/CartContext";

function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCart();

  return (
    <div className="card">
      {producto.imagen && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="card-img"
        />
      )}

      <div className="card-body">
        <h3>{producto.nombre}</h3>

        <p className="precio">
          💰 ${Number(producto.precio || 0).toLocaleString("es-AR")}
        </p>

        {(producto.precio3 || producto.precio6 || producto.precio9 || producto.precio12) && (
          <div
            style={{
              marginBottom: "15px",
              background: "#f3fff5",
              border: "1px solid #16a34a",
              borderRadius: "10px",
              padding: "10px",
              fontSize: "14px",
            }}
          >
            {producto.precio3 > 0 && (
              <div>
                🔥 <strong>x3:</strong> $
                {Number(producto.precio3).toLocaleString("es-AR")}
              </div>
            )}

            {producto.precio6 > 0 && (
              <div>
                🔥 <strong>x6:</strong> $
                {Number(producto.precio6).toLocaleString("es-AR")}
              </div>
            )}

            {producto.precio9 > 0 && (
              <div>
                🔥 <strong>x9:</strong> $
                {Number(producto.precio9).toLocaleString("es-AR")}
              </div>
            )}

            {producto.precio12 > 0 && (
              <div>
                🔥 <strong>x12:</strong> $
                {Number(producto.precio12).toLocaleString("es-AR")}
              </div>
            )}
          </div>
        )}

        <button onClick={() => agregarAlCarrito(producto)}>
          🛒 Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;