import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ApiError } from '@/api';
import { Divider } from '@/features/auth/components/Divider';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas';
import { useAuthStore } from '@/stores/authStore';
import { colors, spacing, typography } from '@/theme';
import { Button, ScreenContainer, TextField } from '@/ui';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', displayName: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await register(values.email, values.password, values.displayName || undefined);
      router.replace('/(app)/home');
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
      );
    }
  });

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Save your try-ons and pick up on any device.
            </Text>
          </View>

          <View style={styles.body}>
            <SocialAuthButtons onError={setSubmitError} />

            <Divider label="or sign up with email" />

            <Controller
              control={control}
              name="displayName"
              render={({ field, fieldState }) => (
                <TextField
                  label="Name (optional)"
                  autoCapitalize="words"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <TextField
                  label="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <TextField
                  label="Password"
                  secureTextEntry
                  autoComplete="password-new"
                  textContentType="newPassword"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  helper="At least 8 characters."
                />
              )}
            />

            {submitError ? (
              <Text style={styles.errorBanner}>{submitError}</Text>
            ) : null}

            <Button
              label="Create account"
              onPress={onSubmit}
              loading={formState.isSubmitting}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.link}>
              Sign in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
    gap: spacing.xl,
  },
  header: { gap: spacing.xs },
  title: { ...typography.displaySm, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  body: { gap: spacing.md },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { ...typography.body, color: colors.textMuted },
  link: { ...typography.bodyStrong, color: colors.primary },
});
