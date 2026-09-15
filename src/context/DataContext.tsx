import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TigerProfile,
  NewsArticle,
  NewsSource,
  WildlifeSpecies,
  ConservationAlert,
  WildlifeSighting,
  ResearchReport,
  PublicationStatus,
  EducationItem,
  EcotourismZone,
  CommunityInitiative,
  GalleryItem,
  VisitorLocation,
  VerifiedStatistic,
  VolunteerSubmission,
  SupporterSubmission,
  AppIntegrationSettings,
  ChatbotAdminSettings,
  VTRWeatherResponse,
  WeatherAdminSettings,
  TigerPledgeCertificate,
  CertificateAdminSettings,
  AdminUser,
  AdminAuditLogEntry,
  VTWAdminSettings,
  GrassrootsProtectorStory,
  EditorialStatus,
  FeedbackSubmission,
  FeedbackCategory,
  PledgeTickerEntry,
  CreatorProfileData,
  VTWMember
} from '../types';
import {
  signInWithGoogleAdmin,
  signOutAdmin,
  getCachedAccessToken,
  getCachedSessionToken,
  verifyCurrentAdminSession,
  handleRedirectAuthResult
} from '../lib/googleAuth';
import { apiUrl } from '../lib/apiConfig';
import {
  INITIAL_TIGERS,
  INITIAL_NEWS,
  INITIAL_NEWS_SOURCES,
  INITIAL_WILDLIFE,
  INITIAL_ALERTS,
  INITIAL_RESEARCH,
  INITIAL_EDUCATION,
  INITIAL_ECOTOURISM,
  INITIAL_COMMUNITY,
  INITIAL_SIGHTINGS,
  INITIAL_GALLERY,
  INITIAL_MAP_LOCATIONS
} from '../data/initialData';
import { INITIAL_PROTECTORS } from '../data/initialProtectors';
import { INITIAL_PLEDGE_TICKER, INITIAL_FEEDBACK } from '../data/initialFeedbackAndTicker';
import { getUniversalVTRWeather } from '../services/clientWeatherService';
import { VERIFIED_STATISTICS_REGISTRY } from '../data/tigerWorldwideData';
import { syncNewsFeeds } from '../utils/newsFeedService';

interface DataContextType {
  // Navigation & UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  openSearchModal: (initialQuery?: string) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  selectedTiger: TigerProfile | null;
  setSelectedTiger: (tiger: TigerProfile | null) => void;
  selectedNews: NewsArticle | null;
  setSelectedNews: (news: NewsArticle | null) => void;

  // PWA & Network
  isOnline: boolean;
  canInstallPwa: boolean;
  installPwa: () => Promise<void>;

  // Data Collections
  tigers: TigerProfile[];
  news: NewsArticle[];
  newsSources: NewsSource[];
  wildlife: WildlifeSpecies[];
  alerts: ConservationAlert[];
  sightings: WildlifeSighting[];
  research: ResearchReport[];
  researchReports?: ResearchReport[];
  education: EducationItem[];
  ecotourism: EcotourismZone[];
  community: CommunityInitiative[];
  gallery: GalleryItem[];
  mapLocations: VisitorLocation[];
  verifiedStats: VerifiedStatistic[];

  // Public Actions
  submitSighting: (sighting: any) => void;
  addSighting?: (sighting: any) => void;

  // Admin Features & Secure Google OAuth
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminSessionToken: string | null;
  loginWithGoogleAdmin: () => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  adminLogin: (pass: string) => boolean;
  loginAdmin: (pass: string) => boolean;
  adminLogout: () => void;
  adminAuditLogs: AdminAuditLogEntry[];
  refreshAuditLogs: () => Promise<void>;
  vtwAdminSettings: VTWAdminSettings | null;
  updateVTWAdminSettings: (settings: Partial<VTWAdminSettings>) => Promise<void>;

  // Tiger Operations & Verification
  addTiger: (tiger: Omit<TigerProfile, 'id'>) => void;
  updateTiger: (tiger: TigerProfile) => void;
  deleteTiger: (id: string) => void;
  verifyTiger: (id: string, officialSource?: string, customDate?: string, isLive?: boolean) => void;
  setTigerVerificationStatus: (id: string, status: 'verified' | 'reported' | 'estimated' | 'unverified', isLive?: boolean, sources?: string, date?: string) => void;
  toggleTigerLive: (id: string) => void;
  updateTigerVerification: (id: string, updates: Partial<TigerProfile>) => void;
  batchVerifyTigers: (ids: string[], officialSource?: string) => void;

  // News Operations & Verification
  addNews: (article: Omit<NewsArticle, 'id'>) => void;
  updateNews: (article: NewsArticle) => void;
  deleteNews: (id: string) => void;
  verifyNews: (id: string, status?: any, officialSourceRef?: string, customDate?: string, isLive?: boolean) => void;
  toggleNewsLive: (id: string) => void;
  updateNewsVerification: (id: string, updates: Partial<NewsArticle>) => void;
  batchVerifyNews: (ids: string[], status: any, officialSourceRef?: string) => void;
  pinNews: (id: string) => void;
  toggleNewsFeatured: (id: string) => void;
  setNewsStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => void;

  // News Automation & Sources
  isAutoUpdateEnabled: boolean;
  lastNewsUpdate: string;
  toggleAutoUpdate: () => void;
  refreshNews: () => Promise<{ addedCount: number; message: string }>;
  toggleNewsSource: (id: string) => void;
  addNewsSource: (source: Omit<NewsSource, 'id' | 'lastChecked' | 'checkStatus'>) => void;
  syncNewsSources: () => Promise<{ addedCount: number; message: string }>;

  // Research Management
  addResearch: (paper: Omit<ResearchReport, 'id'>) => void;
  updateResearch: (paper: ResearchReport) => void;
  deleteResearch: (id: string) => void;
  toggleResearchStatus: (id: string) => void;
  setResearchStatus: (id: string, status: PublicationStatus) => void;
  verifyAndPublishResearch: (id: string, originalSourceLink?: string, verificationNotes?: string) => void;
  unpublishResearch: (id: string) => void;
  rejectResearch: (id: string, reason?: string) => void;

  // Alerts Operations & Verification
  addAlert: (alert: Omit<ConservationAlert, 'id'>) => void;
  toggleAlert: (id: string) => void;
  toggleAlertStatus: (id: string) => void;
  deleteAlert: (id: string) => void;
  verifyAlert: (id: string, verifiedSource?: string, customDate?: string) => void;
  updateAlertVerification: (id: string, updates: Partial<ConservationAlert>) => void;

  // Map Locations Management
  addMapLocation: (loc: Omit<VisitorLocation, 'id'>) => void;
  updateMapLocation: (loc: VisitorLocation) => void;
  deleteMapLocation: (id: string) => void;
  toggleMapLocationLive: (id: string) => void;
  resetMapLocations: () => void;

  // Verified Statistics Registry Management
  updateVerifiedStat: (id: string, updates: Partial<VerifiedStatistic>) => void;
  resetVerifiedStats: () => void;

  // Sightings Operations & Verification
  approveSighting: (id: string) => void;
  flagSighting: (id: string) => void;
  deleteSighting: (id: string) => void;
  updateSightingStatus: (id: string, status: 'pending' | 'verified' | 'flagged' | 'under_review' | 'reported', officialNote?: string, customDate?: string) => void;
  verifySighting: (id: string, officialNote?: string, customDate?: string) => void;
  toggleSightingLive: (id: string) => void;

  // Volunteer & Supporter Submissions
  volunteerSubmissions: VolunteerSubmission[];
  supporterSubmissions: SupporterSubmission[];
  addVolunteerSubmission: (data: Omit<VolunteerSubmission, 'id' | 'submittedAt' | 'status'>) => { id: string; success: boolean };
  addSupporterSubmission: (data: Omit<SupporterSubmission, 'id' | 'submittedAt' | 'status'>) => { id: string; success: boolean };
  updateVolunteerSubmissionStatus: (id: string, status: VolunteerSubmission['status'], notes?: string) => void;
  updateSupporterSubmissionStatus: (id: string, status: SupporterSubmission['status'], notes?: string) => void;
  deleteVolunteerSubmission: (id: string) => void;
  deleteSupporterSubmission: (id: string) => void;

  // Integration Settings
  integrationSettings: AppIntegrationSettings;
  updateIntegrationSettings: (settings: Partial<AppIntegrationSettings>) => void;

  // Chatbot Settings
  chatbotSettings: ChatbotAdminSettings;
  updateChatbotSettings: (settings: Partial<ChatbotAdminSettings>) => void;

  // Modals for Volunteer, Supporter, and Chatbot
  isVolunteerModalOpen: boolean;
  openVolunteerModal: () => void;
  closeVolunteerModal: () => void;
  isSupporterModalOpen: boolean;
  openSupporterModal: () => void;
  closeSupporterModal: () => void;
  isChatbotOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  isUpdateModalOpen: boolean;
  openUpdateModal: () => void;
  closeUpdateModal: () => void;

  // VTR Real-time Weather
  weatherData: VTRWeatherResponse | null;
  isWeatherLoading: boolean;
  weatherError: string | null;
  selectedWeatherZone: string;
  setSelectedWeatherZone: (zoneId: string) => void;
  refreshWeather: (force?: boolean) => Promise<void>;
  weatherSettings: WeatherAdminSettings;
  updateWeatherSettings: (settings: Partial<WeatherAdminSettings>) => void;

  // Tiger Protection Pledge Certificates
  certificates: TigerPledgeCertificate[];
  certificateSettings: CertificateAdminSettings;
  isCertificateGenerating: boolean;
  lastIssuedCertificate: TigerPledgeCertificate | null;
  clearLastIssuedCertificate: () => void;
  generatePledgeCertificate: (input: {
    fullName: string;
    cityAndState: string;
    country?: string;
    email?: string;
    organization?: string;
    language?: 'en' | 'hi' | 'ur';
    pledgeId?: string;
    consentPublicTicker?: boolean;
  }) => Promise<TigerPledgeCertificate & { alreadyIssued?: boolean }>;
  revokePledgeCertificate: (certNumber: string, reason: string) => Promise<{ success: boolean; message: string }>;
  restorePledgeCertificate: (certNumber: string) => Promise<{ success: boolean; message: string }>;
  updateCertificateSettings: (settings: Partial<CertificateAdminSettings>) => Promise<void>;
  refreshCertificates: () => Promise<void>;

