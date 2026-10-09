import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  db,
  revendedorAuth,
  revendedorDb,
} from "../firebase";

import {
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from "firebase/auth";

/*
|--------------------------------------------------------------------------
| COLECCIONES
|--------------------------------------------------------------------------
*/

const vendedoresRef = collection(db, "revendedores");
const vendedoresPublicosRef = collection(
  db,
  "revendedoresPublicos"
);
const clientesRef = collection(db, "clientesRevendedores");
const ventasRef = collection(db, "ventasRevendedores");
const pedidosRef = collection(db, "pedidosRevendedores");

/*
|--------------------------------------------------------------------------
| UTILIDADES
|--------------------------------------------------------------------------
*/

function ahoraISO() {
  return new Date().toISOString();
}

function limpiarTexto(valor = "") {
  return valor?.toString().trim() || "";
}

function convertirNumero(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
}
async function guardarRevendedorPublico(revendedor) {
  if (!revendedor?.id) return;

  const referencia = doc(
    db,
    "revendedoresPublicos",
    revendedor.id
  );

  await setDoc(referencia, {
    revendedorId: revendedor.id,
    slug: limpiarTexto(revendedor.slug).toLowerCase(),
    activo: revendedor.activo !== false,
    nombre: limpiarTexto(revendedor.nombre),
    apellido: limpiarTexto(revendedor.apellido),
    nombreCompleto: limpiarTexto(
      revendedor.nombreCompleto ||
        `${revendedor.nombre || ""} ${revendedor.apellido || ""}`.trim()
    ),
    whatsapp: limpiarTexto(revendedor.whatsapp),
    porcentaje: convertirNumero(revendedor.porcentaje),
    actualizadoEn: ahoraISO(),
  });
}

async function sincronizarRevendedoresPublicos(lista = []) {
  if (!Array.isArray(lista) || lista.length === 0) return;

  await Promise.all(
    lista.map((revendedor) =>
      guardarRevendedorPublico(revendedor)
    )
  );
}

export async function sincronizarTodosLosRevendedoresPublicos() {
  const snapshot = await getDocs(vendedoresRef);

  const lista = snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));

  await sincronizarRevendedoresPublicos(lista);

  return lista.length;
}

function validarPorcentaje(valor) {
  const porcentaje = Number(valor);

  if (
    !Number.isFinite(porcentaje) ||
    porcentaje <= 0 ||
    porcentaje > 100
  ) {
    throw new Error(
      "El porcentaje debe estar entre 0 y 100."
    );
  }

  return porcentaje;
}

/*
|--------------------------------------------------------------------------
| PRECIOS / COMISIÓN
|--------------------------------------------------------------------------
*/

/*
 * La comisión representa la parte del precio final que corresponde
 * al margen del revendedor.
 *
 * Ejemplo:
 * precio final = 110.000
 * margen = 10%
 * precio maestro equivalente = 100.000
 * comisión = 10.000
 *
 * No usamos "total * porcentaje", porque eso daría 11.000.
 */
function calcularComisionDesdePrecioFinal(precioFinal, porcentaje) {
  const final = convertirNumero(precioFinal);
  const margen = convertirNumero(porcentaje);

  if (final <= 0 || margen <= 0) return 0;

  const precioMaestroEquivalente =
    final / (1 + margen / 100);

  return Math.max(
    0,
    final - precioMaestroEquivalente
  );
}

function normalizarProductosParaVenta(productos, porcentaje) {
  if (!Array.isArray(productos)) return [];

  return productos.map((producto) => {
    const cantidad = Math.max(
      1,
      convertirNumero(producto?.cantidad)
    );

    const precioFinal =
      convertirNumero(
        producto?.precioFinal
      ) ||
      convertirNumero(
        producto?.precioVenta
      ) ||
      convertirNumero(
        producto?.precio
      );

    return {
      ...producto,
      cantidad,
      precioFinal,
      precioVenta: precioFinal,
      porcentajeSnapshot:
        convertirNumero(porcentaje),
    };
  });
}

/*
|--------------------------------------------------------------------------
| SLUG
|--------------------------------------------------------------------------
*/

export function crearSlug(texto = "") {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function slugExiste(slug) {
  const q = query(
    vendedoresRef,
    where("slug", "==", slug)
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;
}

export async function generarSlugUnico(
  nombre,
  apellido
) {
  const base = crearSlug(
    `${nombre}-${apellido}`
  );

  if (!base) {
    throw new Error(
      "No se pudo generar un link válido para el revendedor."
    );
  }

  if (!(await slugExiste(base))) {
    return base;
  }

  let contador = 2;
  let slug = `${base}-${contador}`;

  while (await slugExiste(slug)) {
    contador++;
    slug = `${base}-${contador}`;
  }

  return slug;
}

/*
|--------------------------------------------------------------------------
| REVENDEDORES
|--------------------------------------------------------------------------
*/

export function escucharRevendedores(callback) {
  return onSnapshot(
    vendedoresRef,
    (snapshot) => {
      const lista = snapshot.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data(),
        })
      );

      lista.sort((a, b) => {
        const nombreA =
          `${a.nombre || ""} ${
            a.apellido || ""
          }`.toLowerCase();

        const nombreB =
          `${b.nombre || ""} ${
            b.apellido || ""
          }`.toLowerCase();

        return nombreA.localeCompare(nombreB);
      });

      callback(lista);

sincronizarRevendedoresPublicos(lista).catch((error) => {
  console.error(
    "Error sincronizando revendedores públicos:",
    error
  );
});
    },
    (error) => {
      console.error(
        "Error escuchando revendedores:",
        error
      );
    }
  );
}

