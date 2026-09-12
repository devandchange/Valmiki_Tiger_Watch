/**
 * Valmiki Tiger Watch - Engagement Storage Helper
 * Persists user votes (likes/dislikes) per content item locally on device.
 * Prevents double voting, enables toggling, and provides aggregate count tracking.
 */

const VOTES_KEY = 'vtw_user_engagement_votes';

export type UserVoteType = 'like' | 'dislike' | null;

interface StoredVotes {
  [contentId: string]: 'like' | 'dislike';
}

function getStoredVotes(): StoredVotes {
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveStoredVotes(votes: StoredVotes): void {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch (e) {
    console.warn('Failed to save engagement vote to storage:', e);
  }
}

export function getUserVote(contentId: string): UserVoteType {
  const votes = getStoredVotes();
  return votes[contentId] || null;
}

export interface VoteResult {
  previousVote: UserVoteType;
  newVote: UserVoteType;
  likeDelta: number;
  dislikeDelta: number;
}

export function recordUserVote(contentId: string, action: 'like' | 'dislike'): VoteResult {
  const votes = getStoredVotes();
  const current = votes[contentId] || null;

  let likeDelta = 0;
  let dislikeDelta = 0;
  let newVote: UserVoteType = null;

  if (current === action) {
    // Toggling off the vote
    delete votes[contentId];
    newVote = null;
    if (action === 'like') likeDelta = -1;
    if (action === 'dislike') dislikeDelta = -1;
  } else {
    // Switching or setting new vote
    if (current === 'like') likeDelta = -1;
    if (current === 'dislike') dislikeDelta = -1;

    if (action === 'like') likeDelta += 1;
    if (action === 'dislike') dislikeDelta += 1;

    votes[contentId] = action;
    newVote = action;
  }

  saveStoredVotes(votes);

  return {
    previousVote: current,
    newVote,
    likeDelta,
    dislikeDelta
  };
}
