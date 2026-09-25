import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDollar } from "../context/DollarContext";
import { useRevendedorPublico } from "../context/RevendedorPublicoContext";
import { escucharProductos } from "../services/productosService";

import {
  escucharVentasRevendedor,
  confirmarVentaRevendedor,
  eliminarVentaRevendedor,
  actualizarProductosVentaRevendedor,
  obtenerRevendedorPorId,
  crearPedidoConsolidadoRevendedor,
} from "../services/vendedoresService";

/* ========================================================================== 
   ICONOS
   ========================================================================== */

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m7 9 5 5 5-5" />
    </svg>
  );
}

/* ========================================================================== 
   UTILIDADES
   ========================================================================== */

function formatearPrecio(valor) {
  const numero = Number(valor) || 0;

  return numero.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function obtenerFecha(valor) {
  if (!valor) return "Sin fecha";

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "Sin fecha";
  }

  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function calcularTotalVenta(venta) {
  if (!Array.isArray(venta?.productos)) {
    return 0;
  }

  return venta.productos.reduce((total, producto) => {
    const precio =
      Number(producto?.precioFinal) ||
      Number(producto?.precioVenta) ||
      Number(producto?.precio) ||
      0;

    const cantidad = Number(producto?.cantidad) || 1;

    return total + precio * cantidad;
  }, 0);
}

function obtenerCantidadProductos(venta) {
  if (!Array.isArray(venta?.productos)) {
    return 0;
  }

  return venta.productos.reduce(
    (total, producto) => total + (Number(producto?.cantidad) || 1),
    0
  );
}

function obtenerEstadoClase(estado) {
  switch (estado) {
    case "Venta concretada":
      return "estado-concretada";
    case "Confirmada por revendedor":
      return "estado-confirmada";
    case "Enviada a Electro Hogar":
      return "estado-enviada";
    case "Procesado":
      return "estado-procesado";
    case "No cerré venta":
      return "estado-no-cerrada";
    default:
      return "estado-pendiente";
  }
}

function estadoEsEliminable(estado) {
  return (
    estado === "Pendiente" ||
    estado === "No cerré venta"
  );
}

/* ========================================================================== 
   COMPONENTE
   ========================================================================== */

export default function MisVentas({ revendedorId, slug }) {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [error, setError] = useState("");
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState("");
  const [modalLimpiarAbierto, setModalLimpiarAbierto] = useState(false);
  const [editandoVenta, setEditandoVenta] = useState(false);
  const [productosEditados, setProductosEditados] = useState([]);
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [cantidadProductoNuevo, setCantidadProductoNuevo] = useState(1);
  const [porcentajeVenta, setPorcentajeVenta] = useState(null);
  const [ventasSeleccionadas, setVentasSeleccionadas] = useState([]);
  const [pedidoModalAbierto, setPedidoModalAbierto] = useState(false);
  const [enviandoPedido, setEnviandoPedido] = useState(false);

  const blue = useDollar();
  const { obtenerPrecioMaestro, porcentaje } = useRevendedorPublico();

  // Para Mis Ventas usamos el porcentaje del revendedor PRIVADO,
  // leído por su ID real. Así nunca dependemos de que la copia pública
  // del revendedor tenga el porcentaje actualizado.
  const margenEdicion =
    porcentajeVenta !== null
      ? Number(porcentajeVenta) || 0
      : Number(porcentaje) || 0;

  function obtenerPrecioEdicion(producto, cantidad = 1) {
    const precioMaestro = obtenerPrecioMaestro(
      producto,
      cantidad,
      blue
    );

    return precioMaestro * (1 + margenEdicion / 100);
  }

  useEffect(() => {
    let cancelado = false;

    async function cargarMargenReal() {
      if (!revendedorId) {
        setPorcentajeVenta(null);
        return;
      }

      try {
        const revendedorReal =
          await obtenerRevendedorPorId(revendedorId);

        if (cancelado) return;

        if (revendedorReal) {
          setPorcentajeVenta(
            Number(revendedorReal.porcentaje) || 0
          );
        } else {
          setPorcentajeVenta(null);
        }
      } catch (error) {
        console.error(
          "Error obteniendo margen real del revendedor:",
          error
        );

        if (!cancelado) {
          setPorcentajeVenta(null);
        }
      }
    }

    cargarMargenReal();

    return () => {
      cancelado = true;
    };
  }, [revendedorId]);

  /* ------------------------------------------------------------------------
     ESCUCHAR VENTAS
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!revendedorId) {
      setVentas([]);
      setCargando(false);
      return undefined;
    }

    setCargando(true);
    setError("");

    const cancelar = escucharVentasRevendedor(
      revendedorId,
      (lista) => {
        setVentas(Array.isArray(lista) ? lista : []);
        setCargando(false);
      }
    );

    return () => {
      if (typeof cancelar === "function") {
        cancelar();
      }
    };
  }, [revendedorId]);

  /* ------------------------------------------------------------------------
     CATÁLOGO MAESTRO PARA EDITAR VENTAS
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const cancelar = escucharProductos((lista) => {
      setProductosCatalogo(
        Array.isArray(lista)
          ? lista.filter((producto) => producto && producto.visible !== false)
          : []
      );
    });

    return () => {
      if (typeof cancelar === "function") {
        cancelar();
      }
    };
  }, []);

  const productosDisponiblesEdicion = useMemo(() => {
    const texto = busquedaProducto.trim().toLowerCase();

    if (!texto) return [];

    const idsActuales = new Set(
      productosEditados.map(
        (producto) => producto.id || producto.productoId
      )
    );

    return productosCatalogo
      .filter((producto) => {
        const nombre = String(producto.nombre || "").toLowerCase();
        const marca = String(producto.marca || "").toLowerCase();
        const categoria = String(producto.categoria || "").toLowerCase();
        const subcategoria = String(producto.subcategoria || "").toLowerCase();

        return (
          !idsActuales.has(producto.id) &&
          (nombre.includes(texto) ||
            marca.includes(texto) ||
            categoria.includes(texto) ||
            subcategoria.includes(texto))
        );
      })
      .slice(0, 8);
  }, [productosCatalogo, busquedaProducto, productosEditados]);

  /* ------------------------------------------------------------------------
     ESTADÍSTICAS
     ------------------------------------------------------------------------ */

  const estadisticas = useMemo(() => {
    const consultas = ventas.length;

    const seguimiento = ventas.filter(
      (venta) =>
        venta.estado === "Pendiente" ||
        venta.estado === "Confirmada por revendedor" ||
        (
          venta.estado === "Enviada a Electro Hogar" &&
          venta.resultadoComercial !== "concretada" &&
          venta.resultadoComercial !== "caida"
        )
    ).length;

    const concretadas = ventas.filter(
      (venta) =>
        venta.resultadoComercial === "concretada" ||
        venta.estado === "Venta concretada"
    ).length;

    const sinCerrar = ventas.filter(
      (venta) => venta.estado === "No cerré venta"
    ).length;

    const eliminables = ventas.filter((venta) =>
      estadoEsEliminable(venta.estado)
    ).length;

    const enviadas = ventas.filter(
      (venta) =>
        venta.estado === "Enviada a Electro Hogar" &&
        venta.resultadoComercial !== "concretada" &&
        venta.resultadoComercial !== "caida"
    ).length;

    return {
      consultas,
      seguimiento,
      concretadas,
      sinCerrar,
      enviadas,
      eliminables,
    };
  }, [ventas]);

  /* ------------------------------------------------------------------------
     FILTRO
     ------------------------------------------------------------------------ */

  const ventasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return ventas.filter((venta) => {
      const cliente = venta.cliente || {};

      const nombreCliente =
        cliente.nombreCompleto ||
        `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim();

      const coincideBusqueda =
        !texto ||
        nombreCliente.toLowerCase().includes(texto) ||
        String(cliente.whatsapp || "")
          .toLowerCase()
          .includes(texto) ||
        String(venta.id || "")
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        filtroEstado === "Todas" ||
        venta.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [ventas, busqueda, filtroEstado]);

  /* ------------------------------------------------------------------------
     CONFIRMAR VENTA
     ------------------------------------------------------------------------ */

  async function confirmarVenta(venta) {
    const nombre =
      venta?.cliente?.nombreCompleto || "este cliente";

    const confirmar = window.confirm(
      `¿Confirmás que vendiste ${nombre}?\n\nEsto la deja lista para enviar a Electro Hogar. Todavía no significa que la venta esté validada ni que haya comisión.`
    );

    if (!confirmar) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await confirmarVentaRevendedor(venta.id);

      cerrarDetalleVenta();
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "No se pudo confirmar la venta."
      );
    } finally {
      setGuardando(false);
    }
  }

  /* ------------------------------------------------------------------------
     ELIMINAR UNA VENTA
     ------------------------------------------------------------------------ */

  async function eliminarVenta(venta) {
    if (!estadoEsEliminable(venta?.estado)) {
      setError(
        "Esta venta ya no puede eliminarse porque fue concretada o enviada a Electro Hogar."
      );
      return;
    }

    const nombre =
      venta?.cliente?.nombreCompleto || "esta venta";

    const confirmar = window.confirm(
      `¿Eliminar la venta de ${nombre}?\n\nEsta acción eliminará la venta del panel y no generará comisión.`
    );

    if (!confirmar) {
      return;
    }

    try {
      setEliminandoId(venta.id);
      setError("");

      await eliminarVentaRevendedor(venta.id);

      if (ventaSeleccionada?.id === venta.id) {
        cerrarDetalleVenta();
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "No se pudo eliminar la venta."
      );
    } finally {
      setEliminandoId("");
    }
  }

  /* ------------------------------------------------------------------------
     LIMPIAR VENTAS CAÍDAS
     ------------------------------------------------------------------------ */

  async function limpiarVentasCaidas() {
    const ventasEliminables = ventas.filter((venta) =>
      estadoEsEliminable(venta.estado)
    );

    if (ventasEliminables.length === 0) {
      setModalLimpiarAbierto(false);
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await Promise.all(
        ventasEliminables.map((venta) =>
          eliminarVentaRevendedor(venta.id)
        )
      );

      setModalLimpiarAbierto(false);
      cerrarDetalleVenta();
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "No se pudieron limpiar todas las ventas."
      );
    } finally {
      setGuardando(false);
    }
  }

  /* ------------------------------------------------------------------------
     PEDIDO CONSOLIDADO
     ------------------------------------------------------------------------ */

  /*
   * El revendedor puede preparar un pedido con ventas
   * que él confirmó, aunque Electro Hogar todavía no
   * las haya validado.
   *
   * La validación definitiva ocurre en Dashboard.
   */
  const ventasConcretadasDisponibles = useMemo(
    () =>
      ventas.filter(
        (venta) =>
          (
            venta.estado === "Confirmada por revendedor" ||
            venta.estado === "Venta concretada"
          ) &&
          venta.resultadoComercial !== "caida" &&
          !venta.pedidoConsolidadoId
      ),
    [ventas]
  );

  const ventasSeleccionadasData = useMemo(
    () =>
      ventasConcretadasDisponibles.filter((venta) =>
        ventasSeleccionadas.includes(venta.id)
      ),
    [ventasConcretadasDisponibles, ventasSeleccionadas]
  );

  const totalSeleccionado = useMemo(
    () =>
      ventasSeleccionadasData.reduce(
        (total, venta) => total + calcularTotalVenta(venta),
        0
      ),
    [ventasSeleccionadasData]
  );

  function toggleVentaSeleccionada(ventaId) {
    setVentasSeleccionadas((actuales) =>
      actuales.includes(ventaId)
        ? actuales.filter((id) => id !== ventaId)
        : [...actuales, ventaId]
    );
  }

  function seleccionarTodasLasVentas() {
    const ids = ventasConcretadasDisponibles.map((venta) => venta.id);

    setVentasSeleccionadas((actuales) =>
      actuales.length === ids.length ? [] : ids
    );
  }

  function abrirPedidoConsolidado() {
    if (ventasSeleccionadasData.length === 0) {
      setError("Seleccioná al menos una venta concretada para preparar el pedido.");
      return;
    }

    setError("");
    setPedidoModalAbierto(true);
  }

  function cerrarPedidoConsolidado() {
    if (enviandoPedido) return;
    setPedidoModalAbierto(false);
  }

  async function enviarPedidoConsolidado() {
    if (ventasSeleccionadasData.length === 0) {
      setError("No hay ventas seleccionadas.");
      return;
    }

    try {
      setEnviandoPedido(true);
      setError("");

      const revendedor = await obtenerRevendedorPorId(revendedorId);

      if (!revendedor) {
        throw new Error("No se encontró la información del revendedor.");
      }

      const pedido = await crearPedidoConsolidadoRevendedor({
        revendedorId,
        revendedor,
        ventas: ventasSeleccionadasData,
      });

      setVentasSeleccionadas([]);
      setPedidoModalAbierto(false);

      window.alert(
        `Pedido enviado correctamente.\n\nID del pedido: ${pedido.id}\nVentas incluidas: ${ventasSeleccionadasData.length}`
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "No se pudo generar el pedido consolidado."
      );
    } finally {
      setEnviandoPedido(false);
    }
  }

  /* ------------------------------------------------------------------------
     SIN REVENDEDOR
     ------------------------------------------------------------------------ */

  if (!revendedorId) {
    return (
      <div className="mis-ventas-page">
        <style>{estilos}</style>

        <div className="mis-ventas-container">
          <div className="mis-ventas-empty-card">
            <div className="mis-ventas-empty-icon">
              <UsersIcon />
            </div>

            <h2>No se encontró el revendedor</h2>

            <p>
              No se pudo identificar el catálogo asociado a estas ventas.
            </p>

            <Link to={`/v/${slug || ""}`} className="mis-ventas-secondary-button">
              <ArrowIcon />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function puedeEditarVenta(venta) {
    return (
      venta?.estado === "Pendiente" ||
      venta?.estado === "Venta concretada"
    );
  }

  function iniciarEdicionVenta(venta) {
    if (!puedeEditarVenta(venta)) {
      setError("Esta venta ya no puede modificarse porque fue enviada a Electro Hogar o procesada.");
      return;
    }

    const copia = Array.isArray(venta?.productos)
      ? venta.productos.map((producto) => ({ ...producto }))
      : [];

    setProductosEditados(copia);
    setEditandoVenta(true);
    setError("");
  }

  function cerrarDetalleVenta() {
    setVentaSeleccionada(null);
    setEditandoVenta(false);
    setProductosEditados([]);
  }

  function cancelarEdicionVenta() {
    setEditandoVenta(false);
    setProductosEditados([]);
  }

  function cambiarCantidadEditada(index, valor) {
    const cantidad = Math.max(1, Number(valor) || 1);

    setProductosEditados((actuales) =>
      actuales.map((producto, productoIndex) => {
        if (productoIndex !== index) return producto;

        const productoId =
          producto?.productoId ||
          producto?.id ||
          producto?.producto?.id;

        const productoCatalogo =
          producto?.__productoCatalogo ||
          productosCatalogo.find(
            (item) => item?.id === productoId
          ) ||
          producto;

        const precioActualizado = obtenerPrecioEdicion(
          productoCatalogo,
          cantidad
        );

        return {
          ...producto,
          cantidad,
          precioFinal: precioActualizado,
          precioVenta: precioActualizado,
          __precioDinamicoEdicion: true,
          __productoCatalogo: productoCatalogo,
        };
      })
    );
  }

  function agregarProductoDesdeCatalogo(producto) {
    if (!producto?.id) return;

    const cantidadNueva = Math.max(
      1,
      Number(cantidadProductoNuevo) || 1
    );

    setProductosEditados((actuales) => {
      const indiceExistente = actuales.findIndex(
        (item) =>
          (item?.productoId || item?.id) === producto.id
      );

      if (indiceExistente >= 0) {
        return actuales.map((item, index) => {
          if (index !== indiceExistente) return item;

          const cantidadActual =
            Number(item?.cantidad) || 1;

          const cantidadTotal =
            cantidadActual + cantidadNueva;

          const precioFinal =
            obtenerPrecioEdicion(
              producto,
              cantidadTotal
            );

          return {
            ...item,
            ...producto,
            productoId: producto.id,
            cantidad: cantidadTotal,
            precioFinal,
            precioVenta: precioFinal,
            __precioDinamicoEdicion: true,
            __productoCatalogo: producto,
          };
        });
      }

      const precioFinal =
        obtenerPrecioEdicion(
          producto,
          cantidadNueva
        );

      const productoVenta = {
        ...producto,
        productoId: producto.id,
        cantidad: cantidadNueva,
        precioFinal,
        precioVenta: precioFinal,
        __precioDinamicoEdicion: true,
        __productoCatalogo: producto,
      };

      return [...actuales, productoVenta];
    });

    setBusquedaProducto("");
    setCantidadProductoNuevo(1);
  }

  function quitarProductoEditado(index) {
    setProductosEditados((actuales) =>
      actuales.filter((_, productoIndex) => productoIndex !== index)
    );
  }

  async function guardarEdicionVenta() {
    if (!ventaSeleccionada) return;

    if (productosEditados.length === 0) {
      setError("La venta debe conservar al menos un producto.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const productosParaGuardar = productosEditados.map((producto) => {
        const {
          __precioDinamicoEdicion,
          __productoCatalogo,
          ...productoLimpio
        } = producto;

        return productoLimpio;
      });

      await actualizarProductosVentaRevendedor(
        ventaSeleccionada.id,
        productosParaGuardar
      );

      setVentaSeleccionada((actual) =>
        actual
          ? { ...actual, productos: productosParaGuardar }
          : actual
      );

      setEditandoVenta(false);
      setProductosEditados([]);
    } catch (err) {
      console.error(err);
      setError(
        err?.message || "No se pudieron guardar los cambios de la venta."
      );
    } finally {
      setGuardando(false);
    }
  }

  function abrirWhatsApp(venta) {
    const numero = String(venta?.cliente?.whatsapp || "").replace(/\D/g, "");
    if (!numero) {
      setError("Esta venta no tiene un número de WhatsApp cargado.");
      return;
    }

    const numeroArgentina = numero.startsWith("54") ? numero : `54${numero}`;
    const nombre = venta?.cliente?.nombreCompleto || "cliente";
    const mensaje = encodeURIComponent(
      `Hola ${nombre}, ¿cómo estás? Te escribo por la consulta que realizaste.`
    );

    window.open(`https://wa.me/${numeroArgentina}?text=${mensaje}`, "_blank", "noopener,noreferrer");
  }

  const nombreSlug =
    slug
      ?.split("-")
      .filter(Boolean)
      .map(
        (parte) =>
          parte.charAt(0).toUpperCase() + parte.slice(1)
      )
      .join(" ") || "Tu catálogo";

  return (
    <div className="mis-ventas-page">
      <style>{estilos}</style>

      <aside className="mv-sidebar">
        <div className="mv-sidebar-brand">
          <div className="mv-brand-mark">
            <ShoppingBagIcon />
          </div>
          <div>
            <strong>Panel de Ventas</strong>
            <span>Gestión comercial</span>
          </div>
        </div>

        <div className="mv-sidebar-section-title">MI PANEL</div>

        <nav className="mv-sidebar-nav">
          <Link to={`/v/${slug || ""}`} className="mv-nav-item">
            <ArrowIcon />
            <span>Mi catálogo</span>
          </Link>
          <Link to={`/v/${slug || ""}/mis-ventas`} className="mv-nav-item active">
            <ShoppingBagIcon />
            <span>Mis ventas</span>
            <b>{estadisticas.consultas}</b>
          </Link>
        </nav>

        <div className="mv-sidebar-bottom">
          <div className="mv-sidebar-user">
            <div className="mv-sidebar-avatar">
              {nombreSlug.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{nombreSlug}</strong>
              <span>Revendedor activo</span>
            </div>
          </div>

          <Link to={`/v/${slug || ""}`} className="mv-sidebar-catalog-button">
            <ArrowIcon />
            Volver al catálogo
          </Link>
        </div>
      </aside>

      <main className="mv-main">
        <header className="mv-topbar">
          <div className="mv-topbar-title">
            <span className="mv-online-dot" />
            <strong>Panel de Ventas</strong>
          </div>

          <div className="mv-topbar-right">
            <span className="mv-topbar-name">{nombreSlug}</span>
            <span className="mv-topbar-status">● Activo</span>
          </div>
        </header>

        <div className="mv-content">
          <div className="mv-page-heading">
            <div>
              <p className="mv-eyebrow">GESTIÓN COMERCIAL</p>
              <h1>Mis ventas</h1>
              <p>Administrá tus consultas, seguimientos y ventas generadas desde tu catálogo.</p>
            </div>

            <div className="mv-heading-catalog">
              <span>CATÁLOGO</span>
              <strong>{nombreSlug}</strong>
              <small>/v/{slug || ""}</small>
            </div>
          </div>

          {error && (
            <div className="mv-error">
              <span>{error}</span>
              <button type="button" onClick={() => setError("")} aria-label="Cerrar aviso">
                <CloseIcon />
              </button>
            </div>
          )}

          <section className="mv-stats-grid">
            <div className="mv-stat-card dark">
              <div className="mv-stat-head">
                <span>Total de consultas</span>
                <div className="mv-stat-icon"><UsersIcon /></div>
              </div>
              <strong>{estadisticas.consultas}</strong>
              <small>Todo el movimiento de tu catálogo</small>
            </div>

            <div className="mv-stat-card">
              <div className="mv-stat-head">
                <span>En seguimiento</span>
                <div className="mv-stat-icon blue"><ShoppingBagIcon /></div>
              </div>
              <strong>{estadisticas.seguimiento}</strong>
              <small>Clientes abiertos actualmente</small>
            </div>

            <div className="mv-stat-card">
              <div className="mv-stat-head">
                <span>Ventas concretadas</span>
                <div className="mv-stat-icon green"><CheckIcon /></div>
              </div>
              <strong>{estadisticas.concretadas}</strong>
              <small>Solo validadas por Electro Hogar</small>
            </div>

            <div className="mv-stat-card">
              <div className="mv-stat-head">
                <span>Caídas</span>
                <div className="mv-stat-icon red"><TrashIcon /></div>
              </div>
              <strong>{estadisticas.sinCerrar}</strong>
              <small>Operaciones que no terminaron en venta</small>
            </div>
          </section>

          <section className="mv-section">
            <div className="mv-section-heading">
              <div className="mv-section-title">
                <div className="mv-section-icon"><ShoppingBagIcon /></div>
                <div>
                  <p>ACTIVIDAD COMERCIAL</p>
                  <h2>Ventas y consultas</h2>
                  <span>Gestioná cada oportunidad desde un solo lugar.</span>
                </div>
              </div>
              {estadisticas.eliminables > 0 && (
                <button
                  type="button"
                  className="mv-danger-outline"
                  onClick={() => setModalLimpiarAbierto(true)}
                  disabled={guardando}
                >
                  <TrashIcon />
                  Limpiar caídas
                  <b>{estadisticas.eliminables}</b>
                </button>
              )}
            </div>

            <div className="mv-filter-chips">
              {[
                ["Todas", estadisticas.consultas],
                ["Pendiente", estadisticas.seguimiento],
                ["Venta concretada", estadisticas.concretadas],
                ["No cerré venta", estadisticas.sinCerrar],
              ].map(([valor, cantidad]) => {
                const label = valor === "Todas" ? "Todas" : valor === "Pendiente" ? "En seguimiento" : valor === "Venta concretada" ? "Concretadas" : "Caídas";
                return (
                  <button
                    key={valor}
                    type="button"
                    className={`mv-chip ${filtroEstado === valor ? "active" : ""}`}
                    onClick={() => setFiltroEstado(valor)}
                  >
                    {label}<b>{cantidad}</b>
                  </button>
                );
              })}
            </div>

            <div className="mv-toolbar">
              <div className="mv-search">
                <SearchIcon />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder="Buscar por cliente, WhatsApp, producto o ID..."
                />
              </div>

              <label className="mv-filter">
                <span>ESTADO</span>
                <div className="mv-select-wrap">
                  <select value={filtroEstado} onChange={(event) => setFiltroEstado(event.target.value)}>
                    <option value="Todas">Todos los estados</option>
                    <option value="Pendiente">En seguimiento</option>
                    <option value="Confirmada por revendedor">Confirmada por vos</option>
                    <option value="Venta concretada">Venta concretada</option>
                    <option value="Enviada a Electro Hogar">Enviada a Electro Hogar</option>
                    <option value="Procesado">Procesado</option>
                    <option value="No cerré venta">No cerré venta</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </label>

              <div className="mv-result-count">
                {ventasFiltradas.length} resultado{ventasFiltradas.length === 1 ? "" : "s"}
              </div>
            </div>

            {ventasConcretadasDisponibles.length > 0 && (
              <section className="mv-pedido-panel">
                <div className="mv-pedido-panel-main">
                  <div className="mv-pedido-icon">
                    <ShoppingBagIcon />
                  </div>

                  <div className="mv-pedido-copy">
                    <span className="mv-pedido-kicker">PEDIDO A ELECTRO HOGAR</span>
                    <h3>Prepará tu pedido</h3>
                    <p>
                      Seleccioná las ventas que confirmaste y enviá un único pedido
                      consolidado a Electro Hogar para validación final.
                    </p>
                  </div>
                </div>

                <div className="mv-pedido-actions">
                  <button
                    type="button"
                    className="mv-pedido-select-all"
                    onClick={seleccionarTodasLasVentas}
                    disabled={guardando || enviandoPedido}
                  >
                    {ventasSeleccionadas.length === ventasConcretadasDisponibles.length
                      ? "Deseleccionar todas"
                      : "Seleccionar todas"}
                  </button>

                  <button
                    type="button"
                    className="mv-pedido-primary"
                    onClick={abrirPedidoConsolidado}
                    disabled={ventasSeleccionadas.length === 0 || guardando || enviandoPedido}
                  >
                    <ShoppingBagIcon />
                    Preparar pedido
                    <b>{ventasSeleccionadas.length}</b>
                  </button>
                </div>
              </section>
            )}

            {ventasConcretadasDisponibles.length > 0 && (
              <div className="mv-pedido-selection-list">
                <div className="mv-pedido-selection-head">
                  <div>
                    <strong>Ventas listas para enviar</strong>
                    <span>
                      Marcá las ventas que querés incluir en este pedido.
                    </span>
                  </div>
                  <span className="mv-pedido-selection-count">
                    {ventasSeleccionadas.length} seleccionada{ventasSeleccionadas.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mv-pedido-selection-grid">
                  {ventasConcretadasDisponibles.map((venta) => {
                    const cliente = venta.cliente || {};
                    const seleccionado = ventasSeleccionadas.includes(venta.id);
                    const nombreCliente =
                      cliente.nombreCompleto ||
                      `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() ||
                      "Cliente";

                    return (
                      <button
                        type="button"
                        key={venta.id}
                        className={`mv-pedido-sale ${seleccionado ? "selected" : ""}`}
                        onClick={() => toggleVentaSeleccionada(venta.id)}
                        disabled={guardando || enviandoPedido}
                      >
                        <span className="mv-pedido-check">
                          {seleccionado ? <CheckIcon /> : null}
                        </span>

                        <span className="mv-pedido-sale-info">
                          <strong>{nombreCliente}</strong>
                          <small>
                            {obtenerCantidadProductos(venta)} producto
                            {obtenerCantidadProductos(venta) === 1 ? "" : "s"}
                            {" · "}
                            {obtenerFecha(venta.creadoEn)}
                          </small>
                        </span>

                        <span className="mv-pedido-sale-total">
                          $ {formatearPrecio(calcularTotalVenta(venta))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mv-table-card">
              <div className="mv-table-head">
                <span>Cliente</span>
                <span>Producto</span>
                <span>Total</span>
                <span>Estado</span>
                <span>Fecha</span>
                <span>Acciones</span>
              </div>

              {cargando ? (
                <div className="mv-loading">
                  <div className="mv-spinner" />
                  <strong>Cargando tus ventas...</strong>
                  <span>Estamos actualizando tu panel.</span>
                </div>
              ) : ventasFiltradas.length === 0 ? (
                <div className="mv-empty">
                  <div className="mv-empty-icon"><ShoppingBagIcon /></div>
                  <h3>{ventas.length === 0 ? "Todavía no tenés ventas" : "No hay resultados"}</h3>
                  <p>{ventas.length === 0 ? "Cuando aparezcan consultas desde tu catálogo, las vas a encontrar acá." : "Probá cambiar la búsqueda o el filtro seleccionado."}</p>
                </div>
              ) : (
                <div className="mv-table-body">
                  {ventasFiltradas.map((venta) => {
                    const cliente = venta.cliente || {};
                    const cantidadProductos = obtenerCantidadProductos(venta);
                    const total = calcularTotalVenta(venta);
                    const eliminable = estadoEsEliminable(venta.estado);
                    const productoPrincipal = Array.isArray(venta.productos) && venta.productos[0];
                    const nombreProducto = productoPrincipal?.nombre || productoPrincipal?.titulo || "Producto sin nombre";

                    return (
                      <article className="mv-sale-row" key={venta.id}>
                        <div className="mv-sale-client" data-label="Cliente">
                          <div className="mv-sale-avatar">
                            {(cliente.nombreCompleto || cliente.nombre || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{cliente.nombreCompleto || `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() || "Cliente sin nombre"}</strong>
                            <span>{cliente.whatsapp || "Sin WhatsApp"}</span>
                          </div>
                        </div>

                        <div className="mv-sale-product" data-label="Producto">
                          <strong>{nombreProducto}</strong>
                          <span>{cantidadProductos} unidad{cantidadProductos === 1 ? "" : "es"}</span>
                        </div>

                        <div className="mv-sale-total" data-label="Total">
                          <span>$</span>
                          <strong>{formatearPrecio(total)}</strong>
                        </div>

                        <div data-label="Estado">
                          <span className={`mv-status ${obtenerEstadoClase(venta.estado)}`}>{venta.estado || "Pendiente"}</span>
                        </div>

                        <div className="mv-sale-date" data-label="Fecha">
                          {obtenerFecha(venta.creadoEn)}
                        </div>

                        <div className="mv-sale-actions" data-label="Acciones">
                          <button type="button" className="mv-action whatsapp" onClick={() => abrirWhatsApp(venta)} title="Contactar por WhatsApp">
                            WhatsApp
                          </button>
                          <button type="button" className="mv-action" onClick={() => setVentaSeleccionada(venta)}>
                            Ver detalle
                          </button>
                          {venta.estado === "Pendiente" && (
                            <button type="button" className="mv-action primary" disabled={guardando} onClick={() => confirmarVenta(venta)}>
                              <CheckIcon /> Confirmar
                            </button>
                          )}
                          {eliminable && (
                            <button type="button" className="mv-icon-action danger" disabled={guardando || eliminandoId === venta.id} onClick={() => eliminarVenta(venta)} title="Eliminar">
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {ventaSeleccionada && (
        <div className="mis-ventas-modal-overlay" onClick={(event) => { if (event.target === event.currentTarget) cerrarDetalleVenta(); }}>
          <div className="mis-ventas-modal">
            <div className="mis-ventas-modal-header">
              <div>
                <p className="mis-ventas-modal-eyebrow">DETALLE DE VENTA</p>
                <h2>{ventaSeleccionada.cliente?.nombreCompleto || "Cliente"}</h2>
                <span>{ventaSeleccionada.cliente?.whatsapp || "Sin WhatsApp"}</span>
              </div>
              <button type="button" className="mis-ventas-modal-close" onClick={() => cerrarDetalleVenta()} aria-label="Cerrar detalle"><CloseIcon /></button>
            </div>

            <div className="mis-ventas-modal-status-row">
              <span className={`mis-venta-status ${obtenerEstadoClase(ventaSeleccionada.estado)}`}>{ventaSeleccionada.estado || "Pendiente"}</span>
              <span>{obtenerFecha(ventaSeleccionada.creadoEn)}</span>
            </div>

            {ventaSeleccionada.estado === "Enviada a Electro Hogar" &&
              ventaSeleccionada.resultadoComercial !== "concretada" &&
              ventaSeleccionada.resultadoComercial !== "caida" && (
                <div className="mv-validation-notice">
                  <CheckIcon />
                  <span>
                    Electro Hogar está revisando esta operación. Todavía puede modificarse o caerse.
                  </span>
                </div>
              )}

            <div className="mis-ventas-modal-section">
              <div className="mis-ventas-modal-section-title">
                <ShoppingBagIcon />
                <div>
                  <h3>{editandoVenta ? "Editar productos" : "Productos"}</h3>
                  <span className="mv-modal-section-subtitle">
                    {editandoVenta
                      ? "Ajustá las cantidades antes de guardar."
                      : "Detalle de los productos de esta venta."}
                  </span>
                </div>
              </div>

              {editandoVenta ? (
                <div className="mv-edit-products">
                  <div className="mv-product-picker">
                    <div className="mv-product-picker-head">
                      <div>
                        <strong>Agregar producto</strong>
                        <span>Buscá en el catálogo maestro y sumalo a esta venta.</span>
                      </div>
                      <span className="mv-product-picker-count">{productosEditados.length} productos</span>
                    </div>

                    <div className="mv-product-picker-controls">
                      <div className="mv-product-search">
                        <SearchIcon />
                        <input
                          type="text"
                          value={busquedaProducto}
                          onChange={(event) => setBusquedaProducto(event.target.value)}
                          placeholder="Buscar producto, marca o categoría..."
                          disabled={guardando}
                        />
                        {busquedaProducto && (
                          <button
                            type="button"
                            onClick={() => setBusquedaProducto("")}
                            aria-label="Limpiar búsqueda"
                          >
                            <CloseIcon />
                          </button>
                        )}
                      </div>

                      <div className="mv-new-product-qty">
                        <span>Cantidad</span>
                        <div>
                          <button type="button" onClick={() => setCantidadProductoNuevo((valor) => Math.max(1, Number(valor) - 1))}>−</button>
                          <b>{cantidadProductoNuevo}</b>
                          <button type="button" onClick={() => setCantidadProductoNuevo((valor) => Number(valor) + 1)}>+</button>
                        </div>
                      </div>
                    </div>

                    {busquedaProducto.trim() && (
                      <div className="mv-product-results">
                        {productosDisponiblesEdicion.length > 0 ? (
                          productosDisponiblesEdicion.map((producto) => {
                            const precio = obtenerPrecioEdicion(
                              producto,
                              cantidadProductoNuevo
                            );
                            const imagen = producto.imagenes?.[0] || producto.imagen || "";

                            return (
                              <button
                                type="button"
                                className="mv-product-result"
                                key={producto.id}
                                onClick={() => agregarProductoDesdeCatalogo(producto)}
                                disabled={guardando}
                              >
                                <span className="mv-product-result-image">
                                  {imagen ? <img src={imagen} alt="" /> : <ShoppingBagIcon />}
                                </span>
                                <span className="mv-product-result-info">
                                  <strong>{producto.nombre || "Producto"}</strong>
                                  <small>{producto.marca || producto.categoria || "Catálogo"}</small>
                                </span>
                                <span className="mv-product-result-price">
                                  <small>Precio final</small>
                                  <b>$ {formatearPrecio(precio)}</b>
                                </span>
                                <span className="mv-product-result-add">+</span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="mv-product-no-results">
                            <SearchIcon />
                            <div>
                              <strong>No encontramos ese producto</strong>
                              <span>Probá con otro nombre, marca o categoría.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {productosEditados.length > 0 ? (
                    productosEditados.map((producto, index) => {
                      const precio =
                        Number(producto?.precioFinal) ||
                        Number(producto?.precioVenta) ||
                        Number(producto?.precio) ||
                        0;
                      const cantidad = Number(producto?.cantidad) || 1;

                      return (
                        <div className="mv-edit-product" key={producto.id || producto.productoId || index}>
                          <div className="mv-edit-product-info">
                            <strong>{producto.nombre || producto.titulo || "Producto"}</strong>
                            <span>$ {formatearPrecio(precio)} por unidad</span>
                          </div>

                          <div className="mv-edit-product-controls">
                            <button
                              type="button"
                              onClick={() => cambiarCantidadEditada(index, cantidad - 1)}
                              disabled={cantidad <= 1 || guardando}
                              aria-label="Disminuir cantidad"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={cantidad}
                              onChange={(event) => cambiarCantidadEditada(index, event.target.value)}
                              disabled={guardando}
                              aria-label={`Cantidad de ${producto.nombre || producto.titulo || "producto"}`}
                            />
                            <button
                              type="button"
                              onClick={() => cambiarCantidadEditada(index, cantidad + 1)}
                              disabled={guardando}
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>

                          <strong className="mv-edit-product-subtotal">
                            $ {formatearPrecio(precio * cantidad)}
                          </strong>

                          <button
                            type="button"
                            className="mv-edit-product-remove"
                            onClick={() => quitarProductoEditado(index)}
                            disabled={guardando}
                            title="Quitar producto"
                            aria-label="Quitar producto"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="mv-edit-empty">No quedan productos en esta venta.</div>
                  )}

                  <div className="mv-edit-note">
                    <SparkIcon />
                    <span>Los productos que ya estaban en la venta conservan su precio guardado. Los nuevos toman el precio vigente del catálogo según la cantidad seleccionada.</span>
                  </div>
                </div>
              ) : (
                Array.isArray(ventaSeleccionada.productos) && ventaSeleccionada.productos.length > 0 ? (
                  <div className="mis-ventas-productos">
                    {ventaSeleccionada.productos.map((producto, index) => {
                      const precio = Number(producto?.precioFinal) || Number(producto?.precioVenta) || Number(producto?.precio) || 0;
                      const cantidad = Number(producto?.cantidad) || 1;
                      return (
                        <div className="mis-ventas-producto" key={producto.id || producto.productoId || index}>
                          <div><strong>{producto.nombre || producto.titulo || "Producto"}</strong><span>Cantidad: {cantidad}</span></div>
                          <strong>$ {formatearPrecio(precio * cantidad)}</strong>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="mis-ventas-sin-productos">Esta venta todavía no tiene productos cargados.</p>
              )}
            </div>

            <div className="mv-detail-grid">
              <div><span>Vendedor oficial</span><strong>{ventaSeleccionada.cliente?.vendedorOficialNombre || "Pendiente"}</strong></div>
              <div><span>ID de venta</span><strong>{ventaSeleccionada.id}</strong></div>
            </div>

            <div className="mis-ventas-modal-total"><span>Total estimado</span><strong>$ {formatearPrecio(editandoVenta ? calcularTotalVenta({ productos: productosEditados }) : calcularTotalVenta(ventaSeleccionada))}</strong></div>

            <div className="mis-ventas-modal-actions">
              {editandoVenta ? (
                <>
                  <button type="button" className="mis-venta-button ghost" onClick={cancelarEdicionVenta} disabled={guardando}>Cancelar</button>
                  <button type="button" className="mis-venta-button primary" disabled={guardando || productosEditados.length === 0} onClick={guardarEdicionVenta}>
                    <CheckIcon /> {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="mis-venta-button ghost" onClick={() => abrirWhatsApp(ventaSeleccionada)}>WhatsApp</button>
                  {puedeEditarVenta(ventaSeleccionada) && (
                    <button type="button" className="mis-venta-button edit" onClick={() => iniciarEdicionVenta(ventaSeleccionada)}>Editar venta</button>
                  )}
                  {ventaSeleccionada.estado === "Pendiente" && <button type="button" className="mis-venta-button primary" disabled={guardando} onClick={() => confirmarVenta(ventaSeleccionada)}><CheckIcon /> Confirmar que vendí</button>}
                  {estadoEsEliminable(ventaSeleccionada.estado) && <button type="button" className="mis-venta-button danger" disabled={eliminandoId === ventaSeleccionada.id} onClick={() => eliminarVenta(ventaSeleccionada)}><TrashIcon /> {eliminandoId === ventaSeleccionada.id ? "Eliminando..." : "Eliminar venta"}</button>}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {pedidoModalAbierto && (
        <div className="mv-modal-backdrop" onMouseDown={cerrarPedidoConsolidado}>
          <div
            className="mv-modal mv-pedido-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mv-modal-header">
              <div>
                <p>REVISIÓN FINAL</p>
                <h2>Pedido consolidado</h2>
                <span>
                  Vas a enviar {ventasSeleccionadasData.length} venta
                  {ventasSeleccionadasData.length === 1 ? "" : "s"} a Electro Hogar.
                </span>
              </div>

              <button
                type="button"
                className="mv-modal-close"
                onClick={cerrarPedidoConsolidado}
                disabled={enviandoPedido}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mv-pedido-modal-summary">
              <div>
                <span>Ventas</span>
                <strong>{ventasSeleccionadasData.length}</strong>
              </div>
              <div>
                <span>Clientes</span>
                <strong>{ventasSeleccionadasData.length}</strong>
              </div>
              <div>
                <span>Total estimado</span>
                <strong>$ {formatearPrecio(totalSeleccionado)}</strong>
              </div>
            </div>

            <div className="mv-pedido-modal-list">
              {ventasSeleccionadasData.map((venta) => {
                const cliente = venta.cliente || {};
                const nombreCliente =
                  cliente.nombreCompleto ||
                  `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() ||
                  "Cliente";

                return (
                  <div className="mv-pedido-modal-sale" key={venta.id}>
                    <div className="mv-pedido-modal-sale-head">
                      <div>
                        <strong>{nombreCliente}</strong>
                        <span>
                          {cliente.whatsapp || "Sin WhatsApp"} · Venta #{venta.id}
                        </span>
                      </div>
                      <strong>
                        $ {formatearPrecio(calcularTotalVenta(venta))}
                      </strong>
                    </div>

                    <div className="mv-pedido-modal-products">
                      {(Array.isArray(venta.productos) ? venta.productos : []).map(
                        (producto, index) => {
                          const cantidad = Number(producto?.cantidad) || 1;
                          const precio =
                            Number(producto?.precioFinal) ||
                            Number(producto?.precioVenta) ||
                            Number(producto?.precio) ||
                            0;

                          return (
                            <div
                              className="mv-pedido-modal-product"
                              key={producto.id || producto.productoId || index}
                            >
                              <span>{producto.nombre || producto.titulo || "Producto"}</span>
                              <small>x{cantidad}</small>
                              <strong>
                                $ {formatearPrecio(precio * cantidad)}
                              </strong>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mv-pedido-warning">
              <CheckIcon />
              <span>
                Al enviar, estas operaciones pasarán a <strong>Enviada a Electro Hogar</strong>
                {" "}y quedarán vinculadas a este pedido. Electro Hogar podrá marcarlas
                como <strong>concretadas</strong> o <strong>caídas</strong> antes de cerrar la operación.
              </span>
            </div>

            <div className="mv-modal-actions">
              <button
                type="button"
                className="mis-venta-button ghost"
                onClick={cerrarPedidoConsolidado}
                disabled={enviandoPedido}
              >
                Volver
              </button>

              <button
                type="button"
                className="mis-venta-button primary"
                onClick={enviarPedidoConsolidado}
                disabled={enviandoPedido || ventasSeleccionadasData.length === 0}
              >
                <CheckIcon />
                {enviandoPedido ? "Enviando pedido..." : "Finalizar y enviar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalLimpiarAbierto && (
        <div className="mis-ventas-modal-overlay" onClick={(event) => { if (event.target === event.currentTarget) setModalLimpiarAbierto(false); }}>
          <div className="mis-ventas-confirm-modal">
            <div className="mis-ventas-confirm-icon"><TrashIcon /></div>
            <p className="mis-ventas-modal-eyebrow">LIMPIEZA DEL PANEL</p>
            <h2>¿Eliminar ventas caídas?</h2>
            <p>Se eliminarán las ventas que estén en seguimiento o marcadas como “No cerré venta”. Las ventas concretadas, enviadas o procesadas no serán tocadas.</p>
            <div className="mis-ventas-confirm-count"><strong>{estadisticas.eliminables}</strong><span>ventas a eliminar</span></div>
            <div className="mis-ventas-confirm-actions">
              <button type="button" className="mis-venta-button ghost large" onClick={() => setModalLimpiarAbierto(false)} disabled={guardando}>Cancelar</button>
              <button type="button" className="mis-venta-button danger large" onClick={limpiarVentasCaidas} disabled={guardando}><TrashIcon /> {guardando ? "Limpiando..." : "Eliminar ventas"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

/* ========================================================================== 
   ESTILOS
   ========================================================================== */

const estilos = `
  .mv-pedido-panel {
    margin: 0 0 18px;
    padding: 20px 22px;
    border: 1px solid #dce5e0;
    border-radius: 18px;
    background: linear-gradient(135deg, #f7faf8 0%, #ffffff 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  }

  .mv-pedido-panel-main {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .mv-pedido-icon {
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: #dcfce7;
    color: #15803d;
  }

  .mv-pedido-icon svg,
  .mv-pedido-primary svg,
  .mv-pedido-check svg,
  .mv-pedido-warning svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .mv-pedido-copy {
    min-width: 0;
  }

  .mv-pedido-kicker {
    display: block;
    margin-bottom: 3px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .12em;
    color: #16a34a;
  }

  .mv-pedido-copy h3 {
    margin: 0;
    color: #0f172a;
    font-size: 18px;
  }

  .mv-pedido-copy p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 13px;
  }

  .mv-pedido-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .mv-pedido-select-all,
  .mv-pedido-primary {
    min-height: 42px;
    border-radius: 11px;
    padding: 0 14px;
    border: 1px solid #d8e1dc;
    background: #fff;
    color: #334155;
    font-weight: 750;
    cursor: pointer;
  }

  .mv-pedido-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-color: #16a34a;
    background: #16a34a;
    color: #fff;
    box-shadow: 0 7px 18px rgba(22, 163, 74, .18);
  }

  .mv-pedido-primary:disabled,
  .mv-pedido-select-all:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .mv-pedido-primary b {
    min-width: 22px;
    height: 22px;
    padding: 0 5px;
    border-radius: 999px;
    display: inline-grid;
    place-items: center;
    background: rgba(255,255,255,.18);
    font-size: 11px;
  }

  .mv-pedido-selection-list {
    margin: 0 0 18px;
    padding: 18px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #fff;
  }

  .mv-pedido-selection-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .mv-pedido-selection-head > div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .mv-pedido-selection-head strong {
    color: #0f172a;
    font-size: 14px;
  }

  .mv-pedido-selection-head span {
    color: #64748b;
    font-size: 12px;
  }

  .mv-pedido-selection-count {
    color: #15803d !important;
    font-weight: 800;
  }

  .mv-pedido-selection-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .mv-pedido-sale {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
    text-align: left;
    cursor: pointer;
    transition: .16s ease;
  }

  .mv-pedido-sale:hover {
    border-color: #86efac;
    transform: translateY(-1px);
  }

  .mv-pedido-sale.selected {
    border-color: #22c55e;
    background: #f0fdf4;
    box-shadow: inset 0 0 0 1px rgba(34,197,94,.14);
  }

  .mv-pedido-check {
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    color: #fff;
  }

  .mv-pedido-sale.selected .mv-pedido-check {
    border-color: #16a34a;
    background: #16a34a;
  }

  .mv-pedido-sale-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .mv-pedido-sale-info strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #0f172a;
    font-size: 13px;
  }

  .mv-pedido-sale-info small {
    color: #64748b;
    font-size: 11px;
  }

  .mv-pedido-sale-total {
    color: #0f172a;
    font-size: 13px;
    font-weight: 850;
    white-space: nowrap;
  }

  .mv-pedido-modal {
    max-width: 780px !important;
  }

  .mv-pedido-modal-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 0 0 14px;
  }

  .mv-pedido-modal-summary > div {
    padding: 13px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #f8fafc;
  }

  .mv-pedido-modal-summary span {
    display: block;
    color: #64748b;
    font-size: 11px;
    margin-bottom: 4px;
  }

  .mv-pedido-modal-summary strong {
    color: #0f172a;
    font-size: 18px;
  }

  .mv-pedido-modal-list {
    max-height: 420px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mv-pedido-modal-sale {
    padding: 14px;
    border: 1px solid #e2e8f0;
    border-radius: 13px;
    background: #fff;
  }

  .mv-pedido-modal-sale-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eef2f7;
  }

  .mv-pedido-modal-sale-head > div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .mv-pedido-modal-sale-head strong {
    color: #0f172a;
    font-size: 14px;
  }

  .mv-pedido-modal-sale-head span {
    color: #64748b;
    font-size: 11px;
  }

  .mv-pedido-modal-products {
    padding-top: 7px;
  }

  .mv-pedido-modal-product {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 38px 105px;
    gap: 8px;
    align-items: center;
    padding: 7px 0;
  }

  .mv-pedido-modal-product span {
    color: #334155;
    font-size: 12px;
  }

  .mv-pedido-modal-product small {
    color: #64748b;
    text-align: center;
  }

  .mv-pedido-modal-product strong {
    color: #0f172a;
    text-align: right;
    font-size: 12px;
  }

  .mv-pedido-warning {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 14px;
    padding: 11px 12px;
    border-radius: 11px;
    background: #f0fdf4;
    color: #166534;
    font-size: 11px;
    line-height: 1.45;
  }

  @media (max-width: 760px) {
    .mv-pedido-panel {
      align-items: stretch;
      flex-direction: column;
      padding: 16px;
    }

    .mv-pedido-actions {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
    }

    .mv-pedido-select-all,
    .mv-pedido-primary {
      width: 100%;
    }

    .mv-pedido-selection-grid {
      grid-template-columns: 1fr;
    }

    .mv-pedido-selection-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .mv-pedido-modal-summary {
      grid-template-columns: 1fr 1fr;
    }

    .mv-pedido-modal-summary > div:last-child {
      grid-column: 1 / -1;
    }

    .mv-pedido-modal-product {
      grid-template-columns: minmax(0, 1fr) 34px 90px;
    }
  }

  .mis-ventas-page {
    --mv-dark: #0f1720;
    --mv-dark-2: #111c26;
    --mv-green: #16a34a;
    --mv-green-dark: #15803d;
    --mv-green-soft: #eefbf2;
    --mv-ink: #17201b;
    --mv-muted: #68746d;
    --mv-line: #e4ebe7;
    width: 100%;
    min-height: 100vh;
    background: #edf3ef;
    color: var(--mv-ink);
  }

  .mv-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 20;
    width: 278px;
    box-sizing: border-box;
    padding: 26px 18px 18px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #0e1820 0%, #101b23 100%);
    color: #fff;
    box-shadow: 12px 0 35px rgba(15,23,32,.10);
  }

  .mv-sidebar-brand { display:flex; align-items:center; gap:12px; padding:0 10px 25px; border-bottom:1px solid rgba(255,255,255,.07); }
  .mv-brand-mark { width:43px; height:43px; flex:0 0 43px; display:flex; align-items:center; justify-content:center; border-radius:13px; background:linear-gradient(145deg,#16a34a,#22c55e); box-shadow:0 9px 22px rgba(22,163,74,.18); }
  .mv-brand-mark svg { width:22px; height:22px; stroke:#fff; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-sidebar-brand strong { display:block; font-size:15px; letter-spacing:-.2px; }
  .mv-sidebar-brand span { display:block; margin-top:3px; color:#8d9aa2; font-size:11px; }
  .mv-sidebar-section-title { margin:30px 11px 10px; color:#77858d; font-size:10px; font-weight:800; letter-spacing:1.2px; }
  .mv-sidebar-nav { display:grid; gap:6px; }
  .mv-nav-item { min-height:48px; box-sizing:border-box; padding:0 12px; display:flex; align-items:center; gap:11px; border:1px solid transparent; border-radius:13px; color:#b8c3c9; text-decoration:none; font-size:13px; font-weight:700; transition:.18s ease; }
  .mv-nav-item svg { width:19px; height:19px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-nav-item:hover { color:#fff; background:rgba(255,255,255,.05); }
  .mv-nav-item.active { color:#fff; background:rgba(22,163,74,.18); border-color:rgba(34,197,94,.25); box-shadow:inset 3px 0 #22c55e; }
  .mv-nav-item b { margin-left:auto; min-width:22px; height:22px; padding:0 6px; display:flex; align-items:center; justify-content:center; box-sizing:border-box; border-radius:999px; background:#16a34a; color:#fff; font-size:10px; }
  .mv-sidebar-bottom { margin-top:auto; padding-top:16px; border-top:1px solid rgba(255,255,255,.07); }
  .mv-sidebar-user { display:flex; align-items:center; gap:10px; padding:10px; margin-bottom:10px; }
  .mv-sidebar-avatar { width:38px; height:38px; flex:0 0 38px; display:flex; align-items:center; justify-content:center; border-radius:11px; background:#183025; color:#4ade80; font-weight:900; }
  .mv-sidebar-user strong { display:block; max-width:165px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; }
  .mv-sidebar-user span { display:block; margin-top:3px; color:#829099; font-size:10px; }
  .mv-sidebar-catalog-button { min-height:41px; display:flex; align-items:center; justify-content:center; gap:8px; border:1px solid rgba(255,255,255,.09); border-radius:11px; color:#dce4e8; text-decoration:none; font-size:12px; font-weight:750; background:rgba(255,255,255,.035); transition:.18s ease; }
  .mv-sidebar-catalog-button:hover { background:#16a34a; border-color:#16a34a; color:#fff; }
  .mv-sidebar-catalog-button svg { width:16px; height:16px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }

  .mv-main { margin-left:278px; min-height:100vh; }
  .mv-topbar { height:78px; box-sizing:border-box; padding:0 31px; display:flex; align-items:center; justify-content:space-between; gap:20px; background:linear-gradient(90deg,#111c25,#0f1720); color:#fff; border-bottom:1px solid rgba(255,255,255,.04); }
  .mv-topbar-title { display:flex; align-items:center; gap:11px; font-size:16px; }
  .mv-online-dot { width:9px; height:9px; border-radius:50%; background:#22c55e; box-shadow:0 0 0 5px rgba(34,197,94,.10); }
  .mv-topbar-right { display:flex; align-items:center; gap:14px; }
  .mv-topbar-name { color:#d7e0e4; font-size:12px; font-weight:700; }
  .mv-topbar-status { padding:8px 11px; border:1px solid rgba(34,197,94,.2); border-radius:9px; background:rgba(34,197,94,.08); color:#86efac; font-size:11px; font-weight:800; }

  .mv-content { width:100%; max-width:1420px; margin:0 auto; padding:34px 32px 50px; box-sizing:border-box; }
  .mv-page-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:25px; margin-bottom:25px; }
  .mv-eyebrow { margin:2px 0 5px; color:#4b6b5a; font-size:11px; font-weight:850; letter-spacing:1.4px; }
  .mv-page-heading h1 { margin:0; color:#101a15; font-size:clamp(32px,3vw,43px); line-height:1.04; letter-spacing:-1.1px; }
  .mv-page-heading p:not(.mv-eyebrow) { margin:8px 0 0; color:#65736b; font-size:14px; }
  .mv-heading-catalog { min-width:230px; padding:15px 17px; box-sizing:border-box; border:1px solid rgba(15,23,32,.07); border-radius:15px; background:rgba(255,255,255,.72); box-shadow:0 7px 20px rgba(15,23,32,.04); }
  .mv-heading-catalog span,.mv-heading-catalog small { display:block; color:#7d8982; font-size:9px; font-weight:850; letter-spacing:1px; text-transform:uppercase; }
  .mv-heading-catalog strong { display:block; margin:5px 0 4px; color:#17201b; font-size:14px; }
  .mv-heading-catalog small { text-transform:none; letter-spacing:0; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-weight:600; }

  .mv-error { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; padding:12px 14px; border:1px solid #fecaca; border-radius:11px; background:#fef2f2; color:#b91c1c; font-size:12px; font-weight:700; }
  .mv-error button { width:29px; height:29px; display:flex; align-items:center; justify-content:center; border:0; border-radius:8px; background:rgba(185,28,28,.06); color:#b91c1c; cursor:pointer; }
  .mv-error svg { width:15px; height:15px; stroke:currentColor; stroke-width:1.9; stroke-linecap:round; }

  .mv-stats-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin-bottom:25px; }
  .mv-stat-card { min-height:116px; padding:17px 19px; box-sizing:border-box; border:1px solid rgba(15,23,32,.07); border-radius:16px; background:rgba(255,255,255,.82); box-shadow:0 9px 25px rgba(15,23,32,.045); }
  .mv-stat-card.dark { background:#10182b; color:#fff; border-color:#10182b; box-shadow:0 12px 27px rgba(15,23,32,.12); }
  .mv-stat-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .mv-stat-head span { color:#68746d; font-size:12px; font-weight:750; }
  .mv-stat-card.dark .mv-stat-head span { color:#d5dce3; }
  .mv-stat-icon { width:31px; height:31px; display:flex; align-items:center; justify-content:center; border-radius:9px; background:#f0f5f2; color:#445149; }
  .mv-stat-icon.blue { background:#eff6ff; color:#2563eb; }
  .mv-stat-icon.green { background:#ecfdf3; color:#16a34a; }
  .mv-stat-icon.red { background:#fff1f2; color:#e11d48; }
  .mv-stat-card.dark .mv-stat-icon { background:rgba(255,255,255,.1); color:#d7e5dd; }
  .mv-stat-icon svg { width:16px; height:16px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-stat-card > strong { display:block; margin-top:12px; font-size:31px; line-height:1; letter-spacing:-.7px; }
  .mv-stat-card > small { display:block; margin-top:8px; color:#87938c; font-size:10px; }
  .mv-stat-card.dark > small { color:#9eabb5; }

  .mv-section { margin-top:2px; }
  .mv-section-heading { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-bottom:15px; }
  .mv-section-title { display:flex; align-items:center; gap:13px; }
  .mv-section-icon { width:44px; height:44px; flex:0 0 44px; display:flex; align-items:center; justify-content:center; border-radius:12px; background:#eefbf2; color:#16a34a; }
  .mv-section-icon svg { width:21px; height:21px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-section-title p { margin:0 0 2px; color:#5e7767; font-size:10px; font-weight:850; letter-spacing:1.1px; }
  .mv-section-title h2 { margin:0; color:#17201b; font-size:23px; line-height:1.1; }
  .mv-section-title span { display:block; margin-top:4px; color:#78847d; font-size:11px; }
  .mv-danger-outline { min-height:39px; display:inline-flex; align-items:center; gap:8px; padding:0 12px; border:1px solid #f1c8cd; border-radius:10px; background:#fff7f8; color:#b42332; font-size:11px; font-weight:800; cursor:pointer; }
  .mv-danger-outline:hover { background:#fff0f2; border-color:#e9a3ab; }
  .mv-danger-outline svg { width:15px; height:15px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-danger-outline b { min-width:20px; height:20px; display:flex; align-items:center; justify-content:center; border-radius:999px; background:#fee2e2; font-size:10px; }

  .mv-filter-chips { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:12px; }
  .mv-chip { min-height:31px; display:inline-flex; align-items:center; gap:7px; padding:0 10px; border:1px solid #dfe7e2; border-radius:9px; background:#fff; color:#66736b; font-size:11px; font-weight:750; cursor:pointer; }
  .mv-chip:hover { border-color:#bfe0c9; }
  .mv-chip.active { border-color:#bfe6ca; background:#eefbf2; color:#15803d; }
  .mv-chip b { min-width:18px; height:18px; display:flex; align-items:center; justify-content:center; border-radius:6px; background:#f0f3f1; color:#69766e; font-size:9px; }
  .mv-chip.active b { background:#d9f5e1; color:#15803d; }

  .mv-toolbar { display:flex; align-items:flex-end; gap:12px; margin-bottom:12px; padding:12px; border:1px solid rgba(15,23,32,.07); border-radius:14px; background:rgba(255,255,255,.82); box-shadow:0 7px 20px rgba(15,23,32,.035); }
  .mv-search { position:relative; flex:1; min-width:0; }
  .mv-search svg { position:absolute; left:13px; top:50%; width:17px; height:17px; transform:translateY(-50%); stroke:#7f8b84; stroke-width:1.8; stroke-linecap:round; }
  .mv-search input { width:100%; height:43px; box-sizing:border-box; padding:0 13px 0 39px; border:1px solid #dfe6e2; border-radius:11px; outline:0; background:#fff; color:#17201b; font:inherit; font-size:12px; }
  .mv-search input:focus { border-color:#7bd095; box-shadow:0 0 0 3px rgba(34,197,94,.08); }
  .mv-filter { width:220px; flex:0 0 220px; display:grid; gap:5px; }
  .mv-filter > span { color:#7b8780; font-size:9px; font-weight:850; letter-spacing:1px; }
  .mv-select-wrap { position:relative; }
  .mv-filter select { width:100%; height:43px; padding:0 34px 0 11px; appearance:none; border:1px solid #dfe6e2; border-radius:11px; outline:0; background:#fff; color:#26322c; font:inherit; font-size:12px; cursor:pointer; }
  .mv-select-wrap > svg { position:absolute; top:50%; right:10px; width:15px; height:15px; transform:translateY(-50%); pointer-events:none; stroke:#7e8b83; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-result-count { min-height:43px; display:flex; align-items:center; padding:0 12px; border:1px solid #e0e7e3; border-radius:11px; background:#f8faf9; color:#6f7c74; font-size:11px; font-weight:800; white-space:nowrap; }

  .mv-table-card { overflow:hidden; border:1px solid rgba(15,23,32,.07); border-radius:17px; background:rgba(255,255,255,.88); box-shadow:0 12px 30px rgba(15,23,32,.05); }
  .mv-table-head { display:grid; grid-template-columns:1.45fr 1.55fr .75fr .95fr .72fr 2fr; gap:0; padding:0 15px; border-bottom:1px solid #e7ece9; background:#f7f9f8; }
  .mv-table-head span { padding:12px 10px; color:#77837c; font-size:9px; font-weight:850; letter-spacing:.85px; text-transform:uppercase; }
  .mv-table-body { display:grid; }
  .mv-sale-row { display:grid; grid-template-columns:1.45fr 1.55fr .75fr .95fr .72fr 2fr; align-items:center; gap:0; padding:13px 15px; border-bottom:1px solid #edf1ee; transition:.18s ease; }
  .mv-sale-row:last-child { border-bottom:0; }
  .mv-sale-row:hover { background:#fbfdfb; }
  .mv-sale-row > div { min-width:0; padding:0 10px; }
  .mv-sale-client { display:flex; align-items:center; gap:9px; }
  .mv-sale-avatar { width:36px; height:36px; flex:0 0 36px; display:flex; align-items:center; justify-content:center; border-radius:10px; background:#eaf8ee; color:#15803d; font-size:13px; font-weight:900; }
  .mv-sale-client strong,.mv-sale-product strong { display:block; overflow:hidden; color:#17201b; text-overflow:ellipsis; white-space:nowrap; font-size:12px; }
  .mv-sale-client span,.mv-sale-product span { display:block; margin-top:3px; overflow:hidden; color:#89938d; text-overflow:ellipsis; white-space:nowrap; font-size:10px; }
  .mv-sale-product strong { font-size:11px; }
  .mv-sale-total { display:flex; align-items:baseline; gap:2px; white-space:nowrap; }
  .mv-sale-total span { color:#66736b; font-size:11px; }
  .mv-sale-total strong { font-size:15px; letter-spacing:-.3px; }
  .mv-sale-date { color:#56645b; font-size:11px; white-space:nowrap; }
  .mv-status { display:inline-flex; align-items:center; max-width:100%; padding:6px 8px; border-radius:8px; font-size:9px; font-weight:850; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .estado-pendiente { color:#946200; background:#fff7d6; }
  .estado-concretada { color:#166534; background:#dcfce7; }
  .estado-enviada { color:#1d4ed8; background:#dbeafe; }
  .estado-procesado { color:#6b21a8; background:#f3e8ff; }
  .estado-no-cerrada { color:#b42332; background:#fee2e2; }
  .mv-sale-actions { display:flex; align-items:center; justify-content:flex-end; flex-wrap:wrap; gap:5px; }
  .mv-action,.mv-icon-action { min-height:31px; display:inline-flex; align-items:center; justify-content:center; gap:5px; padding:0 8px; border:1px solid #dfe6e2; border-radius:8px; background:#fff; color:#46534b; font:inherit; font-size:10px; font-weight:800; cursor:pointer; white-space:nowrap; }
  .mv-action:hover,.mv-icon-action:hover { border-color:#b9dac2; background:#f8fbf9; color:#15803d; }
  .mv-action.whatsapp { border-color:#bce7ca; background:#f2fcf5; color:#15803d; }
  .mv-action.primary { border-color:#16a34a; background:#16a34a; color:#fff; }
  .mv-action.primary:hover { border-color:#15803d; background:#15803d; color:#fff; }
  .mv-icon-action { width:31px; padding:0; }
  .mv-icon-action svg,.mv-action svg { width:13px; height:13px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-icon-action.danger { border-color:#f0c4c9; background:#fff7f8; color:#b42332; }
  .mv-loading,.mv-empty { min-height:280px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px; text-align:center; }
  .mv-loading strong,.mv-empty h3 { margin:0; color:#26322c; font-size:14px; }
  .mv-loading span,.mv-empty p { margin:6px 0 0; color:#89948d; font-size:11px; }
  .mv-spinner { width:27px; height:27px; margin-bottom:9px; border:3px solid #dcf2e2; border-top-color:#16a34a; border-radius:50%; animation:mvSpin .8s linear infinite; }
  @keyframes mvSpin { to { transform:rotate(360deg); } }
  .mv-empty-icon { width:50px; height:50px; margin-bottom:11px; display:flex; align-items:center; justify-content:center; border-radius:14px; background:#eefbf2; color:#16a34a; }
  .mv-empty-icon svg { width:23px; height:23px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }

  .mv-modal-section-subtitle { display:block; margin-top:3px; color:#89948d; font-size:11px; font-weight:600; line-height:1.35; }
  .mv-modal-section-subtitle { display:block; margin-top:3px; color:#849088; font-size:10px; line-height:1.4; }
  .mv-product-picker { margin-bottom:14px; padding:13px; border:1px solid #e1e9e4; border-radius:14px; background:linear-gradient(180deg,#fbfdfc 0%,#f7faf8 100%); }
  .mv-product-picker-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
  .mv-product-picker-head strong { display:block; color:#243129; font-size:12px; }
  .mv-product-picker-head span:not(.mv-product-picker-count) { display:block; margin-top:3px; color:#7d8982; font-size:10px; }
  .mv-product-picker-count { flex:0 0 auto; padding:6px 8px; border-radius:8px; background:#eaf8ee; color:#15803d; font-size:9px; font-weight:850; }
  .mv-product-picker-controls { display:flex; align-items:center; gap:8px; }
  .mv-product-search { position:relative; flex:1; min-width:0; }
  .mv-product-search > svg { position:absolute; left:11px; top:50%; width:16px; height:16px; transform:translateY(-50%); stroke:#77847c; stroke-width:1.8; stroke-linecap:round; pointer-events:none; }
  .mv-product-search input { width:100%; height:40px; box-sizing:border-box; padding:0 38px 0 35px; border:1px solid #dce5df; border-radius:10px; outline:none; background:#fff; color:#1e2a23; font:inherit; font-size:11px; }
  .mv-product-search input:focus { border-color:#7bd095; box-shadow:0 0 0 3px rgba(34,197,94,.07); }
  .mv-product-search > button { position:absolute; right:6px; top:50%; width:27px; height:27px; transform:translateY(-50%); display:flex; align-items:center; justify-content:center; border:0; border-radius:7px; background:#f1f5f2; color:#748178; cursor:pointer; }
  .mv-product-search > button svg { width:13px; height:13px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; }
  .mv-new-product-qty { flex:0 0 auto; display:grid; gap:4px; }
  .mv-new-product-qty > span { color:#78847d; font-size:8px; font-weight:850; letter-spacing:.7px; text-transform:uppercase; }
  .mv-new-product-qty > div { height:40px; display:flex; align-items:center; border:1px solid #dce5df; border-radius:10px; overflow:hidden; background:#fff; }
  .mv-new-product-qty button { width:31px; height:100%; border:0; background:#fff; color:#4e5b53; font-size:16px; cursor:pointer; }
  .mv-new-product-qty button:hover { background:#eef8f1; color:#15803d; }
  .mv-new-product-qty b { min-width:25px; text-align:center; color:#17201b; font-size:11px; }
  .mv-product-results { display:grid; gap:5px; max-height:280px; overflow:auto; margin-top:8px; padding-right:2px; }
  .mv-product-result { width:100%; min-height:58px; display:grid; grid-template-columns:42px minmax(0,1fr) auto 28px; align-items:center; gap:9px; padding:7px 8px; box-sizing:border-box; border:1px solid #e5ebe7; border-radius:10px; background:#fff; text-align:left; cursor:pointer; transition:.16s ease; }
  .mv-product-result:hover { border-color:#a8d8b5; background:#fbfefc; transform:translateY(-1px); }
  .mv-product-result-image { width:42px; height:42px; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius:9px; background:#f1f5f2; color:#849088; }
  .mv-product-result-image img { width:100%; height:100%; object-fit:contain; }
  .mv-product-result-image svg { width:18px; height:18px; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
  .mv-product-result-info { min-width:0; }
  .mv-product-result-info strong { display:block; overflow:hidden; color:#27342c; text-overflow:ellipsis; white-space:nowrap; font-size:11px; }
  .mv-product-result-info small { display:block; margin-top:3px; overflow:hidden; color:#8a958f; text-overflow:ellipsis; white-space:nowrap; font-size:9px; }
  .mv-product-result-price { display:grid; gap:2px; justify-items:end; white-space:nowrap; }
  .mv-product-result-price small { color:#8a958f; font-size:8px; text-transform:uppercase; letter-spacing:.5px; }
  .mv-product-result-price b { color:#15803d; font-size:11px; }
  .mv-product-result-add { width:27px; height:27px; display:flex; align-items:center; justify-content:center; border-radius:8px; background:#16a34a; color:#fff; font-size:18px; line-height:1; }
  .mv-product-no-results { min-height:70px; display:flex; align-items:center; justify-content:center; gap:9px; color:#849088; }
  .mv-product-no-results svg { width:18px; height:18px; flex:0 0 18px; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; }
  .mv-product-no-results strong { display:block; color:#59665e; font-size:10px; }
  .mv-product-no-results span { display:block; margin-top:3px; font-size:9px; }

  .mv-edit-products { display:grid; gap:9px; }
  .mv-edit-product { display:grid; grid-template-columns:minmax(0,1fr) auto auto auto; align-items:center; gap:12px; padding:13px; border:1px solid #e4ebe7; border-radius:13px; background:#fbfdfb; }
  .mv-edit-product-info { min-width:0; }
  .mv-edit-product-info strong { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#243129; font-size:12px; }
  .mv-edit-product-info span { display:block; margin-top:4px; color:#89948d; font-size:10px; }
  .mv-edit-product-controls { display:flex; align-items:center; border:1px solid #dfe7e2; border-radius:9px; overflow:hidden; background:#fff; }
  .mv-edit-product-controls button { width:31px; height:31px; border:0; background:#fff; color:#34433a; font-size:17px; font-weight:800; cursor:pointer; }
  .mv-edit-product-controls button:hover:not(:disabled) { background:#eefbf2; color:#15803d; }
  .mv-edit-product-controls button:disabled { opacity:.35; cursor:not-allowed; }
  .mv-edit-product-controls input { width:38px; height:31px; padding:0; border:0; border-left:1px solid #e8eeea; border-right:1px solid #e8eeea; outline:none; text-align:center; color:#1f2b24; font:inherit; font-size:11px; font-weight:800; }
  .mv-edit-product-controls input::-webkit-outer-spin-button,.mv-edit-product-controls input::-webkit-inner-spin-button { margin:0; -webkit-appearance:none; }
  .mv-edit-product-subtotal { min-width:92px; text-align:right; color:#17201b; font-size:12px; white-space:nowrap; }
  .mv-edit-product-remove { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid #f0c4c9; border-radius:9px; background:#fff7f8; color:#b42332; cursor:pointer; }
  .mv-edit-product-remove:hover:not(:disabled) { background:#fee2e2; }
  .mv-edit-product-remove:disabled { opacity:.5; cursor:not-allowed; }
  .mv-edit-product-remove svg { width:14px; height:14px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mv-edit-note { display:flex; align-items:flex-start; gap:8px; margin-top:4px; padding:10px 11px; border:1px solid #dceee2; border-radius:11px; background:#f4fbf6; color:#5f7066; font-size:10px; line-height:1.45; }
  .mv-edit-note svg { width:15px; height:15px; flex:0 0 15px; margin-top:1px; stroke:#16a34a; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
  .mv-edit-empty { padding:20px; border:1px dashed #d7e1db; border-radius:12px; color:#89948d; text-align:center; font-size:12px; }
  .mis-venta-button.edit { border:1px solid #d7e5dc; background:#f5faf7; color:#15803d; }
  .mis-venta-button.edit:hover { background:#eefbf2; border-color:#b9dac2; }

  .mv-detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:18px; }
  .mv-detail-grid > div { padding:11px 12px; border:1px solid #e7ece9; border-radius:11px; background:#fafcfb; }
  .mv-detail-grid span { display:block; color:#89948d; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.7px; }
  .mv-detail-grid strong { display:block; margin-top:4px; color:#303c34; font-size:12px; word-break:break-word; }

  /* ========================================================================
     MODAL PEDIDO CONSOLIDADO
     ======================================================================== */
  .mv-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 24px;
    background: rgba(10, 16, 12, .52);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    overflow-y: auto;
  }

  .mv-modal {
    position: relative;
    width: min(760px, 100%);
    max-height: min(88vh, 900px);
    margin: auto;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid rgba(15, 23, 32, .08);
    border-radius: 22px;
    background: #fff;
    box-shadow: 0 35px 100px rgba(0, 0, 0, .25);
    display: flex;
    flex-direction: column;
  }

  .mv-pedido-modal {
    max-width: 760px;
  }

  .mv-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    padding: 22px 24px;
    border-bottom: 1px solid #edf1ee;
    background: #fff;
    flex: 0 0 auto;
  }

  .mv-modal-header p {
    margin: 0 0 5px;
    color: #16a34a;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.2px;
  }

  .mv-modal-header h2 {
    margin: 0;
    color: #17201b;
    font-size: 23px;
    line-height: 1.15;
    letter-spacing: -.4px;
  }

  .mv-modal-header span {
    display: block;
    margin-top: 5px;
    color: #78847d;
    font-size: 11px;
    line-height: 1.45;
  }

  .mv-modal-close {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dfe7e2;
    border-radius: 10px;
    background: #fff;
    color: #59665e;
    cursor: pointer;
  }

  .mv-modal-close:hover {
    background: #f7faf8;
    border-color: #bfdcc8;
    color: #15803d;
  }

  .mv-modal-close:disabled {
    opacity: .55;
    cursor: not-allowed;
  }

  .mv-modal-close svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  .mv-pedido-modal-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    padding: 15px 24px;
    background: #f8faf9;
    border-bottom: 1px solid #edf1ee;
    flex: 0 0 auto;
  }

  .mv-pedido-modal-summary > div {
    min-width: 0;
    padding: 11px 13px;
    border: 1px solid #e4ebe7;
    border-radius: 11px;
    background: #fff;
  }

  .mv-pedido-modal-summary span {
    display: block;
    color: #7c8981;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .7px;
  }

  .mv-pedido-modal-summary strong {
    display: block;
    margin-top: 4px;
    color: #17201b;
    font-size: 17px;
  }

  .mv-pedido-modal-list {
    min-height: 0;
    overflow-y: auto;
    padding: 18px 24px;
  }

  .mv-pedido-modal-sale {
    padding: 15px;
    border: 1px solid #e3ebe6;
    border-radius: 14px;
    background: #fbfdfb;
  }

  .mv-pedido-modal-sale + .mv-pedido-modal-sale {
    margin-top: 10px;
  }

  .mv-pedido-modal-sale-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 11px;
  }

  .mv-pedido-modal-sale-head strong {
    color: #17201b;
    font-size: 13px;
  }

  .mv-pedido-modal-sale-head span {
    display: block;
    margin-top: 4px;
    color: #87938c;
    font-size: 9px;
  }

  .mv-pedido-modal-products {
    display: grid;
    gap: 6px;
  }

  .mv-pedido-modal-product {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 40px 105px;
    align-items: center;
    gap: 8px;
    padding: 9px 10px;
    border: 1px solid #e8eeea;
    border-radius: 9px;
    background: #fff;
  }

  .mv-pedido-modal-product span {
    min-width: 0;
    overflow: hidden;
    color: #344139;
    font-size: 10px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mv-pedido-modal-product small {
    color: #7d8982;
    font-size: 9px;
    text-align: center;
  }

  .mv-pedido-modal-product strong {
    color: #17201b;
    font-size: 10px;
    text-align: right;
    white-space: nowrap;
  }

  .mv-pedido-warning {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin: 0 24px 16px;
    padding: 11px 12px;
    border: 1px solid #ccebd6;
    border-radius: 11px;
    background: #f1fbf4;
    color: #357046;
    font-size: 10px;
    line-height: 1.45;
    flex: 0 0 auto;
  }

  .mv-pedido-warning svg {
    width: 15px;
    height: 15px;
    flex: 0 0 15px;
    margin-top: 1px;
    stroke: #16a34a;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .mv-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 9px;
    padding: 15px 24px 20px;
    border-top: 1px solid #edf1ee;
    background: #fff;
    flex: 0 0 auto;
  }

  @media (max-width: 620px) {
    .mv-modal-backdrop {
      align-items: flex-end;
      padding: 10px;
    }

    .mv-modal {
      width: 100%;
      max-height: calc(100vh - 20px);
      border-radius: 18px;
    }

    .mv-modal-header {
      padding: 18px;
    }

    .mv-pedido-modal-summary {
      grid-template-columns: 1fr 1fr;
      padding: 12px 18px;
    }

    .mv-pedido-modal-summary > div:last-child {
      grid-column: 1 / -1;
    }

    .mv-pedido-modal-list {
      padding: 14px 18px;
    }

    .mv-pedido-modal-product {
      grid-template-columns: minmax(0, 1fr) 32px 88px;
    }

    .mv-pedido-warning {
      margin: 0 18px 12px;
    }

    .mv-modal-actions {
      flex-direction: column;
      padding: 13px 18px 18px;
    }

    .mv-modal-actions .mis-venta-button {
      width: 100%;
    }
  }

  .mis-ventas-modal-overlay { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(10,16,12,.48); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); }
  .mis-ventas-modal,.mis-ventas-confirm-modal { width:100%; max-height:88vh; overflow-y:auto; box-sizing:border-box; border:1px solid rgba(15,23,32,.08); border-radius:20px; background:#fff; box-shadow:0 30px 90px rgba(0,0,0,.22); }
  .mis-ventas-modal { max-width:680px; padding:24px; }
  .mis-ventas-confirm-modal { max-width:500px; padding:27px; }
  .mis-ventas-modal-header { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; }
  .mis-ventas-modal-header h2,.mis-ventas-confirm-modal h2 { margin:5px 0 4px; color:#17201b; font-size:24px; letter-spacing:-.03em; }
  .mis-ventas-modal-header > div > span { color:#76827b; font-size:13px; }
  .mis-ventas-modal-eyebrow { margin:0; color:#16a34a; font-size:10px; font-weight:900; letter-spacing:1.1px; }
  .mis-ventas-modal-close { width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid #e3e9e5; border-radius:10px; background:#fff; color:#59665e; cursor:pointer; }
  .mis-ventas-modal-close svg { width:16px; height:16px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; }
  .mis-ventas-modal-status-row { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:18px; padding-top:15px; border-top:1px solid #edf1ee; }
  .mis-ventas-modal-status-row > span:last-child { color:#808b84; font-size:12px; font-weight:700; }
  .mis-ventas-modal-section { margin-top:22px; }
  .mis-ventas-modal-section-title { display:flex; align-items:center; gap:9px; margin-bottom:12px; }
  .mis-ventas-modal-section-title svg { width:19px; height:19px; stroke:#16a34a; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mis-ventas-modal-section-title h3 { margin:0; font-size:16px; }
  .mis-ventas-productos { display:grid; gap:9px; }
  .mis-ventas-producto { display:flex; align-items:center; justify-content:space-between; gap:15px; padding:13px; border:1px solid #e7ece9; border-radius:12px; background:#fbfcfb; }
  .mis-ventas-producto strong { display:block; font-size:13px; }
  .mis-ventas-producto span { display:block; margin-top:4px; color:#7e8983; font-size:12px; }
  .mis-ventas-sin-productos { margin:0; color:#7e8983; font-size:13px; }
  .mis-ventas-modal-total { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:20px; padding-top:16px; border-top:1px solid #edf1ee; }
  .mis-ventas-modal-total span { color:#738078; font-size:13px; }
  .mis-ventas-modal-total strong { font-size:22px; letter-spacing:-.03em; }
  .mis-ventas-modal-actions,.mis-ventas-confirm-actions { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:9px; margin-top:21px; }
  .mis-venta-button { min-height:39px; display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:0 12px; border-radius:10px; font:inherit; font-size:11px; font-weight:800; cursor:pointer; }
  .mis-venta-button.ghost { border:1px solid #dce5df; background:#fff; color:#445149; }
  .mis-venta-button.primary { border:1px solid #16a34a; background:#16a34a; color:#fff; }
  .mis-venta-button.danger { border:1px solid #efb0b7; background:#fff7f8; color:#b42332; }
  .mis-venta-button.large { min-height:43px; padding:0 15px; }
  .mis-venta-button:disabled,.mv-danger-outline:disabled { opacity:.58; cursor:not-allowed; }
  .mis-venta-button svg { width:15px; height:15px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mis-ventas-confirm-icon { width:58px; height:58px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; border-radius:17px; background:#fff1f2; color:#dc2626; }
  .mis-ventas-confirm-icon svg { width:25px; height:25px; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .mis-ventas-confirm-modal > p:not(.mis-ventas-modal-eyebrow) { max-width:430px; margin:8px 0 0; color:#748079; font-size:14px; line-height:1.6; }
  .mis-ventas-confirm-count { display:flex; align-items:center; gap:10px; margin-top:17px; padding:13px 14px; border:1px solid #edf1ee; border-radius:13px; background:#f8faf9; }
  .mis-ventas-confirm-count strong { color:#b42332; font-size:23px; }
  .mis-ventas-confirm-count span { color:#68756d; font-size:12px; font-weight:800; }

  @media (max-width: 1180px) {
    .mv-stats-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .mv-table-head,.mv-sale-row { grid-template-columns:1.4fr 1.35fr .75fr .9fr .7fr 1.7fr; }
    .mv-action.whatsapp { display:none; }
  }

  @media (max-width: 900px) {
    .mv-sidebar { position:static; width:100%; height:auto; padding:12px 14px; display:block; }
    .mv-sidebar-brand { padding:0 4px 12px; border-bottom:1px solid rgba(255,255,255,.07); }
    .mv-sidebar-section-title,.mv-sidebar-bottom { display:none; }
    .mv-sidebar-nav { display:flex; gap:7px; margin-top:10px; overflow-x:auto; }
    .mv-nav-item { min-height:39px; flex:0 0 auto; padding:0 12px; }
    .mv-main { margin-left:0; }
    .mv-topbar { height:60px; padding:0 18px; }
    .mv-topbar-name { display:none; }
    .mv-content { padding:25px 18px 40px; }
    .mv-page-heading { flex-direction:column; }
    .mv-heading-catalog { width:100%; }
    .mv-table-head { display:none; }
    .mv-sale-row { grid-template-columns:1fr 1fr; gap:13px; padding:15px; }
    .mv-sale-row > div { padding:0; }
    .mv-sale-client { grid-column:1 / -1; }
    .mv-sale-product { grid-column:1; }
    .mv-sale-total { grid-column:2; justify-content:flex-end; }
    .mv-sale-actions { grid-column:1 / -1; justify-content:flex-start; padding-top:10px !important; border-top:1px solid #edf1ee; }
    .mv-action.whatsapp { display:inline-flex; }
    .mv-result-count { display:none; }
  }

  @media (max-width: 620px) {
    .mv-product-picker-head { align-items:flex-start; }
    .mv-product-picker-head > div { min-width:0; }
    .mv-product-picker-head span:not(.mv-product-picker-count) { line-height:1.35; }
    .mv-product-picker-controls { align-items:stretch; flex-direction:column; }
    .mv-new-product-qty { width:max-content; }
    .mv-product-result { grid-template-columns:38px minmax(0,1fr) 27px; }
    .mv-product-result-price { display:none; }
    .mv-product-result-image { width:38px; height:38px; }
    .mv-topbar-right { display:none; }
    .mv-content { padding:20px 12px 32px; }
    .mv-page-heading h1 { font-size:32px; }
    .mv-stats-grid { grid-template-columns:1fr 1fr; gap:9px; }
    .mv-stat-card { min-height:108px; padding:14px; border-radius:13px; }
    .mv-stat-card > strong { font-size:27px; }
    .mv-stat-card > small { line-height:1.35; }
    .mv-section-heading { align-items:flex-start; flex-direction:column; }
    .mv-danger-outline { width:100%; justify-content:center; }
    .mv-toolbar { align-items:stretch; flex-direction:column; }
    .mv-filter { width:100%; flex:1; }
    .mv-sale-row { grid-template-columns:1fr; }
    .mv-sale-client,.mv-sale-product,.mv-sale-total,.mv-sale-actions { grid-column:1; }
    .mv-sale-total { justify-content:flex-start; }
    .mv-sale-actions { flex-direction:column; align-items:stretch; }
    .mv-action,.mv-icon-action { width:100%; }
    .mv-icon-action { width:100%; }
    .mis-ventas-modal-overlay { align-items:flex-end; padding:10px; }
    .mis-ventas-modal,.mis-ventas-confirm-modal { max-height:calc(100vh - 20px); padding:18px; border-radius:18px; }
    .mis-ventas-modal-actions,.mis-ventas-confirm-actions { flex-direction:column; }
    .mis-ventas-modal-actions .mis-venta-button,.mis-ventas-confirm-actions .mis-venta-button { width:100%; }
    .mv-detail-grid { grid-template-columns:1fr; }
    .mv-edit-product { grid-template-columns:minmax(0,1fr) auto; }
    .mv-edit-product-controls { grid-column:1; }
    .mv-edit-product-subtotal { grid-column:2; grid-row:2; min-width:0; }
    .mv-edit-product-remove { grid-column:2; grid-row:1; }
  }
`;
