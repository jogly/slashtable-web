import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  resolveStoredTheme,
  THEME_BOOTSTRAP_HEAD_TAG,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_STORAGE_KEY,
} from "../src/lib/theme-script";

const root = join(import.meta.dir, "..");

describe("resolveStoredTheme", () => {
  test("stored light stays light even when the OS prefers dark", () => {
    expect(resolveStoredTheme("light", true)).toBe("light");
    expect(resolveStoredTheme("light", false)).toBe("light");
  });

  test("stored dark stays dark", () => {
    expect(resolveStoredTheme("dark", true)).toBe("dark");
    expect(resolveStoredTheme("dark", false)).toBe("dark");
  });

  test("system follows prefers-color-scheme", () => {
    expect(resolveStoredTheme("system", true)).toBe("dark");
    expect(resolveStoredTheme("system", false)).toBe("light");
  });

  test("missing or unknown values default to dark", () => {
    expect(resolveStoredTheme(null, false)).toBe("dark");
    expect(resolveStoredTheme(undefined, false)).toBe("dark");
    expect(resolveStoredTheme("", false)).toBe("dark");
    expect(resolveStoredTheme("auto", false)).toBe("dark");
  });
});

describe("theme bootstrap emission", () => {
  test("bootstrap IIFE reads st-theme and never maps stored light to dark", () => {
    expect(THEME_STORAGE_KEY).toBe("st-theme");
    expect(THEME_BOOTSTRAP_SCRIPT).toContain('localStorage.getItem(k)');
    expect(THEME_BOOTSTRAP_SCRIPT).toContain('t==="light"');
    expect(THEME_BOOTSTRAP_SCRIPT).toContain('t==="system"');
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("prefers-color-scheme: dark");
    expect(THEME_BOOTSTRAP_HEAD_TAG.startsWith("<script data-st-theme-bootstrap=")).toBe(true);
    expect(THEME_BOOTSTRAP_HEAD_TAG).toContain(THEME_BOOTSTRAP_SCRIPT);
  });

  test("root html does not SSR data-theme", () => {
    const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    expect(layout).not.toMatch(/<html[^>]*data-theme=/);
    expect(layout).toContain("suppressHydrationWarning");
    expect(layout).toContain("fontVariables");
  });
});
