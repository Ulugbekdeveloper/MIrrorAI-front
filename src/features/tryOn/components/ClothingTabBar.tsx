import { LayoutAnimation, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import { CLOTHING_TABS, type ClothingCategory } from '../catalog';

type Props = {
  active: ClothingCategory;
  onChange: (category: ClothingCategory) => void;
};

export function ClothingTabBar({ active, onChange }: Props) {
  const handlePress = (key: ClothingCategory) => {
    if (key === active) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(key);
  };

  return (
    <View style={styles.row}>
      {CLOTHING_TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => handlePress(tab.key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: colors.white,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.textOnLight,
  },
});
