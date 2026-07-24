import { Redirect } from 'expo-router';

// The app's home is now the bottom-tab navigator. Existing `/(app)/home`
// navigations (login, register, try-on flow, etc.) funnel through here to the
// Wardrobe tab.
export default function HomeRedirect() {
  return <Redirect href="/(app)/(tabs)/wardrobe" />;
}
