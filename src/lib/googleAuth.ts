import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
import { AdminUser } from '../types';
import { apiUrl } from './apiConfig';
import { Capacitor } from '@capacitor/core';

// IN-MEMORY CACHE & OPAQUE SESSION TOKEN (Never store email or PII)
const SESSION_STORAGE_KEY = 'vtw_session_auth_token';
let cachedAccessToken: string | null = null;
let cachedSessionToken: string | null = null;
let cachedAdminUser: AdminUser | null = null;

// Safely initialize session token from storage on module load
try {
  if (typeof window !== 'undefined') {
    cachedSessionToken = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
  }
} catch {}

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function getCachedSessionToken(): string | null {
  if (!cachedSessionToken && typeof window !== 'undefined') {
    try {
      cachedSessionToken = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch {}
  }
  return cachedSessionToken;
}

export function getCachedAdminUser(): AdminUser | null {
  return cachedAdminUser;
}

export function setCachedSession(sessionToken: string, admin: AdminUser, accessToken?: string | null) {
  cachedSessionToken = sessionToken;
  cachedAdminUser = admin;
  if (accessToken) {
    cachedAccessToken = accessToken;
  }
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionToken);
    }
  } catch {}
}

export function clearCachedSession() {
  cachedAccessToken = null;
  cachedSessionToken = null;
  cachedAdminUser = null;
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {}
}

/**
 * Initiates Google OAuth Sign-In for administrator authentication.
 * Verifies authenticated account on the secure backend.
 */
export async function signInWithGoogleAdmin(): Promise<{
  success: boolean;
  admin?: AdminUser;
  sessionToken?: string;
  error?: string;
}> {
  try {
    const provider = new GoogleAuthProvider();
    // Prompt user to select their account explicitly
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    let result: any = null;
    const isNativeAndroid = Capacitor.isNativePlatform() || 
      (typeof window !== 'undefined' && window.location.protocol === 'capacitor:');

    // In Android APK WebView, popup may fail due to WebView security or user agent restrictions
    try {
      result = await signInWithPopup(auth, provider);
    } catch (popupErr: any) {
      if (
        popupErr?.code === 'auth/popup-blocked' ||
        popupErr?.code === 'auth/operation-not-supported-in-this-environment' ||
        popupErr?.code === 'auth/unauthorized-domain' ||
        isNativeAndroid
      ) {
        // Attempt redirect flow if popup is disallowed or in native APK
        console.info('Attempting redirect fallback for Google authentication...');
        try {
          await signInWithRedirect(auth, provider);
          // When redirect is called, the page will navigate away; we return pending status
          return {
            success: false,
            error: 'Redirecting to Google Sign-In...'
          };
        } catch (redirErr: any) {
          throw redirErr;
        }
      }
      throw popupErr;
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    const idToken = await result.user.getIdToken();

    // Verify authenticated Google user on backend using absolute/resolved API URL
    const targetUrl = apiUrl('/api/admin/login');
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        accessToken,
        idToken,
        email: result.user.email
      })
    });

    let data: any = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      const text = await res.text().catch(() => '');
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!data) {
      await fbSignOut(auth).catch(() => {});
      clearCachedSession();
      return {
        success: false,
        error: 'Unable to reach the administrator authentication server. Please check your network connection and try again.'
      };
    }

    if (!res.ok || !data.success) {
      // Clear client auth on rejection
      await fbSignOut(auth).catch(() => {});
      clearCachedSession();
      return {
        success: false,
        error: data.error || 'Access denied. This account is not authorized to access the VTW Admin Console.'
      };
    }

    // Cache session in memory
    setCachedSession(data.sessionToken, data.admin, accessToken);

    return {
      success: true,
      admin: data.admin,
      sessionToken: data.sessionToken
    };
  } catch (err: any) {
    await fbSignOut(auth).catch(() => {});
    clearCachedSession();
    let message = 'Google sign-in could not be completed. Please try again.';
    if (err?.code === 'auth/popup-closed-by-user') {
      message = 'Sign-in cancelled. Please click "Continue with Google" to authorize.';
    } else if (err?.code === 'auth/popup-blocked') {
      message = 'Popup was blocked by your browser. Please allow popups for Google Sign-In.';
    } else if (err?.code === 'auth/unauthorized-domain') {
      message = 'Google Sign-In domain authorization is pending in Firebase Console.';
    } else if (err?.message && !err.message.includes('<!DOCTYPE') && !err.message.includes('<html') && !err.message.includes('Unexpected token')) {
      message = err.message;
    }
    return {
      success: false,
      error: message
    };
  }
}

/**
 * Handle incoming redirect result on app reload (for Android APK or redirect-based auth)
 */
export async function handleRedirectAuthResult(): Promise<{
  success: boolean;
  admin?: AdminUser;
  error?: string;
} | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result || !result.user) {
      return null;
    }
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    const idToken = await result.user.getIdToken();

    const res = await fetch(apiUrl('/api/admin/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        accessToken,
        idToken,
        email: result.user.email
      })
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      await fbSignOut(auth).catch(() => {});
      clearCachedSession();
      return {
        success: false,
        error: data?.error || 'Access denied.'
      };
    }

    setCachedSession(data.sessionToken, data.admin, accessToken);
    return {
      success: true,
      admin: data.admin
    };
  } catch (err: any) {
    console.warn('Redirect auth check completed:', err);
    return null;
  }
}

/**
 * Log out of the VTW Admin Console and terminate session on the backend
 */
export async function signOutAdmin(): Promise<void> {
  const token = cachedSessionToken;
  clearCachedSession();

  try {
    if (token) {
      await fetch(apiUrl('/api/admin/logout'), {
        method: 'POST',
        headers: {
          'x-vtw-admin-session': token
        }
      });
    }
    await fbSignOut(auth);
  } catch (err) {
    console.warn('Error during admin sign-out:', err);
  }
}

/**
 * Verify if current session is still valid on backend
 */
export async function verifyCurrentAdminSession(): Promise<AdminUser | null> {
  if (!cachedSessionToken) return null;

  try {
    const res = await fetch(apiUrl('/api/admin/session'), {
      headers: {
        'x-vtw-admin-session': cachedSessionToken
      }
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.success && data.admin) {
        cachedAdminUser = data.admin;
        return data.admin;
      }
    }
  } catch {
    // Network or server error
  }

  clearCachedSession();
  return null;
}
