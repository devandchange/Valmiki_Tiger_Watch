import { 
  getAdminSettings, 
  updateAdminSettings, 
  recordAuditLog,
  getVolunteersRegistry,
  getSupportersRegistry,
  getAuditLogs
} from './adminService';
import { getCertificatesList } from './certificateService';

export const REQUIRED_VTW_FOLDERS = [
  '01_Admin',
  '02_Volunteers',
  '03_Supporters',
  '04_Tiger_Protection_Pledges',
  '05_Certificates',
  '06_News',
  '07_Research_Publications',
  '08_Conservation_Data',
  '09_App_Backups',
  '10_Reports'
];

export const REQUIRED_VTW_SHEETS = [
  'VTW Volunteers',
  'VTW Supporters',
  'VTW Tiger Protection Pledges',
  'VTW Certificates',
  'VTW News',
  'VTW Research & Publications',
  'VTW Conservation Data',
  'VTW Admin Audit Log'
];

interface DriveFileItem {
  id: string;
  name: string;
  mimeType?: string;
}

/**
 * Ensures the official VTW Google Drive folder hierarchy exists without duplicates:
 * Valmiki Tiger Watch/
 *   ├── 01_Admin/
 *   ├── 02_Volunteers/
 *   ...
 *   └── 10_Reports/
 */
export async function ensureVTWFolderHierarchy(accessToken: string): Promise<{
  rootFolderId: string;
  subfolders: Record<string, string>;
}> {
  const settings = getAdminSettings();
  const existingSubfolders: Record<string, string> = { ...(settings.driveFolders || {}) };

  // 1. Locate or create root 'Valmiki Tiger Watch' folder
  let rootFolderId = settings.driveRootFolderId || '';

  if (rootFolderId) {
    // Verify it still exists in Drive
    try {
      const verifyRes = await fetch(`https://www.googleapis.com/drive/v3/files/${rootFolderId}?fields=id,name,trashed`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!verifyRes.ok) {
        rootFolderId = '';
      } else {
        const data = await verifyRes.json();
        if (data.trashed) rootFolderId = '';
      }
    } catch {
      rootFolderId = '';
    }
  }

  if (!rootFolderId) {
    // Search for existing root folder in Drive
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      "mimeType = 'application/vnd.google-apps.folder' and name = 'Valmiki Tiger Watch' and trashed = false"
    )}&fields=files(id,name)`;

    const res = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      throw new Error('Failed to search for Valmiki Tiger Watch folder in Google Drive');
    }

    const data = await res.json();
    const files: DriveFileItem[] = data.files || [];

    if (files.length > 0) {
      rootFolderId = files[0].id;
    } else {
      // Create root folder
      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Valmiki Tiger Watch',
          mimeType: 'application/vnd.google-apps.folder',
          description: 'Official Valmiki Tiger Watch data, certificates, and records archive'
        })
      });

      if (!createRes.ok) {
        throw new Error('Failed to create Valmiki Tiger Watch root folder in Google Drive');
      }

      const created = await createRes.json();
      rootFolderId = created.id;
    }
  }

  // 2. Locate or create all 10 standard subfolders inside root
  for (const folderName of REQUIRED_VTW_FOLDERS) {
    let existingId = existingSubfolders[folderName];

    if (existingId) {
      // Quick verify
      try {
        const vRes = await fetch(`https://www.googleapis.com/drive/v3/files/${existingId}?fields=id,trashed`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!vRes.ok) existingId = '';
        else {
          const vData = await vRes.json();
          if (vData.trashed) existingId = '';
        }
      } catch {
        existingId = '';
      }
    }

    if (!existingId) {
      // Search in root
      const subSearchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`
      )}&fields=files(id,name)`;

      const subRes = await fetch(subSearchUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (subRes.ok) {
        const subData = await subRes.json();
        const found = (subData.files || [])[0];
        if (found) {
          existingId = found.id;
        }
      }

      // If still not found, create subfolder
      if (!existingId) {
        const createSubRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [rootFolderId]
          })
        });

        if (createSubRes.ok) {
          const createdSub = await createSubRes.json();
          existingId = createdSub.id;
        }
      }
    }

    if (existingId) {
      existingSubfolders[folderName] = existingId;
    }
  }

  // Save detected folder IDs to settings
  updateAdminSettings({
    driveRootFolderId: rootFolderId,
    driveFolders: existingSubfolders
  });

  return { rootFolderId, subfolders: existingSubfolders };
}

/**
 * Locate or create a Google Sheet spreadsheet within a designated Google Drive folder
 */
