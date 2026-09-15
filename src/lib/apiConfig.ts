import { Capacitor } from '@capacitor/core';

/**
 * Universal API URL Resolver for Valmiki Tiger Watch
 * Ensures that API calls work both in web preview (relative URLs)
 * and inside Android APK Capacitor runtime (routing to live Cloud Run backend).
 */

const CLOUD_RUN_FALLBACK_URL = 'https://ais-dev-du7q5b22ougjr4eiknd37n-101567804053.asia-southeast1.run.app';

export function getApiBaseUrl(): string {
  // 1. Check if VITE_APP_URL is injected
  const envUrl = (import.meta.env.VITE_APP_URL || '').trim();
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.replace(/\/$/, '');
  }

  // 2. Check if running inside Capacitor or Android APK
  if (typeof window !== 'undefined') {
    const isCapacitorNative = Capacitor.isNativePlatform();
    const isCapacitorProtocol = window.location.protocol === 'capacitor:';
    const isLocalhostWebView = window.location.hostname === 'localhost' && (!window.location.port || window.location.port === '80');

    if (isCapacitorNative || isCapacitorProtocol || isLocalhostWebView) {
      return CLOUD_RUN_FALLBACK_URL;
    }
  }

  // 3. Web browser preview: use relative paths
  return '';
}

export function apiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
}
