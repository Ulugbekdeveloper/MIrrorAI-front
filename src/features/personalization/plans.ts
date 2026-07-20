export type PlanKey = 'yearly' | 'monthly';

export type PlanOption = {
  key: PlanKey;
  label: string;
  period: string;
  pricePerMonth: string;
  badge?: string;
};

export const PLAN_OPTIONS: PlanOption[] = [
  {
    key: 'yearly',
    label: 'Yearly',
    period: '12 months · $24.45 billed annually',
    pricePerMonth: '$2.04',
    badge: 'Best value',
  },
  {
    key: 'monthly',
    label: 'Monthly',
    period: 'Billed every month',
    pricePerMonth: '$2.23',
  },
];

export type PlanTestimonial = {
  quote: string;
  author: string;
  rating: number;
};

export const PLAN_TESTIMONIALS: PlanTestimonial[] = [
  {
    quote: 'I compared a few similar apps before choosing one — this is the one that stuck.',
    author: 'stylefan22',
    rating: 5,
  },
  {
    quote: "Perfect for indecisive dressers like me. Genuinely changed my morning routine.",
    author: 'aquapanda',
    rating: 5,
  },
  {
    quote: 'Makes getting dressed so much easier. Wish I had found this sooner.',
    author: 'lady9ice',
    rating: 5,
  },
];
