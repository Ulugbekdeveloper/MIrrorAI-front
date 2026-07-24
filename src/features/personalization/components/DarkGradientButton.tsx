import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, silver, spacing, typography } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
};

export function DarkGradientButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shadow, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[silver[700], silver[800], silver[900]]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View pointerEvents="none" style={styles.sheen} />
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: radius.pill,
  },
  pressed: { transform: [{ scale: 0.985 }] },
  gradient: {
    borderRadius: radius.pill,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: overlay.whiteSoft,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: 1,
    backgroundColor: overlay.whiteMedium,
  },
  label: {
    ...typography.button,
    color: colors.white,
    fontWeight: '700',
    fontSize: 17,
  },
});
