import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { getUserVote, recordUserVote, UserVoteType } from '../utils/engagementStorage';
import { shareContent, openWhatsAppShare } from '../utils/shareUtils';
import { useLanguage } from '../context/LanguageContext';

interface EngagementBarProps {
  contentId: string;
  contentType: 'news' | 'research' | 'protector';
  title: string;
  summary?: string;
  initialLikes?: number;
  initialDislikes?: number;
  onVoteChange?: (likes: number, dislikes: number) => void;
  className?: string;
}

export const EngagementBar: React.FC<EngagementBarProps> = ({
  contentId,
  contentType,
  title,
  summary = '',
  initialLikes = 0,
  initialDislikes = 0,
  onVoteChange,
  className = ''
}) => {
  const { language } = useLanguage();
  const [userVote, setUserVote] = useState<UserVoteType>(() => getUserVote(contentId));
  const [likes, setLikes] = useState<number>(initialLikes);
  const [dislikes, setDislikes] = useState<number>(initialDislikes);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleVote = (action: 'like' | 'dislike') => {
    const result = recordUserVote(contentId, action);
    setUserVote(result.newVote);

    const newLikes = Math.max(0, likes + result.likeDelta);
    const newDislikes = Math.max(0, dislikes + result.dislikeDelta);

    setLikes(newLikes);
    setDislikes(newDislikes);

    if (onVoteChange) {
      onVoteChange(newLikes, newDislikes);
    }
  };

  const handleNativeShare = async () => {
    setIsSharing(true);
    const result = await shareContent({
      title,
      text: summary || title,
      dialogTitle: `Share ${title}`
    });
    setIsSharing(false);

    if (result.method === 'copied') {
      triggerCopiedToast();
    }
  };

  const handleWhatsApp = () => {
    openWhatsAppShare(title, undefined, summary);
  };

  const triggerCopiedToast = () => {
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${title} - ${shareUrl}`);
        triggerCopiedToast();
      }
    } catch (e) {
      console.warn('Copy link error:', e);
    }
  };

  return (
    <div className={`relative flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200/80 text-xs font-mono ${className}`}>
      {/* Vote Controls */}
      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
        {/* Like Button */}
        <button
          onClick={() => handleVote('like')}
          aria-label="Like this story"
          title={userVote === 'like' ? 'Remove Like' : 'Like'}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 ${
            userVote === 'like'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'like' ? 'fill-white' : 'text-stone-500'}`} />
          <span className="font-bold">{likes}</span>
        </button>

        {/* Dislike Button */}
        <button
          onClick={() => handleVote('dislike')}
          aria-label="Dislike this story"
          title={userVote === 'dislike' ? 'Remove Dislike' : 'Dislike'}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 ${
            userVote === 'dislike'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
          }`}
        >
          <ThumbsDown className={`w-3.5 h-3.5 ${userVote === 'dislike' ? 'fill-white' : 'text-stone-500'}`} />
          <span className="font-bold">{dislikes}</span>
        </button>
      </div>

      {/* Share Controls */}
      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
        {/* Native / Main Share */}
        <button
          onClick={handleNativeShare}
          disabled={isSharing}
          title="Share via native share sheet"
          aria-label="Share"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-stone-600" />
          <span className="font-semibold text-[11px]">
            {language === 'hi' ? 'साझा करें' : language === 'ur' ? 'شیئر کریں' : 'Share'}
          </span>
        </button>

        {/* WhatsApp Quick Share */}
        <button
          onClick={handleWhatsApp}
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
          className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          title="Copy Link"
          aria-label="Copy link"
          className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition-colors"
        >
          {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Toast popup when copied */}
      {copiedToast && (
        <div className="absolute -top-9 right-0 bg-stone-900 text-white text-[11px] font-sans px-2.5 py-1 rounded-md shadow-md animate-fade-in flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>{language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!'}</span>
        </div>
      )}
    </div>
  );
};
