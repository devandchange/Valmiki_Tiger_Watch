import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { fetchLiveTigerNews } from './src/server/newsService';
import { processChatMessage, getAiBackendStatus } from './src/server/chatService';
import { fetchVTRWeatherData, VTR_WEATHER_ZONES } from './src/server/weatherService';
import {
  createTigerPledgeCertificate,
  getCertificatesList,
  verifyCertificateByNumber,
  revokeCertificate,
  restoreCertificate,
  getCertificateSettings,
  updateCertificateSettings
} from './src/server/certificateService';

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
  app.post('/api/certificates/settings', (req, res) => {
    try {
      const updates = req.body || {};
      const updated = updateCertificateSettings(updates);
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
