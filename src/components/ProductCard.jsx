import "./ProductCard.css";
function ProductCard({ producto }) {
  return (
    <div className="card">

      {producto.imagen && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="card-img"
        />
      )}

      <div className="card-body">
        <h3>{producto.nombre}</h3>

        <p className="precio">
          ${producto.precio.toLocaleString("es-AR")}
        </p>

        <button>
          🛒 Agregar al carrito
        </button>
      </div>

    </div>
  );
}

export default ProductCard;