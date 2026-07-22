import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export type ForegroundSplashOptions = {
  /** How long the overlay stays up each time it's triggered. Default 4000ms. */
  durationMs?: number;
  /** Also show once on mount (initial launch). Default false — in this app the
   * dedicated launch splash already covers first render, so the foreground
   * manager only handles background→active returns. */
  showOnMount?: boolean;
};

const DEFAULT_DURATION_MS = 4000;

/**
 * Drives a brand overlay that reappears whenever the app returns to the
 * foreground. Returns whether the overlay should currently be visible.
 *
 * Shows for exactly `durationMs` on each background/inactive → active
 * transition (and optionally once on mount), then auto-hides. Cleans up both
 * the timer and the AppState subscription on unmount.
 */
export function useStyloForegroundSplash(options: ForegroundSplashOptions = {}): boolean {
  const { durationMs = DEFAULT_DURATION_MS, showOnMount = false } = options;
  const [visible, setVisible] = useState(showOnMount);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    setVisible(true);
    clearTimer();
    // Re-arming (rapid foreground toggles) resets the full duration rather
    // than stacking timers, so the overlay always gets its complete window.
    timerRef.current = setTimeout(() => setVisible(false), durationMs);
  }, [clearTimer, durationMs]);

  useEffect(() => {
    if (showOnMount) show();

    const subscription = AppState.addEventListener('change', (nextState) => {
      const cameFromBackground =
        appState.current === 'background' || appState.current === 'inactive';
      if (cameFromBackground && nextState === 'active') {
        show();
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
      clearTimer();
    };
  }, [show, showOnMount, clearTimer]);

  return visible;
}
