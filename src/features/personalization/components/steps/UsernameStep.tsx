import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { TextField } from '@/ui';

import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../../constants';
import { isValidUsername } from '../../lib/username';
import { StepHeading } from '../StepHeading';

type Props = {
  username: string;
  onChangeUsername: (value: string) => void;
};

export function UsernameStep({ username, onChangeUsername }: Props) {
  return (
    <View style={styles.content}>
      <StepHeading title="Create username" subtitle="You can change this at any time." />

      <TextField
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={USERNAME_MAX_LENGTH}
        value={username}
        onChangeText={onChangeUsername}
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.textMuted} />}
      />

      <Text style={styles.counter}>
        {username.length}/{USERNAME_MAX_LENGTH}
      </Text>

      {isValidUsername(username) ? (
        <View style={styles.validRow}>
          <Ionicons name="checkmark" size={16} color={colors.success} />
          <Text style={styles.validText}>Username is available</Text>
        </View>
      ) : username.length > 0 ? (
        <Text style={styles.error}>
          At least {USERNAME_MIN_LENGTH} characters — letters, numbers, and underscores only.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  counter: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: -spacing.xs,
  },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  validText: { ...typography.caption, color: colors.success },
  error: { ...typography.caption, color: colors.danger },
});
