import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Edit3,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { VolunteerSubmission, SupporterSubmission } from '../../types';

interface VolunteersSupportersTabProps {
  showToast: (msg: string) => void;
}

export const VolunteersSupportersTab: React.FC<VolunteersSupportersTabProps> = ({ showToast }) => {
  const {
    volunteerSubmissions,
    supporterSubmissions,
    updateVolunteerSubmissionStatus,
    updateSupporterSubmissionStatus,
    deleteVolunteerSubmission,
    deleteSupporterSubmission,
    integrationSettings,
    feedbackSubmissions = [],
    updateFeedbackStatus,
    deleteFeedback
  } = useData();

  const [subTypeFilter, setSubTypeFilter] = useState<'all' | 'volunteers' | 'supporters' | 'feedback'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'contacted' | 'approved' | 'acknowledged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'volunteer' | 'supporter'; data: VolunteerSubmission | SupporterSubmission } | null>(null);

  // Notes editing
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Filter logic
  const q = searchQuery.toLowerCase().trim();

  const filteredVolunteers = volunteerSubmissions.filter((v) => {
    if (subTypeFilter === 'supporters') return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (!q) return true;
    return (
      String(v.fullName ?? '').toLowerCase().includes(q) ||
      String(v.email ?? '').toLowerCase().includes(q) ||
      String(v.mobile ?? '').includes(q) ||
      String(v.cityDistrict ?? '').toLowerCase().includes(q) ||
      (v.relevantSkills && String(v.relevantSkills).toLowerCase().includes(q)) ||
      (Array.isArray(v.areasOfInterest) && v.areasOfInterest.some((a) => String(a ?? '').toLowerCase().includes(q)))
    );
  });

  const filteredSupporters = supporterSubmissions.filter((s) => {
    if (subTypeFilter === 'volunteers') return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (!q) return true;
    return (
      String(s.fullName ?? '').toLowerCase().includes(q) ||
      String(s.email ?? '').toLowerCase().includes(q) ||
      String(s.mobile ?? '').includes(q) ||
      String(s.cityDistrict ?? '').toLowerCase().includes(q) ||
      (s.messageComments && String(s.messageComments).toLowerCase().includes(q)) ||
      (Array.isArray(s.supportOptions) && s.supportOptions.some((o) => String(o ?? '').toLowerCase().includes(q)))
    );
  });

  const filteredFeedback = feedbackSubmissions.filter((f) => {
    if (subTypeFilter !== 'all' && subTypeFilter !== 'feedback') return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (!q) return true;
    return (
      String(f.name ?? '').toLowerCase().includes(q) ||
      String(f.email ?? '').toLowerCase().includes(q) ||
      String(f.category ?? '').toLowerCase().includes(q) ||
      String(f.message ?? '').toLowerCase().includes(q) ||
      String(f.deviceInfo ?? '').toLowerCase().includes(q)
    );
  });

  // Export submissions to CSV file
  const handleExportCSV = () => {
    const rows = [
      ['Type', 'ID', 'Submitted At', 'Status', 'Full Name', 'Email', 'Mobile', 'District', 'State', 'Country', 'Language', 'Interests / Options', 'Availability / Notes', 'Why / Message', 'Synced to Form']
    ];

    if (subTypeFilter !== 'supporters' && subTypeFilter !== 'feedback') {
      volunteerSubmissions.forEach((v) => {
        rows.push([
          'Volunteer',
          v.id,
          v.submittedAt,
          v.status,
          `"${v.fullName.replace(/"/g, '""')}"`,
          v.email,
          v.mobile,
          `"${v.cityDistrict.replace(/"/g, '""')}"`,
          v.state,
          v.country,
          v.preferredLanguage,
          `"${v.areasOfInterest.join(', ')}"`,
          `"${v.availability} | ${v.relevantSkills || ''}"`,
          `"${(v.whyVolunteer || '').replace(/"/g, '""')}"`,
          v.syncedToGoogleForm ? 'Yes' : 'No'
        ]);
      });
    }

    if (subTypeFilter !== 'volunteers' && subTypeFilter !== 'feedback') {
      supporterSubmissions.forEach((s) => {
        rows.push([
          'Supporter',
          s.id,
          s.submittedAt,
          s.status,
          `"${s.fullName.replace(/"/g, '""')}"`,
          s.email,
          s.mobile,
          `"${s.cityDistrict.replace(/"/g, '""')}"`,
          s.state,
          s.country,
          s.preferredLanguage,
          `"${s.supportOptions.join(', ')}"`,
          `"${s.notes || ''}"`,
          `"${(s.messageComments || '').replace(/"/g, '""')}"`,
          s.syncedToGoogleForm ? 'Yes' : 'No'
        ]);
      });
    }

    if (subTypeFilter !== 'volunteers' && subTypeFilter !== 'supporters') {
      feedbackSubmissions.forEach((f) => {
        rows.push([
          `Feedback (${f.category})`,
          f.id,
          f.submittedAt,
          f.status,
          `"${String(f.name ?? 'Anonymous').replace(/"/g, '""')}"`,
          f.email || 'N/A',
          '',
          '',
          '',
          'India',
          'en',
          f.category,
          f.deviceInfo || '',
          `"${String(f.message ?? '').replace(/"/g, '""')}"`,
          'N/A'
        ]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `valmiki-tiger-watch-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Submissions exported to CSV successfully.');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Summary & Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#07271D] p-4 rounded-2xl border border-emerald-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#051C14] px-3 py-1.5 rounded-xl border border-emerald-700 font-mono">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Volunteers: <strong className="text-white">{volunteerSubmissions.length}</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-[#051C14] px-3 py-1.5 rounded-xl border border-emerald-700 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Supporters: <strong className="text-white">{supporterSubmissions.length}</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-[#051C14] px-3 py-1.5 rounded-xl border border-emerald-700 font-mono">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Inquiries: <strong className="text-white">{feedbackSubmissions.length}</strong></span>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl flex items-center gap-1.5 shadow transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Submissions (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Type pills */}
        <div className="flex flex-wrap items-center bg-[#07271D] p-1 rounded-xl border border-emerald-800 gap-1">
          <button
            onClick={() => setSubTypeFilter('all')}
            className={`px-3 py-1 rounded-lg font-mono transition-all ${
              subTypeFilter === 'all'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            All Submissions ({volunteerSubmissions.length + supporterSubmissions.length + feedbackSubmissions.length})
          </button>
          <button
            onClick={() => setSubTypeFilter('volunteers')}
            className={`px-3 py-1 rounded-lg font-mono transition-all ${
              subTypeFilter === 'volunteers'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            Volunteers ({volunteerSubmissions.length})
          </button>
          <button
            onClick={() => setSubTypeFilter('supporters')}
            className={`px-3 py-1 rounded-lg font-mono transition-all ${
              subTypeFilter === 'supporters'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            Supporters ({supporterSubmissions.length})
          </button>
          <button
            onClick={() => setSubTypeFilter('feedback')}
            className={`px-3 py-1 rounded-lg font-mono transition-all ${
              subTypeFilter === 'feedback'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            Inquiries & Feedback ({feedbackSubmissions.length})
          </button>
        </div>

        {/* Status filter & search */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="acknowledged">Acknowledged</option>
          </select>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, email..."
              className="p-2 pl-8 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-amber-400 w-48 sm:w-60"
            />
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {/* Volunteers Section */}
        {subTypeFilter !== 'supporters' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <h4 className="font-display font-bold text-sm text-amber-300 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Volunteer Applications ({filteredVolunteers.length})</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400">
                Sorted by most recent
              </span>
            </div>

            {filteredVolunteers.length === 0 ? (
              <div className="p-6 bg-[#07271D]/40 rounded-xl border border-emerald-800 text-center text-emerald-400 font-mono">
                No volunteer applications match your current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {filteredVolunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="p-4 bg-[#07271D] border border-emerald-800/90 rounded-2xl space-y-3 shadow-md hover:border-amber-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{vol.fullName}</h5>
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold ${
                              vol.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : vol.status === 'contacted'
                                ? 'bg-blue-950 text-blue-300 border border-blue-700'
                                : vol.status === 'reviewed'
                                ? 'bg-purple-950 text-purple-300 border border-purple-700'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-700'
                            }`}
                          >
                            {vol.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-300 font-mono mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-amber-400" /> {vol.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> {vol.mobile}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-400" /> {vol.cityDistrict}, {vol.state}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete volunteer application for ${vol.fullName}?`)) {
                            deleteVolunteerSubmission(vol.id);
                            showToast(`Application for ${vol.fullName} deleted.`);
                          }
                        }}
                        className="p-1.5 text-emerald-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Tags & Availability */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-1">
                        {vol.areasOfInterest.map((a, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-[#051C14] text-amber-300 border border-emerald-800 rounded-md text-[10px]"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-emerald-200/90">
                        <strong className="text-emerald-400">Availability:</strong> {vol.availability}
                      </div>
                      {vol.relevantSkills && (
                        <div className="text-[11px] text-emerald-200/90">
                          <strong className="text-emerald-400">Skills:</strong> {vol.relevantSkills}
                        </div>
                      )}
                    </div>

                    {/* Why volunteer quote */}
                    <div className="p-2.5 bg-[#051C14] rounded-xl border border-emerald-800/80 text-[11px] text-emerald-100/80 italic">
                      "{vol.whyVolunteer}"
                    </div>

                    {/* Admin Status & Notes Controls */}
                    <div className="pt-2 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400">Status:</span>
                        <select
                          value={vol.status}
                          onChange={(e) => {
                            updateVolunteerSubmissionStatus(vol.id, e.target.value as any);
                            showToast(`Updated status to ${e.target.value}.`);
                          }}
                          className="px-2 py-1 bg-[#051C14] border border-emerald-700 rounded-lg text-[11px] text-white focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="approved">Approved</option>
                        </select>
                      </div>

                      <div className="text-[10px] font-mono text-emerald-400/60">
                        Submitted: {new Date(vol.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Supporters Section */}
        {subTypeFilter !== 'volunteers' && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <h4 className="font-display font-bold text-sm text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Supporter Pledges ({filteredSupporters.length})</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400">
                Sorted by most recent
              </span>
            </div>

            {filteredSupporters.length === 0 ? (
              <div className="p-6 bg-[#07271D]/40 rounded-xl border border-emerald-800 text-center text-emerald-400 font-mono">
                No supporter pledges match your current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {filteredSupporters.map((sup) => (
                  <div
                    key={sup.id}
                    className="p-4 bg-[#07271D] border border-amber-600/60 rounded-2xl space-y-3 shadow-md hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{sup.fullName}</h5>
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold ${
                              sup.status === 'acknowledged'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : sup.status === 'contacted'
                                ? 'bg-blue-950 text-blue-300 border border-blue-700'
                                : sup.status === 'reviewed'
                                ? 'bg-purple-950 text-purple-300 border border-purple-700'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-700'
                            }`}
                          >
                            {sup.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-300 font-mono mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-amber-400" /> {sup.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> {sup.mobile}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-400" /> {sup.cityDistrict}, {sup.state}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete supporter pledge from ${sup.fullName}?`)) {
                            deleteSupporterSubmission(sup.id);
                            showToast(`Supporter pledge from ${sup.fullName} deleted.`);
                          }
                        }}
                        className="p-1.5 text-emerald-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete pledge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Support Options */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-1">
                        {sup.supportOptions.map((opt, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-[#051C14] text-amber-300 border border-emerald-800 rounded-md text-[10px]"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Message comments */}
                    {sup.messageComments && (
                      <div className="p-2.5 bg-[#051C14] rounded-xl border border-emerald-800/80 text-[11px] text-emerald-100/80 italic">
                        "{sup.messageComments}"
                      </div>
                    )}

                    {/* Admin Status & Notes Controls */}
                    <div className="pt-2 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400">Status:</span>
                        <select
                          value={sup.status}
                          onChange={(e) => {
                            updateSupporterSubmissionStatus(sup.id, e.target.value as any);
                            showToast(`Updated status to ${e.target.value}.`);
                          }}
                          className="px-2 py-1 bg-[#051C14] border border-emerald-700 rounded-lg text-[11px] text-white focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="acknowledged">Acknowledged</option>
                        </select>
                      </div>

                      <div className="text-[10px] font-mono text-emerald-400/60">
                        Submitted: {new Date(sup.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback & Inquiries Section */}
        {subTypeFilter !== 'volunteers' && subTypeFilter !== 'supporters' && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <h4 className="font-display font-bold text-sm text-blue-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Citizen Inquiries & Feedback ({filteredFeedback.length})</span>
              </h4>
              <span className="text-[11px] text-emerald-400 font-mono">
                {filteredFeedback.filter(f => f.status === 'new').length} new • {filteredFeedback.filter(f => f.status === 'reviewed').length} reviewed • {filteredFeedback.filter(f => f.status === 'resolved').length} resolved
              </span>
            </div>

            {filteredFeedback.length === 0 ? (
              <div className="p-6 bg-[#051C14] rounded-2xl border border-emerald-800 text-center text-emerald-400/80 font-mono">
                No citizen inquiries or feedback matching the current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-[#051C14] p-4 rounded-2xl border border-emerald-800 space-y-3 hover:border-emerald-600 transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-white">{fb.name || 'Anonymous Citizen'}</h5>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                              fb.status === 'resolved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : fb.status === 'reviewed'
                                ? 'bg-purple-950 text-purple-300 border border-purple-700'
                                : fb.status === 'archived'
                                ? 'bg-stone-800 text-stone-300 border border-stone-600'
                                : 'bg-blue-950 text-blue-300 border border-blue-700'
                            }`}
                          >
                            {fb.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-300 font-mono mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {fb.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-amber-400" /> {fb.email}
                            </span>
                          )}
                          {fb.deviceInfo && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              Device: {fb.deviceInfo}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const citizenName = fb.name || 'this citizen';
                          if (confirm(`Delete feedback message from ${citizenName}?`)) {
                            deleteFeedback(fb.id);
                            showToast(`Feedback deleted.`);
                          }
                        }}
                        className="p-1.5 text-emerald-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete feedback"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Category badge */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-950 text-blue-200 border border-blue-800 rounded-md text-[10px] uppercase font-mono">
                          {fb.category}
                        </span>
                      </div>
                    </div>

                    {/* Message body */}
                    <div className="p-2.5 bg-[#07271D] rounded-xl border border-emerald-800/80 text-[11px] text-emerald-100/90 whitespace-pre-wrap leading-relaxed">
                      {fb.message}
                    </div>

                    {/* Admin Status & Notes Controls */}
                    <div className="pt-2 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400">Status:</span>
                        <select
                          value={fb.status}
                          onChange={(e) => {
                            updateFeedbackStatus(fb.id, e.target.value as any);
                            showToast(`Feedback marked as ${e.target.value}.`);
                          }}
                          className="px-2 py-1 bg-[#07271D] border border-emerald-700 rounded-lg text-[11px] text-white focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="text-[10px] font-mono text-emerald-400/60">
                        Received: {new Date(fb.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
