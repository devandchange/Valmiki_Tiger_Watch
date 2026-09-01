import {
  VerifiedStatistic,
  TigerCountryData,
  AllIndiaEstimationEntry,
  SightseeingAttraction,
  LocalCuisineItem,
  TransitInfo,
  WildlifeSpecies
} from '../types';

export const ALL_INDIA_ESTIMATION_HISTORY: AllIndiaEstimationEntry[] = [
  {
    cycle: 'Cycle 1 (2006)',
    year: 2006,
    meanPopulation: 1411,
    lowerConfidence: 1165,
    upperConfidence: 1657,
    source: 'National Tiger Conservation Authority (NTCA) & Wildlife Institute of India (WII)',
    reportTitle: 'Status of Tigers, Co-predators & Prey in India 2006',
    status: 'Completed Official'
  },
  {
    cycle: 'Cycle 2 (2010)',
    year: 2010,
    meanPopulation: 1706,
    lowerConfidence: 1520,
    upperConfidence: 1909,
    source: 'National Tiger Conservation Authority (NTCA) & Wildlife Institute of India (WII)',
    reportTitle: 'Status of Tigers, Co-predators & Prey in India 2010',
    status: 'Completed Official'
  },
  {
    cycle: 'Cycle 3 (2014)',
    year: 2014,
    meanPopulation: 2226,
    lowerConfidence: 1945,
    upperConfidence: 2491,
    source: 'National Tiger Conservation Authority (NTCA) & Wildlife Institute of India (WII)',
    reportTitle: 'Status of Tigers, Co-predators & Prey in India 2014',
    status: 'Completed Official'
  },
  {
    cycle: 'Cycle 4 (2018)',
    year: 2018,
    meanPopulation: 2967,
    lowerConfidence: 2603,
    upperConfidence: 3346,
    source: 'National Tiger Conservation Authority (NTCA) & Wildlife Institute of India (WII)',
    reportTitle: 'Status of Tigers, Co-predators & Prey in India 2018 (Guinness World Record for camera trapping)',
    status: 'Completed Official'
  },
  {
    cycle: 'Cycle 5 (2022)',
    year: 2022,
    meanPopulation: 3682,
    lowerConfidence: 3167,
    upperConfidence: 3925,
    source: 'National Tiger Conservation Authority (NTCA) & Wildlife Institute of India (WII)',
    reportTitle: 'Status of Tigers, Co-predators & Prey in India 2022 (Released at 50 Years of Project Tiger)',
    status: 'Completed Official'
  }
];

