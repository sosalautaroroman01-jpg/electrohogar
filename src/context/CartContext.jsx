import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [abierto, setAbierto] = useState(false);

  function agregarAlCarrito(producto, cantidad = 1) {
    const existe = carrito.find((item) => item.id === producto.id);

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
              }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad,
        },
      ]);
    }

    setAbierto(true);
  }

  function aumentarCantidad(id) {
    setCarrito(
      carrito.map((item) =>
        item.id === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  }

  function disminuirCantidad(id) {
    setCarrito(
      carrito
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function eliminarProducto(id) {
    setCarrito(carrito.filter((item) => item.id !== id));
  }

  const total = carrito.reduce(
    (acum, item) => acum + item.precio * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
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