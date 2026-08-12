import { imprimirRemito } from "../utils/imprimirRemito";
import { crearPedido } from "../services/pedidosService";
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
    obtenerPrecio,
    total,
  } = useCart();

  const {
    vendedor,
    setVendedor,
    vendedores,
  } = useVendedor();

  if (!abierto) return null;

  function imprimirPresupuesto() {

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
    width:145px;
    height:auto;
    display:block;
}

.titulo{
    border:2px solid #111;
    padding:5px 12px;
    font-size:15px;
    font-weight:bold;
    letter-spacing:.5px;
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

    min-height:24px;

    font-size:8px;

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
    padding:2px;
    font-size:8px;
    font-weight:bold;
    white-space:nowrap;
}

td{
    border:1px solid #ddd;
    padding:2px;
    font-size:7px;
    height:14px;
    vertical-align:middle;
}

.codigo{
    display:none;
}

/* CANTIDAD */
.cantidad{
    width:20px;
    min-width:20px;
    max-width:20px;
    text-align:center;
}

/* PRODUCTO */
.producto{
    width:auto;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    padding-left:4px;
}

/* PRECIO */
.precio{
    width:52px;
    min-width:52px;
    max-width:52px;
    text-align:right;
    padding-right:3px;
}

/* SUBTOTAL */
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
${[1, 2].map(() => `

<div class="remito">

    <div class="header">

        <div class="logo">
            <img src="${logoUrl}" alt="Electro Hogar">
        </div>

        <div class="titulo">
            REMITO X
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

    <div class="inferior">

        <div class="forma-pago">

            <div class="pago">
                <span>EFECTIVO</span>
                <div class="linea">
                    ____________________________________
                </div>
            </div>

            <div class="pago">
                <span>TRANSFERENCIA</span>
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

} // ← TERMINA imprimirPresupuesto()

async function enviarAlMostrador() {

  try {

    const ahora = new Date();

    const pedido = {

      vendedor: vendedor.nombre,

      vendedorCodigo: vendedor.codigo,

      fecha: ahora.toLocaleDateString("es-AR"),

      hora: ahora.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),

      total,

      productos: carrito.map((producto) => {

        const precio = obtenerPrecio(producto);

        return {

          id: producto.id,

          nombre: producto.nombre,

          cantidad: producto.cantidad,

          precio,

          subtotal: precio * producto.cantidad,

          imagen:
            producto.imagenes?.[0] ||
            producto.imagen ||
            "",

        };

      }),

    };

    console.log("Pedido a enviar:", pedido);

    const resultado = await crearPedido(pedido);

    console.log("Pedido creado:", resultado.id);

    alert("✅ Pedido enviado al mostrador.");

    setAbierto(false);

  } catch (error) {

    console.error(error);

    alert("❌ No se pudo enviar el pedido.");

  }

}
  async function enviarWhatsApp() {

    try {

      // =========================================
      // CREAR ORDEN EN FIREBASE
      // =========================================

      const pedido = {

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

            imagen:
              producto.imagenes?.[0] ||
              producto.imagen ||
              "",

          };

        }),

      };

      const resultado = await crearPedido(pedido);

      const pedidoId = resultado.id;

      // =========================================
      // LINK DE LA ORDEN
      // =========================================

      const linkOrden =
        `${window.location.origin}/pedido/${pedidoId}`;

      // =========================================
      // SALUDOS
      // =========================================

      const saludos = {

        LAUTARO: "Hola Lauti! 👋",

        MILAGROS: "Hola Mili! 👋",

        GONZALO: "Hola Gonza! 👋",

        CAMILA: "Hola Cami! 👋",

        VICTORIA: "Hola Vicky! 👋",

      };

      // =========================================
      // MENSAJE WHATSAPP
      // =========================================

      let mensaje =
        `${saludos[vendedor.nombre] || `Hola ${vendedor.nombre}! 👋`}` +
        `%0A%0AQuiero consultar por los siguientes productos:%0A%0A`;

      carrito.forEach((producto) => {

        const precio = obtenerPrecio(producto);

        mensaje += `• ${producto.nombre}%0A`;

        mensaje += `Cantidad: ${producto.cantidad}%0A`;

        mensaje += `Precio Unitario: $${precio.toLocaleString("es-AR")}%0A`;

        mensaje += `Subtotal: $${(
          precio * producto.cantidad
        ).toLocaleString("es-AR")}%0A%0A`;

      });

      mensaje +=
        `💰 Total: $${total.toLocaleString("es-AR")}%0A%0A`;

      mensaje +=
        `📋 Orden de pedido:%0A${linkOrden}%0A%0A`;

      mensaje +=
        "¡Muchas gracias! 😊";

      // =========================================
      // ABRIR WHATSAPP
      // =========================================

      window.open(
        `https://wa.me/${vendedor.numero}?text=${mensaje}`,
        "_blank"
      );

    } catch (error) {

      console.error("Error creando la orden:", error);

      alert(
        "❌ No se pudo generar la orden. Intentá nuevamente."
      );

    }

  }

  return (

    <div
      className="cart-overlay"
      onClick={() => setAbierto(false)}
    >

      <div
        className="cart-panel"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="cart-header">

          <h2>🛒 Mi carrito</h2>

          <button
            onClick={() => setAbierto(false)}
          >
            ✖
          </button>

        </div>

        {carrito.length === 0 ? (

          <p>
            Tu carrito está vacío.
          </p>

        ) : (

          <>

            {carrito.map((producto) => {

              const precio = obtenerPrecio(producto);

              let promo = "";

              if (producto.cantidad >= 12)
                promo = "🔥 Precio x12 aplicado";

              else if (producto.cantidad >= 9)
                promo = "🔥 Precio x9 aplicado";

              else if (producto.cantidad >= 6)
                promo = "🔥 Precio x6 aplicado";

              else if (producto.cantidad >= 3)
                promo = "🔥 Precio x3 aplicado";

              else if (producto.cantidad >= 2)
                promo = "🔥 Precio x2 aplicado";

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
                      ${precio.toLocaleString("es-AR")}
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
                          disminuirCantidad(producto.id)
                        }
                      >
                        −
                      </button>

                      <span>
                        {producto.cantidad}
                      </span>

                      <button
                        onClick={() =>
                          aumentarCantidad(producto.id)
                        }
                      >
                        +
                      </button>

                    </div>

                    <p
                      style={{
                        fontWeight: "bold",
                        marginTop: "8px",
                      }}
                    >
                      Subtotal: $
                      {(
                        precio * producto.cantidad
                      ).toLocaleString("es-AR")}
                    </p>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        eliminarProducto(producto.id)
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
    setVendedor(vendedores[e.target.value])
  }
  style={{
    width: "100%",
    padding: "10px",
    fontSize: "15px",
    borderRadius: "8px",
  }}
>
  {Object.values(vendedores).map((v) => (
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
  Total: ${total.toLocaleString("es-AR")}
</h2>

<div className="action-buttons">

  {modoLocal && (
    <>
      <button
        className="print-btn"
        onClick={imprimirPresupuesto}
      >
        🖨️ Imprimir Remito
      </button>

      <button
        className="print-btn"
        onClick={enviarAlMostrador}
      >
        📤 Enviar al Mostrador
      </button>
    </>
  )}

  <button
    className="whatsapp-btn"
    onClick={enviarWhatsApp}
  >
    🟢 Enviar pedido a {vendedor.nombre}
  </button>

</div>

</>
)}
</div>
</div>
);

}

export default Cart;