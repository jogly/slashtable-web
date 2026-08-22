#!/bin/sh
# /table Linux installer (alpha).
# Detects amd64 or aarch64 from this machine, downloads the latest .deb, and installs it.
set -eu

FEED="https://downloads.slashtable.dev/latest.json"
DOWNLOAD_PAGE="https://slashtable.dev/download"

die() {
  printf '%s\n' "$1" >&2
  exit 1
}

case "$(uname -s)" in
  Linux) ;;
  *) die "This installer is for Linux. macOS builds are at $DOWNLOAD_PAGE" ;;
esac

command -v curl >/dev/null 2>&1 || die "curl is required"
command -v apt-get >/dev/null 2>&1 || die "apt-get is required (Debian/Ubuntu)"

# Prefer dpkg's name when present (amd64 / arm64), else uname -m (x86_64 / aarch64).
# arm64 from dpkg is the same ISA as aarch64. Bare x86/i386 is not a shippable target.
deb_arch=
if command -v dpkg >/dev/null 2>&1; then
  case "$(dpkg --print-architecture)" in
    amd64) deb_arch=amd64 ;;
    arm64) deb_arch=aarch64 ;;
  esac
fi
if [ -z "$deb_arch" ]; then
  case "$(uname -m)" in
    x86_64) deb_arch=amd64 ;;
    aarch64|arm64) deb_arch=aarch64 ;;
  esac
fi
[ -n "$deb_arch" ] || die "Unsupported architecture ($(uname -m)). Need amd64 or aarch64. See $DOWNLOAD_PAGE"

json=$(curl -fsSL -A "slashtable-install" "$FEED") || die "Could not read the release feed"

json_oneline=$(printf '%s' "$json" | tr -d '\n')
version=$(printf '%s' "$json_oneline" | sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)
url=$(printf '%s' "$json_oneline" | sed -n "s/.*\"linux_${deb_arch}\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" | head -n 1)

[ -n "$url" ] || die "No $deb_arch build in the latest release. See $DOWNLOAD_PAGE"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
deb="$tmp/$(basename "$url")"

printf 'Installing /table %s (%s)\n' "${version:-latest}" "$deb_arch"
curl -fsSL -A "slashtable-install" -o "$deb" "$url" || die "Download failed"

if [ "$(id -u)" -eq 0 ]; then
  apt-get install -y "$deb"
else
  sudo apt-get install -y "$deb"
fi
