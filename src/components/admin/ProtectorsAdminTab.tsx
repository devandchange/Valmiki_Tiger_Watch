import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  X,
  Save,
  Users,
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { GrassrootsProtectorStory, EditorialStatus } from '../../types';

interface ProtectorsAdminTabProps {
  showToast?: (msg: string) => void;
}

export const ProtectorsAdminTab: React.FC<ProtectorsAdminTabProps> = ({ showToast }) => {
  const {
    grassrootsProtectors = [],
    addGrassrootsProtector,
    updateGrassrootsProtector,
    deleteGrassrootsProtector,
    setGrassrootsEditorialStatus
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EditorialStatus>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [protectorName, setProtectorName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Valmikinagar Core / Tharu Belt');
  const [photograph, setPhotograph] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photographerCredit, setPhotographerCredit] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [shortIntro, setShortIntro] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [achievementsText, setAchievementsText] = useState('');
  const [source, setSource] = useState('Valmiki Forest Beat Log & Community Council');
  const [sourceUrl, setSourceUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<EditorialStatus>('verified');
  const [verifiedBy, setVerifiedBy] = useState('VTR Range Directorate');
  const [verificationNotes, setVerificationNotes] = useState('');

  const resetForm = () => {
    setProtectorName('');
    setRole('');
    setLocation('Valmikinagar Core / Tharu Belt');
    setPhotograph('');
    setPhotoCaption('');
    setPhotographerCredit('');
    setStoryTitle('');
    setShortIntro('');
    setFullStory('');
    setAchievementsText('');
    setSource('Valmiki Forest Beat Log & Community Council');
    setSourceUrl('');
    setVerificationStatus('verified');
    setVerifiedBy('VTR Range Directorate');
    setVerificationNotes('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (p: GrassrootsProtectorStory) => {
    setEditingId(p.id);
    setIsAdding(true);
    setProtectorName(String(p.protectorName ?? ''));
    setRole(String(p.role ?? ''));
    setLocation(String(p.location ?? ''));
    setPhotograph(String(p.photograph ?? ''));
    setPhotoCaption(String(p.photoCaption ?? ''));
    setPhotographerCredit(String(p.photographerCredit ?? ''));
    setStoryTitle(String(p.storyTitle ?? ''));
    setShortIntro(String(p.shortIntro ?? ''));
    setFullStory(String(p.fullStory ?? ''));
    setAchievementsText(Array.isArray(p.achievements) ? p.achievements.join('\n') : '');
    setSource(String(p.source ?? ''));
    setSourceUrl(String(p.sourceUrl ?? ''));
    setVerificationStatus(p.verificationStatus || 'verified');
    setVerifiedBy(String(p.verifiedBy ?? ''));
    setVerificationNotes(String(p.verificationNotes ?? ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!protectorName.trim() || !role.trim() || !shortIntro.trim()) {
      showToast?.('Please provide protector name, role, and a short intro.');
      return;
    }

    const achievementsList = achievementsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const now = new Date().toISOString();

    if (editingId) {
      updateGrassrootsProtector(editingId, {
        protectorName: protectorName.trim(),
        role: role.trim(),
        location: location.trim(),
        photograph: photograph.trim(),
        photoCaption: photoCaption.trim() || undefined,
        photographerCredit: photographerCredit.trim() || undefined,
        storyTitle: storyTitle.trim(),
        shortIntro: shortIntro.trim(),
        fullStory: fullStory.trim(),
        achievements: achievementsList,
        source: source.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        verificationStatus,
        verifiedBy: verifiedBy.trim() || undefined,
        verificationNotes: verificationNotes.trim() || undefined,
        updatedAt: now
      });
      showToast?.(`Protector profile "${protectorName.trim()}" updated successfully.`);
    } else {
      addGrassrootsProtector({
        protectorName: protectorName.trim(),
        role: role.trim(),
        location: location.trim(),
        photograph: photograph.trim(),
        photoCaption: photoCaption.trim() || undefined,
        photographerCredit: photographerCredit.trim() || undefined,
        storyTitle: storyTitle.trim(),
        shortIntro: shortIntro.trim(),
        fullStory: fullStory.trim(),
        achievements: achievementsList,
        date: new Date().toISOString().split('T')[0],
        source: source.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        verificationStatus,
        verifiedBy: verifiedBy.trim() || undefined,
        verifiedDate: verificationStatus === 'verified' || verificationStatus === 'published' ? new Date().toISOString().split('T')[0] : undefined,
        verificationNotes: verificationNotes.trim() || undefined,
        likes: 0,
        dislikes: 0
      });
      showToast?.(`New protector "${protectorName.trim()}" registered.`);
    }

    resetForm();
  };

  // Safe search & filtering
  const filteredProtectors = useMemo(() => {
    const q = String(searchQuery ?? '').toLowerCase().trim();
    return (grassrootsProtectors || []).filter(p => {
      const matchesStatus = statusFilter === 'all' || p.verificationStatus === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;

      const achievementsStr = Array.isArray(p.achievements) ? p.achievements.map(a => String(a ?? '')).join(' ') : '';
      return (
        String(p.protectorName ?? '').toLowerCase().includes(q) ||
        String(p.role ?? '').toLowerCase().includes(q) ||
        String(p.location ?? '').toLowerCase().includes(q) ||
        String(p.storyTitle ?? '').toLowerCase().includes(q) ||
        String(p.shortIntro ?? '').toLowerCase().includes(q) ||
        String(p.fullStory ?? '').toLowerCase().includes(q) ||
        String(p.verifiedBy ?? '').toLowerCase().includes(q) ||
        String(p.source ?? '').toLowerCase().includes(q) ||
        achievementsStr.toLowerCase().includes(q)
      );
    });
  }, [grassrootsProtectors, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = (grassrootsProtectors || []).length;
    const published = (grassrootsProtectors || []).filter(p => p.verificationStatus === 'published').length;
    const verified = (grassrootsProtectors || []).filter(p => p.verificationStatus === 'verified').length;
    const pending = (grassrootsProtectors || []).filter(p => p.verificationStatus === 'pending_verification').length;
    const draft = (grassrootsProtectors || []).filter(p => p.verificationStatus === 'draft').length;
    return { total, published, verified, pending, draft };
  }, [grassrootsProtectors]);

  return (
    <div className="space-y-6">
      {/* Top Action & Summary Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Grassroots Protectors Management</span>
          </h3>
          <p className="text-[11px] text-emerald-300">
            Total: {stats.total} | Published: {stats.published} | Verified: {stats.verified} | Pending: {stats.pending} | Drafts: {stats.draft}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              setIsAdding(true);
            }
          }}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Close Form' : 'Add Protector Story'}</span>
        </button>
      </div>

      {/* Add / Edit Form Modal/Drawer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#07271D] p-5 rounded-2xl border border-amber-500/40 space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
            <h4 className="text-xs font-bold text-amber-300 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{editingId ? 'Edit Protector Story' : 'Register New Frontline Protector'}</span>
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Protector Name *</label>
              <input
                type="text"
                value={protectorName}
                onChange={(e) => setProtectorName(e.target.value)}
                placeholder="e.g. Rameshwar Mahato"
                required
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>

            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Role / Designation *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Indigenous Pugmark Tracker"
                required
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>

            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Location / Range</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Harnatanr Buffer & Tharu Foothills"
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Story Title</label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="e.g. 28 Years of Silent Footsteps Across Valmiki"
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>

            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Photograph URL</label>
              <input
                type="text"
                value={photograph}
                onChange={(e) => setPhotograph(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Photo Caption</label>
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="e.g. Inspecting fresh carnivore pugmarks on riverbed"
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>

            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Photographer Credit</label>
              <input
                type="text"
                value={photographerCredit}
                onChange={(e) => setPhotographerCredit(e.target.value)}
                placeholder="e.g. Valmiki Tiger Watch Field Team"
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-emerald-200 mb-1 font-semibold">Short Summary / Intro *</label>
            <textarea
              rows={2}
              value={shortIntro}
              onChange={(e) => setShortIntro(e.target.value)}
              placeholder="Concise summary of their frontline conservation contribution..."
              required
              className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
            />
          </div>

          <div className="text-xs">
            <label className="block text-emerald-200 mb-1 font-semibold">Full Story / Account</label>
            <textarea
              rows={4}
              value={fullStory}
              onChange={(e) => setFullStory(e.target.value)}
              placeholder="In-depth narrative of their experiences, encounters, and protection work..."
              className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
            />
          </div>

          <div className="text-xs">
            <label className="block text-emerald-200 mb-1 font-semibold">Key Achievements (One per line)</label>
            <textarea
              rows={3}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              placeholder="Identified 14 individual tigers through traditional pugmark reading&#10;Zero poaching incidents in his 12 km beat sector for five consecutive years"
              className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Verification Status</label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as EditorialStatus)}
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white"
              >
                <option value="draft">Draft</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Verified By</label>
              <input
                type="text"
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                placeholder="e.g. VTR Range Directorate"
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>

            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Source / Documentation</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Range Beat Log"
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>

            <div>
              <label className="block text-emerald-200 mb-1 font-semibold">Source URL (Optional)</label>
              <input
                type="text"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-emerald-200 mb-1 font-semibold">Internal Verification Notes</label>
            <input
              type="text"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Internal verification remarks or source cross-references..."
              className="w-full bg-[#0B3D2E] border border-emerald-700 rounded-lg p-2 text-white placeholder-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-800">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Save Changes' : 'Register Story'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#07271D] p-3 rounded-2xl border border-emerald-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by protector name, role, story title, achievements..."
            className="w-full pl-9 pr-8 py-1.5 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#0B3D2E] border border-emerald-700 rounded-lg px-2.5 py-1 text-xs text-white"
          >
            <option value="all">All ({stats.total})</option>
            <option value="published">Published ({stats.published})</option>
            <option value="verified">Verified ({stats.verified})</option>
            <option value="pending_verification">Pending ({stats.pending})</option>
            <option value="draft">Draft ({stats.draft})</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Protectors Table / List */}
      {filteredProtectors.length === 0 ? (
        <div className="p-8 text-center bg-[#07271D] rounded-2xl border border-emerald-800 text-xs text-emerald-400">
          No grassroots protector profiles matching your criteria.
        </div>
      ) : (
        <div className="bg-[#07271D] rounded-2xl border border-emerald-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#041a13] text-emerald-400 border-b border-emerald-800 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Protector</th>
                  <th className="px-4 py-3">Role & Location</th>
                  <th className="px-4 py-3">Story Highlights</th>
                  <th className="px-4 py-3">Verification Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/60 text-emerald-100">
                {filteredProtectors.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-900/30 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <div className="font-bold text-white text-sm">{p.protectorName}</div>
                      {p.storyTitle && (
                        <div className="text-[11px] text-amber-300 font-medium mt-0.5 line-clamp-1">{p.storyTitle}</div>
                      )}
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">
                        Doc: {p.date || '—'}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-emerald-200">{p.role}</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>{p.location}</span>
                      </div>
                      {p.source && (
                        <div className="text-[10px] text-stone-400 font-mono mt-1">
                          Src: {p.source}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top max-w-xs">
                      <p className="text-[11px] text-emerald-200 line-clamp-2">{p.shortIntro}</p>
                      {Array.isArray(p.achievements) && p.achievements.length > 0 && (
                        <div className="text-[10px] text-amber-300/80 font-mono mt-1 line-clamp-1">
                          ★ {p.achievements[0]}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <select
                        value={p.verificationStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value as EditorialStatus;
                          setGrassrootsEditorialStatus(p.id, newStatus);
                          showToast?.(`Status for "${p.protectorName}" set to ${newStatus}`);
                        }}
                        className={`text-[11px] font-mono font-bold rounded-lg px-2.5 py-1 border transition ${
                          p.verificationStatus === 'published'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                            : p.verificationStatus === 'verified'
                            ? 'bg-blue-950 text-blue-300 border-blue-600'
                            : p.verificationStatus === 'pending_verification'
                            ? 'bg-amber-950 text-amber-300 border-amber-600'
                            : 'bg-stone-800 text-stone-300 border-stone-600'
                        }`}
                      >
                        <option value="published">● Published</option>
                        <option value="verified">✔ Verified</option>
                        <option value="pending_verification">⏳ Pending</option>
                        <option value="draft">○ Draft</option>
                        <option value="archived">✖ Archived</option>
                      </select>

                      {p.verifiedBy && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">
                          By: {p.verifiedBy}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="p-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 rounded-lg transition"
                          title="Edit Protector Story"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the story of "${p.protectorName}"?`)) {
                              deleteGrassrootsProtector(p.id);
                              showToast?.(`Protector story "${p.protectorName}" deleted.`);
                            }
                          }}
                          className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg transition border border-rose-800/60"
                          title="Delete Protector Story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
