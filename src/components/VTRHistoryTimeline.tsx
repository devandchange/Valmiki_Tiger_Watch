import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calendar, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Layers, 
  MapPin, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  TreePine, 
  Radio, 
  Users, 
  Compass, 
  Sparkles,
  Info,
  CheckCircle2,
  Filter,
  History
} from 'lucide-react';

export type MilestoneCategory = 'all' | 'legal' | 'census' | 'tech' | 'transboundary' | 'community';
export type MilestoneEra = 'all' | 'foundation' | 'expansion' | 'revival' | 'modern';

export interface MilestoneItem {
  id: string;
  year: string;
  exactDate?: string;
  era: 'foundation' | 'expansion' | 'revival' | 'modern';
  category: 'legal' | 'census' | 'tech' | 'transboundary' | 'community';
  impactLevel: 'landmark' | 'high' | 'strategic';
  tigerCount?: number | string;
  title: {
    en: string;
    hi: string;
    ur: string;
  };
  summary: {
    en: string;
    hi: string;
    ur: string;
  };
  details: {
    en: string;
    hi: string;
    ur: string;
  };
  keyOutcomes: {
    en: string[];
    hi: string[];
    ur: string[];
  };
  locationRange?: {
    en: string;
    hi: string;
    ur: string;
  };
}

