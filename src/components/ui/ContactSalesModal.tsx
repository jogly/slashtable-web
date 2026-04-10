import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CONTACT_SALES } from "../../lib/copy";

interface ContactSalesModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactSalesModal({ open, onClose }: ContactSalesModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => closeRef.current?.focus());
    } else {
      previousFocus.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-sales-heading"
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-md rounded-md border border-border bg-surface-2 p-8 shadow-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={CONTACT_SALES.close}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          id="contact-sales-heading"
          className="font-display text-2xl text-text tracking-tight"
        >
          {CONTACT_SALES.heading}
        </h2>
        <p className="mt-4 text-sm text-text-secondary leading-relaxed">
          {CONTACT_SALES.body}
        </p>

        <a
          href={`mailto:${CONTACT_SALES.email}`}
          className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-2.5 font-mono text-xs text-black uppercase tracking-widest transition-colors hover:bg-white"
        >
          {CONTACT_SALES.email}
        </a>
      </div>
    </div>
  );
}
