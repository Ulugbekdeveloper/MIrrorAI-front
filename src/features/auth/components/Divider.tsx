import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

export function Divider({ label }: { label: string }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  label: { ...typography.caption, color: colors.textDim, textTransform: 'uppercase' },
});
