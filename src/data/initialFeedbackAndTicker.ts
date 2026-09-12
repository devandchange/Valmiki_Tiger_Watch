/**
 * Initial data for Pledge Ticker and Feedback submissions
 */

import { PledgeTickerEntry, FeedbackSubmission } from '../types';

export const INITIAL_PLEDGE_TICKER: PledgeTickerEntry[] = [
  {
    id: 'ticker-1',
    displayName: 'Aarav K.',
    cityAndState: 'Patna, Bihar',
    pledgedAt: '2026-09-11T14:20:00Z',
    consentPublicTicker: true,
    status: 'active'
  },
  {
    id: 'ticker-2',
    displayName: 'Pooja S.',
    cityAndState: 'Bettiah, West Champaran',
    pledgedAt: '2026-09-11T16:05:00Z',
    consentPublicTicker: true,
    status: 'active'
  },
  {
    id: 'ticker-3',
    displayName: 'Vikramaditya',
    cityAndState: 'New Delhi',
    pledgedAt: '2026-09-11T18:45:00Z',
    consentPublicTicker: true,
    status: 'active'
  },
  {
    id: 'ticker-4',
    displayName: 'Dr. Sunita M.',
    cityAndState: 'Muzaffarpur, Bihar',
    pledgedAt: '2026-09-12T07:10:00Z',
    consentPublicTicker: true,
    status: 'active'
  },
  {
    id: 'ticker-5',
    displayName: 'Tariq A.',
    cityAndState: 'Lucknow, UP',
    pledgedAt: '2026-09-12T08:30:00Z',
    consentPublicTicker: true,
    status: 'active'
  },
  {
    id: 'ticker-6',
    displayName: 'Sneha Verma',
    cityAndState: 'Kolkata, WB',
    pledgedAt: '2026-09-12T09:15:00Z',
    consentPublicTicker: true,
    status: 'active'
  }
];

export const INITIAL_FEEDBACK: FeedbackSubmission[] = [
  {
    id: 'feedback-1',
    name: 'Rohit Ranjan',
    email: 'rohit.ranjan.wildlife@gmail.com',
    category: 'News/Content',
    message: 'Appreciate the detailed VTR Range maps and weather updates. Could you please also cover the upcoming migratory waterbird counts in the Gandak wetland basin?',
    status: 'reviewed',
    submittedAt: '2026-09-10T11:20:00Z',
    deviceInfo: 'Android 14 (Mobile Web)'
  },
  {
    id: 'feedback-2',
    name: 'Ananya Roy',
    email: 'ananya.roy@ecoedu.org',
    category: 'Suggestion',
    message: 'The Tiger Pledge Certificate is wonderful for our school eco-club students! We downloaded 40 certificates for our students in Motihari.',
    status: 'resolved',
    submittedAt: '2026-09-11T15:40:00Z',
    deviceInfo: 'Chrome on Desktop'
  }
];
