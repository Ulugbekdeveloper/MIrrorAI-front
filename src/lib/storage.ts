import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type Key = 'accessToken' | 'refreshToken' | 'onboardingSeen' | 'personalizationSeen';

const memoryFallback = new Map<string, string>();
const canUseSecureStore = Platform.OS !== 'web';

export const secureStorage = {
  async get(key: Key): Promise<string | null> {
    if (!canUseSecureStore) return memoryFallback.get(key) ?? null;
    return SecureStore.getItemAsync(key);
  },

  async set(key: Key, value: string): Promise<void> {
    if (!canUseSecureStore) {
      memoryFallback.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: Key): Promise<void> {
    if (!canUseSecureStore) {
      memoryFallback.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },

  async clear(): Promise<void> {
    await Promise.all([this.remove('accessToken'), this.remove('refreshToken')]);
  },
};
