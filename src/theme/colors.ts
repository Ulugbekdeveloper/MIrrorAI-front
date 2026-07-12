export const colors = {
  bg: '#0B0B0F',
  surface: '#15151C',
  surfaceElevated: '#1E1E27',
  border: '#2A2A36',

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
