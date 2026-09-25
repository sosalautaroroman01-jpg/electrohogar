import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { revendedorAuth } from "../firebase";
import {
  obtenerRevendedorPorAuthUid,
} from "../services/vendedoresService";

const RevendedorAuthContext =
  createContext(null);

export function RevendedorAuthProvider({
  children,
}) {
  const [usuario, setUsuario] =
    useState(null);

  const [revendedor, setRevendedor] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const cancelar =
      onAuthStateChanged(
        revendedorAuth,
        async (usuarioFirebase) => {
          try {
            setLoading(true);

            if (!usuarioFirebase) {
              setUsuario(null);
              setRevendedor(null);
              return;
            }

            setUsuario(usuarioFirebase);

            const datosRevendedor =
              await obtenerRevendedorPorAuthUid(
                usuarioFirebase.uid
              );

            if (
              !datosRevendedor ||
              datosRevendedor.activo === false
            ) {
              await signOut(
                revendedorAuth
              );

              setUsuario(null);
              setRevendedor(null);

              return;
            }

            setRevendedor(
              datosRevendedor
            );
          } catch (error) {
            console.error(
              "Error cargando sesión del revendedor:",
              error
            );

            setUsuario(null);
            setRevendedor(null);
          } finally {
            setLoading(false);
          }
        }
      );

    return () => {
      cancelar();
    };
  }, []);

  async function login(
    email,
    password
  ) {
    const emailLimpio =
      email
        ?.toString()
        .trim()
        .toLowerCase();

    const passwordLimpia =
      password?.toString() || "";

    if (!emailLimpio) {
      throw new Error(
        "Ingresá tu email."
      );
    }

    if (!passwordLimpia) {
      throw new Error(
        "Ingresá tu contraseña."
      );
    }

    const credencial =
      await signInWithEmailAndPassword(
        revendedorAuth,
        emailLimpio,
        passwordLimpia
      );

    const datosRevendedor =
      await obtenerRevendedorPorAuthUid(
        credencial.user.uid
      );

    if (!datosRevendedor) {
      await signOut(
        revendedorAuth
      );

      throw new Error(
        "Esta cuenta no está vinculada a un revendedor."
      );
    }

    if (
      datosRevendedor.activo === false
    ) {
      await signOut(
        revendedorAuth
      );

      throw new Error(
        "Tu cuenta de revendedor está inactiva."
      );
    }

    setUsuario(
      credencial.user
    );

    setRevendedor(
      datosRevendedor
    );

    return datosRevendedor;
  }

  async function logout() {
    await signOut(
      revendedorAuth
    );

    setUsuario(null);
    setRevendedor(null);
  }

  const value = useMemo(
    () => ({
      usuario,
      revendedor,
      loading,
      autenticado: Boolean(
        usuario && revendedor
      ),
      login,
      logout,
    }),
    [
      usuario,
      revendedor,
      loading,
    ]
  );

  return (
    <RevendedorAuthContext.Provider
      value={value}
    >
      {children}
    </RevendedorAuthContext.Provider>
  );
}

export function useRevendedorAuth() {
  const context =
    useContext(
      RevendedorAuthContext
    );

  if (!context) {
    throw new Error(
      "useRevendedorAuth debe utilizarse dentro de RevendedorAuthProvider."
    );
  }

  return context;
}