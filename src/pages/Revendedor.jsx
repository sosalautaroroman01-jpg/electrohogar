import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  obtenerRevendedorPorSlug,
} from "../services/vendedoresService";

import Home from "./Home";
import MisVentas from "./MisVentas";

import {
  RevendedorPublicoProvider,
} from "../context/RevendedorPublicoContext";

export default function Revendedor() {
  const { slug } = useParams();

  const [revendedor, setRevendedor] =
    useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarRevendedor() {
      try {
        setCargando(true);
        setError("");

        if (!slug) {
          throw new Error(
            "No se encontró el enlace del revendedor."
          );
        }

        const resultado =
          await obtenerRevendedorPorSlug(slug);

        if (cancelado) {
          return;
        }

        if (!resultado) {
          setError(
            "El catálogo que estás buscando no existe."
          );

          setRevendedor(null);

          return;
        }

        if (resultado.activo === false) {
          setError(
            "Este catálogo no se encuentra disponible."
          );

          setRevendedor(null);

          return;
        }

        setRevendedor(resultado);
      } catch (error) {
        console.error(
          "Error cargando catálogo del revendedor:",
          error
        );

        if (!cancelado) {
          setError(
            "No se pudo cargar el catálogo."
          );

          setRevendedor(null);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarRevendedor();

    return () => {
      cancelado = true;
    };
  }, [slug]);

  if (cargando) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
        }}
      >
        Cargando catálogo...
      </div>
    );
  }

  if (error || !revendedor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <h2>Catálogo no disponible</h2>

          <p>
            {error ||
              "No se encontró el catálogo solicitado."}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================================================
   * MIS VENTAS
   * ==========================================================================
   *
   * La ruta /v/:slug/mis-ventas también pasa por este componente.
   * Como el slug identifica al revendedor, usamos el revendedor.id real
   * para escuchar solamente sus ventas.
   */

  const esMisVentas =
    window.location.pathname.endsWith(
      "/mis-ventas"
    );

  return (
    <RevendedorPublicoProvider
      revendedor={revendedor}
    >
      {esMisVentas ? (
        <MisVentas
          revendedorId={revendedor.id}
          slug={revendedor.slug || slug}
        />
      ) : (
        <Home
          modoRevendedor={true}
          revendedor={revendedor}
        />
      )}
    </RevendedorPublicoProvider>
  );
}