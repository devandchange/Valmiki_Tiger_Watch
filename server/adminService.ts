import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AdminUser, AdminSession, AdminAuditLogEntry, VTWAdminSettings } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const AUDIT_LOG_FILE = path.join(DATA_DIR, 'admin_audit_log.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'admin_settings.json');
const VOLUNTEERS_FILE = path.join(DATA_DIR, 'volunteers_registry.json');
const SUPPORTERS_FILE = path.join(DATA_DIR, 'supporters_registry.json');

// Default Authorized Accounts & Official Communication Email loaded strictly from backend environment
export const DEFAULT_VTW_OFFICIAL_EMAIL = process.env.VTW_OFFICIAL_EMAIL || '';

// Active in-memory admin sessions: sessionToken -> AdminSession
const activeSessions = new Map<string, AdminSession>();

// In-memory audit logs and settings
let auditLogs: AdminAuditLogEntry[] = [];
let adminSettings: VTWAdminSettings = {
  officialCommunicationEmail: DEFAULT_VTW_OFFICIAL_EMAIL,
  driveFolders: {},
  spreadsheetIds: {},
  lastUpdated: new Date().toISOString()
};

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.warn('Could not create data directory:', err);
    }
  }
}

export function loadAdminDataFromDisk() {
  ensureDataDirectory();
  try {
    if (fs.existsSync(AUDIT_LOG_FILE)) {
      const data = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
      auditLogs = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Error reading audit logs from disk:', err);
  }

  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      adminSettings = {
        ...adminSettings,
        ...JSON.parse(data)
      };
    }
  } catch (err) {
    console.warn('Error reading admin settings from disk:', err);
  }
}

