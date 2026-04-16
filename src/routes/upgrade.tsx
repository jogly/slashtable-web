import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ContentContainer } from "../components/ui/ContentContainer";
import { FadeIn } from "../components/ui/FadeIn";
import { trackUpgradeInitiated } from "../lib/analytics";
import { UPGRADE } from "../lib/copy";

export const Route = createFileRoute("/upgrade")({
  component: UpgradePage,
});

type Status = "idle" | "loading" | "redirecting";

function UpgradePage() {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim() || status !== "idle") return;

    setError(null);
    setStatus("loading");
    trackUpgradeInitiated({ source: "upgrade_page" });

    try {
      const res = await fetch("https://api.slashtable.dev/upgrade", {
        method: "POST",
        headers: { Authorization: `Bearer ${key.trim()}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error === "upgrade_not_available") {
          setError(UPGRADE.errors.not_eligible);
        } else {
          setError(UPGRADE.errors.checkout_failed);
        }
        setStatus("idle");
        return;
      }

      const { url } = await res.json();
      setStatus("redirecting");
      window.location.href = url;
    } catch {
      setError(UPGRADE.errors.network);
      setStatus("idle");
    }
  }

  return (
    <div className="pt-32 pb-20">
      <ContentContainer>
        <div className="mx-auto max-w-narrow">
          <FadeIn>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 flex-shrink-0 bg-accent" />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{UPGRADE.eyebrow}</span>
            </div>
            <h1 className="font-display text-4xl text-text">{UPGRADE.heading}</h1>
            <p className="mt-3 text-text-secondary leading-relaxed">{UPGRADE.description}</p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <form onSubmit={handleSubmit} className="mt-10">
              <textarea
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={UPGRADE.keyPlaceholder}
                rows={3}
                className="w-full resize-none border border-border bg-surface px-4 py-3 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
              />
              <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">{UPGRADE.keyHint}</p>

              {error && <p className="mt-3 text-[#ff4444] text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!key.trim() || status !== "idle"}
                className="mt-6 flex items-center justify-center gap-2 rounded-[6px] bg-accent px-5 py-2.5 font-mono text-white text-xs uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,box-shadow,opacity] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] disabled:pointer-events-none disabled:opacity-50"
              >
                {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {status === "redirecting" ? UPGRADE.redirecting : UPGRADE.cta}
              </button>
            </form>
          </FadeIn>
        </div>
      </ContentContainer>
    </div>
  );
}
