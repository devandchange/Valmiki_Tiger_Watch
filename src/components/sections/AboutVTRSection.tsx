import React from 'react';
import { 
  MapPin, 
  Mountain, 
  Droplets, 
  Compass, 
  Layers, 
  CheckCircle,
  Trees,
  Award
} from 'lucide-react';

export const AboutVTRSection: React.FC = () => {
  const forestRanges = [
    { name: 'Valmikinagar Range', terrain: 'Hilly / Riverine Confluence', focus: 'Ecotourism hub, Triveni Sangam, Cane brakes' },
    { name: 'Gonauli Range', terrain: 'Dense Sal Forest / Someshwar Ridges', focus: 'Core tiger breeding habitat, high prey density' },
    { name: 'Madanpur Range', terrain: 'Alluvial Grasslands & Wetlands', focus: 'One-horned Rhino transient zone, marsh crocodiles' },
    { name: 'Kotraha Range', terrain: 'Bhabar Tract / River Ravines', focus: 'Leopard & sloth bear rocky corridors' },
    { name: 'Chiutaha Range', terrain: 'Moist Mixed Deciduous', focus: 'Ungulate grazing meadows, camera-trap grids' },
    { name: 'Harnatanr Range', terrain: 'Forest-Fringe Buffer', focus: 'Community EDC coexistence, solar fences' },
    { name: 'Raghia Range', terrain: 'Intermittent Streams & Sal Forests', focus: 'Chital & Sambar population monitoring' },
    { name: 'Manguraha Range', terrain: 'Eastern Foothills', focus: 'Trekker trail to Someshwar Fort, pristine ravines' }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Geography & Ecosystem Architecture</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          About Valmiki Tiger Reserve (VTR)
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Valmiki Tiger Reserve is Bihar’s sole National Park and Tiger Reserve, sprawling across 899.38 square kilometers in the northernmost tip of West Champaran district, bordering Nepal’s Chitwan National Park to the north and the Gandak River to the west.
        </p>
      </div>

      {/* Core Zonation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="font-mono text-xs font-bold text-emerald-800 uppercase">National Park (Core)</div>
          <div className="font-display text-3xl font-bold text-stone-900">335.65 <span className="text-base font-normal text-stone-500">sq. km</span></div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Strictly inviolate core zone designated exclusively for wildlife reproduction and undisturbed predator-prey dynamics.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="font-mono text-xs font-bold text-amber-800 uppercase">Wildlife Sanctuary (Buffer)</div>
          <div className="font-display text-3xl font-bold text-stone-900">563.73 <span className="text-base font-normal text-stone-500">sq. km</span></div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Regulated buffer zone supporting eco-development, controlled grazing fringes, and supervised nature tourism.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="font-mono text-xs font-bold text-indigo-800 uppercase">Total Protected Expanse</div>
          <div className="font-display text-3xl font-bold text-stone-900">899.38 <span className="text-base font-normal text-stone-500">sq. km</span></div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Continuous forest canopy representing one of the easternmost strongholds of the Terai Arc Landscape (TAL).
          </p>
        </div>
      </div>

      {/* Unique Landscape Features */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Geographic & Riverine Character
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl mt-0.5">
                <Mountain className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-stone-900">The Someshwar & Dun Hills</h4>
                <p className="text-stone-600">
                  Rising to an altitude of 880 meters (Fort Someshwar), the outer Siwalik ridges form a natural mountain barrier separating India and Nepal, creating steep ravines, cliff-faces for raptors, and deep forested valleys.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-xl mt-0.5">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-stone-900">The Gandak & Hill Streams</h4>
                <p className="text-stone-600">
                  The mighty Gandak (Narayani in Nepal) flushes the western boundary, while perennial hill torrents like Sonha, Pandai, Manor, Harha, and Bhapsa create a rich wetland hydrology supporting fish, otters, and gharials.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl mt-0.5">
                <Trees className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-stone-900">Champion & Seth Forest Types</h4>
                <p className="text-stone-600">
                  VTR features Moist Siwalik Sal, Bhabar-Dun Sal, West Gangetic Moist Deciduous, Khair-Sissoo along riverbeds, and wet alluvial Savannah grasslands interspersed with swampy cane breaks (Calamus tenuis).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 text-purple-800 rounded-xl mt-0.5">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-stone-900">The Terai Arc Landscape (TAL)</h4>
                <p className="text-stone-600">
                  VTR is a critical anchor in the international Terai Arc Landscape, allowing genetic flow between India and Nepal’s tiger, leopard, and one-horned rhinoceros metapopulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 8 Forest Ranges */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">
              Administrative Subdivisions
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              The 8 Forest Ranges of VTR
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forestRanges.map((range, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] font-bold text-amber-700 block">Range {idx + 1}</span>
                <h3 className="font-display font-bold text-base text-stone-900">{range.name}</h3>
                <p className="text-xs text-stone-500 font-medium mt-1">{range.terrain}</p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-xs text-stone-600">
                {range.focus}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
