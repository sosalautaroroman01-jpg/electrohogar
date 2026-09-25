import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

import {
  cambiarEstadoRevendedor,
  crearCuentaRevendedor,
  crearRevendedor,
  editarRevendedor,
  escucharRevendedores,
  escucharPedidosRevendedores,
  actualizarPedidoRevendedor,
  resolverVentaRevendedor,
  finalizarPedidoRevendedor,
} from "../../services/vendedoresService";

function ArrowIcon() {
  return (
    <svg
      className="dashboard-back-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      className="dashboard-title-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2v10" />
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>);
}
function EyeIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>);
}
function CheckIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>);
}
function TrashIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/></svg>);
}
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

const FORM_INICIAL = {
  nombre: "",
  apellido: "",
  whatsapp: "",
  email: "",
  password: "",
  porcentaje: "10",
  vendedorOficialCodigo: "",
  vendedorOficialNombre: "",
};

export default function Dashboard() {
  const { agregarAlCarrito } = useCart();

  const [revendedores, setRevendedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState(FORM_INICIAL);

  const [busqueda, setBusqueda] = useState("");

  const [error, setError] = useState("");

  const [copiado, setCopiado] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [pedidoModalAbierto, setPedidoModalAbierto] = useState(false);
  const [pedidoGuardando, setPedidoGuardando] = useState(false);
  const [pedidoBusqueda, setPedidoBusqueda] = useState("");
  const [pedidoEstadoFiltro, setPedidoEstadoFiltro] = useState("Todos");
  const [pedidoError, setPedidoError] = useState("");
  const [pedidoEditando, setPedidoEditando] = useState(false);
  const [pedidoClientesEditados, setPedidoClientesEditados] = useState([]);

  /*
   * Escucha los revendedores en tiempo real.
   */
  useEffect(() => {
    const cancelar = escucharRevendedores((lista) => {
      setRevendedores(lista);
      setCargando(false);
    });

    return () => {
      if (typeof cancelar === "function") {
        cancelar();
      }
    };
  }, []);

  useEffect(() => {
    const cancelar = escucharPedidosRevendedores((lista) => {
      setPedidos(lista);
    });
    return () => {
      if (typeof cancelar === "function") cancelar();
    };
  }, []);

  /*
   * Filtrado de búsqueda.
   */
  const listaFiltrada = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return revendedores;
    }

    return revendedores.filter((item) => {
      const contenido = [
        item.nombre,
        item.apellido,
        item.nombreCompleto,
        item.whatsapp,
        item.slug,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return contenido.includes(texto);
    });
  }, [revendedores, busqueda]);

  const ESTADOS_PEDIDO = ["Todos","Pendiente","En revisión","En preparación","Procesado","Cancelado"];
  const VENDEDORES_OFICIALES = [
    { codigo: "MILAGROS", nombre: "Milagros" },
    { codigo: "YAMILA", nombre: "Yamila" },
    { codigo: "GONZALO", nombre: "Gonzalo" },
    { codigo: "VICTORIA", nombre: "Victoria" },
    { codigo: "LAUTARO", nombre: "Lautaro" },
    { codigo: "CAMILA", nombre: "Camila" },
    { codigo: "AXEL", nombre: "Axel" },
  ];
  function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-AR",{maximumFractionDigits:0}).format(Number(valor)||0);
  }
  function nombreRevendedorPedido(p) {
    return p?.revendedor?.nombreCompleto || `${p?.revendedor?.nombre||""} ${p?.revendedor?.apellido||""}`.trim() || "Revendedor";
  }
  function clientesPedido(p) { return Array.isArray(p?.clientes) ? p.clientes : []; }
  function cantidadProductosCliente(c) {
    return (Array.isArray(c?.productos)?c.productos:[]).reduce((t,x)=>t+(Number(x?.cantidad)||1),0);
  }
  function totalCliente(c) {
    return (Array.isArray(c?.productos)?c.productos:[]).reduce((t,x)=>{
      const q=Number(x?.cantidad)||1;
      const precio=Number(x?.precioFinal)||Number(x?.precioVenta)||Number(x?.precio)||0;
      return t+precio*q;
    },0);
  }
  function totalPedido(p) { return clientesPedido(p).reduce((t,c)=>t+totalCliente(c),0); }
  function fechaPedido(v) {
    if(!v) return "-";
    const f=new Date(v); if(Number.isNaN(f.getTime())) return "-";
    return f.toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"});
  }
  const pedidosFiltrados = useMemo(() => {
    const q=pedidoBusqueda.trim().toLowerCase();
    return pedidos.filter(p=>{
      if(pedidoEstadoFiltro!=="Todos" && p.estado!==pedidoEstadoFiltro) return false;
      if(!q) return true;
      const contenido=[
        p.id,nombreRevendedorPedido(p),p?.revendedor?.whatsapp,
        ...clientesPedido(p).map(c=>`${c?.cliente?.nombreCompleto||""} ${c?.cliente?.whatsapp||""}`)
      ].filter(Boolean).join(" ").toLowerCase();
      return contenido.includes(q);
    });
  },[pedidos,pedidoBusqueda,pedidoEstadoFiltro]);
  const pedidosPendientes=pedidos.filter(p=>p.estado==="Pendiente").length;
  const pedidosRevision=pedidos.filter(p=>p.estado==="En revisión").length;
  const pedidosPreparacion=pedidos.filter(p=>p.estado==="En preparación").length;
  const pedidosProcesados=pedidos.filter(p=>p.estado==="Procesado").length;

  async function abrirPedido(pedido) {
    try {
      const revendedorActual = revendedores.find(
        (item) => item.id === pedido?.revendedorId
      );

      const vendedorCodigoRevendedor =
        revendedorActual?.vendedorOficialCodigo || "";

      const vendedorNombreRevendedor =
        revendedorActual?.vendedorOficialNombre || "";

      let necesitaActualizarPedido = false;

      const clientes = clientesPedido(pedido).map((c) => {
        const cliente = {
          ...(c.cliente || {}),
        };

        const vendedorCodigo =
          c.vendedorOficialCodigo ||
          cliente.vendedorOficialCodigo ||
          vendedorCodigoRevendedor ||
          "";

        const vendedorNombre =
          c.vendedorOficialNombre ||
          cliente.vendedorOficialNombre ||
          vendedorNombreRevendedor ||
          "";

        if (
          vendedorCodigo &&
          (!c.vendedorOficialCodigo ||
            !c.vendedorOficialNombre ||
            !cliente.vendedorOficialCodigo ||
            !cliente.vendedorOficialNombre)
        ) {
          necesitaActualizarPedido = true;
        }

        return {
          ...c,
          cliente: {
            ...cliente,
            vendedorOficialCodigo: vendedorCodigo,
            vendedorOficialNombre: vendedorNombre,
          },
          vendedorOficialCodigo: vendedorCodigo,
          vendedorOficialNombre: vendedorNombre,
          productos: Array.isArray(c.productos)
            ? c.productos.map((x) => ({ ...x }))
            : [],
        };
      });

      setPedidoSeleccionado({
        ...pedido,
        clientes,
      });

      setPedidoClientesEditados(clientes);
      setPedidoEditando(false);
      setPedidoError("");
      setPedidoModalAbierto(true);

      /*
       * Compatibilidad con pedidos creados ANTES de asignar
       * el vendedor al revendedor.
       *
       * Si Pedro ya tiene vendedor asignado y este pedido
       * todavía no tenía esa información, la guardamos ahora
       * para que el pedido quede correctamente vinculado.
       */
      if (
        necesitaActualizarPedido &&
        vendedorCodigoRevendedor &&
        vendedorNombreRevendedor &&
        pedido?.estado !== "Procesado"
      ) {
        await actualizarPedidoRevendedor(
          pedido.id,
          {
            clientes,
          }
        );

        setPedidos((lista) =>
          lista.map((item) =>
            item.id === pedido.id
              ? {
                  ...item,
                  clientes,
                }
              : item
          )
        );

        setPedidoSeleccionado((actual) =>
          actual
            ? {
                ...actual,
                clientes,
              }
            : actual
        );
      }
    } catch (error) {
      console.error(
        "Error abriendo/asignando vendedor del pedido:",
        error
      );

      setPedidoError(
        error?.message ||
          "No se pudo cargar la asignación del vendedor."
      );
    }
  }
  function cerrarPedido() {
    if(pedidoGuardando) return;
    setPedidoModalAbierto(false); setPedidoSeleccionado(null);
    setPedidoClientesEditados([]); setPedidoEditando(false); setPedidoError("");
  }
  function cambiarCantidadPedido(ci,pi,v) {
    const q=Math.max(1,Number(v)||1);
    setPedidoClientesEditados(arr=>arr.map((c,i)=>i!==ci?c:{
      ...c,productos:c.productos.map((p,j)=>j===pi?{...p,cantidad:q}:p)
    }));
  }
  function eliminarProductoPedido(ci,pi) {
    setPedidoClientesEditados(arr=>arr.map((c,i)=>i!==ci?c:{
      ...c,productos:c.productos.filter((_,j)=>j!==pi)
    }));
  }
  async function guardarCambiosPedido() {
    if(!pedidoSeleccionado) return;
    try {
      setPedidoGuardando(true); setPedidoError("");
      const estado=pedidoSeleccionado.estado==="Pendiente"?"En revisión":pedidoSeleccionado.estado;
      await actualizarPedidoRevendedor(pedidoSeleccionado.id,{clientes:pedidoClientesEditados,estado});

      setPedidoSeleccionado(p=>({...p,clientes:pedidoClientesEditados,estado}));
      setPedidoEditando(false);
    } catch(e) { console.error(e); setPedidoError(e?.message||"No se pudo guardar el pedido."); }
    finally { setPedidoGuardando(false); }
  }
  async function resolverVentaDesdePedido(clientePedido, resultado) {
    if (!pedidoSeleccionado || !clientePedido?.ventaId) return;

    const nombreCliente =
      clientePedido?.cliente?.nombreCompleto ||
      clientePedido?.cliente?.nombre ||
      "este cliente";

    const esConcretada = resultado === "concretada";

    const confirmado = window.confirm(
      esConcretada
        ? `¿Confirmar como CONCRETADA la venta de ${nombreCliente}?\\n\\nRecién ahora aparecerá como venta concretada para el revendedor.`
        : `¿Marcar como CAÍDA la venta de ${nombreCliente}?\\n\\nEl revendedor la verá como caída en Mis Ventas y no pasará al carrito.`
    );

    if (!confirmado) return;

    try {
      setPedidoGuardando(true);
      setPedidoError("");

      await resolverVentaRevendedor(
        clientePedido.ventaId,
        resultado
      );

      const nuevosClientes =
        esConcretada
          ? pedidoClientesEditados.map((cliente) =>
              cliente?.ventaId === clientePedido.ventaId
                ? {
                    ...cliente,
                    resultadoComercial: "concretada",
                  }
                : cliente
            )
          : pedidoClientesEditados.filter(
              (cliente) =>
                cliente?.ventaId !== clientePedido.ventaId
            );

      const nuevoEstado =
        !esConcretada && nuevosClientes.length === 0
          ? "Cancelado"
          : pedidoSeleccionado.estado === "Pendiente"
            ? "En revisión"
            : pedidoSeleccionado.estado;

      if (
        nuevoEstado !== pedidoSeleccionado.estado ||
        nuevosClientes.length !== pedidoClientesEditados.length ||
        esConcretada
      ) {
        await actualizarPedidoRevendedor(
          pedidoSeleccionado.id,
          {
            clientes: nuevosClientes,
            estado: nuevoEstado,
          }
        );
      }

      setPedidoClientesEditados(nuevosClientes);
      setPedidoSeleccionado((actual) =>
        actual
          ? {
              ...actual,
              clientes: nuevosClientes,
              estado: nuevoEstado,
            }
          : actual
      );

      setPedidos((lista) =>
        lista.map((item) =>
          item.id === pedidoSeleccionado.id
            ? {
                ...item,
                clientes: nuevosClientes,
                estado: nuevoEstado,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error resolviendo venta del pedido:",
        error
      );
      setPedidoError(
        error?.message ||
          "No se pudo resolver la venta."
      );
    } finally {
      setPedidoGuardando(false);
    }
  }

  /*
   * ARMA EL CARRITO NORMAL DE ELECTRO HOGAR.
   *
   * IMPORTANTE:
   * - Solo toma clientes con resultado "concretada".
   * - Usa el precio final congelado de cada producto.
   * - Desactiva precios promocionales del carrito para que no
   *   vuelva a recalcular el precio de una venta ya validada.
   */
  async function armarCarritoPedido() {
    if (!pedidoSeleccionado) return;

    const clientes =
      Array.isArray(pedidoClientesEditados)
        ? pedidoClientesEditados
        : [];

    const clientesConcretados =
      clientes.filter(
        (cliente) =>
          cliente?.resultadoComercial === "concretada"
      );

    if (
      clientes.length === 0 ||
      clientesConcretados.length !==
        clientes.length
    ) {
      setPedidoError(
        "Primero tenés que resolver todas las ventas. Solo un pedido completamente concretado puede pasar al carrito."
      );
      return;
    }

    try {
      setPedidoGuardando(true);
      setPedidoError("");

      let cantidadItems = 0;

      clientesConcretados.forEach((clientePedido) => {
        const productos = Array.isArray(
          clientePedido?.productos
        )
          ? clientePedido.productos
          : [];

        productos.forEach((producto) => {
          const cantidad = Math.max(
            1,
            Number(producto?.cantidad) || 1
          );

          const precioFinal =
            Number(producto?.precioFinal) ||
            Number(producto?.precioVenta) ||
            Number(producto?.precio) ||
            0;

          if (!producto?.id && !producto?.productoId) {
            return;
          }

          const productoId =
            producto?.id ||
            producto?.productoId;

          agregarAlCarrito(
            {
              ...producto,

              id: productoId,
              productoId,

              precio: precioFinal,
              precio2: 0,
              precio3: 0,
              precio6: 0,
              precio9: 0,
              precio12: 0,

              esRevendedor: false,
              revendedorId: null,
              revendedorPorcentaje: 0,

              precioFinal,
              precioVenta: precioFinal,

              __pedidoRevendedorId:
                pedidoSeleccionado.id,
              __ventaRevendedorId:
                clientePedido.ventaId || null,
              __clienteRevendedorId:
                clientePedido.clienteId || null,
            },
            cantidad
          );

          cantidadItems += cantidad;
        });
      });

      const ahora = new Date().toISOString();

      await actualizarPedidoRevendedor(
        pedidoSeleccionado.id,
        {
          estado: "En preparación",
          carritoArmadoEn:
            pedidoSeleccionado.carritoArmadoEn ||
            ahora,
        }
      );

      const pedidoActualizado = {
        ...pedidoSeleccionado,
        estado: "En preparación",
        carritoArmadoEn:
          pedidoSeleccionado.carritoArmadoEn ||
          ahora,
      };

      setPedidoSeleccionado(pedidoActualizado);

      setPedidos((lista) =>
        lista.map((item) =>
          item.id === pedidoSeleccionado.id
            ? {
                ...item,
                estado: "En preparación",
                carritoArmadoEn:
                  item.carritoArmadoEn || ahora,
              }
            : item
        )
      );

      window.alert(
        `Carrito armado correctamente.\n\nProductos cargados: ${cantidadItems}\n\nAhora podés trabajar la venta desde el carrito normal de Electro Hogar.`
      );
    } catch (error) {
      console.error(
        "Error armando carrito del pedido:",
        error
      );

      setPedidoError(
        error?.message ||
          "No se pudo armar el carrito."
      );
    } finally {
      setPedidoGuardando(false);
    }
  }

  async function cerrarPedidoYGenerarComision() {
    if (!pedidoSeleccionado) return;

    const concretadas =
      (Array.isArray(pedidoClientesEditados)
        ? pedidoClientesEditados
        : []
      ).filter(
        (cliente) =>
          cliente?.resultadoComercial === "concretada"
      );

    if (concretadas.length === 0) {
      setPedidoError(
        "No hay ventas concretadas para cerrar."
      );
      return;
    }

    if (pedidoSeleccionado.estado !== "En preparación") {
      setPedidoError(
        "Primero armá el carrito y dejá el pedido En preparación."
      );
      return;
    }

    const confirmado = window.confirm(
      "¿Cerrar definitivamente este pedido y generar la comisión?\n\nEsta acción congela la comisión y el pedido ya no podrá modificarse."
    );

    if (!confirmado) return;

    try {
      setPedidoGuardando(true);
      setPedidoError("");

      const resultado =
        await finalizarPedidoRevendedor(
          pedidoSeleccionado.id
        );

      setPedidoSeleccionado((actual) =>
        actual
          ? {
              ...actual,
              ...resultado,
              estado: "Procesado",
              comisionFinalizada: true,
            }
          : actual
      );

      setPedidos((lista) =>
        lista.map((item) =>
          item.id === pedidoSeleccionado.id
            ? {
                ...item,
                ...resultado,
                estado: "Procesado",
                comisionFinalizada: true,
              }
            : item
        )
      );

      window.alert(
        `Pedido procesado correctamente.\n\nComisión generada: $ ${formatearPrecio(
          resultado?.comisionGenerada || 0
        )}`
      );
    } catch (error) {
      console.error(
        "Error cerrando pedido y comisión:",
        error
      );

      setPedidoError(
        error?.message ||
          "No se pudo cerrar la comisión."
      );
    } finally {
      setPedidoGuardando(false);
    }
  }

  async function cambiarEstadoPedido(estado) {
    if(!pedidoSeleccionado) return;

    if (estado === "En preparación") {
      const clientes =
        Array.isArray(pedidoClientesEditados)
          ? pedidoClientesEditados
          : [];

      const hayPendientes = clientes.some(
        (cliente) =>
          cliente?.resultadoComercial !== "concretada"
      );

      if (hayPendientes) {
        setPedidoError(
          "Primero tenés que resolver todas las ventas del pedido. Solo las concretadas pasan a preparación."
        );
        return;
      }

      if (clientes.length === 0) {
        setPedidoError(
          "No hay ventas concretadas para preparar este pedido."
        );
        return;
      }
    }

    try {
      setPedidoGuardando(true); setPedidoError("");
      await actualizarPedidoRevendedor(pedidoSeleccionado.id,{estado});
      setPedidoSeleccionado(p=>({...p,estado}));
    } catch(e) { console.error(e); setPedidoError(e?.message||"No se pudo cambiar el estado."); }
    finally { setPedidoGuardando(false); }
  }

  /*
   * Estadísticas actuales.
   */
  const activos = revendedores.filter(
    (item) => item.activo
  ).length;

  const inactivos =
    revendedores.length - activos;

  /*
   * Abre formulario para crear.
   */
  function abrirCrear() {
    setEditando(null);
    setForm(FORM_INICIAL);
    setError("");
    setModalAbierto(true);
  }

  /*
   * Abre formulario para editar.
   */
  function abrirEditar(revendedor) {
    setEditando(revendedor);

    setForm({
      nombre: revendedor.nombre || "",
      apellido: revendedor.apellido || "",
      whatsapp: revendedor.whatsapp || "",
      email: revendedor.email || "",
      password: "",
      porcentaje: String(
        revendedor.porcentaje ?? 10
      ),
      vendedorOficialCodigo:
        revendedor.vendedorOficialCodigo || "",
      vendedorOficialNombre:
        revendedor.vendedorOficialNombre || "",
    });

    setError("");
    setModalAbierto(true);
  }

  /*
   * Cierra modal.
   */
  function cerrarModal() {
    if (guardando) {
      return;
    }

    setModalAbierto(false);
    setEditando(null);
    setForm(FORM_INICIAL);
    setError("");
  }

  /*
   * Cambia campos del formulario.
   */
  function cambiarCampo(campo, valor) {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  /*
   * Guarda o edita revendedor.
   */
  async function guardar(e) {
    e.preventDefault();

    setGuardando(true);
    setError("");

    try {
      if (editando) {
        await editarRevendedor(
          editando.id,
          {
            nombre: form.nombre,
            apellido: form.apellido,
            whatsapp: form.whatsapp,
            porcentaje: form.porcentaje,
            email: form.email,
            vendedorOficialCodigo:
              form.vendedorOficialCodigo,
            vendedorOficialNombre:
              form.vendedorOficialNombre,
          }
        );
      } else {
        if (!form.email?.trim()) {
          throw new Error(
            "El email de acceso es obligatorio."
          );
        }

        if (!form.password?.trim()) {
          throw new Error(
            "La contraseña de acceso es obligatoria."
          );
        }

        const cuenta =
          await crearCuentaRevendedor({
            email: form.email,
            password: form.password,
          });

        await crearRevendedor({
          nombre: form.nombre,
          apellido: form.apellido,
          whatsapp: form.whatsapp,
          porcentaje: form.porcentaje,
          vendedorOficialCodigo:
            form.vendedorOficialCodigo,
          vendedorOficialNombre:
            form.vendedorOficialNombre,
          authUid: cuenta.authUid,
          email: cuenta.email,
        });
      }

      setModalAbierto(false);
      setEditando(null);
      setForm(FORM_INICIAL);
      setError("");
    } catch (err) {
      console.error(
        "Error guardando revendedor:",
        err
      );

      setError(
        err?.message ||
          "No se pudo guardar el revendedor."
      );
    } finally {
      setGuardando(false);
    }
  }

  /*
   * Activa / desactiva.
   */
  async function cambiarEstado(revendedor) {
    const estaActivo = Boolean(
      revendedor.activo
    );

    const nombre =
      revendedor.nombreCompleto ||
      `${revendedor.nombre || ""} ${revendedor.apellido || ""}`.trim();

    const confirmado = window.confirm(
      estaActivo
        ? `¿Querés dar de baja a ${nombre}?\n\nSu historial de ventas y comisiones se conservará, pero el revendedor dejará de poder operar.`
        : `¿Querés reactivar a ${nombre}?`
    );

    if (!confirmado) {
      return;
    }

    try {
      await cambiarEstadoRevendedor(
        revendedor.id,
        !estaActivo
      );
    } catch (err) {
      console.error(
        "Error cambiando estado:",
        err
      );

      window.alert(
        err?.message ||
          "No se pudo cambiar el estado."
      );
    }
  }

  /*
   * Construye el link público.
   */
  function obtenerLink(revendedor) {
    return `${window.location.origin}/v/${revendedor.slug}`;
  }

  /*
   * Copiar link.
   */
  async function copiarLink(revendedor) {
    const link = obtenerLink(revendedor);

    try {
      await navigator.clipboard.writeText(link);

      setCopiado(revendedor.id);

      window.setTimeout(() => {
        setCopiado((actual) =>
          actual === revendedor.id
            ? ""
            : actual
        );
      }, 1800);
    } catch {
      window.prompt(
        "Copiá este link:",
        link
      );
    }
  }

  /*
   * Abrir link público.
   */
  function abrirLink(revendedor) {
    window.open(
      obtenerLink(revendedor),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <Layout>
      <section className="dashboard-page">

        {/* VOLVER */}
        <div className="dashboard-top">
          <Link
            to="/"
            className="dashboard-back"
          >
            <ArrowIcon />

            <span>
              Volver al catálogo
            </span>
          </Link>
        </div>

        {/* CABECERA */}
        <div className="dashboard-heading">

          <div className="dashboard-title-icon-wrap">
            <DashboardIcon />
          </div>

          <div className="dashboard-heading-copy">

            <p className="dashboard-eyebrow">
              ADMINISTRACIÓN
            </p>

            <h1>
              Dashboard
            </h1>

            <p className="dashboard-description">
              Administración de Electro Hogar
              y revendedores.
            </p>

          </div>

        </div>

        {/* PEDIDOS DE REVENDEDORES */}
        <section className="pedidos-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon pedidos-section-icon"><ShoppingBagIcon /></div>
              <div>
                <p className="section-eyebrow">VENTAS EXTERNAS</p>
                <h2>Pedidos de revendedores</h2>
                <p>Revisá, corregí y prepará los pedidos que llegan desde los links de revendedores.</p>
              </div>
            </div>
          </div>
          <div className="pedido-stats-row">
            <div className="pedido-stat-card"><span>Pendientes</span><strong>{pedidosPendientes}</strong></div>
            <div className="pedido-stat-card"><span>En revisión</span><strong>{pedidosRevision}</strong></div>
            <div className="pedido-stat-card"><span>En preparación</span><strong>{pedidosPreparacion}</strong></div>
            <div className="pedido-stat-card"><span>Procesados</span><strong>{pedidosProcesados}</strong></div>
          </div>
          <div className="pedidos-toolbar">
            <div className="search-box"><SearchIcon /><input type="search" value={pedidoBusqueda} onChange={e=>setPedidoBusqueda(e.target.value)} placeholder="Buscar pedido, revendedor o cliente..." /></div>
            <div className="pedido-filters">
              {ESTADOS_PEDIDO.map(estado=><button key={estado} type="button" className={pedidoEstadoFiltro===estado?"pedido-filter active":"pedido-filter"} onClick={()=>setPedidoEstadoFiltro(estado)}>{estado}</button>)}
            </div>
          </div>
          <div className="pedidos-card">
            {pedidosFiltrados.length===0 ? (
              <div className="empty-state pedidos-empty">
                <div className="empty-icon"><ShoppingBagIcon /></div>
                <strong>{pedidos.length===0?"Todavía no hay pedidos":"No encontramos pedidos"}</strong>
                <p>{pedidos.length===0?"Cuando un revendedor envíe un pedido consolidado, va a aparecer acá.":"Probá con otro estado, pedido, cliente o revendedor."}</p>
              </div>
            ) : (
              <div className="pedidos-table-wrap">
                <table className="pedidos-table">
                  <thead><tr><th>Pedido</th><th>Revendedor</th><th>Clientes</th><th>Productos</th><th>Total</th><th>Estado</th><th>Fecha</th><th></th></tr></thead>
                  <tbody>
                    {pedidosFiltrados.map(pedido=>{
                      const clientes=clientesPedido(pedido);
                      const productos=clientes.reduce((t,c)=>t+cantidadProductosCliente(c),0);
                      return <tr key={pedido.id}>
                        <td><div className="pedido-id-cell"><strong>#{pedido.id.slice(0,8)}</strong><small>{pedido.id}</small></div></td>
                        <td><div className="pedido-revendedor-cell"><strong>{nombreRevendedorPedido(pedido)}</strong><small>{pedido?.revendedor?.whatsapp||"Sin WhatsApp"}</small></div></td>
                        <td><strong>{clientes.length}</strong></td>
                        <td><strong>{productos}</strong></td>
                        <td><strong className="pedido-total">$ {formatearPrecio(totalPedido(pedido))}</strong></td>
                        <td><span className={`pedido-status status-${String(pedido.estado||"Pendiente").toLowerCase().replace(/\s+/g,"-")}`}><span />{pedido.estado||"Pendiente"}</span></td>
                        <td><span className="pedido-date">{fechaPedido(pedido.creadoEn)}</span></td>
                        <td><button type="button" className="action-button" onClick={()=>abrirPedido(pedido)}><EyeIcon /><span>Ver pedido</span></button></td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* REVENDEDORES */}
        <section className="revendedores-section">

          <div className="section-header">

            <div className="section-title">

              <div className="section-icon">
                <UsersIcon />
              </div>

              <div>

                <p className="section-eyebrow">
                  VENTAS EXTERNAS
                </p>

                <h2>
                  Revendedores
                </h2>

                <p>
                  Creá y administrá los vendedores
                  que van a trabajar con su propio link.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="primary-button"
              onClick={abrirCrear}
            >
              <PlusIcon />

              <span>
                Nuevo revendedor
              </span>
            </button>

          </div>

          {/* ESTADÍSTICAS */}
          <div className="stats-row">

            <div className="stat-card">
              <span>
                Total
              </span>

              <strong>
                {revendedores.length}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                Activos
              </span>

              <strong>
                {activos}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                Inactivos
              </span>

              <strong>
                {inactivos}
              </strong>
            </div>

          </div>

          {/* BUSCADOR */}
          <div className="toolbar">

            <div className="search-box">

              <SearchIcon />

              <input
                type="search"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                placeholder="Buscar revendedor..."
              />

            </div>

          </div>

          {/* TABLA */}
          <div className="revendedores-card">

            {cargando ? (

              <div className="empty-state">

                <strong>
                  Cargando revendedores...
                </strong>

              </div>

            ) : listaFiltrada.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  <UsersIcon />
                </div>

                <strong>
                  {revendedores.length === 0
                    ? "Todavía no hay revendedores"
                    : "No encontramos resultados"}
                </strong>

                <p>
                  {revendedores.length === 0
                    ? "Creá el primero para empezar a probar el sistema."
                    : "Probá con otro nombre, apellido o link."}
                </p>

                {revendedores.length === 0 && (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={abrirCrear}
                  >
                    <PlusIcon />

                    <span>
                      Crear revendedor
                    </span>
                  </button>
                )}

              </div>

            ) : (

              <div className="table-wrap">

                <table>

                  <thead>
                    <tr>

                      <th>
                        Revendedor
                      </th>

                      <th>
                        WhatsApp
                      </th>

                      <th>
                        Margen
                      </th>

                      <th>
                        Vendedor Electro
                      </th>

                      <th>
                        Estado
                      </th>

                      <th>
                        Link
                      </th>

                      <th>
                        Acciones
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {listaFiltrada.map(
                      (revendedor) => (

                        <tr
                          key={revendedor.id}
                        >

                          {/* NOMBRE */}
                          <td>

                            <div className="seller-cell">

                              <div className="seller-avatar">

                                {(revendedor.nombre ||
                                  "?")
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {revendedor.nombreCompleto ||
                                    `${revendedor.nombre || ""} ${
                                      revendedor.apellido || ""
                                    }`}
                                </strong>

                                <small>
                                  ID:{" "}
                                  {revendedor.id.slice(
                                    0,
                                    8
                                  )}
                                </small>

                              </div>

                            </div>

                          </td>

                          {/* WHATSAPP */}
                          <td>

                            <span className="plain-value">
                              {revendedor.whatsapp ||
                                "-"}
                            </span>

                          </td>

                          {/* MARGEN */}
                          <td>

                            <span className="margin-badge">
                              {revendedor.porcentaje}%
                            </span>

                          </td>

                          {/* VENDEDOR ELECTRO */}
                          <td>
                            <span className="plain-value">
                              {revendedor.vendedorOficialNombre || "Sin asignar"}
                            </span>
                          </td>

                          {/* ESTADO */}
                          <td>

                            <span
                              className={`status-button ${
                                revendedor.activo
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >

                              <span />

                              {revendedor.activo
                                ? "Activo"
                                : "Inactivo"}

                            </span>

                          </td>

                          {/* LINK */}
                          <td>

                            <div className="link-cell">

                              <span
                                title={obtenerLink(
                                  revendedor
                                )}
                              >
                                /v/
                                {revendedor.slug}
                              </span>

                              <button
                                type="button"
                                className="icon-button"
                                onClick={() =>
                                  copiarLink(
                                    revendedor
                                  )
                                }
                                title="Copiar link"
                              >
                                <CopyIcon />
                              </button>

                            </div>

                            {copiado ===
                              revendedor.id && (
                              <small className="copied-text">
                                Link copiado
                              </small>
                            )}

                          </td>

                          {/* ACCIONES */}
                          <td>

                            <div className="actions">

                              <button
                                type="button"
                                className="action-button"
                                onClick={() =>
                                  abrirLink(
                                    revendedor
                                  )
                                }
                                title="Abrir catálogo"
                              >
                                <ExternalIcon />

                                <span>
                                  Ver
                                </span>
                              </button>

                              <button
                                type="button"
                                className="action-button"
                                onClick={() =>
                                  abrirEditar(
                                    revendedor
                                  )
                                }
                                title="Editar"
                              >
                                <PencilIcon />

                                <span>
                                  Editar
                                </span>
                              </button>

                              <button
                                type="button"
                                className={`action-button ${
                                  revendedor.activo
                                    ? "action-danger"
                                    : "action-reactivate"
                                }`}
                                onClick={() =>
                                  cambiarEstado(
                                    revendedor
                                  )
                                }
                                title={
                                  revendedor.activo
                                    ? "Dar de baja"
                                    : "Reactivar"
                                }
                              >
                                <PowerIcon />

                                <span>
                                  {revendedor.activo
                                    ? "Dar de baja"
                                    : "Reactivar"}
                                </span>
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

      </section>

      {/* MODAL PEDIDO */}
      {pedidoModalAbierto && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) cerrarPedido();
          }}
        >
          <div className="modal pedido-modal pedido-modal-clean">
            <div className="pedido-clean-header">
              <div className="pedido-clean-heading">
                <h2>Pedido #{pedidoSeleccionado?.id?.slice(0, 8)}</h2>
                <p>
                  {nombreRevendedorPedido(pedidoSeleccionado)}
                  <span>·</span>
                  {pedidoSeleccionado?.revendedor?.whatsapp || "Sin WhatsApp"}
                </p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={cerrarPedido}
                disabled={pedidoGuardando}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="pedido-clean-meta">
              <span>{pedidoClientesEditados.length} cliente{pedidoClientesEditados.length === 1 ? "" : "s"}</span>
              <span>·</span>
              <span>{pedidoClientesEditados.reduce((t, c) => t + cantidadProductosCliente(c), 0)} productos</span>
              <span>·</span>
              <strong>$ {formatearPrecio(pedidoClientesEditados.reduce((t, c) => t + totalCliente(c), 0))}</strong>
            </div>

            <div className="pedido-clean-status">
              <div>
                <span>Estado</span>
                <strong>{pedidoSeleccionado?.estado || "Pendiente"}</strong>
              </div>

              <small className="pedido-status-explanation">
                Las ventas individuales se validan como concretadas o caídas. Solo las concretadas pasan al armado final.
              </small>

              {pedidoSeleccionado?.estado !== "Procesado" && (
                <div className="pedido-status-actions">
                  <button
                    type="button"
                    className={`pedido-small-button ${pedidoSeleccionado?.estado === "En revisión" ? "active" : ""}`}
                    onClick={() => cambiarEstadoPedido("En revisión")}
                    disabled={pedidoGuardando}
                  >
                    En revisión
                  </button>
                  <button
                    type="button"
                    className={`pedido-small-button ${pedidoSeleccionado?.estado === "En preparación" ? "active" : ""}`}
                    onClick={() => cambiarEstadoPedido("En preparación")}
                    disabled={pedidoGuardando}
                  >
                    En preparación
                  </button>
                </div>
              )}
            </div>

            {pedidoError && <div className="error-box">{pedidoError}</div>}

            <div className="pedido-clean-content">
              {pedidoClientesEditados.map((cp, ci) => {
                const c = cp.cliente || {};
                const productos = Array.isArray(cp.productos) ? cp.productos : [];
                const vendedorNombre = cp.vendedorOficialNombre || c.vendedorOficialNombre || "Sin asignar";

                return (
                  <article
                    className="pedido-clean-client"
                    key={cp.ventaId || cp.clienteId || ci}
                  >
                    <div className="pedido-clean-client-header">
                      <div>
                        <span className="pedido-client-kicker">CLIENTE</span>
                        <h3>
                          {c.nombreCompleto || `${c.nombre || ""} ${c.apellido || ""}`.trim() || "Cliente"}
                        </h3>
                        <p>{c.whatsapp || "Sin WhatsApp"}</p>
                      </div>

                      <strong>$ {formatearPrecio(totalCliente(cp))}</strong>
                    </div>

                    <div className="pedido-clean-assignment">
                      <span>Vendedor asignado</span>
                      <strong>{vendedorNombre}</strong>
                    </div>

                    <div className="pedido-result-box">
                      <div className="pedido-result-head">
                        <span>RESULTADO COMERCIAL</span>
                        <strong>
                          {cp.resultadoComercial === "concretada"
                            ? "CONCRETADA"
                            : cp.resultadoComercial === "caida"
                              ? "CAÍDA"
                              : "PENDIENTE DE VALIDACIÓN"}
                        </strong>
                      </div>

                      {cp.resultadoComercial !== "concretada" &&
                        cp.resultadoComercial !== "caida" &&
                        pedidoSeleccionado?.estado !== "Procesado" &&
                        pedidoSeleccionado?.estado !== "Cancelado" && (
                          <div className="pedido-result-actions">
                            <button
                              type="button"
                              className="pedido-result-button concretar"
                              onClick={() => resolverVentaDesdePedido(cp, "concretada")}
                              disabled={pedidoGuardando}
                            >
                              <CheckIcon />
                              Concretar venta
                            </button>

                            <button
                              type="button"
                              className="pedido-result-button caida"
                              onClick={() => resolverVentaDesdePedido(cp, "caida")}
                              disabled={pedidoGuardando}
                            >
                              <TrashIcon />
                              Marcar caída
                            </button>
                          </div>
                        )}
                    </div>

                    <div className="pedido-clean-products">
                      {productos.length === 0 ? (
                        <div className="pedido-no-products">Esta venta no tiene productos.</div>
                      ) : (
                        productos.map((p, pi) => {
                          const q = Number(p?.cantidad) || 1;
                          const precio = Number(p?.precioFinal) || Number(p?.precioVenta) || Number(p?.precio) || 0;

                          return (
                            <div className="pedido-clean-product" key={p?.productoId || p?.id || pi}>
                              <div className="pedido-clean-product-info">
                                <strong>{p?.nombre || p?.titulo || "Producto"}</strong>
                                <small>{q} unidad{q === 1 ? "" : "es"}</small>
                              </div>

                              {pedidoEditando ? (
                                <div className="pedido-qty-controls">
                                  <button
                                    type="button"
                                    onClick={() => cambiarCantidadPedido(ci, pi, q - 1)}
                                    disabled={pedidoGuardando || q <= 1}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={q}
                                    onChange={(e) => cambiarCantidadPedido(ci, pi, e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => cambiarCantidadPedido(ci, pi, q + 1)}
                                    disabled={pedidoGuardando}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <span className="pedido-clean-quantity">x{q}</span>
                              )}

                              <strong className="pedido-clean-subtotal">
                                $ {formatearPrecio(precio * q)}
                              </strong>

                              {pedidoEditando && (
                                <button
                                  type="button"
                                  className="pedido-remove-button"
                                  onClick={() => eliminarProductoPedido(ci, pi)}
                                  disabled={pedidoGuardando}
                                  title="Eliminar producto"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="pedido-clean-footer">
              {!pedidoEditando ? (
                <>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cerrarPedido}
                    disabled={pedidoGuardando}
                  >
                    Cerrar
                  </button>

                  {pedidoSeleccionado?.estado !== "Procesado" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => {
                        setPedidoEditando(true);
                        setPedidoError("");
                      }}
                    >
                      <PencilIcon />
                      Editar pedido
                    </button>
                  )}

                  {pedidoSeleccionado?.estado !== "Procesado" &&
                    !pedidoSeleccionado?.carritoArmadoEn &&
                    pedidoClientesEditados.length > 0 &&
                    pedidoClientesEditados.every(
                      (cliente) =>
                        cliente?.resultadoComercial ===
                        "concretada"
                    ) && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={armarCarritoPedido}
                        disabled={pedidoGuardando}
                      >
                        <ShoppingBagIcon />
                        {pedidoGuardando
                          ? "Armando carrito..."
                          : "Armar carrito"}
                      </button>
                    )}

                  {pedidoSeleccionado?.carritoArmadoEn &&
                    pedidoSeleccionado?.estado !== "Procesado" && (
                      <span className="status-button status-active">
                        <span />
                        Carrito armado
                      </span>
                    )}

                  {pedidoSeleccionado?.estado ===
                    "En preparación" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={
                        cerrarPedidoYGenerarComision
                      }
                      disabled={pedidoGuardando}
                    >
                      <CheckIcon />
                      Cerrar y generar comisión
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => abrirPedido(pedidoSeleccionado)}
                    disabled={pedidoGuardando}
                  >
                    Cancelar cambios
                  </button>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={guardarCambiosPedido}
                    disabled={pedidoGuardando}
                  >
                    <CheckIcon />
                    {pedidoGuardando ? "Guardando..." : "Guardar pedido"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modalAbierto && (

        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              cerrarModal();
            }
          }}
        >

          <div className="modal revendedor-modal">

            <div className="modal-header revendedor-modal-header">
              <div>
                <p className="section-eyebrow">{editando ? "EDITAR REVENDEDOR" : "NUEVO REVENDEDOR"}</p>
                <h2>{editando ? "Editar revendedor" : "Crear revendedor"}</h2>
                <p className="modal-subtitle">Configurá los datos y la asignación en pocos segundos.</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={cerrarModal}
                disabled={guardando}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardar}>

              <div className="form-section">
                <div className="form-section-title">Datos</div>
                <div className="form-grid">
                  <label>
                    <span>Nombre</span>
                    <input
                      value={form.nombre}
                      onChange={(e) => cambiarCampo("nombre", e.target.value)}
                      placeholder="Ej. Pedro"
                      autoFocus
                      required
                    />
                  </label>

                  <label>
                    <span>Apellido</span>
                    <input
                      value={form.apellido}
                      onChange={(e) => cambiarCampo("apellido", e.target.value)}
                      placeholder="Ej. Alfonso"
                      required
                    />
                  </label>

                  <label className="full">
                    <span>WhatsApp</span>
                    <input
                      value={form.whatsapp}
                      onChange={(e) => cambiarCampo("whatsapp", e.target.value)}
                      placeholder="54911..."
                      inputMode="tel"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Acceso</div>
                <label className="compact-label">
                  <span>Email de acceso</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => cambiarCampo("email", e.target.value)}
                    placeholder="revendedor@email.com"
                    autoComplete="off"
                    disabled={Boolean(editando)}
                    required={!editando}
                  />
                  {editando && <small>El email de acceso no se modifica.</small>}
                </label>

                {!editando && (
                  <label className="compact-label form-label-spaced">
                    <span>Contraseña</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => cambiarCampo("password", e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                  </label>
                )}
              </div>

              <div className="form-section form-section-highlight">
                <div className="form-section-title">Operación</div>
                <div className="operation-grid">
                  <label className="compact-label">
                    <span>Margen del revendedor</span>
                    <select
                      value={form.porcentaje}
                      onChange={(e) => cambiarCampo("porcentaje", e.target.value)}
                    >
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                      <option value="25">25%</option>
                      <option value="30">30%</option>
                    </select>
                  </label>

                  <label className="compact-label">
                    <span>Vendedor de Electro Hogar</span>
                    <select
                      value={form.vendedorOficialCodigo}
                      onChange={(e) => {
                        const vendedor = VENDEDORES_OFICIALES.find((item) => item.codigo === e.target.value);
                        cambiarCampo("vendedorOficialCodigo", vendedor?.codigo || "");
                        cambiarCampo("vendedorOficialNombre", vendedor?.nombre || "");
                      }}
                    >
                      <option value="">Sin asignar</option>
                      {VENDEDORES_OFICIALES.map((vendedor) => (
                        <option key={vendedor.codigo} value={vendedor.codigo}>
                          {vendedor.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="assignment-hint">Los pedidos de este revendedor van a quedar asignados automáticamente a este vendedor.</div>
              </div>

              {editando && (
                <div className="modal-link-row">
                  <LinkIcon />
                  <span>Link: <strong>/v/{editando.slug}</strong></span>
                  <button type="button" onClick={() => copiarLink(editando)}>Copiar</button>
                </div>
              )}

              {error && <div className="error-box">{error}</div>}

              <div className="modal-actions revendedor-modal-actions">
                <button type="button" className="secondary-button" onClick={cerrarModal} disabled={guardando}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button" disabled={guardando}>
                  {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear revendedor"}
                </button>
              </div>

            </form>

          </div>

        </div>

      )}

      <style>{`

        .dashboard-page {
          width: 100%;
          min-height: calc(100vh - 170px);
          padding: 2px 0 40px;
        }

        .dashboard-top {
          margin-bottom: 34px;
        }

        .dashboard-back {
          min-height: 42px;
          padding: 0 15px 0 12px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          box-sizing: border-box;
          border: 1px solid rgba(15,23,32,.09);
          border-radius: 12px;
          background: rgba(255,255,255,.72);
          color: #26322c;
          text-decoration: none;
          font-size: 13px;
          font-weight: 650;
          box-shadow: 0 5px 16px rgba(15,23,32,.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition:
            transform .2s ease,
            background .2s ease,
            border-color .2s ease,
            color .2s ease,
            box-shadow .2s ease;
        }

        .dashboard-back:hover {
          transform: translateY(-1px);
          background: #16a34a;
          border-color: #16a34a;
          color: #fff;
          box-shadow: 0 9px 22px rgba(22,163,74,.18);
        }

        .dashboard-back-icon {
          width: 18px;
          height: 18px;
          display: block;
          flex: 0 0 18px;
        }

        .dashboard-heading {
          display: flex;
          align-items: flex-start;
          gap: 17px;
          padding: 30px 32px;
          box-sizing: border-box;
          border: 1px solid rgba(15,23,32,.07);
          border-radius: 20px;
          background: rgba(255,255,255,.70);
          box-shadow:
            0 16px 38px rgba(15,23,32,.07),
            inset 0 1px 0 rgba(255,255,255,.75);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .dashboard-title-icon-wrap {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: linear-gradient(
            145deg,
            #16a34a,
            #22c55e
          );
          color: #fff;
          box-shadow:
            0 9px 22px rgba(22,163,74,.18);
        }

        .dashboard-title-icon {
          width: 27px;
          height: 27px;
          display: block;
        }

        .dashboard-eyebrow,
        .section-eyebrow {
          margin: 2px 0 5px;
          color: #16a34a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .dashboard-heading h1 {
          margin: 0;
          color: #162019;
          font-size: clamp(30px, 3vw, 42px);
          line-height: 1.05;
          letter-spacing: -.9px;
          font-weight: 800;
        }

        .dashboard-description {
          margin: 9px 0 0;
          color: #64716a;
          font-size: 15px;
          line-height: 1.5;
        }

        .revendedores-section {
          margin-top: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .section-icon {
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #eefbf2;
          color: #16a34a;
        }

        .section-icon svg {
          width: 22px;
          height: 22px;
        }

        .section-title h2 {
          margin: 0;
          color: #17201b;
          font-size: 24px;
          line-height: 1.1;
        }

        .section-title p:not(.section-eyebrow) {
          margin: 5px 0 0;
          color: #68746d;
          font-size: 13px;
        }

        .primary-button,
        .secondary-button,
        .action-button,
        .status-button,
        .icon-button,
        .close-button {
          font-family: inherit;
        }

        .primary-button {
          min-height: 43px;
          border: 0;
          border-radius: 12px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #16a34a;
          color: #fff;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          box-shadow:
            0 8px 18px rgba(22,163,74,.16);
          transition:
            transform .18s ease,
            background .18s ease;
        }

        .primary-button:hover {
          transform: translateY(-1px);
          background: #15803d;
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: .6;
          cursor: not-allowed;
          transform: none;
        }

        .primary-button svg {
          width: 17px;
          height: 17px;
        }

        .stats-row {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .stat-card {
          padding: 17px 19px;
          border: 1px solid rgba(15,23,32,.07);
          border-radius: 15px;
          background: rgba(255,255,255,.75);
          box-shadow:
            0 8px 22px rgba(15,23,32,.045);
        }

        .stat-card span {
          display: block;
          color: #758078;
          font-size: 12px;
          font-weight: 650;
        }

        .stat-card strong {
          display: block;
          margin-top: 5px;
          color: #162019;
          font-size: 27px;
          line-height: 1;
        }

        .toolbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 12px;
        }

        .search-box {
          width: min(100%, 330px);
          height: 43px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          box-sizing: border-box;
          border: 1px solid rgba(15,23,32,.10);
          border-radius: 12px;
          background: rgba(255,255,255,.78);
        }

        .search-box svg {
          width: 18px;
          height: 18px;
          color: #7a857e;
          flex: 0 0 18px;
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #17201b;
          font: inherit;
          font-size: 13px;
        }

        .revendedores-card {
          overflow: hidden;
          border: 1px solid rgba(15,23,32,.07);
          border-radius: 17px;
          background: rgba(255,255,255,.76);
          box-shadow:
            0 13px 30px rgba(15,23,32,.055);
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 920px;
          border-collapse: collapse;
        }

        th {
          padding: 14px 16px;
          text-align: left;
          color: #78827c;
          background: rgba(247,249,247,.88);
          border-bottom:
            1px solid rgba(15,23,32,.07);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .75px;
          white-space: nowrap;
        }

        td {
          padding: 15px 16px;
          border-bottom:
            1px solid rgba(15,23,32,.055);
          color: #26322c;
          vertical-align: middle;
        }

        tbody tr:last-child td {
          border-bottom: 0;
        }

        tbody tr:hover {
          background:
            rgba(22,163,74,.025);
        }

        .seller-cell {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 180px;
        }

        .seller-avatar {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #eefbf2;
          color: #15803d;
          font-size: 14px;
          font-weight: 800;
        }

        .seller-cell strong {
          display: block;
          color: #17201b;
          font-size: 13px;
        }

        .seller-cell small,
        .copied-text {
          display: block;
          margin-top: 3px;
          color: #89938d;
          font-size: 10px;
        }

        .plain-value {
          color: #4e5a53;
          font-size: 12px;
          white-space: nowrap;
        }

        .margin-badge {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 9px;
          background: #eefbf2;
          color: #15803d;
          font-size: 12px;
          font-weight: 800;
        }

        .status-button {
          min-height: 29px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          border-radius: 9px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 750;
        }

        .status-button span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: block;
        }

        .status-active {
          background: #ecfdf3;
          color: #15803d;
        }

        .status-active span {
          background: #22c55e;
        }

        .status-inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status-inactive span {
          background: #9ca3af;
        }

        .link-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          max-width: 205px;
        }

        .link-cell > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #4e5a53;
          font-size: 11px;
        }

        .icon-button {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(15,23,32,.09);
          border-radius: 9px;
          background: #fff;
          color: #526058;
          cursor: pointer;
        }

        .icon-button:hover {
          color: #15803d;
          border-color:
            rgba(22,163,74,.25);
        }

        .icon-button svg {
          width: 15px;
          height: 15px;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-button {
          min-height: 31px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(15,23,32,.09);
          border-radius: 9px;
          background: #fff;
          color: #4e5a53;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .action-button:hover {
          color: #15803d;
          border-color:
            rgba(22,163,74,.25);
        }

        .action-button svg {
          width: 14px;
          height: 14px;
        }

        .action-danger {
          color: #b42318;
          border-color: rgba(180, 35, 24, 0.16);
          background: #fffafa;
        }

        .action-danger:hover {
          color: #991b1b;
          border-color: rgba(180, 35, 24, 0.28);
          background: #fff5f5;
        }

        .action-reactivate {
          color: #15803d;
          border-color: rgba(22, 163, 74, 0.18);
          background: #f6fff8;
        }

        .action-reactivate:hover {
          color: #166534;
          border-color: rgba(22, 163, 74, 0.30);
          background: #effcf3;
        }

        .empty-state {
          min-height: 260px;
          padding: 40px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }

        .empty-icon {
          width: 52px;
          height: 52px;
          margin-bottom: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: #eefbf2;
          color: #16a34a;
        }

        .empty-icon svg {
          width: 25px;
          height: 25px;
        }

        .empty-state strong {
          color: #17201b;
          font-size: 15px;
        }

        .empty-state p {
          max-width: 390px;
          margin: 7px 0 16px;
          color: #7a857e;
          font-size: 13px;
          line-height: 1.5;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          background: rgba(10,16,12,.42);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
        }

        .modal {
          width: min(100%, 540px);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          padding: 24px;
          box-sizing: border-box;
          border: 1px solid rgba(15,23,32,.08);
          border-radius: 20px;
          background: #fff;
          box-shadow:
            0 25px 70px rgba(0,0,0,.18);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .modal-header h2 {
          margin: 0;
          color: #17201b;
          font-size: 25px;
        }

        .close-button {
          width: 34px;
          height: 34px;
          border: 1px solid rgba(15,23,32,.08);
          border-radius: 9px;
          background: #fff;
          color: #68746d;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .form-grid label {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-grid label.full {
          grid-column: 1 / -1;
        }

        .form-grid label > span {
          color: #354139;
          font-size: 12px;
          font-weight: 750;
        }

        .form-grid input,
        .form-grid select {
          width: 100%;
          min-height: 44px;
          padding: 0 12px;
          box-sizing: border-box;
          border: 1px solid rgba(15,23,32,.12);
          border-radius: 10px;
          outline: 0;
          background: #fff;
          color: #17201b;
          font: inherit;
          font-size: 13px;
        }

        .form-grid input:focus,
        .form-grid select:focus {
          border-color:
            rgba(22,163,74,.65);
          box-shadow:
            0 0 0 3px rgba(22,163,74,.09);
        }

        .form-grid label small {
          color: #818b85;
          font-size: 10px;
          line-height: 1.4;
        }

        .info-box {
          margin-top: 17px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid #dff3e5;
          border-radius: 11px;
          background: #f4fcf6;
          color: #15803d;
        }

        .info-box svg {
          width: 18px;
          height: 18px;
          flex: 0 0 18px;
        }

        .info-box strong,
        .info-box span {
          display: block;
        }

        .info-box strong {
          color: #24613a;
          font-size: 11px;
        }

        .info-box span {
          margin-top: 3px;
          color: #5c7062;
          font-size: 11px;
          word-break: break-all;
        }

        .error-box {
          margin-top: 15px;
          padding: 11px 12px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 12px;
          line-height: 1.45;
        }

        .modal-actions {
          margin-top: 22px;
          display: flex;
          justify-content: flex-end;
          gap: 9px;
        }

        .secondary-button {
          min-height: 43px;
          padding: 0 15px;
          border: 1px solid rgba(15,23,32,.10);
          border-radius: 11px;
          background: #fff;
          color: #4e5a53;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .secondary-button:hover {
          background: #f7f8f7;
        }


        .pedidos-section{margin-top:26px;margin-bottom:30px;padding:24px;border:1px solid rgba(15,23,32,.08);border-radius:20px;background:#fff;box-shadow:0 10px 30px rgba(15,23,32,.045)}
        .pedidos-section-icon{color:#15803d;background:#dcfce7}
        .pedidos-section-icon svg{width:22px;height:22px;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .pedido-stats-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:16px}
        .pedido-stat-card{padding:16px;border:1px solid #e4ebe6;border-radius:14px;background:#f9fbfa}
        .pedido-stat-card span{display:block;color:#64746b;font-size:11px;font-weight:700}
        .pedido-stat-card strong{display:block;margin-top:5px;color:#152019;font-size:26px;line-height:1}
        .pedidos-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}
        .pedido-filters{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}
        .pedido-filter{min-height:36px;padding:0 11px;border:1px solid #e0e7e2;border-radius:10px;background:#fff;color:#5c6b62;font-size:11px;font-weight:750;cursor:pointer}
        .pedido-filter.active{border-color:#16a34a;background:#16a34a;color:#fff}
        .pedidos-card{overflow:hidden;border:1px solid #e6ebe8;border-radius:15px;background:#fff}
        .pedidos-table-wrap{overflow-x:auto}
        .pedidos-table{width:100%;border-collapse:collapse;min-width:980px}
        .pedidos-table th{padding:12px 13px;border-bottom:1px solid #edf1ee;background:#fafcfb;color:#7a877f;font-size:10px;font-weight:800;text-align:left;text-transform:uppercase;letter-spacing:.045em}
        .pedidos-table td{padding:14px 13px;border-bottom:1px solid #f0f3f1;color:#33423a;font-size:12px;vertical-align:middle}
        .pedidos-table tbody tr:last-child td{border-bottom:0}
        .pedido-id-cell,.pedido-revendedor-cell{display:flex;flex-direction:column;gap:3px}
        .pedido-id-cell strong{color:#152019;font-size:12px}.pedido-id-cell small,.pedido-revendedor-cell small{color:#8a968f;font-size:10px}.pedido-revendedor-cell strong{color:#26352d;font-size:12px}
        .pedido-total{color:#15803d;white-space:nowrap}.pedido-date{color:#68766e;white-space:nowrap}
        .pedido-status{display:inline-flex;align-items:center;gap:6px;min-height:26px;padding:0 9px;border-radius:999px;background:#f1f5f3;color:#526158;font-size:10px;font-weight:800;white-space:nowrap}
        .pedido-status>span{width:6px;height:6px;border-radius:50%;background:#94a3a8}
        .pedido-status.status-pendiente{background:#fff7ed;color:#c2410c}.pedido-status.status-pendiente>span{background:#f97316}
        .pedido-status.status-en-revisión{background:#eff6ff;color:#2563eb}.pedido-status.status-en-revisión>span{background:#3b82f6}
        .pedido-status.status-en-preparación{background:#fefce8;color:#a16207}.pedido-status.status-en-preparación>span{background:#eab308}
        .pedido-status.status-procesado{background:#f0fdf4;color:#15803d}.pedido-status.status-procesado>span{background:#22c55e}
        .pedido-modal{width:min(920px,100%);max-width:920px!important}.pedido-modal-subtitle{display:block;margin-top:4px;color:#758279;font-size:11px}
        .pedido-modal-clean{width:min(820px,calc(100vw - 32px));max-height:min(88vh,900px);overflow:hidden;display:flex;flex-direction:column;border-radius:24px;background:#fff;box-shadow:0 28px 90px rgba(0,0,0,.24)}
        .pedido-clean-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:25px 28px 10px}
        .pedido-clean-heading h2{margin:0;color:#17231c;font-size:28px;line-height:1.1;letter-spacing:-.6px}.pedido-clean-heading p{display:flex;gap:8px;margin:6px 0 0;color:#7a877f;font-size:12px}.pedido-clean-heading p span{color:#b2bbb5}
        .pedido-clean-meta{display:flex;align-items:center;gap:8px;padding:0 28px 18px;color:#7a877f;font-size:12px}.pedido-clean-meta strong{color:#15803d;font-size:14px}
        .pedido-clean-status{display:flex;align-items:center;justify-content:space-between;gap:15px;margin:0 28px 14px;padding:12px 14px;border:1px solid #e7ece9;border-radius:12px;background:#fafcfb}.pedido-clean-status>div:first-child{display:flex;align-items:center;gap:8px}.pedido-clean-status span{color:#7b887f;font-size:11px}.pedido-clean-status strong{color:#243229;font-size:12px}.pedido-status-actions{display:flex;gap:6px}
        .pedido-small-button{min-height:32px;padding:0 10px;border:1px solid #dce5df;border-radius:8px;background:#fff;color:#59665e;font-size:10px;font-weight:800;cursor:pointer}.pedido-small-button.active{border-color:#b9e5c7;background:#eefaf1;color:#15803d}
        .pedido-clean-content{min-height:0;overflow-y:auto;padding:0 28px 18px}.pedido-clean-client{border:1px solid #e3e9e5;border-radius:15px;overflow:hidden;background:#fff}.pedido-clean-client+.pedido-clean-client{margin-top:10px}
        .pedido-clean-client-header{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:16px 18px;border-bottom:1px solid #edf1ee;background:#fbfcfb}.pedido-client-kicker{display:block;margin-bottom:3px;color:#16a34a;font-size:9px;font-weight:900;letter-spacing:.12em}.pedido-clean-client-header h3{margin:0;color:#17231c;font-size:17px}.pedido-clean-client-header p{margin:3px 0 0;color:#7b887f;font-size:11px}.pedido-clean-client-header>strong{color:#15803d;font-size:17px;white-space:nowrap}
        .pedido-clean-assignment{display:flex;align-items:center;gap:8px;padding:12px 18px 5px}.pedido-clean-assignment span{color:#7a877f;font-size:10px}.pedido-clean-assignment strong{padding:5px 9px;border-radius:7px;background:#f1f7f3;color:#1f3027;font-size:10px}
         .pedido-result-box{margin:10px 18px 0;padding:11px 13px;border:1px solid #e3e9e5;border-radius:12px;background:#fafcfb}
         .pedido-result-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
         .pedido-result-head span{color:#7a857e;font-size:9px;font-weight:850;letter-spacing:.09em}
         .pedido-result-head strong{color:#34423a;font-size:10px;letter-spacing:.04em}
         .pedido-result-actions{display:flex;gap:7px;margin-top:8px;flex-wrap:wrap}
         .pedido-result-button{min-height:34px;padding:0 11px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:9px;font-family:inherit;font-size:11px;font-weight:750;cursor:pointer;transition:.18s ease}
         .pedido-result-button svg{width:14px;height:14px}
         .pedido-result-button.concretar{border:1px solid #bde7cc;background:#effbf3;color:#16803d}
         .pedido-result-button.concretar:hover{background:#dcf7e5}
         .pedido-result-button.caida{border:1px solid #f2c7cc;background:#fff4f5;color:#c5303f}
         .pedido-result-button.caida:hover{background:#ffe8eb}
         .pedido-result-button:disabled{opacity:.55;cursor:not-allowed}
         .pedido-status-explanation{display:block;margin-top:4px;color:#7a857e;font-size:10px;line-height:1.4}
         .pedido-clean-products{padding:3px 18px 10px}
         .pedido-clean-product{display:grid;grid-template-columns:minmax(0,1fr) auto auto auto;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f0f3f1}
         .pedido-clean-product:last-child{border-bottom:0}
         .pedido-clean-product-info{min-width:0;display:flex;flex-direction:column;gap:3px}
         .pedido-clean-product-info strong{color:#29382f;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
         .pedido-clean-product-info small{color:#89948d;font-size:9px}
         .pedido-clean-quantity{min-width:32px;color:#66746b;text-align:center;font-size:11px;font-weight:800}
         .pedido-clean-subtotal{min-width:92px;color:#26352d;text-align:right;font-size:11px;white-space:nowrap}
         .pedido-no-products{padding:12px 0;color:#89948d;font-size:10px}
         .pedido-qty-controls{display:inline-flex;align-items:center;gap:4px}
         .pedido-qty-controls button{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;padding:0;border:1px solid #dce5df;border-radius:7px;background:#fff;color:#34423a;font-size:16px;line-height:1;cursor:pointer}
         .pedido-qty-controls button:hover:not(:disabled){background:#f2f7f4;border-color:#b9d8c3}
         .pedido-qty-controls button:disabled{opacity:.45;cursor:not-allowed}
         .pedido-qty-controls input{width:42px;height:28px;box-sizing:border-box;padding:0 4px;border:1px solid #dce5df;border-radius:7px;background:#fff;color:#26352d;text-align:center;font:700 11px inherit;outline:none}
         .pedido-qty-controls input:focus{border-color:#22a559;box-shadow:0 0 0 2px rgba(34,165,89,.09)}
         .pedido-remove-button{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;padding:0;border:1px solid #f0d0d4;border-radius:7px;background:#fff7f8;color:#c5303f;cursor:pointer}
         .pedido-remove-button svg{width:14px;height:14px}
         .pedido-remove-button:hover{background:#ffecef}
        .pedido-clean-footer{display:flex;justify-content:flex-end;align-items:center;flex-wrap:wrap;gap:8px;padding:15px 28px 20px;border-top:1px solid #edf1ee;background:#fff}.pedido-clean-footer .primary-button,.pedido-clean-footer .secondary-button{min-height:42px}.pedido-clean-footer .primary-button svg{width:15px;height:15px}
        .error-box{margin:0 28px 12px}
        @media (max-width:700px){
           .pedido-modal-clean{width:calc(100vw - 18px);max-height:calc(100vh - 18px);border-radius:18px}
           .pedido-clean-header{padding:18px 18px 8px}
           .pedido-clean-heading h2{font-size:22px}
           .pedido-clean-heading p{font-size:10px}
           .pedido-clean-meta{padding:0 18px 13px;font-size:10px}
           .pedido-clean-meta strong{font-size:12px}
           .pedido-clean-status{margin:0 18px 11px;padding:10px 11px}
           .pedido-clean-status>div:first-child{align-items:flex-start;flex-direction:column;gap:2px}
           .pedido-status-actions{flex-wrap:wrap;justify-content:flex-end}
           .pedido-clean-footer{justify-content:stretch}
           .pedido-clean-footer .primary-button,
           .pedido-clean-footer .secondary-button{flex:1 1 100%;justify-content:center}
           .pedido-clean-content{padding:0 18px 12px}
           .pedido-clean-client-header{padding:13px 14px}
           .pedido-clean-client-header h3{font-size:15px}
           .pedido-clean-client-header>strong{font-size:14px}
           .pedido-clean-assignment{padding:10px 14px 4px}
           .pedido-result-box{margin:9px 14px 0;padding:10px 11px}
           .pedido-result-actions{gap:6px}
           .pedido-result-button{flex:1;min-width:0}
           .pedido-clean-products{padding:2px 14px 8px}
           .pedido-clean-product{grid-template-columns:minmax(0,1fr) auto auto;gap:7px}
           .pedido-clean-product .pedido-remove-button{grid-column:3;grid-row:1}
           .pedido-clean-product .pedido-clean-subtotal{grid-column:3;grid-row:2}
           .pedido-clean-product .pedido-qty-controls{grid-column:2;grid-row:1 / span 2}
           .pedido-qty-controls button{width:26px;height:26px}
           .pedido-qty-controls input{width:38px;height:26px}
           .pedido-clean-footer{padding:12px 18px 16px;flex-wrap:wrap}
           .pedido-clean-footer .primary-button,.pedido-clean-footer .secondary-button{flex:1}
           .error-box{margin:0 18px 10px}
        }
@media (max-width: 700px) {

          .dashboard-page {
            min-height: auto;
            padding-bottom: 24px;
          }

          .dashboard-top {
            margin-bottom: 20px;
          }

          .dashboard-heading {
            gap: 13px;
            padding: 22px 18px;
            border-radius: 17px;
          }

          .dashboard-title-icon-wrap {
            width: 44px;
            height: 44px;
            flex-basis: 44px;
            border-radius: 13px;
          }

          .dashboard-title-icon {
            width: 23px;
            height: 23px;
          }

          .dashboard-heading h1 {
            font-size: 30px;
          }

          .dashboard-description {
            font-size: 14px;
          }

          .section-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .section-title {
            width: 100%;
          }

          .primary-button {
            width: 100%;
          }

          .stats-row {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 7px;
          }

          .stat-card {
            padding: 13px 10px;
          }

          .stat-card span {
            font-size: 10px;
          }

          .stat-card strong {
            font-size: 22px;
          }

          .toolbar {
            justify-content: stretch;
          }

          .search-box {
            width: 100%;
          }

          .modal-overlay {
            align-items: flex-end;
            padding: 10px;
          }

          .modal {
            max-height:
              calc(100vh - 20px);
            padding: 19px;
            border-radius: 18px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-grid label.full {
            grid-column: auto;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .modal-actions button {
            width: 100%;
          }

          .pedidos-section { margin-top:18px; padding:17px; border-radius:17px; }
          .pedido-stats-row { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pedidos-toolbar { align-items:stretch; flex-direction:column; }
          .pedido-filters { justify-content:flex-start; overflow-x:auto; flex-wrap:nowrap; padding-bottom:2px; }
          .pedido-filter { flex:0 0 auto; }
          .pedido-modal-summary { grid-template-columns:repeat(3,minmax(0,1fr)); }
          .pedido-modal-status-row { align-items:stretch; flex-direction:column; }
          .pedido-status-actions { width:100%; display:grid; grid-template-columns:1fr 1fr; }
          .pedido-small-button { width:100%; }
          .pedido-client-head { align-items:flex-start; }
          .pedido-client-assignment label { align-items:stretch; flex-direction:column; }
          .pedido-client-assignment select { width:100%; }
          .pedido-product-row { grid-template-columns:minmax(0,1fr) auto auto; }
          .pedido-remove-button { grid-column:3; grid-row:1; }
          .pedido-product-subtotal { grid-column:3; grid-row:2; }
          .pedido-qty-controls,.pedido-product-quantity { grid-column:2; grid-row:2; }
          .pedido-modal-footer { flex-direction:column-reverse; }
          .pedido-modal-footer button { width:100%; }

        }


        /* MODAL REVENDEDOR — SIMPLE Y RAPIDO */
        .revendedor-modal{width:min(100%,640px);padding:28px;border-radius:22px}
        .revendedor-modal-header{margin-bottom:20px}
        .revendedor-modal-header h2{font-size:28px;letter-spacing:-.025em}
        .modal-subtitle{margin:6px 0 0;color:#78857e;font-size:12px;line-height:1.45}
        .form-section{padding:16px 0;border-top:1px solid #edf1ee}
        .form-section:first-of-type{border-top:0;padding-top:0}
        .form-section-title{margin-bottom:11px;color:#647169;font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
        .form-section .form-grid{gap:12px}
        .form-section label>span,.compact-label>span{display:block;margin-bottom:6px;color:#425048;font-size:11px;font-weight:750}
        .form-section input,.form-section select{height:44px;box-sizing:border-box;border:1px solid #dfe6e2;border-radius:11px;background:#fff;color:#1d2822;padding:0 12px;font-size:13px;outline:none;transition:border-color .15s,box-shadow .15s}
        .form-section input:focus,.form-section select:focus{border-color:#22a559;box-shadow:0 0 0 3px rgba(34,165,89,.10)}
        .form-section input:disabled{background:#f7f9f8;color:#77827c}
        .form-section small{display:block;margin-top:6px;color:#8a958f;font-size:10px}
        .form-label-spaced{margin-top:12px}
        .form-section-highlight{padding:15px;border:1px solid #e1eee5;border-radius:14px;background:#f7fbf8;margin-top:2px}
        .operation-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:10px}
        .assignment-hint{margin-top:9px;color:#65736b;font-size:10px;line-height:1.4}
        .modal-link-row{display:flex;align-items:center;gap:8px;margin-top:14px;padding:10px 11px;border:1px solid #e7ece9;border-radius:10px;background:#fafcfb;color:#75827b;font-size:10px}
        .modal-link-row svg{width:16px;height:16px;color:#16a34a;flex:0 0 auto}
        .modal-link-row strong{color:#405048;font-weight:700}
        .modal-link-row button{margin-left:auto;border:0;background:transparent;color:#15803d;font-size:10px;font-weight:800;cursor:pointer;padding:4px 2px}
        .revendedor-modal-actions{margin-top:18px;padding-top:16px;border-top:1px solid #edf1ee}
        .revendedor-modal-actions .primary-button,.revendedor-modal-actions .secondary-button{min-height:44px}


        @media (max-width: 640px){
          .revendedor-modal{padding:20px;border-radius:18px}
          .revendedor-modal-header h2{font-size:24px}
          .operation-grid{grid-template-columns:1fr}
          .form-section-highlight{padding:13px}
          .modal-link-row{flex-wrap:wrap}
          .modal-link-row button{margin-left:auto}
        }

      `}</style>
    </Layout>
  );
}