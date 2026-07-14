import type { PERSONALIZATION_STEPS } from './constants';

export type PersonalizationStep = (typeof PERSONALIZATION_STEPS)[number];

export type GenderKey = 'woman' | 'man' | 'prefer-not-to-say';

export type StyleGoalKey =
  | 'discover-style'
  | 'save-time'
  | 'try-before-buy'
  | 'outfit-inspiration'
  | 'shop-smarter'
  | 'just-exploring';

export type DiscoverySourceKey =
  | 'google-play'
  | 'online-search'
  | 'friends-family'
  | 'instagram'
  | 'tiktok'
  | 'other';

export type ShoppingFrequencyKey = 'weekly' | 'monthly' | 'seasonally' | 'rarely';

export type SelectableOption<TKey extends string> = {
  key: TKey;
  label: string;
  emoji?: string;
};
