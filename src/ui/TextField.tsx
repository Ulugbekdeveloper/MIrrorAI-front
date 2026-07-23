import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode} from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps} from 'react-native';
import { colors, finish, overlay, radius, spacing, typography } from '@/theme';



type Props = TextInputProps & {
  leftIcon?: ReactNode;
  rightAdornment?: ReactNode;
  error?: string;
  helper?: string;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { leftIcon, rightAdornment, error, helper, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  
  useImperativeHandle(ref, () => inputRef.current as TextInput, []);

  const focusInput = () => inputRef.current?.focus();

  return (
    <View style={styles.wrapper}>
      {/* Translucent glass fill — brighter top, near-nothing bottom, so the
          page's silver background glow shows through the pill. */}
      <LinearGradient
        colors={
          focused
            ? [overlay.glassFocusTop, overlay.glassFocusBottom]
            : [overlay.glassTop, overlay.glassBottom]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.pill,
          focused && styles.pillFocused,
          error && styles.pillError,
        ]}
      >
        {/* Fine top highlight — the "glass edge" bevel */}
        <View pointerEvents="none" style={styles.topHighlight} />

        {/* Tapping anywhere in this Pressable (icon or empty padding) focuses
            the input. The TextInput itself still handles its own taps normally. */}
        <Pressable onPress={focusInput} style={styles.tapArea}>
          {leftIcon ? <View style={styles.leftIconWrap}>{leftIcon}</View> : null}
          <TextInput
            ref={inputRef}
            placeholderTextColor={overlay.silverPlaceholder}
            selectionColor={overlay.whiteBright}
            {...rest}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[styles.input, style]}
          />
        </Pressable>
        {rightAdornment ? (
          <View style={styles.rightAdornmentWrap}>{rightAdornment}</View>
        ) : null}
      </LinearGradient>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
});

const FIELD_HEIGHT = 60;
const ICON_SIZE = 40;

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xxs },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: FIELD_HEIGHT,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: finish.border,
    overflow: 'hidden',
  },
  pillFocused: {
    borderColor: finish.borderFocus,
    borderWidth: 1.5,
  },
  pillError: { borderColor: overlay.dangerBorder },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: finish.sheen,
    borderRadius: 1,
  },
  tapArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  leftIconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    // Darker inset well — the icon sits "indented" into the glass pill.
    backgroundColor: overlay.wellInset,
    borderWidth: 1,
    borderColor: finish.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rightAdornmentWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: 0, // remove Android default vertical padding
  },
  error: { ...typography.caption, color: colors.danger, marginLeft: spacing.md },
  helper: { ...typography.caption, color: colors.textDim, marginLeft: spacing.md },
});