export async function incrementarConsultasRevendedor(
  revendedorId
) {
  if (!revendedorId) {
    throw new Error(
      "Falta el ID del revendedor."
    );
  }

  const referencia = doc(
    db,
    "revendedores",
    revendedorId
  );

  const snapshot =
    await getDoc(referencia);

  if (!snapshot.exists()) {
    throw new Error(
      "No se encontró el revendedor."
    );
  }

  const datos = snapshot.data();

  const consultasActuales =
    convertirNumero(datos.consultas);

  await updateDoc(
    referencia,
    {
      consultas:
        consultasActuales + 1,

      actualizadoEn:
        ahoraISO(),
    }
  );
}

export async function crearRevendedor({
  nombre,
  apellido,
  whatsapp,
  porcentaje,
  authUid = "",
  email = "",
  vendedorOficialCodigo = "",
  vendedorOficialNombre = "",
}) {
  const nombreLimpio = limpiarTexto(nombre);
  const apellidoLimpio = limpiarTexto(apellido);
  const whatsappLimpio = limpiarTexto(whatsapp);

  if (!nombreLimpio) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!apellidoLimpio) {
    throw new Error("El apellido es obligatorio.");
  }

  if (!whatsappLimpio) {
    throw new Error("El WhatsApp es obligatorio.");
  }

  const porcentajeNumero = validarPorcentaje(porcentaje);

  const slug = await generarSlugUnico(
    nombreLimpio,
    apellidoLimpio
  );

  const ahora = ahoraISO();

  const nuevoRevendedor = {
    nombre: nombreLimpio,
    apellido: apellidoLimpio,

    nombreCompleto:
      `${nombreLimpio} ${apellidoLimpio}`.trim(),

    whatsapp: whatsappLimpio,

    porcentaje: porcentajeNumero,

    vendedorOficialCodigo:
      limpiarTexto(vendedorOficialCodigo),

    vendedorOficialNombre:
      limpiarTexto(vendedorOficialNombre),

    email:
      limpiarTexto(email).toLowerCase(),

    authUid:
      limpiarTexto(authUid),

    slug,

    activo: true,

    creadoEn: ahora,
    actualizadoEn: ahora,

    consultas: 0,
    ventasConcretadas: 0,
    comisionGenerada: 0,
    comisionPagada: 0,
  };

  const referencia = await addDoc(
    vendedoresRef,
    nuevoRevendedor
  );

  await guardarRevendedorPublico({
    id: referencia.id,
    ...nuevoRevendedor,
  });

  return {
    id: referencia.id,
    ...nuevoRevendedor,
  };
}


export async function crearCuentaRevendedor({
  email,
  password,
}) {
  const emailLimpio =
    limpiarTexto(email).toLowerCase();

  const passwordLimpia =
    password?.toString() || "";

  if (!emailLimpio) {
    throw new Error(
      "El email es obligatorio."
    );
  }

  if (
    !passwordLimpia ||
    passwordLimpia.length < 6
  ) {
    throw new Error(
      "La contraseña debe tener al menos 6 caracteres."
    );
  }

  try {
    const credencial =
      await createUserWithEmailAndPassword(
        revendedorAuth,
        emailLimpio,
        passwordLimpia
      );

    const authUid =
      credencial.user.uid;

    await signOut(revendedorAuth);

    return {
      authUid,
      email: emailLimpio,
    };

  } catch (error) {

    try {
      await signOut(revendedorAuth);
    } catch (_) {
      // Ignorar error al cerrar sesión
    }

    if (
      error?.code ===
      "auth/email-already-in-use"
    ) {
      throw new Error(
        "Ese email ya está registrado."
      );
    }

    if (
      error?.code ===
      "auth/invalid-email"
    ) {
      throw new Error(
        "El email no es válido."
      );
    }

    if (
      error?.code ===
      "auth/weak-password"
    ) {
      throw new Error(
        "La contraseña es demasiado débil."
      );
    }

    throw new Error(
      error?.message ||
      "No se pudo crear la cuenta del revendedor."
    );
  }
}


export async function cambiarEstadoRevendedor(
  id,
  activo
) {
  try {
    if (!id) {
      throw new Error(
        "ID de revendedor requerido"
      );
    }

    const referencia = doc(
      db,
      "revendedores",
      id
    );

    await updateDoc(referencia, {
      activo: Boolean(activo),
      actualizadoEn: ahoraISO(),
    });

    // Sincronizar también la versión pública
    const snapshot =
      await getDoc(referencia);

    if (snapshot.exists()) {
      await guardarRevendedorPublico({
        id: snapshot.id,
        ...snapshot.data(),
      });
    }

    return {
      ok: true,
      mensaje:
        "Estado del revendedor actualizado correctamente",
    };

  } catch (error) {
    console.error(
      "Error al cambiar estado del revendedor:",
      error
    );

    return {
      ok: false,
      error: error.message,
      mensaje:
        "No se pudo actualizar el estado del revendedor",
    };
  }
}

