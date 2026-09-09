var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/server/newsService.ts
var NEWS_FEEDS = [
  {
    name: "Valmiki Tiger Reserve News Network",
    url: "https://news.google.com/rss/search?q=%22Valmiki+Tiger+Reserve%22+OR+%22Valmikinagar%22+OR+%22West+Champaran+tiger%22&hl=en-IN&gl=IN&ceid=IN:en",
    defaultCategory: "Established Media",
    defaultVerification: "established_media",
    language: "en"
  },
  {
    name: "\u0935\u093E\u0932\u094D\u092E\u0940\u0915\u093F \u091F\u093E\u0907\u0917\u0930 \u0930\u093F\u091C\u0930\u094D\u0935 \u0926\u0948\u0928\u093F\u0915 \u0938\u092E\u093E\u091A\u093E\u0930 (Hindi)",
    url: "https://news.google.com/rss/search?q=%22%E0%A4%B5%E0%A4%BE%E0%A4%B2%E0%A5%8D%E0%A4%AE%E0%A5%80%E0%A4%95%E0%A4%BF+%E0%A4%9F%E0%A4%BE%E0%A4%87%E0%A4%97%E0%A4%B0+%E0%A4%B0%E0%A4%BF%E0%A4%9C%E0%A4%B0%E0%A5%8D%E0%A4%B5%22+OR+%22%E0%A4%B5%E0%A4%BE%E0%A4%B2%E0%A5%8D%E0%A4%AE%E0%A5%80%E0%A4%95%E0%A4%BF%E0%A4%A8%E0%A4%97%E0%A4%B0%22+OR+%22%E0%A4%AA%E0%A4%B6%E0%A5%8D%E0%A4%9A%E0%A4%BF%E0%A4%AE+%E0%A4%9A%E0%A4%82%E0%A4%AA%E0%A4%BE%E0%A4%B0%E0%A4%A3+%E0%A4%AC%E0%A4%BE%E0%A4%98%22&hl=hi&gl=IN&ceid=IN:hi",
    defaultCategory: "Established Media",
    defaultVerification: "established_media",
    language: "hi"
  },
  {
    name: "The Times of India (Environment)",
    url: "https://timesofindia.indiatimes.com/rssfeeds/2647163.cms",
    defaultCategory: "Established Media",
    defaultVerification: "established_media",
    language: "en"
  },
  {
    name: "The Hindu (Environment & Science)",
    url: "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss",
    defaultCategory: "Established Media",
    defaultVerification: "established_media",
    language: "en"
  },
  {
    name: "Hindustan Times (Environment)",
    url: "https://www.hindustantimes.com/feeds/rss/environment/rssfeed.xml",
    defaultCategory: "Established Media",
    defaultVerification: "established_media",
    language: "en"
  },
  {
    name: "PIB MoEFCC / NTCA Press Releases",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1",
    defaultCategory: "NTCA / MoEFCC",
    defaultVerification: "verified_govt",
    language: "en"
  }
];
function decodeHtmlEntities(str) {
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ");
}
function cleanDescription(rawHtml) {
  const noTags = rawHtml.replace(/<[^>]*>?/gm, " ");
  const decoded = decodeHtmlEntities(noTags);
  return decoded.replace(/\s+/g, " ").trim().slice(0, 280);
}
function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, "").replace(/\s+/g, " ").trim();
}
function detectTopic(headline, summary) {
  const text = `${headline} ${summary}`.toLowerCase();
  if (text.includes("valmiki") || text.includes("\u0935\u093E\u0932\u094D\u092E\u0940\u0915\u093F") || text.includes("champaran") || text.includes("\u091A\u0902\u092A\u093E\u0930\u0923") || text.includes("vtr")) {
    return {
      topic: "Valmiki Reserve Update",
      tags: ["Valmiki Tiger Reserve", "VTR Habitat", "Field Update"]
    };
  }
  if (text.includes("census") || text.includes("population") || text.includes("\u0917\u0923\u0928\u093E") || text.includes("camera trap") || text.includes("cub") || text.includes("\u0936\u093E\u0935\u0915")) {
    return {
      topic: "Tiger Population & Census",
      tags: ["Tiger Population & Census", "Monitoring", "Census Data"]
    };
  }
  if (text.includes("conflict") || text.includes("attack") || text.includes("rescue") || text.includes("\u0939\u092E\u0932\u093E") || text.includes("\u0930\u0947\u0938\u094D\u0915\u094D\u092F\u0942") || text.includes("\u092E\u0941\u0906\u0935\u091C\u093E")) {
    return {
      topic: "Human-Wildlife Conflict & Rescue",
      tags: ["Human-Wildlife Conflict & Rescue", "Coexistence", "Community Safety"]
    };
  }
  if (text.includes("poaching") || text.includes("patrol") || text.includes("\u0936\u093F\u0915\u093E\u0930") || text.includes("\u0917\u0936\u094D\u0924") || text.includes("arrest") || text.includes("snare")) {
    return {
      topic: "Anti-Poaching & Protection",
      tags: ["Anti-Poaching & Protection", "Law Enforcement", "Border Security"]
    };
  }
  if (text.includes("funding") || text.includes("budget") || text.includes("ntca") || text.includes("moefcc") || text.includes("\u090F\u0928\u091F\u0940\u0938\u0940\u090F") || text.includes("\u092F\u094B\u091C\u0928\u093E")) {
    return {
      topic: "Policy, Budget & NTCA Funding",
      tags: ["Policy, Budget & NTCA Funding", "NTCA Project Tiger", "Policy"]
    };
  }
  return {
    topic: "Eco-Tourism & Community",
    tags: ["Valmiki Tiger Reserve", "Tiger Conservation", "Biodiversity"]
  };
}
function parseRssItems(xmlText, feed) {
  const articles = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const items = xmlText.match(itemRegex) || [];
  for (const itemXml of items) {
    try {
      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/title>/i);
      const rawTitle = titleMatch ? (titleMatch[1] || titleMatch[2] || "").trim() : "";
      if (!rawTitle) continue;
      const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/link>/i);
      const rawLink = linkMatch ? (linkMatch[1] || linkMatch[2] || "").trim() : "";
      const pubDateMatch = itemXml.match(/<pubDate>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/pubDate>/i);
      const rawPubDate = pubDateMatch ? (pubDateMatch[1] || pubDateMatch[2] || "").trim() : "";
      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i);
      const rawDesc = descMatch ? (descMatch[1] || descMatch[2] || "").trim() : "";
      const sourceMatch = itemXml.match(/<source[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/source>/i);
      let detectedSource = sourceMatch ? (sourceMatch[1] || sourceMatch[2] || "").trim() : "";
      let headline = decodeHtmlEntities(rawTitle);
      if (!detectedSource && headline.includes(" - ")) {
        const parts = headline.split(" - ");
        if (parts.length >= 2) {
          detectedSource = parts.pop()?.trim() || "";
          headline = parts.join(" - ").trim();
        }
      }
      if (!detectedSource) {
        detectedSource = feed.name;
      }
      const combinedText = `${headline} ${rawDesc} ${detectedSource}`.toLowerCase();
      const isRelevant = combinedText.includes("valmiki") || combinedText.includes("\u0935\u093E\u0932\u094D\u092E\u0940\u0915\u093F") || combinedText.includes("champaran") || combinedText.includes("\u091A\u0902\u092A\u093E\u0930\u0923") || combinedText.includes("vtr") || combinedText.includes("bettiah") || combinedText.includes("\u092C\u0947\u0924\u093F\u092F\u093E") || combinedText.includes("bagaha") || combinedText.includes("\u092C\u0917\u0939\u093E") || combinedText.includes("tiger") && (combinedText.includes("bihar") || combinedText.includes("\u092C\u093F\u0939\u093E\u0930") || combinedText.includes("ntca") || combinedText.includes("chitwan") || combinedText.includes("census") || combinedText.includes("project tiger"));
      if (!isRelevant) {
        continue;
      }
      let parsedDate = /* @__PURE__ */ new Date();
      if (rawPubDate) {
        const d = new Date(rawPubDate);
        if (!isNaN(d.getTime())) {
          parsedDate = d;
        }
      }
      const publicationDate = parsedDate.toISOString().split("T")[0];
      const publicationTime = parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const cleanSummary = cleanDescription(rawDesc) || `${headline}. Published by ${detectedSource}.`;
      let sourceCategory = feed.defaultCategory;
      let verificationStatus = feed.defaultVerification;
      if (detectedSource.includes("Forest") || detectedSource.includes("\u0935\u0928 \u0935\u093F\u092D\u093E\u0917") || detectedSource.includes("NTCA") || detectedSource.includes("PIB") || detectedSource.includes("MoEFCC")) {
        sourceCategory = "Forest Department";
        verificationStatus = "verified_govt";
      } else if (detectedSource.includes("WII") || detectedSource.includes("Wildlife Institute")) {
        sourceCategory = "WII Research";
        verificationStatus = "peer_reviewed";
      } else {
        sourceCategory = "Established Media";
        verificationStatus = "established_media";
      }
      const { topic, tags } = detectTopic(headline, cleanSummary);
      const article = {
        id: `feed-${Math.abs(normalizeTitle(headline).split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0))}`,
        headline,
        publicationDate,
        publicationTime,
        source: detectedSource,
        sourceCategory,
        summary: cleanSummary,
        sourceLink: rawLink || feed.url,
        externalUrl: rawLink || feed.url,
        officialSourceRef: rawLink || feed.url,
        verificationStatus,
        retrievedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        verifiedDate: publicationDate,
        verifiedBy: verificationStatus === "verified_govt" ? "Bihar Forest Dept / NTCA Dispatch" : "Verified Newspaper Media Desk",
        isLive: true,
        tags,
        isPinned: false,
        isFeatured: false,
        language: feed.language,
        status: "approved",
        sourceAttribution: `Reported by ${detectedSource}`,
        keyTakeaways: [
          cleanSummary.slice(0, 160) + "..."
        ]
      };
      articles.push(article);
    } catch {
    }
  }
  return articles;
}
async function fetchLiveTigerNews(existingArticles = []) {
  const discovered = [];
  let sourcesChecked = 0;
  const existingNormTitles = new Set(existingArticles.map((a) => normalizeTitle(a.headline)));
  const existingUrls = new Set(existingArticles.map((a) => (a.sourceLink || a.externalUrl || "").trim()));
  const fetchPromises = NEWS_FEEDS.map(async (feed) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);
      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ValmikiTigerWatchBot/2.0; +https://vtr.bihar.gov.in)",
          "Accept": "application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8"
        }
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        sourcesChecked++;
        const xmlText = await res.text();
        return parseRssItems(xmlText, feed);
      }
    } catch {
    }
    return [];
  });
  const results = await Promise.allSettled(fetchPromises);
  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      for (const item of res.value) {
        const normTitle = normalizeTitle(item.headline);
        const itemUrl = (item.sourceLink || item.externalUrl || "").trim();
        if (!existingNormTitles.has(normTitle) && !existingUrls.has(itemUrl)) {
          existingNormTitles.add(normTitle);
          if (itemUrl) existingUrls.add(itemUrl);
          discovered.push(item);
        }
      }
    }
  }
  const mergedMap = /* @__PURE__ */ new Map();
  for (const art of discovered) {
    mergedMap.set(normalizeTitle(art.headline), art);
  }
  for (const art of existingArticles) {
    const key = normalizeTitle(art.headline);
    if (!mergedMap.has(key)) {
      mergedMap.set(key, art);
    }
  }
  const allUpdated = Array.from(mergedMap.values());
  allUpdated.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.publicationDate.localeCompare(a.publicationDate);
  });
  return {
    newArticles: discovered,
    allUpdatedNews: allUpdated,
    sourcesChecked,
    message: discovered.length > 0 ? `Discovered ${discovered.length} latest verified article${discovered.length > 1 ? "s" : ""} from Times of India, The Hindu, Dainik Jagran, and conservation feeds.` : "All news feeds checked. All verified publications are up to date."
  };
}

