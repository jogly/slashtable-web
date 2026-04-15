/**
 * Centralized copy text for the marketing site.
 *
 * Every user-visible string lives here. Components import what they need
 * and handle presentation (styling, icons, images, colors) themselves.
 */

// ─── Hero ────────────────────────────────────────────────────────

export const HERO = {
  tooltipLabel: "Includes",
  tooltipItems: [
    { label: "A Data Editor", desc: "insert, update, and delete rows visually" },
    { label: "An SQL Editor", desc: "write and run queries with full results" },
    { label: "A Graph Viewer", desc: "explore relationships visually" },
    { label: "An MCP Server", desc: "safe AI access to live schema and data" },
  ],
  leader: "You aren\u2019t a database administrator. Use the right tool for the job.",
  ctaDownload: "Download for macOS",
  ctaFeatures: "See features",
  availability: "macOS \u00b7 PostgreSQL (beta) \u00b7 MySQL (alpha)",
  screenshotAlt:
    "SlashTable main window showing a data table with foreign key relationships highlighted and breadcrumb navigation \u2014 dark mode left, light mode right",
};

// ─── Schema Graph Section ────────────────────────────────────────

export const SCHEMA_GRAPH = {
  eyebrow: "Schema Graph",
  heading: "Beautiful ER diagrams without noise.",
  description:
    "Auto-layout your schema. Pin root tables to focus on, control graph depth to avoid clutter, search by name. What\u2019s left matches your mental model.",
  cta: "Try it free",
};

// ─── MCP Section ─────────────────────────────────────────────────

export const MCP = {
  eyebrow: "MCP Server",
  heading: "Controlled access for AI agents.",
  description:
    "Built-in MCP gives Claude, Cursor, or any MCP client regulated access to data. Agents never access credentials.",
  callouts: [
    {
      title: "AI guardrails",
      description:
        "All queries are validated and run in an engine-level READ ONLY transaction that always rolls back. Your data is safe, and agents can\u2019t accidentally (or intentionally) make changes.",
    },
    {
      title: "Schema introspection",
      description:
        "Agents can explore every table, column, type, and all their relationships, without overwhelming the token count.",
    },
    {
      title: "Live data queries",
      description:
        "SELECT against your actual database, or block all arbitrary SQL. Configure per-connection or globally for peace of mind.",
    },
  ],
  cta: "Try it free",
};

// ─── Plugin Section ──────────────────────────────────────────────

export const PLUGIN = {
  eyebrow: "Plugins",
  heading: "Bring Your Own Code.",
  pluginPath: "~/.slashtable/plugins/",
  intro:
    "Cell renderers, record enrichers, custom views, query hooks, toolbar actions, and themes. Write TypeScript, drop it in ~/.slashtable/plugins/.",
  capabilities: [
    "Cell renderers change how columns look",
    "Record enrichers attach external data to rows",
    "Custom views add new tab types",
    "Query hooks intercept SQL",
    "Toolbar actions wire into the active connection",
  ],
  codeFilename: "status-badge/main.ts",
  codeExample: `import { Plugin } from "slashtable";

export default class StatusBadge extends Plugin {
  onload() {
    this.registerCellRenderer({
      id: "order-status-badge",
      render(value, el) {
        const colors = {
          confirmed: "#44ff88",
          pending:   "#ffcc00",
          shipped:   "#00d4ff",
          cancelled: "#ff5555",
        };
        el.style.color = colors[value] ?? "#6b6860";
        el.textContent = value;
      },
    });
  }
}`,
};

// ─── Features Grid ───────────────────────────────────────────────

