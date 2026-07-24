import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { secureStorage } from '@/lib/storage';
import { useAuthStore } from '@/stores/authStore';
import { colors, overlay, radius, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/ui';

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

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{user?.displayName ?? 'Stylo member'}</Text>
        {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
      </View>

      <View style={styles.rows}>
        {ROWS.map((row) => (
          <Pressable key={row.label} style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name={row.icon} size={18} color={colors.text} />
            </View>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Button label="Logout" variant="secondary" onPress={() => void logout()} />
        <Pressable onPress={confirmDeleteAccount} hitSlop={8} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={styles.deleteText}>Delete account</Text>
        </Pressable>

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
      </View>
    </ScreenContainer>
  );
}

const AVATAR = 84;

const styles = StyleSheet.create({
  title: { ...typography.displaySm, color: colors.text, paddingTop: spacing.md },
  identity: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: overlay.whiteSoft,
    marginBottom: spacing.xs,
  },
  avatarText: {
    ...typography.displayLg,
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
  },
  name: { ...typography.titleLg, color: colors.text },
  email: { ...typography.body, color: colors.textMuted },
  rows: { gap: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: overlay.whiteFaint,
    borderWidth: 1,
    borderColor: overlay.whiteSoft,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.whiteSoft,
  },
  rowLabel: { ...typography.bodyStrong, color: colors.text, flex: 1 },
  footer: { flex: 1, justifyContent: 'flex-end', gap: spacing.sm, paddingBottom: spacing.md },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  deleteText: {
    ...typography.bodyStrong,
    color: colors.danger,
  },
  devReplay: { alignItems: 'center', paddingVertical: spacing.xs },
  devReplayText: { ...typography.caption, color: colors.textDim },
});
