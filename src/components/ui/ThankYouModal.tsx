import { useState } from "react";
import { trackWaitlistSignedUp } from "../../lib/analytics";
import { THANK_YOU } from "../../lib/copy";
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
      <h2 id="thank-you-heading" className="font-display text-2xl text-text tracking-tight">
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
    </Modal>
  );
}
