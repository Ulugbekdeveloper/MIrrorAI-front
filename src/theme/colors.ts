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

const WHITE = '#FFFFFF';
const BLACK = '#000000';
const DANGER = '#FF5A5F';

/**
 * Every translucent white/black/silver/danger overlay used anywhere in
 * the app, as one flat, deliberately short ladder. If a new screen needs
 * "a faint white line" or "a dark glass fill," reach for one of these
 * before typing a new `rgba(...)` — that's the whole point: one place to
 * retune the app's entire "glass" feel instead of hunting through files.
 */
export const overlay = {
  // Neutral white, low → high opacity. The generic go-to for borders,
  // fills, and dividers sitting on top of a dark surface.
  whiteFaint: withAlpha(WHITE, 0.03),
  whiteSubtle: withAlpha(WHITE, 0.06),
  whiteSoft: withAlpha(WHITE, 0.08),
  whiteMedium: withAlpha(WHITE, 0.12),
  whiteStrong: withAlpha(WHITE, 0.2),
  whiteBorder: withAlpha(WHITE, 0.4),
  whiteBright: withAlpha(WHITE, 0.85),
  /** Off-white body text sitting on a photo — e.g. onboarding captions. */
  whiteBody: withAlpha(WHITE, 0.8),

  // Neutral black — scrims and drop shadows.
  blackFaint: withAlpha(BLACK, 0.35),
  blackMedium: withAlpha(BLACK, 0.55),
  blackStrong: withAlpha(BLACK, 0.75),

  // Silver-tinted glass — the translucent field fill on login/register.
  glassTop: withAlpha(silver[200], 0.06),
  glassBottom: withAlpha(silver[200], 0.015),
  glassFocusTop: withAlpha(silver[200], 0.12),
  glassFocusBottom: withAlpha(silver[200], 0.03),

  silverBorder: withAlpha(silver[200], 0.08),
  silverBorderFocus: withAlpha(silver[200], 0.42),
  silverSheen: withAlpha(silver[200], 0.14),
  silverPlaceholder: withAlpha(silver[200], 0.38),

  /** Dark inset "well" — icon avatars recessed into a glass field. */
  wellInset: withAlpha(silver[950], 0.5),

  dangerBorder: withAlpha(DANGER, 0.75),
  dangerOutline: withAlpha(DANGER, 0.4),
  dangerTint: withAlpha(DANGER, 0.15),
} as const;

/** Silver-tinted overlays reused across surfaces for a consistent finish. */
export const finish = {
  sheen: overlay.silverSheen,
  border: overlay.silverBorder,
  borderFocus: overlay.silverBorderFocus,
  halo: '#A8B0C0', // cool silver-blue — used for iOS shadow tints
} as const;

export const colors = {
  bg: silver[950],
  surface: silver[800],
  surfaceElevated: silver[700],
  /** Near-black cards/sheets/wells that sit deliberately darker than `surface` — modal sheets, canvas placeholders. */
  surfaceSunken: silver[950],
  /** Glass pill buttons (social sign-in, back button). */
  chip: silver[800],
  chipPressed: silver[900],
  border: finish.border,

  white: WHITE,
  black: BLACK,

  text: '#F5F5F7',
  textMuted: '#9A9AA8',
  textDim: '#6B6B78',
  /** Dark text sitting on a white/silver surface — CTA button labels. */
  textOnLight: '#0A0A0F',

  primary: '#7C5CFF',
  primaryPressed: '#6849E8',
  primaryText: '#FFFFFF',

  accent: '#00E0B8',
  danger: DANGER,
  dangerPressed: '#E14A4F',
  warning: '#FFB13B',
  success: '#3ECF8E',

  overlay: overlay.blackMedium,
} as const;

export type ColorToken = keyof typeof colors;
