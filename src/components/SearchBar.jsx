import "./SearchBar.css";
function SearchBar() {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Buscar productos..."
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;