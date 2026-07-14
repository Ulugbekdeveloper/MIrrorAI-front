import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, overlay, radius, spacing } from '@/theme';
import { Button } from '@/ui';

import { CircleIconButton } from './CircleIconButton';

type Props = {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onShare: () => void;
  onRestyle: () => void;
  onDownload: () => void;
  onBuyOriginal: () => void;
  downloading?: boolean;
};

const SHEET_OFFSCREEN = Dimensions.get('window').height;

export function ResultDetailModal({
  visible,
  imageUri,
  onClose,
  onShare,
  onRestyle,
  onDownload,
  onBuyOriginal,
  downloading,
}: Props) {
  const translateY = useRef(new Animated.Value(SHEET_OFFSCREEN)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 60,
      }).start();
    }
  }, [visible, translateY]);

  const dismissThen = (next: () => void) => {
    Animated.timing(translateY, {
      toValue: SHEET_OFFSCREEN,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) next();
    });
  };

  const handleRequestClose = () => dismissThen(onClose);
  const handleRestylePress = () => dismissThen(onRestyle);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      {/* Darkened, blurred backdrop — tap anywhere on it to dismiss. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleRequestClose}>
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={styles.dim} />
      </Pressable>

      {/* box-none so empty space above the sheet still reaches the
          backdrop Pressable behind it. */}
      <View style={styles.sheetOuter} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
            <View style={styles.handle} />

            <Pressable style={styles.closeButton} onPress={handleRequestClose} hitSlop={12}>
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>

            <View style={styles.imageCard}>
              <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
            </View>

            <View style={styles.actionRow}>
              <CircleIconButton icon="share-outline" label="Share" onPress={onShare} />
              <CircleIconButton
                icon="sparkles-outline"
                label="Re-style"
                onPress={handleRestylePress}
              />
              <CircleIconButton
                icon="arrow-down-outline"
                label="Download"
                onPress={onDownload}
                loading={downloading}
              />
            </View>

            <Button
              label="🛍️ Buy Original Item"
              variant="cta"
              onPress={onBuyOriginal}
            />
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: overlay.blackFaint,
  },
  sheetOuter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: colors.surfaceSunken,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: overlay.whiteSoft,
  },
  sheetInner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: overlay.whiteStrong,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: overlay.whiteSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCard: {
    aspectRatio: 3 / 4,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: { flex: 1, width: '100%' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
