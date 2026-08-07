import "./Categories.css";
import { useState } from "react";
import { useFilter } from "../context/FilterContext";

function Categories() {
  const {
    categoria,
    setCategoria,
    busqueda,
    setBusqueda,
    marca,
    setMarca,
    subcategoria,
    setSubcategoria,
    medida,
    setMedida,
  } = useFilter();

  const [mostrarTodas, setMostrarTodas] = useState(false);

  const categorias = [
    "Todas",
    "Smart TV",
    "Celulares",
    "Perfumes",
    "Audio",
    "Entretenimiento",
    "Aires",
    "Heladeras",
    "Freezers",
    "Lavarropas",
    "Cocina",
    "Accesorios de Cocina",
    "Pequeños Electros",
    "Botellas y Térmicos",
    "Belleza y Cuidado",
    "Limpieza",
    "Jardín",
    "Calefacción",
    "Termotanques",
    "Herramientas",
    "Iluminación",
    "Cámaras de Seguridad",
    "Hogar",
    "Blanquería",
  ];

  const principales = [
    "Todas",
    "Smart TV",
    "Celulares",
    "Perfumes",
    "Audio",
    "Aires",
    "Heladeras",
    "Cocina",
    "Herramientas",
    "Blanquería",
  ];

  const iconos = {
    Todas: "🏠",
    "Smart TV": "📺",
    Celulares: "📱",
    Perfumes: "🌸",
    Audio: "🔊",
    Entretenimiento: "🎮",
    Aires: "❄️",
    Heladeras: "🧊",
    Freezers: "🥶",
    Lavarropas: "🧺",
    Cocina: "🍳",
    "Accesorios de Cocina": "🍽️",
    "Pequeños Electros": "⚡",
    "Botellas y Térmicos": "🥤",
    "Belleza y Cuidado": "💇",
    Limpieza: "🧹",
    Jardín: "🌿",
    Calefacción: "🔥",
    Termotanques: "🚿",
    Herramientas: "🛠️",
    Iluminación: "💡",
    "Cámaras de Seguridad": "📹",
    Hogar: "🛋️",
    Blanquería: "🛏️",
  };

  const marcasCelulares = [
    "Todas",
    "Samsung",
    "Motorola",
    "iPhone",
    "Xiaomi",
  ];

  const subcategoriasBlanqueria = [
    "Todas",
    "Sábanas",
    "Almohadas",
    "Frazadas",
    "Acolchados",
    "Alfombras y Cortinas",
    "Toallas",
  ];

  const medidasBlanqueria = [
    "Todas",
    "1½ Plaza",
    "2½ Plazas",
    "King",
  ];

  function seleccionarCategoria(cat) {
    setBusqueda("");
    setCategoria(cat);
    setMarca("Todas");
    setSubcategoria("Todas");
    setMedida("Todas");
  }

  const lista = mostrarTodas ? categorias : principales;

  return (
    <>
      <div className="categories">
        {lista.map((cat) => (
          <button
            key={cat}
            onClick={() => seleccionarCategoria(cat)}
            className={
              categoria === cat
                ? "category-btn active"
                : "category-btn"
            }
          >
            <span>{iconos[cat]}</span>
            <span>{cat}</span>
          </button>
        ))}

        {!mostrarTodas && (
          <button
            className="category-btn"
            onClick={() => setMostrarTodas(true)}
          >
            ➕ Más
          </button>
        )}
      </div>

      {mostrarTodas && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <button
            className="category-btn"
            onClick={() => setMostrarTodas(false)}
          >
            ▲ Mostrar menos
          </button>
        </div>
      )}

      {categoria === "Celulares" && (
        <div
          className="categories"
          style={{ marginTop: "14px" }}
        >
          {marcasCelulares.map((item) => (
            <button
              key={item}
              onClick={() => setMarca(item)}
              className={
                marca === item
                  ? "category-btn active"
                  : "category-btn"
              }
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {categoria === "Blanquería" && (
        <div
          className="categories"
          style={{ marginTop: "14px" }}
        >
          {subcategoriasBlanqueria.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSubcategoria(item);
                setMedida("Todas");
              }}
              className={
                subcategoria === item
                  ? "category-btn active"
                  : "category-btn"
              }
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {categoria === "Blanquería" &&
        ["Sábanas", "Frazadas", "Acolchados"].includes(subcategoria) && (
          <div
            className="categories"
            style={{ marginTop: "14px" }}
          >
            {medidasBlanqueria.map((item) => (
              <button
                key={item}
                onClick={() => setMedida(item)}
                className={
                  medida === item
                    ? "category-btn active"
                    : "category-btn"
                }
              >
                {item}
              </button>
            ))}
          </div>
      )}
    </>
  );
}

export default Categories;