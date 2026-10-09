import "./ProductCard.css";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useDollar } from "../context/DollarContext";
import { useRevendedorPublico } from "../context/RevendedorPublicoContext";

function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCart();
  const blue = useDollar();

  const {
    activo: modoRevendedor,
    porcentaje,
    obtenerPrecioRevendedor,
  } = useRevendedorPublico();

  const precioBase = Number(producto?.precio) || 0;
  const esUSD = (producto.moneda || "ARS") === "USD";
  const porcentajeRevendedor = Number(porcentaje) || 0;

  function precioUSDConMargen(valor) {
    const precio = Number(valor) || 0;

    if (!modoRevendedor) {
      return precio;
    }

    return precio * (1 + porcentajeRevendedor / 100);
  }

  function precioARSParaCantidad(cantidad = 1) {
    // Tomar el precio específico por cantidad cuando existe.
    // Antes, en el catálogo general se devolvía siempre precioBase
    // para clientes normales, por eso x3 y x6 repetían el precio unitario.
    const precioPorCantidad =
      cantidad > 1 && Number(producto?.[`precio${cantidad}`]) > 0
        ? Number(producto[`precio${cantidad}`])
        : precioBase;

    if (!modoRevendedor) {
      if (esUSD) {
        return Math.round(
          precioPorCantidad * Number(blue?.venta || 0)
        );
      }

      return precioPorCantidad;
    }

    return obtenerPrecioRevendedor(
      producto,
      cantidad,
      blue
    );
  }

  const imagenes =
    producto.imagenes?.length > 0
      ? producto.imagenes
      : producto.imagen
      ? [producto.imagen]
      : [];

  const video = producto.video || "";

  const total = imagenes.length + (video ? 1 : 0);
const [imagenActual, setImagenActual] = useState(0);
const [imagenAbierta, setImagenAbierta] = useState(false);

