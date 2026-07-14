import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, overlay, radius, spacing, typography } from '@/theme';
import { Button } from '@/ui';

import { MINIMUM_AGE_YEARS } from '../../constants';
import { useBirthdayPicker } from '../../hooks/useBirthdayPicker';
import { formatBirthday, meetsMinimumAge } from '../../lib/birthday';
import { StepHeading } from '../StepHeading';

type Props = {
  birthday: Date;
  hasPickedBirthday: boolean;
  onPickBirthday: (date: Date) => void;
};

export function BirthdayStep({ birthday, hasPickedBirthday, onPickBirthday }: Props) {
  const picker = useBirthdayPicker(birthday, onPickBirthday);
  const showMinimumAgeError = hasPickedBirthday && !meetsMinimumAge(birthday);

  return (
    <View style={styles.content}>
      <StepHeading
        title="Add your date of birth"
        subtitle={`This won't be part of your profile, but we need to ensure you are at least ${MINIMUM_AGE_YEARS} years old.`}
      />

      <Pressable style={styles.dateField} onPress={picker.openPicker}>
        <Text style={styles.dateFieldText}>{formatBirthday(birthday)}</Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </Pressable>

      {showMinimumAgeError ? (
        <Text style={styles.error}>
          You must be at least {MINIMUM_AGE_YEARS} years old to use Stylo.
        </Text>
      ) : null}

      {Platform.OS === 'ios' && picker.isIOSPickerVisible ? (
        <View style={styles.iosPickerWrap}>
          <DateTimePicker
            value={birthday}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={picker.handleChange}
            textColor={colors.text}
          />
          <Button label="Done" variant="secondary" onPress={picker.closeIOSPicker} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: overlay.whiteSoft,
    backgroundColor: overlay.whiteFaint,
  },
  dateFieldText: { ...typography.bodyStrong, color: colors.text },
  error: { ...typography.caption, color: colors.danger },
  iosPickerWrap: {
    gap: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: overlay.whiteFaint,
    padding: spacing.sm,
  },
});
