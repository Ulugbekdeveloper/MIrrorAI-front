import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

type Props = ViewProps & {
  padded?: boolean;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
};

export function ScreenContainer({
  padded = true,
  edges = ['top', 'bottom'],
  style,
  children,
  ...rest
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View
        {...rest}
        style={[styles.container, padded && styles.padded, style]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
});
