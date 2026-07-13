import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { colors, radius, silver, spacing, typography } from '@/theme';

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

export function Button(props: Props) {
  if ((props.variant ?? 'primary') === 'cta') return <MetalCTA {...props} />;
  return <PlainButton {...props} />;
}

/**
 * The premium auth CTA — silver-white gradient pill with a dark drop
 * shadow underneath so it pops forward off the dark background.
 * Structure: Pressable owns the shadow; LinearGradient owns the fill and clips.
 */
function MetalCTA({
  label,
  loading,
  disabled,
  fullWidth = true,
  style,
  leadingIcon,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        ctaStyles.shadow,
        fullWidth && plainStyles.fullWidth,
        pressed && !isDisabled && ctaStyles.pressedShadow,
        isDisabled && plainStyles.disabled,
        style,
      ]}
    >
      <LinearGradient
        // Brightest step of the shared silver ladder — pure white top,
        // fading through silver-50/100/200 toward the bottom edge.
        colors={['#FFFFFF', silver[50], silver[100], silver[200]]}
        locations={[0, 0.32, 0.72, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={ctaStyles.gradient}
      >
        {/* Fine top sheen — polished metal edge */}
        <View pointerEvents="none" style={ctaStyles.topSheen} />
        {loading ? (
          <ActivityIndicator color="#0A0A0F" />
        ) : (
          <View style={plainStyles.row}>
            {leadingIcon ? <View style={plainStyles.icon}>{leadingIcon}</View> : null}
            <Text style={ctaStyles.label}>{label}</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function PlainButton({
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
  const v = plainVariants[variant === 'cta' ? 'primary' : variant];

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        plainStyles.base,
        plainSizes[size],
        v.container,
        fullWidth && plainStyles.fullWidth,
        pressed && !isDisabled && v.pressed,
        isDisabled && plainStyles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.label.color} />
      ) : (
        <View style={plainStyles.row}>
          {leadingIcon ? <View style={plainStyles.icon}>{leadingIcon}</View> : null}
          <Text style={[typography.button, v.label]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const ctaStyles = StyleSheet.create({
  shadow: {
    borderRadius: radius.pill,
    // Dark drop-shadow — makes the light pill pop forward off the dark bg.
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  pressedShadow: {
    shadowOpacity: 0.25,
    transform: [{ scale: 0.985 }],
  },
  gradient: {
    borderRadius: radius.pill,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topSheen: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 1,
  },
  label: {
    color: '#0A0A0F',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});

const plainStyles = StyleSheet.create({
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

const plainSizes = {
  md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
} as const;

const plainVariants = {
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
