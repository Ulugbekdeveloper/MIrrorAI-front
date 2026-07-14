import { create } from 'zustand';

import { authApi, configureAuthBridge } from '@/api';
import type { AppleFullName } from '@/api/auth.api';
import type { AuthResponse, AuthTokens, User } from '@/api';
import { secureStorage } from '@/lib/storage';

type Status = 'unknown' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: Status;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** Has this device completed the post-login personalization questions? */
  personalizationSeen: boolean;

  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInWithApple: (input: {
    identityToken: string;
    rawNonce: string;
    fullName?: AppleFullName;
  }) => Promise<void>;
  logout: () => Promise<void>;
  completePersonalization: () => Promise<void>;

  /** Internal — used by the http client via the auth bridge. */
  _refresh: () => Promise<string | null>;
};

async function persistTokens(tokens: AuthTokens) {
  await Promise.all([
    secureStorage.set('accessToken', tokens.accessToken),
    secureStorage.set('refreshToken', tokens.refreshToken),
  ]);
}

// ─── DEV BYPASS ───────────────────────────────────────────────────────
// Skips the backend so the UI can be exercised without NestJS running.
// Only active in __DEV__. Delete this block when the backend is wired up.
const DEV_BYPASS_EMAIL = 'john@gmail.com';
const DEV_BYPASS_PASSWORD = '12345';

function devBypassUser(): User {
  return {
    id: 'dev-user',
    email: DEV_BYPASS_EMAIL,
    displayName: 'John',
    provider: 'email',
    createdAt: new Date().toISOString(),
  };
}
// ──────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'unknown',
  user: null,
  accessToken: null,
  refreshToken: null,
  personalizationSeen: false,

  hydrate: async () => {
    const [accessToken, refreshToken, personalizationSeenValue] = await Promise.all([
      secureStorage.get('accessToken'),
      secureStorage.get('refreshToken'),
      secureStorage.get('personalizationSeen'),
    ]);
    set({ personalizationSeen: personalizationSeenValue === 'true' });

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
    // Dev bypass — no persistence, so restarting the app returns to login.
    if (__DEV__ && email === DEV_BYPASS_EMAIL && password === DEV_BYPASS_PASSWORD) {
      set({
        status: 'authenticated',
        user: devBypassUser(),
        accessToken: 'dev-token',
        refreshToken: 'dev-token',
      });
      return;
    }

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

  signInWithGoogle: async (idToken) => {
    const res = await authApi.google({ idToken });
    await persistTokens(res);
    set({
      status: 'authenticated',
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
  },

  signInWithApple: async ({ identityToken, rawNonce, fullName }) => {
    const res = await authApi.apple({ identityToken, rawNonce, fullName });
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

  completePersonalization: async () => {
    // Device-level flag, same tradeoff as `onboardingSeen` — a different
    // account signing into this device won't be asked again. The real fix
    // is a field on the user's backend profile; swap this out once one
    // exists.
    await secureStorage.set('personalizationSeen', 'true');
    set({ personalizationSeen: true });
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
