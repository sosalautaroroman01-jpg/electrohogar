import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FilterProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FilterProvider>
    </AuthProvider>
  </StrictMode>
);