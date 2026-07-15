import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { STYLE_TYPE_OPTIONS, type StyleTypeKey } from '../../styleTypes';
import { StepHeading } from '../StepHeading';
import { StyleTypeCard } from '../StyleTypeCard';

type Props = {
  selectedStyleType: StyleTypeKey | null;
  onSelectStyleType: (styleType: StyleTypeKey) => void;
};

export function StyleTypeStep({ selectedStyleType, onSelectStyleType }: Props) {
  return (
    <>
      <StepHeading
        title="Pick the style you love"
        subtitle="This helps Stylo tailor outfit picks to your taste"
      />
      <View style={styles.grid}>
        {STYLE_TYPE_OPTIONS.map((option) => (
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
