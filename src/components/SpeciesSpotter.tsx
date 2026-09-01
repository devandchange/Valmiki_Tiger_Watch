import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Binoculars, 
  Check, 
  CheckCircle2, 
  Heart, 
  Search, 
  Filter, 
  Share2, 
  Download, 
  Sparkles, 
  Trophy, 
  Compass, 
  Clock, 
  MapPin, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Info, 
  Camera, 
  Layers, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Printer, 
  Copy, 
  CheckCheck, 
  X,
  AlertTriangle,
  Award,
  BookOpen,
  FileText
} from 'lucide-react';

export type SpotterStatus = 'unmarked' | 'wishlist' | 'spotted';

export interface SpotterSpecies {
  id: string;
  commonName: string;
  hindiName: string;
  scientificName: string;
  category: 'mammal' | 'bird' | 'reptile' | 'amphibian' | 'flora';
  iucnStatus: 'CR' | 'EN' | 'VU' | 'NT' | 'LC';
  rarityInVTR: 'Big 5' | 'Rare / Elusive' | 'Seasonal Migrant' | 'Uncommon' | 'Common';
  vtrHabitat: string;
  bestZones: string[];
  bestTimeToSpot: string;
  image: string;
  identificationTip: string;
  isFlagship?: boolean;
}

export interface SpotterLogEntry {
  speciesId: string;
  status: SpotterStatus;
  sightedAt?: string;
  timeSlot?: string;
  zone?: string;
  count?: number;
  locationLandmark?: string;
  notes?: string;
  guideName?: string;
  markedAt: string;
}

export interface CustomSpeciesItem {
  id: string;
  commonName: string;
  scientificName?: string;
  category: 'mammal' | 'bird' | 'reptile' | 'amphibian' | 'flora';
  sightedAt: string;
  zone: string;
  notes: string;
  count: number;
}

const STORAGE_KEY = 'vtr_species_spotter_records_v2';
const CUSTOM_STORAGE_KEY = 'vtr_custom_species_spotter_v2';

