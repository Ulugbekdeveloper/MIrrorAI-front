import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ApiError } from '@/api';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas';
import { useAuthStore } from '@/stores/authStore';
import { colors, spacing, typography } from '@/theme';
import { BackButton, Button, ScreenContainer, TextField } from '@/ui';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { control, handleSubmit, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await register(values.email, values.password, values.displayName);
      router.replace('/(app)/home');
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

            <View style={styles.header}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>
                Join thousands discovering the best spots near you
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="displayName"
                render={({ field, fieldState }) => (
                  <TextField
                    placeholder="Jarik Mutig"
                    autoCapitalize="words"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    leftIcon={
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.textMuted}
                      />
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextField
                    placeholder="jarik@gmail.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    leftIcon={
                      <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <TextField
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    leftIcon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.textMuted}
                      />
                    }
                    rightAdornment={
                      <Pressable
                        onPress={() => setPasswordVisible((v) => !v)}
                        hitSlop={12}
                      >
                        <Ionicons
                          name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color={colors.textMuted}
                        />
                      </Pressable>
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <TextField
                    placeholder="Confirm password"
                    secureTextEntry={!confirmVisible}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    leftIcon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.textMuted}
                      />
                    }
                    rightAdornment={
                      <Pressable
                        onPress={() => setConfirmVisible((v) => !v)}
                        hitSlop={12}
                      >
                        <Ionicons
                          name={confirmVisible ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color={colors.textMuted}
                        />
                      </Pressable>
                    }
                  />
                )}
              />

              {submitError ? (
                <Text style={styles.errorBanner}>{submitError}</Text>
              ) : null}

              <Button
                label="Sign Up"
                variant="cta"
                onPress={onSubmit}
                loading={formState.isSubmitting}
              />
            </View>

            <View style={styles.social}>
              <Text style={styles.orText}>or continue with</Text>
              <SocialAuthButtons onError={setSubmitError} />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.link}>
              Log in
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  top: { gap: spacing.lg },
  headerRow: { flexDirection: 'row' },
  header: { gap: spacing.xs },
  title: { ...typography.displayLg, color: colors.text, letterSpacing: -0.5 },
  subtitle: { ...typography.body, color: colors.textMuted },
  form: { gap: spacing.md },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  social: { gap: spacing.md, alignItems: 'stretch' },
  orText: {
    ...typography.caption,
    color: colors.textMuted,
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
