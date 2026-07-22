import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { getStyleTypeOptions, type StyleTypeKey } from '../../styleTypes';
import type { GenderKey } from '../../types';
import { StepHeading } from '../StepHeading';
import { StyleTypeCard } from '../StyleTypeCard';

type Props = {
  gender: GenderKey | null;
  selectedStyleType: StyleTypeKey | null;
  onSelectStyleType: (styleType: StyleTypeKey) => void;
};

export function StyleTypeStep({ gender, selectedStyleType, onSelectStyleType }: Props) {
  const options = getStyleTypeOptions(gender);

  return (
    <>
      <StepHeading
        title="Pick the style you love"
        subtitle="This helps Stylo tailor outfit picks to your taste"
      />
      <View style={styles.grid}>
        {options.map((option) => (
          <StyleTypeCard
            key={option.key}
            option={option}
            selected={option.key === selectedStyleType}
            onPress={() => onSelectStyleType(option.key)}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
    marginTop: spacing.md,
  },
});
