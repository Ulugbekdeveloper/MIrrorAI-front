import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { slides } from '@/features/onboarding/slides';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';
import { StyloSplashScreen } from '@/ui';
import type { PreloadableSource } from '@/hooks/useAssetPreloader';

// Sets the native window/root-view background (Android especially) so
// screen transitions never flash the platform default white — react-
// native-screens reveals this background for a frame or two mid-slide,
// underneath whatever the JS `contentStyle` paints.
void SystemUI.setBackgroundColorAsync(colors.bg);

// Module-level (not recreated per render) so useAssetPreloader's effect
// doesn't re-run every time RootLayout re-renders.
const ONBOARDING_IMAGE_SOURCES: PreloadableSource[] = slides.map((slide) => slide.image);

export default function RootLayout() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      }),
    [],
  );

  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  // The launch splash plays on every cold start (app freshly opened /
  // relaunched after being killed), not just the first time.
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const authReady = status !== 'unknown';
  const showApp = splashFinished && authReady;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* Dark status-bar icons for the light theme. The black splash sets
              its own `style="light"` while it's up. */}
          <StatusBar style="dark" />

          {showApp ? (
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
                // Matches the (auth) group's transition so onboarding →
                // login feels the same as login ↔ register.
                animation: 'slide_from_right',
                animationDuration: 220,
                gestureEnabled: true,
              }}
            />
          ) : (
            // Plain app-colored backdrop while auth hydrates — deliberately no
            // spinner, so there's no extra loader after the splash.
            <View style={styles.backdrop} />
          )}

          {/* Cold-start splash only (app freshly launched / relaunched after
              being killed). Warm foreground resumes do NOT re-show it — the JS
              process stays alive, so this component simply doesn't remount.
              It also preloads the onboarding images and holds its fade-out
              until auth hydrates. */}
          {!splashFinished ? (
            <StyloSplashScreen
              sources={ONBOARDING_IMAGE_SOURCES}
              holdFadeOut={!authReady}
              onFinish={() => setSplashFinished(true)}
            />
          ) : null}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  backdrop: { flex: 1, backgroundColor: colors.bg },
});