export const ASIAN_TIGER_RANGE_COUNTRIES: TigerCountryData[] = [
  {
    id: 'trc-india',
    country: 'India',
    continent: 'Asia',
    estimatedPopulation: '3,682',
    populationRange: '3,167–3,925',
    trend: 'Increasing',
    assessmentYear: 2022,
    sourceOrg: 'National Tiger Conservation Authority (NTCA) / MoEFCC',
    sourceUrl: 'https://ntca.gov.in',
    lastVerified: '2026-08-31',
    majorHabitats: ['Terai-Arc (including VTR)', 'Central Indian Highlands', 'Western Ghats', 'Sundarbans Mangroves', 'North East Hills'],
    protectedAreas: ['Valmiki Tiger Reserve (Bihar)', 'Corbett', 'Kanha', 'Bandhavgarh', 'Kaziranga', 'Nagarhole', 'Sundarbans'],
    landscapeHighlights: 'Hosts over 75% of the world’s remaining wild tiger population across 55+ declared tiger reserves.',
    statusTag: 'verified_current'
  },
  {
    id: 'trc-nepal',
    country: 'Nepal',
    continent: 'Asia',
    estimatedPopulation: '355',
    populationRange: '317–393',
    trend: 'Increasing',
    assessmentYear: 2022,
    sourceOrg: 'Department of National Parks and Wildlife Conservation (DNPWC), Nepal',
    sourceUrl: 'https://dnpwc.gov.np',
    lastVerified: '2026-08-31',
    majorHabitats: ['Terai Arc Landscape (TAL) Contiguous with Valmiki TR', 'Chitwan-Parsa Complex', 'Bardia-Banke Complex'],
    protectedAreas: ['Chitwan National Park (adjoining VTR)', 'Parsa National Park', 'Bardia National Park', 'Shuklaphanta National Park'],
    landscapeHighlights: 'First country to almost triple its wild tiger population between 2010 and 2022, sharing direct transboundary corridor with VTR.',
    statusTag: 'verified_current'
  },
  {
    id: 'trc-bhutan',
    country: 'Bhutan',
    continent: 'Asia',
    estimatedPopulation: '131',
    populationRange: '102–152',
    trend: 'Increasing',
    assessmentYear: 2023,
    sourceOrg: 'Department of Forests and Park Services (DoFPS), Royal Government of Bhutan',
    sourceUrl: 'https://www.dofps.gov.bt',
    lastVerified: '2026-08-31',
    majorHabitats: ['Eastern Himalayan High-Altitude Cloud Forests', 'Sub-tropical Foothill Corridors', 'Manas Transboundary Complex'],
    protectedAreas: ['Royal Manas National Park', 'Jigme Singye Wangchuck National Park', 'Phrumsengla National Park'],
    landscapeHighlights: 'Documented tigers breeding at elevations exceeding 4,000 meters above sea level across pristine Himalayan valleys.',
    statusTag: 'verified_current'
  },
  {
    id: 'trc-russia',
    country: 'Russia (Far East)',
    continent: 'Eurasia',
    estimatedPopulation: '~750',
    populationRange: '700–780 (Amur Tigers)',
    trend: 'Stable',
    assessmentYear: 2022,
    sourceOrg: 'Ministry of Natural Resources and Environment of the Russian Federation / Amur Tiger Center',
    sourceUrl: 'http://amur-tiger.ru',
    lastVerified: '2026-08-31',
    majorHabitats: ['Sikhote-Alin Mountain Range', 'Primorsky & Khabarovsk Boreal Conifer-Broadleaf Taiga'],
    protectedAreas: ['Sikhote-Alin Biosphere Reserve', 'Land of the Leopard National Park', 'Bikin National Park'],
    landscapeHighlights: 'Home to the northernmost Amur tiger (*Panthera tigris altaica*), adapted to sub-zero snow winters.',
    statusTag: 'verified_current'
  },
  {
    id: 'trc-bangladesh',
    country: 'Bangladesh',
    continent: 'Asia',
    estimatedPopulation: '114',
    populationRange: '89–146',
    trend: 'Stable',
    assessmentYear: '2018–2023',
    sourceOrg: 'Bangladesh Forest Department / USAID Bengal Tiger Conservation Activity',
    sourceUrl: 'http://bforest.gov.bd',
    lastVerified: '2026-08-31',
    majorHabitats: ['Sundarbans Coastal Mangrove Delta'],
    protectedAreas: ['Sundarbans East, South & West Wildlife Sanctuaries'],
    landscapeHighlights: 'Specialized mangrove swimming tigers living in tidal salt-water channels.',
    statusTag: 'verified_older'
  },
  {
    id: 'trc-thailand',
    country: 'Thailand',
    continent: 'Asia',
    estimatedPopulation: '148–189',
    populationRange: '148–189',
    trend: 'Increasing',
    assessmentYear: 2022,
    sourceOrg: 'Department of National Parks, Wildlife and Plant Conservation (DNP), Thailand',
    sourceUrl: 'https://portal.dnp.go.th',
    lastVerified: '2026-08-31',
    majorHabitats: ['Western Forest Complex (WEFCOM)', 'Dong Phayayen-Khao Yai Forest Complex'],
    protectedAreas: ['Huai Kha Khaeng Wildlife Sanctuary', 'Thung Yai Naresuan'],
    landscapeHighlights: 'The principal remaining breeding stronghold for Indochinese tigers (*Panthera tigris corbetti*).',
    statusTag: 'verified_current'
  },
  {
    id: 'trc-indonesia',
    country: 'Indonesia (Sumatra)',
    continent: 'Asia',
    estimatedPopulation: '~400–600',
    populationRange: '393–587 (Sumatran Tigers)',
    trend: 'Decreasing',
    assessmentYear: 2020,
    sourceOrg: 'Ministry of Environment and Forestry (KLHK) Indonesia / Sumatran Tiger PVA',
    sourceUrl: 'https://www.menlhk.go.id',
    lastVerified: '2026-08-31',
    majorHabitats: ['Sumatran Tropical Peat Swamps', 'Barisan Mountain Montane Forests', 'Lowland Dipterocarp Canopies'],
    protectedAreas: ['Gunung Leuser National Park', 'Kerinci Seblat National Park', 'Bukit Barisan Selatan'],
    landscapeHighlights: 'Sole surviving island subspecies (*Panthera tigris sumatrae*); critically endangered due to palm oil deforestation.',
    statusTag: 'verified_older'
  },
  {
    id: 'trc-malaysia',
    country: 'Malaysia',
    continent: 'Asia',
    estimatedPopulation: '<150',
    populationRange: '80–120 (Malayan Tigers)',
    trend: 'Critically Endangered',
    assessmentYear: 2022,
    sourceOrg: 'Department of Wildlife and National Parks Peninsular Malaysia (PERHILITAN)',
    sourceUrl: 'https://www.wildlife.gov.my',
    lastVerified: '2026-08-31',
    majorHabitats: ['Central Forest Spine (Belum-Temengor, Taman Negara, Endau-Rompin)'],
    protectedAreas: ['Royal Belum State Park', 'Taman Negara National Park'],
    landscapeHighlights: 'Critically endangered Malayan tiger (*Panthera tigris jacksoni*) threatened by illegal wire snares.',
    statusTag: 'verified_current'
  },
  {
    id: 'trc-china',
    country: 'China',
    continent: 'Asia',
    estimatedPopulation: '~55–60',
    populationRange: '50–65 (Amur & Indochinese)',
    trend: 'Increasing',
    assessmentYear: 2022,
    sourceOrg: 'National Forestry and Grassland Administration (NFGA), China',
    sourceUrl: 'http://www.forestry.gov.cn',
    lastVerified: '2026-08-31',
    majorHabitats: ['Northeast China Tiger and Leopard National Park (Jilin & Heilongjiang)'],
    protectedAreas: ['Northeast Tiger and Leopard National Park', 'Hunchun Nature Reserve'],
    landscapeHighlights: 'Documented returning Amur tiger families dispersing across the Russian transboundary border.',
    statusTag: 'verified_current'
  },
  {
    id: 'trc-myanmar',
    country: 'Myanmar',
    continent: 'Asia',
    estimatedPopulation: '~22',
    populationRange: '20–25',
    trend: 'Decreasing',
    assessmentYear: 2020,
    sourceOrg: 'Forest Department, Ministry of Natural Resources and Environmental Conservation',
    sourceUrl: 'http://www.forestdepartment.gov.mm',
    lastVerified: '2026-08-31',
    majorHabitats: ['Hukaung Valley Wildlife Sanctuary', 'Htamanthi Wildlife Sanctuary'],
    protectedAreas: ['Htamanthi Wildlife Sanctuary', 'Hukaung Valley'],
    landscapeHighlights: 'Extremely vulnerable remnant population facing enforcement challenges.',
    statusTag: 'verified_older'
  },
  {
    id: 'trc-extinct-countries',
    country: 'Cambodia, Laos, Vietnam',
    continent: 'Asia',
    estimatedPopulation: '0 (Extinct in wild)',
    populationRange: 'No resident breeding wild tigers',
    trend: 'Extinct in Wild',
    assessmentYear: 2022,
    sourceOrg: 'IUCN SSC Cat Specialist Group / Global Tiger Forum',
    sourceUrl: 'https://www.iucn.org',
    lastVerified: '2026-08-31',
    majorHabitats: ['Cardamom Mountains (Cambodia), Nam Et-Phou Louey (Laos), Annamite Range (Vietnam)'],
    protectedAreas: ['Southern Cardamom National Park (Cambodia planned reintroduction)'],
    landscapeHighlights: 'Wiped out by pervasive wire snare crises in early 2000s; Cambodia is constructing secure recovery enclosures with Indian technical advice.',
    statusTag: 'verified_current'
  }
];

