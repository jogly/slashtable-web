import { useCallback, useEffect, useRef, useState } from "react";
import { type DownloadSource, trackDownloadStarted } from "../lib/analytics";

interface LatestRelease {
  version: string;
  pub_date: string;
  downloads: {
    macos_arm64: string;
    macos_x64: string;
  };
}

function detectIsIntel(): boolean {
  const arch = (navigator as unknown as { userAgentData?: { architecture?: string } }).userAgentData?.architecture;
  if (arch) return arch === "x86";
  return false;
}

export function useDownload() {
  const [release, setRelease] = useState<LatestRelease | null>(null);
  const [isIntel] = useState(() => detectIsIntel());
  const [showThankYou, setShowThankYou] = useState(false);
  const timerRef = useRef<number>(undefined);

  useEffect(() => {
    fetch("https://downloads.slashtable.dev/latest.json")
      .then((r) => r.json())
      .then(setRelease)
      .catch(() => {});
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const primary = release ? (isIntel ? release.downloads.macos_x64 : release.downloads.macos_arm64) : undefined;
  const secondary = release ? (isIntel ? release.downloads.macos_arm64 : release.downloads.macos_x64) : undefined;
  const label = isIntel ? "Intel" : "Silicon";
  const altLabel = isIntel ? "Silicon" : "Intel";

  const openThankYou = useCallback(() => setShowThankYou(true), []);

  const triggerDownload = useCallback(
    (source: DownloadSource = "download_section_button") => {
      if (!primary) return;
      trackDownloadStarted({
        architecture: isIntel ? "intel" : "silicon",
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
    [primary, isIntel, release],
  );

  const closeThankYou = useCallback(() => setShowThankYou(false), []);

  return {
    release,
    isIntel,
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
