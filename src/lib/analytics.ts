import posthog from "posthog-js";

// ── Event Names ────────────────────────────────────────────
export const ANALYTICS_EVENTS = {
  DOWNLOAD_STARTED: "download_started",
  WAITLIST_SIGNED_UP: "waitlist_signed_up",
  CHECKOUT_CLICKED: "checkout_clicked",
  CHECKOUT_COMPLETED: "checkout_completed",
  CONTACT_SALES_OPENED: "contact_sales_opened",
  EXTERNAL_LINK_CLICKED: "external_link_clicked",
  UPGRADE_INITIATED: "upgrade_initiated",
} as const;

// ── Property Interfaces ────────────────────────────────────
export type DownloadSource =
  | "pricing_free_tier"
  | "download_section_drag"
  | "download_section_button"
  | "download_section_mobile";

interface DownloadStartedProps {
  architecture: "silicon" | "intel";
  version: string | undefined;
  source: DownloadSource;
}

interface WaitlistSignedUpProps {
  email: string;
}

interface CheckoutClickedProps {
  tier: string;
  price: string;
  discount_active: boolean;
  discount_amount: string | null;
  polar_id: string;
}

interface CheckoutCompletedProps {
  checkout_id: string | undefined;
}

interface ContactSalesOpenedProps {
  source: "pricing_team_tier";
}

interface ExternalLinkClickedProps {
  url: string;
  label: string;
  source: "community_section" | "footer";
}

interface UpgradeInitiatedProps {
  source: "upgrade_page";
}

// ── Capture Helpers ────────────────────────────────────────
export function trackDownloadStarted(props: DownloadStartedProps) {
  posthog.capture(ANALYTICS_EVENTS.DOWNLOAD_STARTED, props);
}

export function trackWaitlistSignedUp(props: WaitlistSignedUpProps) {
  posthog.capture(ANALYTICS_EVENTS.WAITLIST_SIGNED_UP, props, {
    $set: { email: props.email },
    $set_once: { first_waitlist_signup: new Date().toISOString() },
  });
}

export function trackCheckoutClicked(props: CheckoutClickedProps) {
  posthog.capture(ANALYTICS_EVENTS.CHECKOUT_CLICKED, props);
}

export function trackCheckoutCompleted(props: CheckoutCompletedProps) {
  posthog.capture(ANALYTICS_EVENTS.CHECKOUT_COMPLETED, props);
}

export function trackContactSalesOpened(props: ContactSalesOpenedProps) {
  posthog.capture(ANALYTICS_EVENTS.CONTACT_SALES_OPENED, props);
}

export function trackExternalLinkClicked(props: ExternalLinkClickedProps) {
  posthog.capture(ANALYTICS_EVENTS.EXTERNAL_LINK_CLICKED, props);
}

export function trackUpgradeInitiated(props: UpgradeInitiatedProps) {
  posthog.capture(ANALYTICS_EVENTS.UPGRADE_INITIATED, props);
}
