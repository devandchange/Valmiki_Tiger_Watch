export type VerificationLevel = 'verified_govt' | 'peer_reviewed' | 'established_media' | 'reputable_media' | 'field_verified' | 'unverified';

export type NewsVerificationStatus = VerificationLevel;
export type NewsSourceCategory = 'Forest Department' | 'NTCA / MoEFCC' | 'WII Research' | 'Established Media';

export type IUCNStatus = 'CR' | 'EN' | 'VU' | 'NT' | 'LC';

export interface TigerProfile {
  id: string;
  code: string; // e.g., "T-101"
  name?: string; // nickname e.g., "Rudra"
  sex: 'Male' | 'Female' | 'Unknown';
  approxAge: string;
  markings: string;
  safeTerritory: string; // Generalized beat name, e.g. "Gonauli - Madanpur Sector"
  cameraTrapRecords: number;
  lastSightingDate?: string;
  lastDocumentedDate?: string; // Last documented date
  status: 'Resident' | 'Transient' | 'Breeding Female' | 'Sub-Adult';
  familyLineage?: string;
  verification: 'verified' | 'reported' | 'estimated' | 'unverified';
  photoUrl: string;
  lastVerifiedDate: string;
  sources: string;
  notes: string;
  fullDossier?: string;
  isLive?: boolean;
  verifiedBy?: string;
  verificationNotes?: string;
}

export type NewsTopicCategory = 
  | 'all'
  | 'vtr'
  | 'bihar'
  | 'india'
  | 'tiger_conservation'
  | 'wildlife'
  | 'biodiversity'
  | 'human_wildlife_conflict'
  | 'research'
  | 'official_updates';

export interface NewsArticle {
  id: string;
  headline: string;
  publicationDate: string;
  publicationTime?: string;
  source: string; // Newspaper / Source name e.g. Times of India, The Hindu, Dainik Jagran
  sourceLink: string; // Working link to original article
  externalUrl?: string; // Direct link to original article
  sourceCategory: 'Forest Department' | 'NTCA / MoEFCC' | 'WII Research' | 'Established Media' | string;
  topicCategory?: NewsTopicCategory | string;
  summary: string;
  keyTakeaways?: string[];
  content?: string;
  verificationStatus: VerificationLevel;
  retrievedDate: string;
  tags: string[];
  imageUrl?: string;
  isLive?: boolean;
  isPinned?: boolean;
  pinned?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  status?: 'approved' | 'rejected' | 'pending';
  sourceAttribution?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  officialSourceRef?: string;
  language?: 'en' | 'hi' | 'ur';
  likes?: number;
  dislikes?: number;
  workflowStatus?: EditorialStatus;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl?: string;
  type: 'rss' | 'api' | 'gov_portal' | 'manual' | 'research' | 'media' | 'newspaper';
  enabled: boolean;
  trustLevel: 'official' | 'research' | 'media';
  lastChecked: string;
  checkStatus: 'active' | 'synced' | 'pending' | 'error';
  category?: string;
  isAutoSync?: boolean;
  language?: 'en' | 'hi' | 'ur';
}

export interface WildlifeSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'mammal' | 'bird' | 'reptile' | 'amphibian' | 'flora';
  iucnStatus: IUCNStatus;
  vtrHabitat: string;
  description: string;
  populationTrend: 'Increasing' | 'Stable' | 'Decreasing' | 'Unknown';
  image: string;
  keyFeatures: string[];
  threats: string[];
}

export interface ConservationAlert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'advisory' | 'seasonal' | 'info';
  date: string;
  issuedDate?: string;
  affectedRange?: string;
  affectedZone?: string;
  description: string;
  guidance?: string;
  source?: string;
  issuingAuthority?: string;
  active: boolean;
  hotlineContact?: string;
  verified?: boolean;
  verifiedDate?: string;
  verifiedSource?: string;
  verifiedBy?: string;
  alertType?: 'advisory' | 'wildlife_safety' | 'forest_closure' | 'visitor_notice' | 'emergency';
  isSampleData?: boolean;
}

