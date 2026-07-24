import { Tabs } from 'expo-router';

import { AppTabBar } from '@/features/navigation/AppTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="wardrobe" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
