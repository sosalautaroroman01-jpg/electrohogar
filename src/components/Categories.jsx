import "./Categories.css";
import { useState } from "react";
import { useFilter } from "../context/FilterContext";

function CategoryIcon({ name }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    tv: (
      <>
        <rect x="3" y="5" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </>
    ),
    phone: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
        <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
        <path d="m5 14 .5 1.5L7 16l-1.5.5L5 18l-.5-1.5L3 16l1.5-.5L5 14Z" />
      </>
    ),
    volume: (
      <>
        <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
        <path d="M16 9.5a4 4 0 0 1 0 5" />
        <path d="M18.5 7a8 8 0 0 1 0 10" />
      </>
    ),
    gamepad: (
      <>
        <path d="M7 8h10a4 4 0 0 1 3.8 5l-1 3.2a2.5 2.5 0 0 1-4.5.6L14 15h-4l-1.3 1.8a2.5 2.5 0 0 1-4.5-.6l-1-3.2A4 4 0 0 1 7 8Z" />
        <path d="M7 11v4M5 13h4M16.5 12.5h.01M19 14.5h.01" />
      </>
    ),
    snowflake: (
      <>
        <path d="M12 2v20M4.9 6l14.2 12M4.9 18 19.1 6" />
        <path d="m8 4 4 3 4-3M8 20l4-3 4 3M3.5 10l4.5 2-4.5 2M20.5 10 16 12l4.5 2" />
      </>
    ),
    refrigerator: (
      <>
        <rect x="6" y="2.5" width="12" height="19" rx="2" />
        <path d="M6 10h12M9 6v2M9 13v3" />
      </>
    ),
    washer: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <circle cx="12" cy="13" r="5" />
        <path d="M7 6h.01M10 6h.01" />
      </>
    ),
    utensils: (
      <>
        <path d="M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11" />
        <path d="M16 3v18M16 3c2 2 3 4 3 6h-3" />
      </>
    ),
    zap: (
      <>
        <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />
      </>
    ),
    bottle: (
      <>
        <path d="M9 3h6M10 3v4l-2 3v9a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-9l-2-3V3" />
        <path d="M8 12h8" />
      </>
    ),
    scissors: (
      <>
        <circle cx="6" cy="7" r="2.5" />
        <circle cx="6" cy="17" r="2.5" />
        <path d="m8 8.5 11 8M8 15.5 19 7" />
      </>
    ),
    broom: (
      <>
        <path d="m15 3 6 6M13 5l6 6M4 21l7-7" />
        <path d="m3 18 5 3 7-7-5-3-7 7Z" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4C10 4 4 9 4 17c0 2 1 3 3 3 8 0 13-6 13-16Z" />
        <path d="M4 20c3-5 7-8 12-10" />
      </>
    ),
    flame: (
      <path d="M12 22c4 0 7-3 7-7 0-4-3-6-5-9-1 3-3 4-4 5-1-2-1-4 0-6-4 2-7 6-7 10 0 4 3 7 9 7Z" />
    ),
    shower: (
      <>
        <path d="M4 10a8 8 0 0 1 16 0" />
        <path d="M12 10v2M8 12v2M16 12v2M5 10h14" />
        <path d="M7 16v.01M10 18v.01M13 16v.01M16 18v.01" />
      </>
    ),
    tools: (
      <>
        <path d="m14.5 6.5 3-3a4 4 0 0 0-5 5l-8 8a2 2 0 0 0 3 3l8-8a4 4 0 0 0 5-5l-3 3-3-3Z" />
      </>
    ),
    lightbulb: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M8 14c-1.2-1.1-2-2.7-2-4.5a6 6 0 0 1 12 0c0 1.8-.8 3.4-2 4.5-.8.7-1 1.4-1 2.5H9c0-1.1-.2-1.8-1-2.5Z" />
      </>
    ),
    camera: (
      <>
        <path d="M4 7h4l1.5-2h5L16 7h4v12H4V7Z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    sofa: (
      <>
        <path d="M5 11V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2" />
        <path d="M4 11h16a2 2 0 0 1 2 2v4H2v-4a2 2 0 0 1 2-2Z" />
        <path d="M5 17v3M19 17v3" />
      </>
    ),
    bed: (
      <>
        <path d="M3 18v-7a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v7" />
        <path d="M3 15h18M14 11h4a3 3 0 0 1 3 3v4M3 18h18" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

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

  const iconMap = {
    "Todas": "home",
    "Smart TV": "tv",
    "Celulares": "phone",
    "Perfumes": "sparkles",
    "Audio": "volume",
    "Entretenimiento": "gamepad",
    "Aires": "snowflake",
    "Heladeras": "refrigerator",
    "Freezers": "snowflake",
    "Lavarropas": "washer",
    "Cocina": "utensils",
    "Accesorios de Cocina": "utensils",
    "Pequeños Electros": "zap",
    "Botellas y Térmicos": "bottle",
    "Belleza y Cuidado": "scissors",
    "Limpieza": "broom",
    "Jardín": "leaf",
    "Calefacción": "flame",
    "Termotanques": "shower",
    "Herramientas": "tools",
    "Iluminación": "lightbulb",
    "Cámaras de Seguridad": "camera",
    "Hogar": "sofa",
    "Blanquería": "bed",
  };

  return (
    <>
      <div className="categories">
        {lista.map((cat) => (
          <button
            key={cat}
            onClick={() => seleccionarCategoria(cat)}
            className={categoria === cat ? "category-btn active" : "category-btn"}
          >
            <span className="category-content">
              <span className="category-icon" aria-hidden="true">
                <CategoryIcon name={iconMap[cat]} />
              </span>
              <span className="category-name">{cat}</span>
            </span>
          </button>
        ))}

        {!mostrarTodas && (
          <button
            className="category-btn"
            onClick={() => setMostrarTodas(true)}
          >
            <span className="category-content">
              <span className="category-icon" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="category-name">Más</span>
            </span>
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
            <span className="category-content">
              <span className="category-icon" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
              <span className="category-name">Mostrar menos</span>
            </span>
          </button>
        </div>
      )}

      {categoria === "Celulares" && (
        <div className="categories" style={{ marginTop: "14px" }}>
          {marcasCelulares.map((item) => (
            <button
              key={item}
              onClick={() => setMarca(item)}
              className={marca === item ? "category-btn active" : "category-btn"}
            >
              <span className="category-name category-filter-name">{item}</span>
            </button>
          ))}
        </div>
      )}

      {categoria === "Blanquería" && (
        <div className="categories" style={{ marginTop: "14px" }}>
          {subcategoriasBlanqueria.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSubcategoria(item);
                setMedida("Todas");
              }}
              className={
                subcategoria === item ? "category-btn active" : "category-btn"
              }
            >
              <span className="category-name category-filter-name">{item}</span>
            </button>
          ))}
        </div>
      )}

      {categoria === "Blanquería" &&
        ["Sábanas", "Frazadas", "Acolchados"].includes(subcategoria) && (
          <div className="categories" style={{ marginTop: "14px" }}>
            {medidasBlanqueria.map((item) => (
              <button
                key={item}
                onClick={() => setMedida(item)}
                className={medida === item ? "category-btn active" : "category-btn"}
              >
                <span className="category-name category-filter-name">{item}</span>
              </button>
            ))}
          </div>
        )}
    </>
  );
}

export default Categories;
