import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { VTWMember } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Check, 
  X, 
  Mail, 
  Phone,
  Compass,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES: Array<{ id: VTWMember['category'] | 'all'; label: string; hi: string; ur: string }> = [
  { id: 'all', label: 'All Officials', hi: 'सभी पदाधिकारी', ur: 'تمام عہدیداران' },
  { id: 'leadership', label: 'Leadership', hi: 'नेतृत्व', ur: 'قیادت' },
  { id: 'field_ops', label: 'Field Operations', hi: 'फील्ड संचालन', ur: 'فیلڈ آپریشنز' },
  { id: 'scientific', label: 'Scientific Advisory', hi: 'वैज्ञानिक सलाहकार', ur: 'سائنسی مشیر' },
  { id: 'community', label: 'Community Outreach', hi: 'सामुदायिक संपर्क', ur: 'کمیونٹی رابطہ' },
  { id: 'admin', label: 'Administration', hi: 'प्रशासन', ur: 'انتظامیہ' },
];

export const VTWMemberSection: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { 
    vtwMembers, 
    isAdmin, 
    addVTWMemberRecord, 
    updateVTWMemberRecord, 
    deleteVTWMemberRecord, 
    uploadVTWMemberPhotograph 
  } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingMember, setEditingMember] = useState<Partial<VTWMember> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const filteredMembers = vtwMembers.filter(m => {
    if (!m.isActive && !isAdmin) return false;
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  }).sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  const handleOpenAdd = () => {
    setEditingMember({
      fullName: '',
      designation: '',
      category: 'field_ops',
      bio: '',
      contactEmail: '',
      contactPhone: '',
      photoUrl: '',
      displayOrder: vtwMembers.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: VTWMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.fullName || !editingMember.designation) {
      alert('Name and Designation are required.');
      return;
    }

    setIsSaving(true);
    let success = false;
    if (editingMember.id) {
      success = await updateVTWMemberRecord(editingMember.id, editingMember);
    } else {
      success = await addVTWMemberRecord(editingMember as any);
    }
    setIsSaving(false);

    if (success) {
      setIsModalOpen(false);
      setEditingMember(null);
      setFeedbackMsg('Member record saved successfully.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } else {
      alert('Failed to save member. Please verify admin session.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"?`)) return;
    const ok = await deleteVTWMemberRecord(id);
    if (ok) {
      setFeedbackMsg('Member removed.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  const handlePhotoUpload = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('Image size must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const res = await uploadVTWMemberPhotograph(memberId, dataUrl);
      if (res.success) {
        setFeedbackMsg('Member photograph updated.');
        setTimeout(() => setFeedbackMsg(''), 3000);
      } else {
        alert(res.error || 'Failed to upload photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="vtw-officials-section" className="space-y-6 pt-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>
              {language === 'hi' ? 'संगठनात्मक टीम' : language === 'ur' ? 'تنظیمی ٹیم' : 'Organizational Team'}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'hi' 
              ? 'वीटीडब्ल्यू पदाधिकारी एवं सदस्य' 
              : language === 'ur' 
              ? 'وی ٹی ڈبلیو عہدیداران اور اراکین' 
              : 'VTW Officials & Members'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'वाल्मीकि टाइगर रिजर्व के संरक्षण और वन्यजीव वकालत में समर्पित स्वतंत्र कार्यकर्ता और विशेषज्ञ।'
              : language === 'ur'
              ? 'والمیکی ٹائیگر ریزرو کے تحفظ اور نگرانی کے لیے وقف آزاد کارکن اور ماہرین۔'
              : 'Dedicated independent conservationists, field coordinators, and advocates protecting Valmiki Tiger Reserve.'}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#145A43] text-white text-xs font-mono font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Official / Member</span>
          </button>
        )}
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-mono text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const label = language === 'hi' ? cat.hi : language === 'ur' ? cat.ur : cat.label;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-[#0B3D2E] text-amber-300 border-[#0B3D2E] shadow-sm font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:border-stone-300'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 space-y-2">
          <Users className="w-10 h-10 text-stone-400 mx-auto" />
          <p className="text-sm font-medium">No official members listed in this category yet.</p>
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="text-xs text-emerald-700 underline font-mono"
            >
              Add the first member now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map(member => {
            const initials = member.fullName
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={member.id}
                className="group relative bg-white rounded-2xl border border-stone-200 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Photo/Badge + Category */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/70 bg-[#07271D] flex items-center justify-center shadow-inner flex-shrink-0">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.fullName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <span className="font-mono text-base font-bold text-amber-300">
                            {initials || 'VTW'}
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <label
                          title="Upload Member Photo"
                          className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md cursor-pointer border border-white"
                        >
                          <Upload className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(member.id, e)}
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                        {member.category.replace('_', ' ')}
                      </span>
                      {!member.isActive && (
                        <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Identity */}
                  <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-[#0B3D2E] transition-colors">
                    {member.fullName}
                  </h3>
                  <p className="text-xs font-mono font-semibold text-emerald-800 mt-0.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>{member.designation}</span>
                  </p>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-xs text-stone-600 leading-relaxed mt-2.5 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Footer / Contact / Admin Controls */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-3">
                    {member.contactEmail && (
                      <a
                        href={`mailto:${member.contactEmail}`}
                        className="text-stone-400 hover:text-emerald-700 transition"
                        title={member.contactEmail}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {member.contactPhone && (
                      <a
                        href={`tel:${member.contactPhone}`}
                        className="text-stone-400 hover:text-emerald-700 transition"
                        title={member.contactPhone}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(member)}
                        className="p-1 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-stone-100"
                        title="Edit Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(member.id, member.fullName)}
                        className="p-1 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Add/Edit Modal */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-emerald-800" />
              <h3 className="font-display text-xl font-bold text-stone-900">
                {editingMember.id ? 'Edit Official / Member' : 'Add New Official / Member'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.fullName || ''}
                  onChange={e => setEditingMember(prev => ({ ...prev!, fullName: e.target.value }))}
                  placeholder="e.g. Ramesh Kumar Verma"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={editingMember.designation || ''}
                  onChange={e => setEditingMember(prev => ({ ...prev!, designation: e.target.value }))}
                  placeholder="e.g. Field Coordinator & Wildlife Monitor"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingMember.category || 'field_ops'}
                    onChange={e => setEditingMember(prev => ({ ...prev!, category: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                  >
                    <option value="leadership">Leadership</option>
                    <option value="field_ops">Field Operations</option>
                    <option value="scientific">Scientific Advisory</option>
                    <option value="community">Community Outreach</option>
                    <option value="admin">Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingMember.displayOrder ?? 1}
                    onChange={e => setEditingMember(prev => ({ ...prev!, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Brief Profile / Bio</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={e => setEditingMember(prev => ({ ...prev!, bio: e.target.value }))}
                  placeholder="Key contributions, background, and responsibilities..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Public Email (optional)</label>
                  <input
                    type="email"
                    value={editingMember.contactEmail || ''}
                    onChange={e => setEditingMember(prev => ({ ...prev!, contactEmail: e.target.value }))}
                    placeholder="official@valmikitigerwatch.in"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Public Phone (optional)</label>
                  <input
                    type="text"
                    value={editingMember.contactPhone || ''}
                    onChange={e => setEditingMember(prev => ({ ...prev!, contactPhone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="member-active-toggle"
                  checked={editingMember.isActive ?? true}
                  onChange={e => setEditingMember(prev => ({ ...prev!, isActive: e.target.checked }))}
                  className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
                />
                <label htmlFor="member-active-toggle" className="text-stone-700 font-semibold cursor-pointer">
                  Active (Visible on public portal)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#0B3D2E] hover:bg-[#145A43] text-white font-bold shadow-md transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
