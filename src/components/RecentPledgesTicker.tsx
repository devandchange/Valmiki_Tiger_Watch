import React, { useState } from 'react';
import { Award, ShieldCheck, ChevronRight, X, Heart, Eye } from 'lucide-react';
import { PledgeTickerEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RecentPledgesTickerProps {
  entries: PledgeTickerEntry[];
  enabled?: boolean;
}

export const RecentPledgesTicker: React.FC<RecentPledgesTickerProps> = ({ entries, enabled = true }) => {
  const { language, t } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (!enabled || isDismissed) {
    return null;
  }

  // Filter only active entries with consent
  const activeEntries = entries.filter((e) => e.status === 'active' && e.consentPublicTicker);

  if (activeEntries.length === 0) {
    return null;
  }

  // Repeat entries if list is short to ensure smooth continuous marquee loop
  const displayItems = [...activeEntries, ...activeEntries, ...activeEntries];

  return (
    <div
      id="recent-pledges-ticker-container"
      className="relative z-10 w-full overflow-hidden rounded-2xl bg-[#07271D] text-white border border-amber-500/40 shadow-md my-4"
      role="region"
      aria-label="Recent Tiger Pledges Ticker"
    >
      <div className="flex items-stretch">
        {/* TV-style Fixed Lead Tag */}
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-[#F27D26] text-stone-950 px-3.5 sm:px-4 py-2 flex items-center space-x-1.5 font-mono font-bold text-xs uppercase tracking-wider shadow-sm z-20">
          <Award className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'hi' ? 'हालिया प्रतिज्ञाएं' : language === 'ur' ? 'حالیہ عہد' : 'Recent Pledges'}
          </span>
          <span className="sm:hidden">
            {language === 'hi' ? 'प्रतिज्ञाएं' : 'Pledges'}
          </span>
        </div>

        {/* Marquee Ribbon Container */}
        <div
          className="flex-1 overflow-hidden relative py-2 flex items-center cursor-pointer select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          title="Recent verified pledges • Click/hover to pause"
        >
          <div
            className={`flex items-center space-x-8 whitespace-nowrap transition-transform duration-300 ${
              isPaused ? '' : 'animate-marquee'
            }`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              display: 'inline-flex'
            }}
          >
            {displayItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-100/90"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="font-bold text-white">{item.displayName}</span>
                <span className="text-amber-300/80">({item.cityAndState})</span>
                <span className="text-emerald-400/50">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="flex-shrink-0 flex items-center pr-2 bg-[#07271D] z-20">
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss Ticker"
            title="Dismiss Ticker"
            className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