function persistAuditLogs() {
  ensureDataDirectory();
  try {
    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(auditLogs.slice(0, 1000), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error persisting audit logs:', err);
  }
}

function persistAdminSettings() {
  ensureDataDirectory();
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(adminSettings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error persisting admin settings:', err);
  }
}

// Initialize on boot
loadAdminDataFromDisk();

/**
 * Log an administrative event to the audit trail
 */
export function recordAuditLog(entry: {
  adminEmail: string;
  action: string;
  recordType: AdminAuditLogEntry['recordType'];
  recordId?: string;
  result: 'success' | 'failure' | 'warning';
  details?: string;
}): AdminAuditLogEntry {
  const logEntry: AdminAuditLogEntry = {
    id: `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    adminEmail: entry.adminEmail,
    action: entry.action,
    recordType: entry.recordType,
    recordId: entry.recordId,
    timestamp: new Date().toISOString(),
    result: entry.result,
    details: entry.details
  };

  auditLogs.unshift(logEntry);
  if (auditLogs.length > 2000) {
    auditLogs = auditLogs.slice(0, 2000);
  }
  persistAuditLogs();
  return logEntry;
}

export function getAuditLogs(limit = 100): AdminAuditLogEntry[] {
  return auditLogs.slice(0, limit);
}

export function getAdminSettings(): VTWAdminSettings {
  return { ...adminSettings };
}

export function updateAdminSettings(updates: Partial<VTWAdminSettings>): VTWAdminSettings {
  adminSettings = {
    ...adminSettings,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  persistAdminSettings();
  return adminSettings;
}

/**
 * Verify a Google Identity / OAuth token against official Google APIs
 */
export async function verifyGoogleToken(token: string, tokenType: 'id_token' | 'access_token' = 'access_token'): Promise<{
  email: string;
  name?: string;
  picture?: string;
} | null> {
  try {
    if (tokenType === 'id_token') {
      const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.email) {
        return {
          email: data.email,
          name: data.name,
          picture: data.picture
        };
      }
    } else {
      const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.email) {
        return {
          email: data.email,
          name: data.name,
          picture: data.picture
        };
      }
    }
  } catch (err) {
    console.error('Google token verification failed:', err);
  }
  return null;
}

/**
 * Determine if an email belongs to the authorized VTW administrator list
 * Strictly checked against secure backend environment variables
 */
export function isAuthorizedAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  const admin1 = (process.env.VTW_ADMIN_EMAIL_1 || '').toLowerCase().trim();
  const admin2 = (process.env.VTW_ADMIN_EMAIL_2 || '').toLowerCase().trim();
  if (admin1 && normalized === admin1) return true;
  if (admin2 && normalized === admin2) return true;
  return false;
}

/**
 * Authenticate an administrator via verified Google credentials
 */
export async function authenticateAdminWithGoogle(
  token: string,
  tokenType: 'id_token' | 'access_token' = 'access_token'
): Promise<{
  authorized: boolean;
  error?: string;
  session?: AdminSession;
}> {
  const verifiedUser = await verifyGoogleToken(token, tokenType);
  if (!verifiedUser || !verifiedUser.email) {
    recordAuditLog({
      adminEmail: 'System Security',
      action: 'Admin login failed',
      recordType: 'auth',
      result: 'failure',
      details: 'Google token verification rejected by Google API'
    });
    return {
      authorized: false,
      error: 'Google authentication could not be verified. Please try again.'
    };
  }

  const normalizedEmail = verifiedUser.email.toLowerCase().trim();
  const authorized = isAuthorizedAdminEmail(normalizedEmail);

  if (!authorized) {
    recordAuditLog({
      adminEmail: 'Unauthorized Account',
      action: 'Admin login rejected - Unauthorized account',
      recordType: 'auth',
      result: 'failure',
      details: 'Attempted login rejected by backend authorization filter'
    });
    return {
      authorized: false,
      error: 'Access denied. This account is not authorized to access the VTW Admin Console.'
    };
  }

  // Create high-entropy secure session token
  const sessionToken = `vtw-admin-${crypto.randomUUID()}-${crypto.randomBytes(16).toString('hex')}`;
  const admin1 = (process.env.VTW_ADMIN_EMAIL_1 || '').toLowerCase().trim();
  const isPrimary = admin1 ? normalizedEmail === admin1 : false;

  const adminUser: AdminUser = {
    role: 'administrator',
    isPrimaryOwner: isPrimary,
    name: verifiedUser.name || 'Administrator',
    photoUrl: verifiedUser.picture
  };

  const session: AdminSession = {
    sessionToken,
    admin: adminUser,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000 // 2 hours validity
  };

  activeSessions.set(sessionToken, session);

  recordAuditLog({
    adminEmail: isPrimary ? 'Primary Administrator' : 'Administrator',
    action: 'Admin login',
    recordType: 'auth',
    result: 'success',
    details: `Authenticated as ${isPrimary ? 'Primary Owner' : 'Administrator'}`
  });

  return { authorized: true, session };
}

/**
 * Validate active session
 */
export function validateSession(sessionToken: string): AdminSession | null {
  if (!sessionToken) return null;
  const session = activeSessions.get(sessionToken);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionToken);
    return null;
  }
  return session;
}

/**
 * Invalidate session on logout
 */
export function terminateSession(sessionToken: string): boolean {
  if (!sessionToken) return false;
  const session = activeSessions.get(sessionToken);
  if (session) {
    recordAuditLog({
      adminEmail: session.admin.email,
      action: 'Admin logout',
      recordType: 'auth',
      result: 'success',
      details: 'Session terminated'
    });
    activeSessions.delete(sessionToken);
    return true;
  }
  return false;
}

/**
 * Express Middleware protecting administrator API endpoints
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const sessionHeader = (req.headers['x-vtw-admin-session'] as string) || '';
  const authHeader = (req.headers['authorization'] as string) || '';
  let token = sessionHeader;

  if (!token && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  const session = validateSession(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Administrator access is required. Session expired or invalid.'
    });
  }

  // Attach verified admin to request
  (req as any).adminSession = session;
  (req as any).adminUser = session.admin;
  next();
}

// Volunteers & Supporters persistence helpers
export function getVolunteersRegistry(): any[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(VOLUNTEERS_FILE)) {
      return JSON.parse(fs.readFileSync(VOLUNTEERS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('Error reading volunteers file:', e);
  }
  return [];
}

export function saveVolunteerSubmission(submission: any): any {
  ensureDataDirectory();
  const list = getVolunteersRegistry();
  const existingIdx = list.findIndex(v => v.id === submission.id);
  if (existingIdx >= 0) {
    list[existingIdx] = submission;
  } else {
    list.unshift(submission);
  }
  fs.writeFileSync(VOLUNTEERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return submission;
}

export function getSupportersRegistry(): any[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(SUPPORTERS_FILE)) {
      return JSON.parse(fs.readFileSync(SUPPORTERS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('Error reading supporters file:', e);
  }
  return [];
}

export function saveSupporterSubmission(submission: any): any {
  ensureDataDirectory();
  const list = getSupportersRegistry();
  const existingIdx = list.findIndex(s => s.id === submission.id);
  if (existingIdx >= 0) {
    list[existingIdx] = submission;
  } else {
    list.unshift(submission);
  }
  fs.writeFileSync(SUPPORTERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return submission;
}
