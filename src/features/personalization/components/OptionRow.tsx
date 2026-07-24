import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';

import type { SelectableOption } from '../types';

type Props<TKey extends string> = {
  option: SelectableOption<TKey>;
  selected: boolean;
  onPress: () => void;
};

export function OptionRow<TKey extends string>({ option, selected, onPress }: Props<TKey>) {
  return (
    <Pressable onPress={onPress} style={[styles.row, selected && styles.rowSelected]}>
      {option.emoji ? (
        <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
          <Text style={styles.emoji}>{option.emoji}</Text>
        </View>
      ) : null}
      <View style={styles.textWrap}>
        <Text style={styles.label}>{option.label}</Text>
        {option.description ? (
          <Text style={styles.description}>{option.description}</Text>
        ) : null}
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={22} color={colors.text} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
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
  rowSelected: {
    borderColor: colors.black,
    backgroundColor: overlay.whiteSoft,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSubtle,
  },
  iconWrapSelected: { backgroundColor: overlay.whiteMedium },
  emoji: { fontSize: 22 },
  textWrap: { flex: 1, gap: 2 },
  label: { ...typography.bodyStrong, color: colors.text },
  description: { ...typography.caption, color: colors.textMuted },
});
