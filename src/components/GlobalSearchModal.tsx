import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTiger, getLocalizedSpeciesName, getLocalizedIUCN } from '../i18n/localizedData';
import { 
  Search, 
  X, 
  Eye, 
  Newspaper, 
  BookOpen, 
  Compass, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Tag, 
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
  Trees,
  Footprints,
  CornerDownLeft,
  CloudSun
} from 'lucide-react';
import { TigerProfile, NewsArticle, EducationItem, WildlifeSpecies } from '../types';

export type SearchCategoryFilter = 'all' | 'tigers' | 'news' | 'education' | 'wildlife' | 'sections';

interface SearchResultItem {
  id: string;
  type: 'tiger' | 'news' | 'education' | 'wildlife' | 'section';
  title: string;
  subtitle: string;
  snippet?: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  imageUrl?: string;
  data?: any;
  action: () => void;
}

const STORAGE_KEY_RECENT = 'vtw_recent_searches_v1';
const POPULAR_SUGGESTIONS = [
  'VTR-T07',
  'Pugmark Identification',
  'Camera Trap Census',
  'Madanpur Range',
  'Great Hornbill',
  'Project Tiger 1990',
  'Nazish Asad'
];

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery,
    tigers, 
    news, 
    education, 
    wildlife, 
    research,
    setActiveTab, 
    setSelectedTiger, 
    setSelectedNews 
  } = useData();

  const { t, language, isRtl } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<SearchCategoryFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT);
      return saved ? JSON.parse(saved) : ['VTR-T07', 'Pugmark Guide', 'Census'];
    } catch {
      return ['VTR-T07', 'Pugmark Guide', 'Census'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard listener for Cmd+K / Ctrl+K and /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if not already in another input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === '/' && !isInput && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    try {
      const updated = [trimmed, ...recentSearches.filter(q => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
    } catch (e) {}
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY_RECENT);
    } catch (e) {}
  };

  const handleSelectResult = (item: SearchResultItem) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
    }
    setIsSearchOpen(false);
    item.action();
  };

  // Build searchable section quick jumps
  const sectionItems: SearchResultItem[] = useMemo(() => [
    {
      id: 'sec-tigers',
      type: 'section',
      title: t('nav.tigers', 'Tigers of VTR Registry'),
      subtitle: 'Browse 54+ camera-trap registered Bengal tigers with unique stripe profiles',
      badge: t('search.filter_tigers', 'Tigers'),
      badgeColor: 'bg-amber-600/10 text-amber-600 border-amber-500/30',
      icon: <Eye className="w-4 h-4 text-amber-600" />,
      action: () => setActiveTab('tigers')
    },
    {
      id: 'sec-news',
      type: 'section',
      title: t('nav.news', 'Verified News & Bulletins'),
      subtitle: 'Official forest dispatches, monitoring updates, and conservation press',
      badge: t('search.filter_news', 'News'),
      badgeColor: 'bg-sky-600/10 text-sky-600 border-sky-500/30',
      icon: <Newspaper className="w-4 h-4 text-sky-600" />,
      action: () => setActiveTab('news')
    },
    {
      id: 'sec-edu-pugmark',
      type: 'section',
      title: 'Pugmark Identification & Field Tracker Toolkit',
      subtitle: 'Learn footprint pad geometry, male vs female track diagnostics, and biologist tips',
      badge: t('search.filter_education', 'Education'),
      badgeColor: 'bg-emerald-600/10 text-emerald-600 border-emerald-500/30',
      icon: <Footprints className="w-4 h-4 text-emerald-600" />,
      action: () => setActiveTab('education')
    },
    {
      id: 'sec-wildlife',
      type: 'section',
      title: t('nav.wildlife', 'Wildlife & Biodiversity Atlas'),
      subtitle: 'Mammals, avifauna, reptiles, and flora across Valmiki Terai landscape',
      badge: t('search.filter_wildlife', 'Wildlife'),
      badgeColor: 'bg-teal-600/10 text-teal-600 border-teal-500/30',
      icon: <Trees className="w-4 h-4 text-teal-600" />,
      action: () => setActiveTab('wildlife')
    },
    {
      id: 'sec-map',
      type: 'section',
      title: t('nav.map', 'Interactive Reserve Map & Zones'),
      subtitle: 'Forest ranges, division boundaries, core areas, buffer belts & safari routes',
      badge: t('nav.map', 'Map'),
      badgeColor: 'bg-indigo-600/10 text-indigo-600 border-indigo-500/30',
      icon: <MapPin className="w-4 h-4 text-indigo-600" />,
      action: () => setActiveTab('map')
    },
    {
      id: 'sec-project-tiger',
      type: 'section',
      title: t('nav.project_tiger', 'Project Tiger History & Milestones'),
      subtitle: 'From 1990 declaration to modern Phase-IV smart electronic surveillance',
      badge: 'Project Tiger',
      badgeColor: 'bg-amber-700/10 text-amber-700 border-amber-600/30',
      icon: <Award className="w-4 h-4 text-amber-700" />,
      action: () => setActiveTab('project-tiger')
    },
    {
      id: 'sec-sightings',
      type: 'section',
      title: t('nav.sightings', 'Citizen Wildlife Sightings Desk'),
      subtitle: 'Submit verified wildlife observations, tracks, and non-sensitive field records',
      badge: t('nav.sightings', 'Sightings'),
      badgeColor: 'bg-emerald-700/10 text-emerald-700 border-emerald-600/30',
      icon: <Compass className="w-4 h-4 text-emerald-700" />,
      action: () => setActiveTab('sightings')
    },
    {
      id: 'sec-ecotourism',
      type: 'section',
      title: t('nav.ecotourism', 'Ecotourism & Safari Entry Gates'),
      subtitle: 'Valmikinagar, Manguraha, Gobardhana gates, eco-huts, and visitor rules',
      badge: t('nav.ecotourism', 'Ecotourism'),
      badgeColor: 'bg-blue-600/10 text-blue-600 border-blue-500/30',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
      action: () => setActiveTab('ecotourism')
    },
    {
      id: 'sec-credits',
      type: 'section',
      title: 'Nazish Asad — Environmental & Wildlife Conservation Activist (Creator)',
      subtitle: 'Creator profile, conservation mission, independent awareness initiative, and references',
      badge: 'Creator',
      badgeColor: 'bg-amber-600/10 text-amber-600 border-amber-500/30',
      icon: <Award className="w-4 h-4 text-amber-600" />,
      action: () => setActiveTab('credits')
    },
    {
      id: 'sec-research',
      type: 'section',
      title: t('nav.research', 'Research Papers & Scientific Studies'),
      subtitle: 'WII, NTCA, and university publications on prey density and tiger genetics',
      badge: 'Research',
      badgeColor: 'bg-slate-600/10 text-slate-600 border-slate-500/30',
      icon: <BookOpen className="w-4 h-4 text-slate-600" />,
      action: () => setActiveTab('research')
    },
    {
      id: 'sec-weather',
      type: 'section',
      title: t('nav.weather', 'VTR Weather & Forecast (Valmiki Nagar)'),
      subtitle: 'Real-time temperature, rainfall, 7-day forecast, humidity, wind, and safari weather advisory',
      badge: 'Weather',
      badgeColor: 'bg-emerald-600/10 text-emerald-700 border-emerald-500/30',
      icon: <CloudSun className="w-4 h-4 text-emerald-600" />,
      action: () => setActiveTab('weather')
    }
  ], [t, setActiveTab]);

  // Aggregate and filter all results
  const allResults: SearchResultItem[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);

    const matchesAllWords = (text: string) => {
      if (!q) return true;
      const lower = text.toLowerCase();
      return words.every(w => lower.includes(w));
    };

    const results: SearchResultItem[] = [];

    // 1. Tigers Search
    tigers.forEach((rawTiger) => {
      const tiger = getLocalizedTiger(rawTiger, language);
      const searchBlob = `${tiger.code} ${tiger.name || ''} ${tiger.safeTerritory} ${tiger.markings} ${tiger.sex} ${tiger.status} ${tiger.notes} ${tiger.familyLineage || ''}`;
      
      if (matchesAllWords(searchBlob)) {
        results.push({
          id: `tiger-${tiger.id}`,
          type: 'tiger',
          title: tiger.name ? `${tiger.name} (${tiger.code})` : tiger.code,
          subtitle: `${tiger.status} • ${tiger.sex} • Approx. ${tiger.approxAge} • ${tiger.safeTerritory}`,
          snippet: tiger.markings,
          badge: tiger.code,
          badgeColor: 'bg-amber-500/15 text-amber-700 border-amber-500/40',
          icon: <Eye className="w-4 h-4 text-amber-600" />,
          imageUrl: tiger.photoUrl,
          data: rawTiger,
          action: () => {
            setActiveTab('tigers');
            setSelectedTiger(rawTiger);
          }
        });
      }
    });

    // 2. News Articles Search
    news.forEach((article) => {
      const searchBlob = `${article.headline} ${article.summary} ${article.content || ''} ${article.source} ${article.sourceCategory} ${article.tags.join(' ')} ${article.publicationDate}`;
      
      if (matchesAllWords(searchBlob)) {
        results.push({
          id: `news-${article.id}`,
          type: 'news',
          title: article.headline,
          subtitle: `${article.publicationDate} • ${article.source} • ${article.sourceCategory}`,
          snippet: article.summary,
          badge: article.sourceCategory,
          badgeColor: 'bg-sky-500/15 text-sky-700 border-sky-500/40',
          icon: <Newspaper className="w-4 h-4 text-sky-600" />,
          imageUrl: article.imageUrl,
          data: article,
          action: () => {
            setActiveTab('news');
            setSelectedNews(article);
          }
        });
      }
    });

    // 3. Educational Content & Quizzes Search
    education.forEach((item) => {
      const quizBlob = item.interactiveQuiz ? `${item.interactiveQuiz.question} ${item.interactiveQuiz.options.join(' ')} ${item.interactiveQuiz.explanation}` : '';
      const searchBlob = `${item.title} ${item.category} ${item.summary} ${item.content} ${item.keyTakeaways.join(' ')} ${quizBlob}`;
      
      if (matchesAllWords(searchBlob)) {
        results.push({
          id: `edu-${item.id}`,
          type: 'education',
          title: item.title,
          subtitle: `Module: ${item.category} • Key Concepts & Field Notes`,
          snippet: item.summary,
          badge: item.category,
          badgeColor: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/40',
          icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
          data: item,
          action: () => {
            setActiveTab('education');
          }
        });
      }
    });

    // 4. Wildlife Species Search
    wildlife.forEach((species) => {
      const localizedName = getLocalizedSpeciesName(species.commonName, language);
      const searchBlob = `${species.commonName} ${localizedName} ${species.scientificName} ${species.category} ${species.vtrHabitat} ${species.description} ${species.keyFeatures.join(' ')} ${species.threats.join(' ')}`;
      
      if (matchesAllWords(searchBlob)) {
        results.push({
          id: `wildlife-${species.id}`,
          type: 'wildlife',
          title: localizedName !== species.commonName ? `${localizedName} (${species.commonName})` : species.commonName,
          subtitle: `${species.scientificName} • IUCN: ${getLocalizedIUCN(species.iucnStatus, language)} • ${species.vtrHabitat}`,
          snippet: species.description,
          badge: species.category.toUpperCase(),
          badgeColor: 'bg-teal-500/15 text-teal-700 border-teal-500/40',
          icon: <Trees className="w-4 h-4 text-teal-600" />,
          imageUrl: species.image,
          data: species,
          action: () => {
            setActiveTab('wildlife');
          }
        });
      }
    });

    // 5. Sections Search
    sectionItems.forEach((sec) => {
      const searchBlob = `${sec.title} ${sec.subtitle} ${sec.badge}`;
      if (matchesAllWords(searchBlob)) {
        results.push(sec);
      }
    });

    return results;
  }, [searchQuery, tigers, news, education, wildlife, sectionItems, language, setActiveTab, setSelectedTiger, setSelectedNews]);

  // Filtered by selected active tab pill
  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return allResults;
    if (activeFilter === 'tigers') return allResults.filter(r => r.type === 'tiger');
    if (activeFilter === 'news') return allResults.filter(r => r.type === 'news');
    if (activeFilter === 'education') return allResults.filter(r => r.type === 'education');
    if (activeFilter === 'wildlife') return allResults.filter(r => r.type === 'wildlife');
    if (activeFilter === 'sections') return allResults.filter(r => r.type === 'section');
    return allResults;
  }, [allResults, activeFilter]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: allResults.length,
      tigers: allResults.filter(r => r.type === 'tiger').length,
      news: allResults.filter(r => r.type === 'news').length,
      education: allResults.filter(r => r.type === 'education').length,
      wildlife: allResults.filter(r => r.type === 'wildlife').length,
      sections: allResults.filter(r => r.type === 'section').length,
    };
  }, [allResults]);

  // Keyboard navigation within results list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, filteredResults.length - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isSearchOpen) return null;

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    const words = query.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-stone-900 rounded px-0.5 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={() => setIsSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-modal-title"
    >
      <div 
        className="bg-white max-w-3xl w-full rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input Area */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FDFBF7] flex items-center gap-3">
          <div className="p-2.5 bg-[#0B3D2E] text-[#F27D26] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={t('search.input_placeholder', 'Search tigers, news, educational guides, species, research...')}
              className="w-full bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder-stone-400 focus:outline-none pr-8 font-sans"
              autoComplete="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono text-stone-400 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg">
            <span>ESC</span>
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            title="Close Search"
            id="close-search-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Tabs Ribbon */}
        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: t('search.filter_all', 'All'), count: counts.all },
            { id: 'tigers', label: t('search.filter_tigers', 'Tigers'), count: counts.tigers },
            { id: 'news', label: t('search.filter_news', 'News'), count: counts.news },
            { id: 'education', label: t('search.filter_education', 'Education'), count: counts.education },
            { id: 'wildlife', label: t('search.filter_wildlife', 'Wildlife'), count: counts.wildlife },
            { id: 'sections', label: t('search.filter_sections', 'Sections'), count: counts.sections },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id as SearchCategoryFilter);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-[#0B3D2E] text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id
                  ? 'bg-[#F27D26] text-white'
                  : 'bg-stone-100 text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Results / Empty / Suggestions Viewport */}
        <div 
          ref={listRef} 
          className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-stone-100 min-h-[260px] max-h-[58vh]"
        >
          {/* If Search Query is Empty -> Show Recent Searches & Popular Suggestions */}
          {!searchQuery.trim() && (
            <div className="p-2 space-y-6 animate-fade-in">
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {t('search.recent_title', 'Recent Searches')}
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-stone-400 hover:text-red-600 transition-colors"
                    >
                      {t('search.clear_recent', 'Clear')}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((rec, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchQuery(rec)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors border border-stone-200"
                      >
                        <Search className="w-3 h-3 text-stone-400" />
                        <span>{rec}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Suggestions */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {t('search.suggested_title', 'Popular Suggestions')}
                </span>

                <div className="flex flex-wrap gap-2">
                  {POPULAR_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(sug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 border border-amber-200 rounded-xl text-xs font-medium transition-colors"
                    >
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono block">
                  {t('search.filter_sections', 'Platform Highlights')}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sectionItems.slice(0, 4).map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleSelectResult(sec)}
                      className="text-left p-3 rounded-xl border border-stone-200 hover:border-[#0B3D2E]/40 hover:bg-stone-50 transition-all flex items-start gap-3 group"
                    >
                      <div className="p-2 rounded-lg bg-stone-100 text-[#0B3D2E] group-hover:bg-[#0B3D2E] group-hover:text-[#F27D26] transition-colors mt-0.5">
                        {sec.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-stone-900 group-hover:text-[#0B3D2E] truncate">
                          {sec.title}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {sec.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If Search Query has items -> Render Results List */}
          {searchQuery.trim() && filteredResults.length > 0 && (
            <div className="space-y-1">
              {filteredResults.map((item, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                  <div
                    key={item.id}
                    data-index={idx}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 sm:p-3.5 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected 
                        ? 'bg-[#0B3D2E]/5 border border-[#0B3D2E]/20 shadow-sm' 
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    {/* Item Thumbnail or Thematic Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {item.imageUrl ? (
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${item.badgeColor}`}>
                          {item.icon}
                        </div>
                      )}
                    </div>

                    {/* Result Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                          <h4 className="font-display font-bold text-sm sm:text-base text-stone-900 truncate">
                            {highlightMatch(item.title, searchQuery)}
                          </h4>
                        </div>

                        <span className={`text-[11px] font-semibold items-center gap-1 flex-shrink-0 hidden sm:flex ${
                          isSelected ? 'text-[#0B3D2E]' : 'text-stone-400'
                        }`}>
                          <CornerDownLeft className="w-3 h-3" />
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-1 font-medium">
                        {highlightMatch(item.subtitle, searchQuery)}
                      </p>

                      {item.snippet && (
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed bg-stone-50/80 p-1.5 rounded-lg border border-stone-100 mt-1">
                          {highlightMatch(item.snippet, searchQuery)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results Fallback */}
          {searchQuery.trim() && filteredResults.length === 0 && (
            <div className="p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-stone-800">
                {t('search.no_results_title', 'No matching records found')}
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                {t('search.no_results_desc', 'Try searching by tiger code (e.g., VTR-T07), topic (e.g., Census, Pugmark), species, or range name.')}
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  {t('btn.reset', 'Clear Query')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 sm:px-6 py-2.5 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] text-stone-500 font-mono gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-bold">↑</span>
              <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-bold">↓</span>
              <span className="hidden sm:inline">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-bold">↵</span>
              <span className="hidden sm:inline">Select</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-bold">ESC</span>
              <span className="hidden sm:inline">Close</span>
            </span>
          </div>

          <div className="text-stone-400">
            {filteredResults.length} {t('search.results_count', 'records found')}
          </div>
        </div>
      </div>
    </div>
  );
};
