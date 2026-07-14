import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { SHOPPING_FREQUENCY_OPTIONS } from '../../options';
import type { ShoppingFrequencyKey } from '../../types';
import { OptionList } from '../OptionList';
import { StepHeading } from '../StepHeading';

type Props = {
  selectedFrequency: ShoppingFrequencyKey | null;
  onSelectFrequency: (frequency: ShoppingFrequencyKey) => void;
};

export function ShoppingFrequencyStep({ selectedFrequency, onSelectFrequency }: Props) {
  return (
    <View style={styles.content}>
      <StepHeading
        title="How often do you buy clothes?"
        subtitle="This helps us tailor styling tips to your shopping habits."
      />
      <OptionList
        options={SHOPPING_FREQUENCY_OPTIONS}
        selectedKey={selectedFrequency}
        onSelect={onSelectFrequency}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm },
});