export interface VisitorLocation {
  id: string;
  name: string;
  nameHi: string;
  nameUr: string;
  range: string;
  category: 'gate' | 'river' | 'historical' | 'watchtower' | 'stay' | 'town' | 'zone';
  elevation: string;
  coordinates: { lat: number; lng: number };
  coordsDisplay: string;
  howToReach: string;
  howToReachHi: string;
  attractions: string[];
  description: string;
  descriptionHi: string;
  isLive?: boolean;
  verifiedSource?: string;
}

export interface WildlifeSighting {
  id: string;
  species: string;
  count?: number;
  numberOfAnimals?: number;
  observationDate?: string;
  date?: string;
  timeOfDay?: string;
  observationTime?: string;
  approximateZone?: string;
  generalLocation?: string;
  generalLandmark?: string;
  safeDescription?: string;
  behavior?: string;
  verificationStatus: 'pending' | 'verified' | 'flagged' | 'under_review' | 'reported';
  submittedAt?: string;
  reporterName?: string;
  observer?: string;
  hasPhoto?: boolean;
  photoUrl?: string;
  isLive?: boolean;
  verifiedDate?: string;
  verifiedBy?: string;
  officialNote?: string;
}

export type SightingReport = WildlifeSighting;


export type ResearchCategory =
  | 'Tiger Conservation Research'
  | 'Wildlife & Biodiversity'
  | 'Habitat & Forest Conservation'
  | 'Human-Wildlife Conflict'
  | 'Tiger Population & Monitoring'
  | 'Wildlife Protection & Management'
  | 'Eco-Tourism & Conservation'
  | 'Community Participation'
  | 'Climate Change & Wildlife'
  | 'Relevant Academic Research'
  // Legacy aliases for backward compatibility
  | 'Tiger Population'
  | 'Biodiversity & Flora'
  | 'Human-Wildlife Coexistence'
  | 'Transboundary Ecology';

export type PublicationStatus =
  | 'draft'
  | 'pending_verification'
  | 'published' // Verified / Published
  | 'rejected'
  | 'unpublished';

export interface ResearchReport {
  id: string;
  title: string;
  authors: string;
  organization: string;
  year: number;
  publicationDate?: string;
  category: ResearchCategory;
  abstract: string;
  keyFindings: string[];
  relevance?: string; // Relevance to tiger conservation
  source?: string; // Source / Publisher name
  doi?: string; // Official DOI or publication identifier
  officialUrl?: string; // Official link
  originalSourceLink?: string; // Admin-verified original source link
  downloadUrl?: string; // Download / full text link
  publicationType?: 'vtw_original' | 'external';
  status: PublicationStatus;
  language?: 'en' | 'hi' | 'ur' | 'bilingual';
  tags?: string[];
  coverImage?: string;
  citation: string;
  verified: boolean; // Strictly true only if source has been verified
  verifiedBy?: string;
  verifiedDate?: string;
  verificationNotes?: string;
  likes?: number;
  dislikes?: number;
  workflowStatus?: EditorialStatus;
}