export const VTR_SPECIES_CATALOG: SpotterSpecies[] = [
  // --- MAMMALS ---
  {
    id: 'spot-tiger',
    commonName: 'Royal Bengal Tiger',
    hindiName: 'रॉयल बंगाल टाइगर (बाघ)',
    scientificName: 'Panthera tigris tigris',
    category: 'mammal',
    iucnStatus: 'EN',
    rarityInVTR: 'Big 5',
    vtrHabitat: 'Dense Sal canopies, Cane brakes, Pandai riverbanks, Madanpur grasslands',
    bestZones: ['Valmikinagar', 'Madanpur', 'Gonauli', 'Manguraha'],
    bestTimeToSpot: 'Dawn (05:45 - 08:30) & Dusk (16:30 - 18:45)',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Look for distinct vertical black stripes over reddish-amber coat, pugmarks along soft sand tracks, and chital alarm calls.',
    isFlagship: true
  },
  {
    id: 'spot-leopard',
    commonName: 'Indian Leopard',
    hindiName: 'भारतीय तेंदुआ (गुलदार)',
    scientificName: 'Panthera pardus fusca',
    category: 'mammal',
    iucnStatus: 'VU',
    rarityInVTR: 'Big 5',
    vtrHabitat: 'Rocky ravines, Someshwar foothill ridges, Madanpur buffer thickets',
    bestZones: ['Someshwar', 'Manguraha', 'Madanpur', 'Raghia'],
    bestTimeToSpot: 'Late Evening safari & Twilight patrols',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Golden-yellow coat adorned with rosette spots, master of tree perches and rocky ledges overlooking game trails.',
    isFlagship: true
  },
  {
    id: 'spot-gaur',
    commonName: 'Indian Bison / Gaur',
    hindiName: 'भारतीय गौर (जंगली भैंसा)',
    scientificName: 'Bos gaurus',
    category: 'mammal',
    iucnStatus: 'VU',
    rarityInVTR: 'Big 5',
    vtrHabitat: 'Madanpur alluvial glades, Gonauli moist mixed forests',
    bestZones: ['Madanpur', 'Gonauli', 'Gobardhana'],
    bestTimeToSpot: 'Early morning grazing in open glades (06:30 - 09:00)',
    image: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Massive muscular dark brown body, distinctive muscular dorsal hump, and white stocking-like lower legs.',
    isFlagship: true
  },
  {
    id: 'spot-elephant',
    commonName: 'Asian Elephant',
    hindiName: 'एशियाई हाथी',
    scientificName: 'Elephas maximus',
    category: 'mammal',
    iucnStatus: 'EN',
    rarityInVTR: 'Big 5',
    vtrHabitat: 'Transboundary corridors linking Chitwan (Nepal) with Someshwar & Raghia',
    bestZones: ['Someshwar', 'Raghia', 'Harnatanr', 'Chitwan Border Corridor'],
    bestTimeToSpot: 'Afternoon river crossings & dusk forest edge feeding',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Listen for cracking bamboo stalks, deep rumbling vocalizations, and large round fresh footprints.',
    isFlagship: true
  },
  {
    id: 'spot-sloth-bear',
    commonName: 'Sloth Bear',
    hindiName: 'भालू / रीछ',
    scientificName: 'Melursus ursinus',
    category: 'mammal',
    iucnStatus: 'VU',
    rarityInVTR: 'Big 5',
    vtrHabitat: 'Rocky outcrops, termite-rich slopes of Manguraha & Gobardhana',
    bestZones: ['Manguraha', 'Gobardhana', 'Chiutaha'],
    bestTimeToSpot: 'Morning fruit trees & late evening termite mound foraging',
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Shaggy black fur, white Y-shaped chest patch, elongated snout, and audible vacuum-like feeding suction sound.',
    isFlagship: true
  },
  {
    id: 'spot-rhino',
    commonName: 'One-Horned Rhinoceros',
    hindiName: 'एक सींग वाला भारतीय गैंडा',
    scientificName: 'Rhinoceros unicornis',
    category: 'mammal',
    iucnStatus: 'VU',
    rarityInVTR: 'Rare / Elusive',
    vtrHabitat: 'Gandak river floodplains, Madanpur marshes, Chitwan-Valmiki border reeds',
    bestZones: ['Madanpur', 'Valmikinagar River Banks', 'Chitwan Ingress Zones'],
    bestTimeToSpot: 'Early morning mist in tall elephant grass and water wallows',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Armor-plated thick grey hide with skin folds and a single prominent keratin horn on the snout.',
    isFlagship: true
  },
  {
    id: 'spot-dhole',
    commonName: 'Dhole / Asiatic Wild Dog',
    hindiName: 'धोल (जंगली कुत्ता)',
    scientificName: 'Cuon alpinus',
    category: 'mammal',
    iucnStatus: 'EN',
    rarityInVTR: 'Rare / Elusive',
    vtrHabitat: 'Dense interior Sal and mixed deciduous valleys',
    bestZones: ['Gonauli', 'Harnatanr', 'Manguraha'],
    bestTimeToSpot: 'Midday and morning pack hunting excursions',
    image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Reddish-russet coat, bushy dark tail tip, white chest mark, and distinct whistling communication calls.',
  },
  {
    id: 'spot-fishing-cat',
    commonName: 'Fishing Cat',
    hindiName: 'मछली पकड़ने वाली बिल्ली',
    scientificName: 'Prionailurus viverrinus',
    category: 'mammal',
    iucnStatus: 'VU',
    rarityInVTR: 'Rare / Elusive',
    vtrHabitat: 'Wetlands, oxbow lakes, Pandai and Gandak tributary marshes',
    bestZones: ['Madanpur Wetlands', 'Gandak Canals', 'Valmikinagar Backwaters'],
    bestTimeToSpot: 'Nocturnal / Twilight water edge stalking',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Stocky build, olive-grey coat with longitudinal dark stripes, partially webbed front paws for swimming.',
  },
  {
    id: 'spot-sambar',
    commonName: 'Sambar Deer',
    hindiName: 'सांभर हिरण',
    scientificName: 'Rusa unicolor',
    category: 'mammal',
    iucnStatus: 'VU',
    rarityInVTR: 'Common',
    vtrHabitat: 'Forested hills, dense Sal tracts, near secluded waterholes',
    bestZones: ['Valmikinagar', 'Gonauli', 'Manguraha', 'Gobardhana'],
    bestTimeToSpot: 'Early morning & late dusk foraging near water sources',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Largest Indian deer, uniform dark brown coarse coat, massive three-tined antlers on mature stags.',
  },
  {
    id: 'spot-chital',
    commonName: 'Spotted Deer / Chital',
    hindiName: 'चीतल (चित्तीदार हिरण)',
    scientificName: 'Axis axis',
    category: 'mammal',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Open woodlands, glades, ecotourism safari tracks, forest fringes',
    bestZones: ['Valmikinagar Safari Zone', 'Madanpur', 'Gonauli', 'Harnatanr'],
    bestTimeToSpot: 'Throughout morning and evening safari drives',
    image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Bright rufous-fawn coat covered in permanent white spots, lyre-shaped antlers on males.',
  },
  {
    id: 'spot-barking-deer',
    commonName: 'Barking Deer / Indian Muntjac',
    hindiName: 'काकड़ / भौंकने वाला हिरण',
    scientificName: 'Muntiacus vaginalis',
    category: 'mammal',
    iucnStatus: 'LC',
    rarityInVTR: 'Uncommon',
    vtrHabitat: 'Dense forest undergrowth, moist valleys, bamboo gullies',
    bestZones: ['Gobardhana', 'Manguraha', 'Someshwar'],
    bestTimeToSpot: 'Dawn & dusk moving stealthily through thick brush',
    image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Small reddish-chestnut deer, canine tusks in males, loud dog-like barking alarm call.',
  },
  {
    id: 'spot-wild-boar',
    commonName: 'Indian Wild Boar',
    hindiName: 'जंगली सुअर',
    scientificName: 'Sus scrofa cristatus',
    category: 'mammal',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Forest edges, marshy ground, agricultural buffers',
    bestZones: ['All VTR Ranges', 'Madanpur', 'Gonauli', 'Valmikinagar'],
    bestTimeToSpot: 'Rooting in marshy ground during early morning or late afternoon',
    image: 'https://images.unsplash.com/photo-1590691566903-692bf52c6738?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Dark bristly coat with dorsal crest mane, prominent tusks, frequently moving in sounders.',
  },
  {
    id: 'spot-flying-squirrel',
    commonName: 'Indian Giant Flying Squirrel',
    hindiName: 'विशाल उड़ने वाली गिलहरी',
    scientificName: 'Petaurista philippensis',
    category: 'mammal',
    iucnStatus: 'LC',
    rarityInVTR: 'Rare / Elusive',
    vtrHabitat: 'High canopy mature Sal and Mahua trees, Someshwar hill forests',
    bestZones: ['Someshwar Range', 'Manguraha High Canopy', 'Gobardhana'],
    bestTimeToSpot: 'Night walks / Twilight tree-to-tree glides',
    image: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Large gliding membrane connecting limbs, bushy tail, loud nocturnal call from high canopy.',
  },
  {
    id: 'spot-dolphin',
    commonName: 'Gangetic River Dolphin',
    hindiName: 'गंगा नदी डॉल्फ़िन (सोंस)',
    scientificName: 'Platanista gangetica',
    category: 'mammal',
    iucnStatus: 'EN',
    rarityInVTR: 'Rare / Elusive',
    vtrHabitat: 'Deep eddies and confluences of Gandak River at Valmikinagar',
    bestZones: ['Valmikinagar Barrage Downstream', 'Triveni Sangam', 'Gandak Riparian Zone'],
    bestTimeToSpot: 'Calm morning boat rides (07:00 - 10:00)',
    image: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Breaching surface to breathe with characteristic blow sound, long narrow beak, nearly blind.',
    isFlagship: true
  },

  // --- BIRDS / AVIFAUNA ---
  {
    id: 'spot-hornbill',
    commonName: 'Great Indian Hornbill',
    hindiName: 'विशाल भारतीय धनेश (हॉर्नबिल)',
    scientificName: 'Buceros bicornis',
    category: 'bird',
    iucnStatus: 'VU',
    rarityInVTR: 'Big 5',
    vtrHabitat: 'Primary rainforest canopies, Someshwar ridges, old-growth fig trees',
    bestZones: ['Someshwar', 'Manguraha', 'Valmikinagar Foothills'],
    bestTimeToSpot: 'Morning fruiting tree foraging (06:30 - 09:30)',
    image: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Massive bright yellow and black casque atop beak, heavy whooshing wingbeats audible from afar.',
    isFlagship: true
  },
  {
    id: 'spot-florican',
    commonName: 'Bengal Florican',
    hindiName: 'बंगाल फ्लोरिकन (खरमोर)',
    scientificName: 'Houbaropsis bengalensis',
    category: 'bird',
    iucnStatus: 'CR',
    rarityInVTR: 'Rare / Elusive',
    vtrHabitat: 'Alluvial Terai grasslands, Madanpur and Gonauli savannahs',
    bestZones: ['Madanpur Grassland', 'Gobardhana Floodplain Glades'],
    bestTimeToSpot: 'Spring breeding display jumps (March - May) at dawn',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Critically rare bustard; breeding male has pitch-black head, neck, and underparts with pure white wings.',
    isFlagship: true
  },
  {
    id: 'spot-kalij-pheasant',
    commonName: 'Kalij Pheasant',
    hindiName: 'कलीज तीतर',
    scientificName: 'Lophura leucomelanos',
    category: 'bird',
    iucnStatus: 'LC',
    rarityInVTR: 'Uncommon',
    vtrHabitat: 'Foothill undergrowth, damp ravines, Someshwar bamboo thickets',
    bestZones: ['Someshwar Foothills', 'Manguraha Hill Tracts', 'Raghia'],
    bestTimeToSpot: 'Early morning foraging along forest roadside clearings',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Glossy blue-black plumage with white scalloping on lower back, crimson bare facial skin and backward crest.',
  },
  {
    id: 'spot-serpent-eagle',
    commonName: 'Crested Serpent Eagle',
    hindiName: 'सर्प गरुड़ (क्रेस्टेड सर्पेंट ईगल)',
    scientificName: 'Spilornis cheela',
    category: 'bird',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Sal canopy perches overlooking forest clearings and waterholes',
    bestZones: ['Valmikinagar', 'Gonauli', 'Gobardhana', 'Madanpur'],
    bestTimeToSpot: 'Midday soaring on thermals & calling with loud whistle',
    image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Broad rounded wings with prominent white bands underneath, spotted breast, fan-shaped black and white crest.',
  },
  {
    id: 'spot-fish-eagle',
    commonName: 'Grey-headed Fish Eagle',
    hindiName: 'ग्रे-हेडेड फिश ईगल (मत्स्य गरुड़)',
    scientificName: 'Haliaeetus ichthyaetus',
    category: 'bird',
    iucnStatus: 'NT',
    rarityInVTR: 'Uncommon',
    vtrHabitat: 'Slow-flowing river reaches, Gandak backwaters, Madanpur wetlands',
    bestZones: ['Gandak River', 'Valmikinagar Backwaters', 'Madanpur Wetlands'],
    bestTimeToSpot: 'Perched on high dead snags overlooking open water bodies',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Grey head contrasting with dark brown body, white belly and white tail with broad dark terminal band.',
  },
  {
    id: 'spot-lesser-adjutant',
    commonName: 'Lesser Adjutant Stork',
    hindiName: 'छोटा गरुड़ (लेसर एडजुटेंट)',
    scientificName: 'Leptoptilos javanicus',
    category: 'bird',
    iucnStatus: 'VU',
    rarityInVTR: 'Uncommon',
    vtrHabitat: 'Flooded paddy fields, wetland edges, river shallows',
    bestZones: ['Madanpur Wetlands', 'Buffer Zone Waterbodies', 'Gobardhana'],
    bestTimeToSpot: 'Morning wading in shallow wetlands and swampy pools',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Very large stork with dark glossy black upperparts, white underparts, bare reddish head and massive dagger-like bill.',
  },
  {
    id: 'spot-pied-hornbill',
    commonName: 'Oriental Pied Hornbill',
    hindiName: 'ओरिएंटल पाइड हॉर्नबिल',
    scientificName: 'Anthracoceros albirostris',
    category: 'bird',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Deciduous riverine woodlands, fruiting fig groves',
    bestZones: ['Valmikinagar Eco-zone', 'Gonauli', 'Manguraha'],
    bestTimeToSpot: 'Active in noisy small flocks around ripening figs',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Black and white plumage, yellowish casque with black patch, loud cackling calls among trees.',
  },
  {
    id: 'spot-peafowl',
    commonName: 'Indian Peafowl',
    hindiName: 'भारतीय मोर',
    scientificName: 'Pavo cristatus',
    category: 'bird',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Open forest trails, scrublands, riverbanks, safari road edges',
    bestZones: ['All VTR Ranges', 'Valmikinagar', 'Madanpur', 'Manguraha'],
    bestTimeToSpot: 'Early morning dust baths and loud honking alarm calls',
    image: 'https://images.unsplash.com/photo-1536514498073-50e69d19c0cf?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Brilliant iridescent blue neck, fan-shaped crest, magnificent train of eye-spotted feathers on males.',
  },

  // --- REPTILES & AQUATIC ---
  {
    id: 'spot-gharial',
    commonName: 'Gharial (Fish-eating Crocodile)',
    hindiName: 'घड़ियाल (पतले मुंह वाला मगर)',
    scientificName: 'Gavialis gangeticus',
    category: 'reptile',
    iucnStatus: 'CR',
    rarityInVTR: 'Big 5',
    vtrHabitat: 'Deep pool stretches and undisturbed sandbanks along River Gandak',
    bestZones: ['Valmikinagar Sandbanks', 'Gandak Riparian Sanctuary', 'Triveni Downstream'],
    bestTimeToSpot: 'Mid-morning sun basking on sandy riverbanks (09:30 - 13:00)',
    image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Long narrow slender snout with interlocking sharp teeth, males have bulbous pot-like "ghara" at snout tip.',
    isFlagship: true
  },
  {
    id: 'spot-mugger',
    commonName: 'Mugger / Marsh Crocodile',
    hindiName: 'मगरमच्छ (मार्श क्रोकोडाइल)',
    scientificName: 'Crocodylus palustris',
    category: 'reptile',
    iucnStatus: 'VU',
    rarityInVTR: 'Uncommon',
    vtrHabitat: 'Lakes, oxbow wetlands, canals, and slower river channels',
    bestZones: ['Madanpur Oxbow Lakes', 'Gandak Canals', 'Valmiki Barrage Backwaters'],
    bestTimeToSpot: 'Sunny winter afternoons basking near water edge',
    image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Broad, heavy snout, heavily armored keeled scales, broad snout compared to the narrow gharial.',
  },
  {
    id: 'spot-king-cobra',
    commonName: 'King Cobra',
    hindiName: 'राजनाग / किंग कोबरा',
    scientificName: 'Ophiophagus hannah',
    category: 'reptile',
    iucnStatus: 'VU',
    rarityInVTR: 'Rare / Elusive',
    vtrHabitat: 'Damp Sal forest floors, bamboo gullies near mountain streams',
    bestZones: ['Manguraha Stream Beds', 'Someshwar Forest Floor', 'Gobardhana'],
    bestTimeToSpot: 'Warm humid monsoon afternoons and forest stream crossings',
    image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'World’s longest venomous snake (up to 4-5m), chevron band markings, prominent narrow hood when raised.',
  },
  {
    id: 'spot-python',
    commonName: 'Indian Rock Python',
    hindiName: 'भारतीय अजगर',
    scientificName: 'Python molurus',
    category: 'reptile',
    iucnStatus: 'NT',
    rarityInVTR: 'Uncommon',
    vtrHabitat: 'Rocky burrows, riverbanks, hollow tree bases in moist valleys',
    bestZones: ['Madanpur Wetland Verges', 'Gobardhana Streams', 'Manguraha'],
    bestTimeToSpot: 'Winter midday basking at rock crevice mouths',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Large heavy-bodied non-venomous constrictor with yellowish-tan blotched puzzle patterns.',
  },
  {
    id: 'spot-monitor-lizard',
    commonName: 'Bengal Monitor Lizard',
    hindiName: 'गोयरा / बंगाल मॉनिटर छिपकली',
    scientificName: 'Varanus bengalensis',
    category: 'reptile',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Tree hollows, anthills, agricultural margins, dry stream beds',
    bestZones: ['All VTR Ranges', 'Valmikinagar', 'Gobardhana'],
    bestTimeToSpot: 'Sunny mornings foraging on forest floor and climbing tree trunks',
    image: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Reptile reaching over 1 meter with speckled greyish-brown skin, long forked tongue and sharp climbing claws.',
  },

  // --- FLORA & KEY TREES ---
  {
    id: 'spot-sal-tree',
    commonName: 'Sal Tree (Dominant Canopy)',
    hindiName: 'साल / सखुआ वृक्ष',
    scientificName: 'Shorea robusta',
    category: 'flora',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Forms over 75% of primary forest canopy throughout VTR',
    bestZones: ['All 8 Ranges of VTR', 'Valmikinagar', 'Manguraha', 'Gonauli'],
    bestTimeToSpot: 'Year-round evergreen/semi-deciduous tall canopy',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Tall straight cylindrical trunks rising 30-35m, dense dark green oval leaves with prominent lateral veins.',
  },
  {
    id: 'spot-mahua-tree',
    commonName: 'Mahua Tree (Wildlife Nectar Hub)',
    hindiName: 'महुआ का पेड़',
    scientificName: 'Madhuca longifolia',
    category: 'flora',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Deciduous forest tracts, buffer edges, tribal community groves',
    bestZones: ['Manguraha Buffer', 'Gobardhana', 'Chiutaha'],
    bestTimeToSpot: 'Spring flowering (March - April) when sweet fleshy flowers drop',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Spreading umbrella crown, thick grey bark; key hotspot where bears, deer, and flying squirrels gather during bloom.',
  },
  {
    id: 'spot-semal-tree',
    commonName: 'Semal / Red Silk Cotton Tree',
    hindiName: 'सेमल / लाल कपास का पेड़',
    scientificName: 'Bombax ceiba',
    category: 'flora',
    iucnStatus: 'LC',
    rarityInVTR: 'Common',
    vtrHabitat: 'Riverbanks, moist valley bottoms, forest roadsides',
    bestZones: ['Valmikinagar Riverine Forest', 'Madanpur', 'Gonauli'],
    bestTimeToSpot: 'Late winter to early spring (Feb - March) with flame-red blooms',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    identificationTip: 'Massive buttressed trunk with conical prickles when young, stunning cup-shaped red flowers attracting hundreds of birds.',
  }
];

