import { useEffect } from "react";
import { useState } from "react";

import {
  crearPedido,
  obtenerSiguienteNumeroBoleta,
} from "../services/pedidosService";

import logo from "../assets/logo.png";

import "./Cart.css";

import { useCart } from "../context/CartContext";
import { useVendedor } from "../context/VendedorContext";
import { useRevendedorPublico } from "../context/RevendedorPublicoContext";

import {
  crearClienteRevendedor,
  crearVentaRevendedor,
  incrementarConsultasRevendedor,
} from "../services/vendedoresService";


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
    guardarBoletaAhora,
    recuperarBoleta,
    finalizarBoleta,

    boletaRecuperada,
    guardandoBoleta,
  } = useCart();


  const numeroBoleta =
    numeroBoletaLocal;


  const [
    numeroParaRecuperar,
    setNumeroParaRecuperar,
  ] = useState("");


  const [
    recuperandoBoleta,
    setRecuperandoBoleta,
  ] = useState(false);


  // =========================================================
  // CONSULTA DEL REVENDEDOR
  // =========================================================

  const [
    modalConsultaAbierto,
    setModalConsultaAbierto,
  ] = useState(false);


  const [
    clienteConsulta,
    setClienteConsulta,
  ] = useState({
    nombre: "",
    whatsapp: "",
  });


  const [
    enviandoConsulta,
    setEnviandoConsulta,
  ] = useState(false);


  // =========================================================
  // RECUPERAR BOLETA
  // =========================================================

  async function manejarRecuperarBoleta() {

    if (!modoLocal) return;

    const numero =
      String(
        numeroParaRecuperar || ""
      ).trim();


    if (!numero) {

      alert(
        "⚠️ Escribí el número de boleta que querés recuperar."
      );

      return;
    }


    try {

      setRecuperandoBoleta(true);


      const resultado =
        await recuperarBoleta(
          numero
        );


      if (!resultado?.ok) {

        alert(
          resultado?.mensaje ||
            "❌ No se encontró la boleta."
        );

        return;
      }


      setNumeroParaRecuperar("");


      alert(
        `✅ Boleta N° ${
          resultado.boleta.numeroBoleta ||
          numero
        } recuperada.`
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
  // ACTIVAR / DESACTIVAR MODO LOCAL
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


  // =========================================================
  // VENDEDOR INTERNO
  // =========================================================

  const {
    vendedor,
    setVendedor,
    vendedores,
  } = useVendedor();


  // =========================================================
  // REVENDEDOR PÚBLICO
  // =========================================================

  const {
    activo: modoRevendedor,
    revendedor,
  } = useRevendedorPublico();


  if (!abierto) return null;


  // =========================================================
  // IMPRIMIR REMITO
  // =========================================================

  async function imprimirPresupuesto() {

    try {

      let numeroActual =
        numeroBoleta;


      if (numeroActual === null) {

        numeroActual =
          await obtenerSiguienteNumeroBoleta();

        guardarNumeroBoleta(
          numeroActual
        );
      }


      const ventana =
        window.open(
          "",
          "_blank",
          "width=1400,height=900"
        );


      if (!ventana) {

        alert(
          "❌ El navegador bloqueó la ventana de impresión."
        );

        return;
      }


      const fecha =
        new Date();


      const fechaFormateada =
        fecha.toLocaleDateString(
          "es-AR"
        );


      const horaFormateada =
        fecha.toLocaleTimeString(
          "es-AR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );


      const logoUrl =
        new URL(
          logo,
          window.location.href
        ).href;


      let productosHTML =
        "";


      carrito.forEach(
        (producto) => {

          const precio =
            obtenerPrecio(
              producto
            );


          const esCelular =
            producto.categoria ===
            "Celulares";


          let imeiHTML =
            "";


          if (
            esCelular &&
            producto.imeis?.length
          ) {

            const imeisValidos =
              producto.imeis.filter(
                (imei) =>
                  imei?.trim()
              );


            if (
              imeisValidos.length >
              0
            ) {

              imeiHTML = `
                <div class="imeis-impresion">
                  ${imeisValidos
                    .map(
                      (
                        imei,
                        index
                      ) => `
                        <div>
                          IMEI ${
                            index + 1
                          }: ${imei}
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
                $${precio.toLocaleString(
                  "es-AR"
                )}
              </td>

              <td class="subtotal">
                $${(
                  precio *
                  producto.cantidad
                ).toLocaleString(
                  "es-AR"
                )}
              </td>

            </tr>
          `;
        }
      );


      const cantidadProductos =
        carrito.length;


      let fontTabla =
        "8px";

      let paddingTabla =
        "4px";

      let altoFila =
        "22px";

      let logoWidth =
        "150px";

      let tituloSize =
        "22px";

      let infoFont =
        "9px";

      let infoHeight =
        "30px";


      if (
        cantidadProductos >=
        12
      ) {

        fontTabla =
          "7.5px";

        paddingTabla =
          "3px";

        altoFila =
          "20px";

        logoWidth =
          "145px";

        tituloSize =
          "21px";

        infoFont =
          "8.5px";

        infoHeight =
          "28px";
      }


      if (
        cantidadProductos >=
        18
      ) {

        fontTabla =
          "7px";

        paddingTabla =
          "2px";

        altoFila =
          "18px";

        logoWidth =
          "140px";

        tituloSize =
          "20px";

        infoFont =
          "8px";

        infoHeight =
          "26px";
      }


      if (
        cantidadProductos >=
        24
      ) {

        fontTabla =
          "6.5px";

        paddingTabla =
          "2px";

        altoFila =
          "16px";

        logoWidth =
          "135px";

        tituloSize =
          "19px";

        infoFont =
          "7.5px";

        infoHeight =
          "24px";
      }


      if (
        cantidadProductos >=
        30
      ) {

        fontTabla =
          "6px";

        paddingTabla =
          "1px";

        altoFila =
          "14px";

        logoWidth =
          "130px";

        tituloSize =
          "18px";

        infoFont =
          "7px";

        infoHeight =
          "22px";
      }


      const remitoHTML = `
<!DOCTYPE html>

<html lang="es">

<head>

<meta charset="UTF-8">

<title>Remito</title>

<style>

@page {
  size: A4 landscape;
  margin: 5mm;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {

  width: 297mm;
  height: 210mm;

  margin: 0;
  padding: 0;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #111;

  background: #fff;
}

body {

  display: flex;

  justify-content: center;

  align-items: center;
}

.hoja {

  width: 287mm;
  height: 200mm;

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 4mm;

  padding: 2mm;
}

.remito {

  width: 140.5mm;
  height: 196mm;

  border: 2px solid #111;

  padding: 6px;

  display: flex;

  flex-direction: column;

  overflow: hidden;

  flex-shrink: 0;
}

.header {

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom: 6px;
}

.logo img {

  width:
    ${logoWidth};

  height:
    auto;

  display:
    block;
}

.titulo {

  border:
    3px solid #111;

  padding:
    6px 14px;

  min-width:
    115px;

  text-align:
    center;

  font-size:
    ${tituloSize};

  font-weight:
    900;

  letter-spacing:
    .8px;

  line-height:
    1.1;

  box-sizing:
    border-box;

  margin-right:
    10px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  white-space:
    nowrap;
}

.info {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    4px;

  margin:
    5px 0 6px;
}

.info div {

  border:
    1px solid #ccc;

  padding:
    4px 6px;

  min-height:
    ${infoHeight};

  font-size:
    ${infoFont};

  line-height:
    1.2;
}

.info strong {

  display:
    block;

  margin-bottom:
    2px;

  font-size:
    7px;
}

table {

  width:
    100%;

  border-collapse:
    collapse;

  table-layout:
    auto;

  margin-top:
    2px;
}

th {

  background:
    #111;

  color:
    #fff;

  padding:
    ${paddingTabla};

  font-size:
    ${fontTabla};

  font-weight:
    bold;

  white-space:
    nowrap;
}

td {

  border:
    1px solid #ddd;

  padding:
    ${paddingTabla};

  font-size:
    ${fontTabla};

  min-height:
    ${altoFila};

  vertical-align:
    middle;
}

.cantidad {

  width:
    20px;

  min-width:
    20px;

  max-width:
    20px;

  text-align:
    center;
}

.producto {

  width:
    auto;

  padding-left:
    4px;
}

.nombre-producto {

  white-space:
    nowrap;

  overflow:
    hidden;

  text-overflow:
    ellipsis;

  font-weight:
    normal;
}

.imeis-impresion {

  margin-top:
    2px;

  font-size:
    calc(
      ${fontTabla} - 1px
    );

  line-height:
    1.2;

  color:
    #333;

  white-space:
    normal;
}

.imeis-impresion div {

  margin-top:
    1px;
}

.precio {

  width:
    52px;

  min-width:
    52px;

  max-width:
    52px;

  text-align:
    right;

  padding-right:
    3px;
}

.subtotal {

  width:
    58px;

  min-width:
    58px;

  max-width:
    58px;

  text-align:
    right;

  padding-right:
    3px;
}

.inferior {

  margin-top:
    auto;

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    flex-end;

  gap:
    6px;
}

.forma-pago {

  flex:
    1;

  display:
    flex;

  flex-direction:
    column;

  gap:
    4px;
}

.pago {

  display:
    grid;

  grid-template-columns:
    26mm 1fr;

  border:
    1px solid #111;

  height:
    7mm;
}

.pago span {

  display:
    flex;

  justify-content:
    center;

  align-items:
    center;

  border-right:
    1px solid #111;

  background:
    #f5f5f5;

  font-size:
    8px;

  font-weight:
    bold;
}

.linea {

  display:
    flex;

  align-items:
    center;

  padding:
    0 6px;

  font-size:
    8px;

  color:
    #666;
}

.total {

  width:
    38mm;

  flex-shrink:
    0;
}

.total div {

  height:
    16mm;

  border:
    2px solid #111;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    center;

  align-items:
    center;

  text-align:
    center;

  font-size:
    12px;

  font-weight:
    bold;

  line-height:
    1.1;
}

.footer {

  margin-top:
    2px;

  text-align:
    center;

  font-size:
    7px;

  color:
    #666;
}

@media print {

  @page {

    size:
      A4 landscape;

    margin:
      5mm;
  }

  html,
  body {

    width:
      297mm;

    height:
      210mm;

    margin:
      0;

    padding:
      0;

    overflow:
      hidden;

    background:
      #fff;
  }

  body {

    display:
      flex;

    justify-content:
      center;

    align-items:
      center;
  }

  .hoja {

    width:
      287mm;

    height:
      200mm;

    display:
      flex;

    justify-content:
      space-between;

    align-items:
      flex-start;

    gap:
      4mm;

    padding:
      0;
  }

  .remito {

    width:
      139mm;

    height:
      194mm;

    border:
      2px solid #111;

    padding:
      5px;

    display:
      flex;

    flex-direction:
      column;

    overflow:
      hidden;

    flex-shrink:
      0;

    page-break-inside:
      avoid;

    break-inside:
      avoid;
  }

  * {

    box-sizing:
      border-box;
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

    TRIUNVIRATO 2535 -
    QUILMES OESTE

  </div>


  <div class="info">

    <div>

      <strong>
        FECHA
      </strong>

      <br>

      ${fechaFormateada}

    </div>


    <div>

      <strong>
        HORA
      </strong>

      <br>

      ${horaFormateada}

    </div>


    <div>

      <strong>
        VENDEDOR
      </strong>

      <br>

      ${vendedor.nombre}

    </div>


    <div>

      <strong>
        CLIENTE
      </strong>

      <br>

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

        $${total.toLocaleString(
          "es-AR"
        )}

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


      ventana.document.write(
        remitoHTML
      );

      ventana.document.close();


      ventana.onload = () => {

        ventana.focus();

        ventana.print();


        ventana.onafterprint =
          () => {

            ventana.close();

          };

      };


    } catch (error) {

      console.error(
        "Error generando número de boleta:",
        error
      );

      alert(
        "❌ No se pudo obtener el número de boleta. No se imprimió nada."
      );

    }

  }


  // =========================================================
  // ENVIAR AL MOSTRADOR
  // =========================================================

  async function enviarAlMostrador() {

    try {

      const ahora =
        new Date();


      let numeroActual =
        numeroBoleta;


      if (numeroActual === null) {

        numeroActual =
          await obtenerSiguienteNumeroBoleta();

        guardarNumeroBoleta(
          numeroActual
        );

      }


      const pedido = {

        estado:
          "Pendiente",

        numeroBoleta:
          numeroActual,

        vendedor:
          vendedor.nombre,

        vendedorCodigo:
          vendedor.codigo,

        fecha:
          ahora.toLocaleDateString(
            "es-AR"
          ),

        hora:
          ahora.toLocaleTimeString(
            "es-AR",
            {
              hour:
                "2-digit",

              minute:
                "2-digit",
            }
          ),

        total,

        productos:
          carrito.map(
            (producto) => {

              const precio =
                obtenerPrecio(
                  producto
                );


              return {

                id:
                  producto.id,

                nombre:
                  producto.nombre,

                cantidad:
                  producto.cantidad,

                precio,

                subtotal:
                  precio *
                  producto.cantidad,

                categoria:
                  producto.categoria ||
                  "",

                imeis:
                  producto.categoria ===
                  "Celulares"
                    ? (
                        producto.imeis ||
                        []
                      ).filter(
                        (imei) =>
                          imei?.trim()
                      )
                    : [],

                imagen:
                  producto.imagenes?.[0] ||
                  producto.imagen ||
                  "",
              };

            }
          ),
      };


      await guardarBoletaAhora(
        numeroActual
      );


      const resultado =
        await crearPedido(
          pedido
        );


      await finalizarBoleta(
        numeroActual
      );


      console.log(
        "Pedido creado:",
        resultado.id
      );


      alert(
        `✅ Boleta N° ${numeroActual} guardada, enviada al mostrador y cerrada correctamente.`
      );


      setAbierto(
        false
      );


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
  // NORMALIZAR WHATSAPP ARGENTINO
  // =========================================================

  function normalizarWhatsAppArgentina(
    numero
  ) {

    let limpio =
      String(
        numero || ""
      ).replace(
        /\D/g,
        ""
      );


    if (!limpio)
      return "";


    if (
      limpio.startsWith(
        "549"
      ) &&
      limpio.length >= 12
    ) {

      return limpio;

    }


    if (
      limpio.startsWith(
        "54"
      ) &&
      limpio.length >= 11
    ) {

      const resto =
        limpio.slice(
          2
        );


      if (
        resto.startsWith(
          "9"
        )
      ) {

        return (
          "54" +
          resto
        );

      }


      return (
        "549" +
        resto
      );

    }


    if (
      limpio.length === 10 &&
      limpio.startsWith(
        "11"
      )
    ) {

      return (
        "549" +
        limpio
      );

    }


    return limpio;

  }


  // =========================================================
  // ABRIR MODAL DE CONSULTA
  // =========================================================

  function iniciarConsultaRevendedor() {

    if (
      !modoRevendedor
    ) {

      enviarWhatsApp();

      return;

    }


    if (
      !carrito.length
    ) {

      alert(
        "⚠️ El carrito está vacío."
      );

      return;

    }


    setClienteConsulta({
      nombre:
        "",

      whatsapp:
        "",
    });


    setModalConsultaAbierto(
      true
    );

  }


  // =========================================================
  // CREAR CONSULTA DEL REVENDEDOR
  // =========================================================

  async function enviarConsultaRevendedor() {

    if (
      !modoRevendedor
    ) {

      await enviarWhatsApp();

      return;

    }


    const nombreCliente =
      String(
        clienteConsulta.nombre ||
          ""
      ).trim();


    const whatsappCliente =
      String(
        clienteConsulta.whatsapp ||
          ""
      ).trim();


    if (
      !nombreCliente
    ) {

      alert(
        "⚠️ Ingresá el nombre del cliente."
      );

      return;

    }


    if (
      !whatsappCliente
    ) {

      alert(
        "⚠️ Ingresá el WhatsApp del cliente."
      );

      return;

    }


    const whatsappDestino =
      normalizarWhatsAppArgentina(
        revendedor?.whatsapp
      );


    if (
      !whatsappDestino
    ) {

      alert(
        `❌ El revendedor ${
          revendedor?.nombreCompleto ||
          "Revendedor"
        } no tiene un número de WhatsApp configurado.`
      );

      return;

    }


    if (
      !revendedor?.id
    ) {

      alert(
        "❌ No se pudo identificar al revendedor."
      );

      return;

    }


    try {

      setEnviandoConsulta(
        true
      );


      const nombreCompletoRevendedor =
        String(
          revendedor?.nombreCompleto ||
            `${revendedor?.nombre || ""} ${
              revendedor?.apellido || ""
            }`.trim() ||
            "Revendedor"
        ).trim();


      // =====================================================
      // SNAPSHOT DE PRODUCTOS
      // =====================================================
      //
      // Guardamos exactamente el precio que vio el cliente.
      //
      // Incluye:
      //
      // x2
      // x3
      // x6
      // x9
      // x12
      //
      // y el margen del revendedor.
      // =====================================================

      const productosConsulta =
        carrito.map(
          (producto) => {

            const precio =
              obtenerPrecio(
                producto
              );


            return {

              id:
                producto.id,

              nombre:
                producto.nombre,

              cantidad:
                producto.cantidad,

              precio,

              subtotal:
                precio *
                producto.cantidad,

              categoria:
                producto.categoria ||
                "",

              imagen:
                producto.imagenes?.[0] ||
                producto.imagen ||
                "",

              imeis:
                producto.categoria ===
                "Celulares"
                  ? (
                      producto.imeis ||
                      []
                    ).filter(
                      (imei) =>
                        imei?.trim()
                    )
                  : [],
            };

          }
        );


      // =====================================================
      // CREAR CLIENTE
      // =====================================================

      const cliente =
        await crearClienteRevendedor({

          revendedorId:
            revendedor.id,

          nombre:
            nombreCliente,

          whatsapp:
            whatsappCliente,
        });


      // =====================================================
      // CREAR CONSULTA
      // =====================================================
      //
      // ESTADO INICIAL:
      //
      // Pendiente
      //
      // Esto aparece inmediatamente en Mis Ventas.
      // =====================================================

      await crearVentaRevendedor({

        revendedorId:
          revendedor.id,

        clienteId:
          cliente.id,

        cliente: {

          nombre:
            cliente.nombre,

          apellido:
            cliente.apellido ||
            "",

          nombreCompleto:
            cliente.nombreCompleto,

          whatsapp:
            cliente.whatsapp,

          vendedorOficialCodigo:
            cliente.vendedorOficialCodigo ||
            "",

          vendedorOficialNombre:
            cliente.vendedorOficialNombre ||
            "",
        },

        productos:
          productosConsulta,

        estado:
          "Pendiente",
      });


      // =====================================================
      // CONTADOR
      // =====================================================
      //
      // Si falla el contador no anulamos la consulta.
      // =====================================================

      try {

        await incrementarConsultasRevendedor(
          revendedor.id
        );

      } catch (error) {

        console.warn(
          "No se pudo actualizar el contador de consultas:",
          error
        );

      }


      // =====================================================
      // MENSAJE WHATSAPP
      // =====================================================

      let mensaje =
        `Hola ${nombreCompletoRevendedor}! 👋` +
        `\n\nQuiero consultar por los siguientes productos:\n\n`;


      productosConsulta.forEach(
        (producto) => {

          mensaje +=
            `• ${producto.nombre}\n`;

          mensaje +=
            `Cantidad: ${producto.cantidad}\n`;

          mensaje +=
            `Precio Unitario: $${producto.precio.toLocaleString(
              "es-AR"
            )}\n`;

          mensaje +=
            `Subtotal: $${producto.subtotal.toLocaleString(
              "es-AR"
            )}\n\n`;

        }
      );


      mensaje +=
        `💰 Total: $${total.toLocaleString(
          "es-AR"
        )}\n\n`;


      mensaje +=
        `Cliente: ${nombreCliente}\n`;


      mensaje +=
        `WhatsApp: ${whatsappCliente}\n\n`;


      mensaje +=
        "¡Muchas gracias! 😊";


      const urlWhatsApp =
        `https://wa.me/${whatsappDestino}?text=${encodeURIComponent(
          mensaje
        )}`;


      // =====================================================
      // CERRAR CARRITO
      // =====================================================

      setModalConsultaAbierto(
        false
      );


      setClienteConsulta({
        nombre:
          "",

        whatsapp:
          "",
      });


      setAbierto(
        false
      );


      // =====================================================
      // ABRIR WHATSAPP
      // =====================================================

      window.location.href =
        urlWhatsApp;


    } catch (error) {

      console.error(
        "❌ Error creando consulta del revendedor:",
        error
      );


      alert(
        error?.message ||
          "❌ No se pudo registrar la consulta."
      );


    } finally {

      setEnviandoConsulta(
        false
      );

    }

  }


  // =========================================================
  // WHATSAPP DEL CATÁLOGO NORMAL
  // =========================================================

  async function enviarWhatsApp() {

    try {

      // =====================================================
      // SEGURIDAD
      // =====================================================
      //
      // Si por cualquier motivo se llama esta función
      // estando en un catálogo de revendedor,
      // NO se crea ningún pedido.
      // =====================================================

      if (
        modoRevendedor
      ) {

        iniciarConsultaRevendedor();

        return;

      }


      // =====================================================
      // PEDIDO NORMAL ELECTRO HOGAR
      // =====================================================

      const pedido = {

        estado:
          "Creada",

        vendedor:
          vendedor.nombre,

        vendedorCodigo:
          vendedor.codigo,

        total,

        productos:
          carrito.map(
            (producto) => {

              const precio =
                obtenerPrecio(
                  producto
                );


              return {

                id:
                  producto.id,

                nombre:
                  producto.nombre,

                cantidad:
                  producto.cantidad,

                precio,

                subtotal:
                  precio *
                  producto.cantidad,

                categoria:
                  producto.categoria ||
                  "",

                imeis:
                  producto.categoria ===
                  "Celulares"
                    ? (
                        producto.imeis ||
                        []
                      ).filter(
                        (imei) =>
                          imei?.trim()
                      )
                    : [],

                imagen:
                  producto.imagenes?.[0] ||
                  producto.imagen ||
                  "",
              };

            }
          ),
      };


      console.log(
        "📦 Pedido para WhatsApp:",
        pedido
      );


      const resultado =
        await crearPedido(
          pedido
        );


      const pedidoId =
        resultado.id;


      const linkOrden =
        `${window.location.origin}/pedido/${pedidoId}`;


      // =====================================================
      // SALUDOS
      // =====================================================

      const saludos = {

        LAUTARO:
          "Hola Lauti! 👋",

        MILAGROS:
          "Hola Mili! 👋",

        GONZALO:
          "Hola Gonza! 👋",

        CAMILA:
          "Hola Cami! 👋",

        VICTORIA:
          "Hola Vicky! 👋",

        AXEL:
          "Hola Axel! 👋",

        YAMILA:
          "Hola Yamila! 👋",
      };


      const saludo =
        saludos[
          String(
            vendedor.nombre ||
              ""
          ).toUpperCase()
        ] ||
        `Hola ${vendedor.nombre}! 👋`;


      let mensaje =
        `${saludo}` +
        `\n\nQuiero consultar por los siguientes productos:\n\n`;


      carrito.forEach(
        (producto) => {

          const precio =
            obtenerPrecio(
              producto
            );


          mensaje +=
            `• ${producto.nombre}\n`;

          mensaje +=
            `Cantidad: ${producto.cantidad}\n`;

          mensaje +=
            `Precio Unitario: $${precio.toLocaleString(
              "es-AR"
            )}\n`;

          mensaje +=
            `Subtotal: $${(
              precio *
              producto.cantidad
            ).toLocaleString(
              "es-AR"
            )}\n\n`;

        }
      );


      mensaje +=
        `💰 Total: $${total.toLocaleString(
          "es-AR"
        )}\n\n`;


      mensaje +=
        `📋 Orden de pedido:\n${linkOrden}\n\n`;


      mensaje +=
        "¡Muchas gracias! 😊";


      // =====================================================
      // WHATSAPP VENDEDORES INTERNOS
      // =====================================================

      const numerosWhatsApp = {

        lautaro:
          "5491131631518",

        milagros:
          "5491144207460",

        gonzalo:
          "5491136469206",

        camila:
          "5491139324748",

        victoria:
          "5491136552538",

        axel:
          "5491128953531",

        yamila:
          "5491157712104",
      };


      const codigoVendedor =
        String(
          vendedor.codigo ||
            ""
        )
          .trim()
          .toLowerCase();


      const numeroWhatsApp =
        numerosWhatsApp[
          codigoVendedor
        ];


      if (
        !numeroWhatsApp
      ) {

        throw new Error(
          `No existe número de WhatsApp configurado para el vendedor: ${codigoVendedor}`
        );

      }


      const urlWhatsApp =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
          mensaje
        )}`;


      window.location.href =
        urlWhatsApp;


    } catch (error) {

      console.error(
        "❌ Error creando la orden:",
        error
      );


      alert(
        error?.message ||
          "❌ No se pudo generar la orden. Verificá tu conexión e intentá nuevamente."
      );

    }

  }


  // =========================================================
  // ENTER PARA IMEI
  // =========================================================

  function manejarEnterIMEI(
    e,
    productoId,
    indice
  ) {

    if (
      e.key !==
      "Enter"
    ) {

      return;

    }


    e.preventDefault();


    const siguiente =
      document.querySelector(
        `[data-imei-index="${productoId}-${indice + 1}"]`
      );


    if (
      siguiente
    ) {

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
      onClick={() =>
        setAbierto(false)
      }
    >

      <div
        className="cart-panel"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ===================================================
            MODAL NUEVA CONSULTA
        ==================================================== */}

        {modalConsultaAbierto &&
          modoRevendedor && (

            <div
              style={{
                position:
                  "fixed",

                inset:
                  0,

                zIndex:
                  99999,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                padding:
                  "20px",

                background:
                  "rgba(8, 15, 12, 0.68)",

                backdropFilter:
                  "blur(5px)",
              }}

              onClick={() => {

                if (
                  !enviandoConsulta
                ) {

                  setModalConsultaAbierto(
                    false
                  );

                }

              }}
            >

              <div
                style={{
                  width:
                    "min(520px, 100%)",

                  background:
                    "#ffffff",

                  borderRadius:
                    "22px",

                  padding:
                    "26px",

                  boxShadow:
                    "0 25px 80px rgba(0,0,0,.25)",

                  border:
                    "1px solid rgba(22,163,74,.14)",
                }}

                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "14px",

                    marginBottom:
                      "20px",
                  }}
                >

                  <div
                    style={{
                      width:
                        "48px",

                      height:
                        "48px",

                      borderRadius:
                        "15px",

                      display:
                        "grid",

                      placeItems:
                        "center",

                      background:
                        "linear-gradient(135deg, #16a34a, #22c55e)",

                      color:
                        "#fff",

                      fontSize:
                        "22px",
                    }}
                  >
                    ✓
                  </div>


                  <div>

                    <div
                      style={{
                        color:
                          "#16a34a",

                        fontSize:
                          "11px",

                        fontWeight:
                          800,

                        letterSpacing:
                          ".12em",

                        textTransform:
                          "uppercase",
                      }}
                    >
                      Nueva consulta
                    </div>


                    <h3
                      style={{
                        margin:
                          "2px 0 0",

                        color:
                          "#162019",

                        fontSize:
                          "25px",

                        lineHeight:
                          1.1,
                      }}
                    >
                      Datos del cliente
                    </h3>

                  </div>

                </div>


                <p
                  style={{
                    margin:
                      "0 0 20px",

                    color:
                      "#66736b",

                    lineHeight:
                      1.5,
                  }}
                >

                  Completá estos datos
                  para registrar la
                  consulta en Mis Ventas
                  y después contactar a{" "}
                  {
                    revendedor?.nombreCompleto ||
                    "el revendedor"
                  }.

                </p>


                <label
                  style={{
                    display:
                      "block",

                    marginBottom:
                      "7px",

                    color:
                      "#26332b",

                    fontWeight:
                      700,
                  }}
                >
                  Nombre del cliente
                </label>


                <input
                  autoFocus

                  type="text"

                  value={
                    clienteConsulta.nombre
                  }

                  onChange={(e) =>
                    setClienteConsulta(
                      (prev) => ({
                        ...prev,

                        nombre:
                          e.target.value,
                      })
                    )
                  }

                  placeholder="Ej: Juan Pérez"

                  style={{
                    width:
                      "100%",

                    height:
                      "48px",

                    padding:
                      "0 14px",

                    border:
                      "1px solid #d9e1dc",

                    borderRadius:
                      "12px",

                    fontSize:
                      "16px",

                    outline:
                      "none",

                    boxSizing:
                      "border-box",

                    marginBottom:
                      "16px",
                  }}
                />


                <label
                  style={{
                    display:
                      "block",

                    marginBottom:
                      "7px",

                    color:
                      "#26332b",

                    fontWeight:
                      700,
                  }}
                >
                  WhatsApp del cliente
                </label>


                <input
                  type="tel"

                  value={
                    clienteConsulta.whatsapp
                  }

                  onChange={(e) =>
                    setClienteConsulta(
                      (prev) => ({
                        ...prev,

                        whatsapp:
                          e.target.value,
                      })
                    )
                  }

                  placeholder="Ej: 11 1234-5678"

                  style={{
                    width:
                      "100%",

                    height:
                      "48px",

                    padding:
                      "0 14px",

                    border:
                      "1px solid #d9e1dc",

                    borderRadius:
                      "12px",

                    fontSize:
                      "16px",

                    outline:
                      "none",

                    boxSizing:
                      "border-box",

                    marginBottom:
                      "18px",
                  }}
                />


                <div
                  style={{
                    padding:
                      "13px 14px",

                    borderRadius:
                      "12px",

                    background:
                      "#f0fdf4",

                    border:
                      "1px solid #dcfce7",

                    color:
                      "#166534",

                    fontSize:
                      "14px",

                    lineHeight:
                      1.45,

                    marginBottom:
                      "20px",
                  }}
                >

                  La consulta quedará
                  registrada en{" "}

                  <strong>
                    Mis Ventas
                  </strong>.

                  {" "}

                  No se enviará ninguna
                  orden al Mostrador.

                </div>


                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "10px",

                    justifyContent:
                      "flex-end",
                  }}
                >

                  <button
                    type="button"

                    disabled={
                      enviandoConsulta
                    }

                    onClick={() =>
                      setModalConsultaAbierto(
                        false
                      )
                    }

                    style={{
                      minHeight:
                        "46px",

                      padding:
                        "0 18px",

                      borderRadius:
                        "12px",

                      border:
                        "1px solid #d9e1dc",

                      background:
                        "#fff",

                      color:
                        "#425048",

                      fontWeight:
                        700,

                      cursor:
                        "pointer",
                    }}
                  >
                    Cancelar
                  </button>


                  <button
                    type="button"

                    disabled={
                      enviandoConsulta
                    }

                    onClick={
                      enviarConsultaRevendedor
                    }

                    style={{
                      minHeight:
                        "46px",

                      padding:
                        "0 20px",

                      borderRadius:
                        "12px",

                      border:
                        "none",

                      background:
                        "linear-gradient(135deg, #16a34a, #22c55e)",

                      color:
                        "#fff",

                      fontWeight:
                        800,

                      cursor:
                        enviandoConsulta
                          ? "wait"
                          : "pointer",

                      boxShadow:
                        "0 10px 25px rgba(22,163,74,.22)",
                    }}
                  >

                    {
                      enviandoConsulta
                        ? "Registrando..."
                        : "Registrar y enviar"
                    }

                  </button>

                </div>

              </div>

            </div>

          )}


        {/* ===================================================
            HEADER
        ==================================================== */}

        <div
          className="cart-header"
        >

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


        {/* ===================================================
            RECUPERAR BOLETA
        ==================================================== */}

        {modoLocal && (

          <div
            style={{
              marginBottom:
                "12px",

              padding:
                "10px 12px",

              border:
                "1px solid #ddd",

              borderRadius:
                "10px",

              background:
                "#f8f8f8",
            }}
          >

            <div
              style={{
                fontWeight:
                  "bold",

                fontSize:
                  "16px",

                marginBottom:
                  "7px",
              }}
            >
              🔎 Recuperar boleta
            </div>


            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "8px",

                width:
                  "100%",
              }}
            >

              <input
                type="number"

                inputMode="numeric"

                placeholder="71499"

                value={
                  numeroParaRecuperar
                }

                onChange={(e) =>
                  setNumeroParaRecuperar(
                    e.target.value
                  )
                }

                onKeyDown={(e) => {

                  if (
                    e.key ===
                    "Enter"
                  ) {

                    manejarRecuperarBoleta();

                  }

                }}

                style={{
                  width:
                    "110px",

                  height:
                    "42px",

                  padding:
                    "6px 10px",

                  border:
                    "1px solid #bbb",

                  borderRadius:
                    "7px",

                  fontSize:
                    "16px",

                  fontWeight:
                    "bold",

                  boxSizing:
                    "border-box",

                  outline:
                    "none",
                }}
              />


              <button
                type="button"

                className="print-btn"

                onClick={
                  manejarRecuperarBoleta
                }

                disabled={
                  recuperandoBoleta
                }

                style={{
                  height:
                    "42px",

                  padding:
                    "0 16px",

                  whiteSpace:
                    "nowrap",

                  fontSize:
                    "15px",

                  opacity:
                    recuperandoBoleta
                      ? 0.7
                      : 1,
                }}
              >

                {
                  recuperandoBoleta
                    ? "Buscando..."
                    : "🔎 Recuperar"
                }

              </button>

            </div>


            {numeroBoleta && (

              <div
                style={{
                  marginTop:
                    "7px",

                  fontSize:
                    "13px",

                  fontWeight:
                    "bold",
                }}
              >

                🧾 Boleta activa:
                N°{" "}

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


        {/* ===================================================
            CARRITO VACÍO
        ==================================================== */}

        {carrito.length === 0 ? (

          <p>
            Tu carrito está vacío.
          </p>

        ) : (

          <>

            {/* =================================================
                PRODUCTOS
            ================================================== */}

            {carrito.map(
              (producto) => {

                const precio =
                  obtenerPrecio(
                    producto
                  );


                let promo =
                  "";


                if (
                  producto.cantidad >=
                  12
                ) {

                  promo =
                    "🔥 Precio x12 aplicado";

                } else if (
                  producto.cantidad >=
                  9
                ) {

                  promo =
                    "🔥 Precio x9 aplicado";

                } else if (
                  producto.cantidad >=
                  6
                ) {

                  promo =
                    "🔥 Precio x6 aplicado";

                } else if (
                  producto.cantidad >=
                  3
                ) {

                  promo =
                    "🔥 Precio x3 aplicado";

                } else if (
                  producto.cantidad >=
                  2
                ) {

                  promo =
                    "🔥 Precio x2 aplicado";

                }


                const esCelular =
                  producto.categoria ===
                  "Celulares";


                return (

                  <div
                    key={
                      producto.id
                    }

                    className="cart-item"
                  >

                    <img
                      src={
                        producto.imagenes?.[0] ||
                        producto.imagen
                      }

                      alt={
                        producto.nombre
                      }
                    />


                    <div
                      className="cart-info"
                    >

                      <h4>
                        {
                          producto.nombre
                        }
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
                            color:
                              "#16a34a",

                            fontWeight:
                              "bold",

                            marginBottom:
                              "8px",
                          }}
                        >
                          {promo}
                        </p>

                      )}


                      <div
                        className="cart-controls"
                      >

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
                          {
                            producto.cantidad
                          }
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


                      {/* =========================================
                          IMEI
                      ========================================== */}

                      {esCelular &&
                        modoLocal && (

                          <div
                            style={{
                              marginTop:
                                "12px",

                              padding:
                                "10px",

                              border:
                                "1px solid #ddd",

                              borderRadius:
                                "8px",

                              background:
                                "#f8f8f8",
                            }}
                          >

                            <div
                              style={{
                                fontWeight:
                                  "bold",

                                marginBottom:
                                  "8px",

                                fontSize:
                                  "14px",
                              }}
                            >
                              📱 IMEI
                            </div>


                            {Array.from(
                              {
                                length:
                                  producto.cantidad,
                              }
                            ).map(
                              (
                                _,
                                indice
                              ) => (

                                <div
                                  key={`${producto.id}-imei-${indice}`}

                                  style={{
                                    marginBottom:
                                      indice <
                                      producto.cantidad -
                                        1
                                        ? "8px"
                                        : "0",
                                  }}
                                >

                                  <label
                                    style={{
                                      display:
                                        "block",

                                      fontSize:
                                        "12px",

                                      fontWeight:
                                        "bold",

                                      marginBottom:
                                        "4px",
                                    }}
                                  >
                                    IMEI{" "}
                                    {
                                      indice +
                                      1
                                    }
                                  </label>


                                  <input
                                    type="text"

                                    inputMode="numeric"

                                    autoComplete="off"

                                    placeholder="Escaneá el IMEI con la pistola"

                                    value={
                                      producto
                                        .imeis?.[
                                        indice
                                      ] ||
                                      ""
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
                                      width:
                                        "100%",

                                      padding:
                                        "9px",

                                      border:
                                        "1px solid #bbb",

                                      borderRadius:
                                        "6px",

                                      fontSize:
                                        "14px",

                                      boxSizing:
                                        "border-box",
                                    }}
                                  />

                                </div>

                              )
                            )}

                          </div>

                        )}


                      <p
                        style={{
                          fontWeight:
                            "bold",

                          marginTop:
                            "8px",
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

              }
            )}


            {/* =================================================
                VENDEDOR MODO LOCAL
            ================================================== */}

            {modoLocal && (

              <div
                style={{
                  marginBottom:
                    "15px",
                }}
              >

                <label
                  style={{
                    display:
                      "block",

                    fontWeight:
                      "bold",

                    marginBottom:
                      "6px",
                  }}
                >
                  👤 Vendedor
                </label>


                <select
                  value={
                    vendedor.codigo
                  }

                  onChange={(e) =>
                    setVendedor(
                      vendedores[
                        e.target.value
                      ]
                    )
                  }

                  style={{
                    width:
                      "100%",

                    padding:
                      "10px",

                    fontSize:
                      "15px",

                    borderRadius:
                      "8px",
                  }}
                >

                  {Object.values(
                    vendedores
                  ).map(
                    (v) => (

                      <option
                        key={
                          v.codigo
                        }

                        value={
                          v.codigo
                        }
                      >
                        {v.nombre}
                      </option>

                    )
                  )}

                </select>

              </div>

            )}


            {/* =================================================
                TOTAL
            ================================================== */}

            <h2
              className="cart-total"
            >

              Total: $

              {total.toLocaleString(
                "es-AR"
              )}

            </h2>


            {/* =================================================
                BOTONES
            ================================================== */}

            <div
              className="action-buttons"
            >

              {modoLocal && (

                <>

                  <button
                    className="print-btn"

                    onClick={
                      imprimirPresupuesto
                    }

                    style={{
                      padding:
                        "14px 18px",

                      fontSize:
                        "18px",
                    }}
                  >

                    🖨️{" "}

                    {
                      numeroBoleta
                        ? `Reimprimir N° ${numeroBoleta}`
                        : "Imprimir Remito"
                    }

                  </button>


                  <button
                    className="print-btn"

                    onClick={
                      enviarAlMostrador
                    }

                    style={{
                      padding:
                        "14px 18px",

                      fontSize:
                        "18px",
                    }}
                  >

                    📤 Enviar al Mostrador

                  </button>

                </>

              )}


              {!modoLocal && (

                <button
                  className="whatsapp-btn"

                  onClick={
                    iniciarConsultaRevendedor
                  }
                >

                  🟢{" "}

                  {
                    modoRevendedor
                      ? "Enviar consulta"
                      : `Enviar pedido a ${vendedor.nombre}`
                  }

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