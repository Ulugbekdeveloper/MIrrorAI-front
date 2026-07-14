import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, spacing, typography } from '@/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  loading?: boolean;
};

const SIZE = 56;

export function CircleIconButton({ icon, label, onPress, loading }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <View style={styles.circle}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={styles.tint} />
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Ionicons name={icon} size={22} color={colors.text} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: spacing.xxs },
  pressed: { opacity: 0.7 },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: overlay.whiteMedium,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: overlay.whiteSoft,
  },
  label: { ...typography.caption, color: colors.textMuted },
});