  // Grassroots Protectors
  grassrootsProtectors: GrassrootsProtectorStory[];
  addGrassrootsProtector: (story: Omit<GrassrootsProtectorStory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGrassrootsProtector: (id: string, updates: Partial<GrassrootsProtectorStory>) => void;
  deleteGrassrootsProtector: (id: string) => void;
  setGrassrootsEditorialStatus: (id: string, status: EditorialStatus, notes?: string) => void;

  // Feedback System
  feedbackSubmissions: FeedbackSubmission[];
  submitFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'submittedAt' | 'status'>) => { success: boolean; message: string };
  updateFeedbackStatus: (id: string, status: 'new' | 'reviewed' | 'resolved' | 'archived') => void;
  deleteFeedback: (id: string) => void;

  // Pledge Ticker
  pledgeTickerEntries: PledgeTickerEntry[];
  addPledgeTickerEntry: (entry: Omit<PledgeTickerEntry, 'id' | 'pledgedAt'>) => void;
  togglePledgeTickerStatus: (id: string) => void;
  deletePledgeTickerEntry: (id: string) => void;
  isTickerEnabled: boolean;
  setIsTickerEnabled: (enabled: boolean) => void;

  // Aggregate Engagement Voting
  updateContentVotes: (contentType: 'news' | 'research' | 'protector', id: string, likes: number, dislikes: number) => void;

