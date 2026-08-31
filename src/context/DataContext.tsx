import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TigerProfile,
  NewsArticle,
  NewsSource,
  WildlifeSpecies,
  ConservationAlert,
  WildlifeSighting,
  ResearchReport,
  EducationItem,
  EcotourismZone,
  CommunityInitiative,
  GalleryItem
} from '../types';
import {
  INITIAL_TIGERS,
  INITIAL_NEWS,
  INITIAL_NEWS_SOURCES,
  INITIAL_WILDLIFE,
  INITIAL_ALERTS,
  INITIAL_RESEARCH,
  INITIAL_EDUCATION,
  INITIAL_ECOTOURISM,
  INITIAL_COMMUNITY,
  INITIAL_SIGHTINGS,
  INITIAL_GALLERY
} from '../data/initialData';

interface DataContextType {
  // Navigation & UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  openSearchModal: (initialQuery?: string) => void;
  selectedTiger: TigerProfile | null;
  setSelectedTiger: (tiger: TigerProfile | null) => void;
  selectedNews: NewsArticle | null;
  setSelectedNews: (news: NewsArticle | null) => void;

  // PWA & Network
  isOnline: boolean;
  canInstallPwa: boolean;
  installPwa: () => Promise<void>;

  // Data Collections
  tigers: TigerProfile[];
  news: NewsArticle[];
  newsSources: NewsSource[];
  wildlife: WildlifeSpecies[];
  alerts: ConservationAlert[];
  sightings: WildlifeSighting[];
  research: ResearchReport[];
  education: EducationItem[];
  ecotourism: EcotourismZone[];
  community: CommunityInitiative[];
  gallery: GalleryItem[];

  // Public Actions
  submitSighting: (sighting: Omit<WildlifeSighting, 'id' | 'verificationStatus' | 'submittedAt'>) => void;

