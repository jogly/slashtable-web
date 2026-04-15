import { createRouter, RouterProvider } from "@tanstack/react-router";
import posthog from "posthog-js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AnalyticsProvider } from "./components/providers/PostHogProvider";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import "./theme/base.css";
import { routeTree } from "./routeTree.gen";

// GitHub Pages SPA redirect: restore the encoded path from the 404.html redirect.
if (window.location.search.startsWith("?p=")) {
  const path = decodeURIComponent(window.location.search.slice(3));
  window.history.replaceState(null, "", path);
}

if (import.meta.env.PROD) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
  });
}

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} InnerWrap={({ children }) => <AnalyticsProvider>{children}</AnalyticsProvider>} />
    </ThemeProvider>
  </StrictMode>,
);

// Reveal root after React has rendered the DOM with motion initial states applied.
// Double-rAF ensures we're past the frame where React committed.
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    rootEl.style.opacity = "1";
  }),
);