export async function eliminarRevendedorCompleto(id) {
  if (!id) {
    throw new Error("Falta el ID del revendedor.");
  }

  const referencia = doc(db, "revendedores", id);
  const snapshot = await getDoc(referencia);

  if (!snapshot.exists()) {
    throw new Error("No se encontró el revendedor.");
  }

  // Obtener todos los documentos vinculados.
  const [clientes, ventas, pedidos] = await Promise.all([
    getDocs(
      query(clientesRef, where("revendedorId", "==", id))
    ),
    getDocs(
      query(ventasRef, where("revendedorId", "==", id))
    ),
    getDocs(
      query(pedidosRef, where("revendedorId", "==", id))
    ),
  ]);

  // Eliminar documentos asociados.
  const documentos = [
    ...clientes.docs,
    ...ventas.docs,
    ...pedidos.docs,
  ];

  for (const documento of documentos) {
    await deleteDoc(documento.ref);
  }

  // Eliminar el acceso público y la ficha principal.
  await deleteDoc(
    doc(db, "revendedoresPublicos", id)
  );

  await deleteDoc(referencia);

  return {
    ok: true,
    mensaje: "Revendedor eliminado correctamente.",
  };
}

export async function editarRevendedor(
  id,
  {
    nombre,
    apellido,
    whatsapp,
    porcentaje,
    email,
    vendedorOficialCodigo = "",
    vendedorOficialNombre = "",
  }
) {
  if (!id) {
    throw new Error(
      "Falta el ID del revendedor."
    );
  }

  const nombreLimpio =
    limpiarTexto(nombre);

  const apellidoLimpio =
    limpiarTexto(apellido);

  const whatsappLimpio =
    limpiarTexto(whatsapp);

  if (
    !nombreLimpio ||
    !apellidoLimpio ||
    !whatsappLimpio
  ) {
    throw new Error(
      "Nombre, apellido y WhatsApp son obligatorios."
    );
  }

  const porcentajeNumero =
    validarPorcentaje(porcentaje);

  const referencia =
    doc(db, "revendedores", id);

  await updateDoc(
    referencia,
    {
      nombre: nombreLimpio,
      apellido: apellidoLimpio,

      nombreCompleto:
        `${nombreLimpio} ${apellidoLimpio}`.trim(),

      whatsapp: whatsappLimpio,
      porcentaje: porcentajeNumero,

      vendedorOficialCodigo:
        limpiarTexto(vendedorOficialCodigo),

      vendedorOficialNombre:
        limpiarTexto(vendedorOficialNombre),

      actualizadoEn: ahoraISO(),
    }
  );

  // Sincronizar los datos actualizados
  // con la colección pública
  const snapshot =
    await getDoc(referencia);

  if (snapshot.exists()) {
    await guardarRevendedorPublico({
      id: snapshot.id,
      ...snapshot.data(),
    });
  }
}

