import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ResearchReport, ResearchCategory, PublicationStatus } from '../../types';
import { 
  BookOpen, 
  FileText, 
  Download, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  Calendar,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Globe,
  Tag,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Info,
  Building2,
  ShieldCheck,
  ChevronRight,
  Clock,
  AlertTriangle,
  FileCheck,
  Link as LinkIcon
} from 'lucide-react';
import { EngagementBar } from '../EngagementBar';

const RESEARCH_CATEGORIES: ResearchCategory[] = [
  'Tiger Conservation Research',
  'Wildlife & Biodiversity',
  'Habitat & Forest Conservation',
  'Human-Wildlife Conflict',
  'Tiger Population & Monitoring',
  'Wildlife Protection & Management',
  'Eco-Tourism & Conservation',
  'Community Participation',
  'Climate Change & Wildlife',
  'Relevant Academic Research'
];

export const ResearchSection: React.FC = () => {
  const { 
    research = [], 
    isAdmin, 
    addResearch, 
    updateResearch, 
    deleteResearch, 
    toggleResearchStatus,
    setResearchStatus,
    verifyAndPublishResearch,
    unpublishResearch,
    rejectResearch,
    updateContentVotes
  } = useData();
  const safeResearch = research || [];
  const { language, isRtl, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'vtw_original' | 'external'>('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title' | 'category'>('recent');
  
  // Modals
  const [activeReportForDetails, setActiveReportForDetails] = useState<ResearchReport | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ResearchReport | null>(null);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  
  // Quick Verification Modal State
  const [verifyingReport, setVerifyingReport] = useState<ResearchReport | null>(null);
  const [verifySourceUrl, setVerifySourceUrl] = useState('');
  const [verifyNotes, setVerifyNotes] = useState('');

  // Form State for Admin Editor
  const [formTitle, setFormTitle] = useState('');
  const [formAuthors, setFormAuthors] = useState('');
  const [formOrganization, setFormOrganization] = useState('');
  const [formYear, setFormYear] = useState<number>(new Date().getFullYear());
  const [formPubDate, setFormPubDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState<ResearchCategory>('Tiger Conservation Research');
  const [formAbstract, setFormAbstract] = useState('');
  const [formKeyFindings, setFormKeyFindings] = useState('');
  const [formRelevance, setFormRelevance] = useState('');
  const [formSource, setFormSource] = useState('');
  const [formOriginalSourceLink, setFormOriginalSourceLink] = useState('');
  const [formDoi, setFormDoi] = useState('');
  const [formOfficialUrl, setFormOfficialUrl] = useState('');
  const [formDownloadUrl, setFormDownloadUrl] = useState('');
  const [formPublicationType, setFormPublicationType] = useState<'vtw_original' | 'external'>('external');
  const [formStatus, setFormStatus] = useState<PublicationStatus>('pending_verification');
  const [formVerified, setFormVerified] = useState(false);
  const [formVerifiedBy, setFormVerifiedBy] = useState('');
  const [formVerifiedDate, setFormVerifiedDate] = useState('');
  const [formVerificationNotes, setFormVerificationNotes] = useState('');
  const [formLanguage, setFormLanguage] = useState<'en' | 'hi' | 'ur' | 'bilingual'>('en');
  const [formTags, setFormTags] = useState('');
  const [formCitation, setFormCitation] = useState('');
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');

  const openCreateModal = () => {
    setEditingReport(null);
    setFormTitle('');
    setFormAuthors('');
    setFormOrganization('');
    setFormYear(new Date().getFullYear());
    setFormPubDate(new Date().toISOString().split('T')[0]);
    setFormCategory('Tiger Conservation Research');
    setFormAbstract('');
    setFormKeyFindings('');
    setFormRelevance('');
    setFormSource('');
    setFormOriginalSourceLink('');
    setFormDoi('');
    setFormOfficialUrl('');
    setFormDownloadUrl('');
    setFormPublicationType('external');
    setFormStatus('pending_verification'); // Strict: Defaults to Pending Verification
    setFormVerified(false); // Strict: Not verified until source checked
    setFormVerifiedBy('');
    setFormVerifiedDate('');
    setFormVerificationNotes('');
    setFormLanguage('en');
    setFormTags('');
    setFormCitation('');
    setEditorTab('edit');
    setIsEditorOpen(true);
  };

  const openEditModal = (report: ResearchReport) => {
    setEditingReport(report);
    setFormTitle(report.title);
    setFormAuthors(report.authors);
    setFormOrganization(report.organization);
    setFormYear(report.year);
    setFormPubDate(report.publicationDate || `${report.year}-01-01`);
    setFormCategory(report.category);
    setFormAbstract(report.abstract);
    setFormKeyFindings(report.keyFindings.join('\n'));
    setFormRelevance(report.relevance || '');
    setFormSource(report.source || '');
    setFormOriginalSourceLink(report.originalSourceLink || report.officialUrl || '');
    setFormDoi(report.doi || '');
    setFormOfficialUrl(report.officialUrl || '');
    setFormDownloadUrl(report.downloadUrl || '');
    setFormPublicationType(report.publicationType || 'external');
    setFormStatus(report.status || 'published');
    setFormVerified(report.verified ?? (report.status === 'published'));
    setFormVerifiedBy(report.verifiedBy || '');
    setFormVerifiedDate(report.verifiedDate || '');
    setFormVerificationNotes(report.verificationNotes || '');
    setFormLanguage(report.language || 'en');
    setFormTags((report.tags || []).join(', '));
    setFormCitation(report.citation);
    setEditorTab('edit');
    setIsEditorOpen(true);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAuthors.trim() || !formAbstract.trim()) {
      return;
    }

    const findingsArray = formKeyFindings
      .split('\n')
      .map(line => line.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const effectiveVerified = formVerified && formStatus === 'published';

    const payload: Omit<ResearchReport, 'id'> = {
      title: formTitle.trim(),
      authors: formAuthors.trim(),
      organization: formOrganization.trim() || 'Wildlife Conservation Institution',
      year: Number(formYear) || new Date().getFullYear(),
      publicationDate: formPubDate,
      category: formCategory,
      abstract: formAbstract.trim(),
      keyFindings: findingsArray.length > 0 ? findingsArray : ['Documented empirical findings.'],
      relevance: formRelevance.trim(),
      source: formSource.trim(),
      originalSourceLink: formOriginalSourceLink.trim() || formOfficialUrl.trim(),
      doi: formDoi.trim(),
      officialUrl: formOfficialUrl.trim() || formOriginalSourceLink.trim(),
      downloadUrl: formDownloadUrl.trim() || formOfficialUrl.trim() || formOriginalSourceLink.trim(),
      publicationType: formPublicationType,
      status: formStatus,
      verified: effectiveVerified,
      verifiedBy: effectiveVerified ? (formVerifiedBy.trim() || 'VTW Scientific Council') : undefined,
      verifiedDate: effectiveVerified ? (formVerifiedDate || new Date().toISOString().split('T')[0]) : undefined,
      verificationNotes: formVerificationNotes.trim() || undefined,
      language: formLanguage,
      tags: tagsArray,
      citation: formCitation.trim() || `${formAuthors.trim()} (${formYear}). ${formTitle.trim()}. ${formSource.trim() || formOrganization.trim()}.`
    };

    if (editingReport) {
      updateResearch({
        ...payload,
        id: editingReport.id
      });
    } else {
      addResearch(payload);
    }

    setIsEditorOpen(false);
  };

  const handleQuickVerifyConfirm = () => {
    if (!verifyingReport) return;
    verifyAndPublishResearch(
      verifyingReport.id,
      verifySourceUrl.trim() || verifyingReport.originalSourceLink || verifyingReport.officialUrl || '',
      verifyNotes.trim() || 'Source cross-referenced against institutional archives and peer-reviewed records.'
    );
    setVerifyingReport(null);
    setVerifySourceUrl('');
    setVerifyNotes('');
  };

  const handleCopyCitation = (report: ResearchReport) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(report.citation);
    }
    setCopiedCitationId(report.id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  // Filtered and sorted reports
  const filteredReports = useMemo(() => {
    return safeResearch
      .filter(r => {
        // Strict integrity requirement: Public visitors see ONLY approved, published & verified publications
        if (!isAdmin) {
          if (r.status !== 'published' || !r.verified) return false;
        } else {
          // Admin status filter
          if (adminStatusFilter !== 'all') {
            if (adminStatusFilter === 'published' && (r.status !== 'published' || !r.verified)) return false;
            if (adminStatusFilter === 'pending_verification' && r.status !== 'pending_verification') return false;
            if (adminStatusFilter === 'draft' && r.status !== 'draft') return false;
            if (adminStatusFilter === 'unpublished' && r.status !== 'unpublished') return false;
            if (adminStatusFilter === 'rejected' && r.status !== 'rejected') return false;
          }
        }

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          r.title.toLowerCase().includes(q) ||
          r.authors.toLowerCase().includes(q) ||
          r.organization.toLowerCase().includes(q) ||
          r.abstract.toLowerCase().includes(q) ||
          (r.doi && r.doi.toLowerCase().includes(q)) ||
          (r.tags && r.tags.some(tag => tag.toLowerCase().includes(q)));

        const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
        const matchesType = selectedType === 'all' || (r.publicationType || 'external') === selectedType;

        return matchesSearch && matchesCat && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return (b.publicationDate || `${b.year}-12-31`).localeCompare(a.publicationDate || `${a.year}-12-31`);
        }
        if (sortBy === 'oldest') {
          return (a.publicationDate || `${a.year}-01-01`).localeCompare(b.publicationDate || `${b.year}-01-01`);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'category') {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });
  }, [safeResearch, searchQuery, selectedCategory, selectedType, sortBy, isAdmin, adminStatusFilter]);

  return (
    <div className="space-y-8 animate-fade-in pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('research.badge', 'Research & Publications Cell')}</span>
          </div>

          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-amber-400 to-[#F27D26] text-stone-950 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-110 transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Research Paper (Admin)</span>
            </button>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white relative z-10">
          {language === 'hi' 
            ? 'अनुसंधान एवं वैज्ञानिक प्रकाशन' 
            : language === 'ur'
            ? 'تحقیقات اور سائنسی اشاعتیں'
            : 'RESEARCH & PUBLICATIONS'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed relative z-10">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर रिजर्व और तराई-आर्क लैंडस्केप में बाघ संरक्षण, जैव विविधता, पर्यावास पारिस्थितिकी, और मानव-वन्यजीव सह-अस्तित्व पर सहकर्मी-समीक्षित शोध पत्र, आधिकारिक एनटीसीए रिपोर्ट और जमीनी वैज्ञानिक अध्ययन।'
            : language === 'ur'
            ? 'والمیکی ٹائیگر ریزرو اور ترائی آرک میں شیروں کے تحفظ، ماحولیاتی مسکن اور حیاتیاتی تنوع پر سائنسی و تحقیقی مقالات، سرکاری رپورٹس اور فیلڈ سروے۔'
            : 'Empirical scientific research, peer-reviewed monographs, national census surveys, and field studies documenting tiger ecology, biodiversity conservation, and habitat dynamics across Valmiki Tiger Reserve and the transboundary Terai Arc.'}
        </p>

        {/* 10 Category Quick Indicator Chips */}
        <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-mono text-amber-200/80">
          <span className="text-white/60">Core Domains:</span>
          <span>Tiger Conservation • Wildlife & Biodiversity • Habitat Restoration • Coexistence • SECR Demography • Anti-Poaching • Ecotourism • Tharu Stewardship • Climate Hydrology</span>
        </div>
      </div>

      {/* Control Toolbar: Search, Filters, Sorting */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'शोध पत्र, लेखक, विषय या कीवर्ड खोजें...' : language === 'ur' ? 'تحقیقی مقالہ، مصنف یا عنوان تلاش کریں...' : 'Search papers, authors, DOI, or topics...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 rtl:pl-9 rtl:pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Secondary Controls: Publication Type & Sort */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Publication Type Filter */}
            <div className="inline-flex rounded-xl bg-stone-100 p-1 text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedType === 'all' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Literature ({safeResearch.length})
              </button>
              <button
                onClick={() => setSelectedType('vtw_original')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedType === 'vtw_original' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                VTW Originals
              </button>
              <button
                onClick={() => setSelectedType('external')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedType === 'external' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Peer-Reviewed / NTCA
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>
        </div>

        {/* Admin Verification & Status Filter Row (Admin Only) */}
        {isAdmin && (
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-950 font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Editorial Pipeline & Verification Status Filter:</span>
              </div>
              <span className="text-[11px] text-amber-800">
                Visitors only see verified & published papers
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { key: 'all', label: 'All Records', count: safeResearch.length },
                { key: 'published', label: 'Verified & Published', count: safeResearch.filter(r => r.status === 'published' && r.verified).length },
                { key: 'pending_verification', label: 'Pending Verification', count: safeResearch.filter(r => r.status === 'pending_verification').length },
                { key: 'draft', label: 'Drafts', count: safeResearch.filter(r => r.status === 'draft').length },
                { key: 'unpublished', label: 'Unpublished', count: safeResearch.filter(r => r.status === 'unpublished').length },
                { key: 'rejected', label: 'Rejected', count: safeResearch.filter(r => r.status === 'rejected').length }
              ].map(st => (
                <button
                  key={st.key}
                  onClick={() => setAdminStatusFilter(st.key)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                    adminStatusFilter === st.key
                      ? 'bg-amber-800 text-white shadow-sm font-semibold'
                      : 'bg-white text-stone-700 hover:bg-amber-100/70 border border-amber-200'
                  }`}
                >
                  <span>{st.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    adminStatusFilter === st.key ? 'bg-amber-950 text-amber-200' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {st.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 10 Category Horizontal Pills */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0B3D2E] text-white shadow-md font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 10 Categories</span>
            </button>

            {RESEARCH_CATEGORIES.map((cat) => {
              const count = safeResearch.filter(r => r.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategory === cat
                      ? 'bg-[#0B3D2E] text-white shadow-md font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 px-2">
        <div>
          Showing <span className="font-bold text-stone-900">{filteredReports.length}</span> research papers & technical studies
          {selectedCategory !== 'all' && (
            <span> in <strong className="text-[#0B3D2E]">{selectedCategory}</strong></span>
          )}
        </div>
        {isAdmin && (
          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
            Admin Mode Active — You can add, edit, or remove publications
          </span>
        )}
      </div>

      {/* Research Papers Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-display font-bold text-lg text-stone-800">
            No research papers found matching your criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting your search keywords, switching categories, or clearing active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
            }}
            className="px-4 py-2 bg-[#0B3D2E] text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5 hover:border-emerald-700/50 hover:shadow-md transition-all relative group"
            >
              {/* Header Badges Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-stone-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#0B3D2E] text-amber-300 font-mono text-[11px] font-bold px-3 py-1 rounded-lg">
                    {report.category}
                  </span>

                  {report.publicationType === 'vtw_original' ? (
                    <span className="bg-amber-100 text-[#F27D26] font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-amber-300 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Valmiki Tiger Watch Original</span>
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-800 font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Peer-Reviewed / Institutional</span>
                    </span>
                  )}

                  {/* Scientific Verification Status Badge */}
                  {report.status === 'published' && report.verified ? (
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>Verified & Published</span>
                    </span>
                  ) : report.status === 'pending_verification' ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>Pending Verification</span>
                    </span>
                  ) : report.status === 'draft' ? (
                    <span className="bg-stone-200 text-stone-800 border border-stone-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-stone-600" />
                      <span>Draft</span>
                    </span>
                  ) : report.status === 'unpublished' ? (
                    <span className="bg-slate-100 text-slate-700 border border-slate-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                      <EyeOff className="w-3 h-3 text-slate-500" />
                      <span>Unpublished</span>
                    </span>
                  ) : report.status === 'rejected' ? (
                    <span className="bg-rose-100 text-rose-900 border border-rose-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-rose-700" />
                      <span>Rejected</span>
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center space-x-3 text-xs text-stone-500 font-mono">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
                    {report.publicationDate || report.year}
                  </span>

                  {/* Admin Verification & Lifecycle Controls */}
                  {isAdmin && (
                    <div className="flex flex-wrap items-center gap-1.5 ml-2 border-l border-stone-200 pl-2">
                      {!(report.status === 'published' && report.verified) && (
                        <button
                          onClick={() => {
                            setVerifyingReport(report);
                            setVerifySourceUrl(report.originalSourceLink || report.officialUrl || '');
                            setVerifyNotes(report.verificationNotes || 'Source authenticated against institutional scientific records.');
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer shadow-xs transition"
                          title="Verify source and publish to public view"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verify & Publish</span>
                        </button>
                      )}

                      {report.status === 'published' && (
                        <button
                          onClick={() => {
                            if (confirm(`Unpublish publication "${report.title}"? It will no longer be visible to public visitors.`)) {
                              unpublishResearch(report.id);
                            }
                          }}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer shadow-xs transition"
                          title="Unpublish publication"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Unpublish</span>
                        </button>
                      )}

                      {report.status !== 'rejected' && (
                        <button
                          onClick={() => {
                            if (confirm(`Reject unverified entry "${report.title}"?`)) {
                              rejectResearch(report.id, 'Entry does not meet scientific verification thresholds.');
                            }
                          }}
                          className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition"
                          title="Reject entry"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(report)}
                        className="p-1 text-stone-500 hover:text-emerald-700 rounded hover:bg-stone-100"
                        title="Edit Paper"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete publication: "${report.title}"? This is recommended for fabricated or false entries.`)) {
                            deleteResearch(report.id);
                          }
                        }}
                        className="p-1 text-stone-500 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete False/Fabricated Paper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-900 leading-snug hover:text-[#0B3D2E] transition-colors cursor-pointer" onClick={() => setActiveReportForDetails(report)}>
                  {report.title}
                </h2>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-600">
                  <span className="font-medium text-stone-900">
                    <strong>Authors:</strong> {report.authors}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="flex items-center text-stone-700">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-[#0B3D2E]" />
                    {report.organization}
                  </span>
                </div>
              </div>

              {/* Relevance to Tiger Conservation Callout Box */}
              {report.relevance && (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-stone-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold uppercase tracking-wider text-[11px] font-mono">
                    <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Relevance to Tiger Conservation:</span>
                  </div>
                  <p className="leading-relaxed text-stone-800">
                    {report.relevance}
                  </p>
                </div>
              )}

              {/* Abstract Summary */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-1">
                <strong className="text-stone-900 block font-semibold">Scientific Abstract / Summary:</strong>
                <p className="line-clamp-3 group-hover:line-clamp-none transition-all">
                  {report.abstract}
                </p>
              </div>

              {/* Key Ecological Findings */}
              {report.keyFindings && report.keyFindings.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider block font-mono">
                    Key Findings:
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 list-disc list-inside">
                    {report.keyFindings.map((finding, idx) => (
                      <li key={idx} className="leading-relaxed">{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {report.tags && report.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={() => setSearchQuery(tag)}
                      className="inline-flex items-center text-[11px] font-mono bg-stone-100 hover:bg-stone-200 text-stone-600 px-2.5 py-0.5 rounded-full cursor-pointer transition"
                    >
                      <Tag className="w-2.5 h-2.5 mr-1 text-stone-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Engagement Bar: Thumbs up/down + Native Share */}
              <div className="pt-3 border-t border-stone-100">
                <EngagementBar
                  contentType="research"
                  contentId={report.id}
                  title={report.title}
                  text={report.abstract}
                  url={report.downloadUrl || report.officialUrl || report.originalSourceLink}
                  initialLikes={report.likes || 0}
                  initialDislikes={report.dislikes || 0}
                  onVote={(type, newLikes, newDislikes) => {
                    updateContentVotes('research', report.id, newLikes, newDislikes);
                  }}
                />
              </div>

              {/* Action Bar: DOI, Official Link, Full Details, Copy Citation */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap justify-between items-center text-xs text-stone-500 gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {report.source && (
                    <span className="text-stone-600 font-mono text-[11px]">
                      <strong>Source:</strong> {report.source}
                    </span>
                  )}
                  {report.doi && (
                    <a
                      href={`https://doi.org/${report.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#0B3D2E] hover:underline font-mono text-[11px]"
                    >
                      <span>DOI: {report.doi}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Read Details Button */}
                  <button
                    onClick={() => setActiveReportForDetails(report)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-600" />
                    <span>View Dossier</span>
                  </button>

                  {/* Cite Paper Button */}
                  <button
                    onClick={() => handleCopyCitation(report)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-medium text-xs flex items-center space-x-1.5 transition cursor-pointer"
                    title="Copy APA / IEEE Citation"
                  >
                    {copiedCitationId === report.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Citation Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-700" />
                        <span>Cite Paper</span>
                      </>
                    )}
                  </button>

                  {/* Official / Download URL */}
                  {(report.downloadUrl || report.officialUrl) && (
                    <a
                      href={report.downloadUrl || report.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-xl font-semibold text-xs flex items-center space-x-1.5 transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Access Publication</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Full Details Modal */}
      {activeReportForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="bg-[#0B3D2E] text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-md">
                  {activeReportForDetails.category}
                </span>
                <h2 className="font-display font-bold text-2xl text-stone-900 mt-2">
                  {activeReportForDetails.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveReportForDetails(null)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 font-mono text-xs">
                <div><strong>Lead Authors:</strong> {activeReportForDetails.authors}</div>
                <div><strong>Institutional Affiliation:</strong> {activeReportForDetails.organization}</div>
                <div><strong>Year of Publication:</strong> {activeReportForDetails.year} ({activeReportForDetails.publicationDate})</div>
                {activeReportForDetails.source && <div><strong>Publisher / Source:</strong> {activeReportForDetails.source}</div>}
                {activeReportForDetails.doi && <div><strong>DOI:</strong> {activeReportForDetails.doi}</div>}
                {activeReportForDetails.originalSourceLink && (
                  <div>
                    <strong>Original Source: </strong>
                    <a
                      href={activeReportForDetails.originalSourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline hover:text-emerald-900"
                    >
                      {activeReportForDetails.originalSourceLink}
                    </a>
                  </div>
                )}
              </div>

              {activeReportForDetails.verified && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Peer-Reviewed / Institutional Verification: </span>
                    <span>{activeReportForDetails.verificationNotes || 'Validated against institutional scientific database'}</span>
                    {activeReportForDetails.verifiedBy && <span className="text-emerald-700"> (Verified by: {activeReportForDetails.verifiedBy})</span>}
                  </div>
                </div>
              )}

              {activeReportForDetails.relevance && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <strong className="text-amber-900 font-mono text-xs block uppercase">Relevance to Tiger Conservation:</strong>
                  <p className="text-stone-800 leading-relaxed">{activeReportForDetails.relevance}</p>
                </div>
              )}

              <div className="space-y-2">
                <strong className="text-stone-900 block text-sm font-semibold">Abstract:</strong>
                <p className="leading-relaxed bg-white p-4 rounded-2xl border border-stone-200">{activeReportForDetails.abstract}</p>
              </div>

              <div className="space-y-2">
                <strong className="text-stone-900 block text-sm font-semibold">Empirical Findings:</strong>
                <ul className="list-disc list-inside space-y-1.5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  {activeReportForDetails.keyFindings.map((f, i) => (
                    <li key={i} className="leading-relaxed">{f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 space-y-2">
                <strong className="text-stone-900 font-mono text-xs uppercase block">Full Citation:</strong>
                <p className="italic font-serif text-stone-700">{activeReportForDetails.citation}</p>
              </div>

              {/* Engagement Bar inside dossier modal */}
              <div className="pt-2 border-t border-stone-200">
                <EngagementBar
                  contentType="research"
                  contentId={activeReportForDetails.id}
                  title={activeReportForDetails.title}
                  text={activeReportForDetails.abstract}
                  url={activeReportForDetails.downloadUrl || activeReportForDetails.officialUrl || activeReportForDetails.originalSourceLink}
                  initialLikes={activeReportForDetails.likes || 0}
                  initialDislikes={activeReportForDetails.dislikes || 0}
                  onVote={(type, newLikes, newDislikes) => {
                    updateContentVotes('research', activeReportForDetails.id, newLikes, newDislikes);
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between items-center gap-3">
              <button
                onClick={() => handleCopyCitation(activeReportForDetails)}
                className="px-4 py-2 bg-amber-100 text-amber-900 font-bold rounded-xl text-xs hover:bg-amber-200 transition"
              >
                Copy APA Citation
              </button>
              {(activeReportForDetails.downloadUrl || activeReportForDetails.officialUrl) && (
                <a
                  href={activeReportForDetails.downloadUrl || activeReportForDetails.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#0B3D2E] text-white font-bold rounded-xl text-xs hover:bg-emerald-900 transition flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Institutional Portal</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Modal with Preview Tab */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 font-bold">
                  {editingReport ? 'Admin Editor' : 'Admin Publication Pipeline'}
                </span>
                <h2 className="font-display font-bold text-2xl text-stone-900">
                  {editingReport ? 'Edit Research Paper' : 'Add Research Paper / Report'}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                {/* Tabs */}
                <div className="bg-stone-100 rounded-xl p-1 flex text-xs">
                  <button
                    onClick={() => setEditorTab('edit')}
                    className={`px-3 py-1.5 rounded-lg font-medium ${editorTab === 'edit' ? 'bg-[#0B3D2E] text-white' : 'text-stone-600'}`}
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => setEditorTab('preview')}
                    className={`px-3 py-1.5 rounded-lg font-medium ${editorTab === 'preview' ? 'bg-[#0B3D2E] text-white' : 'text-stone-600'}`}
                  >
                    Live Preview
                  </button>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {editorTab === 'edit' ? (
              <form onSubmit={handleSaveReport} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-700">Paper Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g., Status of Tigers, Co-predators & Prey in India..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Lead Authors *</label>
                    <input
                      type="text"
                      required
                      value={formAuthors}
                      onChange={(e) => setFormAuthors(e.target.value)}
                      placeholder="e.g., Dr. Y.V. Jhala, Dr. Qamar Qureshi, et al."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Organization / Institution *</label>
                    <input
                      type="text"
                      required
                      value={formOrganization}
                      onChange={(e) => setFormOrganization(e.target.value)}
                      placeholder="e.g., National Tiger Conservation Authority & WII"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Research Category (10 Categories) *</label>
                    <select
                      value={formCategory}
                      onChange={(e: any) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    >
                      {RESEARCH_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Publication Type</label>
                    <select
                      value={formPublicationType}
                      onChange={(e: any) => setFormPublicationType(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    >
                      <option value="external">Peer-Reviewed / Institutional</option>
                      <option value="vtw_original">Valmiki Tiger Watch Original</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Publication Date</label>
                    <input
                      type="date"
                      value={formPubDate}
                      onChange={(e) => setFormPubDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Publication Status *</label>
                    <select
                      value={formStatus}
                      onChange={(e: any) => setFormStatus(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    >
                      <option value="pending_verification">Pending Verification (Default for new submissions)</option>
                      <option value="draft">Draft (Admin internal review)</option>
                      <option value="published">Verified & Published (Publicly Visible)</option>
                      <option value="unpublished">Unpublished (Hidden from public)</option>
                      <option value="rejected">Rejected (Unverified / Non-genuine)</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-700 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Original Official Source Link (NTCA / WII / Journal Repository URL) *</span>
                      </span>
                      <span className="text-[11px] font-normal text-amber-700">Required for verification</span>
                    </label>
                    <input
                      type="url"
                      value={formOriginalSourceLink}
                      onChange={(e) => setFormOriginalSourceLink(e.target.value)}
                      placeholder="https://ntca.gov.in/... or https://wii.gov.in/... or https://doi.org/..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Publisher / Journal Source</label>
                    <input
                      type="text"
                      value={formSource}
                      onChange={(e) => setFormSource(e.target.value)}
                      placeholder="e.g., NTCA Technical Gazette / Journal of Threatened Taxa"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">DOI / Standard Identifier</label>
                    <input
                      type="text"
                      value={formDoi}
                      onChange={(e) => setFormDoi(e.target.value)}
                      placeholder="e.g., 10.1016/j.gecco.2024..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-700">Official Portal / Alternate Download URL</label>
                    <input
                      type="url"
                      value={formOfficialUrl}
                      onChange={(e) => setFormOfficialUrl(e.target.value)}
                      placeholder="https://ntca.gov.in or https://wii.gov.in"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  {/* Verification Integrity Controls */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl md:col-span-2 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-800" />
                        <span className="font-bold text-xs uppercase tracking-wider text-emerald-950 font-mono">
                          Scientific Authenticity & Source Verification
                        </span>
                      </div>
                      <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1 rounded-lg border border-emerald-300">
                        <input
                          type="checkbox"
                          checked={formVerified}
                          onChange={(e) => setFormVerified(e.target.checked)}
                          className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-stone-900">Mark as Verified</span>
                      </label>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Verification Policy: Confirm that title, lead authors, institutional affiliation, and source link have been cross-checked with official databases (NTCA, WII, MoEFCC, or peer-reviewed journals). Do not fabricate replacement content.
                    </p>

                    {formVerified && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/80">
                        <div className="space-y-1">
                          <label className="font-bold text-[11px] text-stone-700">Verified By</label>
                          <input
                            type="text"
                            value={formVerifiedBy}
                            onChange={(e) => setFormVerifiedBy(e.target.value)}
                            placeholder="e.g., NTCA / WII Tiger Monitoring Cell"
                            className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-[11px] text-stone-700">Verification Dossier Notes</label>
                          <input
                            type="text"
                            value={formVerificationNotes}
                            onChange={(e) => setFormVerificationNotes(e.target.value)}
                            placeholder="e.g., Cross-checked against NTCA 5th Cycle Status of Tigers in India 2022-23"
                            className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-700">Relevance to Tiger Conservation</label>
                    <textarea
                      rows={2}
                      value={formRelevance}
                      onChange={(e) => setFormRelevance(e.target.value)}
                      placeholder="Explain how this study directly impacts tiger monitoring, corridor connectivity, or law enforcement in VTR..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-700">Abstract / Summary *</label>
                    <textarea
                      rows={4}
                      required
                      value={formAbstract}
                      onChange={(e) => setFormAbstract(e.target.value)}
                      placeholder="Enter scientific background, methodologies, study location, and overview..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-700">Key Findings (one per line) *</label>
                    <textarea
                      rows={3}
                      value={formKeyFindings}
                      onChange={(e) => setFormKeyFindings(e.target.value)}
                      placeholder="Tiger density increased to 54 individuals&#10;Identified high breeding female clusters&#10;Transboundary gene flow confirmed"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="Camera Trap, NTCA, Gene Flow, Prey Density"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Citation String</label>
                    <input
                      type="text"
                      value={formCitation}
                      onChange={(e) => setFormCitation(e.target.value)}
                      placeholder="Jhala, Y.V. et al. (2023). Status of Tigers in India. NTCA."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold text-xs hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-[#F27D26] text-stone-950 rounded-xl font-bold text-xs hover:brightness-110 shadow-md"
                  >
                    {editingReport ? 'Update Publication' : 'Publish Research'}
                  </button>
                </div>
              </form>
            ) : (
              /* Live Preview */
              <div className="space-y-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#0B3D2E] text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-md">
                    {formCategory}
                  </span>
                  <span className="font-mono text-xs text-stone-500">
                    {formPubDate} ({formStatus})
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-stone-900">
                  {formTitle || 'Sample Title'}
                </h3>
                <p className="text-stone-600">
                  <strong>Authors:</strong> {formAuthors || 'Author Name'} — <em>{formOrganization || 'Organization'}</em>
                </p>
                {formRelevance && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <strong className="text-amber-900 block text-xs">Relevance to Tiger Conservation:</strong>
                    <p>{formRelevance}</p>
                  </div>
                )}
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <strong className="block text-xs text-stone-900 mb-1">Abstract:</strong>
                  <p>{formAbstract || 'Abstract content will render here.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Verification & Publish Modal */}
      {verifyingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-mono text-emerald-800 font-bold uppercase tracking-wider flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Admin Source Verification</span>
                </span>
                <h3 className="font-display font-bold text-lg text-stone-900 mt-1">
                  Verify & Publish Research
                </h3>
              </div>
              <button
                onClick={() => setVerifyingReport(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
              <div className="font-bold text-stone-900">{verifyingReport.title}</div>
              <div className="text-stone-600">Authors: {verifyingReport.authors}</div>
              <div className="text-stone-500 font-mono">{verifyingReport.organization} ({verifyingReport.year || verifyingReport.publicationDate})</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-800 flex items-center space-x-1">
                  <LinkIcon className="w-3 h-3 text-emerald-700" />
                  <span>Original Official Source Link (Required) *</span>
                </label>
                <input
                  type="url"
                  value={verifySourceUrl}
                  onChange={(e) => setVerifySourceUrl(e.target.value)}
                  placeholder="https://ntca.gov.in/... or official journal repository link"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D2E]"
                />
                <span className="text-[10px] text-stone-500">
                  Provide the official institutional URL or DOI to ensure scientific authenticity.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Verification Notes / Reference</label>
                <input
                  type="text"
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="e.g., Authenticated against official NTCA census gazette"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D2E]"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  Confirming will set this publication to <strong>Verified & Published</strong>, making it visible to public visitors. Do not verify fabricated or unverified papers.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end space-x-2">
              <button
                onClick={() => setVerifyingReport(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickVerifyConfirm}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Confirm & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
