import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export function StepHeading({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  title: {
    ...typography.displaySm,
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: { ...typography.body, color: colors.textMuted },
});
