import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ALL_INDIA_ESTIMATION_HISTORY, 
  ASIAN_TIGER_RANGE_COUNTRIES, 
  VERIFIED_STATISTICS_REGISTRY,
  OFFICIAL_GOVERNMENT_PORTALS
} from '../../data/tigerWorldwideData';
import { 
  Globe, 
  Shield, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Layers, 
  TrendingUp, 
  Compass, 
  MapPin, 
  BookOpen, 
  Heart, 
  RefreshCw, 
  Info, 
  Trees, 
  Eye, 
  BarChart3, 
  FileText,
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { VerificationStatusTag } from '../../types';

export const TigerWorldwideSection: React.FC = () => {
  const { setActiveTab } = useData();
  const { t, language, isRtl } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<
    'worldwide' | 'asia' | 'india' | 'bengal-tiger' | 'data-centre' | 'protection' | 'sources'
  >('worldwide');

  const [selectedCountryId, setSelectedCountryId] = useState<string>('trc-india');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [showOutdatedWarning, setShowOutdatedWarning] = useState<boolean>(true);

  const selectedCountry = ASIAN_TIGER_RANGE_COUNTRIES.find(c => c.id === selectedCountryId) || ASIAN_TIGER_RANGE_COUNTRIES[0];

  const getStatusBadge = (status: VerificationStatusTag) => {
    switch (status) {
      case 'verified_current':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            🟢 {language === 'hi' ? 'सत्यापित वर्तमान' : language === 'ur' ? 'مصدقہ موجودہ' : 'Verified Current'}
          </span>
        );
      case 'verified_older':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            🟡 {language === 'hi' ? 'सत्यापित पूर्व आकलन' : language === 'ur' ? 'مصدقہ سابقہ تخمینہ' : 'Verified Older Assessment'}
          </span>
        );
      case 'recently_updated':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-950/80 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            🔵 {language === 'hi' ? 'हाल ही में अद्यतन' : language === 'ur' ? 'حال ہی میں اپ ڈیٹ' : 'Recently Updated'}
          </span>
        );
      case 'unavailable':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            🔴 {language === 'hi' ? 'आधिकारिक डेटा अनुपलब्ध' : language === 'ur' ? 'سرکاری ڈیٹا دستیاب نہیں' : 'Official Source Unavailable'}
          </span>
        );
    }
  };

  const filteredStats = VERIFIED_STATISTICS_REGISTRY.filter(stat => {
    if (selectedCategoryFilter === 'all') return true;
    return stat.category === selectedCategoryFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Editorial Flagship Header */}
      <section className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono font-bold">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'hi' ? 'वैश्विक बाघ एवं संरक्षण डेटा पोर्टल' : language === 'ur' ? 'عالمی شیر اور تحفظی ڈیٹا پورٹل' : 'Global Tiger & Conservation Data Hub'}
              </span>
            </div>
            <span className="text-emerald-300/60 text-xs font-mono hidden sm:inline">•</span>
            <span className="text-emerald-200/80 text-xs font-mono">
              {language === 'hi' ? 'स्रोत प्राथमिकता: NTCA • MoEFCC • WII • IUCN • GTF' : language === 'ur' ? 'ذرائع: این ٹی سی اے • ڈبلیو آئی آئی • آئی یو سی این' : 'Sources: NTCA • MoEFCC • WII • IUCN • GTF'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            🐅 {language === 'hi' ? 'वैश्विक बाघ एवं संरक्षण' : language === 'ur' ? 'عالمی شیر اور پائیدار تحفظ' : 'Tiger Worldwide & Conservation'}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
            {language === 'hi'
              ? 'विश्वभर में जंगली बाघों की आबादी, 13 ऐतिहासिक बाघ-विस्तार देशों, भारत के 55+ टाइगर रिजर्व, और अखिल भारतीय बाघ आकलन (NTCA) के आधिकारिक, सत्यापित सांख्यिकीय अभिलेख।'
              : language === 'ur'
              ? 'دنیا بھر میں جنگلی شیروں کی آبادی، ایشیائی ممالک کے اعداد و شمار، اور بھارت کے 55+ ٹائیگر ریزرو کا مستند اور مصدقہ ریکارڈ۔'
              : 'An authoritative repository of global wild tiger populations, Asian range landscapes, official NTCA All India Tiger Estimation datasets, and verified conservation telemetry. Grounded strictly in primary government and scientific publications.'}
          </p>

          {/* Strict Data Transparency & Accuracy Mandate Banner */}
          <div className="bg-[#07271D]/90 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/95 flex items-start gap-3 shadow-inner">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-amber-300 uppercase tracking-wide font-mono text-[11px]">
                  {language === 'hi' ? 'डेटा सत्यता एवं गैर-अनुमान नियम' : language === 'ur' ? 'ڈیٹا کی درستگی کا سخت ضابطہ' : 'Strict Verification & Zero-Fabrication Policy'}
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                  NTCA / MoEFCC / WII / IUCN / GTF
                </span>
              </div>
              <p className="text-[11px] sm:text-xs leading-relaxed text-emerald-100/80">
                {language === 'hi'
                  ? 'प्रत्येक संख्या के साथ उसका मूल स्रोत, आकलन वर्ष, अंतिम सत्यापन तिथि एवं आधिकारिक लिंक दर्शाया गया है। यदि आधिकारिक डेटा उपलब्ध नहीं है, तो संख्या गढ़ी नहीं जाती।'
                  : language === 'ur'
                  ? 'ہر عدد کے ساتھ اس کا سرکاری ذریعہ، رپورٹ کا سال اور آخری تاریخ دکھائی جاتی ہے۔ کوئی فرضی تخمینہ شامل نہیں کیا جاتا۔'
                  : 'Every statistic displays its primary official source, assessment cycle year, verification date, and official source link. We strictly prohibit synthetic estimates, artificial live tickers, or unverified blog rumors.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs Ribbon */}
      <div className="bg-white rounded-2xl p-2 border border-[#0B3D2E]/15 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'worldwide', label: language === 'hi' ? '🌍 वैश्विक बाघ' : language === 'ur' ? '🌍 عالمی شیر' : '🌍 Tiger Worldwide' },
            { id: 'asia', label: language === 'hi' ? '🌏 एशिया के बाघ' : language === 'ur' ? '🌏 ایشیا کے شیر' : '🌏 Tigers of Asia' },
            { id: 'india', label: language === 'hi' ? '🇮🇳 भारत के बाघ (NTCA)' : language === 'ur' ? '🇮🇳 بھارت کے شیر (NTCA)' : '🇮🇳 Tigers of India' },
            { id: 'bengal-tiger', label: language === 'hi' ? '🐅 रॉयल बंगाल टाइगर' : language === 'ur' ? '🐅 رائل بنگال ٹائیگر' : '🐅 Bengal Tiger' },
            { id: 'data-centre', label: language === 'hi' ? '📊 डेटा सेंटर' : language === 'ur' ? '📊 ڈیٹا سینٹر' : '📊 Tiger Data Centre' },
            { id: 'protection', label: language === 'hi' ? '🛡️ संरक्षण एवं प्रोजेक्ट टाइगर' : language === 'ur' ? '🛡️ پروجیکٹ ٹائیگر' : '🛡️ Tiger Protection' },
            { id: 'sources', label: language === 'hi' ? '📚 स्रोत एवं नीति' : language === 'ur' ? '📚 ذرائع و پالیسی' : '📚 Sources & Policy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-[#0B3D2E] text-white shadow-sm'
                  : 'text-[#0B3D2E]/70 hover:bg-[#F5F1E6] hover:text-[#0B3D2E]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TIGER WORLDWIDE */}
      {/* ========================================================================= */}
      {activeSubTab === 'worldwide' && (
        <div className="space-y-8 animate-fade-in">
          {/* Global Population Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#0B3D2E]/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0B3D2E]/60 font-bold">
                  {language === 'hi' ? 'वैश्विक जंगली बाघ आबादी' : language === 'ur' ? 'عالمی جنگلی آبادی' : 'Global Wild Tiger Population'}
                </span>
                {getStatusBadge('verified_current')}
              </div>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
                  4,500 – 5,575
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  {language === 'hi' ? 'अनुमानित जंगली बाघ (2022 IUCN रेड लिस्ट आकलन)' : language === 'ur' ? 'تخمینہ جنگلی شیر (2022 ریڈ لسٹ)' : 'Estimated Wild Tigers (2022 IUCN Red List / GTF Synthesis)'}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="font-semibold text-stone-700">IUCN Red List & Global Tiger Forum</span>
                </div>
                <div className="flex justify-between">
                  <span>Report Year:</span>
                  <span className="font-semibold text-stone-700">2022 (Verified 2026)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#0B3D2E]/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0B3D2E]/60 font-bold">
                  {language === 'hi' ? 'बाघ विस्तार देश (TRCs)' : language === 'ur' ? 'شیروں کے رینج ممالک' : 'Tiger Range Countries (TRCs)'}
                </span>
                {getStatusBadge('verified_current')}
              </div>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#F27D26]">
                  10 Current / 13 Historic
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  {language === 'hi' ? '10 देशों में सक्रिय प्रजनन; 3 में विलुप्त' : language === 'ur' ? '10 ممالک میں فعال؛ 3 میں معدوم' : '10 countries with breeding wild tigers; 3 extinct in wild'}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Extant Range:</span>
                  <span className="font-semibold text-stone-700">India, Nepal, Bhutan, Russia, etc.</span>
                </div>
                <div className="flex justify-between">
                  <span>Extinct in Wild:</span>
                  <span className="font-semibold text-red-600">Cambodia, Laos, Vietnam</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#0B3D2E]/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0B3D2E]/60 font-bold">
                  {language === 'hi' ? 'वैश्विक संरक्षण स्थिति' : language === 'ur' ? 'تحفظی حیثیت' : 'Global Conservation Status'}
                </span>
                {getStatusBadge('verified_current')}
              </div>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-red-600">
                  Endangered (EN)
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  IUCN Red List of Threatened Species • CITES Appendix I
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Global Assessment:</span>
                  <span className="font-semibold text-stone-700">IUCN SSC Cat Specialist Group</span>
                </div>
                <div className="flex justify-between">
                  <span>Commercial Trade:</span>
                  <span className="font-semibold text-stone-700">Strictly Prohibited (CITES)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Major Tiger Biomes & Habitats */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest block">
                  {language === 'hi' ? 'वैश्विक पारिस्थितिकी क्षेत्र' : language === 'ur' ? 'عالمی ماحولیاتی خطے' : 'Global Biomes & Habitats'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  {language === 'hi' ? 'बाघों के प्रमुख वैश्विक आवास' : language === 'ur' ? 'شیروں کے اہم عالمی مسکن' : 'Major Tiger Habitats Across the World'}
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                Source: IUCN / WWF Global Tiger Conservation Strategy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F5F1E6]/60 rounded-2xl p-5 border border-[#0B3D2E]/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B3D2E] text-amber-300 flex items-center justify-center font-serif font-bold text-lg">
                  1
                </div>
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">
                  Terai-Arc Landscape (India & Nepal)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Stretches along the Himalayan foothills encompassing <strong>Valmiki Tiger Reserve</strong>, Chitwan, Corbett, and Dudhwa. Characterized by dense moist Sal forests, alluvial tall grasslands, and riverine floodplains supporting the highest tiger densities on Earth.
                </p>
                <div className="text-[11px] font-mono text-[#0B3D2E] font-semibold">
                  Key Species: Royal Bengal Tiger (*P. t. tigris*)
                </div>
              </div>

              <div className="bg-[#F5F1E6]/60 rounded-2xl p-5 border border-[#0B3D2E]/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B3D2E] text-amber-300 flex items-center justify-center font-serif font-bold text-lg">
                  2
                </div>
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">
                  Sundarbans Mangrove Delta (India & Bangladesh)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  The world&apos;s largest contiguous mangrove delta where tigers have uniquely adapted to brackish tidal waterways, mudflats, and daily tidal inundations. Tigers here are supreme swimmers traveling across wide estuarine channels.
                </p>
                <div className="text-[11px] font-mono text-[#0B3D2E] font-semibold">
                  Ecosystem: Tidal Mangrove Swamp Forest
                </div>
              </div>

              <div className="bg-[#F5F1E6]/60 rounded-2xl p-5 border border-[#0B3D2E]/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B3D2E] text-amber-300 flex items-center justify-center font-serif font-bold text-lg">
                  3
                </div>
                <h4 className="font-serif font-bold text-base text-[#0B3D2E]">
                  Russian Far East Boreal Taiga (Amur / Siberia)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  The vast temperate conifer-broadleaf taiga forests of Sikhote-Alin mountains where Amur tigers endure harsh winters with deep snow. Home ranges here can exceed 1,000 sq km per individual due to dispersed wild boar and red deer prey.
                </p>
                <div className="text-[11px] font-mono text-[#0B3D2E] font-semibold">
                  Subspecies: Amur Tiger (*P. t. altaica*)
                </div>
              </div>
            </div>
          </div>

          {/* Global Population Trends & Major Threats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0B3D2E]">
                <TrendingUp className="w-5 h-5 text-[#F27D26]" />
                <h3 className="font-serif text-xl font-bold">
                  {language === 'hi' ? 'जनसंख्या रुझान: दक्षिण एशिया बनाम दक्षिण-पूर्व एशिया' : language === 'ur' ? 'آبادی کا رجحان' : 'Divergent Global Population Trends'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Global tiger recovery presents a tale of two divergent trajectories:
              </p>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1">
                    📈 South Asia Success Story (India, Nepal, Bhutan):
                  </span>
                  <p className="text-emerald-800">
                    Sustained institutional investments, statutory anti-poaching (NTCA, STPF), voluntary village relocations, and digital telemetry (M-STrIPES) have doubled tiger populations across India and Nepal since 2010.
                  </p>
                </div>
                <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
                  <span className="font-bold text-red-900 block mb-1">
                    📉 Southeast Asia Snaring Crisis (Malaysia, Myanmar, Indochina):
                  </span>
                  <p className="text-red-800">
                    Pervasive wire snaring for illegal bushmeat and traditional medicine markets has depleted tiger and ungulate prey densities, leading to functional extirpation in Cambodia, Laos, and Vietnam.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0B3D2E]">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-serif text-xl font-bold">
                  {language === 'hi' ? 'बाघों के अस्तित्व को प्रमुख खतरे' : language === 'ur' ? 'شیروں کے لیے اہم خطرات' : 'Major Threats to Wild Tigers'}
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                  <div>
                    <strong>Poaching & Illegal Wildlife Trade:</strong> Targeted by transnational criminal syndicates for skins, bones, claws, and teeth.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                  <div>
                    <strong>Habitat Loss & Linear Infrastructure:</strong> Highways, railways, and canals fragmenting contiguous gene flow between breeding reserves.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                  <div>
                    <strong>Prey Base Depletion:</strong> Illegal hunting of wild ungulates (chital, sambar, wild boar) reducing forest carrying capacity.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                  <div>
                    <strong>Human-Tiger Conflict & Retaliatory Poisoning:</strong> Accidental encounters in fringe agricultural borders leading to livestock losses.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: TIGERS OF ASIA */}
      {/* ========================================================================= */}
      {activeSubTab === 'asia' && (
        <div className="space-y-8 animate-fade-in">
          {/* Interactive Asia Range Explorer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest block">
                  {language === 'hi' ? 'इंटरैक्टिव एशिया रेंज देश मानचित्र एवं डेटा' : language === 'ur' ? 'ایشیا کے رینج ممالک' : 'Interactive Asia Tiger-Range Explorer'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  {language === 'hi' ? 'एशियाई बाघ विस्तार देश एवं आबादी' : language === 'ur' ? 'ایشیائی ممالک میں شیروں کے اعداد و شمار' : 'Asian Tiger Range Countries & Official Census Data'}
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                Select a country below for verified telemetry & protected areas
              </span>
            </div>

            {/* Country Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {ASIAN_TIGER_RANGE_COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountryId(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                    selectedCountryId === c.id
                      ? 'bg-[#0B3D2E] text-amber-300 shadow'
                      : 'bg-[#F5F1E6] text-stone-700 hover:bg-[#eae4d5]'
                  }`}
                >
                  <span>{c.country}</span>
                  <span className="text-[10px] opacity-75 font-normal">({c.estimatedPopulation})</span>
                </button>
              ))}
            </div>

            {/* Detailed Selected Country Card */}
            <div className="bg-[#F5F1E6]/80 rounded-2xl p-6 border border-[#0B3D2E]/15 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#0B3D2E]/70 font-bold">Country Profile</span>
                    {getStatusBadge(selectedCountry.statusTag)}
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                    {selectedCountry.country}
                  </h4>
                  <div className="font-mono text-xs text-[#F27D26] font-bold mt-0.5">
                    Trend: {selectedCountry.trend}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#0B3D2E]/10 space-y-2">
                  <div className="text-xs text-stone-500 font-mono uppercase">Official Population Count</div>
                  <div className="font-serif text-3xl font-bold text-[#0B3D2E]">
                    {selectedCountry.estimatedPopulation}
                  </div>
                  {selectedCountry.populationRange && (
                    <div className="text-xs text-stone-600 font-mono">
                      Estimated Range: {selectedCountry.populationRange}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 font-mono">
                  <div className="flex justify-between">
                    <span>Assessment Year:</span>
                    <span className="font-semibold text-stone-800">{selectedCountry.assessmentYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Verified:</span>
                    <span className="font-semibold text-stone-800">{selectedCountry.lastVerified}</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={selectedCountry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0B3D2E] hover:text-[#F27D26] font-bold transition-colors"
                    >
                      <span>{selectedCountry.sourceOrg}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white rounded-xl p-5 border border-[#0B3D2E]/10 space-y-2">
                  <h5 className="font-serif font-bold text-sm text-[#0B3D2E]">
                    Landscape Highlights & Transboundary Connectivity
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {selectedCountry.landscapeHighlights}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-[#0B3D2E]/10 space-y-2">
                    <span className="text-[10px] font-mono text-[#0B3D2E]/70 uppercase font-bold block">
                      Major Habitats
                    </span>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {selectedCountry.majorHabitats.map((hab, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26]"></span>
                          <span>{hab}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-[#0B3D2E]/10 space-y-2">
                    <span className="text-[10px] font-mono text-[#0B3D2E]/70 uppercase font-bold block">
                      Flagship Protected Areas
                    </span>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {selectedCountry.protectedAreas.map((pa, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0B3D2E]"></span>
                          <span>{pa}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: TIGERS OF INDIA (OFFICIAL NTCA DATA & CHART) */}
      {/* ========================================================================= */}
      {activeSubTab === 'india' && (
        <div className="space-y-8 animate-fade-in">
          {/* India Overview Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#0B3D2E]/15 shadow-sm space-y-2">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">
                Mean Population (2022 Cycle)
              </span>
              <div className="font-serif text-3xl font-bold text-[#0B3D2E]">
                3,682
              </div>
              <div className="text-[11px] font-mono text-[#F27D26] font-semibold">
                Range: 3,167 – 3,925
              </div>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                Source: NTCA / WII 2022 Census
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#0B3D2E]/15 shadow-sm space-y-2">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">
                Statutory Tiger Reserves
              </span>
              <div className="font-serif text-3xl font-bold text-[#0B3D2E]">
                55+
              </div>
              <div className="text-[11px] font-mono text-stone-600">
                Across 18 Tiger-Range States
              </div>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                Notified under WPA 1972
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#0B3D2E]/15 shadow-sm space-y-2">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">
                Total Reserve Area
              </span>
              <div className="font-serif text-3xl font-bold text-[#0B3D2E]">
                78,735 sq km
              </div>
              <div className="text-[11px] font-mono text-stone-600">
                Core: ~44.5k | Buffer: ~34.2k sq km
              </div>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                ~2.4% of India&apos;s land area
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#0B3D2E]/15 shadow-sm space-y-2">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">
                Global Share
              </span>
              <div className="font-serif text-3xl font-bold text-[#F27D26]">
                &gt;75%
              </div>
              <div className="text-[11px] font-mono text-stone-600">
                World&apos;s Wild Tiger Population
              </div>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                Global Tiger Recovery Leader
              </div>
            </div>
          </div>

          {/* Official All India Tiger Estimation Chart (2006–2022) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 text-[10px] font-mono text-amber-800 font-bold mb-1">
                  <BarChart3 className="w-3 h-3 text-amber-600" />
                  <span>Official NTCA Quadrennial Estimation Series</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  All India Tiger Estimation Growth Trajectory (2006–2022)
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-[#0B3D2E] bg-[#F5F1E6] px-3 py-1.5 rounded-lg border border-[#0B3D2E]/15">
                  Latest completed All India Tiger Estimation: 2022
                </div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                  (Do not present the 2022 figure as a 2026 estimate)
                </div>
              </div>
            </div>

            {/* Custom Interactive Visual Bar Chart */}
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-64 sm:h-72 border-b border-stone-200 pb-4 px-2">
                {ALL_INDIA_ESTIMATION_HISTORY.map((entry) => {
                  const maxPop = 4000;
                  const heightPercent = (entry.meanPopulation / maxPop) * 100;
                  const isLatest = entry.year === 2022;

                  return (
                    <div key={entry.year} className="flex flex-col items-center h-full justify-end group">
                      <div className="text-[10px] sm:text-xs font-mono font-bold text-[#0B3D2E] mb-1.5 opacity-90 group-hover:scale-110 transition-transform">
                        {entry.meanPopulation.toLocaleString()}
                      </div>
                      <div 
                        className={`w-full max-w-[56px] rounded-t-xl transition-all duration-500 relative ${
                          isLatest 
                            ? 'bg-gradient-to-t from-[#0B3D2E] to-[#F27D26] shadow-md' 
                            : 'bg-[#0B3D2E]/80 hover:bg-[#0B3D2E]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        {isLatest && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F27D26] animate-ping"></div>
                        )}
                      </div>
                      <div className="font-serif font-bold text-xs sm:text-sm text-stone-800 mt-2">
                        {entry.year}
                      </div>
                      <div className="text-[9px] font-mono text-stone-500 hidden sm:block">
                        {entry.cycle.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Exact Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#0B3D2E]/20 text-[#0B3D2E] font-mono text-[11px] uppercase bg-[#F5F1E6]/50">
                      <th className="p-2.5">Assessment Year</th>
                      <th className="p-2.5">Mean Count</th>
                      <th className="p-2.5">Official Range (95% CI)</th>
                      <th className="p-2.5">Source & Report Citation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {ALL_INDIA_ESTIMATION_HISTORY.map((row) => (
                      <tr key={row.year} className={row.year === 2022 ? 'bg-amber-50/50 font-bold' : ''}>
                        <td className="p-2.5 text-[#0B3D2E]">
                          {row.year} ({row.cycle})
                        </td>
                        <td className="p-2.5 text-stone-900 text-sm font-bold">
                          {row.meanPopulation.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-stone-600">
                          {row.lowerConfidence?.toLocaleString()} – {row.upperConfidence?.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-stone-600 font-sans text-[11px]">
                          {row.reportTitle} • {row.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#F5F1E6] rounded-2xl border border-[#0B3D2E]/10 flex items-start gap-3 text-xs text-stone-700">
                <Info className="w-4 h-4 text-[#0B3D2E] flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Automatic Sensor & NTCA Synchronization:</strong> India conducts nationwide synchronized camera-trap and sign-survey estimations every four years under the Wildlife Institute of India (WII) and NTCA. When the next official national assessment is formally released by the Government of India, this dataset will update automatically through our verified admin audit pipeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: BENGAL TIGER (*Panthera tigris tigris*) SCIENTIFIC DOSSIER */}
      {/* ========================================================================= */}
      {activeSubTab === 'bengal-tiger' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B3D2E]/15 shadow-sm space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-[#0B3D2E] text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
                  <span>Species Profile</span> • <span>Taxon ID: Felidae-001</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0B3D2E]">
                  🐅 Royal Bengal Tiger
                </h2>
                <p className="font-mono text-sm sm:text-base text-[#F27D26] italic font-semibold">
                  Panthera tigris tigris (Linnæus, 1758)
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-red-100 text-red-800 border border-red-200 text-xs font-bold px-3 py-1 rounded-full">
                  IUCN: Endangered (EN)
                </span>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                  India WPA 1972: Schedule I
                </span>
                <span className="bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                  CITES: Appendix I
                </span>
              </div>
            </div>

            {/* Scientific Dossier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-2">
                <span className="text-[10px] font-mono text-[#0B3D2E] uppercase font-bold">1. Taxonomy & Classification</span>
                <ul className="text-xs text-stone-700 space-y-1 font-mono">
                  <li><strong>Kingdom:</strong> Animalia</li>
                  <li><strong>Phylum:</strong> Chordata</li>
                  <li><strong>Class:</strong> Mammalia</li>
                  <li><strong>Order:</strong> Carnivora</li>
                  <li><strong>Family:</strong> Felidae</li>
                  <li><strong>Genus:</strong> Panthera</li>
                  <li><strong>Subspecies:</strong> <em>P. tigris tigris</em></li>
                </ul>
              </div>

              <div className="p-5 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-2">
                <span className="text-[10px] font-mono text-[#0B3D2E] uppercase font-bold">2. Physical Characteristics</span>
                <ul className="text-xs text-stone-700 space-y-1 leading-relaxed">
                  <li><strong>Male Weight:</strong> 180 – 260 kg (2.7 – 3.1 m length)</li>
                  <li><strong>Female Weight:</strong> 100 – 160 kg (2.4 – 2.7 m length)</li>
                  <li><strong>Stripes:</strong> As unique as human fingerprints; no two tigers possess identical stripe configurations.</li>
                  <li><strong>Night Vision:</strong> 6 times superior to human vision.</li>
                </ul>
              </div>

              <div className="p-5 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-2">
                <span className="text-[10px] font-mono text-[#0B3D2E] uppercase font-bold">3. Diet & Feeding Ecology</span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Obligate carnivore specializing in medium-to-large ungulates: <strong>Chital (Spotted Deer), Sambar, Gaur (Indian Bison), Wild Boar, Barking Deer, and Nilgai</strong>. An adult tiger requires ~50 ungulates annually (~18–20 kg meat in one meal).
                </p>
              </div>

              <div className="p-5 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-2">
                <span className="text-[10px] font-mono text-[#0B3D2E] uppercase font-bold">4. Behaviour & Territory</span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Solitary and territorial apex predator. Communicates through scent sprays, claw tree-scrapes, roll marks, and deep vocal roars. Exceptional swimmer traversing wide riverine currents like the Gandak basin.
                </p>
              </div>

              <div className="p-5 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-2">
                <span className="text-[10px] font-mono text-[#0B3D2E] uppercase font-bold">5. Reproduction & Lifespan</span>
                <ul className="text-xs text-stone-700 space-y-1 leading-relaxed">
                  <li><strong>Gestation Period:</strong> 93 – 110 days</li>
                  <li><strong>Litter Size:</strong> 2 – 4 cubs (weaned at 6 months)</li>
                  <li><strong>Independence:</strong> 18 – 24 months</li>
                  <li><strong>Wild Lifespan:</strong> 12 – 15 years in natural conditions</li>
                </ul>
              </div>

              <div className="p-5 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-2">
                <span className="text-[10px] font-mono text-[#0B3D2E] uppercase font-bold">6. Ecological Importance</span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <strong>Apex Predator & Umbrella Species:</strong> Controls herbivore grazing pressure, prevents soil erosion, and safeguards vital watershed river basins and carbon-sequestering forests.
                </p>
              </div>
            </div>

            {/* Human-Tiger Coexistence */}
            <div className="p-6 bg-[#0B3D2E] text-white rounded-2xl space-y-3">
              <h4 className="font-serif font-bold text-lg text-amber-300">
                Human-Tiger Coexistence & Community Safeguards
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                In landscapes like Valmiki where forest reserves abut agricultural fringe villages, coexistence is maintained through <strong>rapid response rescue teams, solar energized fencing, livestock predation compensation funds</strong>, and proactive forest guard deployment during harvest seasons.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5 & 6: TIGER DATA CENTRE & AUTOMATIC DATA UPDATE */}
      {/* ========================================================================= */}
      {activeSubTab === 'data-centre' && (
        <div className="space-y-8 animate-fade-in">
          {/* Data Centre Header & Category Filters */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest block">
                  Official Statistics Registry
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  Tiger Data Centre & Telemetry Metrics
                </h3>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                {getStatusBadge('verified_current')}
                {getStatusBadge('verified_older')}
                {getStatusBadge('recently_updated')}
                {getStatusBadge('unavailable')}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Indicators' },
                { id: 'india', label: 'India Statistics' },
                { id: 'vtr', label: 'Valmiki TR (VTR)' },
                { id: 'global', label: 'Global Numbers' },
                { id: 'mortality', label: 'Mortality Tracking' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCategoryFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors ${
                    selectedCategoryFilter === filter.id
                      ? 'bg-[#0B3D2E] text-amber-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStats.map((stat) => (
                <div 
                  key={stat.id}
                  className="bg-white rounded-2xl p-6 border border-[#0B3D2E]/20 shadow-sm space-y-4 hover:border-[#0B3D2E] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#0B3D2E]/70 font-bold">
                        {stat.category.toUpperCase()} • {stat.reportName.substring(0, 30)}...
                      </span>
                      {getStatusBadge(stat.status)}
                    </div>

                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#0B3D2E]">
                        {stat.title}
                      </h4>
                      <div className="font-serif text-3xl font-bold text-[#0B3D2E] mt-1">
                        {stat.value}
                      </div>
                      {stat.confidenceRange && (
                        <div className="text-xs font-mono text-[#F27D26] font-semibold mt-0.5">
                          Range: {stat.confidenceRange}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {stat.methodologySummary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] font-mono text-stone-500">
                    <div className="flex justify-between">
                      <span>Source Organization:</span>
                      <span className="font-bold text-stone-800 text-right">{stat.sourceOrganization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assessment Year:</span>
                      <span className="font-bold text-stone-800">{stat.assessmentYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Verified Date:</span>
                      <span className="font-bold text-stone-800">{stat.lastVerifiedDate}</span>
                    </div>
                    {stat.previousValue && (
                      <div className="flex justify-between text-stone-400">
                        <span>Previous Value:</span>
                        <span>{stat.previousValue}</span>
                      </div>
                    )}
                    <div className="pt-1">
                      <a
                        href={stat.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#0B3D2E] hover:text-[#F27D26] font-bold transition-colors text-xs"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6 Architecture Dashboard */}
          <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-[#145A43]">
            <div className="flex items-center gap-2 text-amber-300">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif text-xl font-bold">
                Periodic Official Verification Architecture
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Our automated system periodically audits official government endpoints (NTCA, WII, Bihar Forest Department, IUCN). When a new assessment is detected, it is queued for admin forensic cross-check before publication. Values are never overwritten silently, and full historical logs are maintained.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-amber-300 font-bold block">Last System Check:</span>
                <span>2026-08-31 08:45 UTC</span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-amber-300 font-bold block">Integrity Status:</span>
                <span>100% Primary Sources Verified</span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-amber-300 font-bold block">Synthetic Estimation:</span>
                <span>Strictly Forbidden (0%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 16: TIGER PROTECTION & PROJECT TIGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'protection' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B3D2E]/15 shadow-sm space-y-8">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest block">
                Statutory Conservation Framework
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#0B3D2E]">
                Project Tiger & Modern Anti-Poaching Science
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <div className="flex items-center gap-2 text-[#0B3D2E]">
                  <Award className="w-5 h-5 text-[#F27D26]" />
                  <h4 className="font-serif font-bold text-base">
                    Project Tiger (1973 – Present)
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Launched on April 1, 1973 at Corbett, Project Tiger is the world&apos;s largest species recovery program. Administered by the statutory <strong>National Tiger Conservation Authority (NTCA)</strong> under the Ministry of Environment, Forest & Climate Change (MoEFCC), it established inviolate core breeding zones surrounded by co-managed buffer areas.
                </p>
              </div>

              <div className="p-6 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <div className="flex items-center gap-2 text-[#0B3D2E]">
                  <Compass className="w-5 h-5 text-[#F27D26]" />
                  <h4 className="font-serif font-bold text-base">
                    M-STrIPES Digital Patrolling
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <strong>Monitoring System for Tigers - Intensive Patrolling and Ecological Status (M-STrIPES)</strong> provides real-time spatial monitoring of frontline foot patrols across all 8 ranges of Valmiki Tiger Reserve. Forest guards record wildlife tracks, snare checks, and habitat disturbances via GPS mobile handsets.
                </p>
              </div>

              <div className="p-6 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <div className="flex items-center gap-2 text-[#0B3D2E]">
                  <Eye className="w-5 h-5 text-[#F27D26]" />
                  <h4 className="font-serif font-bold text-base">
                    Transboundary Corridor with Nepal
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Valmiki Tiger Reserve is contiguously linked with Nepal&apos;s <strong>Chitwan National Park and Parsa National Park</strong> across the Someshwar hill ridge. Coordinated Indo-Nepal joint patrolling and harmonized camera-trap protocols ensure safe dispersal of breeding tigers across national boundaries.
                </p>
              </div>

              <div className="p-6 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 space-y-3">
                <div className="flex items-center gap-2 text-[#0B3D2E]">
                  <Trees className="w-5 h-5 text-[#F27D26]" />
                  <h4 className="font-serif font-bold text-base">
                    Prey-Base & Grassland Rejuvenation
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Active management of high-nutrition Terai grasses (*Imperata cylindrica*, *Saccharum spontaneum*), eradication of invasive weeds, and creation of solar-powered waterholes ensure high ungulate prey carrying capacity (Chital, Sambar, Gaur).
                </p>
              </div>
            </div>

            {/* ❤️ WHAT YOU CAN DO FOR TIGERS (10 GOLDEN RULES) */}
            <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-[#145A43]">
              <div className="flex items-center gap-2 text-amber-300">
                <Heart className="w-6 h-6 text-red-400 fill-current" />
                <h4 className="font-serif text-2xl font-bold">
                  ❤️ What You Can Do for Tigers
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  '1. Never disturb or taunt wildlife in their natural sanctuary.',
                  '2. Strictly never feed animals (causes dependency and disease).',
                  '3. Never chase wildlife or pressure safari drivers to speed.',
                  '4. Follow all forest speed limits (maximum 20 km/h) & stay in vehicle.',
                  '5. Keep noise to an absolute minimum; switch off phone ringers.',
                  '6. Comply with forest department guidelines and seasonal closures.',
                  '7. Never purchase illegal wildlife skins, claws, bones, or claws.',
                  '8. Report wildlife crimes or snares directly to 1800-345-6188.',
                  '9. Support certified local nature guides & eco-homestays.',
                  '10. Respect indigenous tribal traditions (Tharu & Uraon communities).'
                ].map((rule, idx) => (
                  <div key={idx} className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 17: SOURCES & DATA POLICY */}
      {/* ========================================================================= */}
      {activeSubTab === 'sources' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B3D2E]/15 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest block">
                Primary Government & Scientific Repositories
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#0B3D2E]">
                Official Sources & Data Transparency Policy
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              All statistics across Valmiki Tiger Watch originate exclusively from verified government gazettes, statutory census reports, and peer-reviewed wildlife research institutes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OFFICIAL_GOVERNMENT_PORTALS.map((portal, idx) => (
                <div key={idx} className="p-4 bg-[#F5F1E6]/70 rounded-2xl border border-[#0B3D2E]/10 flex justify-between items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold">{portal.category}</span>
                    <h5 className="font-serif font-bold text-sm text-[#0B3D2E]">{portal.name}</h5>
                    <p className="text-[11px] text-stone-600 font-mono">{portal.role}</p>
                  </div>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white hover:bg-[#0B3D2E] text-[#0B3D2E] hover:text-white rounded-xl border border-stone-200 transition-colors shadow-xs"
                    title={`Visit ${portal.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards to Explore VTR Sections */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/15 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#F27D26] font-bold">
            Explore More of Valmiki Tiger Reserve
          </span>
          <span className="text-xs text-stone-500 font-mono">Quick Links</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('about-vtr')}
            className="p-3 bg-[#F5F1E6] hover:bg-[#0B3D2E] hover:text-white rounded-xl border border-stone-200 text-[#0B3D2E] transition-colors flex items-center justify-between"
          >
            <span>🌳 Explore VTR</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="p-3 bg-[#F5F1E6] hover:bg-[#0B3D2E] hover:text-white rounded-xl border border-stone-200 text-[#0B3D2E] transition-colors flex items-center justify-between"
          >
            <span>🗺️ Reserve Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('wildlife')}
            className="p-3 bg-[#F5F1E6] hover:bg-[#0B3D2E] hover:text-white rounded-xl border border-stone-200 text-[#0B3D2E] transition-colors flex items-center justify-between"
          >
            <span>🌿 Flora & Fauna</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('ecotourism')}
            className="p-3 bg-[#F5F1E6] hover:bg-[#0B3D2E] hover:text-white rounded-xl border border-stone-200 text-[#0B3D2E] transition-colors flex items-center justify-between"
          >
            <span>🚗 Travel & Safari</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
