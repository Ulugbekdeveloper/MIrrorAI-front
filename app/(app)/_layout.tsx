import { Redirect, Stack, useSegments } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  const personalizationSeen = useAuthStore((s) => s.personalizationSeen);
  const segments = useSegments();

  if (status === 'unauthenticated') return <Redirect href="/(auth)/login" />;

  const onPersonalizeScreen = segments[segments.length - 1] === 'personalize';
  if (!personalizationSeen && !onPersonalizeScreen) {
    return <Redirect href="/(app)/personalize" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
