import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CreatorProfileCard } from '../CreatorProfileCard';
import { 
  Award, 
  Heart, 
  ShieldCheck, 
  CheckCircle2,
  ExternalLink,
  Globe,
  FileCheck
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

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          {language === 'hi' 
            ? 'साभार, प्रमाणिकता एवं रचनाकार परिचय' 
            : language === 'ur'
            ? 'کریڈٹس، سائنسی ذرائع اور خالق کا تعارف'
            : 'Credits, Scientific Attribution & Creator Spotlight'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'वाल्मीकि टाइगर वॉच एक स्वतंत्र गैर-सरकारी संरक्षण मंच है। यहाँ इस एप्लिकेशन के रचनाकार, आधिकारिक डेटा स्रोत और अग्रिम पंक्ति के वन रक्षकों के प्रति समर्पण का विवरण दिया गया है।'
            : language === 'ur'
            ? 'والمیکی ٹائیگر واچ ایک خود مختار ماحولیاتی پلیٹ فارم ہے۔ یہاں ایپ کے تخلیق کار، سائنسی حوالہ جات اور فرنٹ لائن فارسٹ گارڈز کے لیے انتساب پیش ہے۔'
            : 'Valmiki Tiger Watch is an independent non-governmental conservation platform. Discover the creator behind the initiative, verified institutional scientific sources, and our dedication to frontline forest guardians.'}
        </p>
      </div>

      {/* Creator Profile Card (Primary Focus) */}
      <div className="space-y-4">
        <CreatorProfileCard variant="full" />
      </div>

      {/* Official Sources & Useful Government Portals */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-[#0B3D2E]" />
          <div>
            <h3 className="font-display font-bold text-2xl text-stone-900">
              {language === 'hi' ? 'आधिकारिक स्रोत एवं उपयोगी लिंक्स' : language === 'ur' ? 'سرکاری ذرائع اور مفید لنکس' : 'Official Sources & Useful Government Portals'}
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              {language === 'hi' ? 'सत्यापनीय राष्ट्रीय एवं अंतरराष्ट्रीय संरक्षण प्राधिकरण' : 'Verifiable National & Global Wildlife Conservation Authorities'}
            </p>
          </div>
        </div>

        {/* Clear Non-Affiliation Declaration */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-mono">
          <strong>Independent Initiative Notice:</strong> Valmiki Tiger Watch is an independent digital conservation awareness platform created for public education. It is not an official portal of, nor directly affiliated with, the government departments or institutions listed below.
        </div>

        {/* Institutional & Scientific Data Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm text-stone-700">
          {/* NTCA */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>NTCA (National Tiger Conservation Authority)</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                All-India Tiger Estimation protocols, M-STrIPES guidelines, management effectiveness evaluation (MEE) criteria, and national population assessments.
              </p>
            </div>
            <a
              href="https://ntca.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-stone-200"
            >
              <span>Visit ntca.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* WII */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>Wildlife Institute of India (WII)</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Spatial camera-trap methodologies, Terai Arc Landscape ecological research papers, genetics studies, and herbivore prey density indices.
              </p>
            </div>
            <a
              href="https://wii.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-stone-200"
            >
              <span>Visit wii.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Bihar Forest Department */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>Dept of Forest, Env & Climate Change, Bihar</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Official Valmiki Tiger Reserve notifications, Eco-Development Committee data, forest division circulars, and ecotourism guidelines.
              </p>
            </div>
            <a
              href="https://forest.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-stone-200"
            >
              <span>Visit forest.bihar.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* MoEFCC */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>MoEFCC (Govt. of India)</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Ministry of Environment, Forest and Climate Change statutory notifications, Wildlife Protection Act policies, and Project Tiger history.
              </p>
            </div>
            <a
              href="https://moef.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-stone-200"
            >
              <span>Visit moef.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Chitwan National Park */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>Chitwan National Park, Nepal</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Contiguous UNESCO World Heritage National Park in Nepal forming the transboundary Terai Arc ecological expanse and gene flow corridor.
              </p>
            </div>
            <a
              href="https://chitwannationalpark.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-stone-200"
            >
              <span>Visit chitwannationalpark.gov.np</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* IUCN Red List */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3D2E] font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>IUCN Red List of Threatened Species</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                International endangered classifications, species taxonomy (Panthera tigris), CITES Appendix I protections, and global population metrics.
              </p>
            </div>
            <a
              href="https://www.iucnredlist.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-stone-200"
            >
              <span>Visit iucnredlist.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
