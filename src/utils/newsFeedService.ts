import { NewsArticle, NewsSource, NewsTopicCategory } from '../types';

// Storage keys
export const STORAGE_NEWS_KEY = 'vtw_news_articles_v2';
export const STORAGE_SOURCES_KEY = 'vtw_news_sources_v2';
export const STORAGE_LAST_UPDATE_KEY = 'vtw_news_last_updated_v2';
export const STORAGE_AUTO_SYNC_KEY = 'vtw_news_auto_sync_enabled_v2';

// Keywords to auto-classify topic categories
export function detectNewsTopic(headline: string, summary: string, sourceCategory: string): NewsTopicCategory {
  const text = `${headline} ${summary} ${sourceCategory}`.toLowerCase();
  
  if (text.includes('valmiki') || text.includes('vtr') || text.includes('champaran') || text.includes('bagaha')) {
    return 'vtr';
  }
  if (text.includes('conflict') || text.includes('stray') || text.includes('attack') || text.includes('compensation') || text.includes('corridor fringe')) {
    return 'human_wildlife_conflict';
  }
  if (text.includes('census') || text.includes('population') || text.includes('camera trap') || text.includes('cub') || text.includes('density') || text.includes('count')) {
    return 'tiger_conservation';
  }
  if (text.includes('gharial') || text.includes('dolphin') || text.includes('rhino') || text.includes('bird') || text.includes('biodiversity') || text.includes('fauna')) {
    return 'biodiversity';
  }
  if (text.includes('research') || text.includes('dna') || text.includes('study') || text.includes('wii') || text.includes('genetic') || text.includes('scientific')) {
    return 'research';
  }
  if (text.includes('gazette') || text.includes('ntca') || text.includes('moefcc') || text.includes('official') || text.includes('notification') || text.includes('patrol')) {
    return 'official_updates';
  }
  if (text.includes('bihar') || text.includes('patna') || text.includes('gandak')) {
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
  const normHeadline = candidate.headline.trim().toLowerCase().replace(/[^\w\s]/gi, '');
  return existing.some(item => {
    if (item.sourceLink && candidate.sourceLink && item.sourceLink === candidate.sourceLink) {
      return true;
    }
    const itemNorm = item.headline.trim().toLowerCase().replace(/[^\w\s]/gi, '');
    return itemNorm === normHeadline;
  });
}

// Live feed synchronizer
// Tries to fetch latest news from reputable RSS feeds via CORS-friendly RSS2JSON API
export async function syncNewsFeeds(
  sources: NewsSource[],
  currentNews: NewsArticle[]
): Promise<{ newArticles: NewsArticle[]; updatedCount: number; checkedSources: number }> {
  let updatedCount = 0;
  let checkedSources = 0;
  const freshArticles: NewsArticle[] = [];

  const activeSources = sources.filter(s => s.enabled);

  // We check active sources that have rssUrl or valid URL
  for (const source of activeSources) {
    checkedSources++;
    if (!source.rssUrl) continue;

    try {
      // Use standard RSS to JSON converter with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
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
            
            // Clean description HTML
            const rawDescription = item.description || item.content || '';
            const cleanSummary = rawDescription.replace(/<[^>]*>?/gm, '').trim().slice(0, 300) + '...';

            if (headline.length > 10 && !isDuplicateArticle([...currentNews, ...freshArticles], { headline, sourceLink: link })) {
              const topic = detectNewsTopic(headline, cleanSummary, source.category || source.name);
              
              const newArticle: NewsArticle = {
                id: `feed-news-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                headline,
                publicationDate: pubDate,
                publicationTime: pubTime,
                source: source.name,
                sourceLink: link,
                sourceCategory: source.category || 'Established Media',
                topicCategory: topic,
                summary: cleanSummary,
                verificationStatus: source.trustLevel === 'official' ? 'verified_govt' : 'field_verified',
                retrievedDate: new Date().toISOString().split('T')[0],
                tags: ['Live Feed', topic.replace('_', ' ')],
                isLive: true,
                isPinned: false,
                isFeatured: false,
                status: 'approved',
                sourceAttribution: `Retrieved from ${source.name} official portal`,
                imageUrl: item.thumbnail || item.enclosure?.link || undefined
              };

              freshArticles.push(newArticle);
              updatedCount++;
            }
          }
        }
      }
    } catch {
      // Graceful fallback - network or CORS timeout
    }
  }

  return {
    newArticles: freshArticles,
    updatedCount,
    checkedSources
  };
}
