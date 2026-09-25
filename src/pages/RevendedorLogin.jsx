import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { revendedorAuth } from "../firebase";

import {
  obtenerRevendedorPorSlug,
  obtenerRevendedorPorAuthUid,
} from "../services/vendedoresService";

export default function RevendedorLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const slug = searchParams.get("slug") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [revendedor, setRevendedor] = useState(null);

  const [cargando, setCargando] = useState(false);
  const [verificandoSesion, setVerificandoSesion] =
    useState(true);

  const [error, setError] = useState("");

  /*
   * ------------------------------------------------------------------------
   * CARGAR REVENDEDOR POR SLUG
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    let cancelado = false;

    async function cargarRevendedor() {
      try {
        if (!slug) {
          setError(
            "No se encontró el enlace del revendedor."
          );

          setVerificandoSesion(false);
          return;
        }

        /*
         * El catálogo público solamente devuelve los datos
         * públicos del revendedor.
         *
         * NO intentamos leer authUid desde la colección pública.
         * La cuenta privada se verifica después de autenticar
         * al usuario con Firebase Auth.
         */
        const resultado =
          await obtenerRevendedorPorSlug(slug);

        if (cancelado) {
          return;
        }

        if (!resultado) {
          setError(
            "No encontramos este revendedor."
          );

          setVerificandoSesion(false);
          return;
        }

        if (resultado.activo === false) {
          setError(
            "Esta cuenta de revendedor se encuentra inactiva."
          );

          setVerificandoSesion(false);
          return;
        }

        setRevendedor(resultado);
      } catch (err) {
        console.error(
          "Error cargando revendedor:",
          err
        );

        if (!cancelado) {
          setError(
            "No se pudo verificar el acceso del revendedor."
          );
        }
      } finally {
        if (!cancelado) {
          setVerificandoSesion(false);
        }
      }
    }

    cargarRevendedor();

    return () => {
      cancelado = true;
    };
  }, [slug]);

  /*
   * ------------------------------------------------------------------------
   * VERIFICAR SESIÓN EXISTENTE
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    if (
      verificandoSesion ||
      !revendedor
    ) {
      return;
    }

    const unsubscribe =
      onAuthStateChanged(
        revendedorAuth,
        async (usuario) => {
          if (!usuario) {
            return;
          }

          try {
            /*
             * La sesión ya está autenticada.
             * Ahora sí podemos consultar la colección privada
             * mediante el UID de Firebase y comprobar que
             * pertenece al revendedor del slug.
             */
            const revendedorPrivado =
              await obtenerRevendedorPorAuthUid(
                usuario.uid
              );

            if (!revendedorPrivado) {
              await signOut(
                revendedorAuth
              );

              setError(
                "Esta cuenta no está asociada a un revendedor autorizado."
              );

              return;
            }

            if (
              revendedorPrivado.id !==
              revendedor.id
            ) {
              await signOut(
                revendedorAuth
              );

              setError(
                "Esta sesión no corresponde a este revendedor."
              );

              return;
            }

            if (
              revendedorPrivado.activo === false
            ) {
              await signOut(
                revendedorAuth
              );

              setError(
                "Esta cuenta se encuentra inactiva."
              );

              return;
            }

            navigate(
              `/v/${revendedor.slug}/mis-ventas`,
              {
                replace: true,
              }
            );
          } catch (err) {
            console.error(
              "Error verificando sesión:",
              err
            );

            try {
              await signOut(
                revendedorAuth
              );
            } catch (_) {}
          }
        }
      );

    return unsubscribe;
  }, [
    verificandoSesion,
    revendedor,
    navigate,
  ]);

  /*
   * ------------------------------------------------------------------------
   * LOGIN
   * ------------------------------------------------------------------------
   */

  async function iniciarSesion(e) {
    e.preventDefault();

    setError("");

    if (!revendedor) {
      setError(
        "No se pudo identificar el revendedor."
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Ingresá tu email."
      );

      return;
    }

    if (!password) {
      setError(
        "Ingresá tu contraseña."
      );

      return;
    }

    setCargando(true);

    try {
      const credencial =
        await signInWithEmailAndPassword(
          revendedorAuth,
          email.trim(),
          password
        );

      const usuario =
        credencial.user;

      /*
       * La autenticación fue correcta.
       *
       * Ahora consultamos la colección privada usando
       * el UID recién autenticado y verificamos que esa
       * cuenta pertenezca exactamente al revendedor del slug.
       */
      const revendedorPrivado =
        await obtenerRevendedorPorAuthUid(
          usuario.uid
        );

      if (!revendedorPrivado) {
        await signOut(
          revendedorAuth
        );

        throw new Error(
          "Esta cuenta no está asociada a un revendedor autorizado."
        );
      }

      if (
        revendedorPrivado.id !==
        revendedor.id
      ) {
        await signOut(
          revendedorAuth
        );

        throw new Error(
          "Esta cuenta no corresponde a este revendedor."
        );
      }

      if (
        revendedorPrivado.activo ===
        false
      ) {
        await signOut(
          revendedorAuth
        );

        throw new Error(
          "Esta cuenta de revendedor se encuentra inactiva."
        );
      }

      /*
       * Refrescamos los datos públicos del slug antes
       * de entrar, por si el estado cambió mientras
       * estaba abierta la pantalla.
       */
      const revendedorActual =
        await obtenerRevendedorPorSlug(
          revendedor.slug
        );

      if (!revendedorActual) {
        await signOut(
          revendedorAuth
        );

        throw new Error(
          "No se encontró el revendedor."
        );
      }

      if (
        revendedorActual.activo ===
        false
      ) {
        await signOut(
          revendedorAuth
        );

        throw new Error(
          "Esta cuenta de revendedor se encuentra inactiva."
        );
      }

      if (
        revendedorActual.id !==
        revendedorPrivado.id
      ) {
        await signOut(
          revendedorAuth
        );

        throw new Error(
          "La cuenta no corresponde al revendedor."
        );
      }

      /*
       * ACCESO CORRECTO
       */

      navigate(
        `/v/${revendedorActual.slug}/mis-ventas`,
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Error iniciando sesión del revendedor:",
        err
      );

      let mensaje =
        "No se pudo iniciar sesión.";

      if (
        err?.code ===
        "auth/invalid-credential"
      ) {
        mensaje =
          "El email o la contraseña son incorrectos.";
      } else if (
        err?.code ===
        "auth/invalid-email"
      ) {
        mensaje =
          "El email ingresado no es válido.";
      } else if (
        err?.code ===
        "auth/user-not-found"
      ) {
        mensaje =
          "No existe una cuenta con ese email.";
      } else if (
        err?.code ===
        "auth/wrong-password"
      ) {
        mensaje =
          "La contraseña es incorrecta.";
      } else if (
        err?.code ===
        "auth/too-many-requests"
      ) {
        mensaje =
          "Demasiados intentos. Probá nuevamente más tarde.";
      } else if (
        err?.message
      ) {
        mensaje =
          err.message;
      }

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  /*
   * ------------------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------------------
   */

  if (verificandoSesion) {
    return (
      <div className="revendedor-login-page">
        <div className="revendedor-login-loading-card">
          <div className="revendedor-login-loading-icon">
            <span />
          </div>

          <div className="revendedor-login-loading-text">
            Verificando acceso...
          </div>
        </div>

        <style>{`
          .revendedor-login-page {
            width: 100%;
            min-height: 100vh;
            box-sizing: border-box;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 32px;

            background:
              radial-gradient(
                circle at top left,
                rgba(34, 197, 94, 0.10),
                transparent 34%
              ),
              radial-gradient(
                circle at bottom right,
                rgba(22, 163, 74, 0.08),
                transparent 36%
              ),
              #f4f7f5;
          }

          .revendedor-login-loading-card {
            width: min(100%, 420px);
            box-sizing: border-box;

            padding: 34px;

            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;

            border: 1px solid rgba(15, 23, 32, 0.07);
            border-radius: 20px;

            background: rgba(255, 255, 255, 0.88);

            box-shadow:
              0 18px 50px rgba(15, 23, 32, 0.08);

            backdrop-filter: blur(16px);
          }

          .revendedor-login-loading-icon {
            width: 48px;
            height: 48px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 14px;

            background:
              linear-gradient(
                135deg,
                #16a34a,
                #22c55e
              );
          }

          .revendedor-login-loading-icon span {
            width: 19px;
            height: 19px;

            border: 3px solid rgba(255,255,255,0.35);
            border-top-color: white;

            border-radius: 50%;

            animation:
              revendedorLoginSpin
              0.8s linear infinite;
          }

          .revendedor-login-loading-text {
            color: #526058;
            font-size: 14px;
            font-weight: 700;
          }

          @keyframes revendedorLoginSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * PANTALLA
   * ------------------------------------------------------------------------
   */

  return (
    <div className="revendedor-login-page">

      <div className="revendedor-login-wrapper">

        {/* VOLVER */}

        <button
          type="button"
          className="revendedor-login-back"
          onClick={() => {
            if (slug) {
              navigate(
                `/v/${slug}`
              );
            } else {
              navigate("/");
            }
          }}
        >
          <span className="revendedor-login-back-icon">
            ←
          </span>

          <span>
            Volver al catálogo
          </span>
        </button>

        {/* CARD */}

        <section className="revendedor-login-card">

          {/* ENCABEZADO */}

          <div className="revendedor-login-heading">

            <div className="revendedor-login-icon-wrap">
              <div className="revendedor-login-icon">
                ↗
              </div>
            </div>

            <div>
              <div className="revendedor-login-eyebrow">
                ACCESO PRIVADO
              </div>

              <h1>
                Ingresar
              </h1>

              <p>
                Accedé a tu panel para administrar
                tus ventas y clientes.
              </p>
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="revendedor-login-error">

              <div className="revendedor-login-error-icon">
                !
              </div>

              <div>
                {error}
              </div>

            </div>
          )}

          {/* FORMULARIO */}

          <form
            onSubmit={iniciarSesion}
            className="revendedor-login-form"
          >

            <label className="revendedor-login-field">

              <span>
                Email de acceso
              </span>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="revendedor@email.com"
                autoComplete="email"
                disabled={cargando}
              />

            </label>

            <label className="revendedor-login-field">

              <span>
                Contraseña
              </span>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
                disabled={cargando}
              />

            </label>

            <button
              type="submit"
              className="revendedor-login-submit"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="revendedor-login-button-spinner" />
                  Verificando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>

          </form>

          {/* PIE */}

          <div className="revendedor-login-footer">
            Acceso exclusivo para revendedores
            autorizados.
          </div>

        </section>

      </div>

      <style>{`

        /* ================================================================
           BASE
        ================================================================ */

        .revendedor-login-page {
          width: 100%;
          min-height: 100vh;

          box-sizing: border-box;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 32px;

          background:
            radial-gradient(
              circle at top left,
              rgba(34, 197, 94, 0.10),
              transparent 34%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(22, 163, 74, 0.08),
              transparent 36%
            ),
            #f4f7f5;
        }

        .revendedor-login-wrapper {
          width: min(100%, 620px);
        }

        /* ================================================================
           VOLVER
        ================================================================ */

        .revendedor-login-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 14px;

          padding: 9px 13px;

          border: 1px solid rgba(15, 23, 32, 0.07);
          border-radius: 11px;

          background: rgba(255, 255, 255, 0.78);

          color: #526058;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition:
            color 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease,
            transform 0.18s ease;
        }

        .revendedor-login-back:hover {
          color: #15803d;

          border-color:
            rgba(22, 163, 74, 0.18);

          background: white;

          transform: translateY(-1px);
        }

        .revendedor-login-back-icon {
          font-size: 17px;
          line-height: 1;
        }

        /* ================================================================
           CARD
        ================================================================ */

        .revendedor-login-card {
          width: 100%;
          box-sizing: border-box;

          padding: 34px;

          border:
            1px solid rgba(15, 23, 32, 0.07);

          border-radius: 20px;

          background:
            rgba(255, 255, 255, 0.92);

          box-shadow:
            0 18px 50px
            rgba(15, 23, 32, 0.08);

          backdrop-filter: blur(16px);
        }

        /* ================================================================
           HEADER
        ================================================================ */

        .revendedor-login-heading {
          display: flex;
          align-items: flex-start;
          gap: 17px;

          margin-bottom: 28px;
        }

        .revendedor-login-icon-wrap {
          flex: 0 0 auto;
        }

        .revendedor-login-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

          color: white;

          font-size: 23px;
          font-weight: 800;

          box-shadow:
            0 10px 24px
            rgba(22, 163, 74, 0.18);
        }

        .revendedor-login-eyebrow {
          margin-bottom: 5px;

          color: #16a34a;

          font-size: 11px;
          line-height: 1.2;

          font-weight: 800;

          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .revendedor-login-heading h1 {
          margin: 0;

          color: #162019;

          font-size: 30px;
          line-height: 1.15;

          font-weight: 800;

          letter-spacing: -0.02em;
        }

        .revendedor-login-heading p {
          margin: 8px 0 0;

          color: #68736d;

          font-size: 14px;
          line-height: 1.5;
        }

        /* ================================================================
           ERROR
        ================================================================ */

        .revendedor-login-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin-bottom: 20px;
          padding: 12px 14px;

          border:
            1px solid
            rgba(180, 35, 24, 0.15);

          border-radius: 12px;

          background: #fff7f6;

          color: #b42318;

          font-size: 13px;
          line-height: 1.45;
          font-weight: 600;
        }

        .revendedor-login-error-icon {
          width: 20px;
          height: 20px;

          flex: 0 0 auto;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #b42318;
          color: white;

          font-size: 12px;
          font-weight: 800;
        }

        /* ================================================================
           FORM
        ================================================================ */

        .revendedor-login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .revendedor-login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .revendedor-login-field span {
          color: #36423b;

          font-size: 14px;
          line-height: 1.2;

          font-weight: 700;
        }

        .revendedor-login-field input {
          width: 100%;
          min-height: 50px;

          box-sizing: border-box;

          padding:
            0 14px;

          border:
            1px solid #dce2de;

          border-radius: 12px;

          outline: none;

          background: #fff;

          color: #162019;

          font-family: inherit;

          font-size: 15px;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .revendedor-login-field input::placeholder {
          color: #9aa39e;
        }

        .revendedor-login-field input:hover:not(:disabled) {
          border-color: #cbd5cf;
        }

        .revendedor-login-field input:focus {
          border-color: #22c55e;

          box-shadow:
            0 0 0 4px
            rgba(34, 197, 94, 0.10);

          background: #fff;
        }

        .revendedor-login-field input:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        /* ================================================================
           BOTÓN PRINCIPAL
        ================================================================ */

        .revendedor-login-submit {
          width: 100%;
          min-height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          margin-top: 4px;

          border: 0;
          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

          color: white;

          font-family: inherit;

          font-size: 15px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 10px 22px
            rgba(22, 163, 74, 0.16);

          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            filter 0.18s ease;
        }

        .revendedor-login-submit:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 13px 26px
            rgba(22, 163, 74, 0.20);

          filter: brightness(0.98);
        }

        .revendedor-login-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .revendedor-login-submit:disabled {
          cursor: wait;
          opacity: 0.68;
        }

        .revendedor-login-button-spinner {
          width: 16px;
          height: 16px;

          border:
            2px solid
            rgba(255,255,255,0.35);

          border-top-color: white;

          border-radius: 50%;

          animation:
            revendedorLoginSpin
            0.75s linear infinite;
        }

        /* ================================================================
           FOOTER
        ================================================================ */

        .revendedor-login-footer {
          margin-top: 22px;
          padding-top: 18px;

          border-top:
            1px solid
            rgba(15, 23, 32, 0.07);

          text-align: center;

          color: #8a948e;

          font-size: 12px;
          line-height: 1.4;
        }

        /* ================================================================
           RESPONSIVE
        ================================================================ */

        @media (max-width: 700px) {
          .revendedor-login-page {
            align-items: flex-start;

            padding:
              20px 14px 30px;
          }

          .revendedor-login-wrapper {
            width: 100%;
          }

          .revendedor-login-card {
            padding: 25px 20px;

            border-radius: 17px;
          }

          .revendedor-login-heading {
            gap: 13px;
            margin-bottom: 24px;
          }

          .revendedor-login-icon {
            width: 46px;
            height: 46px;

            border-radius: 12px;

            font-size: 20px;
          }

          .revendedor-login-heading h1 {
            font-size: 27px;
          }

          .revendedor-login-heading p {
            font-size: 13px;
          }
        }

        @media (max-width: 430px) {
          .revendedor-login-page {
            padding:
              14px 10px 24px;
          }

          .revendedor-login-back {
            margin-bottom: 10px;
          }

          .revendedor-login-card {
            padding: 23px 17px;
          }

          .revendedor-login-heading {
            align-items: flex-start;
          }

          .revendedor-login-eyebrow {
            font-size: 10px;
          }

          .revendedor-login-heading h1 {
            font-size: 25px;
          }

          .revendedor-login-field input {
            min-height: 48px;
          }

          .revendedor-login-submit {
            min-height: 49px;
          }
        }

        @keyframes revendedorLoginSpin {
          to {
            transform: rotate(360deg);
          }
        }

      `}</style>
    </div>
  );
}