export async function getOrCreateSpreadsheet(
  accessToken: string,
  spreadsheetTitle: string,
  parentFolderId: string
): Promise<string> {
  const settings = getAdminSettings();
  const existingSheetId = settings.spreadsheetIds?.[spreadsheetTitle];

  if (existingSheetId) {
    try {
      const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files/${existingSheetId}?fields=id,trashed`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (!checkData.trashed) return existingSheetId;
      }
    } catch {}
  }

  // Search in Drive folder
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and name = '${spreadsheetTitle}' and trashed = false`
  )}&fields=files(id,name)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      const foundId = data.files[0].id;
      updateAdminSettings({
        spreadsheetIds: {
          ...(settings.spreadsheetIds || {}),
          [spreadsheetTitle]: foundId
        }
      });
      return foundId;
    }
  }

  // Create new spreadsheet inside folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: spreadsheetTitle,
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: [parentFolderId]
    })
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create spreadsheet '${spreadsheetTitle}' in Google Drive`);
  }

  const createdData = await createRes.json();
  const sheetId = createdData.id;

  updateAdminSettings({
    spreadsheetIds: {
      ...(getAdminSettings().spreadsheetIds || {}),
      [spreadsheetTitle]: sheetId
    }
  });

  return sheetId;
}

/**
 * Write full table values to a Google Sheet
 */
export async function updateSpreadsheetData(
  accessToken: string,
  spreadsheetId: string,
  values: (string | number | boolean)[][]
): Promise<void> {
  // 1. Determine sheet tab name
  let tabName = 'Sheet1';
  try {
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      if (metaData.sheets && metaData.sheets.length > 0) {
        tabName = metaData.sheets[0].properties.title || 'Sheet1';
      }
    }
  } catch {}

  // 2. Clear old contents
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}:clear`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch {}

  // 3. Write new rows
  const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    `${tabName}!A1`
  )}?valueInputOption=USER_ENTERED`;

  const writeRes = await fetch(writeUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: `${tabName}!A1`,
      majorDimension: 'ROWS',
      values
    })
  });

  if (!writeRes.ok) {
    const errText = await writeRes.text();
    throw new Error(`Failed writing rows to spreadsheet: ${errText}`);
  }
}

/**
 * Perform a full sync of all 8 VTW Google Sheets
 */
export async function syncAllVTWSheets(
  accessToken: string,
  adminEmail: string,
  payload?: {
    news?: any[];
    research?: any[];
    conservation?: any[];
  }
): Promise<{
  success: boolean;
  syncedSheets: string[];
  lastSyncTime: string;
}> {
  const { subfolders } = await ensureVTWFolderHierarchy(accessToken);
  const adminFolderId = subfolders['01_Admin'];
  const synced: string[] = [];

  // 1. VTW Volunteers
  const volunteers = getVolunteersRegistry();
  const volunteerRows: (string | number)[][] = [
    ['ID', 'Full Name', 'Email', 'Mobile', 'City/District', 'State', 'Country', 'Preferred Language', 'Availability', 'Reason', 'Status', 'Submitted At']
  ];
  volunteers.forEach(v => {
    volunteerRows.push([
      v.id || '',
      v.fullName || '',
      v.email || '',
      v.mobile || '',
      v.cityDistrict || '',
      v.state || '',
      v.country || '',
      v.preferredLanguage || '',
      v.availability || '',
      v.whyVolunteer || '',
      v.status || 'pending',
      v.submittedAt || ''
    ]);
  });
  const volSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW Volunteers', subfolders['02_Volunteers'] || adminFolderId);
  await updateSpreadsheetData(accessToken, volSheetId, volunteerRows);
  synced.push('VTW Volunteers');

  // 2. VTW Supporters
  const supporters = getSupportersRegistry();
  const supporterRows: (string | number)[][] = [
    ['ID', 'Full Name', 'Email', 'Mobile', 'City/District', 'State', 'Country', 'Preferred Language', 'Support Options', 'Message', 'Status', 'Submitted At']
  ];
  supporters.forEach(s => {
    supporterRows.push([
      s.id || '',
      s.fullName || '',
      s.email || '',
      s.mobile || '',
      s.cityDistrict || '',
      s.state || '',
      s.country || '',
      s.preferredLanguage || '',
      Array.isArray(s.supportOptions) ? s.supportOptions.join(', ') : '',
      s.messageComments || '',
      s.status || 'pending',
      s.submittedAt || ''
    ]);
  });
  const supSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW Supporters', subfolders['03_Supporters'] || adminFolderId);
  await updateSpreadsheetData(accessToken, supSheetId, supporterRows);
  synced.push('VTW Supporters');

  // 3. VTW Tiger Protection Pledges & 4. VTW Certificates
  const certificates = getCertificatesList();
  const pledgeRows: (string | number)[][] = [
    ['Certificate Number', 'Participant Name', 'Location', 'Country', 'Language', 'Issue Date', 'Status', 'Verification QR Hash']
  ];
  const certRows: (string | number)[][] = [
    ['Certificate Number', 'Recipient Name', 'City/State', 'Country', 'Language', 'Status', 'Issue Date', 'Created At', 'File Path In Drive']
  ];

  certificates.forEach(c => {
    pledgeRows.push([
      c.certificateNumber || '',
      c.fullName || c.participantName || '',
      c.cityAndState || '',
      c.country || '',
      c.language || 'en',
      c.pledgeDate || c.issueDate || '',
      c.status || 'valid',
      c.verificationHash || ''
    ]);
    certRows.push([
      c.certificateNumber || '',
      c.fullName || c.participantName || '',
      c.cityAndState || '',
      c.country || '',
      c.language || 'en',
      c.status || 'valid',
      c.pledgeDate || c.issueDate || '',
      c.createdAt || '',
      `Valmiki Tiger Watch/05_Certificates/${c.certificateNumber}.json`
    ]);
  });

  const pledgeSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW Tiger Protection Pledges', subfolders['04_Tiger_Protection_Pledges'] || adminFolderId);
  await updateSpreadsheetData(accessToken, pledgeSheetId, pledgeRows);
  synced.push('VTW Tiger Protection Pledges');

  const certSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW Certificates', subfolders['05_Certificates'] || adminFolderId);
  await updateSpreadsheetData(accessToken, certSheetId, certRows);
  synced.push('VTW Certificates');

  // 5. VTW News
  const newsRows: (string | number)[][] = [
    ['ID', 'Headline', 'Publication Date', 'Source', 'Source Category', 'Verification Status', 'Live Status', 'Summary', 'Source URL']
  ];
  if (payload?.news && Array.isArray(payload.news)) {
    payload.news.forEach(n => {
      newsRows.push([
        n.id || '',
        n.headline || '',
        n.publicationDate || '',
        n.source || '',
        n.sourceCategory || '',
        n.verificationStatus || '',
        n.isLive ? 'Live' : 'Draft',
        n.summary || '',
        n.sourceLink || n.externalUrl || ''
      ]);
    });
  }
  const newsSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW News', subfolders['06_News'] || adminFolderId);
  await updateSpreadsheetData(accessToken, newsSheetId, newsRows);
  synced.push('VTW News');

  // 6. VTW Research & Publications
  const researchRows: (string | number)[][] = [
    ['ID', 'Title', 'Authors', 'Journal / Publisher', 'Year', 'Category', 'Verified Status', 'Link']
  ];
  if (payload?.research && Array.isArray(payload.research)) {
    payload.research.forEach(r => {
      researchRows.push([
        r.id || '',
        r.title || '',
        r.authors || '',
        r.journal || '',
        r.year || '',
        r.category || '',
        r.verificationStatus || 'verified',
        r.url || ''
      ]);
    });
  }
  const resSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW Research & Publications', subfolders['07_Research_Publications'] || adminFolderId);
  await updateSpreadsheetData(accessToken, resSheetId, researchRows);
  synced.push('VTW Research & Publications');

  // 7. VTW Conservation Data
  const conservationRows: (string | number)[][] = [
    ['Indicator / Metric', 'Category', 'Value / Details', 'Official Source', 'Last Verified Date', 'Notes']
  ];
  if (payload?.conservation && Array.isArray(payload.conservation)) {
    payload.conservation.forEach(cd => {
      conservationRows.push([
        cd.metric || cd.title || '',
        cd.category || '',
        cd.value || '',
        cd.source || '',
        cd.verifiedDate || '',
        cd.notes || ''
      ]);
    });
  } else {
    // Default indicators
    conservationRows.push(['VTR Tiger Population', 'Census', '54 Tigers (NTCA 2022 Census)', 'National Tiger Conservation Authority', '2023', 'Project Tiger 50-Year Golden Jubilee']);
    conservationRows.push(['Core Forest Area', 'Boundary', '898.45 sq km', 'Bihar Forest Dept', '2024', 'Strict Wildlife Protection Zone']);
    conservationRows.push(['Buffer Area', 'Ecosystem', '280.50 sq km', 'Bihar Forest Dept', '2024', 'Eco-development committee patrol']);
    conservationRows.push(['Anti-Poaching Camps', 'Patrol', '38 Active Field Camps', 'VTR Forest Directorate', '2024', 'Equipped with M-STrIPES digital patrolling']);
  }
  const consSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW Conservation Data', subfolders['08_Conservation_Data'] || adminFolderId);
  await updateSpreadsheetData(accessToken, consSheetId, conservationRows);
  synced.push('VTW Conservation Data');

  // 8. VTW Admin Audit Log
  const auditEntries = getAuditLogs(200);
  const auditRows: (string | number)[][] = [
    ['Log ID', 'Administrator Email', 'Action', 'Record Type', 'Record ID', 'Timestamp', 'Result', 'Details']
  ];
  auditEntries.forEach(a => {
    auditRows.push([
      a.id,
      a.adminEmail,
      a.action,
      a.recordType,
      a.recordId || '',
      a.timestamp,
      a.result,
      a.details || ''
    ]);
  });
  const auditSheetId = await getOrCreateSpreadsheet(accessToken, 'VTW Admin Audit Log', adminFolderId);
  await updateSpreadsheetData(accessToken, auditSheetId, auditRows);
  synced.push('VTW Admin Audit Log');

  const now = new Date().toISOString();
  updateAdminSettings({
    lastSheetsSync: now
  });

  recordAuditLog({
    adminEmail,
    action: 'Sync Google Sheets',
    recordType: 'sheets',
    result: 'success',
    details: `Synchronized ${synced.length} spreadsheets to Google Drive`
  });

  return {
    success: true,
    syncedSheets: synced,
    lastSyncTime: now
  };
}

/**
 * Create a full data backup snapshot and upload it to Google Drive '09_App_Backups/'
 */
export async function uploadBackupToDrive(
  accessToken: string,
  adminEmail: string,
  extraData?: Record<string, any>
): Promise<{
  success: boolean;
  fileId: string;
  fileName: string;
  backupTime: string;
}> {
  const { subfolders } = await ensureVTWFolderHierarchy(accessToken);
  const backupFolderId = subfolders['09_App_Backups'] || subfolders['01_Admin'];

  const now = new Date();
  const timestampStr = now.toISOString().replace(/[:.]/g, '-');
  const fileName = `vtw-backup-${timestampStr}.json`;

  const backupPayload = {
    metadata: {
      appName: 'Valmiki Tiger Watch',
      version: '2026.1',
      backupCreatedAt: now.toISOString(),
      initiatedBy: adminEmail,
      officialCommunicationEmail: getAdminSettings().officialCommunicationEmail
    },
    volunteers: getVolunteersRegistry(),
    supporters: getSupportersRegistry(),
    certificates: getCertificatesList(),
    auditLogs: getAuditLogs(500),
    extraData: extraData || {}
  };

  const fileContent = JSON.stringify(backupPayload, null, 2);

  // Upload to Drive with multipart upload
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    parents: [backupFolderId],
    description: `Valmiki Tiger Watch full system backup generated by ${adminEmail} at ${now.toISOString()}`
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    recordAuditLog({
      adminEmail,
      action: 'Backup VTW Data',
      recordType: 'backup',
      result: 'failure',
      details: `Failed uploading backup to Drive: ${err}`
    });
    throw new Error('Google Drive synchronization failed. Please try again.');
  }

  const fileData = await uploadRes.json();

  updateAdminSettings({
    lastBackupDate: now.toISOString()
  });

  recordAuditLog({
    adminEmail,
    action: 'Backup VTW Data',
    recordType: 'backup',
    recordId: fileData.id,
    result: 'success',
    details: `Snapshot saved to 09_App_Backups/${fileName}`
  });

  return {
    success: true,
    fileId: fileData.id,
    fileName,
    backupTime: now.toISOString()
  };
}

/**
 * Sync individual certificate records into Google Drive '05_Certificates/'
 */
export async function syncCertificatesToDrive(accessToken: string, adminEmail: string) {
  const { subfolders } = await ensureVTWFolderHierarchy(accessToken);
  const certFolderId = subfolders['05_Certificates'];
  const certificates = getCertificatesList();

  let count = 0;
  for (const cert of certificates) {
    const fileName = `${cert.certificateNumber}.json`;

    // Check if already in folder
    const q = `'${certFolderId}' in parents and name = '${fileName}' and trashed = false`;
    const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (checkRes.ok) {
      const data = await checkRes.json();
      if (data.files && data.files.length > 0) {
        continue; // Already saved, avoid duplicate uploads
      }
    }

    // Upload single certificate metadata JSON
    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      parents: [certFolderId],
      description: `Official VTW Tiger Protection Pledge Certificate for ${cert.fullName}`
    };

    const boundary = '-------vtwcertboundary';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;
    const multipart =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(cert, null, 2) +
      closeDelimiter;

    const upRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipart
    });

    if (upRes.ok) count++;
  }

  recordAuditLog({
    adminEmail,
    action: 'Sync Certificates with Google Drive',
    recordType: 'drive',
    result: 'success',
    details: `Exported ${count} new certificate record files to 05_Certificates/`
  });

  return { syncedCount: count };
}
