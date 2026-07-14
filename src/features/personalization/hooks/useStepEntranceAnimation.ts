import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import type { PersonalizationStep } from '../types';

const ENTRANCE_DURATION_MS = 250;
const ENTRANCE_OFFSET_Y = 16;

export function useStepEntranceAnimation(step: PersonalizationStep) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: ENTRANCE_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [step, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [ENTRANCE_OFFSET_Y, 0],
  });

  return { opacity: progress, translateY };
}
