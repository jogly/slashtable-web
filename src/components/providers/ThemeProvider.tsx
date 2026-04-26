"use client";

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { useMounted } from "../../hooks/useMounted";

type Theme = "dark" | "light";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      storageKey="st-theme"
      themes={["dark", "light"]}
    >
      <ThemeColorMeta />
      {children}
    </NextThemesProvider>
  );
}

function ThemeColorMeta() {
  const { resolvedTheme } = useNextTheme();
  useEffect(() => {
    if (!resolvedTheme) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolvedTheme === "dark" ? "#111114" : "#f5f3ef");
  }, [resolvedTheme]);
  return null;
}

// Returns "dark" during SSR and first client paint, then the real resolved
// theme after mount. Gating on `mounted` is what avoids hydration mismatches
// for consumers that branch on theme.
export function useTheme(): { theme: Theme; toggle: () => void } {
  const { resolvedTheme, setTheme } = useNextTheme();
  const mounted = useMounted();

  const theme: Theme = mounted && resolvedTheme === "light" ? "light" : "dark";
  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  return { theme, toggle };
}
