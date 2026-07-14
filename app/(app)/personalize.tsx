import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/stores/authStore';
import { colors, overlay, radius, spacing, typography } from '@/theme';
import { BackButton, Button, ScreenContainer } from '@/ui';

type GenderKey = 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
type GoalKey =
  | 'discover-style'
  | 'save-time'
  | 'try-before-buy'
  | 'outfit-inspiration'
  | 'shop-smarter'
  | 'just-exploring';

type Option<T extends string> = { key: T; label: string; emoji: string };

// Native emoji — renders as colorful, rounded avatars/glyphs on both
// platforms, matching the reference design more closely than a flat
// line-icon set could.
const GENDER_OPTIONS: Option<GenderKey>[] = [
  { key: 'woman', label: 'Woman', emoji: '👩' },
  { key: 'man', label: 'Man', emoji: '🧑' },
  { key: 'prefer-not-to-say', label: 'Prefer not to say', emoji: '🤷' },
];

const GOAL_OPTIONS: Option<GoalKey>[] = [
  { key: 'discover-style', label: 'Discover my personal style', emoji: '🎨' },
  { key: 'save-time', label: 'Save time getting dressed', emoji: '⏱️' },
  { key: 'try-before-buy', label: 'Try before I buy', emoji: '🛍️' },
  { key: 'outfit-inspiration', label: 'Get outfit inspiration', emoji: '✨' },
  { key: 'shop-smarter', label: 'Shop smarter and save money', emoji: '💳' },
  { key: 'just-exploring', label: 'Just exploring', emoji: '👀' },
];

type SourceKey =
  | 'google-play'
  | 'online-search'
  | 'chatgpt'
  | 'friends-family'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'other';

