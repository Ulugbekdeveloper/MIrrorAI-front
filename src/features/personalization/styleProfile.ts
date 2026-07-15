import type { StyleTypeKey } from './styleTypes';

export type StyleProfileAxis = {
  label: string;
  /** Normalized 0–1 score along this axis. */
  value: number;
};

// Fixed by design — each label sits 45° apart around the radar, starting at
// the top and going clockwise (Romantic top, Edgy bottom, Streetwear left).
const AXIS_LABELS = [
  'Romantic',
  'Minimal',
  'Classic',
  'Eclectic',
  'Streetwear',
  'Sporty',
   'Edgy',
  'Bohemian',
] as const;

type AxisLabel = (typeof AXIS_LABELS)[number];

// Maps the "Pick the style you love" answer to the radar axis it should
// spike. A few style-type options share the closest matching axis (e.g.
// old-money/preppy both read as "Classic") since the radar only has 8 fixed
// slots but the picker offers 12 more specific aesthetics.
const STYLE_TYPE_TO_AXIS: Record<StyleTypeKey, AxisLabel> = {
  classic: 'Classic',
  'old-money': 'Classic',
  preppy: 'Classic',
  minimal: 'Minimal',
  street: 'Streetwear',
  edgy: 'Edgy',
  alternative: 'Edgy',
  romantic: 'Romantic',
  corquette: 'Romantic',
  glam: 'Romantic',
  sport: 'Sporty',
  eclectic: 'Eclectic',
};

const MIN_SCORE = 0.28;
const MAX_SCORE = 0.94;
// Indexed by circular distance (0–4) from the spike axis on the 8-point
// octagon — closer axes read moderately high, the opposite side stays low.
const DISTANCE_FALLOFF = [1, 0.4, 0.18, 0.08, 0.05];

function circularDistance(a: number, b: number, total: number) {
  const diff = Math.abs(a - b);
  return Math.min(diff, total - diff);
}

/** Builds the 8-axis radar shape, spiking toward whichever style the user picked. */
export function buildStyleProfile(selectedStyleType: StyleTypeKey | null): StyleProfileAxis[] {
  const spikeLabel = selectedStyleType ? STYLE_TYPE_TO_AXIS[selectedStyleType] : 'Streetwear';
  const spikeIndex = AXIS_LABELS.indexOf(spikeLabel);

  return AXIS_LABELS.map((label, index) => {
    const distance = circularDistance(index, spikeIndex, AXIS_LABELS.length);
    const falloff = DISTANCE_FALLOFF[distance] ?? DISTANCE_FALLOFF[DISTANCE_FALLOFF.length - 1];
    return { label, value: MIN_SCORE + (MAX_SCORE - MIN_SCORE) * falloff };
  });
}
