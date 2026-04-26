"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-surface-hover ${className}`}
    >
      <Sun
        className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 text-text-muted opacity-100 group-hover:text-text"
        }`}
        strokeWidth={1.5}
      />
      <Moon
        className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 text-text-muted opacity-100 group-hover:text-text"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={1.5}
      />
    </button>
  );
}
