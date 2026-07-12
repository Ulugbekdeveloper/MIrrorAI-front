import { forwardRef, useState, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

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

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.pill,
          focused && styles.pillFocused,
          error && styles.pillError,
        ]}
      >
        {leftIcon ? <View style={styles.leftIconWrap}>{leftIcon}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textDim}
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
        {rightAdornment ? (
          <View style={styles.rightAdornmentWrap}>{rightAdornment}</View>
        ) : null}
      </View>
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
    backgroundColor: '#17181C',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillFocused: { borderColor: '#2E2F36' },
  pillError: { borderColor: colors.danger },
  leftIconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#0B0C10',
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