export const VERIFIED_STATISTICS_REGISTRY: VerifiedStatistic[] = [
  {
    id: 'stat-global-pop',
    category: 'global',
    title: 'Global Wild Tiger Population',
    value: '4,500 – 5,575',
    numericValue: 5000,
    unit: 'Estimated Wild Individuals',
    confidenceRange: '4,500 to 5,575',
    previousValue: '3,200 (2010 St. Petersburg Baseline)',
    status: 'verified_current',
    sourceOrganization: 'IUCN Red List of Threatened Species / Global Tiger Forum (GTF)',
    reportName: 'IUCN Red List Assessment (Panthera tigris) & GTF GTRP 2.0 Synthesis',
    assessmentYear: 2022,
    publicationDate: '2022-07-21',
    lastVerifiedDate: '2026-08-31',
    officialSourceUrl: 'https://www.iucnredlist.org/species/15955/214862019',
    methodologySummary: 'Synthesis of official national tiger survey camera-trap counts, SECR population density modeling, and national government telemetry reports across all 13 historic tiger range states.',
    notes: 'South Asia (India, Nepal, Bhutan) accounts for the vast majority of global tiger population recovery, while Southeast Asia continues to face severe snaring declines.'
  },
  {
    id: 'stat-india-pop-2022',
    category: 'india',
    title: 'All India Tiger Population (Latest Official Cycle)',
    value: '3,682',
    numericValue: 3682,
    unit: 'Mean Estimated Wild Tigers',
    confidenceRange: '3,167 – 3,925',
    previousValue: '2,967 (2018 Cycle 4)',
    status: 'verified_current',
    sourceOrganization: 'National Tiger Conservation Authority (NTCA) & Wildlife Institute of India (WII)',
    reportName: 'Status of Tigers, Co-predators & Prey in India 2022 (5th Quadrennial Census)',
    assessmentYear: 2022,
    publicationDate: '2023-04-09',
    lastVerifiedDate: '2026-08-31',
    officialSourceUrl: 'https://ntca.gov.in/assets/uploads/Reports/AITM/Status_of_Tigers_Co_predators_and_Prey_in_India_2022.pdf',
    methodologySummary: 'Ground-truthed Double Sampling with 32,588 camera-trap locations yielding 47,000,000+ wildlife photos, 3,080 unique photo-identified adult tigers, and M-STrIPES digital foot-patrol sign surveys across 641,449 km of forest tracks.',
    notes: 'Official label: "Latest completed All India Tiger Estimation: 2022". Note: 2022 is the last completed national census.'
  },
  {
    id: 'stat-india-reserves',
    category: 'india',
    title: 'Declared Tiger Reserves in India',
    value: '55+',
    numericValue: 55,
    unit: 'Statutory Tiger Reserves',
    previousValue: '53 (2022)',
    status: 'verified_current',
    sourceOrganization: 'National Tiger Conservation Authority (NTCA), MoEFCC',
    reportName: 'NTCA List of Tiger Reserves in India (Section 38V Wildlife Protection Act 1972)',
    assessmentYear: 2024,
    publicationDate: '2024-01-15',
    lastVerifiedDate: '2026-08-31',
    officialSourceUrl: 'https://ntca.gov.in/tiger-reserves/',
    methodologySummary: 'Statutory gazette notifications under Wildlife (Protection) Act 1972 across 18 tiger-range states.',
    notes: 'Covers over 78,000 sq km of core and buffer forest habitats across India.'
  },
  {
    id: 'stat-india-reserve-area',
    category: 'india',
    title: 'Total Tiger Reserve Network Area',
    value: '78,735 sq km',
    numericValue: 78735,
    unit: 'Square Kilometres',
    confidenceRange: 'Core: ~44,500 sq km | Buffer: ~34,235 sq km',
    previousValue: '72,749 sq km (2018)',
    status: 'verified_current',
    sourceOrganization: 'NTCA / MoEFCC, Government of India',
    reportName: 'National Tiger Conservation Authority Annual Compendium',
    assessmentYear: 2023,
    publicationDate: '2023-11-20',
    lastVerifiedDate: '2026-08-31',
    officialSourceUrl: 'https://ntca.gov.in',
    methodologySummary: 'GIS spatial boundary mapping of notified Core / Critical Tiger Habitats and contiguous Buffer / Peripheral Eco-sensitive zones.',
    notes: 'Represents approximately 2.4% of India’s total geographical land area.'
  },
  {
    id: 'stat-vtr-population',
    category: 'vtr',
    title: 'Valmiki Tiger Reserve Tiger Population',
    value: '54+',
    numericValue: 54,
    unit: 'Individual Tigers Documented',
    confidenceRange: '54 to 58 (including resident breeding females and sub-adults)',
    previousValue: '31 (2018) | 8 (2006)',
    status: 'verified_current',
    sourceOrganization: 'Bihar Department of Environment, Forest & Climate Change / NTCA',
    reportName: 'Valmiki Tiger Reserve Annual Wildlife Monitoring and Camera Trap Census Protocol',
    assessmentYear: 2024,
    publicationDate: '2024-07-29',
    lastVerifiedDate: '2026-08-31',
    officialSourceUrl: 'https://forest.bihar.gov.in',
    methodologySummary: 'Automated 24/7 Phase-IV camera-trap grids across 8 forest ranges (Valmikinagar, Gonauli, Madanpur, Kotraha, Chiutaha, Harnatanr, Raghia, Manguraha) combined with individual stripe-pattern software profiling.',
    notes: 'Remarkable recovery from near-extirpation in 2006 (~8 tigers) to a self-sustaining breeding metapopulation.'
  },
  {
    id: 'stat-vtr-area',
    category: 'vtr',
    title: 'Valmiki Tiger Reserve Protected Area',
    value: '899.38 sq km',
    numericValue: 899.38,
    unit: 'Square Kilometres',
    confidenceRange: 'National Park: 335.52 sq km | Wildlife Sanctuary: 563.86 sq km',
    status: 'verified_current',
    sourceOrganization: 'Government of Bihar & Ministry of Environment, Forest & Climate Change',
    reportName: 'Gazette Notification for Valmiki National Park & Wildlife Sanctuary',
    assessmentYear: 1990,
    publicationDate: '1990-01-01',
    lastVerifiedDate: '2026-08-31',
    officialSourceUrl: 'https://forest.bihar.gov.in',
    methodologySummary: 'Survey of India cadastral boundary records in West Champaran district.',
    notes: 'The only national park and tiger reserve in the state of Bihar.'
  },
  {
    id: 'stat-india-mortality',
    category: 'mortality',
    title: 'Official India Tiger Mortality Monitoring',
    value: 'Documented via Tigernet',
    unit: 'Official Case Audits',
    status: 'verified_current',
    sourceOrganization: 'National Tiger Conservation Authority (NTCA) Tigernet Portal',
    reportName: 'NTCA National Mortality Database (Natural, Territorial Conflict, Poaching, & Old Age)',
    assessmentYear: '2022–2024',
    publicationDate: '2024-08-01',
    lastVerifiedDate: '2026-08-31',
    officialSourceUrl: 'http://tigernet.nic.in',
    methodologySummary: 'Every tiger death in India undergoes a mandatory Standard Operating Procedure (SOP) forensic post-mortem with veterinary samples and NTCA observer oversight.',
    notes: 'Tigernet is India’s official, open-access tiger and leopard mortality tracking database.'
  }
];

