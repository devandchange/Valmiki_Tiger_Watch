/**
 * Valmiki Tiger Watch - App Update Service
 * 
 * Implements real update checks against the official Valmiki Tiger Watch GitHub releases.
 * Handles semver comparison, asset resolution (APK download), loading/success/update/error states,
 * and safe browser opening for user-approved Android APK installation.
 * 
 * Never exposes sensitive admin/OAuth secrets.
 */

import { APP_CONFIG, APP_VERSION, compareSemver, normalizeVersion } from '../config/version';

export interface AppUpdateResult {
  success: boolean;
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseName?: string;
  releaseNotes?: string;
  releaseUrl: string;
  downloadUrl: string;
  apkFileName?: string;
  publishedAt?: string;
  error?: string;
  isPlayStoreCandidate?: boolean;
}

/**
 * Checks for updates by querying GitHub Releases for the Valmiki Tiger Watch repository.
 * Uses the server-side API proxy when available, falling back to direct GitHub public API.
 */
export async function checkForAppUpdates(): Promise<AppUpdateResult> {
  const currentVersion = APP_VERSION;
  const fallbackReleaseUrl = APP_CONFIG.githubReleasesUrl;

  // 1. Try server-side endpoint first (handles rate-limiting and caching cleanly)
  try {
    const serverRes = await fetch('/api/app-update', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data && data.success) {
        return {
          success: true,
          hasUpdate: Boolean(data.hasUpdate),
          currentVersion,
          latestVersion: data.latestVersion || currentVersion,
          releaseName: data.releaseName,
          releaseNotes: data.releaseNotes,
          releaseUrl: data.releaseUrl || APP_CONFIG.githubLatestReleaseUrl,
          downloadUrl: data.downloadUrl || data.releaseUrl || APP_CONFIG.githubLatestReleaseUrl,
          apkFileName: data.apkFileName,
          publishedAt: data.publishedAt
        };
      } else if (data && data.error) {
        console.warn('Server update check reported:', data.error);
      }
    }
  } catch (err) {
    // Server proxy unreachable or running in pure client mode; continue to direct GitHub API
  }

  // 2. Direct GitHub API check
  try {
    const apiUrl = APP_CONFIG.githubApiLatestReleaseUrl;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 404) {
      // Repository has no published releases yet or tag is not marked as latest
      return {
        success: true,
        hasUpdate: false,
        currentVersion,
        latestVersion: currentVersion,
        releaseName: `Valmiki Tiger Watch v${currentVersion}`,
        releaseUrl: fallbackReleaseUrl,
        downloadUrl: fallbackReleaseUrl
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const release = await response.json();
    const rawTag = release.tag_name || release.name || '';
    const latestVersion = normalizeVersion(rawTag);

    // Look for Android APK asset in the release assets list
    let apkAsset: any = null;
    if (Array.isArray(release.assets) && release.assets.length > 0) {
      apkAsset = release.assets.find((a: any) =>
        typeof a.name === 'string' && a.name.toLowerCase().endsWith('.apk')
      );
    }

    const downloadUrl = apkAsset?.browser_download_url || release.html_url || fallbackReleaseUrl;
    const hasUpdate = compareSemver(latestVersion, currentVersion) > 0;

    return {
      success: true,
      hasUpdate,
      currentVersion,
      latestVersion: latestVersion || currentVersion,
      releaseName: release.name || `Valmiki Tiger Watch ${rawTag}`,
      releaseNotes: release.body || '',
      releaseUrl: release.html_url || fallbackReleaseUrl,
      downloadUrl,
      apkFileName: apkAsset?.name,
      publishedAt: release.published_at
    };
  } catch (err) {
    console.error('App update check error:', err);
    return {
      success: false,
      hasUpdate: false,
      currentVersion,
      latestVersion: currentVersion,
      releaseUrl: fallbackReleaseUrl,
      downloadUrl: fallbackReleaseUrl,
      error: 'Unable to check for updates. Please try again later.'
    };
  }
}

/**
 * Safely opens an update or download URL in the device's default browser.
 * Never attempts silent installation; lets Android handle the normal user-approved package installer.
 */
export function openUpdateUrl(url?: string): void {
  const targetUrl = url || APP_CONFIG.githubLatestReleaseUrl;
  try {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error('Failed to open update URL:', err);
    window.location.href = targetUrl;
  }
}
