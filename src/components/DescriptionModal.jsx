export default function DescriptionModal({
  descripcionModal,
  setDescripcionModal,
  producto,
}) {
  if (!descripcionModal || !producto.descripcion?.trim()) {
    return null;
  }

  return (
    <div
      className="descripcion-modal"
      onClick={() => setDescripcionModal(false)}
    >
      <div
        className="descripcion-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-image"
          onClick={() => setDescripcionModal(false)}
        >
          ✕
        </button>

        <h2>{producto.nombre}</h2>

        <p>{producto.descripcion}</p>
      </div>
    </div>
  );
}