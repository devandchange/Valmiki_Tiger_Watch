import React, { useState, useMemo } from 'react';
import { 
  Users, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag, 
  Trees,
  CheckCircle2,
  Search,
  Award,
  Calendar,
  MapPin,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { GrassrootsProtectorStory } from '../../types';
import { EngagementBar } from '../EngagementBar';

export const CommunitySection: React.FC = () => {
  const { grassrootsProtectors = [], updateContentVotes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProtector, setSelectedProtector] = useState<GrassrootsProtectorStory | null>(null);

  const categories = ['All', 'Tracker', 'Patroller', 'Guardian', 'Riverine', 'Community'];

  const publishedProtectors = useMemo(() => {
    return (grassrootsProtectors || []).filter(p => 
      !p.verificationStatus || p.verificationStatus === 'published' || p.verificationStatus === 'verified'
    );
  }, [grassrootsProtectors]);

  const filteredProtectors = useMemo(() => {
    return publishedProtectors.filter(p => {
      const roleStr = String(p.role ?? '').toLowerCase();
      const matchesCategory = selectedCategory === 'All' || roleStr.includes(String(selectedCategory ?? '').toLowerCase());
      const query = String(searchQuery ?? '').toLowerCase().trim();
      const achievementsStr = Array.isArray(p.achievements) ? p.achievements.map(a => String(a ?? '')).join(' ') : '';
      const matchesQuery = !query || 
        String(p.protectorName ?? '').toLowerCase().includes(query) ||
        String(p.location ?? '').toLowerCase().includes(query) ||
        String(p.role ?? '').toLowerCase().includes(query) ||
        String(p.storyTitle ?? '').toLowerCase().includes(query) ||
        String(p.shortIntro ?? '').toLowerCase().includes(query) ||
        String(p.fullStory ?? '').toLowerCase().includes(query) ||
        String(p.verifiedBy ?? '').toLowerCase().includes(query) ||
        achievementsStr.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [publishedProtectors, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Indigenous Guardians & Frontline Champions</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Community Protectors & Tribal Heritage
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          No tiger conservation model succeeds without the daily courage and traditional wisdom of frontline communities. Honor the indigenous Tharu trackers, local forest watchers, and anti-poaching champions safeguarding the Valmiki landscape.
        </p>
      </div>

      {/* SECTION 1: GRASSROOTS PROTECTORS SHOWCASE */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h2 className="font-display text-2xl font-bold text-stone-900">
                Grassroots Protectors of Valmiki
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Verified profiles of traditional trackers, youth patrols, and conflict mitigation heroes.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protectors..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0B3D2E] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Protectors Grid */}
        {filteredProtectors.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500">
            No community protector profiles found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProtectors.map((protector) => {
              return (
                <article
                  key={protector.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Name, Verified Badge & Role */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-display font-bold text-lg text-stone-900">
                            {protector.protectorName}
                          </h3>
                          {(protector.verificationStatus === 'verified' || protector.verificationStatus === 'published') && (
                            <span 
                              title={`Verified by ${protector.verifiedBy || 'VTR Field Directorate'}`}
                              className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md font-semibold"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-900 font-medium mt-0.5">
                          {protector.role}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold flex-shrink-0">
                        {protector.verificationStatus}
                      </span>
                    </div>

                    {/* Meta info: Location & Date */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-mono">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{protector.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Documented: {new Date(protector.date || protector.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    {/* Story Title & Short Intro */}
                    {protector.storyTitle && (
                      <h4 className="font-display font-bold text-sm text-stone-800 line-clamp-1">
                        {protector.storyTitle}
                      </h4>
                    )}
                    <p className="text-xs text-stone-700 leading-relaxed line-clamp-3">
                      {protector.shortIntro}
                    </p>

                    {/* Key Achievement bullet */}
                    {Array.isArray(protector.achievements) && protector.achievements.length > 0 && (
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 font-mono">
                          Key Achievement:
                        </div>
                        <div className="text-xs text-stone-700 line-clamp-2">
                          {protector.achievements[0]}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-stone-100">
                    {/* Native Engagement Bar (Like / Dislike / Share) */}
                    <EngagementBar
                      contentType="protector"
                      contentId={protector.id}
                      title={`${protector.protectorName} — Valmiki Tiger Watch Guardian`}
                      text={`${protector.protectorName} (${protector.role}): ${protector.shortIntro}`}
                      initialLikes={protector.likes || 0}
                      initialDislikes={protector.dislikes || 0}
                      onVote={(type, newLikes, newDislikes) => {
                        updateContentVotes('protector', protector.id, newLikes, newDislikes);
                      }}
                    />

                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedProtector(protector)}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>Read Guardian Story</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: INDIGENOUS HERITAGE & TRADITIONS */}
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

      {/* SECTION 3: SUSTAINABLE LIVELIHOODS & SIKKI CRAFTS SHOWCASE */}
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

      {/* DETAILED PROTECTOR STORY MODAL */}
      {selectedProtector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold uppercase">
                    {selectedProtector.verificationStatus}
                  </span>
                  {(selectedProtector.verificationStatus === 'verified' || selectedProtector.verificationStatus === 'published') && (
                    <span className="inline-flex items-center text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      <span>Verified Guardian</span>
                    </span>
                  )}
                </div>
                <h2 className="font-display font-bold text-2xl text-stone-900 mt-2">
                  {selectedProtector.protectorName}
                </h2>
                <p className="text-xs text-stone-600 font-mono mt-0.5">
                  {selectedProtector.role}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProtector(null)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              {/* Photo if present */}
              {selectedProtector.photograph && (
                <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img
                    src={selectedProtector.photograph}
                    alt={selectedProtector.protectorName}
                    referrerPolicy="no-referrer"
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                  {(selectedProtector.photoCaption || selectedProtector.photographerCredit) && (
                    <div className="p-2.5 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-600 flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span>{selectedProtector.photoCaption}</span>
                      {selectedProtector.photographerCredit && (
                        <span className="font-mono text-stone-500 text-[10px]">Photo: {selectedProtector.photographerCredit}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5 font-mono text-xs">
                <div><strong>Location:</strong> {selectedProtector.location}</div>
                <div><strong>Documented Date:</strong> {selectedProtector.date}</div>
                {selectedProtector.verifiedBy && (
                  <div><strong>Verified By:</strong> {selectedProtector.verifiedBy} {selectedProtector.verifiedDate ? `(${selectedProtector.verifiedDate})` : ''}</div>
                )}
                {selectedProtector.verificationNotes && (
                  <div><strong>Verification Notes:</strong> {selectedProtector.verificationNotes}</div>
                )}
                {selectedProtector.source && (
                  <div>
                    <strong>Source:</strong>{' '}
                    {selectedProtector.sourceUrl ? (
                      <a href={selectedProtector.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline inline-flex items-center gap-1">
                        {selectedProtector.source} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      selectedProtector.source
                    )}
                  </div>
                )}
              </div>

              {selectedProtector.storyTitle && (
                <div className="text-base font-bold font-display text-stone-900">
                  {selectedProtector.storyTitle}
                </div>
              )}

              <div className="space-y-2">
                <strong className="text-stone-900 block text-sm font-semibold">Conservation Summary:</strong>
                <p className="leading-relaxed bg-white p-4 rounded-2xl border border-stone-200">
                  {selectedProtector.shortIntro}
                </p>
              </div>

              {selectedProtector.fullStory && (
                <div className="space-y-2">
                  <strong className="text-stone-900 block text-sm font-semibold">Full Story:</strong>
                  <div className="leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200 whitespace-pre-line text-stone-700">
                    {selectedProtector.fullStory}
                  </div>
                </div>
              )}

              {Array.isArray(selectedProtector.achievements) && selectedProtector.achievements.length > 0 && (
                <div className="space-y-2">
                  <strong className="text-stone-900 block text-sm font-semibold">Key Achievements & Milestones:</strong>
                  <ul className="list-disc list-inside space-y-1.5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    {selectedProtector.achievements.map((h, i) => (
                      <li key={i} className="leading-relaxed">{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Engagement Bar inside Protector Modal */}
              <div className="pt-2 border-t border-stone-200">
                <EngagementBar
                  contentType="protector"
                  contentId={selectedProtector.id}
                  title={`${selectedProtector.protectorName} — Valmiki Tiger Watch Guardian`}
                  text={`${selectedProtector.protectorName} (${selectedProtector.role}): ${selectedProtector.shortIntro}`}
                  initialLikes={selectedProtector.likes || 0}
                  initialDislikes={selectedProtector.dislikes || 0}
                  onVote={(type, newLikes, newDislikes) => {
                    updateContentVotes('protector', selectedProtector.id, newLikes, newDislikes);
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProtector(null)}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-200 transition cursor-pointer"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySection;
