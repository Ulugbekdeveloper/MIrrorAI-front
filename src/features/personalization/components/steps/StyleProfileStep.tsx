import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';

import { StyleRadarChart } from '../StyleRadarChart';
import { buildStyleProfile } from '../../styleProfile';
import type { StyleTypeKey } from '../../styleTypes';

const CHECK_SIZE = 64;

type Props = {
  selectedStyleType: StyleTypeKey | null;
};

export function StyleProfileStep({ selectedStyleType }: Props) {
  const axes = buildStyleProfile(selectedStyleType);
  const dominant = axes.reduce((best, axis) => (axis.value > best.value ? axis : best), axes[0]);

  // Staggered entrance: the check springs in, then the header eases up.
  const checkScale = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [checkScale, headerAnim]);

  const headerTranslate = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <View style={styles.content}>
      <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
        <Ionicons name="checkmark" size={34} color={colors.white} />
      </Animated.View>

      <Animated.View
        style={[styles.headerText, { opacity: headerAnim, transform: [{ translateY: headerTranslate }] }]}
      >
        <Text style={styles.title}>Your style profile is ready</Text>
        <Text style={styles.subtitle}>
          This is the aesthetic that makes you, you — we&apos;ll tune every pick to match.
        </Text>
      </Animated.View>

      <View style={styles.signature}>
        <Text style={styles.signatureLabel}>YOUR SIGNATURE STYLE</Text>
        <Text style={styles.signatureValue}>{dominant.label}</Text>
      </View>

      {/* Bleeds past the screen's horizontal padding so the chart can use the
          full device width — keeps every axis label from clipping. */}
      <View style={styles.chartBleed}>
        <StyleRadarChart axes={axes} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.sm },
  checkCircle: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  headerText: { alignItems: 'center', gap: spacing.xs },
  title: {
    ...typography.titleLg,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  signature: {
    alignItems: 'center',
    gap: 2,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: overlay.primaryOutline,
    backgroundColor: overlay.primaryTint,
  },
  signatureLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  signatureValue: {
    ...typography.titleLg,
    color: colors.text,
    fontWeight: '800',
  },
  chartBleed: {
    marginHorizontal: -spacing.lg,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
