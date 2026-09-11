import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { fetchLiveTigerNews } from './server/newsService';
import { processChatMessage, getAiBackendStatus } from './server/chatService';
import { fetchVTRWeatherData, VTR_WEATHER_ZONES } from './server/weatherService';
import {
  createTigerPledgeCertificate,
  getCertificatesList,
  verifyCertificateByNumber,
  revokeCertificate,
  restoreCertificate,
  getCertificateSettings,
  updateCertificateSettings
} from './server/certificateService';
import {
  authenticateAdminWithGoogle,
  validateSession,
  terminateSession,
  requireAdminAuth,
  recordAuditLog,
  getAuditLogs,
  getAdminSettings,
  updateAdminSettings,
  getVolunteersRegistry,
  saveVolunteerSubmission,
  getSupportersRegistry,
  saveSupporterSubmission,
  DEFAULT_VTW_OFFICIAL_EMAIL
} from './server/adminService';
import {
  ensureVTWFolderHierarchy,
  syncAllVTWSheets,
  uploadBackupToDrive,
  syncCertificatesToDrive
} from './server/googleWorkspaceService';

async function startServer() {
  const app = express();
  // Cloud Run and the development environment strictly proxy all external traffic to port 3000.
  const PORT = 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Chat Assistant Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, customSystemPrompt } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message string is required.' });
        return;
      }
      const response = await processChatMessage(message, history || [], customSystemPrompt);
      res.json(response);
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({
        reply: 'An error occurred while contacting the AI assistant. Please try again.',
        error: error?.message || 'Internal error'
      });
    }
  });

  // AI Chat Status Endpoint
  app.get('/api/chat/status', (_req, res) => {
    try {
      const status = getAiBackendStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Unable to check AI status' });
    }
  });

  // API News Refresh Endpoint
  app.post('/api/news/refresh', async (req, res) => {
    try {
      const existingArticles = Array.isArray(req.body?.existingArticles) ? req.body.existingArticles : [];
      const result = await fetchLiveTigerNews(existingArticles);
      res.json({
        success: true,
        newArticles: result.newArticles,
        allUpdatedNews: result.allUpdatedNews,
        sourcesChecked: result.sourcesChecked,
        lastUpdated: new Date().toISOString(),
        message: result.message
      });
    } catch (error: any) {
      console.error('Error refreshing news feeds:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to connect to live news sources. Keeping previously verified news visible.',
        error: error?.message || 'Unknown network error'
      });
    }
  });

  // API News Sources Endpoint
  app.get('/api/news/sources', (_req, res) => {
    res.json({
      sources: [
        { name: 'Times of India (TOI)', type: 'newspaper', category: 'Established Media', language: 'en', status: 'active' },
        { name: 'The Hindu', type: 'newspaper', category: 'Established Media', language: 'en', status: 'active' },
        { name: 'Hindustan Times', type: 'newspaper', category: 'Established Media', language: 'en', status: 'active' },
        { name: 'Dainik Jagran (दैनिक जागरण)', type: 'newspaper', category: 'Established Media', language: 'hi', status: 'active' },
        { name: 'Live Hindustan (हिन्दुस्तान)', type: 'newspaper', category: 'Established Media', language: 'hi', status: 'active' },
        { name: 'Dainik Bhaskar (दैनिक भास्कर)', type: 'newspaper', category: 'Established Media', language: 'hi', status: 'active' },
        { name: 'Prabhat Khabar (प्रभात खबर)', type: 'newspaper', category: 'Established Media', language: 'hi', status: 'active' },
        { name: 'Bihar Forest Department', type: 'government', category: 'Forest Department', language: 'en/hi', status: 'active' },
        { name: 'National Tiger Conservation Authority (NTCA)', type: 'government', category: 'NTCA / MoEFCC', language: 'en', status: 'active' }
      ]
    });
  });

  // API Real-time Weather Endpoint for Valmiki Tiger Reserve
  app.get('/api/weather', async (req, res) => {
    try {
      const zoneId = typeof req.query.zoneId === 'string' ? req.query.zoneId : 'valmikinagar';
      const forceRefresh = req.query.forceRefresh === 'true';
      const weatherData = await fetchVTRWeatherData(zoneId, forceRefresh);
      res.json(weatherData);
    } catch (error: any) {
      console.error('Error in /api/weather route:', error);
      res.status(500).json({
        success: false,
        error: 'Weather data unavailable. Please try again later.',
        message: error?.message || 'Upstream meteorological API error'
      });
    }
  });

  // API Weather Zones Endpoint
  app.get('/api/weather/zones', (_req, res) => {
    res.json({
      zones: VTR_WEATHER_ZONES
    });
  });

  // ==========================================
  // TIGER PROTECTION PLEDGE CERTIFICATES API
  // ==========================================

  // Generate a new Certificate
  app.post('/api/certificates/generate', (req, res) => {
    try {
      const { pledgeId, fullName, cityAndState, country, email, organization, language } = req.body || {};
      if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
        res.status(400).json({ error: 'Full name is required.' });
        return;
      }
      if (!cityAndState || typeof cityAndState !== 'string' || !cityAndState.trim()) {
        res.status(400).json({ error: 'City and state is required.' });
        return;
      }

      const certificate = createTigerPledgeCertificate({
        pledgeId,
        fullName,
        cityAndState,
        country: country || 'India',
        email,
        organization,
        language
      });

      const isAlreadyIssued = Boolean(certificate.alreadyIssued);
      res.status(isAlreadyIssued ? 200 : 201).json({
        success: true,
        alreadyIssued: isAlreadyIssued,
        certificate,
        message: isAlreadyIssued
          ? 'Certificate already issued for this participant.'
          : 'Tiger Protection Pledge Certificate generated successfully.'
      });
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Failed to generate pledge certificate.'
      });
    }
  });

  // Get Certificates List (Admin)
  app.get('/api/certificates', (req, res) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const list = getCertificatesList(search, status);
      res.json({
        success: true,
        total: list.length,
        certificates: list
      });
    } catch (error: any) {
      console.error('Error fetching certificates list:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to fetch certificates.' });
    }
  });

  // Verify Certificate (Public)
  app.get('/api/certificates/verify/:certNumber', (req, res) => {
    try {
      const certNumber = req.params.certNumber;
      if (!certNumber) {
        res.status(400).json({ found: false, message: 'Certificate number is required.' });
        return;
      }
      const verification = verifyCertificateByNumber(certNumber);
      res.json(verification);
    } catch (error: any) {
      console.error('Error verifying certificate:', error);
      res.status(500).json({ found: false, message: 'Server error verifying certificate.' });
    }
  });

  // Revoke Certificate (Admin)
  app.post('/api/certificates/revoke', (req, res) => {
    try {
      const { certNumber, reason } = req.body || {};
      if (!certNumber) {
        res.status(400).json({ success: false, message: 'Certificate number is required.' });
        return;
      }
      const result = revokeCertificate(certNumber, reason);
      res.json(result);
    } catch (error: any) {
      console.error('Error revoking certificate:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to revoke certificate.' });
    }
  });

  // Restore Certificate (Admin)
  app.post('/api/certificates/restore', (req, res) => {
    try {
      const { certNumber } = req.body || {};
      if (!certNumber) {
        res.status(400).json({ success: false, message: 'Certificate number is required.' });
        return;
      }
      const result = restoreCertificate(certNumber);
      res.json(result);
    } catch (error: any) {
      console.error('Error restoring certificate:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to restore certificate.' });
    }
  });

  // Get Certificate Settings (Admin)
  app.get('/api/certificates/settings', (_req, res) => {
    try {
      const settings = getCertificateSettings();
      res.json({ success: true, settings });
    } catch (error: any) {
      console.error('Error getting certificate settings:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to get settings.' });
    }
  });

  // Update Certificate Settings (Admin)
  app.post('/api/certificates/settings', requireAdminAuth, (req, res) => {
    try {
      const updates = req.body || {};
      const updated = updateCertificateSettings(updates);
      const admin = (req as any).adminUser;
      recordAuditLog({
        adminEmail: admin?.email || 'admin',
        action: 'Update Certificate Settings',
        recordType: 'certificate',
        result: 'success',
        details: 'Certificate layout and sequence configuration updated'
      });
      res.json({
        success: true,
        settings: updated,
        message: 'Certificate settings updated successfully.'
      });
    } catch (error: any) {
      console.error('Error updating certificate settings:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to update settings.' });
    }
  });

  // ==========================================
  // VTW SECURE ADMIN AUTHENTICATION API
  // ==========================================

  // Admin Google Sign-In & Verification
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { accessToken, idToken } = req.body || {};
      const token = idToken || accessToken;
      const tokenType = idToken ? 'id_token' : 'access_token';

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Google authentication credential is required.'
        });
        return;
      }

      const authResult = await authenticateAdminWithGoogle(token, tokenType);
      if (!authResult.authorized || !authResult.session) {
        res.status(403).json({
          success: false,
          error: 'Administrator authentication is temporarily unavailable.'
        });
        return;
      }

      res.json({
        success: true,
        sessionToken: authResult.session.sessionToken,
        admin: authResult.session.admin,
        expiresAt: authResult.session.expiresAt
      });
    } catch (error: any) {
      console.error('Error in /api/admin/login:', error);
      res.status(500).json({
        success: false,
        error: 'Administrator authentication is temporarily unavailable.'
      });
    }
  });

  // Verify Active Admin Session
  app.get('/api/admin/session', (req, res) => {
    const sessionToken = (req.headers['x-vtw-admin-session'] as string) || '';
    const session = validateSession(sessionToken);
    if (!session) {
      res.status(401).json({ success: false, error: 'No active session or session expired.' });
      return;
    }
    res.json({
      success: true,
      admin: session.admin,
      expiresAt: session.expiresAt
    });
  });

  // Admin Logout
  app.post('/api/admin/logout', (req, res) => {
    const sessionToken = (req.headers['x-vtw-admin-session'] as string) || '';
    terminateSession(sessionToken);
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ==========================================
  // VTW ADMIN AUDIT LOGS & SETTINGS API
  // ==========================================

  app.get('/api/admin/audit-logs', requireAdminAuth, (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = getAuditLogs(limit);
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to retrieve audit logs.' });
    }
  });

  app.get('/api/admin/settings', requireAdminAuth, (_req, res) => {
    res.json({ success: true, settings: getAdminSettings() });
  });

  app.post('/api/admin/settings', requireAdminAuth, (req, res) => {
    try {
      const updates = req.body || {};
      const updated = updateAdminSettings(updates);
      const admin = (req as any).adminUser;
      recordAuditLog({
        adminEmail: admin?.email || 'admin',
        action: 'Update Admin Settings',
        recordType: 'settings',
        result: 'success',
        details: `Updated settings including official communication email (${updated.officialCommunicationEmail})`
      });
      res.json({ success: true, settings: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to update administrative settings.' });
    }
  });

  // Public Official Contact Info
  app.get('/api/contact-info', (_req, res) => {
    const settings = getAdminSettings();
    res.json({
      organization: 'Valmiki Tiger Watch',
      officialEmail: settings.officialCommunicationEmail || DEFAULT_VTW_OFFICIAL_EMAIL,
      authorizedContact: settings.officialCommunicationEmail || DEFAULT_VTW_OFFICIAL_EMAIL,
      reserveHeadquarters: 'Valmiki Tiger Reserve, West Champaran District, Bihar — 845107, India'
    });
  });

  // ==========================================
  // PUBLIC FORMS & ADMIN REGISTRY API
  // ==========================================

  // Volunteer Submission (Public)
  app.post('/api/volunteers/submit', (req, res) => {
    try {
      const submission = req.body;
      if (!submission?.fullName || !submission?.email) {
        res.status(400).json({ error: 'Full name and email are required.' });
        return;
      }
      const saved = saveVolunteerSubmission({
        ...submission,
        id: submission.id || `vol-${Date.now()}`,
        submittedAt: submission.submittedAt || new Date().toISOString(),
        status: submission.status || 'pending'
      });
      res.status(201).json({ success: true, volunteer: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to record volunteer application.' });
    }
  });

  // Volunteers List (Admin)
  app.get('/api/admin/volunteers', requireAdminAuth, (_req, res) => {
    res.json({ success: true, volunteers: getVolunteersRegistry() });
  });

  // Update Volunteer Status (Admin)
  app.post('/api/admin/volunteers/status', requireAdminAuth, (req, res) => {
    try {
      const { id, status, notes } = req.body || {};
      if (!id || !status) {
        res.status(400).json({ error: 'Volunteer ID and status are required.' });
        return;
      }
      const volunteers = getVolunteersRegistry();
      const target = volunteers.find(v => v.id === id);
      if (!target) {
        res.status(404).json({ error: 'Volunteer record not found.' });
        return;
      }
      target.status = status;
      if (notes !== undefined) target.notes = notes;
      saveVolunteerSubmission(target);

      const admin = (req as any).adminUser;
      recordAuditLog({
        adminEmail: admin?.email || 'admin',
        action: `Update Volunteer Status to ${status}`,
        recordType: 'volunteer',
        recordId: id,
        result: 'success',
        details: `Updated volunteer ${target.fullName} (${target.email})`
      });

      res.json({ success: true, volunteer: target });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to update volunteer status.' });
    }
  });

  // Supporter Submission (Public)
  app.post('/api/supporters/submit', (req, res) => {
    try {
      const submission = req.body;
      if (!submission?.fullName || !submission?.email) {
        res.status(400).json({ error: 'Full name and email are required.' });
        return;
      }
      const saved = saveSupporterSubmission({
        ...submission,
        id: submission.id || `sup-${Date.now()}`,
        submittedAt: submission.submittedAt || new Date().toISOString(),
        status: submission.status || 'pending'
      });
      res.status(201).json({ success: true, supporter: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to record supporter application.' });
    }
  });

  // Supporters List (Admin)
  app.get('/api/admin/supporters', requireAdminAuth, (_req, res) => {
    res.json({ success: true, supporters: getSupportersRegistry() });
  });

  // Update Supporter Status (Admin)
  app.post('/api/admin/supporters/status', requireAdminAuth, (req, res) => {
    try {
      const { id, status, notes } = req.body || {};
      if (!id || !status) {
        res.status(400).json({ error: 'Supporter ID and status are required.' });
        return;
      }
      const supporters = getSupportersRegistry();
      const target = supporters.find(s => s.id === id);
      if (!target) {
        res.status(404).json({ error: 'Supporter record not found.' });
        return;
      }
      target.status = status;
      if (notes !== undefined) target.notes = notes;
      saveSupporterSubmission(target);

      const admin = (req as any).adminUser;
      recordAuditLog({
        adminEmail: admin?.email || 'admin',
        action: `Update Supporter Status to ${status}`,
        recordType: 'supporter',
        recordId: id,
        result: 'success',
        details: `Updated supporter ${target.fullName} (${target.email})`
      });

      res.json({ success: true, supporter: target });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to update supporter status.' });
    }
  });

  // ==========================================
  // APP VERSION & ANDROID APK UPDATE API
  // ==========================================
  app.get('/api/app-version', (_req, res) => {
    const repo = process.env.VTW_GITHUB_REPO || process.env.VITE_GITHUB_REPO || 'valmikitigerwatch/valmiki-tiger-watch';
    res.json({
      appName: 'Valmiki Tiger Watch',
      appId: 'com.valmikitigerwatch.app',
      version: '1.0.1',
      versionCode: 2,
      githubRepo: repo,
      releasesUrl: `https://github.com/${repo}/releases`,
      latestReleaseUrl: `https://github.com/${repo}/releases/latest`,
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.valmikitigerwatch.app'
    });
  });

  app.get('/api/app-update', async (_req, res) => {
    const currentVersion = '1.0.1';
    const repo = process.env.VTW_GITHUB_REPO || process.env.VITE_GITHUB_REPO || 'valmikitigerwatch/valmiki-tiger-watch';
    const defaultReleasesUrl = `https://github.com/${repo}/releases`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ValmikiTigerWatch-App'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.status === 404) {
        // No published releases found yet
        res.json({
          success: true,
          hasUpdate: false,
          currentVersion,
          latestVersion: currentVersion,
          releaseName: `Valmiki Tiger Watch v${currentVersion}`,
          releaseUrl: defaultReleasesUrl,
          downloadUrl: defaultReleasesUrl
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const release: any = await response.json();
      const rawTag = (release.tag_name || release.name || '').trim();
      const latestVersion = rawTag.replace(/^[vV]/, '');

      // Compare semver
      const parseSemver = (v: string) => v.split('.').map(n => parseInt(n, 10) || 0);
      const cParts = parseSemver(currentVersion);
      const lParts = parseSemver(latestVersion);
      let hasUpdate = false;
      const maxLen = Math.max(cParts.length, lParts.length, 3);
      for (let i = 0; i < maxLen; i++) {
        const cp = cParts[i] || 0;
        const lp = lParts[i] || 0;
        if (lp > cp) {
          hasUpdate = true;
          break;
        }
        if (lp < cp) break;
      }

      // Find APK asset
      let apkAsset: any = null;
      if (Array.isArray(release.assets)) {
        apkAsset = release.assets.find((a: any) =>
          typeof a.name === 'string' && a.name.toLowerCase().endsWith('.apk')
        );
      }

      const downloadUrl = apkAsset?.browser_download_url || release.html_url || defaultReleasesUrl;

      res.json({
        success: true,
        hasUpdate,
        currentVersion,
        latestVersion: latestVersion || currentVersion,
        releaseName: release.name || `Valmiki Tiger Watch ${rawTag}`,
        releaseNotes: release.body || '',
        releaseUrl: release.html_url || defaultReleasesUrl,
        downloadUrl,
        apkFileName: apkAsset?.name,
        publishedAt: release.published_at
      });
    } catch (err: any) {
      console.warn('Backend update check fallback triggered:', err?.message);
      res.json({
        success: false,
        hasUpdate: false,
        currentVersion,
        latestVersion: currentVersion,
        releaseUrl: defaultReleasesUrl,
        downloadUrl: defaultReleasesUrl,
        error: 'Unable to check for updates. Please try again later.'
      });
    }
  });

  // ==========================================
  // GOOGLE DRIVE & SHEETS SYNCHRONIZATION API
  // ==========================================

  // Sync Google Drive folders & certificates
  app.post('/api/admin/drive/sync', requireAdminAuth, async (req, res) => {
    try {
      const accessToken = req.body?.accessToken || (req.headers['authorization']?.replace('Bearer ', ''));
      if (!accessToken) {
        res.status(400).json({
          success: false,
          error: 'Cloud synchronization is currently unavailable.'
        });
        return;
      }
      const admin = (req as any).adminUser;
      const hierarchy = await ensureVTWFolderHierarchy(accessToken);
      const certsResult = await syncCertificatesToDrive(accessToken, admin.email);

      res.json({
        success: true,
        message: 'Google Drive synchronization completed successfully.',
        rootFolderId: hierarchy.rootFolderId,
        subfolders: hierarchy.subfolders,
        certificatesExported: certsResult.syncedCount,
        syncTime: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Google Drive synchronization error:', err);
      res.status(500).json({
        success: false,
        error: 'Cloud synchronization is currently unavailable.'
      });
    }
  });

  // Sync all 8 Google Sheets
  app.post('/api/admin/sheets/sync', requireAdminAuth, async (req, res) => {
    try {
      const accessToken = req.body?.accessToken || (req.headers['authorization']?.replace('Bearer ', ''));
      if (!accessToken) {
        res.status(400).json({
          success: false,
          error: 'Cloud synchronization is currently unavailable.'
        });
        return;
      }
      const admin = (req as any).adminUser;
      const result = await syncAllVTWSheets(accessToken, admin.email, {
        news: req.body?.news,
        research: req.body?.research,
        conservation: req.body?.conservation
      });

      res.json({
        success: true,
        message: 'Google Sheets synchronized successfully.',
        syncedSheets: result.syncedSheets,
        lastSyncTime: result.lastSyncTime
      });
    } catch (err: any) {
      console.error('Google Sheets synchronization error:', err);
      res.status(500).json({
        success: false,
        error: 'Cloud synchronization is currently unavailable.'
      });
    }
  });

  // Backup VTW Data to Google Drive
  app.post('/api/admin/backup', requireAdminAuth, async (req, res) => {
    try {
      const accessToken = req.body?.accessToken || (req.headers['authorization']?.replace('Bearer ', ''));
      if (!accessToken) {
        res.status(400).json({
          success: false,
          error: 'Cloud synchronization is currently unavailable.'
        });
        return;
      }
      const admin = (req as any).adminUser;
      const result = await uploadBackupToDrive(accessToken, admin.email, req.body?.extraData);

      res.json({
        success: true,
        message: 'App data backup successfully saved to Google Drive 09_App_Backups/.',
        fileName: result.fileName,
        fileId: result.fileId,
        backupTime: result.backupTime
      });
    } catch (err: any) {
      console.error('Backup error:', err);
      res.status(500).json({
        success: false,
        error: 'Cloud synchronization is currently unavailable.'
      });
    }
  });

  // Vite middleware for development vs Static files for production
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))
      ? path.join(process.cwd(), 'dist')
      : (fs.existsSync(path.join(__dirname, 'index.html'))
        ? __dirname
        : path.join(process.cwd(), 'dist'));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Valmiki Tiger Watch - Application build not found.');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (environment: ${process.env.NODE_ENV || 'development'})`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

startServer();
