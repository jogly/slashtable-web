"use client";

import { useState } from "react";
import { trackWaitlistSignedUp } from "../../lib/analytics";
import { THANK_YOU } from "../../lib/copy";
import { ButtonOverlays } from "./ButtonOverlays";
import { Modal } from "./Modal";

interface ThankYouModalProps {
  open: boolean;
  onClose: () => void;
}

export function ThankYouModal({ open, onClose }: ThankYouModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    trackWaitlistSignedUp({ email: email.trim() });
    fetch("https://api.slashtable.dev/mail/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => {});
    setSubmitted(true);
  }

  return (
    <Modal open={open} onClose={onClose} labelId="thank-you-heading" closeLabel={THANK_YOU.close}>
      <h2 id="thank-you-heading" className="font-display text-2xl text-text">
        {THANK_YOU.heading}
      </h2>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{THANK_YOU.body}</p>

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
            className="h-9 min-w-0 flex-1 rounded-[4px] border border-border bg-bg px-3 font-mono text-[13px] text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="group relative inline-flex h-9 shrink-0 items-center overflow-hidden rounded-[4px] bg-accent px-4 font-mono text-white text-xs uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.12)]"
          >
            <ButtonOverlays grainOpacity={0.14} />
            <span className="relative">{THANK_YOU.emailSubmit}</span>
          </button>
        </form>
      )}
    </Modal>
  );
}
