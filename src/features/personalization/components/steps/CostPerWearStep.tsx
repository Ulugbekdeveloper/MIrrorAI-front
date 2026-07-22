import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';

import { StepHeading } from '../StepHeading';

const PURCHASE_BENEFITS = [
  'See real cost-per-wear before you buy',
  'Invest in pieces you’ll actually wear',
  'Cut impulse buys and closet clutter',
  'Let AI find what’s truly worth it',
];

export function CostPerWearStep() {
  return (
    <View style={styles.content}>
      <StepHeading
        title="Buy pieces you’ll actually wear"
        subtitle="Cost-per-wear reveals an item’s real value — so you spend on styles you’ll love for years."
      />

      <View style={styles.cardsRow}>
        <WearStatCard
          tone="positive"
          label="Most worn"
          icon="shirt"
          iconFamily="ion"
          itemPrice="$29"
          wears="240 wears"
          costPerWear="$0.12"
        />
        <WearStatCard
          tone="negative"
          label="Rarely worn"
          icon="hanger"
          iconFamily="mci"
          itemPrice="$53"
          wears="3 wears"
          costPerWear="$17.50"
        />

        {/* VS badge floating between the two cards */}
        <View style={styles.vsOverlay} pointerEvents="none">
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>
        </View>
      </View>

      <View style={styles.benefitList}>
        {PURCHASE_BENEFITS.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <View style={styles.benefitCheck}>
              <Ionicons name="checkmark" size={14} color={colors.success} />
            </View>
            <Text style={styles.benefitLabel}>{benefit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

type WearStatCardProps = {
  tone: 'positive' | 'negative';
  label: string;
  icon: string;
  iconFamily: 'ion' | 'mci';
  itemPrice: string;
  wears: string;
  costPerWear: string;
};

// Both cards share one structure so they're always the same size regardless
// of tone — icon chip → item meta → big cost-per-wear → caption.
function WearStatCard({
  tone,
  label,
  icon,
  iconFamily,
  itemPrice,
  wears,
  costPerWear,
}: WearStatCardProps) {
  const isNegative = tone === 'negative';
  const accent = isNegative ? colors.danger : colors.success;

  return (
    <View style={[styles.card, isNegative ? styles.cardNegative : styles.cardPositive]}>
      <Text style={[styles.cardLabel, { color: accent }]}>{label}</Text>

      <View
        style={[
          styles.iconChip,
          { backgroundColor: isNegative ? overlay.dangerTint : overlay.successTint },
        ]}
      >
        {iconFamily === 'ion' ? (
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={34} color={accent} />
        ) : (
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={34}
            color={accent}
          />
        )}
      </View>

      <Text style={styles.cardMeta}>
        {itemPrice} · {wears}
      </Text>

      <Text style={styles.cardPrice}>{costPerWear}</Text>
      <Text style={styles.cardCaption}>cost per wear</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  cardsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'stretch',
  },
  card: {
    flex: 1,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: overlay.whiteFaint,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardPositive: { borderColor: overlay.successOutline },
  cardNegative: { borderColor: overlay.dangerOutline },
  cardLabel: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconChip: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  cardPrice: {
    ...typography.bodyStrong,
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.xxs,
  },
  cardCaption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  vsOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.text,
    fontSize: 12,
  },
  benefitList: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.successTint,
  },
  benefitLabel: {
    ...typography.bodyStrong,
    color: colors.text,
    flex: 1,
  },
});
