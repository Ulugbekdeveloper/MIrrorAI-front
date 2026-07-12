import { http } from './client';
import type { AuthResponse, AuthTokens, User } from './types';

export type AppleFullName = {
  givenName?: string | null;
  familyName?: string | null;
};

export const authApi = {
  register: (body: { email: string; password: string; displayName?: string }) =>
    http.post<AuthResponse>('/auth/register', body, { skipAuth: true }),

  login: (body: { email: string; password: string }) =>
    http.post<AuthResponse>('/auth/login', body, { skipAuth: true }),

  refresh: (refreshToken: string) =>
    http.post<AuthTokens>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true, skipRefresh: true },
    ),

  me: () => http.get<{ user: User }>('/auth/me'),

  google: (body: { idToken: string }) =>
    http.post<AuthResponse>('/auth/google', body, { skipAuth: true }),

  apple: (body: {
    identityToken: string;
    /** Unhashed nonce; the identityToken's `nonce` claim is its SHA-256 hash. */
    rawNonce: string;
    /** Only present on the user's first Apple sign-in — persist it server-side. */
    fullName?: AppleFullName;
  }) => http.post<AuthResponse>('/auth/apple', body, { skipAuth: true }),
};
