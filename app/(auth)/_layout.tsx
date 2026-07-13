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
        // Explicit slide animation — without this, Android falls back to
        // an abrupt platform default that reads as janky, especially with
        // the gradient background rendering behind the transition.
        animation: 'slide_from_right',
        animationDuration: 220,
        gestureEnabled: true,
      }}
    />
  );
}
