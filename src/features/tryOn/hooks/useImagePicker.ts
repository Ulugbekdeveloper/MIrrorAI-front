import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

import { permissions } from '@/lib/permissions';

import type { LocalImage } from '../state';

function toLocalImage(asset: ImagePicker.ImagePickerAsset): LocalImage {
  const uri = asset.uri;
  const guessedName = uri.split('/').pop() ?? `photo-${Date.now()}.jpg`;
  return {
    uri,
    fileName: asset.fileName ?? guessedName,
    contentType: asset.mimeType ?? 'image/jpeg',
  };
}

export function useImagePicker() {
  const pickFromLibrary = useCallback(async (): Promise<LocalImage | null> => {
    if (!(await permissions.ensureLibrary())) return null;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
      exif: false,
    });
    if (result.canceled || !result.assets[0]) return null;
    return toLocalImage(result.assets[0]);
  }, []);

  const captureFromCamera = useCallback(async (): Promise<LocalImage | null> => {
    if (!(await permissions.ensureCamera())) return null;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      exif: false,
    });
    if (result.canceled || !result.assets[0]) return null;
    return toLocalImage(result.assets[0]);
  }, []);

  return { pickFromLibrary, captureFromCamera };
}
