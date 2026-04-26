import joePhoto from "@assets/joe-from-distance.png?as=img";
import { useEffect, useRef, useState } from "react";
import { trackWaitlistSignedUp } from "../../lib/analytics";
import { KEEP_POSTED, THANK_YOU } from "../../lib/copy";
import { ButtonOverlays } from "./ButtonOverlays";
import { Modal } from "./Modal";

interface ThankYouModalProps {
  open: boolean;
  onClose: () => void;
  variant?: "thanks" | "keep-posted";
}

function renderWithBrand(text: string) {
  return text.split(/(\/table)/g).map((part, i) =>
    part === "/table" ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: stable split output
      <span key={i} className="font-mono tracking-tighter">
        {part}
      </span>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: stable split output
      <span key={i}>{part}</span>
    ),
  );
}

function Signature({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 674 347" className="h-10 w-auto text-text" fill="none" role="img" aria-label={label}>
      <title>{label}</title>
      <g transform="translate(-139.305 -339.061)">
        <path
          d="M183.018,533.946C182.402,552.4 175.701,558.43 161.651,546.504C132.592,521.839 126.131,432.026 237.05,359.953C325.728,302.332 355.186,401.159 289.139,540.694C270.738,579.567 248.194,628.9 209.937,671.254C179.621,704.817 179.975,647.931 212.388,604.658C241.974,565.158 311.758,495.357 346.75,485.653C348.424,485.189 350.38,484.647 368.032,481.336C337.622,494.731 330.34,535.589 358.785,528.433C371.303,525.284 391.143,492.015 372.272,483.97C356.55,477.267 411.182,486.188 434.519,475.763C460.439,464.184 469.856,436.683 459.087,461.685C453.772,474.023 466.815,490.71 462.141,505.574C455.568,526.478 411.386,496.964 419.194,506.625C427.607,517.035 457.428,525.522 476.186,521.069C551.147,503.278 563.858,422.994 532.228,455.79C518.319,470.212 508.424,493.236 518.924,503.371C538.255,522.028 611.209,461.662 611.209,461.662L513.776,643.482C513.776,643.482 584.373,513.166 594.625,493.789C609.27,466.106 625.84,425.679 636.17,446.481C643.877,462 635.872,478.023 629.268,483.657C619.136,492.302 611.307,499.627 584.462,490.64C614.752,508.661 653.539,483.115 662.316,477.012C717.758,438.458 777.186,319.67 763.089,350.553C757.148,363.568 740.45,397.065 725.484,431.581C711.945,462.805 710.628,461.955 698.544,490.95C699.9,490.604 758.313,428.719 743.923,486.86C739.775,503.621 785.456,478.292 808.151,487.944"
          stroke="currentColor"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function ThankYouModal({ open, onClose, variant = "thanks" }: ThankYouModalProps) {
  const copy =
    variant === "keep-posted" ? { ...THANK_YOU, heading: KEEP_POSTED.heading, body: KEEP_POSTED.body } : THANK_YOU;
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"init" | "submitting" | "success" | "error">("init");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || formState === "success") return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => inputRef.current?.focus());
    });
    return () => cancelAnimationFrame(id);
  }, [open, formState]);

  function handleInputFocus() {
    // On mobile, when the soft keyboard opens, make sure the field is in view.
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 250);
  }

  function hasRecentSubmission() {
    const now = Date.now();
    const previous = Number(localStorage.getItem("loops-form-timestamp") || 0);
    if (previous && previous + 60_000 > now) return true;
    localStorage.setItem("loops-form-timestamp", String(now));
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formState !== "init") return;

    const trimmed = email.trim();
    if (!/.+@.+/.test(trimmed)) {
      setErrorMessage(copy.emailInvalid);
      setFormState("error");
      return;
    }
    if (hasRecentSubmission()) {
      setErrorMessage(copy.emailRateLimited);
      setFormState("error");
      return;
    }

    setFormState("submitting");
    trackWaitlistSignedUp({ email: trimmed });

    try {
      const body =
        `email=${encodeURIComponent(trimmed)}` + `&mailingLists=${encodeURIComponent("cmod37awu0oqb0ixb53s8eozp")}`;
      const res = await fetch("https://app.loops.so/api/newsletter-form/cmo39ee1601m80i2b81bu6fls", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (res.ok) {
        setFormState("success");
        return;
      }
      localStorage.setItem("loops-form-timestamp", "");
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.message || res.statusText || copy.emailError);
      setFormState("error");
    } catch (err) {
      localStorage.setItem("loops-form-timestamp", "");
      const msg = err instanceof Error ? err.message : "";
      setErrorMessage(msg === "Failed to fetch" ? copy.emailRateLimited : msg || copy.emailError);
      setFormState("error");
    }
  }

  function resetToInit() {
    setErrorMessage("");
    setFormState("init");
  }

  return (
    <Modal open={open} onClose={onClose} labelId="thank-you-heading" closeLabel={copy.close}>
      <div className="-mx-8 -mt-8 mb-6 h-[120px] overflow-hidden rounded-t-md border-border border-b bg-bg">
        <img
          src={joePhoto.src}
          alt={copy.photoAlt}
          width={joePhoto.w}
          height={joePhoto.h}
          className="block h-full w-full object-cover object-[center_40%] saturate-[0.50]"
        />
      </div>
      <h2 id="thank-you-heading" className="font-display text-2xl text-text">
        {copy.heading}
      </h2>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{renderWithBrand(copy.body)}</p>

      <div className="mt-5 flex justify-end">
        <Signature label={copy.signatureAlt} />
      </div>

      {formState === "success" ? (
        <div className="mt-6 space-y-1 font-mono text-[11px] text-green uppercase tracking-widest">
          {copy.emailSuccess.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 sm:flex-row">
            <input
              ref={inputRef}
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              required
              disabled={formState === "submitting"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              placeholder={copy.emailPlaceholder}
              className="h-11 w-full min-w-0 rounded-[4px] border border-border bg-bg px-3 font-mono text-[13px] text-text placeholder:text-text-muted focus:border-accent focus:outline-none disabled:opacity-60 sm:h-9 sm:flex-1"
            />
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="group relative inline-flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-accent px-4 font-mono text-white text-xs uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-70 sm:h-9"
            >
              <ButtonOverlays grainOpacity={0.14} />
              <span className="relative">{formState === "submitting" ? copy.emailSubmitting : copy.emailSubmit}</span>
            </button>
          </form>
          {formState === "error" && (
            <p className="mt-3 font-mono text-[#ff6b5b] text-[11px] uppercase tracking-widest" role="alert">
              {errorMessage || copy.emailError}
              <button
                type="button"
                onClick={resetToInit}
                className="ml-2 underline underline-offset-2 transition-colors hover:text-text"
              >
                ← Back
              </button>
            </p>
          )}
        </>
      )}
    </Modal>
  );
}
