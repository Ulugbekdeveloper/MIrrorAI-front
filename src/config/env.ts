const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!rawBaseUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env and fill it in.',
  );
}

export const env = {
  apiBaseUrl: rawBaseUrl.replace(/\/$/, ''),
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 30_000),
} as const;
