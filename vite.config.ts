import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

/**
 * Injects <link rel="preload"> for latin woff2 font files so the browser
 * discovers them at HTML parse time instead of waiting for CSS to load.
 */
function preloadFonts(): Plugin {
  return {
    name: "preload-fonts",
    enforce: "post",
    transformIndexHtml(_, ctx) {
      if (!ctx.bundle) return [];
      const latinFonts = Object.keys(ctx.bundle).filter(
        (f) => f.endsWith(".woff2") && f.includes("-latin-") && !f.includes("-latin-ext-"),
      );
      return latinFonts.map((href) => ({
        tag: "link",
        attrs: {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          crossorigin: "",
          href: `/${href}`,
        },
        injectTo: "head" as const,
      }));
    },
  };
}

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
    preloadFonts(),
  ],
});
