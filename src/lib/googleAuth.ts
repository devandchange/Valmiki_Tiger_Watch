import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
import { AdminUser } from '../types';

// IN-MEMORY CACHE ONLY — never persist OAuth tokens to localStorage or sessionStorage
let cachedAccessToken: string | null = null;
let cachedSessionToken: string | null = null;
let cachedAdminUser: AdminUser | null = null;

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function getCachedSessionToken(): string | null {
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
}

export function clearCachedSession() {
  cachedAccessToken = null;
  cachedSessionToken = null;
  cachedAdminUser = null;
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

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    const idToken = await result.user.getIdToken();

    // Verify authenticated Google user on backend
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken,
        idToken,
        email: result.user.email
      })
    });

    const data = await res.json();

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
    clearCachedSession();
    let message = 'Google sign-in could not be completed. Please try again.';
    if (err?.code === 'auth/popup-closed-by-user') {
      message = 'Sign-in cancelled. Please click "Continue with Google" to authorize.';
    } else if (err?.code === 'auth/popup-blocked') {
      message = 'Popup was blocked by your browser. Please allow popups for Google Sign-In.';
    } else if (err?.message) {
      message = err.message;
    }
    return {
      success: false,
      error: message
    };
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
      await fetch('/api/admin/logout', {
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
    const res = await fetch('/api/admin/session', {
      headers: {
        'x-vtw-admin-session': cachedSessionToken
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.admin) {
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
