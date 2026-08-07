export function calcularPrecioARS(precio, blue) {
  return Math.round(
    Number(precio || 0) * Number(blue?.venta || 0)
  );
}

export function esProductoUSD(producto) {
  return (producto.moneda || "ARS") === "USD";
}

export function convertirPrecio(precio, producto, blue) {
  if (!esProductoUSD(producto)) {
    return precio;
  }

  if (Number(precio) <= 0) {
    return precio;
  }

  return calcularPrecioARS(precio, blue);
}