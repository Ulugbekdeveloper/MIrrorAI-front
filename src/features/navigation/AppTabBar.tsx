import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, overlay, radius, silver, spacing, typography } from '@/theme';

/**
 * The app's bottom navigation: a full-width frosted-glass bar with Wardrobe
 * (left), a raised "Try On" action button (center), and Profile (right). The
 * center button isn't a tab — it launches the full-screen try-on flow.
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
      <BlurView intensity={40} tint="systemThickMaterialDark" style={styles.bar}>
        <View style={[styles.barInner, { paddingBottom: (insets.bottom || spacing.sm) + spacing.xs }]}>
          <TabButton
            family="mci"
            icon="hanger"
            label="Wardrobe"
            focused={state.index === 0}
            onPress={() => goToTab(0)}
          />
          <View style={styles.centerGap} />
          <TabButton
            family="ion"
            icon="person"
            label="Profile"
            focused={state.index === 1}
            onPress={() => goToTab(1)}
          />
        </View>
      </BlurView>

      {/* Half-round bump — the bar rises in a semicircle to cradle the button.
          Rendered over the bar's center (same glass) so it blends seamlessly. */}
      <View style={styles.bumpWrap} pointerEvents="none">
        <View style={styles.bump}>
          <BlurView
            intensity={40}
            tint="systemThickMaterialDark"
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>

      {/* Raised center action — launches the try-on flow. */}
      <View style={styles.centerSlot} pointerEvents="box-none">
        <Pressable onPress={startTryOn} style={({ pressed }) => [pressed && styles.centerPressed]}>
          <LinearGradient
            colors={[colors.white, silver[100], silver[300]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.centerButton}
          >
            <Ionicons name="sparkles" size={26} color={colors.textOnLight} />
          </LinearGradient>
          <Text style={styles.centerLabel}>Try On</Text>
        </Pressable>
      </View>
    </View>
  );
}

type TabButtonProps = {
  family: 'mci' | 'ion';
  icon: string;
  label: string;
  focused: boolean;
  onPress: () => void;
};

function TabButton({ family, icon, label, focused, onPress }: TabButtonProps) {
  const color = focused ? colors.text : colors.textDim;
  return (
    <Pressable onPress={onPress} style={styles.tab} hitSlop={8}>
      {family === 'mci' ? (
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={24}
          color={color}
        />
      ) : (
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={color} />
      )}
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const CENTER = 62;
const BUMP_W = 94;
const BUMP_H = BUMP_W / 2; // semicircle
const BUMP_OVERLAP = 12; // extends into the bar so the flat base is hidden

const styles = StyleSheet.create({
  // Full-bleed: the bar spans the entire width and sits flush at the bottom.
  wrap: { alignSelf: 'stretch' },
  bar: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: overlay.whiteSoft,
    overflow: 'hidden',
    // Faint lift so the frosted glass reads as a bar even where the native
    // blur is weak (e.g. some Android devices).
    backgroundColor: overlay.whiteFaint,
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
    fontWeight: '700',
  },
  centerGap: { width: CENTER + spacing.md },
  // The half-round bump, centered on and rising above the bar's top edge.
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
    borderColor: overlay.whiteSoft,
    backgroundColor: overlay.whiteFaint,
    overflow: 'hidden',
  },
  // Overlays the bar's center gap; the button sits raised above the bar's top edge.
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
    borderWidth: 3,
    borderColor: colors.bg,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  centerLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: 2,
  },
});
