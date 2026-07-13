/**
 * Silver tonal scale — the app's core visual system.
 * Every gradient (bg, fields, CTA) picks from this ladder, so shifting a
 * stop here shifts the whole page in lockstep.
 *
 * Each step is cool-leaning (R < G < B) so surfaces never read as cream
 * against the dark background — they stay in the "brushed steel" family.
 */
export const silver = {
  50: '#F5F7FA', // near-white, cool
  100: '#E7EBF0',
  200: '#CDD3DB',
  300: '#A7AEB8',
  400: '#787F89',
  500: '#4E5460',
  600: '#3A3F49',
  700: '#2A2E37',
  800: '#1D2028',
  900: '#12141A',
  950: '#08090C', // deepest edge
} as const;

/** Silver-tinted overlays reused across surfaces for a consistent finish. */
export const finish = {
  sheen: 'rgba(207, 213, 219, 0.14)', // silver-200 @ 14% — top edge highlight
  border: 'rgba(207, 213, 219, 0.08)', // silver-200 @ 8% — hairline edge
  borderFocus: 'rgba(207, 213, 219, 0.42)', // active/focused edge
  halo: '#A8B0C0', // cool silver-blue — used for iOS shadow tints
} as const;

export const colors = {
  bg: silver[950],
  surface: silver[800],
  surfaceElevated: silver[700],
  border: finish.border,

  text: '#F5F5F7',
  textMuted: '#9A9AA8',
  textDim: '#6B6B78',

  primary: '#7C5CFF',
  primaryPressed: '#6849E8',
  primaryText: '#FFFFFF',

  accent: '#00E0B8',
  danger: '#FF5A5F',
  warning: '#FFB13B',
  success: '#3ECF8E',

  overlay: 'rgba(0, 0, 0, 0.55)',
} as const;

export type ColorToken = keyof typeof colors;
