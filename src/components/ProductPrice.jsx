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
    porcentaje,
    obtenerPrecioRevendedor,
  } = useRevendedorPublico();

  const esUSD = esProductoUSD(producto);
  const precioBase = Number(producto?.precio) || 0;
  const precioFinal = modoRevendedor
    ? precioBase *
      (1 + (Number(porcentaje) || 0) / 100)
    : precioBase;

  if (esUSD) {
    const precioARS = modoRevendedor
      ? obtenerPrecioRevendedor(producto, 1, blue)
      : calcularPrecioARS(precioBase, blue);

    return (
      <>
        <p className="precio">
          {`💵 USD ${formatearPrecio(precioFinal)}`}
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

  const precioARS = modoRevendedor
    ? obtenerPrecioRevendedor(producto, 1, blue)
    : precioBase;

  return (
    <p className="precio">
      ${formatearPrecio(precioARS)}
    </p>
  );
}