// Emoji analogs, not the real logos — Instagram/Facebook/TikTok/Google Play
// are trademarked brand marks with no accurate full-color asset bundled in
// this app, and the icon fonts available only have flat monochrome brand
// glyphs that would clash with the colorful emoji style used elsewhere on
// this screen. These are deliberately close-but-not-literal stand-ins.
const SOURCE_OPTIONS: Option<SourceKey>[] = [
  { key: 'google-play', label: 'Google Play', emoji: '▶️' },
  { key: 'online-search', label: 'Online Search', emoji: '🔍' },
  // { key: 'chatgpt', label: 'ChatGPT', emoji: '🤖' },
  { key: 'friends-family', label: 'Friends or Family', emoji: '👥' },
  { key: 'instagram', label: 'Instagram', emoji: '📸' },
  // { key: 'facebook', label: 'Facebook', emoji: '👍' },
  { key: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { key: 'other', label: 'Other', emoji: '🔮' },
];

type Step = 'gender' | 'goal' | 'source';

export default function PersonalizeScreen() {
  const router = useRouter();
  const completePersonalization = useAuthStore((s) => s.completePersonalization);

  const [step, setStep] = useState<Step>('gender');
  const [gender, setGender] = useState<GenderKey | null>(null);
  const [goal, setGoal] = useState<GoalKey | null>(null);
  const [source, setSource] = useState<SourceKey | null>(null);

  // Fade + slide between the two questions — same pattern used elsewhere
  // in the app (onboarding carousel) for step transitions.
  const contentAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    contentAnim.setValue(0);
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [step, contentAnim]);
  const contentTranslateY = contentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const handleContinueFromGender = () => {
    if (!gender) return;
    setStep('goal');
  };

  const handleContinueFromGoal = () => {
    if (!goal) return;
    setStep('source');
  };

  const handleFinish = async () => {
    // TODO(backend): persist { gender, goal, source } to a real
    // user-preferences endpoint once one exists (e.g. PATCH /auth/me).
    // Only the "seen" flag is durable right now — the answers themselves
    // aren't sent anywhere yet.
    await completePersonalization();
    router.replace('/(app)/home');
  };

  const handleSelectSource = (key: SourceKey) => {
    setSource(key);
    // Brief pause so the selection is visible before the screen advances —
    // there's no separate confirm step for this last, optional question.
    setTimeout(() => void handleFinish(), 200);
  };

  return (
    <ScreenContainer gradient>
      <View style={styles.headerRow}>
        {step === 'goal' ? <BackButton onPress={() => setStep('gender')} /> : null}
        {step === 'source' ? <BackButton onPress={() => setStep('goal')} /> : null}
      </View>

      <Animated.View
        style={[
          styles.animWrap,
          { opacity: contentAnim, transform: [{ translateY: contentTranslateY }] },
        ]}
      >
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 'gender' ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>What&apos;s your gender?</Text>
                <Text style={styles.subtitle}>
                  We ask this to personalize the styling for you
                </Text>
              </View>

              <View style={styles.optionList}>
                {GENDER_OPTIONS.map((option) => (
                  <OptionRow
                    key={option.key}
                    option={option}
                    selected={gender === option.key}
                    onPress={() => setGender(option.key)}
                  />
                ))}
              </View>
            </>
          ) : step === 'goal' ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>What do you want most from Stylo?</Text>
              </View>

              <View style={styles.optionList}>
                {GOAL_OPTIONS.map((option) => (
                  <OptionRow
                    key={option.key}
                    option={option}
                    selected={goal === option.key}
                    onPress={() => setGoal(option.key)}
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>How did you find out about us?</Text>
              </View>

              <View style={styles.optionList}>
                {SOURCE_OPTIONS.map((option) => (
                  <OptionRow
                    key={option.key}
                    option={option}
                    selected={source === option.key}
                    onPress={() => handleSelectSource(option.key)}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>

        {/* Fixed footer — always the same position regardless of how much
            content is above it, instead of trailing the scrollable list. */}
        <View style={styles.footer}>
          {step === 'source' ? (
            <Pressable onPress={handleFinish} style={styles.skipButton} hitSlop={12}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          ) : (
            <Button
              label="Next"
              variant="cta"
              onPress={step === 'gender' ? handleContinueFromGender : handleContinueFromGoal}
              disabled={step === 'gender' ? !gender : !goal}
            />
          )}
        </View>
      </Animated.View>
    </ScreenContainer>
  );
}

/** Icon-in-circle + label row, shared by both questions on this screen. */
function OptionRow<T extends string>({
  option,
  selected,
  onPress,
}: {
  option: Option<T>;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionRow, selected && styles.optionRowSelected]}
    >
      <View style={[styles.optionIconWrap, selected && styles.optionIconWrapSelected]}>
        <Text style={styles.optionEmoji}>{option.emoji}</Text>
      </View>
      <Text style={styles.optionLabel}>{option.label}</Text>
      {selected ? <Ionicons name="checkmark-circle" size={22} color={colors.white} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', paddingTop: spacing.sm, minHeight: 44 },
  animWrap: { flex: 1 },
  scrollFlex: { flex: 1 },
  scroll: { gap: spacing.xl, paddingTop: spacing.md },
  footer: { paddingTop: spacing.lg, paddingBottom: spacing.md },
  skipButton: { alignSelf: 'center', paddingVertical: spacing.sm },
  skipText: { ...typography.bodyStrong, color: colors.text },
  header: { gap: spacing.xs },
  title: {
    ...typography.displaySm,
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: { ...typography.body, color: colors.textMuted },

  optionList: { gap: spacing.sm },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: overlay.whiteSoft,
    backgroundColor: overlay.whiteFaint,
  },
  optionRowSelected: {
    borderColor: overlay.whiteBorder,
    backgroundColor: overlay.whiteSoft,
  },
  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSubtle,
  },
  optionIconWrapSelected: { backgroundColor: overlay.whiteMedium },
  optionEmoji: { fontSize: 22 },
  optionLabel: { ...typography.bodyStrong, color: colors.text, flex: 1 },
});
