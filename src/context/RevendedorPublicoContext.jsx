import { createContext, useContext, useMemo } from "react";
import { convertirPrecio } from "../utils/calcularPrecios";

const RevendedorPublicoContext = createContext(null);

/**
 * Obtiene el precio comercial correspondiente
 * según la cantidad.
 *
 * 12 → precio12
 * 9  → precio9
 * 6  → precio6
 * 3  → precio3
 * 2  → precio2
 * 1  → precio
 */
function obtenerPrecioPromocional(producto, cantidad = 1) {
  const cantidadNumero = Number(cantidad) || 1;

  if (
    cantidadNumero >= 12 &&
    Number(producto?.precio12) > 0
  ) {
    return Number(producto.precio12);
  }

  if (
    cantidadNumero >= 9 &&
    Number(producto?.precio9) > 0
  ) {
    return Number(producto.precio9);
  }

  if (
    cantidadNumero >= 6 &&
    Number(producto?.precio6) > 0
  ) {
    return Number(producto.precio6);
  }

  if (
    cantidadNumero >= 3 &&
    Number(producto?.precio3) > 0
  ) {
    return Number(producto.precio3);
  }

  if (
    cantidadNumero >= 2 &&
    Number(producto?.precio2) > 0
  ) {
    return Number(producto.precio2);
  }

  return Number(producto?.precio) || 0;
}

/**
 * Aplica el margen del revendedor.
 *
 * Ejemplo:
 *
 * precio = 100000
 * margen = 10
 *
 * resultado = 110000
 */
function aplicarMargen(precio, porcentaje) {
  const precioNumero = Number(precio) || 0;
  const porcentajeNumero = Number(porcentaje) || 0;

  return precioNumero * (1 + porcentajeNumero / 100);
}

export function RevendedorPublicoProvider({
  children,
  revendedor = null,
}) {
  const activo = Boolean(
    revendedor?.id && revendedor?.activo !== false
  );

  const porcentaje =
    Number(revendedor?.porcentaje) || 0;

  /**
   * Precio maestro.
   *
   * Respeta:
   * - precio por cantidad
   * - conversión USD → ARS
   *
   * Todavía NO aplica margen.
   */
  const obtenerPrecioMaestro = useMemo(() => {
    return (producto, cantidad = 1, blue) => {
      if (!producto) return 0;

      const precioPromocional =
        obtenerPrecioPromocional(
          producto,
          cantidad
        );

      return convertirPrecio(
        precioPromocional,
        producto,
        blue
      );
    };
  }, []);

  /**
   * Precio final para el cliente del revendedor.
   *
   * Primero:
   * - precio/promoción correspondiente
   * - conversión USD/ARS
   *
   * Después:
   * - margen del revendedor
   */
  const obtenerPrecioRevendedor = useMemo(() => {
    return (
      producto,
      cantidad = 1,
      blue
    ) => {
      if (!producto) return 0;

      const precioMaestro =
        obtenerPrecioMaestro(
          producto,
          cantidad,
          blue
        );

      if (!activo) {
        return precioMaestro;
      }

      return aplicarMargen(
        precioMaestro,
        porcentaje
      );
    };
  }, [
    activo,
    porcentaje,
    obtenerPrecioMaestro,
  ]);

  const value = useMemo(
    () => ({
      activo,

      revendedor,

      revendedorId:
        revendedor?.id || null,

      /**
       * Se utiliza únicamente para cálculos internos.
       *
       * NO debe mostrarse al cliente.
       */
      porcentaje,

      obtenerPrecioMaestro,

      obtenerPrecioPromocional,

      obtenerPrecioRevendedor,

      aplicarMargen,
    }),
    [
      activo,
      revendedor,
      porcentaje,
      obtenerPrecioMaestro,
      obtenerPrecioRevendedor,
    ]
  );

  return (
    <RevendedorPublicoContext.Provider
      value={value}
    >
      {children}
    </RevendedorPublicoContext.Provider>
  );
}

/**
 * Hook seguro.
 *
 * Si estamos en el catálogo normal (/),
 * devuelve modo revendedor desactivado.
 *
 * Si estamos en /v/:slug,
 * utiliza el Provider del revendedor.
 */
export function useRevendedorPublico() {
  const context = useContext(
    RevendedorPublicoContext
  );

  /**
   * CATÁLOGO NORMAL
   *
   * Esto evita que ProductCard/ProductPrice
   * rompan la página "/" cuando no existe
   * RevendedorPublicoProvider.
   */
  if (!context) {
    return {
      activo: false,

      revendedor: null,

      revendedorId: null,

      porcentaje: 0,

      obtenerPrecioMaestro: (
        producto,
        cantidad = 1,
        blue
      ) => {
        if (!producto) return 0;

        const precioPromocional =
          obtenerPrecioPromocional(
            producto,
            cantidad
          );

        return convertirPrecio(
          precioPromocional,
          producto,
          blue
        );
      },

      obtenerPrecioPromocional,

      obtenerPrecioRevendedor: (
        producto,
        cantidad = 1,
        blue
      ) => {
        if (!producto) return 0;

        const precioPromocional =
          obtenerPrecioPromocional(
            producto,
            cantidad
          );

        return convertirPrecio(
          precioPromocional,
          producto,
          blue
        );
      },

      aplicarMargen,
    };
  }

  return context;
}