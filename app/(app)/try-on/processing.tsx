import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { JobPhase } from '@/features/tryOn/hooks/useTryOnJob';
import { useTryOnJob } from '@/features/tryOn/hooks/useTryOnJob';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/ui';

const PHASE_LABEL: Record<JobPhase, string> = {
  idle: 'Preparing…',
  'uploading-person': 'Uploading your photo…',
  'uploading-garment': 'Uploading the garment…',
  starting: 'Starting the model…',
  polling: 'Generating your try-on…',
  succeeded: 'Done!',
  failed: 'Something went wrong.',
};

export default function ProcessingScreen() {
  const router = useRouter();
  const person = useTryOnDraftStore((s) => s.person);
  const garment = useTryOnDraftStore((s) => s.garment);
  const { phase, job, error, run, cancel } = useTryOnJob();

  useEffect(() => {
    if (!person || !garment) {
      router.replace('/(app)/try-on/pick-person');
      return;
    }
    void run(person, garment);
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === 'succeeded' && job?.jobId) {
      router.replace({
        pathname: '/(app)/try-on/result',
        params: { jobId: job.jobId },
      });
    }
  }, [phase, job, router]);

  const progress = useMemo(() => {
    switch (phase) {
      case 'uploading-person':
        return 0.15;
      case 'uploading-garment':
        return 0.35;
      case 'starting':
        return 0.5;
      case 'polling':
        return 0.75;
      case 'succeeded':
        return 1;
      default:
        return 0;
    }
  }, [phase]);

  if (phase === 'failed') {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.title}>Try-on failed</Text>
          <Text style={styles.body}>{error ?? 'Try different photos.'}</Text>
        </View>
        <View style={styles.actions}>
          <Button label="Try again" onPress={() => router.back()} />
          <Button
            label="Back to home"
            variant="ghost"
            onPress={() => router.replace('/(app)/home')}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.title}>{PHASE_LABEL[phase]}</Text>
        <Text style={styles.body}>This usually takes 20–60 seconds.</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Cancel"
          variant="ghost"
          onPress={() => {
            cancel();
            router.back();
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  title: { ...typography.titleLg, color: colors.text, textAlign: 'center' },
  body: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  progressTrack: {
    marginTop: spacing.md,
    height: 6,
    width: '80%',
    borderRadius: 3,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  actions: { paddingVertical: spacing.md, gap: spacing.sm },
});
