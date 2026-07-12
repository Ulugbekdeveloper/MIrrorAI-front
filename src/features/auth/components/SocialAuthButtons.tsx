import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import AppleIcon from '@assets/icons/apple.svg';
import GoogleIcon from '@assets/icons/google.svg';
import { colors, radius, spacing, typography } from '@/theme';

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
    <View style={styles.row}>
      {google.available ? (
        <SocialPill
          label="Google"
          onPress={google.signIn}
          loading={google.busy}
          icon={<GoogleIcon width={22} height={22} />}
        />
      ) : null}
      {apple.available ? (
        <SocialPill
          label="Apple"
          onPress={apple.signIn}
          loading={apple.busy}
          icon={<AppleIcon width={22} height={22} />}
        />
      ) : null}
    </View>
  );
}

type SocialPillProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  icon: React.ReactNode;
};

function SocialPill({ label, onPress, loading, icon }: SocialPillProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          {icon}
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: '#17181C',
  },
  pillPressed: { backgroundColor: '#101115' },
  label: { ...typography.bodyStrong, color: colors.text },
});
