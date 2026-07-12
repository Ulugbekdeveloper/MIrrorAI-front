const DEV_DEFAULT_API_BASE_URL = 'http://localhost:3000';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

let apiBaseUrl: string;

if (rawBaseUrl && rawBaseUrl.length > 0) {
  apiBaseUrl = rawBaseUrl.replace(/\/$/, '');
} else if (__DEV__) {
  apiBaseUrl = DEV_DEFAULT_API_BASE_URL;
  console.warn(
    `[env] EXPO_PUBLIC_API_BASE_URL is not set. Defaulting to ${DEV_DEFAULT_API_BASE_URL}. ` +
      'Copy .env.example to .env to configure your NestJS gateway URL.',
  );
} else {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL is required in production builds. Set it in your build env.',
  );
}

const optional = (v: string | undefined): string | undefined =>
  v && v.length > 0 ? v : undefined;

export const env = {
  apiBaseUrl,
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 30_000),

  googleIosClientId: optional(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS),
  googleAndroidClientId: optional(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID),
  googleWebClientId: optional(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB),
} as const;

export const isGoogleConfigured = () =>
  !!(env.googleIosClientId || env.googleAndroidClientId || env.googleWebClientId);
