import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { secureStorage } from '@/lib/storage';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

export default function Index() {
  const status = useAuthStore((s) => s.status);
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    // Authenticated users skip the check entirely — no point reading
    // SecureStore just to redirect straight to /home anyway.
    if (status === 'authenticated') return;
    secureStorage.get('onboardingSeen').then((v) => setOnboardingSeen(v === 'true'));
  }, [status]);

  if (status === 'authenticated') return <Redirect href="/(app)/home" />;

  if (onboardingSeen === null) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!onboardingSeen) return <Redirect href="/onboarding" />;
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
