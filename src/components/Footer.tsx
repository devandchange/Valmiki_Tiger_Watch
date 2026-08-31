import React from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Shield, Phone, MapPin, ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { setActiveTab } = useData();
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B3D2E] text-[#F5F1E6] border-t border-[#0B3D2E]/20 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Language Selector Banner in Footer */}
        <div className="mb-8 p-4 rounded-2xl bg-black/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <LanguageSelector variant="footer" />
          <div className="text-xs text-[#F5F1E6]/70 font-mono text-center md:text-right">
            <span>{t('app.subtitle', 'Independent Tiger Conservation & Biodiversity Platform')}</span>
          </div>
        </div>

        {/* Main Editorial Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-[#F27D26]/40 p-1 flex items-center justify-center flex-shrink-0">
                <img src="/icons/icon-192.png" alt="VTW Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white tracking-wider uppercase">
                  {t('app.title', 'VALMIKI TIGER WATCH')}
                </h3>
                <p className="text-[10px] text-[#F27D26] font-mono tracking-widest uppercase">
                  {t('app.tagline', 'Watch • Protect • Conserve')}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#F5F1E6]/80 leading-relaxed font-sans">
              {t('home.hero_desc', 'An independent conservation, scientific education, research documentation, and wildlife advocacy initiative dedicated to safeguarding the Royal Bengal Tiger and fragile Terai-Arc ecosystems of Valmiki Tiger Reserve, West Champaran, Bihar.')}
            </p>

            {/* Strict Non-Government Independent Notice */}
            <div className="p-3 bg-black/20 border-l-2 border-[#F27D26] rounded-r text-[11px] text-[#F5F1E6]/80 leading-normal font-sans">
              <span className="font-bold text-[#F27D26] block uppercase tracking-wider text-[10px] mb-0.5">
                {language === 'hi' ? 'स्वतंत्र मंच सूचना:' : language === 'ur' ? 'آزاد پلیٹ فارم انتباہ:' : 'Independent Platform Notice:'}
              </span>
              {t('footer.disclaimer', 'Valmiki Tiger Watch is an independent conservation awareness resource. All wildlife data adheres to ethical non-disclosure protocols for tiger security.')}
            </div>
          </div>

          {/* Quick Explore */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-4 font-bold">
              {language === 'hi' ? 'प्रमुख मॉड्यूल' : language === 'ur' ? 'اہم شعبے' : 'Reserve Modules'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F1E6]/80">
              <li>
                <button onClick={() => setActiveTab('tigers')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.tigers', 'Tigers of VTR Profiles')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('wildlife')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.wildlife', 'Biodiversity & Rare Fauna')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('project-tiger')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.project_tiger', 'Tiger Project Trajectory')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('conservation')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.conservation', 'Anti-Poaching & Smart Patrolling')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.map', 'Reserve Map & Range Beats')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ecotourism')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.ecotourism', 'Responsible Safari & Eco-Tourism')}
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Advocacy */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-4 font-bold">
              {language === 'hi' ? 'दस्तावेज़ीकरण एवं शोध' : language === 'ur' ? 'تحقیقات و سائنسی دستاویز' : 'Documentation & Science'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F1E6]/80">
              <li>
                <button onClick={() => setActiveTab('news')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.news', 'Verified VTR News Feed')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('research')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.research', 'Scientific Papers & NTCA Data')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('education')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.education', 'Pugmark & Track Identification')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.community', 'Tharu & Uraon Tribal Guardians')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('sightings')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.sightings', 'Submit Wildlife Observation')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('credits')} className="hover:text-[#F27D26] transition-colors">
                  • {t('nav.credits', 'Credits & Attribution')}
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline & Location */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-4 font-bold">
              {language === 'hi' ? 'आपातकालीन संपर्क एवं पता' : language === 'ur' ? 'ہنگامی رابطہ اور پتہ' : 'Emergency & Location'}
            </h4>

            <div className="p-3 bg-white/5 border border-red-500/30 rounded-xl text-xs space-y-2">
              <div className="flex items-center space-x-2 text-red-300 font-semibold">
                <Phone className="w-4 h-4 text-[#F27D26]" />
                <span>{language === 'hi' ? 'वन्यजीव आपातकालीन हेल्पलाइन' : language === 'ur' ? 'ہنگامی وائلڈ لائف ہیلپ لائن' : 'Wildlife Emergency Helplines'}</span>
              </div>
              <p className="text-[11px] text-[#F5F1E6]/70">
                {language === 'hi' 
                  ? 'घायल वन्यजीव, फंदा या वनाग्नि की तत्काल सूचना देने हेतु:' 
                  : language === 'ur' 
                  ? 'زخمی جنگلی جانور، شکاری پھندے یا آگ کی فوری اطلاع کے لیے:' 
                  : 'To report injured wildlife, snare hazards, or forest fire emergencies:'}
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
          <button 
            onClick={() => setActiveTab('credits')}
            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white font-medium tracking-wide shadow-sm text-center md:text-left transition-colors cursor-pointer group flex items-center space-x-1.5"
          >
            <span className="text-[#F5F1E6]/80">
              {language === 'hi'
                ? 'निर्माता एवं अनुरक्षक: '
                : language === 'ur'
                ? 'تخلیق اور نگہداشت: '
                : 'Created and maintained by '}
            </span>
            <span className="text-[#F27D26] font-bold text-sm group-hover:underline">
              {language === 'hi' ? 'नाज़िश असद' : language === 'ur' ? 'نازش اسد' : 'Nazish Asad'}
            </span>
          </button>

          <div className="flex items-center space-x-4 text-[11px] uppercase tracking-wider font-mono">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-[#F27D26] transition-colors"
            >
              {t('nav.about', 'About')}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('contact')}
              className="hover:text-[#F27D26] transition-colors"
            >
              {t('nav.contact', 'Contact')}
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-[#F27D26] transition-colors flex items-center space-x-1"
            >
              <Lock className="w-3 h-3 text-[#F27D26]" />
              <span>{t('app.admin', 'Admin')}</span>
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
          Valmiki Tiger Watch • English • हिन्दी • اردو • PWA Edition
        </div>
      </div>
    </footer>
  );
};
