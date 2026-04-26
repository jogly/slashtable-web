/**
 * Centralized copy text for the marketing site.
 *
 * Every user-visible string lives here. Components import what they need
 * and handle presentation (styling, icons, images, colors) themselves.
 */

import { SITE_URL } from "./constants";

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
  availability: "macOS \u00b7 Postgres \u00b7 MySQL \u00b7 SQLite \u00b7 Neon",
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
    "Two clicks of setup for Claude Desktop, Claude Code, Cursor, or Windsurf. Per-connection policy: hidden, read, or write. Every call is logged.",
  callouts: [
    {
      title: "Battle-tested guardrails",
      description:
        "Statement-level keyword filter plus an engine-level READ ONLY transaction that always rolls back. Two independent layers between an agent and a write.",
    },
    {
      title: "Schema introspection",
      description:
        "Agents explore tables, columns, types, and relationships \u2014 and can request a scoped schema graph from a starting table instead of dumping the universe.",
    },
    {
      title: "Per-connection access",
      description:
        "Mark prod as hidden so the agent can\u2019t even see it. Let it rip on dev. The MCP Log tab shows every request with method, tool, connection, and duration.",
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
  heading: "Everything else.",
  description: "",
  features: [
    {
      title: "SQL editor",
      description:
        "Autocomplete that knows your schema, tables, and columns. Multi-statement execution with per-statement timing. Auto-format for the queries you\u2019re not proud of. Run active query (\u2303\u23ce), all (\u21e7\u23ce), or selection (\u2318\u23ce).",
    },
    {
      title: "Filter from the keyboard",
      description:
        "Press f in any table to start typing. One command input instead of a builder. NOT toggle is its own switch. Fuzzy match across columns and the command palette too.",
    },
    {
      title: "Saved favorites",
      description:
        "Pin a configured filter set to a table. Drag to reorder, drop into folders. The filters you reach for, where you reach for them.",
    },
    {
      title: "Array & JSON cell editors",
      description:
        "First-class editors for text[], int[], uuid[], and json/jsonb cells. No more composing literal SQL by hand.",
    },
    {
      title: "Safe data mutations",
      description:
        "Edit rows inline. Changes queue with a SQL diff preview before anything commits. Revert one edit, or nuke them all.",
    },
    {
      title: "Schema-aware grid",
      description:
        "Composite primary keys, Postgres user-defined types (enums, domains, citext), and inet/cidr render and edit correctly. Fewer 'your schema isn\u2019t supported' walls.",
    },
    {
      title: "Virtual scrolling",
      description:
        "Renders only what\u2019s on screen. Scroll through millions of rows and 200-column tables without pagination, memory spikes, or a LIMIT clause you\u2019ll forget to remove.",
    },
    {
      title: "Schema graph, scoped",
      description:
        "Open a graph from any table\u2019s context menu and start there, not in a 500-node soup. Adjust depth, pin starting tables, hide the noise.",
    },
    {
      title: "Prefix grouping",
      description:
        "Snake- or camel-case tokenizer rolls user_*, billing_*, and friends into collapsible groups in the Explorer. Real schemas with hundreds of tables stop being a scroll-fatigue exercise.",
    },
    {
      title: "Customizable keybindings",
      description:
        "Every global action is rebindable, with multiple bindings per action. Make the app fit your hands.",
    },
    {
      title: "Connection paint",
      description:
        "Color-and-icon tags on connections. Trivial to set up, surprisingly load-bearing once you have prod, staging, and dev side by side.",
    },
    {
      title: "Connection organization",
      description:
        "Folders, color tags, and environment badges. Tell databases apart at a glance. Run a query against the wrong one less often.",
    },
    {
      title: "Tab workspaces per connection",
      description:
        "Explorer, SQL, and Schema Graph tabs with independent state, preserved per connection and per database. Switching context doesn\u2019t blow away your open tables.",
    },
    {
      title: "Command palette",
      description:
        "\u2318K opens it. New connection, disconnect, reconnect (\u21e7R), release notes \u2014 all from the keyboard. Keyword aliases too.",
    },
    {
      title: "Semantic column types",
      description:
        "Detects emails, URLs, images, currency, and dates. Renders them as clickable links, formatted values, and relative timestamps. Per-column override.",
    },
    {
      title: "SQL execution logging",
      description:
        "Every query logged with timing, row count, and parameters. When something goes wrong at 2am, you\u2019ll know exactly which query did it.",
    },
    {
      title: "Regret-driven development",
      description:
        "Every destructive action shows a SQL preview and a confirmation dialog. The UI actively discourages you from doing anything you\u2019d have to explain in a postmortem.",
    },
    {
      title: "And more...",
      description: "Download the app and find out what didn\u2019t fit in this list. Shipping daily.",
    },
  ],
};

// ─── Connect Section ─────────────────────────────────────────────

export const CONNECT = {
  eyebrow: "Connect",
  heading: "Find your databases. Or let them find you.",
  description:
    "A normal day is three worktrees, two compose stacks, and a bastion host. /table lives in that mess.",
  items: [
    {
      title: "Docker auto-detect",
      body: "Detects running Postgres and MySQL containers, reads creds from their env, and groups them by docker-compose project. Spin a stack up, your DB is in the sidebar. Tear it down, it’s gone.",
    },
    {
      title: "Neon branch sync",
      body: "Paste a Neon API key. Every project and branch shows up automatically. Create a branch from a PR, it appears; delete it, it disappears.",
    },
    {
      title: "Multi-database, one connection",
      body: "Hit ⌘D to flip between every database on the server. Each one keeps its own tabs, so context switching doesn’t blow away your work.",
    },
    {
      title: "First-class SSH tunneling",
      body: "Production behind a bastion is a normal connection, not a hack with a separate terminal window.",
    },
    {
      title: "From the terminal you’re in",
      body: "slashtable postgres://user:pw@host/db opens the app on that connection. Drop it in package.json scripts or .envrc — your terminal muscle memory works.",
    },
    {
      title: "Credentials where they already live",
      body: "macOS Keychain, 1Password, Bitwarden, AWS Secrets Manager, HashiCorp Vault. Stop pasting passwords into text fields.",
    },
  ],
  cta: "Try it free",
};

// ─── Navigation Section ──────────────────────────────────────────

export const NAVIGATION = {
  eyebrow: "Navigation",
  heading: "Bidirectional FK navigation.",
  body: [
    "Click a foreign key value to drill into the related records. A novel breadcrumb tree tracks your full path and every level is clickable.",
    "Reverse FK lookups show every record that points to the current one. Pure join tables collapse into direct relationships so navigation stays clean.",
    "Stack your own filters on top and keep drilling. Traverse the tree from the keyboard with ⌘← ⌘→ ⌘↑ ⌘↓ — no mouse required.",
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
      title: "Connects to where you work",
      body: "Docker containers, Neon branches, SSH-tunneled prod, SQLite files. Spin one up, /table picks it up. Tear it down, it’s gone.",
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
  platformNotice: "macOS only \u00b7 Postgres \u00b7 MySQL \u00b7 SQLite \u00b7 Neon",
  moreVersionsLabel: "All versions & older builds",
  homebrewHint: "Also available via",
  homebrewCommand: "brew install slashtable",
  homebrewTapNote: "brew tap slashtable/cask",
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
    { label: "Databases", value: ["PostgreSQL 12+", "MySQL 8.0+", "SQLite", "Neon"] },
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
  homebrew: {
    heading: "Install via Homebrew",
    description: "Prefer the terminal? Install and update with Homebrew.",
    commands: ["brew tap slashtable/cask", "brew install slashtable"],
  },
  agreement: "By downloading, you agree to the",
  termsLabel: "terms",
  privacyLabel: "privacy policy",
};

// ─── Thank You Modal ────────────────────────────────────────

export const THANK_YOU = {
  photoAlt: "Joe, waving from somewhere on the coast",
  heading: "Thanks. Really.",
  body: "Hey, I\u2019m Joe. I work on /table full-time, solo. You downloading this means more than you\u2019d think. If you\u2019d like, drop your email and I\u2019ll send a note when something lands that\u2019s worth your time. Written by me, a real human boy,",
  signatureAlt: "Joe",
  emailPlaceholder: "you@company.com",
  emailSubmit: "Keep me posted",
  emailSubmitting: "Sending\u2026",
  emailSuccess: ["You\u2019re on the list.", "Thanks again \u2014 talk soon."],
  emailInvalid: "That email doesn\u2019t look right.",
  emailRateLimited: "Too many signups from here \u2014 give it a minute and try again.",
  emailError: "Something went wrong. Try again?",
  close: "Close",
};

export const KEEP_POSTED = {
  linkLabel: "Keep me posted \u2192",
  mobileLinkLabel: "Email me the link \u2192",
  heading: "Let\u2019s be friends.",
  body: "Hey, I\u2019m Joe. I build /table full-time, solo. It sincerely helps knowing others are interested in the progress of this endeavor. Leave your email and I\u2019ll ping you when something cool ships. Thanks,",
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

// ─── Cookie Consent ─────────────────────────────────────────────

export const COOKIE_CONSENT = {
  heading: "The legally-required cookie banner",
  body: "We use one analytics cookie (PostHog) to see what\u2019s working. No third-party tracking or ads.",
  accept: "That's fine",
  decline: "No thanks",
};

// ─── Pricing ────────────────────────────────────────────────────

export function polarCheckoutUrl(polarId: string) {
  const successUrl = `${SITE_URL}/checkout/success?cid={CHECKOUT_ID}`;
  return `https://buy.polar.sh/${polarId}?success_url=${encodeURIComponent(successUrl)}`;
}

export const PRICING = {
  eyebrow: "Pricing",
  heading: "Pay once. Or bring the team.",
  description: "Individual plans are one-time purchases. Team plans are per seat. Updates are free on every plan.",
  perpetual: "Buy once, yours forever.",
  earlyAccess: {
    eyebrow: "Early access pricing",
    body: "Personal and Pro are discounted for early access purchasers as a personal thank you for supporting the development.",
  },
  tiers: [
    {
      name: "Free",
      price: "$0",
      description: "One connection. Every feature.",
      features: ["1 active connection", "Unlimited tabs", "3 Neon branches synced"],
      cta: "Download",
    },
    {
      name: "Personal",
      price: "$49",
      salePrice: "$29",
      description: "For multi-tasking engineers",
      features: ["3 active connections", "Unlimited tabs", "10 Neon branches synced", "Docker DB sync"],
      role: { tag: "@supporter", color: "var(--color-role-supporter)" },
      cta: "Buy Personal",
      polarId: "polar_cl_kJYdwT8vY6W1YVXo4URTlgc30xiJYByWAcJvO0zrnze",
    },
    {
      name: "Pro",
      price: "$99",
      salePrice: "$49",
      description: "Fully unlocked.",
      features: [
        "Unlimited connections",
        "Unlimited tabs",
        "Unlimited Neon branches synced",
        "Docker DB sync",
        "Remote credential vaults",
      ],
      role: { tag: "@pro", color: "var(--color-role-pro)" },
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
        "Unlimited Neon branches synced",
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
    eyebrow: "FAQ",
    heading: "You have questions.",
    items: [
      {
        q: "What happens after I buy?",
        a: "You\u2019ll be taken to Polar where you can access a customer portal to view and manage all keys purchased. To activate, open Settings \u2192 License in the app and paste your key.",
      },
      {
        q: "Is this a subscription?",
        a: "Free, Personal, and Pro are one-time purchases. Yours forever. Team is per seat, billed monthly or annually. Updates are free on every plan.",
      },
      {
        q: "Can I upgrade from Personal to Pro?",
        a: "Yes. Visit the [upgrade page](/upgrade), paste your license key, and pay the difference. Your new Pro key arrives via email \u2014 paste it in the app and you\u2019re done.",
      },
      {
        q: "Can I use it on multiple devices?",
        a: "One key, any device where you\u2019re the primary user.",
      },
      {
        q: "Do license keys require an internet connection?",
        a: "An internet connection is required to activate your license key. After that, it\u2019s completely offline forever. You may need to reconnect to refresh entitlements added after your purchase \u2014 this can be done in-app.",
      },
      {
        q: "How does the Neon.tech integration work?",
        a: "Connect your Neon account and /table keeps your database branches in sync so you can jump between them without reconfiguring connections. Free includes 3 synced branches, Personal includes 10, and Pro is unlimited.",
      },
      {
        q: "What are remote credential vaults?",
        a: "Pull database credentials from a secret manager instead of copy-pasting. 1Password is fully supported. Bitwarden, AWS Secrets Manager, and HashiCorp Vault are in alpha.",
      },
    ],
  },
  upgradeLink: "Already on Personal? \u2192 Upgrade to Pro",
};

// \u2500\u2500\u2500 Upgrade \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export const UPGRADE = {
  eyebrow: "Upgrade",
  heading: "Upgrade to Pro",
  description: "Already on Personal? Paste your license key below and pay the difference.",
  keyPlaceholder: "Paste your license key",
  keyHint: "Find your key in Settings \u2192 License inside the app.",
  cta: "Continue",
  redirecting: "Redirecting to checkout\u2026",
  errors: {
    not_eligible: "This key isn\u2019t eligible for upgrade. Only Personal licenses can upgrade to Pro.",
    checkout_failed: "Something went wrong creating checkout. Try again in a moment.",
    network: "Couldn\u2019t reach the server. Check your connection.",
  },
};

// ─── Changelog ───────────────────────────────────────────────────

export const CHANGELOG = {
  eyebrow: "Changelog",
  heading: "What\u2019s new in /table",
  description: "What shipped, what broke, what\u2019s next.",
};
