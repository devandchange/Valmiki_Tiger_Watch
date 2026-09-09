import React from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { MobileNavDrawer } from './MobileNavDrawer';
import { 
  ShieldAlert, 
  Download, 
  Menu, 
  X, 
  Search, 
  WifiOff, 
  Lock, 
  Layers,
  HeartHandshake,
  ShieldCheck
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
    isAdmin,
    isMobileNavOpen,
    openMobileNav,
    closeMobileNav,
    openVolunteerModal,
    openSupporterModal,
    weatherData
  } = useData();

  const { t, isRtl, language } = useLanguage();

  const activeAlertsCount = alerts.filter(a => a.active).length;

  const navItems = [
    { id: 'home', label: t('nav.home', 'Home') },
    { id: 'tiger-worldwide', label: `🐅 ${t('nav.tiger_worldwide', 'Tiger Worldwide')}` },
    { id: 'about-vtr', label: t('nav.about_vtr', 'About VTR') },
    { id: 'tigers', label: t('nav.tigers', 'Tigers of VTR') },
    { id: 'news', label: t('nav.news', 'News') },
    { id: 'research', label: t('nav.research', 'Research & Papers') },
    { id: 'wildlife', label: t('nav.wildlife', 'Wildlife') },
    { id: 'species-spotter', label: `🔭 ${t('nav.species_spotter', 'Species Spotter')}` },
    { id: 'project-tiger', label: t('nav.project_tiger', 'Project Tiger') },
    { id: 'conservation', label: t('nav.conservation', 'Conservation') },
    { id: 'map', label: t('nav.map', 'Reserve Map') },
    { id: 'ecotourism', label: t('nav.ecotourism', 'Ecotourism') },
    { id: 'travel-guide', label: t('nav.travel_guide', 'Travel Guide') },
    { id: 'weather', label: `⛅ ${t('nav.weather', 'VTR Weather')}` },
    { id: 'pledge', label: `📜 ${t('nav.pledge', 'Pledge to Protect Tigers')}` },
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
    closeMobileNav();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#0B3D2E]/20 shadow-sm w-full max-w-full overflow-hidden">
      {/* Top Utility Ribbon */}
      <div className="bg-[#0B3D2E] px-3 sm:px-6 lg:px-8 py-1.5 text-[11px] text-[#F5F1E6]/80 font-mono w-full max-w-full overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          {/* Platform Identity */}
          <div className="flex items-center justify-between sm:justify-start space-x-2 min-w-0">
            <span className="inline-flex items-center text-[#F27D26] font-semibold tracking-wider uppercase text-[10px] truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse mr-1.5 shrink-0"></span>
              <span className="truncate">{t('app.independent', 'Independent Conservation Platform')}</span>
            </span>
            <span className="hidden md:inline text-white/40">•</span>
            <span className="hidden md:inline text-[#F5F1E6]/70 truncate text-[10px]">
              {t('app.location', 'Valmiki Tiger Reserve, West Champaran, Bihar')}
            </span>
            {/* Mobile Active Advisories count badge */}
            {activeAlertsCount > 0 && (
              <button
                onClick={() => handleNavClick('alerts')}
                className="sm:hidden inline-flex items-center text-[#F27D26] hover:text-amber-300 font-bold transition-colors text-[10px] shrink-0"
              >
                <ShieldAlert className="w-3 h-3 mr-1" />
                <span>{activeAlertsCount} {activeAlertsCount > 1 ? 'Advisories' : 'Advisory'}</span>
              </button>
            )}
          </div>

          {/* Quick Actions & Language Selector */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 min-w-0">
            {/* Become a Volunteer Button */}
            <button
              onClick={openVolunteerModal}
              id="top-ribbon-volunteer-btn"
              className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              title="Join Valmiki Tiger Watch as a Volunteer"
            >
              <HeartHandshake className="w-3 h-3 mr-1 text-stone-950" />
              <span>BECOME A VOLUNTEER</span>
            </button>

            {/* Become a Supporter Button */}
            <button
              onClick={openSupporterModal}
              id="top-ribbon-supporter-btn"
              className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              title="Pledge Support for Valmiki Tiger Reserve"
            >
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-200" />
              <span>BECOME A SUPPORTER</span>
            </button>

            {/* Top Language Selector */}
            <div className="flex items-center shrink-0">
              <LanguageSelector variant="compact" />
            </div>

            {/* VTR Live Weather Quick Glance */}
            {weatherData?.current && (
              <button
                onClick={() => handleNavClick('weather')}
                className="hidden md:inline-flex items-center gap-1.5 bg-[#07271D] hover:bg-[#093527] text-stone-200 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] transition-colors shrink-0"
                title="Valmiki Tiger Reserve Weather"
              >
                <span className="text-amber-400 font-bold">{Math.round(weatherData.current.temperature)}°C</span>
                <span className="text-stone-300">
                  {language === 'hi' ? weatherData.current.condition.hi : language === 'ur' ? weatherData.current.condition.ur : weatherData.current.condition.en}
                </span>
              </button>
            )}

            {!isOnline && (
              <span className="inline-flex items-center text-[#F27D26] bg-[#07271D] px-2 py-0.5 rounded text-[10px] border border-[#F27D26]/40 shrink-0">
                <WifiOff className="w-3 h-3 mr-1" />
                {t('app.offline', 'Offline Mode')}
              </span>
            )}

            {activeAlertsCount > 0 && (
              <button
                onClick={() => handleNavClick('alerts')}
                className="hidden sm:inline-flex items-center text-[#F27D26] hover:text-amber-300 font-bold transition-colors shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                <span>{activeAlertsCount} {activeAlertsCount > 1 ? t('app.active_advisories_plural', 'Active Advisories') : t('app.active_advisories', 'Active Advisory')}</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              id="admin-auth-nav-btn"
              className="inline-flex items-center text-[10px] uppercase tracking-wider text-[#F5F1E6]/80 hover:text-[#F27D26] transition-colors shrink-0 ml-auto sm:ml-0"
              title="Administrator Portal"
            >
              <Lock className="w-3 h-3 mr-1" />
              {isAdmin ? t('app.admin_active', 'Admin Active') : t('app.admin', 'Admin')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editorial Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="flex items-center justify-between min-h-[4.5rem] py-2 gap-2">
          {/* Brand Logo & Editorial Typography */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-none min-w-0 pr-1"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform overflow-hidden bg-[#0B3D2E]">
              <img 
                src="/icons/icon-192.png" 
                alt="Valmiki Tiger Watch Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-[#0B3D2E] leading-tight uppercase font-sans truncate sm:whitespace-normal">
                {t('app.title', 'Valmiki Tiger Watch')}
              </h1>
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider sm:tracking-[0.2em] uppercase text-[#F27D26] mt-0.5 font-mono truncate">
                {t('app.tagline', 'Watch • Protect • Conserve')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-4.5 text-[11px] font-bold uppercase tracking-widest text-[#0B3D2E]/70">
            {navItems.slice(0, 8).map((item) => (
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
                {navItems.slice(8).map((item) => (
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
              onClick={() => {
                if (isMobileNavOpen) {
                  closeMobileNav();
                } else {
                  openMobileNav();
                }
              }}
              className="lg:hidden p-2 rounded-xl text-[#0B3D2E] hover:bg-[#F5F1E6] active:bg-[#e8e2d4] transition-colors relative"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              {activeAlertsCount > 0 && !isMobileNavOpen && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F27D26] animate-pulse ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Accessible Mobile Bottom-Sheet Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        onOpenAdmin={onOpenAdmin}
        onOpenInstall={handleOpenInstall}
      />
    </header>
  );
};

