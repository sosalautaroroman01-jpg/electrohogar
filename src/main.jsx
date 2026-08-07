import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";
import { DollarProvider } from "./context/DollarContext";
import { VendedorProvider } from "./context/VendedorContext";

import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <DollarProvider>
      <FilterProvider>
        <CartProvider>
          <VendedorProvider>
            <App />
          </VendedorProvider>
        </CartProvider>
      </FilterProvider>
    </DollarProvider>
  </AuthProvider>
);