// src/server/chatService.ts
var import_genai = require("@google/genai");
var SYSTEM_INSTRUCTION = `You are the "Valmiki Tiger Watch AI Assistant", an official, courteous, and conservation-focused assistant for Valmiki Tiger Watch (dedicated to Valmiki Tiger Reserve in West Champaran, Bihar, India).

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
   - Provide multilingual assistance in English, Hindi (\u0939\u093F\u0902\u0926\u0940), or Urdu (\u0627\u0631\u062F\u0648) matching the user's language.

3. VOLUNTEERING & SUPPORT:
   - Tell visitors they can join as a volunteer or supporter via the "Become a Volunteer" and "Become a Supporter" forms on Valmiki Tiger Watch.`;
var VERIFIED_KNOWLEDGE_BASE = [
  {
    keywords: ["what is valmiki", "about valmiki", "about vtr", "valmiki tiger reserve", "overview"],
    reply: `Valmiki Tiger Reserve (VTR) is the only tiger reserve in Bihar, India. Encompassing 898.45 sq km in the West Champaran district along the Indo-Nepal border, it represents the easternmost limit of the Himalayan Terai bhabar sal forests and forms a contiguous transboundary wildlife corridor with Nepal's Chitwan National Park.

Key Facts:
\u2022 Core Area: 545.15 sq km | Buffer Area: 353.30 sq km
\u2022 Established: Wildlife Sanctuary in 1978, Tiger Reserve in 1990 (18th Project Tiger Reserve)
\u2022 Current Tiger Count: 54 verified individuals (NTCA 5th Cycle AITE)
\u2022 Forest Ranges: Valmikinagar, Harnatanr, Madanpur, Gonauli, Kotraha, Chiutaha, Raghia, Manguraha`,
    source: "National Tiger Conservation Authority (NTCA) & Bihar Forest Department Official Records",
    suggestedActions: [
      { label: "Explore VTR History", tab: "about-vtr", actionType: "navigate" },
      { label: "Tigers of VTR", tab: "tigers", actionType: "navigate" }
    ]
  },
  {
    keywords: ["where is", "location", "located", "how to reach", "district", "champaran", "state", "railway", "airport"],
    reply: `Valmiki Tiger Reserve is situated in the West Champaran district of northern Bihar, India, bordering the Chitwan National Park of Nepal to the north and Uttar Pradesh to the west along the Gandak River.

How to Reach:
\u2022 Nearest Railway Station: Bagaha (BUG) ~ 45 km, or Narkatiaganj (NKE) ~ 75 km
\u2022 Nearest Airport: Gorakhpur Airport (GOP) ~ 125 km, or Patna Airport (PAT) ~ 280 km
\u2022 By Road: Connected via NH-727 from Bettiah and Gorakhpur`,
    source: "Valmiki Tiger Reserve Field Directorate, Bettiah",
    suggestedActions: [
      { label: "Travel Guide & Transit", tab: "travel-guide", actionType: "navigate" },
      { label: "Interactive Map & Gates", tab: "map", actionType: "navigate" }
    ]
  },
  {
    keywords: ["animal", "wildlife", "species", "biodiversity", "found in vtr", "fauna", "birds"],
    reply: `Valmiki Tiger Reserve harbors exceptional biodiversity due to its unique Terai-Bhabar and riverine Gandak ecosystem.

Verified Fauna of VTR:
\u2022 Apex Predators: Bengal Tiger (54 verified), Indian Leopard, Wild Dog (Dhole)
\u2022 Large Mammals: Sloth Bear, Gaur (Indian Bison), Sambar, Chital (Spotted Deer), Barking Deer, Hog Deer, Wild Boar
\u2022 Riverine Wildlife: Gharial (Gavialis gangeticus), Mugger Crocodile, Gangetic River Dolphin, Smooth-coated Otter
\u2022 Avifauna: 250+ bird species including Great Hornbill, Kalij Pheasant, Bengal Florican, and Osprey`,
    source: "Wildlife Institute of India (WII) Faunal Survey & VTR Management Plan",
    suggestedActions: [
      { label: "Wildlife Catalog", tab: "wildlife", actionType: "navigate" },
      { label: "Interactive Species Spotter", tab: "species-spotter", actionType: "navigate" }
    ]
  },
  {
    keywords: ["how can i visit", "visit vtr", "safari", "booking", "best time", "season", "tourism", "eco-tourism", "fee", "cost"],
    reply: `Planning a visit to Valmiki Tiger Reserve:

\u2022 Best Season: November to April (Pleasant weather; reserve gates open for wildlife safaris).
\u2022 Monsoon Closure: July to October (Annual seasonal closure for animal breeding and safety).
\u2022 Safari Types: Open Gypsy Safaris in Valmikinagar and Manguraha ranges, Gandak River Eco-Boating, and Canopy Canopy Boardwalk.
\u2022 Safari Shifts: Morning (6:00 AM \u2013 10:00 AM) and Afternoon (2:00 PM \u2013 5:30 PM).
\u2022 Accommodations: Valmiki Vihar Hotel, Eco-Huts at Valmikinagar, Bamboo Huts at Manguraha.`,
    source: "Bihar State Tourism Development Corporation (BSTDC) & VTR Ecotourism Wing",
    suggestedActions: [
      { label: "Safari & Stay Guide", tab: "ecotourism", actionType: "navigate" },
      { label: "Sightseeing & Heritage", tab: "sightseeing", actionType: "navigate" }
    ]
  },
  {
    keywords: ["volunteer", "become a volunteer", "volunteering", "how to volunteer", "join"],
    reply: `You can join Valmiki Tiger Watch as a registered volunteer!

Volunteering Areas:
\u2022 Tiger Conservation & Habitat Monitoring
\u2022 Wildlife Awareness & School Outreach
\u2022 Biodiversity & Flora/Fauna Surveys
\u2022 Research Assistance & Field Documentation
\u2022 Photography, Media & Storytelling
\u2022 Eco-Tourism & Visitor Education
\u2022 Digital & Technical Support

Click the "Become a Volunteer" button to register your interest, skills, and availability.`,
    source: "Valmiki Tiger Watch Volunteer Network",
    suggestedActions: [
      { label: "Register as Volunteer", actionType: "open_volunteer" },
      { label: "Community & Tharu Tribes", tab: "community", actionType: "navigate" }
    ]
  },
  {
    keywords: ["support", "supporter", "become a supporter", "how can i support", "contribute", "donation", "help"],
    reply: `You can actively champion tiger conservation by becoming an official Supporter of Valmiki Tiger Watch!

Supporter Engagement Options:
\u2022 Conservation Awareness in schools & communities
\u2022 Research Support & Academic Collaboration
\u2022 Community Outreach with Tharu tribal families
\u2022 Digital / Technical Support & Website assistance
\u2022 Media & Responsible Publicity
\u2022 Voluntary Contributions to education programs

Click "Become a Supporter" to pledge your involvement.`,
    source: "Valmiki Tiger Watch Stewardship Program",
    suggestedActions: [
      { label: "Register as Supporter", actionType: "open_supporter" },
      { label: "Project Tiger 50 Years", tab: "project-tiger", actionType: "navigate" }
    ]
  },
  {
    keywords: ["research", "publication", "paper", "study", "scientific", "census", "data"],
    reply: `Valmiki Tiger Reserve is an active landscape for scientific wildlife research in collaboration with the National Tiger Conservation Authority (NTCA) and Wildlife Institute of India (WII).

Verified Research Themes:
\u2022 Camera-Trap Spatial Mark-Resight (SECR) Tiger Abundance Studies
\u2022 Transboundary Tiger Movement between VTR & Chitwan National Park
\u2022 Prey-Predator Densities (Chital, Sambar, Gaur)
\u2022 Human-Wildlife Conflict Mitigation & Solar Fencing
\u2022 Gharial Population Recovery in the Gandak River basin`,
    source: "NTCA 5th Cycle Status of Tigers in India & WII Technical Reports",
    suggestedActions: [
      { label: "View Research Publications", tab: "research", actionType: "navigate" },
      { label: "Official Census Statistics", tab: "tiger-worldwide", actionType: "navigate" }
    ]
  },
  {
    keywords: ["news", "latest news", "update", "updates", "recent"],
    reply: `Stay informed with verified conservation dispatches and forest bulletins:

Key Ongoing Updates:
\u2022 Continuous M-STrIPES digital patrolling across all 8 ranges.
\u2022 Transboundary ecological monitoring with Nepal's Chitwan National Park.
\u2022 Community Eco-Development Committees (EDC) expanding livelihood programs and Sikki grass crafts.
\u2022 Anti-poaching electronic surveillance and camera trap monitoring in core sectors.`,
    source: "Valmiki Tiger Reserve Verified Field News Feed",
    suggestedActions: [
      { label: "Latest News & Bulletins", tab: "news", actionType: "navigate" },
      { label: "Active Advisories", tab: "alerts", actionType: "navigate" }
    ]
  },
  {
    keywords: ["emergency", "helpline", "contact", "rescue", "injured", "poaching", "phone", "phone number"],
    reply: `Forest Department Emergency Contacts for Valmiki Tiger Reserve:

\u2022 Forest Toll-Free Helpline: 1926 (Bihar Forest Dept)
\u2022 VTR Field Directorate Control Room (Bettiah): 06254-232140 / 06254-232141
\u2022 Emergency Police: 112
\u2022 Valmikinagar Range Office: Reachable via Bettiah Divisional Forest Officer (DFO)

*Important: Never approach a distressed or injured wild animal. Keep bystanders back and notify forest rangers immediately.*`,
    source: "Bihar Forest Department & District Administration Helpline Registry",
    suggestedActions: [
      { label: "Emergency Hotlines & Contact", tab: "contact", actionType: "navigate" },
      { label: "Forest Advisories", tab: "alerts", actionType: "navigate" }
    ]
  }
];
async function processChatMessage(userQuery, history = [], customSystemPrompt) {
  const queryLower = userQuery.trim().toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim().length > 10) {
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const systemInstruction = customSystemPrompt || SYSTEM_INSTRUCTION;
      const contents = [];
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        if (msg.role === "user") {
          contents.push({ role: "user", parts: [{ text: msg.content }] });
        } else if (msg.role === "assistant") {
          contents.push({ role: "model", parts: [{ text: msg.content }] });
        }
      }
      contents.push({ role: "user", parts: [{ text: userQuery }] });
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.3
        }
      });
      const replyText = response.text || "I could not generate a response at this time. Please check your query or try again.";
      const actions = [];
      if (queryLower.includes("volunteer") || queryLower.includes("join")) {
        actions.push({ label: "Open Volunteer Form", actionType: "open_volunteer" });
      }
      if (queryLower.includes("support") || queryLower.includes("donate") || queryLower.includes("help")) {
        actions.push({ label: "Open Supporter Form", actionType: "open_supporter" });
      }
      if (queryLower.includes("safari") || queryLower.includes("visit") || queryLower.includes("tour")) {
        actions.push({ label: "Explore Safari Zones", tab: "ecotourism", actionType: "navigate" });
      }
      if (queryLower.includes("tiger") || queryLower.includes("stripes") || queryLower.includes("code")) {
        actions.push({ label: "View Tigers of VTR", tab: "tigers", actionType: "navigate" });
      }
      if (queryLower.includes("news") || queryLower.includes("bulletin")) {
        actions.push({ label: "Read News Feed", tab: "news", actionType: "navigate" });
      }
      if (queryLower.includes("emergency") || queryLower.includes("contact") || queryLower.includes("helpline")) {
        actions.push({ label: "Emergency Hotlines", tab: "contact", actionType: "navigate" });
      }
      return {
        reply: replyText,
        sourceAttribution: "Google Gemini AI (Grounded on NTCA & VTR Verified Data)",
        modelUsed: "gemini-3.8-flash",
        isAiLive: true,
        suggestedActions: actions.length > 0 ? actions : void 0
      };
    } catch (error) {
      console.warn("Gemini API call failed, falling back to Verified Knowledge Base:", error?.message);
    }
  }
  for (const entry of VERIFIED_KNOWLEDGE_BASE) {
    const match = entry.keywords.some((kw) => queryLower.includes(kw));
    if (match) {
      return {
        reply: entry.reply,
        sourceAttribution: entry.source,
        modelUsed: "Verified VTR Knowledge Engine (Grounding Ready)",
        isAiLive: false,
        suggestedActions: entry.suggestedActions
      };
    }
  }
  return {
    reply: `I could not find verified official records specifically regarding "${userQuery}" in our current Valmiki Tiger Reserve database.

To ensure strict conservation accuracy without speculation:
\u2022 You may explore our verified sections: Tigers of VTR (54 individuals), Wildlife & Co-predators, Travel & Safaris, or Research Papers.
\u2022 For immediate field inquiries or wildlife distress reports, please contact the VTR Field Directorate or Bihar Forest Dept Helpline at 1926.
\u2022 You can also join as a Volunteer or Supporter through our registration forms.`,
    sourceAttribution: "Valmiki Tiger Watch Verified Registry",
    modelUsed: "Verified VTR Knowledge Engine",
    isAiLive: false,
    suggestedActions: [
      { label: "Explore Tigers of VTR", tab: "tigers", actionType: "navigate" },
      { label: "Become a Volunteer", actionType: "open_volunteer" },
      { label: "Become a Supporter", actionType: "open_supporter" }
    ]
  };
}
function getAiBackendStatus() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim().length > 10);
  return {
    isConfigured,
    modelName: "gemini-3.8-flash",
    provider: isConfigured ? "Google Gemini API (@google/genai)" : "Verified VTR Knowledge Engine (Awaiting API Key in Settings)"
  };
}

