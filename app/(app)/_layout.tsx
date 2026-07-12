import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  if (status === 'unauthenticated') return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
