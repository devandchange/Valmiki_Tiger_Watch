import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ShieldAlert, 
  Download, 
  Menu, 
  X, 
  Search, 
  WifiOff, 
  Lock, 
  Layers, 
  Compass, 
  Eye, 
  Newspaper, 
  HelpCircle 
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenInstallGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenInstallGuide }) => {
  const { 
    activeTab, 
    setActiveTab, 
    isOnline, 
    canInstallPwa, 
    installPwa, 
    alerts,
    searchQuery,
    setSearchQuery,
    isAdmin
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.active).length;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tigers', label: 'Tigers of VTR' },
    { id: 'news', label: 'News' },
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'project-tiger', label: 'Project Tiger' },
    { id: 'conservation', label: 'Conservation' },
    { id: 'map', label: 'Reserve Map' },
    { id: 'ecotourism', label: 'Ecotourism' },
    { id: 'community', label: 'Community' },
    { id: 'sightings', label: 'Sightings' },
    { id: 'education', label: 'Education' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'credits', label: 'Credits' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#0B3D2E]/20 shadow-sm">
      {/* Top Utility Ribbon */}
      <div className="bg-[#0B3D2E] px-4 sm:px-8 py-1.5 text-[11px] flex justify-between items-center text-[#F5F1E6]/80 font-mono">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-[#F27D26] font-semibold tracking-wider uppercase text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse mr-1.5"></span>
            Independent Conservation Platform
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline text-[#F5F1E6]/70">Valmiki Tiger Reserve, West Champaran, Bihar</span>
        </div>

        <div className="flex items-center space-x-4">
          {!isOnline && (
            <span className="inline-flex items-center text-[#F27D26] bg-[#07271D] px-2 py-0.5 rounded text-[10px] border border-[#F27D26]/40">
              <WifiOff className="w-3 h-3 mr-1" />
              Offline Mode
            </span>
          )}

          {activeAlertsCount > 0 && (
            <button
              onClick={() => handleNavClick('alerts')}
              className="inline-flex items-center text-[#F27D26] hover:text-amber-300 font-bold transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              <span>{activeAlertsCount} Active Advisory</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            id="admin-auth-nav-btn"
            className="inline-flex items-center text-[10px] uppercase tracking-wider text-[#F5F1E6]/80 hover:text-[#F27D26] transition-colors"
            title="Administrator Portal"
          >
            <Lock className="w-3 h-3 mr-1" />
            {isAdmin ? 'Admin Active' : 'Admin'}
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
            <div className="w-11 h-11 bg-[#0B3D2E] rounded-full flex items-center justify-center text-[#F27D26] flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src="/icons/icon-192.png" 
                alt="Valmiki Tiger Watch Logo" 
                className="w-8 h-8 object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-[#0B3D2E] leading-none uppercase font-sans">
                Valmiki Tiger Watch
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#F27D26] mt-1 font-mono">
                Watch • Protect • Conserve
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-[#0B3D2E]/70">
            {navItems.slice(0, 7).map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`pb-1 transition-all ${
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
                <span>More</span>
                <Layers className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#0B3D2E]/15 rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
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
                  <span>Advisories</span>
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
                  Research Papers
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E]/80 hover:bg-[#F5F1E6]"
                >
                  About Platform
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E]/80 hover:bg-[#F5F1E6]"
                >
                  Contact & Hotlines
                </button>
              </div>
            </div>
          </nav>

          {/* Right Action Icons & Install Button */}
          <div className="flex items-center space-x-3">
            {/* Search Bar Trigger */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-[#F5F1E6] border border-[#0B3D2E]/30 rounded-full px-3 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-[#0B3D2E] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search database..."
                    className="bg-transparent text-[#1A1A1A] placeholder-[#0B3D2E]/50 focus:outline-none w-32 sm:w-44 text-xs font-sans"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="text-[#0B3D2E]/60 hover:text-[#0B3D2E] ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full text-[#0B3D2E]/70 hover:text-[#0B3D2E] hover:bg-[#F5F1E6] transition-colors"
                  title="Search Database"
                  id="search-toggle-btn"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Editorial Install App Button */}
            {canInstallPwa ? (
              <button
                onClick={installPwa}
                id="pwa-install-header-btn"
                className="bg-[#0B3D2E] hover:bg-[#07271D] text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                title="Install Valmiki Tiger Watch"
              >
                <Download className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>Install App</span>
              </button>
            ) : (
              <button
                onClick={onOpenInstallGuide}
                className="bg-[#0B3D2E] hover:bg-[#07271D] text-white px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all hidden sm:flex items-center gap-1.5"
                title="PWA App Info"
              >
                <Download className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>Install App</span>
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
        <div className="lg:hidden bg-white border-t border-[#0B3D2E]/10 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center bg-[#F5F1E6] border border-[#0B3D2E]/20 rounded-full px-3 py-2">
            <Search className="w-4 h-4 text-[#0B3D2E] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tigers, species, news..."
              className="bg-transparent text-[#1A1A1A] placeholder-[#0B3D2E]/50 focus:outline-none w-full text-xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#0B3D2E]/60">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

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
              <span>Advisories ({activeAlertsCount})</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="text-[#0B3D2E] font-semibold flex items-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
