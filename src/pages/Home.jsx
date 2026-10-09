import "./Home.css";

import FloatingCart from "../components/FloatingCart";
import AnimatedBackground from "../components/AnimatedBackground";
import Header from "../components/Header";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import DollarTicker from "../components/DollarTicker";
import HomeProductCard from "../components/HomeProductCard";

import { useFilter } from "../context/FilterContext";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";


/* =========================================================
   VITRINA REUTILIZABLE

   Los 3 banners usan exactamente el mismo componente.

   mostrarNuevo:
   - true  = muestra NUEVO
   - false = no muestra NUEVO
========================================================= */

function FilaProductos({
  titulo,
  subtitulo,
  productos = [],
  mostrarNuevo = false,
}) {
  const [indice, setIndice] = useState(0);

  const mobileScrollRef = useRef(null);

  const lista = productos.slice(0, 18);

  if (!lista.length) return null;

  const totalPaginas = Math.max(
    1,
    Math.ceil(lista.length / 5)
  );

  const totalPaginasMobile = Math.max(
    1,
    Math.ceil(lista.length / 2)
  );

  const mover = (direccion) => {
    setIndice((actual) => {
      const siguiente = actual + direccion;

      if (siguiente < 0) {
        return totalPaginas - 1;
      }

      if (siguiente >= totalPaginas) {
        return 0;
      }

      return siguiente;
    });
  };

  const inicio = indice * 5;

  const visibles = lista.slice(
    inicio,
    inicio + 5
  );

  const faltantes = Math.max(
    0,
    5 - visibles.length
  );

  const manejarScrollMobile = () => {
    const fila = mobileScrollRef.current;

    if (!fila) return;

    const primeraTarjeta =
      fila.querySelector(
        ".home-vitrina-mobile-item"
      );

    if (!primeraTarjeta) return;

    const ancho =
      primeraTarjeta.getBoundingClientRect().width;

    const gap =
      parseFloat(
        window.getComputedStyle(fila).columnGap ||
        window.getComputedStyle(fila).gap ||
        "0"
      ) || 0;

    const posicion = Math.round(
      fila.scrollLeft /
      Math.max(1, ancho + gap)
    );

    const pagina = Math.floor(
      posicion / 2
    );

    setIndice(
      Math.max(
        0,
        Math.min(
          totalPaginasMobile - 1,
          pagina
        )
      )
    );
  };

  return (
    <section className="home-vitrina">

      <div className="home-vitrina-header">
        <div className="home-vitrina-title">
          <div>
            <h2>{titulo}</h2>

            {subtitulo && (
              <p>{subtitulo}</p>
            )}
          </div>
        </div>
      </div>


      {/* =================================================
          DESKTOP / TABLET
          5 productos por página
      ================================================= */}

      <div className="home-vitrina-wrap home-vitrina-desktop">

        {totalPaginas > 1 && (
          <button
            type="button"
            className="home-flecha home-flecha-izquierda"
            aria-label={`Productos anteriores de ${titulo}`}
            onClick={() => mover(-1)}
          >
            ‹
          </button>
        )}

        <div className="home-vitrina-grid">

          {visibles.map((producto) => (
            <div
              className="home-vitrina-item"
              key={producto.id}
            >
              <HomeProductCard
                producto={producto}
                mostrarNuevo={mostrarNuevo}
              />
            </div>
          ))}

          {Array.from({
            length: faltantes,
          }).map((_, index) => (
            <div
              className="home-vitrina-item home-vitrina-placeholder"
              key={`placeholder-${index}`}
              aria-hidden="true"
            />
          ))}

        </div>

        {totalPaginas > 1 && (
          <button
            type="button"
            className="home-flecha home-flecha-derecha"
            aria-label={`Más productos de ${titulo}`}
            onClick={() => mover(1)}
          >
            ›
          </button>
        )}

      </div>


      {/* =================================================
          MOBILE
          CARRUSEL HORIZONTAL — DESLIZAR CON EL DEDO
      ================================================= */}

      <div
        ref={mobileScrollRef}
        className="home-vitrina-mobile-scroll"
        onScroll={manejarScrollMobile}
      >
        {lista.map((producto) => (
          <div
            className="home-vitrina-mobile-item"
            key={`mobile-${producto.id}`}
          >
            <HomeProductCard
              producto={producto}
              mostrarNuevo={mostrarNuevo}
            />
          </div>
        ))}
      </div>


      {/* =================================================
          INDICADORES
      ================================================= */}

      {(
        totalPaginas > 1 ||
        totalPaginasMobile > 1
      ) && (
        <div
          className="home-vitrina-indicadores"
          aria-hidden="true"
        >
          {Array.from({
            length:
              typeof window !== "undefined" &&
              window.innerWidth <= 768
                ? totalPaginasMobile
                : totalPaginas,
          }).map((_, index) => (
            <span
              key={index}
              className={
                index === indice
                  ? "activo"
                  : ""
              }
            />
          ))}
        </div>
      )}

    </section>
  );
}

