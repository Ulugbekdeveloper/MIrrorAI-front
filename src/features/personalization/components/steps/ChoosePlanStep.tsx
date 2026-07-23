import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';

import { PlanCard } from '../PlanCard';
import { TrialLegalRow } from '../TrialLegalRow';
import { PLAN_OPTIONS, PLAN_TESTIMONIALS, type PlanKey } from '../../plans';

const TESTIMONIAL_INTERVAL_MS = 4000;
const FADE_DURATION_MS = 250;

type Props = {
  selectedPlan: PlanKey;
  onSelectPlan: (plan: PlanKey) => void;
  /** Dismisses the paywall — proceeds without picking a plan. */
  onClose: () => void;
};

export function ChoosePlanStep({ selectedPlan, onSelectPlan, onClose }: Props) {
  const [trialEnabled, setTrialEnabled] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_DURATION_MS,
        useNativeDriver: true,
      }).start(() => {
        setTestimonialIndex((index) => (index + 1) % PLAN_TESTIMONIALS.length);
        Animated.timing(fade, {
          toValue: 1,
          duration: FADE_DURATION_MS,
          useNativeDriver: true,
        }).start();
      });
    }, TESTIMONIAL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fade]);

  const testimonial = PLAN_TESTIMONIALS[testimonialIndex];

  return (
    <View style={styles.content}>
      <Pressable onPress={onClose} hitSlop={10} style={styles.closeButton}>
        <Ionicons name="close" size={20} color={colors.textMuted} />
      </Pressable>

      <Text style={styles.title}>Choose your plan</Text>

      <Animated.View style={[styles.testimonial, { opacity: fade }]}>
        <View style={styles.starRow}>
          {Array.from({ length: testimonial.rating }).map((_, index) => (
            <Ionicons key={index} name="star" size={18} color={colors.warning} />
          ))}
        </View>
        <Text style={styles.quote}>&ldquo;{testimonial.quote}&rdquo;</Text>
        <Text style={styles.author}>@{testimonial.author}</Text>
      </Animated.View>

      {/* Flexible gap pushes the toggle + plans down toward the Continue
          button (relies on the scroll container's flexGrow). */}
      <View style={styles.spacer} />

      <View style={styles.trialRow}>
        <Text style={styles.trialLabel}>Not sure yet? Start with a free trial.</Text>
        <Switch
          value={trialEnabled}
          onValueChange={setTrialEnabled}
          trackColor={{ false: overlay.whiteSoft, true: overlay.primaryOutline }}
          thumbColor={colors.white}
        />
      </View>

      <View style={styles.planList}>
        {PLAN_OPTIONS.map((plan) => (
          <PlanCard
            key={plan.key}
            plan={plan}
            selected={plan.key === selectedPlan}
            onPress={() => onSelectPlan(plan.key)}
          />
        ))}
      </View>
    </View>
  );
}

/** Renders below the shared footer's Continue button — see personalize.tsx's renderFooter. */
export function ChoosePlanFooterExtras() {
  return (
    <View style={styles.footerExtras}>
      <Text style={styles.footerNote}>Cancel your plan any time.</Text>
      <TrialLegalRow />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: spacing.lg },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSoft,
  },
  spacer: { flex: 1, minHeight: spacing.md },
  title: {
    ...typography.displaySm,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginTop: spacing.md,
  },
  testimonial: { alignItems: 'center', gap: spacing.xs },
  starRow: { flexDirection: 'row', gap: 2 },
  quote: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  author: {
    ...typography.caption,
    color: colors.textMuted,
  },
  trialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: overlay.primaryTint,
  },
  trialLabel: {
    ...typography.bodyStrong,
    flex: 1,
    color: colors.text,
  },
  planList: { gap: spacing.sm },
  footerExtras: { alignItems: 'center', gap: spacing.xs },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