export async function obtenerRevendedorPorId(
  id
) {
  if (!id) {
    return null;
  }

  const snapshot =
    await getDoc(
      doc(db, "revendedores", id)
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}
/*
|--------------------------------------------------------------------------
| OBTENER REVENDEDOR POR AUTH UID
|--------------------------------------------------------------------------
*/

export async function obtenerRevendedorPorAuthUid(authUid) {
  if (!authUid) {
    return null;
  }

  try {
    const revendedoresAuthRef = collection(
      revendedorDb,
      "revendedores"
    );

    const q = query(
      revendedoresAuthRef,
      where("authUid", "==", authUid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const documento = snapshot.docs[0];

    return {
      id: documento.id,
      ...documento.data(),
    };
  } catch (error) {
    console.error(
      "Error obteniendo revendedor por Auth UID:",
      error
    );

    throw error;
  }
}
/*
|--------------------------------------------------------------------------
| ACCESO PÚBLICO PARA LINKS DE REVENDEDORES
|--------------------------------------------------------------------------
|
| Permite que una persona abra el link del revendedor
| desde cualquier celular sin tener que iniciar sesión.
|
| Ejemplo:
|
| https://ar-lovat.vercel.app/?revendedor=gonzalo-alfonsin
|
| El visitante recibe una sesión ANÓNIMA.
|
| IMPORTANTE:
| Esta sesión NO es la cuenta de Gonzalo.
| Es solamente una sesión temporal para permitir
| la lectura pública del catálogo.
|
*/

async function asegurarAccesoPublicoRevendedor() {
  try {
    // Si ya existe una sesión anónima, la reutilizamos.
    if (revendedorAuth.currentUser) {
      return revendedorAuth.currentUser;
    }

    // Creamos una sesión anónima para el visitante.
    const credencial =
      await signInAnonymously(revendedorAuth);

    return credencial.user;

  } catch (error) {
    console.error(
      "Error creando acceso público del revendedor:",
      error
    );

    throw error;
  }
}
/*
|--------------------------------------------------------------------------
| OBTENER REVENDEDOR POR SLUG
|--------------------------------------------------------------------------
*/

export async function obtenerRevendedorPorSlug(slug) {
  if (!slug) {
    return null;
  }

  const slugLimpio = slug
    .toString()
    .trim()
    .toLowerCase();

  try {
    await asegurarAccesoPublicoRevendedor();

    const q = query(
      vendedoresPublicosRef,
      where("slug", "==", slugLimpio)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const documento = snapshot.docs[0];
    const datos = documento.data();

    if (datos.activo === false) {
      return null;
    }

    return {
      id: datos.revendedorId || documento.id,
      ...datos,
    };
  } catch (error) {
    console.error(
      "Error obteniendo revendedor público por slug:",
      error
    );

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| CLIENTES
|--------------------------------------------------------------------------
*/

export async function crearClienteRevendedor({
  revendedorId,
  nombre,
  apellido = "",
  whatsapp,
  vendedorOficialCodigo = "",
  vendedorOficialNombre = "",
}) {
  if (!revendedorId) {
    throw new Error("Falta el revendedor.");
  }

  const nombreLimpio = limpiarTexto(nombre);
  const apellidoLimpio = limpiarTexto(apellido);
  const whatsappLimpio = limpiarTexto(whatsapp);

  if (!nombreLimpio) {
    throw new Error(
      "El nombre del cliente es obligatorio."
    );
  }

  if (!whatsappLimpio) {
    throw new Error(
      "El WhatsApp del cliente es obligatorio."
    );
  }

  const ahora = ahoraISO();

  /*
   * IMPORTANTE:
   * Esta función puede ejecutarse desde el link público.
   *
   * NO consultamos:
   *   revendedores/{revendedorId}
   *
   * porque ese documento es privado.
   *
   * Los datos del vendedor oficial ya vienen
   * desde el acceso público.
   */

  const cliente = {
    revendedorId,

    nombre: nombreLimpio,

    apellido: apellidoLimpio,

    nombreCompleto:
      `${nombreLimpio} ${apellidoLimpio}`.trim(),

    whatsapp: whatsappLimpio,

    vendedorOficialCodigo:
      limpiarTexto(
        vendedorOficialCodigo
      ),

    vendedorOficialNombre:
      limpiarTexto(
        vendedorOficialNombre
      ),

    activo: true,

    creadoEn: ahora,

    actualizadoEn: ahora,
  };

  const referencia = await addDoc(
    clientesRef,
    cliente
  );

  return {
    id: referencia.id,
    ...cliente,
  };
}

export async function obtenerClientesRevendedor(
  revendedorId
) {
  if (!revendedorId) {
    return [];
  }

  const q = query(
    clientesRef,
    where(
      "revendedorId",
      "==",
      revendedorId
    )
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );
}

export function escucharClientesRevendedor(
  revendedorId,
  callback
) {
  if (!revendedorId) {
    callback([]);
    return () => {};
  }

  const q = query(
    clientesRef,
    where(
      "revendedorId",
      "==",
      revendedorId
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const lista =
        snapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

      lista.sort(
        (a, b) =>
          (
            a.nombreCompleto || ""
          ).localeCompare(
            b.nombreCompleto || ""
          )
      );

      callback(lista);
    },
    (error) => {
      console.error(
        "Error escuchando clientes del revendedor:",
        error
      );
    }
  );
}

export async function obtenerClienteRevendedorPorId(
  clienteId
) {
  if (!clienteId) {
    return null;
  }

  const snapshot =
    await getDoc(
      doc(
        db,
        "clientesRevendedores",
        clienteId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function asignarVendedorOficialCliente(
  clienteId,
  {
    vendedorOficialCodigo = "",
    vendedorOficialNombre = "",
  }
) {
  if (!clienteId) {
    throw new Error(
      "Falta el ID del cliente."
    );
  }

  await updateDoc(
    doc(
      db,
      "clientesRevendedores",
      clienteId
    ),
    {
      vendedorOficialCodigo:
        limpiarTexto(
          vendedorOficialCodigo
        ),

      vendedorOficialNombre:
        limpiarTexto(
          vendedorOficialNombre
        ),

      actualizadoEn: ahoraISO(),
    }
  );
}

/*
|--------------------------------------------------------------------------
| VENTAS DE REVENDEDORES
|--------------------------------------------------------------------------
*/

export async function crearVentaRevendedor({
  revendedorId,
  clienteId,
  cliente = {},
  productos = [],
  estado = "Pendiente",
}) {
  if (!revendedorId) {
    throw new Error(
      "Falta el revendedor."
    );
  }

  if (!clienteId) {
    throw new Error(
      "Falta el cliente."
    );
  }

  const ahora = ahoraISO();

  /*
   * NO consultar revendedores/{revendedorId}
   * porque el cliente público puede estar
   * autenticado anónimamente.
   *
   * El porcentaje y los datos del vendedor
   * deben venir preparados desde el flujo público.
   */

  const porcentajeSnapshot =
    convertirNumero(
      cliente?.porcentajeSnapshot ??
      cliente?.porcentaje ??
      0
    );

  const productosNormalizados =
    normalizarProductosParaVenta(
      productos,
      porcentajeSnapshot
    );

  const vendedorCodigoVenta =
    limpiarTexto(
      cliente.vendedorOficialCodigo
    );

  const vendedorNombreVenta =
    limpiarTexto(
      cliente.vendedorOficialNombre
    );

  const venta = {
    revendedorId,

    clienteId,

    cliente: {
      nombre:
        limpiarTexto(
          cliente.nombre
        ),

      apellido:
        limpiarTexto(
          cliente.apellido
        ),

      nombreCompleto:
        limpiarTexto(
          cliente.nombreCompleto
        ),

      whatsapp:
        limpiarTexto(
          cliente.whatsapp
        ),

      vendedorOficialCodigo:
        vendedorCodigoVenta,

      vendedorOficialNombre:
        vendedorNombreVenta,
    },

    productos:
      productosNormalizados,

    porcentajeSnapshot,

    estado,

    resultadoComercial:
      "pendiente",

    confirmadaPorRevendedorEn:
      null,

    validadaPorElectroHogarEn:
      null,

    enviadaAElectroHogarEn:
      null,

    pedidoConsolidadoId:
      null,

    comisionGenerada:
      0,

    comisionFinalizada:
      false,

    procesadoEn:
      null,

    creadoEn:
      ahora,

    actualizadoEn:
      ahora,
  };

  const referencia =
    await addDoc(
      ventasRef,
      venta
    );

  return {
    id: referencia.id,
    ...venta,
  };
}

export async function obtenerVentaRevendedorPorId(
  ventaId
) {
  if (!ventaId) {
    return null;
  }

  const snapshot =
    await getDoc(
      doc(
        db,
        "ventasRevendedores",
        ventaId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export function escucharVentasRevendedor(
  revendedorId,
  callback
) {
  if (!revendedorId) {
    callback([]);
    return () => {};
  }

  const q = query(
    ventasRef,
    where(
      "revendedorId",
      "==",
      revendedorId
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const lista =
        snapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

      lista.sort(
        (a, b) =>
          new Date(
            b.actualizadoEn || 0
          ) -
          new Date(
            a.actualizadoEn || 0
          )
      );

      callback(lista);
    },
    (error) => {
      console.error(
        "Error escuchando ventas del revendedor:",
        error
      );
    }
  );
}

export async function eliminarVentaRevendedor(
  ventaId
) {
  if (!ventaId) {
    throw new Error(
      "Falta el ID de la venta."
    );
  }

  const venta =
    await obtenerVentaRevendedorPorId(
      ventaId
    );

  if (!venta) {
    throw new Error(
      "No se encontró la venta."
    );
  }

  if (
    venta.estado === "Enviada a Electro Hogar" ||
    venta.estado === "Procesado"
  ) {
    throw new Error(
      "Esta venta ya fue enviada y no puede eliminarse desde Mis Ventas."
    );
  }

  await deleteDoc(
    doc(
      db,
      "ventasRevendedores",
      ventaId
    )
  );
}

/*
|--------------------------------------------------------------------------
| EDITAR PRODUCTOS DE UNA VENTA
|--------------------------------------------------------------------------
*/

export async function actualizarProductosVentaRevendedor(
  ventaId,
  productos
) {
  if (!ventaId) {
    throw new Error(
      "Falta el ID de la venta."
    );
  }

  if (!Array.isArray(productos)) {
    throw new Error(
      "Los productos deben ser una lista."
    );
  }

  const venta =
    await obtenerVentaRevendedorPorId(
      ventaId
    );

  if (!venta) {
    throw new Error(
      "No se encontró la venta."
    );
  }

  if (
    venta.estado ===
      "Enviada a Electro Hogar" ||
    venta.estado === "Procesado"
  ) {
    throw new Error(
      "Esta venta ya no puede modificarse desde Mis ventas."
    );
  }

  const porcentajeSnapshot =
    convertirNumero(
      venta.porcentajeSnapshot
    ) ||
    convertirNumero(
      (await obtenerRevendedorPorId(venta.revendedorId))?.porcentaje
    );

  const productosNormalizados =
    normalizarProductosParaVenta(
      productos,
      porcentajeSnapshot
    );

  await updateDoc(
    doc(
      db,
      "ventasRevendedores",
      ventaId
    ),
    {
      productos: productosNormalizados,
      porcentajeSnapshot,
      actualizadoEn: ahoraISO(),
    }
  );
}

/*
|--------------------------------------------------------------------------
| CONFIRMAR VENTA
|--------------------------------------------------------------------------
|
| IMPORTANTE:
| Esto NO genera comisión.
|--------------------------------------------------------------------------
*/

export async function confirmarVentaRevendedor(
  ventaId
) {
  if (!ventaId) {
    throw new Error(
      "Falta el ID de la venta."
    );
  }

  const venta =
    await obtenerVentaRevendedorPorId(
      ventaId
    );

  if (!venta) {
    throw new Error(
      "No se encontró la venta."
    );
  }

  if (
    venta.resultadoComercial ===
      "concretada" ||
    venta.resultadoComercial ===
      "caida"
  ) {
    throw new Error(
      "Esta venta ya fue validada por Electro Hogar."
    );
  }

  await updateDoc(
    doc(
      db,
      "ventasRevendedores",
      ventaId
    ),
    {
      estado:
        "Confirmada por revendedor",

      resultadoComercial:
        "pendiente",

      confirmadaPorRevendedorEn:
        venta.confirmadaPorRevendedorEn ||
        ahoraISO(),

      actualizadoEn:
        ahoraISO(),
    }
  );
}
/*
|--------------------------------------------------------------------------
| RESOLVER VENTA DESDE ELECTRO HOGAR
|--------------------------------------------------------------------------
|
| Esta es la validación definitiva.
| "concretada" o "caida" es lo que ve finalmente el revendedor.
|--------------------------------------------------------------------------
*/

export async function resolverVentaRevendedor(
  ventaId,
  resultado
) {
  if (!ventaId) {
    throw new Error(
      "Falta el ID de la venta."
    );
  }

  if (
    resultado !== "concretada" &&
    resultado !== "caida"
  ) {
    throw new Error(
      "El resultado debe ser concretada o caida."
    );
  }

  const venta =
    await obtenerVentaRevendedorPorId(
      ventaId
    );

  if (!venta) {
    throw new Error(
      "No se encontró la venta."
    );
  }

  if (venta.estado === "Procesado") {
    throw new Error(
      "Esta venta ya fue procesada y su comisión ya quedó cerrada."
    );
  }

  const ahora = ahoraISO();
  const esConcretada =
    resultado === "concretada";

  await updateDoc(
    doc(
      db,
      "ventasRevendedores",
      ventaId
    ),
    {
      estado: esConcretada
        ? "Venta concretada"
        : "No cerré venta",

      resultadoComercial: esConcretada
        ? "concretada"
        : "caida",

      validadaPorElectroHogarEn: ahora,

      actualizadoEn: ahora,
    }
  );

  if (venta.pedidoConsolidadoId) {
    const pedido =
      await obtenerPedidoRevendedorPorId(
        venta.pedidoConsolidadoId
      );

    if (pedido) {
      const clientesActuales =
        Array.isArray(pedido.clientes)
          ? pedido.clientes
          : [];

      const clientesActualizados =
        esConcretada
          ? clientesActuales.map(
              (cliente) =>
                cliente?.ventaId === ventaId
                  ? {
                      ...cliente,
                      resultadoComercial:
                        "concretada",
                    }
                  : cliente
            )
          : clientesActuales.filter(
              (cliente) =>
                cliente?.ventaId !== ventaId
            );

      await updateDoc(
        doc(
          db,
          "pedidosRevendedores",
          venta.pedidoConsolidadoId
        ),
        {
          clientes:
            clientesActualizados,

          estado:
            !esConcretada &&
            clientesActualizados.length === 0
              ? "Cancelado"
              : pedido.estado,

          actualizadoEn: ahora,
        }
      );
    }
  }

  return {
    ...venta,

    estado: esConcretada
      ? "Venta concretada"
      : "No cerré venta",

    resultadoComercial:
      esConcretada
        ? "concretada"
        : "caida",

    validadaPorElectroHogarEn:
      ahora,
  };
}

/*
|--------------------------------------------------------------------------
| PEDIDO CONSOLIDADO
|--------------------------------------------------------------------------
*/

export async function crearPedidoConsolidadoRevendedor({
  revendedorId,
  revendedor = {},
  ventas = [],
}) {
  if (!revendedorId) {
    throw new Error(
      "Falta el revendedor."
    );
  }

  if (
    !Array.isArray(ventas) ||
    ventas.length === 0
  ) {
    throw new Error(
      "No hay ventas para enviar."
    );
  }

  const ahora = ahoraISO();

  const revendedorReal =
    await obtenerRevendedorPorId(
      revendedorId
    );

  if (!revendedorReal) {
    throw new Error(
      "No se encontró el revendedor."
    );
  }

  /*
   * Nunca confiamos en el objeto "ventas" recibido
   * desde el navegador para crear el pedido.
   *
   * Volvemos a leer cada venta desde Firestore y
   * verificamos que realmente pertenezca al revendedor
   * y que Electro Hogar ya la haya validado como concretada.
   */
  const ventasReales =
    await Promise.all(
      ventas.map(
        async (venta) =>
          obtenerVentaRevendedorPorId(
            venta?.id
          )
      )
    );

  if (
    ventasReales.some(
      (venta) => !venta
    )
  ) {
    throw new Error(
      "Una o más ventas seleccionadas ya no existen."
    );
  }

  const ventaInvalida =
    ventasReales.find(
      (venta) =>
        venta.revendedorId !==
          revendedorId ||
        ![
          "Confirmada por revendedor",
          "Venta concretada",
        ].includes(
          venta.estado
        ) ||
        venta.resultadoComercial ===
          "caida" ||
        venta.pedidoConsolidadoId
    );

  if (ventaInvalida) {
    throw new Error(
      "Solo se pueden enviar ventas confirmadas y todavía no enviadas."
    );
  }

  const clientes = await Promise.all(
    ventasReales.map(
      async (venta) => {
        const clienteReal =
          await obtenerClienteRevendedorPorId(
            venta.clienteId
          );

        if (!clienteReal) {
          throw new Error(
            "No se encontró uno de los clientes del pedido."
          );
        }

        const vendedorCodigo =
          limpiarTexto(
            clienteReal.vendedorOficialCodigo ||
            revendedorReal.vendedorOficialCodigo
          );

        const vendedorNombre =
          limpiarTexto(
            clienteReal.vendedorOficialNombre ||
            revendedorReal.vendedorOficialNombre
          );

        return {
          ventaId: venta.id,

          clienteId:
            venta.clienteId || null,

          cliente: {
            ...(venta.cliente || {}),

            vendedorOficialCodigo:
              vendedorCodigo,

            vendedorOficialNombre:
              vendedorNombre,
          },

          productos:
            normalizarProductosParaVenta(
              venta.productos,
              convertirNumero(
                venta.porcentajeSnapshot
              ) ||
                convertirNumero(
                  revendedorReal.porcentaje
                )
            ),

          porcentajeSnapshot:
            convertirNumero(
              venta.porcentajeSnapshot
            ) ||
              convertirNumero(
                revendedorReal.porcentaje
              ),

          vendedorOficialCodigo:
            vendedorCodigo,

          vendedorOficialNombre:
            vendedorNombre,

          resultadoComercial:
            venta.resultadoComercial ===
              "concretada" ||
            venta.estado ===
              "Venta concretada"
              ? "concretada"
              : "pendiente",
        };
      }
    )
  );

  const pedido = {
    revendedorId,

    revendedor: {
      nombre:
        limpiarTexto(
          revendedorReal.nombre
        ),

      apellido:
        limpiarTexto(
          revendedorReal.apellido
        ),

      nombreCompleto:
        limpiarTexto(
          revendedorReal.nombreCompleto
        ),

      whatsapp:
        limpiarTexto(
          revendedorReal.whatsapp
        ),
    },

    clientes,

    porcentajeSnapshot:
      convertirNumero(
        revendedorReal.porcentaje
      ),

    estado: "Pendiente",

    enviadoEn: ahora,

    procesadoEn: null,

    comisionFinalizada: false,

    comisionGenerada: 0,

    comisionSnapshot: null,

    creadoEn: ahora,

    actualizadoEn: ahora,
  };

  const referencia =
    await addDoc(
      pedidosRef,
      pedido
    );

  await Promise.all(
    ventas.map(
      (venta) =>
        updateDoc(
          doc(
            db,
            "ventasRevendedores",
            venta.id
          ),
          {
            estado:
              "Enviada a Electro Hogar",

            resultadoComercial:
              "pendiente",

            pedidoConsolidadoId:
              referencia.id,

            enviadaAElectroHogarEn:
              ahora,

            actualizadoEn: ahora,
          }
        )
    )
  );

  return {
    id: referencia.id,
    ...pedido,
  };
}

export async function obtenerPedidoRevendedorPorId(
  pedidoId
) {
  if (!pedidoId) {
    return null;
  }

  const snapshot =
    await getDoc(
      doc(
        db,
        "pedidosRevendedores",
        pedidoId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export function escucharPedidosRevendedores(
  callback
) {
  return onSnapshot(
    pedidosRef,
    (snapshot) => {
      const lista =
        snapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

      lista.sort(
        (a, b) =>
          new Date(
            b.creadoEn || 0
          ) -
          new Date(
            a.creadoEn || 0
          )
      );

      callback(lista);
    },
    (error) => {
      console.error(
        "Error escuchando pedidos de revendedores:",
        error
      );
    }
  );
}

export async function actualizarPedidoRevendedor(
  pedidoId,
  cambios
) {
  if (!pedidoId) {
    throw new Error(
      "Falta el ID del pedido."
    );
  }

  const pedido =
    await obtenerPedidoRevendedorPorId(
      pedidoId
    );

  if (!pedido) {
    throw new Error(
      "No se encontró el pedido."
    );
  }

  if (pedido.comisionFinalizada) {
    throw new Error(
      "Este pedido ya fue procesado y no puede modificarse."
    );
  }

  await updateDoc(
    doc(
      db,
      "pedidosRevendedores",
      pedidoId
    ),
    {
      ...cambios,

      actualizadoEn:
        ahoraISO(),
    }
  );
}

/*
|--------------------------------------------------------------------------
| ACTUALIZAR ASIGNACIÓN DE VENDEDOR OFICIAL
|--------------------------------------------------------------------------
*/

export async function actualizarAsignacionPedidoCliente(
  pedidoId,
  clienteIndex,
  {
    vendedorOficialCodigo = "",
    vendedorOficialNombre = "",
  }
) {
  if (!pedidoId) {
    throw new Error(
      "Falta el ID del pedido."
    );
  }

  const pedido =
    await obtenerPedidoRevendedorPorId(
      pedidoId
    );

  if (!pedido) {
    throw new Error(
      "No se encontró el pedido."
    );
  }

  if (pedido.comisionFinalizada) {
    throw new Error(
      "Este pedido ya fue procesado y no puede modificarse."
    );
  }

  const clientes =
    Array.isArray(pedido.clientes)
      ? [...pedido.clientes]
      : [];

  if (
    clienteIndex < 0 ||
    clienteIndex >= clientes.length
  ) {
    throw new Error(
      "No se encontró el cliente dentro del pedido."
    );
  }

  const clienteActual =
    clientes[clienteIndex] || {};

  clientes[clienteIndex] = {
    ...clienteActual,

    vendedorOficialCodigo:
      limpiarTexto(
        vendedorOficialCodigo
      ),

    vendedorOficialNombre:
      limpiarTexto(
        vendedorOficialNombre
      ),

    cliente: {
      ...(clienteActual.cliente || {}),

      vendedorOficialCodigo:
        limpiarTexto(
          vendedorOficialCodigo
        ),

      vendedorOficialNombre:
        limpiarTexto(
          vendedorOficialNombre
        ),
    },
  };

  await updateDoc(
    doc(
      db,
      "pedidosRevendedores",
      pedidoId
    ),
    {
      clientes,

      actualizadoEn:
        ahoraISO(),
    }
  );

  return {
    ...pedido,
    clientes,
    actualizadoEn:
      ahoraISO(),
  };
}

/*
|--------------------------------------------------------------------------
| FINALIZAR PEDIDO / CERRAR COMISIÓN
|--------------------------------------------------------------------------
*/

export async function finalizarPedidoRevendedor(
  pedidoId
) {
  if (!pedidoId) {
    throw new Error(
      "Falta el ID del pedido."
    );
  }

  const pedido =
    await obtenerPedidoRevendedorPorId(
      pedidoId
    );

  if (!pedido) {
    throw new Error(
      "No se encontró el pedido."
    );
  }

  if (pedido.comisionFinalizada) {
    throw new Error(
      "La comisión de este pedido ya fue finalizada."
    );
  }

  if (pedido.estado !== "En preparación") {
    throw new Error(
      "El pedido debe estar En preparación antes de cerrar la comisión."
    );
  }

  const clientes =
    Array.isArray(pedido.clientes)
      ? pedido.clientes
      : [];

  const clientesConcretados =
    clientes.filter(
      (cliente) =>
        cliente?.resultadoComercial ===
        "concretada"
    );

  if (
    clientesConcretados.length === 0
  ) {
    throw new Error(
      "No hay ventas concretadas para procesar."
    );
  }

  const revendedor =
    await obtenerRevendedorPorId(
      pedido.revendedorId
    );

  if (!revendedor) {
    throw new Error(
      "No se encontró el revendedor."
    );
  }

const porcentaje =
  convertirNumero(
    pedido.porcentajeSnapshot
  ) ||
  convertirNumero(
    revendedor.porcentaje
  );

  let totalVenta = 0;
  let totalBase = 0;
  let comision = 0;

  clientesConcretados.forEach(
    (cliente) => {
      const productos =
        Array.isArray(
          cliente.productos
        )
          ? cliente.productos
          : [];

      productos.forEach(
        (producto) => {
          const cantidad =
            Math.max(
              1,
              convertirNumero(
                producto.cantidad
              )
            );

          const precioFinal =
            convertirNumero(
              producto.precioFinal
            ) ||
            convertirNumero(
              producto.precioVenta
            ) ||
            convertirNumero(
              producto.precio
            );

          const porcentajeProducto =
            convertirNumero(
              producto.porcentajeSnapshot
            ) || porcentaje;

          const comisionProducto =
            calcularComisionDesdePrecioFinal(
              precioFinal,
              porcentajeProducto
            );

          const baseEquivalente =
            Math.max(
              0,
              precioFinal - comisionProducto
            );

          totalVenta +=
            precioFinal * cantidad;

          totalBase +=
            baseEquivalente * cantidad;

          comision +=
            comisionProducto * cantidad;
        }
      );
    }
  );

  const ahora =
    ahoraISO();

  const comisionSnapshot = {
    porcentaje,

    totalVenta,

    totalBase,

    comision,

    creadoEn: ahora,

    clientes: clientesConcretados.map(
      (cliente) => ({
        ventaId:
          cliente.ventaId || null,

        clienteId:
          cliente.clienteId || null,

        cliente:
          cliente.cliente || {},

        productos:
          cliente.productos || [],

        vendedorOficialCodigo:
          cliente.vendedorOficialCodigo ||
          "",

        vendedorOficialNombre:
          cliente.vendedorOficialNombre ||
          "",
      })
    ),
  };

  await updateDoc(
    doc(
      db,
      "pedidosRevendedores",
      pedidoId
    ),
    {
      estado:
        "Procesado",

      procesadoEn:
        ahora,

      comisionFinalizada:
        true,

      comisionGenerada:
        comision,

      comisionSnapshot,

      productosFinales:
        clientesConcretados,

      actualizadoEn:
        ahora,
    }
  );

  await updateDoc(
    doc(
      db,
      "revendedores",
      pedido.revendedorId
    ),
    {
      ventasConcretadas:
        convertirNumero(
          revendedor.ventasConcretadas
        ) +
        clientesConcretados.length,

      comisionGenerada:
        convertirNumero(
          revendedor.comisionGenerada
        ) +
        comision,

      actualizadoEn:
        ahora,
    }
  );

  await Promise.all(
    clientesConcretados
      .filter(
        (cliente) =>
          cliente.ventaId
      )
      .map(
        (cliente) => {
          const comisionVenta =
            (Array.isArray(cliente.productos)
              ? cliente.productos
              : []
            ).reduce(
              (total, producto) => {
                const cantidad =
                  Math.max(
                    1,
                    convertirNumero(
                      producto?.cantidad
                    )
                  );

                const precioFinal =
                  convertirNumero(
                    producto?.precioFinal
                  ) ||
                  convertirNumero(
                    producto?.precioVenta
                  ) ||
                  convertirNumero(
                    producto?.precio
                  );

                const porcentajeProducto =
                  convertirNumero(
                    producto?.porcentajeSnapshot
                  ) || porcentaje;

                return (
                  total +
                  calcularComisionDesdePrecioFinal(
                    precioFinal,
                    porcentajeProducto
                  ) *
                    cantidad
                );
              },
              0
            );

          return updateDoc(
            doc(
              db,
              "ventasRevendedores",
              cliente.ventaId
            ),
            {
              estado:
                "Procesado",

              resultadoComercial:
                "concretada",

              comisionGenerada:
                comisionVenta,

              comisionFinalizada:
                true,

              procesadoEn:
                ahora,

              actualizadoEn:
                ahora,
            }
          );
        }
      )
  );

  return {
    ...pedido,

    estado:
      "Procesado",

    procesadoEn:
      ahora,

    comisionFinalizada:
      true,

    comisionGenerada:
      comision,

    comisionSnapshot,
  };
}