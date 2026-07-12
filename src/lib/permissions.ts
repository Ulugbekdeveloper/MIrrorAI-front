import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

type PermissionKind = 'camera' | 'library';

async function ensure(kind: PermissionKind): Promise<boolean> {
  const request =
    kind === 'camera'
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;

  const result = await request();
  if (result.granted) return true;

  if (!result.canAskAgain) {
    Alert.alert(
      'Permission needed',
      kind === 'camera'
        ? 'Enable camera access in Settings to take a photo.'
        : 'Enable photo library access in Settings to pick a photo.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ],
    );
  }
  return false;
}

export const permissions = {
  ensureCamera: () => ensure('camera'),
  ensureLibrary: () => ensure('library'),
};
