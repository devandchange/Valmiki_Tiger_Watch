import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Wifi,
  Globe
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Independent Conservation Initiative</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          About Valmiki Tiger Watch
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Valmiki Tiger Watch is an independent conservation, education, scientific research, and wildlife advocacy platform dedicated to preserving Valmiki Tiger Reserve (VTR), Bihar, India.
        </p>

        {/* Non-Government Status Banner */}
        <div className="bg-[#07271D] border border-amber-500/40 rounded-2xl p-5 text-xs text-amber-200/90 space-y-2">
          <span className="font-bold text-amber-300 uppercase tracking-wide block text-sm">
            Strict Non-Government Declaration
          </span>
          <p className="leading-relaxed">
            This application is an independent public interest digital platform. It does not claim official representation of the Bihar Forest Department, National Tiger Conservation Authority (NTCA), Ministry of Environment, Forest and Climate Change (MoEFCC), or Government of Bihar. All data presented is cited from publicly available research papers, verified news outlets, and scientific surveys.
          </p>
        </div>
      </div>

      {/* Core Mission Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-stone-900">Watch & Monitor</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Tracking population dynamics, individual markings, camera-trap records, and transboundary corridors across the Terai-Arc Landscape.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-stone-900">Protect & Advocate</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Highlighting frontline rangers, anti-poaching challenges, seasonal flood impacts, and human-wildlife coexistence models.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-stone-900">Conserve & Educate</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Empowering students, researchers, nature enthusiasts, and tribal youth with verified scientific resources, quizzes, and track guides.
          </p>
        </div>
      </div>

      {/* Technical Architecture & PWA Standards */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-emerald-800" />
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Progressive Web App (PWA) Standards Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-stone-900">Offline-First Field Capability</h4>
            <p>
              Designed specifically for remote field deployments in West Champaran’s deep forest beats where cellular connectivity is intermittent or absent. The service worker caches core field guides, tiger profiles, emergency hotlines, and maps locally on your device.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-stone-900">Zero Public Friction & Security</h4>
            <p>
              Public access requires no sign-in or personal account creation. Administrative write capabilities are isolated behind secure administrative token controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
