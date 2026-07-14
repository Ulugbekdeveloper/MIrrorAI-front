import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTryOnDraftStore } from '@/features/tryOn/state';
import { secureStorage } from '@/lib/storage';
import { useAuthStore } from '@/stores/authStore';
import { colors, spacing, typography } from '@/theme';
import { Button, Card, ScreenContainer } from '@/ui';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const resetDraft = useTryOnDraftStore((s) => s.reset);

  const startFlow = () => {
    resetDraft();
    router.push('/(app)/try-on/studio');
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Hi{user?.displayName ? `, ${user.displayName}` : ''}</Text>
          <Text style={styles.title}>Ready to try something on?</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Card style={styles.hero}>
          <Text style={styles.heroTitle}>Virtual try-on</Text>
          <Text style={styles.heroBody}>
            Pick a photo of yourself and a photo of any garment. Our AI blends them
            into a realistic preview in seconds.
          </Text>
          <Button label="Start try-on" onPress={startFlow} />
        </Card>

        <Button
          label="See history"
          variant="secondary"
          onPress={() => router.push('/(app)/history')}
        />
      </View>

      <View style={styles.footer}>
        <Button label="Sign out" variant="ghost" onPress={() => void logout()} />
      </View>

      {/* DEV ONLY — replay the personalize questions without logging out.
          Delete this block once personalization is finalized. */}
      {__DEV__ ? (
        <Pressable
          style={styles.devReplay}
          onPress={async () => {
            await secureStorage.remove('personalizationSeen');
            useAuthStore.setState({ personalizationSeen: false });
            router.push('/(app)/personalize');
          }}
        >
          <Text style={styles.devReplayText}>[dev] Replay personalize questions</Text>
        </Pressable>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.xs },
  hello: { ...typography.body, color: colors.textMuted },
  title: { ...typography.displaySm, color: colors.text },
  body: { flex: 1, gap: spacing.md },
  hero: { gap: spacing.sm },
  heroTitle: { ...typography.titleLg, color: colors.text },
  heroBody: { ...typography.body, color: colors.textMuted },
  footer: { paddingVertical: spacing.md },
  devReplay: { alignItems: 'center', paddingBottom: spacing.md },
  devReplayText: { ...typography.caption, color: colors.textDim },
});
