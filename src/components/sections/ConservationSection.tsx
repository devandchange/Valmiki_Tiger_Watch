import React from 'react';
import { 
  ShieldCheck, 
  Radio, 
  Globe, 
  Zap, 
  Activity, 
  MapPin, 
  Footprints, 
  HeartHandshake,
  AlertCircle
} from 'lucide-react';

export const ConservationSection: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Strategic Wildlife Protection Framework</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Conservation Architecture & Anti-Poaching
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Safeguarding 899 sq km of rugged Terai-Bhabar forest demands relentless vigilance. Valmiki deploys cutting-edge digital spatial monitoring, transboundary intelligence sharing, and grassroots community defense networks.
        </p>
      </div>

      {/* 3 Core Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strategy 1: M-STrIPES */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-stone-900">
              M-STrIPES Digital Patrolling
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Frontline foot patrols record geo-referenced observations using the NTCA M-STrIPES mobile system. Every patrol track, snare detection, direct animal sighting, and habitat disturbance is mapped into central GIS servers.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 font-mono">
              ✓ 120+ Daily Patrol Handsets Active<br />
              ✓ Full Spatial Coverage Across All 8 Ranges
            </div>
          </div>
        </div>

        {/* Strategy 2: Transboundary */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-stone-900">
              Chitwan-Valmiki Transboundary Link
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              VTR forms a contiguous ecological expanse with Nepal’s Chitwan National Park and Parsa Wildlife Reserve. Regular joint border patrols, synchronized camera-trap data sharing, and cross-border anti-smuggling sweeps ensure safe gene flow.
            </p>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 font-mono">
              ✓ Bi-Monthly Border Taskforce Meets<br />
              ✓ Zero-Tolerance Contiguous Corridor
            </div>
          </div>
        </div>

        {/* Strategy 3: Conflict Mitigation */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-stone-900">
              Solar Fencing & HWC Rapid Response
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              To mitigate Human-Wildlife Conflict (HWC) in sugarcane farming fringes, non-lethal solar-energized power fences have been erected along vulnerable village boundaries, backed by trained 24/7 wildlife rescue squads.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900 font-mono">
              ✓ 42+ km Solar Fencing Installed<br />
              ✓ Rapid Tranquilization & Rescue Unit
            </div>
          </div>
        </div>
      </div>

      {/* Frontline Rangers Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#0B3D2E] text-amber-400 rounded-xl">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              The Unsung Heroes: Frontline Forest Watchers
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Patrolling in extreme monsoon floods, dense fog, and predator habitats
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            The frontline staff of Valmiki Tiger Reserve, including regular foresters, daily-wager trackers, and indigenous Tharu youth, traverse 15 to 20 kilometers on foot daily through tiger and sloth bear terrain. Equipped with GPS handsets, field kits, and stout bamboo lathis, they guard against illegal timber extractors, poachers, and cattle grazing.
          </p>
          <p>
            Supported by 32 anti-poaching camps stationed in deep interior sectors like Gonauli, Madanpur, and Someshwar ridge, these rangers maintain continuous water supplies at artificial waterholes, log pugmarks, and maintain peaceful relations with border agricultural communities.
          </p>
        </div>
      </div>
    </div>
  );
};
