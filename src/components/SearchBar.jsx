import "./SearchBar.css";
import { useFilter } from "../context/FilterContext";

function SearchBar() {
  const {
    busqueda,
    setBusqueda,
    setCategoria,
  } = useFilter();

  function buscar(e) {
    setBusqueda(e.target.value);
    setCategoria("Todas");
  }

  return (
    <div className="search-container">

      <div className="search-box">

        <span className="search-icon">
          🔎
        </span>

        <input
          type="text"
          className="search-input"
          placeholder="Buscar productos, marcas o categorías..."
          value={busqueda}
          onChange={buscar}
        />

      </div>

    </div>
  );
}

export default SearchBar;