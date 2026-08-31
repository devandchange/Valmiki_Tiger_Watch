import {
  TigerProfile,
  NewsArticle,
  NewsSource,
  WildlifeSpecies,
  ConservationAlert,
  WildlifeSighting,
  ResearchReport,
  EducationItem,
  EcotourismZone,
  CommunityInitiative,
  GalleryItem
} from '../types';

export const INITIAL_TIGERS: TigerProfile[] = [
  {
    id: 'tiger-101',
    code: 'T-101',
    name: 'Rudra (Dominant Male)',
    sex: 'Male',
    approxAge: '7–8 Years',
    markings: 'Distinctive double inverted-Y stripe above right flank, prominent dark patch over left brow.',
    safeTerritory: 'Gonauli – Madanpur Range (Generalized Riverine Sal Sector)',
    cameraTrapRecords: 48,
    lastSightingDate: '2026-08-14',
    status: 'Resident',
    familyLineage: 'Offspring of legendary VTR matriarch T-03; territorial successor in southern riverine flats.',
    verification: 'verified',
    photoUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80',
    lastVerifiedDate: '2026-08-20',
    sources: 'VTR Camera Trap Phase-IV Monitoring Grid & Bihar Forest Dept Census Protocol',
    notes: 'Frequently captured across riverine trail salt-licks; prime physical condition with established territory.'
  },
  {
    id: 'tiger-102',
    code: 'T-102',
    name: 'Megha (Breeding Matriarch)',
    sex: 'Female',
    approxAge: '6 Years',
    markings: 'Symmetrical twin parallel stripes behind left ear; white facial bib extending higher on left cheek.',
    safeTerritory: 'Valmikinagar Core Zone (Foothill Moist Deciduous Canopy)',
    cameraTrapRecords: 62,
    lastSightingDate: '2026-08-02',
    status: 'Breeding Female',
    familyLineage: 'Documented with litter of 3 healthy cubs in 2024–2025 camera-trap census.',
    verification: 'verified',
    photoUrl: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=1000&q=80',
    lastVerifiedDate: '2026-08-18',
    sources: 'NTCA National Camera Trap Database / VTR Forest Division Report',
    notes: 'Crucial breeding individual contributing directly to VTR population rebound.'
  },
  {
    id: 'tiger-103',
    code: 'T-103',
    name: 'Gandak Queen',
    sex: 'Female',
    approxAge: '5 Years',
    markings: 'Broad spearhead-shaped flank pattern on right ribcage; small circular dot near right eye socket.',
    safeTerritory: 'Raghia – Harnatanr Buffer Corridor',
    cameraTrapRecords: 34,
    lastSightingDate: '2026-07-28',
    status: 'Resident',
    familyLineage: 'Daughter of T-102 (confirmed through maternal camera association records).',
    verification: 'verified',
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1000&q=80',
    lastVerifiedDate: '2026-08-10',
    sources: 'WII Habitat Corridor Study & Division Field Range Log',
    notes: 'Exhibits wide ranging patterns across the cane brakes and mixed bamboo slopes.'
  },
  {
    id: 'tiger-104',
    code: 'T-104',
    name: 'Manguraha Striper',
    sex: 'Male',
    approxAge: '4–5 Years',
    markings: 'Thick chevron pattern along spine; clear vertical stripe splitting the dorsal line.',
    safeTerritory: 'Manguraha Range (Eastern High-Canopy Sal Forest)',
    cameraTrapRecords: 29,
    lastSightingDate: '2026-08-11',
    status: 'Resident',
    familyLineage: 'Originates from eastern VTR breeding pool; expanding towards Someshwar ridge.',
    verification: 'verified',
    photoUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1000&q=80',
    lastVerifiedDate: '2026-08-15',
    sources: 'Bihar Forest Department Digital Patrol Log',
    notes: 'Active apex predator patrolling high elevation sal ridges.'
  },
  {
    id: 'tiger-105',
    code: 'T-105',
    name: 'Chiuraha Sub-Adult',
    sex: 'Male',
    approxAge: '2.5 Years',
    markings: 'Fine, closely spaced horizontal stripes across thigh; thin white tip on tail.',
    safeTerritory: 'Chiuraha – Someshwar Foothill Zone',
    cameraTrapRecords: 17,
    lastSightingDate: '2026-07-19',
    status: 'Sub-Adult',
    familyLineage: 'Dispersing sub-adult exploring new territory along the Nepal border foothills.',
    verification: 'reported',
    photoUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1000&q=80',
    lastVerifiedDate: '2026-08-05',
    sources: 'Field Patrol Squad Observation & Automated Trap 14-B',
    notes: 'Transitioning into solitary home range establishment; monitored by special patrol squad.'
  },
  {
    id: 'tiger-108',
    code: 'T-108',
    name: 'Gorgamma Stalker',
    sex: 'Female',
    approxAge: '6.5 Years',
    markings: 'Interlocking zigzag pattern over left shoulder; double dot near tail base.',
    safeTerritory: 'Gobardhana Range (Grassland & Marsh Mosaic)',
    cameraTrapRecords: 41,
    lastSightingDate: '2026-08-09',
    status: 'Resident',
    familyLineage: 'Independent resident female with historical range near seasonal waterholes.',
    verification: 'verified',
    photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=80',
    lastVerifiedDate: '2026-08-22',
    sources: 'VTR Wildlife Division 2026 Monitoring Cycle',
    notes: 'High prey density utilization observed; regularly sighted near natural water bodies.'
  }
];

