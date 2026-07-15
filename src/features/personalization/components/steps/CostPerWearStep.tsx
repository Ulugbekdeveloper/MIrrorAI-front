import { Ionicons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';

import { StepHeading } from '../StepHeading';

const MOST_WORN_IMAGE = require('@assets/brand/top.jpeg');
const RARELY_WORN_IMAGE = require('@assets/brand/costume.avif');

const PURCHASE_BENEFITS = [
  'Try before you buy',
  'See it before you own it',
  "Shop smarter with AI",
  "Find your perfect fit",
];

export function CostPerWearStep() {
  return (
    <View style={styles.content}>
      <StepHeading title="Stylo helps you make best purchases" />

      <View style={styles.cardsRow}>
        <WearStatCard
          tone="positive"
          label="Most worn"
          image={MOST_WORN_IMAGE}
          costPerWear="$0.12"
        />
        <WearStatCard
          tone="negative"
          label="Rarely worn"
          image={RARELY_WORN_IMAGE}
          costPerWear="$17.50"
        />
      </View>

      <View style={styles.benefitList}>
        {PURCHASE_BENEFITS.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Ionicons name="checkmark" size={18} color={colors.success} />
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
  image: ImageSource;
  costPerWear: string;
};

// Both cards share one structure (banner → image → price → caption) so
// they're always the same size regardless of tone — no per-tone margin
// hacks trying to approximate matching heights after the fact.
function WearStatCard({ tone, label, image, costPerWear }: WearStatCardProps) {
  const isNegative = tone === 'negative';

  return (
    <View style={[styles.card, isNegative ? styles.cardNegative : styles.cardPositive]}>
      <View style={[styles.cardBanner, isNegative ? styles.cardBannerNegative : styles.cardBannerPositive]}>
        <Text style={[styles.cardBannerText, isNegative ? styles.cardBannerTextNegative : styles.cardBannerTextPositive]}>
          {label}
        </Text>
      </View>
      <View style={styles.cardImageWrap}>
        <Image source={image} style={styles.cardImage} contentFit="contain" />
      </View>
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
    borderColor: overlay.whiteSoft,
    backgroundColor: overlay.whiteFaint,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardPositive: {
    borderColor: overlay.successOutline,
  },
  cardNegative: {
    borderColor: overlay.dangerOutline,
  },
  cardBanner: {
    alignSelf: 'stretch',
    marginHorizontal: -spacing.sm,
    marginTop: -spacing.md,
    marginBottom: spacing.xs,
    paddingVertical: spacing.xs,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    alignItems: 'center',
  },
  cardBannerPositive: { backgroundColor: overlay.successTint },
  cardBannerNegative: { backgroundColor: overlay.dangerTint },
  cardBannerText: {
    ...typography.caption,
    fontWeight: '700',
  },
  cardBannerTextPositive: { color: colors.success },
  cardBannerTextNegative: { color: colors.danger },
  cardImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: '100%' },
  cardPrice: {
    ...typography.bodyStrong,
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  cardCaption: {
    ...typography.caption,
    color: colors.textMuted,
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
  benefitLabel: {
    ...typography.bodyStrong,
    color: colors.success,
    flex: 1,
  },
});
