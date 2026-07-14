import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useImagePicker } from '@/features/tryOn/hooks/useImagePicker';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { useAuthStore } from '@/stores/authStore';
import { colors, overlay, radius, silver, spacing, typography } from '@/theme';
import { BackButton, Button, ScreenContainer, TextField } from '@/ui';

const SELFIE_ICON = require('@assets/brand/selfie.jpg');
const MAP_IMAGE = require('@assets/brand/map.webp');
const TOP_IMAGE = require('@assets/brand/top.avif');
const COSTUME_IMAGE = require('@assets/brand/costume.avif');

type GenderKey = 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
type GoalKey =
  | 'discover-style'
  | 'save-time'
  | 'try-before-buy'
  | 'outfit-inspiration'
  | 'shop-smarter'
  | 'just-exploring';

type Option<T extends string> = { key: T; label: string; emoji?: string };

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

type ShoppingKey = 'weekly' | 'monthly' | 'seasonally' | 'rarely';

// No emoji for this list — Option's `emoji` field is optional specifically
// so this step can reuse OptionRow without forking a near-identical
// icon-less variant.
const SHOPPING_OPTIONS: Option<ShoppingKey>[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'seasonally', label: 'Seasonally' },
  { key: 'rarely', label: 'Rarely' },
];

type Step =
  | 'gender'
  | 'goal'
  | 'photo'
  | 'source'
  | 'weather'
  | 'birthday'
  | 'username'
  | 'shopping'
  | 'fits';

const MIN_AGE = 13;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

function isOldEnough(date: Date): boolean {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - MIN_AGE);
  return date <= cutoff;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isValidUsername(value: string): boolean {
  return value.length >= USERNAME_MIN_LENGTH && USERNAME_PATTERN.test(value);
}

