import { useCart } from "../context/CartContext";
import { useDollar } from "../context/DollarContext";
import { convertirPrecio } from "../utils/calcularPrecios";

export default function AddToCartButton({ producto }) {
  const { agregarAlCarrito } = useCart();
  const blue = useDollar();

  function agregar() {
    agregarAlCarrito({
      ...producto,

      precio: convertirPrecio(
        producto.precio,
        producto,
        blue
      ),

      precio2: convertirPrecio(
        producto.precio2,
        producto,
        blue
      ),

      precio3: convertirPrecio(
        producto.precio3,
        producto,
        blue
      ),

      precio6: convertirPrecio(
        producto.precio6,
        producto,
        blue
      ),

      precio9: convertirPrecio(
        producto.precio9,
        producto,
        blue
      ),

      precio12: convertirPrecio(
        producto.precio12,
        producto,
        blue
      ),
    });
  }

  return (
    <button onClick={agregar}>
      Agregar al carrito
    </button>
  );
}