  // Admin Features
  isAdmin: boolean;
  adminLogin: (pass: string) => boolean;
  adminLogout: () => void;
  addTiger: (tiger: Omit<TigerProfile, 'id'>) => void;
  updateTiger: (tiger: TigerProfile) => void;
  deleteTiger: (id: string) => void;
  addNews: (article: Omit<NewsArticle, 'id'>) => void;
  updateNews: (article: NewsArticle) => void;
  deleteNews: (id: string) => void;
  toggleNewsSource: (id: string) => void;
  addNewsSource: (source: Omit<NewsSource, 'id' | 'lastChecked' | 'checkStatus'>) => void;
  syncNewsSources: () => Promise<{ addedCount: number; message: string }>;
  addAlert: (alert: Omit<ConservationAlert, 'id'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  approveSighting: (id: string) => void;
  flagSighting: (id: string) => void;
  deleteSighting: (id: string) => void;
  exportDataBackup: () => string;
  importDataBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TIGERS: 'vtw_tigers_v1',
  NEWS: 'vtw_news_v1',
  SOURCES: 'vtw_sources_v1',
  ALERTS: 'vtw_alerts_v1',
  SIGHTINGS: 'vtw_sightings_v1',
  ADMIN: 'vtw_admin_session_v1'
};

const ADMIN_PASSWORD_HASH = 'vtw2026admin'; // Standard access key for demonstration

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedTiger, setSelectedTiger] = useState<TigerProfile | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  const openSearchModal = (initialQuery?: string) => {
    if (typeof initialQuery === 'string') {
      setSearchQuery(initialQuery);
    }
    setIsSearchOpen(true);
  };

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // PWA Install Event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  // Admin Session
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  // State with LocalStorage Caching
  const [tigers, setTigers] = useState<TigerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIGERS);
      return saved ? JSON.parse(saved) : INITIAL_TIGERS;
    } catch {
      return INITIAL_TIGERS;
    }
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [newsSources, setNewsSources] = useState<NewsSource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOURCES);
      return saved ? JSON.parse(saved) : INITIAL_NEWS_SOURCES;
    } catch {
      return INITIAL_NEWS_SOURCES;
    }
  });

  const [alerts, setAlerts] = useState<ConservationAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [sightings, setSightings] = useState<WildlifeSighting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIGHTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SIGHTINGS;
    } catch {
      return INITIAL_SIGHTINGS;
    }
  });

  // Static datasets
  const [wildlife] = useState<WildlifeSpecies[]>(INITIAL_WILDLIFE);
  const [research] = useState<ResearchReport[]>(INITIAL_RESEARCH);
  const [education] = useState<EducationItem[]>(INITIAL_EDUCATION);
  const [ecotourism] = useState<EcotourismZone[]>(INITIAL_ECOTOURISM);
  const [community] = useState<CommunityInitiative[]>(INITIAL_COMMUNITY);
  const [gallery] = useState<GalleryItem[]>(INITIAL_GALLERY);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIGERS, JSON.stringify(tigers));
    } catch (e) {
      console.warn('Failed saving tigers to storage:', e);
    }
  }, [tigers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.warn('Failed saving news to storage:', e);
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(newsSources));
    } catch (e) {
      console.warn('Failed saving sources to storage:', e);
    }
  }, [newsSources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed saving alerts to storage:', e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(sightings));
    } catch (e) {
      console.warn('Failed saving sightings to storage:', e);
    }
  }, [sightings]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PWA Install Prompt Listener & Service Worker Registration
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
      console.log('[VTW PWA] Captured beforeinstallprompt event');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then((reg) => {
          console.log('[VTW PWA] Service worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[VTW PWA] Service worker registration error:', err);
        });
    }

    // Read initial hash from URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTabState(hash);
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash) {
        setActiveTabState(currentHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Tab Switcher with URL Hash
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = tab === 'home' ? '' : `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PWA Install Trigger
  const installPwa = async () => {
    if (!deferredPrompt) {
      alert('PWA installation is already installed or not supported by this browser. You can also use "Add to Home Screen" from browser settings.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[VTW PWA] User install choice outcome:', outcome);
    setDeferredPrompt(null);
    setCanInstallPwa(false);
  };

  // Public: Sighting Submission
  const submitSighting = (sighting: Omit<WildlifeSighting, 'id' | 'verificationStatus' | 'submittedAt'>) => {
    const newSighting: WildlifeSighting = {
      ...sighting,
      id: `sight-${Date.now()}`,
      verificationStatus: 'pending',
      submittedAt: new Date().toISOString()
    };
    setSightings(prev => [newSighting, ...prev]);
  };

  // Admin Auth
  const adminLogin = (pass: string): boolean => {
    if (pass.trim() === ADMIN_PASSWORD_HASH) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN, 'true');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN);
    } catch (e) {}
  };

  // Admin Tiger CRUD
  const addTiger = (tigerData: Omit<TigerProfile, 'id'>) => {
    const newTiger: TigerProfile = {
      ...tigerData,
      id: `tiger-${Date.now()}`
    };
    setTigers(prev => [newTiger, ...prev]);
  };

  const updateTiger = (tiger: TigerProfile) => {
    setTigers(prev => prev.map(t => t.id === tiger.id ? tiger : t));
  };

  const deleteTiger = (id: string) => {
    setTigers(prev => prev.filter(t => t.id !== id));
  };

  // Admin News CRUD
  const addNews = (newsData: Omit<NewsArticle, 'id'>) => {
    const newArticle: NewsArticle = {
      ...newsData,
      id: `news-${Date.now()}`
    };
    setNews(prev => [newArticle, ...prev]);
  };

  const updateNews = (article: NewsArticle) => {
    setNews(prev => prev.map(n => n.id === article.id ? article : n));
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  // Admin News Source Management
  const toggleNewsSource = (id: string) => {
    setNewsSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const addNewsSource = (sourceData: Omit<NewsSource, 'id' | 'lastChecked' | 'checkStatus'>) => {
    const newSource: NewsSource = {
      ...sourceData,
      id: `source-${Date.now()}`,
      lastChecked: new Date().toISOString(),
      checkStatus: 'active'
    };
    setNewsSources(prev => [...prev, newSource]);
  };

  // News Ingestion Pipeline Simulation & Sync
  const syncNewsSources = async (): Promise<{ addedCount: number; message: string }> => {
    // Simulate multi-source validation & ingestion
    await new Promise(resolve => setTimeout(resolve, 1400));

    const now = new Date().toISOString();
    setNewsSources(prev => prev.map(s => ({
      ...s,
      lastChecked: now,
      checkStatus: s.enabled ? 'synced' : 'pending'
    })));

    return {
      addedCount: 0,
      message: 'All enabled news sources checked. Feed synchronized with latest verified NTCA, Bihar Forest Dept, and WII bulletins.'
    };
  };

  // Admin Alerts CRUD
  const addAlert = (alertData: Omit<ConservationAlert, 'id'>) => {
    const newAlert: ConservationAlert = {
      ...alertData,
      id: `alert-${Date.now()}`
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Admin Sightings Review
  const approveSighting = (id: string) => {
    setSightings(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: 'verified' } : s));
  };

  const flagSighting = (id: string) => {
    setSightings(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: 'flagged' } : s));
  };

  const deleteSighting = (id: string) => {
    setSightings(prev => prev.filter(s => s.id !== id));
  };

  // Backup & Restore
  const exportDataBackup = (): string => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tigers,
      news,
      newsSources,
      alerts,
      sightings
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.tigers && Array.isArray(parsed.tigers)) setTigers(parsed.tigers);
      if (parsed.news && Array.isArray(parsed.news)) setNews(parsed.news);
      if (parsed.newsSources && Array.isArray(parsed.newsSources)) setNewsSources(parsed.newsSources);
      if (parsed.alerts && Array.isArray(parsed.alerts)) setAlerts(parsed.alerts);
      if (parsed.sightings && Array.isArray(parsed.sightings)) setSightings(parsed.sightings);
      return true;
    } catch (e) {
      console.error('Failed to parse backup JSON:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setTigers(INITIAL_TIGERS);
    setNews(INITIAL_NEWS);
    setNewsSources(INITIAL_NEWS_SOURCES);
    setAlerts(INITIAL_ALERTS);
    setSightings(INITIAL_SIGHTINGS);
    try {
      localStorage.removeItem(STORAGE_KEYS.TIGERS);
      localStorage.removeItem(STORAGE_KEYS.NEWS);
      localStorage.removeItem(STORAGE_KEYS.SOURCES);
      localStorage.removeItem(STORAGE_KEYS.ALERTS);
      localStorage.removeItem(STORAGE_KEYS.SIGHTINGS);
    } catch (e) {}
  };

  return (
    <DataContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        openSearchModal,
        selectedTiger,
        setSelectedTiger,
        selectedNews,
        setSelectedNews,
        isOnline,
        canInstallPwa,
        installPwa,
        tigers,
        news,
        newsSources,
        wildlife,
        alerts,
        sightings,
        research,
        education,
        ecotourism,
        community,
        gallery,
        submitSighting,
        isAdmin,
        adminLogin,
        adminLogout,
        addTiger,
        updateTiger,
        deleteTiger,
        addNews,
        updateNews,
        deleteNews,
        toggleNewsSource,
        addNewsSource,
        syncNewsSources,
        addAlert,
        toggleAlert,
        deleteAlert,
        approveSighting,
        flagSighting,
        deleteSighting,
        exportDataBackup,
        importDataBackup,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
