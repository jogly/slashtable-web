import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  BookMarked,
  Clock,
  Code2,
  Container,
  Folders,
  KeyRound,
  Layers,
  LayoutPanelTop,
  Lock,
  PenLine,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Table2,
  TerminalSquare,
} from "lucide-react";
import { FadeIn } from "../ui/FadeIn";

const features: {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}[] = [
  {
    icon: Code2,
    color: "#44ff88",
    title: "SQL editor",
    description:
      "Full-featured editor with contextual autocomplete for schemas, tables, and columns. Auto-formats queries, runs multiple statements at once, and shows per-statement results and timing.",
  },
  {
    icon: Layers,
    color: "#00d4ff",
    title: "Multiple connections",
    description:
      "Connect to many Postgres databases at once. Each connection keeps its own tabs, state, and query context — switch between them without losing your place.",
  },
  {
    icon: PenLine,
    color: "#cc44ff",
    title: "Safe data mutations",
    description:
      "Edit rows inline. Changes queue up with a SQL diff preview before anything commits. Revert individual changes, run batch operations, or cancel everything at once.",
  },
  {
    icon: Container,
    color: "#ffcc00",
    title: "Docker auto-detection",
    description:
      "Automatically discovers running PostgreSQL containers, extracts credentials from their environment variables, and offers a one-click connection — no manual config needed.",
  },
  {
    icon: KeyRound,
    color: "#c94a00",
    title: "Secure credential vaults",
    description:
      "Source database credentials in System Keychain or 1Password. Browse your vaults, select items, and auto-fill the connection form — no copy-pasting secrets.",
  },
  {
    icon: Table2,
    color: "#44ff88",
    title: "Virtual scrolling",
    description:
      "Renders only the visible rows in the viewport. Browse tables with millions of rows smoothly, with no pagination, no memory bloat, and no artificial row cap.",
  },
  {
    icon: BookMarked,
    color: "#00d4ff",
    title: "Saved views",
    description:
      "Save any combination of filters, sorts, and column configuration as a named view. Organized in folders, recalled instantly with full state restored.",
  },
  {
    icon: Sun,
    color: "#cc44ff",
    title: "Dark & light themes",
    description:
      "Dark mode by default with a one-click light toggle. CSS variable-based theming means plugins can register entirely custom themes.",
  },
  {
    icon: Folders,
    color: "#ffcc00",
    title: "Connection organization",
    description:
      "Group connections in nested folders with drag-and-drop. Assign color indicators and environment badges — prod, dev, staging — to tell them apart at a glance.",
  },
  {
    icon: LayoutPanelTop,
    color: "#c94a00",
    title: "Tab management",
    description:
      "Explorer, SQL, and Schema Graph tabs each hold independent state. Drag to reorder, duplicate with context, rename, and navigate between them with keyboard shortcuts.",
  },
  {
    icon: ShieldCheck,
    color: "#44ff88",
    title: "System keyring credentials",
    description:
      "Passwords stored in the macOS Keychain or Windows Credential Manager — never plaintext on disk, never sent to the frontend. Supports 1Password op:// references.",
  },
  {
    icon: Sparkles,
    color: "#00d4ff",
    title: "Semantic column types",
    description:
      "Automatically detects emails, URLs, images, currency, color swatches, star ratings, phone numbers, and relative dates from column content and renders them accordingly.",
  },
  {
    icon: TerminalSquare,
    color: "#cc44ff",
    title: "SQL execution logging",
    description:
      "Every query logged with timing, row count, parameters, and status. Browse SQL and app logs in a dedicated panel with per-level filtering.",
  },
  {
    icon: Clock,
    color: "#ffcc00",
    title: "Result caching",
    description:
      "Caches up to 200 query results and persists them across sessions. Recent queries reload instantly on tab switch or restart.",
  },
  {
    icon: Lock,
    color: "#c94a00",
    title: "Read-only enforcement",
    description:
      "Three enforcement layers catch write attempts before they reach the database: query parsing, keyword scanning, and a transaction-level rollback. Nothing slips through.",
  },
  {
    icon: BarChart2,
    color: "#44ff88",
    title: "Table statistics",
    description:
      "Column-level stats pulled from the database: distinct value counts, null fractions, most common values with frequencies, and min/max ranges.",
  },
  {
    icon: SlidersHorizontal,
    color: "#00d4ff",
    title: "Column configuration",
    description:
      "Show or hide columns per table, drag to reorder, resize by dragging dividers, and auto-fit to content. Preferences persist across sessions.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-16 text-center">
          <h2 className="underline-dashed font-semibold text-3xl text-text tracking-tight underline decoration-dashed underline-offset-4 lg:text-4xl">
            Featuring
          </h2>
        </div>

        <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.03}>
              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0" style={{ backgroundColor: feature.color }} />
                  <h3 className="font-semibold text-sm text-text">{feature.title}</h3>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
