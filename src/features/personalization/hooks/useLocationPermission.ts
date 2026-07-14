import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export function useLocationPermission() {
  const requestLocationAccess = async () => {
    try {
      const response = await Location.requestForegroundPermissionsAsync();
      if (response.granted || response.canAskAgain) return;
      Alert.alert(
        'Location needed',
        'Enable location access in Settings to get weather-based outfit suggestions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    } catch {
      Alert.alert(
        'Something went wrong',
        'Could not request location access. Make sure location services are turned on for this device.',
      );
    }
  };

  return { requestLocationAccess };
}
