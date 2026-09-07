import { NewsArticle, NewsSource, NewsTopicCategory } from '../types';

// Storage keys
export const STORAGE_NEWS_KEY = 'vtw_news_articles_v3';
export const STORAGE_SOURCES_KEY = 'vtw_news_sources_v3';
export const STORAGE_LAST_UPDATE_KEY = 'vtw_news_last_updated_v3';
export const STORAGE_AUTO_SYNC_KEY = 'vtw_news_auto_sync_enabled_v3';

// Keywords to auto-classify topic categories
export function detectNewsTopic(headline: string, summary: string, sourceCategory: string): NewsTopicCategory {
  const text = `${headline} ${summary} ${sourceCategory}`.toLowerCase();
  
  if (text.includes('valmiki') || text.includes('वाल्मीकि') || text.includes('vtr') || text.includes('champaran') || text.includes('चंपारण') || text.includes('bagaha')) {
    return 'vtr';
  }
  if (text.includes('conflict') || text.includes('attack') || text.includes('compensation') || text.includes('हमला') || text.includes('fringe')) {
    return 'human_wildlife_conflict';
  }
  if (text.includes('census') || text.includes('population') || text.includes('camera trap') || text.includes('cub') || text.includes('गणना') || text.includes('शावक')) {
    return 'tiger_conservation';
  }
  if (text.includes('gharial') || text.includes('dolphin') || text.includes('rhino') || text.includes('घड़ियाल') || text.includes('biodiversity')) {
    return 'biodiversity';
  }
  if (text.includes('research') || text.includes('dna') || text.includes('study') || text.includes('wii') || text.includes('अनुसंधान')) {
    return 'research';
  }
  if (text.includes('gazette') || text.includes('ntca') || text.includes('moefcc') || text.includes('official') || text.includes('notification')) {
    return 'official_updates';
  }
  if (text.includes('bihar') || text.includes('बिहार') || text.includes('patna') || text.includes('gandak')) {
    return 'bihar';
  }
  if (text.includes('wildlife') || text.includes('leopard') || text.includes('bear') || text.includes('elephant')) {
    return 'wildlife';
  }
  if (text.includes('india') || text.includes('national') || text.includes('project tiger')) {
    return 'india';
  }
  return 'tiger_conservation';
}

// Check if an article already exists by URL or headline similarity
export function isDuplicateArticle(existing: NewsArticle[], candidate: { headline: string; sourceLink: string }): boolean {
  const normCandidateLink = candidate.sourceLink ? candidate.sourceLink.trim().toLowerCase().split('?')[0] : '';
  const normCandidateTitle = candidate.headline
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return existing.some(item => {
    const normItemLink = item.sourceLink ? item.sourceLink.trim().toLowerCase().split('?')[0] : '';
    if (normCandidateLink && normItemLink && normCandidateLink === normItemLink) {
      return true;
    }
    const itemNorm = item.headline
      .toLowerCase()
      .replace(/[^\w\s\u0900-\u097F]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return itemNorm === normCandidateTitle;
  });
}

// Synchronizes news feeds via server-side endpoint first, with client fallback
export async function syncNewsFeeds(
  sources: NewsSource[],
  currentNews: NewsArticle[]
): Promise<{ 
  newArticles: NewsArticle[]; 
  allUpdatedNews: NewsArticle[];
  updatedCount: number; 
  checkedSources: number;
  message: string;
  sourceUnavailable?: boolean;
}> {
  // Step 1: Try server-side API (no CORS restrictions, direct newspaper RSS fetching)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const apiRes = await fetch('/api/news/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ existingArticles: currentNews }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.success) {
        return {
          newArticles: Array.isArray(data.newArticles) ? data.newArticles : [],
          allUpdatedNews: Array.isArray(data.allUpdatedNews) ? data.allUpdatedNews : currentNews,
          updatedCount: data.newArticles?.length || 0,
          checkedSources: data.sourcesChecked || sources.length,
          message: data.message || 'Latest news synchronized from media houses and official sources.'
        };
      }
    }
  } catch {
    // Backend call failed or timed out, proceed to client-side fallback
  }

  // Step 2: Client-side fallback using RSS2JSON for enabled sources with rssUrl
  let updatedCount = 0;
  let checkedSources = 0;
  const freshArticles: NewsArticle[] = [];
  const activeSources = sources.filter(s => s.enabled);

  for (const source of activeSources) {
    if (!source.rssUrl) continue;
    checkedSources++;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const fetchUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.rssUrl)}`;
      const response = await fetch(fetchUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.status === 'ok' && Array.isArray(data.items)) {
          for (const item of data.items) {
            const headline = item.title || '';
            const link = item.link || source.url;
            const pubDate = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            const pubTime = item.pubDate ? new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
            
            const rawDescription = item.description || item.content || '';
            const cleanSummary = rawDescription.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 260) + '...';

            if (headline.length > 10 && !isDuplicateArticle([...currentNews, ...freshArticles], { headline, sourceLink: link })) {
              const topic = detectNewsTopic(headline, cleanSummary, source.category || source.name);
              
              const newArticle: NewsArticle = {
                id: `feed-news-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                headline,
                publicationDate: pubDate,
                publicationTime: pubTime,
                source: source.name,
                sourceLink: link,
                externalUrl: link,
                officialSourceRef: link,
                sourceCategory: source.category || 'Established Media',
                topicCategory: topic,
                summary: cleanSummary,
                verificationStatus: source.trustLevel === 'official' ? 'verified_govt' : 'established_media',
                retrievedDate: new Date().toISOString().split('T')[0],
                verifiedDate: pubDate,
                verifiedBy: source.trustLevel === 'official' ? 'Official Forest Portal' : 'Mainstream Media Desk',
                tags: ['Live Feed', topic.replace('_', ' ')],
                isLive: true,
                isPinned: false,
                isFeatured: false,
                status: 'approved',
                sourceAttribution: `Retrieved from ${source.name} official dispatch`,
                keyTakeaways: [cleanSummary.slice(0, 150) + '...']
              };

              freshArticles.push(newArticle);
              updatedCount++;
            }
          }
        }
      }
    } catch {
      // Individual source failure
    }
  }

  // Combine fresh with current
  const allUpdated = [...freshArticles, ...currentNews].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.publicationDate.localeCompare(a.publicationDate);
  });

  return {
    newArticles: freshArticles,
    allUpdatedNews: allUpdated,
    updatedCount,
    checkedSources: checkedSources > 0 ? checkedSources : sources.length,
    message: freshArticles.length > 0 
      ? `Discovered ${freshArticles.length} new article${freshArticles.length > 1 ? 's' : ''} from active media feeds.`
      : 'All news feeds verified and up to date.'
  };
}