export interface EducationItem {
  id: string;
  title: string;
  category: 'Tiger Anatomy' | 'Track & Signs' | 'Eco-Ethics' | 'Ecosystem Roles';
  summary: string;
  content: string;
  keyTakeaways: string[];
  interactiveQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface EcotourismZone {
  id: string;
  name: string;
  rangeBeat: string;
  highlights: string[];
  safariType: string;
  bestSeason: string;
  entryGate: string;
  ecoRules: string[];
  accommodations: string;
}

export interface CommunityInitiative {
  id: string;
  title: string;
  community: string;
  description: string;
  impactMetrics: string;
  activities: string[];
  coordinator: string;
}

export type VerificationStatusTag = 'verified_current' | 'verified_older' | 'recently_updated' | 'unavailable';

export interface VerifiedStatistic {
  id: string;
  category: 'global' | 'asia' | 'india' | 'vtr' | 'mortality' | 'habitat';
  title: string;
  value: string;
  numericValue?: number;
  unit?: string;
  confidenceRange?: string; // e.g. "3,167–3,925"
  previousValue?: string;
  status: VerificationStatusTag;
  sourceOrganization: string;
  reportName: string;
  assessmentYear: number | string;
  publicationDate: string;
  lastVerifiedDate: string;
  officialSourceUrl: string;
  methodologySummary: string;
  notes?: string;
  updateHistory?: {
    date: string;
    previousVal: string;
    newVal: string;
    verifiedBy: string;
    source: string;
  }[];
}

export interface TigerCountryData {
  id: string;
  country: string;
  continent: 'Asia' | 'Eurasia';
  estimatedPopulation: string;
  populationRange?: string;
  trend: 'Increasing' | 'Stable' | 'Decreasing' | 'Critically Endangered' | 'Extinct in Wild';
  assessmentYear: number | string;
  sourceOrg: string;
  sourceUrl: string;
  lastVerified: string;
  majorHabitats: string[];
  protectedAreas: string[];
  landscapeHighlights: string;
  statusTag: VerificationStatusTag;
}

export interface AllIndiaEstimationEntry {
  cycle: string;
  year: number;
  meanPopulation: number;
  lowerConfidence?: number;
  upperConfidence?: number;
  source: string;
  reportTitle: string;
  status: 'Completed Official' | 'Upcoming Assessment';
}

export interface SightseeingAttraction {
  id: string;
  name: string;
  category: 'safari' | 'temple' | 'river' | 'trail' | 'heritage';
  distanceFromValmikinagar: string;
  description: string;
  visitingInformation: string;
  timings: string;
  entryPermit: string;
  officialSource: string;
  photoUrl: string;
  mapLocation: string;
}

export interface LocalCuisineItem {
  id: string;
  name: string;
  localNameHindi: string;
  localNameUrdu: string;
  origin: 'Valmikinagar / Tharu' | 'West Champaran' | 'Bihar' | 'Gandak River Basin';
  type: 'traditional_heritage' | 'staple_dish' | 'festive_delicacy' | 'beverage';
  description: string;
  authenticityDetails: string;
  isTraditionalFood: boolean;
  culturalNote: string;
  photoUrl: string;
}

export interface TransitInfo {
  mode: 'road' | 'rail' | 'air' | 'local';
  title: string;
  routes: {
    origin: string;
    distance: string;
    duration: string;
    details: string;
  }[];
  nearestPoints: {
    name: string;
    distance: string;
    code?: string;
    type: string;
  }[];
  permitInfo: string;
  source: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'tigers' | 'biodiversity' | 'landscape' | 'patrol' | 'community';
  caption: string;
  locationGeneral: string;
  photographer: string;
  year: string;
  imageUrl: string;
}

export type VolunteerInterestArea =
  | 'Tiger Conservation'
  | 'Wildlife Awareness'
  | 'Biodiversity'
  | 'Environmental Education'
  | 'Community Outreach'
  | 'Research & Documentation'
  | 'Photography / Media'
  | 'Eco-Tourism Awareness'
  | 'Social Media / Digital Support'
  | 'Other';

export interface VolunteerSubmission {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  cityDistrict: string;
  state: string;
  country: string;
  preferredLanguage: string;
  areasOfInterest: VolunteerInterestArea[];
  relevantSkills: string;
  availability: string;
  whyVolunteer: string;
  consentContact: boolean;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'approved';
  notes?: string;
  syncedToGoogleForm?: boolean;
}

export type SupporterOption =
  | 'Conservation Awareness'
  | 'Wildlife Education'
  | 'Research Support'
  | 'Community Outreach'
  | 'Digital / Technical Support'
  | 'Media & Publicity'
  | 'Voluntary Contribution'
  | 'Other';

export interface SupporterSubmission {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  cityDistrict: string;
  state: string;
  country: string;
  preferredLanguage: string;
  supportOptions: SupporterOption[];
  messageComments: string;
  consentContact: boolean;
  submittedAt: string;
  status: 'pending' | 'acknowledged' | 'engaged';
  notes?: string;
  syncedToGoogleForm?: boolean;
}

export interface AppIntegrationSettings {
  volunteerGoogleFormUrl: string;
  supporterGoogleFormUrl: string;
  contactEmail: string;
  isVolunteerRegistrationEnabled: boolean;
  isSupporterRegistrationEnabled: boolean;
  submissionMode: 'direct_google_form' | 'in_app_with_sync';
  volunteerConfirmationMessage: string;
  supporterConfirmationMessage: string;
  lastUpdated?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sourceAttribution?: string;
  suggestedActions?: { label: string; tab?: string; externalUrl?: string; actionType?: 'open_volunteer' | 'open_supporter' | 'navigate' }[];
  isError?: boolean;
}

export interface ChatbotAdminSettings {
  isEnabled: boolean;
  modelName: string;
  systemPrompt: string;
  welcomeMessageEn: string;
  welcomeMessageHi: string;
  welcomeMessageUr: string;
  suggestedQuestions: string[];
  enableSourceAttribution: boolean;
  temperature: number;
  lastUpdated?: string;
}

// ==========================================
// VTR REAL-TIME WEATHER TYPES
// ==========================================
export interface WeatherConditionInfo {
  code: number;
  label: { en: string; hi: string; ur: string };
  iconType: 'clear-day' | 'clear-night' | 'cloudy' | 'partly-cloudy-day' | 'partly-cloudy-night' | 'rain' | 'heavy-rain' | 'thunderstorm' | 'fog' | 'snow';
}

export interface WeatherAlert {
  id: string;
  severity: 'advisory' | 'warning' | 'severe';
  type: 'heavy_rainfall' | 'thunderstorm' | 'extreme_heat' | 'strong_winds' | 'poor_visibility';
  title: { en: string; hi: string; ur: string };
  description: { en: string; hi: string; ur: string };
  forestImpact: { en: string; hi: string; ur: string };
  triggeredAt: string;
}

export interface CurrentWeatherData {
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidity: number;
  precipitationMm: number;
  rainProbability: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  windSpeedKmH: number;
  windDirectionDeg: number;
  windCompass: string;
  visibilityMeters: number | null;
  uvIndex: number | null;
  isDay: boolean;
  timestamp: string;
}

export interface HourlyForecastItem {
  time: string;
  hourDisplay: string;
  temperatureC: number;
  rainProbability: number;
  precipitationMm: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  relativeHumidity: number;
  windSpeedKmH: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: { en: string; hi: string; ur: string };
  tempMaxC: number;
  tempMinC: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  rainProbabilityMax: number;
  precipitationSumMm: number;
  windSpeedMaxKmH: number;
  uvIndexMax: number | null;
  sunrise: string;
  sunset: string;
}

export interface VTRZoneCoordinate {
  id: string;
  name: string;
  rangeName: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  description: string;
}

export interface VTRWeatherResponse {
  success: boolean;
  location: {
    name: string;
    zoneId: string;
    zoneName: string;
    rangeName: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    elevationMeters: number;
  };
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  alerts: WeatherAlert[];
  lastUpdated: string;
  apiSourceTime: string;
  dataSource: string;
  dataSourceUrl: string;
  cached: boolean;
  stale?: boolean;
  error?: string;
}

export interface WeatherAdminSettings {
  provider: 'open-meteo' | 'custom';
  apiKey?: string;
  defaultZoneId: string;
  refreshIntervalMinutes: number;
  enableWeatherAlerts: boolean;
  enableWeatherCard: boolean;
  dataSourceAttribution: string;
  lastUpdated?: string;
}

export interface TigerPledgeCertificate {
  id: string;
  certificateId?: string; // Standard alias for id
  certificateNumber: string; // e.g. VTW-2026-000001
  pledgeId?: string; // Unique permanent pledge identifier
  fullName: string;
  participantName?: string; // Standard alias for fullName
  cityAndState: string;
  country: string;
  email?: string; // Optional, private, never displayed publicly
  organization?: string; // Optional organisation / institution
  pledgeDate: string; // Issue/pledge date string
  issueDate?: string; // Standard alias for pledgeDate
  pledgeFormattedDate?: string;
  language: 'en' | 'hi' | 'ur';
  status: 'valid' | 'revoked' | 'active';
  revokedAt?: string;
  revocationReason?: string;
  issuedAt: string;
  createdAt: string;
  verificationHash?: string;
  isLocallyStored?: boolean;
  consentPublicTicker?: boolean;
}

export interface CertificateAdminSettings {
  numberingPrefix: string; // e.g. 'VTW-TPP'
  certificatePrefix?: string; // optional alias
  numberingYearFormat: 'YYYY' | 'YY';
  nextSequence: number;
  customLogoUrl?: string;
  customSignatureUrl?: string;
  signatureName: string;
  signatureTitle: string;
  signatureOrg: string;
  designTheme: 'royal-emerald-gold' | 'classic-parchment' | 'heritage-green';
  borderStyle: 'ornate-double' | 'geometric-gold' | 'classical-filigree';
  headerText: { en: string; hi: string; ur: string };
  titleText: { en: string; hi: string; ur: string };
  presentedToText: { en: string; hi: string; ur: string };
  pledgeBodyText: { en: string; hi: string; ur: string };
  disclaimerText: { en: string; hi: string; ur: string };
  lastUpdated?: string;
}

// ==========================================
// VTW ADMIN & AUTHENTICATION TYPES
// ==========================================
export interface AdminUser {
  email?: string;
  name?: string;
  photoUrl?: string;
  role: 'administrator';
  isPrimaryOwner: boolean;
}

export interface AdminSession {
  sessionToken: string;
  admin: AdminUser;
  expiresAt: number;
}

export interface AdminAuditLogEntry {
  id: string;
  adminEmail: string;
  action: string;
  recordType: 'auth' | 'volunteer' | 'supporter' | 'pledge' | 'certificate' | 'news' | 'sighting' | 'alert' | 'tiger' | 'settings' | 'backup';
  recordId?: string;
  timestamp: string;
  result: 'success' | 'failure' | 'warning';
  details?: string;
}

export interface VTWAdminSettings {
  officialCommunicationEmail: string;
  lastBackupDate?: string;
  lastUpdated: string;
}

// ==========================================
// GRASSROOTS PROTECTORS OF TIGER PROTECTION
// ==========================================
export type EditorialStatus = 'draft' | 'pending_verification' | 'verified' | 'published' | 'rejected' | 'archived';

export interface GrassrootsProtectorStory {
  id: string;
  protectorName: string;
  role: string;
  location: string;
  photograph: string;
  photoCaption?: string;
  photographerCredit?: string;
  storyTitle: string;
  shortIntro: string;
  fullStory: string;
  achievements: string[];
  date: string;
  source: string;
  sourceUrl?: string;
  verificationStatus: EditorialStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  verificationNotes?: string;
  likes?: number;
  dislikes?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// FEEDBACK SYSTEM
// ==========================================
export type FeedbackCategory = 'App Feedback' | 'Bug Report' | 'News/Content' | 'Suggestion' | 'Other';

export interface FeedbackSubmission {
  id: string;
  name?: string;
  email?: string;
  category: FeedbackCategory;
  message: string;
  status: 'new' | 'reviewed' | 'resolved' | 'archived';
  submittedAt: string;
  deviceInfo?: string;
}

// ==========================================
// RECENT PLEDGES TICKER
// ==========================================
export interface PledgeTickerEntry {
  id: string;
  displayName: string;
  cityAndState: string;
  pledgedAt: string;
  consentPublicTicker: boolean;
  status: 'active' | 'hidden' | 'moderated';
}

// ==========================================
// ENGAGEMENT & VOTING
// ==========================================
export interface EngagementRecord {
  contentId: string;
  contentType: 'news' | 'research' | 'protector';
  likes: number;
  dislikes: number;
}
