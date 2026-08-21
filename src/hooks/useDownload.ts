import { useCallback, useEffect, useRef, useState } from "react";
import { type DownloadSource, trackDownloadStarted } from "../lib/analytics";

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

  const linuxAvailable = Boolean(release?.downloads.linux_amd64 || release?.downloads.linux_x86);
  // Never treat Linux as the primary download. x86 and amd64 are distinct and
  // OS detection cannot tell them apart, so the user has to pick on /download.
  const linuxChooser = isLinux && linuxAvailable;

  const primary = release
    ? isIntel
      ? release.downloads.macos_x64
      : release.downloads.macos_arm64
    : undefined;
  const secondary = release ? (isIntel ? release.downloads.macos_arm64 : release.downloads.macos_x64) : undefined;
  const label = isIntel ? "Intel" : "Silicon";
  const altLabel = isIntel ? "Silicon" : "Intel";
  const architecture: "intel" | "silicon" = isIntel ? "intel" : "silicon";

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
    linuxChooser,
    linuxPrimary: false,
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
