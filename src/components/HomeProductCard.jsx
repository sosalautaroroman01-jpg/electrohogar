import "./HomeProductCard.css";

import ProductPrice from "./ProductPrice";

function HomeProductCard({ producto }) {
  const imagenes =
    producto.imagenes?.length > 0
      ? producto.imagenes
      : producto.imagen
      ? [producto.imagen]
      : [];

  const imagen = imagenes[0] || "";

  const tieneOferta =
    producto.oferta === true || producto.enOferta === true;

  const esNuevo =
    producto.nuevoIngreso === true ||
    producto.nuevo === true ||
    producto.recienIngresado === true;

  const esMasVendido =
    producto.masVendido === true ||
    producto.vendido === true;

  return (
    <article className="home-card">
      <div className="home-card-imagen">
        {tieneOferta && (
          <span className="home-card-badge">OFERTA</span>
        )}

        {!tieneOferta && esNuevo && (
          <span className="home-card-badge home-card-badge-nuevo">
            NUEVO
          </span>
        )}

        {!tieneOferta && !esNuevo && esMasVendido && (
          <span className="home-card-badge home-card-badge-popular">
            MÁS VENDIDO
          </span>
        )}

        {imagen ? (
          <img
            src={imagen}
            alt={producto.nombre || "Producto"}
            loading="lazy"
          />
        ) : (
          <div className="home-card-sin-imagen">
            Sin imagen
          </div>
        )}
      </div>

      <div className="home-card-contenido">
        <h3 title={producto.nombre || ""}>
          {producto.nombre || "Producto"}
        </h3>

        <div className="home-card-precio">
          <ProductPrice producto={producto} />
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
      </div>
    </article>
  );
}

export default HomeProductCard;
