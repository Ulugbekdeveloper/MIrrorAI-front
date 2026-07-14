import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useAuthStore } from '@/stores/authStore';

import { PERSONALIZATION_STEPS } from '../constants';
import type { PersonalizationStep } from '../types';

export function usePersonalizationFlow() {
  const router = useRouter();
  const completePersonalization = useAuthStore((state) => state.completePersonalization);
  const [step, setStep] = useState<PersonalizationStep>(PERSONALIZATION_STEPS[0]);

  const stepIndex = PERSONALIZATION_STEPS.indexOf(step);
  const isFirstStep = stepIndex === 0;

  const goToNextStep = () => {
    const nextStep = PERSONALIZATION_STEPS[stepIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const goToPreviousStep = () => {
    const previousStep = PERSONALIZATION_STEPS[stepIndex - 1];
    if (previousStep) setStep(previousStep);
  };

  const finishPersonalization = async () => {
    await completePersonalization();
    router.replace('/(app)/home');
  };

  return { step, isFirstStep, goToNextStep, goToPreviousStep, finishPersonalization };
}
