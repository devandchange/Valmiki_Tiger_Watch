import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Cloud,
  FolderSync,
  FileSpreadsheet,
  HardDrive,
  FolderCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Upload,
  Download,
  Mail,
  ShieldCheck,
  UserCheck,
  Clock,
  History,
  ExternalLink,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';

interface GoogleDriveStorageTabProps {
  showToast: (msg: string) => void;
}

const VTW_STANDARD_FOLDERS = [
  { id: '01_Admin', name: '01_Admin', description: 'Administrative records, settings, and authorization audit logs' },
  { id: '02_Volunteers', name: '02_Volunteers', description: 'Volunteer registrations, applications, and status' },
  { id: '03_Supporters', name: '03_Supporters', description: 'Supporter pledges, donor records, and correspondence' },
  { id: '04_Tiger_Protection_Pledges', name: '04_Tiger_Protection_Pledges', description: 'Public citizen conservation pledges' },
  { id: '05_Certificates', name: '05_Certificates', description: 'Tiger Protection Pledge Certificate registry & exports' },
  { id: '06_News', name: '06_News', description: 'Official conservation updates, news articles & press releases' },
  { id: '07_Research_Publications', name: '07_Research_Publications', description: 'Scientific papers, habitat reports & camera-trap surveys' },
  { id: '08_Conservation_Data', name: '08_Conservation_Data', description: 'Tiger census, sightings, alerts & spatial data' },
  { id: '09_App_Backups', name: '09_App_Backups', description: 'Complete JSON snapshots & historical system backups' },
  { id: '10_Reports', name: '10_Reports', description: 'Generated monthly & annual conservation summaries' }
];

