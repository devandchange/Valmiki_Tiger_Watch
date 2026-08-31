import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CreatorProfileCard } from '../CreatorProfileCard';
import { 
  Award, 
  Heart, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

export const CreditsSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('credits.title', 'Credits, Attribution & Dedication')}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {language === 'hi' 
            ? 'साभार, प्रमाणिकता एवं समर्पण' 
            : language === 'ur'
            ? 'اعترافِ خدمات، کریڈٹس اور انتساب'
            : 'Credits, Attribution & Dedication'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर रिजर्व के पारिस्थितिक संरक्षण, शोधकर्ताओं, वन्यजीव जीवविज्ञानियों, वन रक्षकों और दूरदर्शी प्रकृति प्रेमियों के प्रति हार्दिक आभार।'
            : language === 'ur'
            ? 'والمیکی ٹائیگر ریزرو کی حفاظت، تحقیق، حیاتیاتی تنوع اور فرنٹ لائن فارسٹ گارڈز کے نام خراج تحسین و اعتراف خدمات۔'
            : 'Acknowledging the visionary creators, researchers, wildlife biologists, and frontline guardians whose ceaseless devotion protects Valmiki Tiger Reserve.'}
        </p>
      </div>

      {/* Creator & Developer Spotlight Card */}
      <CreatorProfileCard variant="full" />

      {/* Institutional & Scientific Acknowledgments */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'डेटा प्रामाणिकता' : language === 'ur' ? 'ڈیٹا کی تصدیق' : 'Data Integrity & Attribution'}</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-stone-900">
            {language === 'hi' ? 'संस्थागत एवं वैज्ञानिक डेटा स्रोत' : language === 'ur' ? 'ادارہ جاتی اور سائنسی ذرائع' : 'Institutional & Scientific Data Sources'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700">
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>National Tiger Conservation Authority (NTCA)</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi' 
                ? 'अखिल भारतीय बाघ आकलन प्रोटोकॉल, M-STrIPES दिशानिर्देश, प्रबंधन प्रभावशीलता मूल्यांकन (MEE) और राष्ट्रीय आबादी अनुमान।'
                : language === 'ur'
                ? 'آل انڈیا ٹائیگر تخمینہ پروٹوکول، M-STrIPES ہدایات، اور قومی آبادی جائزے کا طریقہ کار۔'
                : 'All-India Tiger Estimation protocols, M-STrIPES guidelines, management effectiveness evaluation (MEE) criteria, and national population assessments.'}
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>Wildlife Institute of India (WII)</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'स्थानिक कैमरा-ट्रैप पद्धति, तराई आर्क लैंडस्केप पारिस्थितिक शोध पत्र और शाकाहारी शिकार घनत्व सूचकांक।'
                : language === 'ur'
                ? 'کیمرہ ٹریپنگ تکنیک، ترائی آرک لینڈ اسکیپ ماحولیاتی ریسرچ اور شکار کی کثافت کے اشاریے۔'
                : 'Spatial camera-trap methodologies, Terai Arc Landscape ecological research papers, genetics studies, and herbivore prey density indices.'}
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>Environment, Forest & Climate Change Dept, Bihar</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'आधिकारिक वन रेंज अधिसूचनाएं, पर्यावरण-विकास समिति रिपोर्ट, घास के मैदान प्रबंधन डेटा।'
                : language === 'ur'
                ? 'سرکاری رینج نوٹیفکیشنز، ایکو ڈیولپمنٹ کمیٹی رپورٹس اور گھاس کے میدانوں کا انتظام۔'
                : 'Official range notifications, eco-development committee reports, grassland management data, and wildlife sanctuary boundaries.'}
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>IUCN Red List & WWF-India TAL Program</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'प्रजातियों की संरक्षण स्थिति, सीमा पार कॉरिडोर गतिशीलता और आवास कनेक्टिविटी बेंचमार्क।'
                : language === 'ur'
                ? 'اقسام کے تحفظ کی صورتحال، سرحد پار کوریڈور کی نقل و حرکت اور قدرتی مسکن رابطہ۔'
                : 'Species conservation statuses, transboundary corridor dynamics, and habitat connectivity benchmarks.'}
            </p>
          </div>
        </div>
      </div>

      {/* Dedication to Frontline Watchers & Tribal Guardians */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 text-center space-y-4 max-w-3xl mx-auto">
        <Heart className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="font-display font-bold text-2xl text-stone-900">
          {language === 'hi' ? 'वाल्मीकि के अग्रिम पंक्ति के वन संरक्षकों को समर्पित' : language === 'ur' ? 'والمیکی کے جانباز محافظوں کے نام انتساب' : 'Dedicated to the Frontline Guardians of Valmiki'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {language === 'hi'
            ? 'यह प्लेटफॉर्म उन बहादुर वन रक्षकों, दैनिक वेतनभोगी गश्ती दलों, पशु चिकित्सा टीमों और स्थानीय थारू एवं उरांव आदिवासी समुदायों को समर्पित है, जो गंडक के पावन तटों पर रॉयल बंगाल टाइगर की गर्जना को बनाए रखने के लिए प्रतिदिन घने जंगलों में गश्त करते हैं।'
            : language === 'ur'
            ? 'یہ پلیٹ فارم والمیکی کے ان جانباز فارسٹ گارڈز، رینج آفیسرز، ڈاکٹرز اور مقامی تھارو و اراؤں قبائل کے نام منسوب ہے جو گنڈک کے کناروں پر رائل بنگال ٹائیگر کی حفاظت کے لیے روزانہ جنگل کی خاک چھانتے ہیں۔'
            : 'This platform is respectfully dedicated to the brave daily-wager forest watchers, range officers, veterinary teams, and indigenous Tharu & Uraon communities who walk the dense, mist-clad trails of Valmiki every single day to ensure the Royal Bengal Tiger continues to roar along the sacred banks of the Gandak.'}
        </p>
      </div>
    </div>
  );
};


