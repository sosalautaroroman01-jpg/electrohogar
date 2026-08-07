export function formatearPrecio(valor) {
  return Number(valor || 0).toLocaleString("es-AR");
}