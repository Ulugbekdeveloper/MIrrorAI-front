import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { slides } from '@/features/onboarding/slides';
import { secureStorage } from '@/lib/storage';
import { colors, overlay, spacing, typography } from '@/theme';
import { Button } from '@/ui';

// Matches the image's `transition={IMAGE_TRANSITION_MS}` below so the text
// fades in at the same pace the new image crossfades in — one motion,
// not two independently-timed ones.
const IMAGE_TRANSITION_MS = 300;

// How long a slide stays up before auto-advancing if the user doesn't tap.
const AUTO_ADVANCE_MS = 5000;

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const isLast = step === slides.length - 1;
  const slide = slides[step];

  // Text fade+slide, re-triggered every time `step` changes — synced to
  // the same moment the image swaps source and starts its own crossfade.
  const textAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    textAnim.setValue(0);
    Animated.timing(textAnim, {
      toValue: 1,
      duration: IMAGE_TRANSITION_MS,
      useNativeDriver: true,
    }).start();
  }, [step, textAnim]);

  const textTranslateY = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const goToLogin = async () => {
    // Marks this device as having seen onboarding — app/index.tsx checks
    // this flag so the carousel only ever shows once.
    await secureStorage.set('onboardingSeen', 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (isLast) {
      goToLogin();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  // Always points at the latest `handleNext` so the auto-advance timer
  // below never calls a stale closure without needing it in its deps.
  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;

  // Current segment's fill, 0 → 1 over AUTO_ADVANCE_MS. Doubles as both
  // the visible per-segment progress animation and the auto-advance
  // clock — when it completes uninterrupted, it advances the slide.
  // Manually tapping "Next" changes `step`, which resets this effect and
  // restarts the countdown, so auto-advance and manual taps never race.
  const segmentAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    segmentAnim.stopAnimation();
    segmentAnim.setValue(0);
    const animation = Animated.timing(segmentAnim, {
      toValue: 1,
      duration: AUTO_ADVANCE_MS,
      useNativeDriver: false, // width can't use the native driver
    });
    animation.start(({ finished }) => {
      if (finished) handleNextRef.current();
    });
    return () => animation.stop();
  }, [step, segmentAnim]);

  return (
    <View style={styles.root}>
      {/* Background image — crossfades on step change via expo-image's
          built-in `transition`. */}
      <Image
        source={slide.image}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={IMAGE_TRANSITION_MS}
      />

      {/* Solid black top → clear center → solid black bottom. The bottom
          zone is deliberately larger (starts fading in earlier, reaches
          full black sooner) so the title/description/button sit on solid
          black for maximum contrast. */}
      <LinearGradient
        colors={[colors.black, 'transparent', 'transparent', colors.black, colors.black]}
        locations={[0, 0.3, 0.5, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <View style={styles.progressRow}>
            {slides.map((_, index) => (
              <View key={index} style={styles.progressTrack}>
                {index < step ? (
                  <View style={[styles.progressFill, { width: '100%' }]} />
                ) : index === step ? (
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: segmentAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                ) : null}
              </View>
            ))}
          </View>

          <Pressable onPress={goToLogin} hitSlop={12}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        {/* Tap zones — left half steps back, right half steps forward, like
            Instagram Stories. This is a real flex sibling filling the gap
            between the top row and the bottom block, not an overlay, so it
            never competes with Skip/Button for touches — there's simply no
            overlap between them. */}
        <View style={styles.tapZones}>
          <Pressable style={styles.tapZoneLeft} onPress={handleBack} />
          <Pressable style={styles.tapZoneRight} onPress={handleNext} />
        </View>

        <View style={styles.bottomBlock}>
          <Animated.View
            style={[
              styles.textBlock,
              { opacity: textAnim, transform: [{ translateY: textTranslateY }] },
            ]}
          >
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </Animated.View>

          <Button
            label={isLast ? 'Get Started' : 'Next'}
            variant="cta"
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  safe: { flex: 1, paddingHorizontal: spacing.lg },

  // Fills the vertical gap between topRow and bottomBlock — this is where
  // the image is visible, so it doubles as the tap-to-navigate surface.
  tapZones: { flex: 1, flexDirection: 'row' },
  tapZoneLeft: { flex: 1 },
  tapZoneRight: { flex: 1 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: overlay.whiteStrong,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  skip: {
    ...typography.bodyStrong,
    color: overlay.whiteBright,
  },

  bottomBlock: {
    gap: spacing.xl,
    paddingBottom: spacing.md,
  },
  textBlock: { gap: spacing.sm },
  title: {
    ...typography.displaySm,
    color: colors.white,
  },
  description: {
    ...typography.body,
    color: overlay.whiteBody,
  },
});
