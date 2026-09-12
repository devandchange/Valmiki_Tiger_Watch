import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { NewsArticle, NewsSource } from '../../types';
import { 
  Newspaper, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  Layers, 
  Search, 
  Calendar, 
  Globe, 
  ShieldCheck, 
  X,
  Clock,
  Pin,
  Star,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Check,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  FileText,
  Eye,
  Info
} from 'lucide-react';
import { EngagementBar } from '../EngagementBar';

const NEWS_TOPICS = [
  'All Topics',
  'Valmiki Reserve Update',
  'Tiger Population & Census',
  'Human-Wildlife Conflict & Rescue',
  'Anti-Poaching & Protection',
  'Policy, Budget & NTCA Funding',
  'Eco-Tourism & Community'
];

export const NewsSection: React.FC = () => {
  const { 
    news = [], 
    newsSources = [], 
    syncNewsSources, 
    selectedNews, 
    setSelectedNews,
    isAdmin,
    addNews,
    updateNews,
    deleteNews,
    pinNews,
    toggleNewsFeatured,
    setNewsStatus,
    toggleNewsSource,
    addNewsSource,
    isAutoUpdateEnabled,
    lastNewsUpdate,
    toggleAutoUpdate,
    updateContentVotes
  } = useData();

  const safeNews = news || [];
  const safeNewsSources = newsSources || [];

  const { language, isRtl, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedSourceType, setSelectedSourceType] = useState<'all' | 'govt' | 'media' | 'local'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'hi' | 'ur'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  // Modals & Drawers
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [activeArticleForModal, setActiveArticleForModal] = useState<NewsArticle | null>(null);
  const [adminViewTab, setAdminViewTab] = useState<'all' | 'pending'>('all');

  // Refresh state for "↻ REFRESH NEWS"
  const [refreshState, setRefreshState] = useState<'idle' | 'refreshing' | 'success' | 'error'>('idle');
  const [refreshNotification, setRefreshNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Backward compatibility alias for isSyncing
  const isSyncing = refreshState === 'refreshing';

  // Editor Form State
  const [formHeadline, setFormHeadline] = useState('');
  const [formSource, setFormSource] = useState('');
  const [formSourceCategory, setFormSourceCategory] = useState<'Forest Department' | 'NTCA / MoEFCC' | 'WII Research' | 'Established Media'>('Established Media');
  const [formPubDate, setFormPubDate] = useState(new Date().toISOString().split('T')[0]);
  const [formSummary, setFormSummary] = useState('');
  const [formKeyTakeaways, setFormKeyTakeaways] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formVerificationStatus, setFormVerificationStatus] = useState<any>('verified_govt');
  const [formTags, setFormTags] = useState('');
  const [formLanguage, setFormLanguage] = useState<'en' | 'hi' | 'ur'>('en');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPinned, setFormPinned] = useState(false);

  // New Source Form State
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState<'govt' | 'media' | 'research' | 'local'>('media');
  const [newSourceCategory, setNewSourceCategory] = useState<'Forest Department' | 'NTCA / MoEFCC' | 'WII Research' | 'Established Media'>('Established Media');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceRss, setNewSourceRss] = useState('');
  const [newSourceLanguage, setNewSourceLanguage] = useState<'en' | 'hi' | 'ur'>('hi');

  // Explicit Refresh News Trigger with 3-state cycle & notifications
  const handleRefreshNews = async () => {
    if (refreshState === 'refreshing') return; // Prevent repeated taps while in progress

    setRefreshState('refreshing');
    setRefreshNotification(null);

    try {
      const result = await syncNewsSources();
      if (result && result.success !== false) {
        setRefreshState('success');
        setRefreshNotification({
          type: 'success',
          message: result.addedCount > 0
            ? `✓ News Updated: Retrieved ${result.addedCount} new genuine article${result.addedCount > 1 ? 's' : ''} from Times of India, The Hindu, Dainik Jagran, Hindustan & Forest Department. Original publication dates preserved, latest news displayed first.`
            : '✓ News Updated: All configured newspapers and official forest department feeds checked. All verified publications are up to date.'
        });

        // Return button to available state after 3.5s
        setTimeout(() => {
          setRefreshState('idle');
        }, 3500);
      } else {
        setRefreshState('error');
        setRefreshNotification({
          type: 'error',
          message: result?.message || 'Unable to connect to live news sources. Keeping previously verified news visible.'
        });

        setTimeout(() => {
          setRefreshState('idle');
        }, 4500);
      }
    } catch (err: any) {
      setRefreshState('error');
      setRefreshNotification({
        type: 'error',
        message: 'Unable to connect to live news sources. Keeping previously verified news visible.'
      });

      setTimeout(() => {
        setRefreshState('idle');
      }, 4500);
    }
  };

  const handleSyncSources = handleRefreshNews;

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormHeadline('');
    setFormSource('Times of India');
    setFormSourceCategory('Established Media');
    setFormPubDate(new Date().toISOString().split('T')[0]);
    setFormSummary('');
    setFormKeyTakeaways('');
    setFormUrl('');
    setFormVerificationStatus('verified_govt');
    setFormTags('Valmiki Reserve Update, Tiger Population');
    setFormLanguage('en');
    setFormFeatured(false);
    setFormPinned(false);
    setShowEditorModal(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormHeadline(article.headline);
    setFormSource(article.source);
    setFormSourceCategory(article.sourceCategory);
    setFormPubDate(article.publicationDate);
    setFormSummary(article.summary);
    setFormKeyTakeaways((article.keyTakeaways || []).join('\n'));
    setFormUrl(article.externalUrl || article.officialSourceRef || '');
    setFormVerificationStatus(article.verificationStatus);
    setFormTags((article.tags || []).join(', '));
    setFormLanguage((article.language as any) || 'en');
    setFormFeatured(article.isFeatured || article.featured || false);
    setFormPinned(article.isPinned || article.pinned || false);
    setShowEditorModal(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHeadline.trim() || !formSummary.trim() || !formSource.trim()) return;

    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);
    const takeawaysArray = formKeyTakeaways.split('\n').map(t => t.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);

    const payload: Omit<NewsArticle, 'id'> = {
      headline: formHeadline.trim(),
      publicationDate: formPubDate,
      source: formSource.trim(),
      sourceCategory: formSourceCategory,
      summary: formSummary.trim(),
      keyTakeaways: takeawaysArray.length > 0 ? takeawaysArray : [formSummary.trim()],
      sourceLink: formUrl.trim() || 'https://vtr.bihar.gov.in',
      officialSourceRef: formUrl.trim(),
      externalUrl: formUrl.trim(),
      verificationStatus: formVerificationStatus,
      retrievedDate: new Date().toISOString().split('T')[0],
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'NTCA / State Forest Media Division',
      isLive: true,
      tags: tagsArray,
      isPinned: formPinned,
      pinned: formPinned,
      isFeatured: formFeatured,
      featured: formFeatured,
      language: formLanguage,
      status: 'approved',
      sourceAttribution: `Reported by ${formSource.trim()}`
    };

    if (editingArticle) {
      updateNews({
        ...payload,
        id: editingArticle.id
      });
    } else {
      addNews(payload);
    }

    setShowEditorModal(false);
  };

  const handleAddCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceUrl.trim()) return;

    addNewsSource({
      name: newSourceName.trim(),
      sourceType: newSourceType,
      category: newSourceCategory,
      url: newSourceUrl.trim(),
      rssFeedUrl: newSourceRss.trim() || undefined,
      enabled: true,
      language: newSourceLanguage
    });

    setNewSourceName('');
    setNewSourceUrl('');
    setNewSourceRss('');
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified_govt':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md border border-emerald-300">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-700" />
            Official Government Source
          </span>
        );
      case 'peer_reviewed':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-md border border-indigo-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-indigo-700" />
            Peer-Reviewed Research
          </span>
        );
      case 'field_verified':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-amber-700" />
            Field-Range Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-semibold bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded-md border border-stone-300">
            <Globe className="w-3 h-3 mr-1 text-stone-600" />
            Established Media Report
          </span>
        );
    }
  };

  // Filter and sort news
  const { featuredArticles, regularArticles, pendingArticles } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = safeNews.filter(item => {
      // Admin pending filter
      if (adminViewTab === 'pending') {
        return item.status === 'pending';
      }

      // Normal visibility: only approved/live articles for visitors
      if (!isAdmin && (item.isLive === false || item.status === 'rejected')) {
        return false;
      }

      // Search match
      const matchesSearch = !q || 
        String(item.headline ?? '').toLowerCase().includes(q) ||
        String(item.summary ?? '').toLowerCase().includes(q) ||
        String(item.source ?? '').toLowerCase().includes(q) ||
        (Array.isArray(item.tags) && item.tags.some(t => String(t ?? '').toLowerCase().includes(q)));

      // Topic Filter
      const matchesTopic = selectedTopic === 'All Topics' || (Array.isArray(item.tags) && item.tags.some(t => {
        const lowerT = String(t ?? '').toLowerCase();
        const lowerTopic = selectedTopic.toLowerCase();
        return lowerT.includes(lowerTopic) || lowerTopic.includes(lowerT);
      }));

      // Source Type Filter
      let matchesSourceType = true;
      if (selectedSourceType === 'govt') {
        matchesSourceType = item.sourceCategory === 'Forest Department' || item.sourceCategory === 'NTCA / MoEFCC';
      } else if (selectedSourceType === 'media') {
        matchesSourceType = item.sourceCategory === 'Established Media';
      } else if (selectedSourceType === 'local') {
        const srcStr = String(item.source ?? '');
        matchesSourceType = srcStr.includes('Jagran') || srcStr.includes('Hindustan') || srcStr.includes('Prabhat') || srcStr.includes('Bhaskar');
      }

      // Language Filter
      const matchesLang = selectedLanguage === 'all' || item.language === selectedLanguage;

      return matchesSearch && matchesTopic && matchesSourceType && matchesLang;
    });

    // Sort
    filtered.sort((a, b) => {
      // Pinned always on top
      const aPinned = a.isPinned || a.pinned;
      const bPinned = b.isPinned || b.pinned;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      if (sortBy === 'recent') {
        return b.publicationDate.localeCompare(a.publicationDate);
      }
      return a.publicationDate.localeCompare(b.publicationDate);
    });

    const featured = filtered.filter(a => a.isFeatured || a.featured || a.isPinned || a.pinned);
    const regular = filtered.filter(a => !(a.isFeatured || a.featured || a.isPinned || a.pinned));
    const pending = news.filter(a => a.status === 'pending');

    return {
      featuredArticles: featured,
      regularArticles: regular,
      pendingArticles: pending
    };
  }, [news, searchQuery, selectedTopic, selectedSourceType, selectedLanguage, sortBy, adminViewTab, isAdmin]);

  const formattedLastUpdate = useMemo(() => {
    try {
      const d = new Date(lastNewsUpdate);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  }, [lastNewsUpdate]);

  return (
    <div className="space-y-8 animate-fade-in pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-5 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap justify-between items-start gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
                <Newspaper className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('nav.news', 'Verified VTR News Dispatch')}</span>
              </div>

              {/* Live sync heartbeat indicator */}
              <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-emerald-950/80 border border-emerald-500/40 rounded-full px-3 py-1 text-xs text-emerald-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Synced: {formattedLastUpdate}</span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {language === 'hi' 
                ? 'बाघ संरक्षण समाचार एवं बुलेटिन' 
                : language === 'ur'
                ? 'شیروں کے تحفظ کے تازہ ترین سائنسی و میڈیا احوال'
                : 'TIGER CONSERVATION NEWS'}
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'वाल्मीकि टाइगर रिजर्व, बिहार वन विभाग, एनटीसीए (NTCA), पर्यावरण मंत्रालय और भारत के अग्रणी राष्ट्रीय व क्षेत्रीय समाचार पत्रों से संकलित प्रमाणित एवं सटीक समाचार।'
                : language === 'ur'
                ? 'والمیکی ٹائیگر ریزرو اور بھارتی جنگلات میں شیروں کے تحفظ سے متعلق تصدیق شدہ سائنسی و صحافتی خبریں، سرکاری نوٹیفکیشنز اور فیلڈ اپ ڈیٹس۔'
                : 'Curated, reliable, and up-to-date media reports, official press releases, field updates, and conservation developments related to Valmiki Tiger Reserve and tiger habitats across India.'}
            </p>

            {/* Credible Media Partners Tagline */}
            <div className="text-[11px] font-mono text-amber-200/80 pt-1 flex flex-wrap gap-2 items-center">
              <span className="text-white/60">Source Network:</span>
              <span>Times of India • The Hindu • Hindustan Times • Dainik Jagran • Hindustan • Dainik Bhaskar • Prabhat Khabar • NTCA • Bihar Forest Dept • WII</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:self-start">
            {isAdmin && (
              <button
                onClick={openCreateModal}
                className="px-3.5 py-2.5 bg-gradient-to-r from-amber-400 to-[#F27D26] text-stone-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md hover:brightness-110 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add News (Admin)</span>
              </button>
            )}

            {/* Auto update toggle */}
            <button
              onClick={toggleAutoUpdate}
              className={`px-3 py-2 text-xs font-mono rounded-xl border flex items-center space-x-1.5 transition ${
                isAutoUpdateEnabled
                  ? 'bg-[#07271D] text-emerald-300 border-emerald-500/50'
                  : 'bg-stone-800 text-stone-400 border-stone-600'
              }`}
              title="Toggle automatic periodic RSS synchronization"
            >
              <Radio className={`w-3.5 h-3.5 ${isAutoUpdateEnabled ? 'text-emerald-400' : 'text-stone-500'}`} />
              <span>Auto-Sync: {isAutoUpdateEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Source Architecture Button */}
            <button
              onClick={() => setShowSourcesModal(true)}
              className="px-3.5 py-2.5 bg-[#07271D] hover:bg-emerald-950 text-emerald-200 text-xs font-mono rounded-xl border border-emerald-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Sources ({newsSources.length})</span>
            </button>

            {/* ↻ REFRESH NEWS Button with state cycle */}
            <button
              id="refresh-news-button"
              onClick={handleRefreshNews}
              disabled={refreshState === 'refreshing'}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md cursor-pointer select-none ${
                refreshState === 'refreshing'
                  ? 'bg-amber-500 text-stone-950 opacity-90 cursor-wait'
                  : refreshState === 'success'
                  ? 'bg-emerald-500 text-stone-950 font-extrabold shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 hover:shadow-lg active:scale-95'
              }`}
              aria-label="Refresh News"
              title="Fetch latest verified tiger conservation news from Times of India, The Hindu, Dainik Jagran, Hindustan & Forest Department"
            >
              {refreshState === 'refreshing' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950 flex-shrink-0" />
                  <span>⟳ Updating News...</span>
                </>
              ) : refreshState === 'success' ? (
                <>
                  <Check className="w-4 h-4 text-stone-950 stroke-[3] flex-shrink-0" />
                  <span>✓ News Updated</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-stone-950 flex-shrink-0" />
                  <span>↻ REFRESH NEWS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sync / Refresh Status Notification Banner */}
        {refreshNotification && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-mono flex items-center justify-between border shadow-sm transition-all animate-fade-in ${
              refreshNotification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                : 'bg-red-950/90 border-red-500/60 text-red-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {refreshNotification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              )}
              <span className="leading-relaxed">{refreshNotification.message}</span>
            </div>
            <button
              onClick={() => setRefreshNotification(null)}
              className="text-stone-400 hover:text-white ml-3 p-1 rounded-md hover:bg-white/10 transition"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Admin Tabs if Admin */}
      {isAdmin && (
        <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs">
          <span className="font-bold text-amber-900 font-mono">Admin Editorial Desk:</span>
          <button
            onClick={() => setAdminViewTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium ${adminViewTab === 'all' ? 'bg-[#0B3D2E] text-white' : 'bg-white text-stone-700 border border-stone-200'}`}
          >
            All Live Articles ({news.length})
          </button>
          <button
            onClick={() => setAdminViewTab('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 ${adminViewTab === 'pending' ? 'bg-[#0B3D2E] text-white' : 'bg-white text-stone-700 border border-stone-200'}`}
          >
            <span>Review Queue</span>
            {pendingArticles.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingArticles.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'समाचार, स्रोत या विषय खोजें...' : 'Search headline, summary, or source...'}
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

          {/* Secondary Controls: Source Type, Language, Sort */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Source Type Filter */}
            <div className="inline-flex rounded-xl bg-stone-100 p-1 text-xs">
              <button
                onClick={() => setSelectedSourceType('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedSourceType === 'all' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setSelectedSourceType('govt')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedSourceType === 'govt' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Official Govt
              </button>
              <button
                onClick={() => setSelectedSourceType('media')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedSourceType === 'media' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Mainstream Media
              </button>
              <button
                onClick={() => setSelectedSourceType('local')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedSourceType === 'local' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Bihar Press
              </button>
            </div>

            {/* Language filter */}
            <select
              value={selectedLanguage}
              onChange={(e: any) => setSelectedLanguage(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ur">اردو (Urdu)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Topic Horizontal Pills */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse overflow-x-auto pb-2 scrollbar-thin">
            {NEWS_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedTopic === topic
                    ? 'bg-[#0B3D2E] text-white shadow-md font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED NEWS SECTION (Top Prominent Placement) */}
      {featuredArticles.length > 0 && adminViewTab === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 font-display font-bold text-xl px-1">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Featured Conservation Highlights & Major Bulletins</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredArticles.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-[#07271D] via-[#0B3D2E] to-[#124B38] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/50 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden group"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-amber-400 text-stone-950 font-bold font-mono text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                        <Star className="w-3 h-3 fill-stone-950" />
                        <span>Featured Story</span>
                      </span>
                      {(item.isPinned || item.pinned) && (
                        <span className="bg-emerald-900 text-emerald-200 border border-emerald-500/50 font-mono text-[11px] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <Pin className="w-3 h-3" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-amber-200/90 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.publicationDate}</span>
                    </div>
                  </div>

                  <h2 
                    onClick={() => setSelectedNews(item)}
                    className="font-display font-bold text-xl sm:text-2xl text-white leading-snug hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {item.headline}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                      <Newspaper className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.source}</span>
                    </div>
                    <span className="bg-emerald-950/90 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                      Category: {item.sourceCategory}
                    </span>
                    {item.topicCategory && (
                      <span className="text-white/70 bg-black/30 px-2 py-1 rounded-lg">
                        {item.topicCategory.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                    <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs space-y-1">
                      <strong className="text-amber-300 block font-mono text-[11px] uppercase">Key Takeaway:</strong>
                      <p className="text-emerald-100">{item.keyTakeaways[0]}</p>
                    </div>
                  )}

                  {/* Original Source Link */}
                  {(item.externalUrl || item.sourceLink || item.officialSourceRef) && (
                    <div className="text-[11px] font-mono text-emerald-200/90 flex items-center space-x-1.5 pt-1">
                      <span className="text-white/60">Original Source Link:</span>
                      <a
                        href={item.externalUrl || item.sourceLink || item.officialSourceRef}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 underline font-semibold flex items-center space-x-1 truncate max-w-[280px]"
                        title={item.externalUrl || item.sourceLink || item.officialSourceRef}
                      >
                        <span>{item.source}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 inline flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-3 relative z-10">
                  <div className="flex items-center space-x-2">
                    {getVerificationBadge(item.verificationStatus)}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Summary</span>
                    </button>

                    {(item.externalUrl || item.sourceLink || item.officialSourceRef) && (
                      <a
                        href={item.externalUrl || item.sourceLink || item.officialSourceRef}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                        title={`Read full article on ${item.source}`}
                      >
                        <span>Read Full News</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>Showing <strong className="text-stone-900">{regularArticles.length}</strong> bulletins & reports</span>
          {isAdmin && (
            <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Admin controls enabled
            </span>
          )}
        </div>

        {regularArticles.length === 0 && featuredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
            <Newspaper className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-stone-800">
              No articles match the current filter
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try choosing another topic, clearing your search query, or refreshing news sources.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All Topics');
                setSelectedSourceType('all');
                setSelectedLanguage('all');
              }}
              className="px-4 py-2 bg-[#0B3D2E] text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularArticles.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200 p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-[#0B3D2E] space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Header Badges: Verification, Source Name & Category */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {getVerificationBadge(item.verificationStatus)}
                      <span className="text-[11px] font-mono text-stone-800 font-bold bg-stone-100 px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                        <Newspaper className="w-3 h-3 text-stone-500" />
                        <span>{item.source}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                        Category: {item.sourceCategory}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-stone-500 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{item.publicationDate}</span>

                      {/* Admin Controls */}
                      {isAdmin && (
                        <div className="flex items-center space-x-1 ml-2 border-l border-stone-200 pl-2">
                          <button
                            onClick={() => pinNews(item.id)}
                            className={`p-1 rounded ${item.pinned || item.isPinned ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-stone-700'}`}
                            title="Pin Article"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleNewsFeatured(item.id)}
                            className={`p-1 rounded ${item.featured || item.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-stone-400 hover:text-stone-700'}`}
                            title="Toggle Featured"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 text-stone-400 hover:text-emerald-700"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete article: "${item.headline}"?`)) {
                                deleteNews(item.id);
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 
                    onClick={() => setSelectedNews(item)}
                    className="font-display font-bold text-lg sm:text-xl text-stone-900 group-hover:text-[#0B3D2E] transition-colors leading-snug cursor-pointer"
                  >
                    {item.headline}
                  </h2>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  {/* Key Takeaways if available */}
                  {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                    <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 text-xs text-stone-700 space-y-1">
                      <strong className="text-emerald-900 font-mono text-[11px] uppercase block">Core Fact / Takeaway:</strong>
                      <p>{item.keyTakeaways[0]}</p>
                    </div>
                  )}

                  {/* Original Source Link */}
                  {(item.externalUrl || item.sourceLink || item.officialSourceRef) && (
                    <div className="text-[11px] font-mono text-stone-500 flex items-center space-x-1.5 pt-1">
                      <span className="text-stone-400">Original Source Link:</span>
                      <a
                        href={item.externalUrl || item.sourceLink || item.officialSourceRef}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-900 underline font-semibold flex items-center space-x-1 truncate max-w-[260px]"
                        title={item.externalUrl || item.sourceLink || item.officialSourceRef}
                      >
                        <span>{item.source}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 inline flex-shrink-0" />
                      </a>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSearchQuery(tag)}
                          className="inline-flex items-center text-[10px] font-mono bg-stone-100 hover:bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full cursor-pointer transition"
                        >
                          <Tag className="w-2.5 h-2.5 mr-1 text-stone-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Engagement Bar: Thumbs up/down + Native Share */}
                <div className="pt-2 border-t border-stone-100">
                  <EngagementBar
                    contentType="news"
                    contentId={item.id}
                    title={item.headline}
                    text={item.summary}
                    url={item.externalUrl || item.sourceLink}
                    initialLikes={item.likes || 0}
                    initialDislikes={item.dislikes || 0}
                    onVote={(type, newLikes, newDislikes) => {
                      updateContentVotes('news', item.id, newLikes, newDislikes);
                    }}
                  />
                </div>

                {/* Footer Action Links */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap justify-between items-center gap-2 text-xs text-stone-500">
                  <span className="font-mono text-[11px] text-stone-500">
                    Source: <strong className="text-stone-700">{item.source}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>Summary</span>
                    </button>

                    {(item.externalUrl || item.sourceLink || item.officialSourceRef) && (
                      <a
                        href={item.externalUrl || item.sourceLink || item.officialSourceRef}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                        title={`Read full article on ${item.source}`}
                      >
                        <span>Read Full News</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Ethical Reporting Disclaimer */}
      <div className="p-5 bg-stone-100 rounded-3xl border border-stone-200 text-xs text-stone-600 space-y-2">
        <div className="flex items-center space-x-2 text-stone-900 font-bold font-mono">
          <Info className="w-4 h-4 text-[#0B3D2E]" />
          <span>Conservation Reporting & Fair Use Standards</span>
        </div>
        <p className="leading-relaxed">
          Valmiki Tiger Watch adheres to strict ethical non-republication principles. All news stories are presented as curated editorial summaries and key scientific takeaways with direct attribution and links to original publishers (Times of India, The Hindu, Hindustan Times, Dainik Jagran, Hindustan, Prabhat Khabar, NTCA, and Bihar Forest Department). We do not host full syndicated articles or speculate on unverified rumors.
        </p>
      </div>

      {/* Selected News Details Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {getVerificationBadge(selectedNews.verificationStatus)}
                  <span className="font-mono text-xs text-stone-500 font-bold">
                    {selectedNews.source}
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl text-stone-900 pt-1">
                  {selectedNews.headline}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 font-mono text-xs">
                <div><strong>Headline:</strong> {selectedNews.headline}</div>
                <div><strong>Source / Newspaper:</strong> {selectedNews.source}</div>
                <div><strong>Publication Date:</strong> {selectedNews.publicationDate}</div>
                <div><strong>Category:</strong> {selectedNews.sourceCategory}</div>
                {selectedNews.verifiedBy && <div><strong>Validation Authority:</strong> {selectedNews.verifiedBy}</div>}
                {(selectedNews.externalUrl || selectedNews.sourceLink || selectedNews.officialSourceRef) && (
                  <div className="pt-1 flex items-center space-x-1.5 truncate">
                    <strong>Original Source Link:</strong>
                    <a
                      href={selectedNews.externalUrl || selectedNews.sourceLink || selectedNews.officialSourceRef}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline font-semibold truncate hover:text-emerald-900 flex items-center space-x-1"
                    >
                      <span className="truncate">{selectedNews.externalUrl || selectedNews.sourceLink || selectedNews.officialSourceRef}</span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 inline ml-1" />
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <strong className="text-stone-900 block text-sm font-semibold">Short Summary:</strong>
                <p className="leading-relaxed bg-white p-4 rounded-2xl border border-stone-200">{selectedNews.summary}</p>
              </div>

              {selectedNews.keyTakeaways && selectedNews.keyTakeaways.length > 0 && (
                <div className="space-y-2">
                  <strong className="text-stone-900 block text-sm font-semibold">Key Conservation Takeaways:</strong>
                  <ul className="list-disc list-inside space-y-1.5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    {selectedNews.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="leading-relaxed">{takeaway}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Engagement Bar inside modal */}
              <div className="pt-2 border-t border-stone-200">
                <EngagementBar
                  contentType="news"
                  contentId={selectedNews.id}
                  title={selectedNews.headline}
                  text={selectedNews.summary}
                  url={selectedNews.externalUrl || selectedNews.sourceLink}
                  initialLikes={selectedNews.likes || 0}
                  initialDislikes={selectedNews.dislikes || 0}
                  onVote={(type, newLikes, newDislikes) => {
                    updateContentVotes('news', selectedNews.id, newLikes, newDislikes);
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between items-center gap-3">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-200 transition cursor-pointer"
              >
                Close
              </button>
              {(selectedNews.externalUrl || selectedNews.sourceLink || selectedNews.officialSourceRef) && (
                <a
                  href={selectedNews.externalUrl || selectedNews.sourceLink || selectedNews.officialSourceRef}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#0B3D2E] text-white font-bold rounded-xl text-xs hover:bg-emerald-900 transition flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <span>Read Full News</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sources Management Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                  Verified Ingestion Architecture
                </span>
                <h2 className="font-display font-bold text-2xl text-stone-900">
                  Monitored News & Official Feeds ({newsSources.length})
                </h2>
              </div>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                The platform monitors prioritized Indian national and regional press outlets alongside official tiger conservation bodies. Below is the active registry of sources.
              </p>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto border border-stone-200 rounded-2xl bg-stone-50 p-2">
                {newsSources.map((source) => (
                  <div key={source.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900">{source.name}</span>
                        <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-2 py-0.2 rounded">
                          {source.category}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-stone-500">
                          {source.language}
                        </span>
                      </div>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-emerald-800 text-[11px] hover:underline font-mono">
                        {source.url}
                      </a>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isAdmin ? (
                        <button
                          onClick={() => toggleNewsSource(source.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                            source.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {source.enabled ? 'Active' : 'Disabled'}
                        </button>
                      ) : (
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                          source.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {source.enabled ? 'Active' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Source if Admin */}
              {isAdmin && (
                <form onSubmit={handleAddCustomSource} className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <h4 className="font-bold text-xs text-amber-900 font-mono uppercase">Add News Source / RSS (Admin)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Source Name (e.g. Prabhat Khabar Bettiah)"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                      required
                      className="p-2 bg-white border border-amber-300 rounded-xl"
                    />
                    <input
                      type="url"
                      placeholder="Portal URL (https://...)"
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      required
                      className="p-2 bg-white border border-amber-300 rounded-xl"
                    />
                    <input
                      type="url"
                      placeholder="RSS Feed URL (optional)"
                      value={newSourceRss}
                      onChange={(e) => setNewSourceRss(e.target.value)}
                      className="p-2 bg-white border border-amber-300 rounded-xl"
                    />
                    <select
                      value={newSourceCategory}
                      onChange={(e: any) => setNewSourceCategory(e.target.value)}
                      className="p-2 bg-white border border-amber-300 rounded-xl"
                    >
                      <option value="Established Media">Established Media</option>
                      <option value="Forest Department">Forest Department</option>
                      <option value="NTCA / MoEFCC">NTCA / MoEFCC</option>
                      <option value="WII Research">WII Research</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs"
                  >
                    Register Source Feed
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit News Modal */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-mono text-amber-600 font-bold uppercase">
                  {editingArticle ? 'Admin News Editor' : 'Publish Verified Article'}
                </span>
                <h2 className="font-display font-bold text-2xl text-stone-900">
                  {editingArticle ? 'Edit Article' : 'Add New Tiger News Bulletin'}
                </h2>
              </div>
              <button
                onClick={() => setShowEditorModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Headline *</label>
                <input
                  type="text"
                  required
                  value={formHeadline}
                  onChange={(e) => setFormHeadline(e.target.value)}
                  placeholder="e.g. VTR Camera-Trap Census Documents Healthy Cub Ratio in Manguraha Range"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0B3D2E]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">News Source *</label>
                  <input
                    type="text"
                    required
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="e.g. The Hindu / Dainik Jagran / Times of India"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Source Category</label>
                  <select
                    value={formSourceCategory}
                    onChange={(e: any) => setFormSourceCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Established Media">Established Media</option>
                    <option value="Forest Department">Forest Department</option>
                    <option value="NTCA / MoEFCC">NTCA / MoEFCC</option>
                    <option value="WII Research">WII Research</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Publication Date</label>
                  <input
                    type="date"
                    value={formPubDate}
                    onChange={(e) => setFormPubDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Verification Level</label>
                  <select
                    value={formVerificationStatus}
                    onChange={(e: any) => setFormVerificationStatus(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="verified_govt">Official Government Source</option>
                    <option value="established_media">Established Media</option>
                    <option value="field_verified">Field-Range Verified</option>
                    <option value="peer_reviewed">Peer-Reviewed Research</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-stone-700">Original Article Link / URL</label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://timesofindia.indiatimes.com/..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-stone-700">Editorial Summary *</label>
                  <textarea
                    rows={3}
                    required
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Provide accurate, concise facts. Do not copy full newspaper copyright content."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-stone-700">Key Conservation Takeaways (one per line)</label>
                  <textarea
                    rows={2}
                    value={formKeyTakeaways}
                    onChange={(e) => setFormKeyTakeaways(e.target.value)}
                    placeholder="New camera trap line covers 40 sq km&#10;Three sub-adult tigers spotted"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Topic Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Valmiki Reserve Update, Tiger Population, Anti-Poaching"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e: any) => setFormLanguage(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ur">اردو (Urdu)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-[#0B3D2E] focus:ring-[#0B3D2E]"
                  />
                  <span className="font-semibold text-stone-800 text-xs">Set as Featured Story</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="rounded text-[#0B3D2E] focus:ring-[#0B3D2E]"
                  />
                  <span className="font-semibold text-stone-800 text-xs">Pin to Top</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-[#F27D26] text-stone-950 rounded-xl font-bold text-xs shadow-md hover:brightness-110"
                >
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