export const VTR_CONSERVATION_MILESTONES: MilestoneItem[] = [
  {
    id: 'm-1953',
    year: '1953',
    exactDate: '1953',
    era: 'foundation',
    category: 'legal',
    impactLevel: 'landmark',
    title: {
      en: 'Bettiah Raj Zamindari Forest Acquisition',
      hi: 'बेतिया राज जमींदारी वन का राज्य अधिग्रहण',
      ur: 'بیتیا راج زمینداری جنگلات کا ریاستی الحاق'
    },
    summary: {
      en: 'Following independence and land reforms, over 900 sq km of private sal forests and shikargahs of the Bettiah Raj were transferred to Bihar Forest Department stewardship.',
      hi: 'स्वतंत्रता के बाद बेतिया राज के 900+ वर्ग किमी निजी साल वनों और शिकारगाहों को बिहार वन विभाग के संरक्षण में सौंपा गया।',
      ur: 'آزادی اور زمینداری خاتمے کے بعد بیتیا راج کے 900 مربع کلومیٹر سے زیادہ سال کے گھنے جنگلات اور شکار گاہیں بہار فارسٹ ڈیپارٹمنٹ کی تحویل میں دی گئیں۔'
    },
    details: {
      en: 'Prior to 1953, the vast forested belt in West Champaran was managed as private hunting and timber estates of the Bettiah Raj. The transfer ended unmonitored commercial felling and laid the legal foundation for state-protected wildlife habitat.',
      hi: '1953 से पहले पश्चिमी चंपारण का यह विशाल वन क्षेत्र बेतिया राज की निजी संपत्ति था। राज्य अधिग्रहण ने अनियंत्रित व्यावसायिक कटाई पर रोक लगाई और औपचारिक वन्यजीव संरक्षण का आधार तैयार किया।',
      ur: '1953 سے پہلے یہ رقبہ نجی جائیداد تھا۔ حکومتی کنٹرول کے بعد لکڑی کی اندھا دھند کٹائی رکی اور مستقبل کے قومی تحفظ کے لیے قانونی بنیاد رکھی گئی۔'
    },
    keyOutcomes: {
      en: ['Halted unregulated commercial logging', 'Established initial forest range beat boundaries', 'Preserved ancient Sal canopy along Gandak river'],
      hi: ['अनियंत्रित व्यावसायिक कटाई पर पूर्ण प्रतिबंध', 'प्रारंभिक वन बीट एवं सीमाओं का निर्धारण', 'गंडक नदी तट पर प्राचीन साल वनों का संरक्षण'],
      ur: ['تجارتی کٹائی پر مکمل پابندی', 'ابتدائی فارسٹ رینج حدود کا قیام', 'گندک کے کنارے قدیم سال جنگلات کا تحفظ']
    },
    locationRange: {
      en: 'Valmikinagar, Gonauli & Madanpur tracts',
      hi: 'वाल्मीकिनगर, गोनौली एवं मदनपुर क्षेत्र',
      ur: 'والمیکی نگر، گنولی اور مدن پور کے جنگلاتی علاقے'
    }
  },
  {
    id: 'm-1978',
    year: '1978',
    exactDate: 'May 1978',
    era: 'foundation',
    category: 'legal',
    impactLevel: 'landmark',
    title: {
      en: 'Valmiki Wildlife Sanctuary Formal Notification',
      hi: 'वाल्मीकि वन्यजीव अभयारण्य की विधिवत अधिसूचना',
      ur: 'والمیکی وائلڈ لائف سینکچری کا باقاعدہ نوٹیفکیشن'
    },
    summary: {
      en: 'Government of Bihar notified 545.15 sq km of Champaran forests as Valmiki Wildlife Sanctuary under the Wildlife Protection Act, 1972.',
      hi: 'वन्यजीव संरक्षण अधिनियम, 1972 के तहत 545.15 वर्ग किमी वन क्षेत्र को वाल्मीकि वन्यजीव अभयारण्य घोषित किया गया।',
      ur: 'وائلڈ لائف پروٹیکشن ایکٹ 1972 کے تحت 545.15 مربع کلومیٹر رقبے کو باضابطہ والمیکی وائلڈ لائف سینکچری قرار دیا گیا۔'
    },
    details: {
      en: 'This statutory declaration established full legal immunity for apex predators, herbivores, and riverine species against hunting, logging, and unauthorized mining in the Someshwar and Dun foothills.',
      hi: 'इस वैधानिक अधिसूचना ने सोमेश्वर एवं दून की तलहटी में शिकार, कटाई और अवैध खनन के खिलाफ बाघ और अन्य जीवों को कानूनी सुरक्षा कवच प्रदान किया।',
      ur: 'اس قانونی اقدام کے تحت ہمالیائی دامن میں تمام شکاری و نایاب جانوروں کو شکار اور غیر قانونی درختوں کی کٹائی سے مکمل تحفظ ملا۔'
    },
    keyOutcomes: {
      en: ['545.15 sq km protected under WPA 1972', 'Creation of first anti-poaching forest checkpoints', 'Official recognition of Terai ecosystem biodiversity'],
      hi: ['545.15 वर्ग किमी क्षेत्र को वन्यजीव अधिनियम का संरक्षण', 'पहली बार शिकार-रोधी वन चौकियों की स्थापना', 'तराई पारिस्थितिकी तंत्र की राष्ट्रीय पहचान'],
      ur: ['545.15 مربع کلومیٹر کا محفوظ رقبہ', 'پہلی اینٹی پوچنگ چوکیوں کا قیام', 'ترائی حیاتیاتی تنوع کی سرکاری پہچان']
    },
    locationRange: {
      en: 'Western & Central VTR Sectors',
      hi: 'पश्चिमी एवं मध्य वीटीआर प्रभाग',
      ur: 'مغربی و مرکزی والمیکی سیکٹرز'
    }
  },
  {
    id: 'm-1990-pt',
    year: '1990',
    exactDate: 'January 1990',
    era: 'expansion',
    category: 'legal',
    impactLevel: 'landmark',
    tigerCount: 'Baseline',
    title: {
      en: 'Induction into Project Tiger (India’s 18th Tiger Reserve)',
      hi: 'प्रोजेक्ट टाइगर में शामिल (भारत का 18वाँ टाइगर रिजर्व)',
      ur: 'پروجیکٹ ٹائیگر میں شمولیت (بھارت کا 18واں ٹائیگر ریزرو)'
    },
    summary: {
      en: 'Valmiki was officially designated as India’s 18th Tiger Reserve under the Centrally Sponsored Project Tiger scheme, unlocking dedicated national conservation funding.',
      hi: 'वाल्मीकि को आधिकारिक तौर पर देश का 18वाँ टाइगर रिजर्व घोषित किया गया, जिससे केंद्रीय संरक्षण निधि व विशेष सुरक्षा दल मिले।',
      ur: 'والمیکی کو باضابطہ طور پر بھارت کا 18واں ٹائیگر ریزرو نامزد کیا گیا، جس سے خصوصی قومی فنڈز اور سائنسی نگرانی کا راستہ کھلا۔'
    },
    details: {
      en: 'Joining Project Tiger transformed Valmiki from a regional sanctuary into a nationally critical tiger conservation landscape, establishing dedicated management plans, armed patrolling divisions, and regular pugmark censuses.',
      hi: 'प्रोजेक्ट टाइगर से जुड़ने के बाद वाल्मीकि को राष्ट्रीय स्तर पर प्राथमिकता मिली। समर्पित फील्ड निदेशालय, नियमित पगचिह्न जनगणना और गश्त दस्तों का गठन हुआ।',
      ur: 'پروجیکٹ ٹائیگر کے تحت باقاعدہ فیلڈ ڈائریکٹوریٹ، پٹرولنگ یونٹس اور قومی سطح کی سائنسی منصوبہ بندی شروع ہوئی۔'
    },
    keyOutcomes: {
      en: ['Designated India’s 18th Tiger Reserve', 'Deployment of dedicated Project Tiger Field Directorate', 'Establishment of regular annual census methodology'],
      hi: ['भारत के 18वें टाइगर रिजर्व का गौरव', 'समर्पित फील्ड निदेशालय की स्थापना', 'वार्षिक वैज्ञानिक जनगणना प्रणाली की शुरुआत'],
      ur: ['بھارت کا 18واں ٹائیگر ریزرو', 'مستقل فیلڈ ڈائریکٹوریٹ کا قیام', 'باقاعدہ سالانہ مردم شماری کا آغاز']
    },
    locationRange: {
      en: 'Entire Protected Landscape (899 sq km)',
      hi: 'संपूर्ण संरक्षित वन क्षेत्र (899 वर्ग किमी)',
      ur: 'پورا 899 مربع کلومیٹر کا محفوظ رقبہ'
    }
  },
  {
    id: 'm-1990-np',
    year: '1990',
    exactDate: 'December 1990',
    era: 'expansion',
    category: 'legal',
    impactLevel: 'landmark',
    title: {
      en: 'Valmiki National Park Constitution (Core Zone 335.65 sq km)',
      hi: 'वाल्मीकि राष्ट्रीय उद्यान का गठन (कोर ज़ोन 335.65 वर्ग किमी)',
      ur: 'والمیکی نیشنل پارک کا قیام (کور زون 335.65 مربع کلومیٹر)'
    },
    summary: {
      en: 'Notification of 335.65 sq km of inviolate core forest as Valmiki National Park to guarantee disturbance-free breeding habitats for tigers and leopards.',
      hi: 'बाघों और तेंदुओं के निर्बाध प्रजनन हेतु 335.65 वर्ग किमी कोर वन क्षेत्र को वाल्मीकि राष्ट्रीय उद्यान अधिसूचित किया गया।',
      ur: 'شیروں کی محفوظ نسل کشی کے لیے 335.65 مربع کلومیٹر کے ناقابلِ مداخلت مرکزی حصے کو نیشنل پارک قرار دیا گیا۔'
    },
    details: {
      en: 'The establishment of the National Park created a dual-tier zonation: an inviolate 335.65 sq km Core Zone surrounded by a 563.73 sq km Wildlife Sanctuary buffer, optimizing both strict protection and community fringe development.',
      hi: 'राष्ट्रीय उद्यान बनने से दोहरे स्तर का संरक्षण ढांचा तैयार हुआ: 335.65 वर्ग किमी का सख्त कोर क्षेत्र और 563.73 वर्ग किमी का बफर जोन।',
      ur: 'اس اقدام سے دو سطحی نظام بنا: 335.65 مربع کلومیٹر کا سخت کور زون اور 563.73 مربع کلومیٹر کا بفر زون۔'
    },
    keyOutcomes: {
      en: ['335.65 sq km zero-disturbance core habitat', 'Permanent boundary demarcation with Nepal’s Chitwan', 'Ban on commercial extraction inside core territory'],
      hi: ['335.65 वर्ग किमी का शून्य-हस्तक्षेप कोर आवास', 'नेपाल के चितवन के साथ सीमांकन', 'कोर क्षेत्र में व्यावसायिक गतिविधियों पर पूर्ण रोक'],
      ur: ['335.65 مربع کلومیٹر کا پرامن مسکن', 'نیپال کے چتون پارک سے متصل حد بندی', 'کور زون میں تمام تجارتی مداخلت پر پابندی']
    },
    locationRange: {
      en: 'Gonauli, Kotraha & Chiutaha Core Beats',
      hi: 'गोनौली, कोतराहा एवं चिउटाहा कोर बीट',
      ur: 'گنولی، کوٹراہا اور چیوٹاہا کے مرکزی جنگلات'
    }
  },
  {
    id: 'm-2003',
    year: '2003',
    exactDate: 'November 2003',
    era: 'expansion',
    category: 'transboundary',
    impactLevel: 'strategic',
    title: {
      en: 'India-Nepal Transboundary Tiger Corridor Accord',
      hi: 'भारत-नेपाल सीमा-पार बाघ गलियारा सुरक्षा समझौता',
      ur: 'پاک و ہند-نیپال سرحد پار ٹائیگر کوریڈور معاہدہ'
    },
    summary: {
      en: 'Forest authorities of Bihar and Nepal established formal transboundary coordination to protect tigers migrating between Valmiki and Chitwan National Park.',
      hi: 'वाल्मीकि और नेपाल के चितवन नेशनल पार्क के बीच बाघों की सुरक्षित आवाजाही हेतु सीमा-पार समन्वय प्रणाली स्थापित हुई।',
      ur: 'والمیکی اور نیپال کے چتون نیشنل پارک کے درمیان سرحد پار شیروں کی نقل و حرکت کے تحفظ کے لیے باہمی رابطہ قائم کیا گیا۔'
    },
    details: {
      en: 'Tigers frequently cross the Gandak/Narayani river and Someshwar ridge corridors between India and Nepal. This agreement synchronized anti-poaching intelligence and illegal wildlife trade surveillance.',
      hi: 'बाघ गंडक नदी और सोमेश्वर पर्वतमाला के रास्ते दोनों देशों में आते-जाते हैं। इस समझौते से अवैध शिकार रोकने हेतु दोनों देशों की खुफिया जानकारी साझा करने की व्यवस्था बनी।',
      ur: 'گندک ندی اور پہاڑی سلسلوں سے شیر دونوں ممالک میں آتے جاتے ہیں۔ اس معاہدے سے غیر قانونی شکار کی روک تھام کے لیے مشترکہ انٹیلی جنس شیئرنگ شروع ہوئی۔'
    },
    keyOutcomes: {
      en: ['Joint transboundary patrol checkpoints', 'Cross-border intelligence sharing on poacher gangs', 'Gene-flow continuity across the Terai Arc Landscape'],
      hi: ['संयुक्त सीमा-पार निगरानी चौकियां', 'शिकारी गिरोहों पर खुफिया सूचनाओं का आदान-प्रदान', 'तराई आर्क में आनुवंशिक निरंतरता की सुरक्षा'],
      ur: ['مشترکہ سرحد پار گشتی چوکیاں', 'شکاریوں کے خلاف انٹیلی جنس کا تبادلہ', 'ترائی آرک میں جین کے قدرتی تبادلے کا تحفظ']
    },
    locationRange: {
      en: 'Triveni Sangam & Nepal Border Ridge',
      hi: 'त्रिवेणी संगम एवं भारत-नेपाल सीमा कटक',
      ur: 'تریوینی سنگم اور پاک نیپال سرحدی پہاڑی'
    }
  },
  {
    id: 'm-2010',
    year: '2010',
    exactDate: '2010',
    era: 'revival',
    category: 'census',
    impactLevel: 'strategic',
    tigerCount: '8–10',
    title: {
      en: 'Population Nadir & The Comprehensive Revival Masterplan',
      hi: 'आबादी का संकट (8–10 बाघ) एवं व्यापक पुनरुद्धार महायोजना',
      ur: 'آبادی کا سنگین بحران (8–10 شیر) اور بحالی کا ماسٹر پلان'
    },
    summary: {
      en: 'Tiger numbers plummeted to a critical nadir of 8–10 individuals due to historical biotic pressure, prompting a massive state and national intervention.',
      hi: 'दबाव के कारण बाघों की संख्या घटकर मात्र 8–10 रह गई, जिसके बाद राज्य एवं केंद्र सरकार ने आपातकालीन पुनरुद्धार योजना लागू की।',
      ur: 'شدید دباؤ کے باعث شیروں کی تعداد کم ہو کر صرف 8 سے 10 رہ گئی، جس کے بعد بڑے پیمانے پر ہنگامی بحالی مہم شروع کی گئی۔'
    },
    details: {
      en: 'Recognizing the grave danger of localized extinction, the Bihar Forest Department, supported by WTI and NTCA, overhauled park administration, recruited local Tharu youth as forest watchers, and introduced strict habitat recovery protocols.',
      hi: 'स्थानीय विलुप्ति के खतरे को देखते हुए बिहार वन विभाग ने डब्लूटीआई और एनटीसीए के सहयोग से प्रशासनिक ढांचा बदला, थारू युवाओं को रक्षक बनाया और आवास सुधार शुरू किया।',
      ur: 'مقامی معدومی کے خطرے کے پیش نظر فارسٹ ڈیپارٹمنٹ نے ڈبلیو ٹی آئی کے تعاون سے مقامی تھارو قبائلی نوجوانوں کو گارڈز بھرتی کیا اور قدرتی مسکن کو بحال کیا۔'
    },
    keyOutcomes: {
      en: ['Launch of Valmiki Tiger Conservation Plan', 'Deployment of 100+ local tribal tiger trackers', 'Grassland regeneration across 200+ hectares'],
      hi: ['वाल्मीकि बाघ संरक्षण कार्ययोजना का शुभारंभ', '100+ स्थानीय आदिवासी टाइगर ट्रैकर्स की तैनाती', '200+ हेक्टेयर में घास के मैदानों का पुनर्जनन'],
      ur: ['والمیکی ٹائیگر کنزرویشن پلان کا آغاز', '100 سے زائد قبائلی ٹریکرز کی تعیناتی', '200 ہیکٹر سے زائد رقبے پر گھاس کے میدانوں کی بحالی']
    },
    locationRange: {
      en: 'All 8 Forest Ranges (Division I & II)',
      hi: 'सभी 8 वन प्रभाग (प्रभाग I एवं II)',
      ur: 'تمام 8 فارسٹ رینجز (ڈویژن I اور II)'
    }
  },
  {
    id: 'm-2013',
    year: '2013',
    exactDate: 'Winter 2013',
    era: 'revival',
    category: 'tech',
    impactLevel: 'high',
    tigerCount: '22',
    title: {
      en: 'Phase-IV Camera-Trap System & Population Rebound (22 Tigers)',
      hi: 'चरण-IV कैमरा-ट्रैप प्रणाली की शुरुआत व आबादी उछाल (22 बाघ)',
      ur: 'فیز-IV کیمرہ ٹریپنگ اور آبادی میں اضافہ (22 شیر)'
    },
    summary: {
      en: 'First comprehensive grid-based automated camera-trap census conducted by Wildlife Institute of India (WII) confirmed a dramatic rise to 22 individual tigers.',
      hi: 'भारतीय वन्यजीव संस्थान (WII) द्वारा ग्रिड-आधारित कैमरा ट्रैप सर्वेक्षण में 22 बाघों की पुष्टि हुई, जिससे संरक्षण में नई आशा जागी।',
      ur: 'وائلڈ لائف انسٹی ٹیوٹ آف انڈیا (WII) کے کیمرہ ٹریپ سروے میں 22 شیروں کی تصویر کشی اور موجودگی کی تصدیق ہوئی۔'
    },
    details: {
      en: 'Replacing error-prone pugmark estimation with scientific capture-recapture camera trapping provided indisputable visual proof of healthy breeding tigresses and cubs in Gonauli, Madanpur, and Chiutaha ranges.',
      hi: 'कैमरा ट्रैप तकनीक ने गोनौली, मदनपुर और चिउटाहा में प्रजननशील बाघिनों और शावकों की उपस्थिति के ठोस वैज्ञानिक प्रमाण दिए।',
      ur: 'سائنسی کیمرہ ٹریپس نے گنولی، مدن پور اور چیوٹاہا میں صحت مند مادہ شیروں اور بچوں کی موجودگی کے ٹھوس ثبوت فراہم کیے۔'
    },
    keyOutcomes: {
      en: ['Scientific stripe-pattern database established', 'Confirmed presence of 5+ breeding resident tigresses', 'Introduction of M-STrIPES digital patrolling app'],
      hi: ['वैज्ञानिक धारी-पैटर्न डेटाबेस की स्थापना', '5+ प्रजननशील स्थानीय बाघिनों की पुष्टि', 'एम-स्ट्राइप्स डिजिटल गश्त ऐप की शुरुआत'],
      ur: ['پٹیوں کے سائنسی نمونوں کا ڈیٹا بیس قائم', '5 سے زائد افزائش نسل کرنے والی مادہ شیروں کی تصدیق', 'ایم سٹرائپس ڈیجیٹل پٹرولنگ ایپ کا آغاز']
    },
    locationRange: {
      en: 'Gonauli, Madanpur, Chiutaha & Harnatanr',
      hi: 'गोनौली, मदनपुर, चिउटाहा एवं हरनाटांड़',
      ur: 'گنولی، مدن پور، چیوٹاہا اور ہرناٹانڑ'
    }
  },
  {
    id: 'm-2018',
    year: '2018',
    exactDate: 'July 2018',
    era: 'revival',
    category: 'census',
    impactLevel: 'high',
    tigerCount: '31+',
    title: {
      en: 'All India Tiger Estimation (AITE): 31+ Resident Tigers',
      hi: 'अखिल भारतीय बाघ गणना (AITE): 31+ निवासी बाघ प्रलेखित',
      ur: 'آل انڈیا ٹائیگر تخمینہ (AITE): 31+ مستقل شیروں کا اندارج'
    },
    summary: {
      en: 'National Tiger Conservation Authority (NTCA) census officially recorded 31 resident adult tigers, cementing VTR as one of India’s top tiger recovery habitats.',
      hi: 'एनटीसीए की राष्ट्रीय गणना में 31 वयस्क बाघ दर्ज हुए। वीटीआर को देश के सबसे तेजी से उभरते बाघ अभयारण्यों में मान्यता मिली।',
      ur: 'این ٹی سی اے کی قومی مردم شماری میں 31 بالغ شیروں کا اندراج ہوا، جس نے والمیکی کو ملک کے تیزی سے بحال ہونے والے پارکس میں شامل کیا۔'
    },
    details: {
      en: 'The 2018 survey highlighted an increase in prey biomass—especially chital (spotted deer), wild boar, and sambar—driven by the creation of 45+ perennial solar waterholes and active suppression of forest fires.',
      hi: '2018 के सर्वेक्षण ने 45+ सौर ऊर्जा संचालित जलस्रोतों और दावानल नियंत्रण के कारण चीतल और सांभर जैसे शिकार जीवों की संख्या में भारी वृद्धि दर्ज की।',
      ur: '2018 کے سروے سے واضح ہوا کہ 45 سے زائد سولر واٹر ہولز اور آگ پر قابو پانے سے ہرن اور دیگر شکار کی تعداد میں زبردست اضافہ ہوا۔'
    },
    keyOutcomes: {
      en: ['Recorded +210% population rise from 2010 baseline', '45 solar-powered submersible waterholes installed', 'Zero reported poaching cases in the core division'],
      hi: ['2010 के मुकाबले +210% आबादी में वृद्धि', '45 सौर ऊर्जा संचालित जल स्रोतों का निर्माण', 'कोर क्षेत्र में शिकार की शून्य घटनाएं'],
      ur: ['2010 کے مقابلے میں 210 فیصد اضافہ', '45 سولر واٹر ہولز کی تنصیب', 'کور زون میں شکار کا کوئی واقعہ پیش نہیں آیا']
    },
    locationRange: {
      en: 'All 8 Ranges across Division I & II',
      hi: 'प्रभाग I एवं II के सभी 8 वन क्षेत्र',
      ur: 'ڈویژن I اور II کے تمام 8 رینجز'
    }
  },
  {
    id: 'm-2022',
    year: '2022',
    exactDate: '2022–2023',
    era: 'modern',
    category: 'census',
    impactLevel: 'landmark',
    tigerCount: '54+',
    title: {
      en: 'Historic Milestone: 54+ Tigers & National Excellence Recognition',
      hi: 'ऐतिहासिक पड़ाव: 54+ बाघ एवं राष्ट्रीय संरक्षण उत्कृष्टता सम्मान',
      ur: 'تاریخی سنگ میل: 54+ شیر اور قومی اعزاز'
    },
    summary: {
      en: 'The 5th cycle of the national tiger census registered a staggering 54+ individual tigers (adults and cubs), marking a historic +575% increase since 2006.',
      hi: 'राष्ट्रीय बाघ गणना के 5वें चक्र में 54+ बाघ (वयस्क एवं शावक) दर्ज किए गए, जो 2006 के बाद से +575% की ऐतिहासिक वृद्धि है।',
      ur: 'قومی مردم شماری کے 5ویں مرحلے میں 54 سے زائد شیروں کا اندراج ہوا، جو 2006 کے بعد سے 575 فیصد کا حیرت انگیز اضافہ ہے۔'
    },
    details: {
      en: 'Valmiki Tiger Reserve achieved international acclaim for turning a degraded forest into a thriving carnivore paradise. The population density reached sustainable saturation in core areas, encouraging natural dispersal into buffer beats.',
      hi: 'वाल्मीकि को अंतरराष्ट्रीय स्तर पर एक संकटग्रस्त वन को संपन्न वन्यजीव स्वर्ग में बदलने हेतु सराहा गया। कोर क्षेत्र में बाघों का घनत्व अनुकूलतम स्तर पर पहुंच गया।',
      ur: 'والمیکی نے بین الاقوامی سطح پر توجہ حاصل کی۔ کور زون میں شیروں کی کثافت بہترین سطح پر پہنچ گئی اور بفر ایریا میں بھی ان کی نقل و حرکت بڑھی۔'
    },
    keyOutcomes: {
      en: ['Highest tiger population in Bihar’s recorded history (54+)', 'Over 350 hectares of grassland actively managed', 'Awarded Special Commendation at Global Tiger Forum events'],
      hi: ['बिहार के इतिहास में सर्वाधिक बाघ आबादी (54+)', '350+ हेक्टेयर घास के मैदानों का सक्रिय प्रबंधन', 'ग्लोबल टाइगर फोरम में विशेष सम्मान प्राप्त'],
      ur: ['بہار کی تاریخ میں شیروں کی سب سے زیادہ تعداد (54+)', '350 ہیکٹر سے زائد رقبے پر جدید گھاس کا انتظام', 'گلوبل ٹائیگر فورم میں خصوصی ستائش']
    },
    locationRange: {
      en: 'Entire VTR Landscape + Gandak Riverine Buffer',
      hi: 'संपूर्ण वीटीआर भूभाग एवं गंडक नदीय बफर',
      ur: 'مکمل والمیکی لینڈ اسکیپ اور گندک بفر زون'
    }
  },
  {
    id: 'm-2024-2026',
    year: '2024–2026',
    exactDate: 'Present & Ongoing',
    era: 'modern',
    category: 'tech',
    impactLevel: 'strategic',
    tigerCount: '54+',
    title: {
      en: 'Smart Electronic Surveillance, Rhino Feasibility & Community EDCs',
      hi: 'स्मार्ट इलेक्ट्रॉनिक निगरानी (e-Eye), गैंडा पुनर्वास व पर्यावरण समितियां',
      ur: 'جدید الیکٹرانک نگرانی (e-Eye)، گینڈوں کی بحالی اور کمیونٹی ای ڈی سیز'
    },
    summary: {
      en: 'Integration of solar-powered electronic surveillance towers (e-Eye), comprehensive M-STrIPES thermal grids, 40+ Tharu Eco-Development Committees (EDCs), and Greater One-horned Rhino reintroduction feasibility studies.',
      hi: 'सौर-संचालित ई-आई निगरानी टावर, थर्मल कैमरा ग्रिड, 40+ थारू पर्यावरण विकास समितियां एवं एक सींग वाले गैंडे की पुनर्स्थापना का अध्ययन।',
      ur: 'سولر پاورڈ ای-آئی ٹاورز، تھرمل کیمرہ نیٹ ورک، 40 سے زائد تھارو ایکو ڈویلپمنٹ کمیٹیاں اور ایک سینگ والے گینڈے کی بحالی کی فزیبلٹی۔'
    },
    details: {
      en: 'Modern VTR combines advanced edge technology with indigenous stewardship. Solar towers monitor border crossings 24/7, while EDCs distribute ecotourism benefits directly to fringe villages, ensuring zero retaliatory killings and peaceful human-wildlife coexistence.',
      hi: 'आधुनिक वाल्मीकि अत्याधुनिक तकनीक और जनजातीय परंपरा का संगम है। सौर टावर 24/7 सीमा की निगरानी करते हैं, जबकि पर्यावरण समितियां पर्यटन का लाभ स्थानीय ग्रामीणों तक पहुंचाती हैं।',
      ur: 'جدید دور میں سائنسی ٹیکنالوجی اور مقامی روایات یکجا ہو چکی ہیں۔ 24 گھنٹے الیکٹرانک نگرانی کے ساتھ سیاحت کی آمدنی براہ راست دیہاتیوں کو دی جا رہی ہے۔'
    },
    keyOutcomes: {
      en: ['24/7 solar-powered e-Eye border surveillance', 'Rhino reintroduction habitat assessment in Madanpur', '40+ active Tharu Village Eco-Development Committees'],
      hi: ['24/7 सौर ऊर्जा संचालित ई-आई सीमा निगरानी', 'मदनपुर में गैंडा पुनर्वास हेतु आवास का आकलन', '40+ सक्रिय थारू ग्राम पर्यावरण विकास समितियां'],
      ur: ['سولر پاورڈ ای-آئی ٹاورز سے 24 گھنٹے سرحدی نگرانی', 'مدن پور میں گینڈوں کے قدرتی مسکن کا جائزہ', '40 سے زائد فعال تھارو ولیج ایکو ڈیولپمنٹ کمیٹیاں']
    },
    locationRange: {
      en: 'Madanpur Wetlands, Valmikinagar & Border Towers',
      hi: 'मदनपुर आर्द्रभूमि, वाल्मीकिनगर एवं सीमावर्ती टावर',
      ur: 'مدن پور ویٹ لینڈز، والمیکی نگر اور بارڈر ٹاورز'
    }
  }
];

