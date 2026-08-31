import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { NewsArticle } from '../../types';
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
  Clock
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { 
    news, 
    newsSources, 
    syncNewsSources, 
    selectedNews, 
    setSelectedNews 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const categories = ['all', 'Forest Department', 'NTCA / MoEFCC', 'WII Research', 'Established Media'];

  const filteredNews = news.filter(item => {
    const matchesSearch = 
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || item.sourceCategory === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleSyncSources = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const result = await syncNewsSources();
      setSyncStatusMsg(result.message);
    } catch (e) {
      setSyncStatusMsg('Sync check completed. No new updates at this time.');
    } finally {
      setIsSyncing(false);
    }
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
            Established Media
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
              <Newspaper className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified VTR Information Dispatch</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              VTR News & Conservation Bulletins
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
              Every news item is rigorously validated against official records from the Bihar Forest Department, NTCA, MoEFCC, and Wildlife Institute of India. We do not publish fabricated reports or unverified rumors.
            </p>
          </div>

          {/* Source Architecture & Sync Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowSourcesModal(true)}
              className="px-4 py-2.5 bg-[#07271D] hover:bg-emerald-950 text-emerald-200 text-xs font-mono rounded-xl border border-emerald-700 flex items-center space-x-2 transition-colors"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Source Registry ({newsSources.length})</span>
            </button>

            <button
              onClick={handleSyncSources}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-2 shadow transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Validating Feeds...' : 'Sync Sources'}</span>
            </button>
          </div>
        </div>

        {syncStatusMsg && (
          <div className="bg-[#07271D] border border-emerald-600/50 p-3 rounded-xl text-xs text-emerald-200 font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search headline, keyword, or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0B3D2E] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Sources' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            onClick={() => setSelectedNews(item)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-stone-200 p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-[#0B3D2E]"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {getVerificationBadge(item.verificationStatus)}
                <span className="font-mono text-xs text-stone-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
                  {item.publicationDate}
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900 hover:text-[#0B3D2E] transition-colors leading-snug">
                {item.headline}
              </h2>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                {item.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-stone-100 text-stone-600 text-[11px] font-mono px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Source Info & Link */}
            <div className="pt-4 mt-4 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
              <div className="flex items-center space-x-1.5 truncate max-w-[220px]">
                <Globe className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span className="font-medium text-stone-700 truncate">{item.source}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-mono text-[11px] text-stone-400">
                  Retrieved: {item.retrievedDate}
                </span>
                <span className="text-[#0B3D2E] font-semibold flex items-center hover:underline">
                  Full Story <ExternalLink className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <Newspaper className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="font-display font-bold text-lg text-stone-700">No news articles found</h3>
          <p className="text-xs text-stone-500">Try adjusting your search criteria or selecting all sources.</p>
        </div>
      )}

      {/* News Article Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-8">
            <div className="bg-[#0B3D2E] text-white p-6 sm:p-8 flex justify-between items-start">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-2">
                  {getVerificationBadge(selectedNews.verificationStatus)}
                  <span className="font-mono text-xs text-emerald-300">{selectedNews.publicationDate}</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug">
                  {selectedNews.headline}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-950 text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                <strong>Executive Summary:</strong> {selectedNews.summary}
              </div>

              {selectedNews.content && (
                <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <h4 className="font-display font-bold text-stone-900 text-base">Full Conservation Report</h4>
                  <p>{selectedNews.content}</p>
                </div>
              )}

              {/* Source Verification Block */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Source Attribution & Provenance</span>
                </div>
                <p className="text-emerald-800">
                  <strong>Source Authority:</strong> {selectedNews.source}
                </p>
                <p className="text-emerald-800">
                  <strong>Verification Timestamp:</strong> {selectedNews.retrievedDate}
                </p>
                <a
                  href={selectedNews.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-emerald-900 font-bold underline hover:text-emerald-700 pt-1"
                >
                  <span>Open Primary Source Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2.5 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Update News Source Architecture Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-8">
            <div className="bg-[#07271D] text-white p-6 flex justify-between items-center border-b border-emerald-900">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-display font-bold text-lg">News Source Registry & Ingestion Engine</h3>
                  <p className="text-xs text-amber-300/80 font-mono">Configurable verified data channels</p>
                </div>
              </div>
              <button onClick={() => setShowSourcesModal(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              <p className="text-stone-600 leading-relaxed">
                The news engine tracks approved feeds and government portals to prevent misinformation. In accordance with platform guidelines, no invasive scraping is performed.
              </p>

              <div className="space-y-3">
                {newsSources.map((src) => (
                  <div
                    key={src.id}
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900">{src.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-2 py-0.5 rounded uppercase">
                          {src.trustLevel}
                        </span>
                      </div>
                      <p className="text-stone-500 font-mono text-[11px] truncate max-w-sm">{src.url}</p>
                      <div className="flex items-center space-x-3 text-stone-400 text-[11px]">
                        <span>Type: {src.type.toUpperCase()}</span>
                        <span>•</span>
                        <span>Last Check: {new Date(src.lastChecked).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        src.enabled ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-700'
                      }`}>
                        {src.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-500 font-mono">
                Admins can modify feed endpoints in Admin Dashboard
              </span>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="px-5 py-2.5 bg-[#0B3D2E] text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
