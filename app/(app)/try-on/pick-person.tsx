import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ImagePickerCard } from '@/features/tryOn/components/ImagePickerCard';
import { useImagePicker } from '@/features/tryOn/hooks/useImagePicker';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/ui';

export default function PickPersonScreen() {
  const router = useRouter();
  const { pickFromLibrary, captureFromCamera } = useImagePicker();
  const person = useTryOnDraftStore((s) => s.person);
  const setPerson = useTryOnDraftStore((s) => s.setPerson);

  const handleCamera = async () => {
    const img = await captureFromCamera();
    if (img) setPerson(img);
  };

  const handleLibrary = async () => {
    const img = await pickFromLibrary();
    if (img) setPerson(img);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 2</Text>
        <Text style={styles.title}>Pick your photo</Text>
        <Text style={styles.body}>
          Use a full-body photo against a plain background for the best result.
        </Text>
      </View>

      <View style={styles.content}>
        <ImagePickerCard
          label="Your photo"
          hint="Full-body photo, plain background"
          uri={person?.uri ?? null}
          onPressCamera={handleCamera}
          onPressLibrary={handleLibrary}
          onClear={person ? () => setPerson(null) : undefined}
        />
      </View>

      <View style={styles.footer}>
        <Button
          label="Continue"
          disabled={!person}
          onPress={() => router.push('/(app)/try-on/pick-garment')}
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
