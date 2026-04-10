import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackWaitlistSignedUp } from "../../lib/analytics";
import { THANK_YOU } from "../../lib/copy";

interface ThankYouModalProps {
  open: boolean;
  onClose: () => void;
}

export function ThankYouModal({ open, onClose }: ThankYouModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Focus trap and restore
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      // Small delay to let the dialog render
      requestAnimationFrame(() => closeRef.current?.focus());
    } else {
      previousFocus.current?.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Trap focus within modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    trackWaitlistSignedUp({ email: email.trim() });
    // Fire-and-forget — we don't block on this
    fetch("https://api.slashtable.dev/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => {});
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="thank-you-heading"
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-md rounded-md border border-border bg-surface-2 p-8 shadow-2xl"
      >
        {/* Close button */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={THANK_YOU.close}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Thank you */}
        <h2 id="thank-you-heading" className="font-display text-2xl text-text tracking-tight">
          {THANK_YOU.heading}
        </h2>
        <p className="mt-4 text-sm text-text-secondary leading-relaxed">{THANK_YOU.body}</p>

        {/* Email form */}
        {submitted ? (
          <p className="mt-6 font-mono text-[11px] text-green uppercase tracking-widest">{THANK_YOU.emailSuccess}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={THANK_YOU.emailPlaceholder}
              className="min-w-0 flex-1 rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded bg-accent px-4 py-2 font-mono text-black text-xs uppercase tracking-widest transition-colors hover:bg-white"
            >
              {THANK_YOU.emailSubmit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
