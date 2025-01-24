import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo-orange.png", "logo-192.png", "logo-512.png"],
      manifest: {
        name: "Lani Logistics",
        short_name: "Lani",
        description: "Fast & reliable delivery services",
        theme_color: "#fa781d",
        icons: [
          {
            src: "logo-orange.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "logo-orange.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "logo-orange.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5174,
  },
});
