/**
 * Valmiki Tiger Watch - Centralized Version & Release Configuration
 * 
 * Single source of truth for the application version.
 * Corresponds to the official Android build/release version (v1.0.1 in build-apk.yml & android/app/build.gradle).
 */

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
}

export interface ReleaseInfo {
  tagName: string;
  version: string;
  name: string;
  publishedAt: string;
  releaseNotes: string;
  htmlUrl: string;
  downloadUrl: string;
  apkAsset?: ReleaseAsset;
  isPrerelease: boolean;
}

// Default official repository configured for this project
const DEFAULT_GITHUB_REPO = 'valmikitigerwatch/valmiki-tiger-watch';

// Safe getter for environment repo if configured
function getConfiguredRepo(): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITHUB_REPO) {
      return String(import.meta.env.VITE_GITHUB_REPO).trim();
    }
  } catch {
    // Ignore context where import.meta is not accessible
  }
  return DEFAULT_GITHUB_REPO;
}

export const APP_VERSION = '1.0.1';
export const APP_VERSION_CODE = 2;
export const APP_ID = 'com.valmikitigerwatch.app';
export const APP_NAME = 'Valmiki Tiger Watch';

export const APP_CONFIG = {
  appName: APP_NAME,
  appId: APP_ID,
  version: APP_VERSION,
  versionCode: APP_VERSION_CODE,
  buildDate: '2026-09-11',
  get githubRepo(): string {
    return getConfiguredRepo();
  },
  get githubReleasesUrl(): string {
    return `https://github.com/${this.githubRepo}/releases`;
  },
  get githubLatestReleaseUrl(): string {
    return `https://github.com/${this.githubRepo}/releases/latest`;
  },
  get githubApiLatestReleaseUrl(): string {
    return `https://api.github.com/repos/${this.githubRepo}/releases/latest`;
  },
  get playStoreUrl(): string {
    return `https://play.google.com/store/apps/details?id=${this.appId}`;
  }
};

/**
 * Normalizes a semver tag string (e.g., "v1.0.2" -> "1.0.2", "1.0" -> "1.0.0")
 */
export function normalizeVersion(versionStr: string): string {
  if (!versionStr) return '0.0.0';
  return versionStr.trim().replace(/^[vV]/, '');
}

/**
 * Compares two semantic version strings.
 * Returns:
 *   1 if v1 > v2 (v1 is newer)
 *  -1 if v1 < v2 (v2 is newer)
 *   0 if v1 === v2
 */
export function compareSemver(v1: string, v2: string): number {
  const norm1 = normalizeVersion(v1);
  const norm2 = normalizeVersion(v2);

  const parts1 = norm1.split('.').map(p => parseInt(p, 10) || 0);
  const parts2 = norm2.split('.').map(p => parseInt(p, 10) || 0);

  const maxLen = Math.max(parts1.length, parts2.length, 3);
  for (let i = 0; i < maxLen; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}
