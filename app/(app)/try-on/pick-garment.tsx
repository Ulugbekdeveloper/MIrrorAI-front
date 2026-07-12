import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ImagePickerCard } from '@/features/tryOn/components/ImagePickerCard';
import { useImagePicker } from '@/features/tryOn/hooks/useImagePicker';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/ui';

export default function PickGarmentScreen() {
  const router = useRouter();
  const { pickFromLibrary, captureFromCamera } = useImagePicker();
  const garment = useTryOnDraftStore((s) => s.garment);
  const setGarment = useTryOnDraftStore((s) => s.setGarment);

  const handleCamera = async () => {
    const img = await captureFromCamera();
    if (img) setGarment(img);
  };

  const handleLibrary = async () => {
    const img = await pickFromLibrary();
    if (img) setGarment(img);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.step}>Step 2 of 2</Text>
        <Text style={styles.title}>Pick the garment</Text>
        <Text style={styles.body}>
          A flat, front-facing photo of the item works best — think product shots.
        </Text>
      </View>

      <View style={styles.content}>
        <ImagePickerCard
          label="Garment"
          hint="Product photo of a shirt, dress, jacket, etc."
          uri={garment?.uri ?? null}
          onPressCamera={handleCamera}
          onPressLibrary={handleLibrary}
          onClear={garment ? () => setGarment(null) : undefined}
        />
      </View>

      <View style={styles.footer}>
        <Button
          label="Try it on"
          disabled={!garment}
          onPress={() => router.push('/(app)/try-on/processing')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, paddingBottom: spacing.md, gap: spacing.xxs },
  step: { ...typography.caption, color: colors.primary },
  title: { ...typography.displaySm, color: colors.text },
  body: { ...typography.body, color: colors.textMuted, marginTop: spacing.xxs },
  content: { flex: 1, justifyContent: 'center' },
  footer: { paddingVertical: spacing.md },
});
