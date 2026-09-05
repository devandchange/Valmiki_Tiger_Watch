import React, { useState } from 'react';
import { HOW_TO_REACH_DATA } from '../../data/tigerWorldwideData';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
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
  CheckCircle2,
  Utensils,
  Trees,
  ShieldAlert,
  FileText,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export const TravelGuideSection: React.FC = () => {
  const { language } = useLanguage();
  const { setActiveTab: setGlobalActiveTab } = useData();
  const [activeTab, setActiveTab] = useState<
    'how-to-reach' | 'best-time' | 'safari-timings' | 'rules-regulations' | 'local-cuisine' | 'flora-fauna'
  >('how-to-reach');

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
          { id: 'how-to-reach', label: '🚗 How to Reach', icon: Car },
          { id: 'best-time', label: '📅 Best Time to Visit', icon: Calendar },
          { id: 'safari-timings', label: '🕒 Safari Timings & Gates', icon: Clock },
          { id: 'rules-regulations', label: '⚖️ Rules & Regulations', icon: ShieldAlert },
          { id: 'local-cuisine', label: '🍲 Local Cuisine Highlights', icon: Utensils },
          { id: 'flora-fauna', label: '🌿 Flora & Fauna Highlights', icon: Trees }
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

      {/* TAB 4: RULES & REGULATIONS */}
      {activeTab === 'rules-regulations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-red-700 uppercase font-bold tracking-widest block">
                  Wildlife Protection Act (1972) • VTR Code of Conduct
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  Park Rules, Safety Regulations & Visitor Guidelines
                </h3>
              </div>
              <span className="bg-red-50 text-red-800 text-xs font-mono font-bold px-3 py-1 rounded-full border border-red-200">
                Mandatory Compliance
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Valmiki Tiger Reserve is an inviolate wildlife sanctuary and critical tiger habitat. Every visitor must adhere strictly to the following statutory guidelines to ensure both human safety and the tranquility of wildlife.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rule 1 */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>1. Zero Single-Use Plastic & No Littering</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  VTR is a strict <strong>Plastic-Free Zone</strong>. Carrying single-use plastic bags, disposable water bottles, or throwing snack wrappers from safari gypsies is strictly prohibited. Violations attract on-the-spot penalties up to ₹5,000.
                </p>
              </div>

              {/* Rule 2 */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>2. Vehicle Speed Limit & No Alighting</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Safari vehicles must adhere to a strict <strong>20 km/h speed limit</strong>. Visitors are strictly forbidden from disembarking from gypsies inside the forest, except at designated forest rest beat towers with escort guides.
                </p>
              </div>

              {/* Rule 3 */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>3. Wildlife Safe Distance (20m Rule)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Always maintain a minimum distance of <strong>20 meters</strong> from tigers, leopards, elephants, and rhinos. Never encircle an animal or block its natural escape corridor.
                </p>
              </div>

              {/* Rule 4 */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>4. Sunset Curfew & No Night Safaris</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  All safari vehicles must exit the core sanctuary gates <strong>30 minutes before sunset</strong>. Private nocturnal drives inside the core jungle are strictly prohibited under national conservation protocols.
                </p>
              </div>

              {/* Rule 5 */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>5. No Flash Photography or Drones</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Flash photography causes severe distress and temporary blindness to nocturnal carnivores and is barred. Aerial drone operations require prior written authorization from the Principal Chief Conservator of Forests (Wildlife).
                </p>
              </div>

              {/* Rule 6 */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <Info className="w-4 h-4 text-stone-600 flex-shrink-0" />
                  <span>6. Strict Forest Silence & Attire</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Keep mobile phones on silent mode. Shouting, blowing vehicle horns, or playing music is prohibited. Wear neutral, forest-friendly earthy tones (olive, khaki, beige, brown) to blend seamlessly with the jungle.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LOCAL CUISINE */}
      {activeTab === 'local-cuisine' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest block">
                  West Champaran & Tharu Tribal Flavors
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  Authentic Local Cuisine & Culinary Heritage
                </h3>
              </div>
              <button
                onClick={() => setGlobalActiveTab('cuisine')}
                className="px-4 py-2 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
              >
                <span>Full Recipe & Heritage Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Visiting Valmiki is an immersion in rich rustic culinary culture. West Champaran is globally celebrated for its slow-cooked earthen-pot delicacies and indigenous Tharu forest harvests.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-[#F5F1E6]/80 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <div className="text-2xl">🍲</div>
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">Champaran Ahuna Mutton</h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Slow cooked inside unglazed earthen pots (*handis*) sealed with kneaded dough, simmered gently over slow wood or charcoal embers with whole garlic bulbs and pure cold-pressed mustard oil.
                </p>
              </div>

              <div className="p-5 bg-[#F5F1E6]/80 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <div className="text-2xl">🫓</div>
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">Litti Chokha with Desi Ghee</h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Whole-wheat dough balls filled with spicy roasted gram flour (*sattu*), carom seeds, and mustard oil, roasted on cow-dung fire embers and dipped in aromatic desi ghee, served with smoky mashed baingan-tamatar chokha.
                </p>
              </div>

              <div className="p-5 bg-[#F5F1E6]/80 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <div className="text-2xl">🌾</div>
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">Tharu Tribal Forest Delicacies</h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Indigenous forest tribal delicacies including <strong>Sidha</strong> (steamed rice flour parcels), <strong>Ghonghi</strong> (riverine snails sautéed in spices), and fresh freshwater Gandak river fish.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FLORA & FAUNA HIGHLIGHTS */}
      {activeTab === 'flora-fauna' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-widest block">
                  Terai Arc Landscape Ecological Riches
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  Biodiversity, Flora & Fauna of Valmiki
                </h3>
              </div>
              <button
                onClick={() => setGlobalActiveTab('wildlife')}
                className="px-4 py-2 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
              >
                <span>Explore Full Wildlife Species List</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flora Column */}
              <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-lg font-serif">
                  <Trees className="w-5 h-5 text-emerald-700" />
                  <span>Botanical & Forest Ecosystem (Flora)</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Valmiki represents an ecotone between the bhabar tract and the alluvial terai plains. The botanical composition includes:
                </p>
                <ul className="space-y-2 text-xs text-stone-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Sal Forests (*Shorea robusta*):</strong> Forms towering, dense canopies dominating nearly 70% of the reserve&apos;s moist deciduous woodlands.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Riverine Woodlands:</strong> Khair (*Acacia catechu*) and Sissoo (*Dalbergia sissoo*) flourishing on the Gandak alluvial floodplains.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Grasslands & Cane Brakes:</strong> Elephant grass (*Saccharum spontaneum*) reaching 4-5m height and wild cane (*Calamus tenuis*) providing critical predator cover.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Medicinal Trees:</strong> Harra, Bahera, Amla (Triphala constituents), Semal (Silk Cotton), and sacred peepal trees.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Fauna Column */}
              <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-lg font-serif">
                  <span className="text-xl">🐅</span>
                  <span>Mammals, Birds & Aquatic Wildlife (Fauna)</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Home to over 53 mammal species, 250+ avifaunal species, and rare aquatic reptiles:
                </p>
                <ul className="space-y-2 text-xs text-stone-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Apex Carnivores:</strong> Royal Bengal Tiger (54 verified individuals), Indian Leopard (*Panthera pardus*), Dhole (Asiatic Wild Dog), and Sloth Bear.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Mega-Herbivores:</strong> Indian Gaur (Bison - world&apos;s largest bovine), Sambar, Spotted Deer (Chital), Barking Deer, and Wild Boar.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Aquatic Sanctuary:</strong> Critically endangered <strong>Gharial</strong> and Mugger crocodile breeding colony in the Gandak River.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></span>
                    <div>
                      <strong>Avian Wonders:</strong> Great Indian Hornbill, Kalij Pheasant, Crested Serpent Eagle, Bengal Florican, and migratory river lapwings.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
