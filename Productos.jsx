import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import ProductTable from "../components/ProductTable";

import {
  escucharProductos,
  eliminarProducto,
  cambiarVisibilidad,
  cambiarNuevoIngreso,
} from "../../services/productosService";

import { useAuth } from "../../context/AuthContext";


/* =====================================================
   COLORES DE ELECTROBARRACAS
===================================================== */

const NAVY = "#061B33";
const DORADO = "#D4A72C";


export default function Productos() {
  const navigate = useNavigate();

  const {
    usuario,
    perfil,
  } = useAuth();


  const [productos, setProductos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [categoria, setCategoria] =
    useState("Todas");

  const [estado, setEstado] =
    useState("todos");


  /* =====================================================
     DETECTAR ELECTROBARRACAS
  ===================================================== */

  const esCliente =
    Boolean(perfil?.negocioId && perfil.negocioId !== "electrohogar") &&
    perfil?.rol !== "admin";

  const negocioIdActual =
    perfil?.negocioId || "electrobarracas";


  /* =====================================================
     ESCUCHAR PRODUCTOS EN TIEMPO REAL
  ===================================================== */

  useEffect(() => {
    if (!perfil) {
      return;
    }

    const unsubscribe =
      escucharProductos(
        perfil,
        (data) => {
          setProductos(data);
        }
      );

    return () => {
      unsubscribe();
    };
  }, [perfil]);


  /* =====================================================
     ELIMINAR PRODUCTO
  ===================================================== */

  async function handleDelete(id) {
    const producto =
      productos.find(
        (item) => item.id === id
      );


    /*
      ElectroBarracas solamente puede eliminar
      sus propios productos.
    */

    if (
      esCliente &&
      !(
        producto?.tipoProducto === "propio" &&
        producto?.negocioId === negocioIdActual
      )
    ) {
      alert(
        "Este producto pertenece al catálogo maestro y no puede eliminarse desde acá."
      );

      return;
    }


    const confirmar =
      window.confirm(
        "¿Seguro que querés eliminar este producto?"
      );


    if (!confirmar) {
      return;
    }


    try {
      await eliminarProducto(id);

    } catch (error) {
      console.error(
        "Error eliminando producto:",
        error
      );

      alert(
        "No se pudo eliminar el producto."
      );
    }
  }


  /* =====================================================
     CAMBIAR VISIBILIDAD
  ===================================================== */

  async function handleToggleVisible(
    producto
  ) {

    /*
      ElectroBarracas NO puede modificar
      la visibilidad de productos maestros.
    */

    if (
      esCliente &&
      !(
        producto?.tipoProducto === "propio" &&
        producto?.negocioId === negocioIdActual
      )
    ) {
      alert(
        "La visibilidad de este producto la controla el catálogo maestro."
      );

      return;
    }


    try {
      await cambiarVisibilidad(
        producto.id,
        !producto.visible
      );

    } catch (error) {
      console.error(
        "Error cambiando visibilidad:",
        error
      );

      alert(
        "No se pudo cambiar la visibilidad del producto."
      );
    }
  }


  /* =====================================================
     DESCUBRÍ LO NUEVO
  ===================================================== */

  async function handleToggleNuevoIngreso(producto) {
    if (!perfil || perfil.rol !== "admin") {
      alert("Solo el administrador puede seleccionar productos para Descubrí lo nuevo.");
      return;
    }

    try {
      await cambiarNuevoIngreso(
        producto.id,
        producto.nuevoIngreso !== true
      );
    } catch (error) {
      console.error("Error cambiando Descubrí lo nuevo:", error);
      alert("No se pudo actualizar Descubrí lo nuevo.");
    }
  }


  /* =====================================================
     PRODUCTOS DISPONIBLES PARA ELECTROBARRACAS
  ===================================================== */

  const productosDisponibles =
    useMemo(() => {

      if (!esCliente) {
        return productos;
      }

      /*
        Para ElectroBarracas solamente mostramos
        productos visibles en tiempo real.
      */

      return productos.filter(
        (producto) =>
          producto.visible !== false
      );

    }, [
      productos,
      esCliente,
      negocioIdActual,
    ]);


  /* =====================================================
     CATEGORÍAS
  ===================================================== */

  const categorias =
    useMemo(() => {

      const lista = [
        ...new Set(
          productosDisponibles
            .map(
              (producto) =>
                producto.categoria
            )
            .filter(
              (categoria) =>
                categoria &&
                String(
                  categoria
                ).trim() !== ""
            )
        ),
      ];


      lista.sort(
        (a, b) =>
          String(a).localeCompare(
            String(b),
            "es"
          )
      );


      return [
        "Todas",
        ...lista,
      ];

    }, [
      productosDisponibles,
    ]);


  /* =====================================================
     PUBLICADOS
  ===================================================== */

  const publicados =
    useMemo(() => {

      return productos.filter(
        (producto) =>
          producto.visible !== false
      );

    }, [
      productos,
    ]);


  /* =====================================================
     OCULTOS
     SOLO PARA ADMIN
  ===================================================== */

  const ocultos =
    useMemo(() => {

      return productos.filter(
        (producto) =>
          producto.visible === false
      );

    }, [
      productos,
    ]);


  /* =====================================================
     PRODUCTOS FILTRADOS
  ===================================================== */

  const productosFiltrados =
    useMemo(() => {

      /*
        Para ElectroBarracas arrancamos SIEMPRE
        desde los productos disponibles.

        Así nunca puede acceder mediante
        filtros a un producto oculto.
      */

      let lista = esCliente
        ? [...productosDisponibles]
        : [...productos];


      /* -----------------------------------------------
         ESTADO
         Solo aplica para administradores.
      ----------------------------------------------- */

      if (!esCliente) {

        if (estado === "stock") {
          lista = [
            ...publicados,
          ];
        }


        if (estado === "reponer") {
          lista = [
            ...ocultos,
          ];
        }

      }


      /* -----------------------------------------------
         BÚSQUEDA
      ----------------------------------------------- */

      const texto =
        busqueda
          .trim()
          .toLowerCase();


      if (texto) {

        lista =
          lista.filter(
            (producto) => {

              const nombre =
                String(
                  producto.nombre || ""
                ).toLowerCase();


              const categoriaProducto =
                String(
                  producto.categoria || ""
                ).toLowerCase();


              const marca =
                String(
                  producto.marca || ""
                ).toLowerCase();


              const descripcion =
                String(
                  producto.descripcion || ""
                ).toLowerCase();


              return (
                nombre.includes(texto) ||
                categoriaProducto.includes(texto) ||
                marca.includes(texto) ||
                descripcion.includes(texto)
              );
            }
          );
      }


      /* -----------------------------------------------
         CATEGORÍA
      ----------------------------------------------- */

      if (
        categoria !== "Todas"
      ) {

        lista =
          lista.filter(
            (producto) =>
              producto.categoria ===
              categoria
          );
      }


      return lista;

    }, [
      productos,
      productosDisponibles,
      publicados,
      ocultos,
      esCliente,
      estado,
      busqueda,
      categoria,
    ]);


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Layout>

      {/* =================================================
          USUARIO ACTUAL
      ================================================= */}

      <div
        style={{
          marginBottom: "24px",

          padding: "18px 22px",

          borderRadius: "14px",

          background:
            "rgba(154, 242, 42, 0.10)",

          border:
            "1px solid rgba(154, 242, 42, 0.45)",

          color: NAVY,

          fontSize: "15px",

          boxShadow:
            "0 4px 15px rgba(11,59,110,.05)",
        }}
      >

        <strong>
          Usuario detectado:
        </strong>{" "}

        {usuario?.email ||
          "Sin email"}

        <br />

        <strong>
          Rol:
        </strong>{" "}

        {perfil?.rol ||
          "Sin rol"}

        <br />

        <strong>
          Negocio:
        </strong>{" "}

        {perfil?.negocioId ||
          "Sin negocio"}

      </div>


      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          gap: "20px",

          marginBottom: "25px",

          flexWrap: "wrap",
        }}
      >

        <div>

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "12px",
            }}
          >

            <div
              style={{
                width: "7px",
                height: "42px",

                borderRadius: "10px",

                background: DORADO,
              }}
            />

            <h1
              style={{
                margin: 0,

                fontSize: "32px",

                fontWeight: "900",

                color: "#111111",

                letterSpacing:
                  "-0.5px",
              }}
            >
              Productos
            </h1>

          </div>


          <p
            style={{
              margin:
                "8px 0 0 19px",

              color: "#667085",

              fontSize: "16px",

              fontWeight: "500",
            }}
          >
            {esCliente
              ? "Productos disponibles en tu catálogo."
              : "Administrá los productos del catálogo."
            }
          </p>

        </div>


        {/* -----------------------------------------------
           NUEVO PRODUCTO
        ----------------------------------------------- */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/productos/nuevo"
            )
          }
          style={{
            padding:
              "12px 20px",

            borderRadius:
              "10px",

            border:
              `2px solid ${NAVY}`,

            background:
              NAVY,

            color:
              "#ffffff",

            fontSize:
              "15px",

            fontWeight:
              "800",

            cursor:
              "pointer",

            boxShadow:
              "0 5px 15px rgba(11,59,110,.16)",

            transition:
              "all .2s ease",
          }}

          onMouseEnter={(e) => {

            e.currentTarget.style.background =
              DORADO;

            e.currentTarget.style.color =
              NAVY;

            e.currentTarget.style.borderColor =
              DORADO;

            e.currentTarget.style.transform =
              "translateY(-2px)";
          }}

          onMouseLeave={(e) => {

            e.currentTarget.style.background =
              NAVY;

            e.currentTarget.style.color =
              "#ffffff";

            e.currentTarget.style.borderColor =
              NAVY;

            e.currentTarget.style.transform =
              "translateY(0)";
          }}
        >
          ＋ Nuevo Producto
        </button>

      </div>


      {/* =================================================
          BÚSQUEDA Y CATEGORÍA
      ================================================= */}

      <div
        style={{
          display: "flex",

          gap: "14px",

          marginBottom: "20px",

          flexWrap: "wrap",
        }}
      >

        <input
          type="text"

          placeholder="🔍 Buscar producto, marca o categoría..."

          value={busqueda}

          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }

          style={{
            flex: 1,

            minWidth: "280px",

            width: "100%",

            padding:
              "14px 17px",

            borderRadius:
              "12px",

            border:
              "1px solid #d9dee7",

            background:
              "#ffffff",

            fontSize:
              "15px",

            outline:
              "none",

            boxSizing:
              "border-box",

            boxShadow:
              "0 3px 12px rgba(0,0,0,.04)",
          }}
        />


        <select
          value={categoria}

          onChange={(e) =>
            setCategoria(
              e.target.value
            )
          }

          style={{
            padding:
              "14px 16px",

            borderRadius:
              "12px",

            border:
              "1px solid #d9dee7",

            background:
              "#ffffff",

            minWidth:
              "220px",

            fontSize:
              "15px",

            color:
              "#111111",

            outline:
              "none",

            cursor:
              "pointer",
          }}
        >

          {categorias.map(
            (cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            )
          )}

        </select>

      </div>


      {/* =================================================
          RESUMEN PARA TU NEGOCIO
      ================================================= */}

      {esCliente ? (

        <div
          style={{
            marginBottom: "22px",

            padding:
              "20px 24px",

            borderRadius:
              "16px",

            background:
              "#ffffff",

            border:
              `1px solid ${DORADO}`,

            boxShadow:
              "0 7px 22px rgba(11,59,110,.07)",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: "20px",

            flexWrap:
              "wrap",
          }}
        >

          <div>

            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "10px",

                color:
                  NAVY,

                fontWeight:
                  "800",

                fontSize:
                  "16px",
              }}
            >
              <span
                style={{
                  width: "11px",
                  height: "11px",

                  borderRadius:
                    "50%",

                  background:
                    DORADO,

                  boxShadow:
                    `0 0 0 4px rgba(154,242,42,.18)`,
                }}
              />

              Productos disponibles
            </div>

            <div
              style={{
                marginTop:
                  "5px",

                color:
                  "#667085",

                fontSize:
                  "14px",
              }}
            >
              Se actualiza automáticamente con el catálogo maestro.
            </div>

          </div>


          <div
            style={{
              fontSize:
                "34px",

              lineHeight:
                "1",

              fontWeight:
                "900",

              color:
                NAVY,
            }}
          >
            {productosDisponibles.length}
          </div>

        </div>

      ) : (

        /* =================================================
           RESUMEN ADMIN ELECTROHOGAR
        ================================================= */

        <div
          style={{
            display: "flex",

            gap: "15px",

            marginBottom: "20px",

            flexWrap: "wrap",
          }}
        >

          {/* TODOS */}

          <div
            onClick={() =>
              setEstado("todos")
            }

            style={{
              flex: 1,

              minWidth:
                "180px",

              padding:
                "20px",

              borderRadius:
                "14px",

              cursor:
                "pointer",

              backgroundColor:
                estado === "todos"
                  ? NAVY
                  : "#fff",

              color:
                estado === "todos"
                  ? "#fff"
                  : "#111",

              border:
                estado === "todos"
                  ? `2px solid ${NAVY}`
                  : "1px solid #ddd",

              boxShadow:
                estado === "todos"
                  ? "0 8px 20px rgba(11,59,110,.22)"
                  : "0 2px 8px rgba(0,0,0,.08)",

              transition:
                "all .2s",
            }}
          >

            <div
              style={{
                fontSize:
                  "14px",
              }}
            >
              📦 Todos
            </div>

            <div
              style={{
                fontSize:
                  "34px",

                fontWeight:
                  "bold",

                marginTop:
                  "8px",
              }}
            >
              {productos.length}
            </div>

          </div>


          {/* PUBLICADOS */}

          <div
            onClick={() =>
              setEstado("stock")
            }

            style={{
              flex: 1,

              minWidth:
                "180px",

              padding:
                "20px",

              borderRadius:
                "14px",

              cursor:
                "pointer",

              backgroundColor:
                estado === "stock"
                  ? DORADO
                  : "#fff",

              color:
                NAVY,

              border:
                estado === "stock"
                  ? `2px solid ${DORADO}`
                  : "1px solid #ddd",

              boxShadow:
                estado === "stock"
                  ? "0 8px 20px rgba(154,242,42,.25)"
                  : "0 2px 8px rgba(0,0,0,.08)",

              transition:
                "all .2s",
            }}
          >

            <div
              style={{
                fontSize:
                  "14px",

                fontWeight:
                  "700",
              }}
            >
              🟢 Publicados
            </div>

            <div
              style={{
                fontSize:
                  "34px",

                fontWeight:
                  "bold",

                marginTop:
                  "8px",
              }}
            >
              {publicados.length}
            </div>

          </div>


          {/* OCULTOS */}

          <div
            onClick={() =>
              setEstado("reponer")
            }

            style={{
              flex: 1,

              minWidth:
                "180px",

              padding:
                "20px",

              borderRadius:
                "14px",

              cursor:
                "pointer",

              backgroundColor:
                estado === "reponer"
                  ? "#111827"
                  : "#fff",

              color:
                estado === "reponer"
                  ? "#fff"
                  : "#111",

              border:
                estado === "reponer"
                  ? "2px solid #111827"
                  : "1px solid #ddd",

              boxShadow:
                estado === "reponer"
                  ? "0 8px 20px rgba(0,0,0,.18)"
                  : "0 2px 8px rgba(0,0,0,.08)",

              transition:
                "all .2s",
            }}
          >

            <div
              style={{
                fontSize:
                  "14px",
              }}
            >
              🚫 Ocultos
            </div>

            <div
              style={{
                fontSize:
                  "34px",

                fontWeight:
                  "bold",

                marginTop:
                  "8px",
              }}
            >
              {ocultos.length}
            </div>

          </div>

        </div>
      )}


      {/* =================================================
          TABLA
      ================================================= */}

      <ProductTable
        productos={
          productosFiltrados
        }

        onDelete={
          handleDelete
        }

        onToggleVisible={
          handleToggleVisible
        }

        onToggleNuevoIngreso={
          handleToggleNuevoIngreso
        }

        perfil={
          perfil
        }
      />

    </Layout>
  );
}