export const FEATURES_GRID = {
  eyebrow: "Every plan",
  heading: "Batteries included.",
  description: "",
  features: [
    {
      title: "SQL editor",
      description:
        "Autocomplete that knows your schema, tables, and columns. Multi-statement execution with per-statement timing. Auto-format for the queries you\u2019re not proud of.",
    },
    {
      title: "Multiple connections",
      description:
        "Connect to dev, staging, and prod at the same time. Each connection keeps its own tabs and state. Alt-tab between databases.",
    },
    {
      title: "Safe data mutations",
      description:
        "Edit rows inline. Changes queue with a SQL diff preview before anything commits. Revert one edit, or nuke them all.",
    },
    {
      title: "Read-only enforcement",
      description:
        "Keyword scanning, query parsing, and a transaction-level rollback. Three layers between your agent and a write query. Belt, suspenders, and a parachute.",
    },
    {
      title: "Docker auto-detection",
      description:
        "Finds your running Postgres and MySQL containers and pulls credentials from their env vars. No YAML required.",
    },
    {
      title: "Credential vaults",
      description:
        "Pull credentials from System Keychain or 1Password. Browse vaults, pick an item, connect. Passwords stay out of your shell history.",
    },
    {
      title: "Virtual scrolling",
      description:
        "Renders only what\u2019s on screen. Scroll through millions of rows without pagination, memory spikes, or a LIMIT clause you\u2019ll forget to remove.",
    },
    {
      title: "Saved views",
      description:
        "Save filters, sorts, and column layout as a named view. Open it next week and everything is exactly where you left it.",
    },
    {
      title: "Dark & light themes",
      description:
        "Dark by default. Light for the brave. CSS-variable theming so plugins can match your terminal color scheme.",
    },
    {
      title: "Connection organization",
      description:
        "Folders, color tags, and environment badges (prod, dev, staging). Tell databases apart at a glance. Run a query against the wrong one less often.",
    },
    {
      title: "Tab management",
      description:
        "Explorer, SQL, and Schema Graph tabs with independent state. Keyboard shortcuts to jump between them. Drag to reorder because we\u2019re civilized.",
    },
    {
      title: "Semantic column types",
      description:
        "Detects emails, URLs, images, currency, and dates in your data. Renders them as clickable links, formatted values, and relative timestamps.",
    },
    {
      title: "SQL execution logging",
      description:
        "Every query logged with timing, row count, and parameters. When something goes wrong at 2am, you\u2019ll know exactly which query did it.",
    },
    {
      title: "Instant tab restore",
      description:
        "Switch tabs or restart the app. Your last query results are already there. No re-running queries, no loading spinners.",
    },
    {
      title: "Table statistics",
      description:
        "Distinct counts, null fractions, most common values, min/max ranges. The stats your database already tracks, surfaced where you can see them.",
    },
    {
      title: "Column configuration",
      description:
        "Show, hide, reorder, resize. Preferences persist across sessions. The grid remembers how you like it.",
    },
    {
      title: "Regret-driven development",
      description:
        "Every destructive action shows a SQL preview and a confirmation dialog. The UI actively discourages you from doing anything you\u2019d have to explain in a postmortem.",
    },
    {
      title: "And more...",
      description:
        "Just download the app and find out what wouldn\u2019t fit in the list. New features and improving existing ones based on user feedback every week.",
    },
  ],
};

// ─── Navigation Section ──────────────────────────────────────────

export const NAVIGATION = {
  eyebrow: "Navigation",
  heading: "Bidirectional FK navigation.",
  body: [
    "Click a foreign key value to drill into the related records. A novel breadcrumb tree tracks your full path and every level is clickable.",
    "Reverse FK lookups show every record that points to the current one. Pure join tables collapse into direct relationships so navigation stays clean.",
    "Stack your own filters on top and keep drilling without losing context.",
  ],
  cta: "Try it free",
};

// ─── Value Pillars ───────────────────────────────────────────────

export const VALUE_PILLARS = {
  pillars: [
    {
      title: "Click through your data",
      body: "A graph navigation model so good it will convert keyboard diehards. FKs, reverse FKs, join tables, all navigable.",
    },
    {
      title: "Safe access for AI agents",
      body: "Built-in MCP server. Agents query the schema, get live data, and never see the credentials, while keeping the token count to a minimum.",
    },
    {
      title: "Screenshot-worthy schema diagrams",
      body: "Create bespoke ER diagrams of important tables, hide the rest. Pin nodes, hide annoying tables, highlight edges. Get the perfect shot for your RFC.",
    },
  ],
};

// ─── Download Section ────────────────────────────────────────────

export const DOWNLOAD = {
  heading: ["/table", ".app"],
  description: "Built with Rust and React.",
  appLabel: "/table",
  folderLabel: "Downloads",
  dragHint: "Drag to download",
  downloading: "Downloading\u2026",
  buttonFallback: "Or if you\u2019re, like, really into buttons",
  downloadLabel: "Download for Mac",
  altAvailableLabel: "Also available for",
  platformNotice: "macOS only \u00b7 PostgreSQL (beta) \u00b7 MySQL (alpha)",
  moreVersionsLabel: "All versions & older builds",
};

