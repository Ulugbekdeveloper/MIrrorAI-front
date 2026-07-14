import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import type { SelectableOption } from '../types';
import { OptionRow } from './OptionRow';

type Props<TKey extends string> = {
  options: SelectableOption<TKey>[];
  selectedKey: TKey | null;
  onSelect: (key: TKey) => void;
};

export function OptionList<TKey extends string>({ options, selectedKey, onSelect }: Props<TKey>) {
  return (
    <View style={styles.list}>
      {options.map((option) => (
        <OptionRow
          key={option.key}
          option={option}
          selected={option.key === selectedKey}
          onPress={() => onSelect(option.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
});
