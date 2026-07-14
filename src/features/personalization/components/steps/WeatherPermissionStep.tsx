import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, silver, spacing, typography } from '@/theme';

import { StepHeading } from '../StepHeading';

const MAP_PREVIEW = require('@assets/brand/map.webp');

type Props = {
  onRequestAccess: () => void;
};

export function WeatherPermissionStep({ onRequestAccess }: Props) {
  return (
    <View style={styles.content}>
      <StepHeading title="Dress according to the weather near you" />

      <View style={styles.permissionCard}>
        <Text style={styles.permissionTitle}>
          Allow &ldquo;Stylo&rdquo; to use your location?
        </Text>

        <View style={styles.mapWrap}>
          <Image source={MAP_PREVIEW} style={styles.map} contentFit="cover" />
        </View>

        <Pressable style={styles.permissionOption} onPress={onRequestAccess}>
          <Text style={styles.permissionOptionText}>Allow While Using App</Text>
        </Pressable>
        <Pressable style={styles.permissionOption} onPress={onRequestAccess}>
          <Text style={styles.permissionOptionText}>Allow Once</Text>
        </Pressable>
        <Pressable style={styles.permissionOption}>
          <Text style={styles.permissionOptionText}>Don&apos;t Allow</Text>
        </Pressable>
      </View>

      <Text style={styles.caption}>
        Tap &apos;Allow While Using App&apos; to get updated weather info when travelling.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  permissionCard: {
    marginTop: spacing.xxl,
    backgroundColor: silver[100],
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  permissionTitle: {
    ...typography.bodyStrong,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  mapWrap: {
    aspectRatio: 1.4,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  map: { width: '100%', height: '100%' },
  permissionOption: {
    backgroundColor: silver[200],
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  permissionOptionText: {
    ...typography.bodyStrong,
    color: colors.textOnLight,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
