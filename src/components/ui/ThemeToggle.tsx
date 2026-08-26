"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={`group relative flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-surface-hover ${className}`}
    >
      <Sun
        className="absolute h-3.5 w-3.5 rotate-90 scale-0 opacity-0 transition-all duration-300 [[data-theme=light]_&]:rotate-0 [[data-theme=light]_&]:scale-100 [[data-theme=light]_&]:text-text-muted [[data-theme=light]_&]:opacity-100 [[data-theme=light]_&]:group-hover:text-text"
        strokeWidth={1.5}
      />
      <Moon
        className="absolute h-3.5 w-3.5 rotate-0 scale-100 text-text-muted opacity-100 transition-all duration-300 group-hover:text-text [[data-theme=light]_&]:-rotate-90 [[data-theme=light]_&]:scale-0 [[data-theme=light]_&]:opacity-0"
        strokeWidth={1.5}
      />
    </button>
  );
}
