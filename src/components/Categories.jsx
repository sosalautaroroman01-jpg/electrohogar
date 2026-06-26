import "./Categories.css";
import { useFilter } from "../context/FilterContext";

function Categories() {
  const { categoria, setCategoria } = useFilter();

  const categorias = [
    "Todas",
    "Smart TV",
    "Aires",
    "Heladeras",
    "Lavarropas",
    "Cocina",
    "Herramientas",
    "Celulares",
    "Hogar",
  ];

  const iconos = {
    Todas: "🏠",
    "Smart TV": "📺",
    Aires: "❄",
    Heladeras: "🧊",
    Lavarropas: "🧺",
    Cocina: "🍳",
    Herramientas: "🔧",
    Celulares: "📱",
    Hogar: "🛏",
  };

  return (
    <div className="categories">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategoria(cat)}
          className={
            categoria === cat
              ? "category-btn active"
              : "category-btn"
          }
        >
          {iconos[cat]} {cat}
        </button>
      ))}
    </div>
  );
}

export default Categories;