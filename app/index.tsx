import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

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

  // While the (near-instant) onboardingSeen read resolves, render a plain
  // app-colored backdrop rather than a spinner — the branded splash already
  // covered "loading," so a second loader here would just read as a flash.
  if (onboardingSeen === null) return <View style={styles.backdrop} />;

  if (!onboardingSeen) return <Redirect href="/onboarding" />;
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
