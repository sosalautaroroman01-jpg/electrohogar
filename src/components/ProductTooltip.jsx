export default function ProductTooltip({
  mostrar,
  descripcion,
  iniciarHover,
  salirHover,
}) {
  if (!mostrar || !descripcion?.trim()) {
    return null;
  }

  return (
    <div
      className="descripcion-tooltip"
      onMouseEnter={iniciarHover}
      onMouseLeave={salirHover}
    >
      <h4>📝 Información</h4>

      <p>{descripcion}</p>
    </div>
  );
}