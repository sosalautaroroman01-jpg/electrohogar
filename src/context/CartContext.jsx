import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [abierto, setAbierto] = useState(false);

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);

      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: Number(item.cantidad) + cantidad,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...producto,
          cantidad,
        },
      ];
    });

    setAbierto(true);
  }

  function aumentarCantidad(id) {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              cantidad: Number(item.cantidad) + 1,
            }
          : item
      )
    );
  }

  function disminuirCantidad(id) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: Number(item.cantidad) - 1,
              }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function eliminarProducto(id) {
    setCarrito((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  function obtenerPrecio(item) {
    if (item.cantidad >= 12 && Number(item.precio12) > 0)
      return Number(item.precio12);

    if (item.cantidad >= 9 && Number(item.precio9) > 0)
      return Number(item.precio9);

    if (item.cantidad >= 6 && Number(item.precio6) > 0)
      return Number(item.precio6);

    if (item.cantidad >= 3 && Number(item.precio3) > 0)
      return Number(item.precio3);

    if (item.cantidad >= 2 && Number(item.precio2) > 0)
      return Number(item.precio2);

    return Number(item.precio);
  }

  const total = useMemo(() => {
    return carrito.reduce(
      (acum, item) =>
        acum + obtenerPrecio(item) * Number(item.cantidad),
      0
    );
  }, [carrito]);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
        obtenerPrecio,
        total,
        abierto,
        setAbierto,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}