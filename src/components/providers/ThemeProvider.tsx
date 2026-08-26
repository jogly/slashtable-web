"use client";

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { useCallback, useLayoutEffect } from "react";
import { THEME_STORAGE_KEY } from "../../lib/theme-script";

type Theme = "dark" | "light";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey={THEME_STORAGE_KEY}
      themes={["dark", "light"]}
    >
      <ThemeColorMeta />
      {children}
    </NextThemesProvider>
  );
}

function ThemeColorMeta() {
  const { resolvedTheme } = useNextTheme();
  useLayoutEffect(() => {
    const theme = themeFromDocument(resolvedTheme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#111114" : "#f5f3ef");
  }, [resolvedTheme]);
  return null;
}

function themeFromDocument(resolvedTheme?: string): Theme {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
  }
  return resolvedTheme === "light" ? "light" : "dark";
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const { resolvedTheme, setTheme } = useNextTheme();
  // Live attribute, not next-themes' unresolved "dark" default before mount.
  const theme = themeFromDocument(resolvedTheme);
  const toggle = useCallback(() => {
    const next = themeFromDocument() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    setTheme(next);
  }, [setTheme]);

  return { theme, toggle };
}
