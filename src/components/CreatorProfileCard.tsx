import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Leaf, Compass } from 'lucide-react';

interface CreatorProfileCardProps {
  variant?: 'full' | 'compact';
}

export const CreatorProfileCard: React.FC<CreatorProfileCardProps> = ({ variant = 'full' }) => {
  const { language, isRtl, t } = useLanguage();

  // Exact paragraphs provided by user
  const bioParagraphs = {
    en: [
      "Nazish Asad is an environmental activist and wildlife conservation advocate dedicated to raising awareness about tiger protection, biodiversity, habitat conservation, and the importance of preserving India's natural heritage.",
      "Through Valmiki Tiger Watch, he aims to promote independent conservation awareness, responsible eco-tourism, wildlife education, and public participation in protecting tigers and their habitats.",
      "His work focuses on connecting people with nature, encouraging conservation responsibility, and supporting greater awareness of the challenges facing wildlife and forest ecosystems."
    ],
    hi: [
      "नाज़िश असद एक पर्यावरण कार्यकर्ता और वन्यजीव संरक्षण समर्थक हैं, जो बाघ संरक्षण, जैव विविधता, पर्यावास संरक्षण और भारत की प्राकृतिक विरासत के संरक्षण के प्रति जागरूकता बढ़ाने के लिए समर्पित हैं।",
      "वाल्मीकि टाइगर वॉच के माध्यम से, उनका उद्देश्य स्वतंत्र संरक्षण जागरूकता, जिम्मेदार पर्यावरण-पर्यटन, वन्यजीव शिक्षा, और बाघों तथा उनके पर्यावासों की रक्षा में जनभागीदारी को बढ़ावा देना है।",
      "उनका कार्य लोगों को प्रकृति से जोड़ने, संरक्षण की जिम्मेदारी को प्रोत्साहित करने और वन्यजीवों तथा वन पारिस्थितिक तंत्र के समक्ष आने वाली चुनौतियों के प्रति व्यापक जागरूकता का समर्थन करने पर केंद्रित है।"
    ],
    ur: [
      "نازش اسد ایک ماحولیاتی کارکن اور جنگلی حیات کے تحفظ کے حامی ہیں جو شیروں کے تحفظ، حیاتیاتی تنوع، مسکن کے تحفظ اور بھارت کے قدرتی ورثے کو محفوظ رکھنے کے بارے میں شعور بیدار کرنے کے لیے وقف ہیں۔",
      "والمیکی ٹائیگر واچ کے ذریعے، ان کا مقصد آزادانہ تحفظ کے شعور، ذمہ دارانہ ایکو ٹورازم، جنگلی حیات کی تعلیم، اور شیروں اور ان کے مسکن کے تحفظ میں عوامی شرکت کو فروغ دینا ہے۔",
      "ان کا کام لوگوں کو فطرت سے جوڑنے، تحفظ کی ذمہ داری کی حوصلہ افزائی کرنے، اور جنگلی حیات اور جنگلاتی ماحولیاتی نظام کو درپیش چیلنجوں کے بارے میں زیادہ سے زیادہ آگاہی کی حمایت کرنے پر مرکوز ہے۔"
    ]
  };

  const currentBio = bioParagraphs[language] || bioParagraphs.en;

  const creatorName = language === 'hi' ? 'नाज़िश असद' : language === 'ur' ? 'نازش اسد' : 'Nazish Asad';
  const creatorTitle = language === 'hi' 
    ? 'पर्यावरण एवं वन्यजीव संरक्षण कार्यकर्ता' 
    : language === 'ur' 
    ? 'ماحولیاتی اور جنگلی حیات کے تحفظ کے کارکن' 
    : 'Environmental & Wildlife Conservation Activist';

  const aboutHeading = language === 'hi' 
    ? 'रचनाकार के बारे में' 
    : language === 'ur' 
    ? 'تخلیق کار کے بارے میں' 
    : 'About the Creator';

  return (
    <div
      id="nazish-asad-profile-card"
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07271D] via-[#0B3D2E] to-[#124B38] text-white border-2 border-amber-500/40 shadow-2xl transition-all duration-300 ${
        variant === 'full' ? 'p-6 sm:p-10 md:p-12' : 'p-6 sm:p-8'
      }`}
    >
      {/* Background Ambient Tones */}
      <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -top-16 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* Top Badges */}
        <div className={`flex flex-wrap items-center ${isRtl ? 'justify-end' : 'justify-start'} gap-3`}>
          {/* Creator Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D]/90 border border-amber-400/60 rounded-full px-4 py-1.5 text-xs text-amber-300 font-mono shadow-md">
            <Leaf className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">{creatorName} — {creatorTitle}</span>
          </div>

          {/* Platform Initiative Badge */}
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-emerald-950/80 border border-emerald-500/40 rounded-full px-3.5 py-1.5 text-xs text-emerald-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{t('app.independent', 'Independent Conservation Initiative')}</span>
          </div>
        </div>

        {/* Primary Profile Identity & Photograph */}
        <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 ${isRtl ? 'sm:flex-row-reverse text-right' : 'text-left'}`}>
          {/* Photograph Display */}
          <div className="relative group flex-shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-amber-400/90 shadow-2xl bg-[#07271D] flex items-center justify-center relative">
              <img
                src="/Nazish_Asad.png"
                alt={`${creatorName} — ${creatorTitle}`}
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  const currentSrc = target.src;
                  if (!currentSrc.includes('/assets/Nazish_Asad.png')) {
                    target.src = '/assets/Nazish_Asad.png';
                  } else {
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }
                }}
              />
              {/* Fallback Display if image is not yet rendered */}
              <div 
                style={{ display: 'none' }}
                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#07271D] text-amber-300 font-mono text-center p-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl font-bold text-amber-300 mb-1.5 shadow-inner">
                  NA
                </div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-200">{creatorName}</span>
                <span className="text-[10px] text-amber-300/80 mt-1 line-clamp-2">{creatorTitle}</span>
              </div>
            </div>

            {/* Profile Tag */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-2 bg-gradient-to-r from-amber-500 to-[#F27D26] text-stone-950 text-[11px] font-mono font-bold px-3 py-0.5 rounded-full shadow-lg border border-amber-300 whitespace-nowrap">
              Creator
            </div>
          </div>

          {/* Text Details */}
          <div className="space-y-2 flex-1 text-center sm:text-left rtl:sm:text-right">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-400 tracking-tight">
              {creatorName}
            </h2>
            
            <div className="text-base sm:text-lg md:text-xl font-semibold text-emerald-200 font-mono flex items-center space-x-2 rtl:space-x-reverse justify-center sm:justify-start rtl:sm:justify-start">
              <Compass className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{creatorTitle}</span>
            </div>

            <div className="text-xs sm:text-sm font-mono text-[#F27D26] font-bold uppercase tracking-wider">
              {language === 'hi'
                ? 'वाल्मीकि टाइगर वॉच'
                : language === 'ur'
                ? 'والمیکی ٹائیگر واچ'
                : 'Valmiki Tiger Watch'}
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed pt-1 max-w-2xl">
              {language === 'hi'
                ? 'स्वतंत्र संरक्षण जागरूकता, जिम्मेदार पर्यावरण-पर्यटन और वन्यजीव शिक्षा पहल।'
                : language === 'ur'
                ? 'خود مختار تحفظی شعور، ذمہ دارانہ ایکو ٹورازم اور جنگلی حیات کی تعلیمی مہم۔'
                : 'Independent conservation awareness, responsible eco-tourism, and wildlife education initiative.'}
            </p>
          </div>
        </div>

        {/* Dedicated "ABOUT THE CREATOR" Narrative Container */}
        <div className="bg-black/35 border border-amber-400/35 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-emerald-50 shadow-inner space-y-4">
          <div className={`flex items-center ${isRtl ? 'justify-end' : 'justify-start'} space-x-2 rtl:space-x-reverse text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider font-mono border-b border-amber-500/20 pb-3`}>
            <Leaf className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{aboutHeading}</span>
          </div>

          <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-stone-100/95 font-sans">
            {currentBio.map((paragraph, index) => (
              <p key={index} className={`leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
