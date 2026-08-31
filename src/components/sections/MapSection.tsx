import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Eye, 
  Compass, 
  ShieldAlert, 
  Info,
  Trees,
  Mountain
} from 'lucide-react';

export const MapSection: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>('valmikinagar');

  const zoneDetails: { [key: string]: {
    name: string;
    type: string;
    area: string;
    terrain: string;
    fauna: string[];
    safariPermitted: boolean;
    description: string;
  } } = {
    valmikinagar: {
      name: 'Valmikinagar Range & Triveni Confluence',
      type: 'Ecotourism & Riverine Range',
      area: '~115 sq. km',
      terrain: 'Foothill river confluence, Gandak barrage, dense cane brakes, sal forest',
      fauna: ['Royal Bengal Tiger', 'Gharial', 'Otter', 'Great Indian Hornbill', 'Spotted Deer'],
      safariPermitted: true,
      description: 'The primary gateway to VTR. Features boat safaris on the Gandak, canopy walks, and historical Triveni river confluence bordering Nepal.'
    },
    gonauli: {
      name: 'Gonauli Core Range',
      type: 'Strict Inviolate Core Zone',
      area: '~140 sq. km',
      terrain: 'High Someshwar ridges, dense virgin sal canopies, deep natural water ravines',
      fauna: ['Tiger Breeding Dens', 'Sloth Bear', 'Indian Leopard', 'Sambar', 'Barking Deer'],
      safariPermitted: false,
      description: 'The biological heart of Valmiki Tiger Reserve. Closed to regular tourism to ensure undisturbed breeding space for apex carnivores and ungulate herds.'
    },
    madanpur: {
      name: 'Madanpur Range & Wetland Complex',
      type: 'Riverine Savannah & Grassland',
      area: '~120 sq. km',
      terrain: 'Alluvial floodplains, swamp tall-grass, oxbow lakes and perennial marshes',
      fauna: ['One-Horned Rhinoceros (transient)', 'Marsh Crocodile', 'Hog Deer', 'Fishing Cat'],
      safariPermitted: true,
      description: 'A vital wetland grassland corridor connecting with Chitwan. Home to diverse waterbirds and transit corridors for large mammals.'
    },
    manguraha: {
      name: 'Manguraha Range & Someshwar Foothills',
      type: 'Eastern Forest & Trekking Route',
      area: '~110 sq. km',
      terrain: 'Steep hill slopes, sandstone cliffs, dry deciduous and sal mixture',
      fauna: ['Leopard', 'Serow', 'Indian Gaur', 'Flying Squirrel', 'Wild Boar'],
      safariPermitted: true,
      description: 'Historic trailhead leading to Fort Someshwar along the Indo-Nepal international boundary. Offers scenic canyon drives and jungle cottages.'
    },
    raghia: {
      name: 'Raghia Range',
      type: 'Central Deciduous Buffer',
      area: '~95 sq. km',
      terrain: 'Rolling woodland, mixed bamboo brakes, artificial check-dams',
      fauna: ['Spotted Deer', 'Chital', 'Blue Bull (Nilgai)', 'Wild Dog (Dhole)', 'Tigers (dispersing)'],
      safariPermitted: true,
      description: 'Key herbivore grazing zone monitored extensively via automated camera traps and frontline foot patrols.'
    }
  };

  const current = zoneDetails[activeZone] || zoneDetails['valmikinagar'];

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Reserve Cartography</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Reserve Map & Forest Ranges
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Explore the spatial zonation, river systems, and range beats of Valmiki Tiger Reserve. Click on different sectors to view geographic profiles, conservation statuses, and access permissions.
        </p>

        <div className="bg-[#07271D] border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wide block">
              Cartographic Generalization Notice
            </span>
            <p className="leading-relaxed text-[11px]">
              Specific patrol GPS grids and den coordinates are excluded from public maps to maintain operational integrity and wildlife safety.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vector Map Canvas Column */}
        <div className="lg:col-span-2 bg-[#07271D] rounded-3xl p-6 sm:p-8 border border-emerald-800 text-white space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span className="font-display font-bold text-base">VTR Schematic Zonation Map</span>
            </div>
            <span className="text-xs font-mono text-emerald-300">Indo-Nepal TAL Boundary</span>
          </div>

          {/* Stylized SVG Map */}
          <div className="relative w-full h-80 sm:h-96 bg-[#041B14] rounded-2xl border border-emerald-900/80 p-4 flex items-center justify-center overflow-hidden">
            {/* North Indicator */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-amber-400 bg-[#0B3D2E] px-2 py-1 rounded border border-amber-500/30 flex items-center space-x-1">
              <span>▲ N (Nepal / Chitwan NP)</span>
            </div>

            {/* River Gandak Graphic */}
            <svg className="w-full h-full" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Gandak River Path */}
              <path
                d="M 50 10 Q 70 120 40 220 T 60 340"
                stroke="#38BDF8"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.6"
              />
              <text x="15" y="180" fill="#38BDF8" fontSize="10" fontFamily="monospace" transform="rotate(-90 15,180)">
                Gandak / Narayani River
              </text>

              {/* Someshwar Hill Ridge (Top Boundary) */}
              <path
                d="M 80 40 Q 250 15 480 30"
                stroke="#D97706"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
              <text x="200" y="30" fill="#FBBF24" fontSize="9" fontFamily="monospace">
                Someshwar Range (Indo-Nepal Border)
              </text>

              {/* Interactive Zone Polygons */}
              
              {/* 1. Valmikinagar */}
              <g
                onClick={() => setActiveZone('valmikinagar')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <polygon
                  points="80,50 180,60 160,160 70,140"
                  fill={activeZone === 'valmikinagar' ? '#F59E0B' : '#0B3D2E'}
                  stroke="#10B981"
                  strokeWidth="2"
                  opacity="0.85"
                />
                <text x="90" y="105" fill={activeZone === 'valmikinagar' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                  Valmikinagar
                </text>
                <circle cx="110" cy="70" r="4" fill="#EF4444" />
                <text x="118" y="73" fill="#FFF" fontSize="8">Triveni Dam</text>
              </g>

              {/* 2. Gonauli (Core) */}
              <g
                onClick={() => setActiveZone('gonauli')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <polygon
                  points="180,60 330,50 310,180 160,160"
                  fill={activeZone === 'gonauli' ? '#F59E0B' : '#064E3B'}
                  stroke="#10B981"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <text x="210" y="115" fill={activeZone === 'gonauli' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                  Gonauli Core
                </text>
                <text x="215" y="130" fill={activeZone === 'gonauli' ? '#000' : '#A7F3D0'} fontSize="8">
                  (Inviolate)
                </text>
              </g>

              {/* 3. Madanpur */}
              <g
                onClick={() => setActiveZone('madanpur')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <polygon
                  points="70,140 160,160 140,290 60,260"
                  fill={activeZone === 'madanpur' ? '#F59E0B' : '#0B3D2E'}
                  stroke="#10B981"
                  strokeWidth="2"
                  opacity="0.85"
                />
                <text x="80" y="215" fill={activeZone === 'madanpur' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                  Madanpur
                </text>
                <text x="80" y="230" fill={activeZone === 'madanpur' ? '#000' : '#A7F3D0'} fontSize="8">
                  (Wetlands)
                </text>
              </g>

              {/* 4. Raghia */}
              <g
                onClick={() => setActiveZone('raghia')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <polygon
                  points="160,160 310,180 290,290 140,290"
                  fill={activeZone === 'raghia' ? '#F59E0B' : '#0B3D2E'}
                  stroke="#10B981"
                  strokeWidth="2"
                  opacity="0.85"
                />
                <text x="210" y="230" fill={activeZone === 'raghia' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                  Raghia Range
                </text>
              </g>

              {/* 5. Manguraha */}
              <g
                onClick={() => setActiveZone('manguraha')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <polygon
                  points="330,50 480,45 460,260 310,180"
                  fill={activeZone === 'manguraha' ? '#F59E0B' : '#0B3D2E'}
                  stroke="#10B981"
                  strokeWidth="2"
                  opacity="0.85"
                />
                <text x="360" y="140" fill={activeZone === 'manguraha' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                  Manguraha
                </text>
                <circle cx="450" cy="65" r="4" fill="#EF4444" />
                <text x="390" y="70" fill="#FDE68A" fontSize="8">Someshwar Fort</text>
              </g>
            </svg>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.keys(zoneDetails).map((key) => (
              <button
                key={key}
                onClick={() => setActiveZone(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeZone === key
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-[#0B3D2E] text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                {zoneDetails[key].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Zone Detail Card Column */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-xs font-bold text-amber-700 block mb-0.5">
                {current.type}
              </span>
              <h3 className="font-display font-bold text-2xl text-stone-900 leading-tight">
                {current.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {current.description}
            </p>

            <div className="space-y-2.5 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <span className="text-stone-500 block font-mono">Area & Terrain:</span>
                <span className="font-bold text-stone-900">{current.area} — {current.terrain}</span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="text-stone-500 block font-mono mb-1">Key Indicator Species:</span>
                <div className="flex flex-wrap gap-1.5">
                  {current.fauna.map((f, idx) => (
                    <span key={idx} className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-mono">Public Safari:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              current.safariPermitted ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
            }`}>
              {current.safariPermitted ? 'Permitted in Designated Trails' : 'Strict Inviolate Core (No Entry)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
