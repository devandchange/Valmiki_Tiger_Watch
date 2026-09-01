import React, { useState } from 'react';
import { HOW_TO_REACH_DATA } from '../../data/tigerWorldwideData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Compass, 
  MapPin, 
  Car, 
  Train, 
  Plane, 
  Calendar, 
  Sun, 
  CloudRain, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';

export const TravelGuideSection: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'how-to-reach' | 'best-time' | 'safari-timings'>('how-to-reach');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Flagship Header */}
      <section className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono font-bold">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'hi' ? 'वाल्मीकि टाइगर रिजर्व यात्रा एवं मौसम संदर्शिका' : language === 'ur' ? 'سیاحتی و سفری گائیڈ' : 'VTR Official Travel & Season Guide'}
            </span>
          </div>
          <span className="text-emerald-300/60 text-xs font-mono hidden sm:inline">•</span>
          <span className="text-emerald-200/80 text-xs font-mono">
            {language === 'hi' ? 'सड़क, रेल एवं हवाई मार्ग • सफारी समय' : language === 'ur' ? 'راستے اور سفاری کے اوقات' : 'Transit Routes • Safari Windows • Seasonal Cycles'}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          🧭 {language === 'hi' ? 'वाल्मीकि कैसे पहुंचें एवं उत्तम यात्रा समय' : language === 'ur' ? 'والمیکی کیسے پہنچیں اور بہترین وقت' : 'How to Reach & Best Time to Visit'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'पश्चिम चंपारण के वाल्मीकिनगर मुख्य द्वार तक पहुंचने के सभी प्रमाणित मार्ग (हवाई अड्डा, रेलवे स्टेशन, राजमार्ग) तथा मौसम अनुसार सफारी संचालन की विस्तृत जानकारी।'
            : language === 'ur'
            ? 'والمیکی ٹائیگر ریزرو تک پہنچنے کے تمام تصدیق شدہ راستے اور موزوں ترین سفاری کے سیزن۔'
            : 'Comprehensive logistical intelligence covering road corridors, railway junctions (Bagaha, Narkatiaganj), airports (Gorakhpur, Patna), best wildlife viewing seasons, and official park regulations.'}
        </p>

        {/* Official Sighting Disclaimer */}
        <div className="bg-[#07271D]/90 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/95 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong>Official Wildlife Sightings Disclaimer:</strong> Wild tigers roam freely across 899 sq km of natural forest and dense cane breaks. Tiger sightings are never guaranteed. Every safari offers an opportunity to appreciate the pristine biodiversity and rich ecosystem of the reserve.
          </p>
        </div>
      </section>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'how-to-reach', label: '🚗 How to Reach (Transit Routes)', icon: Car },
          { id: 'best-time', label: '📅 Best Time to Visit & Weather', icon: Calendar },
          { id: 'safari-timings', label: '🕒 Safari Timings & Entry Zones', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#0B3D2E] text-amber-300 shadow'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HOW TO REACH */}
      {activeTab === 'how-to-reach' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {HOW_TO_REACH_DATA.map((transit, idx) => {
              const Icon = transit.mode === 'rail' ? Train : transit.mode === 'air' ? Plane : Car;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[#0B3D2E]/15 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#0B3D2E] text-amber-300 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#F27D26] font-bold">Transit Mode</span>
                        <h3 className="font-serif text-lg font-bold text-[#0B3D2E]">{transit.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {transit.routes.map((route, rIdx) => (
                        <div key={rIdx} className="p-3.5 bg-[#F5F1E6]/70 rounded-xl space-y-1 text-xs">
                          <div className="font-bold text-[#0B3D2E] flex justify-between">
                            <span>{route.origin}</span>
                            <span className="text-[#F27D26] font-mono">{route.distance}</span>
                          </div>
                          <div className="text-[11px] font-mono text-stone-500">Duration: {route.duration}</div>
                          <p className="text-stone-700 leading-relaxed text-[11px] pt-1">{route.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] font-mono text-stone-500">
                    <div className="font-bold text-stone-700">Nearest Key Hubs:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {transit.nearestPoints.map((pt, pIdx) => (
                        <span key={pIdx} className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 text-[10px]">
                          {pt.name} ({pt.distance})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BEST TIME TO VISIT */}
      {activeTab === 'best-time' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                Seasonal Climate & Wildlife Viewing Calendar
              </h3>
              <p className="text-xs text-stone-600 font-mono mt-1">
                Recommended Visiting Window: November through April
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">Peak Season</span>
                  <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Highly Recommended</span>
                </div>
                <h4 className="font-serif font-bold text-base text-emerald-950">
                  Winter (November to February)
                </h4>
                <div className="text-xs font-mono text-emerald-800">Temperature: 7°C to 24°C</div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  Pleasant, crisp weather with morning mist. Ideal for forest safaris, Gandak river boating, trekking to Someshwar Fort, and observing migratory birds from Siberia and Central Asia.
                </p>
              </div>

              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-amber-800 font-bold">Wildlife Prime</span>
                  <span className="text-xs bg-amber-600 text-white font-bold px-2 py-0.5 rounded">Good Waterhole Activity</span>
                </div>
                <h4 className="font-serif font-bold text-base text-amber-950">
                  Spring & Early Summer (March to June)
                </h4>
                <div className="text-xs font-mono text-amber-800">Temperature: 22°C to 38°C</div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Dry foliage and shrinking water sources concentrate large herbivores and carnivores around perennial waterholes and riverbanks. Excellent for serious wildlife photographers.
                </p>
              </div>

              <div className="p-5 bg-red-50 rounded-2xl border border-red-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-red-800 font-bold">Park Closed</span>
                  <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">Monsoon Breeding</span>
                </div>
                <h4 className="font-serif font-bold text-base text-red-950">
                  Monsoon (July 1 to October 15)
                </h4>
                <div className="text-xs font-mono text-red-800">Heavy Rainfall & River Inundation</div>
                <p className="text-xs text-red-900/90 leading-relaxed">
                  All core and buffer safari routes remain closed to visitors by official mandate of the Bihar Forest Department to ensure undisturbed breeding of wildlife and road safety during Gandak floods.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAFARI TIMINGS & ZONES */}
      {activeTab === 'safari-timings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
              Daily Safari Shifts & Range Gates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#F5F1E6]/80 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">
                  🌅 Morning Safari Shift
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 font-mono">
                  <li><strong>Winter (Nov–Feb):</strong> 06:30 AM – 09:30 AM</li>
                  <li><strong>Summer (Mar–Jun):</strong> 06:00 AM – 09:00 AM</li>
                  <li><strong>Gate Reporting Time:</strong> 30 minutes prior to shift</li>
                </ul>
              </div>

              <div className="p-5 bg-[#F5F1E6]/80 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">
                  🌇 Afternoon Safari Shift
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 font-mono">
                  <li><strong>Winter (Nov–Feb):</strong> 02:00 PM – 05:00 PM</li>
                  <li><strong>Summer (Mar–Jun):</strong> 02:30 PM – 05:30 PM</li>
                  <li><strong>Gate Closing:</strong> Strict curfew at sunset</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>Book registered Gypsy safaris and eco-cottages via the official Bihar Tourism portal.</span>
              </div>
              <a
                href="https://tourism.bihar.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#0B3D2E] text-white rounded-lg font-mono font-bold flex items-center gap-1 flex-shrink-0 hover:bg-[#145A43]"
              >
                <span>Book on BSTDC</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