// ─── Dedicated /download page ───────────────────────────────

export const DOWNLOAD_PAGE = {
  eyebrow: "Release",
  channel: "Stable channel",
  platformTag: "macOS",
  loading: "Checking\u2026",
  unavailable: "Release feed unavailable",
  viewChangelog: "View changelog",
  archHeading: "Pick your architecture",
  recommendedBadge: "Detected for your Mac",
  alsoAvailable: "Also available",
  downloadCta: "Download .dmg",
  silicon: {
    label: "Apple Silicon",
    arch: "aarch64",
    body: "M-series Macs",
  },
  intel: {
    label: "Intel",
    arch: "x86_64",
    body: "Intel-based Macs running macOS 12 or later.",
  },
  requirementsHeading: "System requirements",
  requirements: [
    { label: "Operating system", value: "macOS 12.0 Monterey or later" },
    { label: "Architecture", value: "Apple Silicon or Intel" },
    { label: "Databases", value: ["PostgreSQL 12+ (beta)", "MySQL 8.0+ (alpha)"] },
    { label: "Install size", value: "~40 MB" },
  ],
  releaseNotesHeading: "In this release",
  releaseNotesFallback: "Release notes will appear here once the feed is available.",
  viewFullChangelog: "View full changelog",
  olderHeading: "Looking for an older build?",
  allVersionsHeading: "All versions",
  allVersionsCount: (n: number) => `${n} release${n === 1 ? "" : "s"}`,
  allVersionsDescription: "You like the classic stuff, eh?",
  versionColumn: "Version",
  releasedColumn: "Released",
  siliconColumn: "Apple Silicon",
  intelColumn: "Intel",
  latestBadge: "Latest",
  allVersionsError: "Version manifest unavailable. Try again in a moment.",
  allVersionsLoading: "Loading versions\u2026",
  agreement: "By downloading, you agree to the",
  termsLabel: "terms",
  privacyLabel: "privacy policy",
};

// ─── Thank You Modal ────────────────────────────────────────

export const THANK_YOU = {
  heading: "Thank you.",
  body: "I\u2019m building SlashTable full-time as a solo developer. Every download genuinely means a lot. If you\u2019d be open to sharing your email, I\u2019d love to follow up and hear how things go.",
  emailPlaceholder: "you@company.com",
  emailSubmit: "Keep me posted",
  emailSuccess: "You\u2019re on the list. Thank you again.",
  close: "Close",
};

// ─── Contact Sales Modal ────────────────────────────────────────

export const CONTACT_SALES = {
  heading: "Contact Sales",
  body: "Reach out and we\u2019ll help you figure out the right plan for your team.",
  email: "sales@slashtable.dev",
  close: "Close",
};

// ─── Community Section ───────────────────────────────────────────

export const COMMUNITY = {
  eyebrow: "Community",
  heading: "Build with us",
  description: "Come watch, or come help. Let me know what you think.",
  links: [
    {
      title: "Discord",
      description: "Bug reports, feature debates, and the occasional hot take on ORMs.",
      cta: "Join the server",
    },
    {
      title: "Twitter / X",
      description: "Release notes, feature previews, and questionable database opinions.",
      cta: "Follow us",
    },
  ],
};

// ─── Nav ─────────────────────────────────────────────────────────

export const NAV = {
  logoAlt: "slashtable",
  desktopLinks: [
    { label: "Features", hash: "features" },
    { label: "MCP", hash: "mcp" },
    { label: "Schema", hash: "schema" },
  ],
  pricing: "Pricing",
  changelog: "Changelog",
  download: "Download",
  mobileLinks: [
    { label: "Features", to: "/" as const, hash: "features", color: "var(--color-green)" },
    { label: "MCP Server", to: "/" as const, hash: "mcp", color: "var(--color-cyan)" },
    { label: "Schema Graph", to: "/" as const, hash: "schema", color: "var(--color-magenta)" },
    { label: "Pricing", to: "/pricing" as const, color: "var(--color-yellow)" },
    { label: "Changelog", to: "/changelog" as const, color: "var(--color-orange)" },
  ],
};

// ─── Footer ──────────────────────────────────────────────────────

