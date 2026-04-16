import { ThumbsUp, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import posthog from "posthog-js";
import { useCallback, useEffect, useRef, useState } from "react";
import bannerBg from "../../assets/consent-banner-bg.jpg";
import { COOKIE_CONSENT } from "../../lib/copy";

const STORAGE_KEY = "cookie-consent";
const AUTO_DISMISS_MS = 10_000;
const FLASH_DISMISS_MS = 1200;

type Consent = "accepted" | "declined";
type Phase = "idle" | "countdown" | "flash";

function getStoredConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    // localStorage unavailable
  }
  return null;
}

function storeConsent(consent: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, consent);
  } catch {
    // localStorage unavailable
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<number>(undefined);

  const dismiss = useCallback(() => {
    window.clearTimeout(timerRef.current);
    storeConsent("declined");
    posthog.opt_out_capturing();
    setVisible(false);
  }, []);

  const accept = useCallback(() => {
    window.clearTimeout(timerRef.current);
    storeConsent("accepted");
    posthog.opt_in_capturing();
    setVisible(false);
  }, []);

  const decline = useCallback(() => {
    window.clearTimeout(timerRef.current);
    // Enter flash phase — show thumbs up, then dismiss
    setPhase("flash");
    storeConsent("declined");
    posthog.opt_out_capturing();
    timerRef.current = window.setTimeout(() => setVisible(false), FLASH_DISMISS_MS);
  }, []);

  useEffect(() => {
    if (getStoredConsent() !== null) return;
    const showTimer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(showTimer);
  }, []);

  // Start auto-dismiss countdown when banner becomes visible
  useEffect(() => {
    if (!visible) return;
    setPhase("countdown");
    timerRef.current = window.setTimeout(decline, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timerRef.current);
  }, [visible, decline]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 z-[90] w-full border-border border-t shadow-xl sm:bottom-5 sm:left-5 sm:w-lg sm:rounded-lg sm:border"
        >
          {/* Background image — cover on mobile, zoomed + shifted on desktop */}
          <div
            className="absolute inset-0 bg-cover bg-right-bottom sm:rounded-lg sm:[background-position:right_bottom_-10px] sm:[background-size:100%]"
            style={{ backgroundImage: `url(${bannerBg})` }}
          />
          {/* Uniform overlay — plant shows through at reduced opacity */}
          <div className="absolute inset-0 bg-surface/80 sm:rounded-lg sm:bg-surface/50" />

          <div className="relative p-4 sm:p-5">
            {/* Close → decline */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss cookie banner"
              className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="sm:max-w-[76%]">
              <p className="pr-6 font-medium text-sm text-text leading-snug sm:pr-0">{COOKIE_CONSENT.heading}</p>
              <p className="mt-2 text-[13px] text-text/80 leading-relaxed">{COOKIE_CONSENT.body}</p>

              <div className="mt-4 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={accept}
                  className="rounded-md bg-accent px-3.5 py-1.5 font-medium text-white text-xs transition-opacity hover:opacity-90"
                >
                  {COOKIE_CONSENT.accept}
                </button>
                <button
                  type="button"
                  onClick={decline}
                  className="relative overflow-hidden rounded-md border border-border px-3.5 py-1.5 font-medium text-text-secondary text-xs transition-colors hover:text-text"
                >
                  {/* Fill bar that gradually covers the button */}
                  {phase === "countdown" && (
                    <span
                      className="absolute inset-0 origin-left bg-border/50"
                      style={{
                        animation: `cookie-fill ${AUTO_DISMISS_MS}ms linear forwards`,
                      }}
                    />
                  )}
                  {/* Flash bg on completion */}
                  {phase === "flash" && (
                    <motion.span
                      className="absolute inset-0 rounded-md bg-border"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: [1, 0.4, 1, 0.5] }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                  <span className="relative flex items-center justify-center">
                    <AnimatePresence mode="wait" initial={false}>
                      {phase === "flash" ? (
                        <motion.span
                          key="thumb"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </motion.span>
                      ) : (
                        <motion.span key="text" exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                          {COOKIE_CONSENT.decline}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <style>{`@keyframes cookie-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
