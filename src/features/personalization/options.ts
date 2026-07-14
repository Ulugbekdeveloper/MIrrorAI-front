import type {
  DiscoverySourceKey,
  GenderKey,
  SelectableOption,
  ShoppingFrequencyKey,
  StyleGoalKey,
} from './types';

export const GENDER_OPTIONS: SelectableOption<GenderKey>[] = [
  { key: 'woman', label: 'Woman', emoji: '👩' },
  { key: 'man', label: 'Man', emoji: '🧑' },
  { key: 'prefer-not-to-say', label: 'Prefer not to say', emoji: '🤷' },
];

export const STYLE_GOAL_OPTIONS: SelectableOption<StyleGoalKey>[] = [
  { key: 'discover-style', label: 'Discover my personal style', emoji: '🎨' },
  { key: 'save-time', label: 'Save time getting dressed', emoji: '⏱️' },
  { key: 'try-before-buy', label: 'Try before I buy', emoji: '🛍️' },
  { key: 'outfit-inspiration', label: 'Get outfit inspiration', emoji: '✨' },
  { key: 'shop-smarter', label: 'Shop smarter and save money', emoji: '💳' },
  { key: 'just-exploring', label: 'Just exploring', emoji: '👀' },
];

export const DISCOVERY_SOURCE_OPTIONS: SelectableOption<DiscoverySourceKey>[] = [
  { key: 'google-play', label: 'Google Play', emoji: '▶️' },
  { key: 'online-search', label: 'Online Search', emoji: '🔍' },
  { key: 'friends-family', label: 'Friends or Family', emoji: '👥' },
  { key: 'instagram', label: 'Instagram', emoji: '📸' },
  { key: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { key: 'other', label: 'Other', emoji: '🔮' },
];

export const SHOPPING_FREQUENCY_OPTIONS: SelectableOption<ShoppingFrequencyKey>[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'seasonally', label: 'Seasonally' },
  { key: 'rarely', label: 'Rarely' },
];
