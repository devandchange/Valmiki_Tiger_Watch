import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  Shield, 
  Trees, 
  Compass, 
  Newspaper, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Eye, 
  Download,
  Activity,
  Calendar,
  Layers
} from 'lucide-react';

interface HomeSectionProps {
  onOpenInstallGuide: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onOpenInstallGuide }) => {
  const { 
    setActiveTab, 
    tigers, 
    news, 
    alerts, 
    wildlife, 
    sightings,
    setSelectedTiger,
    setSelectedNews,
    canInstallPwa,
    installPwa
  } = useData();

  const activeAlerts = alerts.filter(a => a.active);
  const featuredTiger = tigers[0] || {
    id: 'vtr-t07',
    code: 'VTR-T07',
    name: 'Someshwar Dominant',
    sex: 'Male',
    approxAge: '6.5 Years',
    territoryZone: 'Madanpur & Gonauli Range',
    status: 'Resident Dominant',
    markings: 'Distinct inverted spear stripe on right flank and prominent chevron above left eye',
    photoUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
    cameraTrapRecords: 48,
    lastVerifiedDate: '2026-03-15'
  };
  const featuredTigers = tigers.slice(0, 3);
  const latestNews = news.slice(0, 3);
  const keyWildlife = wildlife.slice(0, 4);

  return (
    <div className="space-y-12 animate-fade-in pb-8">
      {/* Editorial 3-Column Broadsheet Hero Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Featured Tiger Profile Dossier */}
        <div className="lg:col-span-4 bg-white border border-[#0B3D2E]/15 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0B3D2E]/60 font-mono">
                Featured Profile
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded font-bold">
                ID: {featuredTiger.code}
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-[#F5F1E6] border border-[#0B3D2E]/10">
              <img 
                src={featuredTiger.photoUrl} 
                alt={featuredTiger.name || featuredTiger.code}
                className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#0B3D2E] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                {featuredTiger.status}
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                {featuredTiger.name}
              </h3>
              <p className="text-xs font-mono text-[#F27D26] font-semibold">
                Territory: {featuredTiger.territoryZone}
              </p>
            </div>

            {/* Dossier Metadata Table */}
            <div className="space-y-2 border-t border-b border-[#0B3D2E]/10 py-3 text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-[#0B3D2E]/60">Sex & Est. Age</span>
                <span className="font-mono font-semibold text-[#0B3D2E]">{featuredTiger.sex} • {featuredTiger.approxAge}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#0B3D2E]/60">Verified Captures</span>
                <span className="font-mono font-semibold text-[#0B3D2E]">{featuredTiger.cameraTrapRecords} Camera Traps</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#0B3D2E]/60">Last Field Log</span>
                <span className="font-mono text-[#0B3D2E]">{featuredTiger.lastVerifiedDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedTiger(featuredTiger);
              setActiveTab('tigers');
            }}
            className="mt-4 w-full py-2.5 border border-[#0B3D2E] hover:bg-[#0B3D2E] hover:text-white text-[#0B3D2E] rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            <span>Read Full Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Column: Broadsheet Headline & Lead Editorial */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F27D26] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#F27D26]"></span>
              <span>Terai-Arc Conservation Chronicle</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-normal leading-[1.1] text-[#0B3D2E]">
              Preserving Bihar&apos;s <br />
              <span className="italic font-serif text-[#F27D26]">Royal Legacy.</span>
            </h1>

            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
              An independent conservation and documentation platform safeguarding the Royal Bengal Tigers of Valmiki Tiger Reserve (VTR), Bihar, India. Fostering science-led conservation, camera-trap telemetry, and community vigilance along the Gandak basin.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('tigers')}
                className="bg-[#0B3D2E] hover:bg-[#07271D] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>Explore Tigers</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className="bg-white hover:bg-[#F5F1E6] text-[#0B3D2E] border border-[#0B3D2E]/20 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Newspaper className="w-3.5 h-3.5 text-[#0B3D2E]" />
                <span>Latest Dispatches</span>
              </button>

              {canInstallPwa && (
                <button
                  onClick={installPwa}
                  className="bg-[#F27D26] hover:bg-[#d96716] text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
              )}
            </div>
          </div>

          {/* Editorial News Snapshot Cards */}
          <div className="border-t border-[#0B3D2E]/15 pt-5 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0B3D2E]/60 block font-mono">
              Latest Verified Dispatch
            </span>
            {latestNews[0] && (
              <div 
                onClick={() => {
                  setSelectedNews(latestNews[0]);
                  setActiveTab('news');
                }}
                className="bg-white border border-[#0B3D2E]/10 rounded-xl p-4 cursor-pointer hover:border-[#F27D26] transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-[#0B3D2E]/60 mb-1 font-mono">
                  <span>{latestNews[0].publicationDate}</span>
                  <span className="text-[#F27D26] font-semibold">{latestNews[0].sourceCategory}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#0B3D2E] line-clamp-2">
                  {latestNews[0].headline}
                </h4>
                <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 mt-1">
                  {latestNews[0].summary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep Green Editorial Bulletin Panel */}
        <div className="lg:col-span-3 bg-[#0B3D2E] text-[#F5F1E6] rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Active Advisory Callout */}
            {activeAlerts.length > 0 ? (
              <div className="bg-[#F27D26] text-black rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-black" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Advisory Active
                  </span>
                </div>
                <p className="text-xs font-bold leading-tight">
                  {activeAlerts[0].title}
                </p>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className="text-[10px] font-bold uppercase tracking-wider underline mt-2 block"
                >
                  Read Range Notice →
                </button>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F27D26] block mb-1">
                  Range Status
                </span>
                <p className="text-xs font-semibold text-white">
                  Normal Range Operations • All 8 Forest Ranges Active
                </p>
              </div>
            )}

            {/* Biodiversity Key Index */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F27D26] font-bold block">
                VTR Key Indicators
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-2 border-[#F27D26] pl-3 py-0.5">
                  <div className="font-serif text-2xl font-bold text-white">54+</div>
                  <div className="text-[10px] font-mono text-[#F5F1E6]/70 uppercase">Tigers (2024)</div>
                </div>

                <div className="border-l-2 border-[#F27D26] pl-3 py-0.5">
                  <div className="font-serif text-2xl font-bold text-white">899</div>
                  <div className="text-[10px] font-mono text-[#F5F1E6]/70 uppercase">Sq Km Sanctuary</div>
                </div>

                <div className="border-l-2 border-[#F27D26] pl-3 py-0.5">
                  <div className="font-serif text-2xl font-bold text-white">250+</div>
                  <div className="text-[10px] font-mono text-[#F5F1E6]/70 uppercase">Avian Species</div>
                </div>

                <div className="border-l-2 border-[#F27D26] pl-3 py-0.5">
                  <div className="font-serif text-2xl font-bold text-white">TAL</div>
                  <div className="text-[10px] font-mono text-[#F5F1E6]/70 uppercase">Chitwan Link</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Perspective & Map CTA */}
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={() => setActiveTab('map')}
              className="w-full bg-white/10 hover:bg-white hover:text-[#0B3D2E] text-white border border-white/20 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Interactive Reserve Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Tigers Gallery Section */}
      <section className="space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-2 border-b border-[#0B3D2E]/15 pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#F27D26] font-bold tracking-[0.25em] uppercase">
              Field Telemetry & Monitoring
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3D2E]">
              Featured Tigers of VTR
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('tigers')}
            className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E] hover:text-[#F27D26] flex items-center gap-1 font-mono transition-colors"
          >
            <span>All Profiles ({tigers.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTigers.map((tiger) => (
            <div
              key={tiger.id}
              onClick={() => {
                setSelectedTiger(tiger);
                setActiveTab('tigers');
              }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#0B3D2E]/15 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-[#F5F1E6]">
                <img
                  src={tiger.photoUrl}
                  alt={tiger.name || tiger.code}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0B3D2E] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  {tiger.code}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 text-[#0B3D2E] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {tiger.status}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0B3D2E] group-hover:text-[#F27D26] transition-colors">
                    {tiger.name || tiger.code}
                  </h3>
                  <p className="text-xs text-[#0B3D2E]/60 font-mono mt-0.5">
                    {tiger.sex} • {tiger.approxAge} • {tiger.territoryZone}
                  </p>
                  <p className="text-xs text-[#1A1A1A]/80 line-clamp-2 mt-2 leading-relaxed">
                    {tiger.markings}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0B3D2E]/10 flex items-center justify-between text-xs text-[#0B3D2E]/70 font-mono">
                  <span className="flex items-center text-[#0B3D2E] font-medium">
                    <CheckCircle className="w-3.5 h-3.5 mr-1 text-[#F27D26]" />
                    {tiger.cameraTrapRecords} Captures
                  </span>
                  <span className="text-[11px]">
                    {tiger.lastVerifiedDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified News & Reports Grid */}
      <section className="space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-2 border-b border-[#0B3D2E]/15 pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#F27D26] font-bold tracking-[0.25em] uppercase">
              Scientific & Field Reporting
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3D2E]">
              Verified VTR Dispatches
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('news')}
            className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E] hover:text-[#F27D26] flex items-center gap-1 font-mono transition-colors"
          >
            <span>All News ({news.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedNews(item);
                setActiveTab('news');
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#0B3D2E]/15 p-5 flex flex-col justify-between cursor-pointer transition-all hover:border-[#0B3D2E]"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#0B3D2E]/60 text-[11px]">{item.publicationDate}</span>
                  <span className="bg-[#F5F1E6] text-[#F27D26] font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                    {item.sourceCategory}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#0B3D2E] line-clamp-2 hover:text-[#F27D26] transition-colors">
                  {item.headline}
                </h3>

                <p className="text-xs text-[#1A1A1A]/80 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#0B3D2E]/10 flex items-center justify-between text-xs">
                <span className="text-[#0B3D2E]/60 text-[11px] truncate max-w-[170px] font-mono">
                  {item.source}
                </span>
                <span className="text-[#F27D26] font-bold flex items-center text-xs uppercase tracking-wider font-mono">
                  Read <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Biodiversity Highlights */}
      <section className="bg-[#0B3D2E] rounded-3xl p-6 sm:p-10 text-white space-y-6 border border-[#0B3D2E]">
        <div className="flex flex-wrap justify-between items-end gap-2">
          <div>
            <span className="text-[10px] font-mono text-[#F27D26] font-bold tracking-[0.25em] uppercase">
              Flora & Fauna of Someshwar Foothills
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              VTR Biodiversity Spotlight
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F1E6]/80 mt-1 max-w-xl">
              Beyond the Royal Bengal Tiger, Valmiki preserves co-predators, riverine reptiles, raptors, and rare ungulates across pristine sal canopies.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('wildlife')}
            className="px-4 py-2 bg-white text-[#0B3D2E] hover:bg-[#F27D26] hover:text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all"
          >
            Explore Species Index
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {keyWildlife.map((spec) => (
            <div
              key={spec.id}
              onClick={() => setActiveTab('wildlife')}
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 p-3 hover:border-[#F27D26] transition-all cursor-pointer group"
            >
              <div className="h-28 rounded-xl overflow-hidden mb-2.5 bg-black/20">
                <img
                  src={spec.image}
                  alt={spec.commonName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#F27D26] uppercase font-bold">{spec.category}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    spec.iucnStatus === 'CR' ? 'bg-red-500/30 text-red-200' :
                    spec.iucnStatus === 'EN' ? 'bg-[#F27D26]/30 text-amber-200' :
                    'bg-emerald-500/30 text-emerald-200'
                  }`}>
                    {spec.iucnStatus}
                  </span>
                </div>
                <h4 className="font-serif font-semibold text-sm text-white group-hover:text-[#F27D26] transition-colors">
                  {spec.commonName}
                </h4>
                <p className="text-[11px] text-[#F5F1E6]/60 italic truncate">
                  {spec.scientificName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Participation & Education Callouts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sighting Reporting Callout */}
        <div className="bg-white rounded-2xl p-6 border border-[#0B3D2E]/15 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-[#0B3D2E] text-[10px] font-mono font-bold uppercase tracking-widest">
              <Eye className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Community Observation</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0B3D2E]">
              Submit a Wildlife Observation
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
              Help document VTR biodiversity. Submit non-invasive observations from designated safari zones. All reports are scrubbed of exact coordinates to protect wildlife.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-[#0B3D2E]/60">
              {sightings.length} Verified Records
            </span>
            <button
              onClick={() => setActiveTab('sightings')}
              className="px-4 py-2 bg-[#0B3D2E] hover:bg-[#07271D] text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
            >
              <span>Submit Report</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F27D26]" />
            </button>
          </div>
        </div>

        {/* Education & Track Guide */}
        <div className="bg-white rounded-2xl p-6 border border-[#0B3D2E]/15 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-[#F27D26] text-[10px] font-mono font-bold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Field Education & Tools</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0B3D2E]">
              Pugmark & Track Identification
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
              Discover how field rangers differentiate male and female tiger pugmarks, study camera-trap telemetry, and learn ethical safari protocols.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-[#0B3D2E]/60">
              Interactive Field Tool
            </span>
            <button
              onClick={() => setActiveTab('education')}
              className="px-4 py-2 bg-[#0B3D2E] hover:bg-[#07271D] text-[#F27D26] rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
