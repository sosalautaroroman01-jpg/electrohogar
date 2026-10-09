import { useDollar } from "../context/DollarContext";
import {
  calcularPrecioARS,
  esProductoUSD,
} from "../utils/calcularPrecios";
import { formatearPrecio } from "../utils/formatearPrecio";
import { useRevendedorPublico } from "../context/RevendedorPublicoContext";

export default function ProductPrice({ producto }) {
  const blue = useDollar();

  const {
    activo: modoRevendedor,
    obtenerPrecioRevendedor,
  } = useRevendedorPublico();

  if (!producto) return null;

  const esUSD = esProductoUSD(producto);
  const precioBase = Number(producto?.precio) || 0;

  /*
   * El precio del revendedor se calcula SIEMPRE desde
   * RevendedorPublicoContext.
   *
   * De esta manera evitamos duplicar el porcentaje
   * dentro de este componente y garantizamos que todos
   * los productos utilicen exactamente la misma lógica.
   */
  const precioRevendedor = modoRevendedor
    ? obtenerPrecioRevendedor(producto, 1, blue)
    : precioBase;

  if (esUSD) {
    const precioARS = modoRevendedor
      ? precioRevendedor
      : calcularPrecioARS(precioBase, blue);

    /*
     * Para USD, el precio mostrado en dólares también
     * debe respetar el margen del revendedor.
     */
    const precioUSD = modoRevendedor
      ? precioRevendedor
      : precioBase;

    return (
      <>
        <p className="precio">
          {`💵 USD ${formatearPrecio(precioUSD)}`}
        </p>

        {blue && (
          <div className="precio-ars">
            🇦🇷 ${formatearPrecio(precioARS)}
            <span>ARS</span>
          </div>
        )}
      </>
    );
  }

  return (
    <p className="precio">
      ${formatearPrecio(precioRevendedor)}
    </p>
  );
}
