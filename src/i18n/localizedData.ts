import { Language } from '../context/LanguageContext';
import {
  TigerProfile,
  WildlifeSpecies,
  ConservationAlert,
  EducationItem,
  EcotourismZone,
  CommunityInitiative,
  ResearchReport
} from '../types';

export const LOCALIZED_SPECIES_NAMES: Record<string, { hi: string; ur: string }> = {
  'Bengal Tiger': { hi: 'रॉयल बंगाल टाइगर (बाघ)', ur: 'رائل بنگال ٹائیگر (شیر)' },
  'Indian Leopard': { hi: 'भारतीय तेंदुआ', ur: 'ہندوستانی چیتا (تیندوا)' },
  'Indian Rhinoceros': { hi: 'एक सींग वाला भारतीय गैंडा', ur: 'ہندوستانی ایک سینگ والا گینڈا' },
  'Asian Elephant': { hi: 'एशियाई हाथी', ur: 'ایشیائی ہاتھی' },
  'Gaur (Indian Bison)': { hi: 'गौर (भारतीय बाइसन)', ur: 'گور (ہندوستانی جنگلی بھینسا)' },
  'Sloth Bear': { hi: 'रीछ (भालू)', ur: 'ریچھ' },
  'Gharial': { hi: 'घड़ियाल', ur: 'گھڑیال' },
  'Great Hornbill': { hi: 'ग्रेट हॉर्नबिल (धनेश)', ur: 'گریٹ ہارن بل' },
  'Chital (Spotted Deer)': { hi: 'चीताल (चित्तीदार हिरण)', ur: 'چیتل (ہرن)' },
  'Sambar Deer': { hi: 'सांभर हिरण', ur: 'سانبھر ہرن' },
  'Sal Tree': { hi: 'साल वृक्ष (साखू)', ur: 'سال کا درخت' },
  'Mugger Crocodile': { hi: 'मगरमच्छ', ur: 'مگرمچھ' },
  'Hog Deer': { hi: 'पाढ़ा (हॉग डियर)', ur: 'ہاگ ہرن' },
  'Barking Deer': { hi: 'कांकड़ (भौंकने वाला हिरण)', ur: 'بھونکنے والا ہرن' },
  'Wild Boar': { hi: 'जंगली सूअर', ur: 'جنگلی سور' }
};

export const LOCALIZED_IUCN_STATUS: Record<string, { hi: string; ur: string }> = {
  'CR': { hi: 'घोर संकटग्रस्त (CR)', ur: 'شدید خطرے میں (CR)' },
  'EN': { hi: 'संकटग्रस्त (EN)', ur: 'خطرے سے دوچار (EN)' },
  'VU': { hi: 'संवेदनशील (VU)', ur: 'غیر محفوظ / حساس (VU)' },
  'NT': { hi: 'संकट-निकट (NT)', ur: 'قریب بہ خطرہ (NT)' },
  'LC': { hi: 'कम चिंताजनक (LC)', ur: 'کم تشویش ناک (LC)' }
};

export const LOCALIZED_TIGER_STATUS: Record<string, { hi: string; ur: string }> = {
  'Resident': { hi: 'स्थानीय निवासी', ur: 'مستقل رہائشی' },
  'Resident Dominant': { hi: 'प्रमुख क्षेत्रीय नर', ur: 'غالب علاقائی شیر' },
  'Breeding Female': { hi: 'प्रजननशील मादा', ur: 'نسل افزائش مادہ' },
  'Sub-Adult': { hi: 'अर्ध-वयस्क', ur: 'نو عمر شیر' },
  'Transient': { hi: 'पारगमनशील', ur: 'عارضی مسافر' }
};

export const LOCALIZED_SEVERITY: Record<string, { hi: string; ur: string }> = {
  'critical': { hi: 'गंभीर', ur: 'انتہائی اہم' },
  'warning': { hi: 'चेतावनी', ur: 'انتباہ' },
  'advisory': { hi: 'सलाह', ur: 'ہدایت' },
  'seasonal': { hi: 'मौसमी', ur: 'موسمی' },
  'info': { hi: 'सूचना', ur: 'اطلاع' }
};

/**
 * Localize a tiger profile based on the selected language
 */
export function getLocalizedTiger(tiger: TigerProfile, lang: Language): TigerProfile {
  if (lang === 'en') return tiger;

  const statusMap = LOCALIZED_TIGER_STATUS[tiger.status];
  const localizedStatus = statusMap ? (lang === 'hi' ? statusMap.hi : statusMap.ur) : tiger.status;

  if (lang === 'hi') {
    return {
      ...tiger,
      status: localizedStatus as any,
      sex: tiger.sex === 'Male' ? ('नर' as any) : tiger.sex === 'Female' ? ('मादा' as any) : ('अज्ञात' as any),
      verification: tiger.verification === 'verified' ? ('सत्यापित' as any) : tiger.verification
    };
  }

  if (lang === 'ur') {
    return {
      ...tiger,
      status: localizedStatus as any,
      sex: tiger.sex === 'Male' ? ('نر' as any) : tiger.sex === 'Female' ? ('مادہ' as any) : ('نامعلوم' as any),
      verification: tiger.verification === 'verified' ? ('مصدقہ' as any) : tiger.verification
    };
  }

  return tiger;
}

/**
 * Localize species common name
 */
export function getLocalizedSpeciesName(commonName: string, lang: Language): string {
  if (lang === 'en') return commonName;
  const match = LOCALIZED_SPECIES_NAMES[commonName];
  if (match) {
    return lang === 'hi' ? match.hi : match.ur;
  }
  return commonName;
}

/**
 * Localize IUCN status label
 */
export function getLocalizedIUCN(status: string, lang: Language): string {
  if (lang === 'en') return status;
  const match = LOCALIZED_IUCN_STATUS[status];
  if (match) {
    return lang === 'hi' ? match.hi : match.ur;
  }
  return status;
}
