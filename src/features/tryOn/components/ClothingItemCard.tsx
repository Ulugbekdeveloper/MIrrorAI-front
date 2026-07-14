import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import type { ClothingItem } from '../catalog';

type Props = {
  item: ClothingItem;
  selected: boolean;
  onPress: () => void;
};

const CARD_SIZE = 92;

export function ClothingItemCard({ item, selected, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Both animations only ever touch `transform`/`opacity` — the two
    // style props the native driver supports — and each lives on its own
    // Animated.View below, so there's no risk of one view's style tree
    // mixing a native-driven node with a JS-driven one.
    Animated.spring(scale, {
      toValue: selected ? 1.06 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
    Animated.timing(glow, {
      toValue: selected ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selected, scale, glow]);

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <Animated.View style={[styles.shell, { transform: [{ scale }] }]}>
        <View style={styles.clip}>
          <View style={[styles.swatch, { backgroundColor: item.swatch }]} />
        </View>

        {/* Glow — border + shadow are static; only opacity animates. Sits
            as a sibling of `clip` (not inside it) so its shadow isn't cut
            off by `clip`'s overflow:hidden. */}
        <Animated.View pointerEvents="none" style={[styles.glow, { opacity: glow }]} />
      </Animated.View>
      <Text style={styles.label} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: CARD_SIZE, gap: spacing.xxs, alignItems: 'center' },
  shell: {
    width: CARD_SIZE,
    height: CARD_SIZE,
  },
  clip: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  swatch: { flex: 1 },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    maxWidth: CARD_SIZE,
  },
});
