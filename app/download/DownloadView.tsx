"use client";

import Link from "next/link";
import { CheckCircle, CloudFog, Copy, Download, Terminal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { BlueprintRule } from "@/components/ui/BlueprintRule";
import { ButtonOverlays } from "@/components/ui/ButtonOverlays";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { FadeIn } from "@/components/ui/FadeIn";
import { NoiseTexture } from "@/components/ui/NoiseTexture";
import { Diamond } from "@/components/ui/SectionBorder";
import { SkyParallax } from "@/components/ui/SkyParallax";
import { ThankYouModal } from "@/components/ui/ThankYouModal";
import { detectIsIntel, detectIsLinux } from "@/hooks/useDownload";
import { trackDownloadStarted } from "@/lib/analytics";
import { NAME } from "@/lib/constants";
import { DOWNLOAD_PAGE } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  body: string;
  image: string | null;
}

interface ManifestVersion {
  version: string;
  tag: string;
  date: string;
  downloads: {
    macos_arm64: string;
    macos_x64: string;
    linux_amd64?: string;
    linux_x86?: string;
  };
}

interface LatestRelease {
  version: string;
  pub_date: string;
  downloads: {
    macos_arm64: string;
    macos_x64: string;
    linux_amd64?: string;
    linux_x86?: string;
  };
}

interface DownloadViewProps {
  release: LatestRelease | null;
  versions: ManifestVersion[];
  changelogEntry: ChangelogEntry | null;
}

const VERSIONS_PER_PAGE = 15;

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function formatPubDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function filenameFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).pathname.split("/").pop() ?? null;
  } catch {
    return null;
  }
}

const markdownComponents: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 transition-colors hover:text-text"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-text text-xs">{children}</code>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
      <span>{children}</span>
    </li>
  ),
  p: ({ children }) => <p className="text-sm text-text-secondary leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
};

type ArchKey = "silicon" | "intel" | "linux_amd64" | "linux_x86";

