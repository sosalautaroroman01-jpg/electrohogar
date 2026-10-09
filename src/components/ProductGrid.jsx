import "./ProductGrid.css";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import { useFilter } from "../context/FilterContext";
import ProductCard from "./ProductCard";

/*
  CARGA PROGRESIVA REAL

  Firebase trae los datos, pero React NO crea las
  tarjetas de todos los productos de una vez.

  Primero se crean 24 tarjetas.
  Cuando el usuario se acerca al final, se crean
  otras 24.

  Los productos que todavía no fueron renderizados
  NO tienen <img> en el DOM, por lo que sus fotos
  no pueden comenzar a descargarse.
*/

const PRODUCTOS_POR_BLOQUE = 24;

function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const [cantidadVisible, setCantidadVisible] =
    useState(PRODUCTOS_POR_BLOQUE);

  const sentinelRef = useRef(null);

  const {
    busqueda,
    categoria,
    marca,
    subcategoria,
    medida,
  } = useFilter();

  useEffect(() => {
    const productosRef = collection(db, "productos");

    const unsubscribe = onSnapshot(
      productosRef,
      (snapshot) => {
        const productosActualizados =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setProductos(productosActualizados);
      },
      (error) => {
        console.error(
          "Error al escuchar los productos en tiempo real:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda?.toLowerCase() || "";

    return productos.filter((producto) => {
      if (producto.visible === false) {
        return false;
      }

      if (
        !producto.nombre
          ?.toLowerCase()
          .includes(texto)
      ) {
        return false;
      }

      if (
        categoria !== "Todas" &&
        producto.categoria !== categoria
      ) {
        return false;
      }

      if (
        categoria === "Celulares" &&
        marca &&
        marca !== "Todas" &&
        producto.marca !== marca
      ) {
        return false;
      }

      if (
        categoria === "Blanquería" &&
        subcategoria &&
        subcategoria !== "Todas" &&
        producto.subcategoria !== subcategoria
      ) {
        return false;
      }

      const usaMedida =
        categoria === "Blanquería" &&
        ["Sábanas", "Frazadas", "Acolchados"].includes(
          subcategoria
        );

      if (
        usaMedida &&
        medida &&
        medida !== "Todas" &&
        producto.medida !== medida
      ) {
        return false;
      }

      return true;
    });
  }, [
    productos,
    busqueda,
    categoria,
    marca,
    subcategoria,
    medida,
  ]);

  const productosOrdenados = useMemo(() => {
    return [...productosFiltrados].sort((a, b) => {
      const ventasA = Number(a.ventas) || 0;
      const ventasB = Number(b.ventas) || 0;

      return ventasB - ventasA;
    });
  }, [productosFiltrados]);

  /*
    Si cambia una búsqueda o filtro,
    volvemos al primer bloque.
  */
  useEffect(() => {
    setCantidadVisible(PRODUCTOS_POR_BLOQUE);
  }, [
    busqueda,
    categoria,
    marca,
    subcategoria,
    medida,
  ]);

  const productosVisibles = productosOrdenados.slice(
    0,
    cantidadVisible
  );

  const quedanProductos =
    cantidadVisible < productosOrdenados.length;

  /*
    Cuando el usuario se acerca al final,
    agregamos otro bloque de productos.
  */
  useEffect(() => {
    if (!quedanProductos) return undefined;

    const elemento = sentinelRef.current;

    if (!elemento) return undefined;

    if (!("IntersectionObserver" in window)) {
      setCantidadVisible((actual) =>
        Math.min(
          actual + PRODUCTOS_POR_BLOQUE,
          productosOrdenados.length
        )
      );

      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        setCantidadVisible((actual) =>
          Math.min(
            actual + PRODUCTOS_POR_BLOQUE,
            productosOrdenados.length
          )
        );
      },
      {
        root: null,
        rootMargin: "900px 0px",
        threshold: 0,
      }
    );

    observer.observe(elemento);

    return () => observer.disconnect();
  }, [
    quedanProductos,
    productosOrdenados.length,
  ]);

  return (
    <>
      <div className="productos">
        {productosVisibles.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
          />
        ))}
      </div>

      {quedanProductos && (
        <div
          ref={sentinelRef}
          className="productos-load-sentinel"
          aria-hidden="true"
          style={{
            width: "100%",
            height: "1px",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}

export default ProductGrid;
