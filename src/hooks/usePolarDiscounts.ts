import { useEffect, useState } from "react";

export interface PolarDiscount {
  name: string;
  code?: string;
  /** Percentage in basis points — 1000 = 10% */
  basis_points?: number;
  /** Fixed amounts by currency, e.g. { usd: 1000 } = $10 off */
  amounts?: Record<string, number>;
  starts_at?: string | null;
  ends_at?: string | null;
  max_redemptions?: number | null;
  redemptions_count?: number;
}

export interface CheckoutLinkDiscount {
  polarId: string;
  discount: PolarDiscount | null;
}

const POLAR_API = "https://api.polar.sh/v1";
const TOKEN = import.meta.env.VITE_PUBLIC_POLAR_TOKEN;

interface CheckoutLink {
  client_secret: string;
  discount?: PolarDiscount | null;
}

/**
 * Fetch all checkout links and match by client_secret (the `polar_cl_...` slug).
 * The API only accepts UUIDs for individual lookups, so we list and filter.
 */
async function fetchAllDiscounts(polarIds: string[]): Promise<Record<string, PolarDiscount | null>> {
  const map: Record<string, PolarDiscount | null> = {};
  for (const id of polarIds) map[id] = null;

  try {
    const res = await fetch(`${POLAR_API}/checkout-links?limit=100`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) return map;

    const data = await res.json();
    const links: CheckoutLink[] = data.items ?? [];
    const idSet = new Set(polarIds);

    for (const link of links) {
      if (idSet.has(link.client_secret)) {
        map[link.client_secret] = link.discount ?? null;
      }
    }
  } catch {
    // Fail silently — pricing page still works without discounts
  }

  return map;
}

/** Fetch discount info for a set of Polar checkout link client secrets (`polar_cl_...`). */
export function usePolarDiscounts(polarIds: string[]) {
  const [discounts, setDiscounts] = useState<Record<string, PolarDiscount | null>>({});

  // Serialize the array to a string so the effect only re-runs when IDs actually change,
  // not on every render when the caller passes a new array reference.
  const polarIdsKey = polarIds.join(",");

  useEffect(() => {
    if (!TOKEN || !polarIdsKey) return;

    let cancelled = false;
    fetchAllDiscounts(polarIdsKey.split(",")).then((result) => {
      if (cancelled) return;
      setDiscounts(result);
    });

    return () => {
      cancelled = true;
    };
  }, [polarIdsKey]);

  return { discounts };
}

/** Format a discount for display, e.g. "20% off" or "$10 off". */
export function formatDiscount(d: PolarDiscount): string {
  if (d.basis_points != null) {
    const pct = d.basis_points / 100;
    return `${pct}% off`;
  }
  if (d.amounts) {
    const usd = d.amounts.usd;
    if (usd != null) return `$${usd / 100} off`;
    const first = Object.values(d.amounts)[0];
    if (first != null) return `${first / 100} off`;
  }
  return d.name;
}

/** Calculate the discounted price in cents from a dollar string like "$49". */
export function discountedPrice(priceStr: string, d: PolarDiscount): number | null {
  const match = priceStr.match(/\$(\d+)/);
  if (!match) return null;
  const cents = Number(match[1]) * 100;

  if (d.basis_points != null) {
    return Math.round(cents * (1 - d.basis_points / 10000));
  }
  if (d.amounts?.usd != null) {
    return Math.max(0, cents - d.amounts.usd);
  }
  return null;
}

/** Check if a discount is currently active based on its time window. */
export function isDiscountActive(d: PolarDiscount): boolean {
  const now = Date.now();
  if (d.starts_at && new Date(d.starts_at).getTime() > now) return false;
  if (d.ends_at && new Date(d.ends_at).getTime() < now) return false;
  if (d.max_redemptions != null && d.redemptions_count != null && d.redemptions_count >= d.max_redemptions)
    return false;
  return true;
}