export default function PersonalizeScreen() {
  const router = useRouter();
  const completePersonalization = useAuthStore((s) => s.completePersonalization);
  const { captureFromCamera, pickFromLibrary } = useImagePicker();
  const person = useTryOnDraftStore((s) => s.person);
  const setPerson = useTryOnDraftStore((s) => s.setPerson);

  const [step, setStep] = useState<Step>('gender');
  const [gender, setGender] = useState<GenderKey | null>(null);
  const [goal, setGoal] = useState<GoalKey | null>(null);
  const [source, setSource] = useState<SourceKey | null>(null);
  const [birthday, setBirthday] = useState(new Date());
  const [birthdayTouched, setBirthdayTouched] = useState(false);
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [username, setUsername] = useState('');
  const [shoppingFrequency, setShoppingFrequency] = useState<ShoppingKey | null>(null);

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
    setStep('photo');
  };

  const handleCameraPress = async () => {
    const img = await captureFromCamera();
    if (img) {
      setPerson(img);
      setStep('source');
    }
  };

  const handleLibraryPress = async () => {
    const img = await pickFromLibrary();
    if (img) {
      setPerson(img);
      setStep('source');
    }
  };

  const handleFinish = async () => {
    // TODO(backend): persist { gender, goal, source, locationGranted,
    // birthday, username, shoppingFrequency } to a real user-preferences
    // endpoint once one exists (e.g. PATCH /auth/me). Only the "seen" flag
    // is durable right now — the answers themselves aren't sent anywhere
    // yet. Username specifically also needs a real availability check
    // against the backend — "Username is available" below is a client-side
    // format check only, not a real uniqueness check.
    await completePersonalization();
    router.replace('/(app)/home');
  };

  const handleSelectSource = (key: SourceKey) => {
    setSource(key);
    // Brief pause so the selection is visible before the screen advances.
    setTimeout(() => setStep('weather'), 200);
  };

  // Real permission request — this screen mimics the look of the native
  // iOS prompt as a "primer," but the actual system dialog still appears
  // on top when this fires (only if not already decided — the OS only
  // shows its dialog once; a prior grant/deny just re-resolves silently).
  // If it's already permanently denied, fall back to prompting Settings
  // instead of leaving the tap looking like it did nothing. Never blocks
  // progress either way: the user can still tap Next below regardless.
  const handleRequestLocation = async () => {
    try {
      const res = await Location.requestForegroundPermissionsAsync();
      if (res.granted || res.canAskAgain) return;
      Alert.alert(
        'Location needed',
        'Enable location access in Settings to get weather-based outfit suggestions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    } catch {
      Alert.alert(
        'Something went wrong',
        'Could not request location access. Make sure location services are turned on for this device.',
      );
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === 'dismissed') return;
    if (selected) {
      setBirthday(selected);
      setBirthdayTouched(true);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: birthday,
        mode: 'date',
        maximumDate: new Date(),
        onChange: handleDateChange,
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  const canContinueBirthday = birthdayTouched && isOldEnough(birthday);

  const handleContinueFromUsername = () => {
    if (!isValidUsername(username)) return;
    setStep('shopping');
  };

  return (
    <ScreenContainer gradient>
      <View style={styles.headerRow}>
        {step === 'goal' ? <BackButton onPress={() => setStep('gender')} /> : null}
        {step === 'photo' ? <BackButton onPress={() => setStep('goal')} /> : null}
        {step === 'source' ? <BackButton onPress={() => setStep('photo')} /> : null}
        {step === 'weather' ? <BackButton onPress={() => setStep('source')} /> : null}
        {step === 'birthday' ? <BackButton onPress={() => setStep('weather')} /> : null}
        {step === 'username' ? <BackButton onPress={() => setStep('birthday')} /> : null}
        {step === 'shopping' ? <BackButton onPress={() => setStep('username')} /> : null}
        {step === 'fits' ? <BackButton onPress={() => setStep('shopping')} /> : null}
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
          ) : step === 'photo' ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Add a selfie to try on outfits with AI</Text>
                <Text style={styles.subtitle}>
                  We also customize outfit suggestions based on your facial features.
                </Text>
              </View>

              <View style={styles.photoPreview}>
                <Image
                  source={person ? { uri: person.uri } : SELFIE_ICON}
                  style={styles.photoImage}
                  contentFit="cover"
                />
              </View>

              <View style={styles.photoActions}>
                <Button label="Take a selfie" variant="cta" onPress={handleCameraPress} />
                <DarkGradientButton label="Choose from library" onPress={handleLibraryPress} />
              </View>
            </>
          ) : step === 'source' ? (
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
          ) : step === 'weather' ? (
            <View style={styles.weatherContent}>
              <View style={styles.header}>
                <Text style={styles.weatherTitle}>
                  Dress according to the weather near you
                </Text>
              </View>

              <View style={styles.permissionCard}>
                <Text style={styles.permissionTitle}>
                  Allow &ldquo;Stylo&rdquo; to use your location?
                </Text>

                <View style={styles.permissionMapWrap}>
                  <Image source={MAP_IMAGE} style={styles.permissionMap} contentFit="cover" />
                </View>

                <Pressable
                  style={styles.permissionOption}
                  onPress={() => void handleRequestLocation()}
                >
                  <Text style={styles.permissionOptionText}>Allow While Using App</Text>
                </Pressable>
                <Pressable
                  style={styles.permissionOption}
                  onPress={() => void handleRequestLocation()}
                >
                  <Text style={styles.permissionOptionText}>Allow Once</Text>
                </Pressable>
                <Pressable style={styles.permissionOption}>
                  <Text style={styles.permissionOptionText}>Don&apos;t Allow</Text>
                </Pressable>
              </View>

              <Text style={styles.permissionCaption}>
                Tap &apos;Allow While Using App&apos; to get updated weather info when
                travelling.
              </Text>
            </View>
          ) : step === 'birthday' ? (
            <View style={styles.weatherContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Add your date of birth</Text>
                <Text style={styles.subtitle}>
                  This won&apos;t be part of your profile, but we need to ensure you are
                  at least {MIN_AGE} years old.
                </Text>
              </View>

              <Pressable style={styles.dateField} onPress={openDatePicker}>
                <Text style={styles.dateFieldText}>{formatDate(birthday)}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
              </Pressable>

              {birthdayTouched && !isOldEnough(birthday) ? (
                <Text style={styles.dateFieldError}>
                  You must be at least {MIN_AGE} years old to use Stylo.
                </Text>
              ) : null}

              {Platform.OS === 'ios' && showIOSPicker ? (
                <View style={styles.iosPickerWrap}>
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                    textColor={colors.text}
                  />
                  <Button
                    label="Done"
                    variant="secondary"
                    onPress={() => setShowIOSPicker(false)}
                  />
                </View>
              ) : null}
            </View>
          ) : step === 'username' ? (
            <View style={styles.weatherContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Create username</Text>
                <Text style={styles.subtitle}>You can change this at any time.</Text>
              </View>

              <TextField
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={USERNAME_MAX_LENGTH}
                value={username}
                onChangeText={(text) => setUsername(text.trim())}
              />

              <Text style={styles.usernameCounter}>
                {username.length}/{USERNAME_MAX_LENGTH}
              </Text>

              {isValidUsername(username) ? (
                <View style={styles.usernameValidRow}>
                  <Ionicons name="checkmark" size={16} color={colors.success} />
                  <Text style={styles.usernameValidText}>Username is available</Text>
                </View>
              ) : username.length > 0 ? (
                <Text style={styles.dateFieldError}>
                  At least {USERNAME_MIN_LENGTH} characters — letters, numbers, and
                  underscores only.
                </Text>
              ) : null}
            </View>
          ) : step === 'shopping' ? (
            <View style={styles.weatherContent}>
              <View style={styles.header}>
                <Text style={styles.title}>How often do you buy clothes?</Text>
                <Text style={styles.subtitle}>
                  This helps us tailor styling tips to your shopping habits.
                </Text>
              </View>

              <View style={styles.optionList}>
                {SHOPPING_OPTIONS.map((option) => (
                  <OptionRow
                    key={option.key}
                    option={option}
                    selected={shoppingFrequency === option.key}
                    onPress={() => setShoppingFrequency(option.key)}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.weatherContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Fits helps you make better purchases</Text>
              </View>

              <View style={styles.fitsCardsRow}>
                <View style={[styles.fitsCard, styles.fitsCardMostWorn]}>
                  <Text style={styles.fitsCardLabel}>Most worn</Text>
                  <View style={styles.fitsCardImageWrap}>
                    <Image source={TOP_IMAGE} style={styles.fitsCardImage} contentFit="contain" />
                  </View>
                  <Text style={styles.fitsCardPrice}>$0.12</Text>
                  <Text style={styles.fitsCardCaption}>cost per wear</Text>
                </View>

                <View style={[styles.fitsCard, styles.fitsCardRarelyWorn]}>
                  <View style={styles.fitsCardLabelRarelyWrap}>
                    <Text style={styles.fitsCardLabelRarely}>Rarely worn</Text>
                  </View>
                  <View style={styles.fitsCardImageWrap}>
                    <Image
                      source={COSTUME_IMAGE}
                      style={styles.fitsCardImage}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.fitsCardPrice}>$17.50</Text>
                  <Text style={styles.fitsCardCaption}>cost per wear</Text>
                </View>
              </View>

              <View style={styles.fitsBenefitList}>
                <FitsBenefit label="Reduce impulse buys" />
                <FitsBenefit label="Find meaningful pieces" />
                <FitsBenefit label="Sell or donate what you're not wearing" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Fixed footer — always the same position regardless of how much
            content is above it, instead of trailing the scrollable list. */}
        <View style={styles.footer}>
          {step === 'gender' || step === 'goal' ? (
            <Button
              label="Next"
              variant="cta"
              onPress={step === 'gender' ? handleContinueFromGender : handleContinueFromGoal}
              disabled={step === 'gender' ? !gender : !goal}
            />
          ) : step === 'weather' ? (
            // Never gated on a permission choice — granted or denied or
            // untouched, the user can always move on.
            <View style={styles.weatherFooter}>
              <Button label="Next" variant="cta" onPress={() => setStep('birthday')} />
              <Pressable
                onPress={() => setStep('birthday')}
                style={styles.skipButton}
                hitSlop={12}
              >
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </View>
          ) : step === 'birthday' ? (
            // Age-gated, unlike the other optional steps — no Skip here.
            <Button
              label="Next"
              variant="cta"
              onPress={() => setStep('username')}
              disabled={!canContinueBirthday}
            />
          ) : step === 'username' ? (
            <Button
              label="Next"
              variant="cta"
              onPress={handleContinueFromUsername}
              disabled={!isValidUsername(username)}
            />
          ) : step === 'shopping' ? (
            <Button
              label="Next"
              variant="cta"
              onPress={() => setStep('fits')}
              disabled={!shoppingFrequency}
            />
          ) : step === 'fits' ? (
            <Button label="Next" variant="cta" onPress={handleFinish} />
          ) : (
            <Pressable
              onPress={step === 'photo' ? () => setStep('source') : () => setStep('weather')}
              style={styles.skipButton}
              hitSlop={12}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>
    </ScreenContainer>
  );
}

/** Dark charcoal gradient pill — same size as the white `cta` Button, distinct fill. */
function DarkGradientButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.darkButtonShadow, pressed && styles.darkButtonPressed]}
    >
      <LinearGradient
        colors={[silver[700], silver[800], silver[900]]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.darkButtonGradient}
      >
        <View pointerEvents="none" style={styles.darkButtonSheen} />
        <Text style={styles.darkButtonLabel}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** Checkmark + label row used on the "Fits helps you make better purchases" step. */
function FitsBenefit({ label }: { label: string }) {
  return (
    <View style={styles.fitsBenefitRow}>
      <Ionicons name="checkmark" size={18} color={colors.text} />
      <Text style={styles.fitsBenefitLabel}>{label}</Text>
    </View>
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
      {option.emoji ? (
        <View style={[styles.optionIconWrap, selected && styles.optionIconWrapSelected]}>
          <Text style={styles.optionEmoji}>{option.emoji}</Text>
        </View>
      ) : null}
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
  weatherFooter: { gap: spacing.xs },
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

  photoPreview: {
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  photoActions: { gap: spacing.sm },

  darkButtonShadow: {
    borderRadius: radius.pill,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  darkButtonPressed: { transform: [{ scale: 0.985 }] },
  darkButtonGradient: {
    borderRadius: radius.pill,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: overlay.whiteSoft,
  },
  darkButtonSheen: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: 1,
    backgroundColor: overlay.whiteMedium,
  },
  darkButtonLabel: {
    ...typography.button,
    color: colors.text,
    fontWeight: '700',
    fontSize: 17,
  },

  // This step's own container — mirrors the reference's generous gap
  // between the title and the card (via permissionCard's marginTop below)
  // while still relying on the outer ScrollView as a safety net on the
  // smallest screens.
  weatherContent: { gap: spacing.sm },
  weatherTitle: {
    ...typography.displaySm,
    color: colors.text,
    letterSpacing: -0.3,
  },

  // Deliberately light, breaking from the app's dark theme — this mimics
  // the real native permission dialog, which is always light regardless
  // of the app's own styling. That's the point: it should look like the
  // actual system prompt that appears when "Allow" is tapped.
  permissionCard: {
    marginTop: spacing.xxl,
    backgroundColor: silver[100],
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  permissionTitle: {
    ...typography.bodyStrong,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  permissionMapWrap: {
    aspectRatio: 1.4,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  permissionMap: { width: '100%', height: '100%' },
  permissionOption: {
    backgroundColor: silver[200],
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  permissionOptionText: {
    ...typography.bodyStrong,
    color: colors.textOnLight,
  },
  permissionCaption: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },

  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: overlay.whiteSoft,
    backgroundColor: overlay.whiteFaint,
  },
  dateFieldText: { ...typography.bodyStrong, color: colors.text },
  dateFieldError: { ...typography.caption, color: colors.danger },
  iosPickerWrap: {
    gap: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: overlay.whiteFaint,
    padding: spacing.sm,
  },

  usernameCounter: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: -spacing.xs,
  },
  usernameValidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  usernameValidText: { ...typography.caption, color: colors.success },

  fitsCardsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'flex-start',
  },
  fitsCard: {
    flex: 1,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: overlay.whiteSoft,
    backgroundColor: overlay.whiteFaint,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  fitsCardMostWorn: {
    marginTop: spacing.md,
  },
  fitsCardRarelyWorn: {
    borderColor: withAlphaSafe(colors.danger, 0.4),
  },
  fitsCardLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  fitsCardLabelRarelyWrap: {
    alignSelf: 'stretch',
    marginHorizontal: -spacing.sm,
    marginTop: -spacing.md,
    paddingVertical: spacing.xs,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: withAlphaSafe(colors.danger, 0.15),
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  fitsCardLabelRarely: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
  },
  fitsCardImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  fitsCardImage: { width: '100%', height: '100%' },
  fitsCardPrice: {
    ...typography.bodyStrong,
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  fitsCardCaption: {
    ...typography.caption,
    color: colors.textMuted,
  },

  fitsBenefitList: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  fitsBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fitsBenefitLabel: {
    ...typography.bodyStrong,
    color: colors.text,
    flex: 1,
  },
});

/** Local helper — `colors.danger` is a solid hex; overlay tints for the
 * "Rarely worn" card aren't in the theme's overlay set, so mix here. */
function withAlphaSafe(hex: string, alpha: number): string {
  const clamped = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${clamped}`;
}
