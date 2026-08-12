
import logo from "../assets/logo.png";

export function imprimirRemito({
  vendedor,
  carrito,
  total,
  obtenerPrecio,
}) {

  const ventana = window.open("", "_blank", "width=1400,height=900");

  const fecha = new Date();

const fechaFormateada = fecha.toLocaleDateString("es-AR");

const horaFormateada = fecha.toLocaleTimeString("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
});

const logoUrl = new URL(logo, window.location.href).href;


  let productosHTML = "";

  carrito.forEach((producto) => {

    const precio = obtenerPrecio(producto);

    productosHTML += `
      <tr>
          <td class="cantidad">${producto.cantidad}</td>
          <td class="producto">${producto.nombre}</td>
          <td class="precio">$${precio.toLocaleString("es-AR")}</td>
          <td class="subtotal">$${(
            precio * producto.cantidad
          ).toLocaleString("es-AR")}</td>
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
    font-family: Arial, Helvetica, sans-serif;
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
    align-items: center;
    justify-content: space-between;

    margin-bottom: 6px;

    position: relative;
}

.empresa {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    width: 48mm;
}

.logo img {
    width: 170px;
    height: auto;
    display: block;
}

.direccion {
    margin-top: 2px;

    font-size: 10px;
    font-weight: bold;

    text-align: left;
    white-space: nowrap;
}

.remito-x {
  font-size: 38px;
  font-weight: bold;
  line-height: 1;

  position: absolute;
  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);
}

.titulo {
  border: 2px solid #111;
  padding: 6px 12px;

  font-size: 16px;
  font-weight: bold;

  letter-spacing: 0.5px;
  text-align: center;

  min-width: 28mm;
}

.numero-boleta {
  display: inline-block;
  min-width: 20mm;
  height: 16px;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin: 5px 0 6px;
}

.info div {
  border: 1px solid #ccc;
  padding: 5px 6px;
  min-height: 24px;

  font-size: 9px;
  line-height: 1.2;
}

.info strong {
  display: inline;
  margin-bottom: 0;

  font-size: 11px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: 2px;
}

th {
  background: #111;
  color: #fff;
  padding: 3px;
  font-size: 9px;
  font-weight: bold;
  white-space: nowrap;
}

td {
  border: 1px solid #ddd;
  padding: 3px;
  font-size: 9px;
  height: 16px;
  vertical-align: middle;
  background: transparent;
}

/* CÓDIGO / CANTIDAD */
.codigo {
  display: none;
}

.cantidad {
  width: 7%;
  text-align: center;
}

/* PRODUCTO */
.producto {
  width: 61%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;
}

/* PRECIO */
.precio {
  width: 14%;
  text-align: right;
  padding-right: 4px;
  white-space: nowrap;
}

/* SUBTOTAL */
.subtotal {
  width: 18%;
  text-align: right;
  padding-right: 4px;
  white-space: nowrap;
}

/* ÁREA DE PRODUCTOS */
.productos-area {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* MARCA DE AGUA */
.marca-agua {
  position: absolute;
  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%) rotate(-45deg);

  width: 85%;

  z-index: 0;
  pointer-events: none;
}

.marca-agua img {
  width: 100%;
  height: auto;
  display: block;

  opacity: 0.08;
}

/* TABLA POR ENCIMA DE LA MARCA DE AGUA */
.productos-area table {
  position: relative;
  z-index: 1;
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

.linea {
    display: flex;
    align-items: center;

    padding: 0 6px;

    font-size: 8px;

    color: #666;
}

.total {
    width: 38mm;

    flex-shrink: 0;
}

.total div {
    height: 16mm;

    border: 2px solid #111;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;

    font-weight: bold;

    line-height: 1.1;
}

/* TEXTO "TOTAL" */
.total .titulo-total {
    font-size: 16px;
    font-weight: bold;
}

/* IMPORTE FINAL */
.total .importe-total {
    font-size: 24px;
    font-weight: bold;
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
${[1, 2].map(() => `

<div class="remito">

<div class="header">

    <div class="empresa">

        <div class="logo">
            <img src="${logoUrl}" alt="Electro Hogar">
        </div>

        <div class="direccion">
            TRIUNVIRATO 2535 - QUILMES OESTE
        </div>

    </div>

    <div class="remito-x">
        X
    </div>

    <div class="titulo">
        N° <span class="numero-boleta">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </div>

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
  <strong>VENDEDOR:</strong> <strong>${vendedor.nombre.toUpperCase()}</strong>
</div>

<div>
  <strong>CLIENTE:</strong><br>
  ...............................................
</div>

</div>

<div class="productos-area">

<div class="marca-agua">
  <img src="${logoUrl}" alt="">
</div>

  <table>

    <thead>
      <tr>
        <th class="cantidad">C.</th>
        <th class="producto">Producto</th>
        <th class="precio">$</th>
        <th class="subtotal">Total</th>
      </tr>
    </thead>

    <tbody>
      ${productosHTML}
    </tbody>

  </table>

</div>

<div class="inferior">

  <div class="forma-pago">

    <div class="pago">
      <span>EFECTIVO</span>

      <div class="linea">
      </div>
    </div>

    <div class="pago">
      <span>TRANSFERENCIA</span>

      <div class="linea">
      </div>
    </div>

  </div>

  <div class="total">

    <div>
      <span class="titulo-total">
        TOTAL
      </span>

      <span class="importe-total">
        $${total.toLocaleString("es-AR")}
      </span>
    </div>

  </div>

</div>

<div class="footer">
  Electro Hogar Quilmes
</div>

</div>

`).join("")}

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

}