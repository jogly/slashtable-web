import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { imagetools } from "vite-imagetools";

const CHANGELOG_URL = "https://downloads.slashtable.dev/changelog.json";

function changelogPlugin(): Plugin {
  const virtualId = "virtual:changelog";
  const resolvedId = `\0${virtualId}`;

  return {
    name: "changelog",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;
      const res = await fetch(CHANGELOG_URL);
      if (!res.ok) throw new Error(`Failed to fetch changelog: ${res.statusText}`);
      const json = await res.text();
      return `export default ${json};`;
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
    changelogPlugin(),
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
