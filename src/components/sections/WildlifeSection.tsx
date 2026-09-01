import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { WildlifeSpecies } from '../../types';
import { SpeciesSpotter } from '../SpeciesSpotter';
import { 
  Trees, 
  Search, 
  Filter, 
  AlertTriangle, 
  Info, 
  Compass, 
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Binoculars,
  BookOpen
} from 'lucide-react';

export const WildlifeSection: React.FC = () => {
  const { wildlife } = useData();
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'spotter'>('directory');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<WildlifeSpecies | null>(null);

  const categories = [
    { id: 'all', label: 'All Biodiversity' },
    { id: 'mammal', label: 'Mammals' },
    { id: 'bird', label: 'Avian / Birds' },
    { id: 'reptile', label: 'Reptiles & Aquatic' },
    { id: 'flora', label: 'Flora & Forest Trees' },
  ];

  const filteredWildlife = wildlife.filter(item => {
    const matchesSearch = 
      item.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vtrHabitat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const getIucnBadge = (status: string) => {
    switch (status) {
      case 'CR':
        return <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">CR • Critically Endangered</span>;
      case 'EN':
        return <span className="bg-orange-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">EN • Endangered</span>;
      case 'VU':
        return <span className="bg-amber-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">VU • Vulnerable</span>;
      case 'NT':
        return <span className="bg-yellow-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">NT • Near Threatened</span>;
      default:
        return <span className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">LC • Least Concern</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Increasing':
        return <span className="text-emerald-700 font-medium flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1" /> Increasing</span>;
      case 'Decreasing':
        return <span className="text-red-700 font-medium flex items-center"><TrendingDown className="w-3.5 h-3.5 mr-1" /> Decreasing</span>;
      default:
        return <span className="text-stone-600 font-medium flex items-center"><Minus className="w-3.5 h-3.5 mr-1" /> Stable</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
            <Trees className="w-3.5 h-3.5 text-amber-400" />
            <span>VTR Terai-Arc Biodiversity Index</span>
          </div>

          {/* Subtab Toggle Buttons */}
          <div className="flex items-center bg-[#07271D] p-1 rounded-xl border border-emerald-500/40 text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('directory')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'directory'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biodiversity Index</span>
            </button>
            <button
              onClick={() => setActiveSubTab('spotter')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'spotter'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <Binoculars className="w-3.5 h-3.5" />
              <span>Species Spotter Checklist</span>
            </button>
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Wildlife & Forest Biodiversity
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Nestled at the confluence of the Bhabar and Terai landscape, Valmiki Tiger Reserve supports a rich mosaic of moist deciduous sal forests, cane brakes, alluvial savannah grasslands, and swift rivers sustaining over 53 mammal, 250 bird, and 30 reptile species.
        </p>
      </div>

      {activeSubTab === 'spotter' ? (
        <SpeciesSpotter showHeader={false} />
      ) : (
        <>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search species by common or scientific name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0B3D2E] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wildlife Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWildlife.map((spec) => (
          <div
            key={spec.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-stone-200 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Photo & Status */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={spec.image}
                  alt={spec.commonName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  {getIucnBadge(spec.iucnStatus)}
                </div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-amber-300 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  {spec.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-display font-bold text-xl text-stone-900 leading-snug">
                    {spec.commonName}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono italic">
                    {spec.scientificName}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-emerald-950">
                    <strong>VTR Habitat:</strong> {spec.vtrHabitat}
                  </div>

                  <p className="text-stone-600 leading-relaxed line-clamp-3">
                    {spec.description}
                  </p>

                  {/* Key Features */}
                  <div className="space-y-1 pt-1">
                    <span className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider block">
                      Distinguishing Traits:
                    </span>
                    <ul className="space-y-0.5 text-stone-600 text-xs list-disc list-inside">
                      {spec.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="line-clamp-1">{feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Population Trend */}
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Population Trend:</span>
              <div>{getTrendIcon(spec.populationTrend)}</div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
};