export function DownloadView({ release, versions, changelogEntry }: DownloadViewProps) {
  const [isIntel, setIsIntel] = useState(false);
  const [isLinux, setIsLinux] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [versionPage, setVersionPage] = useState(0);
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsIntel(detectIsIntel());
    setIsLinux(detectIsLinux());
  }, []);

  const openThankYou = useCallback(() => setShowThankYou(true), []);
  const closeThankYou = useCallback(() => setShowThankYou(false), []);

  const totalPages = Math.max(1, Math.ceil(versions.length / VERSIONS_PER_PAGE));
  const visibleVersions = versions.slice(versionPage * VERSIONS_PER_PAGE, (versionPage + 1) * VERSIONS_PER_PAGE);
  const linuxAmd64Url = release?.downloads.linux_amd64;
  const linuxX86Url = release?.downloads.linux_x86;
  const linuxAvailable = Boolean(linuxAmd64Url || linuxX86Url);
  // Linux x86 and amd64 are distinct. OS detection cannot tell them apart,
  // so never mark a Linux card detected. On Linux, also do not recommend a Mac build.
  const detected: ArchKey | null = isLinux ? null : isIntel ? "intel" : "silicon";
  const siliconUrl = release?.downloads.macos_arm64;
  const intelUrl = release?.downloads.macos_x64;
  const siliconFile = filenameFromUrl(siliconUrl);
  const intelFile = filenameFromUrl(intelUrl);
  const linuxAmd64File = filenameFromUrl(linuxAmd64Url);
  const linuxX86File = filenameFromUrl(linuxX86Url);
  const buildCount = [siliconUrl, intelUrl, linuxAmd64Url, linuxX86Url].filter(Boolean).length;
  const showLinuxColumn =
    Boolean(linuxAmd64Url || linuxX86Url) ||
    versions.some((v) => Boolean(v.downloads.linux_amd64 || v.downloads.linux_x86));
  const showLinuxAmd64Column = showLinuxColumn;
  const showLinuxX86Column = showLinuxColumn;

  function handleDownload(arch: ArchKey) {
    trackDownloadStarted({
      architecture: arch,
      version: release?.version,
      source: arch === detected ? "download_section_button" : "download_page_alt_arch",
    });
    window.setTimeout(openThankYou, 600);
  }

  return (
    <div className="relative overflow-hidden pt-28 pb-24 lg:pt-36 lg:pb-32">
      <NoiseTexture variant="grain" opacity={0.4} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-glow-soft)_0%,transparent_55%)]" />

      <ContentContainer className="relative">
        <FadeIn>
          <div className="flex items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 flex-shrink-0 bg-accent" />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                {DOWNLOAD_PAGE.eyebrow}
              </span>
              <span className="font-mono text-[10px] text-text-muted/60 uppercase tracking-widest">{"//"}</span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                {DOWNLOAD_PAGE.channel}
              </span>
            </div>
            <Link
              href="/changelog"
              className="font-mono text-[10px] text-text-muted uppercase tracking-widest underline underline-offset-4 transition-colors hover:text-text"
            >
              {DOWNLOAD_PAGE.viewChangelog} &rarr;
            </Link>
          </div>

          <div
            ref={heroCardRef}
            className="relative overflow-hidden border border-border bg-surface-1/30 backdrop-blur-sm"
          >
            <SkyParallax targetRef={heroCardRef} />

            <Diamond className="absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2" />
            <Diamond className="absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2" />
            <Diamond className="absolute bottom-0 left-0 z-20 -translate-x-1/2 translate-y-1/2" />
            <Diamond className="absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 flex flex-col items-stretch px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-16">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
                  {NAME.full} / {linuxAvailable ? DOWNLOAD_PAGE.platformTagLinux : DOWNLOAD_PAGE.platformTag}
                </span>
                <h1 className="font-mono font-semibold text-5xl text-text leading-none lg:text-7xl">
                  {release ? (
                    <>
                      <span className="text-text-muted">v</span>
                      {release.version}
                    </>
                  ) : (
                    <span className="text-text-muted/60">{DOWNLOAD_PAGE.loading}</span>
                  )}
                </h1>
                <p className="mt-1 font-mono text-text-secondary text-xs tracking-wide">
                  {release ? (
                    <>
                      <span className="text-text-muted uppercase tracking-widest">Published</span>
                      <span className="ml-2 text-text-secondary">{formatPubDate(release.pub_date)}</span>
                    </>
                  ) : (
                    <span className="text-text-muted/60 uppercase tracking-widest">{DOWNLOAD_PAGE.loading}</span>
                  )}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 lg:mt-0 lg:items-end">
                <div className="inline-flex items-center gap-2 self-start border border-border bg-bg px-3 py-1.5 lg:self-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_6px_var(--color-green)]" />
                  <span className="font-mono text-[10px] text-text uppercase tracking-widest">Latest stable</span>
                </div>
                <p className="max-w-xs font-mono text-[10px] text-text-muted uppercase leading-relaxed tracking-widest lg:text-right">
                  Built in the Bay
                  <CloudFog className="ml-2 inline-block size-4" />
                </p>
              </div>
            </div>

            <a
              href="#all-versions"
              className="group relative z-10 flex items-center justify-between gap-4 border-border border-t bg-surface-1/50 px-6 py-4 backdrop-blur-sm transition-colors hover:bg-surface-1/70 lg:px-12 lg:py-5"
            >
              <div className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-4">
                <span className="font-display text-base text-text lg:text-lg">{DOWNLOAD_PAGE.olderHeading}</span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {DOWNLOAD_PAGE.allVersionsCount(versions.length)}
                </span>
              </div>
              <span className="flex items-center gap-2 font-mono text-[10px] text-text-muted uppercase tracking-widest transition-colors group-hover:text-text">
                Jump below
                <span className="text-[11px] text-text transition-transform group-hover:translate-y-0.5">&darr;</span>
              </span>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-16 lg:mt-24">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl text-text lg:text-3xl">{DOWNLOAD_PAGE.archHeading}</h2>
              <span className="hidden font-mono text-[10px] text-text-muted uppercase tracking-widest md:inline">
                {DOWNLOAD_PAGE.buildsAvailable(buildCount)}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              <ArchCard
                arch="silicon"
                isDetected={detected === "silicon"}
                url={siliconUrl}
                filename={siliconFile}
                onDownload={() => handleDownload("silicon")}
              />
              <ArchCard
                arch="intel"
                isDetected={detected === "intel"}
                url={intelUrl}
                filename={intelFile}
                onDownload={() => handleDownload("intel")}
              />
            </div>
            {showLinuxColumn && (
              <LinuxPlatform
                x86Url={linuxX86Url}
                amd64Url={linuxAmd64Url}
                x86File={linuxX86File}
                amd64File={linuxAmd64File}
                onDownload={handleDownload}
              />
            )}

            <p className="mt-6 text-center font-mono text-[10px] text-text-muted uppercase tracking-widest lg:text-left">
              {DOWNLOAD_PAGE.agreement}{" "}
              <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-text">
                {DOWNLOAD_PAGE.termsLabel}
              </Link>{" "}
              &middot;{" "}
              <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-text">
                {DOWNLOAD_PAGE.privacyLabel}
              </Link>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <HomebrewSection commands={DOWNLOAD_PAGE.homebrew.commands} heading={DOWNLOAD_PAGE.homebrew.heading} />
        </FadeIn>

        <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-5 lg:gap-12">
          <FadeIn delay={0.12} className="lg:col-span-3">
            <div className="mb-6 flex items-baseline justify-between gap-4 border-border border-b pb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {DOWNLOAD_PAGE.releaseNotesHeading}
                </span>
                {changelogEntry && (
                  <span className="font-mono font-semibold text-sm text-text">{changelogEntry.version}</span>
                )}
              </div>
              <Link
                href="/changelog"
                className="font-mono text-[10px] text-text-muted uppercase tracking-widest underline underline-offset-4 transition-colors hover:text-text"
              >
                {DOWNLOAD_PAGE.viewFullChangelog} &rarr;
              </Link>
            </div>

            {!changelogEntry ? (
              <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">
                {DOWNLOAD_PAGE.releaseNotesFallback}
              </p>
            ) : (
              <div className="space-y-3">
                <time
                  className="block font-mono text-[10px] text-text-muted uppercase tracking-widest"
                  dateTime={changelogEntry.date}
                >
                  {formatDate(changelogEntry.date)}
                </time>
                <ReactMarkdown components={markdownComponents}>{changelogEntry.body}</ReactMarkdown>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.16} className="lg:col-span-2">
            <div className="relative border border-border bg-surface-1/30 p-6 lg:p-8">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-cyan" />
                <h2 className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {DOWNLOAD_PAGE.requirementsHeading}
                </h2>
              </div>
              <dl className="divide-y divide-border">
                {DOWNLOAD_PAGE.requirements.map((req) => (
                  <div key={req.label} className="grid grid-cols-[auto_1fr] gap-6 py-3 first:pt-0 last:pb-0">
                    <dt className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{req.label}</dt>
                    <dd className="text-right text-sm text-text">
                      {Array.isArray(req.value) ? (
                        <span className="flex flex-col gap-0.5">
                          {req.value.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </span>
                      ) : (
                        req.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <section id="all-versions" className="mt-20 scroll-mt-28 lg:mt-28">
            <div className="mb-6 flex items-baseline justify-between gap-4 border-border border-b pb-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 flex-shrink-0 bg-accent" />
                <h2 className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {DOWNLOAD_PAGE.allVersionsHeading}
                </h2>
              </div>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                {DOWNLOAD_PAGE.allVersionsCount(versions.length)}
              </span>
            </div>
            <p className="mb-8 max-w-xl text-sm text-text-secondary leading-relaxed">
              {DOWNLOAD_PAGE.allVersionsDescription}
            </p>

            {versions.length === 0 ? (
              <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">
                {DOWNLOAD_PAGE.allVersionsError}
              </p>
            ) : (
              <div className="relative border border-border bg-surface-1/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-border border-b">
                        <th className="px-6 py-3 text-left font-mono text-[10px] text-text-muted uppercase tracking-widest">
                          {DOWNLOAD_PAGE.versionColumn}
                        </th>
                        <th className="px-6 py-3 text-left font-mono text-[10px] text-text-muted uppercase tracking-widest">
                          {DOWNLOAD_PAGE.releasedColumn}
                        </th>
                        <th className="px-6 py-3 text-right font-mono text-[10px] text-text-muted uppercase tracking-widest">
                          {DOWNLOAD_PAGE.siliconColumn}
                        </th>
                        <th className="px-6 py-3 text-right font-mono text-[10px] text-text-muted uppercase tracking-widest">
                          {DOWNLOAD_PAGE.intelColumn}
                        </th>
                        {showLinuxColumn && (
                          <th className="px-6 py-3 text-right font-mono text-[10px] text-text-muted uppercase tracking-widest">
                            {DOWNLOAD_PAGE.linuxColumn}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleVersions.map((v, i) => {
                        const isLatest = release?.version === v.version;
                        return (
                          <tr
                            key={v.tag}
                            className={cn(
                              "border-border transition-colors hover:bg-surface-1/50",
                              i < visibleVersions.length - 1 && "border-b",
                              isLatest && "bg-surface-1/30",
                            )}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-semibold text-sm text-text">{v.tag}</span>
                                {isLatest && (
                                  <span className="inline-flex items-center gap-1.5 border border-border bg-bg px-1.5 py-0.5 font-mono text-[9px] text-text uppercase tracking-widest">
                                    <span className="h-1 w-1 rounded-full bg-green shadow-[0_0_4px_var(--color-green)]" />
                                    {DOWNLOAD_PAGE.latestBadge}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-text-muted text-xs">{formatDate(v.date)}</td>
                            <td className="px-6 py-4 text-right">
                              <a
                                href={v.downloads.macos_arm64}
                                download
                                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-secondary underline underline-offset-4 transition-colors hover:text-accent"
                              >
                                <Download className="h-3 w-3" />
                                aarch64
                              </a>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <a
                                href={v.downloads.macos_x64}
                                download
                                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-secondary underline underline-offset-4 transition-colors hover:text-accent"
                              >
                                <Download className="h-3 w-3" />
                                x86_64
                              </a>
                            </td>
                            {showLinuxColumn && (
                              <td className="px-6 py-4 text-right">
                                <div className="flex flex-col items-end gap-1.5">
                                  {v.downloads.linux_x86 ? (
                                    <a
                                      href={v.downloads.linux_x86}
                                      download
                                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-secondary underline underline-offset-4 transition-colors hover:text-accent"
                                    >
                                      <Download className="h-3 w-3" />
                                      x86
                                    </a>
                                  ) : (
                                    <span className="font-mono text-[11px] text-text-muted">x86</span>
                                  )}
                                  {v.downloads.linux_amd64 ? (
                                    <a
                                      href={v.downloads.linux_amd64}
                                      download
                                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-secondary underline underline-offset-4 transition-colors hover:text-accent"
                                    >
                                      <Download className="h-3 w-3" />
                                      amd64
                                    </a>
                                  ) : (
                                    <span className="font-mono text-[11px] text-text-muted">amd64</span>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-border border-t px-6 py-3">
                    <button
                      type="button"
                      disabled={versionPage === 0}
                      onClick={() => setVersionPage((p) => p - 1)}
                      className="font-mono text-[11px] text-text-secondary uppercase tracking-widest transition-colors hover:text-text disabled:pointer-events-none disabled:opacity-30"
                    >
                      &larr; Prev
                    </button>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                      {versionPage + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={versionPage >= totalPages - 1}
                      onClick={() => setVersionPage((p) => p + 1)}
                      className="font-mono text-[11px] text-text-secondary uppercase tracking-widest transition-colors hover:text-text disabled:pointer-events-none disabled:opacity-30"
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </FadeIn>
      </ContentContainer>

      <ThankYouModal open={showThankYou} onClose={closeThankYou} />
    </div>
  );
}

function HomebrewCommandRow({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-2 transition-colors hover:bg-surface-1/50",
        copied && "bg-surface-1/50",
      )}
    >
      <code className="font-mono text-text text-xs">
        <span className="mr-2 select-none text-text-muted/50">$</span>
        {command}
      </code>
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-text-muted uppercase tracking-widest opacity-0 transition-[color,opacity] hover:text-text group-hover:opacity-100 [button:hover>&]:opacity-100">
        {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

function HomebrewSection({ commands, heading }: { commands: string[]; heading: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#homebrew") {
      setHighlight(true);
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const timer = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const allCommands = commands.join("\n");

  function handleCopyAll() {
    navigator.clipboard.writeText(allCommands).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div
      ref={ref}
      id="homebrew"
      className={cn(
        "mt-10 scroll-mt-28 transition-shadow duration-700 lg:mt-14",
        highlight && "shadow-[0_0_40px_-10px_var(--color-glow)]",
      )}
    >
      <div
        className={cn(
          "relative border bg-surface-1/30 transition-[border-color] duration-700",
          highlight ? "border-accent/50" : "border-border",
        )}
      >
        <div className="flex items-center justify-between gap-4 border-border border-b px-6 py-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-3 w-3 text-text-muted" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{heading}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyAll}
            className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-text-muted uppercase tracking-widest transition-colors hover:text-text"
          >
            {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy all"}
          </button>
        </div>
        <div className="py-1">
          {commands.map((cmd) => (
            <HomebrewCommandRow key={cmd} command={cmd} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LinuxPlatform({
  x86Url,
  amd64Url,
  x86File,
  amd64File,
  onDownload,
}: {
  x86Url: string | undefined;
  amd64Url: string | undefined;
  x86File: string | null;
  amd64File: string | null;
  onDownload: (arch: ArchKey) => void;
}) {
  const copy = DOWNLOAD_PAGE.linuxPlatform;
  return (
    <div className="mt-6 border border-dashed border-border/70 bg-surface-1/15 px-6 py-5 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{copy.eyebrow}</span>
            <span className="border border-border bg-bg px-1.5 py-0.5 font-mono text-[9px] text-text-muted uppercase tracking-widest">
              {copy.badge}
            </span>
          </div>
          <h3 className="mt-1 font-display text-xl text-text">{copy.label}</h3>
          <p className="mt-1 max-w-md text-sm text-text-secondary leading-relaxed">{copy.body}</p>
        </div>
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{copy.distro}</span>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <LinuxArchRow
          archLabel={copy.x86}
          url={x86Url}
          filename={x86File}
          cta={copy.cta}
          onDownload={() => onDownload("linux_x86")}
        />
        <LinuxArchRow
          archLabel={copy.amd64}
          url={amd64Url}
          filename={amd64File}
          cta={copy.cta}
          onDownload={() => onDownload("linux_amd64")}
        />
      </div>
      {amd64Url && (
        <p className="mt-4 font-mono text-[11px] text-text-muted">
          <span className="uppercase tracking-widest">{copy.amd64}</span>
          <code className="ml-2 text-text-secondary">{copy.installAmd64}</code>
        </p>
      )}
    </div>
  );
}

function LinuxArchRow({
  archLabel,
  url,
  filename,
  cta,
  onDownload,
}: {
  archLabel: string;
  url: string | undefined;
  filename: string | null;
  cta: string;
  onDownload: () => void;
}) {
  const disabled = !url;
  const className = cn(
    "flex items-center justify-between gap-3 border border-border/50 bg-bg/30 px-3 py-2.5 transition-colors",
    disabled ? "opacity-50" : "hover:border-border hover:bg-bg/50",
  );
  const inner = (
    <>
      <div className="min-w-0">
        <span className="font-mono text-xs text-text">{archLabel}</span>
        <span className="mt-0.5 block truncate font-mono text-[10px] text-text-muted">{filename ?? cta}</span>
      </div>
      <Download className="h-3.5 w-3.5 shrink-0 text-text-muted" />
    </>
  );
  if (disabled) {
    return <div className={className}>{inner}</div>;
  }
  return (
    <a href={url} download onClick={onDownload} className={className}>
      {inner}
    </a>
  );
}

interface ArchCardProps {
  arch: ArchKey;
  isDetected: boolean;
  url: string | undefined;
  filename: string | null;
  onDownload: () => void;
}

function ArchCard({ arch, isDetected, url, filename, onDownload }: ArchCardProps) {
  const info = arch === "intel" ? DOWNLOAD_PAGE.intel : DOWNLOAD_PAGE.silicon;
  const cta = DOWNLOAD_PAGE.downloadCta;
  const recommendedBadge = DOWNLOAD_PAGE.recommendedBadge;
  const disabled = !url;

  return (
    <div
      className={cn(
        "group relative flex flex-col border bg-surface-1/30 p-6 transition-[border-color,box-shadow] lg:p-8",
        isDetected ? "border-border shadow-[0_0_50px_-20px_var(--color-glow)]" : "border-border/60 hover:border-border",
      )}
    >
      <Diamond className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <Diamond className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" />
      <Diamond className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <Diamond className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5",
              isDetected ? "bg-accent shadow-[0_0_6px_var(--color-accent)]" : "bg-text-muted/30",
            )}
          />
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
            {isDetected ? recommendedBadge : DOWNLOAD_PAGE.alsoAvailable}
          </span>
        </div>
        <span className="font-mono text-[10px] text-text-muted/70 uppercase tracking-widest">{info.arch}</span>
      </div>

      <h3 className="font-display text-2xl text-text lg:text-3xl">{info.label}</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">{info.body}</p>

      <div className="relative my-6 h-px w-full">
        <BlueprintRule orientation="horizontal" className="inset-x-0" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="truncate font-mono text-[11px] text-text-muted">{filename ?? "—"}</span>
      </div>

      <div className="mt-6">
        {isDetected ? (
          <a
            href={url}
            {...(url ? { download: true } : { "aria-disabled": true })}
            onClick={disabled ? undefined : onDownload}
            className={cn(
              "group/btn relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded bg-accent px-6 py-3.5 font-mono text-white text-xs uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.12)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.12)]",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <ButtonOverlays grainOpacity={0.18} />
            <Download className="relative h-4 w-4" />
            <span className="relative">{cta}</span>
          </a>
        ) : (
          <a
            href={url}
            {...(url ? { download: true } : { "aria-disabled": true })}
            onClick={disabled ? undefined : onDownload}
            className={cn(
              "relative inline-flex w-full items-center justify-center gap-2.5 rounded border border-border border-dashed bg-transparent px-6 py-3.5 font-mono text-text-secondary text-xs uppercase tracking-widest transition-[color,border-color] duration-150 hover:border-border hover:text-text",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <Download className="h-4 w-4" />
            <span>{cta}</span>
          </a>
        )}
      </div>
    </div>
  );
}
