import "./ProductCard.css";
import { useState, useEffect } from "react";

import AddToCartButton from "./AddToCartButton";
import ProductGallery from "./ProductGallery";
import ProductPrice from "./ProductPrice";
import WholesalePrices from "./WholesalePrices";
import DescriptionModal from "./DescriptionModal";
import ImageModal from "./ImageModal";

function ProductCard({ producto }) {

  const imagenes =
    producto.imagenes?.length > 0
      ? producto.imagenes
      : producto.imagen
      ? [producto.imagen]
      : [];

  const video = producto.video || "";

  const total = imagenes.length + (video ? 1 : 0);

  const [imagenActual, setImagenActual] =
    useState(0);

  const [imagenAbierta, setImagenAbierta] =
    useState(false);

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

    window.addEventListener(
      "keydown",
      manejarTeclas
    );

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
      <div className="card">
        <ProductGallery
          producto={producto}
          imagenes={imagenes}
          video={video}
          total={total}
          imagenActual={imagenActual}
          setImagenActual={setImagenActual}
          setImagenAbierta={setImagenAbierta}
          siguienteImagen={siguienteImagen}
          anteriorImagen={anteriorImagen}
        />

        <div className="card-body">
          <h3>{producto.nombre}</h3>

<ProductPrice producto={producto} />

          <WholesalePrices
            producto={producto}
          />

          {producto.descripcion?.trim() && (
            <button
              className="info-btn"
              onClick={() => setDescripcionModal(true)}
            >
              ⓘ Info
            </button>
          )}

          <AddToCartButton producto={producto} />
        </div>
      </div>

      <DescriptionModal
        descripcionModal={descripcionModal}
        setDescripcionModal={setDescripcionModal}
        producto={producto}
      />

      <ImageModal
        imagenAbierta={imagenAbierta}
        setImagenAbierta={setImagenAbierta}
        producto={producto}
        imagenes={imagenes}
        video={video}
        imagenActual={imagenActual}
        total={total}
        anteriorImagen={anteriorImagen}
        siguienteImagen={siguienteImagen}
        setImagenActual={setImagenActual}
      />
    </>
  );
}

export default ProductCard;