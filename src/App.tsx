/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InstallPrompt } from './components/InstallPrompt';
import { AdminModal } from './components/AdminModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Section Views
import { HomeSection } from './components/sections/HomeSection';
import { AboutVTRSection } from './components/sections/AboutVTRSection';
import { TigersSection } from './components/sections/TigersSection';
import { WildlifeSection } from './components/sections/WildlifeSection';
import { ProjectTigerSection } from './components/sections/ProjectTigerSection';
import { ConservationSection } from './components/sections/ConservationSection';
import { NewsSection } from './components/sections/NewsSection';
import { ResearchSection } from './components/sections/ResearchSection';
import { EducationSection } from './components/sections/EducationSection';
import { EcotourismSection } from './components/sections/EcotourismSection';
import { CommunitySection } from './components/sections/CommunitySection';
import { SightingsSection } from './components/sections/SightingsSection';
import { AlertsSection } from './components/sections/AlertsSection';
import { GallerySection } from './components/sections/GallerySection';
import { MapSection } from './components/sections/MapSection';
import { AboutSection } from './components/sections/AboutSection';
import { CreditsSection } from './components/sections/CreditsSection';
import { ContactSection } from './components/sections/ContactSection';

export default function App() {
  const { activeTab, setActiveTab } = useData();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const renderSection = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection onOpenInstallGuide={() => setIsInstallOpen(true)} />;
      case 'about-vtr':
        return <AboutVTRSection />;
      case 'tigers':
        return <TigersSection />;
      case 'wildlife':
        return <WildlifeSection />;
      case 'project-tiger':
        return <ProjectTigerSection />;
      case 'conservation':
        return <ConservationSection />;
      case 'news':
        return <NewsSection />;
      case 'research':
        return <ResearchSection />;
      case 'education':
        return <EducationSection />;
      case 'ecotourism':
        return <EcotourismSection />;
      case 'community':
        return <CommunitySection />;
      case 'sightings':
        return <SightingsSection />;
      case 'alerts':
        return <AlertsSection />;
      case 'gallery':
        return <GallerySection />;
      case 'map':
        return <MapSection />;
      case 'about':
        return <AboutSection />;
      case 'credits':
        return <CreditsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HomeSection onOpenInstallGuide={() => setIsInstallOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-amber-400 selection:text-black">
      {/* Top Navigation */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} onOpenInstall={() => setIsInstallOpen(true)} />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderSection()}
      </main>

      {/* Global Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* PWA Install Modal */}
      <InstallPrompt isOpen={isInstallOpen} onClose={() => setIsInstallOpen(false)} />

      {/* Admin Protected Dashboard Modal */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Global Search Component Modal (⌘K / Ctrl+K) */}
      <GlobalSearchModal />
    </div>
  );
}