export const GoogleDriveStorageTab: React.FC<GoogleDriveStorageTabProps> = ({ showToast }) => {
  const {
    adminUser,
    driveSyncStatus,
    syncWithGoogleDrive,
    syncWithGoogleSheets,
    backupVTWDataToDrive,
    adminAuditLogs,
    refreshAuditLogs,
    vtwAdminSettings,
    updateVTWAdminSettings,
    tigers,
    news,
    sightings,
    alerts,
    certificates,
    volunteerSubmissions,
    supporterSubmissions,
    exportDataBackup,
    importDataBackup
  } = useData();

  const [isDriveSyncing, setIsDriveSyncing] = useState(false);
  const [isSheetsSyncing, setIsSheetsSyncing] = useState(false);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [restoreJsonInput, setRestoreJsonInput] = useState('');
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [officialEmailInput, setOfficialEmailInput] = useState(
    vtwAdminSettings?.officialCommunicationEmail || ''
  );
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  // Sync Google Drive
  const handleSyncDrive = async () => {
    setIsDriveSyncing(true);
    try {
      const result = await syncWithGoogleDrive();
      if (result.success) {
        showToast(result.message || 'Google Drive hierarchy & certificates synchronized!');
      } else {
        showToast(result.message || 'Google Drive synchronization failed. Please try again.');
      }
    } catch {
      showToast('Google Drive synchronization failed. Please try again.');
    } finally {
      setIsDriveSyncing(false);
    }
  };

  // Sync Google Sheets
  const handleSyncSheets = async () => {
    setIsSheetsSyncing(true);
    try {
      const result = await syncWithGoogleSheets();
      if (result.success) {
        showToast(result.message || 'All 8 Google Sheets synchronized successfully!');
      } else {
        showToast(result.message || 'Google Drive synchronization failed. Please try again.');
      }
    } catch {
      showToast('Google Drive synchronization failed. Please try again.');
    } finally {
      setIsSheetsSyncing(false);
    }
  };

  // Backup App Data
  const handleBackupToDrive = async () => {
    setIsBackupRunning(true);
    try {
      const result = await backupVTWDataToDrive();
      if (result.success) {
        showToast(`Backup snapshot saved to Google Drive 09_App_Backups/ (${result.fileName || 'backup.json'})`);
      } else {
        showToast(result.message || 'Google Drive synchronization failed. Please try again.');
      }
    } catch {
      showToast('Google Drive synchronization failed. Please try again.');
    } finally {
      setIsBackupRunning(false);
    }
  };

  // Restore Data
  const handleImportJson = () => {
    if (!restoreJsonInput.trim()) return;
    const ok = importDataBackup(restoreJsonInput.trim());
    if (ok) {
      showToast('Data snapshot restored successfully!');
      setRestoreJsonInput('');
      setIsRestoreOpen(false);
    } else {
      showToast('Invalid backup JSON format. Please verify the file.');
    }
  };

  // Download Local Backup
  const handleDownloadLocalBackup = () => {
    const jsonStr = exportDataBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VTW-Local-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Local JSON backup downloaded.');
  };

  // Save Official Communication Email
  const handleSaveEmail = async () => {
    if (!officialEmailInput.trim()) return;
    setIsSavingEmail(true);
    try {
      await updateVTWAdminSettings({
        officialCommunicationEmail: officialEmailInput.trim()
      });
      showToast('Official VTW communication email updated.');
    } catch {
      showToast('Failed to update communication email.');
    } finally {
      setIsSavingEmail(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Official Communication Email & Authorized Accounts Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Official VTW Identity */}
        <div className="bg-[#07271D] border border-emerald-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <Mail className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
              Official VTW Communication Identity
            </h4>
          </div>
          <p className="text-xs text-emerald-200/80 mb-3">
            Primary verified address used for public correspondence, certificate dispatches, and Drive root ownership.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={officialEmailInput}
              onChange={(e) => setOfficialEmailInput(e.target.value)}
              className="flex-1 bg-black/40 border border-emerald-700/80 rounded-lg px-3 py-2 text-xs text-emerald-100 font-mono focus:outline-none focus:border-amber-400"
              placeholder="e.g. contact@valmikitigerwatch.org"
            />
            <button
              onClick={handleSaveEmail}
              disabled={isSavingEmail}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingEmail ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
          {vtwAdminSettings?.officialCommunicationEmail && (
            <div className="mt-2 text-[11px] text-emerald-400/90 font-mono">
              Active: <span className="font-bold text-amber-300">{vtwAdminSettings.officialCommunicationEmail}</span>
            </div>
          )}
        </div>

        {/* Security & Access Policy */}
        <div className="bg-[#07271D] border border-emerald-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
              Access & Security Architecture
            </h4>
          </div>
          <p className="text-xs text-emerald-200/80 mb-2.5 leading-relaxed">
            Administrator authentication is enforced strictly via Google OAuth 2.0 and validated on the isolated backend environment. Administrator identities remain confidential.
          </p>
          <div className="p-2 rounded-lg bg-black/30 border border-emerald-800/50 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-200">Session Status</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Active Verified Session
            </span>
          </div>
          {adminUser && (
            <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-mono text-emerald-300">
              <span>Admin Role: <strong className="text-amber-300">{adminUser.isPrimaryOwner ? 'Primary Owner' : 'Administrator'}</strong></span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Authenticated
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Action Buttons & Sync Status Panel */}
      <div className="bg-[#07271D] border border-emerald-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/80">
          <div>
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-amber-400" />
              Google Drive & Sheets Data Synchronization
            </h3>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Securely synchronized to the official Valmiki Tiger Watch Google Drive and Google Sheets.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400/80">Status:</span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
                driveSyncStatus.status === 'successful' || driveSyncStatus.status === 'connected'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                  : driveSyncStatus.status === 'syncing'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse'
                  : driveSyncStatus.status === 'failed'
                  ? 'bg-red-950/80 text-red-300 border-red-700'
                  : 'bg-black/40 text-emerald-400 border-emerald-800'
              }`}
            >
              {driveSyncStatus.status === 'syncing' && <RefreshCw className="w-3 h-3 animate-spin" />}
              {driveSyncStatus.status === 'successful' && <Check className="w-3 h-3 text-emerald-400" />}
              {driveSyncStatus.status === 'failed' && <AlertTriangle className="w-3 h-3 text-red-400" />}
              <span className="capitalize">{driveSyncStatus.status}</span>
            </span>
          </div>
        </div>

        {/* Sync Failure Error Banner */}
        {driveSyncStatus.status === 'failed' && (
          <div className="p-3 bg-red-950/60 border border-red-700/80 rounded-xl text-xs text-red-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Cloud synchronization is currently unavailable.</p>
              {driveSyncStatus.message && (
                <p className="text-[11px] text-red-300/80 mt-0.5 font-mono">{driveSyncStatus.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Primary Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Sync Google Drive */}
          <button
            onClick={handleSyncDrive}
            disabled={isDriveSyncing}
            className="p-3 bg-emerald-800/60 hover:bg-emerald-700/80 border border-emerald-600 rounded-xl text-left transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <FolderSync className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
              {isDriveSyncing && <RefreshCw className="w-3 h-3 text-amber-300 animate-spin" />}
            </div>
            <div className="text-xs font-bold text-white">Sync with Google Drive</div>
            <div className="text-[11px] text-emerald-200/70 mt-0.5">
              Sync 10 folders & certificates
            </div>
          </button>

          {/* 2. Sync Google Sheets */}
          <button
            onClick={handleSyncSheets}
            disabled={isSheetsSyncing}
            className="p-3 bg-emerald-800/60 hover:bg-emerald-700/80 border border-emerald-600 rounded-xl text-left transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              {isSheetsSyncing && <RefreshCw className="w-3 h-3 text-emerald-300 animate-spin" />}
            </div>
            <div className="text-xs font-bold text-white">Sync Google Sheets</div>
            <div className="text-[11px] text-emerald-200/70 mt-0.5">
              Sync all 8 live spreadsheets
            </div>
          </button>

          {/* 3. Backup VTW Data */}
          <button
            onClick={handleBackupToDrive}
            disabled={isBackupRunning}
            className="p-3 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/80 rounded-xl text-left transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <HardDrive className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              {isBackupRunning && <RefreshCw className="w-3 h-3 text-amber-300 animate-spin" />}
            </div>
            <div className="text-xs font-bold text-white">Backup VTW Data</div>
            <div className="text-[11px] text-amber-200/70 mt-0.5">
              Save snapshot to 09_App_Backups/
            </div>
          </button>

          {/* 4. Restore/Import Data */}
          <button
            onClick={() => setIsRestoreOpen(prev => !prev)}
            className="p-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Upload className="w-4 h-4 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
              <Download
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadLocalBackup();
                }}
                className="w-3.5 h-3.5 text-emerald-400/80 hover:text-emerald-200"
                title="Download local JSON copy"
              />
            </div>
            <div className="text-xs font-bold text-white">Restore / Import Data</div>
            <div className="text-[11px] text-emerald-200/70 mt-0.5">
              JSON snapshot restore & local save
            </div>
          </button>
        </div>

        {/* Restore Panel Drawer */}
        {isRestoreOpen && (
          <div className="p-4 bg-black/40 border border-emerald-700 rounded-xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-300 font-mono">Restore Application State</h4>
              <button
                onClick={() => setIsRestoreOpen(false)}
                className="text-xs text-emerald-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-xs text-emerald-200/80">
              Paste a previously saved VTW JSON snapshot to restore tigers, news, research, sightings, and settings:
            </p>
            <textarea
              value={restoreJsonInput}
              onChange={(e) => setRestoreJsonInput(e.target.value)}
              placeholder="Paste VTW backup JSON here..."
              rows={4}
              className="w-full bg-black/60 border border-emerald-700/80 rounded-lg p-2.5 text-xs text-emerald-100 font-mono focus:outline-none focus:border-amber-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleImportJson}
                disabled={!restoreJsonInput.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold rounded-lg text-xs font-mono"
              >
                Apply Restore
              </button>
              <button
                onClick={handleDownloadLocalBackup}
                className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Current Snapshot
              </button>
            </div>
          </div>
        )}

        {/* Last Sync Timestamps */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] font-mono text-emerald-300/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Drive Sync: <strong className="text-emerald-100">{driveSyncStatus.lastSyncTime || 'Never synchronized yet'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sheets Sync: <strong className="text-emerald-100">{driveSyncStatus.sheetsLastSyncTime || 'Never synchronized yet'}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Google Drive Dedicated Folder Structure Overview */}
      <div className="bg-[#07271D] border border-emerald-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-300 flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-amber-400" />
            Google Drive Dedicated VTW Folder Structure
          </h4>
          <span className="text-[11px] font-mono text-emerald-400">
            Root: <code className="text-amber-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">Valmiki Tiger Watch/</code>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {VTW_STANDARD_FOLDERS.map((folder) => {
            const folderId = driveSyncStatus.subfolders?.[folder.name];
            return (
              <div
                key={folder.id}
                className="p-3 bg-black/30 border border-emerald-800/60 rounded-xl flex items-start space-x-3"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/80 flex items-center justify-center text-amber-400 font-mono text-[11px] font-bold flex-shrink-0 mt-0.5">
                  📁
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{folder.name}/</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {folderId ? '✓ Provisioned' : 'Ready'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/70 mt-0.5 leading-snug">
                    {folder.description}
                  </p>
                  {folderId && (
                    <div className="text-[10px] text-emerald-500 font-mono truncate mt-1">
                      ID: {folderId}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Google Sheets Live Registries Overview */}
      <div className="bg-[#07271D] border border-emerald-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-300 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Standard VTW Google Spreadsheets Registry
          </h4>
          <span className="text-[11px] font-mono text-amber-300 font-bold">8 Dedicated Sheets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { title: 'VTW Volunteers', records: volunteerSubmissions.length, folder: '02_Volunteers' },
            { title: 'VTW Supporters', records: supporterSubmissions.length, folder: '03_Supporters' },
            { title: 'VTW Tiger Protection Pledges', records: certificates.length, folder: '04_Tiger_Protection_Pledges' },
            { title: 'VTW Certificates', records: certificates.length, folder: '05_Certificates' },
            { title: 'VTW News', records: news.length, folder: '06_News' },
            { title: 'VTW Research & Publications', records: 12, folder: '07_Research_Publications' },
            { title: 'VTW Conservation Data', records: tigers.length + sightings.length + alerts.length, folder: '08_Conservation_Data' },
            { title: 'VTW Admin Audit Log', records: adminAuditLogs.length, folder: '01_Admin' }
          ].map((sheet, idx) => (
            <div
              key={idx}
              className="p-3 bg-black/30 border border-emerald-800/60 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-emerald-100 font-mono">{sheet.title}</div>
                <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                  📁 {sheet.folder}/
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-emerald-800/50 flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-300/70">Records:</span>
                <span className="text-amber-300 font-bold">{sheet.records}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Real-Time Admin Audit Log Table */}
      <div className="bg-[#07271D] border border-emerald-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-300">
              Administrative Audit Log
            </h4>
          </div>
          <button
            onClick={refreshAuditLogs}
            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-mono flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        <p className="text-xs text-emerald-200/80">
          Permanent administrative record of all logins, synchronizations, certificate operations, and modifications.
        </p>

        {adminAuditLogs.length === 0 ? (
          <div className="p-4 text-center text-xs text-emerald-300/60 font-mono bg-black/20 rounded-lg">
            No audit logs recorded in current session yet. All administrative actions are automatically recorded here.
          </div>
        ) : (
          <div className="overflow-x-auto border border-emerald-800/80 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/50 text-emerald-300 border-b border-emerald-800 text-[11px]">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Operator</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Record</th>
                  <th className="p-2.5">Result</th>
                  <th className="p-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800/40 text-emerald-100">
                {adminAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="p-2.5 whitespace-nowrap text-[11px] text-emerald-300/80">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2.5 whitespace-nowrap text-amber-300 font-bold">
                      {log.adminEmail === 'System Security' ? 'System Security' : 'Administrator'}
                    </td>
                    <td className="p-2.5 whitespace-nowrap font-bold text-white">
                      {log.action}
                    </td>
                    <td className="p-2.5 whitespace-nowrap text-emerald-300 capitalize">
                      {log.recordType}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.result === 'success'
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                            : 'bg-red-900/60 text-red-300 border border-red-700'
                        }`}
                      >
                        {log.result}
                      </span>
                    </td>
                    <td className="p-2.5 text-[11px] text-emerald-200/90 max-w-xs truncate">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
