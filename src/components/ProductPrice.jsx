import { useDollar } from "../context/DollarContext";
import {
  calcularPrecioARS,
  esProductoUSD,
} from "../utils/calcularPrecios";
import { formatearPrecio } from "../utils/formatearPrecio";

export default function ProductPrice({ producto }) {
  const blue = useDollar();

  const esUSD = esProductoUSD(producto);

  return (
    <>
      <p className="precio">
        {esUSD
          ? `💵 USD ${formatearPrecio(producto.precio)}`
          : `$${formatearPrecio(producto.precio)}`}
      </p>

      {esUSD && blue && (
        <div className="precio-ars">
          🇦🇷 $
          {formatearPrecio(
            calcularPrecioARS(
              producto.precio,
              blue
            )
          )}
          <span>ARS</span>
        </div>
      )}
    </>
  );
}