export const AUTHENTIC_LOCAL_CUISINE: LocalCuisineItem[] = [
  {
    id: 'cui-champaran-meat',
    name: 'Champaran Handi Mutton (Ahuna Meat)',
    localNameHindi: 'चंपारण हांडी मटन (अहुना मीट)',
    localNameUrdu: 'چمپارن ہانڈی مٹن (اہونا گوشت)',
    origin: 'West Champaran',
    type: 'traditional_heritage',
    description: 'The world-famous culinary masterpiece born in the rural hamlets of West Champaran. Tender mutton is marinated in whole garlic pods, mustard oil, crushed ginger, cumin, and whole spices, sealed airtight inside an unglazed earthen clay pot (Ahuna) with wheat dough and slow-cooked over glowing sal wood embers for hours.',
    authenticityDetails: 'Traditional Ahuna cooking relies exclusively on the steam and natural juices inside the sealed earthen pot without adding external water. The clay imparts a smoky, earthy aroma unique to West Champaran.',
    isTraditionalFood: true,
    culturalNote: 'Historically crafted by Champaran village elders during festive gatherings and harvest fairs across Bettiah and Narkatiaganj.',
    photoUrl: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cui-litti-chokha',
    name: 'Bihari Litti Chokha with Ghee',
    localNameHindi: 'पारंपरिक लिट्टी चोखा (देसी घी में डूबी)',
    localNameUrdu: 'بہاری لٹی چوکھا (خالص گھی کے ساتھ)',
    origin: 'Bihar',
    type: 'staple_dish',
    description: 'The iconic traditional dish of Bihar. Whole wheat dough balls stuffed with roasted gram flour (sattu), spiced with ajwain, kalonji, green chillies, garlic, and mango pickle oil, roasted over cow dung cakes or charcoal embers, then cracked and dipped in pure desi ghee. Served alongside smoky baingan-aloo-tomato chokha.',
    authenticityDetails: 'Authentic Litti must be roasted over dry embers rather than deep-fried to achieve the signature charred outer crust and aromatic sattu filling.',
    isTraditionalFood: true,
    culturalNote: 'Celebrated as an energizing, portable food historically carried by travelers, farmers, and forestry workers across the Gandak basin.',
    photoUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cui-tharu-fish-rice',
    name: 'Tharu Tribal River Fish & Steamed Anadi Rice',
    localNameHindi: 'थारू जनजातीय मछली एवं अनादी चावल',
    localNameUrdu: 'تھارو قبائلی مچھلی اور انادی چاول',
    origin: 'Valmikinagar / Tharu',
    type: 'traditional_heritage',
    description: 'An authentic indigenous recipe of the Tharu community inhabiting the Valmiki forest fringes. Freshly caught river fish cooked with wild coriander, mustard seed paste, turmeric, and local green peppers, paired with sticky aromatic Anadi rice cultivated in forest foothill terraced wetlands.',
    authenticityDetails: 'Cooked with minimal oil using fresh herbal ingredients gathered from permissible agricultural buffers; completely free from commercial preservatives.',
    isTraditionalFood: true,
    culturalNote: 'Represents the deep cultural coexistence between the Tharu indigenous community and the pristine riverine ecosystem of the Gandak.',
    photoUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cui-sattu-sharbat',
    name: 'Desi Sattu Sharbat (Namkeen & Meetha)',
    localNameHindi: 'देसी सत्तू शरबत (नमकीन जीरा एवं मीठा)',
    localNameUrdu: 'دیسی ستو شربت (نمکین و میٹھا)',
    origin: 'Bihar',
    type: 'beverage',
    description: 'A traditional, high-protein superfood beverage made by blending finely ground roasted Bengal gram (sattu) with chilled spring water, roasted cumin powder, black salt, fresh mint, lemon juice, and finely chopped green chillies (or with jaggery for the sweet version).',
    authenticityDetails: 'A natural isotonic thirst quencher prized across Champaran summers for its cooling properties and high dietary fiber.',
    isTraditionalFood: true,
    culturalNote: 'Served in brass cups across morning markets in Valmikinagar and Bettiah as a healthy local staple.',
    photoUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cui-thekua',
    name: 'Traditional Champaran Thekua (Khajur)',
    localNameHindi: 'पारंपरिक ठेकुआ (गुड़ एवं सौंफ युक्त)',
    localNameUrdu: 'روایتی ٹھیکوا (گڑ اور سونف والا)',
    origin: 'Bihar',
    type: 'festive_delicacy',
    description: 'The ancient sacred sweet of Bihar, prepared from whole wheat flour, country jaggery (gur), green cardamom, fennel seeds (saunf), and dry coconut slices, kneaded with ghee and shaped using hand-carved wooden moulds before slow deep frying in pure ghee.',
    authenticityDetails: 'Crisp on the outside with a fragrant crumb inside, known for its exceptional shelf life of several weeks without artificial preservatives.',
    isTraditionalFood: true,
    culturalNote: 'The principal offering during the ancient Chhath Puja festival, symbolizing gratitude to the Sun and nature.',
    photoUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cui-taas',
    name: 'Champaran Taas (Spiced Mutton Slices with Bhuja)',
    localNameHindi: 'चंपारण तास एवं भुंजा',
    localNameUrdu: 'چمپارن ٹاس اور بھونجا',
    origin: 'West Champaran',
    type: 'staple_dish',
    description: 'A rustic frontier delicacy originating along the Indo-Nepal Champaran border. Thin boneless slices of tender goat meat seasoned with crushed garlic, dry red chillies, and mustard paste, dry-roasted on a heavy concave cast-iron griddle (tawa) till golden brown, served with puffed rice (bhuja) and pickled onions.',
    authenticityDetails: 'Distinct from Ahuna mutton, Taas focuses on high-heat tawa pan-searing, giving the meat a caramelized crispy edge.',
    isTraditionalFood: true,
    culturalNote: 'A popular evening snack cherished in the border towns of Bagaha, Narkatiaganj, and Bettiah.',
    photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  }
];

