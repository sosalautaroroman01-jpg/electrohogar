import "./FloatingCart.css";
import { useCart } from "../context/CartContext";

function FloatingCart() {
  const { carrito, setAbierto } = useCart();

  const cantidad = carrito.reduce(
    (acum, item) => acum + Number(item.cantidad),
    0
  );

  return (
    <button
      className="floating-cart"
      onClick={() => setAbierto((prev) => !prev)}
    >
      🛒

      {cantidad > 0 && (
        <span className="floating-cart-badge">
          {cantidad}
        </span>
      )}
    </button>
  );
}

export default FloatingCart;