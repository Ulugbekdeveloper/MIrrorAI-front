import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  label: string;
  hint: string;
  uri: string | null;
  onPressCamera: () => void;
  onPressLibrary: () => void;
  onClear?: () => void;
};

export function ImagePickerCard({
  label,
  hint,
  uri,
  onPressCamera,
  onPressLibrary,
  onClear,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {uri ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri }} style={styles.preview} contentFit="cover" />
          {onClear ? (
            <Pressable style={styles.clear} onPress={onClear} hitSlop={12}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={styles.emptyPreview}>
          <Text style={styles.emptyHint}>{hint}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={onPressCamera}>
          <Text style={styles.actionText}>Camera</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={onPressLibrary}>
          <Text style={styles.actionText}>Gallery</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: { ...typography.titleSm, color: colors.text },
  previewWrap: {
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  preview: { width: '100%', height: '100%' },
  emptyPreview: {
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyHint: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  clear: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  clearText: { ...typography.caption, color: colors.text, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: { ...typography.bodyStrong, color: colors.text },
});
