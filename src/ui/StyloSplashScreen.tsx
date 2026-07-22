import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import {
  useAssetPreloader,
  type AssetPreloaderOptions,
  type PreloadableSource,
} from '@/hooks/useAssetPreloader';

import { StyloBrandView } from './StyloBrandView';

const FADE_OUT_MS = 400;
// Floor so the static brand screen is clearly seen on cold start rather than
// flashing by when assets cache instantly.
const DEFAULT_MINIMUM_DISPLAY_MS = 2000;

type Props = AssetPreloaderOptions & {
  /** Images to preload before fading out — see useAssetPreloader for the shape. */
  sources: PreloadableSource[];
  /** Fires once the fade-out animation has fully finished. */
  onFinish: () => void;
  /** Delays the fade-out even after assets finish preloading — for holding
   * on an unrelated async gate (e.g. auth hydration) without coupling this
   * component to it. Defaults to false (fades out as soon as assets are ready). */
  holdFadeOut?: boolean;
};

/**
 * The cold-start splash: shows the branded StyloBrandView while it preloads
 * the onboarding images (and any caller-held gate), then fades out and calls
 * `onFinish`. Only shows on a fresh launch — a warm foreground resume keeps
 * the JS process alive, so this component simply never remounts.
 */
export function StyloSplashScreen({
  sources,
  onFinish,
  minimumDisplayMs = DEFAULT_MINIMUM_DISPLAY_MS,
  timeoutMs,
  holdFadeOut = false,
}: Props) {
  const { isReady } = useAssetPreloader(sources, { minimumDisplayMs, timeoutMs });
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isReady || holdFadeOut) return;
    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_OUT_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, [isReady, holdFadeOut, opacity, onFinish]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { opacity }]}
      pointerEvents={isReady ? 'none' : 'auto'}
    >
      <StyloBrandView />
    </Animated.View>
  );
}