export const OFFICIAL_SIGHTSEEING_ATTRACTIONS: SightseeingAttraction[] = [
  {
    id: 'attr-valmikinagar-safari',
    name: 'Valmikinagar Wildlife Safari & Cane Brakes Circuit',
    category: 'safari',
    distanceFromValmikinagar: '0 km (Starts from Valmikinagar Forest Range Office)',
    description: 'The premier ecotourism safari circuit traversing pristine sal forest canopies, natural cane brakes, and elephant grass meadows. Guided Gypsy safaris offer opportunities to observe spotted deer, sambar, wild boar, Indian peafowl, and territorial signs of apex predators.',
    visitingInformation: 'Morning Safari: 06:00 AM – 09:30 AM | Afternoon Safari: 02:30 PM – 05:30 PM. Mandatory certified forest naturalist accompaniment.',
    timings: 'October 16 to June 30 (Closed during core monsoon July–October)',
    entryPermit: 'Booking via Bihar Forest Department online portal or on-spot counter at Valmikinagar Range Checkpost',
    officialSource: 'Bihar Environment, Forest & Climate Change Department (forest.bihar.gov.in)',
    photoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
    mapLocation: 'Valmikinagar Main Gate (27.4338° N, 83.8967° E)'
  },
  {
    id: 'attr-gandak-barrage-triveni',
    name: 'Gandak River Barrage & Triveni Sangam',
    category: 'river',
    distanceFromValmikinagar: '2 km',
    description: 'The scenic confluence where the Gandak River (Narayani), Sonbhadra, and Panchnad meet along the Indo-Nepal international border. Renowned for breathtaking sunrise and sunset vistas against the backdrop of the Someshwar foothills, riverine birdwatching, and Gharial conservation monitoring.',
    visitingInformation: 'Open daily from sunrise to sunset. Safe boating operated by Bihar Tourism / Forest Ecotourism cell under strict life-jacket mandates.',
    timings: '06:00 AM – 06:00 PM',
    entryPermit: 'Free entry to barrage public viewpoints; boat permits nominal fee at counter',
    officialSource: 'Bihar Tourism & Valmiki Tiger Conservation Foundation',
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    mapLocation: 'Valmikinagar Barrage Axis'
  },
  {
    id: 'attr-jatashankar-temple',
    name: 'Historic Jatashankar & Nardevi Ancient Forest Temples',
    category: 'temple',
    distanceFromValmikinagar: '3.5 km',
    description: 'Ancient stone sanctums nestled inside dense moist deciduous sal forest. Surrounded by natural perennial freshwater springs and towering trees, revered in local folklore as the meditation hermitage associated with sage Valmiki.',
    visitingInformation: 'Reached via a gentle 1.5 km walking eco-trail from the forest gate. Visitors must maintain strict silence, zero single-use plastic, and avoid carrying food to deter habituated monkeys.',
    timings: '06:30 AM – 05:00 PM (Entry prohibited after 04:30 PM)',
    entryPermit: 'Forest walking trail registration at Gate',
    officialSource: 'VTR Ecotourism Division',
    photoUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    mapLocation: 'Jatashankar Trailhead'
  },
  {
    id: 'attr-someshwar-fort-trek',
    name: 'Someshwar Fort High-Ridge Trek (Manguraha)',
    category: 'heritage',
    distanceFromValmikinagar: '45 km (via Narkatiaganj / Manguraha Range)',
    description: 'The highest elevation point in Bihar (~865 meters above sea level) situated along the Indo-Nepal crest. The trek winds through virgin sal gorges, rocky water streams, and sandstone ridges, culminating in panoramic vistas of the snow-capped Annapurna and Dhaulagiri Himalayan ranges on crystal clear winter mornings.',
    visitingInformation: 'A moderately challenging 14 km round-trip hike requiring good physical fitness, sturdy trekking footwear, and mandatory armed forest guard / certified guide accompaniment.',
    timings: '07:00 AM – 03:00 PM (Winter season Nov–Feb recommended)',
    entryPermit: 'Special trekking clearance required from Range Forest Officer, Manguraha',
    officialSource: 'Bihar Forest Department & District Administration Bettiah',
    photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    mapLocation: 'Manguraha Range Gate'
  },
  {
    id: 'attr-kaleshwar-temple',
    name: 'Kaleshwar Temple & Gonauli Eco-Trail',
    category: 'trail',
    distanceFromValmikinagar: '8 km',
    description: 'An ancient Shivite shrine situated along the forested banks of the river stream in Gonauli range. Famous for historical rock architecture and quiet birding paths where Great Hornbills, emerald doves, and paradise flycatchers are frequently recorded.',
    visitingInformation: 'Accessible by authorized vehicle and short walking trail. Eco-rules strictly prohibit loud music or open fires.',
    timings: '07:00 AM – 05:00 PM',
    entryPermit: 'Forest Eco-Checkpost Pass',
    officialSource: 'Valmiki Tiger Reserve Ecotourism Cell',
    photoUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
    mapLocation: 'Gonauli Forest Track'
  },
  {
    id: 'attr-gandak-eco-park',
    name: 'Valmiki Gandak Eco-Park & Canopy Walkway',
    category: 'safari',
    distanceFromValmikinagar: '1.5 km',
    description: 'A beautifully designed nature interpretation park featuring elevated wooden canopy walkways, butterfly gardens, indigenous medicinal plant arboretums, and interactive exhibits on the Royal Bengal Tiger and Gharial conservation.',
    visitingInformation: 'Ideal for families, students, and senior citizens. Wheelchair-accessible pathways in designated interpretation sections.',
    timings: '08:00 AM – 06:00 PM (Daily)',
    entryPermit: 'Nominal entry fee at park counter',
    officialSource: 'Bihar Tourism (tourism.bihar.gov.in)',
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    mapLocation: 'Valmikinagar Eco-Park Road'
  }
];

