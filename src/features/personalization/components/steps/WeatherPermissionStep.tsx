import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, overlay, spacing, typography } from '@/theme';

// Continuous, deliberately slow motions (ms per full revolution).
const GLOBE_SPIN_MS = 28000;
const RING_ORBIT_MS = 60000;

const GLOBE_SIZE = 120;
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

const BENEFITS: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: 'partly-sunny', text: "Outfit picks tuned to today's forecast" },
  { icon: 'lock-closed', text: 'Your location stays private on your device' },
];

export function WeatherPermissionStep() {
  const { width: screenWidth } = useWindowDimensions();
  const ringDiameter = Math.min(screenWidth - spacing.xl * 2, 300);
  const stageSize = ringDiameter + CHIP_SIZE;
  const radius_ = ringDiameter / 2;

  const globeSpin = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;

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

      {/* Globe hero — centered in the space freed by removing the CTA. */}
      <View style={styles.hero}>
        <View style={[styles.stage, { width: stageSize, height: stageSize }]}>
          <View
            style={[
              styles.orbitPath,
              { width: ringDiameter, height: ringDiameter, borderRadius: ringDiameter / 2 },
            ]}
          />

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

          <Animated.View style={[styles.globe, { transform: [{ rotate: globeRotate }] }]}>
            <Ionicons name="earth" size={GLOBE_SIZE} color={colors.text} />
          </Animated.View>
        </View>

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', gap: spacing.lg },
  headline: {
    ...typography.displaySm,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingHorizontal: spacing.md,
  },
  hero: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
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
  benefits: { alignSelf: 'stretch', gap: spacing.sm, paddingHorizontal: spacing.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSoft,
  },
  benefitText: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
});
