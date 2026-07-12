import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { logger } from '@/lib/logger';
import { useAuthStore } from '@/stores/authStore';

type Return = {
  available: boolean;
  busy: boolean;
  error: string | null;
  signIn: () => Promise<void>;
};

async function makeNonce(): Promise<{ rawNonce: string; hashedNonce: string }> {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );
  return { rawNonce, hashedNonce };
}

export function useAppleSignIn(): Return {
  const signInWithApple = useAuthStore((s) => s.signInWithApple);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let mounted = true;
    AppleAuthentication.isAvailableAsync()
      .then((ok) => mounted && setAvailable(ok))
      .catch(() => mounted && setAvailable(false));
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const { rawNonce, hashedNonce } = await makeNonce();
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        throw new Error('Apple did not return an identity token.');
      }

      await signInWithApple({
        identityToken: credential.identityToken,
        rawNonce,
        fullName: credential.fullName
          ? {
              givenName: credential.fullName.givenName,
              familyName: credential.fullName.familyName,
            }
          : undefined,
      });
    } catch (err: unknown) {
      // User cancelled the sheet — treat as a no-op, not an error.
      if (isCancelledError(err)) return;
      logger.error('apple sign-in', err);
      setError(
        err instanceof Error ? err.message : 'Apple sign-in failed. Try again.',
      );
    } finally {
      setBusy(false);
    }
  }, [signInWithApple]);

  return { available, busy, error, signIn };
}

function isCancelledError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'ERR_REQUEST_CANCELED'
  );
}
