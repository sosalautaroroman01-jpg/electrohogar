import "./SearchBar.css";

import { useEffect, useRef } from "react";
import { useFilter } from "../context/FilterContext";

function IconoBusqueda() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.2 16.2L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SearchBar() {
  const {
    busqueda,
    setBusqueda,
    setCategoria,
    setMarca,
    setSubcategoria,
    setMedida,
  } = useFilter();

  const inputRef = useRef(null);

  const limpiarFiltros = () => {
    setCategoria("Todas");
    setMarca("Todas");
    setSubcategoria("Todas");
    setMedida("Todas");
  };

  const buscar = (valor) => {
    const texto = String(valor ?? "");

    // La búsqueda es global: mientras se escribe
    // no puede quedar bloqueada por una categoría anterior.
    if (texto.trim() !== "") {
      limpiarFiltros();
    }

    setBusqueda(texto);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    limpiarFiltros();

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const enfocar = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const manejarAtajo = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        enfocar();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", manejarAtajo);

    return () => {
      window.removeEventListener("keydown", manejarAtajo);
    };
  }, []);

  const tieneTexto = String(busqueda || "").length > 0;

  return (
    <div className="searchbar">
      <div className="searchbar-inner">

        <button
          type="button"
          className="searchbar-icon"
          onClick={enfocar}
          aria-label="Buscar productos"
        >
          <IconoBusqueda />
        </button>

        <input
          ref={inputRef}
          type="search"
          value={busqueda || ""}
          onChange={(e) => buscar(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              limpiarBusqueda();
            }
          }}
          placeholder="Buscar productos..."
          autoComplete="off"
          spellCheck="false"
          aria-label="Buscar productos"
        />

        {tieneTexto ? (
          <button
            type="button"
            className="searchbar-clear"
            onClick={limpiarBusqueda}
            aria-label="Limpiar búsqueda"
            title="Limpiar búsqueda"
          >
            <IconoCerrar />
          </button>
        ) : (
          <span className="searchbar-shortcut">
            Ctrl K
          </span>
        )}

      </div>
    </div>
  );
}
