import { GoogleGenAI } from '@google/genai';

export interface ChatRequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  sourceAttribution?: string;
  modelUsed: string;
  isAiLive: boolean;
  suggestedActions?: { label: string; tab?: string; externalUrl?: string; actionType?: 'open_volunteer' | 'open_supporter' | 'navigate' }[];
}

interface KnowledgeBaseEntry {
  keywords: string[];
  reply: string;
  source: string;
  suggestedActions?: { label: string; tab?: string; externalUrl?: string; actionType?: 'open_volunteer' | 'open_supporter' | 'navigate' }[];
}

const SYSTEM_INSTRUCTION = `You are the "Valmiki Tiger Watch AI Assistant", an official, courteous, and conservation-focused assistant for Valmiki Tiger Watch (dedicated to Valmiki Tiger Reserve in West Champaran, Bihar, India).

YOUR CORE RESPONSIBILITIES & BOUNDARIES:
1. ACCURACY & VERIFIED KNOWLEDGE:
   - Valmiki Tiger Reserve (VTR) is Bihar's only tiger reserve, located in West Champaran district on the Indo-Nepal border (contiguous with Chitwan National Park).
   - Official Tiger Population: 54 tigers verified in the latest NTCA 5th Cycle All India Tiger Estimation (up from 31 in 2018 and ~8-10 in 2010). India has 3,682 tigers.
   - Area: 898.45 sq km (Core 545.15 sq km, Buffer 353.3 sq km) across 8 forest ranges (Valmikinagar, Harnatanr, Madanpur, Gonauli, Kotraha, Chiutaha, Raghia, Manguraha).
   - Biodiversity: Bengal Tiger, Indian Leopard, Sloth Bear, Gaur (Indian Bison), Gharial, Mugger crocodile, Gangetic Dolphin, 250+ bird species.
   - Eco-tourism: Best time to visit is November through April. Safari gates at Valmikinagar, Manguraha, Madanpur. Activities: Gypsy safari, river boating on Gandak, canopy walk.
   - Community: Indigenous Tharu and Oraon tribes, Eco-Development Committees (EDCs), Sikki grass handicrafts.
   - Emergency & Rescue: VTR Field Directorate Helpline: 06254-232140 / 1926 / Police 112.

2. STRICT FACTUAL GUARDRAILS:
   - DO NOT invent tiger population figures or individual tiger codes/names.
   - DO NOT invent news stories, research reports, or government decrees.
   - DO NOT provide dangerous wildlife handling or capture instructions.
   - If factual details on a specific topic are unavailable or unverified, clearly state: "I could not find verified information on this topic in the Valmiki Tiger Reserve records."
   - Always prioritize wildlife safety, ethical distance (minimum 20m), zero littering, and official forest department protocols.
   - Provide multilingual assistance in English, Hindi (हिंदी), or Urdu (اردو) matching the user's language.

3. VOLUNTEERING & SUPPORT:
   - Tell visitors they can join as a volunteer or supporter via the "Become a Volunteer" and "Become a Supporter" forms on Valmiki Tiger Watch.`;

