import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { VTRHistoryTimeline } from '../VTRHistoryTimeline';
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
  const { t, language, isRtl } = useLanguage();

  const censusData = [
    { 
      year: '2006', 
      count: 8, 
      note: language === 'hi' 
        ? 'संकट का दौर; अत्यधिक दबाव और शिकार की कमी' 
        : language === 'ur' 
        ? 'بحران کا دور؛ شدید دباؤ اور خوراک کی کمی' 
        : 'Baseline crisis phase; heavy biotic pressure and low prey density' 
    },
    { 
      year: '2010', 
      count: 10, 
      note: language === 'hi' 
        ? 'शिकार-रोधी बुनियादी ढांचे एवं प्रबंधन सुधार की शुरुआत' 
        : language === 'ur' 
        ? 'اینٹی پوچنگ انفراسٹرکچر اور اصلاحات کا آغاز' 
        : 'Initiation of dedicated anti-poaching infrastructure' 
    },
    { 
      year: '2014', 
      count: 22, 
      note: language === 'hi' 
        ? 'एम-स्ट्राइप्स इलेक्ट्रॉनिक गश्त एवं घास के मैदानों का पुनर्जनन' 
        : language === 'ur' 
        ? 'ایم سٹرائپس ڈیجیٹل پٹرولنگ اور چراگاہوں کی بحالی' 
        : 'M-STrIPES electronic patrol introduction & grassland management' 
    },
    { 
      year: '2018', 
      count: 31, 
      note: language === 'hi' 
        ? 'एनटीसीए राष्ट्रीय मूल्यांकन द्वारा त्वरित सुधार की पुष्टि' 
        : language === 'ur' 
        ? 'این ٹی سی اے کی قومی رپورٹ میں تیز رفتار بحالی کی تصدیق' 
        : 'NTCA National Assessment confirms rapid recovery trajectory' 
    },
    { 
      year: '2022/26', 
      count: 54, 
      note: language === 'hi' 
        ? 'राज्य एवं डब्लूआईआई जनगणना में 54+ स्थायी बाघ दर्ज' 
        : language === 'ur' 
        ? 'قومی مردم شماری میں 54 سے زائد مستقل شیروں کی تصدیق' 
        : 'State & WII Synchronized Census records 54+ resident individuals' 
    },
  ];

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className="space-y-12 animate-fade-in pb-10"
    >
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {language === 'hi' ? 'भारत का 18वाँ टाइगर रिजर्व' : language === 'ur' ? 'بھارت کا 18واں ٹائیگر ریزرو' : "India's 18th Tiger Reserve Legacy"}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          {language === 'hi'
            ? 'वाल्मीकि में प्रोजेक्ट टाइगर: ऐतिहासिक पुनरुद्धार'
            : language === 'ur'
            ? 'والمیکی میں پروجیکٹ ٹائیگر: عظیم تاریخی بحالی'
            : 'Project Tiger at Valmiki: The Great Revival'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? '2000 के दशक की शुरुआत में विलुप्ति के कगार से लेकर आज भारत के सबसे तेजी से बढ़ते बाघ अभयारण्यों में से एक बनने तक, वाल्मीकि वैज्ञानिक प्रबंधन और वन रक्षकों के अदम्य साहस का प्रतीक है।'
            : language === 'ur'
            ? '2000 کی دہائی کے اوائل میں ممکنہ معدومی سے لے کر آج بھارت کے تیز ترین ترقی پذیر ٹائیگر پارکس میں شامل ہونے تک، والمیکی سائنسی انتظام اور گارڈز کی بہادری کی زندہ مثال ہے۔'
            : 'From the brink of localized extirpation in the early 2000s to one of India’s fastest-growing tiger sanctuaries, Valmiki Tiger Reserve stands as a beacon of scientific habitat management and frontline ranger dedication.'}
        </p>
      </div>

      {/* Population Growth Trajectory Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-2">
          <div>
            <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider block">
              {language === 'hi' ? 'एनटीसीए एवं राज्य वन विभाग आधिकारिक आंकड़े' : language === 'ur' ? 'این ٹی سی اے اور محکمہ جنگلات کے سرکاری اعداد و شمار' : 'NTCA & State Forest Dept Official Census Data'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              {language === 'hi'
                ? 'वीटीआर बाघ जनसंख्या वृद्धि प्रक्षेपवक्र (2006 – 2026)'
                : language === 'ur'
                ? 'شیروں کی آبادی میں تاریخی اضافہ (2006 – 2026)'
                : 'VTR Tiger Population Trajectory (2006 – 2026)'}
            </h2>
          </div>
          <div className="text-right rtl:text-left">
            <span className="text-xs font-mono text-stone-500 block">
              {language === 'hi' ? 'वृद्धि दर' : language === 'ur' ? 'اضافے کی شرح' : 'Growth Rate'}
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-emerald-700">+575% {language === 'hi' ? 'उछाल' : language === 'ur' ? 'اضافہ' : 'Increase'}</span>
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
                  <span className="font-bold text-amber-600 text-sm">
                    {item.count} {language === 'hi' ? 'बाघ' : language === 'ur' ? 'شیر' : 'Tigers'}
                  </span>
                </div>
                <div className="w-full h-8 bg-stone-100 rounded-xl overflow-hidden p-1 flex items-center">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500 rounded-lg flex items-center justify-end pr-2.5 rtl:pr-0 rtl:pl-2.5 text-white font-mono text-xs font-bold transition-all duration-1000 shadow-sm"
                  >
                    {item.count}
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 italic pl-1 rtl:pl-0 rtl:pr-1">
                  {item.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Pillars of Success */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Trees className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            {language === 'hi' ? 'घास के मैदानों का कायाकल्प' : language === 'ur' ? 'چراگاہوں کی جدید بحالی' : 'Grassland Rejuvenation'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'हानिकारक खरपतवारों को हटाकर देशी पौष्टिक घासों का रोपण किया गया, जिससे चीतल, सांभर और गौर जैसे शिकार जीवों की संख्या में तेजी से वृद्धि हुई।'
              : language === 'ur'
              ? 'خود رو جڑی بوٹیوں کے خاتمے اور معیاری گھاس لگانے سے ہرن اور دیگر شکار کی آبادی میں زبردست اضافہ ہوا۔'
              : 'Elimination of invasive weeds and systematic planting of palatable Terai grasses expanded ungulate prey (chital, sambar, and gaur) populations.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            {language === 'hi' ? 'बारहमासी सौर जलस्रोत' : language === 'ur' ? 'بارہ ماسی سولر واٹر ہولز' : 'Perennial Waterholes'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? '60 से अधिक सौर ऊर्जा संचालित सबमर्सिबल पंपों और चेक-डैमों ने शुष्क मौसम में भी वन के भीतर जल उपलब्धता सुनिश्चित की।'
              : language === 'ur'
              ? '60 سے زائد سولر پمپس اور چھوٹے ڈیموں کے ذریعے گرمیوں میں بھی جانوروں کے لیے پینے کا پانی یقینی بنایا گیا۔'
              : 'Over 60 solar-powered submersible pumps and earthen check-dams ensure year-round water in dry forest interiors, curbing herbivore straying.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            {language === 'hi' ? 'एम-स्ट्राइप्स डिजिटल गश्त' : language === 'ur' ? 'ایم سٹرائپس سمارٹ گشت' : 'M-STrIPES Patrolling'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'वन कर्मी मोबाइल ऐप पर जीपीएस-टैग्ड गश्त दर्ज करते हैं, जिससे सुदूर सीमावर्ती कटक और खड्डों की सघन निगरानी संभव हुई।'
              : language === 'ur'
              ? 'فارسٹ گارڈز موبائل ایپ پر جی پی ایس گشت لاگ کرتے ہیں، جس سے سرحد پار غیر قانونی سرگرمیوں پر مکمل قابو پایا گیا۔'
              : 'Frontline forest staff log geo-tagged spatial patrols on mobile devices, ensuring systematic coverage of remote border ridges and ravines.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            {language === 'hi' ? 'समुदायिक सह-अस्तित्व' : language === 'ur' ? 'مقامی قبائلی شراکت' : 'Community Coexistence'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'वन सुरक्षा समितियों और सौर बाड़ लगाने से मानव-वन्यजीव संघर्ष न्यूनतम हुआ और स्थानीय थारू युवाओं को बाघ रक्षक बनाया गया।'
              : language === 'ur'
              ? 'سولر باڑ لگانے اور تھارو نوجوانوں کو بطور محافظ شامل کرنے سے انسان اور شیروں کا ٹکراؤ ختم ہو گیا۔'
              : 'Van Suraksha Samitis and solar power fencing around fringe villages lowered human-wildlife encounters and converted local youth into tiger protectors.'}
          </p>
        </div>
      </div>

      {/* Interactive History Timeline Section */}
      <VTRHistoryTimeline />
    </div>
  );
};