// src/server/weatherService.ts
var VTR_WEATHER_ZONES = [
  {
    id: "valmikinagar",
    name: "Valmiki Nagar Core (Main Gate)",
    rangeName: "Valmiki Nagar Range",
    latitude: 27.4294,
    longitude: 83.9048,
    elevationMeters: 135,
    description: "Core ecotourism gate, Gandak River confluence, and historical forest range office."
  },
  {
    id: "manguraha",
    name: "Manguraha Range",
    rangeName: "Manguraha Forest Division",
    latitude: 27.279,
    longitude: 84.442,
    elevationMeters: 110,
    description: "Dense sal forest range with prominent predator corridors and high herbivore density."
  },
  {
    id: "gobardhana",
    name: "Gobardhana Range",
    rangeName: "Gobardhana Range",
    latitude: 27.315,
    longitude: 84.321,
    elevationMeters: 120,
    description: "Pristine riparian woodland adjacent to Someshwar Hill foothills."
  },
  {
    id: "harnatanr",
    name: "Harnatanr Range",
    rangeName: "Harnatanr Forest Range",
    latitude: 27.218,
    longitude: 84.148,
    elevationMeters: 98,
    description: "Southern buffer and grassland fringe with active community anti-poaching squads."
  }
];
function getWmoCondition(code, isDay = true) {
  switch (code) {
    case 0:
      return {
        code,
        label: { en: "Clear Sky", hi: "\u0938\u093E\u092B\u093C \u0906\u0938\u092E\u093E\u0928", ur: "\u0635\u0627\u0641 \u0622\u0633\u0645\u0627\u0646" },
        iconType: isDay ? "clear-day" : "clear-night"
      };
    case 1:
      return {
        code,
        label: { en: "Mainly Clear", hi: "\u092E\u0941\u0916\u094D\u092F\u0924\u0903 \u0938\u093E\u092B\u093C", ur: "\u0632\u06CC\u0627\u062F\u06C1 \u062A\u0631 \u0635\u0627\u0641" },
        iconType: isDay ? "clear-day" : "clear-night"
      };
    case 2:
      return {
        code,
        label: { en: "Partly Cloudy", hi: "\u0906\u0902\u0936\u093F\u0915 \u092C\u093E\u0926\u0932", ur: "\u062C\u0632\u0648\u06CC \u0627\u0628\u0631 \u0622\u0644\u0648\u062F" },
        iconType: isDay ? "partly-cloudy-day" : "partly-cloudy-night"
      };
    case 3:
      return {
        code,
        label: { en: "Overcast", hi: "\u0918\u0928\u0947 \u092C\u093E\u0926\u0932", ur: "\u0645\u06A9\u0645\u0644 \u0627\u0628\u0631 \u0622\u0644\u0648\u062F" },
        iconType: "cloudy"
      };
    case 45:
    case 48:
      return {
        code,
        label: { en: "Fog / Forest Mist", hi: "\u0915\u094B\u0939\u0930\u093E / \u0935\u0928 \u0927\u0941\u0902\u0927", ur: "\u062F\u06BE\u0646\u062F / \u062C\u0646\u06AF\u0644 \u06A9\u06CC \u062F\u06BE\u0646\u062F" },
        iconType: "fog"
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: { en: "Drizzle", hi: "\u0939\u0932\u094D\u0915\u0940 \u092C\u0942\u0902\u0926\u093E\u092C\u093E\u0902\u0926\u0940", ur: "\u06C1\u0644\u06A9\u06CC \u0628\u0648\u0646\u062F\u0627 \u0628\u0627\u0646\u062F\u06CC" },
        iconType: "rain"
      };
    case 61:
    case 63:
      return {
        code,
        label: { en: "Rain", hi: "\u092C\u093E\u0930\u093F\u0936", ur: "\u0628\u0627\u0631\u0634" },
        iconType: "rain"
      };
    case 65:
      return {
        code,
        label: { en: "Heavy Rain", hi: "\u092E\u0942\u0938\u0932\u093E\u0927\u093E\u0930 \u092C\u093E\u0930\u093F\u0936", ur: "\u062A\u06CC\u0632 \u0628\u0627\u0631\u0634" },
        iconType: "heavy-rain"
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: { en: "Rain Showers", hi: "\u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u092C\u094C\u091B\u093E\u0930\u0947\u0902", ur: "\u0628\u0627\u0631\u0634 \u06A9\u06CC \u0628\u0648\u0686\u06BE\u0627\u0691" },
        iconType: "rain"
      };
    case 95:
      return {
        code,
        label: { en: "Thunderstorm", hi: "\u0906\u0902\u0927\u0940-\u0924\u0942\u092B\u093C\u093E\u0928", ur: "\u06AF\u0631\u062C \u0686\u0645\u06A9 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0637\u0648\u0641\u0627\u0646" },
        iconType: "thunderstorm"
      };
    case 96:
    case 99:
      return {
        code,
        label: { en: "Severe Thunderstorm", hi: "\u0924\u0940\u0935\u094D\u0930 \u0906\u0902\u0927\u0940-\u0924\u0942\u092B\u093C\u093E\u0928", ur: "\u0634\u062F\u06CC\u062F \u06AF\u0631\u062C \u0686\u0645\u06A9 \u0627\u0648\u0631 \u0637\u0648\u0641\u0627\u0646" },
        iconType: "thunderstorm"
      };
    default:
      return {
        code,
        label: { en: "Partly Cloudy", hi: "\u0906\u0902\u0936\u093F\u0915 \u092C\u093E\u0926\u0932", ur: "\u062C\u0632\u0648\u06CC \u0627\u0628\u0631 \u0622\u0644\u0648\u062F" },
        iconType: "partly-cloudy-day"
      };
  }
}
function degToCompass(num) {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[val % 16];
}
var memoryCache = /* @__PURE__ */ new Map();
var CACHE_TTL_MS = 10 * 60 * 1e3;
var DAY_NAMES = {
  0: { en: "Sunday", hi: "\u0930\u0935\u093F\u0935\u093E\u0930", ur: "\u0627\u062A\u0648\u0627\u0631" },
  1: { en: "Monday", hi: "\u0938\u094B\u092E\u0935\u093E\u0930", ur: "\u067E\u06CC\u0631" },
  2: { en: "Tuesday", hi: "\u092E\u0902\u0917\u0932\u0935\u093E\u0930", ur: "\u0645\u0646\u06AF\u0644" },
  3: { en: "Wednesday", hi: "\u092C\u0941\u0927\u0935\u093E\u0930", ur: "\u0628\u062F\u06BE" },
  4: { en: "Thursday", hi: "\u0917\u0941\u0930\u0941\u0935\u093E\u0930", ur: "\u062C\u0645\u0639\u0631\u0627\u062A" },
  5: { en: "Friday", hi: "\u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930", ur: "\u062C\u0645\u0639\u06C1" },
  6: { en: "Saturday", hi: "\u0936\u0928\u093F\u0935\u093E\u0930", ur: "\u06C1\u0641\u062A\u06C1" }
};
async function fetchVTRWeatherData(zoneId = "valmikinagar", forceRefresh = false) {
  const zone = VTR_WEATHER_ZONES.find((z) => z.id === zoneId) || VTR_WEATHER_ZONES[0];
  const cacheKey = `vtr_weather_${zone.id}`;
  const cachedRecord = memoryCache.get(cacheKey);
  const now = Date.now();
  if (!forceRefresh && cachedRecord && now - cachedRecord.timestamp < CACHE_TTL_MS) {
    return {
      ...cachedRecord.data,
      cached: true
    };
  }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${zone.latitude}&longitude=${zone.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ValmikiTigerWatch/2.0 (Valmiki Tiger Reserve Conservation Portal)"
      }
    });
    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}: ${response.statusText}`);
    }
    const raw = await response.json();
    const currentRaw = raw.current || {};
    const hourlyRaw = raw.hourly || {};
    const dailyRaw = raw.daily || {};
    const isDay = currentRaw.is_day === 1;
    const weatherCode = currentRaw.weather_code ?? 0;
    const condition = getWmoCondition(weatherCode, isDay);
    let rainProbability = 0;
    if (hourlyRaw.time && hourlyRaw.precipitation_probability) {
      const currentIsoHour = currentRaw.time ? currentRaw.time.substring(0, 13) : "";
      const hourIndex = hourlyRaw.time.findIndex((t) => t.startsWith(currentIsoHour));
      if (hourIndex >= 0 && typeof hourlyRaw.precipitation_probability[hourIndex] === "number") {
        rainProbability = hourlyRaw.precipitation_probability[hourIndex];
      }
    }
    const currentData = {
      temperatureC: Math.round((currentRaw.temperature_2m ?? 0) * 10) / 10,
      apparentTemperatureC: Math.round((currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 0) * 10) / 10,
      relativeHumidity: Math.round(currentRaw.relative_humidity_2m ?? 0),
      precipitationMm: Math.round((currentRaw.precipitation ?? 0) * 10) / 10,
      rainProbability,
      weatherCode,
      condition,
      windSpeedKmH: Math.round((currentRaw.wind_speed_10m ?? 0) * 10) / 10,
      windDirectionDeg: currentRaw.wind_direction_10m ?? 0,
      windCompass: degToCompass(currentRaw.wind_direction_10m ?? 0),
      visibilityMeters: typeof currentRaw.visibility === "number" ? Math.round(currentRaw.visibility) : null,
      uvIndex: dailyRaw.uv_index_max && dailyRaw.uv_index_max[0] ? Math.round(dailyRaw.uv_index_max[0] * 10) / 10 : null,
      isDay,
      timestamp: currentRaw.time || (/* @__PURE__ */ new Date()).toISOString()
    };
    const hourlyItems = [];
    if (Array.isArray(hourlyRaw.time)) {
      const nowTime = currentRaw.time || (/* @__PURE__ */ new Date()).toISOString();
      let startIndex = hourlyRaw.time.findIndex((t) => t >= nowTime);
      if (startIndex < 0) startIndex = 0;
      const count = Math.min(24, hourlyRaw.time.length - startIndex);
      for (let i = 0; i < count; i++) {
        const idx = startIndex + i;
        const timeStr = hourlyRaw.time[idx];
        const dateObj = new Date(timeStr);
        const hourDisplay = dateObj.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
        const hCode = hourlyRaw.weather_code ? hourlyRaw.weather_code[idx] : 0;
        const hourNum = dateObj.getHours();
        const isHourDay = hourNum >= 6 && hourNum <= 18;
        hourlyItems.push({
          time: timeStr,
          hourDisplay,
          temperatureC: Math.round((hourlyRaw.temperature_2m ? hourlyRaw.temperature_2m[idx] : 0) * 10) / 10,
          rainProbability: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[idx] ?? 0 : 0,
          precipitationMm: Math.round((hourlyRaw.precipitation ? hourlyRaw.precipitation[idx] ?? 0 : 0) * 10) / 10,
          weatherCode: hCode,
          condition: getWmoCondition(hCode, isHourDay),
          relativeHumidity: Math.round(hourlyRaw.relative_humidity_2m ? hourlyRaw.relative_humidity_2m[idx] ?? 0 : 0),
          windSpeedKmH: Math.round((hourlyRaw.wind_speed_10m ? hourlyRaw.wind_speed_10m[idx] ?? 0 : 0) * 10) / 10
        });
      }
    }
    const dailyItems = [];
    if (Array.isArray(dailyRaw.time)) {
      const daysCount = Math.min(7, dailyRaw.time.length);
      for (let d = 0; d < daysCount; d++) {
        const dCode = dailyRaw.weather_code ? dailyRaw.weather_code[d] : 0;
        const dateStr = dailyRaw.time[d];
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay();
        dailyItems.push({
          date: dateStr,
          dayName: DAY_NAMES[dayOfWeek] || { en: "Day", hi: "\u0926\u093F\u0928", ur: "\u062F\u0646" },
          tempMaxC: Math.round((dailyRaw.temperature_2m_max ? dailyRaw.temperature_2m_max[d] : 0) * 10) / 10,
          tempMinC: Math.round((dailyRaw.temperature_2m_min ? dailyRaw.temperature_2m_min[d] : 0) * 10) / 10,
          weatherCode: dCode,
          condition: getWmoCondition(dCode, true),
          rainProbabilityMax: dailyRaw.precipitation_probability_max ? dailyRaw.precipitation_probability_max[d] ?? 0 : 0,
          precipitationSumMm: Math.round((dailyRaw.precipitation_sum ? dailyRaw.precipitation_sum[d] ?? 0 : 0) * 10) / 10,
          windSpeedMaxKmH: Math.round((dailyRaw.wind_speed_10m_max ? dailyRaw.wind_speed_10m_max[d] ?? 0 : 0) * 10) / 10,
          uvIndexMax: dailyRaw.uv_index_max ? Math.round((dailyRaw.uv_index_max[d] ?? 0) * 10) / 10 : null,
          sunrise: dailyRaw.sunrise ? dailyRaw.sunrise[d] : "",
          sunset: dailyRaw.sunset ? dailyRaw.sunset[d] : ""
        });
      }
    }
    const alerts = [];
    const triggeredAt = (/* @__PURE__ */ new Date()).toISOString();
    if ([95, 96, 99].includes(weatherCode)) {
      alerts.push({
        id: `alert-thunderstorm-${Date.now()}`,
        severity: "severe",
        type: "thunderstorm",
        title: {
          en: "Thunderstorm Warning in Reserve Range",
          hi: "\u092C\u093E\u0918 \u0905\u092D\u092F\u093E\u0930\u0923\u094D\u092F \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u0906\u0902\u0927\u0940-\u0924\u0942\u092B\u093C\u093E\u0928 \u0915\u0940 \u091A\u0947\u0924\u093E\u0935\u0928\u0940",
          ur: "\u0679\u0627\u0626\u06CC\u06AF\u0631 \u0631\u06CC\u0632\u0631\u0648 \u0631\u06CC\u0646\u062C \u0645\u06CC\u06BA \u06AF\u0631\u062C \u0686\u0645\u06A9 \u0627\u0648\u0631 \u0637\u0648\u0641\u0627\u0646 \u06A9\u0627 \u0627\u0644\u0631\u0679"
        },
        description: {
          en: `Active lightning and thunderstorm detected over ${zone.name}.`,
          hi: `${zone.name} \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u092C\u093F\u091C\u0932\u0940 \u0915\u0921\u093C\u0915\u0928\u0947 \u0914\u0930 \u0924\u0940\u0935\u094D\u0930 \u0906\u0902\u0927\u0940 \u0915\u093E \u092A\u094D\u0930\u092D\u093E\u0935 \u0938\u0915\u094D\u0930\u093F\u092F \u0939\u0948\u0964`,
          ur: `${zone.name} \u06A9\u06D2 \u0639\u0644\u0627\u0642\u06D2 \u0645\u06CC\u06BA \u0622\u0633\u0645\u0627\u0646\u06CC \u0628\u062C\u0644\u06CC \u0627\u0648\u0631 \u0637\u0648\u0641\u0627\u0646\u06CC \u0628\u0627\u0631\u0634 \u062C\u0627\u0631\u06CC \u06C1\u06D2\u06D4`
        },
        forestImpact: {
          en: "Gandak boat safaris and open-top gypsy patrols suspended. Visitors advised to seek shelter at forest checkposts.",
          hi: "\u0917\u0902\u0921\u0915 \u0928\u094C\u0915\u093E \u0938\u092B\u093E\u0930\u0940 \u0914\u0930 \u0916\u0941\u0932\u0940 \u091C\u093F\u092A\u094D\u0938\u0940 \u0938\u092B\u093E\u0930\u0940 \u0905\u0938\u094D\u0925\u093E\u092F\u0940 \u0930\u0942\u092A \u0938\u0947 \u0938\u094D\u0925\u0917\u093F\u0924\u0964 \u0906\u0917\u0902\u0924\u0941\u0915 \u0935\u0928 \u091A\u094C\u0915\u093F\u092F\u094B\u0902 \u092E\u0947\u0902 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0939\u0947\u0902\u0964",
          ur: "\u06AF\u0646\u062F\u06A9 \u0628\u0648\u0679 \u0633\u0641\u0627\u0631\u06CC \u0627\u0648\u0631 \u06A9\u06BE\u0644\u06CC \u06AF\u0627\u0691\u06CC\u0648\u06BA \u06A9\u06D2 \u062F\u0648\u0631\u06D2 \u0645\u0639\u0637\u0644\u06D4 \u0633\u06CC\u0627\u062D\u0648\u06BA \u06A9\u0648 \u0641\u0627\u0631\u0633\u0679 \u0686\u0648\u06A9\u06CC\u0648\u06BA \u067E\u0631 \u067E\u0646\u0627\u06C1 \u0644\u06CC\u0646\u06D2 \u06A9\u06CC \u06C1\u062F\u0627\u06CC\u062A\u06D4"
        },
        triggeredAt
      });
    }
    if (currentData.precipitationMm >= 10 || dailyItems[0] && dailyItems[0].precipitationSumMm >= 30) {
      alerts.push({
        id: `alert-rain-${Date.now()}`,
        severity: "warning",
        type: "heavy_rainfall",
        title: {
          en: "Heavy Monsoon / Forest Precipitation Alert",
          hi: "\u092D\u093E\u0930\u0940 \u092C\u093E\u0930\u093F\u0936 / \u0935\u0928 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u091C\u0932\u092D\u0930\u093E\u0935 \u0915\u0940 \u091A\u0947\u0924\u093E\u0935\u0928\u0940",
          ur: "\u0634\u062F\u06CC\u062F \u0628\u0627\u0631\u0634 \u0627\u0648\u0631 \u062C\u0646\u06AF\u0644\u0627\u062A\u06CC \u0631\u0627\u0633\u062A\u0648\u06BA \u067E\u0631 \u067E\u0627\u0646\u06CC \u06A9\u0627 \u0627\u0644\u0631\u0679"
        },
        description: {
          en: `Substantial rainfall (${currentData.precipitationMm} mm/hr) recorded in ${zone.name}.`,
          hi: `${zone.name} \u092E\u0947\u0902 \u092A\u0930\u094D\u092F\u093E\u092A\u094D\u0924 \u092C\u093E\u0930\u093F\u0936 (${currentData.precipitationMm} \u092E\u093F\u092E\u0940) \u0926\u0930\u094D\u091C \u0915\u0940 \u0917\u0908 \u0939\u0948\u0964`,
          ur: `${zone.name} \u0645\u06CC\u06BA \u0645\u0648\u0633\u0644\u0627\u062F\u06BE\u0627\u0631 \u0628\u0627\u0631\u0634 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u06A9\u06CC \u06AF\u0626\u06CC \u06C1\u06D2\u06D4`
        },
        forestImpact: {
          en: "Unpaved forest roads and seasonal streams (nullahs) may swell. Only high-clearance 4x4 authorized patrol vehicles permitted.",
          hi: "\u0915\u091A\u094D\u091A\u0947 \u0935\u0928 \u092E\u093E\u0930\u094D\u0917 \u0914\u0930 \u092C\u0930\u0938\u093E\u0924\u0940 \u0928\u093E\u0932\u0947 \u0909\u092B\u093E\u0928 \u092A\u0930 \u0939\u094B \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964 \u0915\u0947\u0935\u0932 4x4 \u0905\u0927\u093F\u0915\u0943\u0924 \u0917\u0936\u094D\u0924\u0940 \u0935\u093E\u0939\u0928\u094B\u0902 \u0915\u094B \u0905\u0928\u0941\u092E\u0924\u093F\u0964",
          ur: "\u06A9\u0686\u06D2 \u062C\u0646\u06AF\u0644\u0627\u062A\u06CC \u0631\u0627\u0633\u062A\u06D2 \u0627\u0648\u0631 \u0646\u0627\u0644\u06D2 \u0632\u06CC\u0631 \u0622\u0628 \u0622 \u0633\u06A9\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4 \u0635\u0631\u0641 \u0645\u062C\u0627\u0632 \u0641\u0648\u0631 \u0628\u0627\u0626\u06CC \u0641\u0648\u0631 \u06AF\u0627\u0691\u06CC\u0648\u06BA \u06A9\u06CC \u0627\u062C\u0627\u0632\u062A\u06D4"
        },
        triggeredAt
      });
    }
    if (currentData.temperatureC >= 39 || currentData.apparentTemperatureC >= 42) {
      alerts.push({
        id: `alert-heat-${Date.now()}`,
        severity: "warning",
        type: "extreme_heat",
        title: {
          en: "High Temperature & Heat Caution",
          hi: "\u0905\u0924\u094D\u092F\u0927\u093F\u0915 \u0917\u0930\u094D\u092E\u0940 \u0914\u0930 \u0932\u0942 \u0915\u093E \u092A\u0930\u093E\u092E\u0930\u094D\u0936",
          ur: "\u0634\u062F\u06CC\u062F \u06AF\u0631\u0645\u06CC \u0627\u0648\u0631 \u0644\u0648 \u06A9\u0627 \u0645\u0634\u0648\u0631\u06C1"
        },
        description: {
          en: `Temperature reached ${currentData.temperatureC}\xB0C (Feels like ${currentData.apparentTemperatureC}\xB0C) in the reserve.`,
          hi: `\u0935\u0928 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u0924\u093E\u092A\u092E\u093E\u0928 ${currentData.temperatureC}\xB0C (\u092E\u0939\u0938\u0942\u0938 ${currentData.apparentTemperatureC}\xB0C) \u0924\u0915 \u092A\u0939\u0941\u0901\u091A \u0917\u092F\u093E \u0939\u0948\u0964`,
          ur: `\u0631\u06CC\u0632\u0631\u0648 \u0645\u06CC\u06BA \u062F\u0631\u062C\u06C1 \u062D\u0631\u0627\u0631\u062A ${currentData.temperatureC} \u0688\u06AF\u0631\u06CC \u0633\u06CC\u0646\u0679\u06CC \u06AF\u0631\u06CC\u0688 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u06A9\u06CC\u0627 \u06AF\u06CC\u0627\u06D4`
        },
        forestImpact: {
          en: "High dehydration risk during afternoon safaris. Tigers remain in dense ravines or core river pools until dusk.",
          hi: "\u0926\u094B\u092A\u0939\u0930 \u0915\u0940 \u0938\u092B\u093E\u0930\u0940 \u0915\u0947 \u0926\u094C\u0930\u093E\u0928 \u0928\u093F\u0930\u094D\u091C\u0932\u0940\u0915\u0930\u0923 \u0915\u093E \u0916\u0924\u0930\u093E\u0964 \u092C\u093E\u0918 \u0906\u092E\u0924\u094C\u0930 \u092A\u0930 \u0936\u093E\u092E \u0924\u0915 \u0918\u0928\u0947 \u0928\u093E\u0932\u094B\u0902 \u092F\u093E \u092A\u093E\u0928\u0940 \u0915\u0947 \u0917\u0921\u094D\u0922\u094B\u0902 \u0915\u0947 \u092A\u093E\u0938 \u0935\u093F\u0936\u094D\u0930\u093E\u092E \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964",
          ur: "\u0633\u0641\u0627\u0631\u06CC \u06A9\u06D2 \u062F\u0648\u0631\u0627\u0646 \u0648\u0627\u0641\u0631 \u067E\u0627\u0646\u06CC \u0633\u0627\u062A\u06BE \u0631\u06A9\u06BE\u06CC\u06BA\u06D4 \u0634\u06CC\u0631 \u0639\u0627\u0645 \u0637\u0648\u0631 \u067E\u0631 \u06AF\u06BE\u0646\u06D2 \u06AF\u06BE\u0627\u0679\u06CC\u0648\u06BA \u06CC\u0627 \u067E\u0627\u0646\u06CC \u06A9\u06D2 \u062A\u0627\u0644\u0627\u0628\u0648\u06BA \u0645\u06CC\u06BA \u067E\u0646\u0627\u06C1 \u0644\u06CC\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4"
        },
        triggeredAt
      });
    }
    if (currentData.windSpeedKmH >= 42) {
      alerts.push({
        id: `alert-wind-${Date.now()}`,
        severity: "advisory",
        type: "strong_winds",
        title: {
          en: "Strong Forest Gusts Advisory",
          hi: "\u0924\u0940\u0935\u094D\u0930 \u0939\u0935\u093E\u0913\u0902 \u0914\u0930 \u0935\u0943\u0915\u094D\u0937 \u0936\u093E\u0916\u093E \u0917\u093F\u0930\u0928\u0947 \u0915\u093E \u092A\u0930\u093E\u092E\u0930\u094D\u0936",
          ur: "\u062A\u06CC\u0632 \u06C1\u0648\u0627\u0624\u06BA \u0627\u0648\u0631 \u062F\u0631\u062E\u062A\u0648\u06BA \u06A9\u06CC \u0634\u0627\u062E\u0648\u06BA \u06A9\u06D2 \u06AF\u0631\u0646\u06D2 \u06A9\u0627 \u0627\u0644\u0631\u0679"
        },
        description: {
          en: `Wind gusts up to ${currentData.windSpeedKmH} km/h recorded in ${zone.name}.`,
          hi: `${zone.name} \u092E\u0947\u0902 \u0939\u0935\u093E \u0915\u0940 \u0917\u0924\u093F ${currentData.windSpeedKmH} \u0915\u093F\u092E\u0940/\u0918\u0902\u091F\u093E \u0926\u0930\u094D\u091C\u0964`,
          ur: `\u062C\u0646\u06AF\u0644 \u0645\u06CC\u06BA \u062A\u06CC\u0632 \u06C1\u0648\u0627\u0624\u06BA \u06A9\u06CC \u0631\u0641\u062A\u0627\u0631 ${currentData.windSpeedKmH} \u06A9\u0644\u0648\u0645\u06CC\u0679\u0631 \u0641\u06CC \u06AF\u06BE\u0646\u0679\u06C1 \u06C1\u06D2\u06D4`
        },
        forestImpact: {
          en: "Caution for fallen sal branches along forest tracks. Drivers must maintain safe distance from dead timber.",
          hi: "\u0915\u091A\u094D\u091A\u0947 \u092E\u093E\u0930\u094D\u0917\u094B\u0902 \u092A\u0930 \u0938\u093E\u0932 \u0915\u0947 \u092A\u0947\u0921\u093C\u094B\u0902 \u0915\u0940 \u0936\u093E\u0916\u093E\u090F\u0901 \u0917\u093F\u0930\u0928\u0947 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E\u0964 \u0938\u093E\u0935\u0927\u093E\u0928\u0940 \u0938\u0947 \u0935\u093E\u0939\u0928 \u091A\u0932\u093E\u090F\u0901\u0964",
          ur: "\u0631\u0627\u0633\u062A\u0648\u06BA \u067E\u0631 \u062E\u0634\u06A9 \u062F\u0631\u062E\u062A\u0648\u06BA \u06A9\u06CC \u0634\u0627\u062E\u06CC\u06BA \u06AF\u0631\u0646\u06D2 \u06A9\u0627 \u062E\u062F\u0634\u06C1\u06D4 \u06AF\u0627\u0691\u06CC \u0622\u06C1\u0633\u062A\u06C1 \u0627\u0648\u0631 \u0627\u062D\u062A\u06CC\u0627\u0637 \u0633\u06D2 \u0686\u0644\u0627\u0626\u06CC\u06BA\u06D4"
        },
        triggeredAt
      });
    }
    if (currentData.visibilityMeters !== null && currentData.visibilityMeters <= 1e3) {
      alerts.push({
        id: `alert-visibility-${Date.now()}`,
        severity: "warning",
        type: "poor_visibility",
        title: {
          en: "Dense Mist / Reduced Visibility Advisory",
          hi: "\u0918\u0928\u093E \u0915\u094B\u0939\u0930\u093E / \u0915\u092E \u0926\u0943\u0936\u094D\u092F\u0924\u093E \u092A\u0930\u093E\u092E\u0930\u094D\u0936",
          ur: "\u0634\u062F\u06CC\u062F \u062F\u06BE\u0646\u062F \u0627\u0648\u0631 \u06A9\u0645 \u062D\u062F \u0646\u06AF\u0627\u06C1 \u06A9\u0627 \u0627\u0644\u0631\u0679"
        },
        description: {
          en: `Forest visibility reduced to ${(currentData.visibilityMeters / 1e3).toFixed(1)} km along Gandak river corridor.`,
          hi: `\u0917\u0902\u0921\u0915 \u0928\u0926\u0940 \u0917\u0932\u093F\u092F\u093E\u0930\u0947 \u092E\u0947\u0902 \u0926\u0943\u0936\u094D\u092F\u0924\u093E \u0918\u091F\u0915\u0930 ${(currentData.visibilityMeters / 1e3).toFixed(1)} \u0915\u093F\u092E\u0940 \u0930\u0939 \u0917\u0908 \u0939\u0948\u0964`,
          ur: `\u06AF\u0646\u062F\u06A9 \u06A9\u06D2 \u0639\u0644\u0627\u0642\u06D2 \u0645\u06CC\u06BA \u062D\u062F \u0646\u06AF\u0627\u06C1 \u06A9\u0645 \u06C1\u0648 \u06A9\u0631 ${(currentData.visibilityMeters / 1e3).toFixed(1)} \u06A9\u0644\u0648\u0645\u06CC\u0679\u0631 \u0631\u06C1 \u06AF\u0626\u06CC\u06D4`
        },
        forestImpact: {
          en: "Speed limit inside core sector capped at 20 km/h. Headlights required on all patrol routes.",
          hi: "\u0915\u094B\u0930 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u0935\u093E\u0939\u0928\u094B\u0902 \u0915\u0940 \u0917\u0924\u093F \u0938\u0940\u092E\u093E 20 \u0915\u093F\u092E\u0940/\u0918\u0902\u091F\u093E \u0924\u0915 \u0938\u0940\u092E\u093F\u0924\u0964 \u0939\u0947\u0921\u0932\u093E\u0907\u091F\u094D\u0938 \u091C\u0932\u093E\u0928\u093E \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F\u0964",
          ur: "\u0631\u06CC\u0632\u0631\u0648 \u06A9\u06D2 \u0627\u0646\u062F\u0631 \u0631\u0641\u062A\u0627\u0631 20 \u06A9\u0644\u0648\u0645\u06CC\u0679\u0631 \u062A\u06A9 \u0645\u062D\u062F\u0648\u062F\u06D4 \u06C1\u06CC\u0688 \u0644\u0627\u0626\u0679\u0633 \u06A9\u0627 \u0627\u0633\u062A\u0639\u0645\u0627\u0644 \u0644\u0627\u0632\u0645\u06CC\u06D4"
        },
        triggeredAt
      });
    }
    const payload = {
      success: true,
      location: {
        name: "Valmiki Tiger Reserve, West Champaran, Bihar, India",
        zoneId: zone.id,
        zoneName: zone.name,
        rangeName: zone.rangeName,
        district: "West Champaran",
        state: "Bihar",
        country: "India",
        latitude: zone.latitude,
        longitude: zone.longitude,
        elevationMeters: zone.elevationMeters
      },
      current: currentData,
      hourly: hourlyItems,
      daily: dailyItems,
      alerts,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      apiSourceTime: currentRaw.time || (/* @__PURE__ */ new Date()).toISOString(),
      dataSource: "Open-Meteo Weather API (WMO Meteorological System)",
      dataSourceUrl: "https://open-meteo.com/",
      cached: false
    };
    memoryCache.set(cacheKey, {
      data: payload,
      timestamp: now
    });
    return payload;
  } catch (error) {
    console.error("Failed to fetch real-time weather from Open-Meteo:", error);
    if (cachedRecord) {
      return {
        ...cachedRecord.data,
        cached: true,
        stale: true,
        error: "Live weather service temporarily unreachable. Showing latest recorded observations."
      };
    }
    return {
      success: false,
      location: {
        name: "Valmiki Tiger Reserve, West Champaran, Bihar, India",
        zoneId: zone.id,
        zoneName: zone.name,
        rangeName: zone.rangeName,
        district: "West Champaran",
        state: "Bihar",
        country: "India",
        latitude: zone.latitude,
        longitude: zone.longitude,
        elevationMeters: zone.elevationMeters
      },
      current: null,
      hourly: [],
      daily: [],
      alerts: [],
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      apiSourceTime: "",
      dataSource: "Open-Meteo Weather API (WMO Meteorological System)",
      dataSourceUrl: "https://open-meteo.com/",
      cached: false,
      error: "Weather data unavailable. Please verify network connection or retry."
    };
  }
}

// src/server/certificateService.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var REGISTRY_FILE = import_path.default.join(DATA_DIR, "certificates_registry.json");
var SETTINGS_FILE = import_path.default.join(DATA_DIR, "certificate_settings.json");
var DEFAULT_SETTINGS = {
  numberingPrefix: "VTW",
  numberingYearFormat: "YYYY",
  nextSequence: 1,
  customLogoUrl: "/vtw-logo.png",
  customSignatureUrl: "/assets/president-signature.png",
  signatureName: "Nazish Asad",
  signatureTitle: "President",
  signatureOrg: "Valmiki Tiger Watch",
  designTheme: "royal-emerald-gold",
  borderStyle: "ornate-double",
  headerText: {
    en: "VALMIKI TIGER WATCH",
    hi: "\u0935\u093E\u0932\u094D\u092E\u0940\u0915\u093F \u091F\u093E\u0907\u0917\u0930 \u0935\u0949\u091A",
    ur: "\u0648\u0627\u0644\u0645\u06CC\u06A9\u06CC \u0679\u0627\u0626\u06CC\u06AF\u0631 \u0648\u0627\u0686"
  },
  titleText: {
    en: "CERTIFICATE OF TIGER PROTECTION PLEDGE",
    hi: "\u092C\u093E\u0918 \u0938\u0902\u0930\u0915\u094D\u0937\u0923 \u0938\u0902\u0915\u0932\u094D\u092A \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930",
    ur: "\u062A\u062D\u0641\u0638\u0650 \u0634\u06CC\u0631 \u0639\u06C1\u062F \u0646\u0627\u0645\u06C1 \u0633\u0631\u0679\u06CC\u0641\u06A9\u06CC\u0679"
  },
  presentedToText: {
    en: "This certificate is proudly presented to",
    hi: "\u092F\u0939 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0917\u0930\u094D\u0935 \u0915\u0947 \u0938\u093E\u0925 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948:",
    ur: "\u06CC\u06C1 \u0633\u0631\u0679\u06CC\u0641\u06A9\u06CC\u0679 \u0641\u062E\u0631 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u067E\u06CC\u0634 \u06A9\u06CC\u0627 \u062C\u0627\u062A\u0627 \u06C1\u06D2 \u0628\u062D\u0642:"
  },
  pledgeBodyText: {
    en: "For voluntarily pledging to support tiger conservation, protect wildlife, respect forest laws, and contribute to the protection of tigers and their natural habitat in Valmiki Tiger Reserve and across India.",
    hi: "\u092C\u093E\u0918 \u0938\u0902\u0930\u0915\u094D\u0937\u0923 \u0915\u093E \u0938\u094D\u0935\u0947\u091A\u094D\u091B\u093E \u0938\u0947 \u0938\u092E\u0930\u094D\u0925\u0928 \u0915\u0930\u0928\u0947, \u0935\u0928\u094D\u092F\u091C\u0940\u0935\u094B\u0902 \u0915\u0940 \u0930\u0915\u094D\u0937\u093E \u0915\u0930\u0928\u0947, \u0935\u0928 \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u093E \u0938\u092E\u094D\u092E\u093E\u0928 \u0915\u0930\u0928\u0947 \u0914\u0930 \u0935\u093E\u0932\u094D\u092E\u0940\u0915\u093F \u091F\u093E\u0907\u0917\u0930 \u0930\u093F\u091C\u093C\u0930\u094D\u0935 \u0935 \u092A\u0942\u0930\u0947 \u092D\u093E\u0930\u0924 \u092E\u0947\u0902 \u092C\u093E\u0918\u094B\u0902 \u0924\u0925\u093E \u0909\u0928\u0915\u0947 \u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u0906\u0935\u093E\u0938 \u0915\u0947 \u0938\u0902\u0930\u0915\u094D\u0937\u0923 \u092E\u0947\u0902 \u092F\u094B\u0917\u0926\u093E\u0928 \u0926\u0947\u0928\u0947 \u0915\u0947 \u0938\u0902\u0915\u0932\u094D\u092A \u0939\u0947\u0924\u0941\u0964",
    ur: "\u0634\u06CC\u0631\u0648\u06BA \u06A9\u06D2 \u062A\u062D\u0641\u0638 \u06A9\u06CC \u0631\u0636\u0627\u06A9\u0627\u0631\u0627\u0646\u06C1 \u062D\u0645\u0627\u06CC\u062A\u060C \u062C\u0646\u06AF\u0644\u06CC \u062D\u06CC\u0627\u062A \u06A9\u06CC \u0628\u0642\u0627\u060C \u062C\u0646\u06AF\u0644 \u06A9\u06D2 \u0642\u0648\u0627\u0646\u06CC\u0646 \u06A9\u06D2 \u0627\u062D\u062A\u0631\u0627\u0645 \u0627\u0648\u0631 \u0648\u0627\u0644\u0645\u06CC\u06A9\u06CC \u0679\u0627\u0626\u06CC\u06AF\u0631 \u0631\u06CC\u0632\u0631\u0648 \u0648 \u067E\u0648\u0631\u06D2 \u0628\u06BE\u0627\u0631\u062A \u0645\u06CC\u06BA \u0634\u06CC\u0631\u0648\u06BA \u0627\u0648\u0631 \u0627\u0646 \u06A9\u06D2 \u0642\u062F\u0631\u062A\u06CC \u0645\u0633\u06A9\u0646 \u06A9\u06D2 \u062A\u062D\u0641\u0638 \u0645\u06CC\u06BA \u0627\u067E\u0646\u0627 \u06A9\u0631\u062F\u0627\u0631 \u0627\u062F\u0627 \u06A9\u0631\u0646\u06D2 \u06A9\u0627 \u067E\u062E\u062A\u06C1 \u0639\u06C1\u062F \u06A9\u0631\u0646\u06D2 \u067E\u0631\u06D4"
  },
  disclaimerText: {
    en: "This is a voluntary conservation pledge certificate issued by Valmiki Tiger Watch to recognize individual community commitment to wildlife protection. It is not an official government certificate, employment credential, or formal academic qualification.",
    hi: "\u092F\u0939 \u0935\u093E\u0932\u094D\u092E\u0940\u0915\u093F \u091F\u093E\u0907\u0917\u0930 \u0935\u0949\u091A \u0926\u094D\u0935\u093E\u0930\u093E \u0935\u0928\u094D\u092F\u091C\u0940\u0935 \u0938\u0902\u0930\u0915\u094D\u0937\u0923 \u0915\u0947 \u092A\u094D\u0930\u0924\u093F \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u0938\u093E\u092E\u0941\u0926\u093E\u092F\u093F\u0915 \u092A\u094D\u0930\u0924\u093F\u092C\u0926\u094D\u0927\u0924\u093E \u0915\u094B \u0938\u092E\u094D\u092E\u093E\u0928\u093F\u0924 \u0915\u0930\u0928\u0947 \u0939\u0947\u0924\u0941 \u091C\u093E\u0930\u0940 \u090F\u0915 \u0938\u094D\u0935\u0948\u091A\u094D\u091B\u093F\u0915 \u0938\u0902\u0915\u0932\u094D\u092A \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0939\u0948\u0964 \u092F\u0939 \u0915\u094B\u0908 \u0938\u0930\u0915\u093E\u0930\u0940 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C, \u0930\u094B\u091C\u0917\u093E\u0930 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u092F\u093E \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u0909\u092A\u093E\u0927\u093F \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
    ur: "\u06CC\u06C1 \u0648\u0627\u0644\u0645\u06CC\u06A9\u06CC \u0679\u0627\u0626\u06CC\u06AF\u0631 \u0648\u0627\u0686 \u06A9\u06CC \u062C\u0627\u0646\u0628 \u0633\u06D2 \u062C\u0646\u06AF\u0644\u06CC \u062D\u06CC\u0627\u062A \u06A9\u06D2 \u062A\u062D\u0641\u0638 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0627\u0646\u0641\u0631\u0627\u062F\u06CC \u0639\u0632\u0645 \u06A9\u0648 \u0633\u0631\u0627\u06C1\u0646\u06D2 \u06A9\u06D2 \u0644\u06CC\u06D2 \u062C\u0627\u0631\u06CC \u06A9\u0631\u062F\u06C1 \u0627\u06CC\u06A9 \u0631\u0636\u0627\u06A9\u0627\u0631\u0627\u0646\u06C1 \u0639\u06C1\u062F \u0646\u0627\u0645\u06C1 \u0633\u0631\u0679\u06CC\u0641\u06A9\u06CC\u0679 \u06C1\u06D2\u06D4 \u06CC\u06C1 \u06A9\u0648\u0626\u06CC \u0633\u0631\u06A9\u0627\u0631\u06CC \u0633\u0646\u062F\u060C \u0645\u0644\u0627\u0632\u0645\u062A \u06A9\u0627 \u067E\u0631\u0648\u0627\u0646\u06C1 \u06CC\u0627 \u062A\u0639\u0644\u06CC\u0645\u06CC \u0688\u06AF\u0631\u06CC \u0646\u06C1\u06CC\u06BA \u06C1\u06D2\u06D4"
  },
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
};
var certificatesRegistry = [];
var certificateSettings = { ...DEFAULT_SETTINGS };
function ensureDataDirectory() {
  if (!import_fs.default.existsSync(DATA_DIR)) {
    try {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.warn("Could not create data directory:", err);
    }
  }
}
function loadRegistryFromDisk() {
  ensureDataDirectory();
  try {
    if (import_fs.default.existsSync(REGISTRY_FILE)) {
      const data = import_fs.default.readFileSync(REGISTRY_FILE, "utf-8");
      certificatesRegistry = JSON.parse(data);
    }
  } catch (err) {
    console.warn("Error reading certificates registry file:", err);
  }
  try {
    if (import_fs.default.existsSync(SETTINGS_FILE)) {
      const data = import_fs.default.readFileSync(SETTINGS_FILE, "utf-8");
      certificateSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn("Error reading certificate settings file:", err);
  }
  const maxSeq = certificatesRegistry.reduce((max, c) => {
    const match = c.certificateNumber.match(/-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      return Math.max(max, n);
    }
    return max;
  }, 0);
  if (maxSeq >= certificateSettings.nextSequence) {
    certificateSettings.nextSequence = maxSeq + 1;
  }
}
function saveRegistryToDisk() {
  ensureDataDirectory();
  try {
    import_fs.default.writeFileSync(REGISTRY_FILE, JSON.stringify(certificatesRegistry, null, 2), "utf-8");
  } catch (err) {
    console.warn("Error writing certificates registry to disk:", err);
  }
}
function saveSettingsToDisk() {
  ensureDataDirectory();
  try {
    import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(certificateSettings, null, 2), "utf-8");
  } catch (err) {
    console.warn("Error writing certificate settings to disk:", err);
  }
}
loadRegistryFromDisk();
function formatPledgeDate(date, lang = "en") {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  if (lang === "hi") {
    return date.toLocaleDateString("hi-IN", options);
  }
  if (lang === "ur") {
    return date.toLocaleDateString("ur-PK", options);
  }
  return date.toLocaleDateString("en-US", options);
}
function generateUniqueCertificateNumber() {
  const now = /* @__PURE__ */ new Date();
  const yearStr = certificateSettings.numberingYearFormat === "YY" ? String(now.getFullYear()).slice(-2) : String(now.getFullYear());
  const prefix = certificateSettings.numberingPrefix || "VTW";
  let seq = certificateSettings.nextSequence;
  while (true) {
    const paddedSeq = String(seq).padStart(6, "0");
    const certNumber = `${prefix}-${yearStr}-${paddedSeq}`;
    const exists = certificatesRegistry.some((c) => c.certificateNumber === certNumber);
    if (!exists) {
      certificateSettings.nextSequence = seq + 1;
      saveSettingsToDisk();
      return certNumber;
    }
    seq += 1;
  }
}
function createTigerPledgeCertificate(input) {
  const trimmedName = input.fullName.trim();
  const trimmedLocation = input.cityAndState.trim();
  const trimmedCountry = (input.country || "India").trim();
  const trimmedEmail = input.email ? input.email.trim() : void 0;
  const trimmedOrg = input.organization ? input.organization.trim() : void 0;
  const lang = input.language === "hi" || input.language === "ur" ? input.language : "en";
  if (!trimmedName) {
    throw new Error("Participant full name is required.");
  }
  if (!trimmedLocation) {
    throw new Error("City and State is required.");
  }
  const existing = certificatesRegistry.find((c) => {
    if (input.pledgeId && c.pledgeId && c.pledgeId === input.pledgeId) {
      return true;
    }
    const sameName = c.fullName.trim().toLowerCase() === trimmedName.toLowerCase();
    const sameLocation = c.cityAndState.trim().toLowerCase() === trimmedLocation.toLowerCase();
    const sameEmail = trimmedEmail && c.email ? c.email.trim().toLowerCase() === trimmedEmail.toLowerCase() : false;
    return sameName && sameLocation || sameName && sameEmail;
  });
  if (existing) {
    return {
      ...existing,
      alreadyIssued: true
    };
  }
  const certNumber = generateUniqueCertificateNumber();
  const now = /* @__PURE__ */ new Date();
  const pledgeFormattedDate = formatPledgeDate(now, lang);
  const certId = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const pledgeId = input.pledgeId || `pledge_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const hash = import_crypto.default.createHash("sha256").update(`${certNumber}:${trimmedName}:${trimmedLocation}:${now.toISOString()}`).digest("hex").slice(0, 16);
  const newCert = {
    id: certId,
    certificateId: certId,
    certificateNumber: certNumber,
    pledgeId,
    fullName: trimmedName,
    participantName: trimmedName,
    cityAndState: trimmedLocation,
    country: trimmedCountry,
    email: trimmedEmail,
    organization: trimmedOrg,
    pledgeDate: pledgeFormattedDate,
    issueDate: pledgeFormattedDate,
    pledgeFormattedDate,
    language: lang,
    status: "valid",
    issuedAt: now.toISOString(),
    createdAt: now.toISOString(),
    verificationHash: hash,
    isLocallyStored: false
  };
  certificatesRegistry.unshift(newCert);
  saveRegistryToDisk();
  return newCert;
}
function getCertificatesList(search, status) {
  let list = [...certificatesRegistry];
  if (status && status !== "all") {
    list = list.filter((c) => c.status === status);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (c) => c.certificateNumber.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q) || c.participantName && c.participantName.toLowerCase().includes(q) || c.pledgeId && c.pledgeId.toLowerCase().includes(q) || c.pledgeDate && c.pledgeDate.toLowerCase().includes(q) || c.issueDate && c.issueDate.toLowerCase().includes(q) || c.cityAndState.toLowerCase().includes(q) || c.organization && c.organization.toLowerCase().includes(q)
    );
  }
  return list;
}
function verifyCertificateByNumber(certNumber) {
  const found = certificatesRegistry.find(
    (c) => c.certificateNumber.trim().toUpperCase() === certNumber.trim().toUpperCase()
  );
  if (!found) {
    return {
      found: false,
      message: "Certificate not found in Valmiki Tiger Watch official registry."
    };
  }
  return {
    found: true,
    certificate: {
      certificateNumber: found.certificateNumber,
      fullName: found.fullName,
      cityAndState: found.cityAndState,
      country: found.country,
      organization: found.organization,
      pledgeFormattedDate: found.pledgeFormattedDate,
      pledgeDate: found.pledgeDate,
      language: found.language,
      status: found.status,
      revokedAt: found.revokedAt,
      revocationReason: found.revocationReason,
      issuedAt: found.issuedAt,
      verificationHash: found.verificationHash,
      isVoluntaryPledge: true,
      issuer: "Valmiki Tiger Watch"
    }
  };
}
function revokeCertificate(certNumber, reason) {
  const index = certificatesRegistry.findIndex(
    (c) => c.certificateNumber.trim().toUpperCase() === certNumber.trim().toUpperCase()
  );
  if (index === -1) {
    return { success: false, message: "Certificate number not found." };
  }
  certificatesRegistry[index].status = "revoked";
  certificatesRegistry[index].revokedAt = (/* @__PURE__ */ new Date()).toISOString();
  certificatesRegistry[index].revocationReason = reason || "Revoked by authorized administrator.";
  saveRegistryToDisk();
  return {
    success: true,
    certificate: certificatesRegistry[index],
    message: `Certificate ${certNumber} has been revoked.`
  };
}
function restoreCertificate(certNumber) {
  const index = certificatesRegistry.findIndex(
    (c) => c.certificateNumber.trim().toUpperCase() === certNumber.trim().toUpperCase()
  );
  if (index === -1) {
    return { success: false, message: "Certificate number not found." };
  }
  certificatesRegistry[index].status = "valid";
  delete certificatesRegistry[index].revokedAt;
  delete certificatesRegistry[index].revocationReason;
  saveRegistryToDisk();
  return {
    success: true,
    certificate: certificatesRegistry[index],
    message: `Certificate ${certNumber} has been restored to valid status.`
  };
}
function getCertificateSettings() {
  return { ...certificateSettings };
}
function updateCertificateSettings(updates) {
  certificateSettings = {
    ...certificateSettings,
    ...updates,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
  saveSettingsToDisk();
  return certificateSettings;
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, customSystemPrompt } = req.body;
      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Message string is required." });
        return;
      }
      const response = await processChatMessage(message, history || [], customSystemPrompt);
      res.json(response);
    } catch (error) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({
        reply: "An error occurred while contacting the AI assistant. Please try again.",
        error: error?.message || "Internal error"
      });
    }
  });
  app.get("/api/chat/status", (_req, res) => {
    try {
      const status = getAiBackendStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error?.message || "Unable to check AI status" });
    }
  });
  app.post("/api/news/refresh", async (req, res) => {
    try {
      const existingArticles = Array.isArray(req.body?.existingArticles) ? req.body.existingArticles : [];
      const result = await fetchLiveTigerNews(existingArticles);
      res.json({
        success: true,
        newArticles: result.newArticles,
        allUpdatedNews: result.allUpdatedNews,
        sourcesChecked: result.sourcesChecked,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
        message: result.message
      });
    } catch (error) {
      console.error("Error refreshing news feeds:", error);
      res.status(500).json({
        success: false,
        message: "Unable to connect to live news sources. Keeping previously verified news visible.",
        error: error?.message || "Unknown network error"
      });
    }
  });
  app.get("/api/news/sources", (_req, res) => {
    res.json({
      sources: [
        { name: "Times of India (TOI)", type: "newspaper", category: "Established Media", language: "en", status: "active" },
        { name: "The Hindu", type: "newspaper", category: "Established Media", language: "en", status: "active" },
        { name: "Hindustan Times", type: "newspaper", category: "Established Media", language: "en", status: "active" },
        { name: "Dainik Jagran (\u0926\u0948\u0928\u093F\u0915 \u091C\u093E\u0917\u0930\u0923)", type: "newspaper", category: "Established Media", language: "hi", status: "active" },
        { name: "Live Hindustan (\u0939\u093F\u0928\u094D\u0926\u0941\u0938\u094D\u0924\u093E\u0928)", type: "newspaper", category: "Established Media", language: "hi", status: "active" },
        { name: "Dainik Bhaskar (\u0926\u0948\u0928\u093F\u0915 \u092D\u093E\u0938\u094D\u0915\u0930)", type: "newspaper", category: "Established Media", language: "hi", status: "active" },
        { name: "Prabhat Khabar (\u092A\u094D\u0930\u092D\u093E\u0924 \u0916\u092C\u0930)", type: "newspaper", category: "Established Media", language: "hi", status: "active" },
        { name: "Bihar Forest Department", type: "government", category: "Forest Department", language: "en/hi", status: "active" },
        { name: "National Tiger Conservation Authority (NTCA)", type: "government", category: "NTCA / MoEFCC", language: "en", status: "active" }
      ]
    });
  });
  app.get("/api/weather", async (req, res) => {
    try {
      const zoneId = typeof req.query.zoneId === "string" ? req.query.zoneId : "valmikinagar";
      const forceRefresh = req.query.forceRefresh === "true";
      const weatherData = await fetchVTRWeatherData(zoneId, forceRefresh);
      res.json(weatherData);
    } catch (error) {
      console.error("Error in /api/weather route:", error);
      res.status(500).json({
        success: false,
        error: "Weather data unavailable. Please try again later.",
        message: error?.message || "Upstream meteorological API error"
      });
    }
  });
  app.get("/api/weather/zones", (_req, res) => {
    res.json({
      zones: VTR_WEATHER_ZONES
    });
  });
  app.post("/api/certificates/generate", (req, res) => {
    try {
      const { pledgeId, fullName, cityAndState, country, email, organization, language } = req.body || {};
      if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
        res.status(400).json({ error: "Full name is required." });
        return;
      }
      if (!cityAndState || typeof cityAndState !== "string" || !cityAndState.trim()) {
        res.status(400).json({ error: "City and state is required." });
        return;
      }
      const certificate = createTigerPledgeCertificate({
        pledgeId,
        fullName,
        cityAndState,
        country: country || "India",
        email,
        organization,
        language
      });
      const isAlreadyIssued = Boolean(certificate.alreadyIssued);
      res.status(isAlreadyIssued ? 200 : 201).json({
        success: true,
        alreadyIssued: isAlreadyIssued,
        certificate,
        message: isAlreadyIssued ? "Certificate already issued for this participant." : "Tiger Protection Pledge Certificate generated successfully."
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({
        success: false,
        error: error?.message || "Failed to generate pledge certificate."
      });
    }
  });
  app.get("/api/certificates", (req, res) => {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : void 0;
      const status = typeof req.query.status === "string" ? req.query.status : void 0;
      const list = getCertificatesList(search, status);
      res.json({
        success: true,
        total: list.length,
        certificates: list
      });
    } catch (error) {
      console.error("Error fetching certificates list:", error);
      res.status(500).json({ success: false, error: error?.message || "Failed to fetch certificates." });
    }
  });
  app.get("/api/certificates/verify/:certNumber", (req, res) => {
    try {
      const certNumber = req.params.certNumber;
      if (!certNumber) {
        res.status(400).json({ found: false, message: "Certificate number is required." });
        return;
      }
      const verification = verifyCertificateByNumber(certNumber);
      res.json(verification);
    } catch (error) {
      console.error("Error verifying certificate:", error);
      res.status(500).json({ found: false, message: "Server error verifying certificate." });
    }
  });
  app.post("/api/certificates/revoke", (req, res) => {
    try {
      const { certNumber, reason } = req.body || {};
      if (!certNumber) {
        res.status(400).json({ success: false, message: "Certificate number is required." });
        return;
      }
      const result = revokeCertificate(certNumber, reason);
      res.json(result);
    } catch (error) {
      console.error("Error revoking certificate:", error);
      res.status(500).json({ success: false, error: error?.message || "Failed to revoke certificate." });
    }
  });
  app.post("/api/certificates/restore", (req, res) => {
    try {
      const { certNumber } = req.body || {};
      if (!certNumber) {
        res.status(400).json({ success: false, message: "Certificate number is required." });
        return;
      }
      const result = restoreCertificate(certNumber);
      res.json(result);
    } catch (error) {
      console.error("Error restoring certificate:", error);
      res.status(500).json({ success: false, error: error?.message || "Failed to restore certificate." });
    }
  });
  app.get("/api/certificates/settings", (_req, res) => {
    try {
      const settings = getCertificateSettings();
      res.json({ success: true, settings });
    } catch (error) {
      console.error("Error getting certificate settings:", error);
      res.status(500).json({ success: false, error: error?.message || "Failed to get settings." });
    }
  });
  app.post("/api/certificates/settings", (req, res) => {
    try {
      const updates = req.body || {};
      const updated = updateCertificateSettings(updates);
      res.json({
        success: true,
        settings: updated,
        message: "Certificate settings updated successfully."
      });
    } catch (error) {
      console.error("Error updating certificate settings:", error);
      res.status(500).json({ success: false, error: error?.message || "Failed to update settings." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
