import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { DartboardChart } from '../DartboardChart';
import { buildStyleProfile } from '../../styleProfile';
import type { StyleTypeKey } from '../../styleTypes';

const CHECK_SIZE = 64;

type Props = {
  selectedStyleType: StyleTypeKey | null;
};

export function StyleProfileStep({ selectedStyleType }: Props) {
  return (
    <View style={styles.content}>
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={34} color={colors.white} />
      </View>

      <View style={styles.headerText}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.title}>Your custom style profile is ready</Text>
      </View>

      <Text style={styles.sectionTitle}>Your style profile</Text>

      {/* Bleeds past the screen's horizontal padding so the board can use
          the full device width — that's what keeps every axis label
          (e.g. "Streetwear") from clipping. */}
      <View style={styles.chartBleed}>
        <DartboardChart axes={buildStyleProfile(selectedStyleType)} />
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
  headerText: { alignItems: 'center' },
  title: {
    ...typography.titleLg,
    color: colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  chartBleed: {
    marginHorizontal: -spacing.lg,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});
