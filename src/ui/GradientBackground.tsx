import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors, silver } from '@/theme';

/**
 * Page background — three layered gradients:
 *   1. A radial base establishing the overall silver lighting (subtle).
 *   2. A thin linear highlight band right at the top edge — reads as
 *      light catching the top of the screen.
 *   3. A linear band anchored at the bottom that deepens to solid black,
 *      so the lower portion of the screen reads darker than the base.
 *
 * Fields and the CTA button pull their gradient stops from the same
 * `silver` ladder in theme/colors.ts, so the lighting reads as one
 * consistent surface rather than independently-tuned pieces.
 */
export function GradientBackground() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <RadialGradient
          id="mirrorBg"
          cx="0.82"
          cy="0.05"
          r="1.35"
          gradientUnits="objectBoundingBox"
        >
          <Stop offset="0" stopColor={silver[800]} />
          <Stop offset="0.22" stopColor={silver[900]} />
          <Stop offset="0.5" stopColor={silver[950]} />
          <Stop offset="1" stopColor={silver[950]} />
        </RadialGradient>

        <LinearGradient
          id="mirrorTopBand"
          x1="0" y1="0"
          x2="0" y2="1"
          gradientUnits="objectBoundingBox"
        >
          <Stop offset="0" stopColor={silver[500]} stopOpacity="0.35" />
          <Stop offset="0.08" stopColor={silver[600]} stopOpacity="0.14" />
          <Stop offset="0.16" stopColor={silver[700]} stopOpacity="0" />
        </LinearGradient>

        <LinearGradient
          id="mirrorBottomBand"
          x1="0" y1="0"
          x2="0" y2="1"
          gradientUnits="objectBoundingBox"
        >
          <Stop offset="0" stopColor={colors.black} stopOpacity="0" />
          <Stop offset="0.55" stopColor={colors.black} stopOpacity="0" />
          <Stop offset="0.8" stopColor={colors.black} stopOpacity="0.55" />
          <Stop offset="1" stopColor={colors.black} stopOpacity="0.85" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#mirrorBg)" />
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#mirrorTopBand)" />
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#mirrorBottomBand)" />
    </Svg>
  );
}