function Home({
  modoLocal = false,
  modoRevendedor = false,
  revendedor = null,
}) {
  const [productos, setProductos] =
    useState([]);

  const { busqueda, categoria } =
    useFilter();

  const hayBusqueda =
    String(busqueda || "")
      .trim()
      .length > 0;

  const hayCategoriaSeleccionada =
    String(categoria || "Todas") !== "Todas";


  /* =========================================================
     PRODUCTOS EN TIEMPO REAL
  ========================================================= */

  useEffect(() => {
    const productosRef =
      collection(
        db,
        "productos"
      );

    const unsubscribe =
      onSnapshot(
        productosRef,
        (snapshot) => {
          const productosActualizados =
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

          setProductos(
            productosActualizados
          );
        },
        (error) => {
          console.error(
            "Error al cargar productos:",
            error
          );
        }
      );

    return () => unsubscribe();
  }, []);


  /* =========================================================
     PRODUCTOS VISIBLES
  ========================================================= */

  const productosVisibles =
    useMemo(
      () =>
        productos.filter(
          (producto) =>
            producto &&
            producto.visible !== false
        ),
      [productos]
    );


  /* =========================================================
     DESCUBRÍ LO NUEVO
     -> Muestra la etiqueta NUEVO
  ========================================================= */

  const nuevos =
    useMemo(
      () =>
        [...productosVisibles]
          .filter(
            (producto) =>
              producto.nuevoIngreso === true
          )
          .sort((a, b) => {
            const fechaA =
              a.createdAt?.seconds ||
              a.createdAt?._seconds ||
              (
                typeof a.createdAt ===
                "number"
                  ? a.createdAt
                  : 0
              ) ||
              0;

            const fechaB =
              b.createdAt?.seconds ||
              b.createdAt?._seconds ||
              (
                typeof b.createdAt ===
                "number"
                  ? b.createdAt
                  : 0
              ) ||
              0;

            return (
              Number(fechaB) -
              Number(fechaA)
            );
          }),
      [productosVisibles]
    );


  /* =========================================================
     ESPECIAL DÍA DE LA MADRE

     Para seleccionar productos desde Firebase,
     usar cualquiera de estos campos booleanos:

     especialDiaMadre: true
     diaDeLaMadre: true
     bannerMadre: true
  ========================================================= */

  const especialDiaMadre =
    useMemo(
      () =>
        productosVisibles.filter(
          (producto) =>
            producto.especialDiaMadre ===
              true ||
            producto.diaDeLaMadre ===
              true ||
            producto.bannerMadre ===
              true
        ),
      [productosVisibles]
    );


  /* =========================================================
     LO ÚLTIMO VENDIDO

     Prioridad:
     1) ultimoVendido === true
     2) masVendido / vendido
     3) ventas, de mayor a menor
  ========================================================= */

  const ultimoVendido =
    useMemo(() => {
      const marcados =
        productosVisibles.filter(
          (producto) =>
            producto.ultimoVendido ===
              true
        );

      if (marcados.length) {
        return marcados.sort(
          (a, b) =>
            Number(b.ventas || 0) -
            Number(a.ventas || 0)
        );
      }

      const populares =
        productosVisibles.filter(
          (producto) =>
            producto.masVendido ===
              true ||
            producto.vendido ===
              true
        );

      if (populares.length) {
        return populares.sort(
          (a, b) =>
            Number(b.ventas || 0) -
            Number(a.ventas || 0)
        );
      }

      return [...productosVisibles]
        .sort(
          (a, b) =>
            Number(b.ventas || 0) -
            Number(a.ventas || 0)
        );
    }, [productosVisibles]);


  return (
    <>
      <AnimatedBackground />

      <Cart
        modoLocal={modoLocal}
      />

      <FloatingCart />

      <div className="app">
        <DollarTicker />

        <Header
          ocultarLogo={
            modoRevendedor
          }
        />

        <main>
          {/* =================================================
              HERO
          ================================================= */}

          <section className="hero">
            <div className="hero-contenido">
              <div className="hero-info">
                <div className="hero-info-item">
                  <span className="hero-info-icon">
                    +
                  </span>

                  <div>
                    <strong>
                      +600 productos
                    </strong>

                    <small>
                      Todo en un solo lugar
                    </small>
                  </div>
                </div>

                <div className="hero-info-separador" />

                <div className="hero-info-item">
                  <span className="hero-info-icon">
                    🚚
                  </span>

                  <div>
                    <strong>
                      Envíos a todo el país
                    </strong>

                    <small>
                      Calculá tu envío
                    </small>
                  </div>
                </div>

                <div className="hero-info-separador" />

                <div className="hero-info-item">
                  <span className="hero-info-icon">
                    $
                  </span>

                  <div>
                    <strong>
                      Mayorista y minorista
                    </strong>

                    <small>
                      Efectivo · Transferencia · USD
                    </small>
                  </div>
                </div>
              </div>

              <div className="hero-categorias">
                <div className="hero-categorias-titulo">
                  <span>
                    Categorías
                  </span>

                  <small>
                    Encontrá lo que buscás
                  </small>
                </div>

                <Categories />
              </div>
            </div>
          </section>


          {/* =================================================
              BANNERS / VITRINAS
          ================================================= */}

          <div className="home-contenido">
            {!hayBusqueda && !hayCategoriaSeleccionada && (
              <>
                {/* 1 — SÍ muestra NUEVO */}
                <FilaProductos
                  titulo="Descubrí lo nuevo"
                  subtitulo="Las últimas novedades de Electro Hogar"
                  productos={nuevos}
                  mostrarNuevo={true}
                />

                {/* 2 — NO muestra NUEVO */}
                <FilaProductos
                  titulo="Especial Día de la Madre"
                  subtitulo="Ideas para regalar y sorprender"
                  productos={
                    especialDiaMadre
                  }
                  mostrarNuevo={false}
                />

                {/* 3 — NO muestra NUEVO */}
                <FilaProductos
                  titulo="Lo último vendido"
                  subtitulo="Los productos que más se están llevando"
                  productos={
                    ultimoVendido
                  }
                  mostrarNuevo={false}
                />
              </>
            )}

            <section className="home-catalogo">
              <ProductGrid />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
