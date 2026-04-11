import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  resolve: {
    alias: {
      "@screenshots": path.resolve(__dirname, "src/assets/screenshots"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: () =>
        new URLSearchParams({
          format: "webp",
          quality: "85",
        }),
    }),
  ],
});
