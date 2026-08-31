import React from 'react';
import { useData } from '../context/DataContext';
import { Shield, Phone, MapPin, Heart, ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { setActiveTab } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B3D2E] text-[#F5F1E6] border-t border-[#0B3D2E]/20 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Editorial Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-[#F27D26]/40 p-1 flex items-center justify-center flex-shrink-0">
                <img src="/icons/icon-192.png" alt="VTW Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white tracking-wider uppercase">VALMIKI TIGER WATCH</h3>
                <p className="text-[10px] text-[#F27D26] font-mono tracking-widest uppercase">Watch • Protect • Conserve</p>
              </div>
            </div>

            <p className="text-xs text-[#F5F1E6]/80 leading-relaxed font-sans">
              An independent conservation, scientific education, research documentation, and wildlife advocacy initiative dedicated to safeguarding the Royal Bengal Tiger and fragile Terai-Arc ecosystems of Valmiki Tiger Reserve, West Champaran, Bihar.
            </p>

            {/* Strict Non-Government Independent Notice */}
            <div className="p-3 bg-black/20 border-l-2 border-[#F27D26] rounded-r text-[11px] text-[#F5F1E6]/80 leading-normal font-sans">
              <span className="font-bold text-[#F27D26] block uppercase tracking-wider text-[10px] mb-0.5">Independent Platform Notice:</span>
              Valmiki Tiger Watch is an independent research and advocacy platform. It does not claim official representation of the Bihar Forest Department, NTCA, or Government of Bihar.
            </div>
          </div>

          {/* Quick Explore */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-4 font-bold">
              Reserve Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F1E6]/80">
              <li>
                <button onClick={() => setActiveTab('tigers')} className="hover:text-[#F27D26] transition-colors">
                  • Tigers of VTR Profiles
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('wildlife')} className="hover:text-[#F27D26] transition-colors">
                  • Biodiversity & Rare Fauna
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('project-tiger')} className="hover:text-[#F27D26] transition-colors">
                  • Tiger Project Trajectory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('conservation')} className="hover:text-[#F27D26] transition-colors">
                  • Anti-Poaching & Smart Patrolling
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-[#F27D26] transition-colors">
                  • Reserve Map & Range Beats
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ecotourism')} className="hover:text-[#F27D26] transition-colors">
                  • Responsible Safari & Eco-Tourism
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Advocacy */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-4 font-bold">
              Documentation & Science
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F1E6]/80">
              <li>
                <button onClick={() => setActiveTab('news')} className="hover:text-[#F27D26] transition-colors">
                  • Verified VTR News Feed
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('research')} className="hover:text-[#F27D26] transition-colors">
                  • Scientific Papers & NTCA Data
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('education')} className="hover:text-[#F27D26] transition-colors">
                  • Pugmark & Track Identification
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-[#F27D26] transition-colors">
                  • Tharu & Uraon Tribal Guardians
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('sightings')} className="hover:text-[#F27D26] transition-colors">
                  • Submit Wildlife Observation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('credits')} className="hover:text-[#F27D26] transition-colors">
                  • Credits & Attribution
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline & Location */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-4 font-bold">
              Emergency & Location
            </h4>

            <div className="p-3 bg-white/5 border border-red-500/30 rounded-xl text-xs space-y-2">
              <div className="flex items-center space-x-2 text-red-300 font-semibold">
                <Phone className="w-4 h-4 text-[#F27D26]" />
                <span>Wildlife Emergency Helplines</span>
              </div>
              <p className="text-[11px] text-[#F5F1E6]/70">
                To report injured wildlife, snare hazards, or forest fire emergencies:
              </p>
              <div className="font-mono text-xs text-amber-300 font-bold">
                Toll-Free: 1800-345-6188<br />
                VTR Control Cell: +91 6254 232144
              </div>
            </div>

            <div className="text-xs text-[#F5F1E6]/80 flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[#F27D26] flex-shrink-0 mt-0.5" />
              <span>Valmiki Tiger Reserve, West Champaran District, Bihar — 845107, India</span>
            </div>
          </div>
        </div>

        {/* Creator Attribution & Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#F5F1E6]/80 gap-4">
          {/* Exact Creator Credit */}
          <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-white font-medium tracking-wide shadow-sm text-center md:text-left">
            <span className="text-[#F5F1E6]/80">Created and maintained by </span>
            <span className="text-[#F27D26] font-bold text-sm">Nazish Asad</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] uppercase tracking-wider font-mono">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-[#F27D26] transition-colors"
            >
              About
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('contact')}
              className="hover:text-[#F27D26] transition-colors"
            >
              Contact
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-[#F27D26] transition-colors flex items-center space-x-1"
            >
              <Lock className="w-3 h-3 text-[#F27D26]" />
              <span>Admin</span>
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full bg-white/10 hover:bg-[#F27D26] hover:text-black text-white transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-[#F5F1E6]/50 mt-4 font-mono tracking-widest uppercase">
          Valmiki Tiger Watch • Editorial Aesthetic Edition • Standards Compliant Offline PWA
        </div>
      </div>
    </footer>
  );
};
