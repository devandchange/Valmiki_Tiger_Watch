import React, { useState } from 'react';
import { 
  Camera, 
  X, 
  Eye, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2,
  Filter
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'camera_trap' | 'landscape' | 'birds' | 'predators' | 'mammals';
  imageUrl: string;
  caption: string;
  location: string;
  date: string;
  credit: string;
}

export const GallerySection: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      title: 'T-07 "Someshwar Sovereign" on Night Trail',
      category: 'camera_trap',
      imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=85',
      caption: 'Automated camera-trap capture of alpha male tiger patrolling boundary ridgeline at 23:45 hrs.',
      location: 'Someshwar Ridge Sector',
      date: 'March 2026',
      credit: 'VTR Camera Trap Monitoring Grid'
    },
    {
      id: 'g2',
      title: 'Misty Dawn over the Gandak River at Valmikinagar',
      category: 'landscape',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      caption: 'Sunrise over the Triveni confluence where the Narayani expands into the Gandak floodplains.',
      location: 'Valmikinagar Range',
      date: 'January 2026',
      credit: 'Conservation Media Archives'
    },
    {
      id: 'g3',
      title: 'Great Indian Hornbill Pair in Canopy',
      category: 'birds',
      imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=85',
      caption: 'Pair of Buceros bicornis nesting in ancient hollow of an old-growth Terminalia tomentosa tree.',
      location: 'Gonauli Core',
      date: 'February 2026',
      credit: 'Avian Field Survey'
    },
    {
      id: 'g4',
      title: 'Indian Gaur Herd at Forest Waterhole',
      category: 'mammals',
      imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Massive adult bull gaur leading a nursery herd to an artificial solar check-dam at dusk.',
      location: 'Raghia Sector',
      date: 'April 2026',
      credit: 'VTR Field Observation Cell'
    },
    {
      id: 'g5',
      title: 'Indian Leopard (Panthera pardus fusca) on Sal Bough',
      category: 'predators',
      imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1200&q=85',
      caption: 'Co-predator basking in filtered afternoon sunlight across rocky Siwalik escarpments.',
      location: 'Kotraha Range',
      date: 'December 2025',
      credit: 'Wildlife Documentation Cell'
    },
    {
      id: 'g6',
      title: 'T-14 with Young Cub on Morning Stalk',
      category: 'camera_trap',
      imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=85',
      caption: 'Breeding tigress guiding 9-month-old cub across a dry riverbed crossing in Madanpur.',
      location: 'Madanpur Sector (Generalized)',
      date: 'November 2025',
      credit: 'Synchronized Census Grid'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'camera_trap', label: 'Camera Trap Captures' },
    { id: 'landscape', label: 'Landscapes & Rivers' },
    { id: 'predators', label: 'Tigers & Co-Predators' },
    { id: 'mammals', label: 'Herbivores & Ungulates' },
    { id: 'birds', label: 'Avifauna & Raptors' },
  ];

  const filteredItems = galleryItems.filter(item => 
    selectedCat === 'all' || item.category === selectedCat
  );

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Visual Natural History Archive</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          VTR Visual Documentation & Camera Traps
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Explore high-definition camera-trap footage, landscape panoramas of the Someshwar hills, and field captures of elusive species thriving within Valmiki Tiger Reserve.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCat === cat.id
                ? 'bg-[#0B3D2E] text-amber-300 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-60 overflow-hidden bg-stone-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0B3D2E]/90 text-amber-300 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                {item.category.replace('_', ' ')}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-medium flex items-center">
                  <Eye className="w-3.5 h-3.5 mr-1" /> View Full Capture
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-display font-bold text-base text-stone-900 group-hover:text-[#0B3D2E] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {item.caption}
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>{item.location}</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#07271D] text-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-800 my-8">
            <div className="relative max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[65vh] w-auto object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span className="text-amber-400 font-mono text-xs uppercase font-bold block mb-1">
                    {activePhoto.category.replace('_', ' ')}
                  </span>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                    {activePhoto.title}
                  </h2>
                </div>
                <div className="flex items-center space-x-3 text-xs text-emerald-300 font-mono">
                  <span>{activePhoto.location}</span>
                  <span>•</span>
                  <span>{activePhoto.date}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {activePhoto.caption}
              </p>

              <div className="pt-4 border-t border-emerald-800 flex justify-between items-center text-xs text-emerald-400 font-mono">
                <span>Credit: <strong>{activePhoto.credit}</strong></span>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="px-4 py-2 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-xl font-sans text-xs font-semibold"
                >
                  Close Lightbox
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
