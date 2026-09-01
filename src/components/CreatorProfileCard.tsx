import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Code2, TreePine, BookOpen, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

interface CreatorProfileCardProps {
  variant?: 'full' | 'compact';
}

export const CreatorProfileCard: React.FC<CreatorProfileCardProps> = ({ variant = 'full' }) => {
  const { language, isRtl } = useLanguage();

  return (
    <div
      id="nazish-asad-profile-card"
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07271D] via-[#0B3D2E] to-[#124B38] text-white border-2 border-amber-500/40 shadow-2xl transition-all duration-300 ${
        variant === 'full' ? 'p-6 sm:p-10 md:p-12' : 'p-6 sm:p-8'
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -top-16 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header & Badges */}
        <div className={`flex flex-wrap items-center ${isRtl ? 'justify-end' : 'justify-start'} gap-3`}>
          {/* Main Creator Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D]/90 border border-amber-400/60 rounded-full px-4 py-1.5 text-xs text-amber-300 font-mono shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">
              {language === 'hi'
                ? 'नाज़िश असद — निर्माता एवं डेवलपर'
                : language === 'ur'
                ? 'نازش اسد — تخلیق کار اور ڈویلپر'
                : 'Nazish Asad — Creator & Developer'}
            </span>
          </div>

          {/* Platform Badge */}
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-emerald-950/80 border border-emerald-500/40 rounded-full px-3.5 py-1.5 text-xs text-emerald-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'स्वतंत्र संरक्षण मंच'
                : language === 'ur'
                ? 'خود مختار تحفظی پلیٹ فارم'
                : 'Independent Conservation Platform'}
            </span>
          </div>
        </div>

        {/* Primary Profile Identity & Photo */}
        <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 ${isRtl ? 'sm:flex-row-reverse text-right' : 'text-left'}`}>
          {/* Creator Photo Container */}
          <div className="relative group flex-shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl bg-[#07271D] flex items-center justify-center relative">
              <img
                src="/assets/nazish-asad.jpg"
                alt="Nazish Asad — Creator & Developer of Valmiki Tiger Watch"
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/nazish-asad.jpg';
                  target.onerror = () => {
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  };
                }}
              />
              <div 
                style={{ display: 'none' }}
                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#07271D] text-amber-300 font-mono text-center p-2"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl font-bold text-amber-300 mb-1">
                  NA
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-200">Nazish Asad</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-stone-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-md border border-amber-300">
              Creator
            </div>
          </div>

          {/* Text Details */}
          <div className="space-y-1.5 flex-1">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-400 tracking-tight">
              {language === 'hi'
                ? 'नाज़िश असद'
                : language === 'ur'
                ? 'نازش اسد'
                : 'Nazish Asad'}
            </h2>
            <div className="text-base sm:text-lg font-semibold text-emerald-200 font-mono flex items-center space-x-2 rtl:space-x-reverse justify-center sm:justify-start">
              <Code2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>
                {language === 'hi'
                  ? 'निर्माता एवं प्रमुख डेवलपर'
                  : language === 'ur'
                  ? 'تخلیق کار اور اہم ڈویلپر'
                  : 'Creator & Lead Developer'}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#F27D26] font-bold uppercase tracking-wider">
              {language === 'hi'
                ? 'वाल्मीकि टाइगर वॉच'
                : language === 'ur'
                ? 'والمیکی ٹائیگر واچ'
                : 'Valmiki Tiger Watch'}
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed pt-1">
              {language === 'hi'
                ? 'वाल्मीकि टाइगर रिजर्व, वन्यजीव संरक्षण, जैव विविधता एवं सतत पर्यावरण जागरूकता के लिए समर्पित स्वतंत्र डिजिटल प्लेटफॉर्म।'
                : language === 'ur'
                ? 'والمیکی ٹائیگر ریزرو اور جنگلی حیات کے تحفظ کے لیے وقف خود مختار پلیٹ فارم۔'
                : 'Dedicated to wildlife conservation, digital biodiversity records, and responsible environmental stewardship.'}
            </p>
          </div>
        </div>

        {/* "Created and Maintained by" Dedicated Highlight Box */}
        <div className="bg-black/35 border border-amber-400/35 rounded-2xl p-5 sm:p-6 text-emerald-100 shadow-inner">
          <div className={`flex items-center ${isRtl ? 'justify-end' : 'justify-start'} space-x-2 rtl:space-x-reverse text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider font-mono mb-2.5`}>
            <HeartHandshake className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'नाज़िश असद द्वारा निर्मित एवं अनुरक्षित'
                : language === 'ur'
                ? 'نازش اسد کے ذریعہ تخلیق اور برقرار رکھا گیا'
                : 'Created and Maintained by Nazish Asad'}
            </span>
          </div>
          <p className={`text-xs sm:text-sm md:text-base leading-relaxed text-stone-100 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
            {language === 'hi'
              ? '"वाल्मीकि टाइगर वॉच का निर्माण वाल्मीकि टाइगर रिजर्व, वन्यजीव संरक्षण, जैव विविधता, अनुसंधान, शिक्षा और उत्तरदायी सह-अस्तित्व को समर्पित एक संरक्षण और जागरूकता मंच के रूप में किया गया है।"'
              : language === 'ur'
              ? '"والمیکی ٹائیگر واچ کا مقصد والمیکی ٹائیگر ریزرو، جنگلی حیات کے تحفظ، حیاتیاتی تنوع، تحقیق، تعلیم اور ذمہ دارانہ بقائے باہمی کے لیے بیداری پیدا کرنا ہے۔"'
              : '"Valmiki Tiger Watch is created as a conservation and awareness platform dedicated to Valmiki Tiger Reserve, wildlife protection, biodiversity, research, education and responsible coexistence."'}
          </p>
        </div>

        {/* Core Vision Pillars (shown in full view) */}
        {variant === 'full' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-amber-400/40 transition-colors">
              <div className={`text-amber-400 font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse mb-1.5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                <TreePine className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{language === 'hi' ? 'वन्यजीव संरक्षण' : language === 'ur' ? 'حیاتیاتی تنوع' : 'Biodiversity'}</span>
              </div>
              <p className={`text-xs text-[#F5F1E6]/75 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {language === 'hi' ? 'बाघ और तराई जीवों की निरंतर डिजिटल ट्रैकिंग व संरक्षण' : language === 'ur' ? 'شیروں اور نایاب جنگلی حیات کی ڈیجیٹل ٹریکنگ' : 'Individual stripe & territory digital monitoring'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-amber-400/40 transition-colors">
              <div className={`text-amber-400 font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse mb-1.5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{language === 'hi' ? 'सुलभ अनुसंधान' : language === 'ur' ? 'سائنسی تحقیق' : 'Open Science'}</span>
              </div>
              <p className={`text-xs text-[#F5F1E6]/75 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {language === 'hi' ? 'वैज्ञानिक शोध पत्र व पारदर्शी डेटा संकलन' : language === 'ur' ? 'سائنسی مقالہ جات اور شفاف ڈیٹا ریسرچ' : 'Peer-reviewed journals & NTCA telemetry records'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-amber-400/40 transition-colors">
              <div className={`text-amber-400 font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse mb-1.5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                <Compass className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{language === 'hi' ? 'सह-अस्तित्व' : language === 'ur' ? 'بقائے باہمی' : 'Coexistence'}</span>
              </div>
              <p className={`text-xs text-[#F5F1E6]/75 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {language === 'hi' ? 'थारू समुदाय एवं वन रक्षक समन्वय' : language === 'ur' ? 'مقامی تھارو قبائل اور فارسٹ گارڈز کے ساتھ تال میل' : 'Tribal trackers & buffer zone community safety'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
