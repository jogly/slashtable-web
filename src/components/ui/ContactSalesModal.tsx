"use client";

import { CONTACT_SALES } from "../../lib/copy";
import { ButtonOverlays } from "./ButtonOverlays";
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
      <h2 id="contact-sales-heading" className="font-display text-2xl text-text">
        {CONTACT_SALES.heading}
      </h2>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{CONTACT_SALES.body}</p>

      <a
        href={`mailto:${CONTACT_SALES.email}`}
        className="group relative mt-6 inline-flex items-center overflow-hidden rounded-[6px] bg-accent px-6 py-2.5 font-mono text-white text-xs uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.12)]"
      >
        <ButtonOverlays grainOpacity={0.16} />
        <span className="relative">{CONTACT_SALES.email}</span>
      </a>
    </Modal>
  );
}
