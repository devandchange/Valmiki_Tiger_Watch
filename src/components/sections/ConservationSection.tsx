import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  Radio, 
  Globe, 
  Zap, 
  Activity, 
  MapPin, 
  Footprints, 
  HeartHandshake,
  AlertCircle,
  Trees,
  Scale,
  Compass,
  CheckCircle2,
  Phone,
  Flame,
  AlertTriangle,
  Award,
  Users
} from 'lucide-react';

export const ConservationSection: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'strategies' | 'corridors' | 'community' | 'laws' | 'visitor-role'>('strategies');

  return (
    <div className="space-y-10 animate-fade-in pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'hi'
                ? 'राष्ट्रीय बाघ संरक्षण एवं पारिस्थितिक तंत्र ढांचा'
                : language === 'ur'
                ? 'قومی ٹائیگر کنزرویشن فریم ورک'
                : 'National Tiger Conservation Framework'}
            </span>
          </div>
          <span className="text-emerald-300/60 text-xs font-mono hidden sm:inline">•</span>
          <span className="text-emerald-200/80 text-xs font-mono">
            {language === 'hi' ? 'प्रोजेक्ट टाइगर • एनटीसीए • बिहार वन विभाग' : language === 'ur' ? 'پروجیکٹ ٹائیگر • این ٹی سی اے' : 'Project Tiger • NTCA • Bihar Forest Dept'}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          {language === 'hi'
            ? 'बाघ संरक्षण, सुरक्षा एवं एंटी-पोचिंग तंत्र'
            : language === 'ur'
            ? 'ٹائیگر کنزرویشن، تحفظ اور اینٹی پوچنگ فریم ورک'
            : 'Tiger Conservation, Habitat Protection & Anti-Poaching'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर रिजर्व के 899.38 वर्ग किमी के विशाल तराई-भाबर वन क्षेत्र में डिजिटल गश्त, इंडो-नेपाल सीमा पार गलियारे, मानव-वन्यजीव संघर्ष शमन और थारू जनजातीय भागीदारी के माध्यम से बाघों का संरक्षण किया जाता है।'
            : language === 'ur'
            ? 'والمیکی ٹائیگر ریزرو کے 899 مربع کلومیٹر کے جنگلات کی حفاظت جدید ڈیجیٹل نگرانی، پاک و ہند نیپال سرحدی راہداریوں اور مقامی قبائلی اشتراک کے ذریعے کی جاتی ہے۔'
            : 'Safeguarding 899.38 sq km of rugged Terai-Bhabar forest demands relentless vigilance. Valmiki deploys cutting-edge digital spatial monitoring (M-STrIPES), transboundary Indo-Nepal intelligence sharing, habitat restoration, and grassroots community defense networks.'}
        </p>

        {/* Emergency Helpline Box */}
        <div className="p-4 bg-[#07271D]/90 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs text-amber-200">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 bg-red-600 text-white rounded-xl flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                {language === 'hi' ? '24x7 वन्यजीव बचाव एवं शिकार-रोधी नियंत्रण कक्ष' : language === 'ur' ? '24/7 ایمرجنسی کنٹرول روم' : '24x7 VTR Wildlife Rescue & Anti-Poaching Control'}
              </span>
              <span className="text-[11px] text-amber-300/90">
                {language === 'hi' ? 'घायल वन्यजीव, अवैध गतिविधि या भटकते बाघ की सूचना तुरंत दें' : language === 'ur' ? 'جنگلی حیات کی ایمرجنسی یا غیر قانونی سرگرمی کی اطلاع دیں' : 'Report injured wildlife, forest fires, or suspicious activity immediately'}
              </span>
            </div>
          </div>
          <div className="font-mono text-amber-300 font-bold text-sm bg-black/50 px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-center">
            Toll-Free: 1800-345-6188 / +91-6254-232147
          </div>
        </div>
      </div>

      {/* Interactive Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'strategies', label: language === 'hi' ? 'सुरक्षा रणनीतियां' : language === 'ur' ? 'تحفظی حکمت عملی' : '🛡️ Core Strategies', icon: ShieldCheck },
          { id: 'corridors', label: language === 'hi' ? 'वन्यजीव गलियारे' : language === 'ur' ? 'حیاتیاتی راہداریاں' : '🌐 Transboundary Corridors', icon: Globe },
          { id: 'community', label: language === 'hi' ? 'समुदाय व संघर्ष शमन' : language === 'ur' ? 'قبائلی اشتراک و تنازعات' : '🤝 Community & Conflict', icon: HeartHandshake },
          { id: 'laws', label: language === 'hi' ? 'वन्यजीव कानून (WPA 1972)' : language === 'ur' ? 'قانونی دفعات WPA' : '⚖️ Wildlife Laws & WPA 1972', icon: Scale },
          { id: 'visitor-role', label: language === 'hi' ? 'पर्यटक कैसे सहयोग करें' : language === 'ur' ? 'سیاحوں کا کردار' : '🌱 How Visitors Can Help', icon: Compass }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#0B3D2E] text-amber-300 shadow-md'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CORE STRATEGIES */}
      {activeTab === 'strategies' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strategy 1: M-STrIPES */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-stone-900">
                  {language === 'hi' ? 'M-STrIPES डिजिटल पेट्रोलिंग' : language === 'ur' ? 'ایم اسٹرائپس ڈیجیٹل پیٹرولنگ' : 'M-STrIPES Digital Patrolling'}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'एनटीसीए के एम-स्ट्राइप्स मोबाइल सिस्टम द्वारा जीपीएस-सक्षम गश्त की जाती है। सभी 8 रेंजों में पगमार्क, प्रत्यक्ष दर्शन, स्निफर ट्रैप और वन विक्षोभ सीधे केंद्रीय सर्वर पर दर्ज होते हैं।'
                    : language === 'ur'
                    ? 'این ٹی سی اے کے ایم اسٹرائپس موبائل سسٹم کے ذریعے تمام آٹھ رینجز میں جی پی ایس پر مبنی پٹرولنگ کا نظام۔'
                    : 'Frontline foot patrols record geo-referenced observations using the NTCA M-STrIPES mobile system. Every patrol track, snare detection, direct animal sighting, and habitat disturbance is mapped into central GIS servers.'}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 font-mono space-y-1">
                <div>✓ {language === 'hi' ? '120+ दैनिक गश्ती हैंडसेट सक्रिय' : '120+ Daily Patrol Handsets Active'}</div>
                <div>✓ {language === 'hi' ? 'सभी 8 वन रेंजों में पूर्ण कवरेज' : 'Full Spatial Coverage Across 8 Ranges'}</div>
              </div>
            </div>

            {/* Strategy 2: Grassland Restoration */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Trees className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-stone-900">
                  {language === 'hi' ? 'घास के मैदान और जल स्रोत संवर्धन' : language === 'ur' ? 'گھاس کے میدان اور آبی وسائل' : 'Grassland & Waterhole Restoration'}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'चीतल, सांभर और गौर जैसे शाकाहारी शिकार आधार को बनाए रखने हेतु खरपतवार (लैंटाना) उन्मूलन, प्रारंभिक नियंत्रित अग्नि चक्र और 150+ सौर ऊर्जा चालित जलकुंभों का रखरखाव किया जाता है।'
                    : language === 'ur'
                    ? 'شکار کی کثافت بڑھانے کے لیے گھاس کے میدانوں کا سائنسی انتظام اور شمسی توانائی سے چلنے والے آبی تالاب۔'
                    : 'To maintain high ungulate prey density (Chital, Sambar, Gaur), the forest department conducts weed eradication, early-season prescribed burning, and desilts 150+ solar-powered artificial waterholes.'}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900 font-mono space-y-1">
                <div>✓ {language === 'hi' ? '150+ सौर बोरवेल एवं जलकुंड' : '150+ Solar Waterholes & Check-dams'}</div>
                <div>✓ {language === 'hi' ? 'गोबरधना व मदनपुर में घास सुधार' : 'Grassland enrichment in alluvial flats'}</div>
              </div>
            </div>

            {/* Strategy 3: Anti-Poaching Camps */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-stone-900">
                  {language === 'hi' ? '32+ आंतरिक शिकार-रोधी शिविर (APCs)' : language === 'ur' ? '32+ اینٹی پوچنگ کیمپس' : '32+ Interior Anti-Poaching Camps'}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'गोनौली, हरनाटांड़, मंगुराहा और सोमेश्वर की दुर्गम पहाड़ियों में 32 स्थायी शिविर 24 घंटे तैनात रहते हैं। विशेष खोजी श्वान दस्ते (स्निफर डॉग्स) और प्रशिक्षित एसटीपीएफ कर्मियों द्वारा नियमित जांच होती है।'
                    : language === 'ur'
                    ? 'جنگل کے گہرے حصوں میں 32 مستقل کیمپس اور تربیت یافتہ سنفر کتے چوبیس گھنٹے تعینات رہتے ہیں۔'
                    : 'Stationed deep in inviolate core zones and along the Indo-Nepal international border, 32 permanent camps house armed guards, sniffer dog squads, and frontline tribal trackers round the clock.'}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 font-mono space-y-1">
                <div>✓ {language === 'hi' ? 'विशेष बाघ सुरक्षा बल (STPF)' : 'Special Tiger Protection Force (STPF)'}</div>
                <div>✓ {language === 'hi' ? 'कैनाइन स्निफर स्क्वाड सक्रिय' : 'Trained K9 Wildlife Sniffer Units'}</div>
              </div>
            </div>
          </div>

          {/* Frontline Rangers Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2.5 bg-[#0B3D2E] text-amber-400 rounded-xl flex-shrink-0">
                <Footprints className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {language === 'hi' ? 'अग्रिम पंक्ति के वन रक्षक एवं ट्रैकर' : language === 'ur' ? 'فرنٹ لائن فارسٹ گارڈز اور ٹریکرز' : 'Frontline Forest Rangers & Indigenous Trackers'}
                </h2>
                <p className="text-xs text-stone-500 font-mono">
                  {language === 'hi' ? 'कठिन मौसम, बाढ़ और घने जंगलों में निरंतर गश्त' : 'Patrolling 15–20 km daily in extreme monsoon floods, dense fog, and predator zones'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p>
                {language === 'hi'
                  ? 'वाल्मीकि टाइगर रिजर्व के समर्पित वन रक्षक, दैनिक वेतनभोगी ट्रैकर और स्थानीय थारू युवा प्रतिदिन 15 से 20 किमी पैदल चलकर बाघ, भालू और तेंदुओं के आवासों की निगरानी करते हैं। जीपीएस, फील्ड किट और लाठी से लैस ये रक्षक अवैध शिकार, लकड़ी की तस्करी और अवैध चराई को रोकते हैं।'
                  : language === 'ur'
                  ? 'والمیکی ٹائیگر ریزرو کے فارسٹ گارڈز اور مقامی تھارو نوجوان روزانہ 15 سے 20 کلومیٹر پیدل چل کر جنگلی حیات کی حفاظت کرتے ہیں اور غیر قانونی شکار و کٹائی کو روکتے ہیں۔'
                  : 'The frontline staff of Valmiki Tiger Reserve, including foresters, daily-wager trackers, and local Tharu youth, traverse 15 to 20 kilometers on foot daily through tiger and sloth bear terrain. Equipped with GPS handsets, field kits, and bamboo lathis, they guard against illegal timber extractors, poachers, and cattle grazing.'}
              </p>
              <p>
                {language === 'hi'
                  ? 'गंडक नदी में घड़ियाल और मगरमच्छों के संरक्षण के लिए गश्ती नावों का उपयोग होता है, वहीं कैमरों के माध्यम से 54+ बाघों की व्यक्तिगत धारियों का निरंतर डेटाबेस अपडेट किया जाता है।'
                  : language === 'ur'
                  ? 'گندک ندی میں پیٹرولنگ کشتیوں کے ذریعے گھڑیالوں کا تحفظ اور کیمرہ ٹریپس کے ذریعے شیروں کے سٹرائپ ڈیٹا کی نگرانی کی جاتی ہے۔'
                  : 'Supported by specialized river patrolling boats along the Gandak and 2,000+ camera trap grid stations, these rangers maintain continuous water supplies, map fresh pugmarks, and foster peaceful relations with border agricultural communities.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORRIDORS */}
      {activeTab === 'corridors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl flex-shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">
                {language === 'hi' ? 'चितवन-वाल्मीकि-परसा सीमा पार गलियारा' : language === 'ur' ? 'چتوان-والمیکی سرحد پار راہداری' : 'Chitwan-Valmiki-Parsa Transboundary Corridor'}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {language === 'hi' ? 'भारत-नेपाल अंतरराष्ट्रीय वन्यजीव पारिस्थितिक तंत्र' : 'Contiguous Indo-Nepal Landscape for Meta-population Gene Flow'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <div className="space-y-3 p-5 bg-blue-50/60 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-950 text-base">
                {language === 'hi' ? 'सीमा पार अनुवांशिक प्रवाह (Gene Flow)' : 'Genetic Continuity & Animal Dispersal'}
              </h4>
              <p>
                {language === 'hi'
                  ? 'वाल्मीकि और नेपाल का चितवन राष्ट्रीय उद्यान तथा परसा वन्यजीव अभयारण्य मिलकर 2,000 वर्ग किमी से अधिक का अखंड तराई वन बनाते हैं। यह गलियारा बाघों, एक सींग वाले गैंडों और हाथियों को बिना किसी अवरोध के आवागमन की सुविधा प्रदान करता है, जिससे इनब्रीडिंग की समस्या दूर होती है।'
                  : 'VTR forms a contiguous ecological expanse with Nepal’s Chitwan National Park (952 sq km) and Parsa National Park (627 sq km). Together, they form a massive transboundary metapopulation landscape exceeding 2,500 sq km, ensuring healthy gene flow for tigers, transient rhinos, and Asian elephants.'}
              </p>
            </div>

            <div className="space-y-3 p-5 bg-stone-50 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'hi' ? 'संयुक्त गश्त एवं सूचना साझाकरण' : 'Joint Border Coordination Protocol'}
              </h4>
              <p>
                {language === 'hi'
                  ? 'भारत और नेपाल के वन अधिकारी द्विपक्षीय बैठकों में कैमरा-ट्रैप डेटा, तस्करों की खुफिया जानकारी और सीमावर्ती क्षेत्रों में संयुक्त फ्लैश जांच साझा करते हैं। इससे वन्यजीव अपराधों पर शून्य-सहनशीलता (Zero Tolerance) सुनिश्चित होती है।'
                  : 'Bimonthly transboundary coordination meetings synchronize anti-snare sweeps, harmonize camera-trap stripe databases, and share intelligence on cross-border wildlife contraband syndicates.'}
              </p>
            </div>
          </div>

          {/* Key Corridors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">Corridor 1</span>
              <strong className="text-stone-900 text-sm block">Someshwar Ridge Pass</strong>
              <p className="text-xs text-stone-600">High-altitude hill transit connecting Manguraha to Chitwan highlands for leopards, serow, and dispersing sub-adult tigers.</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">Corridor 2</span>
              <strong className="text-stone-900 text-sm block">Madanpur-Triveni Grasslands</strong>
              <p className="text-xs text-stone-600">Alluvial floodplains enabling transient Rhinos, Swamp Deer, and Hog Deer to cross between Nepal and Bihar flood sectors.</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">Corridor 3</span>
              <strong className="text-stone-900 text-sm block">Gandak Riverine Basin</strong>
              <p className="text-xs text-stone-600">Continuous aquatic sanctuary for breeding Gharials, Gangetic Dolphins, Smooth-coated Otters, and migratory waterbirds.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY & HWC */}
      {activeTab === 'community' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {language === 'hi' ? 'सामुदायिक सहभागिता एवं मानव-वन्यजीव संघर्ष शमन' : language === 'ur' ? 'قبائلی اشتراک اور تنازعات کا خاتمہ' : 'Community Coexistence & Human-Wildlife Conflict (HWC) Mitigation'}
                </h2>
                <p className="text-xs text-stone-500 font-mono">
                  {language === 'hi' ? 'थारू-उरांव समुदाय, पर्यावरण-विकास समितियां और 42+ किमी सोलर फेंसिंग' : 'Tribal Eco-Development Committees (EDCs) and 42+ km Solar Fencing'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="space-y-3 p-5 bg-amber-50/50 rounded-2xl border border-amber-200">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-900 font-bold text-base">
                  <Zap className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>{language === 'hi' ? 'गैर-घातक सौर बाड़ (Solar Fencing)' : 'Non-Lethal Solar Fencing (42+ km)'}</span>
                </div>
                <p>
                  {language === 'hi'
                    ? 'गन्ने की खेती वाले सीमांत गांवों में बाघों और तेंदुओं के प्रवेश को रोकने के लिए 42+ किमी लंबी गैर-घातक सोलर फेंसिंग लगाई गई है, जो पशुओं और ग्रामीणों को सुरक्षित रखती है बिना वन्यजीवों को नुकसान पहुंचाए।'
                    : 'To protect fringe farming villages along sugarcane belts, non-lethal solar-energized power fences deliver mild, pulsating shocks that deter carnivores and wild boars without causing physical injury.'}
                </p>
              </div>

              <div className="space-y-3 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-900 font-bold text-base">
                  <HeartHandshake className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <span>{language === 'hi' ? 'पर्यावरण-विकास समितियां (EDCs)' : 'Eco-Development Committees (EDCs)'}</span>
                </div>
                <p>
                  {language === 'hi'
                    ? 'रिजर्व के चारों ओर स्थित 100 से अधिक गांवों में ईडीसी का गठन किया गया है। ईकोटूरिज्म से प्राप्त राजस्व का एक हिस्सा सीधे स्थानीय स्कूलों, सौर स्ट्रीट लाइटों और कौशल विकास में निवेश किया जाता है।'
                    : 'Over 100 village EDCs empower indigenous Tharu and Uraon families. Safari vehicle operations, nature guide fees, and eco-hut hospitality revenue flow directly to village funds, creating direct economic stakes in tiger survival.'}
                </p>
              </div>
            </div>

            {/* Rapid Compensation & Vet Squad */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm space-y-2">
              <strong className="text-stone-900 block font-bold text-base">
                {language === 'hi' ? 'त्वरित राहत मुआवजा एवं 24/7 रैपिड रिस्पांस रेस्क्यू टीम' : 'Rapid Ex-Gratia Compensation & 24/7 Veterinary Rescue Squad'}
              </strong>
              <p className="text-stone-600 leading-relaxed">
                {language === 'hi'
                  ? 'मवेशी क्षति या फसल नुकसान की स्थिति में वन विभाग त्वरित डिजिटल मूल्यांकन और प्रत्यक्ष बैंक हस्तांतरण (DBT) के माध्यम से राहत राशि प्रदान करता है। इससे प्रतिशोधवश जहर देने या शिकार की घटनाओं पर पूर्ण विराम लगा है।'
                  : 'In the event of accidental cattle lifting or crop damage, streamlined Direct Benefit Transfer (DBT) delivers ex-gratia compensation within 72 hours, completely eliminating retaliatory poisoning.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WILDLIFE LAWS & WPA 1972 */}
      {activeTab === 'laws' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2.5 bg-red-100 text-red-800 rounded-xl flex-shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">
                {language === 'hi' ? 'वन्यजीव संरक्षण अधिनियम, 1972 एवं विधिक प्रावधान' : language === 'ur' ? 'وائلڈ لائف پروٹیکشن ایکٹ 1972' : 'Wildlife Protection Act (WPA 1972) & Legal Framework'}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {language === 'hi' ? 'अनुसूची-1 (Schedule I) के तहत बाघों को सर्वोच्च कानूनी सुरक्षा' : 'Schedule I Highest Legal Protection & Non-Bailable Penalties'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="p-5 bg-red-50/70 rounded-2xl border border-red-200 space-y-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-red-900 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{language === 'hi' ? 'कठोर दंड एवं गैर-जमानती अपराध' : 'Strict Penalties for Poaching & Trade'}</span>
              </div>
              <ul className="space-y-2 text-stone-700 leading-relaxed list-disc list-inside">
                <li><strong>Schedule I Species:</strong> Royal Bengal Tigers receive the highest level of protection in Indian law.</li>
                <li><strong>Imprisonment:</strong> Hunting, snaring, or possessing tiger parts carries a mandatory 3 to 7 years rigorous imprisonment and substantial monetary fines.</li>
                <li><strong>Non-Bailable:</strong> Wildlife offenses within National Parks and Tiger Reserves are non-bailable under Section 51 of WPA 1972.</li>
              </ul>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-stone-900 font-bold text-base">
                <Award className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>{language === 'hi' ? 'अंतरराष्ट्रीय संरक्षण दर्जा (CITES & IUCN)' : 'International Status (CITES & IUCN)'}</span>
              </div>
              <ul className="space-y-2 text-stone-700 leading-relaxed list-disc list-inside">
                <li><strong>IUCN Red List:</strong> Panthera tigris is classified as <em>Endangered</em>.</li>
                <li><strong>CITES Appendix I:</strong> Complete international commercial trade ban on tigers, tiger bone, skins, and claws.</li>
                <li><strong>Wildlife Crime Control Bureau (WCCB):</strong> Inter-agency intelligence coordination across all transit corridors.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-stone-100 rounded-2xl text-xs text-stone-700 font-mono">
            <strong>Legal Notice:</strong> Any attempt to harm wild animals, enter core zones without permits, fly unauthorized drones, or extract forest produce is punishable under the Indian Wildlife (Protection) Act, 1972.
          </div>
        </div>
      )}

      {/* TAB 5: HOW VISITORS CAN HELP */}
      {activeTab === 'visitor-role' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">
                {language === 'hi' ? 'पर्यटक एवं नागरिक कैसे योगदान दे सकते हैं' : language === 'ur' ? 'سیاح کس طرح مدد کر سکتے ہیں' : 'How Visitors & Nature Lovers Can Help Conservation'}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {language === 'hi' ? 'उत्तरदायी पर्यटन आचार संहिता एवं नागरिक विज्ञान' : 'Code of Conduct, Eco-Ethics & Responsible Tourism'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xl">🤫</span>
              <h4 className="font-bold text-stone-900 text-sm">{language === 'hi' ? 'शांति बनाए रखें' : 'Maintain Absolute Silence'}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi' ? 'सफारी के दौरान शोर न करें, फोन साइलेंट रखें और जानवरों को उनके प्राकृतिक व्यवहार में बाधा न पहुंचाएं।' : 'Never play loud music or shout during safari. Muted voices allow you to hear alarm calls.'}
              </p>
            </div>

            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-xl">🚯</span>
              <h4 className="font-bold text-stone-900 text-sm">{language === 'hi' ? 'शून्य प्लास्टिक कचरा' : 'Zero Single-Use Plastic'}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi' ? 'जंगल में कोई कचरा न फेंकें। प्लास्टिक खाने से चीतल और हिरणों की मृत्यु हो सकती है।' : 'Carry your own reusable metal bottle. Never discard wrappers or plastic bottles inside the reserve.'}
              </p>
            </div>

            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
              <span className="text-xl">🛍️</span>
              <h4 className="font-bold text-stone-900 text-sm">{language === 'hi' ? 'स्थानीय हस्तशिल्प खरीदें' : 'Support Tribal Artisans'}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi' ? 'थारू समुदाय के बेंत उत्पाद, जैविक शहद और हस्तशिल्प खरीदकर सीधे उनके सशक्तिकरण में भागीदार बनें।' : 'Purchase authentic Tharu cane crafts, organic forest honey, and stay at registered community homestays.'}
              </p>
            </div>

            <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2">
              <span className="text-xl">📸</span>
              <h4 className="font-bold text-stone-900 text-sm">{language === 'hi' ? 'बिना फ्लैश फोटोग्राफी' : 'No Flash Photography'}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi' ? 'कैमरा फ्लैश का प्रयोग पूर्णतः वर्जित है क्योंकि यह वन्यजीवों को भयभीत और आक्रामक कर सकता है।' : 'Camera flash startles nocturnal predators and can temporarily blind animals in dense understory.'}
              </p>
            </div>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <strong className="text-stone-900 block font-bold">
                {language === 'hi' ? 'नागरिक विज्ञान में भाग लें' : 'Participate in Citizen Science'}
              </strong>
              <span>
                {language === 'hi'
                  ? 'यदि आप बफर जोन या स्वीकृत सफारी मार्ग पर कोई दुर्लभ पक्षी या वन्यजीव देखते हैं, तो हमारे "स्पीशीज स्पॉटर" चेकलिस्ट में दर्ज करें।'
                  : 'Log your verified sightings on the Species Spotter tool to assist ecological documentation.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
