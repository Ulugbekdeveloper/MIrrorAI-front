import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, silver, spacing, typography } from '@/theme';

/**
 * The app's bottom navigation: a black floating pill.
 *   • Wardrobe / Profile — icon tabs, active one brightens with a dot under it.
 *   • Try On (center) — the single prominent white action pill; launches the
 *     try-on flow rather than switching tabs.
 */
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const resetDraft = useTryOnDraftStore((store) => store.reset);
  const fabScale = useRef(new Animated.Value(1)).current;

  const startTryOn = () => {
    resetDraft();
    router.push('/(app)/try-on/studio');
  };

  const springFab = (toValue: number) =>
    Animated.spring(fabScale, { toValue, useNativeDriver: true, friction: 6, tension: 220 }).start();

  const goToTab = (index: number) => {
    const route = state.routes[index];
    const isFocused = state.index === index;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={styles.bar}>
        <TabButton
          icon="shirt"
          label="Wardrobe"
          focused={state.index === 0}
          onPress={() => goToTab(0)}
        />

        <Pressable
          onPress={startTryOn}
          onPressIn={() => springFab(0.92)}
          onPressOut={() => springFab(1)}
          hitSlop={8}
        >
          <Animated.View style={[styles.tryOn, { transform: [{ scale: fabScale }] }]}>
            <Ionicons name="sparkles" size={19} color={colors.black} />
            <Text style={styles.tryOnLabel}>Try On</Text>
          </Animated.View>
        </Pressable>

        <TabButton
          icon="person"
          label="Profile"
          focused={state.index === 1}
          onPress={() => goToTab(1)}
        />
      </View>
    </View>
  );
}

type TabButtonProps = {
  icon: 'shirt' | 'person';
  label: string;
  focused: boolean;
  onPress: () => void;
};

function TabButton({ icon, label, focused, onPress }: TabButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.tab} hitSlop={8} accessibilityLabel={label}>
      <Ionicons
        name={focused ? icon : (`${icon}-outline` as const)}
        size={23}
        color={focused ? colors.white : silver[400]}
      />
      <View style={[styles.dot, focused && styles.dotActive]} />
    </Pressable>
  );
}

const BAR_HEIGHT = 64;
const PILL = 46;

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: colors.black,
    paddingHorizontal: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  dotActive: { backgroundColor: colors.white },
  tryOn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: PILL,
    paddingHorizontal: spacing.md,
    borderRadius: PILL / 2,
    backgroundColor: colors.white,
    marginHorizontal: spacing.xs,
  },
  tryOnLabel: {
    ...typography.bodyStrong,
    fontSize: 14,
    fontWeight: '800',
    color: colors.black,
  },
});
