import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

export default function AuthLayout() {
  const status = useAuthStore((s) => s.status) 
  if (status === 'authenticated') return <Redirect href="/(app)/home" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
