import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Share, StyleSheet, Text, View } from 'react-native';

import { tryOnApi } from '@/api';
import { ResultDetailModal } from '@/features/tryOn/components/ResultDetailModal';
import { useSaveToLibrary } from '@/features/tryOn/hooks/useSaveToLibrary';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/ui';

export default function ResultScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const resetDraft = useTryOnDraftStore((s) => s.reset);
  const { save, saving } = useSaveToLibrary();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tryOn', jobId],
    queryFn: () => tryOnApi.get(jobId!),
    enabled: !!jobId,
  });

  const handleShare = async () => {
    if (!data?.resultUrl) return;
    await Share.share({ url: data.resultUrl, message: 'My try-on from Mirror AI' });
  };

  const handleRestyle = () => {
    resetDraft();
    router.replace('/(app)/try-on/studio');
  };

  const handleDownload = async () => {
    if (!data?.resultUrl) return;
    const ok = await save(data.resultUrl);
    if (ok) Alert.alert('Saved', 'Added to your photo library.');
  };

  const handleBuyOriginal = () => {
    // TODO(product): catalog items don't carry a real purchase link yet —
    // wire this to the garment's actual product URL once that data exists.
    Alert.alert('Coming soon', "Buying the original item isn't available yet.");
  };

  const handleClose = () => {
    router.replace('/(app)/home');
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !data?.resultUrl) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.title}>Result unavailable</Text>
          <Text style={styles.body}>
            We couldn&apos;t load this try-on. Please try again.
          </Text>
        </View>
        <View style={styles.actions}>
          <Button label="Back to home" onPress={() => router.replace('/(app)/home')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ResultDetailModal
        visible
        imageUri={data.resultUrl}
        onClose={handleClose}
        onShare={handleShare}
        onRestyle={handleRestyle}
        onDownload={handleDownload}
        onBuyOriginal={handleBuyOriginal}
        downloading={saving}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.displaySm, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  actions: { paddingVertical: spacing.md, gap: spacing.sm },
});
