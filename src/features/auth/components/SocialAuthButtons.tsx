import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Button } from '@/ui';

import { useAppleSignIn } from '../hooks/useAppleSignIn';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

type Props = {
  onError?: (message: string) => void;
};

export function SocialAuthButtons({ onError }: Props) {
  const google = useGoogleSignIn();
  const apple = useAppleSignIn();

  useEffect(() => {
    const err = apple.error ?? google.error;
    if (err && onError) onError(err);
  }, [apple.error, google.error, onError]);

  if (!apple.available && !google.available) return null;

  return (
    <View style={styles.wrapper}>
      {apple.available ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={radius.md}
          style={styles.appleButton}
          onPress={apple.signIn}
        />
      ) : null}

      {google.available ? (
        <Button
          label="Continue with Google"
          variant="secondary"
          onPress={google.signIn}
          loading={google.busy}
          disabled={!google.available}
          leadingIcon={<GoogleGlyph />}
        />
      ) : null}
    </View>
  );
}

/**
 * Placeholder mark — swap for the official Google G SVG when you add
 * react-native-svg. Kept text-only to avoid an extra dependency here.
 */
function GoogleGlyph() {
  return (
    <View style={styles.glyph}>
      <View style={styles.glyphInner} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  appleButton: { height: 52 },
  glyph: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphInner: {
    width: 8,
    height: 2,
    backgroundColor: colors.text,
    position: 'absolute',
    right: 0,
  },
});
