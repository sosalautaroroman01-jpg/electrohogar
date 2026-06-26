import "./SearchBar.css";
import { useFilter } from "../context/FilterContext";

function SearchBar() {
  const { busqueda, setBusqueda } = useFilter();

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Buscar productos..."
        className="search-input"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;