export const VTRHistoryTimeline: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const [selectedEra, setSelectedEra] = useState<MilestoneEra>('all');
  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('m-2022');

  const filteredMilestones = useMemo(() => {
    return VTR_CONSERVATION_MILESTONES.filter((m) => {
      // Era filter
      if (selectedEra !== 'all' && m.era !== selectedEra) return false;
      // Category filter
      if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (m.title[language] || m.title.en).toLowerCase().includes(q);
        const summaryMatch = (m.summary[language] || m.summary.en).toLowerCase().includes(q);
        const yearMatch = m.year.toLowerCase().includes(q);
        const detailsMatch = (m.details[language] || m.details.en).toLowerCase().includes(q);
        return titleMatch || summaryMatch || yearMatch || detailsMatch;
      }
      return true;
    });
  }, [selectedEra, selectedCategory, searchQuery, language]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'legal':
        return {
          label: language === 'hi' ? 'कानूनी अधिसूचना' : language === 'ur' ? 'قانونی نوٹیفکیشن' : 'Sanctuary & Law',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <ShieldCheck className="w-3.5 h-3.5" />
        };
      case 'census':
        return {
          label: language === 'hi' ? 'बाघ गणना व डेटा' : language === 'ur' ? 'مردم شماری و اعداد' : 'Tiger Census & Data',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <TrendingUp className="w-3.5 h-3.5" />
        };
      case 'tech':
        return {
          label: language === 'hi' ? 'तकनीक व निगरानी' : language === 'ur' ? 'ٹیکنالوجی و مانیٹرنگ' : 'Smart Tech & AI',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          icon: <Radio className="w-3.5 h-3.5" />
        };
      case 'transboundary':
        return {
          label: language === 'hi' ? 'सीमा-पार गलियारा' : language === 'ur' ? 'سرحد پار کوریڈور' : 'Transboundary Ecology',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: <Compass className="w-3.5 h-3.5" />
        };
      case 'community':
        return {
          label: language === 'hi' ? 'समुदायिक सह-अस्तित्व' : language === 'ur' ? 'کمیونٹی بقائے باہمی' : 'Community Coexistence',
          color: 'bg-teal-100 text-teal-900 border-teal-300',
          icon: <Users className="w-3.5 h-3.5" />
        };
      default:
        return {
          label: 'Conservation',
          color: 'bg-stone-100 text-stone-800 border-stone-300',
          icon: <TreePine className="w-3.5 h-3.5" />
        };
    }
  };

  return (
    <div 
      id="vtr-interactive-history-timeline"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8"
    >
      {/* Header with Title & Stats Overview */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 pb-6 border-b border-stone-100">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-amber-50 border border-amber-300/80 rounded-full px-3.5 py-1 text-xs font-mono text-amber-900 shadow-xs">
            <History className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-bold">
              {language === 'hi' 
                ? 'ऐतिहासिक संरक्षण यात्रा (1953 – 2026)' 
                : language === 'ur' 
                ? 'تحفظ کی تاریخی داستان (1953 – 2026)' 
                : 'Conservation Heritage Chronicle (1953 – 2026)'}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'hi'
              ? 'वाल्मीकि टाइगर रिजर्व: संरक्षण इतिहास के प्रमुख पड़ाव'
              : language === 'ur'
              ? 'والمیکی ٹائیگر ریزرو: تحفظ کے اہم تاریخی سنگ میل'
              : 'Interactive Conservation Timeline of Valmiki'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            {language === 'hi'
              ? '1953 में बेतिया राज के वनों के अधिग्रहण से लेकर 1990 में भारत का 18वाँ टाइगर रिजर्व बनने और 2026 में 54+ बाघों के साथ आधुनिक स्मार्ट सर्विलांस तक का प्रेरणादायक सफर।'
              : language === 'ur'
              ? '1953 میں زمینداری جنگلات کے الحاق سے لے کر 1990 میں 18واں ٹائیگر ریزرو بننے اور 2026 میں 54+ شیروں کی جدید سائنسی حفاظت تک کا سفر۔'
              : 'From the 1953 Bettiah Raj forest acquisition and 1990 Project Tiger induction to the extraordinary 54+ tiger revival and 2026 smart electronic monitoring.'}
          </p>
        </div>

        {/* Quick Trajectory Counter Pill */}
        <div className="bg-gradient-to-br from-[#0B3D2E] to-[#124B38] text-white p-4 rounded-2xl border border-emerald-600/40 shadow-md flex items-center space-x-4 rtl:space-x-reverse flex-shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-200 block">
              {language === 'hi' ? 'शुरुआती संकट' : language === 'ur' ? 'ابتدائی بحران' : '2006 Nadir'}
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-amber-400">8–10</span>
            <span className="text-[10px] text-emerald-100/70 block">{language === 'hi' ? 'बाघ' : language === 'ur' ? 'شیر' : 'Tigers'}</span>
          </div>

          <div className="w-px h-8 bg-white/20" />

          <div className="text-center px-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
              {language === 'hi' ? 'वर्तमान संख्या' : language === 'ur' ? 'موجودہ تعداد' : '2026 Present'}
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-emerald-300">54+</span>
            <span className="text-[10px] text-emerald-100/70 block">{language === 'hi' ? 'बाघ (+575%)' : language === 'ur' ? 'شیر (+575%)' : 'Tigers (+575%)'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Eras, Categories & Search */}
      <div className="space-y-4 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
        {/* Era Segmented Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'hi' ? 'कालखंड / युग चुनें:' : language === 'ur' ? 'تاریخی دور منتخب کریں:' : 'Filter by Historical Era:'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: language === 'hi' ? 'सभी कालखंड (1953–2026)' : language === 'ur' ? 'تمام ادوار (1953–2026)' : 'All Eras (1953–2026)' },
              { id: 'foundation', label: language === 'hi' ? 'स्थापना युग (1950–1989)' : language === 'ur' ? 'ابتدائی دور (1950–1989)' : 'Foundations (1950–1989)' },
              { id: 'expansion', label: language === 'hi' ? 'प्रोजेक्ट टाइगर विस्तार (1990–2009)' : language === 'ur' ? 'پروجیکٹ ٹائیگر توسیع (1990–2009)' : 'Project Tiger Era (1990–2009)' },
              { id: 'revival', label: language === 'hi' ? 'वैज्ञानिक पुनरुद्धार (2010–2021)' : language === 'ur' ? 'سائنسی بحالی (2010–2021)' : 'Scientific Recovery (2010–2021)' },
              { id: 'modern', label: language === 'hi' ? 'स्मार्ट सर्विलांस युग (2022–वर्तमान)' : language === 'ur' ? 'جدید سمارٹ دور (2022–موجودہ)' : 'Smart Reserve Era (2022–Present)' },
            ].map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => setSelectedEra(era.id as MilestoneEra)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedEra === era.id
                    ? 'bg-[#0B3D2E] text-white shadow-sm font-bold scale-[1.02]'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {era.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter & Instant Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 pt-2 border-t border-stone-200/70">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-semibold text-stone-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {language === 'hi' ? 'श्रेणी:' : language === 'ur' ? 'کیٹیگری:' : 'Theme:'}
            </span>
            {[
              { id: 'all', label: language === 'hi' ? 'सभी' : language === 'ur' ? 'سب' : 'All Themes' },
              { id: 'legal', label: language === 'hi' ? 'कानून व दर्जा' : language === 'ur' ? 'قانون و درجہ' : 'Sanctuary & Law' },
              { id: 'census', label: language === 'hi' ? 'बाघ गणना' : language === 'ur' ? 'مردم شماری' : 'Tiger Census' },
              { id: 'tech', label: language === 'hi' ? 'स्मार्ट तकनीक' : language === 'ur' ? 'ٹیکنالوجی' : 'Smart Tech' },
              { id: 'transboundary', label: language === 'hi' ? 'सीमा-पार' : language === 'ur' ? 'سرحد پار' : 'Transboundary' },
              { id: 'community', label: language === 'hi' ? 'समुदाय' : language === 'ur' ? 'کمیونٹی' : 'Community' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as MilestoneCategory)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'वर्ष या कीवर्ड खोजें (उदा. 1990, e-Eye, चितवन)...'
                  : language === 'ur'
                  ? 'سال یا عنوان تلاش کریں (مثلاً 1990، کیمرہ، چتون)...'
                  : 'Search milestone, year, topic...'
              }
              className={`w-full bg-white border border-stone-300 rounded-xl py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:border-transparent ${
                isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredMilestones.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-500 space-y-2 border border-stone-200">
          <Info className="w-8 h-8 text-stone-400 mx-auto" />
          <p className="text-sm font-semibold">
            {language === 'hi' ? 'कोई मेल खाता मील का पत्थर नहीं मिला।' : language === 'ur' ? 'کوئی مماثل سنگ میل نہیں ملا۔' : 'No conservation milestones match your filter.'}
          </p>
          <button
            onClick={() => { setSelectedEra('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-xs text-[#F27D26] font-bold underline cursor-pointer"
          >
            {language === 'hi' ? 'फ़िल्टर साफ़ करें' : language === 'ur' ? 'فلٹرز صاف کریں' : 'Reset all filters'}
          </button>
        </div>
      ) : (
        <div className="relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:rtl:left-auto before:rtl:right-4 sm:before:rtl:right-6 before:w-1 before:bg-gradient-to-b before:from-[#0B3D2E] before:via-amber-500 before:to-emerald-700 space-y-6 pt-2">
          {filteredMilestones.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const categoryMeta = getCategoryBadge(item.category);
            const titleText = item.title[language] || item.title.en;
            const summaryText = item.summary[language] || item.summary.en;
            const detailsText = item.details[language] || item.details.en;
            const outcomes = item.keyOutcomes[language] || item.keyOutcomes.en;
            const locationText = item.locationRange ? (item.locationRange[language] || item.locationRange.en) : null;

            return (
              <div 
                key={item.id}
                id={`timeline-item-${item.id}`}
                className="relative flex items-start space-x-4 sm:space-x-6 rtl:space-x-reverse pl-2 sm:pl-3 rtl:pl-0 rtl:pr-2 sm:rtl:pr-3 group"
              >
                {/* Timeline Year Node */}
                <div className="relative z-10 flex flex-col items-center flex-shrink-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                    item.impactLevel === 'landmark'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-[#0B3D2E] text-white'
                  }`}>
                    {categoryMeta.icon}
                  </div>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded mt-1 border border-stone-200 shadow-2xs whitespace-nowrap">
                    {item.year}
                  </span>
                </div>

                {/* Milestone Content Card */}
                <div className={`flex-1 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'bg-stone-50/80 border-amber-500/60 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-white hover:bg-stone-50/60 border-stone-200 shadow-xs'
                }`}>
                  {/* Card Header Top */}
                  <div 
                    onClick={() => toggleExpand(item.id)}
                    className="p-4 sm:p-5 cursor-pointer select-none space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category Pill */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${categoryMeta.color}`}>
                          {categoryMeta.icon}
                          <span>{categoryMeta.label}</span>
                        </span>

                        {/* Impact Level Tag */}
                        {item.impactLevel === 'landmark' && (
                          <span className="bg-amber-500/20 text-amber-900 border border-amber-400 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>{language === 'hi' ? 'ऐतिहासिक मील का पत्थर' : language === 'ur' ? 'تاریخی سنگ میل' : 'Landmark Event'}</span>
                          </span>
                        )}

                        {/* Tiger Count progression if available */}
                        {item.tigerCount && (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                            🐅 {item.tigerCount} {language === 'hi' ? 'बाघ' : language === 'ur' ? 'شیر' : 'Tigers'}
                          </span>
                        )}
                      </div>

                      {/* Expand Toggle */}
                      <button
                        type="button"
                        aria-label="Toggle details"
                        className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Milestone Title & Summary */}
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#0B3D2E] transition-colors">
                        {titleText}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                        {summaryText}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Deep Dive Body */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-stone-200/80 bg-white space-y-4 animate-fade-in text-xs sm:text-sm text-stone-700">
                      {/* Deep Historical Context */}
                      <div className="space-y-1.5">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                          {language === 'hi' ? 'विस्तृत ऐतिहासिक संदर्भ' : language === 'ur' ? 'تفصیلی تاریخی پس منظر' : 'Detailed Historical Context'}
                        </span>
                        <p className="leading-relaxed text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                          {detailsText}
                        </p>
                      </div>

                      {/* Key Concrete Outcomes / Impact */}
                      {outcomes && outcomes.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                            {language === 'hi' ? 'प्रमुख संरक्षण उपलब्धियां व प्रभाव' : language === 'ur' ? 'اہم تحفظی نتائج و اثرات' : 'Key Conservation Outcomes & Impact'}
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {outcomes.map((outcome, oIdx) => (
                              <li key={oIdx} className="flex items-start space-x-2 rtl:space-x-reverse bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Location Range Tag if applicable */}
                      {locationText && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-stone-500 font-mono pt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>
                            <strong>{language === 'hi' ? 'प्रमुख कार्यक्षेत्र: ' : language === 'ur' ? 'مرکزی علاقہ: ' : 'Primary Geographic Focus: '}</strong>
                            {locationText}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline Footer Summary Quote */}
      <div className="bg-[#07271D] text-emerald-100 rounded-2xl p-5 sm:p-6 border border-emerald-600/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
          <h4 className="font-display font-bold text-amber-400 text-base">
            {language === 'hi'
              ? 'वाल्मीकि की कहानी: समर्पण और विज्ञान का संगम'
              : language === 'ur'
              ? 'والمیکی کی کہانی: محنت اور سائنس کا حسین امتزاج'
              : 'Valmiki’s Legacy: A Triumph of Science & Frontline Grit'}
          </h4>
          <p className="text-xs text-emerald-200/80 max-w-2xl leading-relaxed">
            {language === 'hi'
              ? 'यह ऐतिहासिक समयरेखा प्रमाणित करती है कि जब वैज्ञानिक योजना, स्थानीय थारू समुदाय और समर्पित वन रक्षक एक साथ आते हैं, तो विलुप्ति की कगार पर पहुंचे वन्यजीव भी फल-फूल सकते हैं।'
              : language === 'ur'
              ? 'یہ تاریخی سنگ میل ثابت کرتے ہیں کہ جب سائنسی منصوبہ بندی اور مقامی قبائل ایک ہو جائیں تو معدومی کے دہانے پر پہنچے شیر بھی دوبارہ آباد ہو سکتے ہیں۔'
              : 'This chronicle demonstrates how habitat stewardship, local Tharu indigenous partnerships, and persistent field enforcement transformed a critically stressed forest into a global conservation success story.'}
          </p>
        </div>

        <div className="flex-shrink-0">
          <div className="bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse shadow-md font-mono">
            <TreePine className="w-4 h-4 text-emerald-900" />
            <span>TAL Bihar Sector</span>
          </div>
        </div>
      </div>
    </div>
  );
};
