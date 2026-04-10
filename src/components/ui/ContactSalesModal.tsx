import { CONTACT_SALES } from "../../lib/copy";
import { Modal } from "./Modal";

interface ContactSalesModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactSalesModal({ open, onClose }: ContactSalesModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelId="contact-sales-heading"
      closeLabel={CONTACT_SALES.close}
      focusableSelector='button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
    >
      <h2 id="contact-sales-heading" className="font-display text-2xl text-text tracking-tight">
        {CONTACT_SALES.heading}
      </h2>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{CONTACT_SALES.body}</p>

      <a
        href={`mailto:${CONTACT_SALES.email}`}
        className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-2.5 font-mono text-black text-xs uppercase tracking-widest transition-colors hover:bg-white"
      >
        {CONTACT_SALES.email}
      </a>
    </Modal>
  );
}
