import "./ProductGrid.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import { useFilter } from "../context/FilterContext";

import ProductCard from "./ProductCard";

function ProductGrid() {
  const [productos, setProductos] =
    useState([]);

  const {
    busqueda,
    categoria,
    marca,
    subcategoria,
    medida,
  } = useFilter();

  // =========================================================
  // PRODUCTOS EN TIEMPO REAL
  // =========================================================

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
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setProductos(
            productosActualizados
          );
        },
        (error) => {
          console.error(
            "Error al escuchar los productos en tiempo real:",
            error
          );
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // FILTROS
  // =========================================================

  const productosFiltrados =
    useMemo(() => {
      const texto =
        busqueda?.toLowerCase() ||
        "";

      return productos.filter(
        (producto) => {

          // -------------------------------------------------
          // VISIBILIDAD
          // -------------------------------------------------

          if (
            producto.visible ===
            false
          ) {
            return false;
          }

          // -------------------------------------------------
          // BÚSQUEDA
          // -------------------------------------------------

          if (
            !producto.nombre
              ?.toLowerCase()
              .includes(texto)
          ) {
            return false;
          }

          // -------------------------------------------------
          // CATEGORÍA
          // -------------------------------------------------

          if (
            categoria !==
              "Todas" &&
            producto.categoria !==
              categoria
          ) {
            return false;
          }

          // -------------------------------------------------
          // MARCA - CELULARES
          // -------------------------------------------------

          if (
            categoria ===
              "Celulares" &&
            marca &&
            marca !== "Todas" &&
            producto.marca !==
              marca
          ) {
            return false;
          }

          // -------------------------------------------------
          // SUBCATEGORÍA - BLANQUERÍA
          // -------------------------------------------------

          if (
            categoria ===
              "Blanquería" &&
            subcategoria &&
            subcategoria !==
              "Todas" &&
            producto.subcategoria !==
              subcategoria
          ) {
            return false;
          }

          // -------------------------------------------------
          // MEDIDA - BLANQUERÍA
          // -------------------------------------------------

          const usaMedida =
            categoria ===
              "Blanquería" &&
            [
              "Sábanas",
              "Frazadas",
              "Acolchados",
            ].includes(
              subcategoria
            );

          if (
            usaMedida &&
            medida &&
            medida !== "Todas" &&
            producto.medida !==
              medida
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      productos,
      busqueda,
      categoria,
      marca,
      subcategoria,
      medida,
    ]);

  // =========================================================
  // ORDEN AUTOMÁTICO DEL CATÁLOGO
  // =========================================================
  //
  // Los productos se acomodan según las ventas reales.
  //
  // Más ventas = más arriba.
  //
  // Ejemplo:
  //
  // Producto A → 25 ventas
  // Producto B → 18 ventas
  // Producto C → 10 ventas
  // Producto D →  3 ventas
  //
  // Cada vez que cambia "ventas" en Firebase,
  // el catálogo se vuelve a ordenar automáticamente.
  //
  // Los productos que todavía no tienen "ventas"
  // se consideran con 0 ventas.
  //
  // =========================================================

  const productosOrdenados =
    useMemo(() => {
      return [
        ...productosFiltrados,
      ].sort((a, b) => {

        const ventasA =
          Number(
            a.ventas
          ) || 0;

        const ventasB =
          Number(
            b.ventas
          ) || 0;

        return (
          ventasB -
          ventasA
        );
      });
    }, [
      productosFiltrados,
    ]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="productos">
      {productosOrdenados.map(
        (producto) => (
          <ProductCard
            key={
              producto.id
            }
            producto={
              producto
            }
          />
        )
      )}
    </div>
  );
}

export default ProductGrid;