const [descripcionModal, setDescripcionModal] =
  useState(false);

  useEffect(() => {
    function manejarTeclas(e) {
      if (!imagenAbierta) return;

      switch (e.key) {
        case "Escape":
          setImagenAbierta(false);
          break;

        case "ArrowRight":
          if (total > 1) {
            setImagenActual((prev) =>
              prev === total - 1 ? 0 : prev + 1
            );
          }
          break;

        case "ArrowLeft":
          if (total > 1) {
            setImagenActual((prev) =>
              prev === 0 ? total - 1 : prev - 1
            );
          }
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", manejarTeclas);

return () => {
  window.removeEventListener(
    "keydown",
    manejarTeclas
  );
};
}, [imagenAbierta, total]);

function siguienteImagen(e) {
  e?.stopPropagation();

  if (total <= 1) return;

  setImagenActual((prev) =>
    prev === total - 1 ? 0 : prev + 1
  );
}

function anteriorImagen(e) {
  e?.stopPropagation();

  if (total <= 1) return;

  setImagenActual((prev) =>
    prev === 0 ? total - 1 : prev - 1
  );
}

return (
    <>
<div className="product-card">

{(producto.nuevo || producto.badge || producto.etiqueta) && (
  <div className="card-top-badges">
    <span className="card-badge card-badge--nuevo">
      {producto.badge || producto.etiqueta || "NUEVO"}
    </span>
  </div>
)}

<div className="image-container">
         <div className="image-box">

              {video &&
              imagenActual === imagenes.length ? (
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
                  onClick={() =>
                    setImagenAbierta(true)
                  }
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

</div>

<div className="card-body">

          <h3>{producto.nombre}</h3>

  <p className="precio">
    {esUSD
      ? `💵 USD ${precioUSDConMargen(precioBase).toLocaleString(
          "es-AR",
          { maximumFractionDigits: 0 }
        )}`
      : `$${Math.round(
          precioARSParaCantidad(1)
        ).toLocaleString("es-AR")}`}
  </p>

{esUSD && blue && (
  <div className="precio-ars">
    🇦🇷 $
    {Math.round(
      precioARSParaCantidad(1)
    ).toLocaleString("es-AR")}
    <span>ARS</span>
  </div>
)}

          {(producto.precio2 ||
  producto.precio3 ||
  producto.precio6 ||
  producto.precio9 ||
  producto.precio12) && (
    <div className="product-wholesale-area">
      <div
        className="product-wholesale-box"
        style={{
          marginBottom: "15px",
          background: "#f3fff5",
          border: "1px solid #16a34a",
          borderRadius: "10px",
          padding: "10px",
          fontSize: "14px",
        }}
      >
  {producto.precio2 > 0 && (
    <div>
      🔥 <strong>x2:</strong>{" "}
      {(producto.moneda || "ARS") === "USD" ? "USD " : "$"}
      {(esUSD
        ? precioUSDConMargen(producto.precio2)
        : precioARSParaCantidad(2)
      ).toLocaleString(
        "es-AR",
        { maximumFractionDigits: 0 }
      )}
    </div>
  )}

  {producto.precio3 > 0 && (
    <div>
      🔥 <strong>x3:</strong>{" "}
      {(producto.moneda || "ARS") === "USD" ? "USD " : "$"}
      {(esUSD
        ? precioUSDConMargen(producto.precio3)
        : precioARSParaCantidad(3)
      ).toLocaleString(
        "es-AR",
        { maximumFractionDigits: 0 }
      )}
    </div>
  )}

  {producto.precio6 > 0 && (
    <div>
      🔥 <strong>x6:</strong>{" "}
      {(producto.moneda || "ARS") === "USD" ? "USD " : "$"}
      {(esUSD
        ? precioUSDConMargen(producto.precio6)
        : precioARSParaCantidad(6)
      ).toLocaleString(
        "es-AR",
        { maximumFractionDigits: 0 }
      )}
    </div>
  )}

  {producto.precio9 > 0 && (
    <div>
      🔥 <strong>x9:</strong>{" "}
      {(producto.moneda || "ARS") === "USD" ? "USD " : "$"}
      {(esUSD
        ? precioUSDConMargen(producto.precio9)
        : precioARSParaCantidad(9)
      ).toLocaleString(
        "es-AR",
        { maximumFractionDigits: 0 }
      )}
    </div>
  )}

  {producto.precio12 > 0 && (
    <div>
      🔥 <strong>x12:</strong>{" "}
      {(producto.moneda || "ARS") === "USD" ? "USD " : "$"}
      {(esUSD
        ? precioUSDConMargen(producto.precio12)
        : precioARSParaCantidad(12)
      ).toLocaleString(
        "es-AR",
        { maximumFractionDigits: 0 }
      )}
    </div>
  )}
      </div>
    </div>
)}

{producto.descripcion?.trim() && (
  <button
    className="info-btn"
    onClick={() => setDescripcionModal(true)}
  >
    ⓘ Ver información
  </button>
)}

<div className="product-cart-area">
  <button
    type="button"
    className="product-add-cart-btn"
    onClick={() =>
      agregarAlCarrito({
      ...producto,

      precio: modoRevendedor
        ? precioARSParaCantidad(1)
        : esUSD
          ? Math.round(
              Number(producto.precio || 0) *
                Number(blue?.venta || 0)
            )
          : producto.precio,

      precio2: modoRevendedor
        ? Number(producto.precio2) > 0
          ? precioARSParaCantidad(2)
          : producto.precio2
        : esUSD && Number(producto.precio2) > 0
          ? Math.round(
              Number(producto.precio2) *
                Number(blue?.venta || 0)
            )
          : producto.precio2,

      precio3: modoRevendedor
        ? Number(producto.precio3) > 0
          ? precioARSParaCantidad(3)
          : producto.precio3
        : esUSD && Number(producto.precio3) > 0
          ? Math.round(
              Number(producto.precio3) *
                Number(blue?.venta || 0)
            )
          : producto.precio3,

      precio6: modoRevendedor
        ? Number(producto.precio6) > 0
          ? precioARSParaCantidad(6)
          : producto.precio6
        : esUSD && Number(producto.precio6) > 0
          ? Math.round(
              Number(producto.precio6) *
                Number(blue?.venta || 0)
            )
          : producto.precio6,

      precio9: modoRevendedor
        ? Number(producto.precio9) > 0
          ? precioARSParaCantidad(9)
          : producto.precio9
        : esUSD && Number(producto.precio9) > 0
          ? Math.round(
              Number(producto.precio9) *
                Number(blue?.venta || 0)
            )
          : producto.precio9,

      precio12: modoRevendedor
        ? Number(producto.precio12) > 0
          ? precioARSParaCantidad(12)
          : producto.precio12
        : esUSD && Number(producto.precio12) > 0
          ? Math.round(
              Number(producto.precio12) *
                Number(blue?.venta || 0)
            )
          : producto.precio12,
    })
  }
  >
    Agregar al carrito
  </button>
</div>

</div>

{descripcionModal && producto.descripcion?.trim() && (
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
)}

{imagenAbierta && (
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
    <source src={video} type="video/mp4" />
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
    </div>
  </div>
)}

</div>
</>
);
}

export default ProductCard;