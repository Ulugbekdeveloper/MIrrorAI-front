import * as Notifications from 'expo-notifications';
import { Alert, Linking } from 'react-native';

export function useNotificationPermission() {
  /** Requests OS notification permission. Resolves once the user has answered
   * (or we've pointed them to Settings) — the caller can then advance. */
  const requestNotificationAccess = async () => {
    try {
      const current = await Notifications.getPermissionsAsync();
      if (current.granted) return;

      if (current.canAskAgain) {
        await Notifications.requestPermissionsAsync();
        return;
      }

      // Permission was previously denied and the OS won't prompt again —
      // the only path left is the system Settings screen.
      Alert.alert(
        'Turn on notifications',
        'Enable notifications in Settings so we can remind you before your free trial ends.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    } catch {
      Alert.alert(
        'Something went wrong',
        'Could not request notification access. You can enable it later in Settings.',
      );
    }
  };

  return { requestNotificationAccess };
}
