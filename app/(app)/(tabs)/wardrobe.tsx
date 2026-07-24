import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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

      {/* Rendered as two separate components (not one FlatList with
          ListEmptyComponent) because RN's FlatList has a known bug where an
          empty dataset + numColumns fails to render ListEmptyComponent on the
          very first paint — it only shows up after a later re-render (e.g.
          switching tabs and back). Splitting sidesteps that entirely. */}
      {items.length > 0 ? (
        <FlatList
          style={styles.listOuter}
          data={items}
          keyExtractor={(item) => item.jobId}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
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
        />
      ) : isLoading ? (
        // The very first fetch (no cache yet, e.g. right after finishing
        // personalization) can take a moment — show a spinner instead of a
        // blank white screen while it's in flight.
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.black} />
        </View>
      ) : (
        <ScrollView
          style={styles.listOuter}
          contentContainerStyle={styles.emptyList}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
        >
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
        </ScrollView>
      )}
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
  listOuter: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingBottom: spacing.xxl, gap: spacing.sm },
  // flexGrow (not flex) on a ScrollView's contentContainerStyle — this needs
  // to grow to fill the ScrollView's own bounded height so `justifyContent:
  // 'center'` actually centers the empty state instead of collapsing to 0.
  emptyList: { flexGrow: 1, justifyContent: 'center' },
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
