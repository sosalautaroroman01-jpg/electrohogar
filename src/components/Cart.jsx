import "./Cart.css";
import { useCart } from "../context/CartContext";

const vendedores = [
  {
    nombre: "Lautaro",
    numero: "5491131631518",
  },
  {
    nombre: "Milagros",
    numero: "5491144207460",
  },
];

function Cart() {
  const {
    carrito,
    abierto,
    setAbierto,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    total,
  } = useCart();

  function enviarWhatsApp(numero) {
    let mensaje = "Hola Electro Hogar 👋%0A%0A";
    mensaje += "Quiero consultar por los siguientes productos:%0A%0A";

    carrito.forEach((producto) => {
      mensaje += `• ${producto.nombre}%0A`;
      mensaje += `Cantidad: ${producto.cantidad}%0A`;
      mensaje += `Precio: $${producto.precio.toLocaleString("es-AR")}%0A%0A`;
    });

    mensaje += `💰 Total: $${total.toLocaleString("es-AR")}`;

    window.open(
      `https://wa.me/${numero}?text=${mensaje}`,
      "_blank"
    );
  }

  if (!abierto) return null;

  return (
    <div
      className="cart-overlay"
      onClick={() => setAbierto(false)}
    >
      <div
        className="cart-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-header">
          <h2>🛒 Mi carrito</h2>

          <button onClick={() => setAbierto(false)}>
            ✖
          </button>
        </div>

        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            {carrito.map((producto) => (
              <div
                key={producto.id}
                className="cart-item"
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                />

                <div className="cart-info">
                  <h4>{producto.nombre}</h4>

                  <p>
                    $
                    {producto.precio.toLocaleString("es-AR")}
                  </p>

                  <div className="cart-controls">
                    <button
                      onClick={() =>
                        disminuirCantidad(producto.id)
                      }
                    >
                      −
                    </button>

                    <span>{producto.cantidad}</span>

                    <button
                      onClick={() =>
                        aumentarCantidad(producto.id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      eliminarProducto(producto.id)
                    }
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            ))}

            <h2 className="cart-total">
              Total: $
              {total.toLocaleString("es-AR")}
            </h2>

            <h3
              style={{
                marginTop: "25px",
                marginBottom: "15px",
              }}
            >
              👨‍💼 Elegí un asesor
            </h3>

            {vendedores.map((vendedor) => (
              <button
                key={vendedor.numero}
                className="whatsapp-btn"
                onClick={() =>
                  enviarWhatsApp(vendedor.numero)
                }
              >
                🟢 Hablar con {vendedor.nombre}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;