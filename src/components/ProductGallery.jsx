import { useEffect, useRef, useState } from "react";
import ProductTooltip from "./ProductTooltip";

/*
  CARGA PEREZOSA REAL

  Importante:
  No usamos solamente loading="lazy".
  Mientras una imagen no esté cerca del viewport,
  NO tiene src y por lo tanto el navegador NO la descarga.

  Esto evita que el catálogo entero descargue cientos
  de imágenes apenas se abre la página.
*/
function LazyImage({
  src,
  alt = "",
  className = "",
  onClick,
  rootMargin = "400px 0px",
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const elemento = ref.current;

    if (!elemento) return;

    // Si el navegador no soporta IntersectionObserver,
    // cargamos la imagen normalmente como respaldo.
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(elemento);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <img
      ref={ref}
      src={visible ? src : undefined}
      alt={alt}
      className={className}
      onClick={onClick}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

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
  const [mostrarTooltip, setMostrarTooltip] =
    useState(false);

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

  const mostrandoVideo =
    Boolean(video) &&
    imagenActual === imagenes.length;

  const imagenActualSrc =
    imagenes[imagenActual] || "";

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
        {mostrandoVideo ? (
          <video
            className="card-img"
            controls
            playsInline
            preload="none"
            poster={imagenes[0] || undefined}
          >
            <source
              src={video}
              type="video/mp4"
            />
          </video>
        ) : (
          <LazyImage
            src={imagenActualSrc}
            alt={producto.nombre || "Producto"}
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
            type="button"
            aria-label="Imagen anterior"
          >
            ❮
          </button>

          <button
            className="image-arrow right"
            onClick={siguienteImagen}
            type="button"
            aria-label="Imagen siguiente"
          >
            ❯
          </button>

          <div className="image-counter">
            {imagenActual + 1} / {total}
          </div>

          <div className="thumbnail-strip">
            {imagenes.map((img, index) => (
              <LazyImage
                key={index}
                src={img}
                alt=""
                rootMargin="150px 0px"
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
                role="button"
                tabIndex={0}
                aria-label="Ver video"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    e.preventDefault();
                    setImagenActual(
                      imagenes.length
                    );
                  }
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
