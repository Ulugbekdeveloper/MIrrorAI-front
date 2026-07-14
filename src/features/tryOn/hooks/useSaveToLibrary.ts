import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { Alert } from 'react-native';

import { logger } from '@/lib/logger';

/**
 * Downloads a remote result image and saves it to the device's photo
 * library. `saveToLibraryAsync` requires a local file URI, so the remote
 * URL is downloaded to cache first — it can't operate on an https:// URL
 * directly.
 */
export function useSaveToLibrary() {
  const [saving, setSaving] = useState(false);

  const save = async (remoteUrl: string): Promise<boolean> => {
    setSaving(true);
    try {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        if (!canAskAgain) {
          Alert.alert(
            'Permission needed',
            'Enable photo library access in Settings to save this image.',
          );
        }
        return false;
      }

      const localUri = `${FileSystem.cacheDirectory}mirror-ai-${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(remoteUrl, localUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      return true;
    } catch (err) {
      logger.error('save to library', err);
      Alert.alert('Couldn’t save', 'Something went wrong saving this image. Try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, save };
}