export const FOOTER = {
  tagline: "The database client for product engineers.",
  sections: [
    {
      title: "Product",
      links: [
        { label: "Pricing", to: "/pricing" },
        { label: "Changelog", to: "/changelog" },
        { label: "Download", to: "/download" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Discord", href: "https://discord.gg/xR2VdkfnJQ" },
        { label: "Twitter / X", href: "https://x.com/slashtable" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", to: "/privacy" },
        { label: "Terms", to: "/terms" },
      ],
    },
  ],
  copyright: "Make Toast LLC",
};

// ─── Pricing ────────────────────────────────────────────────────

const SITE_URL = "https://slashtable.dev";

export function polarCheckoutUrl(polarId: string) {
  const successUrl = `${SITE_URL}/checkout/success?cid={CHECKOUT_ID}`;
  return `https://buy.polar.sh/${polarId}?success_url=${encodeURIComponent(successUrl)}`;
}

export const PRICING = {
  eyebrow: "Pricing",
  heading: "Pay once. Or bring the team.",
  description: "Individual plans are one-time purchases. Team plans are per seat. Updates are free on every plan.",
  perpetual: "Buy once, yours forever. Updates included.",
  earlyAccess: {
    eyebrow: "Early access pricing",
    body: "Personal and Pro are discounted for early access purchasers as a personal thank you for supporting the development.",
  },
  tiers: [
    {
      name: "Free",
      price: "$0",
      description: "One connection. Every feature.",
      features: ["1 active connection", "Unlimited tabs", "macOS Keychain"],
      cta: "Download",
    },
    {
      name: "Personal",
      price: "$49",
      salePrice: "$29",
      description: "For multi-tasking engineers",
      features: ["3 active connections", "Unlimited tabs", "macOS Keychain", "Docker DB sync"],
      role: { tag: "@supporter", color: "#00d4ff" },
      cta: "Buy Personal",
      polarId: "polar_cl_kJYdwT8vY6W1YVXo4URTlgc30xiJYByWAcJvO0zrnze",
    },
    {
      name: "Pro",
      price: "$99",
      salePrice: "$49",
      description: "Fully unlocked.",
      features: ["Unlimited connections", "Unlimited tabs", "Remote credential vaults", "Docker DB sync"],
      role: { tag: "@pro", color: "#ffcc00" },
      cta: "Buy Pro",
      polarId: "polar_cl_1NN5jsryvYvCWHaUko29tm9ht29Apf8bFB3T21GLMEc",
    },
    {
      name: "Team",
      price: "$29",
      pricePer: "seat / mo",
      priceBilling: "billed annually",
      priceAlt: "$35/seat/mo billed monthly",
      description: "",
      features: [
        "Unlimited connections",
        "Unlimited tabs",
        "Remote credential vaults",
        "Centralized license management",
        "Shared connection library",
      ],
      cta: "Contact Sales",
    },
  ],
  vaults: {
    label: "Remote credential vaults",
    providers: [
      { name: "1Password", status: "available" as const },
      { name: "Bitwarden", status: "alpha" as const },
      { name: "AWS Secrets Manager", status: "alpha" as const },
      { name: "HashiCorp Vault", status: "alpha" as const },
    ],
  },
  faq: {
    heading: "Questions",
    items: [
      {
        q: "What happens after I buy?",
        a: "License key via email. Settings \u2192 License \u2192 paste \u2192 Activate. Under a minute.",
      },
      {
        q: "Is this a subscription?",
        a: "Free, Personal, and Pro are one-time purchases. Yours forever. Team is per seat, billed monthly or annually. Updates are free on every plan.",
      },
      {
        q: "Can I upgrade from Personal to Pro?",
        a: "Yes. Pay the difference and your license upgrades instantly. No need to re-download or re-activate.",
      },
      {
        q: "Can I use it on multiple devices?",
        a: "One key, any device where you\u2019re the primary user.",
      },
      {
        q: "Do license keys require an internet connection?",
        a: "No. License keys are validated offline. Once activated, SlashTable never phones home.",
      },
      {
        q: "What are remote credential vaults?",
        a: "Pull database credentials from a secret manager instead of copy-pasting. 1Password is fully supported. Bitwarden, AWS Secrets Manager, and HashiCorp Vault are in alpha. Free and Personal tiers use macOS Keychain only.",
      },
    ],
  },
};

// ─── Changelog ───────────────────────────────────────────────────

export const CHANGELOG = {
  eyebrow: "Changelog",
  heading: "What\u2019s new in /table",
  description: "What shipped, what broke, what\u2019s next.",
};
