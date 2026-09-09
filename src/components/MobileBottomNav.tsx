import React from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, Footprints, MapPin, Search, Menu, ShieldAlert } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab, openSearchModal, alerts } = useData();
  const { t } = useLanguage();

  const activeAlertsCount = alerts.filter(a => a.active).length;

  const navButtons = [
    {
      id: 'home',
      label: t('nav.home', 'Home'),
      icon: Home,
      onClick: () => setActiveTab('home'),
      isActive: activeTab === 'home'
    },
    {
      id: 'tigers',
      label: t('nav.tigers_short', 'Tigers'),
      icon: Footprints,
      onClick: () => setActiveTab('tigers'),
      isActive: activeTab === 'tigers'
    },
    {
      id: 'map',
      label: t('nav.map_short', 'Map'),
      icon: MapPin,
      onClick: () => setActiveTab('map'),
      isActive: activeTab === 'map'
    },
    {
      id: 'search',
      label: t('app.search_short', 'Search'),
      icon: Search,
      onClick: () => openSearchModal(),
      isActive: false
    },
    {
      id: 'menu',
      label: t('nav.menu_short', 'Menu'),
      icon: Menu,
      onClick: onOpenMenu,
      isActive: false,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null
    }
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#0B3D2E]/15 shadow-lg px-1 sm:px-3 py-1 safe-area-pb w-full max-w-full overflow-hidden"
      aria-label="Mobile Navigation"
      id="mobile-bottom-dock-nav"
    >
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.id}
              id={`mobile-dock-${btn.id}`}
              onClick={btn.onClick}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 sm:px-2 min-h-[44px] max-w-[76px] rounded-xl transition-all ${
                btn.isActive
                  ? 'text-[#0B3D2E] font-bold'
                  : 'text-stone-500 hover:text-stone-900 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${btn.isActive ? 'scale-110 text-[#0B3D2E]' : ''}`} />
                {btn.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F27D26] text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center border border-white">
                    {btn.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-full ${btn.isActive ? 'text-[#0B3D2E] font-bold' : ''}`}>
                {btn.label}
              </span>
              {btn.isActive && (
                <span className="w-1 h-1 rounded-full bg-[#F27D26] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
