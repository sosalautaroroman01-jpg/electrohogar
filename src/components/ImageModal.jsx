export default function ImageModal({
  imagenAbierta,
  setImagenAbierta,
  producto,
  imagenes,
  video,
  imagenActual,
  total,
  anteriorImagen,
  siguienteImagen,
  setImagenActual,
}) {
  if (!imagenAbierta) return null;

  return (
    <div
      className="image-modal"
      onClick={() => setImagenAbierta(false)}
    >
      <div
        className="image-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-image"
          onClick={() => setImagenAbierta(false)}
        >
          ✕
        </button>

        {video && imagenActual === imagenes.length ? (
          <video
            key="video"
            className="card-img"
            controls
            playsInline
          >
            <source
              src={video}
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            key={imagenes[imagenActual]}
            src={imagenes[imagenActual]}
            alt={producto.nombre}
            className="image-preview"
          />
        )}

        {total > 1 && (
          <>
            <button
              className="image-arrow left"
              onClick={anteriorImagen}
            >
              ❮
            </button>

            <button
              className="image-arrow right"
              onClick={siguienteImagen}
            >
              ❯
            </button>

            <div className="image-counter">
              {imagenActual + 1} / {total}
            </div>

            <div className="thumbnail-strip">
              {imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className={
                    imagenActual === index
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() =>
                    setImagenActual(index)
                  }
                />
              ))}

              {video && (
                <div
                  className={
                    imagenActual === imagenes.length
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() =>
                    setImagenActual(imagenes.length)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    cursor: "pointer",
                  }}
                >
                  🎥
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}