import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface LatestRelease {
  version: string;
  pub_date: string;
  downloads: {
    macos_arm64: string;
    macos_x64: string;
  };
}

function detectIsIntel(): boolean {
  // userAgentData is reliable (Chromium only); Safari reports "Intel" in UA even on Apple Silicon
  const arch = (navigator as unknown as { userAgentData?: { architecture?: string } }).userAgentData?.architecture;
  if (arch) return arch === "x86";
  // No userAgentData — default to Apple Silicon (safer guess for modern Macs)
  return false;
}

export function DownloadSection() {
  const [release, setRelease] = useState<LatestRelease | null>(null);
  const [isIntel] = useState(() => detectIsIntel());

  useEffect(() => {
    fetch("https://downloads.slashtable.dev/latest.json")
      .then((r) => r.json())
      .then(setRelease)
      .catch(() => {});
  }, []);

  const primary = release ? (isIntel ? release.downloads.macos_x64 : release.downloads.macos_arm64) : undefined;
  const secondary = release ? (isIntel ? release.downloads.macos_arm64 : release.downloads.macos_x64) : undefined;
  const label = isIntel ? "Intel" : "Apple Silicon";
  const altLabel = isIntel ? "Apple Silicon" : "Intel";

  return (
    <section id="download" className="py-20 lg:py-24">
      <div className="mx-auto max-w-[68rem] px-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-2 w-2 flex-shrink-0 bg-cyan" />
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Download</span>
        </div>

        <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
          Get <span className="font-mono tracking-tighter">/table</span> for Mac
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
          Native macOS app. Built with Tauri and Rust.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={primary}
            {...(primary ? { download: true } : { "aria-disabled": true })}
            className={`inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-black text-xs uppercase tracking-widest transition-colors hover:bg-white${
              !primary ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="flex flex-wrap justify-center gap-x-1">
              <span className="whitespace-nowrap">Download for Mac</span>
              <span className="whitespace-nowrap">({label})</span>
            </span>
            {release && <span className="whitespace-nowrap opacity-60">&mdash; v{release.version}</span>}
          </a>

          <a
            href={secondary}
            {...(secondary ? { download: true } : { "aria-disabled": true })}
            className={`font-mono text-[10px] text-text-muted uppercase tracking-widest underline underline-offset-2 transition-colors hover:text-text${
              !secondary ? "pointer-events-none invisible" : ""
            }`}
          >
            Also available for {altLabel}
          </a>
        </div>

        <p className="mt-8 font-mono text-[10px] text-text-muted uppercase tracking-widest">
          Windows &middot; Linux &mdash; Coming soon
        </p>
      </div>
    </section>
  );
}
