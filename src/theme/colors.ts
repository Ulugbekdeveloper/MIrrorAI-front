/**
 * Converts a `#RRGGBB` hex color + 0–1 opacity into an `rgba()` string.
 * Use this instead of hand-typing a new rgba literal in a component —
 * every translucent value in the app should trace back to a named color
 * here, not a one-off string invented at the call site.
 */
function withAlpha(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Silver tonal scale — a neutral cool-gray ladder shared across gradients
 * and surfaces. 50 = near-white, 950 = near-black.
 */
export const silver = {
  50: '#F5F7FA',
  100: '#E7EBF0',
  200: '#CDD3DB',
  300: '#A7AEB8',
  400: '#787F89',
  500: '#4E5460',
  600: '#3A3F49',
  700: '#2A2E37',
  800: '#1D2028',
  900: '#12141A',
  950: '#08090C',
} as const;

const WHITE = '#FFFFFF';
const BLACK = '#000000';
const DANGER = '#E5484D';
const SUCCESS = '#2E9E63';
const PRIMARY = '#7C5CFF';

/**
 * Every translucent overlay used across the app, as one short ladder.
 *
 * The app is a LIGHT theme, so the generic `white*` surface tokens (borders,
 * fills, dividers) are actually translucent BLACK — that's what shows up on a
 * white background. The two exceptions (`whiteBright`, `whiteBody`) are kept
 * genuinely white because they sit on photos / dark glass accents.
 */
export const overlay = {
  // Neutral surface borders / fills / dividers on the light background.
  whiteFaint: withAlpha(BLACK, 0.03),
  whiteSubtle: withAlpha(BLACK, 0.05),
  whiteSoft: withAlpha(BLACK, 0.08),
  whiteMedium: withAlpha(BLACK, 0.12),
  whiteStrong: withAlpha(BLACK, 0.2),
  whiteBorder: withAlpha(BLACK, 0.28),
  /** Genuinely white — highlights/glows on photos and dark glass accents. */
  whiteBright: withAlpha(WHITE, 0.9),
  /** Off-white body text sitting on a photo / dark glass — onboarding captions. */
  whiteBody: withAlpha(WHITE, 0.85),

  // Neutral black — scrims and drop shadows.
  blackFaint: withAlpha(BLACK, 0.25),
  blackMedium: withAlpha(BLACK, 0.45),
  blackStrong: withAlpha(BLACK, 0.65),

  // Field glass — subtle gray fills on the light surface.
  glassTop: withAlpha(BLACK, 0.04),
  glassBottom: withAlpha(BLACK, 0.015),
  glassFocusTop: withAlpha(BLACK, 0.07),
  glassFocusBottom: withAlpha(BLACK, 0.03),

  silverBorder: withAlpha(BLACK, 0.1),
  silverBorderFocus: withAlpha(BLACK, 0.35),
  silverSheen: withAlpha(WHITE, 0.6),
  silverPlaceholder: withAlpha(BLACK, 0.38),

  /** Recessed "well" — icon avatars inset into a field. */
  wellInset: withAlpha(BLACK, 0.05),

  dangerBorder: withAlpha(DANGER, 0.6),
  dangerOutline: withAlpha(DANGER, 0.4),
  dangerTint: withAlpha(DANGER, 0.1),

  successOutline: withAlpha(SUCCESS, 0.4),
  successTint: withAlpha(SUCCESS, 0.12),

  primaryOutline: withAlpha(PRIMARY, 0.5),
  primaryTint: withAlpha(PRIMARY, 0.1),
} as const;

/** Overlays reused across surfaces for a consistent finish. */
export const finish = {
  sheen: overlay.silverSheen,
  border: overlay.silverBorder,
  borderFocus: overlay.silverBorderFocus,
  halo: '#C7CCD6',
} as const;

export const colors = {
  bg: WHITE,
  surface: '#F4F5F7',
  surfaceElevated: WHITE,
  /** Slightly sunken cards/sheets/wells that sit below `surface`. */
  surfaceSunken: silver[100],
  /** Subtle pill buttons (social sign-in, back button). */
  chip: silver[100],
  chipPressed: silver[200],
  border: finish.border,

  white: WHITE,
  black: BLACK,

  text: '#0E0E12',
  textMuted: '#5C5C68',
  textDim: '#9A9AA8',
  /** Dark text sitting on a light/white surface (e.g. the phone-mockup screen). */
  textOnLight: '#0A0A0F',

  primary: PRIMARY,
  primaryPressed: '#6849E8',
  primaryText: '#FFFFFF',

  accent: '#00B39A',
  danger: DANGER,
  dangerPressed: '#C93B40',
  warning: '#E0921B',
  success: SUCCESS,

  overlay: overlay.blackMedium,
} as const;

export type ColorToken = keyof typeof colors;
