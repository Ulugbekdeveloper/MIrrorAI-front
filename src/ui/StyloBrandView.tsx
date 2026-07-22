import { BodoniModa_700Bold_Italic, useFonts } from '@expo-google-fonts/bodoni-moda';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

// Wordmark sizing — scales with screen width, but also clamped so the whole
// word always fits the viewport on any device, and never gets tiny/huge.
const WORDMARK_WIDTH_RATIO = 0.24;
const MIN_WORDMARK_SIZE = 60;
const MAX_WORDMARK_SIZE = 150;
const HORIZONTAL_PADDING = 48;

type Props = {
  style?: StyleProp<ViewStyle>;
};

/**
 * The pitch-black Stylo brand screen with the static Bodoni-italic wordmark.
 * Purely presentational — no animation, preloading, timers, or navigation
 * logic. Fills its parent; overlay it or render it full-screen.
 */
export function StyloBrandView({ style }: Props) {
  const [fontLoaded] = useFonts({ BodoniModa_700Bold_Italic });
  const { width: screenWidth } = useWindowDimensions();
  const wordmarkSize = Math.min(
    MAX_WORDMARK_SIZE,
    Math.max(MIN_WORDMARK_SIZE, screenWidth * WORDMARK_WIDTH_RATIO),
  );

  return (
    <View style={[styles.container, style]}>
      <StatusBar style="light" backgroundColor={colors.black} />
      {fontLoaded ? (
        <Text
          style={[styles.wordmark, { fontSize: wordmarkSize }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Stylo
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: HORIZONTAL_PADDING / 2,
    backgroundColor: colors.black,
  },
  wordmark: {
    // No fontWeight/fontStyle here on purpose — mixing those with a custom
    // `fontFamily` makes iOS silently fall back to the system font. Both the
    // "Bold" and the "Italic" come from the BodoniModa_700Bold_Italic file.
    fontFamily: 'BodoniModa_700Bold_Italic',
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
