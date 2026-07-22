import { Image as ExpoImage } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Image as RNImage } from 'react-native';

/** A remote URL/URI string, or the opaque number returned by `require()`. */
export type PreloadableSource = number | string;

export type AssetPreloaderOptions = {
  /** Floor on how long the caller should keep showing its loading UI, so a
   * warm cache never flashes it for a single frame. Default 1200ms. */
  minimumDisplayMs?: number;
  /** Hard ceiling — fires `isReady` (with `hasError: true`) even if assets
   * are still in flight, so a hung network request never blocks entry
   * into the app. Default 5000ms. */
  timeoutMs?: number;
};

export type AssetPreloaderResult = {
  isReady: boolean;
  hasError: boolean;
};

const DEFAULT_MINIMUM_DISPLAY_MS = 1200;
const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Preloads a fixed set of images in parallel and reports back once they're
 * all decoded/cached — or once `timeoutMs` elapses, whichever comes first.
 *
 * `sources` should be a stable reference (a module-level array, or memoized
 * by the caller) since it re-runs the whole preload whenever the array
 * identity changes.
 */
export function useAssetPreloader(
  sources: PreloadableSource[],
  options: AssetPreloaderOptions = {},
): AssetPreloaderResult {
  const { minimumDisplayMs = DEFAULT_MINIMUM_DISPLAY_MS, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // First of {all-preloaded, timeout} to fire wins — the other is a no-op.
    let hasSettled = false;
    const startedAt = Date.now();

    const settle = (errored: boolean) => {
      if (cancelled || hasSettled) return;
      hasSettled = true;

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, minimumDisplayMs - elapsed);
      setTimeout(() => {
        if (cancelled) return;
        setHasError(errored);
        setIsReady(true);
      }, remaining);
    };

    const timeoutId = setTimeout(() => settle(true), timeoutMs);

    const resolveUri = (source: PreloadableSource): string | undefined =>
      typeof source === 'number' ? RNImage.resolveAssetSource(source)?.uri : source;

    Promise.all(
      sources.map((source) => {
        const uri = resolveUri(source);
        if (!uri) return Promise.resolve();
        // Individual prefetch failures shouldn't sink the whole batch —
        // one broken image is a rendering detail, not a launch blocker.
        return ExpoImage.prefetch(uri).catch(() => false);
      }),
    )
      .then(() => settle(false))
      .catch(() => settle(true));

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [sources, minimumDisplayMs, timeoutMs]);

  return { isReady, hasError };
}
