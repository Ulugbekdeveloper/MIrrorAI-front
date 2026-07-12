import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function TryOnLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
