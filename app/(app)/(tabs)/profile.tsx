import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AccountSheet } from '@/features/navigation/AccountSheet';
import { secureStorage } from '@/lib/storage';
import { useAuthStore } from '@/stores/authStore';
import { colors, overlay, radius, spacing, typography } from '@/theme';
import { ScreenContainer } from '@/ui';

const ROWS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'sparkles-outline', label: 'Style preferences' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'shield-checkmark-outline', label: 'Privacy' },
  { icon: 'help-circle-outline', label: 'Help & support' },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);

  const initial = (user?.displayName ?? user?.email ?? 'S').charAt(0).toUpperCase();

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your account and all your data. This can’t be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch {
              Alert.alert(
                'Couldn’t delete account',
                'Something went wrong. Please try again in a moment.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer edges={['top']}>
      <Text style={styles.title}>Profile</Text>

      {/* Identity card */}
      <View style={styles.identityCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.identityText}>
          <Text style={styles.name} numberOfLines={1}>
            {user?.displayName ?? 'Stylo member'}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {user?.email ?? 'Tap to complete your profile'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
      </View>

      {/* Settings */}
      <Text style={styles.sectionLabel}>SETTINGS</Text>
      <View style={styles.rowsCard}>
        {ROWS.map((row) => (
          <Pressable
            key={row.label}
            style={({ pressed }) => [styles.row, styles.rowDivider, pressed && styles.rowPressed]}
          >
            <View style={styles.rowIcon}>
              <Ionicons name={row.icon} size={18} color={colors.text} />
            </View>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </Pressable>
        ))}

        {/* Opens the Account drawer (Logout / Delete account). */}
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => setAccountSheetVisible(true)}
        >
          <View style={styles.rowIcon}>
            <Ionicons name="person-circle-outline" size={18} color={colors.text} />
          </View>
          <Text style={styles.rowLabel}>Account</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
        </Pressable>
      </View>

      {/* DEV ONLY — replay the personalize questions without logging out.
          Flipping the flag triggers (app)/_layout.tsx's own redirect guard. */}
      {__DEV__ ? (
        <Pressable
          style={styles.devReplay}
          onPress={() => {
            void secureStorage.remove('personalizationSeen');
            useAuthStore.setState({ personalizationSeen: false });
          }}
        >
          <Text style={styles.devReplayText}>[dev] Replay personalize questions</Text>
        </Pressable>
      ) : null}

      <AccountSheet
        visible={accountSheetVisible}
        onClose={() => setAccountSheetVisible(false)}
        onLogout={() => void logout()}
        onDeleteAccount={confirmDeleteAccount}
      />
    </ScreenContainer>
  );
}

const AVATAR = 60;

const styles = StyleSheet.create({
  title: { ...typography.displaySm, color: colors.text, paddingTop: spacing.md },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
  },
  identityText: { flex: 1, gap: 2 },
  name: { ...typography.titleSm, color: colors.text, fontWeight: '800' },
  email: { ...typography.caption, color: colors.textMuted },
  sectionLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textDim,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  rowsCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceElevated,
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
  rowLabel: { ...typography.bodyStrong, color: colors.text, flex: 1 },
  devReplay: { alignItems: 'center', paddingVertical: spacing.md, marginTop: 'auto' },
  devReplayText: { ...typography.caption, color: colors.textDim },
});
