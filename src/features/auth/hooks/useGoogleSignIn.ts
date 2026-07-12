import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

import { env, isGoogleConfigured } from '@/config/env';
import { logger } from '@/lib/logger';
import { useAuthStore } from '@/stores/authStore';

// Dismisses the in-app browser after the auth redirect on web / Expo Go.
WebBrowser.maybeCompleteAuthSession();

type Return = {
  available: boolean;
  busy: boolean;
  error: string | null;
  signIn: () => Promise<void>;
};

export function useGoogleSignIn(): Return {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: env.googleIosClientId,
    androidClientId: env.googleAndroidClientId,
    webClientId: env.googleWebClientId,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === 'error') {
      setError(response.error?.message ?? 'Google sign-in failed');
      setBusy(false);
      return;
    }
    if (response.type !== 'success') {
      setBusy(false);
      return;
    }

    const idToken =
      response.params?.id_token ?? response.authentication?.idToken ?? null;

    if (!idToken) {
      setError('Google did not return an ID token.');
      setBusy(false);
      return;
    }

    void signInWithGoogle(idToken)
      .catch((err: unknown) => {
        logger.error('google sign-in', err);
        setError(
          err instanceof Error ? err.message : 'Google sign-in failed. Try again.',
        );
      })
      .finally(() => setBusy(false));
  }, [response, signInWithGoogle]);

  const signIn = useCallback(async () => {
    setError(null);
    setBusy(true);
    const result = await promptAsync();
    // Cancelled or dismissed — clear the spinner immediately.
    if (result?.type !== 'success') setBusy(false);
  }, [promptAsync]);

  return {
    available: isGoogleConfigured() && !!request,
    busy,
    error,
    signIn,
  };
}
