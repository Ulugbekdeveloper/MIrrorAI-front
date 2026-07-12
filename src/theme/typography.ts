import type { TextStyle } from 'react-native';

export const typography = {
  displayLg: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  displaySm: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  titleLg: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  titleSm: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  button: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
} satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
