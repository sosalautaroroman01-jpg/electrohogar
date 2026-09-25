import "./Home.css";

import FloatingCart from "../components/FloatingCart";
import AnimatedBackground from "../components/AnimatedBackground";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import DollarTicker from "../components/DollarTicker";
import InfoBar from "../components/InfoBar";
import HomeProductCard from "../components/HomeProductCard";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function FilaProductos({
  titulo,
  subtitulo,
  icono,
  productos,
  mostrarVerTodos = false,
}) {
  if (!productos.length) return null;

  return (
    <section className="home-vitrina">
      <div className="home-vitrina-header">
        <div className="home-vitrina-title">
          {icono && (
            <span className="home-vitrina-icon">{icono}</span>
          )}

          <div>
            <h2>{titulo}</h2>
            {subtitulo && <p>{subtitulo}</p>}
          </div>
        </div>

        {mostrarVerTodos && (
          <button
            type="button"
            className="home-ver-todos"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            Ver todos →
          </button>
        )}
      </div>

      <div className="home-vitrina-wrap">
        <button
          type="button"
          className="home-flecha home-flecha-izquierda"
          aria-label={`Ver productos anteriores de ${titulo}`}
          onClick={(e) => {
            const fila = e.currentTarget.parentElement.querySelector(
              ".home-vitrina-scroll"
            );

            fila?.scrollBy({
              left: -700,
              behavior: "smooth",
            });
          }}
        >
          ‹
        </button>

        <div className="home-vitrina-scroll">
          {productos.slice(0, 12).map((producto) => (
            <div className="home-vitrina-item" key={producto.id}>
              <HomeProductCard producto={producto} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="home-flecha home-flecha-derecha"
          aria-label={`Ver más productos de ${titulo}`}
          onClick={(e) => {
            const fila = e.currentTarget.parentElement.querySelector(
              ".home-vitrina-scroll"
            );

            fila?.scrollBy({
              left: 700,
              behavior: "smooth",
            });
          }}
        >
          ›
        </button>
      </div>

      <div className="home-vitrina-indicadores" aria-hidden="true">
        <span className="activo"></span>
        <span></span>
        <span></span>
      </div>
    </section>
  );
}

function Home({ modoLocal = false }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosRef = collection(db, "productos");

    const unsubscribe = onSnapshot(
      productosRef,
      (snapshot) => {
        const productosActualizados = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(productosActualizados);
      },
      (error) => {
        console.error("Error al cargar productos:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const productosVisibles = useMemo(
    () => productos.filter((producto) => producto.visible !== false),
    [productos]
  );

  const ofertas = useMemo(
    () =>
      productosVisibles.filter(
        (producto) =>
          producto.oferta === true ||
          producto.enOferta === true ||
          producto.destacado === true
      ),
    [productosVisibles]
  );

  const nuevos = useMemo(() => {
    return [...productosVisibles]
      .filter((producto) => producto.nuevoIngreso === true)
      .sort((a, b) => {
        const fechaA =
          a.createdAt?.seconds ||
          a.createdAt?._seconds ||
          (typeof a.createdAt === "number" ? a.createdAt : 0) ||
          0;

        const fechaB =
          b.createdAt?.seconds ||
          b.createdAt?._seconds ||
          (typeof b.createdAt === "number" ? b.createdAt : 0) ||
          0;

        return Number(fechaB) - Number(fechaA);
      });
  }, [productosVisibles]);

  const tendencias = useMemo(
    () =>
      productosVisibles.filter(
        (producto) =>
          producto.tendencia === true ||
          producto.destacado === true ||
          producto.popular === true
      ),
    [productosVisibles]
  );



  return (
    <>
      <AnimatedBackground />

      <Cart />
      <FloatingCart />

      <div className="app">
        <DollarTicker />

        <Header />

        <main>
          <section className="hero">
            <SearchBar />
            <InfoBar />
            <Categories />
          </section>

          <div className="home-contenido">
            <FilaProductos
              titulo="Ofertas destacadas"
              subtitulo="Encontrá oportunidades especiales"
              icono="🔥"
              productos={ofertas}
              mostrarVerTodos
            />

            <FilaProductos
              titulo="Descubrí lo nuevo"
              subtitulo="Las últimas novedades de ElectroHogar"
              productos={nuevos}
            />

            <FilaProductos
              titulo="Tendencias"
              subtitulo="Productos que están llamando la atención"
              icono="📈"
              productos={tendencias}
            />

            <section className="home-catalogo">
              <div className="home-catalogo-header">
                <div>
                  <span>CATÁLOGO COMPLETO</span>
                  <h2>Todos nuestros productos</h2>
                  <p>
                    Explorá todo el catálogo o utilizá los filtros para
                    encontrar lo que buscás.
                  </p>
                </div>
              </div>

              <ProductGrid />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
