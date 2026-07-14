import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CLOTHING_CATALOG, type ClothingCategory } from '@/features/tryOn/catalog';
import { ClothingItemCard } from '@/features/tryOn/components/ClothingItemCard';
import { ClothingTabBar } from '@/features/tryOn/components/ClothingTabBar';
import { useImagePicker } from '@/features/tryOn/hooks/useImagePicker';
import { useTryOnDraftStore } from '@/features/tryOn/state';
import { colors, overlay, radius, spacing, typography } from '@/theme';
import { BackButton, Button } from '@/ui';

export default function StudioScreen() {
  const router = useRouter();
  const { pickFromLibrary, captureFromCamera } = useImagePicker();
  const person = useTryOnDraftStore((s) => s.person);
  const setPerson = useTryOnDraftStore((s) => s.setPerson);

  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const items = CLOTHING_CATALOG[category];
  const canGenerate = !!person && !!selectedItemId;

  const handleUploadPress = async () => {
    const img = await pickFromLibrary();
    if (img) setPerson(img);
  };

  const handleCameraPress = async () => {
    const img = await captureFromCamera();
    if (img) setPerson(img);
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    // TODO(backend): catalog items reference a pre-uploaded `garmentKey`,
    // not a local file — the existing `tryOnApi.start({ personKey, garmentKey })`
    // contract already supports this shape. Wire this up once the backend
    // seeds real catalog images at those keys: upload `person` the same
    // way `useTryOnJob`'s `upload()` helper does, then call
    // `tryOnApi.start({ personKey, garmentKey: selectedItem.garmentKey })`
    // and route to `/(app)/try-on/processing` with the resulting jobId.
    router.push('/(app)/try-on/processing');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Try-On Studio</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.canvas}>
          {person ? (
            <>
              <Image source={{ uri: person.uri }} style={styles.canvasImage} contentFit="cover" />
              <Pressable style={styles.changePhoto} onPress={handleUploadPress} hitSlop={10}>
                <Ionicons name="repeat" size={16} color={colors.text} />
                <Text style={styles.changePhotoText}>Change</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.placeholder} onPress={handleUploadPress}>
              <View style={styles.placeholderIcon}>
                <Ionicons name="camera-outline" size={28} color={colors.text} />
              </View>
              <Text style={styles.placeholderText}>Upload your photo to start styling.</Text>
              <Pressable onPress={handleCameraPress} hitSlop={10}>
                <Text style={styles.placeholderSecondary}>Or take a new photo</Text>
              </Pressable>
            </Pressable>
          )}
        </View>

        <View style={styles.selector}>
          <ClothingTabBar active={category} onChange={setCategory} />

          <FlatList
            data={items}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.itemsRow}
            renderItem={({ item }) => (
              <ClothingItemCard
                item={item}
                selected={item.id === selectedItemId}
                onPress={() =>
                  setSelectedItemId((cur) => (cur === item.id ? null : item.id))
                }
              />
            )}
          />

          <View style={styles.generateWrap}>
            <Button
              label="✨ Generate AI Try-On"
              variant="cta"
              onPress={handleGenerate}
              disabled={!canGenerate}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: { ...typography.titleSm, color: colors.text },
  headerSpacer: { width: 44 },

  canvas: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  canvasImage: { flex: 1, width: '100%' },
  changePhoto: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.overlay,
    borderRadius: radius.pill,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  changePhotoText: { ...typography.caption, color: colors.text },

  placeholder: {
    flex: 1,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: overlay.whiteStrong,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: overlay.whiteSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  placeholderSecondary: {
    ...typography.caption,
    color: colors.text,
    textDecorationLine: 'underline',
  },

  selector: { paddingTop: spacing.sm, gap: spacing.sm },
  itemsRow: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  generateWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs },
});
