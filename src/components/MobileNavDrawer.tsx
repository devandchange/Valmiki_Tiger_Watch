import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Search, 
  ShieldAlert, 
  Lock, 
  Download, 
  WifiOff, 
  Check, 
  ChevronRight,
  Compass,
  MapPin,
  Calendar,
  Utensils,
  BookOpen,
  Sparkles,
  Users,
  Camera,
  GraduationCap,
  Images,
  Newspaper,
  FileText,
  Phone,
  Award,
  Info,
  Trees,
  Footprints,
  Eye,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onOpenInstall?: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onOpenInstall
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    alerts, 
    openSearchModal, 
    isOnline, 
    canInstallPwa, 
    installPwa, 
    isAdmin 
  } = useData();

  const { language, setLanguage, languages, t, isRtl } = useLanguage();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeAlertsCount = alerts.filter(a => a.active).length;

  // Lock body scroll when drawer is open and handle Escape key
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Auto-focus close button for screen readers
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  const handleSearchClick = () => {
    onClose();
    openSearchModal();
  };

  // Major section categories for clear navigation hierarchy
  const navCategories = [
    {
      title: language === 'hi' ? 'बाघ एवं वन्यजीव क्षेत्र' : language === 'ur' ? 'شیر اور جنگلی حیات' : 'Tigers & Wildlife Realm',
      subtitle: language === 'hi' ? '54 सत्यापित बाघ एवं तराई जैव विविधता' : language === 'ur' ? '54 مصدقہ شیر اور ترائی تنوع' : '54 Verified Tigers & Terai Biodiversity',
      color: 'text-amber-800',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-200/60',
      items: [
        {
          id: 'tigers',
          title: t('nav.tigers', 'Tigers of VTR'),
          desc: language === 'hi' ? '54 सत्यापित बाघों की प्रोफाइल, स्ट्राइप आईडी व कैमरा ट्रैप' : language === 'ur' ? '54 مصدقہ شیروں کے تفصیلی کوائف اور کیمرہ ٹریپ' : '54 verified tiger profiles, stripe IDs & camera traps',
          icon: Footprints,
          badge: '54 Verified',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
          id: 'tiger-worldwide',
          title: language === 'hi' ? 'विश्व एवं भारत के बाघ (Hierarchy)' : language === 'ur' ? 'عالمی اور بھارتی شیر' : 'Worldwide & India Tigers',
          desc: language === 'hi' ? 'विश्व ➔ एशिया ➔ भारत ➔ बंगाल ➔ वाल्मीकि पदानुक्रम' : language === 'ur' ? 'عالمی، ایشیائی، بھارتی اور والمیکی سلسلہ وار ڈیٹا' : '5-Tier Hierarchy: World ➔ Asia ➔ India ➔ Bengal ➔ VTR',
          icon: Eye,
          badge: '3,682 in India',
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
          id: 'wildlife',
          title: t('nav.wildlife', 'Wildlife & Co-Predators'),
          desc: language === 'hi' ? 'तेंदुए, भालू, गौर, घड़ियाल और 250+ पक्षी प्रजातियाँ' : language === 'ur' ? 'تیندوا، ریچھ، گور، گھڑیال اور 250+ پرندے' : 'Leopards, Sloth Bears, Gaurs, Gharials & 250+ Birds',
          icon: Trees,
          badge: '53+ Mammals',
          badgeColor: 'bg-stone-100 text-stone-700'
        },
        {
          id: 'species-spotter',
          title: t('nav.species_spotter', 'Species Spotter'),
          desc: language === 'hi' ? 'सचित्र वन्यजीव पहचान उपकरण' : language === 'ur' ? 'انٹرایکٹو پرجاتی شناختی ٹول' : 'Interactive visual wildlife field identification guide',
          icon: Sparkles,
          badge: 'Interactive',
          badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
          id: 'sightings',
          title: t('nav.sightings', 'Field Sightings'),
          desc: language === 'hi' ? 'नागरिक वन्यजीव दर्शन रिपोर्ट और हालिया लॉग्स' : language === 'ur' ? 'عوامی مشاہدات اور حالیہ ریکارڈز' : 'Community sightings, track reports & public logs',
          icon: Camera,
          badge: 'Citizen Science',
          badgeColor: 'bg-blue-100 text-blue-800'
        }
      ]
    },
    {
      title: language === 'hi' ? 'यात्रा व अन्वेषण (Visit & Explore)' : language === 'ur' ? 'سیاحت اور تفریح' : 'Explore & Plan Your Visit',
      subtitle: language === 'hi' ? 'सफारी, मानचित्र, नियम व स्थानीय व्यंजन' : language === 'ur' ? 'سفاری، نقشہ، قواعد و ضوابط اور کھانے' : 'Safaris, Gates Map, Transit & Local Culture',
      color: 'text-emerald-800',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-200/60',
      items: [
        {
          id: 'map',
          title: t('nav.map', 'Reserve Map & Safari Gates'),
          desc: language === 'hi' ? 'जीपीएस निर्देशांक, रेंज प्रभाग, चेकपोस्ट और वॉच टावर' : language === 'ur' ? 'جی پی ایس مقامات، رینج اور مشاہداتی ٹاورز' : 'Interactive map with GPS gates, ranges & watchtowers',
          icon: MapPin,
          badge: 'GPS Active',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
          id: 'travel-guide',
          title: t('nav.travel_guide', 'Travel Guide & Rules'),
          desc: language === 'hi' ? 'पहुंचने के मार्ग, मौसम, सफारी समय व वन्यजीव कानून नियम' : language === 'ur' ? 'راستے، بہترین وقت، سفاری اوقات اور جنگل قوانین' : 'Transit routes, best seasons, timings & statutory rules',
          icon: Compass,
          badge: 'Essential',
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
          id: 'ecotourism',
          title: t('nav.ecotourism', 'Ecotourism & Safaris'),
          desc: language === 'hi' ? 'कैनोपी वॉक, गंडक बोट सफारी व जंगल जिप्सी ट्रेक' : language === 'ur' ? 'کینپی واک، بوٹنگ اور جنگل سفاری' : 'Canopy walk, river boating, gypsy safari & eco-huts',
          icon: Calendar,
          badge: 'Permits',
          badgeColor: 'bg-stone-100 text-stone-700'
        },
        {
          id: 'sightseeing',
          title: t('nav.sightseeing', 'Sightseeing & Heritage'),
          desc: language === 'hi' ? 'वाल्मीकि आश्रम, त्रिवेणी संगम, जटाशंकर व मदनपुर देवी' : language === 'ur' ? 'والمیکی آشرم، تروینی سنگم اور ثقافتی ورثہ' : 'Valmiki Ashram, Triveni Sangam, Jatashankar & temples',
          icon: Award,
          badge: 'Heritage',
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
          id: 'cuisine',
          title: t('nav.cuisine', 'Local Cuisine & Flavors'),
          desc: language === 'hi' ? 'चंपारण आहुना मटन, लिट्टी चोखा व थारू जनजातीय व्यंजन' : language === 'ur' ? 'چمپارن اہونا گوشت، لٹی چوکھا اور تھارو کھانے' : 'Champaran Ahuna Mutton, Litti Chokha & Tharu dishes',
          icon: Utensils,
          badge: 'Gastronomy',
          badgeColor: 'bg-orange-100 text-orange-800'
        }
      ]
    },
    {
      title: language === 'hi' ? 'संरक्षण एवं शोध (Conservation)' : language === 'ur' ? 'تحفظ اور تحقیق' : 'Conservation & Field Stewardship',
      subtitle: language === 'hi' ? 'प्रोजेक्ट टाइगर, गश्त, थारू समुदाय व शोध पत्र' : language === 'ur' ? 'پروجیکٹ ٹائیگر، گشت اور قبائلی تعاون' : 'Project Tiger 50Y, Anti-Poaching & Research',
      color: 'text-[#0B3D2E]',
      bgColor: 'bg-[#0B3D2E]/10',
      borderColor: 'border-[#0B3D2E]/20',
      items: [
        {
          id: 'project-tiger',
          title: t('nav.project_tiger', 'Project Tiger 50 Years'),
          desc: language === 'hi' ? 'राष्ट्रीय बाघ संरक्षण मिशन (NTCA) और ऐतिहासिक उपलब्धियाँ' : language === 'ur' ? 'قومی مشن برائے تحفظ شیر کی 50 سالہ تاریخ' : 'National Tiger Conservation Authority milestones & legacy',
          icon: Award,
          badge: '1973–2023',
          badgeColor: 'bg-stone-100 text-stone-700'
        },
        {
          id: 'conservation',
          title: t('nav.conservation', 'Conservation & Patrols'),
          desc: language === 'hi' ? 'एम-स्ट्राइप्स डिजिटल ट्रैकिंग और शिकार-रोधी निगरानी' : language === 'ur' ? 'ایم سٹرائپس ڈیجیٹل گشت اور انسداد شکار مہم' : 'M-STrIPES digital tracking, solar fencing & anti-poaching',
          icon: Layers,
          badge: 'M-STrIPES',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
          id: 'community',
          title: t('nav.community', 'Tharu Tribal Community'),
          desc: language === 'hi' ? 'पारंपरिक थारू एवं उरांव वन संरक्षक, ईडीसी समितियाँ' : language === 'ur' ? 'مقامی تھارو اور اوراؤں قبائل اور فارسٹ گارڈز' : 'Indigenous Tharu & Oraon forest watchers, EDCs & crafts',
          icon: HeartHandshake,
          badge: '40+ EDCs',
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
          id: 'education',
          title: t('nav.education', 'Education & Kids Zone'),
          desc: language === 'hi' ? 'इंटरएक्टिव बाघ क्विज, खाद्य जाल और रोचक तथ्य' : language === 'ur' ? 'تعلیمی کوئز اور جنگلی حیات کے حقائق' : 'Tiger quizzes, food web models, myths vs facts',
          icon: GraduationCap,
          badge: 'Quiz & Facts',
          badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
          id: 'research',
          title: t('nav.research', 'Research & Scientific Papers'),
          desc: language === 'hi' ? 'डब्लूआईआई अध्ययन, कैमरा ट्रैप डेटा व वैज्ञानिक रिपोर्टें' : language === 'ur' ? 'سائنسی مقالے اور کیمرہ ٹریپ کا ڈیٹا' : 'Peer-reviewed research, WII telemetry & census papers',
          icon: FileText,
          badge: 'WII / NTCA',
          badgeColor: 'bg-blue-100 text-blue-800'
        }
      ]
    },
    {
      title: language === 'hi' ? 'सूचना, मीडिया व सहायता' : language === 'ur' ? 'اطلاعات، میڈیا اور رابطہ' : 'News, Advisories & Information',
      subtitle: language === 'hi' ? 'सलाहकारियाँ, समाचार, मंच विवरण व हेल्पलाइन' : language === 'ur' ? 'انتباہات، خبریں، تصاویر اور ایمرجنسی ہیلپ لائن' : 'Live Advisories, Press, Gallery & Emergency',
      color: 'text-stone-800',
      bgColor: 'bg-stone-500/10',
      borderColor: 'border-stone-200',
      items: [
        {
          id: 'alerts',
          title: t('nav.alerts', 'Advisories & Alerts'),
          desc: language === 'hi' ? 'बाढ़ चेतावनी, वन्यजीव सतर्कता व आपातकालीन नोटिस' : language === 'ur' ? 'سیلاب اور جنگلی حیات کے حفاظتی انتباہات' : 'Wildlife movement alerts, flood notices & safety drills',
          icon: ShieldAlert,
          badge: activeAlertsCount > 0 ? `${activeAlertsCount} Active` : 'All Clear',
          badgeColor: activeAlertsCount > 0 ? 'bg-red-500 text-white animate-pulse font-bold' : 'bg-stone-100 text-stone-600'
        },
        {
          id: 'news',
          title: t('nav.news', 'News & Media Updates'),
          desc: language === 'hi' ? 'वन विभाग के प्रेस वक्तव्य एवं क्षेत्रीय समाचार' : language === 'ur' ? 'تازہ ترین خبریں اور میڈیا بیانات' : 'Forest department press releases & regional developments',
          icon: Newspaper,
          badge: 'Latest',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
          id: 'gallery',
          title: t('nav.gallery', 'Photo & Video Gallery'),
          desc: language === 'hi' ? 'हाई-रिज़ॉल्यूशन कैमरा ट्रैप व प्राकृतिक परिदृश्य' : language === 'ur' ? 'اعلی معیار کی تصاویر اور ویڈیوز' : 'High-resolution camera-trap visuals & Terai landscapes',
          icon: Images,
          badge: 'HD Media',
          badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
          id: 'about-vtr',
          title: t('nav.about_vtr', 'About Valmiki Sanctuary'),
          desc: language === 'hi' ? 'शिवालिक तलहटी, भौगोलिक विस्तार व चितवन गलियारा' : language === 'ur' ? 'شوالک سلسلہ، رقبہ اور چتون کوریڈور' : 'Shivalik foothills, 899 sq km terrain & Chitwan corridor',
          icon: BookOpen,
          badge: 'Sanctuary',
          badgeColor: 'bg-stone-100 text-stone-700'
        },
        {
          id: 'about',
          title: t('nav.about', 'About This Platform'),
          desc: language === 'hi' ? 'गैर-व्यावसायिक संरक्षण पहल एवं तकनीकी आर्किटेक्चर' : language === 'ur' ? 'غیر تجارتی معلوماتی پلیٹ فارم کا مشن' : 'Non-commercial independent conservation initiative',
          icon: Info,
          badge: 'Mission',
          badgeColor: 'bg-stone-100 text-stone-700'
        },
        {
          id: 'contact',
          title: t('nav.contact', 'Emergency & Hotlines'),
          desc: language === 'hi' ? 'वन प्रभाग कार्यालय, रेंज बीट हेल्पलाइन व रेस्क्यू टीम' : language === 'ur' ? 'فارسٹ رینج آفسز اور ایمرجنسی فون نمبرز' : 'Forest division beats, 24x7 rescue units & hospital contacts',
          icon: Phone,
          badge: '24x7 Help',
          badgeColor: 'bg-red-100 text-red-800'
        },
        {
          id: 'credits',
          title: language === 'hi' ? 'रचनाकार एवं साभार (Nazish Asad)' : language === 'ur' ? 'خالق اور انتساب (نازش اسد)' : 'Creator & Attribution (Nazish Asad)',
          desc: language === 'hi' ? 'पर्यावरण कार्यकर्ता नाज़िश असद, सरकारी स्रोत व समर्पित संरक्षण' : language === 'ur' ? 'ماحولیاتی کارکن نازش اسد اور سائنسی ذرائع' : 'Environmental activist Nazish Asad, scientific citations & frontline rangers',
          icon: Award,
          badge: 'Creator',
          badgeColor: 'bg-amber-100 text-amber-800'
        }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end" id="mobile-nav-bottom-sheet-container">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Bottom Sheet Drawer Modal */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu_title', 'Navigation Menu')}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className="relative z-10 w-full max-h-[90vh] bg-[#FAF8F5] rounded-t-[28px] shadow-2xl border-t border-[#0B3D2E]/20 flex flex-col overflow-hidden text-stone-900"
          >
            {/* Top Drag Handle Bar */}
            <div className="pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none select-none">
              <div className="w-12 h-1.5 rounded-full bg-stone-300/90 hover:bg-stone-400 transition-colors" />
            </div>

            {/* Header with Title, Active Indicator and Close Button */}
            <div className="px-5 py-3 border-b border-stone-200/80 bg-white/80 backdrop-blur-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#0B3D2E] flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden">
                  <img 
                    src="/icons/icon-192.png" 
                    alt="Valmiki Tiger Watch Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif font-bold text-base text-[#0B3D2E] truncate leading-tight">
                    {t('app.title', 'Valmiki Tiger Watch')}
                  </h2>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#F27D26] truncate">
                    {language === 'hi' ? 'संरक्षण नेविगेशन मेन्यू' : language === 'ur' ? 'رہنمائی کا مینو' : 'Conservation Directory'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  id="mobile-nav-close-btn"
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Utility Strip: Instant Search & Language Selector */}
            <div className="px-4 py-2.5 bg-stone-100/80 border-b border-stone-200/60 flex flex-col gap-2">
              {/* Search Trigger Button */}
              <button
                onClick={handleSearchClick}
                id="drawer-search-trigger"
                className="w-full flex items-center justify-between bg-white hover:bg-stone-50 border border-stone-300/80 rounded-xl px-3.5 py-2 text-xs text-stone-700 shadow-xs transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#0B3D2E] group-hover:text-[#F27D26] transition-colors" />
                  <span className="font-medium text-stone-600">
                    {t('search.input_placeholder', 'Search tigers, news, guides, map...')}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold border border-stone-200">
                  ⌘K
                </span>
              </button>

              {/* Language Switcher Segmented Control */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-[11px] font-mono font-bold text-stone-600 flex items-center gap-1">
                  <span>🌐</span>
                  <span>{t('lang.select', 'Language')}:</span>
                </span>
                <div className="flex items-center bg-white p-0.5 rounded-lg border border-stone-200 shadow-xs">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        language === l.code
                          ? 'bg-[#0B3D2E] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {l.nativeName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Body Containing All Major Sections */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin">
              {/* Home Quick Jump Card */}
              <button
                onClick={() => handleSelectTab('home')}
                id="drawer-nav-home"
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  activeTab === 'home'
                    ? 'bg-[#0B3D2E] text-white border-[#0B3D2E] shadow-md'
                    : 'bg-white hover:bg-stone-50 text-stone-900 border-stone-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    activeTab === 'home' ? 'bg-[#F27D26] text-white' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    🏠
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                      <span>{t('nav.home', 'Home Overview')}</span>
                      {activeTab === 'home' && (
                        <span className="text-[10px] font-mono bg-white/20 text-white px-1.5 py-0.2 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div className={`text-xs mt-0.5 line-clamp-1 ${activeTab === 'home' ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {language === 'hi' ? 'मुख्य अवलोकन, त्वरित मेट्रिक्स व ताजा रिपोर्ट' : language === 'ur' ? 'مرکزی صفحہ اور عمومی جائزہ' : 'Executive summary, live population count & core portal'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 flex-shrink-0 ${activeTab === 'home' ? 'text-white' : 'text-stone-400'}`} />
              </button>

              {/* Categorized Navigation Sections */}
              {navCategories.map((category, catIdx) => (
                <div key={catIdx} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <h3 className={`font-mono text-xs font-bold uppercase tracking-wider ${category.color}`}>
                        {category.title}
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200/90 divide-y divide-stone-100 shadow-xs overflow-hidden">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          id={`drawer-nav-${item.id}`}
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full text-left p-3.5 transition-colors flex items-center justify-between gap-3 group ${
                            isActive 
                              ? 'bg-amber-50/70 border-l-4 border-l-[#F27D26]' 
                              : 'hover:bg-stone-50/90 active:bg-stone-100'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${
                              isActive 
                                ? 'bg-[#0B3D2E] text-white shadow-xs' 
                                : 'bg-stone-100 text-stone-700 group-hover:bg-emerald-50 group-hover:text-[#0B3D2E]'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-bold text-sm leading-snug ${
                                  isActive ? 'text-[#0B3D2E]' : 'text-stone-900 group-hover:text-[#0B3D2E]'
                                }`}>
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${item.badgeColor}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isActive ? (
                              <span className="w-2 h-2 rounded-full bg-[#F27D26]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-colors" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions & Status Tray */}
            <div className="p-4 bg-stone-100/90 border-t border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-600 font-mono">
                <div className="flex items-center gap-2">
                  {!isOnline ? (
                    <span className="inline-flex items-center text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Offline Cached
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
                      Online Live Data
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {canInstallPwa && (
                    <button
                      onClick={() => {
                        onClose();
                        installPwa();
                      }}
                      className="text-[11px] font-bold text-[#0B3D2E] hover:text-[#F27D26] flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-[#F27D26]" />
                      <span>{t('app.install', 'Install PWA')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    id="drawer-admin-btn"
                    className="text-[11px] font-bold text-stone-700 hover:text-[#0B3D2E] flex items-center gap-1"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isAdmin ? 'Admin Portal (Active)' : 'Admin Login'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
