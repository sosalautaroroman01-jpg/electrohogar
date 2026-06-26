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
          ${producto.precio.toLocaleString("es-AR")}
        </p>

        <button
          onClick={() => agregarAlCarrito(producto)}
        >
          🛒 Agregar al carrito
        </button>

      </div>

    </div>
  );
}

export default ProductCard;