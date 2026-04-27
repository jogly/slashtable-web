import { DownloadView } from "./DownloadView";

const CHANGELOG_URL = "https://downloads.slashtable.dev/changelog.json";
const MANIFEST_URL = "https://downloads.slashtable.dev/manifest.json";
const LATEST_URL = "https://downloads.slashtable.dev/latest.json";

export const dynamic = "force-dynamic";

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
  };
}

interface LatestRelease {
  version: string;
  pub_date: string;
  downloads: {
    macos_arm64: string;
    macos_x64: string;
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function DownloadPage() {
  const [release, manifest, changelog] = await Promise.all([
    fetchJson<LatestRelease>(LATEST_URL),
    fetchJson<{ versions?: ManifestVersion[] }>(MANIFEST_URL),
    fetchJson<{ entries?: ChangelogEntry[] }>(CHANGELOG_URL),
  ]);

  const versions = manifest?.versions ?? [];
  const entries = changelog?.entries ?? [];
  const changelogEntry = release ? entries.find((e) => e.version.replace(/^v/, "") === release.version) ?? entries[0] ?? null : entries[0] ?? null;

  return <DownloadView release={release} versions={versions} changelogEntry={changelogEntry} />;
}
