import { useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("https://downloads.slashtable.dev/latest.json")
      .then((r) => r.json())
      .then(setRelease)
      .catch(() => {});
  }, []);

  const primary = release ? (isIntel ? release.downloads.macos_x64 : release.downloads.macos_arm64) : undefined;
  const secondary = release ? (isIntel ? release.downloads.macos_arm64 : release.downloads.macos_x64) : undefined;
  const label = isIntel ? "Intel" : "Silicon";
  const altLabel = isIntel ? "Silicon" : "Intel";

  const triggerDownload = useCallback(() => {
    if (!primary) return;
    const a = document.createElement("a");
    a.href = primary;
    a.download = "";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setShowThankYou(true), 500);
  }, [primary]);

  const closeThankYou = useCallback(() => setShowThankYou(false), []);

  return {
    release,
    isIntel,
    primary,
    secondary,
    label,
    altLabel,
    showThankYou,
    setShowThankYou,
    closeThankYou,
    triggerDownload,
  };
}
