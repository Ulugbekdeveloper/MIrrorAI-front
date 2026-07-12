import { create } from 'zustand';

import { authApi, configureAuthBridge } from '@/api';
import type { AuthResponse, AuthTokens, User } from '@/api';
import { secureStorage } from '@/lib/storage';

type Status = 'unknown' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: Status;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;

  /** Internal — used by the http client via the auth bridge. */
  _refresh: () => Promise<string | null>;
};

async function persistTokens(tokens: AuthTokens) {
  await Promise.all([
    secureStorage.set('accessToken', tokens.accessToken),
    secureStorage.set('refreshToken', tokens.refreshToken),
  ]);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'unknown',
  user: null,
  accessToken: null,
  refreshToken: null,

  hydrate: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      secureStorage.get('accessToken'),
      secureStorage.get('refreshToken'),
    ]);
    if (!accessToken || !refreshToken) {
      set({ status: 'unauthenticated' });
      return;
    }
    set({ accessToken, refreshToken });
    try {
      const { user } = await authApi.me();
      set({ status: 'authenticated', user });
    } catch {
      await secureStorage.clear();
      set({
        status: 'unauthenticated',
        accessToken: null,
        refreshToken: null,
        user: null,
      });
    }
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    await persistTokens(res);
    set({
      status: 'authenticated',
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
  },

  register: async (email, password, displayName) => {
    const res: AuthResponse = await authApi.register({ email, password, displayName });
    await persistTokens(res);
    set({
      status: 'authenticated',
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
  },

  logout: async () => {
    await secureStorage.clear();
    set({
      status: 'unauthenticated',
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },

  _refresh: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return null;
    try {
      const tokens = await authApi.refresh(refreshToken);
      await persistTokens(tokens);
      set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      return tokens.accessToken;
    } catch {
      return null;
    }
  },
}));

// Wire the http client to this store without creating an import cycle.
configureAuthBridge({
  getAccessToken: () => useAuthStore.getState().accessToken,
  refresh: () => useAuthStore.getState()._refresh(),
  onAuthFailure: () => {
    void useAuthStore.getState().logout();
  },
});
