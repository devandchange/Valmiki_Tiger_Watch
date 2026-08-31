import React from 'react';
import { 
  Award, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Camera, 
  Users, 
  CheckCircle2,
  Code2
} from 'lucide-react';

export const CreditsSection: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Platform Credits & Acknowledgments</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Credits, Attribution & Dedication
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Acknowledging the visionary creators, researchers, wildlife biologists, and frontline guardians whose ceaseless devotion protects Valmiki Tiger Reserve.
        </p>
      </div>

      {/* Creator Spotlight Box */}
      <div className="bg-gradient-to-br from-[#07271D] via-[#0B3D2E] to-[#145A43] text-white rounded-3xl p-8 sm:p-12 border border-amber-500/50 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-[#07271D]/90 border border-amber-400/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Architect & Developer</span>
          </div>

          <div className="space-y-1">
            <span className="text-emerald-300 font-mono text-xs uppercase tracking-wider block">
              Created and maintained by
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-amber-400 tracking-tight">
              Nazish Asad
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed pt-2">
            Conceived and engineered as a comprehensive digital conservation, research, and public advocacy platform to elevate Valmiki Tiger Reserve’s ecological stature, empower grassroots tiger conservation, and provide an open-access scientific resource for researchers, students, and nature enthusiasts globally.
          </p>
        </div>
      </div>

      {/* Institutional & Scientific Acknowledgments */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <h3 className="font-display font-bold text-2xl text-stone-900">
          Institutional & Scientific Data Sources
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700">
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>National Tiger Conservation Authority (NTCA)</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              All-India Tiger Estimation protocols, M-STrIPES guidelines, management effectiveness evaluation (MEE) criteria, and national population assessments.
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>Wildlife Institute of India (WII)</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Spatial camera-trap methodologies, Terai Arc Landscape ecological research papers, genetics studies, and herbivore prey density indices.
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>Environment, Forest & Climate Change Dept, Bihar</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Official range notifications, eco-development committee reports, grassland management data, and wildlife sanctuary boundaries.
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>IUCN Red List & WWF-India TAL Program</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Species conservation statuses, transboundary corridor dynamics, and habitat connectivity benchmarks.
            </p>
          </div>
        </div>
      </div>

      {/* Dedication to Frontline Watchers & Tribal Guardians */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 text-center space-y-4 max-w-3xl mx-auto">
        <Heart className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="font-display font-bold text-2xl text-stone-900">
          Dedicated to the Frontline Guardians of Valmiki
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          This platform is respectfully dedicated to the brave daily-wager forest watchers, range officers, veterinary teams, and indigenous Tharu & Uraon communities who walk the dense, mist-clad trails of Valmiki every single day to ensure the Royal Bengal Tiger continues to roar along the sacred banks of the Gandak.
        </p>
      </div>
    </div>
  );
};
