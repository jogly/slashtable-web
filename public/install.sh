#!/bin/sh
# /table installer.
# Linux (alpha): detect amd64 or aarch64, download the latest .deb, apt-get install.
# macOS: Homebrew tap + cask. Does not install Homebrew. Adopts an existing
# SlashTable.app that is not brew-managed.
set -eu

FEED="https://downloads.slashtable.dev/latest.json"
DOWNLOAD_PAGE="https://slashtable.dev/download"
CASK_TAP="slashtable/cask"
CASK_NAME="slashtable"

die() {
  printf '%s\n' "$1" >&2
  exit 1
}

install_macos() {
  command -v brew >/dev/null 2>&1 || die "Homebrew is required for Mac installs. Download at $DOWNLOAD_PAGE"

  brew tap "$CASK_TAP"

  if brew list --cask "$CASK_NAME" >/dev/null 2>&1; then
    printf 'Upgrading /table via Homebrew\n'
    brew upgrade --cask "$CASK_NAME"
    return
  fi

  if [ -d "/Applications/SlashTable.app" ] || [ -d "$HOME/Applications/SlashTable.app" ]; then
    printf 'Existing app is not managed by Homebrew. Adopting it.\n'
    brew install --cask --adopt "$CASK_NAME"
    return
  fi

  printf 'Installing /table via Homebrew\n'
  brew install --cask "$CASK_NAME"
}

install_linux() {
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
}

case "$(uname -s)" in
  Darwin) install_macos ;;
  Linux) install_linux ;;
  *) die "Unsupported OS ($(uname -s)). See $DOWNLOAD_PAGE" ;;
esac
