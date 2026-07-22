import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import {
  useStyloForegroundSplash,
  type ForegroundSplashOptions,
} from '@/hooks/useStyloForegroundSplash';

import { StyloBrandView } from './StyloBrandView';

const FADE_OUT_MS = 350;

type Props = ForegroundSplashOptions & {
  children: ReactNode;
};

/**
 * Renders `children` (the live app) and overlays the Stylo brand screen on top
 * whenever the app returns to the foreground, for `durationMs`, then fades it
 * out to reveal the screen underneath. The overlay blocks touches while up.
 */
export function StyloSplashWrapper({ children, durationMs, showOnMount }: Props) {
  const active = useStyloForegroundSplash({ durationMs, showOnMount });

  // Keep the overlay mounted through its fade-out even after `active` flips
  // false, so it eases away instead of cutting to the app abruptly.
  const [mounted, setMounted] = useState(active);
  const opacity = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    if (active) {
      setMounted(true);
      // The brand view runs its own write-on entrance — the black backdrop
      // just needs to be present immediately, so snap opacity to full.
      opacity.setValue(1);
      return;
    }
    if (!mounted) return;
    const animation = Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_OUT_MS,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) setMounted(false);
    });
    return () => animation.stop();
  }, [active, mounted, opacity]);

  return (
    <View style={styles.root}>
      {children}
      {mounted ? (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="auto">
          <StyloBrandView />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
