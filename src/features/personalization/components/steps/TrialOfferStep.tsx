import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, overlay, radius, silver, spacing, typography } from '@/theme';

import { PhoneMockup } from '../PhoneMockup';
import { TrialLegalRow } from '../TrialLegalRow';

// Mirrors app/(app)/personalize.tsx so the phone's height budget accounts for
// chrome it doesn't render: the scroll padding and the footer (Next button +
// TrialOfferFooterExtras stacked below it).
const ORCHESTRATOR_CHROME_HEIGHT = 24 + 150;
// This step's own text around the phone (title, "No payment" row, gaps).
const STEP_CHROME_HEIGHT = 100;

const PRO_FEATURES = ['Unlimited AI try-ons', 'HD outfit previews', 'Priority styling speed'];

export function TrialOfferStep() {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const phoneMaxHeight =
    windowHeight - insets.top - insets.bottom - ORCHESTRATOR_CHROME_HEIGHT - STEP_CHROME_HEIGHT;

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Try Stylo Pro, free for 7 days</Text>

      <View style={styles.phoneBleed}>
        <PhoneMockup maxHeight={phoneMaxHeight}>
          <ProPreview />
        </PhoneMockup>
      </View>

      <View style={styles.trustRow}>
        <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        <Text style={styles.trustText}>No payment due now</Text>
      </View>
    </View>
  );
}

/** The light "Stylo Pro" upgrade screen rendered inside the phone mockup. */
function ProPreview() {
  return (
    <View style={inside.wrap}>
      <View style={inside.crown}>
        <MaterialCommunityIcons name="crown" size={22} color={colors.primary} />
      </View>

      <Text style={inside.title}>
        Stylo <Text style={inside.titlePro}>Pro</Text>
      </Text>
      <Text style={inside.subtitle}>Everything, unlocked</Text>

      <View style={inside.features}>
        {PRO_FEATURES.map((feature) => (
          <View key={feature} style={inside.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={inside.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={inside.badge}>
        <Text style={inside.badgeText}>7-DAY FREE TRIAL</Text>
      </View>
    </View>
  );
}

/** Renders below the shared footer's Next button — see personalize.tsx's renderFooter. */
export function TrialOfferFooterExtras() {
  return (
    <View style={styles.footerExtras}>
      <Text style={styles.footerText}>Your first week is on us.</Text>
      <TrialLegalRow />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.md },
  title: {
    ...typography.titleLg,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
    paddingHorizontal: spacing.md,
  },
  phoneBleed: {
    marginHorizontal: -spacing.lg,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trustText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  footerExtras: { alignItems: 'center', gap: spacing.xs },
  footerText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
});

// Light-theme styles — this content sits on the phone's white screen.
const inside = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  crown: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.primaryTint,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textOnLight,
    letterSpacing: -0.4,
  },
  titlePro: { color: colors.primary },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: silver[500],
    marginBottom: spacing.sm,
  },
  features: { alignSelf: 'stretch', gap: spacing.xs, marginBottom: spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: silver[800],
    flex: 1,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.white,
  },
});
