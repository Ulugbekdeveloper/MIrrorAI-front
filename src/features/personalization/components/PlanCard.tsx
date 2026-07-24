import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';

import type { PlanOption } from '../plans';

type Props = {
  plan: PlanOption;
  selected: boolean;
  onPress: () => void;
};

export function PlanCard({ plan, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      {plan.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{plan.badge.toUpperCase()}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={styles.label}>{plan.label}</Text>
          <Text style={styles.period}>{plan.period}</Text>
        </View>

        <View style={styles.priceCol}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{plan.pricePerMonth}</Text>
            <Text style={styles.priceUnit}>/mo</Text>
          </View>
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const RADIO_SIZE = 22;

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: overlay.whiteSoft,
    backgroundColor: overlay.whiteFaint,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: colors.black,
    borderWidth: 2,
    backgroundColor: overlay.whiteSoft,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderBottomRightRadius: radius.md,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  textCol: { flex: 1, gap: 2 },
  label: {
    ...typography.bodyStrong,
    fontSize: 17,
    color: colors.text,
  },
  period: {
    ...typography.caption,
    color: colors.textMuted,
  },
  priceCol: { alignItems: 'flex-end', gap: spacing.xs },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: {
    ...typography.titleSm,
    color: colors.text,
  },
  priceUnit: {
    ...typography.caption,
    color: colors.textMuted,
  },
  radio: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 1.5,
    borderColor: overlay.whiteBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
});
