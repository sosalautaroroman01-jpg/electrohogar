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

function obtenerSlugDesdeDominio() {
  if (typeof window === "undefined") {
    return "";
  }

  const hostname =
    window.location.hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .trim();

  if (!hostname || hostname === "localhost") {
    return "";
  }

  /*
   * Si estamos en un subdominio:
   * juan.depositomayorista.com
   * -> juan
   *
   * Si estamos en un dominio personalizado:
   * depositomayorista.com
   * -> depositomayorista
   *
   * El servicio de revendedores decide si ese slug existe.
   */
  const partes = hostname.split(".");

  if (partes.length >= 3) {
    return partes[0];
  }

  if (partes.length === 2) {
    return partes[0];
  }

  return "";
}

export default function Revendedor() {
  const { slug: slugRuta } = useParams();

  const slug =
    slugRuta ||
    obtenerSlugDesdeDominio();

  const [revendedor, setRevendedor] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

        console.log(
          "REVendedor - slug recibido:",
          slug
        );

        console.log(
          "REVendedor - dominio actual:",
          window.location.hostname
        );

        const resultado =
          await obtenerRevendedorPorSlug(slug);

        console.log(
          "REVendedor - resultado:",
          resultado
        );

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
          const mensaje =
            error?.message ||
            error?.code ||
            "Error desconocido al cargar el catálogo.";

          setError(mensaje);
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
          background: "#f5f6f8",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            padding: "30px 24px",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginBottom: "14px",
              fontSize: "24px",
            }}
          >
            Catálogo no disponible
          </h2>

          <p
            style={{
              marginBottom: "18px",
              lineHeight: 1.5,
            }}
          >
            {error ||
              "No se encontró el catálogo solicitado."}
          </p>

          <p
            style={{
              fontSize: "13px",
              color: "#777",
              wordBreak: "break-word",
            }}
          >
            Dominio: {window.location.hostname}
            <br />
            Slug: {slug || "sin slug"}
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