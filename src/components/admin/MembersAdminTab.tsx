import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { VTWMember } from '../../types';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  X, 
  Eye, 
  EyeOff, 
  RefreshCw 
} from 'lucide-react';

export const MembersAdminTab: React.FC = () => {
  const { 
    vtwMembers, 
    refreshVTWMembers, 
    addVTWMemberRecord, 
    updateVTWMemberRecord, 
    deleteVTWMemberRecord, 
    uploadVTWMemberPhotograph 
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<VTWMember> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredMembers = vtwMembers.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          m.designation.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

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

  const handleOpenEdit = (m: VTWMember) => {
    setEditingMember({ ...m });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.fullName || !editingMember.designation) {
      setStatusMessage({ type: 'error', text: 'Full Name and Designation are required.' });
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
      setStatusMessage({ type: 'success', text: 'Member saved successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage({ type: 'error', text: 'Failed to save member.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    const ok = await deleteVTWMemberRecord(id);
    if (ok) {
      setStatusMessage({ type: 'success', text: 'Member removed.' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleToggleActive = async (m: VTWMember) => {
    await updateVTWMemberRecord(m.id, { isActive: !m.isActive });
  };

  const handlePhotoUpload = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image file size must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const res = await uploadVTWMemberPhotograph(memberId, dataUrl);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Photo uploaded successfully!' });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        alert(res.error || 'Failed to upload photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 text-stone-900 font-sans">
      {/* Top Header */}
      <div className="bg-[#07271D] text-white p-5 rounded-2xl border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-amber-500/30 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Organizational Team Registry</span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            VTW Officials & Team Members
          </h3>
          <p className="text-xs text-emerald-200/80 mt-1 max-w-xl font-mono">
            Maintain the roster of independent field coordinators, scientific advisors, and executive leaders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshVTWMembers(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-mono border border-emerald-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-mono font-bold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
            : 'bg-rose-50 text-rose-800 border border-rose-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Search members by name or designation..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          className="w-full sm:w-72 px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:border-emerald-600 outline-hidden bg-white"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-mono text-stone-500 whitespace-nowrap">Category:</label>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-mono bg-white focus:border-emerald-600 outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="leadership">Leadership</option>
            <option value="field_ops">Field Operations</option>
            <option value="scientific">Scientific Advisory</option>
            <option value="community">Community Outreach</option>
            <option value="admin">Administration</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs font-mono space-y-2">
            <Users className="w-8 h-8 mx-auto text-stone-400" />
            <p>No members match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMembers.map(m => (
                  <tr key={m.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-300 flex items-center justify-center relative flex-shrink-0">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-amber-800 text-[11px]">
                            {m.fullName.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <label title="Upload Photo" className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={e => handlePhotoUpload(m.id, e)}
                          />
                        </label>
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 font-sans text-sm">{m.fullName}</div>
                        <div className="text-[10px] text-stone-400">{m.contactEmail || 'No email provided'}</div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-sans text-stone-700">{m.designation}</td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] uppercase font-bold">
                        {m.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(m)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                          m.isActive 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-stone-100 text-stone-500 border border-stone-300'
                        }`}
                      >
                        {m.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{m.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-stone-500">{m.displayOrder ?? 1}</td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-800 hover:bg-stone-100 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.fullName)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
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
                  <label className="block font-bold text-stone-700 mb-1">Public Email</label>
                  <input
                    type="email"
                    value={editingMember.contactEmail || ''}
                    onChange={e => setEditingMember(prev => ({ ...prev!, contactEmail: e.target.value }))}
                    placeholder="official@valmikitigerwatch.in"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Public Phone</label>
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
                  id="admin-member-active"
                  checked={editingMember.isActive ?? true}
                  onChange={e => setEditingMember(prev => ({ ...prev!, isActive: e.target.checked }))}
                  className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
                />
                <label htmlFor="admin-member-active" className="text-stone-700 font-semibold cursor-pointer">
                  Active (Visible in public team registry)
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
    </div>
  );
};
