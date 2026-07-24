import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, overlay, radius, silver, spacing, typography } from '@/theme';

/**
 * The app's bottom navigation: a crisp white bar with Wardrobe (left), a raised
 * black "Try On" action button (center), and Profile (right). The center button
 * isn't a tab — it launches the full-screen try-on flow.
 */
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const resetDraft = useTryOnDraftStore((store) => store.reset);

  const startTryOn = () => {
    resetDraft();
    router.push('/(app)/try-on/studio');
  };

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
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <View style={[styles.barInner, { paddingBottom: (insets.bottom || spacing.sm) + spacing.xs }]}>
          <TabButton
            icon="shirt"
            label="Wardrobe"
            focused={state.index === 0}
            onPress={() => goToTab(0)}
          />
          <View style={styles.centerGap} />
          <TabButton
            icon="person"
            label="Profile"
            focused={state.index === 1}
            onPress={() => goToTab(1)}
          />
        </View>
      </View>

      {/* Half-round bump — the bar rises in a semicircle to cradle the button. */}
      <View style={styles.bumpWrap} pointerEvents="none">
        <View style={styles.bump} />
      </View>

      {/* Raised center action — launches the try-on flow. */}
      <View style={styles.centerSlot} pointerEvents="box-none">
        <Pressable onPress={startTryOn} style={({ pressed }) => [pressed && styles.centerPressed]}>
          <LinearGradient
            colors={[silver[800], silver[950], colors.black]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.centerButton}
          >
            <Ionicons name="sparkles" size={25} color={colors.white} />
          </LinearGradient>
          <Text style={styles.centerLabel}>Try On</Text>
        </Pressable>
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
    <Pressable onPress={onPress} style={styles.tab} hitSlop={8}>
      <Ionicons
        name={focused ? icon : `${icon}-outline`}
        size={23}
        color={focused ? colors.text : colors.textDim}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? colors.text : colors.textDim, fontWeight: focused ? '800' : '600' },
        ]}
      >
        {label}
      </Text>
      <View style={[styles.dot, focused && styles.dotActive]} />
    </Pressable>
  );
}

const CENTER = 60;
const BUMP_W = 92;
const BUMP_H = BUMP_W / 2;
const BUMP_OVERLAP = 12;

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  bar: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: overlay.whiteMedium,
    backgroundColor: colors.surfaceElevated,
  },
  barInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 11,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
    backgroundColor: 'transparent',
  },
  dotActive: { backgroundColor: colors.text },
  centerGap: { width: CENTER + spacing.md },
  bumpWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -BUMP_H,
    alignItems: 'center',
  },
  bump: {
    width: BUMP_W,
    height: BUMP_H + BUMP_OVERLAP,
    borderTopLeftRadius: BUMP_W / 2,
    borderTopRightRadius: BUMP_W / 2,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: overlay.whiteMedium,
    backgroundColor: colors.surfaceElevated,
  },
  centerSlot: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    top: -CENTER / 2 - 10,
  },
  centerPressed: { transform: [{ scale: 0.94 }] },
  centerButton: {
    width: CENTER,
    height: CENTER,
    borderRadius: CENTER / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.bg,
  },
  centerLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: 3,
  },
});
