import { useState } from 'react';

import type {
  DiscoverySourceKey,
  GenderKey,
  ShoppingFrequencyKey,
  StyleGoalKey,
} from '../types';

export function usePersonalizationAnswers() {
  const [gender, setGender] = useState<GenderKey | null>(null);
  const [styleGoal, setStyleGoal] = useState<StyleGoalKey | null>(null);
  const [discoverySource, setDiscoverySource] = useState<DiscoverySourceKey | null>(null);
  const [birthday, setBirthday] = useState(new Date());
  const [hasPickedBirthday, setHasPickedBirthday] = useState(false);
  const [username, setUsername] = useState('');
  const [shoppingFrequency, setShoppingFrequency] = useState<ShoppingFrequencyKey | null>(null);

  const pickBirthday = (date: Date) => {
    setBirthday(date);
    setHasPickedBirthday(true);
  };

  const updateUsername = (value: string) => {
    setUsername(value.trim());
  };

  return {
    gender,
    setGender,
    styleGoal,
    setStyleGoal,
    discoverySource,
    setDiscoverySource,
    birthday,
    hasPickedBirthday,
    pickBirthday,
    username,
    updateUsername,
    shoppingFrequency,
    setShoppingFrequency,
  };
}
