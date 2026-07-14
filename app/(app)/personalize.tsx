import { Animated, ScrollView, StyleSheet, View } from 'react-native';

import {
  AUTO_ADVANCE_DELAY_MS,
  BirthdayStep,
  CostPerWearStep,
  DiscoverySourceStep,
  GenderStep,
  isValidUsername,
  meetsMinimumAge,
  SelfieStep,
  ShoppingFrequencyStep,
  SkipButton,
  StyleGoalStep,
  UsernameStep,
  useLocationPermission,
  usePersonalizationAnswers,
  usePersonalizationFlow,
  useStepEntranceAnimation,
  WeatherPermissionStep,
  type DiscoverySourceKey,
} from '@/features/personalization';
import { useImagePicker } from '@/features/tryOn/hooks/useImagePicker';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { spacing } from '@/theme';
import { BackButton, Button, ScreenContainer } from '@/ui';

export default function PersonalizeScreen() {
  const { captureFromCamera, pickFromLibrary } = useImagePicker();
  const selfie = useTryOnDraftStore((state) => state.person);
  const setSelfie = useTryOnDraftStore((state) => state.setPerson);

  const flow = usePersonalizationFlow();
  const answers = usePersonalizationAnswers();
  const entrance = useStepEntranceAnimation(flow.step);
  const { requestLocationAccess } = useLocationPermission();

  const handleTakeSelfie = async () => {
    const image = await captureFromCamera();
    if (image) {
      setSelfie(image);
      flow.goToNextStep();
    }
  };

  const handleChooseFromLibrary = async () => {
    const image = await pickFromLibrary();
    if (image) {
      setSelfie(image);
      flow.goToNextStep();
    }
  };

  const handleSelectDiscoverySource = (source: DiscoverySourceKey) => {
    answers.setDiscoverySource(source);
    setTimeout(flow.goToNextStep, AUTO_ADVANCE_DELAY_MS);
  };

  const canLeaveBirthdayStep =
    answers.hasPickedBirthday && meetsMinimumAge(answers.birthday);

  const renderStep = () => {
    switch (flow.step) {
      case 'gender':
        return <GenderStep selectedGender={answers.gender} onSelectGender={answers.setGender} />;
      case 'style-goal':
        return (
          <StyleGoalStep selectedGoal={answers.styleGoal} onSelectGoal={answers.setStyleGoal} />
        );
      case 'selfie':
        return (
          <SelfieStep
            photo={selfie}
            onTakeSelfie={() => void handleTakeSelfie()}
            onChooseFromLibrary={() => void handleChooseFromLibrary()}
          />
        );
      case 'discovery-source':
        return (
          <DiscoverySourceStep
            selectedSource={answers.discoverySource}
            onSelectSource={handleSelectDiscoverySource}
          />
        );
      case 'weather-permission':
        return <WeatherPermissionStep onRequestAccess={() => void requestLocationAccess()} />;
      case 'birthday':
        return (
          <BirthdayStep
            birthday={answers.birthday}
            hasPickedBirthday={answers.hasPickedBirthday}
            onPickBirthday={answers.pickBirthday}
          />
        );
      case 'username':
        return <UsernameStep username={answers.username} onChangeUsername={answers.updateUsername} />;
      case 'shopping-frequency':
        return (
          <ShoppingFrequencyStep
            selectedFrequency={answers.shoppingFrequency}
            onSelectFrequency={answers.setShoppingFrequency}
          />
        );
      case 'cost-per-wear':
        return <CostPerWearStep />;
    }
  };

  const renderFooter = () => {
    switch (flow.step) {
      case 'gender':
        return (
          <Button label="Next" variant="cta" onPress={flow.goToNextStep} disabled={!answers.gender} />
        );
      case 'style-goal':
        return (
          <Button
            label="Next"
            variant="cta"
            onPress={flow.goToNextStep}
            disabled={!answers.styleGoal}
          />
        );
      case 'selfie':
      case 'discovery-source':
        return <SkipButton onPress={flow.goToNextStep} />;
      case 'weather-permission':
        return (
          <View style={styles.stackedFooter}>
            <Button label="Next" variant="cta" onPress={flow.goToNextStep} />
            <SkipButton onPress={flow.goToNextStep} />
          </View>
        );
      case 'birthday':
        return (
          <Button
            label="Next"
            variant="cta"
            onPress={flow.goToNextStep}
            disabled={!canLeaveBirthdayStep}
          />
        );
      case 'username':
        return (
          <Button
            label="Next"
            variant="cta"
            onPress={flow.goToNextStep}
            disabled={!isValidUsername(answers.username)}
          />
        );
      case 'shopping-frequency':
        return (
          <Button
            label="Next"
            variant="cta"
            onPress={flow.goToNextStep}
            disabled={!answers.shoppingFrequency}
          />
        );
      case 'cost-per-wear':
        return (
          <Button label="Next" variant="cta" onPress={() => void flow.finishPersonalization()} />
        );
    }
  };

  return (
    <ScreenContainer gradient>
      <View style={styles.headerRow}>
        {flow.isFirstStep ? null : <BackButton onPress={flow.goToPreviousStep} />}
      </View>

      <Animated.View
        style={[
          styles.stepContainer,
          { opacity: entrance.opacity, transform: [{ translateY: entrance.translateY }] },
        ]}
      >
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>{renderFooter()}</View>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', paddingTop: spacing.sm, minHeight: 44 },
  stepContainer: { flex: 1 },
  scrollArea: { flex: 1 },
  scrollContent: { gap: spacing.xl, paddingTop: spacing.md },
  footer: { paddingTop: spacing.lg, paddingBottom: spacing.md },
  stackedFooter: { gap: spacing.xs },
});
