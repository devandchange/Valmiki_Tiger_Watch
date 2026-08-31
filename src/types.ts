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
