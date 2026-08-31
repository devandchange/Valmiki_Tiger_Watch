import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TigerProfile, NewsArticle, SightingReport, ConservationAlert } from '../types';
import { 
  Lock, 
  Unlock, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Database, 
  Newspaper, 
  Eye, 
  ShieldAlert, 
  RefreshCw,
  Edit2
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin,
    tigers,
    addTiger,
    deleteTiger,
    news,
    addNews,
    deleteNews,
    sightings,
    updateSightingStatus,
    alerts,
    addAlert,
    toggleAlertStatus,
    deleteAlert,
    newsSources,
    toggleNewsSource,
    resetToDefaults
  } = useData();

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'tigers' | 'news' | 'sightings' | 'alerts' | 'sources' | 'system'>('tigers');

  // Tiger form state
  const [tigerCode, setTigerCode] = useState('');
  const [tigerName, setTigerName] = useState('');
  const [tigerSex, setTigerSex] = useState<'Male' | 'Female'>('Male');
  const [tigerAge, setTigerAge] = useState('3-4 years');
  const [tigerMarkings, setTigerMarkings] = useState('');
  const [tigerTerritory, setTigerTerritory] = useState('Valmikinagar Range');
  const [tigerPhoto, setTigerPhoto] = useState('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80');

  // News form state
  const [newsHeadline, setNewsHeadline] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsSource, setNewsSource] = useState('Bihar Forest Department Press Release');
  const [newsCategory, setNewsCategory] = useState('Forest Department');
  const [newsVerif, setNewsVerif] = useState<'verified_govt' | 'peer_reviewed' | 'established_media' | 'field_verified'>('verified_govt');

  // Alert form state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertSev, setAlertSev] = useState<'info' | 'warning' | 'critical'>('warning');
  const [alertRange, setAlertRange] = useState('All VTR Ranges');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPassword('');
    }
  };

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
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      status: 'Resident',
      photoUrl: tigerPhoto,
      notes: 'Monitored under VTW database.',
      verification: 'verified',
      sources: 'Field Survey Log'
    });

    setTigerCode('');
    setTigerName('');
    setTigerMarkings('');
    alert('New Tiger profile added successfully.');
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsHeadline || !newsSummary) return;

    addNews({
      headline: newsHeadline,
      publicationDate: new Date().toISOString().split('T')[0],
      source: newsSource,
      sourceLink: 'https://state.bihar.gov.in/forest/',
      summary: newsSummary,
      retrievedDate: new Date().toISOString().split('T')[0],
      verificationStatus: newsVerif,
      sourceCategory: newsCategory,
      tags: ['VTR', 'Conservation', 'Updates']
    });

    setNewsHeadline('');
    setNewsSummary('');
    alert('News article published successfully.');
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertDesc) return;

    addAlert({
      title: alertTitle,
      severity: alertSev,
      affectedRange: alertRange,
      date: new Date().toISOString().split('T')[0],
      description: alertDesc,
      source: 'VTR Control Cell',
      active: true
    });

    setAlertTitle('');
    setAlertDesc('');
    alert('Advisory broadcasted.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#0B3D2E] text-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-700 my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#07271D] px-6 py-4 border-b border-emerald-800 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-xl text-black">
              {isAdminAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">VTW Protected Admin Console</h2>
              <p className="text-xs text-amber-300 font-mono">
                {isAdminAuthenticated ? 'Authenticated Session • Full Administrative Rights' : 'Authorization Required'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Auth Barrier or Admin Tabs */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">Admin Authentication</h3>
              <p className="text-xs text-emerald-200/80">
                Enter your administrative key to manage tiger profiles, news, and reports.
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
                <div className="text-xs text-red-400 font-mono">
                  Incorrect credentials. Please try again.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl text-xs shadow-lg transition-all"
              >
                Sign In to Console
              </button>
            </form>

            <div className="p-3 bg-[#07271D] rounded-xl border border-emerald-800/60 text-[11px] text-emerald-300 font-mono">
              Demo Key: <code className="text-amber-300 font-bold">vtw2026admin</code>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Nav Tabs */}
            <div className="bg-[#07271D]/60 px-6 py-2 border-b border-emerald-800 flex flex-wrap gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab('tigers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === 'tigers' ? 'bg-amber-400 text-black font-bold' : 'text-emerald-300 hover:bg-emerald-800/40'
                }`}
              >
                Tigers ({tigers.length})
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === 'news' ? 'bg-amber-400 text-black font-bold' : 'text-emerald-300 hover:bg-emerald-800/40'
                }`}
              >
                News ({news.length})
              </button>
              <button
                onClick={() => setActiveTab('sightings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === 'sightings' ? 'bg-amber-400 text-black font-bold' : 'text-emerald-300 hover:bg-emerald-800/40'
                }`}
              >
                Sightings ({sightings.length})
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === 'alerts' ? 'bg-amber-400 text-black font-bold' : 'text-emerald-300 hover:bg-emerald-800/40'
                }`}
              >
                Advisories ({alerts.length})
              </button>
              <button
                onClick={() => setActiveTab('sources')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === 'sources' ? 'bg-amber-400 text-black font-bold' : 'text-emerald-300 hover:bg-emerald-800/40'
                }`}
              >
                News Sources ({newsSources.length})
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === 'system' ? 'bg-amber-400 text-black font-bold' : 'text-emerald-300 hover:bg-emerald-800/40'
                }`}
              >
                System Maintenance
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Tigers Tab */}
              {activeTab === 'tigers' && (
                <div className="space-y-6">
                  {/* Create Tiger */}
                  <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-4">
                    <h3 className="font-display font-bold text-base text-white flex items-center">
                      <Plus className="w-4 h-4 mr-1 text-amber-400" />
                      Add Monitored Tiger Individual
                    </h3>
                    <form onSubmit={handleCreateTiger} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-emerald-200 block mb-1">Tiger Code * (e.g. T-35)</label>
                        <input
                          type="text"
                          value={tigerCode}
                          onChange={(e) => setTigerCode(e.target.value)}
                          placeholder="T-35"
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
                          placeholder="Madanpur Queen"
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
                        <label className="text-emerald-200 block mb-1">Safe Territory / Range</label>
                        <input
                          type="text"
                          value={tigerTerritory}
                          onChange={(e) => setTigerTerritory(e.target.value)}
                          className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-emerald-200 block mb-1">Identification Markings *</label>
                        <input
                          type="text"
                          value={tigerMarkings}
                          onChange={(e) => setTigerMarkings(e.target.value)}
                          placeholder="Distinctive inverted V-flank stripes..."
                          className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-xs"
                        >
                          Register Tiger Profile
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List & Delete */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-sm text-emerald-300">Registered Individuals ({tigers.length})</h4>
                    <div className="space-y-2">
                      {tigers.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 bg-[#07271D] rounded-xl border border-emerald-800 flex justify-between items-center text-xs"
                        >
                          <div>
                            <span className="font-mono text-amber-300 font-bold mr-2">{t.code}</span>
                            <span className="text-white font-medium">{t.name || 'Unnamed'}</span>
                            <span className="text-emerald-400 text-[11px] ml-2">({t.sex}, {t.safeTerritory})</span>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm(`Delete profile for ${t.code}?`)) deleteTiger(t.id);
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* News Tab */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  {/* Create News */}
                  <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-4">
                    <h3 className="font-display font-bold text-base text-white flex items-center">
                      <Plus className="w-4 h-4 mr-1 text-amber-400" />
                      Publish Verified News Article
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
                      <div className="grid grid-cols-2 gap-3">
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
                            <option value="verified_govt">Official Government Source</option>
                            <option value="peer_reviewed">Peer-Reviewed Research</option>
                            <option value="field_verified">Field-Range Verified</option>
                            <option value="established_media">Established Media</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-xs"
                      >
                        Publish Verified News
                      </button>
                    </form>
                  </div>

                  {/* List News */}
                  <div className="space-y-2">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#07271D] rounded-xl border border-emerald-800 flex justify-between items-center text-xs"
                      >
                        <div className="max-w-lg">
                          <span className="text-amber-300 font-mono text-[11px] block">{item.publicationDate}</span>
                          <span className="text-white font-semibold line-clamp-1">{item.headline}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Delete news article?')) deleteNews(item.id);
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sightings Moderation Tab */}
              {activeTab === 'sightings' && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-base text-white">
                    Citizen Sightings Moderation ({sightings.length})
                  </h3>
                  <div className="space-y-3">
                    {sightings.map((s) => (
                      <div
                        key={s.id}
                        className="p-4 bg-[#07271D] rounded-2xl border border-emerald-800 space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-white text-sm">{s.species}</span>
                            <span className="text-emerald-300 font-mono text-xs ml-2">({s.generalLocation})</span>
                          </div>
                          <span className="font-mono text-amber-300 text-[11px]">{s.date}</span>
                        </div>
                        <p className="text-emerald-100/80">{s.behavior}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-emerald-900">
                          <span className="text-stone-400">Observer: {s.observer}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateSightingStatus(s.id, 'verified')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px]"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => updateSightingStatus(s.id, 'reported')}
                              className="px-2.5 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded text-[11px]"
                            >
                              Mark Reported
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advisories Tab */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  {/* Create Alert */}
                  <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-4">
                    <h3 className="font-display font-bold text-base text-white flex items-center">
                      <Plus className="w-4 h-4 mr-1 text-amber-400" />
                      Broadcast Conservation Alert
                    </h3>
                    <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
                      <div>
                        <label className="text-emerald-200 block mb-1">Advisory Title *</label>
                        <input
                          type="text"
                          value={alertTitle}
                          onChange={(e) => setAlertTitle(e.target.value)}
                          placeholder="e.g. Heavy Monsoon Inundation Advisory"
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
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-emerald-200 block mb-1">Severity</label>
                          <select
                            value={alertSev}
                            onChange={(e) => setAlertSev(e.target.value as any)}
                            className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-lg text-white"
                          >
                            <option value="warning">Warning (Amber)</option>
                            <option value="critical">Critical (Red)</option>
                            <option value="info">Info (Blue)</option>
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
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-xs"
                      >
                        Broadcast Alert
                      </button>
                    </form>
                  </div>

                  {/* List Alerts */}
                  <div className="space-y-2">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className="p-3 bg-[#07271D] rounded-xl border border-emerald-800 flex justify-between items-center text-xs"
                      >
                        <div>
                          <span className="font-bold text-white">{a.title}</span>
                          <span className="text-amber-400 font-mono text-[11px] ml-2">({a.severity})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleAlertStatus(a.id)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              a.active ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
                            }`}
                          >
                            {a.active ? 'Active' : 'Resolved'}
                          </button>
                          <button
                            onClick={() => deleteAlert(a.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News Ingestion Sources Tab */}
              {activeTab === 'sources' && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-base text-white">
                    Configured News Feeds & Channels
                  </h3>
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
                        </div>
                        <button
                          onClick={() => toggleNewsSource(src.id)}
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

              {/* System Maintenance Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div className="bg-[#07271D] p-6 rounded-2xl border border-emerald-800 space-y-4 text-xs">
                    <h3 className="font-display font-bold text-base text-white">
                      Data Storage & Persistence Controls
                    </h3>
                    <p className="text-emerald-200/80 leading-relaxed">
                      All changes are persisted in client localStorage with automatic fallback to initial verified records. You can reset database to verified baseline state at any time.
                    </p>

                    <button
                      onClick={() => {
                        if (confirm('Reset all databases to factory baseline records?')) {
                          resetToDefaults();
                          alert('Database reset to factory verified records.');
                        }
                      }}
                      className="px-4 py-2.5 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset All Records to Factory Baseline</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="bg-[#07271D] px-6 py-4 border-t border-emerald-800 flex justify-between items-center flex-shrink-0">
              <button
                onClick={logoutAdmin}
                className="text-xs text-red-400 hover:text-red-300 font-mono"
              >
                Sign Out of Admin Console
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#145A43] hover:bg-[#196d52] text-white rounded-xl text-xs font-semibold"
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
