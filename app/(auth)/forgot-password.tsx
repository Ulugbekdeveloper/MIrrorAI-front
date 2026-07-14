import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
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

import { ApiError, authApi } from '@/api';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/features/auth/schemas';
import { colors, overlay, spacing, typography } from '@/theme';
import { BackButton, Button, ScreenContainer, TextField } from '@/ui';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await authApi.forgotPassword({ email: values.email });
      // Shown regardless of whether the email is registered — never reveal
      // account existence through this flow.
      setSentTo(values.email);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
      );
    }
  });

  return (
    <ScreenContainer gradient>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <View style={styles.headerRow}>
              <BackButton onPress={() => router.back()} />
            </View>

            {sentTo ? (
              <View style={styles.header}>
                <View style={styles.successIcon}>
                  <Ionicons name="mail-open-outline" size={28} color={colors.text} />
                </View>
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.subtitle}>
                  If an account exists for {sentTo}, we&apos;ve sent a link to reset
                  your password.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>Forgot password?</Text>
                  <Text style={styles.subtitle}>
                    Enter your email and we&apos;ll send you a link to reset it.
                  </Text>
                </View>

                <View style={styles.form}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <TextField
                        placeholder="Enter your email"
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        leftIcon={
                          <Ionicons
                            name="mail-outline"
                            size={20}
                            color={colors.textMuted}
                          />
                        }
                      />
                    )}
                  />

                  {submitError ? (
                    <Text style={styles.errorBanner}>{submitError}</Text>
                  ) : null}

                  <Button
                    label="Send"
                    variant="cta"
                    onPress={onSubmit}
                    loading={formState.isSubmitting}
                  />
                </View>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remembered your password? </Text>
            <Text style={styles.link} onPress={() => router.replace('/(auth)/login')}>
              Log in
            </Text>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  top: { gap: spacing.lg },
  headerRow: { flexDirection: 'row' },
  header: { gap: spacing.xs },
  title: { ...typography.displayLg, color: colors.text, letterSpacing: -0.5 },
  subtitle: { ...typography.body, color: colors.textMuted },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: overlay.whiteSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  form: { gap: spacing.md },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  footerText: { ...typography.body, color: colors.textMuted },
  link: { ...typography.bodyStrong, color: colors.text },
});