export const VTR_ZONES = [
  'Valmikinagar Safari Zone',
  'Madanpur Range',
  'Gonauli Range',
  'Manguraha Range',
  'Gobardhana Range',
  'Harnatanr Range',
  'Someshwar Foothills',
  'Raghia Range',
  'Chiutaha Range',
  'Gandak River Riparian Track'
];

export const SAFARI_TIME_SLOTS = [
  'Morning Safari (06:00 - 09:30)',
  'Midday / River Cruise (10:00 - 13:30)',
  'Evening Safari (15:00 - 18:30)',
  'Night Patrol / Buffer Walk (19:00 - 21:00)',
  'Casual / Trail Walk'
];

export interface SpeciesSpotterProps {
  className?: string;
  defaultView?: 'grid' | 'checklist';
  showHeader?: boolean;
}

export const SpeciesSpotter: React.FC<SpeciesSpotterProps> = ({
  className = '',
  defaultView = 'grid',
  showHeader = true
}) => {
  const { addSighting, setActiveTab } = useData();
  const { language } = useLanguage();

  // Spotter Records State
  const [records, setRecords] = useState<Record<string, SpotterLogEntry>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Custom User Added Species
  const [customSpecies, setCustomSpecies] = useState<CustomSpeciesItem[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters and UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'spotted' | 'wishlist' | 'unmarked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'checklist'>(defaultView);
  const [expandedSpeciesId, setExpandedSpeciesId] = useState<string | null>(null);

  // Active Logging Modal State
  const [loggingSpecies, setLoggingSpecies] = useState<SpotterSpecies | null>(null);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logTimeSlot, setLogTimeSlot] = useState(SAFARI_TIME_SLOTS[0]);
  const [logZone, setLogZone] = useState(VTR_ZONES[0]);
  const [logCount, setLogCount] = useState(1);
  const [logLandmark, setLogLandmark] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logGuideName, setLogGuideName] = useState('');
  const [publishToFeed, setPublishToFeed] = useState(true);

  // Custom Species Add Modal State
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSciName, setCustomSciName] = useState('');
  const [customCat, setCustomCat] = useState<'mammal' | 'bird' | 'reptile' | 'amphibian' | 'flora'>('bird');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customZone, setCustomZone] = useState(VTR_ZONES[0]);
  const [customCount, setCustomCount] = useState(1);
  const [customNotes, setCustomNotes] = useState('');

  // Export / Print Modal
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Reset Confirmation
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save spotter records:', e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customSpecies));
    } catch (e) {
      console.error('Failed to save custom spotter records:', e);
    }
  }, [customSpecies]);

  // Calculations & Stats
  const totalCatalogCount = VTR_SPECIES_CATALOG.length;
  
  const stats = useMemo(() => {
    let spotted = 0;
    let wishlist = 0;

    (Object.values(records) as SpotterLogEntry[]).forEach((rec: SpotterLogEntry) => {
      if (rec.status === 'spotted') spotted += 1;
      if (rec.status === 'wishlist') wishlist += 1;
    });

    // Also count custom species spotted
    const totalSpottedCount = spotted + customSpecies.length;
    const completionPercent = Math.round((spotted / totalCatalogCount) * 100);

    // Big 5 status
    const big5Species = VTR_SPECIES_CATALOG.filter(s => s.rarityInVTR === 'Big 5');
    const big5Spotted = big5Species.filter(s => records[s.id]?.status === 'spotted').length;

    // Aquatic Trio (Gharial, Dolphin, Mugger)
    const aquaticTrio = ['spot-gharial', 'spot-dolphin', 'spot-mugger'];
    const aquaticSpotted = aquaticTrio.filter(id => records[id]?.status === 'spotted').length;

    return {
      spotted: totalSpottedCount,
      wishlist,
      unmarked: totalCatalogCount - spotted,
      completionPercent,
      big5Spotted,
      big5Total: big5Species.length,
      aquaticSpotted,
      aquaticTotal: aquaticTrio.length
    };
  }, [records, customSpecies, totalCatalogCount]);

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    return VTR_SPECIES_CATALOG.filter(item => {
      const itemStatus = records[item.id]?.status || 'unmarked';

      // Status Filter
      if (statusFilter !== 'all' && itemStatus !== statusFilter) {
        return false;
      }

      // Category Filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Rarity Filter
      if (rarityFilter !== 'all') {
        if (rarityFilter === 'Big 5' && item.rarityInVTR !== 'Big 5') return false;
        if (rarityFilter === 'Flagship' && !item.isFlagship) return false;
        if (rarityFilter === 'CR_EN' && item.iucnStatus !== 'CR' && item.iucnStatus !== 'EN') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.commonName.toLowerCase().includes(q);
        const matchesHindi = item.hindiName.toLowerCase().includes(q);
        const matchesSci = item.scientificName.toLowerCase().includes(q);
        const matchesHabitat = item.vtrHabitat.toLowerCase().includes(q);
        const matchesZones = item.bestZones.some(z => z.toLowerCase().includes(q));

        if (!matchesName && !matchesHindi && !matchesSci && !matchesHabitat && !matchesZones) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, statusFilter, categoryFilter, rarityFilter, records]);

  // Quick Status Toggle (Unmarked -> Wishlist -> Spotted -> Unmarked)
  const handleQuickToggle = (species: SpotterSpecies, targetStatus: SpotterStatus) => {
    const current = records[species.id]?.status || 'unmarked';
    if (current === targetStatus) {
      // Toggle off to unmarked
      setRecords(prev => {
        const next = { ...prev };
        delete next[species.id];
        return next;
      });
      return;
    }

    if (targetStatus === 'spotted') {
      // Open the detailed log modal to capture date, zone, and notes
      openLoggingModal(species);
    } else {
      // Set to wishlist
      setRecords(prev => ({
        ...prev,
        [species.id]: {
          speciesId: species.id,
          status: 'wishlist',
          markedAt: new Date().toISOString()
        }
      }));
    }
  };

  // Open Log Modal
  const openLoggingModal = (species: SpotterSpecies) => {
    const existing = records[species.id];
    setLoggingSpecies(species);
    setLogDate(existing?.sightedAt || new Date().toISOString().split('T')[0]);
    setLogTimeSlot(existing?.timeSlot || SAFARI_TIME_SLOTS[0]);
    setLogZone(existing?.zone || species.bestZones[0] || VTR_ZONES[0]);
    setLogCount(existing?.count || 1);
    setLogLandmark(existing?.locationLandmark || '');
    setLogNotes(existing?.notes || '');
    setLogGuideName(existing?.guideName || '');
  };

  // Save Sighting Log
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingSpecies) return;

    const newLog: SpotterLogEntry = {
      speciesId: loggingSpecies.id,
      status: 'spotted',
      sightedAt: logDate,
      timeSlot: logTimeSlot,
      zone: logZone,
      count: Number(logCount) || 1,
      locationLandmark: logLandmark.trim(),
      notes: logNotes.trim(),
      guideName: logGuideName.trim(),
      markedAt: new Date().toISOString()
    };

    setRecords(prev => ({
      ...prev,
      [loggingSpecies.id]: newLog
    }));

    // Optionally publish as citizen science observation report
    if (publishToFeed) {
      addSighting({
        species: loggingSpecies.commonName,
        generalLocation: logZone,
        date: logDate,
        timeOfDay: logTimeSlot,
        numberOfAnimals: Number(logCount) || 1,
        behavior: logNotes.trim() ? `${logNotes.trim()}${logLandmark ? ` (Near: ${logLandmark})` : ''}` : `Observed during ${logTimeSlot} in ${logZone}`,
        observer: logGuideName ? `Visitor with Guide: ${logGuideName}` : 'Safari Spotter Participant',
        photoUrl: loggingSpecies.image,
        verificationStatus: 'reported'
      });
    }

    setLoggingSpecies(null);
  };

  // Add Custom Sighting
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newCustom: CustomSpeciesItem = {
      id: `custom-${Date.now()}`,
      commonName: customName.trim(),
      scientificName: customSciName.trim() || undefined,
      category: customCat,
      sightedAt: customDate,
      zone: customZone,
      count: Number(customCount) || 1,
      notes: customNotes.trim()
    };

    setCustomSpecies(prev => [newCustom, ...prev]);

    if (publishToFeed) {
      addSighting({
        species: customName.trim(),
        generalLocation: customZone,
        date: customDate,
        timeOfDay: 'Field Safari',
        numberOfAnimals: Number(customCount) || 1,
        behavior: customNotes.trim() || 'Custom wildlife sighting recorded via Species Spotter',
        observer: 'Citizen Birder / Naturalist',
        verificationStatus: 'reported'
      });
    }

    setCustomName('');
    setCustomSciName('');
    setCustomNotes('');
    setIsAddCustomOpen(false);
  };

  // Delete Custom
  const handleDeleteCustom = (id: string) => {
    setCustomSpecies(prev => prev.filter(c => c.id !== id));
  };

  // Reset all
  const handleResetChecklist = () => {
    setRecords({});
    setCustomSpecies([]);
    setIsResetConfirmOpen(false);
  };

  // Generate Printable / Copyable Safari Log
  const safariLogText = useMemo(() => {
    const lines: string[] = [];
    lines.push('==============================================');
    lines.push('🌿 VALMIKI TIGER RESERVE - SAFARI FIELD LOG 🌿');
    lines.push('==============================================');
    lines.push(`Generated On: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`);
    lines.push(`Total Species Spotted: ${stats.spotted} / ${totalCatalogCount}`);
    lines.push(`Safari Big 5 Logged: ${stats.big5Spotted} / ${stats.big5Total}`);
    lines.push('----------------------------------------------');
    lines.push('\n[ CONFIRMED SIGHTINGS / SPOTTED LIST ]\n');

    let count = 1;
    VTR_SPECIES_CATALOG.forEach(s => {
      const rec = records[s.id];
      if (rec?.status === 'spotted') {
        lines.push(`${count}. ${s.commonName} (${s.scientificName})`);
        lines.push(`   - Sighted Date: ${rec.sightedAt || 'N/A'}`);
        lines.push(`   - Safari Zone: ${rec.zone || 'VTR Core'}`);
        lines.push(`   - Time Slot: ${rec.timeSlot || 'Safari'}`);
        lines.push(`   - Count Observed: ${rec.count || 1}`);
        if (rec.notes) lines.push(`   - Field Notes: ${rec.notes}`);
        if (rec.guideName) lines.push(`   - Guide/Driver: ${rec.guideName}`);
        lines.push('');
        count++;
      }
    });

    customSpecies.forEach(c => {
      lines.push(`${count}. [Custom] ${c.commonName} ${c.scientificName ? `(${c.scientificName})` : ''}`);
      lines.push(`   - Sighted Date: ${c.sightedAt}`);
      lines.push(`   - Zone: ${c.zone}`);
      lines.push(`   - Count: ${c.count}`);
      if (c.notes) lines.push(`   - Field Notes: ${c.notes}`);
      lines.push('');
      count++;
    });

    if (stats.wishlist > 0) {
      lines.push('\n[ 🎯 TARGET WISHLIST / HOPE TO SEE ]\n');
      let wCount = 1;
      VTR_SPECIES_CATALOG.forEach(s => {
        if (records[s.id]?.status === 'wishlist') {
          lines.push(`${wCount}. ${s.commonName} (${s.scientificName}) - Best Zone: ${s.bestZones.join(', ')}`);
          wCount++;
        }
      });
    }

    lines.push('\n==============================================');
    lines.push('Valmiki Tiger Watch • Wildlife Protection Platform');
    lines.push('Coexistence • Conservation • Citizen Science');
    return lines.join('\n');
  }, [records, customSpecies, stats, totalCatalogCount]);

  const handleCopyLog = () => {
    navigator.clipboard.writeText(safariLogText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const getIucnColor = (status: string) => {
    switch (status) {
      case 'CR': return 'bg-red-600 text-white';
      case 'EN': return 'bg-orange-600 text-white';
      case 'VU': return 'bg-amber-600 text-white';
      case 'NT': return 'bg-yellow-500 text-stone-900';
      default: return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div id="vtr-species-spotter" className={`space-y-6 sm:space-y-8 animate-fade-in ${className}`}>
      
      {/* Top Header & Overview */}
      {showHeader && (
        <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#145A43] shadow-lg relative overflow-hidden">
          {/* Subtle Ambient Pattern */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
                <Binoculars className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'hi' ? 'वीटीआर वन्यजीव दर्शन चेकलिस्ट' : language === 'ur' ? 'چیک لسٹ برائے وائلڈ لائف' : 'VTR Field Safari Checklist'}
                </span>
              </div>

              {/* Action Buttons: Export Log & Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="px-3.5 py-1.5 bg-[#07271D] hover:bg-[#0e3b2e] border border-emerald-500/40 hover:border-emerald-400 text-emerald-200 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Export Field Safari Log"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hi' ? 'सफ़ारी लॉग निर्यात' : 'Export Field Log'}</span>
                </button>

                <button
                  onClick={() => setIsAddCustomOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '+ नया जीव जोड़ें' : '+ Add Custom Sighting'}</span>
                </button>
              </div>
            </div>

            <div className="max-w-3xl space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {language === 'hi' ? 'स्पीशीज स्पॉटर — वन्यजीव चेकलिस्ट' : language === 'ur' ? 'اسپیشیز سپاٹر — جنگلی حیات چیک لسٹ' : 'Species Spotter — Safari Wildlife Checklist'}
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                {language === 'hi'
                  ? 'वाल्मीकि टाइगर रिज़र्व के सफ़ारी के दौरान देखे गए जीवों को चिह्नित करें या अपनी विशलिस्ट बनाएं। यह सूची आपके डिवाइस पर सुरक्षित रहती है और ऑफ़लाइन भी काम करती है।'
                  : 'Track and log your wildlife encounters across Valmiki’s eight forest ranges. Mark what you hope to see, record exact safari sightings, and contribute valuable records to the VTR citizen register.'}
              </p>
            </div>

            {/* Scorecard & Badges Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Card 1: Total Spotted */}
              <div className="bg-[#07271D]/90 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                  <span>{language === 'hi' ? 'देखे गए जीव' : 'Spotted / Seen'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{stats.spotted}</span>
                  <span className="text-xs text-emerald-300/70 font-mono">/ {totalCatalogCount}</span>
                </div>
                <div className="mt-2 w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, stats.completionPercent)}%` }} 
                  />
                </div>
              </div>

              {/* Card 2: Wishlist */}
              <div className="bg-[#07271D]/90 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                  <span>{language === 'hi' ? 'विशलिस्ट (लक्ष्य)' : 'Wishlist Targets'}</span>
                  <Heart className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">{stats.wishlist}</span>
                  <span className="text-xs text-amber-200/60 font-mono">desired</span>
                </div>
                <p className="mt-2 text-[11px] text-amber-200/80 truncate">
                  {stats.wishlist === 0 ? 'Mark targets below' : `${stats.wishlist} on safari watchlist`}
                </p>
              </div>

              {/* Card 3: Valmiki Big 5 */}
              <div className="bg-[#07271D]/90 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                  <span>{language === 'hi' ? 'वाल्मीकि बिग-5' : 'Valmiki Big 5'}</span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">{stats.big5Spotted}</span>
                  <span className="text-xs text-amber-200/60 font-mono">/ {stats.big5Total}</span>
                </div>
                <div className="mt-2 text-[11px] text-stone-300">
                  {stats.big5Spotted === stats.big5Total ? (
                    <span className="text-emerald-400 font-bold">🏆 Big 5 Master!</span>
                  ) : (
                    <span>Tiger, Leopard, Gaur, Elephant, Bear</span>
                  )}
                </div>
              </div>

              {/* Card 4: Aquatic Trio */}
              <div className="bg-[#07271D]/90 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                  <span>{language === 'hi' ? 'गंडक जलीय त्रिमूर्ति' : 'Gandak Aquatic 3'}</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-300 font-mono">{stats.aquaticSpotted}</span>
                  <span className="text-xs text-emerald-300/70 font-mono">/ {stats.aquaticTotal}</span>
                </div>
                <p className="mt-2 text-[11px] text-stone-300">
                  <span>Gharial, Dolphin, Mugger</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'जीव का नाम, वैज्ञानिक नाम या क्षेत्र खोजें...' : 'Search species by common name, scientific name, or safari zone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Reset Button */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-mono">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-stone-900 shadow-xs font-bold' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कार्ड व्यू' : 'Photo Cards'}</span>
              </button>
              <button
                onClick={() => setViewMode('checklist')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'checklist' 
                    ? 'bg-white text-stone-900 shadow-xs font-bold' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'फील्ड चेकलिस्ट' : 'Field Table'}</span>
              </button>
            </div>

            {/* Clear / Reset */}
            {(stats.spotted > 0 || stats.wishlist > 0) && (
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-stone-200 transition-colors"
                title="Reset All Checklist Markers"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-400 font-mono text-[11px] mr-1">Status:</span>
            {[
              { id: 'all', label: `All (${totalCatalogCount})` },
              { id: 'spotted', label: `✅ Spotted (${stats.spotted})` },
              { id: 'wishlist', label: `🎯 Wishlist (${stats.wishlist})` },
              { id: 'unmarked', label: `⏳ Unmarked (${stats.unmarked})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#0B3D2E] text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-400 font-mono text-[11px] mr-1">Category:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'mammal', label: 'Mammals' },
              { id: 'bird', label: 'Birds' },
              { id: 'reptile', label: 'Reptiles & Aquatic' },
              { id: 'flora', label: 'Key Flora' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Custom Added Species Banner (if any) */}
      {customSpecies.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-950">
                {language === 'hi' ? 'आपके द्वारा जोड़े गए विशेष वन्यजीव रिकॉर्ड' : 'Custom Field Observations Logged'} ({customSpecies.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-800 font-medium">Citizen Additions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {customSpecies.map(custom => (
              <div key={custom.id} className="bg-white border border-amber-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-stone-900 text-sm">{custom.commonName}</span>
                    <button 
                      onClick={() => handleDeleteCustom(custom.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                      title="Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {custom.scientificName && (
                    <p className="text-xs text-stone-500 italic font-serif">{custom.scientificName}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-600 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" /> {custom.sightedAt}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" /> {custom.zone}
                    </span>
                    <span>•</span>
                    <span>Count: {custom.count}</span>
                  </div>
                  {custom.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-1.5 border border-stone-100">
                      "{custom.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid View of Species */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCatalog.map(species => {
            const record = records[species.id];
            const status = record?.status || 'unmarked';
            const isSpotted = status === 'spotted';
            const isWishlist = status === 'wishlist';
            const isExpanded = expandedSpeciesId === species.id;

            return (
              <div 
                key={species.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isSpotted 
                    ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                    : isWishlist 
                    ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20' 
                    : 'border-stone-200 hover:border-stone-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Photo & Quick Status Overlays */}
                  <div className="relative h-48 bg-stone-100 overflow-hidden group">
                    <img 
                      src={species.image} 
                      alt={species.commonName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category & IUCN Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${getIucnColor(species.iucnStatus)}`}>
                        {species.iucnStatus}
                      </span>
                      {species.isFlagship && (
                        <span className="bg-amber-500 text-stone-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <Trophy className="w-2.5 h-2.5" />
                          <span>Flagship</span>
                        </span>
                      )}
                    </div>

                    {/* Status Badge in Photo */}
                    <div className="absolute top-3 right-3">
                      {isSpotted ? (
                        <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sighted</span>
                        </span>
                      ) : isWishlist ? (
                        <span className="bg-amber-500 text-stone-950 font-mono text-xs font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>Wishlist</span>
                        </span>
                      ) : (
                        <span className="bg-black/50 backdrop-blur-xs text-stone-300 font-mono text-[10px] px-2 py-0.5 rounded-lg border border-white/10">
                          Unmarked
                        </span>
                      )}
                    </div>

                    {/* Title in Photo Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-serif font-bold text-base sm:text-lg leading-tight drop-shadow-xs">
                        {species.commonName}
                      </h3>
                      <p className="text-xs text-stone-200 font-serif italic drop-shadow-xs">
                        {species.scientificName}
                      </p>
                      {species.hindiName && (
                        <p className="text-[11px] text-amber-300 font-sans mt-0.5">
                          {species.hindiName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    
                    {/* Primary Habitat & Best Zones */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-start gap-1.5 text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong>Best Zones:</strong> {species.bestZones.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-stone-600">
                        <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong>Active Time:</strong> {species.bestTimeToSpot}
                        </span>
                      </div>
                    </div>

                    {/* Identification Hint */}
                    <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 text-xs text-stone-700 space-y-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                        Spotting Tip:
                      </span>
                      <p className="text-[11px] leading-relaxed text-stone-600">
                        {species.identificationTip}
                      </p>
                    </div>

                    {/* Sighting Details if Spotted */}
                    {isSpotted && record && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                        <div className="flex items-center justify-between font-mono font-bold text-[11px] text-emerald-900">
                          <span>✅ Sighted Record Logged</span>
                          <button 
                            onClick={() => openLoggingModal(species)}
                            className="text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-emerald-800 pt-0.5">
                          <span>📅 {record.sightedAt || 'Date N/A'}</span>
                          <span>📍 {record.zone?.split(' ')[0] || 'VTR'}</span>
                          <span>🕒 {record.timeSlot?.split(' ')[0] || 'Safari'}</span>
                          <span>🐾 Count: {record.count || 1}</span>
                        </div>
                        {record.notes && (
                          <p className="text-[11px] text-emerald-900/90 italic pt-1 border-t border-emerald-200/60">
                            "{record.notes}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="p-4 pt-0 border-t border-stone-100 bg-stone-50/50 mt-2">
                  <div className="flex items-center gap-2 pt-3">
                    {/* Wishlist Toggle Button */}
                    <button
                      onClick={() => handleQuickToggle(species, 'wishlist')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        isWishlist
                          ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                          : 'bg-white hover:bg-amber-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlist ? 'fill-current' : 'text-amber-500'}`} />
                      <span>{isWishlist ? 'In Wishlist' : 'Wishlist'}</span>
                    </button>

                    {/* Sighted / Spotted Toggle Button */}
                    <button
                      onClick={() => handleQuickToggle(species, 'spotted')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        isSpotted
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white hover:bg-emerald-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isSpotted ? 'text-white stroke-[3]' : 'text-emerald-600'}`} />
                      <span>{isSpotted ? 'Spotted ✓' : 'I Saw This!'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Field Checklist Table View */}
      {viewMode === 'checklist' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B3D2E] text-white font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Species & Taxonomy</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Category / IUCN</th>
                  <th className="py-3 px-4 hidden md:table-cell">Prime VTR Habitat & Zones</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCatalog.map(species => {
                  const record = records[species.id];
                  const status = record?.status || 'unmarked';
                  const isSpotted = status === 'spotted';
                  const isWishlist = status === 'wishlist';

                  return (
                    <tr 
                      key={species.id} 
                      className={`transition-colors hover:bg-stone-50 ${
                        isSpotted ? 'bg-emerald-50/40' : isWishlist ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Checkbox status */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickToggle(species, isSpotted ? 'unmarked' : 'spotted')}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isSpotted 
                              ? 'bg-emerald-600 text-white shadow-xs' 
                              : isWishlist
                              ? 'bg-amber-400 text-stone-950 border border-amber-500'
                              : 'border border-stone-300 hover:border-emerald-500'
                          }`}
                          title={isSpotted ? 'Spotted! Click to toggle' : 'Click to mark as spotted'}
                        >
                          {isSpotted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : isWishlist ? <Heart className="w-3 h-3 fill-current" /> : null}
                        </button>
                      </td>

                      {/* Species info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={species.image} 
                            alt={species.commonName} 
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 text-sm leading-snug block">
                              {species.commonName}
                            </span>
                            <span className="text-[11px] text-stone-500 italic font-serif">
                              {species.scientificName}
                            </span>
                            {species.hindiName && (
                              <span className="text-[10px] text-amber-800 block">
                                {species.hindiName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category & Status */}
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="space-y-1">
                          <span className="capitalize font-mono text-[11px] text-stone-700 block">
                            {species.category}
                          </span>
                          <span className={`inline-block font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${getIucnColor(species.iucnStatus)}`}>
                            {species.iucnStatus}
                          </span>
                        </div>
                      </td>

                      {/* Zones */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="text-stone-600 text-xs space-y-0.5 max-w-xs">
                          <p className="truncate font-medium">{species.bestZones.join(', ')}</p>
                          <p className="text-[11px] text-stone-400">{species.bestTimeToSpot}</p>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleQuickToggle(species, 'wishlist')}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isWishlist 
                                ? 'bg-amber-500 text-stone-950 border-amber-600' 
                                : 'text-stone-400 hover:text-amber-600 border-stone-200'
                            }`}
                            title="Target Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlist ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            onClick={() => openLoggingModal(species)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors flex items-center gap-1 ${
                              isSpotted
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                            }`}
                            title="Log Safari Observation Details"
                          >
                            {isSpotted ? <span>Logged ✓</span> : <span>Log</span>}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCatalog.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 space-y-3">
          <Binoculars className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-900">
            No matching wildlife species found
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Try adjusting your search keywords or switching filters to "All" to browse the full Valmiki biodiversity directory.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setRarityFilter('all');
            }}
            className="px-4 py-2 bg-[#0B3D2E] text-white font-mono text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Sighting Log Modal                                              */}
      {/* ========================================================================= */}
      {loggingSpecies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={loggingSpecies.image} 
                  alt={loggingSpecies.commonName} 
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                />
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Field Safari Log
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                    {loggingSpecies.commonName}
                  </h3>
                  <p className="text-xs text-stone-500 italic font-serif">
                    {loggingSpecies.scientificName}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setLoggingSpecies(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4 text-xs">
              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Sighting Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Safari Time Slot
                  </label>
                  <select
                    value={logTimeSlot}
                    onChange={(e) => setLogTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none text-xs"
                  >
                    {SAFARI_TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Zone & Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    VTR Forest Range / Safari Track
                  </label>
                  <select
                    value={logZone}
                    onChange={(e) => setLogZone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none text-xs"
                  >
                    {VTR_ZONES.map(zone => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Number Observed / Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={logCount}
                    onChange={(e) => setLogCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Landmark & Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Nearby Landmark / River Track
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Pandai Causeway, Tower 4, Sal Patch"
                    value={logLandmark}
                    onChange={(e) => setLogLandmark(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Guide / Naturalist Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Tharu / Forest Guide #14"
                    value={logGuideName}
                    onChange={(e) => setLogGuideName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-mono font-bold text-stone-700 block mb-1">
                  Field Behavior & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Observed drinking at waterhole with cub, basking on sandbank, alarm calls heard prior to sighting..."
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none text-xs"
                />
              </div>

              {/* Public Feed Checkbox */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="publishFeedCheck"
                  checked={publishToFeed}
                  onChange={(e) => setPublishToFeed(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                />
                <label htmlFor="publishFeedCheck" className="text-[11px] text-emerald-900 leading-snug cursor-pointer">
                  <strong>Submit to VTR Community Sightings:</strong> Also broadcast this non-sensitive observation to the public citizen science feed so other visitors can appreciate current wildlife activity.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setLoggingSpecies(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-mono text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Sighting Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Add Custom Wildlife Sighting                                    */}
      {/* ========================================================================= */}
      {isAddCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5">
            
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Citizen Science
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">
                  Add Custom Wildlife Sighting
                </h3>
                <p className="text-xs text-stone-500">
                  Record a rare bird, butterfly, or unique flora not listed in the preset directory.
                </p>
              </div>
              <button 
                onClick={() => setIsAddCustomOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Common Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Black Stork / Emerald Dove"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Taxonomic Category
                  </label>
                  <select
                    value={customCat}
                    onChange={(e) => setCustomCat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none"
                  >
                    <option value="bird">Avian / Bird</option>
                    <option value="mammal">Mammal</option>
                    <option value="reptile">Reptile & Aquatic</option>
                    <option value="flora">Flora / Plant</option>
                    <option value="amphibian">Amphibian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Date Sighted
                  </label>
                  <input
                    type="date"
                    required
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono font-bold text-stone-700 block mb-1">
                    Forest Range / Zone
                  </label>
                  <select
                    value={customZone}
                    onChange={(e) => setCustomZone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none"
                  >
                    {VTR_ZONES.map(zone => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono font-bold text-stone-700 block mb-1">
                  Field Notes & Distinctive Features
                </label>
                <textarea
                  rows={2}
                  placeholder="Details on plumage, call, behaviour, or exact habitat location..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-mono text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-mono text-xs font-bold shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Export / Print Safari Field Log                                 */}
      {/* ========================================================================= */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Safari Field Log
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 mt-1">
                  Export Safari Checklist & Field Notes
                </h3>
              </div>
              <button 
                onClick={() => setIsExportOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Below is your generated Valmiki Tiger Reserve safari observation dossier. You can copy it to your clipboard for your travel journal or print it as a keepsake.
            </p>

            {/* Formatted Textarea Output */}
            <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-72 border border-stone-800 whitespace-pre">
              {safariLogText}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLog}
                  className="px-5 py-2.5 bg-[#0B3D2E] hover:bg-[#145A43] text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  {copiedText ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Log Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: Reset Confirmation                                              */}
      {/* ========================================================================= */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Clear All Checklist Markers?
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              This will remove all marked spotted sightings and wishlist targets saved in your local safari notebook. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-mono text-xs font-bold"
              >
                Keep Records
              </button>
              <button
                onClick={handleResetChecklist}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs font-bold"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
