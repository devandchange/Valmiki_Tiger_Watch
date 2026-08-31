import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Code2, TreePine, BookOpen, Compass } from 'lucide-react';

interface CreatorProfileCardProps {
  variant?: 'full' | 'compact';
}

export const CreatorProfileCard: React.FC<CreatorProfileCardProps> = ({ variant = 'full' }) => {
  const { t, language, isRtl } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('/assets/nazish-asad.svg');

  const handleImageError = () => {
    // Fallback chain that ensures an image always renders without broken icons
    if (imgSrc === '/assets/nazish-asad.svg') {
      setImgSrc('/nazish-asad.svg');
    } else if (imgSrc === '/nazish-asad.svg') {
      setImgSrc('/nazish-asad.png');
    } else if (imgSrc === '/nazish-asad.png') {
      setImgSrc('/file_000000008f1081fd8a3100f946e1218e.png');
    }
  };

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

      <div className={`relative z-10 grid grid-cols-1 ${variant === 'full' ? 'lg:grid-cols-12' : 'md:grid-cols-12'} gap-8 items-center`}>
        {/* Photo Container */}
        <div className={`${variant === 'full' ? 'lg:col-span-4' : 'md:col-span-4'} flex flex-col items-center justify-center`}>
          <div className="relative group">
            {/* Outer Subtle Aura Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#F27D26] via-amber-400 to-emerald-400 rounded-3xl opacity-75 blur-xs group-hover:opacity-100 transition duration-500" />

            {/* Photo Frame */}
            <div className="relative w-48 h-64 sm:w-56 sm:h-72 md:w-60 md:h-80 bg-[#051B14] rounded-2xl sm:rounded-[1.75rem] overflow-hidden border-2 border-amber-400/60 shadow-2xl flex items-center justify-center">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-[#07271D] animate-pulse flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-400/40 border-t-amber-400 animate-spin" />
                </div>
              )}

              <img
                src={imgSrc}
                alt={t('credits.portrait_alt', 'Nazish Asad — Creator & Developer of Valmiki Tiger Watch')}
                referrerPolicy="no-referrer"
                loading="eager"
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Subtle Bottom Vignette */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#07271D]/80 to-transparent pointer-events-none" />
            </div>

            {/* Creator Badge Pill */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-[#07271D] border border-amber-400/70 px-4 py-1 rounded-full text-xs font-mono text-amber-300 shadow-xl flex items-center space-x-1.5 whitespace-nowrap z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {language === 'hi'
                  ? 'निर्माता एवं डेवलपर'
                  : language === 'ur'
                  ? 'تخلیق کار اور ڈویلپر'
                  : 'Creator & Developer'}
              </span>
            </div>
          </div>
        </div>

        {/* Info / Typography Details */}
        <div className={`${variant === 'full' ? 'lg:col-span-8' : 'md:col-span-8'} space-y-5 ${isRtl ? 'text-right' : 'text-left'} text-center md:text-left`}>
          {/* Top Identifier Chip */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D]/90 border border-amber-400/50 rounded-full px-4 py-1 text-xs text-amber-300 font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-medium">
              {language === 'hi'
                ? 'नाज़िश असद — निर्माता एवं डेवलपर'
                : language === 'ur'
                ? 'نازش اسد — تخلیق کار اور ڈویلپر'
                : 'Nazish Asad — Creator & Developer'}
            </span>
          </div>

          {/* Primary Profile Hierarchy */}
          <div className="space-y-1">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-400 tracking-tight">
              {language === 'hi'
                ? 'नाज़िश असद'
                : language === 'ur'
                ? 'نازش اسد'
                : 'Nazish Asad'}
            </h2>
            <div className="text-sm sm:text-base font-semibold text-emerald-200 font-mono">
              {language === 'hi'
                ? 'निर्माता एवं डेवलपर'
                : language === 'ur'
                ? 'تخلیق کار اور ڈویلپر'
                : 'Creator & Developer'}
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#F27D26] font-bold uppercase tracking-wider">
              {language === 'hi'
                ? 'वाल्मीकि टाइगर वॉच'
                : language === 'ur'
                ? 'والمیکی ٹائیگر واچ'
                : 'Valmiki Tiger Watch'}
            </div>
          </div>

          {/* "Created and Maintained by" Dedicated Highlight Box */}
          <div className="bg-black/30 border border-amber-400/35 rounded-2xl p-4 sm:p-5 text-emerald-100 shadow-inner">
            <div className={`flex items-center ${isRtl ? 'justify-end' : 'justify-start'} space-x-2 rtl:space-x-reverse text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider font-mono mb-2`}>
              <Code2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                {language === 'hi'
                  ? 'नाज़िश असद द्वारा निर्मित एवं अनुरक्षित'
                  : language === 'ur'
                  ? 'نازش اسد کے ذریعہ تخلیق اور برقرار رکھا گیا'
                  : 'Created and Maintained by Nazish Asad'}
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-stone-100 font-sans">
              {language === 'hi'
                ? '"वाल्मीकि टाइगर वॉच का निर्माण वाल्मीकि टाइगर रिजर्व, वन्यजीव संरक्षण, जैव विविधता, अनुसंधान, शिक्षा और उत्तरदायी सह-अस्तित्व को समर्पित एक संरक्षण और जागरूकता मंच के रूप में किया गया है।"'
                : language === 'ur'
                ? '"والمیکی ٹائیگر واچ کا مقصد والمیکی ٹائیگر ریزرو، جنگلی حیات کے تحفظ، حیاتیاتی تنوع، تحقیق، تعلیم اور ذمہ دارانہ بقائے باہمی کے لیے بیداری پیدا کرنا ہے۔"'
                : '"Valmiki Tiger Watch is created as a conservation and awareness platform dedicated to Valmiki Tiger Reserve, wildlife protection, biodiversity, research, education and responsible coexistence."'}
            </p>
          </div>

          {/* Core Vision Pillars (shown in full view) */}
          {variant === 'full' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className={`text-amber-400 font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse mb-1 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                  <TreePine className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'hi' ? 'वन्यजीव संरक्षण' : language === 'ur' ? 'حیاتیاتی تنوع' : 'Biodiversity'}</span>
                </div>
                <p className={`text-[11px] text-[#F5F1E6]/75 leading-snug ${isRtl ? 'text-right' : 'text-left'}`}>
                  {language === 'hi' ? 'बाघ और तराई जीवों की निगरानी' : language === 'ur' ? 'شیروں اور نایاب جنگلی حیات کی ٹریکنگ' : 'Individual stripe & territory tracking'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className={`text-amber-400 font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse mb-1 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{language === 'hi' ? 'सुलभ अनुसंधान' : language === 'ur' ? 'سائنسی تحقیق' : 'Open Science'}</span>
                </div>
                <p className={`text-[11px] text-[#F5F1E6]/75 leading-snug ${isRtl ? 'text-right' : 'text-left'}`}>
                  {language === 'hi' ? 'वैज्ञानिक शोध पत्र व डेटा संकलन' : language === 'ur' ? 'سائنسی مقالہ جات اور ڈیٹا ریسرچ' : 'Peer-reviewed journals & NTCA reports'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className={`text-amber-400 font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse mb-1 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                  <Compass className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>{language === 'hi' ? 'सह-अस्तित्व' : language === 'ur' ? 'بقائے باہمی' : 'Coexistence'}</span>
                </div>
                <p className={`text-[11px] text-[#F5F1E6]/75 leading-snug ${isRtl ? 'text-right' : 'text-left'}`}>
                  {language === 'hi' ? 'थारू समुदाय एवं वन रक्षक सहयोग' : language === 'ur' ? 'مقامی تھارو قبائل اور فارسٹ گارڈز' : 'Tribal trackers & buffer zone safety'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
