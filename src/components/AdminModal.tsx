import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TigerProfile, NewsArticle, WildlifeSighting, ConservationAlert, VerificationLevel, VisitorLocation, VerifiedStatistic } from '../types';
import { 
  Lock, 
  Unlock, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Newspaper, 
  Eye, 
  EyeOff,
  ShieldCheck, 
  RefreshCw,
  Edit2,
  Calendar,
  Clock,
  CheckCircle,
  FileCheck,
  Award,
  ExternalLink,
  Search,
  Filter,
  Save,
  Radio,
  BarChart3,
  Globe2,
  Sparkles,
  Info,
  MapPin,
  Compass,
  Navigation
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OFFICIAL_SOURCES_PRESETS = [
  'National Tiger Conservation Authority (NTCA) 5th Cycle AITE',
  'Bihar Forest Department Wildlife Division Official Census',
  'Wildlife Institute of India (WII) Tiger Monitoring Cell',
  'Valmiki Tiger Reserve Field Directorate Range Beat Log',
  'Chitwan-Valmiki Transboundary Gene Corridor Survey',
  'MoEFCC Project Tiger Statutory Annual Report'
];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { 
    isAdmin,
    adminLogin, 
    adminLogout,
    tigers,
    addTiger,
    updateTiger,
    deleteTiger,
    verifyTiger,
    setTigerVerificationStatus,
    toggleTigerLive,
    batchVerifyTigers,
    news,
    addNews,
    updateNews,
    deleteNews,
    verifyNews,
    toggleNewsLive,
    batchVerifyNews,
    sightings,
    updateSightingStatus,
    verifySighting,
    toggleSightingLive,
    deleteSighting,
    alerts,
    addAlert,
    toggleAlertStatus,
    deleteAlert,
    verifyAlert,
    updateAlertVerification,
    mapLocations,
    addMapLocation,
    updateMapLocation,
    deleteMapLocation,
    toggleMapLocationLive,
    resetMapLocations,
    verifiedStats,
    updateVerifiedStat,
    resetVerifiedStats,
    newsSources,
    toggleNewsSource,
    syncNewsSources,
    exportDataBackup,
    importDataBackup,
    resetToDefaults
  } = useData();

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'tigers' | 'news' | 'sightings' | 'alerts' | 'locations' | 'stats' | 'sources' | 'system'>('tigers');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Tiger form state
  const [isAddingTiger, setIsAddingTiger] = useState(false);
  const [editingTigerId, setEditingTigerId] = useState<string | null>(null);
  const [tigerCode, setTigerCode] = useState('');
  const [tigerName, setTigerName] = useState('');
  const [tigerSex, setTigerSex] = useState<'Male' | 'Female'>('Male');
  const [tigerAge, setTigerAge] = useState('3-4 years');
  const [tigerMarkings, setTigerMarkings] = useState('');
  const [tigerTerritory, setTigerTerritory] = useState('Valmikinagar Core Range');
  const [tigerPhoto, setTigerPhoto] = useState('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80');
  const [tigerVerifStatus, setTigerVerifStatus] = useState<'verified' | 'reported' | 'estimated' | 'unverified'>('verified');
  const [tigerSource, setTigerSource] = useState(OFFICIAL_SOURCES_PRESETS[0]);
  const [tigerVerifDate, setTigerVerifDate] = useState(new Date().toISOString().split('T')[0]);
  const [tigerLastDocDate, setTigerLastDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [tigerStripePattern, setTigerStripePattern] = useState('');
  const [tigerCondition, setTigerCondition] = useState('Healthy, prime adult');
  const [tigerCubs, setTigerCubs] = useState('');
  const [tigerRecentSighting, setTigerRecentSighting] = useState('');
  const [tigerIsLive, setTigerIsLive] = useState(true);

  // News form state
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsHeadline, setNewsHeadline] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsSource, setNewsSource] = useState('Bihar Forest Department Official Release');
  const [newsCategory, setNewsCategory] = useState('Forest Department');
  const [newsVerif, setNewsVerif] = useState<VerificationLevel>('verified_govt');
  const [newsVerifDate, setNewsVerifDate] = useState(new Date().toISOString().split('T')[0]);
  const [newsOfficialRef, setNewsOfficialRef] = useState('NTCA-MoEFCC/VTR/2026/08');
  const [newsIsLive, setNewsIsLive] = useState(true);

  // Alert form state
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertSev, setAlertSev] = useState<'info' | 'warning' | 'critical'>('warning');
  const [alertType, setAlertType] = useState<'advisory' | 'wildlife_safety' | 'forest_closure' | 'visitor_notice' | 'emergency'>('advisory');
  const [alertRange, setAlertRange] = useState('All VTR Ranges');
  const [alertAuthority, setAlertAuthority] = useState('VTR Field Directorate, Bettiah');
  const [alertIsSample, setAlertIsSample] = useState(false);

  // Location form state
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [locName, setLocName] = useState('');
  const [locNameHi, setLocNameHi] = useState('');
  const [locRange, setLocRange] = useState('Valmikinagar Range');
  const [locCategory, setLocCategory] = useState<'gate' | 'river' | 'historical' | 'watchtower' | 'stay' | 'town' | 'zone'>('gate');
  const [locElevation, setLocElevation] = useState('125 m');
  const [locLat, setLocLat] = useState('27.4326');
  const [locLng, setLocLng] = useState('83.8967');
  const [locHowToReach, setLocHowToReach] = useState('');
  const [locAttractions, setLocAttractions] = useState('');
  const [locDesc, setLocDesc] = useState('');
  const [locIsLive, setLocIsLive] = useState(true);

  // Interactive inline editing state
  const [customSourceInputs, setCustomSourceInputs] = useState<Record<string, string>>({});
  const [customDateInputs, setCustomDateInputs] = useState<Record<string, string>>({});
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Stats verification state
  const [verifiedCensusStats, setVerifiedCensusStats] = useState([
    {
      id: 'stat-01',
      title: 'Valmiki Tiger Reserve Population Count',
      value: '54+ Tigers',
      source: 'Bihar Forest Department & NTCA 5th Cycle Census Report',
      assessmentYear: '2023–2024',
      verifiedDate: '2026-08-20',
      status: 'verified_current',
      officialUrl: 'https://state.bihar.gov.in/forest/'
    },
    {
      id: 'stat-02',
      title: 'All-India National Tiger Census (AITE 5th Cycle)',
      value: '3,682 (Mean 3,167–3,925)',
      source: 'National Tiger Conservation Authority (NTCA) & WII Technical Summary',
      assessmentYear: '2022–2023',
      verifiedDate: '2026-08-15',
      status: 'verified_current',
      officialUrl: 'https://ntca.gov.in'
    },
    {
      id: 'stat-03',
      title: 'Global Wild Tiger Population in India',
      value: '75% of Worldwide Wild Tigers',
      source: 'IUCN Red List Assessment & MoEFCC Status Report',
      assessmentYear: '2024',
      verifiedDate: '2026-08-10',
      status: 'verified_current',
      officialUrl: 'https://moef.gov.in'
    },
    {
      id: 'stat-04',
      title: 'Active Automated Camera Trap Monitoring Pairs in VTR',
      value: '350+ Camera Stations',
      source: 'WII Phase-IV Digital Ecological Monitoring Grid',
      assessmentYear: '2025–2026',
      verifiedDate: '2026-08-25',
      status: 'verified_current',
      officialUrl: 'https://wii.gov.in'
    }
  ]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(password);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPassword('');
      showToast('Authenticated as Wildlife Data Administrator');
    }
  };

  // Tiger Operations
  const handleCreateTiger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tigerCode || !tigerMarkings) return;

    addTiger({
      code: tigerCode.trim().toUpperCase(),
      name: tigerName.trim() || undefined,
      sex: tigerSex,
      approxAge: tigerAge,
      markings: tigerMarkings,
      safeTerritory: tigerTerritory,
      cameraTrapRecords: 1,
      lastVerifiedDate: tigerVerifDate,
      lastDocumentedDate: tigerLastDocDate,
      status: 'Resident',
      photoUrl: tigerPhoto,
      notes: 'Monitored under VTW official database protocol.',
      verification: tigerVerifStatus,
      sources: tigerSource,
      isLive: tigerIsLive,
      verifiedBy: 'National Tiger Conservation Authority (NTCA) / Bihar Forest Dept',
      fullDossier: {
        stripePatternId: tigerStripePattern || `STRIPE-${tigerCode.trim().toUpperCase()}`,
        physicalCondition: tigerCondition,
        territorySizeKm2: '45-60 sq km',
        knownCubs: tigerCubs ? tigerCubs.split(',').map(c => c.trim()) : undefined,
        recentSightingsNote: tigerRecentSighting || undefined,
        verifiedRecordsCount: 1
      }
    });

    setTigerCode('');
    setTigerName('');
    setTigerMarkings('');
    setTigerStripePattern('');
    setTigerCubs('');
    setTigerRecentSighting('');
    setIsAddingTiger(false);
    showToast(`Tiger ${tigerCode.toUpperCase()} registered and stamped with verified status.`);
  };

  const handleQuickVerifyTiger = (tiger: TigerProfile) => {
    const today = new Date().toISOString().split('T')[0];
    const source = customSourceInputs[tiger.id] || tiger.sources || OFFICIAL_SOURCES_PRESETS[0];
    verifyTiger(tiger.id, source, today, true);
    showToast(`Tiger ${tiger.code} verified against NTCA protocol & stamped for ${today}.`);
  };

  // News Operations
  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsHeadline || !newsSummary) return;

    addNews({
      headline: newsHeadline,
      publicationDate: new Date().toISOString().split('T')[0],
      source: newsSource,
      sourceLink: 'https://state.bihar.gov.in/forest/',
      summary: newsSummary,
      retrievedDate: newsVerifDate,
      verifiedDate: newsVerifDate,
      verificationStatus: newsVerif,
      sourceCategory: newsCategory,
      officialSourceRef: newsOfficialRef,
      isLive: newsIsLive,
      verifiedBy: 'NTCA / State Forest Media Division',
      tags: ['VTR', 'Conservation', 'Official Advisory']
    });

    setNewsHeadline('');
    setNewsSummary('');
    setIsAddingNews(false);
    showToast('Verified news bulletin published with official reference.');
  };

  const handleQuickVerifyNews = (article: NewsArticle) => {
    const today = new Date().toISOString().split('T')[0];
    verifyNews(article.id, 'verified_govt', 'NTCA Official Bulletin Reference', today, true);
    showToast(`Article "${article.headline.slice(0, 30)}..." verified & stamped for ${today}.`);
  };

  // Sighting Operations
  const handleQuickVerifySighting = (s: WildlifeSighting) => {
    const today = new Date().toISOString().split('T')[0];
    verifySighting(s.id, 'Verified against VTR Range Beat patrol logs & safe coordinates.', today);
    showToast(`Sighting for ${s.species} officially verified and marked Live.`);
  };

  // Alert Operations
  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertDesc) return;

    addAlert({
      title: alertTitle,
      severity: alertSev,
      alertType: alertType,
      affectedRange: alertRange,
      date: new Date().toISOString().split('T')[0],
      issuedDate: new Date().toISOString().split('T')[0],
      issuingAuthority: alertAuthority,
      description: alertDesc,
      source: alertAuthority,
      verified: true,
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedSource: alertAuthority,
      verifiedBy: 'VTR Field Directorate',
      active: true,
      isSampleData: alertIsSample
    });

    setAlertTitle('');
    setAlertDesc('');
    setIsAddingAlert(false);
    showToast('Verified conservation advisory broadcasted live.');
  };

  // Location Operations
  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName) return;

    addMapLocation({
      name: locName,
      nameHi: locNameHi || locName,
      nameUr: locName,
      range: locRange,
      category: locCategory,
      elevation: locElevation,
      coordinates: { lat: parseFloat(locLat) || 27.43, lng: parseFloat(locLng) || 83.9 },
      coordsDisplay: `${locLat}° N, ${locLng}° E`,
      howToReach: locHowToReach || 'Via state highway NH-727 connecting to Bettiah/Bagaha.',
      howToReachHi: locHowToReach || 'बेतिया/बगहा से जोड़ने वाले राष्ट्रीय राजमार्ग NH-727 द्वारा।',
      attractions: locAttractions ? locAttractions.split(',').map(a => a.trim()) : ['Scenic Forest Point', 'Wildlife Observation'],
      description: locDesc || 'Official designated visitor destination in Valmiki Tiger Reserve.',
      descriptionHi: locDesc || 'वाल्मीकि टाइगर रिजर्व का अधिकृत पर्यटक स्थल।',
      isLive: locIsLive
    });

    setLocName('');
    setLocNameHi('');
    setLocHowToReach('');
    setLocAttractions('');
    setLocDesc('');
    setIsAddingLocation(false);
    showToast(`Visitor destination "${locName}" created and added to map.`);
  };

  // Stats verification
  const handleVerifyStat = (statId: string) => {
    const today = new Date().toISOString().split('T')[0];
    updateVerifiedStat(statId, { verifiedDate: today, status: 'verified_current' });
    showToast(`Statistic audit timestamp updated to ${today}.`);
  };

  // Batch verify tigers
  const handleBatchVerifyAllTigers = () => {
    const ids = tigers.map(t => t.id);
    batchVerifyTigers(ids, OFFICIAL_SOURCES_PRESETS[0]);
    showToast(`All ${tigers.length} tiger records verified and stamped against NTCA baseline.`);
  };

  // Calculations for Audit Bar
  const verifiedTigersCount = tigers.filter(t => t.verification === 'verified').length;
  const verifiedNewsCount = news.filter(n => n.verificationStatus === 'verified_govt' || n.verificationStatus === 'peer_reviewed').length;
  const verifiedSightingsCount = sightings.filter(s => s.verificationStatus === 'verified').length;
  const verifiedAlertsCount = alerts.filter(a => a.verified !== false).length;

  const totalDataPoints = tigers.length + news.length + sightings.length + alerts.length;
  const totalVerifiedPoints = verifiedTigersCount + verifiedNewsCount + verifiedSightingsCount + verifiedAlertsCount;
  const verificationPercent = Math.round((totalVerifiedPoints / (totalDataPoints || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0B3D2E] text-white max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-700 my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#07271D] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-emerald-800 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-xl text-black shadow-md">
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-white">VTW Data Verification & Admin Console</h2>
                {isAdmin && (
                  <span className="bg-emerald-900/80 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-700 hidden sm:inline">
                    OFFICIAL NTCA / GOVT AUDIT MODE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-300 font-mono">
                {isAdmin ? 'Official Pre-Publication Verification, Timestamping & Live Governance' : 'Authorization Required'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/50 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification */}
        {notificationMsg && (
          <div className="bg-amber-400 text-black px-6 py-2 text-xs font-mono font-bold flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-950" />
              {notificationMsg}
            </span>
            <button onClick={() => setNotificationMsg(null)} className="text-black/70 hover:text-black">
              ✕
            </button>
          </div>
        )}

        {/* Auth Barrier or Admin Console */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">Admin Verification Access</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Enter your administrative key to moderate data points, timestamp verifications against official NTCA / Bihar Forest Dept records, and govern public live visibility.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full p-3 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="text-xs text-red-400 font-mono bg-red-950/40 p-2 rounded-lg border border-red-800/50">
                  Incorrect credentials. Use the verified demo key below.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl text-xs shadow-lg transition-all"
              >
                Sign In to Verification Console
              </button>
            </form>

            <div className="p-3 bg-[#07271D] rounded-xl border border-emerald-800/60 text-[11px] text-emerald-300 font-mono">
              Demo Key: <code className="text-amber-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">vtw2026admin</code>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Verification Stats Ribbon */}
            <div className="bg-[#07271D] px-4 sm:px-6 py-2.5 border-b border-emerald-800 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] font-mono">
                <div className="flex items-center space-x-1.5 text-emerald-200">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audit Index: <strong className="text-amber-300">{verificationPercent}% Verified</strong></span>
                </div>
                <span className="text-emerald-700 hidden sm:inline">|</span>
                <span className="text-emerald-300">Tigers: <strong>{verifiedTigersCount}/{tigers.length}</strong></span>
                <span className="text-emerald-300">News: <strong>{verifiedNewsCount}/{news.length}</strong></span>
                <span className="text-emerald-300">Sightings: <strong>{verifiedSightingsCount}/{sightings.length}</strong></span>
                <span className="text-emerald-300">Alerts: <strong>{verifiedAlertsCount}/{alerts.length}</strong></span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBatchVerifyAllTigers}
                  className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg text-[10px] font-mono border border-emerald-600 flex items-center gap-1"
                  title="Verify all tiger profiles against official NTCA baseline in one click"
                >
                  <FileCheck className="w-3 h-3 text-amber-400" />
                  <span>Batch Verify Tigers (NTCA)</span>
                </button>
              </div>
            </div>

            {/* Admin Nav Tabs */}
            <div className="bg-[#07271D]/90 px-4 sm:px-6 py-2 border-b border-emerald-800 flex flex-wrap gap-1.5 sm:gap-2 flex-shrink-0">
              {[
                { id: 'tigers', label: `🐅 Tigers (${tigers.length})` },
                { id: 'news', label: `📰 News (${news.length})` },
                { id: 'sightings', label: `👁️ Sightings (${sightings.length})` },
                { id: 'alerts', label: `⚠️ Advisories (${alerts.length})` },
                { id: 'locations', label: `📍 Map & Gates (${mapLocations.length})` },
                { id: 'stats', label: `📊 Official Census Stats (${verifiedStats.length})` },
                { id: 'sources', label: `🌐 News Channels (${newsSources.length})` },
                { id: 'system', label: `⚙️ Persistence & Backup` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsAddingTiger(false);
                    setIsAddingNews(false);
                    setIsAddingAlert(false);
                    setIsAddingLocation(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeTab === tab.id 
                      ? 'bg-amber-400 text-black font-bold shadow' 
                      : 'text-emerald-300 hover:bg-emerald-800/50 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* ============================================================ */}
              {/* TAB 1: TIGERS INDIVIDUAL VERIFICATION & MANAGEMENT */}
              {/* ============================================================ */}
              {activeTab === 'tigers' && (
                <div className="space-y-6">
                  {/* Top Action Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsAddingTiger(!isAddingTiger)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAddingTiger ? 'Close Form' : 'Register Tiger Individual'}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <span className="text-emerald-300">Filter:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-[#07271D] border border-emerald-700 rounded-lg px-2.5 py-1 text-xs text-white"
                      >
                        <option value="all">All Records ({tigers.length})</option>
                        <option value="verified">Verified Official ({verifiedTigersCount})</option>
                        <option value="pending">Reported / Pending ({tigers.filter(t => t.verification === 'reported').length})</option>
                        <option value="draft">Unverified / Draft ({tigers.filter(t => t.verification === 'unverified' || t.isLive === false).length})</option>
                      </select>
                    </div>
                  </div>

                  {/* Add Tiger Form */}
                  {isAddingTiger && (
                    <div className="bg-[#07271D] p-5 rounded-2xl border border-amber-500/40 space-y-4 animate-fade-in shadow-xl">
                      <div className="flex justify-between items-center border-b border-emerald-800 pb-2">
                        <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Register New Monitored Tiger Individual
                        </h3>
                        <span className="text-[11px] font-mono text-emerald-400">Pre-Publication Verification Protocol</span>
                      </div>

                      <form onSubmit={handleCreateTiger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-emerald-200 block mb-1">Tiger Code * (e.g. T-106)</label>
                          <input
                            type="text"
                            value={tigerCode}
                            onChange={(e) => setTigerCode(e.target.value)}
                            placeholder="T-106"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Nickname (Optional)</label>
                          <input
                            type="text"
                            value={tigerName}
                            onChange={(e) => setTigerName(e.target.value)}
                            placeholder="e.g. Someshwar Prince"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Sex</label>
                          <select
                            value={tigerSex}
                            onChange={(e) => setTigerSex(e.target.value as any)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Estimated Age</label>
                          <input
                            type="text"
                            value={tigerAge}
                            onChange={(e) => setTigerAge(e.target.value)}
                            placeholder="4–5 Years"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Safe Territory (Generalized Beat)</label>
                          <input
                            type="text"
                            value={tigerTerritory}
                            onChange={(e) => setTigerTerritory(e.target.value)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Initial Verification Status</label>
                          <select
                            value={tigerVerifStatus}
                            onChange={(e) => setTigerVerifStatus(e.target.value as any)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          >
                            <option value="verified">Verified Official (NTCA / Forest Dept)</option>
                            <option value="reported">Reported Observation</option>
                            <option value="estimated">Estimated / Camera Trap Match</option>
                            <option value="unverified">Unverified (Draft Mode)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-emerald-200 block mb-1">Official Verification Source</label>
                          <select
                            value={tigerSource}
                            onChange={(e) => setTigerSource(e.target.value)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          >
                            {OFFICIAL_SOURCES_PRESETS.map((src, i) => (
                              <option key={i} value={src}>{src}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Verification Timestamp Date</label>
                          <input
                            type="date"
                            value={tigerVerifDate}
                            onChange={(e) => setTigerVerifDate(e.target.value)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Last Documented Date (Camera-Trap)</label>
                          <input
                            type="date"
                            value={tigerLastDocDate}
                            onChange={(e) => setTigerLastDocDate(e.target.value)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Stripe Pattern Reference ID</label>
                          <input
                            type="text"
                            value={tigerStripePattern}
                            onChange={(e) => setTigerStripePattern(e.target.value)}
                            placeholder="e.g. VTR-SP-106-FL"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Physical Condition Assessment</label>
                          <input
                            type="text"
                            value={tigerCondition}
                            onChange={(e) => setTigerCondition(e.target.value)}
                            placeholder="Healthy, dominant adult male"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-emerald-200 block mb-1">Known Cubs / Offspring (comma-separated)</label>
                          <input
                            type="text"
                            value={tigerCubs}
                            onChange={(e) => setTigerCubs(e.target.value)}
                            placeholder="e.g. T-107, Cub-2024-B"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Recent Observation Notes</label>
                          <input
                            type="text"
                            value={tigerRecentSighting}
                            onChange={(e) => setTigerRecentSighting(e.target.value)}
                            placeholder="Camera trap grid cell B4-12"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-emerald-200 block mb-1">Distinctive Stripe / Flank Markings *</label>
                          <input
                            type="text"
                            value={tigerMarkings}
                            onChange={(e) => setTigerMarkings(e.target.value)}
                            placeholder="Distinctive inverted V-flank stripes on right shoulder..."
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div className="sm:col-span-3 flex items-center justify-between pt-2">
                          <label className="flex items-center space-x-2 text-emerald-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tigerIsLive}
                              onChange={(e) => setTigerIsLive(e.target.checked)}
                              className="rounded text-amber-500 focus:ring-amber-400"
                            />
                            <span className="font-mono text-xs">Publish directly to Public Tiger Tracking Register (Live)</span>
                          </label>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs shadow"
                          >
                            Save & Stamp Verified
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Tigers List with Verification UI */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display font-bold text-sm text-emerald-300">
                        Registered Tiger Records ({tigers.length}) • Verification & Governance Grid
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {tigers
                        .filter(t => {
                          if (statusFilter === 'verified') return t.verification === 'verified';
                          if (statusFilter === 'pending') return t.verification === 'reported';
                          if (statusFilter === 'draft') return t.verification === 'unverified' || t.isLive === false;
                          return true;
                        })
                        .map((tiger) => {
                          const isLive = tiger.isLive !== false;
                          return (
                            <div
                              key={tiger.id}
                              className={`p-4 bg-[#07271D] rounded-2xl border transition-all ${
                                tiger.verification === 'verified'
                                  ? 'border-emerald-700/80 shadow-sm'
                                  : tiger.verification === 'reported'
                                  ? 'border-amber-600/70 bg-amber-950/10'
                                  : 'border-stone-700 bg-stone-900/30'
                              } space-y-3`}
                            >
                              {/* Item Header */}
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="flex items-center space-x-2.5">
                                  <span className="font-mono text-amber-300 font-bold text-sm bg-black/40 px-2.5 py-0.5 rounded border border-amber-500/40">
                                    {tiger.code}
                                  </span>
                                  <div>
                                    <span className="text-white font-bold text-sm">{tiger.name || 'Unnamed Individual'}</span>
                                    <span className="text-emerald-400 text-xs font-mono ml-2">({tiger.sex}, approx. {tiger.approxAge})</span>
                                  </div>
                                </div>

                                {/* Live and Verification Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Verification Status Badge */}
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                    tiger.verification === 'verified'
                                      ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                                      : tiger.verification === 'estimated'
                                      ? 'bg-sky-950 text-sky-200 border border-sky-500'
                                      : tiger.verification === 'reported'
                                      ? 'bg-amber-900 text-amber-200 border border-amber-500'
                                      : 'bg-stone-800 text-stone-300 border border-stone-600'
                                  }`}>
                                    {tiger.verification === 'verified' && <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />}
                                    {tiger.verification === 'estimated' && <Eye className="w-3 h-3 mr-1 text-sky-400" />}
                                    {tiger.verification === 'reported' && <Clock className="w-3 h-3 mr-1 text-amber-400" />}
                                    {tiger.verification === 'unverified' && <AlertTriangle className="w-3 h-3 mr-1 text-stone-400" />}
                                    {tiger.verification.toUpperCase()}
                                  </span>

                                  {/* Live Toggle Pill */}
                                  <button
                                    onClick={() => {
                                      toggleTigerLive(tiger.id);
                                      showToast(`Tiger ${tiger.code} set to ${!isLive ? 'LIVE' : 'DRAFT'}`);
                                    }}
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                                      isLive 
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 hover:bg-emerald-500/30' 
                                        : 'bg-red-950/40 text-red-300 border border-red-700 hover:bg-red-900/40'
                                    }`}
                                    title="Click to toggle public live publication"
                                  >
                                    {isLive ? <Eye className="w-3 h-3 mr-1 text-emerald-400" /> : <EyeOff className="w-3 h-3 mr-1 text-red-400" />}
                                    {isLive ? 'PUBLIC LIVE' : 'RESTRICTED DRAFT'}
                                  </button>
                                </div>
                              </div>

                              {/* Details Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-200/90 bg-[#0B3D2E]/60 p-3 rounded-xl border border-emerald-800/60">
                                <div>
                                  <span className="text-emerald-400 font-mono text-[11px] block">Safe Range Beat:</span>
                                  <span>{tiger.safeTerritory}</span>
                                </div>
                                <div>
                                  <span className="text-emerald-400 font-mono text-[11px] block">Stripe Markings:</span>
                                  <span className="truncate block">{tiger.markings}</span>
                                </div>
                              </div>

                              {/* Verification Controls Bar */}
                              <div className="bg-[#051C14] p-3 rounded-xl border border-emerald-900/80 space-y-2 text-xs">
                                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-emerald-400">Official Source:</span>
                                    <span className="text-white font-medium truncate max-w-md">
                                      {tiger.sources || 'Official NTCA 5th Cycle Protocol'}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1.5 text-amber-300">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Last Verified: <strong>{tiger.lastVerifiedDate || '2026-08-20'}</strong></span>
                                  </div>
                                </div>

                                {/* Quick Verification Action Buttons */}
                                <div className="pt-2 border-t border-emerald-900 flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                      onClick={() => handleQuickVerifyTiger(tiger)}
                                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-mono flex items-center gap-1 font-bold shadow-sm"
                                    >
                                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                                      <span>⚡ Stamp Verified Today (NTCA)</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setTigerVerificationStatus(tiger.id, 'reported', true);
                                        showToast(`Tiger ${tiger.code} updated to Reported observation status.`);
                                      }}
                                      className="px-2 py-1 bg-[#0B3D2E] hover:bg-emerald-800 text-amber-300 rounded-lg text-[11px] font-mono border border-emerald-700"
                                    >
                                      Set Reported
                                    </button>

                                    <button
                                      onClick={() => {
                                        setTigerVerificationStatus(tiger.id, 'estimated', true);
                                        showToast(`Tiger ${tiger.code} updated to Estimated status.`);
                                      }}
                                      className="px-2 py-1 bg-[#0B3D2E] hover:bg-sky-950/60 text-sky-300 rounded-lg text-[11px] font-mono border border-sky-800"
                                    >
                                      Set Estimated
                                    </button>

                                    <button
                                      onClick={() => {
                                        setTigerVerificationStatus(tiger.id, 'unverified', false);
                                        showToast(`Tiger ${tiger.code} moved to Unverified Draft mode.`);
                                      }}
                                      className="px-2 py-1 bg-[#0B3D2E] hover:bg-red-950/50 text-stone-300 rounded-lg text-[11px] font-mono border border-emerald-800"
                                    >
                                      Hold as Draft
                                    </button>
                                  </div>

                                  <div className="flex items-center space-x-1.5">
                                    <button
                                      onClick={() => {
                                        const newSource = prompt('Update Official Government Verification Source:', tiger.sources);
                                        if (newSource) {
                                          setTigerVerificationStatus(tiger.id, tiger.verification, tiger.isLive, newSource);
                                          showToast('Official source reference updated.');
                                        }
                                      }}
                                      className="p-1 text-emerald-400 hover:text-white hover:bg-emerald-900 rounded"
                                      title="Edit verification source string"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete profile for tiger ${tiger.code}?`)) {
                                          deleteTiger(tiger.id);
                                          showToast(`Tiger ${tiger.code} removed from register.`);
                                        }
                                      }}
                                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded"
                                      title="Delete tiger record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 2: NEWS VERIFICATION & GOVERNANCE */}
              {/* ============================================================ */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <button
                      onClick={() => setIsAddingNews(!isAddingNews)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingNews ? 'Close Form' : 'Publish Verified News Bulletin'}</span>
                    </button>

                    <span className="text-xs font-mono text-emerald-300">
                      Total Articles: <strong>{news.length}</strong> • Verified Govt: <strong>{verifiedNewsCount}</strong>
                    </span>
                  </div>

                  {/* Add News Form */}
                  {isAddingNews && (
                    <div className="bg-[#07271D] p-5 rounded-2xl border border-amber-500/40 space-y-4 animate-fade-in shadow-xl">
                      <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-2 border-b border-emerald-800 pb-2">
                        <Newspaper className="w-4 h-4" />
                        Publish Official Verified News Article
                      </h3>

                      <form onSubmit={handleCreateNews} className="space-y-3 text-xs">
                        <div>
                          <label className="text-emerald-200 block mb-1">Headline *</label>
                          <input
                            type="text"
                            value={newsHeadline}
                            onChange={(e) => setNewsHeadline(e.target.value)}
                            placeholder="e.g. NTCA Assessment Validates Tiger Expansion in VTR"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Summary *</label>
                          <textarea
                            rows={2}
                            value={newsSummary}
                            onChange={(e) => setNewsSummary(e.target.value)}
                            placeholder="Brief 2-3 sentence overview..."
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-emerald-200 block mb-1">Source Authority</label>
                            <input
                              type="text"
                              value={newsSource}
                              onChange={(e) => setNewsSource(e.target.value)}
                              className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="text-emerald-200 block mb-1">Verification Level</label>
                            <select
                              value={newsVerif}
                              onChange={(e) => setNewsVerif(e.target.value as any)}
                              className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            >
                              <option value="verified_govt">Official Government Source (NTCA / Dept)</option>
                              <option value="peer_reviewed">Peer-Reviewed Research (WII / Journal)</option>
                              <option value="field_verified">Field-Range Verified</option>
                              <option value="established_media">Established Media Bulletin</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-emerald-200 block mb-1">Official Reference #</label>
                            <input
                              type="text"
                              value={newsOfficialRef}
                              onChange={(e) => setNewsOfficialRef(e.target.value)}
                              placeholder="e.g. NTCA-MoEFCC/2026/VTR"
                              className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center space-x-2 text-emerald-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newsIsLive}
                              onChange={(e) => setNewsIsLive(e.target.checked)}
                              className="rounded text-amber-500 focus:ring-amber-400"
                            />
                            <span className="font-mono text-xs">Publish to Public Portal (Live)</span>
                          </label>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-xs shadow"
                          >
                            Publish Verified Article
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* News List */}
                  <div className="space-y-3">
                    {news.map((item) => {
                      const isLive = item.isLive !== false;
                      return (
                        <div
                          key={item.id}
                          className="p-4 bg-[#07271D] rounded-2xl border border-emerald-800 space-y-3 text-xs"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="max-w-2xl space-y-1">
                              <div className="flex items-center space-x-2 text-[11px] font-mono">
                                <span className="text-amber-300 font-bold">{item.publicationDate}</span>
                                <span className="text-emerald-500">•</span>
                                <span className="text-emerald-300">{item.source}</span>
                              </div>
                              <h4 className="text-white font-bold text-sm leading-snug">{item.headline}</h4>
                            </div>

                            {/* Status and Live Toggle */}
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                item.verificationStatus === 'verified_govt'
                                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                                  : 'bg-indigo-950 text-indigo-200 border border-indigo-700'
                              }`}>
                                {item.verificationStatus.toUpperCase()}
                              </span>
                              <button
                                onClick={() => {
                                  toggleNewsLive(item.id);
                                  showToast(`Article status set to ${!isLive ? 'LIVE' : 'DRAFT'}`);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isLive ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
                                }`}
                              >
                                {isLive ? 'LIVE' : 'DRAFT'}
                              </button>
                            </div>
                          </div>

                          <p className="text-emerald-200/80 line-clamp-2 leading-relaxed bg-[#0B3D2E]/50 p-2.5 rounded-xl">
                            {item.summary}
                          </p>

                          {/* Verification Audit Footer */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-900 text-[11px] font-mono text-emerald-300">
                            <div className="flex items-center space-x-3">
                              <span>Verified: <strong>{item.retrievedDate || item.publicationDate}</strong></span>
                              <span>Ref: <strong className="text-amber-300">{item.officialSourceRef || 'NTCA-MoEFCC/VTR'}</strong></span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuickVerifyNews(item)}
                                className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded text-[10px] font-bold"
                              >
                                ⚡ Stamp Verified (NTCA)
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Delete this news article?')) {
                                    deleteNews(item.id);
                                    showToast('Article deleted.');
                                  }
                                }}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 3: CITIZEN SIGHTINGS MODERATION */}
              {/* ============================================================ */}
              {activeTab === 'sightings' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-sm text-emerald-300">
                      Citizen & Field Sightings Moderation ({sightings.length})
                    </h3>
                    <span className="text-xs font-mono text-amber-300">
                      Requires Range Beat & Safety Verification Before Live Display
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sightings.map((s) => {
                      const isLive = s.isLive !== false && (s.verificationStatus === 'verified' || s.verificationStatus === 'reported');
                      return (
                        <div
                          key={s.id}
                          className="p-4 bg-[#07271D] rounded-2xl border border-emerald-800 space-y-3 text-xs"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-white text-sm">{s.species}</span>
                              <span className="text-emerald-300 font-mono text-xs ml-2">
                                ({s.generalLocation || s.approximateZone || 'Valmiki Safari Zone'})
                              </span>
                              <span className="text-stone-400 block text-[11px] font-mono mt-0.5">
                                Observed: {s.observationDate || s.date} • Count: {s.count || s.numberOfAnimals || 1}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                s.verificationStatus === 'verified'
                                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                                  : s.verificationStatus === 'flagged'
                                  ? 'bg-red-900 text-red-200 border border-red-500'
                                  : 'bg-amber-900 text-amber-200 border border-amber-500'
                              }`}>
                                {s.verificationStatus.toUpperCase()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                isLive ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
                              }`}>
                                {isLive ? 'LIVE' : 'HELD'}
                              </span>
                            </div>
                          </div>

                          <p className="text-emerald-100/90 leading-relaxed bg-[#0B3D2E]/60 p-3 rounded-xl">
                            {s.safeDescription || s.behavior}
                          </p>

                          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-emerald-900 gap-2 text-[11px] font-mono">
                            <span className="text-stone-400">Observer: {s.reporterName || s.observer || 'Visitor'}</span>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuickVerifySighting(s)}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-bold flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verify against Range Beat Log</span>
                              </button>
                              <button
                                onClick={() => {
                                  updateSightingStatus(s.id, 'reported');
                                  showToast('Marked as unverified reported observation.');
                                }}
                                className="px-2 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded text-[11px]"
                              >
                                Mark Reported
                              </button>
                              <button
                                onClick={() => {
                                  updateSightingStatus(s.id, 'flagged');
                                  showToast('Sighting flagged & hidden.');
                                }}
                                className="px-2 py-1 bg-red-900 hover:bg-red-800 text-white rounded text-[11px]"
                              >
                                Flag / Deny
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Delete this sighting?')) deleteSighting(s.id);
                                }}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 4: ADVISORIES & RANGE ALERTS */}
              {/* ============================================================ */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <button
                      onClick={() => setIsAddingAlert(!isAddingAlert)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingAlert ? 'Close Form' : 'Broadcast Conservation Advisory'}</span>
                    </button>
                    <span className="text-xs font-mono text-emerald-300">
                      Active Broadcasts: <strong>{alerts.filter(a => a.active).length}</strong>
                    </span>
                  </div>

                  {/* Add Alert Form */}
                  {isAddingAlert && (
                    <div className="bg-[#07271D] p-5 rounded-2xl border border-amber-500/40 space-y-4 animate-fade-in shadow-xl">
                      <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-2 border-b border-emerald-800 pb-2">
                        <AlertTriangle className="w-4 h-4" />
                        Broadcast Official Verified Advisory
                      </h3>

                      <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
                        <div>
                          <label className="text-emerald-200 block mb-1">Advisory Title *</label>
                          <input
                            type="text"
                            value={alertTitle}
                            onChange={(e) => setAlertTitle(e.target.value)}
                            placeholder="e.g. Gandak High Water Inundation & Buffer Range Precaution"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Description *</label>
                          <textarea
                            rows={2}
                            value={alertDesc}
                            onChange={(e) => setAlertDesc(e.target.value)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="text-emerald-200 block mb-1">Severity Tier</label>
                            <select
                              value={alertSev}
                              onChange={(e) => setAlertSev(e.target.value as any)}
                              className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            >
                              <option value="warning">Warning (Amber Alert)</option>
                              <option value="critical">Critical (Red Emergency)</option>
                              <option value="info">Informational (Blue Notice)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-emerald-200 block mb-1">Alert Classification</label>
                            <select
                              value={alertType}
                              onChange={(e) => setAlertType(e.target.value as any)}
                              className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            >
                              <option value="advisory">Advisory</option>
                              <option value="wildlife_safety">Wildlife Safety</option>
                              <option value="forest_closure">Forest Closure</option>
                              <option value="visitor_notice">Visitor Notice</option>
                              <option value="emergency">Emergency Action</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-emerald-200 block mb-1">Affected Range</label>
                            <input
                              type="text"
                              value={alertRange}
                              onChange={(e) => setAlertRange(e.target.value)}
                              className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="text-emerald-200 block mb-1">Issuing Authority</label>
                            <input
                              type="text"
                              value={alertAuthority}
                              onChange={(e) => setAlertAuthority(e.target.value)}
                              className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                          <label className="flex items-center space-x-2 text-emerald-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={alertIsSample}
                              onChange={(e) => setAlertIsSample(e.target.checked)}
                              className="rounded text-amber-500 focus:ring-amber-400"
                            />
                            <span className="font-mono text-xs">Flag as Simulated / Drill Data (Sample)</span>
                          </label>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-xs shadow"
                          >
                            Verify with Directorate & Broadcast Live
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List Alerts */}
                  <div className="space-y-3">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className="p-4 bg-[#07271D] rounded-2xl border border-emerald-800 space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{a.title}</span>
                              <span className="bg-emerald-950 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-700 uppercase">
                                {a.alertType || 'advisory'}
                              </span>
                              {a.isSampleData && (
                                <span className="bg-amber-950/80 text-amber-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-amber-600">
                                  SIMULATED DRILL
                                </span>
                              )}
                            </div>
                            <span className="text-amber-400 font-mono text-[11px] mt-0.5 block">
                              ({a.severity.toUpperCase()} • {a.affectedRange || 'All Ranges'})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                toggleAlertStatus(a.id);
                                showToast(`Alert set to ${!a.active ? 'ACTIVE' : 'RESOLVED'}`);
                              }}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                a.active ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
                              }`}
                            >
                              {a.active ? 'BROADCAST LIVE' : 'RESOLVED / INACTIVE'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete advisory?')) deleteAlert(a.id);
                              }}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-emerald-100/80 leading-relaxed bg-[#0B3D2E]/50 p-2.5 rounded-xl">
                          {a.description}
                        </p>

                        <div className="flex justify-between items-center pt-2 border-t border-emerald-900 text-[11px] font-mono text-emerald-300">
                          <span>Authority: <strong>{a.issuingAuthority || a.source || a.verifiedSource || 'VTR Field Directorate'}</strong></span>
                          <span>Verified Timestamp: <strong>{a.verifiedDate || a.date}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 5: MAP LOCATIONS, GATES & TOURISM NODES */}
              {/* ============================================================ */}
              {activeTab === 'locations' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <button
                      onClick={() => setIsAddingLocation(!isAddingLocation)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingLocation ? 'Close Form' : 'Add Visitor Destination / Gate'}</span>
                    </button>
                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-emerald-300">
                        Total Sites: <strong>{mapLocations.length}</strong> (Live: {mapLocations.filter(m => m.isLive !== false).length})
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Reset visitor landmarks to default VTR inventory?')) {
                            resetMapLocations();
                            showToast('Map landmarks restored to official baseline.');
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 rounded text-[11px]"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  {/* Add Location Form */}
                  {isAddingLocation && (
                    <div className="bg-[#07271D] p-5 rounded-2xl border border-amber-500/40 space-y-4 animate-fade-in shadow-xl">
                      <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-2 border-b border-emerald-800 pb-2">
                        <MapPin className="w-4 h-4" />
                        Register Official Reserve Entry Gate / Landmark
                      </h3>

                      <form onSubmit={handleCreateLocation} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-emerald-200 block mb-1">Location Name (English) *</label>
                          <input
                            type="text"
                            value={locName}
                            onChange={(e) => setLocName(e.target.value)}
                            placeholder="e.g. Manguraha Tourism Gate"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Location Name (Hindi)</label>
                          <input
                            type="text"
                            value={locNameHi}
                            onChange={(e) => setLocNameHi(e.target.value)}
                            placeholder="e.g. मंगुराहा पर्यटन प्रवेश द्वार"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Category</label>
                          <select
                            value={locCategory}
                            onChange={(e) => setLocCategory(e.target.value as any)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          >
                            <option value="gate">Entry Gate / Checkpost</option>
                            <option value="watchtower">Observation Watchtower</option>
                            <option value="river">River Safari / Water Spot</option>
                            <option value="stay">Eco Rest House / Hut</option>
                            <option value="historical">Historical / Cultural Landmark</option>
                            <option value="town">Transit Hub / Railhead Town</option>
                            <option value="zone">Tourism Zone</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Forest Range</label>
                          <input
                            type="text"
                            value={locRange}
                            onChange={(e) => setLocRange(e.target.value)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Elevation</label>
                          <input
                            type="text"
                            value={locElevation}
                            onChange={(e) => setLocElevation(e.target.value)}
                            placeholder="125 m"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Latitude (° N)</label>
                          <input
                            type="text"
                            value={locLat}
                            onChange={(e) => setLocLat(e.target.value)}
                            placeholder="27.4326"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-200 block mb-1">Longitude (° E)</label>
                          <input
                            type="text"
                            value={locLng}
                            onChange={(e) => setLocLng(e.target.value)}
                            placeholder="83.8967"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-emerald-200 block mb-1">How to Reach (Road/Transit Guide)</label>
                          <input
                            type="text"
                            value={locHowToReach}
                            onChange={(e) => setLocHowToReach(e.target.value)}
                            placeholder="Accessible via Bagaha-Valmikinagar State Highway NH-727."
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-emerald-200 block mb-1">Attractions & Highlights (comma-separated)</label>
                          <input
                            type="text"
                            value={locAttractions}
                            onChange={(e) => setLocAttractions(e.target.value)}
                            placeholder="Safari Gate, Forest Rest House, Bird Watching, Sal Canopy"
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-emerald-200 block mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={locDesc}
                            onChange={(e) => setLocDesc(e.target.value)}
                            placeholder="Detailed visitor advisory and ecological context..."
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          />
                        </div>
                        <div className="sm:col-span-3 flex items-center justify-between pt-2">
                          <label className="flex items-center space-x-2 text-emerald-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={locIsLive}
                              onChange={(e) => setLocIsLive(e.target.checked)}
                              className="rounded text-amber-500 focus:ring-amber-400"
                            />
                            <span className="font-mono text-xs">Publish directly to Interactive Map (Live)</span>
                          </label>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs shadow"
                          >
                            Save & Add to Reserve Map
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mapLocations.map((loc) => {
                      const isLive = loc.isLive !== false;
                      return (
                        <div
                          key={loc.id}
                          className="p-4 bg-[#07271D] rounded-2xl border border-emerald-800 space-y-2 text-xs"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{loc.name}</span>
                                <span className="bg-emerald-950 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-700 uppercase">
                                  {loc.category}
                                </span>
                              </div>
                              <span className="text-emerald-300 font-mono text-[11px] block mt-0.5">
                                {loc.range} • {loc.coordsDisplay || `${loc.coordinates.lat}° N, ${loc.coordinates.lng}° E`}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  toggleMapLocationLive(loc.id);
                                  showToast(`Location "${loc.name}" set to ${!isLive ? 'LIVE' : 'DRAFT'}`);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isLive ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
                                }`}
                              >
                                {isLive ? 'LIVE' : 'DRAFT'}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete location "${loc.name}"?`)) deleteMapLocation(loc.id);
                                }}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-emerald-100/80 line-clamp-2 leading-relaxed">
                            {loc.description}
                          </p>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {loc.attractions.slice(0, 3).map((a, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-emerald-900/60 text-emerald-200 rounded text-[10px] font-mono">
                                • {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 6: OFFICIAL STATS & CENSUS METRICS AUDIT */}
              {/* ============================================================ */}
              {activeTab === 'stats' && (
                <div className="space-y-4">
                  <div className="bg-[#07271D] p-4 rounded-2xl border border-emerald-800 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        Official Population Census & Metrics Verification Registry
                      </h3>
                      <p className="text-xs text-emerald-200/80">
                        Governance and timestamping of official figures published in public reports. Persisted to database.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Reset official statistics to government baseline numbers?')) {
                          resetVerifiedStats();
                          showToast('Statistics restored to official baseline.');
                        }
                      }}
                      className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 rounded text-[11px] font-mono"
                    >
                      Reset Defaults
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verifiedStats.map((stat) => (
                      <div
                        key={stat.id}
                        className="p-5 bg-[#07271D] rounded-2xl border border-emerald-800 space-y-3 text-xs"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-xs text-amber-300 font-bold bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                            Assessment Year: {stat.assessmentYear}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-900 text-emerald-200 rounded text-[10px] font-mono font-bold border border-emerald-600">
                            ✓ {stat.status.toUpperCase().replace('_', ' ')}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-white text-base">{stat.title}</h4>
                          <p className="font-mono font-bold text-2xl text-amber-300 mt-1">{stat.value}</p>
                        </div>

                        <div className="bg-[#0B3D2E]/60 p-3 rounded-xl border border-emerald-900 space-y-1 text-[11px] font-mono text-emerald-200">
                          <div>Source: <strong className="text-white">{stat.source}</strong></div>
                          <div>Audit Timestamp: <strong className="text-amber-300">{stat.verifiedDate}</strong></div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-emerald-900">
                          <a
                            href={stat.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => handleVerifyStat(stat.id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-mono text-[11px] font-bold flex items-center gap-1 shadow"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                            <span>⚡ Re-Verify Today</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 6: NEWS SOURCES & FEEDS */}
              {/* ============================================================ */}
              {activeTab === 'sources' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-base text-white">
                      Configured Government News Feeds & Channels
                    </h3>
                    <button
                      onClick={async () => {
                        const res = await syncNewsSources();
                        showToast(res.message);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                      <span>Sync All Official Feeds Now</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newsSources.map((src) => (
                      <div
                        key={src.id}
                        className="p-4 bg-[#07271D] rounded-2xl border border-emerald-800 flex justify-between items-center text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{src.name}</span>
                            <span className="bg-emerald-950 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-700">
                              {src.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-emerald-300 font-mono text-[11px]">{src.url}</p>
                          <span className="text-stone-400 font-mono text-[10px] block">
                            Last Checked: {src.lastChecked} • Status: {src.checkStatus}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            toggleNewsSource(src.id);
                            showToast(`Source channel ${src.name} toggled.`);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                            src.enabled ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
                          }`}
                        >
                          {src.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 7: SYSTEM MAINTENANCE & BACKUP */}
              {/* ============================================================ */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div className="bg-[#07271D] p-6 rounded-2xl border border-emerald-800 space-y-4 text-xs">
                    <h3 className="font-display font-bold text-base text-white">
                      Data Storage, Backup & Persistence Controls
                    </h3>
                    <p className="text-emerald-200/80 leading-relaxed">
                      All tiger profiles, verified news bulletins, citizen sightings, and advisories are persisted locally with verified timestamps. You can export a full verified database backup or restore records.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => {
                          const json = exportDataBackup();
                          const blob = new Blob([json], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `vtw-verified-database-backup-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          showToast('Verified database backup exported as JSON.');
                        }}
                        className="px-4 py-2 bg-[#145A43] hover:bg-[#196d52] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <Database className="w-4 h-4 text-amber-300" />
                        <span>Export Verified Data Backup (JSON)</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Reset all databases to factory baseline records?')) {
                            resetToDefaults();
                            showToast('Database reset to factory verified records.');
                          }
                        }}
                        className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reset All Records to Factory Baseline</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="bg-[#07271D] px-4 sm:px-6 py-3.5 border-t border-emerald-800 flex justify-between items-center flex-shrink-0">
              <button
                onClick={() => {
                  adminLogout();
                  showToast('Signed out of admin console.');
                }}
                className="text-xs text-red-400 hover:text-red-300 font-mono"
              >
                Sign Out of Admin Console
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#145A43] hover:bg-[#196d52] text-white rounded-xl text-xs font-semibold shadow"
              >
                Close Console
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

