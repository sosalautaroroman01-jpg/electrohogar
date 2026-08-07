import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "icon-192.png",
        "icon-512.png",
      ],

      manifest: {
        name: "Electro Hogar Quilmes",
        short_name: "Electro Hogar",

        description: "Sistema de ventas Electro Hogar Quilmes",

        theme_color: "#57B52A",
        background_color: "#ffffff",

        display: "standalone",

        orientation: "portrait",

        start_url: "/",

        scope: "/",

        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});