import React, { useState } from 'react';
import { OFFICIAL_SIGHTSEEING_ATTRACTIONS, OFFICIAL_GOVERNMENT_PORTALS } from '../../data/tigerWorldwideData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, 
  Compass, 
  ExternalLink, 
  Clock, 
  Info, 
  CheckCircle2, 
  Trees, 
  Camera, 
  Mountain, 
  Waves,
  Shield
} from 'lucide-react';

export const SightseeingSection: React.FC = () => {
  const { language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'safari' | 'river' | 'temple' | 'heritage'>('all');

  const filteredAttractions = OFFICIAL_SIGHTSEEING_ATTRACTIONS.filter(attr => {
    if (selectedFilter === 'all') return true;
    return attr.category === selectedFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Editorial Header */}
      <section className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono font-bold">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'hi' ? 'वाल्मीकि दर्शनीय स्थल एवं ईको-टूरिज्म' : language === 'ur' ? 'اہم سیاحتی مقامات' : 'VTR Sightseeing & Natural Attractions'}
            </span>
          </div>
          <span className="text-emerald-300/60 text-xs font-mono hidden sm:inline">•</span>
          <span className="text-emerald-200/80 text-xs font-mono">
            {language === 'hi' ? 'सफारी परिपथ • त्रिवेणी संगम • सोमेश्वर किला' : language === 'ur' ? 'سفاری، ندی اور تاریخی قلعہ' : 'Safaris • Triveni Confluence • Someshwar Fort'}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          📍 {language === 'hi' ? 'वाल्मीकि के प्रमुख दर्शनीय स्थल एवं अनुभव' : language === 'ur' ? 'والمیکی کے اہم مقامات اور سیاحتی سرگرمیاں' : 'Sightseeing Attractions & Experiences'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर रिजर्व के सभी प्रमुख प्राकृतिक, ऐतिहासिक एवं धार्मिक पर्यटन स्थलों की प्रमाणित जानकारी। गंडक बराज, जटाशंकर प्राचीन मंदिर, कालेश्वर धाम, एवं सोमेश्वर शिखर पदयात्रा।'
            : language === 'ur'
            ? 'والمیکی کے مشہور مقامات، گنڈک براج، تروینی سنگم اور قدیم مندروں کی تصدیق شدہ تفصیلات۔'
            : 'Official guide to premier natural landmarks, historic hill forts, and river confluences across the reserve. All visitor rules are governed strictly by the Bihar Department of Environment, Forest & Climate Change.'}
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Attractions' },
          { id: 'safari', label: 'Wildlife Safaris & Parks' },
          { id: 'river', label: 'River Confluence & Boating' },
          { id: 'temple', label: 'Ancient Forest Temples' },
          { id: 'heritage', label: 'High-Ridge Forts & Treks' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
              selectedFilter === tab.id
                ? 'bg-[#0B3D2E] text-amber-300 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((attr) => (
          <div
            key={attr.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#0B3D2E]/15 shadow-sm flex flex-col justify-between hover:border-[#0B3D2E] transition-all"
          >
            <div>
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                <img
                  src={attr.photoUrl}
                  alt={attr.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#0B3D2E] text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase">
                  {attr.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {attr.distanceFromValmikinagar}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-serif text-xl font-bold text-[#0B3D2E]">
                  {attr.name}
                </h3>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {attr.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs font-mono text-stone-600">
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#F27D26] flex-shrink-0 mt-0.5" />
                    <span><strong>Timings:</strong> {attr.timings}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#0B3D2E] flex-shrink-0 mt-0.5" />
                    <span><strong>Permits:</strong> {attr.entryPermit}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-500 flex items-center justify-between">
                <span>Source: {attr.officialSource.substring(0, 30)}...</span>
                <span className="text-[#0B3D2E] font-bold">VTR Ecotourism</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 15: OFFICIAL TOURIST WEBSITES & LINKS */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B3D2E]/15 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest block">
            Government Portals & Official Links
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#0B3D2E]">
            Official Tourist Websites & Portals
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          For verified permit bookings, official state tariffs, ecotourism cottages, and statutory wildlife guidelines, consult these authorized portals directly:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_GOVERNMENT_PORTALS.map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#F5F1E6]/70 hover:bg-[#0B3D2E] hover:text-white rounded-2xl border border-[#0B3D2E]/10 flex justify-between items-center group transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#F27D26] group-hover:text-amber-300 font-bold uppercase block">
                  {portal.category}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#0B3D2E] group-hover:text-white">
                  {portal.name}
                </h4>
                <p className="text-[11px] text-stone-600 group-hover:text-emerald-100 font-mono">
                  {portal.role}
                </p>
              </div>
              <div className="p-2 bg-white group-hover:bg-white/20 rounded-xl text-[#0B3D2E] group-hover:text-white flex-shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
