import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { StyleSpeedGauge } from '../StyleSpeedGauge';
import { buildStyleProfile } from '../../styleProfile';
import { getStyleTypeOptions, type StyleTypeKey } from '../../styleTypes';
import type { GenderKey } from '../../types';

const CHECK_SIZE = 60;

type Props = {
  gender: GenderKey | null;
  selectedStyleType: StyleTypeKey | null;
};

export function StyleProfileStep({ gender, selectedStyleType }: Props) {
  // The gauge shows the actual style picked in StyleTypeStep — whose options
  // differ by gender — so resolve the label from the matching option set.
  const selectedOption = getStyleTypeOptions(gender).find(
    (option) => option.key === selectedStyleType,
  );
  const styleLabel = selectedOption?.label ?? 'Your style';

  // Match strength = the dominant axis of the derived profile (~0.9+).
  const axes = buildStyleProfile(selectedStyleType);
  const matchValue = Math.max(...axes.map((axis) => axis.value));

  const checkScale = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(headerAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [checkScale, headerAnim]);

  const headerTranslate = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <View style={styles.content}>
      <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
        <Ionicons name="checkmark" size={32} color={colors.white} />
      </Animated.View>

      <Animated.View
        style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerTranslate }] }]}
      >
        <Text style={styles.title}>You&apos;re a strong match</Text>
        <Text style={styles.subtitle}>
          We read your picks — here&apos;s how closely you fit your signature look.
        </Text>
      </Animated.View>

      <StyleSpeedGauge value={matchValue} label={styleLabel} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.md },
  checkCircle: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  header: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  title: {
    ...typography.displaySm,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