export const HOW_TO_REACH_DATA: TransitInfo[] = [
  {
    mode: 'rail',
    title: 'By Train (Indian Railways)',
    routes: [
      {
        origin: 'Bagaha Railway Station (BUG)',
        distance: '42 km to Valmikinagar',
        duration: '~1 hour 15 mins by road',
        details: 'The closest major broad-gauge railway station with direct express connectivity from Gorakhpur, Patna, Muzaffarpur, Delhi, and Kolkata. Regular taxis and shared sumos connect Bagaha directly with Valmikinagar.'
      },
      {
        origin: 'Narkatiaganj Junction (NKE)',
        distance: '65 km to Valmikinagar / 30 km to Manguraha',
        duration: '~1.5 to 2 hours by road',
        details: 'Major railway junction on the Muzaffarpur–Gorakhpur main line, ideal for accessing the eastern forest ranges of Manguraha, Gobardhana, and Someshwar foothill sectors.'
      },
      {
        origin: 'Bettiah Railway Station (BTH)',
        distance: '95 km to Valmikinagar',
        duration: '~2.5 hours by road',
        details: 'District headquarters of West Champaran; connects with all major express trains across India.'
      }
    ],
    nearestPoints: [
      { name: 'Bagaha (BUG)', distance: '42 km', code: 'BUG', type: 'Railway Station' },
      { name: 'Narkatiaganj Jn (NKE)', distance: '65 km', code: 'NKE', type: 'Railway Junction' },
      { name: 'Bettiah (BTH)', distance: '95 km', code: 'BTH', type: 'Railway Station' },
      { name: 'Gorakhpur Jn (GKP)', distance: '125 km', code: 'GKP', type: 'Major Railway Terminal' }
    ],
    permitInfo: 'Forest entry permits must be arranged upon arrival at Valmikinagar Range Checkpost or pre-booked online on Bihar Forest portal.',
    source: 'Indian Railways (irctc.co.in) & Bihar Tourism'
  },
  {
    mode: 'air',
    title: 'By Air (Commercial Airports)',
    routes: [
      {
        origin: 'Gorakhpur Airport (GOP), Uttar Pradesh',
        distance: '130 km to Valmikinagar',
        duration: '~3.5 hours by road via Padrauna & Bagaha',
        details: 'The nearest operational domestic airport with daily direct commercial flights from New Delhi, Mumbai, Kolkata, Bengaluru, and Hyderabad. Private cabs are readily available from Gorakhpur airport directly to Valmikinagar.'
      },
      {
        origin: 'Kushinagar International Airport (KBH), UP',
        distance: '100 km to Valmikinagar',
        duration: '~2.5 to 3 hours by road',
        details: 'Convenient air gateway situated along the Buddhist Circuit with chartered and seasonal commercial operations.'
      },
      {
        origin: 'Jay Prakash Narayan Airport, Patna (PAT)',
        distance: '275 km to Valmikinagar',
        duration: '~6.5 to 7.5 hours by road',
        details: 'State capital airport connecting all major Indian metropolitan centers with dense flight frequencies.'
      }
    ],
    nearestPoints: [
      { name: 'Gorakhpur Airport (GOP)', distance: '130 km', code: 'GOP', type: 'Domestic Airport' },
      { name: 'Kushinagar Airport (KBH)', distance: '100 km', code: 'KBH', type: 'International Airport' },
      { name: 'Patna Airport (PAT)', distance: '275 km', code: 'PAT', type: 'Major Domestic Airport' }
    ],
    permitInfo: 'Airport pickup taxis can be booked in advance via registered Bihar State Tourism Development Corporation (BSTDC) counters or private operators in Gorakhpur/Patna.',
    source: 'Airports Authority of India (AAI) & Bihar Tourism'
  },
  {
    mode: 'road',
    title: 'By Road (National & State Highways)',
    routes: [
      {
        origin: 'Patna → Muzaffarpur → Motihari → Bettiah → Bagaha → Valmikinagar',
        distance: '275 km',
        duration: '~6.5 to 7 hours',
        details: 'Well-paved national highway network (NH-27 / NH-727) passing through historical Champaran plains.'
      },
      {
        origin: 'Gorakhpur → Kaptanganj → Padrauna → Chhitauni → Bagaha → Valmikinagar',
        distance: '130 km',
        duration: '~3.5 hours',
        details: 'Scenic route crossing the Gandak river bridge at Chhitauni and entering the sal forest corridor.'
      },
      {
        origin: 'Varanasi → Gorakhpur → Valmikinagar',
        distance: '330 km',
        duration: '~7.5 hours',
        details: 'Smooth connectivity from Eastern UP via NH-31 and NH-727.'
      }
    ],
    nearestPoints: [
      { name: 'Bagaha Town', distance: '42 km', type: 'Sub-divisional Center' },
      { name: 'Bettiah City', distance: '95 km', type: 'District Headquarters' },
      { name: 'Motihari', distance: '145 km', type: 'Regional Hub' }
    ],
    permitInfo: 'Vehicles entering the forest sector must comply with the 20 km/h speed limit and undergo mandatory checkpost logging.',
    source: 'National Highways Authority of India (NHAI) & Bihar Road Transport'
  }
];

