import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  ShieldAlert, 
  Download, 
  Menu, 
  X, 
  Search, 
  WifiOff, 
  Lock, 
  Layers
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenInstallGuide?: () => void;
  onOpenInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenInstallGuide, onOpenInstall }) => {
  const handleOpenInstall = onOpenInstallGuide || onOpenInstall || (() => {});
  const { 
    activeTab, 
    setActiveTab, 
    isOnline, 
    canInstallPwa, 
    installPwa, 
    alerts,
    openSearchModal,
    isAdmin
  } = useData();

  const { t, isRtl } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.active).length;

  const navItems = [
    { id: 'home', label: t('nav.home', 'Home') },
    { id: 'tiger-worldwide', label: `🐅 ${t('nav.tiger_worldwide', 'Tiger Worldwide')}` },
    { id: 'about-vtr', label: t('nav.about_vtr', 'About VTR') },
    { id: 'tigers', label: t('nav.tigers', 'Tigers of VTR') },
    { id: 'news', label: t('nav.news', 'News') },
    { id: 'wildlife', label: t('nav.wildlife', 'Wildlife') },
    { id: 'species-spotter', label: `🔭 ${t('nav.species_spotter', 'Species Spotter')}` },
    { id: 'project-tiger', label: t('nav.project_tiger', 'Project Tiger') },
    { id: 'conservation', label: t('nav.conservation', 'Conservation') },
    { id: 'map', label: t('nav.map', 'Reserve Map') },
    { id: 'ecotourism', label: t('nav.ecotourism', 'Ecotourism') },
    { id: 'travel-guide', label: t('nav.travel_guide', 'Travel Guide') },
    { id: 'sightseeing', label: t('nav.sightseeing', 'Sightseeing') },
    { id: 'cuisine', label: t('nav.cuisine', 'Local Cuisine') },
    { id: 'community', label: t('nav.community', 'Community') },
    { id: 'sightings', label: t('nav.sightings', 'Sightings') },
    { id: 'education', label: t('nav.education', 'Education') },
    { id: 'gallery', label: t('nav.gallery', 'Gallery') },
    { id: 'credits', label: t('nav.credits', 'Credits') },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#0B3D2E]/20 shadow-sm">
      {/* Top Utility Ribbon */}
      <div className="bg-[#0B3D2E] px-4 sm:px-8 py-1.5 text-[11px] flex flex-wrap justify-between items-center text-[#F5F1E6]/80 font-mono gap-2">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-[#F27D26] font-semibold tracking-wider uppercase text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse mr-1.5"></span>
            {t('app.independent', 'Independent Conservation Platform')}
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline text-[#F5F1E6]/70">{t('app.location', 'Valmiki Tiger Reserve, West Champaran, Bihar')}</span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Top Language Selector */}
          <div className="flex items-center">
            <LanguageSelector variant="compact" />
          </div>

          {!isOnline && (
            <span className="inline-flex items-center text-[#F27D26] bg-[#07271D] px-2 py-0.5 rounded text-[10px] border border-[#F27D26]/40">
              <WifiOff className="w-3 h-3 mr-1" />
              {t('app.offline', 'Offline Mode')}
            </span>
          )}

          {activeAlertsCount > 0 && (
            <button
              onClick={() => handleNavClick('alerts')}
              className="inline-flex items-center text-[#F27D26] hover:text-amber-300 font-bold transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              <span>{activeAlertsCount} {activeAlertsCount > 1 ? t('app.active_advisories_plural', 'Active Advisories') : t('app.active_advisories', 'Active Advisory')}</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            id="admin-auth-nav-btn"
            className="inline-flex items-center text-[10px] uppercase tracking-wider text-[#F5F1E6]/80 hover:text-[#F27D26] transition-colors"
            title="Administrator Portal"
          >
            <Lock className="w-3 h-3 mr-1" />
            {isAdmin ? t('app.admin_active', 'Admin Active') : t('app.admin', 'Admin')}
          </button>
        </div>
      </div>

      {/* Main Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Editorial Typography */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform overflow-hidden bg-[#0B3D2E]">
              <img 
                src="/icons/icon-192.png" 
                alt="Valmiki Tiger Watch Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-[#0B3D2E] leading-none uppercase font-sans">
                {t('app.title', 'Valmiki Tiger Watch')}
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#F27D26] mt-1 font-mono">
                {t('app.tagline', 'Watch • Protect • Conserve')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-[11px] font-bold uppercase tracking-widest text-[#0B3D2E]/70">
            {navItems.slice(0, 7).map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`pb-1 transition-all whitespace-nowrap ${
                  activeTab === item.id
                    ? 'text-[#F27D26] border-b-2 border-[#F27D26]'
                    : 'hover:text-[#0B3D2E]'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Dropdown for more tabs */}
            <div className="relative group">
              <button className="pb-1 hover:text-[#0B3D2E] flex items-center gap-1">
                <span>{t('nav.more', 'More')}</span>
                <Layers className="w-3.5 h-3.5" />
              </button>
              <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-56 bg-white border border-[#0B3D2E]/15 rounded-xl shadow-xl py-2 hidden group-hover:block z-50`}>
                {navItems.slice(7).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#F5F1E6] text-[#F27D26]'
                        : 'text-[#0B3D2E]/80 hover:bg-[#F5F1E6] hover:text-[#0B3D2E]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-[#0B3D2E]/10 my-1"></div>
                <button
                  onClick={() => handleNavClick('alerts')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F27D26] hover:bg-[#F5F1E6] flex items-center justify-between"
                >
                  <span>{t('nav.alerts', 'Advisories & Alerts')}</span>
                  {activeAlertsCount > 0 && (
                    <span className="bg-[#F27D26] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('research')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E]/80 hover:bg-[#F5F1E6]"
                >
                  {t('nav.research', 'Research Papers')}
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E]/80 hover:bg-[#F5F1E6]"
                >
                  {t('nav.about', 'About Platform')}
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E]/80 hover:bg-[#F5F1E6]"
                >
                  {t('nav.contact', 'Contact & Hotlines')}
                </button>
              </div>
            </div>
          </nav>

          {/* Right Action Icons & Install Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Header Language Selector for quick access */}
            <div className="hidden sm:block">
              <LanguageSelector variant="header" />
            </div>

            {/* Global Search Bar & Trigger */}
            <div className="relative">
              <button
                onClick={() => openSearchModal()}
                className="flex items-center bg-[#F5F1E6] hover:bg-[#eae4d5] border border-[#0B3D2E]/25 rounded-full px-3 py-1.5 text-xs text-[#0B3D2E] transition-all group shadow-xs"
                title="Global Search (⌘K / Ctrl+K)"
                id="global-search-header-btn"
              >
                <Search className="w-3.5 h-3.5 text-[#0B3D2E] group-hover:text-[#F27D26] transition-colors mr-1.5" />
                <span className="hidden md:inline text-[11px] font-medium text-stone-600 mr-2">
                  {t('app.search_placeholder', 'Search VTR...')}
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-600 border border-stone-300/60 font-semibold">
                  ⌘K
                </span>
              </button>
            </div>

            {/* Editorial Install App Button */}
            {canInstallPwa ? (
              <button
                onClick={installPwa}
                id="pwa-install-header-btn"
                className="bg-[#0B3D2E] hover:bg-[#07271D] text-white px-4 sm:px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                title="Install Valmiki Tiger Watch"
              >
                <Download className="w-3.5 h-3.5 text-[#F27D26]" />
                <span className="hidden xs:inline">{t('app.install', 'Install App')}</span>
              </button>
            ) : (
              <button
                onClick={handleOpenInstall}
                className="bg-[#0B3D2E] hover:bg-[#07271D] text-white px-3 sm:px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all hidden sm:flex items-center gap-1.5"
                title="PWA App Info"
              >
                <Download className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>{t('app.install', 'Install App')}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#0B3D2E] hover:bg-[#F5F1E6] transition-colors"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#0B3D2E]/10 px-4 pt-3 pb-6 space-y-4">
          {/* Mobile Language Switcher */}
          <div className="bg-[#F5F1E6] p-2.5 rounded-xl border border-[#0B3D2E]/15 flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B3D2E]">{t('lang.select', 'Language')}:</span>
            <LanguageSelector variant="header" />
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openSearchModal();
            }}
            className="w-full flex items-center justify-between bg-[#F5F1E6] hover:bg-[#eae4d5] border border-[#0B3D2E]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#0B3D2E] transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#0B3D2E]" />
              <span className="font-medium text-stone-600">
                {t('search.input_placeholder', 'Search tigers, news, guides...')}
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200 text-stone-600 font-bold">
              SEARCH
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-lg transition-colors font-bold uppercase tracking-wider text-[11px] ${
                  activeTab === item.id
                    ? 'bg-[#0B3D2E] text-[#F27D26]'
                    : 'text-[#0B3D2E]/80 hover:bg-[#F5F1E6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#0B3D2E]/10 flex flex-wrap gap-2 justify-between items-center text-xs">
            <button
              onClick={() => handleNavClick('alerts')}
              className="text-[#F27D26] font-bold flex items-center space-x-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t('nav.alerts', 'Advisories')} ({activeAlertsCount})</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="text-[#0B3D2E] font-semibold flex items-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>{t('app.admin', 'Admin Console')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