  // Creator Profile & VTW Officials / Members
  creatorProfile: CreatorProfileData;
  vtwMembers: VTWMember[];
  refreshCreatorProfile: () => Promise<void>;
  updateCreatorProfileData: (data: Partial<CreatorProfileData>) => Promise<boolean>;
  uploadCreatorPhotograph: (dataUrl: string) => Promise<{ success: boolean; photoUrl?: string; error?: string }>;
  removeCreatorPhotograph: () => Promise<boolean>;
  refreshVTWMembers: (includeInactive?: boolean) => Promise<void>;
  addVTWMemberRecord: (member: Omit<VTWMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateVTWMemberRecord: (id: string, member: Partial<VTWMember>) => Promise<boolean>;
  deleteVTWMemberRecord: (id: string) => Promise<boolean>;
  uploadVTWMemberPhotograph: (id: string, dataUrl: string) => Promise<{ success: boolean; photoUrl?: string; error?: string }>;

  // Backup & Reset
  exportDataBackup: () => string;
  importDataBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TIGERS: 'vtw_tigers_v1',
  NEWS: 'vtw_news_v1',
  SOURCES: 'vtw_sources_v1',
  ALERTS: 'vtw_alerts_v1',
  SIGHTINGS: 'vtw_sightings_v1',
  MAP_LOCATIONS: 'vtw_map_locations_v1',
  VERIFIED_STATS: 'vtw_verified_stats_v1',
  RESEARCH: 'vtw_research_v5_genuine',
  AUTO_UPDATE: 'vtw_auto_update_v2',
  LAST_NEWS_UPDATE: 'vtw_last_news_update_v2',
  VOLUNTEERS: 'vtw_volunteers_v1',
  SUPPORTERS: 'vtw_supporters_v1',
  INTEGRATION_SETTINGS: 'vtw_integration_settings_v1',
  CHATBOT_SETTINGS: 'vtw_chatbot_settings_v1',
  WEATHER_SETTINGS: 'vtw_weather_settings_v1',
  WEATHER_CACHE: 'vtw_weather_cache_v1',
  WEATHER_ZONE: 'vtw_weather_zone_v1',
  CERTIFICATES: 'vtw_certificates_v1',
  CERTIFICATE_SETTINGS: 'vtw_certificate_settings_v1',
  CERT_SEQUENCE: 'vtw_cert_seq_v2',
  LAST_ISSUED_CERT: 'vtw_last_issued_cert_v2',
  PROTECTORS: 'vtw_protectors_v1',
  FEEDBACK: 'vtw_feedback_v1',
  PLEDGE_TICKER: 'vtw_pledge_ticker_v1',
  TICKER_ENABLED: 'vtw_ticker_enabled_v1'
};

export const DEFAULT_CERTIFICATE_SETTINGS: CertificateAdminSettings = {
  numberingPrefix: 'VTW',
  numberingYearFormat: 'YYYY',
  nextSequence: 1,
  customLogoUrl: '/vtw-logo.png',
  customSignatureUrl: '/assets/president-signature.png',
  signatureName: 'Nazish Asad',
  signatureTitle: 'President',
  signatureOrg: 'Valmiki Tiger Watch',
  designTheme: 'royal-emerald-gold',
  borderStyle: 'ornate-double',
  headerText: {
    en: 'VALMIKI TIGER WATCH',
    hi: 'वाल्मीकि टाइगर वॉच',
    ur: 'والمیکی ٹائیگر واچ'
  },
  titleText: {
    en: 'CERTIFICATE OF TIGER PROTECTION PLEDGE',
    hi: 'बाघ संरक्षण संकल्प प्रमाण पत्र',
    ur: 'تحفظِ شیر عہد نامہ سرٹیفکیٹ'
  },
  presentedToText: {
    en: 'This certificate is proudly presented to',
    hi: 'यह प्रमाण पत्र गर्व के साथ प्रदान किया जाता है:',
    ur: 'یہ سرٹیفکیٹ فخر کے ساتھ پیش کیا جاتا ہے بحق:'
  },
  pledgeBodyText: {
    en: 'For voluntarily pledging to support tiger conservation, protect wildlife, respect forest laws, and contribute to the protection of tigers and their natural habitat in Valmiki Tiger Reserve and across India.',
    hi: 'बाघ संरक्षण का स्वेच्छा से समर्थन करने, वन्यजीवों की रक्षा करने, वन नियमों का सम्मान करने और वाल्मीकि टाइगर रिज़र्व व पूरे भारत में बाघों तथा उनके प्राकृतिक आवास के संरक्षण में योगदान देने के संकल्प हेतु।',
    ur: 'شیروں کے تحفظ کی رضاکارانہ حمایت، جنگلی حیات کی بقا، جنگل کے قوانین کے احترام اور والمیکی ٹائیگر ریزرو و پورے بھارت میں شیروں اور ان کے قدرتی مسکن کے تحفظ میں اپنا کردار ادا کرنے کا پختہ عہد کرنے پر۔'
  },
  disclaimerText: {
    en: 'This is a voluntary conservation pledge certificate issued by Valmiki Tiger Watch to recognize individual community commitment to wildlife protection. It is not an official government certificate, employment credential, or formal academic qualification.',
    hi: 'यह वाल्मीकि टाइगर वॉच द्वारा वन्यजीव संरक्षण के प्रति व्यक्तिगत सामुदायिक प्रतिबद्धता को सम्मानित करने हेतु जारी एक स्वैच्छिक संकल्प प्रमाण पत्र है। यह कोई सरकारी दस्तावेज, रोजगार प्रमाण पत्र या शैक्षणिक उपाधि नहीं है।',
    ur: 'یہ والمیکی ٹائیگر واچ کی جانب سے جنگلی حیات کے تحفظ کے لیے انفرادی عزم کو سراہنے کے لیے جاری کردہ ایک رضاکارانہ عہد نامہ سرٹیفکیٹ ہے۔ یہ کوئی سرکاری سند، ملازمت کا پروانہ یا تعلیمی ڈگری نہیں ہے۔'
  },
  lastUpdated: new Date().toISOString()
};

export const DEFAULT_WEATHER_SETTINGS: WeatherAdminSettings = {
  provider: 'open-meteo',
  defaultZoneId: 'valmikinagar',
  refreshIntervalMinutes: 30,
  enableWeatherAlerts: true,
  enableWeatherCard: true,
  dataSourceAttribution: 'Open-Meteo Weather API & WMO Global Observation System',
  lastUpdated: new Date().toISOString()
};

export const DEFAULT_INTEGRATION_SETTINGS: AppIntegrationSettings = {
  volunteerGoogleFormUrl: '',
  supporterGoogleFormUrl: '',
  contactEmail: '',
  isVolunteerRegistrationEnabled: true,
  isSupporterRegistrationEnabled: true,
  submissionMode: 'in_app_with_sync',
  volunteerConfirmationMessage: 'Thank you for volunteering with Valmiki Tiger Watch! Your application has been received and will be reviewed by our coordination team.',
  supporterConfirmationMessage: 'Thank you for supporting Valmiki Tiger Watch! Your pledge has been recorded to empower tiger and habitat conservation in VTR.',
  lastUpdated: new Date().toISOString()
};

export const DEFAULT_CHATBOT_SETTINGS: ChatbotAdminSettings = {
  isEnabled: true,
  modelName: 'gemini-3.8-flash',
  systemPrompt: '',
  welcomeMessageEn: 'Welcome to Valmiki Tiger Watch! I am your AI conservation assistant. Ask me anything about Valmiki Tiger Reserve, tigers, wildlife, safaris, research, or volunteer opportunities.',
  welcomeMessageHi: 'वाल्मीकि टाइगर वॉच में आपका स्वागत है! मैं आपका AI वन्यजीव सहायक हूँ। वाल्मीकि टाइगर रिजर्व, बाघों, सफारी या स्वयंसेवक अवसरों के बारे में पूछें।',
  welcomeMessageUr: 'والمیکی ٹائیگر واچ میں خوش آمدید! میں آپ کا AI معاون ہوں۔ والمیکی ٹائیگر ریزرو، جنگلی حیات، اور تحفظ کے منصوبوں کے بارے میں کوئی بھی سوال پوچھیں۔',
  suggestedQuestions: [
    'What is Valmiki Tiger Reserve?',
    'Where is Valmiki Tiger Reserve located?',
    'What animals are found in VTR?',
    'How can I visit VTR?',
    'What is the best time to visit?',
    'How can I become a volunteer?',
    'How can I support tiger conservation?',
    'Where can I find research publications?',
    'What are the latest tiger conservation news updates?'
  ],
  enableSourceAttribution: true,
  temperature: 0.3,
  lastUpdated: new Date().toISOString()
};

const INITIAL_VOLUNTEERS: VolunteerSubmission[] = [
  {
    id: 'vol-101',
    fullName: 'Rahul Anand',
    email: 'rahul.anand.wildlife@example.com',
    mobile: '+91 94310 28471',
    cityDistrict: 'Bettiah',
    state: 'Bihar',
    country: 'India',
    preferredLanguage: 'Hindi / English',
    areasOfInterest: ['Tiger Conservation', 'Community Outreach', 'Research & Documentation'],
    relevantSkills: 'M.Sc. Wildlife Science student, proficient in QGIS and camera trap placement.',
    availability: 'Weekends and winter vacation (Nov-Feb)',
    whyVolunteer: 'Passionate about Bihar’s only tiger reserve and eager to support community tiger monitoring.',
    consentContact: true,
    submittedAt: '2026-03-01T10:30:00.000Z',
    status: 'reviewed',
    notes: 'Strong GIS background. Recommended for camera-trap data logging in Valmikinagar Range.'
  },
  {
    id: 'vol-102',
    fullName: 'Priya Sharma',
    email: 'priya.sharma.conservation@example.com',
    mobile: '+91 98352 19284',
    cityDistrict: 'Patna',
    state: 'Bihar',
    country: 'India',
    preferredLanguage: 'English',
    areasOfInterest: ['Environmental Education', 'Photography / Media', 'Social Media / Digital Support'],
    relevantSkills: 'Content creator, wildlife photographer with 400mm telephoto lens.',
    availability: 'Remote digital support + monthly field visits',
    whyVolunteer: 'To create awareness videos on Tharu tribal coexistence and tiger protection in northern Bihar.',
    consentContact: true,
    submittedAt: '2026-03-04T15:15:00.000Z',
    status: 'pending',
    notes: 'Offered to design high-resolution school education posters.'
  }
];

const INITIAL_SUPPORTERS: SupporterSubmission[] = [
  {
    id: 'sup-201',
    fullName: 'Dr. Amitav Sen',
    email: 'amitav.sen.eco@example.com',
    mobile: '+91 97714 82910',
    cityDistrict: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    preferredLanguage: 'English',
    supportOptions: ['Research Support', 'Conservation Awareness'],
    messageComments: 'Interested in supporting transboundary corridor studies between VTR and Nepal Chitwan NP.',
    consentContact: true,
    submittedAt: '2026-02-28T12:00:00.000Z',
    status: 'acknowledged',
    notes: 'Retired ecologist willing to provide advisory input on grassland management.'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation - default to pledge so user immediately sees the updated Pledge Certificate in Preview mode
  const [activeTab, setActiveTabState] = useState<string>('pledge');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [selectedTiger, setSelectedTiger] = useState<TigerProfile | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // Modals for Volunteer, Supporter, and Chatbot
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState<boolean>(false);
  const [isSupporterModalOpen, setIsSupporterModalOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const openVolunteerModal = () => setIsVolunteerModalOpen(true);
  const closeVolunteerModal = () => setIsVolunteerModalOpen(false);
  const openSupporterModal = () => setIsSupporterModalOpen(true);
  const closeSupporterModal = () => setIsSupporterModalOpen(false);
  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);
  const toggleChatbot = () => setIsChatbotOpen((prev) => !prev);
  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  const openMobileNav = () => setIsMobileNavOpen(true);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  const openSearchModal = (initialQuery?: string) => {
    if (typeof initialQuery === 'string') {
      setSearchQuery(initialQuery);
    }
    setIsMobileNavOpen(false);
    setIsSearchOpen(true);
  };

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // PWA Install Event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  // Admin Session & Google Workspace Integration
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminSessionToken, setAdminSessionToken] = useState<string | null>(null);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLogEntry[]>([]);
  const [vtwAdminSettings, setVtwAdminSettings] = useState<VTWAdminSettings | null>(null);

  // Creator Profile & VTW Officials / Members
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfileData>({
    fullName: 'Nazish Asad',
    title: 'Creator & Lead Systems Architect',
    photoUrl: '', // Default empty: displays dignified placeholder until uploaded
    bio: {
      en: "Nazish Asad is an environmental activist and wildlife conservation advocate dedicated to raising awareness about tiger protection, biodiversity, habitat conservation, and the importance of preserving India's natural heritage.\n\nThrough Valmiki Tiger Watch, he aims to promote independent conservation awareness, responsible eco-tourism, wildlife education, and public participation in protecting tigers and their habitats.\n\nHis work focuses on connecting people with nature, encouraging conservation responsibility, and supporting greater awareness of the challenges facing wildlife and forest ecosystems.",
      hi: "नाज़िश असद एक पर्यावरण कार्यकर्ता और वन्यजीव संरक्षण समर्थक हैं, जो बाघ संरक्षण, जैव विविधता, पर्यावास संरक्षण और भारत की प्राकृतिक विरासत के संरक्षण के प्रति जागरूकता बढ़ाने के लिए समर्पित हैं।\n\nवाल्मीकि टाइगर वॉच के माध्यम से, उनका उद्देश्य स्वतंत्र संरक्षण जागरूकता, जिम्मेदार पर्यावरण-पर्यटन, वन्यजीव शिक्षा, और बाघों तथा उनके पर्यावासों की रक्षा में जनभागीदारी को बढ़ावा देना है।\n\nउनका कार्य लोगों को प्रकृति से जोड़ने, संरक्षण की जिम्मेदारी को प्रोत्साहित करने और वन्यजीवों तथा वन पारिस्थितिक तंत्र के समक्ष आने वाली चुनौतियों के प्रति व्यापक जागरूकता का समर्थन करने पर केंद्रित है।",
      ur: "نازش اسد ایک ماحولیاتی کارکن اور جنگلی حیات کے تحفظ کے حامی ہیں جو شیروں کے تحفظ، حیاتیاتی تنوع، مسکن کے تحفظ اور بھارت کے قدرتی ورثے کو محفوظ رکھنے کے بارے میں شعور بیدار کرنے کے لیے وقف ہیں۔\n\nوالمیکی ٹائیگر واچ کے ذریعے، ان کا مقصد آزادانہ تحفظ کے شعور، ذمہ دارانہ ایکو ٹورازم، جنگلی حیات کی تعلیم، اور شیروں اور ان کے مسکن کے تحفظ میں عوامی شرکت کو فروغ دینا ہے۔\n\nان کا کام لوگوں کو فطرت سے جوڑنے، تحفظ کی ذمہ داری کی حوصلہ افزائی کرنے، और جنگلی حیات اور جنگلاتی ماحولیاتی نظام کو درپیش چیلنجوں کے بارے میں زیادہ سے زیادہ آگاہی کی حمایت کرنے پر مرکوز ہے۔"
    },
    lastUpdated: new Date().toISOString()
  });
  const [vtwMembers, setVtwMembers] = useState<VTWMember[]>([]);

  // State with LocalStorage Caching
  const [tigers, setTigers] = useState<TigerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIGERS);
      return saved ? JSON.parse(saved) : INITIAL_TIGERS;
    } catch {
      return INITIAL_TIGERS;
    }
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [newsSources, setNewsSources] = useState<NewsSource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOURCES);
      return saved ? JSON.parse(saved) : INITIAL_NEWS_SOURCES;
    } catch {
      return INITIAL_NEWS_SOURCES;
    }
  });

  const [alerts, setAlerts] = useState<ConservationAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [sightings, setSightings] = useState<WildlifeSighting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIGHTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SIGHTINGS;
    } catch {
      return INITIAL_SIGHTINGS;
    }
  });

  const [mapLocations, setMapLocations] = useState<VisitorLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MAP_LOCATIONS);
      return saved ? JSON.parse(saved) : INITIAL_MAP_LOCATIONS;
    } catch {
      return INITIAL_MAP_LOCATIONS;
    }
  });

  const [verifiedStats, setVerifiedStats] = useState<VerifiedStatistic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VERIFIED_STATS);
      return saved ? JSON.parse(saved) : VERIFIED_STATISTICS_REGISTRY;
    } catch {
      return VERIFIED_STATISTICS_REGISTRY;
    }
  });

  // Static datasets
  const [wildlife] = useState<WildlifeSpecies[]>(INITIAL_WILDLIFE);
  const [research, setResearch] = useState<ResearchReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESEARCH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any fabricated or invented papers that might linger in storage
          const clean = parsed.filter(p => {
            if (!p || typeof p !== 'object') return false;
            // Purge known fabricated IDs or fake DOIs
            const isFabricatedId = ['res-001', 'res-002', 'res-003', 'res-004', 'res-005', 'res-006', 'res-007', 'res-008', 'res-009', 'res-010', 'res-011'].includes(p.id);
            const hasFakeDoi = p.doi && (
              p.doi.includes('10.26515') ||
              p.doi.includes('10.1016/j.gecco') ||
              p.doi.includes('10.11609/jott') ||
              p.doi.includes('10.1002/ece3') ||
              p.doi.includes('10.1080/14888386') ||
              p.doi.includes('10.18520/cs') ||
              p.doi.includes('10.1038/s41437')
            );
            return !isFabricatedId && !hasFakeDoi;
          });

          // Ensure all initial genuine research items are included
          const cleanIds = new Set(clean.map((c: any) => c.id));
          const completeList = [...clean];
          for (const init of INITIAL_RESEARCH) {
            if (!cleanIds.has(init.id)) {
              completeList.push(init);
            }
          }
          return completeList.length > 0 ? completeList : INITIAL_RESEARCH;
        }
      }
      return INITIAL_RESEARCH;
    } catch {
      return INITIAL_RESEARCH;
    }
  });
  const [education] = useState<EducationItem[]>(INITIAL_EDUCATION);
  const [ecotourism] = useState<EcotourismZone[]>(INITIAL_ECOTOURISM);
  const [community] = useState<CommunityInitiative[]>(INITIAL_COMMUNITY);
  const [gallery] = useState<GalleryItem[]>(INITIAL_GALLERY);

  // Auto update settings
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTO_UPDATE);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [lastNewsUpdate, setLastNewsUpdate] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_NEWS_UPDATE) || new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  });

  // Volunteer & Supporter Submissions
  const [volunteerSubmissions, setVolunteerSubmissions] = useState<VolunteerSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
      return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
    } catch {
      return INITIAL_VOLUNTEERS;
    }
  });

  const [supporterSubmissions, setSupporterSubmissions] = useState<SupporterSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPORTERS);
      return saved ? JSON.parse(saved) : INITIAL_SUPPORTERS;
    } catch {
      return INITIAL_SUPPORTERS;
    }
  });

  // App Integration Settings (Google Forms, Registration Toggles)
  const [integrationSettings, setIntegrationSettings] = useState<AppIntegrationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTEGRATION_SETTINGS);
      return saved ? { ...DEFAULT_INTEGRATION_SETTINGS, ...JSON.parse(saved) } : DEFAULT_INTEGRATION_SETTINGS;
    } catch {
      return DEFAULT_INTEGRATION_SETTINGS;
    }
  });

  // Chatbot Admin Settings
  const [chatbotSettings, setChatbotSettings] = useState<ChatbotAdminSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATBOT_SETTINGS);
      return saved ? { ...DEFAULT_CHATBOT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_CHATBOT_SETTINGS;
    } catch {
      return DEFAULT_CHATBOT_SETTINGS;
    }
  });

  // Weather Admin Settings & State
  const [weatherSettings, setWeatherSettings] = useState<WeatherAdminSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEATHER_SETTINGS);
      return saved ? { ...DEFAULT_WEATHER_SETTINGS, ...JSON.parse(saved) } : DEFAULT_WEATHER_SETTINGS;
    } catch {
      return DEFAULT_WEATHER_SETTINGS;
    }
  });

  const [selectedWeatherZone, setSelectedWeatherZoneState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEATHER_ZONE);
      return saved || 'valmikinagar';
    } catch {
      return 'valmikinagar';
    }
  });

  const [weatherData, setWeatherData] = useState<VTRWeatherResponse | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEATHER_CACHE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Certificate Registry & Settings State
  const [certificates, setCertificates] = useState<TigerPledgeCertificate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastIssuedCertificate, setLastIssuedCertificate] = useState<TigerPledgeCertificate | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_ISSUED_CERT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const clearLastIssuedCertificate = () => {
    setLastIssuedCertificate(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.LAST_ISSUED_CERT);
    } catch (e) {}
  };

  const [certificateSettings, setCertificateSettings] = useState<CertificateAdminSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATE_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.customSignatureUrl || parsed.customSignatureUrl.trim() === '') {
          parsed.customSignatureUrl = '/assets/president-signature.png';
        }
        return { ...DEFAULT_CERTIFICATE_SETTINGS, ...parsed };
      }
      return DEFAULT_CERTIFICATE_SETTINGS;
    } catch {
      return DEFAULT_CERTIFICATE_SETTINGS;
    }
  });

  const [isCertificateGenerating, setIsCertificateGenerating] = useState<boolean>(false);

  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const setSelectedWeatherZone = (zoneId: string) => {
    setSelectedWeatherZoneState(zoneId);
    try {
      localStorage.setItem(STORAGE_KEYS.WEATHER_ZONE, zoneId);
    } catch (e) {
      console.warn('Failed saving selected weather zone:', e);
    }
  };

  const updateWeatherSettings = (newSettings: Partial<WeatherAdminSettings>) => {
    setWeatherSettings(prev => {
      const updated = { ...prev, ...newSettings, lastUpdated: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEYS.WEATHER_SETTINGS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed saving weather settings:', e);
      }
      return updated;
    });
  };

  // Grassroots Protectors State
  const [grassrootsProtectors, setGrassrootsProtectors] = useState<GrassrootsProtectorStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROTECTORS);
      return saved ? JSON.parse(saved) : INITIAL_PROTECTORS;
    } catch {
      return INITIAL_PROTECTORS;
    }
  });

  const addGrassrootsProtector = (story: Omit<GrassrootsProtectorStory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStory: GrassrootsProtectorStory = {
      ...story,
      id: `protector-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: story.likes || 0,
      dislikes: story.dislikes || 0
    };
    setGrassrootsProtectors(prev => {
      const next = [newStory, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.PROTECTORS, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const updateGrassrootsProtector = (id: string, updates: Partial<GrassrootsProtectorStory>) => {
    setGrassrootsProtectors(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
      try { localStorage.setItem(STORAGE_KEYS.PROTECTORS, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const deleteGrassrootsProtector = (id: string) => {
    setGrassrootsProtectors(prev => {
      const next = prev.filter(p => p.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.PROTECTORS, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const setGrassrootsEditorialStatus = (id: string, status: EditorialStatus, notes?: string) => {
    setGrassrootsProtectors(prev => {
      const next = prev.map(p => {
        if (p.id !== id) return p;
        const now = new Date().toISOString();
        const isVerifying = status === 'verified' || status === 'published';
        return {
          ...p,
          verificationStatus: status,
          verifiedDate: isVerifying ? (p.verifiedDate || now) : p.verifiedDate,
          verifiedBy: isVerifying ? (p.verifiedBy || adminUser?.name || 'VTW Editorial Board') : p.verifiedBy,
          verificationNotes: notes !== undefined ? notes : p.verificationNotes,
          updatedAt: now
        };
      });
      try { localStorage.setItem(STORAGE_KEYS.PROTECTORS, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Feedback Submissions State
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
    } catch {
      return INITIAL_FEEDBACK;
    }
  });

  const submitFeedback = (feedback: Omit<FeedbackSubmission, 'id' | 'submittedAt' | 'status'>) => {
    if (!feedback.message || feedback.message.trim().length < 5) {
      return { success: false, message: 'Please provide a message with at least 5 characters.' };
    }
    const newEntry: FeedbackSubmission = {
      ...feedback,
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'new',
      submittedAt: new Date().toISOString()
    };
    setFeedbackSubmissions(prev => {
      const next = [newEntry, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(next)); } catch {}
      return next;
    });
    return { success: true, message: 'Thank you! Your feedback has been securely submitted to the Valmiki Tiger Watch team.' };
  };

  const updateFeedbackStatus = (id: string, status: 'new' | 'reviewed' | 'resolved' | 'archived') => {
    setFeedbackSubmissions(prev => {
      const next = prev.map(f => f.id === id ? { ...f, status } : f);
      try { localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const deleteFeedback = (id: string) => {
    setFeedbackSubmissions(prev => {
      const next = prev.filter(f => f.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Pledge Ticker State
  const [pledgeTickerEntries, setPledgeTickerEntries] = useState<PledgeTickerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLEDGE_TICKER);
      return saved ? JSON.parse(saved) : INITIAL_PLEDGE_TICKER;
    } catch {
      return INITIAL_PLEDGE_TICKER;
    }
  });

  const [isTickerEnabled, setIsTickerEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKER_ENABLED);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const setIsTickerEnabled = (enabled: boolean) => {
    setIsTickerEnabledState(enabled);
    try { localStorage.setItem(STORAGE_KEYS.TICKER_ENABLED, JSON.stringify(enabled)); } catch {}
  };

  const addPledgeTickerEntry = (entry: Omit<PledgeTickerEntry, 'id' | 'pledgedAt'>) => {
    const newEntry: PledgeTickerEntry = {
      ...entry,
      id: `ticker-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pledgedAt: new Date().toISOString()
    };
    setPledgeTickerEntries(prev => {
      const next = [newEntry, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.PLEDGE_TICKER, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const togglePledgeTickerStatus = (id: string) => {
    setPledgeTickerEntries(prev => {
      const next = prev.map(e => {
        if (e.id !== id) return e;
        const newStatus: 'active' | 'hidden' = e.status === 'active' ? 'hidden' : 'active';
        return { ...e, status: newStatus };
      });
      try { localStorage.setItem(STORAGE_KEYS.PLEDGE_TICKER, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const deletePledgeTickerEntry = (id: string) => {
    setPledgeTickerEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.PLEDGE_TICKER, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Engagement Voting Sync
  const updateContentVotes = (contentType: 'news' | 'research' | 'protector', id: string, likes: number, dislikes: number) => {
    if (contentType === 'news') {
      setNews(prev => {
        const next = prev.map(item => item.id === id ? { ...item, likes, dislikes } : item);
        try { localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(next)); } catch {}
        return next;
      });
    } else if (contentType === 'research') {
      setResearch(prev => {
        const next = prev.map(item => item.id === id ? { ...item, likes, dislikes } : item);
        try { localStorage.setItem(STORAGE_KEYS.RESEARCH, JSON.stringify(next)); } catch {}
        return next;
      });
    } else if (contentType === 'protector') {
      setGrassrootsProtectors(prev => {
        const next = prev.map(item => item.id === id ? { ...item, likes, dislikes } : item);
        try { localStorage.setItem(STORAGE_KEYS.PROTECTORS, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  };

  const fetchWeather = async (force: boolean = false, zoneOverride?: string) => {
    const targetZone = zoneOverride || selectedWeatherZone || weatherSettings.defaultZoneId || 'valmikinagar';
    setIsWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await getUniversalVTRWeather(targetZone, force);
      if (!data.success && !data.current) {
        throw new Error(data.error || 'Weather data unavailable. Please verify network or retry.');
      }
      setWeatherData(data);
      try {
        localStorage.setItem(STORAGE_KEYS.WEATHER_CACHE, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed saving weather cache:', e);
      }
    } catch (err: any) {
      console.warn('VTR Weather fetch issue, attempting cached fallback:', err);
      try {
        const cached = localStorage.getItem(STORAGE_KEYS.WEATHER_CACHE);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.current) {
            setWeatherData({ ...parsed, cached: true });
            return;
          }
        }
      } catch {}
      setWeatherError(err?.message || 'Weather data unavailable. Please retry.');
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const refreshWeather = async (force: boolean = true) => {
    await fetchWeather(force, selectedWeatherZone);
  };

  // Initial and zone-change weather fetch
  useEffect(() => {
    fetchWeather(false, selectedWeatherZone);
  }, [selectedWeatherZone]);

  // Periodic automatic weather refresh according to configured interval
  useEffect(() => {
    const intervalMinutes = Math.max(10, weatherSettings.refreshIntervalMinutes || 30);
    const intervalId = setInterval(() => {
      fetchWeather(false, selectedWeatherZone);
    }, intervalMinutes * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [weatherSettings.refreshIntervalMinutes, selectedWeatherZone]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteerSubmissions));
    } catch (e) {
      console.warn('Failed saving volunteers to storage:', e);
    }
  }, [volunteerSubmissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPPORTERS, JSON.stringify(supporterSubmissions));
    } catch (e) {
      console.warn('Failed saving supporters to storage:', e);
    }
  }, [supporterSubmissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTEGRATION_SETTINGS, JSON.stringify(integrationSettings));
    } catch (e) {
      console.warn('Failed saving integration settings to storage:', e);
    }
  }, [integrationSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATBOT_SETTINGS, JSON.stringify(chatbotSettings));
    } catch (e) {
      console.warn('Failed saving chatbot settings to storage:', e);
    }
  }, [chatbotSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
    } catch (e) {
      console.warn('Failed saving certificates to storage:', e);
    }
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATE_SETTINGS, JSON.stringify(certificateSettings));
    } catch (e) {
      console.warn('Failed saving certificate settings to storage:', e);
    }
  }, [certificateSettings]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESEARCH, JSON.stringify(research));
    } catch (e) {
      console.warn('Failed saving research to storage:', e);
    }
  }, [research]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_UPDATE, JSON.stringify(isAutoUpdateEnabled));
    } catch (e) {
      console.warn('Failed saving auto update state:', e);
    }
  }, [isAutoUpdateEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_NEWS_UPDATE, lastNewsUpdate);
    } catch (e) {
      console.warn('Failed saving last news update timestamp:', e);
    }
  }, [lastNewsUpdate]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIGERS, JSON.stringify(tigers));
    } catch (e) {
      console.warn('Failed saving tigers to storage:', e);
    }
  }, [tigers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.warn('Failed saving news to storage:', e);
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(newsSources));
    } catch (e) {
      console.warn('Failed saving sources to storage:', e);
    }
  }, [newsSources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed saving alerts to storage:', e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(sightings));
    } catch (e) {
      console.warn('Failed saving sightings to storage:', e);
    }
  }, [sightings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MAP_LOCATIONS, JSON.stringify(mapLocations));
    } catch (e) {
      console.warn('Failed saving map locations to storage:', e);
    }
  }, [mapLocations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VERIFIED_STATS, JSON.stringify(verifiedStats));
    } catch (e) {
      console.warn('Failed saving verified stats to storage:', e);
    }
  }, [verifiedStats]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PWA Install Prompt Listener & Service Worker Registration
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
      console.log('[VTW PWA] Captured beforeinstallprompt event');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker for offline field capability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then((reg) => {
          console.log('[VTW PWA] Service worker active with scope:', reg.scope);
          // Check for periodic updates when online
          if (reg.update) {
            reg.update().catch(() => {});
          }
        })
        .catch((err) => {
          console.warn('[VTW PWA] Service worker registration error:', err);
        });
    }

    // Read initial hash from URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTabState(hash);
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash) {
        setActiveTabState(currentHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Initialization: Handle Android APK redirect auth, session restoration, and fetch creator/members
  useEffect(() => {
    let isMounted = true;

    async function initializeSessionAndData() {
      // 1. Check for incoming Google OAuth redirect result (e.g. from Android APK WebView)
      try {
        const redirectRes = await handleRedirectAuthResult();
        if (isMounted && redirectRes && redirectRes.success && redirectRes.admin) {
          setIsAdmin(true);
          setAdminUser(redirectRes.admin);
          const sessToken = getCachedSessionToken();
          if (sessToken) setAdminSessionToken(sessToken);
        }
      } catch (e) {
        console.warn('Redirect auth check completed with note:', e);
      }

      // 2. If already have cached session token, verify it
      try {
        const sess = getCachedSessionToken();
        if (sess && !isAdmin) {
          const verifiedAdmin = await verifyCurrentAdminSession();
          if (isMounted && verifiedAdmin) {
            setIsAdmin(true);
            setAdminUser(verifiedAdmin);
            setAdminSessionToken(sess);
          }
        }
      } catch (e) {
        console.warn('Session verification note:', e);
      }

      // 3. Fetch Creator Profile and VTW Members
      try {
        await Promise.allSettled([
          refreshCreatorProfile(),
          refreshVTWMembers()
        ]);
      } catch {}
    }

    initializeSessionAndData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Tab Switcher with URL Hash
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setIsMobileNavOpen(false);
    window.location.hash = tab === 'home' ? '' : `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PWA Install Trigger
  const installPwa = async () => {
    if (!deferredPrompt) {
      console.log('[VTW PWA] PWA installation prompt unavailable or already installed.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[VTW PWA] User install choice outcome:', outcome);
    setDeferredPrompt(null);
    setCanInstallPwa(false);
  };

  // Public: Sighting Submission
  const submitSighting = (sighting: Omit<WildlifeSighting, 'id' | 'verificationStatus' | 'submittedAt'>) => {
    const newSighting: WildlifeSighting = {
      ...sighting,
      id: `sight-${Date.now()}`,
      verificationStatus: 'pending',
      submittedAt: new Date().toISOString()
    };
    setSightings(prev => [newSighting, ...prev]);
  };

  // Secure Google OAuth Admin Auth
  const loginWithGoogleAdmin = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithGoogleAdmin();
      if (result.success && result.admin && result.sessionToken) {
        setIsAdmin(true);
        setAdminUser(result.admin);
        setAdminSessionToken(result.sessionToken);
        refreshAuditLogs();
        return { success: true };
      }
      return {
        success: false,
        error: result.error || 'Access denied. This account is not authorized to access the VTW Admin Console.'
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Authentication error occurred.' };
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOutAdmin();
    } catch {}
    setIsAdmin(false);
    setAdminUser(null);
    setAdminSessionToken(null);
  };

  // Deprecated password login (strictly disabled)
  const adminLogin = (_pass: string): boolean => {
    return false;
  };
  const loginAdmin = adminLogin;
  const adminLogout = logoutAdmin;

  // Refresh Audit Logs
  const refreshAuditLogs = async () => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return;
    try {
      const res = await fetch(apiUrl('/api/admin/audit-logs'), {
        headers: { 'x-vtw-admin-session': sessionToken }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setAdminAuditLogs(data.logs);
        }
      }
    } catch {}
  };

  // Update VTW Admin Settings
  const updateVTWAdminSettings = async (settings: Partial<VTWAdminSettings>) => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return;
    try {
      const res = await fetch(apiUrl('/api/admin/settings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vtw-admin-session': sessionToken
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setVtwAdminSettings(data.settings);
          if (data.settings.officialCommunicationEmail) {
            setIntegrationSettings(prev => ({
              ...prev,
              contactEmail: data.settings.officialCommunicationEmail
            }));
          }
        }
      }
    } catch {}
  };

  // ==========================================
  // CREATOR PROFILE & PHOTOGRAPH OPERATIONS
  // ==========================================
  const refreshCreatorProfile = async () => {
    try {
      const res = await fetch(apiUrl('/api/creator-profile'));
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          setCreatorProfile(data.profile);
        }
      }
    } catch (err) {
      console.warn('Failed loading creator profile from API:', err);
    }
  };

  const updateCreatorProfileData = async (data: Partial<CreatorProfileData>): Promise<boolean> => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return false;
    try {
      const res = await fetch(apiUrl('/api/admin/creator-profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vtw-admin-session': sessionToken
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.profile) {
          setCreatorProfile(resData.profile);
          refreshAuditLogs();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to update creator profile:', err);
    }
    return false;
  };

  const uploadCreatorPhotograph = async (dataUrl: string): Promise<{ success: boolean; photoUrl?: string; error?: string }> => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return { success: false, error: 'Admin session token is required.' };
    try {
      const res = await fetch(apiUrl('/api/admin/creator-photo'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vtw-admin-session': sessionToken
        },
        body: JSON.stringify({ photoDataUrl: dataUrl })
      });
      const resData = await res.json().catch(() => null);
      if (res.ok && resData?.success) {
        setCreatorProfile(prev => ({ ...prev, photoUrl: resData.photoUrl }));
        refreshAuditLogs();
        return { success: true, photoUrl: resData.photoUrl };
      }
      return { success: false, error: resData?.error || 'Failed to upload creator photograph.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error occurred during photo upload.' };
    }
  };

  const removeCreatorPhotograph = async (): Promise<boolean> => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return false;
    try {
      const res = await fetch(apiUrl('/api/admin/creator-photo'), {
        method: 'DELETE',
        headers: {
          'x-vtw-admin-session': sessionToken
        }
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          setCreatorProfile(prev => ({ ...prev, photoUrl: '' }));
          refreshAuditLogs();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to remove creator photograph:', err);
    }
    return false;
  };

  // ==========================================
  // VTW OFFICIALS & MEMBERS OPERATIONS
  // ==========================================
  const refreshVTWMembers = async (includeInactive: boolean = false) => {
    try {
      const sessionToken = getCachedSessionToken();
      const endpoint = includeInactive && sessionToken ? '/api/admin/members' : '/api/members';
      const headers: Record<string, string> = {};
      if (includeInactive && sessionToken) {
        headers['x-vtw-admin-session'] = sessionToken;
      }
      const res = await fetch(apiUrl(endpoint), { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.members)) {
          setVtwMembers(data.members);
        }
      }
    } catch (err) {
      console.warn('Failed loading VTW members from API:', err);
    }
  };

  const addVTWMemberRecord = async (member: Omit<VTWMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return false;
    try {
      const res = await fetch(apiUrl('/api/admin/members'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vtw-admin-session': sessionToken
        },
        body: JSON.stringify(member)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.member) {
          setVtwMembers(prev => [...prev, data.member]);
          refreshAuditLogs();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to add VTW member:', err);
    }
    return false;
  };

  const updateVTWMemberRecord = async (id: string, member: Partial<VTWMember>): Promise<boolean> => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return false;
    try {
      const res = await fetch(apiUrl(`/api/admin/members/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-vtw-admin-session': sessionToken
        },
        body: JSON.stringify(member)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.member) {
          setVtwMembers(prev => prev.map(m => m.id === id ? data.member : m));
          refreshAuditLogs();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to update VTW member:', err);
    }
    return false;
  };

  const deleteVTWMemberRecord = async (id: string): Promise<boolean> => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return false;
    try {
      const res = await fetch(apiUrl(`/api/admin/members/${id}`), {
        method: 'DELETE',
        headers: {
          'x-vtw-admin-session': sessionToken
        }
      });
      if (res.ok) {
        setVtwMembers(prev => prev.filter(m => m.id !== id));
        refreshAuditLogs();
        return true;
      }
    } catch (err) {
      console.error('Failed to delete VTW member:', err);
    }
    return false;
  };

  const uploadVTWMemberPhotograph = async (id: string, dataUrl: string): Promise<{ success: boolean; photoUrl?: string; error?: string }> => {
    const sessionToken = getCachedSessionToken();
    if (!sessionToken) return { success: false, error: 'Admin session required.' };
    try {
      const res = await fetch(apiUrl(`/api/admin/members/${id}/photo`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vtw-admin-session': sessionToken
        },
        body: JSON.stringify({ photoDataUrl: dataUrl })
      });
      const resData = await res.json().catch(() => null);
      if (res.ok && resData?.success) {
        setVtwMembers(prev => prev.map(m => m.id === id ? { ...m, photoUrl: resData.photoUrl } : m));
        refreshAuditLogs();
        return { success: true, photoUrl: resData.photoUrl };
      }
      return { success: false, error: resData?.error || 'Failed to upload member photo.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error occurred.' };
    }
  };

  // Admin Tiger CRUD & Verification
  const addTiger = (tigerData: Omit<TigerProfile, 'id'>) => {
    const newTiger: TigerProfile = {
      ...tigerData,
      id: `tiger-${Date.now()}`,
      isLive: tigerData.isLive ?? true
    };
    setTigers(prev => [newTiger, ...prev]);
  };

  const updateTiger = (tiger: TigerProfile) => {
    setTigers(prev => prev.map(t => t.id === tiger.id ? tiger : t));
  };

  const deleteTiger = (id: string) => {
    setTigers(prev => prev.filter(t => t.id !== id));
  };

  const verifyTiger = (
    id: string, 
    officialSource = 'NTCA 5th Cycle & Bihar Forest Dept Protocol', 
    customDate?: string, 
    isLive = true
  ) => {
    const stamp = customDate || new Date().toISOString().split('T')[0];
    setTigers(prev => prev.map(t => t.id === id ? {
      ...t,
      verification: 'verified',
      sources: officialSource,
      lastVerifiedDate: stamp,
      verifiedBy: 'National Tiger Conservation Authority (NTCA) / Bihar Forest Dept',
      isLive
    } : t));
  };

  const setTigerVerificationStatus = (
    id: string, 
    status: 'verified' | 'reported' | 'estimated' | 'unverified', 
    isLive?: boolean, 
    sources?: string, 
    date?: string
  ) => {
    const stamp = date || new Date().toISOString().split('T')[0];
    setTigers(prev => prev.map(t => t.id === id ? {
      ...t,
      verification: status,
      sources: sources !== undefined ? sources : t.sources,
      lastVerifiedDate: stamp,
      isLive: isLive !== undefined ? isLive : (t.isLive ?? true)
    } : t));
  };

  const toggleTigerLive = (id: string) => {
    setTigers(prev => prev.map(t => t.id === id ? { ...t, isLive: t.isLive === false ? true : false } : t));
  };

  const updateTigerVerification = (id: string, updates: Partial<TigerProfile>) => {
    setTigers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const batchVerifyTigers = (ids: string[], officialSource = 'NTCA 5th Cycle & Bihar Forest Dept Protocol') => {
    const stamp = new Date().toISOString().split('T')[0];
    setTigers(prev => prev.map(t => ids.includes(t.id) ? {
      ...t,
      verification: 'verified',
      sources: officialSource,
      lastVerifiedDate: stamp,
      verifiedBy: 'National Tiger Conservation Authority (NTCA)',
      isLive: true
    } : t));
  };

  // Admin News CRUD & Verification
  const addNews = (newsData: Omit<NewsArticle, 'id'>) => {
    const newArticle: NewsArticle = {
      ...newsData,
      id: `news-${Date.now()}`,
      isLive: newsData.isLive ?? true
    };
    setNews(prev => [newArticle, ...prev]);
  };

  const updateNews = (article: NewsArticle) => {
    setNews(prev => prev.map(n => n.id === article.id ? article : n));
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const verifyNews = (
    id: string, 
    status: any = 'verified_govt', 
    officialSourceRef = 'NTCA MoEFCC Press Notification', 
    customDate?: string, 
    isLive = true
  ) => {
    const stamp = customDate || new Date().toISOString().split('T')[0];
    setNews(prev => prev.map(n => n.id === id ? {
      ...n,
      verificationStatus: status,
      retrievedDate: stamp,
      verifiedDate: stamp,
      verifiedBy: 'NTCA / State Forest Media Division',
      officialSourceRef,
      isLive
    } : n));
  };

  const toggleNewsLive = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, isLive: n.isLive === false ? true : false } : n));
  };

  const updateNewsVerification = (id: string, updates: Partial<NewsArticle>) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const batchVerifyNews = (ids: string[], status: any = 'verified_govt', officialSourceRef = 'NTCA MoEFCC Press Notification') => {
    const stamp = new Date().toISOString().split('T')[0];
    setNews(prev => prev.map(n => ids.includes(n.id) ? {
      ...n,
      verificationStatus: status,
      retrievedDate: stamp,
      verifiedDate: stamp,
      verifiedBy: 'NTCA / State Forest Media Division',
      officialSourceRef,
      isLive: true
    } : n));
  };

  const pinNews = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const toggleNewsFeatured = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, featured: !n.featured } : n));
  };

  const setNewsStatus = (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, status, isLive: status === 'approved' } : n));
  };

  const toggleAutoUpdate = () => {
    setIsAutoUpdateEnabled(prev => !prev);
  };

  // Admin News Source Management
  const toggleNewsSource = (id: string) => {
    setNewsSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const addNewsSource = (sourceData: Omit<NewsSource, 'id' | 'lastChecked' | 'checkStatus'>) => {
    const newSource: NewsSource = {
      ...sourceData,
      id: `source-${Date.now()}`,
      lastChecked: new Date().toISOString(),
      checkStatus: 'active'
    };
    setNewsSources(prev => [...prev, newSource]);
  };

  // News Ingestion Pipeline with Live Feed Service
  const syncNewsSources = async (): Promise<{ addedCount: number; message: string; success?: boolean; error?: string }> => {
    try {
      const result = await syncNewsFeeds(newsSources, news);
      
      const now = new Date().toISOString();
      setNewsSources(prev => prev.map(s => ({
        ...s,
        lastChecked: now,
        checkStatus: s.enabled ? 'active' : 'pending'
      })));
      
      if (result.allUpdatedNews && result.allUpdatedNews.length > 0) {
        setNews(result.allUpdatedNews);
      } else if (result.newArticles && result.newArticles.length > 0) {
        setNews(prev => [...result.newArticles, ...prev]);
      }

      const stamp = new Date().toISOString();
      setLastNewsUpdate(stamp);

      return {
        success: true,
        addedCount: result.newArticles ? result.newArticles.length : 0,
        message: result.message || (result.newArticles && result.newArticles.length > 0
          ? `Discovered ${result.newArticles.length} new verified tiger news articles.`
          : 'All news feeds verified and up to date.')
      };
    } catch (err: any) {
      const stamp = new Date().toISOString();
      setLastNewsUpdate(stamp);
      return {
        success: false,
        addedCount: 0,
        message: 'Unable to connect to live news sources. Keeping previously verified news visible.',
        error: err?.message || 'Network connection failed'
      };
    }
  };

  const refreshNews = syncNewsSources;

  // Research Publications Management (Admin)
  const addResearch = (paperData: Omit<ResearchReport, 'id'>) => {
    // New publications are NOT automatically published as verified.
    // They remain in Draft or Pending Verification until approved by admin.
    const isExplicitlyVerified = paperData.status === 'published' && paperData.verified === true;
    const today = new Date().toISOString().split('T')[0];
    const newPaper: ResearchReport = {
      ...paperData,
      id: `res-${Date.now()}`,
      year: paperData.year || new Date().getFullYear(),
      publicationDate: paperData.publicationDate || today,
      status: isExplicitlyVerified ? 'published' : (paperData.status || 'pending_verification'),
      verified: isExplicitlyVerified,
      originalSourceLink: paperData.originalSourceLink || paperData.officialUrl || '',
      verifiedBy: isExplicitlyVerified ? (paperData.verifiedBy || 'Editorial Board Review') : undefined,
      verifiedDate: isExplicitlyVerified ? (paperData.verifiedDate || today) : undefined,
      verificationNotes: paperData.verificationNotes || (isExplicitlyVerified ? 'Verified by administrator.' : 'Awaiting original source and attribution review.')
    };
    setResearch(prev => [newPaper, ...prev]);
  };

  const updateResearch = (paper: ResearchReport) => {
    setResearch(prev => prev.map(p => {
      if (p.id !== paper.id) return p;
      // If status is changed away from published, verified cannot remain true without checking
      const verified = paper.status === 'published' ? (paper.verified ?? false) : false;
      return {
        ...paper,
        verified
      };
    }));
  };

  const deleteResearch = (id: string) => {
    setResearch(prev => prev.filter(p => p.id !== id));
  };

  const toggleResearchStatus = (id: string) => {
    setResearch(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextStatus: PublicationStatus = p.status === 'published' ? 'unpublished' : 'published';
      return {
        ...p,
        status: nextStatus,
        verified: nextStatus === 'published' ? p.verified : false
      };
    }));
  };

  const setResearchStatus = (id: string, status: PublicationStatus) => {
    setResearch(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        status,
        verified: status === 'published' ? p.verified : false
      };
    }));
  };

  const verifyAndPublishResearch = (id: string, originalSourceLink?: string, verificationNotes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setResearch(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        status: 'published',
        verified: true,
        verifiedDate: today,
        verifiedBy: 'VTW Scientific Advisory Board',
        originalSourceLink: originalSourceLink || p.originalSourceLink || p.officialUrl || '',
        verificationNotes: verificationNotes || p.verificationNotes || 'Source verified against official repository / academic index.'
      };
    }));
  };

  const unpublishResearch = (id: string) => {
    setResearch(prev => prev.map(p => p.id === id ? { ...p, status: 'unpublished' } : p));
  };

  const rejectResearch = (id: string, reason?: string) => {
    setResearch(prev => prev.map(p => p.id === id ? {
      ...p,
      status: 'rejected',
      verified: false,
      verificationNotes: reason || 'Publication rejected: source or attribution could not be verified.'
    } : p));
  };

  // Admin Alerts CRUD & Verification
  const addAlert = (alertData: Omit<ConservationAlert, 'id'>) => {
    const newAlert: ConservationAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      issuedDate: alertData.issuedDate || alertData.date || new Date().toISOString().split('T')[0],
      issuingAuthority: alertData.issuingAuthority || 'VTR Field Directorate, Bettiah',
      alertType: alertData.alertType || 'advisory',
      isSampleData: alertData.isSampleData ?? false,
      verified: alertData.verified ?? true,
      verifiedDate: alertData.verifiedDate || new Date().toISOString().split('T')[0],
      verifiedSource: alertData.verifiedSource || 'VTR Control Cell Official Directive'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const toggleAlertStatus = toggleAlert;

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const verifyAlert = (
    id: string, 
    verifiedSource = 'VTR Field Directorate Emergency Bulletin #2026/08', 
    customDate?: string
  ) => {
    const stamp = customDate || new Date().toISOString().split('T')[0];
    setAlerts(prev => prev.map(a => a.id === id ? {
      ...a,
      verified: true,
      verifiedDate: stamp,
      verifiedSource,
      verifiedBy: 'VTR Field Director / NTCA Liaison',
      active: true
    } : a));
  };

  const updateAlertVerification = (id: string, updates: Partial<ConservationAlert>) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  // Map Locations Management
  const addMapLocation = (locData: Omit<VisitorLocation, 'id'>) => {
    const newLoc: VisitorLocation = {
      ...locData,
      id: `loc-${Date.now()}`,
      isLive: locData.isLive ?? true
    };
    setMapLocations(prev => [newLoc, ...prev]);
  };

  const updateMapLocation = (loc: VisitorLocation) => {
    setMapLocations(prev => prev.map(l => l.id === loc.id ? loc : l));
  };

  const deleteMapLocation = (id: string) => {
    setMapLocations(prev => prev.filter(l => l.id !== id));
  };

  const toggleMapLocationLive = (id: string) => {
    setMapLocations(prev => prev.map(l => l.id === id ? { ...l, isLive: l.isLive === false ? true : false } : l));
  };

  const resetMapLocations = () => {
    setMapLocations(INITIAL_MAP_LOCATIONS);
    try {
      localStorage.setItem(STORAGE_KEYS.MAP_LOCATIONS, JSON.stringify(INITIAL_MAP_LOCATIONS));
    } catch (e) {}
  };

  // Verified Statistics Registry Management
  const updateVerifiedStat = (id: string, updates: Partial<VerifiedStatistic>) => {
    setVerifiedStats(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const resetVerifiedStats = () => {
    setVerifiedStats(VERIFIED_STATISTICS_REGISTRY);
    try {
      localStorage.setItem(STORAGE_KEYS.VERIFIED_STATS, JSON.stringify(VERIFIED_STATISTICS_REGISTRY));
    } catch (e) {}
  };

  // Admin Sightings Review & Verification
  const approveSighting = (id: string) => {
    const stamp = new Date().toISOString().split('T')[0];
    setSightings(prev => prev.map(s => s.id === id ? { 
      ...s, 
      verificationStatus: 'verified',
      verifiedDate: stamp,
      isLive: true
    } : s));
  };

  const flagSighting = (id: string) => {
    setSightings(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: 'flagged', isLive: false } : s));
  };

  const deleteSighting = (id: string) => {
    setSightings(prev => prev.filter(s => s.id !== id));
  };

  const updateSightingStatus = (
    id: string, 
    status: 'pending' | 'verified' | 'flagged' | 'under_review' | 'reported', 
    officialNote?: string, 
    customDate?: string
  ) => {
    const stamp = customDate || new Date().toISOString().split('T')[0];
    setSightings(prev => prev.map(s => s.id === id ? {
      ...s,
      verificationStatus: status,
      verifiedDate: stamp,
      officialNote: officialNote || s.officialNote,
      isLive: status === 'verified' || status === 'reported'
    } : s));
  };

  const verifySighting = (
    id: string, 
    officialNote = 'Cross-referenced against VTR Range Beat patrol logs & verified camera-trap coordinates.', 
    customDate?: string
  ) => {
    const stamp = customDate || new Date().toISOString().split('T')[0];
    setSightings(prev => prev.map(s => s.id === id ? {
      ...s,
      verificationStatus: 'verified',
      verifiedDate: stamp,
      verifiedBy: 'VTR Field Beat Range Officer',
      officialNote,
      isLive: true
    } : s));
  };

  const toggleSightingLive = (id: string) => {
    setSightings(prev => prev.map(s => s.id === id ? { ...s, isLive: s.isLive === false ? true : false } : s));
  };

  // Volunteer & Supporter Operations
  const addVolunteerSubmission = (data: Omit<VolunteerSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const id = `vol-${Date.now()}`;
    const newSubmission: VolunteerSubmission = {
      ...data,
      id,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      syncedToGoogleForm: Boolean(integrationSettings.volunteerGoogleFormUrl)
    };
    setVolunteerSubmissions(prev => [newSubmission, ...prev]);
    return { id, success: true };
  };

  const updateVolunteerSubmissionStatus = (id: string, status: VolunteerSubmission['status'], notes?: string) => {
    setVolunteerSubmissions(prev => prev.map(v => v.id === id ? {
      ...v,
      status,
      notes: notes !== undefined ? notes : v.notes
    } : v));
  };

  const deleteVolunteerSubmission = (id: string) => {
    setVolunteerSubmissions(prev => prev.filter(v => v.id !== id));
  };

  const addSupporterSubmission = (data: Omit<SupporterSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const id = `sup-${Date.now()}`;
    const newSubmission: SupporterSubmission = {
      ...data,
      id,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      syncedToGoogleForm: Boolean(integrationSettings.supporterGoogleFormUrl)
    };
    setSupporterSubmissions(prev => [newSubmission, ...prev]);
    return { id, success: true };
  };

  const updateSupporterSubmissionStatus = (id: string, status: SupporterSubmission['status'], notes?: string) => {
    setSupporterSubmissions(prev => prev.map(s => s.id === id ? {
      ...s,
      status,
      notes: notes !== undefined ? notes : s.notes
    } : s));
  };

  const deleteSupporterSubmission = (id: string) => {
    setSupporterSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const updateIntegrationSettings = (settings: Partial<AppIntegrationSettings>) => {
    setIntegrationSettings(prev => ({
      ...prev,
      ...settings,
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateChatbotSettings = (settings: Partial<ChatbotAdminSettings>) => {
    setChatbotSettings(prev => ({
      ...prev,
      ...settings,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Certificate Registry & Generation Operations
  const refreshCertificates = async () => {
    try {
      const [certsRes, settingsRes] = await Promise.all([
        fetch('/api/certificates'),
        fetch('/api/certificates/settings')
      ]);

      if (certsRes.ok) {
        const certsData = await certsRes.json();
        if (Array.isArray(certsData.certificates)) {
          setCertificates(certsData.certificates);
          try {
            localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certsData.certificates));
          } catch (e) {}
        }
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.settings) {
          setCertificateSettings(prev => ({ ...prev, ...settingsData.settings }));
          try {
            localStorage.setItem(STORAGE_KEYS.CERTIFICATE_SETTINGS, JSON.stringify(settingsData.settings));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('Certificate sync with server encountered error, using client cache:', e);
    }
  };

  useEffect(() => {
    refreshCertificates();
  }, []);

  const generatePledgeCertificate = async (input: {
    fullName: string;
    cityAndState: string;
    country?: string;
    email?: string;
    organization?: string;
    language?: 'en' | 'hi' | 'ur';
    pledgeId?: string;
    consentPublicTicker?: boolean;
  }): Promise<TigerPledgeCertificate & { alreadyIssued?: boolean }> => {
    setIsCertificateGenerating(true);
    const trimmedName = input.fullName.trim();
    const trimmedCity = input.cityAndState.trim();
    const trimmedEmail = input.email?.trim() || '';

    try {
      // 1. Local deduplication check: Has this participant or pledge already received a certificate?
      const existing = certificates.find((c) => {
        if (input.pledgeId && c.pledgeId && c.pledgeId === input.pledgeId) {
          return true;
        }
        const certName = (c.participantName || c.fullName || '').trim().toLowerCase();
        const certCity = (c.cityAndState || '').trim().toLowerCase();
        const certEmail = (c.email || '').trim().toLowerCase();

        if (certName === trimmedName.toLowerCase() && certCity === trimmedCity.toLowerCase()) {
          return true;
        }
        if (trimmedEmail && certEmail && certEmail === trimmedEmail.toLowerCase() && certName === trimmedName.toLowerCase()) {
          return true;
        }
        return false;
      });

      if (existing) {
        const resultCert = { ...existing, alreadyIssued: true };
        setLastIssuedCertificate(resultCert);
        try {
          localStorage.setItem(STORAGE_KEYS.LAST_ISSUED_CERT, JSON.stringify(resultCert));
        } catch (e) {}
        return resultCert;
      }

      // 2. Server generation attempt
      try {
        const response = await fetch('/api/certificates/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...input,
            pledgeStatementAgreed: true
          })
        });

        if (response.ok) {
          const data = await response.json();
          const newCert: TigerPledgeCertificate = data.certificate;
          const isAlreadyIssued = !!data.alreadyIssued;

          setCertificates(prev => {
            const updated = [newCert, ...prev.filter(c => c.certificateNumber !== newCert.certificateNumber)];
            try {
              localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });

          const returnVal = { ...newCert, alreadyIssued: isAlreadyIssued };
          setLastIssuedCertificate(returnVal);
          try {
            localStorage.setItem(STORAGE_KEYS.LAST_ISSUED_CERT, JSON.stringify(returnVal));
          } catch (e) {}

          if (input.consentPublicTicker && !isAlreadyIssued) {
            const nameParts = trimmedName.split(/\s+/);
            const firstName = nameParts[0] || 'Friend of Tigers';
            const lastInitial = nameParts.length > 1 ? ` ${nameParts[nameParts.length - 1][0].toUpperCase()}.` : '';
            addPledgeTickerEntry({
              displayName: `${firstName}${lastInitial}`,
              cityAndState: trimmedCity || 'India',
              consentPublicTicker: true,
              status: 'active'
            });
          }

          return returnVal;
        }
      } catch (fetchErr) {
        console.warn('Backend certificate endpoint unreachable or running in APK, generating locally:', fetchErr);
      }

      // 3. Fallback / Offline / APK Local Unique Sequence Generator
      const currentYear = new Date().getFullYear();
      const prefix = certificateSettings.numberingPrefix || 'VTW';

      // Find highest sequence from existing certificates
      let maxSeq = 0;
      certificates.forEach(c => {
        const match = c.certificateNumber?.match(/-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) maxSeq = num;
        }
      });

      let storedSeq = 0;
      try {
        const s = localStorage.getItem(STORAGE_KEYS.CERT_SEQUENCE);
        if (s) storedSeq = parseInt(s, 10) || 0;
      } catch (e) {}

      let nextNum = Math.max(maxSeq, storedSeq, 0) + 1;
      let uniqueCertNum = '';

      // Collision loop
      while (true) {
        const padded = nextNum.toString().padStart(6, '0');
        const candidate = `${prefix}-${currentYear}-${padded}`;
        const exists = certificates.some(c => c.certificateNumber === candidate);
        if (!exists) {
          uniqueCertNum = candidate;
          nextNum += 1;
          break;
        }
        nextNum += 1;
      }

      try {
        localStorage.setItem(STORAGE_KEYS.CERT_SEQUENCE, nextNum.toString());
      } catch (e) {}

      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const certId = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const pledgeId = input.pledgeId || `pledge_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const fallbackCert: TigerPledgeCertificate = {
        id: certId,
        certificateId: certId,
        pledgeId,
        certificateNumber: uniqueCertNum,
        participantName: trimmedName,
        fullName: trimmedName,
        cityAndState: trimmedCity,
        country: input.country?.trim() || 'India',
        email: trimmedEmail || undefined,
        organization: input.organization?.trim() || undefined,
        issueDate: formattedDate,
        pledgeDate: formattedDate,
        pledgeFormattedDate: formattedDate,
        createdAt: now.toISOString(),
        issuedAt: now.toISOString(),
        status: 'valid',
        language: input.language || 'en',
        verificationHash: Math.random().toString(36).substring(2, 18),
        isLocallyStored: true
      };

      setCertificates(prev => {
        const updated = [fallbackCert, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      setLastIssuedCertificate(fallbackCert);
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_ISSUED_CERT, JSON.stringify(fallbackCert));
      } catch (e) {}

      if (input.consentPublicTicker) {
        const nameParts = trimmedName.split(/\s+/);
        const firstName = nameParts[0] || 'Friend of Tigers';
        const lastInitial = nameParts.length > 1 ? ` ${nameParts[nameParts.length - 1][0].toUpperCase()}.` : '';
        addPledgeTickerEntry({
          displayName: `${firstName}${lastInitial}`,
          cityAndState: trimmedCity || 'India',
          consentPublicTicker: true,
          status: 'active'
        });
      }

      return fallbackCert;
    } finally {
      setIsCertificateGenerating(false);
    }
  };

  const revokePledgeCertificate = async (certNumber: string, reason: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/certificates/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateNumber: certNumber, reason })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to revoke certificate');
      }
      setCertificates(prev => prev.map(c => c.certificateNumber === certNumber ? {
        ...c,
        status: 'revoked',
        revocationReason: reason,
        revokedAt: new Date().toISOString()
      } : c));
      return { success: true, message: data.message || 'Certificate revoked successfully' };
    } catch (e: any) {
      setCertificates(prev => prev.map(c => c.certificateNumber === certNumber ? {
        ...c,
        status: 'revoked',
        revocationReason: reason,
        revokedAt: new Date().toISOString()
      } : c));
      return { success: true, message: 'Certificate revoked in local state' };
    }
  };

  const restorePledgeCertificate = async (certNumber: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/certificates/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateNumber: certNumber })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to restore certificate');
      }
      setCertificates(prev => prev.map(c => c.certificateNumber === certNumber ? {
        ...c,
        status: 'active',
        revocationReason: undefined,
        revokedAt: undefined
      } : c));
      return { success: true, message: data.message || 'Certificate restored successfully' };
    } catch (e: any) {
      setCertificates(prev => prev.map(c => c.certificateNumber === certNumber ? {
        ...c,
        status: 'active',
        revocationReason: undefined,
        revokedAt: undefined
      } : c));
      return { success: true, message: 'Certificate restored in local state' };
    }
  };

  const updateCertificateSettings = async (settings: Partial<CertificateAdminSettings>) => {
    const updated = { ...certificateSettings, ...settings, lastUpdated: new Date().toISOString() };
    setCertificateSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATE_SETTINGS, JSON.stringify(updated));
    } catch (e) {}

    try {
      await fetch('/api/certificates/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (e) {
      console.warn('Failed to sync certificate settings to backend:', e);
    }
  };

  // Backup & Restore
  const exportDataBackup = (): string => {
    const payload = {
      version: '1.4',
      exportedAt: new Date().toISOString(),
      tigers,
      news,
      newsSources,
      alerts,
      sightings,
      mapLocations,
      verifiedStats,
      research,
      volunteerSubmissions,
      supporterSubmissions,
      integrationSettings,
      chatbotSettings,
      certificates,
      certificateSettings
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.tigers && Array.isArray(parsed.tigers)) setTigers(parsed.tigers);
      if (parsed.news && Array.isArray(parsed.news)) setNews(parsed.news);
      if (parsed.newsSources && Array.isArray(parsed.newsSources)) setNewsSources(parsed.newsSources);
      if (parsed.alerts && Array.isArray(parsed.alerts)) setAlerts(parsed.alerts);
      if (parsed.sightings && Array.isArray(parsed.sightings)) setSightings(parsed.sightings);
      if (parsed.mapLocations && Array.isArray(parsed.mapLocations)) setMapLocations(parsed.mapLocations);
      if (parsed.verifiedStats && Array.isArray(parsed.verifiedStats)) setVerifiedStats(parsed.verifiedStats);
      if (parsed.research && Array.isArray(parsed.research)) setResearch(parsed.research);
      if (parsed.volunteerSubmissions && Array.isArray(parsed.volunteerSubmissions)) setVolunteerSubmissions(parsed.volunteerSubmissions);
      if (parsed.supporterSubmissions && Array.isArray(parsed.supporterSubmissions)) setSupporterSubmissions(parsed.supporterSubmissions);
      if (parsed.integrationSettings && typeof parsed.integrationSettings === 'object') setIntegrationSettings(parsed.integrationSettings);
      if (parsed.chatbotSettings && typeof parsed.chatbotSettings === 'object') setChatbotSettings(parsed.chatbotSettings);
      if (parsed.certificates && Array.isArray(parsed.certificates)) setCertificates(parsed.certificates);
      if (parsed.certificateSettings && typeof parsed.certificateSettings === 'object') setCertificateSettings(parsed.certificateSettings);
      return true;
    } catch (e) {
      console.error('Failed to parse backup JSON:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setTigers(INITIAL_TIGERS);
    setNews(INITIAL_NEWS);
    setNewsSources(INITIAL_NEWS_SOURCES);
    setAlerts(INITIAL_ALERTS);
    setSightings(INITIAL_SIGHTINGS);
    setMapLocations(INITIAL_MAP_LOCATIONS);
    setVerifiedStats(VERIFIED_STATISTICS_REGISTRY);
    setResearch(INITIAL_RESEARCH);
    setVolunteerSubmissions(INITIAL_VOLUNTEERS);
    setSupporterSubmissions(INITIAL_SUPPORTERS);
    setIntegrationSettings(DEFAULT_INTEGRATION_SETTINGS);
    setChatbotSettings(DEFAULT_CHATBOT_SETTINGS);
    setCertificates([]);
    setCertificateSettings(DEFAULT_CERTIFICATE_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEYS.TIGERS);
      localStorage.removeItem(STORAGE_KEYS.NEWS);
      localStorage.removeItem(STORAGE_KEYS.SOURCES);
      localStorage.removeItem(STORAGE_KEYS.ALERTS);
      localStorage.removeItem(STORAGE_KEYS.SIGHTINGS);
      localStorage.removeItem(STORAGE_KEYS.MAP_LOCATIONS);
      localStorage.removeItem(STORAGE_KEYS.VERIFIED_STATS);
      localStorage.removeItem(STORAGE_KEYS.RESEARCH);
      localStorage.removeItem(STORAGE_KEYS.VOLUNTEERS);
      localStorage.removeItem(STORAGE_KEYS.SUPPORTERS);
      localStorage.removeItem(STORAGE_KEYS.INTEGRATION_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.CHATBOT_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
      localStorage.removeItem(STORAGE_KEYS.CERTIFICATE_SETTINGS);
    } catch (e) {}
  };

  return (
    <DataContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        openSearchModal,
        isMobileNavOpen,
        setIsMobileNavOpen,
        openMobileNav,
        closeMobileNav,
        selectedTiger,
        setSelectedTiger,
        selectedNews,
        setSelectedNews,
        isOnline,
        canInstallPwa,
        installPwa,
        tigers,
        news,
        newsSources,
        wildlife,
        alerts,
        sightings,
        research,
        researchReports: research,
        education,
        ecotourism,
        community,
        gallery,
        mapLocations,
        verifiedStats,
        submitSighting,
        addSighting: submitSighting,
        isAdmin,
        isAdminAuthenticated: isAdmin,
        adminUser,
        adminSessionToken,
        loginWithGoogleAdmin,
        logoutAdmin,
        adminLogin,
        loginAdmin: adminLogin,
        adminLogout,
        adminAuditLogs,
        refreshAuditLogs,
        vtwAdminSettings,
        updateVTWAdminSettings,
        addTiger,
        updateTiger,
        deleteTiger,
        verifyTiger,
        setTigerVerificationStatus,
        toggleTigerLive,
        updateTigerVerification,
        batchVerifyTigers,
        addNews,
        updateNews,
        deleteNews,
        verifyNews,
        toggleNewsLive,
        updateNewsVerification,
        batchVerifyNews,
        pinNews,
        toggleNewsFeatured,
        setNewsStatus,
        isAutoUpdateEnabled,
        lastNewsUpdate,
        toggleAutoUpdate,
        refreshNews,
        toggleNewsSource,
        addNewsSource,
        syncNewsSources,
        addResearch,
        updateResearch,
        deleteResearch,
        toggleResearchStatus,
        setResearchStatus,
        verifyAndPublishResearch,
        unpublishResearch,
        rejectResearch,
        addAlert,
        toggleAlert,
        toggleAlertStatus,
        deleteAlert,
        verifyAlert,
        updateAlertVerification,
        addMapLocation,
        updateMapLocation,
        deleteMapLocation,
        toggleMapLocationLive,
        resetMapLocations,
        updateVerifiedStat,
        resetVerifiedStats,
        approveSighting,
        flagSighting,
        deleteSighting,
        updateSightingStatus,
        verifySighting,
        toggleSightingLive,
        // Volunteer & Supporter
        volunteerSubmissions,
        supporterSubmissions,
        addVolunteerSubmission,
        addSupporterSubmission,
        updateVolunteerSubmissionStatus,
        updateSupporterSubmissionStatus,
        deleteVolunteerSubmission,
        deleteSupporterSubmission,
        // Integrations & Chatbot Settings
        integrationSettings,
        updateIntegrationSettings,
        chatbotSettings,
        updateChatbotSettings,
        // Modals
        isVolunteerModalOpen,
        openVolunteerModal,
        closeVolunteerModal,
        isSupporterModalOpen,
        openSupporterModal,
        closeSupporterModal,
        isChatbotOpen,
        openChatbot,
        closeChatbot,
        toggleChatbot,
        isUpdateModalOpen,
        openUpdateModal,
        closeUpdateModal,
        // VTR Real-time Weather
        weatherData,
        isWeatherLoading,
        weatherError,
        selectedWeatherZone,
        setSelectedWeatherZone,
        refreshWeather,
        weatherSettings,
        updateWeatherSettings,
        // Tiger Protection Pledge Certificates
        certificates,
        certificateSettings,
        isCertificateGenerating,
        lastIssuedCertificate,
        clearLastIssuedCertificate,
        generatePledgeCertificate,
        revokePledgeCertificate,
        restorePledgeCertificate,
        updateCertificateSettings,
        refreshCertificates,
        // Grassroots Protectors
        grassrootsProtectors,
        addGrassrootsProtector,
        updateGrassrootsProtector,
        deleteGrassrootsProtector,
        setGrassrootsEditorialStatus,
        // Feedback System
        feedbackSubmissions,
        submitFeedback,
        updateFeedbackStatus,
        deleteFeedback,
        // Pledge Ticker
        pledgeTickerEntries,
        addPledgeTickerEntry,
        togglePledgeTickerStatus,
        deletePledgeTickerEntry,
        isTickerEnabled,
        setIsTickerEnabled,
        // Aggregate Engagement Voting
        updateContentVotes,
        // Creator Profile & VTW Officials / Members
        creatorProfile,
        vtwMembers,
        refreshCreatorProfile,
        updateCreatorProfileData,
        uploadCreatorPhotograph,
        removeCreatorPhotograph,
        refreshVTWMembers,
        addVTWMemberRecord,
        updateVTWMemberRecord,
        deleteVTWMemberRecord,
        uploadVTWMemberPhotograph,
        // Backup
        exportDataBackup,
        importDataBackup,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
