export type VerificationLevel = 'verified_govt' | 'peer_reviewed' | 'established_media' | 'reputable_media' | 'field_verified' | 'unverified';

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
  status: 'Resident' | 'Transient' | 'Breeding Female' | 'Sub-Adult';
  familyLineage?: string;
  verification: 'verified' | 'reported' | 'unverified';
  photoUrl: string;
  lastVerifiedDate: string;
  sources: string;
  notes: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  publicationDate: string;
  source: string;
  sourceLink: string;
  sourceCategory: 'Forest Department' | 'NTCA / MoEFCC' | 'WII Research' | 'Established Media' | string;
  summary: string;
  content?: string;
  verificationStatus: VerificationLevel;
  retrievedDate: string;
  tags: string[];
  imageUrl?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'api' | 'gov_portal' | 'manual' | 'research' | 'media';
  enabled: boolean;
  trustLevel: 'official' | 'research' | 'media';
  lastChecked: string;
  checkStatus: 'active' | 'synced' | 'pending';
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
  affectedRange?: string;
  affectedZone?: string;
  description: string;
  guidance?: string;
  source?: string;
  active: boolean;
  hotlineContact?: string;
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
}

export type SightingReport = WildlifeSighting;


export interface ResearchReport {
  id: string;
  title: string;
  authors: string;
  organization: string;
  year: number;
  category: 'Tiger Population' | 'Biodiversity & Flora' | 'Human-Wildlife Coexistence' | 'Transboundary Ecology';
  abstract: string;
  keyFindings: string[];
  downloadUrl?: string;
  citation: string;
  verified: boolean;
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
