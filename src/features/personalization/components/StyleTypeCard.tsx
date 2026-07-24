import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';

import type { StyleTypeOption } from '../styleTypes';

type Props = {
  option: StyleTypeOption;
  selected: boolean;
  onPress: () => void;
};

export function StyleTypeCard({ option, selected, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Selection only fades the border/glow in — the image itself never
    // scales or otherwise changes appearance when picked.
    Animated.timing(glow, {
      toValue: selected ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selected, glow]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 7,
      tension: 120,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 90,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.shell, { transform: [{ scale }] }]}>
        <Image source={option.image} style={styles.image} contentFit="cover" />

        <LinearGradient
          colors={['transparent', overlay.blackFaint, overlay.blackStrong]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <Text style={styles.label} numberOfLines={1}>
          {option.label}
        </Text>

        {selected ? (
          <View style={styles.badge}>
            <Ionicons name="checkmark" size={15} color={colors.white} />
          </View>
        ) : null}
      </Animated.View>

      {/* Selection ring — a plain border, no shadow/elevation blur. */}
      <Animated.View pointerEvents="none" style={[styles.selectionRing, { opacity: glow }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '48%', aspectRatio: 2 / 3 },
  shell: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: overlay.whiteSoft,
    justifyContent: 'flex-end',
  },
  image: { ...StyleSheet.absoluteFillObject },
  label: {
    ...typography.bodyStrong,
    color: colors.white,
    padding: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  selectionRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.black,
  },
});
