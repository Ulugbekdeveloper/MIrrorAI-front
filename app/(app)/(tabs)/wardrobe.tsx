import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { tryOnApi } from '@/api';
import type { TryOnJob } from '@/api';
import { colors, radius, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/ui';

export default function WardrobeScreen() {
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['tryOn', 'list'],
    queryFn: () => tryOnApi.list(),
  });

  const items = data?.items ?? [];

  return (
    <ScreenContainer edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Wardrobe</Text>
        <Text style={styles.body}>Every look you&apos;ve tried on, in one place.</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.jobId}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={items.length ? styles.list : styles.emptyList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        renderItem={({ item }) => (
          <WardrobeItem
            item={item}
            onPress={() =>
              router.push({ pathname: '/(app)/try-on/result', params: { jobId: item.jobId } })
            }
          />
        )}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Your wardrobe is empty</Text>
              <Text style={styles.emptyBody}>
                Tap the ✦ button below to try on your first look.
              </Text>
              <Button
                label="Start a try-on"
                onPress={() => router.push('/(app)/try-on/studio')}
              />
            </View>
          )
        }
      />
    </ScreenContainer>
  );
}

function WardrobeItem({ item, onPress }: { item: TryOnJob; onPress: () => void }) {
  const uri = item.resultUrl;
  return (
    <Pressable onPress={onPress} style={styles.tile}>
      {uri ? (
        <Image source={{ uri }} style={styles.tileImage} contentFit="cover" />
      ) : (
        <View style={[styles.tileImage, styles.tilePlaceholder]}>
          <Text style={styles.tilePlaceholderText}>
            {item.status === 'failed' ? 'Failed' : 'Processing…'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, paddingBottom: spacing.md, gap: spacing.xxs },
  title: { ...typography.displaySm, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  list: { paddingBottom: spacing.xxl, gap: spacing.sm },
  emptyList: { flex: 1, justifyContent: 'center' },
  row: { gap: spacing.sm },
  tile: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  tileImage: { width: '100%', height: '100%' },
  tilePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  tilePlaceholderText: { ...typography.caption, color: colors.textMuted },
  empty: { alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  emptyTitle: { ...typography.titleLg, color: colors.text },
  emptyBody: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
