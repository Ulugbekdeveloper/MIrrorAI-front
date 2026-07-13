import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

import { GradientBackground } from './GradientBackground';

type Props = ViewProps & {
  padded?: boolean;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  /** Render the silver radial gradient background instead of the flat color. */
  gradient?: boolean;
};

export function ScreenContainer({
  padded = true,
  edges = ['top', 'bottom'],
  gradient = false,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View style={styles.root}>
      {gradient ? <GradientBackground /> : null}
      <SafeAreaView
        style={[styles.safe, gradient ? styles.safeTransparent : null]}
        edges={edges}
      >
        <View
          {...rest}
          style={[styles.container, padded && styles.padded, style]}
        >
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1, backgroundColor: colors.bg },
  safeTransparent: { backgroundColor: 'transparent' },
  container: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
});