export const INITIAL_NEWS_SOURCES: NewsSource[] = [
  {
    id: 'source-1',
    name: 'Bihar Environment, Forest & Climate Change Department',
    url: 'https://forest.bihar.gov.in',
    type: 'gov_portal',
    enabled: true,
    trustLevel: 'official',
    lastChecked: '2026-08-31T04:30:00Z',
    checkStatus: 'synced'
  },
  {
    id: 'source-2',
    name: 'National Tiger Conservation Authority (NTCA)',
    url: 'https://ntca.gov.in',
    type: 'gov_portal',
    enabled: true,
    trustLevel: 'official',
    lastChecked: '2026-08-31T03:15:00Z',
    checkStatus: 'synced'
  },
  {
    id: 'source-3',
    name: 'Wildlife Institute of India (WII) Tiger Cell',
    url: 'https://wii.gov.in',
    type: 'research',
    enabled: true,
    trustLevel: 'research',
    lastChecked: '2026-08-30T22:00:00Z',
    checkStatus: 'synced'
  },
  {
    id: 'source-4',
    name: 'Press Information Bureau (PIB) MoEFCC Feed',
    url: 'https://pib.gov.in',
    type: 'rss',
    enabled: true,
    trustLevel: 'official',
    lastChecked: '2026-08-31T05:00:00Z',
    checkStatus: 'synced'
  },
  {
    id: 'source-5',
    name: 'Reputable Environmental Media Desk (PTI / The Hindu / TOI)',
    url: 'https://thehindu.com/sci-tech/energy-and-environment',
    type: 'media',
    enabled: true,
    trustLevel: 'media',
    lastChecked: '2026-08-31T01:45:00Z',
    checkStatus: 'synced'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-001',
    headline: 'Valmiki Tiger Reserve Records Surge in Tiger Population to Over 54 Individuals in Latest State Assessment',
    publicationDate: '2026-07-29',
    source: 'Bihar Environment, Forest and Climate Change Department & NTCA Data',
    sourceLink: 'https://forest.bihar.gov.in',
    sourceCategory: 'Forest Department',
    summary: 'Intensive camera trap surveys and DNA scat sampling across 899 sq km confirm continued population growth at VTR, propelled by enhanced grassland management, anti-poaching camps, and transboundary corridor health with Nepal.',
    content: 'Valmiki Tiger Reserve (VTR) in West Champaran district has solidified its position as one of India’s most dramatic conservation success stories. From an estimated count of just 8 tigers in 2006, the latest synchronized state-wide and NTCA camera-trapping census indicates over 54 resident and breeding tigers. Special focus on waterhole replenishment, removal of invasive weeds, and community-led Van Suraksha Samitis has expanded prey density significantly.',
    verificationStatus: 'verified_govt',
    retrievedDate: '2026-08-28',
    tags: ['Tiger Census', 'Population Growth', 'NTCA', 'Habitat Management'],
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'news-002',
    headline: 'Gandak River Gharial Conservation Project Achieves Record Hatchling Success Near Valmiki Foothills',
    publicationDate: '2026-06-18',
    source: 'Wildlife Trust of India (WTI) & Bihar Forest Dept Release',
    sourceLink: 'https://wti.org.in',
    sourceCategory: 'WII Research',
    summary: 'Over 120 critically endangered Gharial hatchlings successfully emerged from monitored sandbank nests along the Gandak River stretch adjoining Valmiki Tiger Reserve.',
    content: 'Collaborative river patrol teams and local community nest-guardians recorded outstanding hatching rates along the tranquil sandbars of the Gandak River. Seasonal fishing restrictions and community awareness campaigns along the Valmikinagar barrage have dramatically lowered net entanglement hazards.',
    verificationStatus: 'field_verified',
    retrievedDate: '2026-08-25',
    tags: ['Gharial', 'Gandak River', 'Reptile Conservation', 'Community Guardians'],
    imageUrl: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'news-003',
    headline: 'M-STrIPES Digital Patrolling Network Expanded Across All 8 Forest Ranges in VTR',
    publicationDate: '2026-05-12',
    source: 'National Tiger Conservation Authority (NTCA) Operational Bulletin',
    sourceLink: 'https://ntca.gov.in',
    sourceCategory: 'NTCA / MoEFCC',
    summary: 'Frontline forest guards in Valmiki have completed full migration to GPS-enabled M-STrIPES app devices, providing real-time spatial coverage of foot patrols and anti-poaching sweeps.',
    content: 'With over 120 electronic patrol units active daily across challenging terrain including Someshwar hills and swampy riverine tracts, the M-STrIPES system enables instant logging of animal signs, human intrusions, and habitat disturbances, which feeds directly into the central control cell in Bettiah.',
    verificationStatus: 'verified_govt',
    retrievedDate: '2026-08-20',
    tags: ['M-STrIPES', 'Anti-Poaching', 'Smart Patrolling', 'Technology'],
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'news-004',
    headline: 'Grassland Rejuvenation Drive Adds 350 Hectares of High-Nutrition Forage for Herbivore Prey Base',
    publicationDate: '2026-04-05',
    source: 'Valmiki Tiger Conservation Foundation Annual Bulletin',
    sourceLink: 'https://forest.bihar.gov.in',
    sourceCategory: 'Forest Department',
    summary: 'Targeted weed eradication and native grass replanting (Imperata cylindrica and Saccharum spontaneum) have expanded grazing areas for chital, sambar, and gaur.',
    content: 'A robust tiger population requires a dense ungulate prey base. By actively managing micro-grasslands and establishing solar-powered borewells in dry forest interiors, herbivores no longer need to venture toward agricultural fringes, effectively reducing human-wildlife encounters.',
    verificationStatus: 'verified_govt',
    retrievedDate: '2026-08-15',
    tags: ['Grasslands', 'Prey Base', 'Habitat Ecology', 'Chital'],
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'news-005',
    headline: 'Indo-Nepal Transboundary Tiger Working Group Convenes to Strengthen Chitwan-Valmiki Ecological Linkages',
    publicationDate: '2026-03-22',
    source: 'Ministry of Environment, Forest & Climate Change (MoEFCC) Press Statement',
    sourceLink: 'https://pib.gov.in',
    sourceCategory: 'NTCA / MoEFCC',
    summary: 'Senior wildlife officials and scientists from India and Nepal agreed on joint anti-poaching border patrols, shared camera-trap data protocols, and unhindered wildlife corridor protection.',
    content: 'The contiguous forest belt comprising Valmiki Tiger Reserve in Bihar, Chitwan National Park, and Parsa National Park in Nepal forms one of the most critical tiger recovery landscapes in South Asia. The joint agreement ensures coordinated enforcement against illegal wildlife trade networks and synchronized genetic dispersal studies.',
    verificationStatus: 'verified_govt',
    retrievedDate: '2026-08-10',
    tags: ['Transboundary', 'Chitwan National Park', 'Nepal', 'Corridors'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
  }
];

export const INITIAL_WILDLIFE: WildlifeSpecies[] = [
  {
    id: 'sp-tiger',
    commonName: 'Royal Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    category: 'mammal',
    iucnStatus: 'EN',
    vtrHabitat: 'Dense Sal forests, Cane brakes, Riverine alluvial grasslands, Foothill slopes',
    description: 'The apex predator and ecological keystone of Valmiki. VTR represents the only tiger reserve in Bihar and a vital anchor in the Terai-Arc Landscape.',
    populationTrend: 'Increasing',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Distinctive black stripes on reddish-orange coat', 'Exceptional swimmer and ambush predator', 'Individual stripe pattern as unique as human fingerprint'],
    threats: ['Historical habitat fragmentation', 'Human-wildlife fringe friction', 'Linear infrastructure pressures']
  },
  {
    id: 'sp-leopard',
    commonName: 'Indian Leopard',
    scientificName: 'Panthera pardus fusca',
    category: 'mammal',
    iucnStatus: 'VU',
    vtrHabitat: 'Rocky ravines, Someshwar hilly tracts, Buffer mixed deciduous woodlands',
    description: 'Highly adaptable co-predator sharing VTR with tigers; master of stealth across the rugged hills and canopy perches.',
    populationTrend: 'Stable',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Rosette-patterned golden-yellow coat', 'Supreme arboreal climbing ability', 'Solitary and nocturnal hunting'],
    threats: ['Prey competition', 'Accidental snare encounters', 'Retaliatory conflicts on reserve boundaries']
  },
  {
    id: 'sp-sloth-bear',
    commonName: 'Sloth Bear',
    scientificName: 'Melursus ursinus',
    category: 'mammal',
    iucnStatus: 'VU',
    vtrHabitat: 'Hilly bamboo brakes, Termite-rich forest floor, Rock crevices of Manguraha',
    description: 'Myrmecophagous bear species specialized in feeding on termites, ants, and seasonal forest fruits like Mahua and Ber.',
    populationTrend: 'Stable',
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Shaggy black coat with whitish Y-shaped chest mark', 'Long curved ivory claws for digging', 'Loud vacuum-like feeding suction'],
    threats: ['Seasonal fruit foraging near agricultural fields', 'Habitat disturbance']
  },
  {
    id: 'sp-gaur',
    commonName: 'Indian Bison / Gaur',
    scientificName: 'Bos gaurus',
    category: 'mammal',
    iucnStatus: 'VU',
    vtrHabitat: 'Madanpur and Gonauli moist mixed forests, Alluvial glades',
    description: 'The largest extant bovine on Earth. Massive herds thrive in VTR’s regenerated grasslands, serving as vital high-calorie prey for adult tigers.',
    populationTrend: 'Increasing',
    image: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Massive muscular build with prominent dorsal ridge', 'White stocking-like legs', 'Curved horns with yellow-tinted bases'],
    threats: ['Cattle disease transmission (FMD)', 'Invasive weed encroachment on grasslands']
  },
  {
    id: 'sp-elephant',
    commonName: 'Asian Elephant',
    scientificName: 'Elephas maximus',
    category: 'mammal',
    iucnStatus: 'EN',
    vtrHabitat: 'Transboundary corridors linking Chitwan (Nepal) with Someshwar & Raghia',
    description: 'Migratory mega-herbivore herds move seasonally through VTR, creating natural forest openings and dispersing seed species.',
    populationTrend: 'Stable',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Massive ears and prehensile trunk', 'Complex matriarchal family social structure', 'Crucial ecosystem engineering capacity'],
    threats: ['Corridor bottlenecking', 'Crop-raiding tension in border villages']
  },
  {
    id: 'sp-gharial',
    commonName: 'Gharial (Fish-eating Crocodile)',
    scientificName: 'Gavialis gangeticus',
    category: 'reptile',
    iucnStatus: 'CR',
    vtrHabitat: 'Gandak River deep pools, Sandbanks near Valmikinagar',
    description: 'Critically endangered fish-eating crocodilian with long, slender snout. The Gandak population adjoining VTR is one of its major global strongholds.',
    populationTrend: 'Increasing',
    image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Elongated narrow jaws with 110 interlocking teeth', 'Bulbous nasal boss (ghara) in adult males', 'Solely specialized for piscivory'],
    threats: ['Riverbed sand mining', 'Entanglement in monofilament nylon fishing nets']
  },
  {
    id: 'sp-hornbill',
    commonName: 'Great Hornbill',
    scientificName: 'Buceros bicornis',
    category: 'bird',
    iucnStatus: 'VU',
    vtrHabitat: 'Old-growth high Sal canopy, Someshwar foothill ridges',
    description: 'Majestic canopy bird with iconic golden casque; the chief seed disperser of massive fig and primary rainforest trees.',
    populationTrend: 'Stable',
    image: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Massive bright yellow/orange bill and casque', 'Resonant whooshing wing sound during flight', 'Nesting in hollow tree trunks'],
    threats: ['Loss of giant nesting hollow trees', 'Canopy fragmentation']
  },
  {
    id: 'sp-florican',
    commonName: 'Bengal Florican',
    scientificName: 'Houbaropsis bengalensis',
    category: 'bird',
    iucnStatus: 'CR',
    vtrHabitat: 'Tall alluvial Terai grasslands (Phragmites & Saccharum glades)',
    description: 'One of the world’s rarest bustards, known for the male’s dramatic aerial courtship display leaping above tall grass.',
    populationTrend: 'Decreasing',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Striking black, white, and brown plumage', 'Spectacular vertical display flight in spring', 'Strict grassland habitat specialist'],
    threats: ['Grassland conversion', 'Unseasonal grass burning']
  },
  {
    id: 'sp-sal',
    commonName: 'Sal Tree (Dominant Flora)',
    scientificName: 'Shorea robusta',
    category: 'flora',
    iucnStatus: 'LC',
    vtrHabitat: 'Dominates over 75% of VTR forest canopy across valleys and ridges',
    description: 'The foundation species of Valmiki’s tropical moist and dry deciduous ecosystem, providing dense leaf litter and high canopy cover.',
    populationTrend: 'Stable',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    keyFeatures: ['Straight-trunked hardwood reaching 30+ meters', 'Dense umbrella canopy shielding soil moisture', 'Heartwood resistant to pests and rot'],
    threats: ['Climate-induced moisture stress', 'Forest fires']
  }
];

export const INITIAL_ALERTS: ConservationAlert[] = [
  {
    id: 'alert-01',
    title: 'Monsoon High Riverflow Advisory: Gandak Riparian Corridor',
    severity: 'advisory',
    date: '2026-08-28',
    affectedZone: 'Madanpur & Valmikinagar Riparian Fringe',
    description: 'Seasonal heavy rainfall across the Nepal catchment has raised Gandak river levels. Wildlife movements towards higher interior ridges are actively monitored.',
    guidance: 'All river safari trails are temporarily redirected to higher forest tracks. Visitors and buffer village residents must maintain minimum 500m distance from swollen bank verges.',
    active: true,
    hotlineContact: '+91 6254 232144 (VTR Control Room, Bettiah)'
  },
  {
    id: 'alert-02',
    title: '24/7 Anti-Poaching & Wildlife Distress Helpline Active',
    severity: 'info',
    date: '2026-08-01',
    affectedZone: 'All 8 Ranges of Valmiki Tiger Reserve',
    description: 'Public reporting mechanism for injured wildlife, snare sightings, or suspicious movements along the reserve perimeter.',
    guidance: 'If you encounter any wildlife in distress, do not crowd or approach. Immediately alert the range forest officer or dial the toll-free forest helpline.',
    active: true,
    hotlineContact: 'Toll-Free: 1800-345-6188 / Control: +91 94318 10000'
  },
  {
    id: 'alert-03',
    title: 'Seasonal Grassland Regeneration & Controlled Micro-Burning Concluded',
    severity: 'seasonal',
    date: '2026-06-15',
    affectedZone: 'Gobardhana & Gonauli Grassland Sectors',
    description: 'Planned ecological early-season burn cycle successfully completed to rejuvenate palatable shoot growth for herbivorous deer and gaur.',
    guidance: 'Grassland zones have reopened for authorized scientific tracking and safari routes under designated speed limits (max 20 km/h).',
    active: false,
    hotlineContact: '+91 6254 232144'
  }
];

export const INITIAL_RESEARCH: ResearchReport[] = [
  {
    id: 'rep-01',
    title: 'Status of Tigers, Co-predators & Prey in India: Valmiki Tiger Reserve Chapter',
    authors: 'Dr. Y.V. Jhala, Dr. Qamar Qureshi, Wildlife Institute of India & NTCA',
    organization: 'National Tiger Conservation Authority & Wildlife Institute of India',
    year: 2023,
    category: 'Tiger Population',
    abstract: 'Comprehensive camera-trapping and occupancy assessment of VTR within the Terai Arc Landscape. Documents the trajectory of tiger density recovery, spatial distribution, and genetic continuity with Nepal’s Chitwan ecosystem.',
    keyFindings: [
      'Tiger numbers demonstrated a steady upward curve reaching 54+ individuals.',
      'Breeding female density highest in Valmikinagar and Gonauli sectors.',
      'High co-occurrence of leopards and sloth bears without significant competitive exclusion.'
    ],
    citation: 'NTCA/WII (2023). Status of Tigers, Co-predators & Prey in India. MoEFCC, New Delhi.',
    verified: true
  },
  {
    id: 'rep-02',
    title: 'Ecological Connectivity and Transboundary Gene Flow between Chitwan National Park and Valmiki Tiger Reserve',
    authors: 'Conservation Biology Research Consortium',
    organization: 'Wildlife Institute of India & IUCN Asian Species Specialist Group',
    year: 2024,
    category: 'Transboundary Ecology',
    abstract: 'Genetic profiling through non-invasive fecal DNA sampling confirms active cross-border breeding dispersal across the Someshwar Range and riverine corridors.',
    keyFindings: [
      'Confirmed bidirectional tiger migration between Nepal and Bihar.',
      'Transboundary landscape acts as a singular contiguous metapopulation.',
      'Need for unified patrol coordination and synchronized anti-snare operations.'
    ],
    citation: 'TAL Ecology Journal, Vol. 18, Issue 2, pp. 112-129.',
    verified: true
  },
  {
    id: 'rep-03',
    title: 'Gharial (Gavialis gangeticus) Population Dynamics and Nesting Ecology in Gandak River',
    authors: 'Aquatic Wildlife Ecology Team',
    organization: 'Wildlife Trust of India & Bihar Forest Department',
    year: 2025,
    category: 'Biodiversity & Flora',
    abstract: 'Longitudinal study on the Gandak river sub-population following targeted conservation release and community sandbank protection programs.',
    keyFindings: [
      'Recruitment of wild-born hatchlings increased by 38% over five seasons.',
      'Identified critical nesting sandbars requiring seasonal navigation controls.',
      'Local fishermen integration reduced net entanglement fatalities by 72%.'
    ],
    citation: 'Herpetological Conservation Journal, 2025.',
    verified: true
  }
];

export const INITIAL_EDUCATION: EducationItem[] = [
  {
    id: 'edu-01',
    title: 'Decoding Tiger Pugmarks: The Field Guide to Track & Sign Identification',
    category: 'Track & Signs',
    summary: 'Learn how wildlife biologists and forest trackers determine tiger sex, age class, and gait from paw impressions left in mud and sand.',
    content: `A tiger's paw print is called a 'Pugmark' (PML = Pugmark Length, PMB = Pugmark Breadth).
    
1. Sex Differentiation:
   • Male Tigers: The overall shape fits into a square box. The main pad is wider at the base, and toe prints tend to be more rounded and compact.
   • Female Tigers: The overall shape fits into a vertical rectangle. The main pad is narrower and toes appear more elongated and oval.

2. Front vs Hind Paws:
   • Front Pugmarks are noticeably larger and rounder to bear the tiger's upper body mass.
   • Hind Pugmarks are narrower and typically step into or near the front track ('direct registering') during normal stalking gait.

3. Straddle & Stride Analysis:
   • A tiger walks with a relaxed, low-energy swagger. When running or chasing prey, stride length expands from ~80cm to over 2.5 meters.`,
    keyTakeaways: [
      'Male pugmarks fit into a square; female pugmarks fit into a rectangle.',
      'Hind feet step directly behind or inside the front track.',
      'Pugmark tracking forms the backbone of ground-level forest patrol validation.'
    ],
    interactiveQuiz: {
      question: 'When analyzing a fresh tiger pugmark in moist river sand, how do field trackers distinguish a male from a female tiger?',
      options: [
        'Male tracks always show sharp claw marks, females do not',
        'A male pugmark generally fits inside a square box; female pugmark fits an elongated rectangle',
        'Females have 5 toes visible while males have only 4',
        'Male tracks are always found exclusively in hill zones'
      ],
      correctIndex: 1,
      explanation: 'Tiger claws are retractile and do not show during normal walking. The definitive morphological ratio is that a male pugmark contour fits a square, whereas a female pad is narrower and fits an elongated rectangle.'
    }
  },
  {
    id: 'edu-02',
    title: 'The Solitary Apex: Why Tigers Require Huge Contiguous Territories',
    category: 'Ecosystem Roles',
    summary: 'Understand the carrying capacity of tropical forests and why an adult male tiger guards 50–100 sq km of prime territory.',
    content: `Tigers are obligate carnivores and solitary apex predators. A healthy adult tiger requires approximately 50 to 60 medium-to-large ungulates (such as chital, sambar, or wild boar) per year to survive.

Because herbivores are dispersed across vast landscapes based on grass and water availability, a single tiger needs a large, contiguous forest territory to sustain enough prey without exhausting the localized ecosystem. When forests become fragmented by highways or settlements, young tigers are forced into human-dominated peripheries, leading to conflict. Protecting tiger reserves protects entire river watersheds, hundreds of bird species, and ancient carbon-sequestering forests.`,
    keyTakeaways: [
      'One adult tiger consumes ~50 large ungulates annually.',
      'Tigers mark their territory using scent sprays, tree scrape marks, and vocal roaring.',
      'Saving the tiger (umbrella species) automatically shelters all smaller flora and fauna.'
    ],
    interactiveQuiz: {
      question: 'Why is the Tiger termed an "Umbrella Species" in wildlife ecology?',
      options: [
        'Because tigers prefer hunting during heavy monsoon rainstorms',
        'Because protecting tigers requires saving vast ecosystems that automatically safeguard thousands of other species',
        'Because its curved stripes resemble the ribs of an umbrella',
        'Because it sleeps beneath the dense canopy of Sal trees'
      ],
      correctIndex: 1,
      explanation: 'As an umbrella species, conserving the tiger requires preserving large, healthy, interconnected forest tracts, which inherently protects all biodiversity, river basins, and flora beneath it.'
    }
  },
  {
    id: 'edu-03',
    title: 'Tiger Reserve Code of Conduct: Responsible Wildlife Ethics',
    category: 'Eco-Ethics',
    summary: 'Essential behavioral rules for nature enthusiasts, photographers, and visitors inside core and buffer zones.',
    content: `When entering Valmiki Tiger Reserve, remember you are entering the tiger’s home:

1. Absolute Silence: Loud music, shouting, or honking causes severe distress to animals and can trigger defensive aggression.
2. No Alighting from Vehicles: Never step down from authorized safari vehicles except at designated watchtowers.
3. Zero Litter & Plastic: Carry back every piece of trash. Plastic ingestion is fatal for herbivores like spotted deer.
4. Camouflage Clothing: Wear muted earthy tones (olive green, khaki, brown, beige). Avoid bright reds, neon yellows, and reflective jackets.
5. No Flash Photography: Camera flashes startle nocturnal predators and can temporarily blind animals in dense understory.`,
    keyTakeaways: [
      'Maintain complete silence and follow safari naturalist instructions.',
      'Never disembark from vehicles in forest routes.',
      'Wear earthy colors and strictly prohibit flash photography.'
    ],
    interactiveQuiz: {
      question: 'What is the recommended color palette for clothing when embarking on an ecotourism safari in VTR?',
      options: [
        'Bright neon pink and reflective silver for high visibility',
        'Muted earthy colors like olive green, khaki, brown, and beige',
        'Pure white so tigers can clearly see you approaching',
        'Black leather jackets with metal chains'
      ],
      correctIndex: 1,
      explanation: 'Muted natural tones blend into the forest canopy, preventing animals from feeling alarmed or provoked.'
    }
  }
];

export const INITIAL_ECOTOURISM: EcotourismZone[] = [
  {
    id: 'eco-01',
    name: 'Valmikinagar Eco-Tourism Hub',
    rangeBeat: 'Valmikinagar Range (Gandak River Confluence)',
    highlights: ['Gandak River Boating & Sunrise View', 'Cane Brakes Trail', 'Eco-Huts & Canopy Boardwalk', 'Jatashankar Temple Trek'],
    safariType: 'Open Gypsy Safari & Guided Nature Trail',
    bestSeason: 'October to May (Peak pleasant climate Nov–Feb)',
    entryGate: 'Valmikinagar Main Forest Checkpost',
    ecoRules: [
      'Mandatory certified local guide accompaniment',
      'Speed limit strictly capped at 20 km/h',
      'No single-use plastic bottles permitted on forest trails'
    ],
    accommodations: 'Forest Department Eco-Huts, Valmiki Vihar Tourist Lodge, and Local Tharu Community Homestays'
  },
  {
    id: 'eco-02',
    name: 'Manguraha Forest & Hill Sector',
    rangeBeat: 'Manguraha Range (Eastern High-Canopy Sal & Foothills)',
    highlights: ['Pristine Dense Sal Forest Canopies', 'Sloth Bear & Birding Ridge', 'Someshwar Fort Historical Trek', 'Bhikhna Thori Border Point'],
    safariType: 'Jeep Safari & Authorized Hill Walking Escorts',
    bestSeason: 'November to April',
    entryGate: 'Manguraha Range Gate (Narkatiaganj route)',
    ecoRules: [
      'Hill treks require prior forest range permit',
      'No entry after 5:30 PM sunset curfew',
      'Strict adherence to designated safari circuits'
    ],
    accommodations: 'Manguraha Forest Rest House & Community Eco-camps'
  },
  {
    id: 'eco-03',
    name: 'Gobardhana & Gonauli Grassland Zone',
    rangeBeat: 'Gobardhana – Gonauli Sector',
    highlights: ['Expansive Alluvial Grasslands', 'Gaur & Deer Herds Sighting', 'Waterhole Watchtowers', 'Raptor & Vulture Birding'],
    safariType: 'Safari Gypsy with High-Seat Viewing',
    bestSeason: 'December to May',
    entryGate: 'Gobardhana Forest Checkpoint',
    ecoRules: [
      'Maintain 30-meter buffer distance from gaur herds',
      'Watchtower capacity limited to 8 persons at a time',
      'Mobile phones on silent mode throughout the safari'
    ],
    accommodations: 'Gobardhana Eco-Rest Complex & Local Village Cottages'
  },
  {
    id: 'eco-04',
    name: 'Raghia & Harnatanr Cultural Trail',
    rangeBeat: 'Raghia Forest Range',
    highlights: ['Tharu Tribal Cultural Immersion', 'Cane Craft Artisan Workshops', 'Herbal Garden & Butterfly Corridor', 'Night Sky Observation Camp'],
    safariType: 'Cultural Walking Walk & Electric Eco-Cart Tours',
    bestSeason: 'October to March',
    entryGate: 'Harnatanr Eco-Center',
    ecoRules: [
      'Respect tribal privacy and obtain consent before photography',
      'Support community self-help groups directly',
      'Zero alcohol and smoking policy inside reserve premises'
    ],
    accommodations: 'Tharu Heritage Homestays & Community Ecotourism Lodges'
  }
];

export const INITIAL_COMMUNITY: CommunityInitiative[] = [
  {
    id: 'comm-01',
    title: 'Van Suraksha Samiti (Village Forest Protection Committees)',
    community: 'Indigenous Tharu & Uraon Villages of West Champaran',
    description: 'Over 32 fringe villages have organized dedicated community forest defense groups working in tandem with the Forest Department to prevent illegal grazing, monitor snares, and report forest fire sparks.',
    impactMetrics: '450+ Active Volunteer Patrollers covering 24 border forest sectors',
    activities: [
      'Joint perimeter anti-snare foot patrols',
      'Immediate alert dispatch during wildlife straying incidents',
      'Fire-line clearing prior to hot summer dry seasons'
    ],
    coordinator: 'Joint Forest Management Committee (JFMC) & VTR Division'
  },
  {
    id: 'comm-02',
    title: 'Tharu Cane & Bamboo Sustainable Handicraft Livelihoods',
    community: 'Tharu Women Artisan Self-Help Collectives',
    description: 'Empowering local forest-fringe households by substituting timber extraction with sustainably harvested cane furniture, woven baskets, and traditional tiger art sold to eco-tourists.',
    impactMetrics: '280+ Households supported with dignified ecological revenue',
    activities: [
      'Sustainable non-timber forest produce (NTFP) harvesting',
      'Skill enhancement training in modern design aesthetics',
      'Direct fair-trade retail counters at Valmikinagar Eco-Hub'
    ],
    coordinator: 'Valmiki Tiger Conservation Foundation & Local EDCs'
  },
  {
    id: 'comm-03',
    title: 'Local Nature Guide & Wildlife Tracker Certification Program',
    community: 'Youth of West Champaran Fringe Villages',
    description: 'Transforming local youths with unmatched indigenous jungle instincts into certified, bilingual naturalists and birding guides for visiting tourists.',
    impactMetrics: '65+ Certified Youth Guides actively earning sustainable safari fees',
    activities: [
      'Ornithology and track-sign identification masterclasses',
      'First-aid, visitor safety, and conversational English coaching',
      'Ethical wildlife spotting code enforcement'
    ],
    coordinator: 'Ecotourism Development Cell, VTR'
  }
];

export const INITIAL_SIGHTINGS: WildlifeSighting[] = [
  {
    id: 'sight-01',
    species: 'Royal Bengal Tiger (T-101 Rudra)',
    count: 1,
    observationDate: '2026-08-27',
    observationTime: '06:45 AM',
    approximateZone: 'Gonauli – Madanpur Riverine Sector',
    generalLandmark: 'Near Northern Canal Sluice Watchtower Trail',
    safeDescription: 'Large male tiger calmly crossing the sandy jeep track into dense sal undergrowth. Observed from authorized safari vehicle at safe 45m distance.',
    verificationStatus: 'verified',
    submittedAt: '2026-08-27T08:15:00Z',
    reporterName: 'Certified Naturalist Anil Kumar',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sight-02',
    species: 'Gaur Herd (Indian Bison)',
    count: 14,
    observationDate: '2026-08-25',
    observationTime: '04:20 PM',
    approximateZone: 'Gobardhana Range Grassland Pocket',
    generalLandmark: 'Grassland Meadow Near Waterhole No. 4',
    safeDescription: 'Healthy breeding herd with 3 calves grazing peacefully along the regenerating tall grasses. Bull observed displaying dominant stance.',
    verificationStatus: 'verified',
    submittedAt: '2026-08-25T17:30:00Z',
    reporterName: 'Visitor Sandeep M.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sight-03',
    species: 'Sloth Bear with Cub',
    count: 2,
    observationDate: '2026-08-22',
    observationTime: '07:10 AM',
    approximateZone: 'Manguraha Ridge Rocky Outcrop',
    generalLandmark: 'Near Old Ridge Bamboo Curve',
    safeDescription: 'Mother bear carrying cub on her back, foraging near dry termite mound. Moved uphill into rocks upon vehicle approach.',
    verificationStatus: 'verified',
    submittedAt: '2026-08-22T09:00:00Z',
    reporterName: 'Guide Ramesh Tharu',
    hasPhoto: false
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Stalking Through Sal Mist',
    category: 'tigers',
    caption: 'Adult Royal Bengal tiger moving stealthily across the dew-covered sal floor of Valmiki during morning patrol.',
    locationGeneral: 'Valmikinagar Core Forest',
    photographer: 'VTR Field Camera Team',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-02',
    title: 'The Great Indian Bison Gathering',
    category: 'biodiversity',
    caption: 'A magnificent herd of Gaur (Bos gaurus) in prime condition grazing at Gobardhana grassland.',
    locationGeneral: 'Gobardhana Grassland Glades',
    photographer: 'S. Verma / Wildlife Documentation',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-03',
    title: 'Morning Light Over Gandak River Waters',
    category: 'landscape',
    caption: 'Misty sunrise where the Gandak River meanders past the foothills of the Someshwar range.',
    locationGeneral: 'Valmikinagar River Verge',
    photographer: 'Conservation Archive',
    year: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-04',
    title: 'Frontline Patrolling Squad on Foot',
    category: 'patrol',
    caption: 'Dedicated forest rangers and Van Suraksha Samiti members traversing high hill tracks with M-STrIPES devices.',
    locationGeneral: 'Manguraha Ridge Sector',
    photographer: 'VTR Anti-Poaching Division',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-05',
    title: 'Tharu Traditional Bamboo & Cane Craft',
    category: 'community',
    caption: 'Tharu artisans creating eco-friendly handicraft artifacts as part of community sustainable livelihood programs.',
    locationGeneral: 'Harnatanr Eco-Village',
    photographer: 'Community Livelihood Cell',
    year: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-06',
    title: 'Great Hornbill Gliding Over the Canopy',
    category: 'biodiversity',
    caption: 'A majestic Great Hornbill with expansive yellow wings traversing the upper canopy of moist deciduous forest.',
    locationGeneral: 'Someshwar Foothills',
    photographer: 'Avian Survey Project',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=1200&q=80'
  }
];
