import { useCart } from "../context/CartContext";
import { useDollar } from "../context/DollarContext";
import { convertirPrecio } from "../utils/calcularPrecios";
import { useRevendedorPublico } from "../context/RevendedorPublicoContext";

export default function AddToCartButton({ producto }) {
  const { agregarAlCarrito } = useCart();
  const blue = useDollar();

  const {
    activo: modoRevendedor,
    revendedorId,
    porcentaje,
  } = useRevendedorPublico();

  function agregar() {
    const productoParaCarrito = {
      ...producto,

      /*
       * Precios convertidos a la moneda final
       * que utiliza actualmente el carrito.
       *
       * IMPORTANTE:
       * Todavía NO aplicamos el margen acá.
       *
       * El margen queda guardado como metadata
       * del producto para evitar aplicarlo dos veces.
       */
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

      /*
       * Información interna del modo revendedor.
       *
       * No se muestra al cliente.
       */
      esRevendedor: modoRevendedor,

      revendedorId: modoRevendedor
        ? revendedorId
        : null,

      revendedorPorcentaje: modoRevendedor
        ? porcentaje
        : 0,
    };

    agregarAlCarrito(productoParaCarrito);
  }

  return (
    <button onClick={agregar}>
      Agregar al carrito
    </button>
  );
}