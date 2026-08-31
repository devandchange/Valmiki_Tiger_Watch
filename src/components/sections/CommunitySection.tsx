import React from 'react';
import { 
  Users, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag, 
  Trees,
  CheckCircle2
} from 'lucide-react';

export const CommunitySection: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Indigenous Heritage & Coexistence</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Community Participation & Tribal Guardians
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          No tiger conservation model succeeds without the active partnership of forest-dwelling communities. The indigenous Tharu and Uraon tribes of Champaran have coexisted with apex predators for centuries, stewarding deep traditional ecological wisdom.
        </p>
      </div>

      {/* 2 Main Communities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-display font-bold text-xl">
              TH
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-stone-900">The Tharu Community</h3>
              <p className="text-xs text-stone-500 font-mono">Indigenous Forest Stewards of Champaran</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            The Tharu people have lived in the malarial Terai belt of West Champaran for generations. Their deep knowledge of seasonal wildlife migration, medicinal plants, and animal behavior makes them invaluable frontline allies in habitat protection.
          </p>

          <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <span className="font-bold text-stone-800 uppercase tracking-wider block">
              Cultural Ecological Values:
            </span>
            <ul className="space-y-1.5 text-stone-700 list-disc list-inside">
              <li>Reverence for forest spirits and sacred tree groves (Gram Devata).</li>
              <li>Mud and straw architecture naturally insulated against Terai humidity.</li>
              <li>Hand-woven natural grass mats (Sikki craft) and traditional bamboo baskets.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-display font-bold text-xl">
              EDC
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-stone-900">Eco-Development Committees</h3>
              <p className="text-xs text-stone-500 font-mono">Grassroots Conservation Governance</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Over 50 Eco-Development Committees (EDCs) and Van Suraksha Samitis function across fringe settlements like Harnatanr, Naurangia, and Manguraha, channeling tourism revenue directly into local village infrastructure.
          </p>

          <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <span className="font-bold text-stone-800 uppercase tracking-wider block">
              Key Community Benefits:
            </span>
            <ul className="space-y-1.5 text-stone-700 list-disc list-inside">
              <li>Over 200 local youth employed as certified safari drivers and nature guides.</li>
              <li>Solar street lighting and potable water borewells installed across border hamlets.</li>
              <li>Promotion of smokeless cooking stoves to eliminate dependence on core forest firewood.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sustainable Livelihoods & Sikki Crafts Showcase */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 space-y-6">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-6 h-6 text-amber-700" />
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Sikki & Moonj Grass Crafts: Empowering Women Artisans
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
          Harvested from wetland margins along the Gandak basin, golden Sikki grass is transformed by Tharu women into intricately coiled baskets, decorative figurines, and jewelry boxes. Purchasing these authentic crafts during ecotourism visits provides alternative, forest-independent family revenue.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-1">
            <span className="font-bold text-stone-900 block">Eco-Friendly Sourcing</span>
            <p className="text-stone-600">Wild riverine reeds harvested sustainably without depleting forest biomass.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-1">
            <span className="font-bold text-stone-900 block">Direct Producer Benefit</span>
            <p className="text-stone-600">100% of craft sale proceeds go directly to women self-help collectives.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-1">
            <span className="font-bold text-stone-900 block">GI Tag Heritage</span>
            <p className="text-stone-600">Celebrates Bihar’s recognized Geographical Indication craft legacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
