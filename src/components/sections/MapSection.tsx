import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, 
  Layers, 
  Compass, 
  ShieldAlert, 
  ExternalLink,
  Navigation,
  Mountain,
  Trees,
  Waves,
  Sun,
  Eye,
  CheckCircle2,
  Info
} from 'lucide-react';

interface VisitorLocation {
  id: string;
  name: string;
  nameHi: string;
  nameUr: string;
  range: string;
  category: 'gate' | 'river' | 'historical' | 'watchtower' | 'stay';
  elevation: string;
  coordinates: { lat: number; lng: number };
  coordsDisplay: string;
  howToReach: string;
  howToReachHi: string;
  attractions: string[];
  description: string;
  descriptionHi: string;
}

export const MapSection: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const [viewMode, setViewMode] = useState<'spots' | 'zonation'>('spots');
  const [selectedSpotId, setSelectedSpotId] = useState<string>('valmikinagar-gate');
  const [activeZone, setActiveZone] = useState<string>('valmikinagar');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const visitorLocations: VisitorLocation[] = [
    {
      id: 'valmikinagar-gate',
      name: 'Valmikinagar Main Forest Checkpost & Eco-Park',
      nameHi: 'वाल्मीकिनगर मुख्य वन चेकपोस्ट एवं ईको-पार्क',
      nameUr: 'والمیکی نگر مین فارسٹ چیک پوسٹ اور ایکو پارک',
      range: 'Valmikinagar Range',
      category: 'gate',
      elevation: '125 m',
      coordinates: { lat: 27.4326, lng: 83.8967 },
      coordsDisplay: '27.4326° N, 83.8967° E',
      howToReach: 'Via NH-727 from Bagaha (42 km) or Bettiah (95 km). Direct paved state highway.',
      howToReachHi: 'बगहा से 42 किमी या बेतिया से 95 किमी NH-727 के माध्यम से।',
      attractions: ['Official Safari Gypsy Bookings', 'Canopy Walk & Boardwalk', 'Botanical Interpretation Garden', 'Nature Souvenir Counter'],
      description: 'The premier tourism reception center of Valmiki Tiger Reserve. Houses visitor registration counters, certified guide allocation, and the starting point for morning and afternoon open-gypsy jungle safaris.',
      descriptionHi: 'वाल्मीकि टाइगर रिजर्व का प्रमुख पर्यटन स्वागत केंद्र। यहीं से सफारी जिप्सी और प्रमाणित गाइड मिलते हैं।'
    },
    {
      id: 'gandak-barrage',
      name: 'Gandak Barrage & Triveni Confluence',
      nameHi: 'गंडक बराज एवं त्रिवेणी संगम',
      nameUr: 'گندک بیراج اور تروینی سنگم',
      range: 'Valmikinagar Range',
      category: 'river',
      elevation: '128 m',
      coordinates: { lat: 27.4431, lng: 83.9035 },
      coordsDisplay: '27.4431° N, 83.9035° E',
      howToReach: '2 km north of Valmikinagar Eco-Park on the Indo-Nepal Border road.',
      howToReachHi: 'वाल्मीकिनगर ईको-पार्क से 2 किमी उत्तर, भारत-नेपाल सीमा मार्ग पर।',
      attractions: ['Gandak River Motorboat Safari', 'Gharial & Mugger Basking Points', 'Triveni 3-River Sacred Sangam', 'Sunrise Himalayan Panorama'],
      description: 'Majestic 36-gate international barrage across the torrential Gandak (Narayani) river. Ideal for eco-boating to spot endangered Gharials and waterbirds against the backdrop of snow-dusted Siwalik peaks.',
      descriptionHi: 'गंडक नदी पर बना अंतरराष्ट्रीय बराज। घड़ियाल दर्शन, मोटरबोट सफारी और हिमालयी नजारों के लिए प्रसिद्ध।'
    },
    {
      id: 'jatashankar-temple',
      name: 'Jatashankar & Nardevi Temple Trail',
      nameHi: 'जटाशंकर एवं नरदेवी मंदिर वन मार्ग',
      nameUr: 'جٹا شنکر اور نردیوی مندر ٹریل',
      range: 'Valmikinagar Range',
      category: 'historical',
      elevation: '165 m',
      coordinates: { lat: 27.4285, lng: 83.9210 },
      coordsDisplay: '27.4285° N, 83.9210° E',
      howToReach: '4 km foot trail through riverine sal forest from Valmikinagar checkpost.',
      howToReachHi: 'वाल्मीकिनगर चेकपोस्ट से 4 किमी पैदल वन मार्ग।',
      attractions: ['Ancient Natural Rock Shrine', 'Deep Cane Brakes & Bamboo Thickets', 'Great Indian Hornbill Birding', 'Perennial Mountain Stream'],
      description: 'Historical natural rock temple nestled inside dense Calamus cane brakes and towering sal canopies. Revered by local Tharu tribes and offers exceptional birdwatching opportunities.',
      descriptionHi: 'घने बेंत और साल के वनों के बीच स्थित ऐतिहासिक प्राकृतिक मंदिर, पक्षी दर्शन हेतु उत्तम।'
    },
    {
      id: 'manguraha-hub',
      name: 'Manguraha Range Headquarters & Forest Rest House',
      nameHi: 'मंगुराहा रेंज मुख्यालय एवं वन विश्राम गृह',
      nameUr: 'منگوراہا رینج ہیڈ کوارٹر اور فارسٹ ریسٹ ہاؤس',
      range: 'Manguraha Range',
      category: 'stay',
      elevation: '180 m',
      coordinates: { lat: 27.2831, lng: 84.4512 },
      coordsDisplay: '27.2831° N, 84.4512° E',
      howToReach: '28 km from Narkatiaganj railway junction via Gaunaha road.',
      howToReachHi: 'नरकटियागंज रेलवे स्टेशन से 28 किमी गौनाहा मार्ग द्वारा।',
      attractions: ['Colonial-era Wooden Rest House', 'Someshwar Foothills Safari Loop', 'Sloth Bear Habitat Trails', 'Peacock & Gaur Sighting Clearings'],
      description: 'The eastern gateway to VTR. Features scenic forest rest houses surrounded by teak and sal plantations, serving as the base camp for treks into the rugged Someshwar hills.',
      descriptionHi: 'वीटीआर का पूर्वी प्रवेश द्वार, ऐतिहासिक वन विश्राम गृह और सोमेश्वर पहाड़ियों का आधार शिविर।'
    },
    {
      id: 'someshwar-fort',
      name: 'Fort Someshwar Trek Trailhead',
      nameHi: 'सोमेश्वर किला ट्रेक मार्ग',
      nameUr: 'سومیشور قلعہ ٹریک',
      range: 'Manguraha Range',
      category: 'historical',
      elevation: '865 m (Peak)',
      coordinates: { lat: 27.3820, lng: 84.4980 },
      coordsDisplay: '27.3820° N, 84.4980° E',
      howToReach: 'Authorized forest escort trek from Manguraha Range beat (approx. 14 km round trip).',
      howToReachHi: 'मंगुराहा से अधिकृत वन गाइड के साथ 14 किमी का पहाड़ी ट्रेक।',
      attractions: ['Highest Elevation in Bihar (865m)', 'Ancient Hilltop Fort Ruins', 'Panoramic Views of Annapurna & Dhaulagiri', 'Sub-Himalayan Flora'],
      description: 'The highest geographical ridge in Bihar along the Indo-Nepal international boundary. Offers breathtaking views of snow-capped Himalayan summits on clear winter mornings. Requires prior forest permission.',
      descriptionHi: 'बिहार की सर्वोच्च चोटी (865 मी.), प्राचीन किला अवशेष और हिमालय की धौलागिरि चोटियों का विहंगम दृश्य।'
    },
    {
      id: 'madanpur-wetland',
      name: 'Madanpur Range Wetland & Grassland Complex',
      nameHi: 'मदनपुर रेंज आर्द्रभूमि एवं घास के मैदान',
      nameUr: 'مدن پور ویٹ لینڈ اور گراس لینڈ',
      range: 'Madanpur Range',
      category: 'watchtower',
      elevation: '110 m',
      coordinates: { lat: 27.2450, lng: 84.1870 },
      coordsDisplay: '27.2450° N, 84.1870° E',
      howToReach: '18 km from Bagaha town along the Gandak embankment road.',
      howToReachHi: 'बगहा शहर से 18 किमी गंडक तटबंध मार्ग द्वारा।',
      attractions: ['Alluvial Savannah Grasslands', 'Oxbow Lakes (Chaur) Birding', 'Transient Rhino Transit Corridor', 'Sunset Tiger Watchtower'],
      description: 'Rich wetland and alluvial tall-grass complex where the Gandak floodplain meets dense sal forests. High density of waterbirds, swamp deer, hog deer, and dispersing large carnivores.',
      descriptionHi: 'बाढ़ के मैदान और आर्द्रभूमि क्षेत्र, प्रवासी जलपक्षियों और दलदली हिरणों का प्राकृतिक आवास।'
    },
    {
      id: 'gobardhana-watchtower',
      name: 'Gobardhana Watch Tower & Eco-Rest Complex',
      nameHi: 'गोबरधना वॉच टॉवर एवं ईको-विश्राम परिसर',
      nameUr: 'گوبردھنا واچ ٹاور اور ایکو ریسٹ کمپلیکس',
      range: 'Gobardhana Range',
      category: 'watchtower',
      elevation: '145 m',
      coordinates: { lat: 27.3120, lng: 84.3410 },
      coordsDisplay: '27.3120° N, 84.3410° E',
      howToReach: 'Via Ramnagar-Gobardhana rural road (24 km from Ramnagar).',
      howToReachHi: 'रामनगर से 24 किमी गोबरधना पक्की सड़क द्वारा।',
      attractions: ['3-Tier Wildlife Observation Tower', 'Perennial Forest Stream (Pandai)', 'Indian Gaur & Chital Waterhole Viewing', 'Eco-Cottages'],
      description: 'Strategically located high watchtower overlooking natural salt-licks and Pandai river ravines. Prime zone for viewing herds of Indian Gaur (Bison) and evening herbivore congregations.',
      descriptionHi: 'पांडई नदी के पास स्थित 3-मंजिला वॉच टॉवर, भारतीय गौर (बाइसन) और हिरणों के दर्शन हेतु आदर्श।'
    },
    {
      id: 'bhikhna-thori',
      name: 'Bhikhna Thori Border Gorges',
      nameHi: 'भीखना ठोरी बॉर्डर गॉर्ज एवं कंकड़ घाटी',
      nameUr: 'بھیکھنا ٹھوری بارڈر گھاٹی',
      range: 'Manguraha Range',
      category: 'river',
      elevation: '210 m',
      coordinates: { lat: 27.3620, lng: 84.6120 },
      coordsDisplay: '27.3620° N, 84.6120° E',
      howToReach: 'Accessible from Gaunaha via forest permit route.',
      howToReachHi: 'गौनाहा से वन विभाग के परमिट मार्ग द्वारा।',
      attractions: ['Sandstone River Canyons', 'Historic Indo-Nepal Border Pillar', 'Spring Water Outcrops', 'Wild Orchids & Fern Glades'],
      description: 'A scenic river gorge where the Pandai river enters Bihar from Nepal through narrow sandstone cliffs. Famous for natural cold springs and unique river gravel formations.',
      descriptionHi: 'प्राकृतिक बलुआ पत्थर की घाटियां जहां से पांडई नदी नेपाल से बिहार में प्रवेश करती है।'
    },
    {
      id: 'valmiki-vihar',
      name: 'Valmiki Vihar Tourist Lodge & Safari Counter',
      nameHi: 'वाल्मीकि विहार पर्यटक आवास एवं सफारी काउंटर',
      nameUr: 'والمیکی وہار ٹورسٹ لاج',
      range: 'Valmikinagar Range',
      category: 'stay',
      elevation: '126 m',
      coordinates: { lat: 27.4360, lng: 83.8950 },
      coordsDisplay: '27.4360° N, 83.8950° E',
      howToReach: 'Located adjacent to Gandak Barrage approach in Valmikinagar town.',
      howToReachHi: 'वाल्मीकिनगर मुख्य चौक, गंडक बराज के पास स्थित।',
      attractions: ['BSTDC Official Tourist Hotel', 'Restaurant & Conference Hall', 'Direct Safari Vehicle Boarding', 'Gandak Riverfront Promenade'],
      description: 'The flagship government tourist lodge operated by Bihar State Tourism Development Corporation (BSTDC). Features modern AC rooms, authentic local cuisine, and direct safari pickup.',
      descriptionHi: 'बिहार राज्य पर्यटन विकास निगम (BSTDC) द्वारा संचालित मुख्य पर्यटक होटल एवं भोजनालय।'
    }
  ];

  const filteredSpots = visitorLocations.filter(spot => {
    if (categoryFilter === 'all') return true;
    return spot.category === categoryFilter;
  });

  const selectedSpot = visitorLocations.find(s => s.id === selectedSpotId) || visitorLocations[0];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'river': return Waves;
      case 'historical': return Mountain;
      case 'watchtower': return Eye;
      case 'stay': return Trees;
      default: return Compass;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'hi'
                ? 'इंटरएक्टिव रिजर्व मानचित्र एवं पर्यटक स्थल'
                : language === 'ur'
                ? 'ریزرو نقشہ اور سیاحتی مقامات'
                : 'Interactive Reserve Cartography & Tourist Locations'}
            </span>
          </div>
          <span className="text-emerald-300/60 text-xs font-mono hidden sm:inline">•</span>
          <span className="text-emerald-200/80 text-xs font-mono">
            {language === 'hi' ? 'जीपीएस निर्देशांक • रूट नेविगेशन • रेंज विवरण' : 'GPS Coordinates • Navigation • Range Beats'}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          {language === 'hi'
            ? 'वाल्मीकि रिजर्व मानचित्र एवं पर्यटक गाइड'
            : language === 'ur'
            ? 'والمیکی ریزرو میپ اور اہم مقامات'
            : 'Reserve Map, Tourist Locations & Directions'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'वाल्मीकिनगर, मंगुराहा, मदनपुर, गोबरधना, गंडक बराज, जटाशंकर और सोमेश्वर ट्रेक सहित सभी प्रमुख सार्वजनिक स्थलों का अन्वेषण करें। गूगल मैप्स में सीधे दिशा-निर्देश प्राप्त करें।'
            : language === 'ur'
            ? 'والمیکی نگر، منگوراہا، گندک بیراج، اور دیگر محفوظ سیاحتی مقامات کے راستے اور تفصیلات۔'
            : 'Explore public visitor hubs, safari gates, river vantage points, watchtowers, and forest rest houses across Valmiki Tiger Reserve. Launch one-click turn-by-turn directions in Google Maps.'}
        </p>

        {/* Safety & Cartographic Generalization Disclaimer */}
        <div className="bg-[#07271D] border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start space-x-3 rtl:space-x-reverse">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wide block font-mono text-[11px]">
              {language === 'hi' ? 'मानचित्र सुरक्षा एवं गोपनीयता सूचना' : 'Cartographic & Wildlife Protection Notice'}
            </span>
            <p className="leading-relaxed text-[11px]">
              {language === 'hi'
                ? 'वन्यजीवों की सुरक्षा और शिकार-रोधी प्रोटोकॉल के तहत संवेदनशील बाघ प्रजनन क्षेत्रों और गुप्त गश्ती ग्रिडों के जीपीएस निर्देशांक सार्वजनिक नक्शों से बाहर रखे गए हैं।'
                : language === 'ur'
                ? 'شیروں کے افزائش نسل کے حساس مقامات اور خفیہ پیٹرولنگ گرڈز کو جنگلی حیات کے تحفظ کی خاطر پبلک نقشوں سے دور رکھا گیا ہے۔'
                : 'Specific anti-poaching patrol grids and wild tiger breeding den coordinates are strictly excluded from public maps to maintain operational secrecy and wildlife safety.'}
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          <button
            onClick={() => setViewMode('spots')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
              viewMode === 'spots'
                ? 'bg-[#0B3D2E] text-amber-300 shadow'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पर्यटक स्थल एवं दिशा-निर्देश' : '📍 Tourist Spots & Directions'}</span>
          </button>

          <button
            onClick={() => setViewMode('zonation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
              viewMode === 'zonation'
                ? 'bg-[#0B3D2E] text-amber-300 shadow'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'रिजर्व रेंज जोनेशन नक्शा' : '🗺️ Range Zonation Map'}</span>
          </button>
        </div>

        {viewMode === 'spots' && (
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: language === 'hi' ? 'सभी स्थल' : 'All Spots' },
              { id: 'gate', label: language === 'hi' ? 'गेट व चेकपोस्ट' : 'Gates & Hubs' },
              { id: 'river', label: language === 'hi' ? 'नदी व संगम' : 'River & Confluence' },
              { id: 'watchtower', label: language === 'hi' ? 'वॉच टॉवर' : 'Watchtowers' },
              { id: 'historical', label: language === 'hi' ? 'ऐतिहासिक व ट्रेक' : 'Treks & Heritage' },
              { id: 'stay', label: language === 'hi' ? 'आवास' : 'Stays' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MODE 1: TOURIST SPOTS DIRECTORY & DIRECTIONS */}
      {viewMode === 'spots' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Spots Selector List */}
          <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredSpots.map(spot => {
              const Icon = getCategoryIcon(spot.category);
              const isSelected = spot.id === selectedSpotId;

              return (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpotId(spot.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-[#0B3D2E] text-white border-[#145A43] shadow-md'
                      : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                    isSelected ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'bg-stone-100 text-stone-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                        isSelected ? 'text-amber-300' : 'text-emerald-800'
                      }`}>
                        {spot.range}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        isSelected ? 'text-emerald-200/80' : 'text-stone-500'
                      }`}>
                        {spot.elevation}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm leading-snug truncate">
                      {language === 'hi' ? spot.nameHi : spot.name}
                    </h4>
                    <p className={`text-xs truncate mt-1 ${
                      isSelected ? 'text-emerald-100/75' : 'text-stone-500'
                    }`}>
                      {spot.coordsDisplay}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Spot Deep Dossier & Maps Action */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      {selectedSpot.range}
                    </span>
                    <span className="text-xs font-mono text-stone-500">
                      Elev: {selectedSpot.elevation}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
                    {language === 'hi' ? selectedSpot.nameHi : selectedSpot.name}
                  </h3>
                </div>

                {/* Open in Google Maps Primary Button */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.coordinates.lat},${selectedSpot.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#0B3D2E] hover:bg-[#145A43] text-amber-300 font-mono font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all flex-shrink-0"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{language === 'hi' ? 'गूगल मैप्स में दिशा देखें' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Coordinates & Access Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 font-mono block mb-1">📍 GPS Coordinates:</span>
                  <strong className="text-stone-900 font-mono text-sm block">{selectedSpot.coordsDisplay}</strong>
                  <span className="text-stone-500 text-[11px]">Lat: {selectedSpot.coordinates.lat}, Lng: {selectedSpot.coordinates.lng}</span>
                </div>

                <div>
                  <span className="text-stone-500 font-mono block mb-1">🚗 Road Transit / How to Reach:</span>
                  <p className="text-stone-700 font-medium leading-relaxed">
                    {language === 'hi' ? selectedSpot.howToReachHi : selectedSpot.howToReach}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">
                  {language === 'hi' ? 'विवरण एवं पारिस्थितिक महत्व:' : 'Location Overview & Features:'}
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {language === 'hi' ? selectedSpot.descriptionHi : selectedSpot.description}
                </p>
              </div>

              {/* Key Attractions */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-[11px]">
                  {language === 'hi' ? 'प्रमुख आकर्षण एवं गतिविधियां:' : 'What Visitors Can See & Do:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedSpot.attractions.map((att, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-950 font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>{att}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Tip */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
              <span>Status: Public Access with Forest Permit</span>
              <span>Division I & II VTR</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: VECTOR SCHEMATIC ZONATION MAP */}
      {viewMode === 'zonation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Vector Map Canvas Column */}
          <div className="lg:col-span-2 bg-[#07271D] rounded-3xl p-6 sm:p-8 border border-emerald-800 text-white space-y-6 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Layers className="w-5 h-5 text-amber-400" />
                <span className="font-display font-bold text-base">VTR Schematic Zonation Map</span>
              </div>
              <span className="text-xs font-mono text-emerald-300">Indo-Nepal TAL Boundary</span>
            </div>

            {/* Stylized SVG Map */}
            <div className="relative w-full h-80 sm:h-96 bg-[#041B14] rounded-2xl border border-emerald-900/80 p-4 flex items-center justify-center overflow-hidden">
              <div className="absolute top-4 right-4 text-[10px] font-mono text-amber-400 bg-[#0B3D2E] px-2 py-1 rounded border border-amber-500/30">
                ▲ North (Chitwan NP, Nepal)
              </div>

              <svg className="w-full h-full" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* River Gandak */}
                <path
                  d="M 50 10 Q 70 120 40 220 T 60 340"
                  stroke="#38BDF8"
                  strokeWidth="14"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <text x="15" y="180" fill="#38BDF8" fontSize="10" fontFamily="monospace" transform="rotate(-90 15,180)">
                  Gandak / Narayani River
                </text>

                {/* Someshwar Hill Ridge */}
                <path
                  d="M 80 40 Q 250 15 480 30"
                  stroke="#D97706"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                />
                <text x="200" y="30" fill="#FBBF24" fontSize="9" fontFamily="monospace">
                  Someshwar Ridge (Indo-Nepal Border)
                </text>

                {/* 1. Valmikinagar */}
                <g onClick={() => setActiveZone('valmikinagar')} className="cursor-pointer transition-all hover:opacity-90">
                  <polygon
                    points="80,50 180,60 160,160 70,140"
                    fill={activeZone === 'valmikinagar' ? '#F59E0B' : '#0B3D2E'}
                    stroke="#10B981"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                  <text x="90" y="105" fill={activeZone === 'valmikinagar' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                    Valmikinagar
                  </text>
                  <circle cx="110" cy="70" r="4" fill="#EF4444" />
                  <text x="118" y="73" fill="#FFF" fontSize="8">Barrage Gate</text>
                </g>

                {/* 2. Gonauli (Core) */}
                <g onClick={() => setActiveZone('gonauli')} className="cursor-pointer transition-all hover:opacity-90">
                  <polygon
                    points="180,60 330,50 310,180 160,160"
                    fill={activeZone === 'gonauli' ? '#F59E0B' : '#064E3B'}
                    stroke="#10B981"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <text x="210" y="115" fill={activeZone === 'gonauli' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                    Gonauli Core
                  </text>
                  <text x="215" y="130" fill={activeZone === 'gonauli' ? '#000' : '#A7F3D0'} fontSize="8">
                    (Inviolate)
                  </text>
                </g>

                {/* 3. Madanpur */}
                <g onClick={() => setActiveZone('madanpur')} className="cursor-pointer transition-all hover:opacity-90">
                  <polygon
                    points="70,140 160,160 140,290 60,260"
                    fill={activeZone === 'madanpur' ? '#F59E0B' : '#0B3D2E'}
                    stroke="#10B981"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                  <text x="80" y="210" fill={activeZone === 'madanpur' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                    Madanpur
                  </text>
                  <text x="80" y="225" fill={activeZone === 'madanpur' ? '#000' : '#A7F3D0'} fontSize="8">
                    Wetlands
                  </text>
                </g>

                {/* 4. Manguraha */}
                <g onClick={() => setActiveZone('manguraha')} className="cursor-pointer transition-all hover:opacity-90">
                  <polygon
                    points="330,50 470,40 450,190 310,180"
                    fill={activeZone === 'manguraha' ? '#F59E0B' : '#0B3D2E'}
                    stroke="#10B981"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                  <text x="360" y="115" fill={activeZone === 'manguraha' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                    Manguraha
                  </text>
                  <circle cx="430" cy="70" r="4" fill="#EF4444" />
                  <text x="390" y="65" fill="#FFF" fontSize="8">Someshwar Fort</text>
                </g>

                {/* 5. Raghia */}
                <g onClick={() => setActiveZone('raghia')} className="cursor-pointer transition-all hover:opacity-90">
                  <polygon
                    points="160,160 450,190 430,310 140,290"
                    fill={activeZone === 'raghia' ? '#F59E0B' : '#064E3B'}
                    stroke="#10B981"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                  <text x="270" y="240" fill={activeZone === 'raghia' ? '#000' : '#FFF'} fontSize="11" fontWeight="bold">
                    Raghia & Harnatanr Buffer
                  </text>
                </g>
              </svg>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-mono text-emerald-200 border-t border-emerald-800/80 pt-3">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="w-3 h-3 bg-[#0B3D2E] border border-[#10B981] rounded-sm"></span>
                <span>Ecotourism & River Buffer</span>
              </div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="w-3 h-3 bg-[#064E3B] border border-[#10B981] rounded-sm"></span>
                <span>Inviolate Core Zone</span>
              </div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
                <span>Selected Sector</span>
              </div>
            </div>
          </div>

          {/* Right Column: Zone Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider block">
                  Range Sector Profile
                </span>
                <h3 className="font-display font-bold text-2xl text-stone-900">
                  {activeZone === 'valmikinagar' && 'Valmikinagar Range & Triveni Confluence'}
                  {activeZone === 'gonauli' && 'Gonauli Core Range (Inviolate)'}
                  {activeZone === 'madanpur' && 'Madanpur Range & Wetland Complex'}
                  {activeZone === 'manguraha' && 'Manguraha Range & Someshwar Foothills'}
                  {activeZone === 'raghia' && 'Raghia & Harnatanr Buffer Corridor'}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
                {activeZone === 'valmikinagar' && (
                  <p>The primary gateway to VTR. Features boat safaris on the Gandak, canopy walks, and historical Triveni river confluence bordering Nepal.</p>
                )}
                {activeZone === 'gonauli' && (
                  <p>The biological heart of Valmiki Tiger Reserve. Closed to regular tourism to ensure undisturbed breeding space for apex carnivores and ungulate herds.</p>
                )}
                {activeZone === 'madanpur' && (
                  <p>A vital wetland grassland corridor connecting with Chitwan. Home to diverse waterbirds and transit corridors for large mammals.</p>
                )}
                {activeZone === 'manguraha' && (
                  <p>Historic trailhead leading to Fort Someshwar along the Indo-Nepal international boundary. Offers scenic canyon drives and jungle cottages.</p>
                )}
                {activeZone === 'raghia' && (
                  <p>Key herbivore grazing zone monitored extensively via automated camera traps and frontline foot patrols.</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 font-mono">
              ✓ Monitored via M-STrIPES Spatial Patrols<br />
              ✓ Strict 20 km/h Forest Speed Limit
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
