import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Share, StyleSheet, Text, View } from 'react-native';

import { tryOnApi } from '@/api';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, radius, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/ui';

export default function ResultScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const resetDraft = useTryOnDraftStore((s) => s.reset);

  const { data, isLoading, error } = useQuery({
    queryKey: ['tryOn', jobId],
    queryFn: () => tryOnApi.get(jobId!),
    enabled: !!jobId,
  });

  const share = async () => {
    if (!data?.resultUrl) return;
    await Share.share({ url: data.resultUrl, message: 'My try-on from Mirror AI' });
  };

  const startAgain = () => {
    resetDraft();
    router.replace('/(app)/try-on/pick-person');
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
      <View style={styles.header}>
        <Text style={styles.title}>Your try-on</Text>
        <Text style={styles.body}>Looks good? Save it or try another garment.</Text>
      </View>

      <View style={styles.imageWrap}>
        <Image
          source={{ uri: data.resultUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      <View style={styles.actions}>
        <Button label="Share" onPress={share} />
        <Button label="Try another" variant="secondary" onPress={startAgain} />
        <Button
          label="Back to home"
          variant="ghost"
          onPress={() => router.replace('/(app)/home')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: spacing.md, paddingBottom: spacing.md, gap: spacing.xxs },
  title: { ...typography.displaySm, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  imageWrap: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  image: { width: '100%', height: '100%' },
  actions: { paddingVertical: spacing.md, gap: spacing.sm },
});
