import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, silver, spacing, typography } from '@/theme';

import { TrialLegalRow } from '../TrialLegalRow';

const MEDALLION = 150;
const BELL = 68;
const BADGE = 36;

export function TrialReminderStep() {
  const ring = useRef(new Animated.Value(0)).current; // bell swing
  const badge = useRef(new Animated.Value(0)).current; // "1" pop
  const notif = useRef(new Animated.Value(0)).current; // notification slide-in

  useEffect(() => {
    // Badge pops and the notification drops in once, on mount.
    Animated.spring(badge, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
    Animated.timing(notif, {
      toValue: 1,
      duration: 450,
      delay: 750,
      useNativeDriver: true,
    }).start();

    // The bell rings (a decaying swing ≈ 850ms) then rests, repeating on a
    // 5-second cycle.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 110, useNativeDriver: true }),
        Animated.timing(ring, { toValue: -0.8, duration: 180, useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0.6, duration: 160, useNativeDriver: true }),
        Animated.timing(ring, { toValue: -0.4, duration: 150, useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0.2, duration: 130, useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.delay(4150), // 850ms ring + 4150ms rest = 5s cycle
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [ring, badge, notif]);

  const rotate = ring.interpolate({ inputRange: [-1, 1], outputRange: ['-11deg', '11deg'] });
  const notifTranslate = notif.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  return (
    <View style={styles.content}>
      <Text style={styles.title}>We&apos;ll remind you before it ends</Text>
      <Text style={styles.subtitle}>
        A heads-up lands 2 days early — so you&apos;re always in control, never surprised.
      </Text>

      {/* Bell medallion — rings every 5 seconds */}
      <View style={styles.bellArea}>
        <View style={styles.halo} />
        <Animated.View style={[styles.medallionWrap, { transform: [{ rotate }] }]}>
          <LinearGradient
            colors={[silver[600], silver[800], silver[900]]}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.medallion}
          >
            <View pointerEvents="none" style={styles.medallionSheen} />
            <Ionicons name="notifications" size={BELL} color={silver[100]} />
          </LinearGradient>

          <Animated.View style={[styles.badge, { transform: [{ scale: badge }] }]}>
            <Text style={styles.badgeText}>1</Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* A preview of the reminder they'll actually receive — a real iOS-style
          frosted notification banner. */}
      <Animated.View
        style={[styles.notifShadow, { opacity: notif, transform: [{ translateY: notifTranslate }] }]}
      >
        <BlurView intensity={65} tint="systemThickMaterialLight" style={styles.notif}>
          <View style={styles.notifIcon}>
            <Ionicons name="notifications" size={22} color={colors.white} />
          </View>
          <View style={styles.notifBody}>
            <View style={styles.notifHead}>
              <Text style={styles.notifApp}>Stylo</Text>
              <Text style={styles.notifTime}>now</Text>
            </View>
            <Text style={styles.notifTitle}>Your free trial ends in 2 days</Text>
            <Text style={styles.notifText}>Cancel anytime before then — no charge.</Text>
          </View>
        </BlurView>
      </Animated.View>

      <View style={styles.trustRow}>
        <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        <Text style={styles.trustText}>No payment due now</Text>
      </View>
    </View>
  );
}

/** Renders below the shared footer's Next button — see personalize.tsx's renderFooter. */
export function TrialReminderFooterExtras() {
  return (
    <View style={styles.footerExtras}>
      <Text style={styles.footerNote}>
        After the free trial, you can choose a monthly or yearly plan.
      </Text>
      <TrialLegalRow />
    </View>
  );
}

const HALO = MEDALLION + 28;

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.sm },
  title: {
    ...typography.displaySm,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  bellArea: {
    width: HALO,
    height: HALO,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  halo: {
    position: 'absolute',
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    borderWidth: 1,
    borderColor: overlay.whiteSubtle,
  },
  medallionWrap: { alignItems: 'center', justifyContent: 'center' },
  medallion: {
    width: MEDALLION,
    height: MEDALLION,
    borderRadius: MEDALLION / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: overlay.whiteSoft,
    overflow: 'hidden',
  },
  medallionSheen: {
    position: 'absolute',
    top: 0,
    left: '18%',
    right: '18%',
    height: 1,
    backgroundColor: overlay.whiteMedium,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    paddingHorizontal: 6,
    backgroundColor: colors.danger,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  // Shadow lives on the wrapper — the BlurView clips to its rounded corners
  // (overflow: hidden), which would otherwise cut the shadow off.
  notifShadow: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
  },
  notif: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: overlay.whiteMedium,
    overflow: 'hidden',
    // Faint lift so the card reads as distinct even where the native blur is
    // weak (e.g. some Android devices).
    backgroundColor: overlay.whiteSoft,
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 12, // iOS app-icon squircle
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  notifBody: { flex: 1, gap: 2 },
  notifHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifApp: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: colors.text,
  },
  notifTime: { ...typography.caption, fontSize: 11, color: colors.textDim },
  notifTitle: {
    ...typography.bodyStrong,
    fontSize: 15,
    color: colors.text,
  },
  notifText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textMuted,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  trustText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  footerExtras: { alignItems: 'center', gap: spacing.xs },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
