import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, silver, spacing, typography } from '@/theme';

import { TrialLegalRow } from '../TrialLegalRow';

export function TrialReminderStep() {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>We&apos;ll send you a reminder before your free trial ends</Text>

      <View style={styles.bellWrap}>
        <Ionicons name="notifications" size={150} color={silver[300]} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      </View>

      <View style={styles.checkRow}>
        <Ionicons name="checkmark" size={18} color={colors.text} />
        <Text style={styles.checkLabel}>No Payment Due Now</Text>
      </View>
    </View>
  );
}

/** Renders below the shared footer's Next button — see personalize.tsx's renderFooter. */
export function TrialReminderFooterExtras() {
  return (
    <View style={styles.footerExtras}>
      <Text style={styles.footerNote}>
        After the free trial, you can choose a monthly or yearly plan.
      </Text>
      <TrialLegalRow />
    </View>
  );
}

const BADGE_SIZE = 44;

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.xxl },
  title: {
    ...typography.displaySm,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  bellWrap: {
    marginVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: -6,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  checkLabel: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  footerExtras: { alignItems: 'center', gap: spacing.xs },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
