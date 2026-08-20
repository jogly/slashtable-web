import { useCallback, useEffect, useRef, useState } from "react";
import { type DownloadSource, trackDownloadStarted } from "../lib/analytics";

interface LatestRelease {
  version: string;
  pub_date: string;
  downloads: {
    macos_arm64: string;
    macos_x64: string;
    linux_amd64?: string;
  };
}

type NavigatorUAData = {
  architecture?: string;
  platform?: string;
};

function getUserAgentData(): NavigatorUAData | undefined {
  return (navigator as unknown as { userAgentData?: NavigatorUAData }).userAgentData;
}

export function detectIsIntel(): boolean {
  // Runs during the lazy `useState` initializer, which executes on SSR too —
  // navigator is browser-only so guard before touching it.
  if (typeof navigator === "undefined") return false;
  const arch = getUserAgentData()?.architecture;
  if (arch) return arch === "x86";
  return false;
}

export function detectIsLinux(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform = getUserAgentData()?.platform;
  if (platform) return /linux/i.test(platform);
  return /linux/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent);
}

export function useDownload() {
  const [release, setRelease] = useState<LatestRelease | null>(null);
  // Start false on server + first client paint to keep hydration stable, then
  // detect on mount. Intel users see a Silicon-default UI for one frame.
  const [isIntel, setIsIntel] = useState(false);
  const [isLinux, setIsLinux] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const timerRef = useRef<number>(undefined);

  useEffect(() => {
    setIsIntel(detectIsIntel());
    setIsLinux(detectIsLinux());
    fetch("https://downloads.slashtable.dev/latest.json")
      .then((r) => r.json())
      .then(setRelease)
      .catch(() => {});
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const linuxAvailable = Boolean(release?.downloads.linux_amd64);
  const linuxPrimary = isLinux && linuxAvailable;

  const primary = release
    ? linuxPrimary
      ? release.downloads.linux_amd64
      : isIntel
        ? release.downloads.macos_x64
        : release.downloads.macos_arm64
    : undefined;
  const secondary =
    release && !linuxPrimary ? (isIntel ? release.downloads.macos_arm64 : release.downloads.macos_x64) : undefined;
  const label = linuxPrimary ? "Linux" : isIntel ? "Intel" : "Silicon";
  const altLabel = linuxPrimary ? "" : isIntel ? "Silicon" : "Intel";
  const architecture: "linux" | "intel" | "silicon" = linuxPrimary ? "linux" : isIntel ? "intel" : "silicon";

  const openThankYou = useCallback(() => setShowThankYou(true), []);

  const triggerDownload = useCallback(
    (source: DownloadSource = "download_section_button") => {
      if (!primary) return;
      trackDownloadStarted({
        architecture,
        version: release?.version,
        source,
      });
      const a = document.createElement("a");
      a.href = primary;
      a.download = "";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      timerRef.current = window.setTimeout(() => setShowThankYou(true), 500);
    },
    [primary, architecture, release],
  );

  const closeThankYou = useCallback(() => setShowThankYou(false), []);

  return {
    release,
    isIntel,
    isLinux,
    linuxAvailable,
    linuxPrimary,
    architecture,
    primary,
    secondary,
    label,
    altLabel,
    showThankYou,
    openThankYou,
    closeThankYou,
    triggerDownload,
  };
}
