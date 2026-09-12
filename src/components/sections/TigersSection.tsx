import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TigerProfile } from '../../types';
import { 
  Eye, 
  ShieldAlert, 
  CheckCircle, 
  Search, 
  Filter, 
  Camera, 
  Calendar, 
  MapPin, 
  Info, 
  X, 
  FileText,
  Share2
} from 'lucide-react';

export const TigersSection: React.FC = () => {
  const { tigers, selectedTiger, setSelectedTiger } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSex, setFilterSex] = useState<string>('all');
  const [filterVerification, setFilterVerification] = useState<string>('all');

  const filteredTigers = tigers.filter(t => {
    // Only show live items on public portal
    if (t.isLive === false) return false;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      String(t.code ?? '').toLowerCase().includes(q) ||
      String(t.name ?? '').toLowerCase().includes(q) ||
      String(t.safeTerritory ?? '').toLowerCase().includes(q) ||
      String(t.markings ?? '').toLowerCase().includes(q) ||
      String(t.approxAge ?? '').toLowerCase().includes(q) ||
      String(t.status ?? '').toLowerCase().includes(q);

    const matchesSex = filterSex === 'all' || String(t.sex ?? '').toLowerCase() === filterSex.toLowerCase();
    const matchesVerif = filterVerification === 'all' || t.verification === filterVerification;

    return matchesSearch && matchesSex && matchesVerif;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>VTR Individual Tracking Register</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Tigers of Valmiki Tiger Reserve
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Valmiki’s tiger population has undergone an extraordinary recovery, growing from approximately 8 individuals in 2006 to over 54 tigers today. Every individual is tracked using unique stripe patterns, automated camera-trap grids, and non-invasive field monitoring.
        </p>

        {/* Strict Location Safety Disclaimer */}
        <div className="bg-[#07271D] border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 uppercase tracking-wide block">
              Wildlife Security & Location Safety Protocol
            </span>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              To protect tigers, breeding females, and cubs from poaching and unnecessary human disturbance, <strong>exact GPS coordinates and den locations are strictly withheld</strong>. All location references represent generalized forest beats and historical seasonal ranges.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by code, nickname, or markings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-stone-600">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span>Sex:</span>
            <select
              value={filterSex}
              onChange={(e) => setFilterSex(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">All Sexes</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs text-stone-600">
            <span>Status:</span>
            <select
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">All Records</option>
              <option value="verified">Verified Official (NTCA/Govt)</option>
              <option value="estimated">Estimated (Camera Trap Match)</option>
              <option value="reported">Reported Observation</option>
              <option value="unverified">Unverified (Pending Review)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tigers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTigers.map((tiger) => (
          <div
            key={tiger.id}
            onClick={() => setSelectedTiger(tiger)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Photo & Badges */}
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src={tiger.photoUrl}
                  alt={tiger.name || tiger.code}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* ID Tag */}
                <div className="absolute top-3 left-3 bg-[#0B3D2E] text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-lg shadow-md border border-amber-500/30">
                  {tiger.code}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md shadow">
                  {tiger.status}
                </div>

                {/* Verification Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow ${
                    tiger.verification === 'verified' ? 'bg-emerald-600 text-white' :
                    tiger.verification === 'estimated' ? 'bg-sky-600 text-white' :
                    tiger.verification === 'reported' ? 'bg-amber-600 text-white' :
                    'bg-stone-600 text-white'
                  }`}>
                    {tiger.verification === 'verified' ? '✓ Verified Official' :
                     tiger.verification === 'estimated' ? '⚡ Estimated Match' :
                     tiger.verification === 'reported' ? '• Reported Observation' :
                     '? Unverified'}
                  </span>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-display font-bold text-xl text-stone-900 group-hover:text-[#0B3D2E] transition-colors">
                    {tiger.name ? tiger.name : tiger.code}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs font-mono text-stone-500 mt-1">
                    <span>{tiger.sex}</span>
                    <span>•</span>
                    <span>Approx. {tiger.approxAge}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-stone-700">{tiger.safeTerritory}</span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <strong className="text-stone-800">Markings:</strong> {tiger.markings}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center text-emerald-800 font-semibold font-mono">
                <Camera className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {tiger.cameraTrapRecords} Trap Captures
              </span>
              <span className="text-[#0B3D2E] font-medium group-hover:underline">
                Full Profile →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTigers.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <Eye className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="font-display font-bold text-lg text-stone-700">No tiger profiles match your search</h3>
          <p className="text-xs text-stone-500">Try adjusting your search terms or clearing the filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setFilterSex('all'); setFilterVerification('all'); }}
            className="px-4 py-2 bg-[#0B3D2E] text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Tiger Detail Modal */}
      {selectedTiger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-8">
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-72 bg-stone-900">
              <img
                src={selectedTiger.photoUrl}
                alt={selectedTiger.name || selectedTiger.code}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedTiger(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="bg-[#0B3D2E]/90 backdrop-blur-sm p-3 rounded-2xl border border-amber-500/40 text-white">
                  <span className="font-mono text-amber-300 text-xs font-bold block">{selectedTiger.code}</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold">{selectedTiger.name || selectedTiger.code}</h2>
                </div>
                <span className="bg-white text-stone-900 text-xs font-semibold px-3 py-1 rounded-xl shadow">
                  {selectedTiger.status}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Core Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-mono">Sex</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedTiger.sex}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-mono">Approx. Age</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedTiger.approxAge}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-mono">Camera Traps</span>
                  <span className="font-bold text-emerald-800 text-sm">{selectedTiger.cameraTrapRecords} Captures</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-mono">Verification Status</span>
                  <span className={`font-bold text-xs uppercase px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                    selectedTiger.verification === 'verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    selectedTiger.verification === 'estimated' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                    selectedTiger.verification === 'reported' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-stone-200 text-stone-700'
                  }`}>
                    {selectedTiger.verification}
                  </span>
                </div>
              </div>

              {/* Tiger Dossier & Camera-Trap Details */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4.5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5 font-mono">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    Official Wildlife Dossier & Camera-Trap Telemetry
                  </span>
                  {selectedTiger.lastDocumentedDate && (
                    <span className="font-mono text-[11px] text-stone-600">
                      Last Photographed: <strong>{selectedTiger.lastDocumentedDate}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-stone-500 font-mono block">Stripe Pattern Reference ID:</span>
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                      {selectedTiger.fullDossier?.stripePatternId || selectedTiger.code}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono block">Physical Health & Dominance:</span>
                    <span className="font-semibold text-stone-800 block mt-0.5">
                      {selectedTiger.fullDossier?.physicalCondition || 'Healthy adult specimen'}
                    </span>
                  </div>
                  {selectedTiger.fullDossier?.knownOffspring && selectedTiger.fullDossier.knownOffspring.length > 0 && (
                    <div className="sm:col-span-2">
                      <span className="text-stone-500 font-mono block">Known Offspring / Documented Cubs:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedTiger.fullDossier.knownOffspring.map((cub, i) => (
                          <span key={i} className="bg-emerald-100/90 text-emerald-800 text-[11px] font-mono px-2 py-0.5 rounded-lg border border-emerald-300">
                            🐅 {cub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedTiger.fullDossier?.recentSightingsNote && (
                    <div className="sm:col-span-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                      <span className="text-stone-500 font-mono block text-[11px]">Latest Verified Field Observation Note:</span>
                      <p className="text-stone-800 italic mt-0.5">
                        "{selectedTiger.fullDossier.recentSightingsNote}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Territory & Markings */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-emerald-700" />
                    Generalized Safe Beat / Territory Range:
                  </span>
                  <p className="text-emerald-950 font-medium">{selectedTiger.safeTerritory}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-900 block">Identification Markings & Stripe Pattern:</span>
                  <p className="text-stone-700 leading-relaxed">{selectedTiger.markings}</p>
                </div>

                {selectedTiger.familyLineage && (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">Lineage & Family History:</span>
                    <p className="text-stone-700 leading-relaxed">{selectedTiger.familyLineage}</p>
                  </div>
                )}

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-900 block">Ecological Observations & Field Notes:</span>
                  <p className="text-stone-700 leading-relaxed">{selectedTiger.notes}</p>
                </div>
              </div>

              {/* Verification & Metadata */}
              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-500">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span><strong>Source:</strong> {selectedTiger.sources}</span>
                  <span className="font-mono"><strong>Last Verified:</strong> {selectedTiger.lastVerifiedDate}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedTiger(null)}
                className="px-5 py-2.5 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
