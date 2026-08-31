import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Trees, 
  Award, 
  Calendar, 
  Compass, 
  CheckCircle2, 
  Droplets,
  Radio,
  Users
} from 'lucide-react';

export const ProjectTigerSection: React.FC = () => {
  const censusData = [
    { year: '2006', count: 8, note: 'Baseline crisis phase; heavy biotic pressure and low prey density' },
    { year: '2010', count: 10, note: 'Initiation of dedicated anti-poaching infrastructure' },
    { year: '2014', count: 22, note: 'M-STrIPES electronic patrol introduction & grassland management' },
    { year: '2018', count: 31, note: 'NTCA National Assessment confirms rapid recovery trajectory' },
    { year: '2022/23', count: 54, note: 'State & WII Synchronized Census records 54+ resident individuals' },
  ];

  const milestones = [
    {
      year: '1978',
      title: 'Valmiki Wildlife Sanctuary Notified',
      description: 'Covering 545.15 sq km of pristine forests along the Nepal border and Gandak river in West Champaran.'
    },
    {
      year: '1989–90',
      title: 'Inducted into Project Tiger',
      description: 'Valmiki was designated as India’s 18th Tiger Reserve, bringing focused federal conservation funding and protection mandates.'
    },
    {
      year: '1990',
      title: 'Valmiki National Park Constituted',
      description: '335.65 sq km core notified as a National Park to establish strict disturbance-free breeding zones for apex carnivores.'
    },
    {
      year: '2012–15',
      title: 'Modern Technological Modernization',
      description: 'Deployment of 24/7 camera-trap grids, solar-powered watch posts, and frontline GPS patrol monitoring.'
    },
    {
      year: '2020–26',
      title: 'Transboundary Landscape & Prey Enrichment Era',
      description: 'Over 350 hectares of grassland restored; formal joint transboundary coordination protocols with Nepal’s Chitwan National Park.'
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>India's 18th Tiger Reserve Legacy</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Project Tiger at Valmiki: The Great Revival
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          From the brink of localized extirpation in the early 2000s to one of India’s fastest-growing tiger sanctuaries, Valmiki Tiger Reserve stands as a beacon of scientific habitat management and frontline ranger dedication.
        </p>
      </div>

      {/* Population Growth Trajectory Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-2">
          <div>
            <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">
              NTCA & State Forest Dept Official Census Data
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              VTR Tiger Population Trajectory (2006 – 2026)
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-stone-500 block">Growth Rate</span>
            <span className="font-display text-xl font-bold text-emerald-700">+575% Increase</span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-4 pt-2">
          {censusData.map((item) => {
            const percentage = (item.count / 60) * 100;
            return (
              <div key={item.year} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-stone-800 text-sm">{item.year}</span>
                  <span className="font-bold text-amber-600 text-sm">{item.count} Tigers</span>
                </div>
                <div className="w-full h-8 bg-stone-100 rounded-xl overflow-hidden p-1 flex items-center">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500 rounded-lg flex items-center justify-end pr-2 text-white font-mono text-xs font-bold transition-all duration-1000 shadow-sm"
                  >
                    {item.count}
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 italic pl-1">
                  {item.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Pillars of Success */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Trees className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">Grassland Rejuvenation</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Elimination of invasive weeds and systematic planting of palatable Terai grasses expanded ungulate prey (chital, sambar, and gaur) populations.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">Perennial Waterholes</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Over 60 solar-powered submersible pumps and earthen check-dams ensure year-round water in dry forest interiors, curbing herbivore straying.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">M-STrIPES Patrolling</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Frontline forest staff log geo-tagged spatial patrols on mobile devices, ensuring systematic coverage of remote border ridges and ravines.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">Community Coexistence</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Van Suraksha Samitis and solar power fencing around fringe villages lowered human-wildlife encounters and converted local youth into tiger protectors.
          </p>
        </div>
      </div>

      {/* Historical Milestones Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Key Milestones in VTR Conservation History
        </h2>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative flex items-start space-x-4 pl-2">
              <div className="w-4 h-4 rounded-full bg-[#0B3D2E] border-4 border-white shadow flex-shrink-0 mt-1 z-10"></div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-700">{m.year}</span>
                </div>
                <h4 className="font-display font-bold text-base text-stone-900">{m.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
