import { useEffect, useState } from "react";

// Returns `false` during SSR and the first client render, then `true` after
// mount. Use this to gate code paths that produce different markup on the
// server vs. the client (non-SSR-safe libraries, browser-only APIs, theme-
// dependent branches) — render the stable/SSR-friendly version when `false`
// and the full version when `true` to avoid hydration mismatches.
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
