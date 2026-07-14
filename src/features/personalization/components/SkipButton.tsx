import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Props = {
  onPress: () => void;
};

export function SkipButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.button} hitSlop={12}>
      <Text style={styles.label}>Skip</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'center', paddingVertical: spacing.sm },
  label: { ...typography.bodyStrong, color: colors.text },
});
