export const THEME_STORAGE_KEY = "st-theme";
export const THEME_BOOTSTRAP_ATTR = "data-st-theme-bootstrap";

/** Resolve `st-theme` to the concrete `data-theme` value. Stored `light` stays light. */
export function resolveStoredTheme(
  stored: string | null | undefined,
  prefersDark: boolean,
): "light" | "dark" {
  if (stored === "light" || stored === "dark") return stored;
  if (stored === "system") return prefersDark ? "dark" : "light";
  return "dark";
}

/**
 * Inline blocking script: set `data-theme` + `color-scheme` from storage / system.
 * Must run before any stylesheet so light users never paint dark first.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var d=document.documentElement;var t=localStorage.getItem(k);if(t==="light"||t==="dark"){}else if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}else{t="dark";}d.setAttribute("data-theme",t);d.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}})();`;

export const THEME_BOOTSTRAP_HEAD_TAG = `<script ${THEME_BOOTSTRAP_ATTR}="1">${THEME_BOOTSTRAP_SCRIPT}</script>`;
