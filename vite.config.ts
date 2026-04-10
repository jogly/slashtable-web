import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { imagetools } from "vite-imagetools";

const CHANGELOG_URL = "https://downloads.slashtable.dev/changelog.json";

/**
 * Fetches the changelog at build time and inlines it as a virtual module.
 * This keeps the page free of loading states but requires a redeploy to show new entries.
 */
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
      try {
        const res = await fetch(CHANGELOG_URL);
        if (!res.ok) {
          console.warn(`[changelog] Fetch returned ${res.status} ${res.statusText} — building with empty changelog`);
          return "export default { entries: [] };";
        }
        const json = await res.text();
        return `export default ${json};`;
      } catch (e) {
        console.warn("[changelog] Fetch failed — building with empty changelog", e);
        return "export default { entries: [] };";
      }
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
