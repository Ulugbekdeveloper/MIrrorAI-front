import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

/**
 * The Restore purchase / Terms / Privacy row shared by the trial screens.
 * TODO(backend): wire to real Terms/Privacy pages and restore-purchase flow
 * once they exist.
 */
export function TrialLegalRow() {
  return (
    <View style={styles.row}>
      <Pressable>
        <Text style={styles.link}>Restore purchase</Text>
      </Pressable>
      <Pressable>
        <Text style={styles.link}>Terms of service</Text>
      </Pressable>
      <Pressable>
        <Text style={styles.link}>Privacy policy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  link: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
