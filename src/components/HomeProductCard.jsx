import "./HomeProductCard.css";

import { useEffect, useState } from "react";

import ProductPrice from "./ProductPrice";
import AddToCartButton from "./AddToCartButton";


function HomeProductCard({
  producto,
  mostrarNuevo = false,
}) {

  const imagenes =
    producto.imagenes?.length > 0
      ? producto.imagenes
      : producto.imagen
      ? [producto.imagen]
      : [];

  const imagen =
    imagenes[0] || "";


  const tieneOferta =
    producto.oferta === true ||
    producto.enOferta === true;


  const esNuevo =
    producto.nuevoIngreso === true ||
    producto.nuevo === true ||
    producto.recienIngresado === true;


  const esMasVendido =
    producto.masVendido === true ||
    producto.vendido === true;


  const [zoomAbierto, setZoomAbierto] =
    useState(false);


  useEffect(() => {

    if (!zoomAbierto) return;

    const cerrarConEscape = (event) => {

      if (event.key === "Escape") {
        setZoomAbierto(false);
      }

    };

    document.addEventListener(
      "keydown",
      cerrarConEscape
    );

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener(
        "keydown",
        cerrarConEscape
      );

      document.body.style.overflow = "";

    };

  }, [zoomAbierto]);


  return (

    <>

      <article className="home-card">

        {/* =====================================================
            IMAGEN
            SIN GALERÍA INTERNA.
            UNA SOLA IMAGEN, COMO CORRESPONDE A LA VITRINA.
        ====================================================== */}

        <div className="home-card-imagen">

          {tieneOferta && (
            <span className="home-card-badge home-card-badge-oferta">
              OFERTA
            </span>
          )}


          {mostrarNuevo &&
            !tieneOferta &&
            esNuevo && (
              <span className="home-card-badge home-card-badge-nuevo">
                NUEVO
              </span>
            )}


          {!mostrarNuevo &&
            !tieneOferta &&
            esMasVendido && (
              <span className="home-card-badge home-card-badge-popular">
                MÁS VENDIDO
              </span>
            )}


          {imagen ? (

            <img
              src={imagen}
              alt={producto.nombre || "Producto"}
              loading="lazy"
              onClick={() => setZoomAbierto(true)}
              onKeyDown={(event) => {

                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  setZoomAbierto(true);
                }

              }}
              role="button"
              tabIndex={0}
              aria-label={`Ampliar imagen de ${
                producto.nombre || "producto"
              }`}
              style={{
                cursor: "zoom-in",
              }}
            />

          ) : (

            <div className="home-card-sin-imagen">
              <span>Sin imagen</span>
            </div>

          )}

        </div>


        {/* =====================================================
            INFORMACIÓN
        ====================================================== */}

        <div className="home-card-contenido">

          <h3
            title={
              producto.nombre || ""
            }
          >
            {producto.nombre ||
              "Producto"}
          </h3>


          <div className="home-card-separador" />


          <div className="home-card-precio">

            <ProductPrice
              producto={producto}
            />

          </div>


          {producto.cuotas && (
            <p className="home-card-cuotas">
              {producto.cuotas}
            </p>
          )}


          {producto.beneficio && (
            <p className="home-card-beneficio">
              {producto.beneficio}
            </p>
          )}


          <div className="home-card-accion">

            <AddToCartButton
              producto={producto}
            />

          </div>

        </div>

      </article>


      {/* =====================================================
          ZOOM DE IMAGEN
          PC + CELULAR
      ====================================================== */}

      {zoomAbierto &&
        imagen && (

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen ampliada de ${
              producto.nombre || "producto"
            }`}
            onClick={() =>
              setZoomAbierto(false)
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              boxSizing: "border-box",
              background:
                "rgba(3, 10, 16, .82)",
              backdropFilter:
                "blur(7px)",
              WebkitBackdropFilter:
                "blur(7px)",
              cursor: "zoom-out",
            }}
          >

            <button
              type="button"
              aria-label="Cerrar imagen ampliada"
              onClick={(event) => {

                event.stopPropagation();
                setZoomAbierto(false);

              }}
              style={{
                position: "fixed",
                top: "18px",
                right: "22px",
                zIndex: 100000,
                width: "42px",
                height: "42px",
                border: 0,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,.95)",
                color: "#111827",
                fontSize: "28px",
                lineHeight: "42px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,.25)",
              }}
            >
              ×
            </button>


            <img
              src={imagen}
              alt={
                producto.nombre ||
                "Producto"
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              style={{
                display: "block",
                width: "auto",
                height: "auto",
                maxWidth: "92vw",
                maxHeight: "88vh",
                objectFit: "contain",
                borderRadius: "12px",
                background: "#fff",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,.40)",
                cursor: "default",
              }}
            />

          </div>

        )}

    </>

  );

}


export default HomeProductCard;