export const OFFICIAL_GOVERNMENT_PORTALS = [
  {
    name: 'National Tiger Conservation Authority (NTCA)',
    role: 'Statutory Body under MoEFCC, Government of India',
    url: 'https://ntca.gov.in',
    category: 'Government Central'
  },
  {
    name: 'Ministry of Environment, Forest & Climate Change (MoEFCC)',
    role: 'Government of India Union Ministry',
    url: 'https://moef.gov.in',
    category: 'Government Central'
  },
  {
    name: 'Bihar Department of Environment, Forest & Climate Change',
    role: 'State Government Administrative Body for VTR',
    url: 'https://forest.bihar.gov.in',
    category: 'State Government'
  },
  {
    name: 'Bihar Tourism (BSTDC)',
    role: 'Official Government Tourism & Eco-Lodge Booking Portal',
    url: 'https://tourism.bihar.gov.in',
    category: 'State Tourism'
  },
  {
    name: 'Wildlife Institute of India (WII)',
    role: 'Premier National Wildlife Research & Census Authority',
    url: 'https://wii.gov.in',
    category: 'Scientific Research'
  },
  {
    name: 'IUCN Cat Specialist Group',
    role: 'Global Authority on Felidae Conservation & Red List Assessments',
    url: 'http://www.catsg.org',
    category: 'International Conservation'
  },
  {
    name: 'Global Tiger Forum (GTF)',
    role: 'Inter-Governmental International Body for Tiger Range Countries',
    url: 'https://globaltigerforum.org',
    category: 'International Body'
  },
  {
    name: 'Tigernet India Official Portal',
    role: 'Official Tiger & Leopard Mortality / Poaching Database',
    url: 'http://tigernet.nic.in',
    category: 'Official Database'
  }
];