const VERIFIED_KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  {
    keywords: ['what is valmiki', 'about valmiki', 'about vtr', 'valmiki tiger reserve', 'overview'],
    reply: `Valmiki Tiger Reserve (VTR) is the only tiger reserve in Bihar, India. Encompassing 898.45 sq km in the West Champaran district along the Indo-Nepal border, it represents the easternmost limit of the Himalayan Terai bhabar sal forests and forms a contiguous transboundary wildlife corridor with Nepal's Chitwan National Park.

Key Facts:
• Core Area: 545.15 sq km | Buffer Area: 353.30 sq km
• Established: Wildlife Sanctuary in 1978, Tiger Reserve in 1990 (18th Project Tiger Reserve)
• Current Tiger Count: 54 verified individuals (NTCA 5th Cycle AITE)
• Forest Ranges: Valmikinagar, Harnatanr, Madanpur, Gonauli, Kotraha, Chiutaha, Raghia, Manguraha`,
    source: 'National Tiger Conservation Authority (NTCA) & Bihar Forest Department Official Records',
    suggestedActions: [
      { label: 'Explore VTR History', tab: 'about-vtr', actionType: 'navigate' },
      { label: 'Tigers of VTR', tab: 'tigers', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['where is', 'location', 'located', 'how to reach', 'district', 'champaran', 'state', 'railway', 'airport'],
    reply: `Valmiki Tiger Reserve is situated in the West Champaran district of northern Bihar, India, bordering the Chitwan National Park of Nepal to the north and Uttar Pradesh to the west along the Gandak River.

How to Reach:
• Nearest Railway Station: Bagaha (BUG) ~ 45 km, or Narkatiaganj (NKE) ~ 75 km
• Nearest Airport: Gorakhpur Airport (GOP) ~ 125 km, or Patna Airport (PAT) ~ 280 km
• By Road: Connected via NH-727 from Bettiah and Gorakhpur`,
    source: 'Valmiki Tiger Reserve Field Directorate, Bettiah',
    suggestedActions: [
      { label: 'Travel Guide & Transit', tab: 'travel-guide', actionType: 'navigate' },
      { label: 'Interactive Map & Gates', tab: 'map', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['animal', 'wildlife', 'species', 'biodiversity', 'found in vtr', 'fauna', 'birds'],
    reply: `Valmiki Tiger Reserve harbors exceptional biodiversity due to its unique Terai-Bhabar and riverine Gandak ecosystem.

Verified Fauna of VTR:
• Apex Predators: Bengal Tiger (54 verified), Indian Leopard, Wild Dog (Dhole)
• Large Mammals: Sloth Bear, Gaur (Indian Bison), Sambar, Chital (Spotted Deer), Barking Deer, Hog Deer, Wild Boar
• Riverine Wildlife: Gharial (Gavialis gangeticus), Mugger Crocodile, Gangetic River Dolphin, Smooth-coated Otter
• Avifauna: 250+ bird species including Great Hornbill, Kalij Pheasant, Bengal Florican, and Osprey`,
    source: 'Wildlife Institute of India (WII) Faunal Survey & VTR Management Plan',
    suggestedActions: [
      { label: 'Wildlife Catalog', tab: 'wildlife', actionType: 'navigate' },
      { label: 'Interactive Species Spotter', tab: 'species-spotter', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['how can i visit', 'visit vtr', 'safari', 'booking', 'best time', 'season', 'tourism', 'eco-tourism', 'fee', 'cost'],
    reply: `Planning a visit to Valmiki Tiger Reserve:

• Best Season: November to April (Pleasant weather; reserve gates open for wildlife safaris).
• Monsoon Closure: July to October (Annual seasonal closure for animal breeding and safety).
• Safari Types: Open Gypsy Safaris in Valmikinagar and Manguraha ranges, Gandak River Eco-Boating, and Canopy Canopy Boardwalk.
• Safari Shifts: Morning (6:00 AM – 10:00 AM) and Afternoon (2:00 PM – 5:30 PM).
• Accommodations: Valmiki Vihar Hotel, Eco-Huts at Valmikinagar, Bamboo Huts at Manguraha.`,
    source: 'Bihar State Tourism Development Corporation (BSTDC) & VTR Ecotourism Wing',
    suggestedActions: [
      { label: 'Safari & Stay Guide', tab: 'ecotourism', actionType: 'navigate' },
      { label: 'Sightseeing & Heritage', tab: 'sightseeing', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['volunteer', 'become a volunteer', 'volunteering', 'how to volunteer', 'join'],
    reply: `You can join Valmiki Tiger Watch as a registered volunteer!

Volunteering Areas:
• Tiger Conservation & Habitat Monitoring
• Wildlife Awareness & School Outreach
• Biodiversity & Flora/Fauna Surveys
• Research Assistance & Field Documentation
• Photography, Media & Storytelling
• Eco-Tourism & Visitor Education
• Digital & Technical Support

Click the "Become a Volunteer" button to register your interest, skills, and availability.`,
    source: 'Valmiki Tiger Watch Volunteer Network',
    suggestedActions: [
      { label: 'Register as Volunteer', actionType: 'open_volunteer' },
      { label: 'Community & Tharu Tribes', tab: 'community', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['support', 'supporter', 'become a supporter', 'how can i support', 'contribute', 'donation', 'help'],
    reply: `You can actively champion tiger conservation by becoming an official Supporter of Valmiki Tiger Watch!

Supporter Engagement Options:
• Conservation Awareness in schools & communities
• Research Support & Academic Collaboration
• Community Outreach with Tharu tribal families
• Digital / Technical Support & Website assistance
• Media & Responsible Publicity
• Voluntary Contributions to education programs

Click "Become a Supporter" to pledge your involvement.`,
    source: 'Valmiki Tiger Watch Stewardship Program',
    suggestedActions: [
      { label: 'Register as Supporter', actionType: 'open_supporter' },
      { label: 'Project Tiger 50 Years', tab: 'project-tiger', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['research', 'publication', 'paper', 'study', 'scientific', 'census', 'data'],
    reply: `Valmiki Tiger Reserve is an active landscape for scientific wildlife research in collaboration with the National Tiger Conservation Authority (NTCA) and Wildlife Institute of India (WII).

Verified Research Themes:
• Camera-Trap Spatial Mark-Resight (SECR) Tiger Abundance Studies
• Transboundary Tiger Movement between VTR & Chitwan National Park
• Prey-Predator Densities (Chital, Sambar, Gaur)
• Human-Wildlife Conflict Mitigation & Solar Fencing
• Gharial Population Recovery in the Gandak River basin`,
    source: 'NTCA 5th Cycle Status of Tigers in India & WII Technical Reports',
    suggestedActions: [
      { label: 'View Research Publications', tab: 'research', actionType: 'navigate' },
      { label: 'Official Census Statistics', tab: 'tiger-worldwide', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['news', 'latest news', 'update', 'updates', 'recent'],
    reply: `Stay informed with verified conservation dispatches and forest bulletins:

Key Ongoing Updates:
• Continuous M-STrIPES digital patrolling across all 8 ranges.
• Transboundary ecological monitoring with Nepal's Chitwan National Park.
• Community Eco-Development Committees (EDC) expanding livelihood programs and Sikki grass crafts.
• Anti-poaching electronic surveillance and camera trap monitoring in core sectors.`,
    source: 'Valmiki Tiger Reserve Verified Field News Feed',
    suggestedActions: [
      { label: 'Latest News & Bulletins', tab: 'news', actionType: 'navigate' },
      { label: 'Active Advisories', tab: 'alerts', actionType: 'navigate' }
    ]
  },
  {
    keywords: ['emergency', 'helpline', 'contact', 'rescue', 'injured', 'poaching', 'phone', 'phone number'],
    reply: `Forest Department Emergency Contacts for Valmiki Tiger Reserve:

• Forest Toll-Free Helpline: 1926 (Bihar Forest Dept)
• VTR Field Directorate Control Room (Bettiah): 06254-232140 / 06254-232141
• Emergency Police: 112
• Valmikinagar Range Office: Reachable via Bettiah Divisional Forest Officer (DFO)

*Important: Never approach a distressed or injured wild animal. Keep bystanders back and notify forest rangers immediately.*`,
    source: 'Bihar Forest Department & District Administration Helpline Registry',
    suggestedActions: [
      { label: 'Emergency Hotlines & Contact', tab: 'contact', actionType: 'navigate' },
      { label: 'Forest Advisories', tab: 'alerts', actionType: 'navigate' }
    ]
  }
];

export async function processChatMessage(
  userQuery: string,
  history: ChatRequestMessage[] = [],
  customSystemPrompt?: string
): Promise<ChatResponse> {
  const queryLower = userQuery.trim().toLowerCase();

  // Try Gemini API if API Key is set in server environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = customSystemPrompt || SYSTEM_INSTRUCTION;

      // Prepare conversation contents
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Add recent context (last 6 turns)
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        if (msg.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: msg.content }] });
        } else if (msg.role === 'assistant') {
          contents.push({ role: 'model', parts: [{ text: msg.content }] });
        }
      }

      // Add current user prompt
      contents.push({ role: 'user', parts: [{ text: userQuery }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });

      const replyText = response.text || 'I could not generate a response at this time. Please check your query or try again.';

      // Determine smart actions based on query
      const actions: { label: string; tab?: string; externalUrl?: string; actionType?: 'open_volunteer' | 'open_supporter' | 'navigate' }[] = [];
      if (queryLower.includes('volunteer') || queryLower.includes('join')) {
        actions.push({ label: 'Open Volunteer Form', actionType: 'open_volunteer' });
      }
      if (queryLower.includes('support') || queryLower.includes('donate') || queryLower.includes('help')) {
        actions.push({ label: 'Open Supporter Form', actionType: 'open_supporter' });
      }
      if (queryLower.includes('safari') || queryLower.includes('visit') || queryLower.includes('tour')) {
        actions.push({ label: 'Explore Safari Zones', tab: 'ecotourism', actionType: 'navigate' });
      }
      if (queryLower.includes('tiger') || queryLower.includes('stripes') || queryLower.includes('code')) {
        actions.push({ label: 'View Tigers of VTR', tab: 'tigers', actionType: 'navigate' });
      }
      if (queryLower.includes('news') || queryLower.includes('bulletin')) {
        actions.push({ label: 'Read News Feed', tab: 'news', actionType: 'navigate' });
      }
      if (queryLower.includes('emergency') || queryLower.includes('contact') || queryLower.includes('helpline')) {
        actions.push({ label: 'Emergency Hotlines', tab: 'contact', actionType: 'navigate' });
      }

      return {
        reply: replyText,
        sourceAttribution: 'Google Gemini AI (Grounded on NTCA & VTR Verified Data)',
        modelUsed: 'gemini-3.8-flash',
        isAiLive: true,
        suggestedActions: actions.length > 0 ? actions : undefined
      };
    } catch (error: any) {
      console.warn('Gemini API call failed, falling back to Verified Knowledge Base:', error?.message);
    }
  }

  // Grounded Knowledge Base Fallback
  for (const entry of VERIFIED_KNOWLEDGE_BASE) {
    const match = entry.keywords.some((kw) => queryLower.includes(kw));
    if (match) {
      return {
        reply: entry.reply,
        sourceAttribution: entry.source,
        modelUsed: 'Verified VTR Knowledge Engine (Grounding Ready)',
        isAiLive: false,
        suggestedActions: entry.suggestedActions
      };
    }
  }

  // Default respectful response when specific topic is not found
  return {
    reply: `I could not find verified official records specifically regarding "${userQuery}" in our current Valmiki Tiger Reserve database.

To ensure strict conservation accuracy without speculation:
• You may explore our verified sections: Tigers of VTR (54 individuals), Wildlife & Co-predators, Travel & Safaris, or Research Papers.
• For immediate field inquiries or wildlife distress reports, please contact the VTR Field Directorate or Bihar Forest Dept Helpline at 1926.
• You can also join as a Volunteer or Supporter through our registration forms.`,
    sourceAttribution: 'Valmiki Tiger Watch Verified Registry',
    modelUsed: 'Verified VTR Knowledge Engine',
    isAiLive: false,
    suggestedActions: [
      { label: 'Explore Tigers of VTR', tab: 'tigers', actionType: 'navigate' },
      { label: 'Become a Volunteer', actionType: 'open_volunteer' },
      { label: 'Become a Supporter', actionType: 'open_supporter' }
    ]
  };
}

export function getAiBackendStatus(): { isConfigured: boolean; modelName: string; provider: string } {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);
  return {
    isConfigured,
    modelName: 'gemini-3.8-flash',
    provider: isConfigured ? 'Google Gemini API (@google/genai)' : 'Verified VTR Knowledge Engine (Awaiting API Key in Settings)'
  };
}
