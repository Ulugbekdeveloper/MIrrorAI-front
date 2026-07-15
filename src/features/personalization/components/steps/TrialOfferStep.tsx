import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, silver, spacing, typography } from '@/theme';

import { PhoneMockup } from '../PhoneMockup';
import { TrialLegalRow } from '../TrialLegalRow';

const TSHIRT_IMAGE = require('@assets/brand/tshirt.webp');

type PhoneAction = 'confirm' | 'retry';

// Mirrors app/(app)/personalize.tsx's own layout so the phone mockup's
// height budget accounts for chrome it doesn't render itself: the scroll
// area's top padding and the footer (Next button + TrialOfferFooterExtras,
// stacked below it).
const ORCHESTRATOR_CHROME_HEIGHT = 24 + 154;
// This step's own text above the phone (title, checkmark line) plus the
// gaps between every element in `content`.
const STEP_CHROME_HEIGHT = 120;

export function TrialOfferStep() {
  const [activeAction, setActiveAction] = useState<PhoneAction | null>(null);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const phoneMaxHeight =
    windowHeight - insets.top - insets.bottom - ORCHESTRATOR_CHROME_HEIGHT - STEP_CHROME_HEIGHT;

  return (
    <View style={styles.content}>
      <Text style={styles.title}>We want you to try Stylo Pro for free</Text>

      <View style={styles.phoneBleed}>
        <PhoneMockup maxHeight={phoneMaxHeight}>
          <Pressable style={styles.closeButton} hitSlop={8}>
            <Ionicons name="close" size={16} color={colors.textOnLight} />
          </Pressable>

          <View style={styles.previewBody}>
            <Image source={TSHIRT_IMAGE} style={styles.tshirtImage} contentFit="contain" />
            <Text style={styles.previewCaption}>Tap and hold to see the original image</Text>

            <View style={styles.actionColumn}>
              <Pressable
                onPress={() => setActiveAction('confirm')}
                style={[styles.pillButton, styles.confirmButton, activeAction === 'confirm' && styles.pillPressed]}
              >
                <Text style={styles.confirmLabel}>Confirm</Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveAction('retry')}
                style={[styles.pillButton, styles.retryButton, activeAction === 'retry' && styles.pillPressed]}
              >
                <Text style={styles.retryLabel}>Retry</Text>
              </Pressable>
            </View>

            <View style={styles.creditsRow}>
              <Text style={styles.creditsLabel}>944 AI credits</Text>
              <Ionicons name="add-circle" size={14} color={colors.textOnLight} />
            </View>
          </View>
        </PhoneMockup>
      </View>

      <View style={styles.checkRow}>
        <Ionicons name="checkmark" size={18} color={colors.text} />
        <Text style={styles.checkLabel}>No Payment Due Now</Text>
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
  content: { alignItems: 'center', gap: spacing.sm },
  title: {
    ...typography.titleLg,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  checkLabel: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  phoneBleed: {
    marginHorizontal: -spacing.lg,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 3,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: silver[100],
  },
  previewBody: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  tshirtImage: { width: '108%', aspectRatio: 1 },
  previewCaption: {
    ...typography.caption,
    fontSize: 10,
    lineHeight: 14,
    color: silver[400],
    textAlign: 'center',
  },
  actionColumn: {
    alignSelf: 'stretch',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  pillButton: {
    alignSelf: 'center',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pillPressed: { opacity: 0.7 },
  retryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: silver[200],
  },
  retryLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textOnLight,
  },
  confirmButton: { backgroundColor: colors.black },
  confirmLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.white,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  creditsLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textOnLight,
  },
  footerExtras: { alignItems: 'center', gap: spacing.xs },
  footerText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
});
