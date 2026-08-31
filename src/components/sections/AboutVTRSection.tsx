import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { VTRHistoryTimeline } from '../VTRHistoryTimeline';
import { 
  MapPin, 
  Mountain, 
  Droplets, 
  Compass, 
  Layers, 
  Trees,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AboutVTRSection: React.FC = () => {
  const { t, language, isRtl } = useLanguage();

  const forestRanges = [
    { 
      name: language === 'hi' ? 'वाल्मीकिनगर रेंज' : language === 'ur' ? 'والمیکی نگر رینج' : 'Valmikinagar Range', 
      division: 'Division I',
      terrain: language === 'hi' ? 'पहाड़ी / नदीय संगम' : language === 'ur' ? 'پہاڑی و ندی سنگم' : 'Hilly / Riverine Confluence', 
      focus: language === 'hi' ? 'पर्यावरण पर्यटन केंद्र, त्रिवेणी संगम, बेत वन' : language === 'ur' ? 'ماحولیاتی سیاحت، تریوینی سنگم، بید کے جنگلات' : 'Ecotourism hub, Triveni Sangam, Cane brakes' 
    },
    { 
      name: language === 'hi' ? 'गोनौली रेंज' : language === 'ur' ? 'گنولی رینج' : 'Gonauli Range', 
      division: 'Division I',
      terrain: language === 'hi' ? 'घने साल वन / सोमेश्वर कटक' : language === 'ur' ? 'گھنے سال جنگلات / سومیشور پہاڑی' : 'Dense Sal Forest / Someshwar Ridges', 
      focus: language === 'hi' ? 'कोर बाघ प्रजनन आवास, उच्च शिकार घनत्व' : language === 'ur' ? 'مرکزی افزائش نسل مسکن، کثیر شکار' : 'Core tiger breeding habitat, high prey density' 
    },
    { 
      name: language === 'hi' ? 'मदनपुर रेंज' : language === 'ur' ? 'مدن پور رینج' : 'Madanpur Range', 
      division: 'Division II',
      terrain: language === 'hi' ? 'जलोढ़ घास के मैदान व दलदल' : language === 'ur' ? 'گھاس کے میدان اور دلدل' : 'Alluvial Grasslands & Wetlands', 
      focus: language === 'hi' ? 'एक सींग वाले गैंडे का गलियारा, मगरमच्छ' : language === 'ur' ? 'گینڈوں کی گزرگاہ، دلدلی مگرمچھ' : 'One-horned Rhino transient zone, marsh crocodiles' 
    },
    { 
      name: language === 'hi' ? 'कोतराहा रेंज' : language === 'ur' ? 'کوٹراہا رینج' : 'Kotraha Range', 
      division: 'Division I',
      terrain: language === 'hi' ? 'भाबर क्षेत्र / पथरीली खड्डें' : language === 'ur' ? 'بھابھر علاقہ / پتھریلے نالے' : 'Bhabar Tract / River Ravines', 
      focus: language === 'hi' ? 'तेंदुए एवं भालू के पथरीले गलियारे' : language === 'ur' ? 'تیندوا اور ریچھ کی پہاڑی گزرگاہیں' : 'Leopard & sloth bear rocky corridors' 
    },
    { 
      name: language === 'hi' ? 'चिउटाहा रेंज' : language === 'ur' ? 'چیوٹاہا رینج' : 'Chiutaha Range', 
      division: 'Division II',
      terrain: language === 'hi' ? 'आर्द्र मिश्रित पर्णपाती वन' : language === 'ur' ? 'مرطوب پت جھڑ جنگلات' : 'Moist Mixed Deciduous', 
      focus: language === 'hi' ? 'शाकाहारी जीवों के घास चरने के क्षेत्र, कैमरा ग्रिड' : language === 'ur' ? 'ہرنوں کے چرنے کے میدان، کیمرہ گرڈ' : 'Ungulate grazing meadows, camera-trap grids' 
    },
    { 
      name: language === 'hi' ? 'हरनाटांड़ रेंज' : language === 'ur' ? 'ہرناٹانڑ رینج' : 'Harnatanr Range', 
      division: 'Division II',
      terrain: language === 'hi' ? 'वन सीमांत बफर क्षेत्र' : language === 'ur' ? 'جنگلاتی بفر علاقہ' : 'Forest-Fringe Buffer', 
      focus: language === 'hi' ? 'थारू समुदाय सह-अस्तित्व, सौर बाड़' : language === 'ur' ? 'تھارو برادری بقائے باہمی، سولر باڑ' : 'Community EDC coexistence, solar fences' 
    },
    { 
      name: language === 'hi' ? 'रघिया रेंज' : language === 'ur' ? 'رگھیا رینج' : 'Raghia Range', 
      division: 'Division II',
      terrain: language === 'hi' ? 'मौसमी जलधाराएं एवं साल वन' : language === 'ur' ? 'موسمی ندیاں اور سال جنگلات' : 'Intermittent Streams & Sal Forests', 
      focus: language === 'hi' ? 'चीतल व सांभर आबादी की निरंतर निगरानी' : language === 'ur' ? 'چیتل اور سانبھر کی کثافت کی نگرانی' : 'Chital & Sambar population monitoring' 
    },
    { 
      name: language === 'hi' ? 'मंगुराहा रेंज' : language === 'ur' ? 'منگوراہا رینج' : 'Manguraha Range', 
      division: 'Division I',
      terrain: language === 'hi' ? 'पूर्वी सोमेश्वर तलहटी' : language === 'ur' ? 'مشرقی سومیشور دامن' : 'Eastern Foothills', 
      focus: language === 'hi' ? 'सोमेश्वर किले का ट्रेक मार्ग, प्राचीन खड्डें' : language === 'ur' ? 'سومیشور قلعہ ٹریک، قدیم کھائیاں' : 'Trekker trail to Someshwar Fort, pristine ravines' 
    }
  ];

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className="space-y-12 animate-fade-in pb-10"
    >
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {language === 'hi' ? 'भौगोलिक विस्तार एवं पारिस्थितिकी संरचना' : language === 'ur' ? 'جغرافیائی و ماحولیاتی تعارف' : 'Geography & Ecosystem Architecture'}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर रिजर्व (वीटीआर) परिचय'
            : language === 'ur'
            ? 'والمیکی ٹائیگر ریزرو (وی ٹی آر) کا تفصیلی تعارف'
            : 'About Valmiki Tiger Reserve (VTR)'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर रिजर्व बिहार का एकमात्र राष्ट्रीय उद्यान और टाइगर रिजर्व है, जो पश्चिमी चंपारण जिले के उत्तरी छोर पर 899.38 वर्ग किलोमीटर में फैला है। यह उत्तर में नेपाल के चितवन नेशनल पार्क और पश्चिम में गंडक नदी से घिरा हुआ है।'
            : language === 'ur'
            ? 'والمیکی ٹائیگر ریزرو بہار کا واحد نیشنل پارک اور ٹائیگر ریزرو ہے جو ضلع مغربی چمپارن کے شمالی سرے پر 899.38 مربع کلومیٹر پر محیط ہے۔ اس کے شمال میں نیپال کا چتون نیشنل پارک اور مغرب میں دریائے گندک واقع ہے۔'
            : 'Valmiki Tiger Reserve is Bihar’s sole National Park and Tiger Reserve, sprawling across 899.38 square kilometers in the northernmost tip of West Champaran district, bordering Nepal’s Chitwan National Park to the north and the Gandak River to the west.'}
        </p>
      </div>

      {/* Core Zonation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="font-mono text-xs font-bold text-emerald-800 uppercase tracking-wider">
            {language === 'hi' ? 'राष्ट्रीय उद्यान (कोर ज़ोन)' : language === 'ur' ? 'نیشنل پارک (کور زون)' : 'National Park (Core Zone)'}
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
            335.65 <span className="text-base font-normal text-stone-500">{language === 'hi' ? 'वर्ग किमी' : language === 'ur' ? 'مربع کلومیٹر' : 'sq. km'}</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'पूर्णतः शून्य-हस्तक्षेप कोर क्षेत्र, जो विशेष रूप से बाघों, तेंदुओं और अन्य वन्यजीवों के निर्बाध प्रजनन और प्राकृतिक आवास हेतु आरक्षित है।'
              : language === 'ur'
              ? 'مکمل طور پر ناقابل مداخلت کور زون، جو خاص طور پر شیروں اور دیگر جنگلی حیات کی پرامن نسل کشی کے لیے وقف ہے۔'
              : 'Strictly inviolate core zone designated exclusively for wildlife reproduction and undisturbed predator-prey dynamics.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="font-mono text-xs font-bold text-amber-800 uppercase tracking-wider">
            {language === 'hi' ? 'वन्यजीव अभयारण्य (बफर ज़ोन)' : language === 'ur' ? 'وائلڈ لائف سینکچری (بفر زون)' : 'Wildlife Sanctuary (Buffer)'}
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
            563.73 <span className="text-base font-normal text-stone-500">{language === 'hi' ? 'वर्ग किमी' : language === 'ur' ? 'مربع کلومیٹر' : 'sq. km'}</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'विनियमित बफर क्षेत्र जो पर्यावरण-विकास समितियों, नियंत्रित चराई सीमांतों और सतत पर्यावरण-पर्यटन को सुगम बनाता है।'
              : language === 'ur'
              ? 'باقاعدہ بفر علاقہ جو مقامی قبائلی ترقی، کنٹرول شدہ چرائی اور ذمہ دارانہ ماحولیاتی سیاحت کا احاطہ کرتا ہے۔'
              : 'Regulated buffer zone supporting eco-development, controlled grazing fringes, and supervised nature tourism.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="font-mono text-xs font-bold text-indigo-800 uppercase tracking-wider">
            {language === 'hi' ? 'कुल संरक्षित वन विस्तार' : language === 'ur' ? 'کل محفوظ رقبہ' : 'Total Protected Expanse'}
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
            899.38 <span className="text-base font-normal text-stone-500">{language === 'hi' ? 'वर्ग किमी' : language === 'ur' ? 'مربع کلومیٹر' : 'sq. km'}</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'तराई आर्क लैंडस्केप (TAL) का पूर्वी आधार स्तंभ, जो भारत और नेपाल के बीच आनुवंशिक निरंतरता और जैव विविधता का रक्षक है।'
              : language === 'ur'
              ? 'ترائی آرک لینڈ اسکیپ (TAL) کا مشرقی مرکز، جو بھارت اور نیپال کے درمیان قدرتی جنگلاتی تسلسل کو قائم رکھتا ہے۔'
              : 'Continuous forest canopy representing one of the easternmost strongholds of the Terai Arc Landscape (TAL).'}
          </p>
        </div>
      </div>

      {/* Interactive History Timeline Integration */}
      <VTRHistoryTimeline />

      {/* Unique Landscape Features */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900">
          {language === 'hi'
            ? 'भौगोलिक एवं नदीय विशिष्टता'
            : language === 'ur'
            ? 'جغرافیائی اور دریائی خصوصیات'
            : 'Geographic & Riverine Character'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="space-y-6">
            <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl flex-shrink-0 mt-0.5 shadow-2xs">
                <Mountain className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-stone-900">
                  {language === 'hi' ? 'सोमेश्वर एवं दून पर्वतमाला' : language === 'ur' ? 'سومیشور اور دون پہاڑیاں' : 'The Someshwar & Dun Hills'}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? '880 मीटर की ऊंचाई (सोमेश्वर किला) तक उठने वाली शिवालिक कटक भारत और नेपाल के बीच प्राकृतिक प्राचीर बनाती है। इसमें खड़ी खड्डें, बाज व गिद्धों के घोंसले और गहरी वन घाटियां स्थित हैं।'
                    : language === 'ur'
                    ? '880 میٹر کی بلندی (قلعہ سومیشور) تک پھیلی ہوئی شیوالک پہاڑیاں پاک و ہند اور نیپال کے درمیان قدرتی رکاوٹ بناتی ہیں، جس میں گہری کھائیاں اور پرامن وادیاں ہیں۔'
                    : 'Rising to an altitude of 880 meters (Fort Someshwar), the outer Siwalik ridges form a natural mountain barrier separating India and Nepal, creating steep ravines, cliff-faces for raptors, and deep forested valleys.'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-2xl flex-shrink-0 mt-0.5 shadow-2xs">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-stone-900">
                  {language === 'hi' ? 'गंडक नदी एवं पहाड़ी जलधाराएं' : language === 'ur' ? 'دریائے گندک اور پہاڑی چشمے' : 'The Gandak & Hill Streams'}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'पश्चिमी सीमा पर विशाल गंडक (नेपाल में नारायणी) बहती है, जबकि सोनहा, पंडई, मनोर, हरहा और भपसा जैसी बारहमासी जलधाराएं मछलियों, ऊदबिलावों और घड़ियालों के लिए समृद्ध जलीय पारितंत्र बनाती हैं।'
                    : language === 'ur'
                    ? 'مغربی سرحد پر دریائے گندک اور جنگل کے اندر سونہا، پنڈئی اور بھپسا جیسے بارہ ماسی چشمے مچھلیوں، اودبلاؤ اور گھڑیال کے لیے بہترین ماحول فراہم کرتے ہیں۔'
                    : 'The mighty Gandak (Narayani in Nepal) flushes the western boundary, while perennial hill torrents like Sonha, Pandai, Manor, Harha, and Bhapsa create a rich wetland hydrology supporting fish, otters, and gharials.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl flex-shrink-0 mt-0.5 shadow-2xs">
                <Trees className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-stone-900">
                  {language === 'hi' ? 'चैंपियन एवं सेठ वन वर्गीकरण' : language === 'ur' ? 'چیمپیئن اور سیٹھ جنگلاتی اقسام' : 'Champion & Seth Forest Types'}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'वीटीआर में आर्द्र शिवालिक साल, भाबर-दून साल, पश्चिमी गांगेय आर्द्र पर्णपाती वन, नदी तट पर खैर-शीशम, और जलोढ़ सवाना घास के मैदान व दलदली बेत वन (Calamus tenuis) पाए जाते हैं।'
                    : language === 'ur'
                    ? 'والمیکی میں سال کے گہرے جنگلات، ندی کے کنارے کھیر و شیشم کے جھنڈ، گھاس کے وسیع چراگاہیں اور بید کے دلدلی علاقے شامل ہیں۔'
                    : 'VTR features Moist Siwalik Sal, Bhabar-Dun Sal, West Gangetic Moist Deciduous, Khair-Sissoo along riverbeds, and wet alluvial Savannah grasslands interspersed with swampy cane breaks (Calamus tenuis).'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
              <div className="p-2.5 bg-purple-100 text-purple-800 rounded-2xl flex-shrink-0 mt-0.5 shadow-2xs">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-stone-900">
                  {language === 'hi' ? 'तराई आर्क लैंडस्केप (TAL)' : language === 'ur' ? 'ترائی آرک لینڈ اسکیپ (TAL)' : 'The Terai Arc Landscape (TAL)'}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'वीटीआर अंतरराष्ट्रीय तराई आर्क भूभाग का एक अनिवार्य भाग है, जो भारत और नेपाल के बीच बाघ, तेंदुआ और एक सींग वाले गैंडे की आबादी के प्राकृतिक संचरण को सुनिश्चित करता है।'
                    : language === 'ur'
                    ? 'والمیکی بین الاقوامی ترائی آرک کا اہم حصہ ہے جو پاک و ہند اور نیپال کے درمیان شیروں، تیندوں اور گینڈوں کی نقل و حرکت اور نسل کے تحفظ کو یقینی بناتا ہے۔'
                    : 'VTR is a critical anchor in the international Terai Arc Landscape, allowing genetic flow between India and Nepal’s tiger, leopard, and one-horned rhinoceros metapopulations.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 8 Forest Ranges */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-2">
          <div>
            <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider block">
              {language === 'hi' ? 'प्रशासनिक प्रभाग एवं बीट' : language === 'ur' ? 'انتظامی ڈویژنز اور رینجز' : 'Administrative Subdivisions'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900">
              {language === 'hi'
                ? 'वाल्मीकि के 8 वन प्रभाग (Ranges)'
                : language === 'ur'
                ? 'والمیکی کے 8 فارسٹ رینجز'
                : 'The 8 Forest Ranges of VTR'}
            </h2>
          </div>
          <span className="text-xs font-mono bg-white px-3 py-1 rounded-lg border border-stone-300 font-bold text-stone-700">
            {language === 'hi' ? 'प्रभाग I एवं II' : language === 'ur' ? 'ڈویژن I اور II' : 'Division I & II'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forestRanges.map((range, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between hover:border-amber-500/60 transition-all shadow-xs"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[11px] font-bold text-amber-700">
                    {language === 'hi' ? `रेंज 0${idx + 1}` : language === 'ur' ? `رینج 0${idx + 1}` : `Range 0${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {range.division}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-stone-900">{range.name}</h3>
                <p className="text-xs text-stone-500 font-medium mt-1">{range.terrain}</p>
              </div>
              <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-600 leading-relaxed font-sans">
                {range.focus}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
