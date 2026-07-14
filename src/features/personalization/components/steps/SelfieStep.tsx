import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { LocalImage } from '@/features/tryOn/state';
import { radius, spacing } from '@/theme';
import { Button } from '@/ui';

import { DarkGradientButton } from '../DarkGradientButton';
import { StepHeading } from '../StepHeading';

const SELFIE_PLACEHOLDER = require('@assets/brand/selfie.jpg');

type Props = {
  photo: LocalImage | null;
  onTakeSelfie: () => void;
  onChooseFromLibrary: () => void;
};

export function SelfieStep({ photo, onTakeSelfie, onChooseFromLibrary }: Props) {
  return (
    <>
      <StepHeading
        title="Add a selfie to try on outfits with AI"
        subtitle="We also customize outfit suggestions based on your facial features."
      />
      <View style={styles.preview}>
        <Image
          source={photo ? { uri: photo.uri } : SELFIE_PLACEHOLDER}
          style={styles.previewImage}
          contentFit="cover"
        />
      </View>
      <View style={styles.actions}>
        <Button label="Take a selfie" variant="cta" onPress={onTakeSelfie} />
        <DarkGradientButton label="Choose from library" onPress={onChooseFromLibrary} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  preview: {
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  actions: { gap: spacing.sm },
});
