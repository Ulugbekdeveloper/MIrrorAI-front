import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Alert, Linking } from 'react-native';

// expo-notifications' push functionality was removed from Expo Go in SDK 53,
// and simply importing the module there logs errors. So we never load it in
// Expo Go — it's imported lazily, only in a development/production build where
// notifications actually work.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export function useNotificationPermission() {
  /** Requests OS notification permission. Resolves once the user has answered
   * (or we've pointed them to Settings) — the caller can then advance. */
  const requestNotificationAccess = async () => {
    if (isExpoGo) {
      if (__DEV__) {
        Alert.alert(
          'Notifications need a development build',
          'Reminder notifications aren’t supported in Expo Go (SDK 53+). Run a development build to test them.',
        );
      }
      return;
    }

    try {
      // Lazy import so the module never initializes in Expo Go.
      const Notifications = await import('expo-notifications');
      const current = await Notifications.getPermissionsAsync();
      if (current.granted) return;

      if (current.canAskAgain) {
        await Notifications.requestPermissionsAsync();
        return;
      }

      // Previously denied and the OS won't prompt again — Settings is the only path.
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
