import { useRef, useState } from "react";
import ProductTooltip from "./ProductTooltip";

export default function ProductGallery({
  producto,
  imagenes,
  video,
  total,
  imagenActual,
  setImagenActual,
  setImagenAbierta,
  anteriorImagen,
  siguienteImagen,
}) {
  const [mostrarTooltip, setMostrarTooltip] = useState(false);

  const hoverTimeout = useRef(null);

  function iniciarHover() {
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setMostrarTooltip(true);
    }, 2000);
  }

  function salirHover() {
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setMostrarTooltip(false);
    }, 150);
  }

  function mantenerTooltip() {
    clearTimeout(hoverTimeout.current);
    setMostrarTooltip(true);
  }

  return (
    <div
      className="image-container"
      onMouseEnter={iniciarHover}
      onMouseLeave={salirHover}
      style={{
        overflow: "visible",
        paddingLeft: "28px",
        paddingRight: "28px",
      }}
    >
      <div className="image-box">
        {video && imagenActual === imagenes.length ? (
          <video
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
            src={imagenes[imagenActual]}
            alt={producto.nombre}
            className="card-img"
            onClick={() => setImagenAbierta(true)}
          />
        )}
      </div>

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
                onClick={() => setImagenActual(index)}
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

      <ProductTooltip
        mostrar={mostrarTooltip}
        descripcion={producto.descripcion}
        iniciarHover={mantenerTooltip}
        salirHover={salirHover}
      />
    </div>
  );
}