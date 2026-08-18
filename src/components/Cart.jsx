import { useEffect } from "react";
import { useState } from "react";
import { crearPedido, obtenerSiguienteNumeroBoleta } from "../services/pedidosService";
import logo from "../assets/logo.png";
import "./Cart.css";
import { useCart } from "../context/CartContext";
import { useVendedor } from "../context/VendedorContext";

function Cart({ modoLocal = false }) {
  const {
    carrito,
    abierto,
    setAbierto,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    actualizarIMEI,
    obtenerPrecio,
    total,
    activarModoLocal,
    desactivarModoLocal,
    numeroBoletaLocal,
    guardarNumeroBoleta,
    recuperarBoleta,
    finalizarBoleta,
    boletaRecuperada,
    guardandoBoleta,
  } = useCart();

  const numeroBoleta = numeroBoletaLocal;

  const [numeroParaRecuperar, setNumeroParaRecuperar] =
    useState("");

  const [recuperandoBoleta, setRecuperandoBoleta] =
    useState(false);

  // =========================================================
  // RECUPERAR BOLETA DESDE FIREBASE
  // =========================================================

  async function manejarRecuperarBoleta() {
    if (!modoLocal) return;

    const numero = String(
      numeroParaRecuperar || ""
    ).trim();

    if (!numero) {
      alert("⚠️ Escribí el número de boleta que querés recuperar.");
      return;
    }

    try {
      setRecuperandoBoleta(true);

      const resultado =
        await recuperarBoleta(numero);

      if (!resultado?.ok) {
        alert(
          resultado?.mensaje ||
            "❌ No se encontró la boleta."
        );
        return;
      }

      setNumeroParaRecuperar("");

      alert(
        `✅ Boleta N° ${resultado.boleta.numeroBoleta || numero} recuperada.`
      );
    } catch (error) {
      console.error(
        "❌ Error recuperando boleta:",
        error
      );

      alert(
        "❌ No se pudo recuperar la boleta."
      );
    } finally {
      setRecuperandoBoleta(false);
    }
  }

  // =========================================================
  // CERRAR BOLETA ACTUAL
  // =========================================================

  async function manejarCerrarBoleta() {
    if (!numeroBoleta) {
      alert("⚠️ No hay una boleta activa para cerrar.");
      return;
    }

    const confirmar = window.confirm(
      `¿Cerrar definitivamente la boleta N° ${numeroBoleta}?\n\n` +
        "La venta quedará guardada en Firebase y no se eliminará."
    );

    if (!confirmar) return;

    try {
      await finalizarBoleta();

      alert(
        `✅ Boleta N° ${numeroBoleta} cerrada correctamente.`
      );
    } catch (error) {
      console.error(
        "❌ Error cerrando boleta:",
        error
      );

      alert(
        "❌ No se pudo cerrar la boleta."
      );
    }
  }

  // =========================================================
  // ACTIVAR / DESACTIVAR MODO LOCAL
  // =========================================================
  //
  // Local.jsx -> Home.jsx -> Cart modoLocal={true}
  //
  // Esto conecta el Modo Local con el guardado automático
  // del CartContext.
  // =========================================================

  useEffect(() => {
    if (modoLocal) {
      activarModoLocal();
    } else {
      desactivarModoLocal();
    }
  }, [
    modoLocal,
    activarModoLocal,
    desactivarModoLocal,
  ]);

  const {
    vendedor,
    setVendedor,
    vendedores,
  } = useVendedor();

  if (!abierto) return null;

  // =========================================================
  // IMPRIMIR REMITO
  // =========================================================

  async function imprimirPresupuesto() {
    try {
      let numeroActual = numeroBoleta;

      if (numeroActual === null) {
        numeroActual = await obtenerSiguienteNumeroBoleta();
        guardarNumeroBoleta(numeroActual);
      }

    const ventana = window.open(
      "",
      "_blank",
      "width=1400,height=900"
    );

    const fecha = new Date();

    const fechaFormateada =
      fecha.toLocaleDateString("es-AR");

    const horaFormateada =
      fecha.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const logoUrl =
      new URL(logo, window.location.href).href;

    let productosHTML = "";

    carrito.forEach((producto) => {
      const precio = obtenerPrecio(producto);

      const esCelular =
        producto.categoria === "Celulares";

      let imeiHTML = "";

      if (esCelular && producto.imeis?.length) {
        const imeisValidos = producto.imeis.filter(
          (imei) => imei?.trim()
        );

        if (imeisValidos.length > 0) {
          imeiHTML = `
            <div class="imeis-impresion">
              ${imeisValidos
                .map(
                  (imei, index) => `
                    <div>
                      IMEI ${index + 1}: ${imei}
                    </div>
                  `
                )
                .join("")}
            </div>
          `;
        }
      }

      productosHTML += `
        <tr>
          <td class="cantidad">
            ${producto.cantidad}
          </td>

          <td class="producto">
            <div class="nombre-producto">
              ${producto.nombre}
            </div>

            ${imeiHTML}
          </td>

          <td class="precio">
            $${precio.toLocaleString("es-AR")}
          </td>

          <td class="subtotal">
            $${(
              precio * producto.cantidad
            ).toLocaleString("es-AR")}
          </td>
        </tr>
      `;
    });

    // ===================================
    // AJUSTE AUTOMÁTICO SEGÚN PRODUCTOS
    // ===================================

    const cantidadProductos = carrito.length;

    let fontTabla = "8px";
    let paddingTabla = "4px";
    let altoFila = "22px";
    let logoWidth = "150px";
    let tituloSize = "16px";
    let infoFont = "9px";
    let infoHeight = "30px";

    if (cantidadProductos >= 12) {
      fontTabla = "7.5px";
      paddingTabla = "3px";
      altoFila = "20px";
      logoWidth = "145px";
      tituloSize = "15px";
      infoFont = "8.5px";
      infoHeight = "28px";
    }

    if (cantidadProductos >= 18) {
      fontTabla = "7px";
      paddingTabla = "2px";
      altoFila = "18px";
      logoWidth = "140px";
      tituloSize = "14px";
      infoFont = "8px";
      infoHeight = "26px";
    }

    if (cantidadProductos >= 24) {
      fontTabla = "6.5px";
      paddingTabla = "2px";
      altoFila = "16px";
      logoWidth = "135px";
      tituloSize = "13px";
      infoFont = "7.5px";
      infoHeight = "24px";
    }

    if (cantidadProductos >= 30) {
      fontTabla = "6px";
      paddingTabla = "1px";
      altoFila = "14px";
      logoWidth = "130px";
      tituloSize = "12px";
      infoFont = "7px";
      infoHeight = "22px";
    }

    const remitoHTML = `
<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">

<title>Remito</title>

<style>

@page{
    size:A4 landscape;
    margin:5mm;
}

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

html,
body{
    width:297mm;
    height:210mm;
    margin:0;
    padding:0;
    font-family:Arial,Helvetica,sans-serif;
    color:#111;
    background:#fff;
}

body{
    display:flex;
    justify-content:center;
    align-items:center;
}

.hoja{
    width:287mm;
    height:200mm;

    display:flex;
    justify-content:center;
    align-items:center;

    gap:4mm;

    padding:2mm;
}

.remito{
    width:140.5mm;
    height:196mm;

    border:2px solid #111;
    padding:6px;

    display:flex;
    flex-direction:column;

    overflow:hidden;

    flex-shrink:0;
}

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;

    margin-bottom:6px;
}

.logo img{
    width:${logoWidth};
    height:auto;
    display:block;
}

.titulo{
    border:2.5px solid #111;
    padding:6px 16px;
    min-width:110px;
    text-align:center;
    font-size:${tituloSize};
    font-weight:900;
    letter-spacing:.8px;
    line-height:1.1;
    box-sizing:border-box;
}

.info{
    display:grid;
    grid-template-columns:1fr 1fr;

    gap:4px;

    margin:5px 0 6px;
}

.info div{
    border:1px solid #ccc;

    padding:4px 6px;

    min-height:${infoHeight};

    font-size:${infoFont};

    line-height:1.2;
}

.info strong{
    display:block;

    margin-bottom:2px;

    font-size:7px;
}

table{
    width:100%;
    border-collapse:collapse;
    table-layout:auto;
    margin-top:2px;
}

th{
    background:#111;
    color:#fff;

    padding:${paddingTabla};

    font-size:${fontTabla};

    font-weight:bold;

    white-space:nowrap;
}

td{
    border:1px solid #ddd;

    padding:${paddingTabla};

    font-size:${fontTabla};

    min-height:${altoFila};

    vertical-align:middle;
}

.cantidad{
    width:20px;
    min-width:20px;
    max-width:20px;

    text-align:center;
}

.producto{
    width:auto;

    padding-left:4px;
}

.nombre-producto{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    font-weight:normal;
}

.imeis-impresion{
    margin-top:2px;
    font-size:calc(${fontTabla} - 1px);
    line-height:1.2;
    color:#333;
    white-space:normal;
}

.imeis-impresion div{
    margin-top:1px;
}

.precio{
    width:52px;
    min-width:52px;
    max-width:52px;

    text-align:right;

    padding-right:3px;
}

.subtotal{
    width:58px;
    min-width:58px;
    max-width:58px;

    text-align:right;

    padding-right:3px;
}

.inferior{
    margin-top:auto;

    display:flex;

    justify-content:space-between;

    align-items:flex-end;

    gap:6px;
}

.forma-pago{
    flex:1;

    display:flex;

    flex-direction:column;

    gap:4px;
}

.pago{
    display:grid;

    grid-template-columns:26mm 1fr;

    border:1px solid #111;

    height:7mm;
}

.pago span{
    display:flex;

    justify-content:center;

    align-items:center;

    border-right:1px solid #111;

    background:#f5f5f5;

    font-size:8px;

    font-weight:bold;
}

.linea{
    display:flex;

    align-items:center;

    padding:0 6px;

    font-size:8px;

    color:#666;
}

.total{
    width:38mm;

    flex-shrink:0;
}

.total div{
    height:16mm;

    border:2px solid #111;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    text-align:center;

    font-size:12px;

    font-weight:bold;

    line-height:1.1;
}

.footer{
    margin-top:2px;

    text-align:center;

    font-size:7px;

    color:#666;
}

@media print{

    @page{
        size:A4 landscape;
        margin:5mm;
    }

    html,
    body{
        width:297mm;
        height:210mm;

        margin:0;
        padding:0;

        overflow:hidden;

        background:#fff;
    }

    body{
        display:flex;

        justify-content:center;

        align-items:center;
    }

    .hoja{
        width:287mm;
        height:200mm;

        display:flex;

        justify-content:space-between;

        align-items:flex-start;

        gap:4mm;

        padding:0;
    }

    .remito{
        width:139mm;
        height:194mm;

        border:2px solid #111;

        padding:5px;

        display:flex;

        flex-direction:column;

        overflow:hidden;

        flex-shrink:0;

        page-break-inside:avoid;

        break-inside:avoid;
    }

    *{
        box-sizing:border-box;
    }

}

</style>

</head>

<body>

<div class="hoja">

${[1, 2]
  .map(
    () => `

<div class="remito">

    <div class="header">

        <div class="logo">
            <img
                src="${logoUrl}"
                alt="Electro Hogar"
            >
        </div>

        <div class="titulo">
            N° ${numeroActual}
        </div>

    </div>

    <div style="
        margin-bottom:8px;
        font-size:11px;
        font-weight:bold;
        text-align:center;
    ">
        TRIUNVIRATO 2535 - QUILMES OESTE
    </div>

    <div class="info">

        <div>
            <strong>FECHA</strong><br>
            ${fechaFormateada}
        </div>

        <div>
            <strong>HORA</strong><br>
            ${horaFormateada}
        </div>

        <div>
            <strong>VENDEDOR</strong><br>
            ${vendedor.nombre}
        </div>

        <div>
            <strong>CLIENTE</strong><br>
            ________________________________________
        </div>

    </div>

    <table>

        <thead>

            <tr>

                <th class="cantidad">
                    C.
                </th>

                <th class="producto">
                    Producto
                </th>

                <th class="precio">
                    $
                </th>

                <th class="subtotal">
                    Total
                </th>

            </tr>

        </thead>

        <tbody>

            ${productosHTML}

        </tbody>

    </table>

    <div class="inferior">

        <div class="forma-pago">

            <div class="pago">

                <span>
                    EFECTIVO
                </span>

                <div class="linea">
                    ____________________________________
                </div>

            </div>

            <div class="pago">

                <span>
                    TRANSFERENCIA
                </span>

                <div class="linea">
                    ____________________________________
                </div>

            </div>

        </div>

        <div class="total">

            <div>

                TOTAL

                <br>

                $${total.toLocaleString("es-AR")}

            </div>

        </div>

    </div>

    <div class="footer">
        Electro Hogar Quilmes
    </div>

</div>

`
  )
  .join("")}

</div>

</body>

</html>
`;

    ventana.document.write(remitoHTML);

    ventana.document.close();

    ventana.onload = () => {
      ventana.focus();

      ventana.print();

      ventana.onafterprint = () => {
        ventana.close();
      };
    };
  } catch (error) {
      console.error("Error generando número de boleta:", error);
      alert("❌ No se pudo obtener el número de boleta. No se imprimió nada.");
    }
  }

  // =========================================================
  // ENVIAR AL MOSTRADOR
  // =========================================================

  async function enviarAlMostrador() {
    try {
      const ahora = new Date();

      // =======================================================
      // ASEGURAR NÚMERO DE BOLETA
      // =======================================================
      // Si todavía no tiene número, lo obtenemos ahora.
      // Así el mismo número viaja al Mostrador y luego
      // se utiliza al imprimir el remito.
      let numeroActual = numeroBoleta;

      if (numeroActual === null) {
        numeroActual = await obtenerSiguienteNumeroBoleta();
        guardarNumeroBoleta(numeroActual);
      }

      const pedido = {
        estado: "Pendiente",

        numeroBoleta: numeroActual,

        vendedor: vendedor.nombre,

        vendedorCodigo: vendedor.codigo,

        fecha:
          ahora.toLocaleDateString("es-AR"),

        hora:
          ahora.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          }),

        total,

        productos: carrito.map((producto) => {
          const precio =
            obtenerPrecio(producto);

          return {
            id: producto.id,

            nombre: producto.nombre,

            cantidad: producto.cantidad,

            precio,

            subtotal:
              precio * producto.cantidad,

            categoria:
              producto.categoria || "",

            imeis:
              producto.categoria === "Celulares"
                ? (producto.imeis || []).filter(
                    (imei) => imei?.trim()
                  )
                : [],

            imagen:
              producto.imagenes?.[0] ||
              producto.imagen ||
              "",
          };
        }),
      };

      console.log(
        "Pedido a enviar al mostrador:",
        pedido
      );

      const resultado =
        await crearPedido(pedido);

      console.log(
        "Pedido creado:",
        resultado.id
      );

      alert(
        "✅ Pedido enviado al mostrador."
      );

      setAbierto(false);
    } catch (error) {
      console.error(
        "Error enviando al mostrador:",
        error
      );

      alert(
        "❌ No se pudo enviar el pedido."
      );
    }
  }

  // =========================================================
  // ENVIAR POR WHATSAPP
  // =========================================================

  async function enviarWhatsApp() {
    try {
      // =======================================================
      // CREAR ORDEN EN FIREBASE
      // =======================================================
      const pedido = {
        estado: "Creada",

        vendedor: vendedor.nombre,

        vendedorCodigo: vendedor.codigo,

        total,

        productos: carrito.map((producto) => {
          const precio = obtenerPrecio(producto);

          return {
            id: producto.id,

            nombre: producto.nombre,

            cantidad: producto.cantidad,

            precio,

            subtotal: precio * producto.cantidad,

            categoria: producto.categoria || "",

            imeis:
              producto.categoria === "Celulares"
                ? (producto.imeis || []).filter((imei) => imei?.trim())
                : [],

            imagen:
              producto.imagenes?.[0] ||
              producto.imagen ||
              "",
          };
        }),
      };

      console.log("Pedido para WhatsApp:", pedido);

      const resultado = await crearPedido(pedido);
      const pedidoId = resultado.id;

      // =======================================================
      // LINK DE LA ORDEN
      // =======================================================
      // Se mantiene exactamente la lógica actual:
      // /pedido/ID -> abrir la orden -> imprimirla.
      const linkOrden = `${window.location.origin}/pedido/${pedidoId}`;

      // =======================================================
      // SALUDO SEGÚN VENDEDOR
      // =======================================================
      const saludos = {
        LAUTARO: "Hola Lauti! 👋",
        MILAGROS: "Hola Mili! 👋",
        GONZALO: "Hola Gonza! 👋",
        CAMILA: "Hola Cami! 👋",
        VICTORIA: "Hola Vicky! 👋",
      };

      let mensaje =
        `${saludos[vendedor.nombre.toUpperCase()] || `Hola ${vendedor.nombre}! 👋`}` +
        `\n\nQuiero consultar por los siguientes productos:\n\n`;

      carrito.forEach((producto) => {
        const precio = obtenerPrecio(producto);

        mensaje += `• ${producto.nombre}\n`;
        mensaje += `Cantidad: ${producto.cantidad}\n`;
        mensaje += `Precio Unitario: $${precio.toLocaleString("es-AR")}\n`;
        mensaje += `Subtotal: $${(
          precio * producto.cantidad
        ).toLocaleString("es-AR")}\n\n`;
      });

      mensaje += `💰 Total: $${total.toLocaleString("es-AR")}\n\n`;
      mensaje += `📋 Orden de pedido:\n${linkOrden}\n\n`;
      mensaje += "¡Muchas gracias! 😊";

      // =======================================================
      // NÚMERO DE WHATSAPP DEL VENDEDOR
      // =======================================================
      // Acepta números guardados como:
      // +54 9 11 1234-5678
      // 5491112345678
      // 541112345678
      // 1112345678
      //
      // Los convertimos siempre al formato internacional que
      // necesita WhatsApp: 549 + código de área + número.
      let numeroWhatsApp = String(vendedor.numero || "").replace(/\D/g, "");

      if (!numeroWhatsApp) {
        throw new Error("El vendedor no tiene un número de WhatsApp válido.");
      }

      if (numeroWhatsApp.startsWith("00")) {
        numeroWhatsApp = numeroWhatsApp.slice(2);
      }

      // Número argentino ya completo: 549...
      if (numeroWhatsApp.startsWith("549")) {
        // No tocar.
      }
      // Argentina con 54 pero sin el 9 de celular: 54...
      else if (numeroWhatsApp.startsWith("54")) {
        numeroWhatsApp = `549${numeroWhatsApp.slice(2)}`;
      }
      // Número local argentino de 10 dígitos: 11xxxxxxxx
      else if (numeroWhatsApp.length === 10) {
        numeroWhatsApp = `549${numeroWhatsApp}`;
      }
      // Número local con 0 adelante: 011xxxxxxxx
      else if (
        numeroWhatsApp.length === 11 &&
        numeroWhatsApp.startsWith("0")
      ) {
        numeroWhatsApp = `549${numeroWhatsApp.slice(1)}`;
      }

      if (!numeroWhatsApp.startsWith("549")) {
        throw new Error(
          `Número de WhatsApp inválido para el vendedor ${vendedor.nombre}: ${vendedor.numero}`
        );
      }

      // =======================================================
      // ABRIR WHATSAPP
      // =======================================================
      // Usamos wa.me porque es el enlace oficial de apertura
      // de WhatsApp y evita problemas de redirección de
      // api.whatsapp.com en algunos celulares/navegadores.
      const urlWhatsApp =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
          mensaje
        )}`;

      console.log("WhatsApp URL:", urlWhatsApp);
      console.log("Vendedor:", vendedor.nombre);
      console.log("Número WhatsApp normalizado:", numeroWhatsApp);

      // Navegación directa para que funcione tanto en celular
      // como en PC y no dependa de ventanas emergentes.
      window.location.assign(urlWhatsApp);
    } catch (error) {
      console.error("Error creando la orden:", error);

      alert(
        "❌ No se pudo generar la orden. Verificá tu conexión e intentá nuevamente."
      );
    }
  }


  // =========================================================
  // MANEJAR ENTER DEL LECTOR DE CÓDIGO
  // =========================================================

  function manejarEnterIMEI(
    e,
    productoId,
    indice
  ) {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const siguiente =
      document.querySelector(
        `[data-imei-index="${productoId}-${indice + 1}"]`
      );

    if (siguiente) {
      siguiente.focus();
      siguiente.select();
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="cart-overlay"
      onClick={() => setAbierto(false)}
    >

      <div
        className="cart-panel"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="cart-header">

          <h2>
            🛒 Mi carrito
          </h2>

          <button
            onClick={() =>
              setAbierto(false)
            }
          >
            ✖
          </button>

        </div>

{modoLocal && (
  <div
    style={{
      marginBottom: "12px",
      padding: "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      background: "#f8f8f8",
    }}
  >
    <div
      style={{
        fontWeight: "bold",
        fontSize: "16px",
        marginBottom: "7px",
      }}
    >
      🔎 Recuperar boleta
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
      }}
    >
      <input
        type="number"
        inputMode="numeric"
        placeholder="71499"
        value={numeroParaRecuperar}
        onChange={(e) =>
          setNumeroParaRecuperar(
            e.target.value
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            manejarRecuperarBoleta();
          }
        }}
        style={{
          width: "110px",
          height: "42px",
          padding: "6px 10px",
          border: "1px solid #bbb",
          borderRadius: "7px",
          fontSize: "16px",
          fontWeight: "bold",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      <button
        type="button"
        className="print-btn"
        onClick={manejarRecuperarBoleta}
        disabled={recuperandoBoleta}
        style={{
          height: "42px",
          padding: "0 16px",
          whiteSpace: "nowrap",
          fontSize: "15px",
          opacity: recuperandoBoleta
            ? 0.7
            : 1,
        }}
      >
        {recuperandoBoleta
          ? "Buscando..."
          : "🔎 Recuperar"}
      </button>
    </div>

    {numeroBoleta && (
      <div
        style={{
          marginTop: "7px",
          fontSize: "13px",
          fontWeight: "bold",
        }}
      >
        🧾 Boleta activa: N°{" "}
        {numeroBoleta}

        {boletaRecuperada
          ? " · Recuperada"
          : ""}

        {guardandoBoleta
          ? " · Guardando..."
          : ""}
      </div>
    )}
  </div>
)}

        {carrito.length === 0 ? (

          <p>
            Tu carrito está vacío.
          </p>

        ) : (

          <>

            {carrito.map((producto) => {

              const precio =
                obtenerPrecio(producto);

              let promo = "";

              if (
                producto.cantidad >= 12
              )
                promo =
                  "🔥 Precio x12 aplicado";

              else if (
                producto.cantidad >= 9
              )
                promo =
                  "🔥 Precio x9 aplicado";

              else if (
                producto.cantidad >= 6
              )
                promo =
                  "🔥 Precio x6 aplicado";

              else if (
                producto.cantidad >= 3
              )
                promo =
                  "🔥 Precio x3 aplicado";

              else if (
                producto.cantidad >= 2
              )
                promo =
                  "🔥 Precio x2 aplicado";

              const esCelular =
                producto.categoria === "Celulares";

              return (

                <div
                  key={producto.id}
                  className="cart-item"
                >

                  <img
                    src={
                      producto.imagenes?.[0] ||
                      producto.imagen
                    }
                    alt={producto.nombre}
                  />

                  <div className="cart-info">

                    <h4>
                      {producto.nombre}
                    </h4>

                    <p>
                      $
                      {precio.toLocaleString(
                        "es-AR"
                      )}
                    </p>

                    {promo && (
                      <p
                        style={{
                          color: "#16a34a",
                          fontWeight: "bold",
                          marginBottom: "8px",
                        }}
                      >
                        {promo}
                      </p>
                    )}

                    <div className="cart-controls">

                      <button
                        onClick={() =>
                          disminuirCantidad(
                            producto.id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {producto.cantidad}
                      </span>

                      <button
                        onClick={() =>
                          aumentarCantidad(
                            producto.id
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    {/* =====================================================
                        IMEI PARA CELULARES
                    ====================================================== */}

                    {esCelular && modoLocal && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#f8f8f8",
                        }}
                      >

                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "8px",
                            fontSize: "14px",
                          }}
                        >
                          📱 IMEI
                        </div>

                        {Array.from({
                          length: producto.cantidad,
                        }).map((_, indice) => (

                          <div
                            key={`${producto.id}-imei-${indice}`}
                            style={{
                              marginBottom:
                                indice <
                                producto.cantidad - 1
                                  ? "8px"
                                  : "0",
                            }}
                          >

                            <label
                              style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginBottom: "4px",
                              }}
                            >
                              IMEI {indice + 1}
                            </label>

                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="off"
                              placeholder="Escaneá el IMEI con la pistola"
                              value={
                                producto.imeis?.[
                                  indice
                                ] || ""
                              }
                              data-imei-index={`${producto.id}-${indice}`}
                              onChange={(e) =>
                                actualizarIMEI(
                                  producto.id,
                                  indice,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) =>
                                manejarEnterIMEI(
                                  e,
                                  producto.id,
                                  indice
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "9px",
                                border:
                                  "1px solid #bbb",
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing:
                                  "border-box",
                              }}
                            />

                          </div>

                        ))}

                      </div>
                    )}

                    <p
                      style={{
                        fontWeight: "bold",
                        marginTop: "8px",
                      }}
                    >
                      Subtotal: $

                      {(
                        precio *
                        producto.cantidad
                      ).toLocaleString(
                        "es-AR"
                      )}

                    </p>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        eliminarProducto(
                          producto.id
                        )
                      }
                    >
                      🗑 Eliminar
                    </button>

                  </div>

                </div>

              );

            })}

            {modoLocal && (

              <div
                style={{
                  marginBottom: "15px",
                }}
              >

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  👤 Vendedor
                </label>

                <select
                  value={vendedor.codigo}
                  onChange={(e) =>
                    setVendedor(
                      vendedores[
                        e.target.value
                      ]
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "15px",
                    borderRadius: "8px",
                  }}
                >

                  {Object.values(
                    vendedores
                  ).map((v) => (

                    <option
                      key={v.codigo}
                      value={v.codigo}
                    >
                      {v.nombre}
                    </option>

                  ))}

                </select>

              </div>

            )}

            <h2 className="cart-total">

              Total: $

              {total.toLocaleString(
                "es-AR"
              )}

            </h2>

            <div className="action-buttons">

              {modoLocal && (

                <>

                  <button
                    className="print-btn"
                    onClick={imprimirPresupuesto}
                    style={{
                      padding: "14px 18px",
                      fontSize: "18px",
                    }}
                  >
                    🖨️ {numeroBoleta
                      ? `Reimprimir N° ${numeroBoleta}`
                      : "Imprimir Remito"}
                  </button>

                  <button
                    className="print-btn"
                    onClick={
                      enviarAlMostrador
                    }
                    style={{
                      padding: "14px 18px",
                      fontSize: "18px",
                    }}
                  >
                    📤 Enviar al Mostrador
                  </button>

                  {numeroBoleta && (
                    <div
                      style={{
                        marginTop: "8px",
                        paddingTop: "10px",
                        borderTop: "1px solid #ddd",
                      }}
                    >
                      <button
                        className="print-btn"
                        onClick={
                          manejarCerrarBoleta
                        }
                        style={{
                          padding: "12px 18px",
                          fontSize: "17px",
                        }}
                      >
                        ✅ Cerrar boleta N° {numeroBoleta}
                      </button>
                    </div>
                  )}

                </>

              )}

              {!modoLocal && (
                <button
                  className="whatsapp-btn"
                  onClick={
                    enviarWhatsApp
                  }
                >
                  🟢 Enviar pedido a{" "}
                  {vendedor.nombre}
                </button>
              )}

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default Cart;