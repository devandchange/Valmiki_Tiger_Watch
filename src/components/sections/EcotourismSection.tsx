import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  Compass, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sun, 
  Home, 
  AlertCircle,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export const EcotourismSection: React.FC = () => {
  const { ecotourism } = useData();

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Ethical & Low-Impact Nature Tourism</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Responsible Ecotourism in Valmiki
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Experience the untamed beauty of Bihar’s Terai forests without compromising wildlife serenity. Ecotourism at VTR directly finances local tribal village welfare and frontline anti-poaching vigilance.
        </p>
      </div>

      {/* Safari Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ecotourism.map((zone) => (
          <div
            key={zone.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs font-bold text-amber-700 block mb-1">
                  {zone.rangeBeat}
                </span>
                <h3 className="font-display font-bold text-2xl text-stone-900">
                  {zone.name}
                </h3>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Key Attractions & Highlights:
                </span>
                <div className="flex flex-wrap gap-2">
                  {zone.highlights.map((hl, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-medium"
                    >
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safari Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block font-mono">Safari Type:</span>
                  <span className="font-bold text-stone-900">{zone.safariType}</span>
                </div>
                <div>
                  <span className="text-stone-500 block font-mono">Best Visiting Months:</span>
                  <span className="font-bold text-stone-900">{zone.bestSeason}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-200">
                  <span className="text-stone-500 block font-mono">Designated Entry Gate:</span>
                  <span className="font-bold text-emerald-800">{zone.entryGate}</span>
                </div>
              </div>

              {/* Accommodations */}
              <div className="text-xs text-stone-600">
                <span className="font-bold text-stone-800 block mb-0.5">Stay & Homestays:</span>
                <p>{zone.accommodations}</p>
              </div>
            </div>

            {/* Rules */}
            <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-500">
              <span className="font-bold text-stone-700 block">Strict Zone Regulations:</span>
              <ul className="space-y-1 list-disc list-inside">
                {zone.ecoRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Code of Conduct / Safari Ethics */}
      <div className="bg-[#07271D] text-white rounded-3xl p-6 sm:p-10 border border-emerald-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-emerald-800/80 pb-4">
          <div className="p-2 bg-amber-500 rounded-xl text-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              The VTR Visitor Code of Conservation Ethics
            </h2>
            <p className="text-xs text-amber-300 font-mono">
              Mandatory protocols for all entering vehicles, photographers, and trekkers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm text-emerald-100/90">
          <div className="p-4 bg-[#0B3D2E] rounded-2xl border border-emerald-700/50 space-y-2">
            <span className="font-bold text-amber-300 block text-base">1. Complete Forest Silence</span>
            <p className="leading-relaxed">
              Never blow horns, play music, shout, or make sudden loud noises. Disturbed animals will flee or become aggressive.
            </p>
          </div>

          <div className="p-4 bg-[#0B3D2E] rounded-2xl border border-emerald-700/50 space-y-2">
            <span className="font-bold text-amber-300 block text-base">2. Zero Plastic Policy</span>
            <p className="leading-relaxed">
              Carry only reusable metal or glass water containers. Never discard wrappers, polythene bags, or beverage cans in the forest.
            </p>
          </div>

          <div className="p-4 bg-[#0B3D2E] rounded-2xl border border-emerald-700/50 space-y-2">
            <span className="font-bold text-amber-300 block text-base">3. Stay Inside Vehicles</span>
            <p className="leading-relaxed">
              Stepping down from safari jeeps is strictly illegal except at authorized watchtowers accompanied by a certified forest naturalist.
            </p>
          </div>

          <div className="p-4 bg-[#0B3D2E] rounded-2xl border border-emerald-700/50 space-y-2">
            <span className="font-bold text-amber-300 block text-base">4. No Flash Photography</span>
            <p className="leading-relaxed">
              Camera flashes cause acute stress and temporary retinal blindness in tigers, leopards, and nocturnal birds.
            </p>
          </div>

          <div className="p-4 bg-[#0B3D2E] rounded-2xl border border-emerald-700/50 space-y-2">
            <span className="font-bold text-amber-300 block text-base">5. Respect Local Tribes</span>
            <p className="leading-relaxed">
              When visiting Tharu and Uraon villages, respect personal privacy, seek permission before photographing persons, and patronize local handicrafts directly.
            </p>
          </div>

          <div className="p-4 bg-[#0B3D2E] rounded-2xl border border-emerald-700/50 space-y-2">
            <span className="font-bold text-amber-300 block text-base">6. Obey Speed Limits</span>
            <p className="leading-relaxed">
              Safari vehicles must strictly maintain speeds under 20 km/h to prevent tragic roadkills of reptiles, spotted deer, and ground birds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
