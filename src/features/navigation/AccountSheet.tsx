import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, overlay, radius, spacing, typography } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

const SHEET_OFFSCREEN = Dimensions.get('window').height;

/** Bottom-sheet drawer for the Profile screen's "Account" row — Logout and
 * Delete account. Follows the same slide-up Modal pattern as ResultDetailModal. */
export function AccountSheet({ visible, onClose, onLogout, onDeleteAccount }: Props) {
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
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={styles.dim} />
      </Pressable>

      <View style={styles.sheetOuter} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
            <View style={styles.handle} />
            <Text style={styles.title}>Account</Text>

            <View style={styles.rows}>
              <Pressable
                style={({ pressed }) => [styles.row, styles.rowDivider, pressed && styles.rowPressed]}
                onPress={() => dismissThen(onLogout)}
              >
                <View style={styles.rowIcon}>
                  <Ionicons name="log-out-outline" size={18} color={colors.text} />
                </View>
                <Text style={styles.rowLabel}>Logout</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => dismissThen(onDeleteAccount)}
              >
                <View style={[styles.rowIcon, styles.rowIconDanger]}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </View>
                <Text style={[styles.rowLabel, styles.rowLabelDanger]}>Delete account</Text>
              </Pressable>
            </View>
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
  sheetOuter: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
  },
  sheetInner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: overlay.whiteStrong,
  },
  title: {
    ...typography.titleSm,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  rows: {
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: { backgroundColor: overlay.whiteFaint },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSoft,
  },
  rowIconDanger: { backgroundColor: overlay.dangerTint },
  rowLabel: { ...typography.bodyStrong, color: colors.text, flex: 1 },
  rowLabelDanger: { color: colors.danger },
});
