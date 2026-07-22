import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';
import { Button } from '@/ui';

import { DarkGradientButton } from '../DarkGradientButton';
import { StepHeading } from '../StepHeading';

type Props = {
  onTakeSelfie: () => void;
  onChooseFromLibrary: () => void;
};

const BENEFITS: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: 'sparkles', text: 'Looks tuned to your hair, skin tone & shape' },
  { icon: 'shirt', text: 'Preview any outfit on the real you' },
  // { icon: 'lock-closed', text: 'Your photo stays private on your device' },
];

export function SelfieStep({ onTakeSelfie, onChooseFromLibrary }: Props) {
  return (
    <>
      <StepHeading
        title="See outfits on the real you"
        subtitle="Add one selfie and our AI styles every recommendation to your features."
      />

      <FaceScanVisual />

      <View style={styles.benefits}>
        {BENEFITS.map((benefit) => (
          <View key={benefit.text} style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Ionicons name={benefit.icon} size={16} color={colors.text} />
            </View>
            <Text style={styles.benefitText}>{benefit.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Take a selfie" variant="cta" onPress={onTakeSelfie} />
        <DarkGradientButton label="Choose from library" onPress={onChooseFromLibrary} />
      </View>
    </>
  );
}

const SCAN_SIZE = 172;
const SCAN_TRAVEL = SCAN_SIZE - 40;

/** An AI face-scan viewfinder: corner brackets, a face-recognition glyph, and
 * a scan line sweeping continuously — sells the "AI reads your face" idea
 * without needing a stock photo. */
function FaceScanVisual() {
  const scan = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pure translateY / opacity on separate views — native-driver safe.
    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scan, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ]),
    );
    sweep.start();
    glow.start();
    return () => {
      sweep.stop();
      glow.stop();
    };
  }, [scan, pulse]);

  const translateY = scan.interpolate({ inputRange: [0, 1], outputRange: [20, 20 + SCAN_TRAVEL] });
  const faceOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <View style={styles.scanWrap}>
      <View style={styles.scanFrame}>
        <Animated.View style={{ opacity: faceOpacity }}>
          <MaterialCommunityIcons name="face-recognition" size={92} color={colors.text} />
        </Animated.View>

        {/* Sweeping scan line */}
        <Animated.View
          pointerEvents="none"
          style={[styles.scanLine, { transform: [{ translateY }] }]}
        />

        {/* Corner brackets */}
        <View style={[styles.bracket, styles.bracketTL]} />
        <View style={[styles.bracket, styles.bracketTR]} />
        <View style={[styles.bracket, styles.bracketBL]} />
        <View style={[styles.bracket, styles.bracketBR]} />
      </View>

      <View style={styles.aiBadge}>
        <Ionicons name="sparkles" size={13} color={colors.textOnLight} />
        <Text style={styles.aiBadgeText}>AI</Text>
      </View>
    </View>
  );
}

const BRACKET = 26;
const BRACKET_THICKNESS = 2.5;

const styles = StyleSheet.create({
  scanWrap: { alignSelf: 'center', marginVertical: spacing.md },
  scanFrame: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: radius.xl,
    backgroundColor: overlay.whiteFaint,
    borderWidth: 1,
    borderColor: overlay.whiteSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  bracket: {
    position: 'absolute',
    width: BRACKET,
    height: BRACKET,
    borderColor: overlay.whiteBorder,
  },
  bracketTL: {
    top: 12,
    left: 12,
    borderTopWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
    borderTopLeftRadius: 8,
  },
  bracketTR: {
    top: 12,
    right: 12,
    borderTopWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
    borderTopRightRadius: 8,
  },
  bracketBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
    borderBottomLeftRadius: 8,
  },
  bracketBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
    borderBottomRightRadius: 8,
  },
  aiBadge: {
    position: 'absolute',
    top: -8,
    right: SCAN_SIZE / 2 - 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  aiBadgeText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textOnLight,
    letterSpacing: 0.5,
  },
  benefits: { gap: spacing.sm, marginBottom: spacing.lg },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  benefitIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSoft,
  },
  benefitText: { ...typography.body, color: colors.textMuted, flex: 1 },
  actions: { gap: spacing.sm },
});
