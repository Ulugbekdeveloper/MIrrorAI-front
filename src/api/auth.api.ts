import { http } from './client';
import type { AuthResponse, AuthTokens, User } from './types';

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
};
