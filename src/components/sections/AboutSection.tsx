import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { CreatorProfileCard } from '../CreatorProfileCard';
import { 
  ShieldCheck, 
  Heart, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Wifi,
  Globe,
  ArrowRight
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { setActiveTab } = useData();
  const { t, language } = useLanguage();

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('app.independent', 'Independent Conservation Initiative')}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {t('about.title', 'About Valmiki Tiger Watch')}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर वॉच एक स्वतंत्र संरक्षण, शिक्षा, वैज्ञानिक अनुसंधान और वन्यजीव वकालत मंच है जो वाल्मीकि टाइगर रिजर्व (वीटीआर), बिहार, भारत के संरक्षण हेतु समर्पित है।'
            : language === 'ur'
            ? 'والمیکی ٹائیگر واچ ایک خود مختار ماحولیاتی، تعلیمی اور تحقیقی پلیٹ فارم ہے جو والمیکی ٹائیگر ریزرو (بہار، بھارت) کے تحفظ کے لیے وقف کیا گیا ہے۔'
            : 'Valmiki Tiger Watch is an independent conservation, education, scientific research, and wildlife advocacy platform dedicated to preserving Valmiki Tiger Reserve (VTR), Bihar, India.'}
        </p>

        {/* Non-Government Status Banner */}
        <div className="bg-[#07271D] border border-amber-500/40 rounded-2xl p-5 text-xs text-amber-200/90 space-y-2">
          <span className="font-bold text-amber-300 uppercase tracking-wide block text-sm">
            {language === 'hi' ? 'स्पष्ट गैर-सरकारी घोषणा' : language === 'ur' ? 'غیر سرکاری اعلان' : 'Strict Non-Government Declaration'}
          </span>
          <p className="leading-relaxed">
            {language === 'hi'
              ? 'यह एप्लिकेशन एक स्वतंत्र जनहित डिजिटल प्लेटफॉर्म है। यह बिहार वन विभाग, राष्ट्रीय बाघ संरक्षण प्राधिकरण (एनटीसीए), पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय (MoEFCC) या बिहार सरकार का आधिकारिक प्रतिनिधित्व नहीं करता है।'
              : language === 'ur'
              ? 'یہ ایپلیکیشن عوامی مفاد میں بنایا گیا ایک آزاد ڈیجیٹل پلیٹ فارم ہے۔ یہ بہار فارسٹ ڈیپارٹمنٹ، نیشنل ٹائیگر کنزرویشن اتھارٹی (NTCA)، یا حکومت بہار کی سرکاری نمائندگی کا دعویٰ نہیں کرتا۔ تمام ڈیٹا عوامی سائنسی ذرائع سے اخذ کیا گیا ہے۔'
              : 'This application is an independent public interest digital platform. It does not claim official representation of the Bihar Forest Department, National Tiger Conservation Authority (NTCA), Ministry of Environment, Forest and Climate Change (MoEFCC), or Government of Bihar. All data presented is cited from publicly available research papers, verified news outlets, and scientific surveys.'}
          </p>
        </div>
      </div>

      {/* Creator Spotlight Box inside About */}
      <div className="space-y-4">
        <CreatorProfileCard variant="compact" />
        <div className="flex justify-end">
          <button
            onClick={() => setActiveTab('credits')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-[#F27D26] text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md"
          >
            <span>{language === 'hi' ? 'पूर्ण साभार एवं प्रमाणिकता देखें' : language === 'ur' ? 'مکمل کریڈٹس و انتساب دیکھیں' : 'View Full Credits & Attribution'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Core Mission Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-stone-900">
            {language === 'hi' ? 'निगरानी एवं ट्रैकिंग' : language === 'ur' ? 'مشاہدہ اور ٹریکنگ' : 'Watch & Monitor'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'तराई-आर्क लैंडस्केप में बाघों की आबादी, धारी पैटर्न, कैमरा-ट्रैप रिकॉर्ड और गलियारों की निगरानी।'
              : language === 'ur'
              ? 'ترائی آرک لینڈ اسکیپ میں شیروں کی آبادی، کیمرہ ٹریپ ریکارڈز اور ماحولیاتی کوریڈورز کی مانیٹرنگ۔'
              : 'Tracking population dynamics, individual markings, camera-trap records, and transboundary corridors across the Terai-Arc Landscape.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-stone-900">
            {language === 'hi' ? 'सुरक्षा एवं वकालत' : language === 'ur' ? 'تحفظ اور پاسبانی' : 'Protect & Advocate'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'अग्रिम पंक्ति के वन रक्षकों, शिकार-रोधी चुनौतियों, मौसमी बाढ़ और मानव-वन्यजीव सह-अस्तित्व पर ध्यान केंद्रित करना।'
              : language === 'ur'
              ? 'فرنٹ لائن گارڈز، انسدادِ شکار مہم، موسمی سیلاب کے اثرات اور انسان و جنگلی حیات کے بقائے باہمی پر توجہ۔'
              : 'Highlighting frontline rangers, anti-poaching challenges, seasonal flood impacts, and human-wildlife coexistence models.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-stone-900">
            {language === 'hi' ? 'संरक्षण एवं शिक्षा' : language === 'ur' ? 'تعلیم اور آگاہی' : 'Conserve & Educate'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'hi'
              ? 'छात्रों, शोधकर्ताओं, प्रकृति प्रेमियों और आदिवासी युवाओं को वैज्ञानिक संसाधनों और ट्रैक गाइड से सशक्त बनाना।'
              : language === 'ur'
              ? 'طلباء، محققین اور مقامی قبائلی نوجوانوں کو سائنسی مواد اور فیلڈ گائیڈز کی فراہمی۔'
              : 'Empowering students, researchers, nature enthusiasts, and tribal youth with verified scientific resources, quizzes, and track guides.'}
          </p>
        </div>
      </div>

      {/* Technical Architecture & PWA Standards */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-emerald-800" />
          <h2 className="font-display text-2xl font-bold text-stone-900">
            {language === 'hi' ? 'प्रोग्रेसिव वेब ऐप (PWA) तकनीकी मानक' : language === 'ur' ? 'پروگریسو ویب ایپ (PWA) آرکیٹیکچر' : 'Progressive Web App (PWA) Standards Architecture'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-stone-900">
              {language === 'hi' ? 'ऑफलाइन-फर्स्ट फील्ड क्षमता' : language === 'ur' ? 'آف لائن فیلڈ صلاحیت' : 'Offline-First Field Capability'}
            </h4>
            <p>
              {language === 'hi'
                ? 'दूरस्थ वन बीट्स में काम करने के लिए डिज़ाइन किया गया जहाँ सेलुलर कनेक्टिविटी सीमित है। सर्विस वर्कर फील्ड गाइड, हॉटलाइन और टाइगर प्रोफाइल को स्थानीय रूप से कैश करता है।'
                : language === 'ur'
                ? 'گہرے جنگلات کے لیے تیار کیا گیا جہاں انٹرنیٹ سگنل کمزور یا بند ہوتے ہیں۔ سروس ورکر تمام ڈیٹا ڈیوائس پر کیش کر لیتا ہے۔'
                : 'Designed specifically for remote field deployments in West Champaran’s deep forest beats where cellular connectivity is intermittent or absent. The service worker caches core field guides, tiger profiles, emergency hotlines, and maps locally on your device.'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-stone-900">
              {language === 'hi' ? 'सुगम सार्वजनिक पहुंच एवं सुरक्षा' : language === 'ur' ? 'آسان رسائی اور سیکیورٹی' : 'Zero Public Friction & Security'}
            </h4>
            <p>
              {language === 'hi'
                ? 'सार्वजनिक उपयोग के लिए किसी लॉगिन की आवश्यकता नहीं है। प्रशासनिक क्षमताएं सुरक्षित टोकन नियंत्रण द्वारा संरक्षित हैं।'
                : language === 'ur'
                ? 'عوامی معلومات دیکھنے کے لیے کسی لاگ ان کی ضرورت نہیں۔ تمام فیلڈ ڈیٹا بلا روک ٹوک دستیاب ہے۔'
                : 'Public access requires no sign-in or personal account creation. Administrative write capabilities are isolated behind secure administrative token controls.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
