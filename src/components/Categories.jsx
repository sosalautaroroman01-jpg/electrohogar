import "./Categories.css";

function Categories() {
  const categorias = [
    "📺 Smart TV",
    "❄ Aires",
    "🧊 Heladeras",
    "🧺 Lavarropas",
    "🍳 Cocina",
    "🔧 Herramientas",
    "📱 Celulares",
    "🛏 Hogar",
  ];

  return (
    <div className="categories">
      {categorias.map((categoria, index) => (
        <button key={index} className="category-btn">
          {categoria}
        </button>
      ))}
    </div>
  );
}

export default Categories;