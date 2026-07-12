import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Variant = 'cta' | 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  loading,
  leadingIcon,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant].container,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && variantStyles[variant].pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].label.color} />
      ) : (
        <View style={styles.row}>
          {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}
          <Text style={[typography.button, variantStyles[variant].label]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  icon: { marginRight: 4 },
});

const sizeStyles = {
  md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
} as const;

const variantStyles = {
  // The primary auth CTA — white pill with dark text.
  cta: {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: radius.pill,
      paddingVertical: 18,
    },
    pressed: { backgroundColor: '#E5E5E7' },
    label: { color: '#0A0A0F', fontWeight: '700' as const, fontSize: 17 },
  },
  primary: {
    container: { backgroundColor: colors.primary },
    pressed: { backgroundColor: colors.primaryPressed },
    label: { color: colors.primaryText },
  },
  secondary: {
    container: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: { backgroundColor: colors.surface },
    label: { color: colors.text },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    pressed: { backgroundColor: colors.surface },
    label: { color: colors.text },
  },
  danger: {
    container: { backgroundColor: colors.danger },
    pressed: { backgroundColor: '#E14A4F' },
    label: { color: colors.primaryText },
  },
} as const;
