import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { colors, overlay, radius, silver, spacing, typography } from '@/theme';

type Props = {
  onRequestAccess: () => void;
};

// Continuous, deliberately slow motions (ms per full revolution).
const GLOBE_SPIN_MS = 28000;
const RING_ORBIT_MS = 60000;

const GLOBE_SIZE = 116;
const CHIP_SIZE = 46;

type OrbitIcon = {
  family: 'mci' | 'ion';
  name: string;
  tint?: string;
};

// Weather + clothing pairs, ordered so they alternate pleasantly around the
// ring. Placed evenly (360 / count) starting from the top.
const ORBIT_ICONS: OrbitIcon[] = [
  { family: 'mci', name: 'weather-sunny', tint: colors.warning },
  { family: 'mci', name: 'sunglasses' },
  { family: 'mci', name: 'weather-partly-rainy' },
  { family: 'mci', name: 'umbrella' },
  { family: 'mci', name: 'weather-pouring' },
  { family: 'mci', name: 'tshirt-crew' },
  { family: 'mci', name: 'weather-snowy' },
  { family: 'mci', name: 'hanger' },
  { family: 'mci', name: 'weather-windy' },
];

export function WeatherPermissionStep({ onRequestAccess }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const ringDiameter = Math.min(screenWidth - spacing.xl * 2, 300);
  const stageSize = ringDiameter + CHIP_SIZE;
  const radius_ = ringDiameter / 2;

  const [promptVisible, setPromptVisible] = useState(false);

  const globeSpin = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;

  // Priming pattern: the two "Allow" options fire the real OS location
  // request; "Don't Allow" just dismisses without burning the system prompt.
  const handleAllow = () => {
    setPromptVisible(false);
    onRequestAccess();
  };

  useEffect(() => {
    // Both are pure rotate transforms on separate views — native-driver safe.
    const spin = Animated.loop(
      Animated.timing(globeSpin, {
        toValue: 1,
        duration: GLOBE_SPIN_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const ring = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: RING_ORBIT_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spin.start();
    ring.start();
    return () => {
      spin.stop();
      ring.stop();
    };
  }, [globeSpin, orbit]);

  const globeRotate = globeSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const ringRotate = orbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  // Counter-rotate each chip by the same amount so icons orbit while staying
  // upright (never flip upside-down at the bottom of the ring).
  const chipCounterRotate = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <View style={styles.content}>
      <Text style={styles.headline}>Dress according to the weather near you</Text>

      <View style={[styles.stage, { width: stageSize, height: stageSize }]}>
        {/* Faint orbit path */}
        <View
          style={[
            styles.orbitPath,
            { width: ringDiameter, height: ringDiameter, borderRadius: ringDiameter / 2 },
          ]}
        />

        {/* Orbiting ring of icons */}
        <Animated.View
          style={[styles.ring, { transform: [{ rotate: ringRotate }] }]}
          pointerEvents="none"
        >
          {ORBIT_ICONS.map((icon, index) => {
            const angle = (index / ORBIT_ICONS.length) * 2 * Math.PI - Math.PI / 2;
            const left = stageSize / 2 + radius_ * Math.cos(angle) - CHIP_SIZE / 2;
            const top = stageSize / 2 + radius_ * Math.sin(angle) - CHIP_SIZE / 2;
            return (
              <Animated.View
                key={icon.name}
                style={[styles.chip, { left, top, transform: [{ rotate: chipCounterRotate }] }]}
              >
                {icon.family === 'mci' ? (
                  <MaterialCommunityIcons
                    name={icon.name as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={24}
                    color={icon.tint ?? colors.text}
                  />
                ) : (
                  <Ionicons
                    name={icon.name as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={icon.tint ?? colors.text}
                  />
                )}
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Spinning globe */}
        <Animated.View style={[styles.globe, { transform: [{ rotate: globeRotate }] }]}>
          <Ionicons name="earth" size={GLOBE_SIZE} color={colors.text} />
        </Animated.View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() => setPromptVisible(true)}
      >
        <Text style={styles.ctaLabel}>Allow your location</Text>
      </Pressable>

      <Text style={styles.caption}>
        We use it only to tailor outfit picks to the weather near you.
      </Text>

      <Modal
        visible={promptVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPromptVisible(false)}
      >
        <View style={styles.scrim}>
          <View style={styles.dialog}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Allow &ldquo;Stylo&rdquo; to use your location?</Text>
              <Text style={styles.dialogMessage}>
                Your location is used to suggest outfits for the weather near you.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.dialogRow, pressed && styles.dialogRowPressed]}
              onPress={handleAllow}
            >
              <Text style={[styles.dialogAction, styles.dialogActionPrimary]}>
                Allow While Using App
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.dialogRow, pressed && styles.dialogRowPressed]}
              onPress={handleAllow}
            >
              <Text style={styles.dialogAction}>Allow Once</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.dialogRow, pressed && styles.dialogRowPressed]}
              onPress={() => setPromptVisible(false)}
            >
              <Text style={styles.dialogAction}>Don&apos;t Allow</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.lg },
  headline: {
    ...typography.displaySm,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingHorizontal: spacing.md,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  orbitPath: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: overlay.whiteSubtle,
  },
  ring: { ...StyleSheet.absoluteFillObject },
  chip: {
    position: 'absolute',
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: CHIP_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSoft,
    borderWidth: 1,
    borderColor: overlay.whiteMedium,
  },
  globe: { alignItems: 'center', justifyContent: 'center' },
  cta: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaPressed: { opacity: 0.85 },
  ctaLabel: {
    ...typography.button,
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  // iOS-style permission dialog — the app's own priming prompt, stacked rows
  // separated by hairlines.
  scrim: {
    flex: 1,
    backgroundColor: overlay.blackStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 300,
    borderRadius: radius.lg,
    backgroundColor: silver[50],
    overflow: 'hidden',
  },
  dialogHeader: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  dialogTitle: {
    ...typography.bodyStrong,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  dialogMessage: {
    ...typography.caption,
    color: silver[500],
    textAlign: 'center',
  },
  dialogRow: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: silver[300],
  },
  dialogRowPressed: { backgroundColor: silver[200] },
  dialogAction: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
  },
  dialogActionPrimary: { fontWeight: '700' },
});
